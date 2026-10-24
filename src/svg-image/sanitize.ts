import {
  IMAGE_ATTRIBUTES,
  IMAGE_ELEMENTS,
  IMAGE_FONT_FAMILIES,
  IMAGE_ID_RE,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_DEPTH,
  IMAGE_MAX_NODES,
  IMAGE_MAX_TEXT_CHARS,
  IMAGE_TEXT_DENY,
  MAX_IMAGE_BOX,
  THEME_VAR_NAME_RE,
  type SanitizedImage,
  type SanitizeOptions,
} from '../contracts/svg-image';

/*
 * The image sanitiser (contract svg-image 1.0.0, "Image sanitiser"). User and library markup is reduced to an allow-list
 * of drawing elements and attributes; nothing that runs or fetches survives. The text is capped by length before any
 * pattern runs, the markup items of IMAGE_TEXT_DENY are refused before the parser sees the text, and every value check
 * is a scan or a regular expression over a value of bounded length.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const ELEMENTS = new Set(IMAGE_ELEMENTS);
const FONTS = new Set(IMAGE_FONT_FAMILIES);
const TEXT_PARENTS = new Set(['text', 'tspan', 'title']);
const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'text']);
const NOT_DRAWN = new Set(['defs', 'clipPath', 'mask', 'linearGradient', 'radialGradient']);

const PAINT = new Set(['fill', 'stroke', 'stop-color']);
const TRANSFORMS = new Set(['transform', 'gradientTransform']);
const REFERENCES = new Set(['clip-path', 'mask']);
const KEYWORDS = new Set([
  'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'spreadMethod', 'gradientUnits', 'clipPathUnits', 'maskUnits',
  'maskContentUnits', 'visibility', 'vector-effect', 'paint-order', 'font-style', 'font-weight', 'text-anchor', 'dominant-baseline',
  'preserveAspectRatio',
]);

const COLOR_FNS = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']);
const TRANSFORM_FNS = new Set(['matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy']);

const DENY_RE = new RegExp(IMAGE_TEXT_DENY.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

const MAX_VALUE = 2000;
const MAX_PAINT = 200;
const MAX_TRANSFORM_FNS = 16;
const MAX_STRIPPED = 100;

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const WORD_RE = /^[A-Za-z]{3,20}$/;
const URL_REF_RE = /^url\(#([A-Za-z][\w.-]{0,63})\)$/;
const VAR_RE = /^var\(\s*(--[a-z0-9][a-z0-9-]{0,63})\s*(?:,\s*(#[0-9a-fA-F]{3,8}|[A-Za-z]{3,20})\s*)?\)$/;
const FN_RE = /([A-Za-z-]+)\s*\(/g;
const COLOR_CHARS_RE = /^[\w\s.,%/#()+-]+$/;
const LENGTH_RE = /^[\s\d.,eE+%a-zA-Z-]+$/;
const KEYWORD_RE = /^[A-Za-z0-9\s-]{1,40}$/;
const PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz\d\s.,eE+-]*$/;
const NUMBERS_RE = /^[\s\d.,eE+%-]*$/;
const ARGS_RE = /^[\s\d.,eE+-]*$/;
const CLASS_TOKEN_RE = /^[\w-]{1,64}$/;
// eslint-disable-next-line no-control-regex
const DATA_NAME_RE = /^[^<>"&\\\u0000-\u001f]{1,80}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;

/** True for a paint value the contract allows. The value is at most MAX_PAINT characters here. */
function paintOk(v: string): boolean {
  if (v.length > MAX_PAINT) return false;
  if (HEX_RE.test(v) || WORD_RE.test(v) || URL_REF_RE.test(v)) return true;
  const m = VAR_RE.exec(v);
  if (m) return THEME_VAR_NAME_RE.test(m[1]);
  if (!COLOR_CHARS_RE.test(v) || v.includes('//') || v.includes('/*')) return false;
  const opens = v.split('(').length - 1;
  const fns = [...v.matchAll(FN_RE)];
  return fns.length === opens && fns.length > 0 && fns.every((f) => COLOR_FNS.has(f[1].toLowerCase()));
}

/** A transform list: only the transform functions with numeric arguments, at most MAX_TRANSFORM_FNS of them. */
function transformOk(v: string): boolean {
  const n = v.length;
  let i = 0;
  let count = 0;
  for (;;) {
    while (i < n && (v[i] === ' ' || v[i] === ',' || v[i] === '\t' || v[i] === '\n' || v[i] === '\r')) i++;
    if (i >= n) return count > 0;
    let j = i;
    while (j < n && /[A-Za-z]/.test(v[j])) j++;
    if (!TRANSFORM_FNS.has(v.slice(i, j).toLowerCase()) || v[j] !== '(') return false;
    const close = v.indexOf(')', j);
    if (close < 0 || !ARGS_RE.test(v.slice(j + 1, close)) || ++count > MAX_TRANSFORM_FNS) return false;
    i = close + 1;
  }
}

