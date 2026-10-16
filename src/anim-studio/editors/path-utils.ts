import { toCubicSubpaths, type Cubic, type Pt } from '../../icons/path-math';
import { samplePath, type PathSample } from '../compile';
import type { PathSpec } from '../model';

/*
 * Path motion editing, pure: path data <-> an editable list of anchor points with bezier handles,
 * and the operations the path editor offers (insert, delete, smooth, straighten, reverse, close,
 * templates). Coordinates are the document's own units (PathSpec.units, usually % of the moving
 * element's size), so nothing here knows about the stage.
 *
 * Only the first subpath is edited (motion runs along one line); serialising writes it alone.
 */

export type { Pt };

export interface Anchor {
  x: number;
  y: number;
  /** Incoming handle, absolute; undefined: none (the segment arrives straight). */
  in?: Pt;
  /** Outgoing handle, absolute; undefined: none. */
  out?: Pt;
}

export interface EditPath {
  anchors: Anchor[];
  /** The last anchor joins the first again (the path ends with Z). */
  closed: boolean;
}

/** Most anchors an edited path keeps (path data stays well under the 8192-character cap). */
export const MAX_ANCHORS = 100;

const EPS = 1e-4;
const near = (a: Pt, b: Pt, eps = EPS): boolean => Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pt = (a: Anchor): Pt => [a.x, a.y];
const copyPt = (p: Pt | undefined): Pt | undefined => (p ? [p[0], p[1]] : undefined);

export const copyAnchor = (a: Anchor): Anchor => ({ x: a.x, y: a.y, in: copyPt(a.in), out: copyPt(a.out) });
export const copyPath = (p: EditPath): EditPath => ({ anchors: p.anchors.map(copyAnchor), closed: p.closed });

/** The first subpath's own text (up to the next moveto), to see whether it is closed. */
function firstSubpathText(d: string): string {
  const m = /^\s*[Mm][^Mm]*/.exec(d);
  return m ? m[0] : '';
}

/** A cubic whose controls sit on the chord at 1/3 and 2/3: a straight line. */
const isLine = (c: Cubic): boolean => {
  const tol = Math.max(EPS, Math.hypot(c[3][0] - c[0][0], c[3][1] - c[0][1]) * 1e-3);
  return near(c[1], lerp(c[0], c[3], 1 / 3), tol) && near(c[2], lerp(c[0], c[3], 2 / 3), tol);
};

/** Path data -> anchors (first subpath; lines get no handles, a handle on its anchor is none). */
export function parsePath(d: string): EditPath {
  const sub = (d ? toCubicSubpaths(d)[0] : undefined) ?? [];
  const closed = sub.length > 0 && /[Zz]/.test(firstSubpathText(d));
  if (!sub.length) {
    // "M x y" alone: a single anchor (a path being drawn)
    const m = /^\s*[Mm]\s*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)[\s,]*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/.exec(d || '');
    return { anchors: m ? [{ x: Number(m[1]), y: Number(m[2]) }] : [], closed: false };
  }
  const anchors: Anchor[] = [{ x: sub[0][0][0], y: sub[0][0][1] }];
  for (const c of sub) {
    const prev = anchors[anchors.length - 1];
    const next: Anchor = { x: c[3][0], y: c[3][1] };
    if (!isLine(c)) {
      if (!near(c[1], c[0])) prev.out = [c[1][0], c[1][1]];
      if (!near(c[2], c[3])) next.in = [c[2][0], c[2][1]];
    }
    anchors.push(next);
  }
  if (closed && anchors.length > 1) {
    // the closing segment ends on the start: fold that duplicate into the first anchor
    const last = anchors.pop()!;
    anchors[0].in = last.in;
  }
  return { anchors, closed: closed && anchors.length > 1 };
}

/** A number for path data: at most 2 decimals, no exponent, no -0. */
export function fmtNum(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) || Math.abs(r) < 0.005 ? 0 : r);
}
const fp = (p: Pt): string => `${fmtNum(p[0])} ${fmtNum(p[1])}`;

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

