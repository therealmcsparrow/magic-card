import {
  IMAGE_MAX_BYTES,
  IMAGE_MAX_DEPTH,
  IMAGE_MAX_NODES,
  IMAGE_MAX_TEXT_CHARS,
  IMAGE_TEXT_DENY,
  MAX_IMAGE_BOX,
  type SanitizedImage,
  type SanitizeOptions,
} from '../contracts/svg-image';
import type { SanitisedImageMarkup } from '../contracts/svg-reader';
import { cleanImageValue } from '../svg-safety/image-values';
import { parseLenient } from '../svg-safety/parse';
import { IMAGE_POLICY } from '../svg-safety/policy-image';
import { byteLength, escapeAttr, escapeText, kindOf } from '../svg-safety/values';

/*
 * The image sanitiser: reduces markup to an allow-list of drawing elements and attributes; nothing that runs or fetches survives.
 * Length is capped before any pattern runs; style attributes and <style> rules are dropped unless the editor passes the CSS resolver (`css`).
 * The markup it returns is the only branded markup.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const ELEMENTS = new Set(IMAGE_POLICY.elements);
const TEXT_PARENTS = new Set(['text', 'tspan', 'title']);
const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'text']);
const NOT_DRAWN = new Set(['defs', 'clipPath', 'mask', 'linearGradient', 'radialGradient']);

const DENY_RE = new RegExp(IMAGE_TEXT_DENY.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

const SCRIPT_TAG_RE = /<script[\s/>]/i;
const STYLE_TAG_RE = /<style[\s/>]/i;
const STYLE_OPEN_RE = /^<style(?:[ \t\r\n][^<>]*)?>[ \t\r\n]*$/;
const MAX_STRIPPED = 100;
const MAX_NAME = 40;
const short = (name: string): string => (name.length > MAX_NAME ? name.slice(0, MAX_NAME) : name);

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;

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

const isBlank = (c: string | undefined): boolean => c === ' ' || c === '\t' || c === '\r' || c === '\n';

/**
 * File mode: each exact-case CDATA section that is the whole content of a style element becomes the same text as plain
 * escaped character data, so the parsers never see a CDATA section. The section must follow the element's start tag, hold
 * no "<" and be followed by only white space and the end tag. Any other CDATA stays and is refused by the deny scan. Each
 * occurrence is found with indexOf, so the scan is linear.
 */
function unwrapStyleCdata(text: string): string {
  const parts: string[] = [];
  let from = 0;
  let end = -2;
  for (let p = text.indexOf('<![CDATA['); p >= 0; p = text.indexOf('<![CDATA[', p + 9)) {
    const open = text.lastIndexOf('<', p - 1);
    if (open < 0 || !STYLE_OPEN_RE.test(text.slice(open, p))) continue;
    if (end < p + 9) end = text.indexOf(']]>', p + 9);
    if (end < 0) break;
    const lt = text.indexOf('<', p + 9);
    if (lt >= 0 && lt < end) continue;
    let q = end + 3;
    while (isBlank(text[q])) q++;
    if (!text.startsWith('</style', q)) continue;
    q += 7;
    while (isBlank(text[q])) q++;
    if (text[q] !== '>') continue;
    parts.push(text.slice(from, p), escapeText(text.slice(p + 9, end)));
    from = end + 3;
  }
  return parts.length ? parts.join('') + text.slice(from) : text;
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
function sizeOf(text: string): number {
  return text.length > IMAGE_MAX_BYTES * 4 ? text.length : byteLength(text);
}

function viewBoxOf(raw: string | null): string | undefined {
  if (!raw || raw.length > 100) return undefined;
  const p = raw.trim().split(/[\s,]+/).map(Number);
  if (p.length !== 4 || p.some((x) => !Number.isFinite(x))) return undefined;
  if (p[2] < 1 || p[3] < 1 || p[2] > MAX_IMAGE_BOX || p[3] > MAX_IMAGE_BOX) return undefined;
  return p.join(' ');
}

class Refused extends Error {}

/** A copy of a well-formed tree whose unprefixed elements are in the SVG namespace, as if the root had declared xmlns. */
function inSvgNamespace(doc: Document, src: Element, depth: number): Element {
  if (depth > IMAGE_MAX_DEPTH + 1) throw new Refused();
  const out = doc.createElementNS(src.namespaceURI ?? SVG_NS, src.localName);
  for (const a of Array.from(src.attributes)) out.setAttributeNS(a.namespaceURI, a.name, a.value);
  for (let c = src.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 1) out.appendChild(inSvgNamespace(doc, c as Element, depth + 1));
    else if (c.nodeType === 3) out.appendChild(doc.createTextNode((c as Text).data));
  }
  return out;
}

