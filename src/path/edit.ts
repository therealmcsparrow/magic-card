/*
 * Path model, editor-only part (contract path-model 1.0.0 rev 2): the anchor model and the edit
 * operations. Pure; every operation returns a new path and never changes its input. Never imported
 * from src/index.ts's graph (magic-card.js holds none of this).
 *
 * Adding stops at MAX_ANCHORS (canAdd, insertAt, append); every other operation takes any count,
 * so an imported path with more anchors stays editable.
 */
import type { Anchor, AnchorKind, Box, Cubic, EditPath, Pt, SubPath } from '../contracts/path-model';
import { splitCubic, toPathString } from './core';

export type { Anchor, AnchorKind, EditPath, Pt };

/** Most anchors a subpath can GROW to (adding stops here). Imported paths may hold more. */
export const MAX_ANCHORS = 100;

const EPS = 1e-4;
const near = (a: Pt, b: Pt, eps = EPS): boolean => Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pt = (a: Anchor): Pt => [a.x, a.y];
const copyPt = (p: Pt | undefined): Pt | undefined => (p ? [p[0], p[1]] : undefined);

export const copyAnchor = (a: Anchor): Anchor => {
  const c: Anchor = { x: a.x, y: a.y, in: copyPt(a.in), out: copyPt(a.out) };
  if (a.kind) c.kind = a.kind;
  return c;
};
export const copyPath = (p: EditPath): EditPath => ({ anchors: p.anchors.map(copyAnchor), closed: p.closed });

/** A number for path data: at most 2 decimals, no exponent, no -0. */
export function fmtNum(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
}

/** A cubic whose controls sit on the chord at 1/3 and 2/3: a straight line. */
const isLine = (c: Cubic): boolean => {
  const tol = Math.max(EPS, Math.hypot(c[3][0] - c[0][0], c[3][1] - c[0][1]) * 1e-3);
  return near(c[1], lerp(c[0], c[3], 1 / 3), tol) && near(c[2], lerp(c[0], c[3], 2 / 3), tol);
};

/** A subpath as anchors (lines get no handles, a handle on its anchor is none). Any piece count. */
export function toEdit(s: SubPath): EditPath {
  const anchors: Anchor[] = [{ x: s.start[0], y: s.start[1] }];
  let from = s.start;
  for (const g of s.segs) {
    const prev = anchors[anchors.length - 1];
    const next: Anchor = { x: g.to[0], y: g.to[1] };
    if (g.c1 && g.c2 && !isLine([from, g.c1, g.c2, g.to])) {
      if (!near(g.c1, from)) prev.out = [g.c1[0], g.c1[1]];
      if (!near(g.c2, g.to)) next.in = [g.c2[0], g.c2[1]];
    }
    anchors.push(next);
    from = g.to;
  }
  const closed = s.closed && s.segs.length > 0;
  if (closed && anchors.length > 1) {
    // the closing piece ends on the start: fold that duplicate into the first anchor
    const last = anchors.pop()!;
    anchors[0].in = last.in;
  }
  return { anchors, closed: closed && anchors.length > 1 };
}

/** Segment i: anchors[i] to the next one (the last of a closed path wraps to the first). */
export function segmentCount(p: EditPath): number {
  const n = p.anchors.length;
  if (n < 2) return 0;
  return p.closed ? n : n - 1;
}

export function segment(p: EditPath, i: number): Cubic {
  const a = p.anchors[i];
  const b = p.anchors[(i + 1) % p.anchors.length];
  return [pt(a), a.out ?? pt(a), b.in ?? pt(b), pt(b)];
}

const segIsLine = (p: EditPath, i: number): boolean => !p.anchors[i].out && !p.anchors[(i + 1) % p.anchors.length].in;

/** Anchors -> a subpath: lines for straight sides, cubics otherwise. */
export function fromEdit(p: EditPath): SubPath {
  const first = p.anchors[0];
  const segs = Array.from({ length: segmentCount(p) }, (_, i) => {
    const c = segment(p, i);
    return segIsLine(p, i) ? { to: c[3] } : { c1: c[1], c2: c[2], to: c[3] };
  });
  return { start: first ? pt(first) : [0, 0], segs, closed: p.closed && p.anchors.length > 1 };
}

/** The path as text (M / L / C / Z, 2 decimals); an empty path is ''. */
export const serialize = (p: EditPath): string => (p.anchors.length ? toPathString([fromEdit(p)]) : '');

/** Both handles present and pointing in opposite directions (a smooth point). */
export function isSmooth(a: Anchor): boolean {
  if (!a.in || !a.out) return false;
  const ix = a.in[0] - a.x;
  const iy = a.in[1] - a.y;
  const ox = a.out[0] - a.x;
  const oy = a.out[1] - a.y;
  const li = Math.hypot(ix, iy);
  const lo = Math.hypot(ox, oy);
  if (li < EPS || lo < EPS) return false;
  // cos of the angle between in and -out
  return (-(ix * ox + iy * oy)) / (li * lo) > 0.9995;
}

