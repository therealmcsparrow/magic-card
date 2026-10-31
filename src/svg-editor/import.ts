import type { IconGeometry } from '../icons/icon-source';
import { multiply, parseTransform, shapePath, type Matrix } from '../icons/svg-geometry';
import { sanitizeSvg, SVG_MAX_BYTES, TOO_COMPLEX } from '../icons/svg-sanitize';
import { parsePath } from '../path/core';
import { readShapes } from '../svg-io/read';
import type { ReadResult, ReadShape } from '../contracts/svg-reader';
import type { SvgCssResolve } from '../contracts/svg-safety';
import { E } from './bind';
import { MAX_GROUP_DEPTH } from '../contracts/svg-editor';
import { blankDoc, closeFilled, newShape, nameFor, pruneGroups, round2, uid, type Cap, type Doc, type Group, type Join, type Paint, type Shape, type ShapeType } from './model';

// Anything in becomes a document through the sanitiser first (CRA: sanitizeSvg on every import); colours become semantic paints.

export interface Dropped {
  script: number;
  image: number;
  link: number;
  other: number;
}

export interface ImportNotes {
  dropped: Dropped;
  transforms: boolean;
  colours: boolean;
  opacity: boolean;
  /** Groups deeper than MAX_GROUP_DEPTH were merged into the last level. */
  merged?: boolean;
}

export interface ImportResult {
  doc?: Doc;
  error?: string;
  notes: ImportNotes;
}

