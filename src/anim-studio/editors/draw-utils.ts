import { toCubicSubpaths } from '../../path/core';
import { EPS, bez, dist, segDist, type Cubic, type Pt } from '../../path/draw';
import { fmtNum } from '../../path/edit';
import { ANIMATION_CAPS, type AnimationDoc, type AnimationKeyframe } from '../model';
import { V2_CAPS, type RigShape, type TargetRef, type Track } from '../model-v2';
import { t } from '../i18n';

/*
 * Drawing on the icon, pure: freehand simplification (Ramer-Douglas-Peucker for corners, then a
 * least-squares cubic fit per stretch, after Schneider's "An algorithm for automatically fitting
 * digitized curves", Graphics Gems 1990), shape paths (line, rounded rectangle, ellipse), snapping
 * to a grid and to anchor points, hit testing, viewBox mapping, and the document edits the drawing
 * tools make (shapes in rig.shapes, their draw-on and motion-path tracks). Coordinates are icon
 * viewBox units (24 x 24 for MDI icons); nothing here knows about the stage.
 */

export type { Pt, Cubic };

export { MAX_FREEHAND_SAMPLES, MAX_FREEHAND_SEGMENTS, dedupePoints, ellipsePath, fitCubics, fitFreehand, linePath, rdp, rdpIndices, rectPath, type FreehandResult } from '../../path/draw';
const r2 = (v: number): number => Math.round(v * 100) / 100;
const fp = (p: Pt): string => `${fmtNum(p[0])} ${fmtNum(p[1])}`;

/** The box a drag from `a` to `b` spans; `square` evens the sides, `fromCentre` grows around `a`. */
export function dragBox(a: Pt, b: Pt, square: boolean, fromCentre: boolean): { x: number; y: number; w: number; h: number } {
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  if (square) {
    const m = Math.max(Math.abs(dx), Math.abs(dy));
    dx = Math.sign(dx || 1) * m;
    dy = Math.sign(dy || 1) * m;
  }
  if (fromCentre) return { x: r2(a[0] - Math.abs(dx)), y: r2(a[1] - Math.abs(dy)), w: r2(Math.abs(dx) * 2), h: r2(Math.abs(dy) * 2) };
  return { x: r2(Math.min(a[0], a[0] + dx)), y: r2(Math.min(a[1], a[1] + dy)), w: r2(Math.abs(dx)), h: r2(Math.abs(dy)) };
}

// ── path data helpers ──

const isClosedSub = (s: Cubic[]): boolean => s.length > 1 && dist(s[0][0], s[s.length - 1][3]) < 1e-6;

/** Cubic subpaths -> compact path data (L for straight segments, Z for closed subpaths). */
export function cubicsToD(subs: Cubic[][]): string {
  const out: string[] = [];
  for (const s of subs) {
    if (!s.length) continue;
    const closed = isClosedSub(s);
    out.push(`M${fp(s[0][0])}`);
    s.forEach((c, i) => {
      const straight = segDist(c[1], c[0], c[3]) < 1e-4 && segDist(c[2], c[0], c[3]) < 1e-4;
      if (straight) {
        if (!(closed && i === s.length - 1)) out.push(`L${fp(c[3])}`);
      } else out.push(`C${fp(c[1])} ${fp(c[2])} ${fp(c[3])}`);
    });
    if (closed) out.push('Z');
  }
  return out.join(' ');
}

/** Every point of the path through `fn` (an affine map keeps the shape exact). */
export function mapD(d: string, fn: (p: Pt) => Pt): string {
  return cubicsToD(toCubicSubpaths(d).map((s) => s.map((c) => c.map(fn) as Cubic)));
}

export const translateD = (d: string, dx: number, dy: number): string => mapD(d, (p) => [p[0] + dx, p[1] + dy]);

/** Anchor points of every subpath (a closed subpath's return to its start not repeated). */
export function anchorsOf(d: string): Pt[] {
  const out: Pt[] = [];
  for (const s of toCubicSubpaths(d)) {
    if (!s.length) continue;
    out.push([s[0][0][0], s[0][0][1]]);
    s.forEach((c, i) => {
      if (i === s.length - 1 && isClosedSub(s)) return;
      out.push([c[3][0], c[3][1]]);
    });
  }
  return out.map((p) => [r2(p[0]), r2(p[1])]);
}

/** Sampled outline of each subpath (for hit tests and bounds). */
function flatten(d: string, steps = 12): Pt[][] {
  return toCubicSubpaths(d).map((s) => {
    const pts: Pt[] = s.length ? [s[0][0]] : [];
    for (const c of s) for (let i = 1; i <= steps; i++) pts.push(bez(c, i / steps));
    return pts;
  });
}

