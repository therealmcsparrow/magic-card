import { MIN_BOX_SIDE, type Matrix6 } from '../contracts/path-canvas';
import type { Box, Pt } from '../contracts/path-model';

// Pure maths of the selection box: handle places, scale and rotate drags, the matrices the host applies and keyboard resize.

export type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
type Sign = -1 | 0 | 1;

/** id, horizontal side (-1 left, 1 right), vertical side (-1 top, 1 bottom). */
const HANDLES: ReadonlyArray<readonly [HandleId, Sign, Sign]> = [
  ['nw', -1, -1],
  ['n', 0, -1],
  ['ne', 1, -1],
  ['e', 1, 0],
  ['se', 1, 1],
  ['s', 0, 1],
  ['sw', -1, 1],
  ['w', -1, 0],
];

export interface Placed {
  id: HandleId;
  sx: Sign;
  sy: Sign;
  /** Centre of the handle in canvas CSS px. */
  at: Pt;
}

/**
 * The handles of a box drawn at screen rectangle `r` ([x0, y0, x1, y1]) for hit size `hit`. They never
 * overlap: a side under 3 hit sizes drops its edge handle, a box under 1 hit size moves the corners out.
 */
export function placeHandles(r: readonly [number, number, number, number], hit: number): Placed[] {
  const [x0, y0, x1, y1] = r;
  const out = Math.min(x1 - x0, y1 - y0) < hit ? hit / 2 : 0;
  const list: Placed[] = [];
  for (const [id, sx, sy] of HANDLES) {
    if ((!sx && x1 - x0 < hit * 3) || (!sy && y1 - y0 < hit * 3)) continue;
    list.push({ id, sx, sy, at: [sx < 0 ? x0 - out : sx > 0 ? x1 + out : (x0 + x1) / 2, sy < 0 ? y0 - out : sy > 0 ? y1 + out : (y0 + y1) / 2] });
  }
  return list;
}

/** Rotate handle centre: on a stem above the top centre, below the box when there is no room above. */
export function rotateSpot(r: readonly [number, number, number, number], stem: number, hit: number): Pt {
  const x = (r[0] + r[2]) / 2;
  return r[1] - stem - hit / 2 >= 0 ? [x, r[1] - stem] : [x, r[3] + stem];
}

export interface ScaleOpts {
  /** Keep the ratio (corners only). */
  ratio: boolean;
  /** Scale about the centre. */
  centre: boolean;
  bounds?: Box;
}

/** The box after dragging handle (sx, sy) so its edge (or edges) sits at `e` (frame units). */
export function scaleBox(b: Box, sx: Sign, sy: Sign, e: Pt, o: ScaleOpts): Box {
  const axis = (s: Sign, lo: number, len: number, q: number, bl?: number, bh?: number): [number, number] => {
    const c = lo + len / 2;
    const a = s > 0 ? lo : lo + len;
    const ref = o.centre ? c : a;
    const raw = (s > 0 ? q - ref : ref - q) * (o.centre ? 2 : 1);
    const max = bl === undefined || bh === undefined ? Infinity : o.centre ? 2 * Math.min(c - bl, bh - c) : s > 0 ? bh - a : a - bl;
    return [Math.min(Math.max(raw, MIN_BOX_SIDE), Math.max(max, MIN_BOX_SIDE)), max];
  };
  const bd = o.bounds;
  const [w0, mx] = sx ? axis(sx, b.x, b.w, e[0], bd?.x, bd && bd.x + bd.w) : [b.w, Infinity];
  const [h0, my] = sy ? axis(sy, b.y, b.h, e[1], bd?.y, bd && bd.y + bd.h) : [b.h, Infinity];
  const f = o.ratio && sx && sy && b.w > 0 && b.h > 0 ? Math.max(Math.min(Math.max(w0 / b.w, h0 / b.h), mx / b.w, my / b.h), MIN_BOX_SIDE / Math.min(b.w, b.h)) : 0;
  const w = f ? b.w * f : w0;
  const h = f ? b.h * f : h0;
  const at = (s: Sign, lo: number, len: number, size: number): number => (o.centre ? lo + len / 2 - size / 2 : s < 0 ? lo + len - size : lo);
  return { x: at(sx, b.x, b.w, w), y: at(sy, b.y, b.h, h), w, h };
}

/** The matrix that maps box `a` onto box `b` (scale and shift, no rotation). */
export function boxMatrix(a: Box, b: Box): Matrix6 {
  const kx = a.w > 0 ? b.w / a.w : 1;
  const ky = a.h > 0 ? b.h / a.h : 1;
  return [kx, 0, 0, ky, b.x - a.x * kx, b.y - a.y * ky];
}

/** Rotation by `deg` clockwise (y points down) about `c`. */
export function rotateMatrix(c: Pt, deg: number): Matrix6 {
  const r = (deg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return [cos, sin, -sin, cos, c[0] - c[0] * cos + c[1] * sin, c[1] - c[0] * sin - c[1] * cos];
}

export const IDENTITY: Matrix6 = [1, 0, 0, 1, 0, 0];

/** Degrees of `p` around `c`, clockwise from the right (y points down). */
export const angleOf = (c: Pt, p: Pt): number => (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;

/** Turn `d` into the range -180..180. */
export const wrap180 = (d: number): number => d - 360 * Math.round(d / 360);

/** Ctrl/Cmd+Shift+Arrow: grow or shrink from the top-left corner by `amount`, inside `bounds`. */
export function resizeBy(b: Box, dx: number, dy: number, amount: number, bounds?: Box): Box {
  const fit = (lo: number, len: number, d: number, bl?: number, bh?: number): number => {
    const v = Math.max(MIN_BOX_SIDE, len + d * amount);
    return bl === undefined || bh === undefined ? v : Math.min(v, Math.max(bh - lo, MIN_BOX_SIDE));
  };
  return { x: b.x, y: b.y, w: fit(b.x, b.w, dx, bounds?.x, bounds && bounds.x + bounds.w), h: fit(b.y, b.h, dy, bounds?.y, bounds && bounds.y + bounds.h) };
}
