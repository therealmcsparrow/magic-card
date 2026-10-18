/*
 * Small pure geometry for the path tools: anchors as cubic chains, reversing, offset curves, arcs.
 * Imports the path-model types only (src/path/edit.ts lives in the path-canvas chunk and would be copied).
 */
import type { Anchor, Cubic, EditPath, Pt } from '../contracts/path-model';

export const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const same = (a: Pt, b: Pt, eps = 1e-9): boolean => Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps;
export const ap = (a: Anchor): Pt => [a.x, a.y];

/** Segment i of a path as a cubic (a missing handle sits on its anchor). */
export function segCubic(p: EditPath, i: number): Cubic {
  const a = p.anchors[i];
  const b = p.anchors[(i + 1) % p.anchors.length];
  return [ap(a), a.out ?? ap(a), b.in ?? ap(b), ap(b)];
}

export const segCount = (p: EditPath): number => (p.anchors.length < 2 ? 0 : p.closed ? p.anchors.length : p.anchors.length - 1);

export const line = (a: Pt, b: Pt): Cubic => [a, a, b, b];

export function splitCubic(c: Cubic, t: number): [Cubic, Cubic] {
  const a = lerp(c[0], c[1], t);
  const b = lerp(c[1], c[2], t);
  const d = lerp(c[2], c[3], t);
  const e = lerp(a, b, t);
  const f = lerp(b, d, t);
  const g = lerp(e, f, t);
  return [
    [c[0], a, e, g],
    [g, f, d, c[3]],
  ];
}

export function cubicAt(c: Cubic, t: number): Pt {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [
    w[0] * c[0][0] + w[1] * c[1][0] + w[2] * c[2][0] + w[3] * c[3][0],
    w[0] * c[0][1] + w[1] * c[1][1] + w[2] * c[2][1] + w[3] * c[3][1],
  ];
}

/** Derivative of the cubic at t. */
function deriv(c: Cubic, t: number): Pt {
  const u = 1 - t;
  const a = [3 * u * u, 6 * u * t, 3 * t * t];
  return [
    a[0] * (c[1][0] - c[0][0]) + a[1] * (c[2][0] - c[1][0]) + a[2] * (c[3][0] - c[2][0]),
    a[0] * (c[1][1] - c[0][1]) + a[1] * (c[2][1] - c[1][1]) + a[2] * (c[3][1] - c[2][1]),
  ];
}

const unit = (v: Pt): Pt => {
  const l = Math.hypot(v[0], v[1]);
  return l < 1e-12 ? [0, 0] : [v[0] / l, v[1] / l];
};

/** Unit tangent at the start / end, looking past coincident handles. */
export function tangentAt(c: Cubic, start: boolean): Pt {
  const others: Pt[] = start ? [c[1], c[2], c[3]] : [c[2], c[1], c[0]];
  const base = start ? c[0] : c[3];
  for (const q of others) {
    const v: Pt = start ? [q[0] - base[0], q[1] - base[1]] : [base[0] - q[0], base[1] - q[1]];
    if (Math.hypot(v[0], v[1]) > 1e-9) return unit(v);
  }
  return [0, 0];
}

/** Signed curvature at an end (positive: turning toward the left normal (-ty, tx)). */
function curvatureAt(c: Cubic, start: boolean): number {
  const d1 = start
    ? [3 * (c[1][0] - c[0][0]), 3 * (c[1][1] - c[0][1])]
    : [3 * (c[3][0] - c[2][0]), 3 * (c[3][1] - c[2][1])];
  const d2 = start
    ? [6 * (c[2][0] - 2 * c[1][0] + c[0][0]), 6 * (c[2][1] - 2 * c[1][1] + c[0][1])]
    : [6 * (c[3][0] - 2 * c[2][0] + c[1][0]), 6 * (c[3][1] - 2 * c[2][1] + c[1][1])];
  const l = Math.hypot(d1[0], d1[1]);
  if (l < 1e-9) return 0;
  return (d1[0] * d2[1] - d1[1] * d2[0]) / (l * l * l);
}

/** Curvature of the cubic at t (positive toward the left normal). */
export function curvatureAtT(c: Cubic, t: number): number {
  const u = 1 - t;
  const d1: Pt = deriv(c, t);
  const d2: Pt = [
    6 * (u * (c[2][0] - 2 * c[1][0] + c[0][0]) + t * (c[3][0] - 2 * c[2][0] + c[1][0])),
    6 * (u * (c[2][1] - 2 * c[1][1] + c[0][1]) + t * (c[3][1] - 2 * c[2][1] + c[1][1])),
  ];
  const l = Math.hypot(d1[0], d1[1]);
  return l < 1e-9 ? 0 : (d1[0] * d2[1] - d1[1] * d2[0]) / (l * l * l);
}

export function isStraight(c: Cubic, eps = 1e-9): boolean {
  const len = dist(c[0], c[3]);
  if (len < 1e-12) return false;
  const off = (p: Pt): number =>
    Math.abs((p[0] - c[0][0]) * (c[3][1] - c[0][1]) - (p[1] - c[0][1]) * (c[3][0] - c[0][0])) / len;
  return off(c[1]) < eps && off(c[2]) < eps;
}

