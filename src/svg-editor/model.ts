import type { Box, EditPath, PathData, PrimitiveKind, Pt } from '../contracts/path-model';
import { flatten, parsePath } from '../path/core';
import { MAX_GROUP_DEPTH, type SvgArrange, type TreePlace } from '../contracts/svg-editor';
import { D, E, T } from './bind';

/*
 * The icon document: layers (shapes) over one artboard. Shapes are immutable values (every edit makes a
 * new one), so the history is a list of whole documents and a drag is one step. A shape holds one or
 * more subpaths as anchors (path-model EditPath) and the semantic paint of the card: None, Main (the
 * entity colour) or Accent (the second colour). Pure: no DOM, no lit.
 */

export type Paint = 'none' | 'main' | 'accent';
export type ShapeType = 'path' | 'rect' | 'ellipse' | 'line' | 'polygon' | 'star';
export type Cap = 'butt' | 'round' | 'square';
export type Join = 'miter' | 'round' | 'bevel';
export type M6 = [number, number, number, number, number, number];

export interface Shape {
  id: string;
  name: string;
  type: ShapeType;
  paths: EditPath[];
  /** rect corner radius */
  r?: number;
  /** polygon / star: corners, inner radius as a share of the outer one, centre and outer radius */
  sides?: number;
  inner?: number;
  geo?: { cx: number; cy: number; rad: number };
  fill: Paint;
  stroke: Paint;
  width: number;
  cap: Cap;
  join: Join;
  rule: 'nonzero' | 'evenodd';
  angle?: number;
  hidden?: boolean;
  locked?: boolean;
  group?: string;
  /** Paint is still the tool's default: closing a pen path turns it into a fill. */
  auto?: boolean;
}

export interface Group {
  id: string;
  name: string;
  hidden?: boolean;
  locked?: boolean;
  open?: boolean;
  /** The enclosing group (absent = top level). Shape.group is the innermost group. */
  parent?: string;
}

export interface Doc {
  name: string;
  vb: Box;
  shapes: Shape[];
  groups: Group[];
}

export const MAX_BOX = 4096;
let seq = 0;
export const uid = (p = 's'): string => `${p}${(++seq).toString(36)}`;

export const blankDoc = (name = ''): Doc => ({ name, vb: { x: 0, y: 0, w: 24, h: 24 }, shapes: [], groups: [] });
export const is24 = (d: Doc): boolean => d.vb.w === 24 && d.vb.h === 24;

const r2 = (v: number): number => Math.round(v * 100) / 100 || 0;
export const round2 = r2;

export function newShape(type: ShapeType, paths: EditPath[], over: Partial<Shape> = {}): Shape {
  return { id: uid(), name: '', type, paths, fill: 'main', stroke: 'none', width: 2, cap: 'round', join: 'round', rule: 'nonzero', ...over };
}

const NAMES: Record<ShapeType, string> = { path: 'Path', rect: 'Rectangle', ellipse: 'Ellipse', line: 'Line', polygon: 'Polygon', star: 'Star' };
export function nameFor(d: Doc, type: ShapeType, plain?: string): string {
  const base = plain ?? NAMES[type];
  const used = new Set(d.shapes.map((s) => s.name));
  if (plain && !used.has(plain)) return plain;
  for (let i = plain ? 2 : 1; ; i++) if (!used.has(`${base} ${i}`)) return `${base} ${i}`;
}

/**
 * A filled subpath is closed whether or not the markup says Z (the fill closes it): ending on its own
 * start folds the duplicate end point into the first anchor, anything else gets a closing line.
 */
export function closeFilled(p: EditPath): EditPath {
  const a = p.anchors;
  if (p.closed || a.length < 3) return p;
  const f = a[0];
  const l = a[a.length - 1];
  if (Math.hypot(f.x - l.x, f.y - l.y) < 1e-3 && a.length > 3) return { anchors: [{ ...f, in: l.in }, ...a.slice(1, -1)], closed: true };
  return { anchors: a, closed: true };
}

export const toEditPaths = (d: string): EditPath[] => parsePath(d).map((s) => E.toEdit(s));

// ── geometry ──

