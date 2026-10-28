/*
 * Path model, editor-only: pure generators for the draw tools (contract path-model 1.0.0).
 * Freehand simplification (Ramer-Douglas-Peucker for corners, then a least-squares cubic fit per
 * stretch, after Schneider's "An algorithm for automatically fitting digitized curves", Graphics
 * Gems 1990) and shape paths: line, rectangle, ellipse, polygon, star. Shared by the SVG editor and
 * the animation studio. Coordinates are the document's own units.
 */
import type { Cubic, Pt } from '../contracts/path-model';
import { GEOM_EPS as EPS, bez, dist, segDist } from './core';
import { fmtNum, serialize, smoothAll, type Anchor, type EditPath } from './edit';

export type { Cubic, Pt };

const fp = (p: Pt): string => `${fmtNum(p[0])} ${fmtNum(p[1])}`;

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const dot = (a: Pt, b: Pt): number => a[0] * b[0] + a[1] * b[1];
const len = (a: Pt): number => Math.hypot(a[0], a[1]);
const norm = (a: Pt): Pt => {
  const l = len(a);
  return l < EPS ? [0, 0] : [a[0] / l, a[1] / l];
};

// ── freehand ──

/** Drop samples closer than `min` to the previous kept one (the last sample always stays). */
export function dedupePoints(points: Pt[], min: number): Pt[] {
  const out: Pt[] = [];
  for (const p of points) {
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) continue;
    if (!out.length || dist(out[out.length - 1], p) >= min) out.push([p[0], p[1]]);
  }
  const last = points[points.length - 1];
  if (out.length > 1 && last && dist(out[out.length - 1], last) > EPS && Number.isFinite(last[0]) && Number.isFinite(last[1])) out[out.length - 1] = [last[0], last[1]];
  return out;
}

/** Ramer-Douglas-Peucker: indices of the points kept (ends always). */
export function rdpIndices(points: Pt[], tolerance: number): number[] {
  const n = points.length;
  if (n < 3) return points.map((_, i) => i);
  const keep = new Uint8Array(n);
  keep[0] = 1;
  keep[n - 1] = 1;
  const stack: Array<[number, number]> = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let best = -1;
    let bd = tolerance;
    for (let i = a + 1; i < b; i++) {
      const d = segDist(points[i], points[a], points[b]);
      if (d > bd) {
        bd = d;
        best = i;
      }
    }
    if (best > 0) {
      keep[best] = 1;
      stack.push([a, best], [best, b]);
    }
  }
  const out: number[] = [];
  keep.forEach((k, i) => k && out.push(i));
  return out;
}

/** Ramer-Douglas-Peucker: the points kept. */
export const rdp = (points: Pt[], tolerance: number): Pt[] => rdpIndices(points, tolerance).map((i) => points[i]);

const bezD1 = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  return [
    3 * u * u * (c[1][0] - c[0][0]) + 6 * u * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]),
    3 * u * u * (c[1][1] - c[0][1]) + 6 * u * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]),
  ];
};
const bezD2 = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  return [
    6 * u * (c[2][0] - 2 * c[1][0] + c[0][0]) + 6 * t * (c[3][0] - 2 * c[2][0] + c[1][0]),
    6 * u * (c[2][1] - 2 * c[1][1] + c[0][1]) + 6 * t * (c[3][1] - 2 * c[2][1] + c[1][1]),
  ];
};

function chordParams(pts: Pt[]): number[] {
  const u = [0];
  for (let i = 1; i < pts.length; i++) u.push(u[i - 1] + dist(pts[i], pts[i - 1]));
  const total = u[u.length - 1] || 1;
  return u.map((v) => v / total);
}