/** The curve moved by d along its left normal (-ty, tx), as cubics within tol, appended to out. */
export function offsetCubic(c: Cubic, d: number, tol: number, out: Cubic[], depth = 0): void {
  const t0 = tangentAt(c, true);
  const t3 = tangentAt(c, false);
  if (t0[0] === 0 && t0[1] === 0) return;
  const n0: Pt = [-t0[1], t0[0]];
  const n3: Pt = [-t3[1], t3[0]];
  const o0: Pt = [c[0][0] + d * n0[0], c[0][1] + d * n0[1]];
  const o3: Pt = [c[3][0] + d * n3[0], c[3][1] + d * n3[1]];
  if (isStraight(c)) {
    out.push(line(o0, o3));
    return;
  }
  const s0 = 1 - d * curvatureAt(c, true);
  const s3 = 1 - d * curvatureAt(c, false);
  const l1 = dist(c[0], c[1]) > 1e-9 ? dist(c[0], c[1]) : dist(c[0], c[3]) / 3;
  const l2 = dist(c[3], c[2]) > 1e-9 ? dist(c[3], c[2]) : dist(c[0], c[3]) / 3;
  const a: Cubic = [
    o0,
    [o0[0] + t0[0] * l1 * s0, o0[1] + t0[1] * l1 * s0],
    [o3[0] - t3[0] * l2 * s3, o3[1] - t3[1] * l2 * s3],
    o3,
  ];
  let err = 0;
  for (const t of [0.25, 0.5, 0.75]) {
    const tn = unit(deriv(c, t));
    const p = cubicAt(c, t);
    const e: Pt = [p[0] - d * tn[1], p[1] + d * tn[0]];
    err = Math.max(err, dist(e, cubicAt(a, t)));
  }
  if (err <= tol || depth >= 7) {
    out.push(a);
    return;
  }
  const [l, r] = splitCubic(c, 0.5);
  offsetCubic(l, d, tol, out, depth + 1);
  offsetCubic(r, d, tol, out, depth + 1);
}

export const reverseCubic = (c: Cubic): Cubic => [c[3], c[2], c[1], c[0]];
export const reverseChain = (ch: Cubic[]): Cubic[] => ch.map(reverseCubic).reverse();

/** Arc of radius r around centre from angle a0 by sweep (radians), as cubics of at most 90 degrees. */
export function arcChain(centre: Pt, r: number, a0: number, sweep: number): Cubic[] {
  const n = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 2) - 1e-9));
  const step = sweep / n;
  const k = (4 / 3) * Math.tan(step / 4);
  const out: Cubic[] = [];
  for (let i = 0; i < n; i++) {
    const s = a0 + i * step;
    const e = s + step;
    const p0: Pt = [centre[0] + r * Math.cos(s), centre[1] + r * Math.sin(s)];
    const p3: Pt = [centre[0] + r * Math.cos(e), centre[1] + r * Math.sin(e)];
    out.push([
      p0,
      [p0[0] - k * r * Math.sin(s), p0[1] + k * r * Math.cos(s)],
      [p3[0] + k * r * Math.sin(e), p3[1] - k * r * Math.cos(e)],
      p3,
    ]);
  }
  return out;
}

/** Shoelace sum of a chain's control polygon (the sign of the ring's turning, not an exact area). */
export function ringSign(ch: Cubic[]): number {
  let s = 0;
  const pts: Pt[] = [];
  for (const c of ch) pts.push(c[0], c[1], c[2]);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s;
}

/**
 * A chain of cubics (each ends where the next starts) as a path; handles that sit on their anchor are dropped.
 * A cubic that lies within `flat` of its chord becomes a straight side.
 */
export function chainToPath(ch: Cubic[], closed: boolean, flat = 1e-9): EditPath {
  const anchors: Anchor[] = [{ x: ch[0][0][0], y: ch[0][0][1], kind: 'corner' }];
  for (const c of ch) {
    const prev = anchors[anchors.length - 1];
    const next: Anchor = { x: c[3][0], y: c[3][1], kind: 'corner' };
    if (!isStraight(c, flat)) {
      if (!same(c[1], c[0])) prev.out = [c[1][0], c[1][1]];
      if (!same(c[2], c[3])) next.in = [c[2][0], c[2][1]];
    }
    anchors.push(next);
  }
  if (closed && anchors.length > 1) {
    const last = anchors.pop()!;
    if (last.in) anchors[0].in = last.in;
  }
  return { anchors, closed };
}

export const copyAnchor = (a: Anchor): Anchor => {
  const c: Anchor = { x: a.x, y: a.y };
  if (a.in) c.in = [a.in[0], a.in[1]];
  if (a.out) c.out = [a.out[0], a.out[1]];
  if (a.kind) c.kind = a.kind;
  return c;
};

export const copyPath = (p: EditPath): EditPath => ({ anchors: p.anchors.map(copyAnchor), closed: p.closed });

export function reversePath(p: EditPath): EditPath {
  const anchors = p.anchors.map((a) => {
    const c = copyAnchor(a);
    delete c.in;
    delete c.out;
    if (a.out) c.in = [a.out[0], a.out[1]];
    if (a.in) c.out = [a.in[0], a.in[1]];
    return c;
  });
  if (p.closed) {
    const first = anchors.shift()!;
    anchors.reverse();
    return { anchors: [first, ...anchors], closed: true };
  }
  return { anchors: anchors.reverse(), closed: false };
}

/** Segments over every path (closed: n, open: n - 1). */
export const totalSegments = (paths: EditPath[]): number => paths.reduce((s, p) => s + segCount(p), 0);

/** The editor's frame scale: longest side / 24, so unit limits written for a 24 frame carry over. */
export const frameScale = (f: { w: number; h: number }): number => Math.max(f.w, f.h) / 24;