const segIsLine = (p: EditPath, i: number): boolean => {
  const a = p.anchors[i];
  const b = p.anchors[(i + 1) % p.anchors.length];
  return !a.out && !b.in;
};

/** Anchors -> path data: L for straight segments, C otherwise, Z when closed. */
export function serializePath(p: EditPath): string {
  const n = p.anchors.length;
  if (!n) return '';
  const parts = [`M${fp(pt(p.anchors[0]))}`];
  const segs = segmentCount(p);
  for (let i = 0; i < segs; i++) {
    const c = segment(p, i);
    const closing = p.closed && i === segs - 1;
    if (segIsLine(p, i)) {
      if (!closing) parts.push(`L${fp(c[3])}`);
    } else parts.push(`C${fp(c[1])} ${fp(c[2])} ${fp(c[3])}`);
  }
  if (p.closed && n > 1) parts.push('Z');
  return parts.join(' ');
}

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

// ── geometry on segments ──

const cubicAt = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
};

/** Split a cubic at t (de Casteljau). */
export function splitCubic(c: Cubic, t: number): [Cubic, Cubic] {
  const [p0, p1, p2, p3] = c;
  const a = lerp(p0, p1, t);
  const b = lerp(p1, p2, t);
  const cc = lerp(p2, p3, t);
  const d = lerp(a, b, t);
  const e = lerp(b, cc, t);
  const f = lerp(d, e, t);
  return [
    [p0, a, d, f],
    [f, e, cc, p3],
  ];
}