/** Least-squares cubic through pts with fixed end tangents (Schneider). */
function generateBezier(pts: Pt[], u: number[], t1: Pt, t2: Pt): Cubic {
  const first = pts[0];
  const last = pts[pts.length - 1];
  let c00 = 0;
  let c01 = 0;
  let c11 = 0;
  let x0 = 0;
  let x1 = 0;
  for (let i = 0; i < pts.length; i++) {
    const t = u[i];
    const v = 1 - t;
    const a1 = mul(t1, 3 * t * v * v);
    const a2 = mul(t2, 3 * t * t * v);
    c00 += dot(a1, a1);
    c01 += dot(a1, a2);
    c11 += dot(a2, a2);
    const tmp = sub(pts[i], add(mul(first, v * v * v + 3 * t * v * v), mul(last, 3 * t * t * v + t * t * t)));
    x0 += dot(a1, tmp);
    x1 += dot(a2, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  let alpha1 = Math.abs(det) < EPS ? 0 : (x0 * c11 - c01 * x1) / det;
  let alpha2 = Math.abs(det) < EPS ? 0 : (c00 * x1 - c01 * x0) / det;
  const segLen = dist(first, last);
  const eps = 1e-6 * segLen;
  if (alpha1 < eps || alpha2 < eps) {
    alpha1 = segLen / 3;
    alpha2 = segLen / 3;
  }
  return [first, add(first, mul(t1, alpha1)), add(last, mul(t2, alpha2)), last];
}

function maxError(pts: Pt[], c: Cubic, u: number[]): { err: number; split: number } {
  let err = 0;
  let split = Math.floor(pts.length / 2);
  for (let i = 1; i < pts.length - 1; i++) {
    const d = dist(bez(c, u[i]), pts[i]);
    if (d > err) {
      err = d;
      split = i;
    }
  }
  return { err, split: Math.min(pts.length - 2, Math.max(1, split)) };
}

function reparameterize(pts: Pt[], u: number[], c: Cubic): number[] {
  return u.map((t, i) => {
    const d = sub(bez(c, t), pts[i]);
    const d1 = bezD1(c, t);
    const d2 = bezD2(c, t);
    const den = dot(d1, d1) + dot(d, d2);
    if (Math.abs(den) < EPS) return t;
    return Math.min(1, Math.max(0, t - dot(d, d1) / den));
  });
}

function fitRange(pts: Pt[], t1: Pt, t2: Pt, error: number, out: Cubic[], depth: number): void {
  if (pts.length === 2 || depth > 24) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    const k = dist(a, b) / 3;
    out.push([a, add(a, mul(t1, k)), add(b, mul(t2, k)), b]);
    return;
  }
  let u = chordParams(pts);
  let c = generateBezier(pts, u, t1, t2);
  let { err, split } = maxError(pts, c, u);
  if (err <= error) {
    out.push(c);
    return;
  }
  if (err <= error * 4) {
    for (let k = 0; k < 6; k++) {
      u = reparameterize(pts, u, c);
      c = generateBezier(pts, u, t1, t2);
      ({ err, split } = maxError(pts, c, u));
      if (err <= error) {
        out.push(c);
        return;
      }
    }
  }
  let tc = norm(sub(pts[split - 1], pts[split + 1]));
  if (len(tc) < EPS) tc = norm(sub(pts[split - 1], pts[split]));
  fitRange(pts.slice(0, split + 1), t1, tc, error, out, depth + 1);
  fitRange(pts.slice(split), mul(tc, -1), t2, error, out, depth + 1);
}

/** Cubic beziers through the samples, each sample within `tolerance` of the curve. */
export function fitCubics(points: Pt[], tolerance: number): Cubic[] {
  const pts = dedupePoints(points, 1e-6);
  if (pts.length < 2) return [];
  const t1 = norm(sub(pts[1], pts[0]));
  const t2 = norm(sub(pts[pts.length - 2], pts[pts.length - 1]));
  const out: Cubic[] = [];
  fitRange(pts, t1, t2, Math.max(1e-4, tolerance), out, 0);
  return out;
}

/** Most segments a freehand stroke keeps (path data stays far below the 8192-character cap). */
export const MAX_FREEHAND_SEGMENTS = 60;
/** Most pointer samples a stroke keeps (the overlay stops collecting there; longer input is thinned). */
export const MAX_FREEHAND_SAMPLES = 4000;
/** A turn sharper than this between simplified stretches is a corner (not smoothed over). */
const CORNER_DEG = 70;

export interface FreehandResult {
  d: string;
  segments: number;
  closed: boolean;
}

/** Anchors with handles from consecutive cubics (a closed run folds its end into the start). */
function cubicsToEditPath(cubics: Cubic[], closed: boolean): EditPath {
  const anchors: Anchor[] = [{ x: cubics[0][0][0], y: cubics[0][0][1] }];
  const lineLike = (c: Cubic): boolean => segDist(c[1], c[0], c[3]) < 1e-3 && segDist(c[2], c[0], c[3]) < 1e-3;
  for (const c of cubics) {
    const prev = anchors[anchors.length - 1];
    const next: Anchor = { x: c[3][0], y: c[3][1] };
    if (!lineLike(c)) {
      if (dist(c[1], c[0]) > 1e-3) prev.out = [c[1][0], c[1][1]];
      if (dist(c[2], c[3]) > 1e-3) next.in = [c[2][0], c[2][1]];
    }
    anchors.push(next);
  }
  if (closed && anchors.length > 2) {
    const last = anchors.pop()!;
    anchors[0].in = last.in;
  }
  return { anchors, closed: closed && anchors.length > 1 };
}

function fitOnce(pts: Pt[], tol: number, closed: boolean, corners: boolean): Cubic[] {
  // corners: RDP vertices where the stroke turns sharply split it into stretches fitted alone
  const cuts = [0];
  if (corners) {
    const idx = rdpIndices(pts, tol);
    for (let k = 1; k < idx.length - 1; k++) {
      const a = pts[idx[k - 1]];
      const b = pts[idx[k]];
      const c = pts[idx[k + 1]];
      const v1 = sub(b, a);
      const v2 = sub(c, b);
      if (len(v1) < tol * 2 || len(v2) < tol * 2) continue;
      const cos = dot(v1, v2) / (len(v1) * len(v2));
      if (cos < Math.cos((CORNER_DEG * Math.PI) / 180)) cuts.push(idx[k]);
    }
  }
  cuts.push(pts.length - 1);
  const out: Cubic[] = [];
  for (let k = 0; k + 1 < cuts.length; k++) {
    const run = pts.slice(cuts[k], cuts[k + 1] + 1);
    if (run.length < 2) continue;
    let t1 = norm(sub(run[1], run[0]));
    let t2 = norm(sub(run[run.length - 2], run[run.length - 1]));
    // a closed stroke without a corner at its start: one shared tangent there (no kink at the seam)
    if (closed && cuts.length === 2 && run.length > 3) {
      const tc = norm(sub(run[1], run[run.length - 2]));
      if (len(tc) > EPS) {
        t1 = tc;
        t2 = mul(tc, -1);
      }
    }
    fitRange(run, t1, t2, tol, out, 0);
  }
  return out;
}

/**
 * A freehand stroke (pointer samples) as smooth path data: near-duplicate samples dropped, sharp
 * corners kept, the stretches between them fitted with cubics within `tolerance` (viewBox units).
 * A stroke that ends where it began is closed. At most MAX_FREEHAND_SEGMENTS segments: a scribble
 * that needs more is fitted looser.
 */
export function fitFreehand(points: Pt[], tolerance: number): FreehandResult {
  const tol = Math.max(0.01, tolerance);
  const step = Math.ceil(points.length / MAX_FREEHAND_SAMPLES);
  const thin = step > 1 ? points.filter((_, i) => i % step === 0 || i === points.length - 1) : points;
  const pts = dedupePoints(thin, Math.max(0.005, tol / 10));
  if (pts.length < 2) return { d: '', segments: 0, closed: false };
  if (pts.length === 2) return { d: `M${fp(pts[0])} L${fp(pts[1])}`, segments: 1, closed: false };
  let travel = 0;
  for (let i = 1; i < pts.length; i++) travel += dist(pts[i], pts[i - 1]);
  const gap = Math.max(tol * 2, 0.6);
  const closed = pts.length >= 8 && dist(pts[0], pts[pts.length - 1]) <= gap && travel > gap * 6;
  if (closed) pts[pts.length - 1] = [pts[0][0], pts[0][1]];

  const finish = (cubics: Cubic[]): FreehandResult => {
    const path = cubicsToEditPath(cubics, closed);
    return { d: serialize(path), segments: cubics.length, closed: path.closed };
  };
  for (let k = 0, t = tol; k < 8; k++, t *= 1.6) {
    const cubics = fitOnce(pts, t, closed, true);
    if (cubics.length && cubics.length <= MAX_FREEHAND_SEGMENTS) return finish(cubics);
  }
  // still too many (a dense scribble full of corners): fewer points, smoothed through
  let t = tol;
  let keep = rdp(pts, t);
  while (keep.length > MAX_FREEHAND_SEGMENTS + 1) keep = rdp(pts, (t *= 1.5));
  // a closed stroke stays closed: its last point repeats the first, so it goes
  if (closed && keep.length > 3) keep = keep.slice(0, -1);
  const shut = closed && keep.length > 2;
  const path = smoothAll({ anchors: keep.map(([x, y]) => ({ x, y })), closed: shut });
  return { d: serialize(path), segments: shut ? keep.length : keep.length - 1, closed: shut };
}

// ── shape paths ──

/** Bezier circle constant: control distance for a quarter arc of radius 1. */
const KAPPA = 0.5522847498;

/** A rectangle, corners rounded by `radius` (clamped to half the short side). */
export function rectPath(x: number, y: number, w: number, h: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  if (r < 0.005) return `M${fp([x, y])} H${fmtNum(x + w)} V${fmtNum(y + h)} H${fmtNum(x)} Z`;
  const k = r * (1 - KAPPA);
  const R = x + w;
  const B = y + h;
  return [
    `M${fp([x + r, y])}`,
    `H${fmtNum(R - r)}`,
    `C${fp([R - k, y])} ${fp([R, y + k])} ${fp([R, y + r])}`,
    `V${fmtNum(B - r)}`,
    `C${fp([R, B - k])} ${fp([R - k, B])} ${fp([R - r, B])}`,
    `H${fmtNum(x + r)}`,
    `C${fp([x + k, B])} ${fp([x, B - k])} ${fp([x, B - r])}`,
    `V${fmtNum(y + r)}`,
    `C${fp([x, y + k])} ${fp([x + k, y])} ${fp([x + r, y])}`,
    'Z',
  ].join(' ');
}

/** An ellipse as four cubics, starting at its right-most point. */
export function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  const kx = rx * KAPPA;
  const ky = ry * KAPPA;
  return [
    `M${fp([cx + rx, cy])}`,
    `C${fp([cx + rx, cy + ky])} ${fp([cx + kx, cy + ry])} ${fp([cx, cy + ry])}`,
    `C${fp([cx - kx, cy + ry])} ${fp([cx - rx, cy + ky])} ${fp([cx - rx, cy])}`,
    `C${fp([cx - rx, cy - ky])} ${fp([cx - kx, cy - ry])} ${fp([cx, cy - ry])}`,
    `C${fp([cx + kx, cy - ry])} ${fp([cx + rx, cy - ky])} ${fp([cx + rx, cy])}`,
    'Z',
  ].join(' ');
}

export const linePath = (a: Pt, b: Pt): string => `M${fp(a)} L${fp(b)}`;

/** A regular polygon with `sides` corners on a circle of radius `r`, the first corner at `rotation` degrees (-90: up). */
export function polygonPath(cx: number, cy: number, r: number, sides: number, rotation = -90): string {
  return starPath(cx, cy, r, r, Math.max(3, Math.round(sides)), rotation, true);
}

/** A star with `points` tips on radius `outer`, valleys on radius `inner`. */
export function starPath(cx: number, cy: number, outer: number, inner: number, points: number, rotation = -90, plain = false): string {
  const n = Math.max(3, Math.round(points));
  const count = plain ? n : n * 2;
  const pts = Array.from({ length: count }, (_, i): Pt => {
    const a = ((rotation + (360 / count) * i) * Math.PI) / 180;
    const r = plain || i % 2 === 0 ? outer : inner;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return `M${pts.map(fp).join(' L')} Z`;
}