/** The root <svg> of a text, the names of elements the html parser moved out of it, and whether a <style> was lost there. */
function parseDocument(text: string, resolving: boolean): { root: Element; moved: string[]; styleLost: boolean } | undefined {
  let parsed = parseLenient(text, (r) => r.namespaceURI === SVG_NS || r.namespaceURI === null);
  if (!parsed) return undefined;
  if (parsed.via === 'xml') {
    // a well-formed drawing without xmlns goes through the same walk as one with it
    if (parsed.root.namespaceURI === SVG_NS) return { root: parsed.root, moved: [], styleLost: false };
    try {
      return { root: inSvgNamespace(parsed.doc, parsed.root, 0), moved: [], styleLost: false };
    } catch (e) {
      if (e instanceof Refused) throw e;
      // a tree that cannot be rebuilt goes to the html parse
      parsed = parseLenient(text, () => false);
      if (!parsed) return undefined;
    }
  }
  const { root, doc } = parsed;
  if (root !== doc.body?.firstElementChild || root.namespaceURI !== SVG_NS) return undefined;
  const moved: string[] = [];
  for (let e = root.nextElementSibling; e && moved.length < MAX_STRIPPED; e = e.nextElementSibling) moved.push(short(e.localName));
  // some html parsers drop a script or style (and what follows it) without a node; the text still tells
  if (SCRIPT_TAG_RE.test(text) && !moved.includes('script')) moved.push('script');
  // a <style> the resolver reads and consumes is listed by it; without a resolver the walk drops it, so any <style> in the text is listed
  return { root, moved, styleLost: STYLE_TAG_RE.test(text) && !moved.includes('style') && (!resolving || !root.getElementsByTagName('style').length) };
}

/**
 * Parses and cleans in the parsed tree (no second document, no serialise and re-parse). The returned root is detached from
 * any page and inert until a caller puts it in a document.
 */