/** Bounding box of the path (sampled curves), undefined for empty data. */
export function pathBBox(d: string): { x: number; y: number; w: number; h: number } | undefined {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const poly of flatten(d, 16)) {
    for (const p of poly) {
      x0 = Math.min(x0, p[0]);
      y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]);
      y1 = Math.max(y1, p[1]);
    }
  }
  return Number.isFinite(x0) ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : undefined;
}

/** Enclosed area of the path (sum of its subpaths' absolute shoelace areas, sampled curves). */
export function pathArea(d: string): number {
  let total = 0;
  for (const poly of flatten(d)) {
    let a = 0;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
    total += Math.abs(a) / 2;
  }
  return total;
}

export type ViewBox = [number, number, number, number];

export function parseViewBox(v: string | undefined): ViewBox {
  const n = (v ?? '').trim().split(/[\s,]+/).map(Number);
  return n.length === 4 && n.every(Number.isFinite) && n[2] > 0 && n[3] > 0 ? (n as ViewBox) : [0, 0, 24, 24];
}

/** The affine map of one viewBox into another (uniform scale, centred: preserveAspectRatio meet). */
export function viewBoxMap(from: string, to: string): { k: number; dx: number; dy: number } {
  const [fx, fy, fw, fh] = parseViewBox(from);
  const [tx, ty, tw, th] = parseViewBox(to);
  const k = Math.min(tw / fw, th / fh);
  return { k, dx: tx + (tw - fw * k) / 2 - fx * k, dy: ty + (th - fh * k) / 2 - fy * k };
}

export function scaleIntoViewBox(d: string, from: string, to: string): string {
  const { k, dx, dy } = viewBoxMap(from, to);
  return mapD(d, (p) => [p[0] * k + dx, p[1] * k + dy]);
}

// ── snapping ──

export interface SnapOptions {
  /** Grid step in viewBox units (0 / undefined: off). */
  grid?: number;
  /** Points to snap to (icon part anchors, other shapes' anchors). */
  anchors?: Pt[];
  /** Reach of anchor snapping, viewBox units. */
  radius?: number;
}

/** The point snapped to the nearest anchor in reach, else to the grid, else rounded to 0.01. */
export function snapPoint(p: Pt, o: SnapOptions): { p: Pt; kind: 'anchor' | 'grid' | null } {
  if (o.anchors?.length && o.radius) {
    let best: Pt | undefined;
    let bd = o.radius;
    for (const a of o.anchors) {
      const d = dist(a, p);
      if (d <= bd) {
        bd = d;
        best = a;
      }
    }
    if (best) return { p: [best[0], best[1]], kind: 'anchor' };
  }
  if (o.grid && o.grid > 0) return { p: [r2(Math.round(p[0] / o.grid) * o.grid), r2(Math.round(p[1] / o.grid) * o.grid)], kind: 'grid' };
  return { p: [r2(p[0]), r2(p[1])], kind: null };
}

// ── hit testing ──

const NONE = /^(none|transparent)$/i;
/** The shape paints its inside (an unpainted shape renders filled, like SVG's default). */
export const isFilled = (s: Pick<RigShape, 'fill' | 'stroke'>): boolean => (s.fill ? !NONE.test(s.fill) : !s.stroke);
export const isStroked = (s: Pick<RigShape, 'stroke'>): boolean => !!s.stroke && !NONE.test(s.stroke);

function insidePoly(poly: Pt[], p: Pt): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi || EPS) + xi) inside = !inside;
  }
  return inside;
}

/** Shapes in paint order: the under layer first, then the over layer (each in list order). */
export const paintOrder = <T extends Pick<RigShape, 'layer'>>(shapes: T[]): T[] => [...shapes.filter((s) => s.layer === 'under'), ...shapes.filter((s) => s.layer !== 'under')];

/** Distance from `p` to the outline of the path (viewBox units). */
export function distanceToPath(d: string, p: Pt): number {
  let best = Infinity;
  for (const poly of flatten(d)) for (let i = 1; i < poly.length; i++) best = Math.min(best, segDist(p, poly[i - 1], poly[i]));
  return best;
}