export function pathsBounds(paths: EditPath[]): Box | undefined {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of paths) {
    if (!p.anchors.length) continue;
    for (const q of flatten(E.fromEdit(p), 16)) {
      x0 = Math.min(x0, q[0]);
      y0 = Math.min(y0, q[1]);
      x1 = Math.max(x1, q[0]);
      y1 = Math.max(y1, q[1]);
    }
  }
  return x0 === Infinity ? undefined : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function unionBox(boxes: Array<Box | undefined>): Box | undefined {
  const b = boxes.filter((x): x is Box => !!x);
  if (!b.length) return undefined;
  const x = Math.min(...b.map((q) => q.x));
  const y = Math.min(...b.map((q) => q.y));
  return { x, y, w: Math.max(...b.map((q) => q.x + q.w)) - x, h: Math.max(...b.map((q) => q.y + q.h)) - y };
}

export const shapeBox = (s: Shape): Box | undefined => pathsBounds(s.paths);
export const boxOf = (shapes: Shape[]): Box | undefined => unionBox(shapes.map(shapeBox));

/** Anchors in the whole document. */
export const pointCount = (d: Doc): number => d.shapes.reduce((n, s) => n + s.paths.reduce((m, p) => m + p.anchors.length, 0), 0);

/** Generated outlines of the tool shapes (a box, or centre and radius). */
export function generate(s: Shape, box: Box): EditPath[] {
  switch (s.type) {
    case 'rect':
      return toEditPaths(D.rectPath(box.x, box.y, box.w, box.h, s.r ?? 0));
    case 'ellipse':
      return toEditPaths(D.ellipsePath(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2));
    case 'polygon':
    case 'star': {
      const g = s.geo ?? { cx: box.x + box.w / 2, cy: box.y + box.h / 2, rad: Math.min(box.w, box.h) / 2 };
      const n = s.sides ?? 5;
      return toEditPaths(s.type === 'star' ? D.starPath(g.cx, g.cy, g.rad, g.rad * (s.inner ?? 0.5), n) : D.polygonPath(g.cx, g.cy, g.rad, n));
    }
    default:
      return s.paths;
  }
}

/** A shape drawn from two corners (drag, two clicks or keyboard). */
export function fromCorners(d: Doc, type: Exclude<ShapeType, 'path'>, a: Pt, b: Pt, o: { r?: number; sides?: number; inner?: number; square?: boolean } = {}): Shape {
  let w = b[0] - a[0];
  let h = b[1] - a[1];
  if (o.square && type !== 'line') {
    const m = Math.max(Math.abs(w), Math.abs(h));
    w = Math.sign(w || 1) * m;
    h = Math.sign(h || 1) * m;
  }
  const box: Box = { x: Math.min(a[0], a[0] + w), y: Math.min(a[1], a[1] + h), w: Math.abs(w), h: Math.abs(h) };
  const name = nameFor(d, type);
  if (type === 'line') {
    const paths: EditPath[] = [{ anchors: [{ x: a[0], y: a[1] }, { x: a[0] + w, y: a[1] + h }], closed: false }];
    return newShape('line', paths, { name, fill: 'none', stroke: 'main' });
  }
  const s = newShape(type, [], { name, r: type === 'rect' ? o.r ?? 0 : undefined, sides: o.sides, inner: o.inner });
  if (type === 'polygon' || type === 'star') s.geo = { cx: box.x + box.w / 2, cy: box.y + box.h / 2, rad: Math.min(box.w, box.h) / 2 };
  s.paths = generate(s, box);
  return s;
}

/** A primitive (heart, arrow, ...) drawn from two corners: a plain, filled, editable path named after the kind. */
export function fromPrimitive(d: Doc, kind: PrimitiveKind, name: string, a: Pt, b: Pt, square: boolean): Shape {
  let w = b[0] - a[0];
  let h = b[1] - a[1];
  if (square) {
    const m = Math.max(Math.abs(w), Math.abs(h));
    w = Math.sign(w || 1) * m;
    h = Math.sign(h || 1) * m;
  }
  const box: Box = { x: Math.min(a[0], a[0] + w), y: Math.min(a[1], a[1] + h), w: Math.abs(w), h: Math.abs(h) };
  return newShape('path', [D.primitive(kind, box)], { name: nameFor(d, 'path', name) });
}