/** The closest point on the path to `q`: segment index, t on it, the point and the distance. */
export function nearestOnPath(p: EditPath, q: Pt, scale: Pt = [1, 1]): { seg: number; t: number; point: Pt; dist: number } | undefined {
  const segs = segmentCount(p);
  if (!segs) return undefined;
  // distance measured in screen space when a scale is given (non-square stage units)
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
    // refine
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

/** Split segment `seg` at t: a new anchor on the curve, the shape unchanged. Returns its index. */
export function insertPoint(p: EditPath, seg: number, t: number): { path: EditPath; index: number } {
  const out = copyPath(p);
  const n = out.anchors.length;
  if (seg < 0 || seg >= segmentCount(out) || n >= MAX_ANCHORS) return { path: out, index: -1 };
  const ia = seg;
  const ib = (seg + 1) % n;
  const a = out.anchors[ia];
  const b = out.anchors[ib];
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

/** A new last anchor (or first, `atStart`), straight from its neighbour. */
export function appendPoint(p: EditPath, q: Pt, atStart = false): { path: EditPath; index: number } {
  const out = copyPath(p);
  if (out.anchors.length >= MAX_ANCHORS) return { path: out, index: -1 };
  const a: Anchor = { x: q[0], y: q[1] };
  if (atStart) {
    out.anchors.unshift(a);
    return { path: out, index: 0 };
  }
  out.anchors.push(a);
  return { path: out, index: out.anchors.length - 1 };
}

export function removePoint(p: EditPath, i: number): EditPath {
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
 * Set a handle of anchor i. `mirror`: the opposite handle points the other way at the same length
 * (a symmetric smooth point); otherwise only this handle moves (Alt: a cusp).
 */
export function setHandle(p: EditPath, i: number, which: 'in' | 'out', q: Pt, mirror: boolean): EditPath {
  const out = copyPath(p);
  const a = out.anchors[i];
  if (!a) return out;
  const h: Pt | undefined = near(q, pt(a)) ? undefined : [q[0], q[1]];
  a[which] = h;
  if (mirror) {
    const other = which === 'in' ? 'out' : 'in';
    a[other] = h ? [2 * a.x - h[0], 2 * a.y - h[1]] : undefined;
  }
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
  const n = p.anchors.length;
  const a = out.anchors[i];
  const o = crOffset(p, i);
  if (!o) return;
  const hasPrev = p.closed || i > 0;
  const hasNext = p.closed || i < n - 1;
  a.in = hasPrev ? [a.x - o[0], a.y - o[1]] : undefined;
  a.out = hasNext ? [a.x + o[0], a.y + o[1]] : undefined;
}

/** Every anchor smooth: a Catmull-Rom spline through the points, as cubics. */
export function smoothAll(p: EditPath): EditPath {
  const out = copyPath(p);
  for (let i = 0; i < out.anchors.length; i++) smoothAt(p, out, i);
  return out;
}

/** Every handle removed: straight lines between the points. */
export function straightenAll(p: EditPath): EditPath {
  return { anchors: p.anchors.map((a) => ({ x: a.x, y: a.y })), closed: p.closed };
}

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
export function reversePath(p: EditPath): EditPath {
  const flip = (a: Anchor): Anchor => ({ x: a.x, y: a.y, in: copyPt(a.out), out: copyPt(a.in) });
  const list = p.anchors.map(flip).reverse();
  if (p.closed && list.length) list.unshift(list.pop()!);
  return { anchors: list, closed: p.closed };
}

export function setClosed(p: EditPath, closed: boolean): EditPath {
  const out = copyPath(p);
  out.closed = closed && out.anchors.length > 1;
  if (!out.closed) {
    // the closing segment is gone: drop the handles that only shaped it
    if (out.anchors.length) {
      out.anchors[0].in = undefined;
      out.anchors[out.anchors.length - 1].out = undefined;
    }
  }
  return out;
}

export function translatePath(p: EditPath, dx: number, dy: number): EditPath {
  const mv = (q: Pt | undefined): Pt | undefined => (q ? [q[0] + dx, q[1] + dy] : undefined);
  return { anchors: p.anchors.map((a) => ({ x: a.x + dx, y: a.y + dy, in: mv(a.in), out: mv(a.out) })), closed: p.closed };
}

export const snap = (v: number, step: number): number => (step > 0 ? Math.round(v / step) * step : v);

// ── where the subject is ──

const sampleCache = new Map<string, PathSample[]>();

/** The subject's position and heading at progress t (0-1, by length, like the compiled motion). */
export function pointAtTime(d: string, t: number): PathSample | undefined {
  let s = sampleCache.get(d);
  if (!s) {
    s = d ? samplePath(d, 200) : [];
    if (sampleCache.size > 32) sampleCache.clear();
    sampleCache.set(d, s);
  }
  if (!s.length) return undefined;
  const f = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * (s.length - 1);
  const i = Math.min(s.length - 2, Math.floor(f));
  if (i < 0) return s[0];
  const a = s[i];
  const b = s[i + 1];
  const k = f - i;
  return { t: a.t + (b.t - a.t) * k, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: a.angle + (b.angle - a.angle) * k };
}

// ── templates ──

export type PathTemplateId = 'circle' | 'figure-8' | 'wave' | 'bounce' | 'zigzag' | 'spiral';

export const PATH_TEMPLATES: Array<{ id: PathTemplateId; label: string }> = [
  { id: 'circle', label: 'Circle' },
  { id: 'figure-8', label: 'Figure 8' },
  { id: 'wave', label: 'Wave' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'zigzag', label: 'Zigzag' },
  { id: 'spiral', label: 'Spiral' },
];

/**
 * A parametric curve as smooth anchors (Hermite to bezier: handle = P ± P'·Δ/3), sampled at `n`
 * steps over [t0, t1]; `closed` drops the duplicate end point.
 */
function parametric(f: (t: number) => Pt, df: (t: number) => Pt, t0: number, t1: number, n: number, closed: boolean): EditPath {
  const dt = (t1 - t0) / n;
  const anchors: Anchor[] = [];
  const count = closed ? n : n + 1;
  for (let i = 0; i < count; i++) {
    const t = t0 + i * dt;
    const [x, y] = f(t);
    const [vx, vy] = df(t);
    const h: Pt = [(vx * dt) / 3, (vy * dt) / 3];
    anchors.push({
      x,
      y,
      in: closed || i > 0 ? [x - h[0], y - h[1]] : undefined,
      out: closed || i < count - 1 ? [x + h[0], y + h[1]] : undefined,
    });
  }
  return { anchors, closed };
}

/**
 * Template path data in % units around `center` (the rest position (0, 0) for an element or icon,
 * the middle (50, 50) of the layer for particles). `size` is the half-width in % (default 40).
 */
export function templatePath(id: PathTemplateId, center: Pt = [0, 0], size = 40): string {
  const [cx, cy] = center;
  const s = size / 40;
  const TAU = Math.PI * 2;
  let p: EditPath;
  switch (id) {
    case 'circle': {
      const r = 30 * s;
      p = parametric((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)], (t) => [-r * Math.sin(t), r * Math.cos(t)], 0, TAU, 8, true);
      break;
    }
    case 'figure-8': {
      // lemniscate of Gerono on its side: crosses the centre at t = 0 and π
      const a = 36 * s;
      const b = 56 * s;
      p = parametric(
        (t) => [cx + a * Math.sin(t), cy + b * Math.sin(t) * Math.cos(t)],
        (t) => [a * Math.cos(t), b * Math.cos(2 * t)],
        0,
        TAU,
        8,
        true,
      );
      break;
    }
    case 'wave': {
      const w = 80 * s;
      const amp = 20 * s;
      const waves = 2;
      const k = (TAU * waves) / w;
      p = parametric((t) => [cx - w / 2 + t, cy - amp * Math.sin(k * t)], (t) => [1, -amp * k * Math.cos(k * t)], 0, w, waves * 4, false);
      break;
    }
    case 'bounce': {
      // hops of falling height left to right on a floor below the centre; each landing is a corner
      const floor = cy + 20 * s;
      const heights = [40, 25, 12].map((h) => h * s);
      const widths = [34, 26, 20].map((w) => w * s);
      let x = cx - 40 * s;
      const anchors: Anchor[] = [{ x, y: floor }];
      heights.forEach((h, i) => {
        const x1 = x + widths[i];
        // the parabola's quadratic control, raised to cubic controls
        const q: Pt = [x + widths[i] / 2, floor - 2 * h];
        anchors[anchors.length - 1].out = [x + (2 / 3) * (q[0] - x), floor + (2 / 3) * (q[1] - floor)];
        anchors.push({ x: x1, y: floor, in: [x1 + (2 / 3) * (q[0] - x1), floor + (2 / 3) * (q[1] - floor)] });
        x = x1;
      });
      p = { anchors, closed: false };
      break;
    }
    case 'zigzag': {
      const anchors: Anchor[] = [];
      const steps = 6;
      for (let i = 0; i <= steps; i++) anchors.push({ x: cx - 40 * s + (80 * s * i) / steps, y: cy + (i % 2 ? -15 : 15) * s });
      p = { anchors, closed: false };
      break;
    }
    case 'spiral': {
      // Archimedean, from the centre out, 2.5 turns
      const turns = 2.5;
      const end = TAU * turns;
      const b = (40 * s) / end;
      p = parametric(
        (t) => [cx + b * t * Math.cos(t), cy + b * t * Math.sin(t)],
        (t) => [b * (Math.cos(t) - t * Math.sin(t)), b * (Math.sin(t) + t * Math.cos(t))],
        0,
        end,
        turns * 4,
        false,
      );
      break;
    }
  }
  return serializePath(p);
}

/** Where templates centre for this subject: the rest position, or the layer middle for particles. */
export const templateCenter = (spec: Pick<PathSpec, 'subject' | 'units'>): Pt => (spec.subject === 'particles' && spec.units === 'percent' ? [50, 50] : [0, 0]);

/** Bounding box of a path's anchors and handles, for previews. */
export function pathBounds(p: EditPath): { x: number; y: number; w: number; h: number } | undefined {
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