const enum Kind { Path, Points, Paint, Transform, Reference, Font, Id, DataName, Class, Length, Keyword }

/** Every allowed attribute name with the rule its value follows. */
const KINDS = new Map<string, Kind>(
  IMAGE_ATTRIBUTES.map((name) => [
    name,
    name === 'd' ? Kind.Path
    : name === 'points' ? Kind.Points
    : PAINT.has(name) ? Kind.Paint
    : TRANSFORMS.has(name) ? Kind.Transform
    : REFERENCES.has(name) ? Kind.Reference
    : name === 'font-family' ? Kind.Font
    : name === 'id' ? Kind.Id
    : name === 'data-name' ? Kind.DataName
    : name === 'class' ? Kind.Class
    : KEYWORDS.has(name) ? Kind.Keyword
    : Kind.Length,
  ]),
);

/** The cleaned value of an attribute of the given kind, or undefined when it must go. */
function cleanValue(kind: Kind, raw: string): string | undefined {
  if (kind === Kind.Path) return raw.length <= IMAGE_MAX_BYTES && PATH_RE.test(raw) ? raw : undefined;
  if (kind === Kind.Points) return raw.length <= IMAGE_MAX_BYTES && NUMBERS_RE.test(raw) ? raw : undefined;
  if (raw.length > MAX_VALUE) return undefined;
  // every branch below is an allow-list that cannot pass a backslash, "<", ">", "//", a comment, "javascript:", "data:",
  // "expression(" or "@import", and a "(" only where the branch names the function
  const v = raw.charCodeAt(0) <= 32 || raw.charCodeAt(raw.length - 1) <= 32 ? raw.trim() : raw;
  switch (kind) {
    case Kind.Length:
      return LENGTH_RE.test(v) ? v : undefined;
    case Kind.Paint:
      return paintOk(v) ? v : undefined;
    case Kind.Keyword:
      return KEYWORD_RE.test(v) ? v : undefined;
    case Kind.Transform:
      return transformOk(v) ? v : undefined;
    case Kind.Reference:
      return v === 'none' || URL_REF_RE.test(v) ? v : undefined;
    case Kind.Font: {
      const low = v.toLowerCase();
      return FONTS.has(low) ? low : 'sans-serif';
    }
    case Kind.Id:
      return IMAGE_ID_RE.test(v) ? v : undefined;
    case Kind.DataName:
      return DATA_NAME_RE.test(v) ? v : undefined;
    default: {
      const tokens = v.split(/\s+/).filter((t) => CLASS_TOKEN_RE.test(t));
      return tokens.length ? tokens.join(' ') : undefined;
    }
  }
}

/** A leading prolog of an opened .svg file, removed by one linear scan (BOM, one XML declaration, comments, one DOCTYPE without "["). */
function stripProlog(text: string): string {
  const n = text.length;
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let declared = false;
  let doctype = false;
  for (;;) {
    while (i < n && /\s/.test(text[i])) i++;
    if (!declared && !doctype && text.startsWith('<?xml', i) && /\s/.test(text[i + 5] ?? '')) {
      const end = text.indexOf('?>', i);
      if (end < 0) break;
      i = end + 2;
      declared = true;
    } else if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      if (end < 0) break;
      i = end + 3;
    } else if (!doctype && text.substr(i, 9).toLowerCase() === '<!doctype') {
      const end = text.indexOf('>', i);
      if (end < 0 || text.slice(i, end).includes('[')) break;
      i = end + 1;
      doctype = true;
    } else break;
  }
  return text.slice(i);
}

export interface ParsedImage {
  root: Element;
  viewBox: string;
  ids: string[];
  stripped: string[];
  bytes: number;
}
export type ImageError = NonNullable<SanitizedImage['error']>;

/** UTF-8 size of a text; a text far over the cap is not encoded (its length is already a lower bound). */
function byteLength(text: string): number {
  return text.length > IMAGE_MAX_BYTES * 4 ? text.length : new TextEncoder().encode(text).length;
}

function viewBoxOf(raw: string | null): string | undefined {
  if (!raw || raw.length > 100) return undefined;
  const p = raw.trim().split(/[\s,]+/).map(Number);
  if (p.length !== 4 || p.some((x) => !Number.isFinite(x))) return undefined;
  if (p[2] < 1 || p[3] < 1 || p[2] > MAX_IMAGE_BOX || p[3] > MAX_IMAGE_BOX) return undefined;
  return p.join(' ');
}

function parseDocument(text: string): Element | undefined {
  const parser = new DOMParser();
  try {
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const root = doc.documentElement;
    if (root && root.localName === 'svg' && root.namespaceURI === SVG_NS && !doc.getElementsByTagName('parsererror').length) return root;
  } catch {
    // fall through to the html parse
  }
  try {
    const first = parser.parseFromString(text, 'text/html').body?.firstElementChild;
    if (first && first.localName === 'svg' && first.namespaceURI === SVG_NS) return first;
  } catch {
    // not markup
  }
  return undefined;
}

class Refused extends Error {}