/** The shape as plain path data (its type options no longer apply). */
export const asPath = (s: Shape): Shape => (s.type === 'path' ? s : { ...s, type: 'path', r: undefined, sides: undefined, inner: undefined, geo: undefined });

export function moveShape(s: Shape, dx: number, dy: number): Shape {
  if (!dx && !dy) return s;
  const out = { ...s, paths: s.paths.map((p) => E.translate(p, dx, dy)) };
  if (s.geo) out.geo = { ...s.geo, cx: s.geo.cx + dx, cy: s.geo.cy + dy };
  return out;
}

export function transformShape(s: Shape, m: M6, keep = false): Shape {
  const out = { ...(keep ? s : asPath(s)), paths: s.paths.map((p) => E.transform(p, m)) };
  return out;
}

const mat = (a: number, b: number, c: number, d: number, e: number, f: number): M6 => [a, b, c, d, e, f];

/** Scale from one box to another (the union box of a selection). */
export function boxMatrix(from: Box, to: Box): M6 {
  const sx = from.w > 1e-9 ? to.w / from.w : 1;
  const sy = from.h > 1e-9 ? to.h / from.h : 1;
  return mat(sx, 0, 0, sy, to.x - from.x * sx, to.y - from.y * sy);
}

export function rotateMatrix(deg: number, c: Pt): M6 {
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return mat(cos, sin, -sin, cos, c[0] - c[0] * cos + c[1] * sin, c[1] - c[0] * sin - c[1] * cos);
}

export const flipMatrix = (axis: 'h' | 'v', c: Pt): M6 => (axis === 'h' ? mat(-1, 0, 0, 1, 2 * c[0], 0) : mat(1, 0, 0, -1, 0, 2 * c[1]));

/** A rect or ellipse stays itself when scaled or moved; anything else becomes plain path data. */
export function setShapeBox(s: Shape, from: Box, to: Box): Shape {
  if (s.type === 'rect' || s.type === 'ellipse') {
    const b = shapeBox(s);
    if (!b) return s;
    const m = boxMatrix(from, to);
    const nb: Box = { x: m[0] * b.x + m[4], y: m[3] * b.y + m[5], w: b.w * m[0], h: b.h * m[3] };
    return { ...s, paths: generate(s, nb) };
  }
  return transformShape(s, boxMatrix(from, to));
}

/** Regenerate after a type option changed (corner radius, corners, inner radius). */
export function retype(s: Shape, patch: Partial<Pick<Shape, 'r' | 'sides' | 'inner'>>): Shape {
  const n = { ...s, ...patch };
  const b = shapeBox(s);
  if (!b) return n;
  if (s.type === 'rect') n.r = Math.max(0, Math.min(n.r ?? 0, b.w / 2, b.h / 2));
  return { ...n, paths: generate(n, b) };
}

// ── layers ──

/** Which tone a layer paints: Main, Accent, or both (fill and stroke differ). */
export const toneOf = (s: Shape): 'main' | 'accent' | 'both' => {
  const a = s.fill === 'accent' || s.stroke === 'accent';
  return a ? (s.fill === 'main' || s.stroke === 'main' ? 'both' : 'accent') : 'main';
};

export const byId = (d: Doc, id: string): Shape | undefined => d.shapes.find((s) => s.id === id);
export const replaceShape = (d: Doc, s: Shape): Doc => ({ ...d, shapes: d.shapes.map((x) => (x.id === s.id ? s : x)) });
export const mapShapes = (d: Doc, ids: readonly string[], f: (s: Shape) => Shape): Doc => ({ ...d, shapes: d.shapes.map((s) => (ids.includes(s.id) ? f(s) : s)) });

export function removeShapes(d: Doc, ids: readonly string[]): Doc {
  return pruneGroups({ ...d, shapes: d.shapes.filter((s) => !ids.includes(s.id)) });
}