const kindOf = (a: Anchor): AnchorKind => a.kind ?? (isSmooth(a) ? 'smooth' : 'corner');

// ── geometry on segments ──

const cubicAt = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
};

/** The closest point on the path to `q`: segment index, t on it, the point and the distance (in `scale`d space). */
export function nearestOnPath(p: EditPath, q: Pt, scale: Pt = [1, 1]): { seg: number; t: number; point: Pt; dist: number } | undefined {
  const segs = segmentCount(p);
  if (!segs) return undefined;
  const dist = (a: Pt): number => Math.hypot((a[0] - q[0]) * scale[0], (a[1] - q[1]) * scale[1]);
  let best: { seg: number; t: number; point: Pt; dist: number } | undefined;
  for (let s = 0; s < segs; s++) {
    const c = segment(p, s);
    const N = 32;
    let bt = 0;
    let bd = Infinity;
    for (let i = 0; i <= N; i++) {
      const dd = dist(cubicAt(c, i / N));
      if (dd < bd) {
        bd = dd;
        bt = i / N;
      }
    }
    let step = 1 / N;
    for (let k = 0; k < 12; k++) {
      step /= 2;
      for (const t of [bt - step, bt + step]) {
        if (t < 0 || t > 1) continue;
        const dd = dist(cubicAt(c, t));
        if (dd < bd) {
          bd = dd;
          bt = t;
        }
      }
    }
    if (!best || bd < best.dist) best = { seg: s, t: bt, point: cubicAt(c, bt), dist: bd };
  }
  return best;
}

// ── edits (all return a new path, the input is never changed) ──

/** False when p has MAX_ANCHORS or more anchors. */
export const canAdd = (p: EditPath): boolean => p.anchors.length < MAX_ANCHORS;

/** Split segment `seg` at t: a new anchor on the curve, the shape unchanged. At the cap: p unchanged, index -1. */
export function insertAt(p: EditPath, seg: number, t: number): { path: EditPath; index: number } {
  const out = copyPath(p);
  const n = out.anchors.length;
  if (seg < 0 || seg >= segmentCount(out) || !canAdd(out)) return { path: out, index: -1 };
  const a = out.anchors[seg];
  const b = out.anchors[(seg + 1) % n];
  const tt = Math.min(1, Math.max(0, t));
  if (!a.out && !b.in) {
    const m = lerp(pt(a), pt(b), tt);
    out.anchors.splice(seg + 1, 0, { x: m[0], y: m[1] });
    return { path: out, index: seg + 1 };
  }
  // de Casteljau keeps the curve exact: the split's inner controls become the new anchor's handles
  const [l, r] = splitCubic(segment(out, seg), tt);
  a.out = near(l[1], l[0]) ? undefined : l[1];
  b.in = near(r[2], r[3]) ? undefined : r[2];
  const mid: Anchor = { x: l[3][0], y: l[3][1], in: near(l[2], l[3]) ? undefined : l[2], out: near(r[1], r[0]) ? undefined : r[1] };
  out.anchors.splice(seg + 1, 0, mid);
  return { path: out, index: seg + 1 };
}

/** A new last anchor (or first, `atStart`), straight from its neighbour. At the cap: p unchanged, index -1. */
export function append(p: EditPath, q: Pt, atStart = false): { path: EditPath; index: number } {
  const out = copyPath(p);
  if (!canAdd(out)) return { path: out, index: -1 };
  const a: Anchor = { x: q[0], y: q[1] };
  if (atStart) {
    out.anchors.unshift(a);
    return { path: out, index: 0 };
  }
  out.anchors.push(a);
  return { path: out, index: out.anchors.length - 1 };
}

export function remove(p: EditPath, i: number): EditPath {
  const out = copyPath(p);
  if (i < 0 || i >= out.anchors.length) return out;
  out.anchors.splice(i, 1);
  if (out.anchors.length < 2) out.closed = false;
  return out;
}

/** Move anchor i to (x, y); its handles move with it. */
export function moveAnchor(p: EditPath, i: number, x: number, y: number): EditPath {
  const out = copyPath(p);
  const a = out.anchors[i];
  if (!a) return out;
  const dx = x - a.x;
  const dy = y - a.y;
  a.x = x;
  a.y = y;
  if (a.in) a.in = [a.in[0] + dx, a.in[1] + dy];
  if (a.out) a.out = [a.out[0] + dx, a.out[1] + dy];
  return out;
}

/**
 * Set a handle of anchor i; the opposite one follows the anchor's kind (or `as`): corner = free,
 * smooth = same line, own length, symmetric = mirrored.
 */
export function setHandle(p: EditPath, i: number, which: 'in' | 'out', q: Pt, as?: AnchorKind): EditPath {
  const out = copyPath(p);
  const a = out.anchors[i];
  if (!a) return out;
  const kind = as ?? kindOf(a);
  const h: Pt | undefined = near(q, pt(a)) ? undefined : [q[0], q[1]];
  a[which] = h;
  const other = which === 'in' ? 'out' : 'in';
  if (kind === 'symmetric') a[other] = h ? [2 * a.x - h[0], 2 * a.y - h[1]] : undefined;
  else if (kind === 'smooth' && h && a[other]) {
    const l = Math.hypot(a[other]![0] - a.x, a[other]![1] - a.y);
    const d = Math.hypot(a.x - h[0], a.y - h[1]);
    a[other] = [a.x + ((a.x - h[0]) / d) * l, a.y + ((a.y - h[1]) / d) * l];
  }
  return out;
}