export const NOT_SVG = 'No <svg> element found.';
const KEEP = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'title']);
const NOT_DRAWN = new Set(['defs', 'clippath', 'mask', 'lineargradient', 'radialgradient', 'stop', 'title']);
const NONE = /^(none|transparent)$/i;
const PLAIN = /^(currentcolor|inherit|black|#0{3}|#0{6})$/i;
export const emptyNotes = (): ImportNotes => ({ dropped: { script: 0, image: 0, link: 0, other: 0 }, transforms: false, colours: false, opacity: false });

function parse(text: string): Element | undefined {
  if (typeof DOMParser === 'undefined') return undefined;
  try {
    const xml = new DOMParser().parseFromString(text, 'image/svg+xml');
    const r = xml.documentElement;
    if (r && r.localName === 'svg' && !xml.getElementsByTagName('parsererror').length) return r;
  } catch {
    /* not XML: the lenient parser below */
  }
  return [...new DOMParser().parseFromString(text, 'text/html').getElementsByTagName('*')].find((e) => e.localName.toLowerCase() === 'svg');
}

/** What the sanitiser will drop, counted on the raw text (never used as content). `resolved`: the CSS resolver applies style attributes, <style> elements and `#` gradient links, so they are not counted. */
export function scanDropped(text: string, resolved = false): Dropped {
  const out: Dropped = { script: 0, image: 0, link: 0, other: 0 };
  const root = parse(text);
  if (!root) return out;
  for (const el of [root, ...root.querySelectorAll('*')]) {
    const n = el.localName.toLowerCase();
    if (n === 'script') out.script++;
    else if (n === 'image' || n === 'img') out.image++;
    else if (n === 'use' || n === 'a') out.link++;
    else if (n === 'style' && resolved) continue;
    else if (!KEEP.has(n)) out.other++;
    else
      for (const a of [...el.attributes]) {
        const k = a.name.toLowerCase();
        if (k.startsWith('on')) out.script++;
        else if (k === 'href' || k === 'xlink:href') {
          if (!(resolved && (n === 'lineargradient' || n === 'radialgradient') && a.value.trim().startsWith('#'))) out.link++;
        } else if (k === 'style' && !resolved) out.other++;
      }
  }
  return out;
}

export const droppedTotal = (d: Dropped): number => d.script + d.image + d.link + d.other;

interface Inherit {
  fill: Paint;
  stroke: Paint;
  width: number;
  cap: Cap;
  join: Join;
  rule: 'nonzero' | 'evenodd';
  accent: boolean;
}

const ROOT: Inherit = { fill: 'main', stroke: 'none', width: 1, cap: 'butt', join: 'miter', rule: 'nonzero', accent: false };

function nameKind(tag: string): ShapeType {
  return tag === 'rect' ? 'rect' : tag === 'circle' || tag === 'ellipse' ? 'ellipse' : tag === 'line' ? 'line' : tag === 'polygon' || tag === 'polyline' ? 'polygon' : 'path';
}

/**
 * Read the sanitiser's markup into shapes. `image` (image mode) maps a paint value to a tone, or undefined when it is not
 * one of the two; layer ids and names are then kept from the markup.
 */
export function readMarkup(markup: string, viewBox: string, notes: ImportNotes, name: string, image?: (paint: string) => Paint | undefined, each?: (el: Element, s: Shape) => Shape): Doc {
  const doc = blankDoc(name);
  const vb = viewBox.split(/\s+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite)) doc.vb = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
  const root = parse(markup);
  if (!root) return doc;
  const groups: Group[] = [];
  const used = new Set<string>();
  const tone = (v: string): Paint => {
    const own = image?.(v);
    if (own) return own;
    if (!NONE.test(v) && !PLAIN.test(v)) notes.colours = true;
    return NONE.test(v) ? 'none' : 'main';
  };

  /** SVG inheritance: the element's own presentation attributes over its parent's (the root <svg> and <g> included). */
  const inherit = (el: Element, inh: Inherit): Inherit => {
    const get = (k: string): string | undefined => el.getAttribute(k)?.trim();
    const p: Inherit = { ...inh };
    const f = get('fill');
    if (f !== undefined) {
      p.fill = tone(f);
    }
    const st = get('stroke');
    if (st !== undefined) {
      p.stroke = tone(st);
    }
    const w = parseFloat(get('stroke-width') ?? '');
    if (Number.isFinite(w) && w >= 0) p.width = w;
    const cap = get('stroke-linecap');
    if (cap === 'butt' || cap === 'round' || cap === 'square') p.cap = cap;
    const join = get('stroke-linejoin');
    if (join === 'miter' || join === 'round' || join === 'bevel') p.join = join;
    const rule = get('fill-rule');
    if (rule === 'evenodd' || rule === 'nonzero') p.rule = rule;
    if ((get('class') ?? '').split(/\s+/).includes('mc-accent')) p.accent = true;
    if (get('opacity') || get('fill-opacity') || get('stroke-opacity')) notes.opacity = true;
    return p;
  };

  const walk = (el: Element, m: Matrix, inh: Inherit, group: string | undefined, depth: number): void => {
    const tag = el.localName.toLowerCase();
    if (NOT_DRAWN.has(tag) || !KEEP.has(tag)) return;
    const t = el.getAttribute('transform');
    if (t) notes.transforms = true;
    const mm = t ? multiply(m, parseTransform(t)) : m;
    const p = inherit(el, inh);

    if (tag === 'g') {
      let g = group;
      let dp = depth;
      if (depth < MAX_GROUP_DEPTH) {
        const grp: Group = { id: uid('g'), name: `Group ${groups.length + 1}`, open: true, parent: group };
        groups.push(grp);
        g = grp.id;
        dp++;
      } else notes.merged = true;
      for (const c of el.children) walk(c, mm, p, g, dp);
      return;
    }
    const d = shapePath(el, tag);
    if (!d) return;
    const k = nameKind(tag);
    const fill: Paint = tag === 'line' ? 'none' : p.fill;
    const paths = parsePath(d).map((s) => E.transform(E.toEdit(s), mm)).map((x) => (fill === 'none' ? x : closeFilled(x)));
    if (!paths.length) return;
    const sw = p.width * Math.sqrt(Math.abs(mm[0] * mm[3] - mm[1] * mm[2]));
    const stroke: Paint = p.stroke !== 'none' && sw > 0 ? p.stroke : 'none';
    const own = image && el.getAttribute('id');
    const keep = own && !used.has(own) ? own : undefined;
    if (keep) used.add(keep);
    const made = newShape('path', paths, {
      ...(keep ? { id: keep } : {}),
      name: (image && el.getAttribute('data-name')) || nameFor(doc, k),
      fill: fill !== 'none' && p.accent ? 'accent' : fill,
      stroke: stroke !== 'none' && p.accent ? 'accent' : stroke,
      width: round2(sw) || 1,
      cap: p.cap,
      join: p.join,
      rule: p.rule,
      group,
    });
    doc.shapes.push(each ? each(el, made) : made);
  };

  const rm = parseTransform(root.getAttribute('transform'));
  if (root.getAttribute('transform')) notes.transforms = true;
  const rootInh = inherit(root, ROOT);
  for (const c of root.children) walk(c, rm, rootInh, undefined, 0);
  return pruneGroups({ ...doc, groups });
}

const toTone = (raw: string | undefined, fallback: Paint): Paint => (raw === undefined ? fallback : NONE.test(raw) ? 'none' : 'main');

