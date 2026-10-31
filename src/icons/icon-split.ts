import type { IconGeometry } from './icon-source';
import { cubicsToPath, toCubicSubpaths, type Cubic, type Pt } from '../path/core';

/*
 * Auto-split of an icon into pieces for icon rigs. A single path splits into its subpaths (holes
 * and islands stay with their outer piece); several paths split by element, accent and stroked
 * shapes on their own. Pieces are numbered in drawing order.
 */

export interface SplitPiece {
  /** Index of the piece (what `RigPart.from` refers to). */
  index: number;
  /** Path data of the piece (an outer subpath with its holes). */
  d: string;
  /** Bounding box in viewBox units: [x, y, width, height]. */
  bbox: [number, number, number, number];
  /** A secondary (accent) path of the icon, or an accent stroked shape (own SVG `mc-accent`). */
  secondary?: true;
  /** A stroked shape (own SVG): drawn by its stroke, not filled. */
  stroke?: { width: number; cap?: string; join?: string };
  /** Filled with fill-rule evenodd (own SVG). */
  evenodd?: true;
}

/** Points along a cubic (start excluded), enough for areas and containment tests at icon scale. */
const STEPS = 8;
function flatten(sub: Cubic[]): Pt[] {
  const out: Pt[] = sub.length ? [sub[0][0]] : [];
  for (const [p0, p1, p2, p3] of sub) {
    for (let i = 1; i <= STEPS; i++) {
      const t = i / STEPS;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const d = t * t * t;
      out.push([a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]);
    }
  }
  return out;
}

/** Signed shoelace area of a closed polygon. */
function signedArea(poly: Pt[]): number {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

function bboxOf(points: Pt[]): [number, number, number, number] {
  if (!points.length) return [0, 0, 0, 0];
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of points) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  const r = (n: number) => +n.toFixed(3);
  return [r(x0), r(y0), r(x1 - x0), r(y1 - y0)];
}

