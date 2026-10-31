import type { SvgCssOutcome, SvgCssPropertyRule, SvgPolicy } from '../contracts/svg-safety';
import { onlyFunctions } from './values';

/*
 * CSS paint resolver: turns the allowed paint declarations of style="" attributes and <style>
 * classes into plain presentation attributes, in place, and writes nothing else. Reads CSS like a
 * browser tokenises it, keeps a small allow-list, and caps every input by length and write budget.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const NAME_RE = /^[A-Za-z-]{1,32}$/;
const CLASS_RE = /^\.-?[A-Za-z_][\w-]{0,63}$/;
const ID_RE = /^#-?[A-Za-z_][\w-]{0,63}$/;
const TYPE_RE = /^[A-Za-z][A-Za-z0-9]{0,31}$/;
const CHARSET_RE = /^[A-Za-z0-9 #%.,()_+/-]+$/;
const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const WORD_RE = /^[A-Za-z]{3,20}$/;
const URL_RE = /^url\(#[A-Za-z][\w.-]{0,63}\)$/;
const HREF_RE = /^#[A-Za-z][\w.-]{0,63}$/;
const NUM_RE = /^[+-]?(?:\d{1,10}(?:\.\d{1,10})?|\.\d{1,10})(?:[eE][+-]?\d{1,3})?$/;
const IMPORTANT_RE = /^important$/i;
const WIDE_KEYWORDS = ['inherit', 'initial', 'unset', 'revert', 'revert-layer'];
const BANNED_CALLS = ['var(', 'attr(', 'env(', 'calc(', 'image-set(', 'element(', 'paint(', 'expression('];
const STOP_GRADIENTS = ['linearGradient', 'radialGradient'];
const PAINT_ORDER = ['fill', 'stroke', 'markers'];

/** CSS white space: space, tab, line feed, form feed, carriage return. */
const isBlank = (c: number): boolean => c === 32 || c === 9 || c === 10 || c === 12 || c === 13;
const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);

function trimBlank(s: string): string {
  let a = 0;
  let b = s.length;
  while (a < b && isBlank(s.charCodeAt(a))) a++;
  while (b > a && isBlank(s.charCodeAt(b - 1))) b--;
  return a === 0 && b === s.length ? s : s.slice(a, b);
}

/** White space runs as one space. */
function collapse(s: string): string {
  let out = '';
  let from = 0;
  for (let i = 0; i < s.length; i++) {
    if (!isBlank(s.charCodeAt(i))) continue;
    let j = i + 1;
    while (j < s.length && isBlank(s.charCodeAt(j))) j++;
    out += s.slice(from, i) + ' ';
    from = j;
    i = j - 1;
  }
  return from === 0 ? s : out + s.slice(from);
}

// ── tokeniser ──

/**
 * The text with each comment as one space and each string as a lone quote, or undefined when the text cannot be read
 * safely: an unterminated comment or string, a newline inside a string, brackets that do not match or nest deeper than
 * `maxDepth`. One pass; comments do not nest.
 */
function tokenise(css: string, maxDepth: number): string | undefined {
  const parts: string[] = [];
  const stack: number[] = [];
  const n = css.length;
  let from = 0;
  for (let i = 0; i < n; i++) {
    const c = css.charCodeAt(i);
    if (c === 47 && css.charCodeAt(i + 1) === 42) {
      const end = css.indexOf('*/', i + 2);
      if (end < 0) return undefined;
      parts.push(css.slice(from, i), ' ');
      i = end + 1;
      from = end + 2;
    } else if (c === 34 || c === 39) {
      let j = i + 1;
      for (; j < n; j++) {
        const d = css.charCodeAt(j);
        if (d === c) break;
        if (d === 10 || d === 13 || d === 12) return undefined;
      }
      if (j >= n) return undefined;
      parts.push(css.slice(from, i), '"');
      i = j;
      from = j + 1;
    } else if (c === 40 || c === 91 || c === 123) {
      if (stack.length >= maxDepth) return undefined;
      stack.push(c === 40 ? 41 : c === 91 ? 93 : 125);
    } else if (c === 41 || c === 93 || c === 125) {
      if (stack.pop() !== c) return undefined;
    }
  }
  if (stack.length) return undefined;
  parts.push(css.slice(from));
  return parts.join('');
}