/** Change a node's kind; smooth and symmetric line the opposite handle up with `in` now. */
export function setKind(p: EditPath, i: number, kind: AnchorKind): EditPath {
  const out = copyPath(p);
  const a = out.anchors[i];
  if (!a) return out;
  a.kind = kind;
  if (kind !== 'corner' && a.in && a.out) return setHandle(out, i, 'in', a.in, kind);
  return out;
}

/** Catmull-Rom tangent at anchor i, as the bezier handle offset (1/6 of the neighbour chord). */
function crOffset(p: EditPath, i: number): Pt | undefined {
  const n = p.anchors.length;
  if (n < 2) return undefined;
  const cur = p.anchors[i];
  const prev = i > 0 ? p.anchors[i - 1] : p.closed ? p.anchors[n - 1] : cur;
  const next = i < n - 1 ? p.anchors[i + 1] : p.closed ? p.anchors[0] : cur;
  const dx = (next.x - prev.x) / 6;
  const dy = (next.y - prev.y) / 6;
  return Math.hypot(dx, dy) < EPS ? undefined : [dx, dy];
}

/** Catmull-Rom handles on anchor i (an open path's ends only get the inner handle). */
function smoothAt(p: EditPath, out: EditPath, i: number): void {
  const a = out.anchors[i];
  const o = crOffset(p, i);
  if (!o) return;
  a.in = p.closed || i > 0 ? [a.x - o[0], a.y - o[1]] : undefined;
  a.out = p.closed || i < p.anchors.length - 1 ? [a.x + o[0], a.y + o[1]] : undefined;
}

/** Every anchor smooth: a Catmull-Rom spline through the points, as cubics. */
export function smoothAll(p: EditPath): EditPath {
  const out = copyPath(p);
  for (let i = 0; i < out.anchors.length; i++) smoothAt(p, out, i);
  return out;
}

/** Every handle removed: straight lines between the points. */
export const straightenAll = (p: EditPath): EditPath => ({ anchors: p.anchors.map((a) => ({ x: a.x, y: a.y })), closed: p.closed });

/** Smooth point <-> corner point (a corner has no handles; smoothing uses Catmull-Rom). */
export function toggleSmooth(p: EditPath, i: number): EditPath {
  const out = copyPath(p);
  const a = out.anchors[i];
  if (!a) return out;
  if (a.in || a.out) {
    a.in = undefined;
    a.out = undefined;
  } else smoothAt(p, out, i);
  return out;
}

/** Same points travelled the other way (a closed path keeps its start). */
export function reverse(p: EditPath): EditPath {
  const flip = (a: Anchor): Anchor => {
    const f: Anchor = { x: a.x, y: a.y, in: copyPt(a.out), out: copyPt(a.in) };
    if (a.kind) f.kind = a.kind;
    return f;
  };
  const list = p.anchors.map(flip).reverse();
  if (p.closed && list.length) list.unshift(list.pop()!);
  return { anchors: list, closed: p.closed };
}

export function setClosed(p: EditPath, closed: boolean): EditPath {
  const out = copyPath(p);
  out.closed = closed && out.anchors.length > 1;
  if (!out.closed && out.anchors.length) {
    // the closing segment is gone: drop the handles that only shaped it
    out.anchors[0].in = undefined;
    out.anchors[out.anchors.length - 1].out = undefined;
  }
  return out;
}

/** Scale / rotate / flip / move: every anchor and handle through a 2x3 matrix [a, b, c, d, e, f]. */
export function transform(p: EditPath, m: [number, number, number, number, number, number]): EditPath {
  const mv = (x: number, y: number): Pt => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const mq = (q: Pt | undefined): Pt | undefined => (q ? mv(q[0], q[1]) : undefined);
  return {
    anchors: p.anchors.map((a) => {
      const [x, y] = mv(a.x, a.y);
      const t: Anchor = { x, y, in: mq(a.in), out: mq(a.out) };
      if (a.kind) t.kind = a.kind;
      return t;
    }),
    closed: p.closed,
  };
}

export const translate = (p: EditPath, dx: number, dy: number): EditPath => transform(p, [1, 0, 0, 1, dx, dy]);

export const snap = (v: number, step: number): number => (step > 0 ? Math.round(v / step) * step : v);

/** Bounding box of a path's anchors and handles, for previews. */
export function bounds(p: EditPath): Box | undefined {
  const pts: Pt[] = [];
  for (const a of p.anchors) {
    pts.push(pt(a));
    if (a.in) pts.push(a.in);
    if (a.out) pts.push(a.out);
  }
  if (!pts.length) return undefined;
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}
