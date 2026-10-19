/**
 * Allowlist HTML sanitizer for rendered markdown (no runtime dependency). Parses into an inert
 * <template> (no scripts run, no resources load), keeps known-safe tags and attributes, unwraps
 * unknown tags (their text stays) and drops dangerous ones with their content.
 */

import { declarations, tokenize, type Tok } from './css-tokens';

const ALLOWED_TAGS = new Set([
  'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'center', 'code', 'col', 'colgroup', 'dd', 'del', 'details',
  'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'input',
  'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub',
  'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul', 'var',
  // HA elements its own markdown card allows
  'ha-icon', 'ha-alert', 'ha-svg-icon', 'font',
]);

/** Removed together with their content. */
const DROPPED_TAGS = new Set([
  'script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'noscript', 'noembed', 'noframes',
  'template', 'svg', 'math', 'link', 'meta', 'base', 'form', 'textarea', 'select', 'option', 'button', 'title',
  'head', 'xmp', 'plaintext', 'audio', 'video', 'source', 'track', 'canvas', 'portal', 'dialog', 'slot',
]);

const GLOBAL_ATTRS = new Set(['title', 'class', 'dir', 'lang', 'align', 'style']);
const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  col: new Set(['span']),
  colgroup: new Set(['span']),
  ol: new Set(['start', 'type', 'reversed']),
  li: new Set(['value']),
  details: new Set(['open']),
  input: new Set(['type', 'checked', 'disabled']),
  'ha-icon': new Set(['icon']),
  'ha-alert': new Set(['alert-type', 'title']),
  'ha-svg-icon': new Set(['path']),
  font: new Set(['color', 'size', 'face']),
};
const URL_ATTRS = new Set(['href', 'src']);
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
const SAFE_DATA_IMAGE = /^data:image\/(png|gif|jpe?g|webp|avif|bmp);/i;
/**
 * Style properties an entity state or template may set: text, colour, box and border. Nothing that
 * takes an element out of its flow (position, inset, top / left, z-index, transform, float), so
 * markdown cannot lay a transparent overlay over the dashboard.
 */
const SAFE_STYLE_PROPS = new RegExp(
  '^(' +
    [
      'color', 'background', 'background-color', 'opacity', 'display', 'vertical-align', 'white-space', 'word-break',
      'overflow-wrap', 'line-height', 'letter-spacing', 'word-spacing', 'list-style-type', 'gap', 'border-collapse',
      'border-spacing', 'font', 'font-(family|size|style|weight|variant)',
      'text-(align|decoration|decoration-[a-z]+|transform|indent|shadow)',
      '(margin|padding)(-(top|right|bottom|left))?', '(min-|max-)?(width|height)',
      'border(-(top|right|bottom|left))?(-(width|style|color))?', 'border(-(top|bottom)-(left|right))?-radius',
    ].join('|') +
    ')$',
);
/** Longest style attribute looked at (proj.M3): a longer one is dropped before it is tokenized. */
const MAX_STYLE = 4096;
const SAFE_DISPLAY = /^(none|inline|block|inline-block)$/i;
const MIN_OPACITY = 0.3;
/** No viewport or container units: they size a box to the whole dashboard. */
const SAFE_UNITS = /^(px|em|rem|ex|ch|pt|pc|cm|mm|in|q|lh|rlh|cap|ic|deg|grad|rad|turn)$/;
/** Anything else (url, image, image-set, cross-fade, element, paint, src, expression, env, attr, unknown) is dropped. */
const SAFE_FUNCTIONS =
  /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark|var|calc|min|max|clamp|(-webkit-)?(repeating-)?(linear|radial|conic)-gradient)$/;
const STRING_PROPS = /^(font|font-family|list-style-type)$/;
const SAFE_HASH = /^#[\da-f]{3,8}$/i;

/** Whether one value token may be re-emitted. prev is the token before it, without whitespace. */
function safeToken(tok: Tok, prop: string, prev?: Tok): boolean {
  switch (tok.t) {
    case 'num': case 'pct': case 'comma':
      return true;
    case 'id':
      return !tok.s.startsWith('--') || (prev?.t === 'fn' && prev.v === 'var');
    case 'dim':
      return SAFE_UNITS.test(tok.v!);
    case 'sym':
      return SAFE_HASH.test(tok.s);
    case 'delim':
      return '/+-*'.includes(tok.s);
    case 'fn':
      return SAFE_FUNCTIONS.test(tok.v!);
    case 'open':
      return tok.s === '(';
    case 'close':
      return tok.s === ')';
    case 'str':
      return STRING_PROPS.test(prop) && !/[<>]/.test(tok.s);
    default:
      return false; // at-keyword, colon, CDO, CDC, comment
  }
}

const MARGIN_KEYWORD = /^(auto|inherit|initial|unset|revert|revert-layer)$/i;
const MARGIN_MATH = /^(calc|min|max|clamp)$/;
/**
 * Margin allow-list: unsigned numbers, lengths and percentages, keywords, and calc/min/max/clamp
 * made only of unsigned operands with + * / operators. Inside math there is no `-`, ident (infinity, -infinity, nan)
 * or var() (a custom property can hold a negative value), so the result cannot be negative.
 */