// ── values ──

type Policy = SvgPolicy;
interface Decl {
  prop: string;
  value: string;
  important: boolean;
}

/** A number as written (no sign unless `signed`, no `px`), its unit, and its value; undefined when it is not a plain number. */
function parseNumber(low: string, signed: boolean): { text: string; unit: '' | '%' | 'px'; n: number } | undefined {
  let t = low;
  let unit: '' | '%' | 'px' = '';
  if (t.endsWith('%')) {
    unit = '%';
    t = t.slice(0, -1);
  } else if (t.endsWith('px')) {
    unit = 'px';
    t = t.slice(0, -2);
  }
  if (!NUM_RE.test(t)) return undefined;
  const sign = t.charCodeAt(0);
  if ((sign === 43 || sign === 45) && !signed) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n)) return undefined;
  return { text: sign === 43 ? t.slice(1) : t, unit, n };
}

function paintValue(v: string, low: string, policy: Policy, plain: boolean): string | undefined {
  if (low === 'none') return plain ? undefined : 'none';
  if (low === 'currentcolor') return 'currentColor';
  if (low === 'transparent') return 'transparent';
  if (HEX_RE.test(v)) return v;
  if (low.startsWith('url(')) return plain || !URL_RE.test(v) ? undefined : v;
  if (WORD_RE.test(v)) return low;
  const open = low.indexOf('(');
  if (open < 1 || low.charCodeAt(low.length - 1) !== 41) return undefined;
  const name = low.slice(0, open);
  if (!policy.colourFunctions.includes(name) || !/^[a-z-]+$/.test(name)) return undefined;
  let depth = 0;
  for (let i = open; i < low.length; i++) {
    const c = low.charCodeAt(i);
    if (c === 40 && ++depth > policy.css.limits.maxColourFunctionDepth) return undefined;
    if (c === 41 && --depth === 0 && i < low.length - 1) return undefined;
  }
  return depth === 0 && onlyFunctions(low, policy.colourFunctions) ? low : undefined;
}

/** The attribute text for a value of the property's kind, or undefined when the value is not allowed. */
function kindValue(rule: SvgCssPropertyRule, v: string, low: string, policy: Policy): string | undefined {
  switch (rule.kind) {
    case 'paint':
      return paintValue(v, low, policy, false);
    case 'stop-paint':
      return paintValue(v, low, policy, true);
    case 'alpha': {
      const x = parseNumber(low, false);
      return x && x.unit !== 'px' ? x.text + (x.unit === '%' ? '%' : '') : undefined;
    }
    case 'width': {
      const x = parseNumber(low, false);
      return x ? x.text + (x.unit === '%' ? '%' : '') : undefined;
    }
    case 'miterlimit': {
      const x = parseNumber(low, false);
      return x && x.unit === '' && x.n >= 1 ? x.text : undefined;
    }
    case 'offset': {
      const x = parseNumber(low, true);
      return x ? x.text + (x.unit === '%' ? '%' : '') : undefined;
    }
    case 'dasharray': {
      if (low === 'none') return 'none';
      const out: string[] = [];
      for (const part of low.split(',')) {
        const items = trimBlank(part).split(' ');
        if (items.length === 1 && items[0] === '') return undefined;
        for (const item of items) {
          const x = item ? parseNumber(item, false) : undefined;
          if (!x) return undefined;
          out.push(x.text + (x.unit === '%' ? '%' : ''));
        }
      }
      return out.length <= policy.css.limits.maxDashValues ? out.join(' ') : undefined;
    }
    case 'keyword':
      return rule.keywords?.includes(low) ? low : undefined;
    case 'paint-order': {
      if (low === 'normal') return low;
      const items = low.split(' ');
      return items.length <= 3 && items.every((t, i) => PAINT_ORDER.includes(t) && items.indexOf(t) === i) ? low : undefined;
    }
    default:
      return undefined;
  }
}