/** The editor's document from the reader's shapes: paints become the card's tones, outlines become editable paths. */
function docFromRead(r: Extract<ReadResult, { ok: true }>, name: string, notes: ImportNotes): Doc {
  const doc = blankDoc(name);
  const vb = r.viewBox.split(/\s+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite)) doc.vb = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
  notes.transforms ||= r.notes.transforms;
  notes.colours ||= r.notes.colours;
  notes.opacity ||= r.notes.opacity;
  if (r.notes.mergedGroups) notes.merged = true;
  const groups: Group[] = r.groups.map((g, i) => ({ id: uid('g'), name: `Group ${i + 1}`, open: true }));
  r.groups.forEach((g, i) => {
    if (g.parent !== undefined) groups[i].parent = groups[g.parent].id;
  });
  r.shapes.forEach((x: ReadShape) => {
    const fill = x.from === 'line' ? 'none' : toTone(x.fill, 'main');
    const stroke = toTone(x.stroke, 'none');
    const sw = x.strokeWidth ?? 1;
    const paths = parsePath(x.d).map((p) => E.toEdit(p)).map((p) => (fill === 'none' ? p : closeFilled(p)));
    const line = stroke !== 'none' && sw > 0 ? stroke : 'none';
    doc.shapes.push(
      newShape('path', paths, {
        name: nameFor(doc, nameKind(x.from)),
        fill: fill !== 'none' && x.accent ? 'accent' : fill,
        stroke: line !== 'none' && x.accent ? 'accent' : line,
        width: round2(sw) || 1,
        cap: (x.cap as Cap | undefined) ?? 'butt',
        join: (x.join as Join | undefined) ?? 'miter',
        rule: x.evenodd ? 'evenodd' : 'nonzero',
        group: x.group === undefined ? undefined : groups[x.group].id,
      }),
    );
  });
  return pruneGroups({ ...doc, groups });
}

/** `css`: the CSS paint resolver of an open site (src/svg-safety/css-loader.ts), passed on to the sanitiser and used by nothing else. */
export function importSvg(text: string, name = 'My icon', css?: SvgCssResolve): ImportResult {
  const notes = emptyNotes();
  // size first: the sanitiser's 32 KB limit also protects the two DOM parses below
  if (new TextEncoder().encode(text).length > SVG_MAX_BYTES) return { error: 'The SVG is larger than 32 KB.', notes };
  notes.dropped = scanDropped(text, !!css);
  const s = sanitizeSvg(text, { css });
  if (s.error) return { error: s.error, notes };
  const r = readShapes(s.markup, { viewBox: s.viewBox, keepGroups: true });
  if (!r.ok) return { error: r.error === 'not_svg' ? NOT_SVG : r.error === 'empty' ? 'The SVG has no shapes to draw.' : TOO_COMPLEX, notes };
  return { doc: docFromRead(r, name, notes), notes };
}

/** A document from an icon's geometry (Home Assistant's icon database or an icon pack). */
export function fromGeometry(g: IconGeometry, name: string): Doc {
  const doc = blankDoc(name);
  const vb = g.viewBox.split(/\s+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite)) doc.vb = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
  const add = (d: string, over: Partial<Shape>): void => {
    const paths = parsePath(d).map((s) => E.toEdit(s)).map((x) => (over.fill === 'none' ? x : closeFilled(x)));
    if (paths.length) doc.shapes.push(newShape('path', paths, { name: nameFor(doc, 'path'), ...over }));
  };
  (g.secondary ?? []).forEach((d) => add(d, { fill: 'accent' }));
  g.paths.forEach((d, i) => add(d, { fill: 'main', rule: g.evenodd?.paths?.includes(i) ? 'evenodd' : 'nonzero' }));
  (g.strokes ?? []).forEach((s) => add(s.d, { fill: 'none', stroke: s.accent ? 'accent' : 'main', width: s.width, cap: (s.cap as Cap) ?? 'butt', join: (s.join as Join) ?? 'miter' }));
  return doc;
}

/** Shapes of `from` added on top of `into` (the Library panel's Insert). */
export function appendDoc(into: Doc, from: Doc): { doc: Doc; ids: string[] } {
  const gmap = new Map(from.groups.map((g) => [g.id, uid('g')]));
  const shapes = from.shapes.map((s) => ({ ...s, id: uid(), group: s.group ? gmap.get(s.group) : undefined }));
  return {
    doc: { ...into, shapes: [...into.shapes, ...shapes], groups: [...into.groups, ...from.groups.map((g) => ({ ...g, id: gmap.get(g.id)!, parent: g.parent ? gmap.get(g.parent) : undefined }))] },
    ids: shapes.map((s) => s.id),
  };
}