export function duplicateShapes(d: Doc, ids: readonly string[]): { doc: Doc; ids: string[] } {
  const out: Shape[] = [];
  const made: string[] = [];
  for (const s of d.shapes) {
    out.push(s);
    if (ids.includes(s.id)) {
      const c: Shape = { ...s, id: uid(), name: `${s.name} copy`, paths: s.paths.map((p) => ({ anchors: p.anchors.map((a) => ({ ...a })), closed: p.closed })) };
      out.push(c);
      made.push(c.id);
    }
  }
  return { doc: { ...d, shapes: out }, ids: made };
}

/** The selected items move as a block and keep their order; Forward / Backward pass one unselected neighbour. */
function blockMove<T>(list: T[], on: (t: T) => boolean, how: SvgArrange): T[] {
  const a = list.slice();
  if (how === 'front') return [...a.filter((x) => !on(x)), ...a.filter(on)];
  if (how === 'back') return [...a.filter(on), ...a.filter((x) => !on(x))];
  if (how === 'forward') {
    for (let i = a.length - 2; i >= 0; i--) if (on(a[i]) && !on(a[i + 1])) [a[i], a[i + 1]] = [a[i + 1], a[i]];
  } else {
    for (let i = 1; i < a.length; i++) if (on(a[i]) && !on(a[i - 1])) [a[i], a[i - 1]] = [a[i - 1], a[i]];
  }
  return a;
}

/**
 * Arrange order within each item's sibling list: the top level or the group a layer belongs to, at every
 * depth (a group counts as one unit once all its layers are selected). Returns the same document when
 * nothing would move (the limit).
 */
export function arrangeOrder(d: Doc, ids: readonly string[], how: SvgArrange): Doc {
  const sel = new Set(ids);
  const full = (n: TNode): boolean => (n.s ? sel.has(n.id) : n.kids!.every(full));
  const go = (list: TNode[]): TNode[] => {
    list.forEach((n) => n.kids && (n.kids = go(n.kids)));
    return blockMove(list, full, how);
  };
  const out = build(d, go(tree(d)));
  return out.shapes.every((s, i) => s === d.shapes[i]) ? d : out;
}

/** Move one shape up (+1) or down (-1) in the drawing order. */
export const moveOrder = (d: Doc, id: string, dir: 1 | -1): Doc => arrangeOrder(d, [id], dir === 1 ? 'forward' : 'backward');

// ── groups: parent pointers over the flat, paint-ordered list ──

/** A tree node in paint order (first = bottom): a shape, or a group with kids. */
interface TNode {
  id: string;
  s?: Shape;
  kids?: TNode[];
}

/** The group and its ancestors, innermost first. */
export function groupChain(d: Doc, id?: string): Group[] {
  const out: Group[] = [];
  for (let g = d.groups.find((x) => x.id === id); g && out.length < 9; g = d.groups.find((x) => x.id === g!.parent)) out.push(g);
  return out;
}

/** Hidden or locked itself or through any ancestor group. */
export const isOff = (d: Doc, s: Shape, k: 'hidden' | 'locked'): boolean => !!(s[k] || groupChain(d, s.group).some((g) => g[k]));

/** The layers under a group, at all depths, in paint order. */
export const under = (d: Doc, id: string): Shape[] => d.shapes.filter((s) => groupChain(d, s.group).some((g) => g.id === id));

function tree(d: Doc): TNode[] {
  const root: TNode[] = [];
  const at = new Map<string, TNode>();
  for (const s of d.shapes) {
    let list = root;
    for (const g of groupChain(d, s.group).reverse()) {
      let n = at.get(g.id);
      if (!n) {
        n = { id: g.id, kids: [] };
        at.set(g.id, n);
        list.push(n);
      }
      list = n.kids!;
    }
    list.push({ id: s.id, s });
  }
  return root;
}

/** The flat document again: shapes in tree order, group and parent set, groups left with no layer dropped. */
function build(d: Doc, root: TNode[]): Doc {
  const shapes: Shape[] = [];
  const gs = new Map<string, Group>();
  const walk = (list: TNode[], parent?: string): number => {
    let n = 0;
    for (const k of list) {
      if (k.s) {
        shapes.push(k.s.group === parent ? k.s : { ...k.s, group: parent });
        n++;
      } else {
        const g = d.groups.find((x) => x.id === k.id)!;
        const c = walk(k.kids!, k.id);
        if (c) gs.set(g.id, g.parent === parent ? g : { ...g, parent });
        n += c;
      }
    }
    return n;
  };
  walk(root);
  return { ...d, shapes, groups: d.groups.filter((g) => gs.has(g.id)).map((g) => gs.get(g.id)!) };
}