/** One declaration of `name: value [!important]`, or undefined when it must be ignored. */
function declaration(segment: string, policy: Policy): Decl | undefined {
  const colon = segment.indexOf(':');
  if (colon < 1 || colon > 40) return undefined;
  const name = trimBlank(segment.slice(0, colon));
  const { properties, limits } = policy.css;
  if (!NAME_RE.test(name)) return undefined;
  const prop = name.toLowerCase();
  if (!has(properties, prop) || !has(policy.kinds, prop)) return undefined;
  const rule = properties[prop as keyof typeof properties];
  let value = trimBlank(segment.slice(colon + 1));
  let important = false;
  const bang = value.indexOf('!');
  if (bang >= 0) {
    if (!IMPORTANT_RE.test(trimBlank(value.slice(bang + 1)))) return undefined;
    important = true;
    value = trimBlank(value.slice(0, bang));
  }
  const paint = rule.kind === 'paint' || rule.kind === 'stop-paint';
  if (!value || value.length > (paint ? limits.maxPaintChars : limits.maxValueChars)) return undefined;
  const v = collapse(value);
  if (!CHARSET_RE.test(v) || v.includes('//')) return undefined;
  const low = v.toLowerCase();
  if (WIDE_KEYWORDS.includes(low) || BANNED_CALLS.some((c) => low.includes(c))) return undefined;
  const text = kindValue(rule, v, low, policy);
  return text === undefined ? undefined : { prop, value: text, important };
}

/** Splits at `;` outside brackets; the text is already bracket-balanced. */
function splitDeclarations(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 40 || c === 91 || c === 123) depth++;
    else if (c === 41 || c === 93 || c === 125) depth--;
    else if (c === 59 && depth === 0) {
      out.push(s.slice(from, i));
      from = i + 1;
    }
  }
  out.push(s.slice(from));
  return out;
}

/** The declarations of a rule body or style attribute; `dropped` when any was ignored. Undefined when over the cap. */
function declarations(text: string, policy: Policy): { decls: Decl[]; dropped: boolean } | undefined {
  const decls: Decl[] = [];
  let dropped = false;
  let count = 0;
  for (const raw of splitDeclarations(text)) {
    const segment = trimBlank(raw);
    if (!segment) continue;
    if (++count > policy.css.limits.maxDeclarations) return undefined;
    const d = declaration(segment, policy);
    if (d) decls.push(d);
    else dropped = true;
  }
  return { decls, dropped };
}

// ── rules ──

interface Candidate {
  value: string;
  important: boolean;
  order: number;
}
/** Selector key (`rect`, `.a`, `#t`) -> property -> the declaration that wins within that key. */
type Table = Map<string, Map<string, Candidate>>;

/** The selector keys of a rule prelude, or undefined when one item is not a simple type, class or id selector. */
function selectorKeys(prelude: string, policy: Policy): string[] | undefined {
  const items = prelude.split(',');
  if (items.length > policy.css.limits.maxSelectors) return undefined;
  const keys: string[] = [];
  for (const item of items) {
    const t = trimBlank(item);
    if (t.length > 66) return undefined;
    const c = t.charCodeAt(0);
    if (c === 46 ? CLASS_RE.test(t) : c === 35 ? ID_RE.test(t) : TYPE_RE.test(t) && policy.elements.includes(t)) keys.push(t);
    else return undefined;
  }
  return keys;
}

/** Index after the matching close of the bracket that opened just before `from` (the text is balanced). */
function closeOf(c: string, from: number): number {
  let depth = 1;
  let i = from;
  for (; i < c.length && depth > 0; i++) {
    const d = c.charCodeAt(i);
    if (d === 40 || d === 91 || d === 123) depth++;
    else if (d === 41 || d === 93 || d === 125) depth--;
  }
  return i;
}

