import { toCubicSubpaths, type Cubic, type Pt } from '../../icons/path-math';
import { ANIMATION_CAPS, type AnimationDoc, type AnimationKeyframe } from '../model';
import { V2_CAPS, type RigShape, type TargetRef, type Track } from '../model-v2';
import { fmtNum, serializePath, smoothAll, type Anchor, type EditPath } from './path-utils';

/*
 * Drawing on the icon, pure: freehand simplification (Ramer-Douglas-Peucker for corners, then a
 * least-squares cubic fit per stretch, after Schneider's "An algorithm for automatically fitting
 * digitized curves", Graphics Gems 1990), shape paths (line, rounded rectangle, ellipse), snapping
 * to a grid and to anchor points, hit testing, viewBox mapping, and the document edits the drawing
 * tools make (shapes in rig.shapes, their draw-on and motion-path tracks). Coordinates are icon
 * viewBox units (24 x 24 for MDI icons); nothing here knows about the stage.
 */

export type { Pt, Cubic };

const EPS = 1e-9;
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const dot = (a: Pt, b: Pt): number => a[0] * b[0] + a[1] * b[1];
const len = (a: Pt): number => Math.hypot(a[0], a[1]);
const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const norm = (a: Pt): Pt => {
  const l = len(a);
  return l < EPS ? [0, 0] : [a[0] / l, a[1] / l];
};
const r2 = (v: number): number => Math.round(v * 100) / 100;
const fp = (p: Pt): string => `${fmtNum(p[0])} ${fmtNum(p[1])}`;

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

const segDist = (p: Pt, a: Pt, b: Pt): number => {
  const ab = sub(b, a);
  const l2 = dot(ab, ab);
  if (l2 < EPS) return dist(p, a);
  const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / l2));
  return dist(p, add(a, mul(ab, t)));
};

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

const bez = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * c[0][0] + 3 * u * u * t * c[1][0] + 3 * u * t * t * c[2][0] + t * t * t * c[3][0],
    u * u * u * c[0][1] + 3 * u * u * t * c[1][1] + 3 * u * t * t * c[2][1] + t * t * t * c[3][1],
  ];
};
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
    return { d: serializePath(path), segments: cubics.length, closed: path.closed };
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
  return { d: serializePath(path), segments: shut ? keep.length : keep.length - 1, closed: shut };
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
  return bytes > ANIMATION_CAPS.bytes ? `The animation would be larger than ${Math.round(ANIMATION_CAPS.bytes / 1024)} KB (${Math.ceil(bytes / 1024)} KB).` : undefined;
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