type Loc = Map<string, { list: TNode[]; parent?: string; n: TNode }>;

/** Where every node sits: its list, its parent group and the node. */
function locate(root: TNode[]): Loc {
  const m: Loc = new Map();
  const walk = (list: TNode[], parent?: string): void => list.forEach((n) => (m.set(n.id, { list, parent, n }), n.kids && walk(n.kids, n.id)));
  walk(root);
  return m;
}

const height = (n: TNode): number => (n.kids ? 1 + Math.max(0, ...n.kids.map(height)) : 0);

/** Drops groups with no layer under them (I4). */
export function pruneGroups(d: Doc): Doc {
  const used = new Set(d.shapes.flatMap((s) => groupChain(d, s.group).map((g) => g.id)));
  return d.groups.every((g) => used.has(g.id)) ? d : { ...d, groups: d.groups.filter((g) => used.has(g.id)) };
}

/**
 * Group items (layer ids, or group ids) in the parent of the top-most one, at its place; items from other
 * parents move in. A group whose layers are all picked counts as one item. Refused (same document, no
 * group) with fewer than two items or when an item would end up deeper than MAX_GROUP_DEPTH.
 */
export function groupItems(d: Doc, ids: readonly string[]): { doc: Doc; group?: string } {
  const sel = new Set(ids.flatMap((i) => (d.groups.some((g) => g.id === i) ? under(d, i).map((s) => s.id) : [i])));
  const items: string[] = [];
  for (const s of d.shapes) {
    if (!sel.has(s.id)) continue;
    let it = s.id;
    for (const g of groupChain(d, s.group)) if (under(d, g.id).every((x) => sel.has(x.id))) it = g.id;
    if (!items.includes(it)) items.push(it);
  }
  const root = tree(d);
  const loc = locate(root);
  const top = loc.get(items[items.length - 1]);
  if (items.length < 2 || !top) return { doc: d };
  const depth = groupChain(d, top.parent).length + 1;
  if (items.some((i) => depth + height(loc.get(i)!.n) > MAX_GROUP_DEPTH)) return { doc: d };
  const g: Group = { id: uid('g'), name: `Group ${d.groups.length + 1}`, open: true };
  const list = top.list;
  const at = list.slice(0, list.indexOf(top.n) + 1).filter((n) => !items.includes(n.id)).length;
  const nodes = items.map((i) => loc.get(i)!.n);
  for (const i of items) {
    const l = loc.get(i)!;
    l.list.splice(l.list.indexOf(l.n), 1);
  }
  list.splice(at, 0, { id: g.id, kids: nodes });
  return { doc: build({ ...d, groups: [...d.groups, g] }, root), group: g.id };
}

export const groupShapes = groupItems;

/** The group's items go to its parent at its place. */
export function ungroup(d: Doc, groupId: string): Doc {
  const root = tree(d);
  const at = locate(root).get(groupId);
  if (!at?.n.kids) return d;
  at.list.splice(at.list.indexOf(at.n), 1, ...at.n.kids);
  return build(d, root);
}

/** A row of the layer tree, top first: a layer or a group, its level (1 = top), place among its siblings (top = 0) and direct item count. */
export interface TreeRow {
  id: string;
  group: boolean;
  parent?: string;
  level: number;
  index: number;
  size: number;
  kids: number;
}

/** The tree as rows in display order; `all` also lists the content of collapsed groups. */
export function layoutRows(d: Doc, all = false): TreeRow[] {
  const out: TreeRow[] = [];
  const walk = (list: TNode[], level: number, parent?: string): void =>
    list
      .slice()
      .reverse()
      .forEach((n, index) => {
        out.push({ id: n.id, group: !n.s, parent, level, index, size: list.length, kids: n.kids?.length ?? 0 });
        if (n.kids && (all || d.groups.find((g) => g.id === n.id)?.open !== false)) walk(n.kids, level + 1, n.id);
      });
  walk(tree(d), 1);
  return out;
}