/** Adds the rules of tokenised style text to the table. Returns whether anything was ignored and how many rules were kept. */
function addRules(c: string, policy: Policy, table: Table, counter: { rules: number }): { dropped: boolean; kept: number } {
  const n = c.length;
  let dropped = false;
  let kept = 0;
  let i = 0;
  while (i < n) {
    while (i < n && isBlank(c.charCodeAt(i))) i++;
    if (i >= n) break;
    if (c.charCodeAt(i) === 64) {
      // at-rule: a statement runs to `;`, a block to its closing brace; nothing inside applies
      dropped = true;
      let depth = 0;
      let block = false;
      for (; i < n; i++) {
        const d = c.charCodeAt(i);
        if (d === 40 || d === 91) depth++;
        else if (d === 41 || d === 93) depth--;
        else if (d === 123) {
          block = true;
          depth++;
        } else if (d === 125) {
          if (--depth === 0 && block) {
            i++;
            break;
          }
        } else if (d === 59 && depth === 0 && !block) {
          i++;
          break;
        }
      }
      continue;
    }
    let depth = 0;
    let j = i;
    for (; j < n; j++) {
      const d = c.charCodeAt(j);
      if (d === 40 || d === 91) depth++;
      else if (d === 41 || d === 93) depth--;
      else if (d === 123 && depth === 0) break;
    }
    if (j >= n) {
      dropped = true;
      break;
    }
    const end = closeOf(c, j + 1);
    const prelude = c.slice(i, j);
    const body = c.slice(j + 1, end - 1);
    i = end;
    const keys = selectorKeys(prelude, policy);
    const parsed = keys && !body.includes('{') && counter.rules < policy.css.limits.maxRules ? declarations(body, policy) : undefined;
    if (!keys || !parsed) {
      dropped = true;
      continue;
    }
    if (parsed.dropped) dropped = true;
    const order = counter.rules++;
    kept++;
    for (const key of keys) {
      let props = table.get(key);
      if (!props) table.set(key, (props = new Map()));
      for (const d of parsed.decls) {
        const old = props.get(d.prop);
        if (!old || (d.important && !old.important) || (d.important === old.important && order >= old.order)) {
          props.set(d.prop, { value: d.value, important: d.important, order });
        }
      }
    }
  }
  return { dropped, kept };
}

// ── resolver ──

interface Item {
  el: Element;
  name: string;
}

/** The text of a style element as the browser reads it, or undefined when the element cannot be used. */
function blockText(s: Element): string | undefined {
  const type = s.getAttribute('type');
  const media = s.getAttribute('media');
  if (type !== null && !/^(?:text\/css)?$/i.test(trimBlank(type))) return undefined;
  if (media !== null && !/^(?:all|screen)?$/i.test(trimBlank(media))) return undefined;
  let text = '';
  for (let n = s.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === 1) return undefined;
    if (n.nodeType === 3 || n.nodeType === 4) text += (n as CharacterData).data;
  }
  return text;
}

const textSize = (s: Element): number => {
  let size = 0;
  for (let n = s.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 || n.nodeType === 4) size += (n as CharacterData).data.length;
  return size;
};

const sizeOf = (el: Element): number => {
  let size = el.localName.length * 2 + 5;
  for (const a of Array.from(el.attributes)) size += a.name.length + a.value.length + 4;
  return size;
};

/** Class tokens of an element, at most `max`, split at ASCII white space. */
function classTokens(value: string | null, max: number): string[] {
  const out: string[] = [];
  if (!value) return out;
  const n = value.length;
  for (let i = 0; i < n && out.length < max; ) {
    while (i < n && isBlank(value.charCodeAt(i))) i++;
    let j = i;
    while (j < n && !isBlank(value.charCodeAt(j))) j++;
    if (j > i) out.push(value.slice(i, j));
    i = j;
  }
  return out;
}