/** Even-odd ray test of one point against one polygon. */
function inside(p: Pt, poly: Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const boxInside = (a: number[], b: number[], eps = 1e-3): boolean =>
  a[0] >= b[0] - eps && a[1] >= b[1] - eps && a[0] + a[2] <= b[0] + b[2] + eps && a[1] + a[3] <= b[1] + b[3] + eps;

interface Sub {
  cubics: Cubic[];
  poly: Pt[];
  area: number;
  box: [number, number, number, number];
}

/** `a` lies inside `b`: its box inside b's box and most of its outline inside b's outline. */
function contains(b: Sub, a: Sub): boolean {
  if (!boxInside(a.box, b.box)) return false;
  const pts = a.poly;
  const step = Math.max(1, Math.floor(pts.length / 16));
  let n = 0;
  let hits = 0;
  for (let i = 0; i < pts.length; i += step) {
    n++;
    if (inside(pts[i], b.poly)) hits++;
  }
  return n > 0 && hits / n >= 0.6;
}

/** Below this area a filled subpath draws nothing (a stray line in a filled path). */
const MIN_AREA = 1e-6;

/**
 * Subpath groups of one path: each outer subpath with the holes it contains. Nonzero (default): a
 * hole is a subpath that winds the area around it back to 0. Evenodd: a subpath at an odd
 * containment depth is a hole. Zero-area subpaths (they fill nothing) are dropped.
 */
export function splitPath(d: string, evenodd = false): Cubic[][][] {
  const subs: Sub[] = toCubicSubpaths(d)
    .map((cubics) => {
      const poly = flatten(cubics);
      return { cubics, poly, area: signedArea(poly), box: bboxOf(poly) };
    })
    .filter((x) => Math.abs(x.area) > MIN_AREA);
  const owner: number[] = subs.map((_, i) => i);
  // largest first: a container is always placed before what it contains
  const order = subs.map((_, i) => i).sort((a, b) => Math.abs(subs[b].area) - Math.abs(subs[a].area) || a - b);
  order.forEach((i, k) => {
    let parent = -1;
    // nonzero winding of the area around this subpath (the subpaths containing it), and its depth
    let around = 0;
    let depth = 0;
    for (let m = 0; m < k; m++) {
      const j = order[m];
      if (Math.abs(subs[j].area) <= Math.abs(subs[i].area)) continue;
      if (!contains(subs[j], subs[i])) continue;
      around += Math.sign(subs[j].area);
      depth++;
      if (parent < 0 || Math.abs(subs[j].area) < Math.abs(subs[parent].area)) parent = j;
    }
    // a hole cuts filled area back to winding 0: it must stay with the subpath around it. Anything
    // else (top level, an island inside a hole, an overlap) is filled on its own: a piece.
    const hole = evenodd ? depth % 2 === 1 : around !== 0 && around + Math.sign(subs[i].area) === 0;
    if (parent >= 0 && hole) owner[i] = owner[parent];
  });
  const groups = new Map<number, number[]>();
  owner.forEach((o, i) => {
    const list = groups.get(o);
    if (list) list.push(i);
    else groups.set(o, [i]);
  });
  return [...groups.values()].sort((a, b) => a[0] - b[0]).map((ids) => ids.map((i) => subs[i].cubics));
}

const pieceOf = (index: number, subs: Cubic[][]): SplitPiece => ({ index, d: cubicsToPath(subs), bbox: bboxOf(subs.flatMap(flatten)) });

/** The geometry's pieces (see the file comment), in drawing order: secondary, primary, strokes. */
export function splitIcon(geometry: IconGeometry): SplitPiece[] {
  const out: SplitPiece[] = [];
  const add = (p: Omit<SplitPiece, 'index'>) => out.push({ ...p, index: out.length });
  const eo = (list: 'paths' | 'accent', i: number): boolean => !!geometry.evenodd?.[list]?.includes(i);
  const rule = (on: boolean) => (on ? { evenodd: true as const } : {});
  /** A whole element: its subpaths that fill something. */
  const filled = (d: string) => toCubicSubpaths(d).filter((sub) => Math.abs(signedArea(flatten(sub))) > MIN_AREA);
  (geometry.secondary ?? []).forEach((d, i) => {
    const subs = filled(d);
    if (subs.length) add({ ...pieceOf(0, subs), secondary: true, ...rule(eo('accent', i)) });
  });
  if (geometry.paths.length === 1) {
    const on = eo('paths', 0);
    for (const group of splitPath(geometry.paths[0], on)) add({ ...pieceOf(0, group), ...rule(on) });
  } else {
    geometry.paths.forEach((d, i) => {
      const subs = filled(d);
      if (subs.length) add({ ...pieceOf(0, subs), ...rule(eo('paths', i)) });
    });
  }
  for (const s of geometry.strokes ?? []) {
    const subs = toCubicSubpaths(s.d);
    if (subs.length) add({ ...pieceOf(0, subs), stroke: { width: s.width, ...(s.cap ? { cap: s.cap } : {}), ...(s.join ? { join: s.join } : {}) }, ...(s.accent ? { secondary: true as const } : {}) });
  }
  return out;
}

/** Union of boxes ([x, y, w, h]); undefined for none. */
export function unionBox(boxes: Array<[number, number, number, number]>): [number, number, number, number] | undefined {
  if (!boxes.length) return undefined;
  const x0 = Math.min(...boxes.map((b) => b[0]));
  const y0 = Math.min(...boxes.map((b) => b[1]));
  const x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
  const y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  const r = (n: number) => +n.toFixed(3);
  return [r(x0), r(y0), r(x1 - x0), r(y1 - y0)];
}

/** Bounding box of path data in its own units. */
export function pathBox(d: string): [number, number, number, number] {
  return bboxOf(toCubicSubpaths(d).flatMap(flatten));
}
