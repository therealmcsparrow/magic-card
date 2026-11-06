import { html, svg, type TemplateResult } from 'lit';
import { IMAGE_PART_CLASS } from '../contracts/image-editor';
import type { EditPath } from '../contracts/path-model';
import type { Shape } from '../svg-editor/model';
import type { ImageExt } from './chunk';
import { t } from './i18n';
import { K } from './kit';

// Imported parts: runs of adjacent elements the editor cannot edit, each kept as one locked layer with its markup.
// On the canvas they are drawn from the svg-image api nodes (api.fragment), never from a string of this chunk.

export interface Part {
  /** The part's markup, with the attribute-carrying groups above it wrapped round it. */
  m: string;
  /** The definitions it uses (clip paths, masks, gradients), by id. */
  d: Map<string, string>;
  /** Every id in it, so new ids can avoid them. */
  i: string[];
}

/** Where a part came from: the element, and the attributes of the groups above it. */
export interface Held {
  el: Element;
  ctx: string[];
  /** A group this editor wrote for a part: its content is the part and it is never joined to its neighbours. */
  own?: boolean;
}

const NS = 'http://www.w3.org/2000/svg';
const SKIP = /^(?:id|data-name|class|viewBox|preserveAspectRatio|x|y|width|height|xmlns.*)$|:/;
const NOT_DRAWN = /^(?:defs|clipPath|mask|linearGradient|radialGradient|title)$/;
const PREFIX = 'mc-part-';
const CLASS = IMAGE_PART_CLASS;
const ser = (e: Element): string => new XMLSerializer().serializeToString(e).replace(/ xmlns="[^"]*"/, '');

/** Clipping, masks and transparency of a fill, a stroke or a whole group are not something the editor can write back. */
const lossy = (e: Element): boolean => e.matches('[clip-path]:not([clip-path=none]),[mask]:not([mask=none]),[fill-opacity],[stroke-opacity],g[opacity],svg[opacity]');

const escAttr = (v: string): string => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The attributes of every group above `el` that carries any, from the outside in. */
export function contextOf(el: Element): string[] {
  const out: string[] = [];
  for (let e = el.parentElement; e; e = e.parentElement) {
    const a = [...e.attributes]
      .filter((x) => !SKIP.test(x.name))
      .map((x) => ` ${x.name}="${escAttr(x.value)}"`)
      .join('');
    if (a) out.unshift(a);
  }
  return out;
}

/**
 * Takes every part that is visible from the tree itself (clipped or masked elements, groups with opacity, text the editor
 * cannot read) out of `xml` and leaves a one-unit rectangle in its place that carries the id and name. The held elements
 * are returned by the number written on the rectangle.
 */
export function lift(xml: Document, readable: (el: Element) => boolean): Map<string, Held> {
  const held = new Map<string, Held>();
  const take = (el: Element): void => {
    const mark = xml.createElementNS(el.namespaceURI, 'rect');
    for (const k of ['id', 'data-name']) {
      const v = el.getAttribute(k);
      if (v !== null) mark.setAttribute(k, v);
    }
    mark.setAttribute('width', '1');
    mark.setAttribute('height', '1');
    mark.setAttribute('data-mc-part', String(held.size));
    held.set(String(held.size), { el, ctx: contextOf(el), own: el.getAttribute('class') === CLASS });
    el.replaceWith(mark);
  };
  const walk = (box: Element, all: boolean): void => {
    for (const c of [...box.children]) {
      if (NOT_DRAWN.test(c.localName)) continue;
      if (all || lossy(c) || c.getAttribute('class') === CLASS) take(c);
      else if (c.localName === 'g') walk(c, false);
      else if (c.localName === 'text' && !readable(c)) take(c);
    }
  };
  walk(xml.documentElement, lossy(xml.documentElement));
  return held;
}