/**
 * Parses and cleans in the parsed tree (no second document, no serialise and re-parse). The returned root is detached from
 * any page and inert until a caller puts it in a document.
 */
export function parseImage(markup: string, options: SanitizeOptions = {}): ParsedImage | { error: ImageError; bytes: number } {
  const text0 = typeof markup === 'string' ? markup : '';
  if (text0.length > IMAGE_MAX_BYTES) return { error: 'too_large', bytes: byteLength(text0) };
  const bytes = byteLength(text0);
  if (bytes > IMAGE_MAX_BYTES) return { error: 'too_large', bytes };
  const text = options.file ? stripProlog(text0) : text0;
  if (DENY_RE.test(text)) return { error: 'unsafe_markup', bytes };
  const root = text.trim() ? parseDocument(text) : undefined;
  if (!root) return { error: 'not_svg', bytes };
  const viewBox = viewBoxOf(root.getAttribute('viewBox'));
  if (!viewBox) return { error: 'bad_viewbox', bytes };

  const stripped = new Set<string>();
  const ids = new Set<string>();
  const drop = (what: string): void => {
    if (stripped.size < MAX_STRIPPED) stripped.add(what);
  };
  let nodes = 0;
  let drawable = false;

  const walk = (el: Element, depth: number, hidden: boolean): void => {
    if (depth > IMAGE_MAX_DEPTH) throw new Refused();
    const local = el.localName;
    // an allowed name holds no ":", so namespaced attributes (xlink:href, xmlns:*) are not in KINDS and go
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const a = attrs[i];
      const kind = KINDS.get(a.name);
      let v = kind === undefined ? undefined : cleanValue(kind, a.value);
      if (v !== undefined && kind === Kind.Id) {
        if (ids.has(v)) v = undefined;
        else ids.add(v);
      }
      if (v === undefined) {
        el.removeAttributeNode(a);
        if (a.name !== 'xmlns' && !a.name.startsWith('xmlns:')) drop(`${local}@${a.name}`);
      } else if (v !== a.value) a.value = v;
    }
    const textual = TEXT_PARENTS.has(local);
    let room = IMAGE_MAX_TEXT_CHARS;
    const inert = hidden || NOT_DRAWN.has(local);
    for (let c = el.firstChild, next: ChildNode | null; c; c = next) {
      next = c.nextSibling;
      if (c.nodeType === 1) {
        const child = c as Element;
        if (child.namespaceURI !== SVG_NS || !ELEMENTS.has(child.localName)) {
          drop(child.localName);
          el.removeChild(child);
          continue;
        }
        if (++nodes > IMAGE_MAX_NODES) throw new Refused();
        if (!inert && SHAPES.has(child.localName)) drawable = true;
        walk(child, depth + 1, inert);
      } else if (c.nodeType === 3 && textual) {
        const t = (c as Text).data.replace(CONTROL_RE, '');
        const kept = t.length > room ? t.slice(0, room) : t;
        room -= kept.length;
        if (kept !== (c as Text).data) (c as Text).data = kept;
      } else el.removeChild(c);
    }
  };

  try {
    root.removeAttribute('width');
    root.removeAttribute('height');
    walk(root, 0, false);
  } catch (e) {
    if (e instanceof Refused) return { error: 'too_complex', bytes };
    throw e;
  }
  if (!drawable) return { error: 'empty', bytes };
  root.setAttribute('viewBox', viewBox);
  return { root, viewBox, ids: [...ids], stripped: [...stripped], bytes };
}

const escText = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s: string): string => escText(s).replace(/"/g, '&quot;');

/** A cleaned tree as markup: attributes and text escaped, the namespace on the root. */
export function serializeImage(root: Element): string {
  const out: string[] = [];
  const emit = (el: Element, top: boolean): void => {
    out.push(`<${el.localName}`);
    if (top) out.push(` xmlns="${SVG_NS}"`);
    for (const a of Array.from(el.attributes)) out.push(` ${a.name}="${escAttr(a.value)}"`);
    if (!el.firstChild) {
      out.push('/>');
      return;
    }
    out.push('>');
    for (let c: ChildNode | null = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1) emit(c as Element, false);
      else if (c.nodeType === 3) out.push(escText((c as Text).data));
    }
    out.push(`</${el.localName}>`);
  };
  emit(root, true);
  return out.join('');
}

/** Sanitises a drawing to markup. The result of a refused or empty text has no markup. */
export function sanitizeImage(markup: string, options: SanitizeOptions = {}): SanitizedImage {
  const r = parseImage(markup, options);
  if ('error' in r) return { markup: '', viewBox: '', ids: [], stripped: [], error: r.error, bytes: r.bytes };
  return { markup: serializeImage(r.root), viewBox: r.viewBox, ids: r.ids, stripped: r.stripped, bytes: r.bytes };
}

/** The cleaned tree in an inert <template>, ready to be cloned into stages. */
export function templateOf(root: Element): HTMLTemplateElement {
  const t = document.createElement('template');
  t.content.appendChild(root);
  return t;
}