export type MoveWhy = 'self' | 'depth' | 'locked' | 'none';

/** Move an item (layer or group id) to a place in the layer tree; `why` says why it was refused (doc stays). */
export function tryMove(d: Doc, id: string, place: TreePlace): { doc: Doc; why?: MoveWhy } {
  const root = tree(d);
  const loc = locate(root);
  const it = loc.get(id);
  const to = place.parent ? loc.get(place.parent) : undefined;
  const no = (why: MoveWhy) => ({ doc: d, why });
  if (!it || (place.parent && !to?.n.kids)) return no('none');
  if (place.parent && (place.parent === id || locate(it.n.kids ?? []).has(place.parent))) return no('self');
  const up = groupChain(d, place.parent ?? undefined);
  if (up.some((g) => g.locked)) return no('locked');
  if (up.length + height(it.n) > MAX_GROUP_DEPTH) return no('depth');
  it.list.splice(it.list.indexOf(it.n), 1);
  const list = to ? to.n.kids! : root;
  list.splice(list.length - Math.max(0, Math.min(place.index, list.length)), 0, it.n);
  return { doc: build(d, root) };
}

export const moveItem = (d: Doc, id: string, place: TreePlace): Doc => tryMove(d, id, place).doc;

// ── export ──

const attr = (n: string, v: string | number): string => ` ${n}="${String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}"`;
export const bytesOf = (s: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length);

export const toPathData = (paths: EditPath[]): PathData => paths.filter((p) => p.anchors.length > 1).map((p) => E.fromEdit(p));

/** The SVG elements of one shape: one, or two when its fill and stroke differ in accent. */
function shapeElements(s: Shape, decimals: number): string[] {
  const data = toPathData(s.paths);
  if (!data.length) return [];
  const d = T.tidyPath(data, { decimals });
  if (!d) return [];
  const fillOn = s.fill !== 'none';
  const strokeOn = s.stroke !== 'none' && s.width > 0;
  const strokeAttrs = attr('stroke', 'currentColor') + attr('stroke-width', r2(s.width)) + (s.cap !== 'butt' ? attr('stroke-linecap', s.cap) : '') + (s.join !== 'miter' ? attr('stroke-linejoin', s.join) : '');
  const one = (accent: boolean, fill: boolean, stroke: boolean): string =>
    `<path${accent ? attr('class', 'mc-accent') : ''}${attr('d', d)}${fill ? (s.rule === 'evenodd' ? attr('fill-rule', 'evenodd') : '') : attr('fill', 'none')}${stroke ? strokeAttrs : ''}/>`;
  if (fillOn && strokeOn && (s.fill === 'accent') !== (s.stroke === 'accent')) return [one(s.fill === 'accent', true, false), one(s.stroke === 'accent', false, true)];
  if (fillOn || strokeOn) return [one(fillOn ? s.fill === 'accent' : s.stroke === 'accent', fillOn, strokeOn)];
  return [];
}

/** The document as SVG markup (not yet through the sanitiser). Hidden layers and groups are left out; groups nest as bare <g>. */
export function toSvg(d: Doc, decimals = 2): string {
  const emit = (list: TNode[]): string =>
    list
      .map((n) => {
        if (n.s) return n.s.hidden ? '' : shapeElements(n.s, decimals).join('');
        const inner = d.groups.find((g) => g.id === n.id)?.hidden ? '' : emit(n.kids!);
        return inner && `<g>${inner}</g>`;
      })
      .join('');
  const v = d.vb;
  return `<svg viewBox="${r2(v.x)} ${r2(v.y)} ${r2(v.w)} ${r2(v.h)}">${emit(tree(d))}</svg>`;
}

/** Shapes that reach outside the 20 x 20 live area of a 24 x 24 icon (design W4). */
export function outsideSafe(d: Doc): string[] {
  if (!is24(d)) return [];
  return d.shapes.filter((s) => {
    const b = shapeBox(s);
    return !!b && !s.hidden && (b.x < 1.995 || b.y < 1.995 || b.x + b.w > 22.005 || b.y + b.h > 22.005);
  }).map((s) => s.id);
}