/** The id of the topmost shape at `p` (filled inside, or on its stroke within `tolerance`). */
export function hitShape(shapes: RigShape[], p: Pt, tolerance: number): string | undefined {
  const order = paintOrder(shapes);
  for (let i = order.length - 1; i >= 0; i--) {
    const s = order[i];
    const polys = flatten(s.d);
    if (isFilled(s)) {
      let inside = false;
      for (const poly of polys) if (insidePoly(poly, p)) inside = !inside;
      if (inside) return s.id;
    }
    const reach = (isStroked(s) ? (s.stroke_width ?? 1) / 2 : 0) + tolerance;
    if (distanceToPath(s.d, p) <= reach) return s.id;
  }
  return undefined;
}

// ── document edits (each returns a new document; undefined: refused by a cap) ──

const SHAPE_BASE_RE = /^[a-z0-9][a-z0-9_-]{0,24}$/;

/** A free id `<base>-<n>` (base: a tool name; anything not id-like becomes `shape`). */
export function nextShapeId(taken: Array<{ id: string }> | string[], base = 'shape'): string {
  const ids = new Set(taken.map((t) => (typeof t === 'string' ? t : t.id)));
  const b = SHAPE_BASE_RE.test(base) ? base : 'shape';
  let n = 1;
  while (ids.has(`${b}-${n}`)) n++;
  return `${b}-${n}`;
}

/** Why the document is too large to keep (the 64 KB cap on its JSON); undefined: it fits. */
export function docSizeError(doc: AnimationDoc): string | undefined {
  const json = JSON.stringify(doc);
  const bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(json).length : json.length;
  return bytes > ANIMATION_CAPS.bytes ? t('The animation would be larger than {max} KB ({size} KB).', { max: Math.round(ANIMATION_CAPS.bytes / 1024), size: Math.ceil(bytes / 1024) }) : undefined;
}

const shapesOf = (doc: AnimationDoc): RigShape[] => doc.rig?.shapes ?? [];

/** Every id in the rig: parts, groups and shapes share one id space. */
export const rigIds = (doc: AnimationDoc): string[] => [
  ...(doc.rig?.parts ?? []).map((p) => p.id),
  ...(doc.rig?.groups ?? []).map((g) => g.id),
  ...shapesOf(doc).map((s) => s.id),
];

export function addShape(doc: AnimationDoc, shape: RigShape): AnimationDoc | undefined {
  const shapes = shapesOf(doc);
  if (shapes.length >= V2_CAPS.shapes || rigIds(doc).includes(shape.id)) return undefined;
  const rig = doc.rig ?? { parts: [] };
  return { ...doc, rig: { ...rig, parts: rig.parts ?? [], shapes: [...shapes, shape] } };
}

/** Patch one shape; keys set to undefined are removed. */
export function updateShape(doc: AnimationDoc, id: string, patch: Partial<RigShape>): AnimationDoc {
  if (!doc.rig?.shapes) return doc;
  const shapes = doc.rig.shapes.map((s) => {
    if (s.id !== id) return s;
    const next: Record<string, unknown> = { ...s, ...patch };
    for (const k of Object.keys(next)) if (next[k] === undefined) delete next[k];
    return next as unknown as RigShape;
  });
  return { ...doc, rig: { ...doc.rig, shapes } };
}

/** Move a shape to another place in its list (paint order within its layer). */
export function moveShape(doc: AnimationDoc, id: string, to: number): AnimationDoc {
  const shapes = [...shapesOf(doc)];
  const i = shapes.findIndex((s) => s.id === id);
  if (i < 0 || !doc.rig) return doc;
  const [s] = shapes.splice(i, 1);
  shapes.splice(Math.max(0, Math.min(shapes.length, to)), 0, s);
  return { ...doc, rig: { ...doc.rig, shapes } };
}

/**
 * One step in the paint order of a shape's own side (over / under the icon). Past the edge of its side the
 * shape changes side: down from the last over row = the top-most under row, up from the first under row =
 * the bottom-most over row. Returns `doc` itself when there is nowhere to go (top over / bottom under).
 */
