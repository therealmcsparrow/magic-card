// Shim for the merged path model (src/path/core.ts): the old {x, y} outline API over the
// tuple-based core. Not imported by the card any more.
import { flatten, parseClosed, polygonCss, nearest, restartAt, reverse, toPathString, translate } from '../path/core';
import type { Pt, SubPath } from '../path/core';

export interface OutlinePoint {
  x: number;
  y: number;
}

/** A line to `to`, or a cubic through `c1`, `c2` to `to`. */
export interface OutlineSeg {
  to: OutlinePoint;
  c1?: OutlinePoint;
  c2?: OutlinePoint;
}

export interface Outline {
  start: OutlinePoint;
  /** Every piece, the closing one included (the last `to` is `start`). */
  segs: OutlineSeg[];
}

const t = (q: OutlinePoint): Pt => [q.x, q.y];
const o = (q: Pt): OutlinePoint => ({ x: q[0], y: q[1] });
const cache = new WeakMap<Outline, SubPath>();
const toSub = (u: Outline): SubPath => {
  let s = cache.get(u);
  if (!s) cache.set(u, (s = build(u)));
  return s;
};
const build = (u: Outline): SubPath => ({ start: t(u.start), closed: true, segs: u.segs.map((s) => (s.c1 && s.c2 ? { c1: t(s.c1), c2: t(s.c2), to: t(s.to) } : { to: t(s.to) })) });
const fromSub = (s: SubPath): Outline => ({ start: o(s.start), segs: s.segs.map((g) => (g.c1 && g.c2 ? { c1: o(g.c1), c2: o(g.c2), to: o(g.to) } : { to: o(g.to) })) });

/** An absolute M / L / C / Z path (one closed subpath). Undefined when it is not one. */
export const parseOutline = (d: string): Outline | undefined => {
  const s = parseClosed(d || '');
  return s && fromSub(s);
};
export const outlinePath = (u: Outline): string => toPathString([toSub(u)]);
export const translateOutline = (u: Outline, dx: number, dy: number): Outline => fromSub(translate(toSub(u), dx, dy));
export const restartOutline = (u: Outline, p: OutlinePoint): Outline => fromSub(restartAt(toSub(u), t(p)));
export const reverseOutline = (u: Outline): Outline => fromSub(reverse(toSub(u)));
export const flattenOutline = (u: Outline, steps = 12): OutlinePoint[] => flatten(toSub(u), steps).map(o);
export const outlinePolygon = (u: Outline, steps = 8): string => polygonCss(toSub(u), steps);
export const distanceToOutline = (u: Outline, p: OutlinePoint): number => nearest(toSub(u), t(p)).dist;