function safeMargin(value: Tok[]): boolean {
  let math = 0;
  for (const t of value) {
    if (t.t === 'num' || t.t === 'dim' || t.t === 'pct') {
      if (t.s[0] === '-') return false;
    } else if (math && (t.t === 'comma' || (t.t === 'delim' && '+*/'.includes(t.s)) || t.t === 'open')) {
      if (t.t === 'open') math++;
    } else if (math && t.t === 'close') math--;
    else if (t.t === 'fn' && MARGIN_MATH.test(t.v!)) math++;
    else if (math) return false;
    else if (t.t === 'id' && MARGIN_KEYWORD.test(t.s)) continue;
    else return false;
  }
  return !math;
}

/** The declaration rebuilt as `prop: value` from its own tokens, or '' when any part is not allowed. */
function safeDeclaration(toks: Tok[]): string {
  const sig = toks.filter((t) => t.t !== 'ws');
  const [name, colon] = sig;
  if (name?.t !== 'id' || name.s.startsWith('--') || colon?.t !== 'colon') return '';
  const prop = name.s.toLowerCase();
  if (!SAFE_STYLE_PROPS.test(prop)) return '';
  let body = toks.slice(toks.indexOf(colon) + 1);
  let important = '';
  const last = sig[sig.length - 1];
  const before = sig[sig.length - 2];
  if (last.t === 'id' && last.s.toLowerCase() === 'important' && before.t === 'delim' && before.s === '!') {
    body = body.slice(0, body.lastIndexOf(before));
    important = ' !important';
  }
  const value = body.filter((t) => t.t !== 'ws');
  if (!value.length) return '';
  for (let i = 0; i < value.length; i++) if (!safeToken(value[i], prop, value[i - 1])) return '';
  // Rules on top of the token list: no negative margins, a visible opacity, a few display values.
  if (prop.startsWith('margin') && !safeMargin(value)) return '';
  if (prop === 'display' && !(value.length === 1 && SAFE_DISPLAY.test(value[0].s))) return '';
  if (prop === 'opacity') {
    const one = value.length === 1 && (value[0].t === 'num' || value[0].t === 'pct') ? value[0] : null;
    if (!one || !(parseFloat(one.s) / (one.t === 'pct' ? 100 : 1) >= MIN_OPACITY)) return '';
  }
  return `${prop}: ${body.map((t) => (t.t === 'ws' ? ' ' : t.s)).join('').trim()}${important}`;
}

/**
 * The allowed declarations of a style attribute ('' when none is left). Allow-list, not block-list: the
 * input is tokenized like a browser does (strings, escapes, comments, brackets), and the output is rebuilt
 * from the allowed tokens only, so what the browser parses later is exactly what was checked here.
 * Threats: url() and image functions that load a resource (also hidden by escapes or comments), an unclosed
 * string or paren that swallows the next declaration, overlays through viewport units and negative margins.
 */
export function sanitizeStyle(style: string): string {
  if (style.length > MAX_STYLE) return '';
  const kept: string[] = [];
  for (const decl of declarations(tokenize(style))) {
    const out = decl.bad ? '' : safeDeclaration(decl.toks);
    if (out) kept.push(out);
  }
  return kept.join('; ');
}

/** Class names would reach the card's own styles (mc-*): only marked's code block languages are kept. */
const SAFE_CLASS = /^language-[\w-]+$/;

function safeUrl(value: string, attr: string): boolean {
  // Browsers ignore control characters and whitespace inside the scheme ("java\tscript:").
  const compact = [...value]
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 0x20 && (code < 0x7f || code > 0x9f);
    })
    .join('');
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(compact);
  if (!scheme) return true; // relative URL or fragment
  if (SAFE_SCHEMES.has(scheme[1].toLowerCase())) return true;
  return attr === 'src' && SAFE_DATA_IMAGE.test(compact);
}

function cleanElement(el: Element): void {
  const tag = el.localName;
  const allowed = TAG_ATTRS[tag];
  for (const attr of [...el.attributes]) {
    const name = attr.name.toLowerCase();
    const keep =
      (GLOBAL_ATTRS.has(name) || !!allowed?.has(name)) &&
      !(URL_ATTRS.has(name) && !safeUrl(attr.value, name));
    if (!keep) {
      el.removeAttribute(attr.name);
    } else if (name === 'style') {
      const style = sanitizeStyle(attr.value);
      if (style) el.setAttribute('style', style);
      else el.removeAttribute(attr.name);
    } else if (name === 'class') {
      const classes = attr.value.split(/\s+/).filter((c) => SAFE_CLASS.test(c));
      if (classes.length) el.setAttribute('class', classes.join(' '));
      else el.removeAttribute(attr.name);
    }
  }
  if (tag === 'input' && (el.getAttribute('type') || '').toLowerCase() !== 'checkbox') {
    el.remove();
    return;
  }
  if (tag === 'input') el.setAttribute('disabled', '');
  if (tag === 'a' && el.hasAttribute('target')) el.setAttribute('rel', 'noopener noreferrer');
}

function cleanChildren(parent: Node): void {
  for (const node of [...parent.childNodes]) {
    if (node.nodeType === 3) continue; // text
    if (node.nodeType !== 1) {
      node.parentNode?.removeChild(node); // comments, processing instructions
      continue;
    }
    const el = node as Element;
    const tag = el.localName;
    if (DROPPED_TAGS.has(tag)) {
      el.remove();
      continue;
    }
    cleanChildren(el);
    if (!ALLOWED_TAGS.has(tag)) {
      el.replaceWith(...el.childNodes); // unknown tag: keep its (already cleaned) content
      continue;
    }
    cleanElement(el);
  }
}

export function sanitizeHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  cleanChildren(template.content);
  return template.innerHTML;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for inclusion in HTML / markdown source as plain text. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}
