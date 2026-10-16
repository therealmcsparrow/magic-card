/**
 * Allowlist HTML sanitizer for rendered markdown (no runtime dependency). Parses into an inert
 * <template> (no scripts run, no resources load), keeps known-safe tags and attributes, unwraps
 * unknown tags (their text stays) and drops dangerous ones with their content.
 */

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
/** Anything that could load a resource, run script or hide obfuscation: the whole style attribute goes. */
const UNSAFE_STYLE = /url\s*\(|expression\s*\(|javascript:|vbscript:|@import|behavior\s*:|-moz-binding|\\|\/\*|[<>]/i;
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
/** Image functions (image-set, image(), cross-fade, element(), paint()) load or show other content. */
const UNSAFE_STYLE_VALUE = /(image|image-set|cross-fade|element|paint|src)\s*\(/i;
const VIEWPORT_UNIT = /\d\s*(vw|vh|vmin|vmax|[sld]v[wh])\b/i;
const NEGATIVE = /(^|[\s(,])-\s*[\d.]/;
const SAFE_DISPLAY = new Set(['none', 'inline', 'block', 'inline-block']);
const MIN_OPACITY = 0.3;

function safeDeclaration(prop: string, value: string): boolean {
  if (!value || !SAFE_STYLE_PROPS.test(prop) || UNSAFE_STYLE_VALUE.test(value)) return false;
  if ((value.split('"').length - 1) % 2 || (value.split("'").length - 1) % 2) return false;
  // No viewport-sized boxes and no negative margins pulling content over its neighbours.
  if (VIEWPORT_UNIT.test(value) || (prop.startsWith('margin') && NEGATIVE.test(value))) return false;
  if (prop === 'display') return SAFE_DISPLAY.has(value.toLowerCase());
  if (prop === 'opacity') {
    const n = value.endsWith('%') ? parseFloat(value) / 100 : parseFloat(value);
    return Number.isFinite(n) && n >= MIN_OPACITY;
  }
  return true;
}

/** The allowed declarations of a style attribute ('' when none is left). */
export function sanitizeStyle(style: string): string {
  if (UNSAFE_STYLE.test(style)) return '';
  const kept: string[] = [];
  for (const decl of style.split(';')) {
    const colon = decl.indexOf(':');
    if (colon < 0) continue;
    const prop = decl.slice(0, colon).trim().toLowerCase();
    const value = decl.slice(colon + 1).trim();
    if (safeDeclaration(prop, value)) kept.push(`${prop}: ${value}`);
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