export function moveShapeInLayer(doc: AnimationDoc, id: string, dir: 'up' | 'down'): AnimationDoc {
  const list = shapesOf(doc);
  const i = list.findIndex((s) => s.id === id);
  if (i < 0 || !doc.rig) return doc;
  const side = list[i].layer === 'under' ? 'under' : 'over';
  const same = (s: RigShape): boolean => (s.layer === 'under' ? 'under' : 'over') === side;
  const shapes = [...list];
  const [s] = shapes.splice(i, 1);
  let j = -1;
  if (dir === 'up') j = list.findIndex((x, k) => k > i && same(x));
  else
    for (let k = i - 1; k >= 0; k--)
      if (same(list[k])) {
        j = k;
        break;
      }
  if (j >= 0) {
    // going up, the neighbour sits at j - 1 after the removal: insert behind it
    shapes.splice(j, 0, s);
    return { ...doc, rig: { ...doc.rig, shapes } };
  }
  if ((side === 'over') === (dir === 'up')) return doc;
  const flipped: RigShape = { ...s, layer: side === 'over' ? 'under' : 'over' };
  if (flipped.layer === 'over') {
    // the bottom-most over row sits just before the first over shape
    const first = shapes.findIndex((x) => x.layer !== 'under');
    shapes.splice(first < 0 ? i : first, 0, flipped);
  } else {
    // the top-most under row sits just after the last under shape
    let last = -1;
    shapes.forEach((x, k) => {
      if (x.layer === 'under') last = k;
    });
    shapes.splice(last < 0 ? i : last + 1, 0, flipped);
  }
  return { ...doc, rig: { ...doc.rig, shapes } };
}

/** Remove a shape and everything that targets it (its track and bindings). */
export function removeShape(doc: AnimationDoc, id: string): AnimationDoc {
  if (!doc.rig?.shapes) return doc;
  const target = `shape:${id}`;
  const out: AnimationDoc = { ...doc, rig: { ...doc.rig, shapes: doc.rig.shapes.filter((s) => s.id !== id) } };
  if (doc.tracks) out.tracks = doc.tracks.filter((t) => t.target !== target);
  if (doc.bindings) out.bindings = doc.bindings.filter((b) => b.target !== target);
  return out;
}

const trackOf = (doc: AnimationDoc, target: TargetRef): Track | undefined => doc.tracks?.find((t) => t.target === target);

function putTrack(doc: AnimationDoc, track: Track | undefined, target: TargetRef): AnimationDoc | undefined {
  const tracks = doc.tracks ?? [];
  const i = tracks.findIndex((t) => t.target === target);
  if (!track) return i < 0 ? doc : { ...doc, tracks: tracks.filter((_, j) => j !== i) };
  if (i < 0) return tracks.length >= V2_CAPS.tracks ? undefined : { ...doc, tracks: [...tracks, track] };
  return { ...doc, tracks: tracks.map((t, j) => (j === i ? track : t)) };
}

/** Draw-on for a rig target: draw 0 at the start, 1 at the end (merged into its existing keys). */
export function addDrawOnTrack(doc: AnimationDoc, target: TargetRef): AnimationDoc | undefined {
  const t = trackOf(doc, target);
  const keys: AnimationKeyframe[] = (t?.keyframes ?? []).map((k) => ({ ...k }));
  for (const [at, draw] of [
    [0, 0],
    [100, 1],
  ] as const) {
    const k = keys.find((x) => x.at === at);
    if (k) k.draw = draw;
    else keys.push({ at, draw });
  }
  keys.sort((a, b) => a.at - b.at);
  return putTrack(doc, { ...(t ?? { target }), target, keyframes: keys }, target);
}

/** The target's draw-on keys removed (the track goes when nothing else is left in it). */
export function removeDrawOn(doc: AnimationDoc, target: TargetRef): AnimationDoc {
  const t = trackOf(doc, target);
  if (!t) return doc;
  const keyframes = t.keyframes
    .map((k) => {
      const rest = { ...k };
      delete rest.draw;
      return rest;
    })
    .filter((k) => Object.keys(k).some((x) => x !== 'at' && x !== 'easing'));
  const next: Track = { ...t, keyframes };
  return putTrack(doc, keyframes.length || next.path ? next : undefined, target) ?? doc;
}

export const hasDrawOn = (doc: AnimationDoc, target: TargetRef): boolean => !!trackOf(doc, target)?.keyframes.some((k) => k.draw !== undefined);

/**
 * The target's motion path from a path drawn on the icon (absolute viewBox units): stored relative
 * to its first point, so the motion starts where the target rests. No `d`: the path is removed.
 */
export function setTrackPath(doc: AnimationDoc, target: TargetRef, d: string | undefined, follow: boolean): AnimationDoc | undefined {
  const t = trackOf(doc, target);
  if (!d) {
    if (!t?.path) return doc;
    const rest = { ...t };
    delete rest.path;
    return putTrack(doc, rest.keyframes.length ? rest : undefined, target);
  }
  const start = toCubicSubpaths(d)[0]?.[0]?.[0];
  if (!start) return doc;
  const rel = translateD(d, -start[0], -start[1]);
  const path = { d: rel, ...(follow ? { follow_rotation: true } : {}) };
  return putTrack(doc, { ...(t ?? { target, keyframes: [] }), target, path }, target);
}