const hrefOf = (g: Element): string | null => g.getAttribute('href') ?? g.getAttributeNS(XLINK_NS, 'href');

/**
 * Turns allowed style declarations into presentation attributes of the tree under `root`, and copies the stops of a
 * gradient that inherits them through href. Changes the tree in place; a part it cannot use is left where it is for the
 * sanitiser's walk to drop and list, and a part it used is removed. Reports the names of parts it used only in part.
 */
export function resolveCss(root: Element, policy: SvgPolicy): SvgCssOutcome {
  const image = policy.name === 'image';
  const { limits, maxWrittenBytes } = policy.css;
  const elements = new Map(policy.elements.map((e) => [image ? e : e.toLowerCase(), e]));
  const nameOf = (el: Element): string | undefined => (image && el.namespaceURI !== SVG_NS ? undefined : elements.get(image ? el.localName : el.localName.toLowerCase()));

  // the elements the walk would keep, in document order, and the style elements among them
  const items: Item[] = [];
  const styles: Element[] = [];
  const stack: { el: Element; depth: number; style: boolean }[] = [{ el: root, depth: 0, style: false }];
  let nodes = 0;
  let wanted = false;
  while (stack.length) {
    const top = stack.pop() as { el: Element; depth: number; style: boolean };
    if (top.style) {
      styles.push(top.el);
      continue;
    }
    const name = nameOf(top.el) ?? 'svg';
    items.push({ el: top.el, name });
    if (top.el.hasAttribute('style') || (STOP_GRADIENTS.includes(name) && hrefOf(top.el) !== null)) wanted = true;
    for (let c = top.el.lastElementChild; c; c = c.previousElementSibling) {
      if (c.localName === 'style' && (!image || c.namespaceURI === SVG_NS)) {
        stack.push({ el: c, depth: top.depth + 1, style: true });
        continue;
      }
      if (!nameOf(c)) continue;
      if (top.depth + 1 > policy.limits.maxDepth || ++nodes > policy.limits.maxNodes) return { status: 'too_complex' };
      stack.push({ el: c, depth: top.depth + 1, style: false });
    }
  }
  if (!wanted && !styles.length) return { status: 'ok', dropped: [] };

  const dropped = new Set<string>();
  let written = 0;
  const write = (el: Element, prop: string, value: string): boolean => {
    el.setAttribute(prop, value);
    written += prop.length + value.length + 4;
    return written <= maxWrittenBytes;
  };

  // style elements: all or none when the document is over the caps
  const table: Table = new Map();
  let removed = false;
  if (styles.length) {
    let chars = 0;
    for (const s of styles) chars += textSize(s);
    const counter = { rules: 0 };
    const within = styles.length <= limits.maxStyleBlocks && chars <= limits.maxCssChars;
    for (const s of within ? styles : []) {
      const text = blockText(s);
      const css = text === undefined || text.includes('\\') || text.includes('<') ? undefined : tokenise(text, limits.maxBracketDepth);
      if (css === undefined) continue;
      const r = addRules(css, policy, table, counter);
      if (r.kept === 0 && r.dropped) continue;
      s.parentNode?.removeChild(s);
      removed = true;
      if (r.dropped) dropped.add('style');
    }
  }

  // declarations that win per element and property
  const classMax = limits.maxClassTokens;
  for (const { el, name } of items) {
    const raw = el.getAttribute('style');
    let own: { decls: Decl[]; dropped: boolean } | undefined;
    if (raw !== null && raw.length <= limits.maxStyleAttrChars && !/[\\<>]/.test(raw)) {
      const css = tokenise(raw, limits.maxBracketDepth);
      own = css === undefined ? undefined : declarations(css, policy);
    }
    if (!table.size && !own) continue;
    const best = new Map<string, { c: Candidate; level: number }>();
    if (table.size) {
      const consider = (key: string, level: number): void => {
        const props = table.get(key);
        if (!props) return;
        for (const [prop, c] of props) {
          const old = best.get(prop);
          if (!old || (c.important ? 4 : 0) + level > (old.c.important ? 4 : 0) + old.level || ((c.important ? 4 : 0) + level === (old.c.important ? 4 : 0) + old.level && c.order > old.c.order)) {
            best.set(prop, { c, level });
          }
        }
      };
      consider(name, 0);
      for (const t of classTokens(el.getAttribute('class'), classMax)) consider(`.${t}`, 1);
      const id = el.getAttribute('id');
      if (id) consider(`#${id}`, 2);
    }
    const mine = new Map<string, Decl>();
    for (const d of own?.decls ?? []) {
      const old = mine.get(d.prop);
      if (!old || d.important || !old.important) mine.set(d.prop, d);
    }
    for (const prop of new Set([...best.keys(), ...mine.keys()])) {
      const rule = best.get(prop)?.c;
      const style = mine.get(prop);
      const value = style?.important || !rule?.important ? (style ?? rule)?.value : (rule as Candidate).value;
      if (value !== undefined && !write(el, prop, value)) return { status: 'too_complex' };
    }
    if (own && own.decls.length) {
      el.removeAttribute('style');
      if (own.dropped) dropped.add(`${name}@style`);
    } else if (own && !own.dropped) el.removeAttribute('style');
  }

  // a style element that changed nothing in the drawing is listed like any other part that was not used
  if (removed && written === 0) dropped.add('style');

  // stops through href
  const gradients = items.filter((i) => STOP_GRADIENTS.includes(i.name));
  if (gradients.length) {
    const ids = new Map<string, Element>();
    for (const { el } of items) {
      const id = el.getAttribute('id');
      if (id && !ids.has(id)) ids.set(id, el);
    }
    const nameFor = new Map(items.map((i) => [i.el, i.name]));
    const stopsMemo = new Map<Element, Element[]>();
    const stopsOf = (g: Element): Element[] => {
      let list = stopsMemo.get(g);
      if (!list) stopsMemo.set(g, (list = Array.from(g.children).filter((c) => nameFor.get(c) === 'stop')));
      return list;
    };
    const target = (g: Element): Element | undefined => {
      const href = hrefOf(g);
      const t = href === null ? '' : trimBlank(href);
      return HREF_RE.test(t) ? ids.get(t.slice(1)) : undefined;
    };
    const plans: { g: Element; stops: Element[] }[] = [];
    let clones = 0;
    for (const { el: g } of gradients) {
      if (hrefOf(g) === null) continue;
      let from: Element[] | undefined;
      if (stopsOf(g).length) {
        // its own stops win; the href is consumed only when it was a usable gradient reference, any other is left for the walk to drop and list
        const next = target(g);
        if (next && STOP_GRADIENTS.includes(nameFor.get(next) ?? '')) from = [];
      } else {
        const seen = new Set([g]);
        let cur = g;
        for (let hop = 1; hop <= limits.maxHrefHops; hop++) {
          const next = target(cur);
          if (!next || seen.has(next) || !STOP_GRADIENTS.includes(nameFor.get(next) ?? '')) break;
          seen.add(next);
          const stops = stopsOf(next);
          if (stops.length) {
            if (stops.length <= limits.maxStopsPerGradient && clones + stops.length <= limits.maxStopClones) {
              from = stops;
              clones += stops.length;
            }
            break;
          }
          cur = next;
        }
      }
      if (!from) continue;
      plans.push({ g, stops: from });
    }
    for (const { g, stops } of plans) {
      g.removeAttribute('href');
      g.removeAttributeNS(XLINK_NS, 'href');
      for (const s of stops) {
        const copy = s.cloneNode(false) as Element;
        copy.removeAttribute('id');
        written += sizeOf(copy);
        if (written > maxWrittenBytes) return { status: 'too_complex' };
        g.appendChild(copy);
      }
    }
  }
  return { status: 'ok', dropped: [...dropped] };
}