export function parseImage(markup: string, options: SanitizeOptions = {}): ParsedImage | { error: ImageError; bytes: number; stripped: string[] } {
  const text0 = typeof markup === 'string' ? markup : '';
  if (text0.length > IMAGE_MAX_BYTES) return { error: 'too_large', bytes: sizeOf(text0), stripped: [] };
  const bytes = sizeOf(text0);
  if (bytes > IMAGE_MAX_BYTES) return { error: 'too_large', bytes, stripped: [] };
  const resolving = !!options.file && !!options.css;
  const text = options.file ? (resolving ? unwrapStyleCdata(stripProlog(text0)) : stripProlog(text0)) : text0;
  if (DENY_RE.test(text)) return { error: 'unsafe_markup', bytes, stripped: [] };
  let parsed: ReturnType<typeof parseDocument>;
  try {
    parsed = text.trim() ? parseDocument(text, resolving) : undefined;
  } catch (e) {
    if (e instanceof Refused) return { error: 'too_complex', bytes, stripped: [] };
    throw e;
  }
  if (!parsed) return { error: 'not_svg', bytes, stripped: [] };
  const { root } = parsed;
  const viewBox = viewBoxOf(root.getAttribute('viewBox'));
  if (!viewBox) return { error: 'bad_viewbox', bytes, stripped: [] };

  const stripped = new Set<string>();
  for (const name of parsed.moved) if (stripped.size < MAX_STRIPPED) stripped.add(name);
  const ids = new Set<string>();
  const drop = (what: string): void => {
    if (stripped.size < MAX_STRIPPED) stripped.add(what);
  };
  if (parsed.styleLost) drop('style');
  if (resolving) {
    let resolved: ReturnType<NonNullable<SanitizeOptions['css']>>;
    try {
      resolved = options.css!(root, IMAGE_POLICY);
    } catch {
      return { error: 'too_complex', bytes, stripped: [...stripped] };
    }
    if (resolved.status !== 'ok') return { error: 'too_complex', bytes, stripped: [...stripped] };
    for (const name of resolved.dropped) drop(name);
  }
  let nodes = 0;
  let drawable = false;

  const walk = (el: Element, depth: number, hidden: boolean): void => {
    if (depth > IMAGE_MAX_DEPTH) throw new Refused();
    const local = el.localName;
    // an allowed name holds no ":", so namespaced attributes (xlink:href, xmlns:*) have no kind and go
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const a = attrs[i];
      const kind = kindOf(IMAGE_POLICY, a.name);
      let v = kind === undefined ? undefined : cleanImageValue(kind, a.value, IMAGE_POLICY);
      if (v !== undefined && kind === 'id') {
        if (ids.has(v)) v = undefined;
        else ids.add(v);
      }
      if (v === undefined) {
        el.removeAttributeNode(a);
        if (a.name !== 'xmlns' && !a.name.startsWith('xmlns:')) drop(`${short(local)}@${short(a.name)}`);
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
          drop(short(child.localName));
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
    if (e instanceof Refused) return { error: 'too_complex', bytes, stripped: [...stripped] };
    throw e;
  }
  if (!drawable) return { error: 'empty', bytes, stripped: [...stripped] };
  root.setAttribute('viewBox', viewBox);
  return { root, viewBox, ids: [...ids], stripped: [...stripped], bytes };
}

const brand = (markup: string): SanitisedImageMarkup => markup as SanitisedImageMarkup;

/** A cleaned tree as markup: attributes and text escaped, the namespace on the root. No tree gives empty markup. */
export function serializeImage(root: Element | null): SanitisedImageMarkup {
  if (!root) return brand('');
  const out: string[] = [];
  const emit = (el: Element, top: boolean): void => {
    out.push(`<${el.localName}`);
    if (top) out.push(` xmlns="${SVG_NS}"`);
    for (const a of Array.from(el.attributes)) out.push(` ${a.name}="${escapeAttr(a.value)}"`);
    if (!el.firstChild) {
      out.push('/>');
      return;
    }
    out.push('>');
    for (let c: ChildNode | null = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1) emit(c as Element, false);
      else if (c.nodeType === 3) out.push(escapeText((c as Text).data));
    }
    out.push(`</${el.localName}>`);
  };
  emit(root, true);
  return brand(out.join(''));
}

/** Sanitises a drawing to markup. The result of a refused or empty text has no markup. */
export function sanitizeImage(markup: string, options: SanitizeOptions = {}): SanitizedImage {
  const r = parseImage(markup, options);
  if ('error' in r) return { markup: serializeImage(null), viewBox: '', ids: [], stripped: r.stripped, error: r.error, bytes: r.bytes };
  const out = serializeImage(r.root);
  if (sizeOf(out) > IMAGE_MAX_BYTES) return { markup: serializeImage(null), viewBox: '', ids: [], stripped: r.stripped, error: 'too_large', bytes: sizeOf(out) };
  return { markup: out, viewBox: r.viewBox, ids: r.ids, stripped: r.stripped, bytes: r.bytes };
}

/** The cleaned tree in an inert <template>, ready to be cloned into stages. */
export function templateOf(root: Element): HTMLTemplateElement {
  const t = document.createElement('template');
  t.content.appendChild(root);
  return t;
}