/** The definitions the markup refers to (and those they refer to), taken from the whole drawing. */
function definitions(xml: Document, m: string): Map<string, string> {
  const d = new Map<string, string>();
  const todo = [m];
  for (let s = todo.pop(); s !== undefined; s = todo.pop()) {
    for (const r of s.matchAll(/url\(#([^)\s]+)\)/g)) {
      const e = d.has(r[1]) ? null : xml.getElementById(r[1]);
      if (!e) continue;
      const text = ser(e);
      d.set(r[1], text);
      todo.push(text);
    }
  }
  return d;
}

/** The box of the part in drawing units, read the way the editor reads any drawing. */
function boxOf(m: string, fallback: { w: number; h: number }): { x: number; y: number; w: number; h: number } {
  const vb = `0 0 ${fallback.w} ${fallback.h}`;
  const doc = K.readMarkup(`<svg viewBox="${vb}">${m}</svg>`, vb, K.emptyNotes(), '');
  return K.shapeBox({ paths: doc.shapes.flatMap((s) => s.paths) } as Shape) ?? { x: 0, y: 0, ...fallback };
}

/**
 * One locked layer for a run of held elements. `at` is the placeholder the reader made for the first of them: its id and
 * place are kept, and the markup of the first element loses its id because the layer carries it.
 */
export function layerOf(at: Shape, run: Held[], xml: Document, vb: { w: number; h: number }, n: number): Shape {
  const first = run[0].el;
  const own = first.getAttribute('data-name');
  if (first.getAttribute('id') === at.id) first.removeAttribute('id');
  const ctx = run[0].ctx;
  const body = run[0].own ? [...first.children].map(ser).join('') : run.map((h) => ser(h.el)).join('');
  const m = ctx.map((a) => `<g${a}>`).join('') + body + '</g>'.repeat(ctx.length);
  const d = definitions(xml, m);
  const ids = [...m.matchAll(/\bid="([^"]+)"/g)].map((r) => r[1]);
  const b = boxOf(m, vb);
  const outline: EditPath = { anchors: [{ x: b.x, y: b.y }, { x: b.x + b.w, y: b.y }, { x: b.x + b.w, y: b.y + b.h }, { x: b.x, y: b.y + b.h }], closed: true };
  return { ...at, name: own || (n > 1 ? `${t('image-editor.part.imported-part')} ${n}` : t('image-editor.part.imported-part')), fill: 'main', stroke: 'none', locked: true, paths: [outline], look: { part: { m, d, i: [...ids, ...d.keys()] } } };
}

// ── out ──

// eslint-disable-next-line no-control-regex
export const plain = (s: string): string => s.replace(/[<>"&\\\u0000-\u001f]/g, '').slice(0, 80);

/** The element a part is saved as: a group with the layer's id and name round its markup. */
export const partOut = (s: Shape, p: Part): string => `<g id="${s.id}" class="${CLASS}" data-name="${plain(s.name)}">${p.m}</g>`;

/** The definitions of every part that is written, once each. */
export function partDefs(shapes: readonly Shape[]): string[] {
  const all = new Map<string, string>();
  for (const s of shapes) if (!s.hidden) for (const [id, text] of s.look?.part?.d ?? []) all.set(id, text);
  return [...all.values()];
}

// ── canvas ──

const drawn = new WeakMap<Part, Element[]>();

/** Names of 56 characters or fewer keep their name behind the prefix; a longer one (ids may have 64) is shortened to a fixed-length digest, the same way every time. */
function prefixed(id: string): string {
  if (id.length <= 64 - PREFIX.length) return PREFIX + id;
  let a = 5381;
  let b = 52711;
  for (let i = 0; i < id.length; i++) {
    a = (Math.imul(a, 33) ^ id.charCodeAt(i)) >>> 0;
    b = (Math.imul(b, 31) + id.charCodeAt(i)) >>> 0;
  }
  return PREFIX + a.toString(36) + b.toString(36);
}

/** Ids and classes of a part never reach the editor's own lookups: ids get a prefix (and the references to them), classes go. */
function prepare(e: Element): void {
  const id = e.getAttribute('id');
  if (id) e.setAttribute('id', prefixed(id));
  e.removeAttribute('class');
  for (const a of [...e.attributes]) if (a.value.includes('url(#')) a.value = a.value.replace(/url\(#([^)\s]+)\)/g, (_m, ref: string) => `url(#${prefixed(ref)})`);
  [...e.children].forEach(prepare);
}

/** The layer on the canvas: the nodes the svg-image api made from the part's markup. */
export function partNode(x: ImageExt, s: Shape): TemplateResult | undefined {
  const p = s.look?.part;
  if (!p) return undefined;
  let nodes = drawn.get(p);
  if (!nodes) {
    const first = x.api.fragment(`<svg xmlns="${NS}" viewBox="0 0 1 1"><defs>${[...p.d.values()].join('')}</defs>${p.m}</svg>`)?.firstElementChild;
    if (first) prepare(first);
    // the prefixes were written into the cleaned nodes, so what is drawn is cleaned once more, last
    const root = first ? x.api.fragment(new XMLSerializer().serializeToString(first))?.firstElementChild : undefined;
    nodes = root ? [...root.childNodes] as Element[] : [];
    drawn.set(p, nodes as Element[]);
  }
  return svg`<g style="--mc-image-main:var(--m);--mc-image-accent:var(--a)">${nodes.map((n) => n.cloneNode(true))}</g>`;
}

// ── inspector ──

/** What can be done with an imported part, in the inspector. */
export const partRows = (s: Shape): TemplateResult | undefined => (s.look?.part ? html`<p class="help">${t('image-editor.part.rename-reorder-hide-or-delete-it')}</p>` : undefined);

export const partColours = (): TemplateResult => html`<p class="help">${t('image-editor.part.this-part-keeps-its-own-colours')}</p>`;
