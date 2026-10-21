import { FLOW_GEOMETRY } from '../contracts/flow-look';

/*
 * Path sampler of the flow-look chunk (contract flow-look 1.0.0). Parses exactly the
 * grammar flowPath() emits (absolute M L H V C A; arcs rx = ry, no rotation, small arc), so lengths
 * and offsets never come from DOM measuring. Conventions: y down; N = (-ty, tx); T' = k N (k signed
 * curvature); an offset curve P = C + o N has P' = T (1 - k o), so a loop needs k * o >= 1.
 */

const NUM = /-?\d*\.?\d+(?:e-?\d+)?/g;
const TAU = Math.PI * 2;

export interface Pt {
  x: number;
  y: number;
  /** Unit tangent. */
  tx: number;
  ty: number;
  /** Signed curvature (1 / px). */
  k: number;
  /** Arc length from the start. */
  s: number;
  /** 1: the end of a straight piece (its tangent holds for the whole piece). */
  ln: number;
}
export interface XY {
  x: number;
  y: number;
}
export interface Sampled {
  pts: Pt[];
  /** Corner arcs as [from s, to s]. */
  corners: [number, number][];
  /** The stretches between path ends and corner arcs: [from s, to s, taper length T]. */
  runs: [number, number, number][];
  L: number;
  /** Bounding box of the centre line. */
  box: [number, number, number, number];
}

/** Dense centre-line samples (1 px) with tangent and signed curvature, plus the corner arcs. */
export function sample(d: string, step = 1): Sampled {
  const pts: Pt[] = [];
  const corners: [number, number][] = [];
  let cx = 0;
  let cy = 0;
  let s = 0;
  const add = (x: number, y: number, tx: number, ty: number, k: number, ln = 0): void => {
    if (pts.length) s += Math.hypot(x - cx, y - cy);
    pts.push({ x, y, tx, ty, k, s, ln });
    cx = x;
    cy = y;
  };
  for (const [, c, a] of d.matchAll(/([MLHVCA])([^MLHVCA]*)/g)) {
    const v = (a.match(NUM) ?? []).map(Number);
    if (c === 'M') {
      add(v[0], v[1], 1, 0, 0);
      continue;
    }
    const x0 = cx;
    const y0 = cy;
    if (c === 'C') {
      const [a1, b1, a2, b2, x, y] = v;
      const n = Math.max(2, Math.ceil((Math.hypot(a1 - x0, b1 - y0) + Math.hypot(a2 - a1, b2 - b1) + Math.hypot(x - a2, y - b2)) / step));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const u = 1 - t;
        const dx = 3 * (u * u * (a1 - x0) + 2 * u * t * (a2 - a1) + t * t * (x - a2));
        const dy = 3 * (u * u * (b1 - y0) + 2 * u * t * (b2 - b1) + t * t * (y - b2));
        const ex = 6 * (u * (a2 - 2 * a1 + x0) + t * (x - 2 * a2 + a1));
        const ey = 6 * (u * (b2 - 2 * b1 + y0) + t * (y - 2 * b2 + b1));
        const m = Math.hypot(dx, dy) || 1;
        add(
          u * u * u * x0 + 3 * u * u * t * a1 + 3 * u * t * t * a2 + t * t * t * x,
          u * u * u * y0 + 3 * u * u * t * b1 + 3 * u * t * t * b2 + t * t * t * y,
          dx / m,
          dy / m,
          (dx * ey - dy * ex) / (m * m * m),
        );
      }
    } else if (c === 'A') {
      const r = v[0];
      const sw = v[4];
      const x = v[5];
      const y = v[6];
      const mx = (x0 + x) / 2;
      const my = (y0 + y) / 2;
      const h = Math.hypot(x - x0, y - y0) / 2;
      const q = Math.sqrt(Math.max(0, r * r - h * h)) / (2 * (h || 1));
      let ox = 0;
      let oy = 0;
      let th0 = 0;
      let dl = 0;
      for (const g of [1, -1]) {
        ox = mx - g * q * (y - y0);
        oy = my + g * q * (x - x0);
        th0 = Math.atan2(y0 - oy, x0 - ox);
        dl = Math.atan2(y - oy, x - ox) - th0;
        if (sw && dl < 0) dl += TAU;
        else if (!sw && dl > 0) dl -= TAU;
        if (Math.abs(dl) <= Math.PI + 1e-9) break; // the small arc
      }
      const n = Math.max(4, Math.ceil((r * Math.abs(dl)) / step));
      const s0 = s;
      cx = x0;
      cy = y0;
      for (let i = 1; i <= n; i++) {
        const th = th0 + (dl * i) / n;
        add(ox + r * Math.cos(th), oy + r * Math.sin(th), sw ? -Math.sin(th) : Math.sin(th), sw ? Math.cos(th) : -Math.cos(th), sw ? 1 / r : -1 / r);
      }
      corners.push([s0, s]);
    } else {
      const x = c === 'V' ? x0 : v[0];
      const y = c === 'H' ? y0 : c === 'V' ? v[0] : v[1];
      const m = Math.hypot(x - x0, y - y0) || 1;
      add(x, y, (x - x0) / m, (y - y0) / m, 0, 1);
    }
  }
  if (pts.length > 1) {
    pts[0].tx = pts[1].tx;
    pts[0].ty = pts[1].ty;
  }
  const L = s;
  // taper stretches: between the ends and the corner arcs; T = min(12, run / 4) (short runs taper less)
  const runs: [number, number, number][] = [];
  let a = 0;
  for (const [from, to] of [...corners, [L, L] as [number, number]]) {
    if (from - a > 1e-6) runs.push([a, from, Math.min(FLOW_GEOMETRY.taperMax, (from - a) * FLOW_GEOMETRY.taperRunShare)]);
    a = to;
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return { pts, corners, runs, L, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
}

export interface At extends XY {
  tx: number;
  ty: number;
  k: number;
}

/** Centre-line state at arc length s (linear between the dense samples). */
export function at(S: Sampled, s: number): At {
  const p = S.pts;
  let lo = 0;
  let hi = p.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (p[m].s <= s) lo = m;
    else hi = m;
  }
  const a = p[lo];
  const b = p[hi];
  const f = b.s > a.s ? Math.min(1, Math.max(0, (s - a.s) / (b.s - a.s))) : 0;
  const tx = b.ln ? b.tx : a.tx + (b.tx - a.tx) * f;
  const ty = b.ln ? b.ty : a.ty + (b.ty - a.ty) * f;
  const m = Math.hypot(tx, ty) || 1;
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, tx: tx / m, ty: ty / m, k: b.ln ? 0 : a.k + (b.k - a.k) * f };
}

const smooth = (t: number): number => (t >= 1 ? 1 : t <= 0 ? 0 : t * t * (3 - 2 * t));

/**
 * Wave / zigzag amplitude limits at s: [smoothstep taper 0..1, cap]. The taper is 0 on a corner arc
 * and at both path ends and grows over T = min(12, run / 4) px inside each stretch; on a short
 * stretch (T < 12) the amplitude is also capped at T, so a stub never gets a steep jump.
 */
export function taper(S: Sampled, s: number): [number, number] {
  for (const [a, b, T] of S.runs) {
    if (s >= a && s <= b) return [smooth(Math.min(s - a, b - s) / T), T < FLOW_GEOMETRY.taperMax ? T : Infinity];
  }
  return [0, Infinity];
}

/** Douglas-Peucker on a point list (iterative, tolerance in px). */
export function simplify(P: XY[], tol: number = FLOW_GEOMETRY.simplifyPx): XY[] {
  if (P.length < 3) return P;
  const keep = new Uint8Array(P.length);
  keep[0] = keep[P.length - 1] = 1;
  const st: [number, number][] = [[0, P.length - 1]];
  while (st.length) {
    const [i, j] = st.pop()!;
    let md = 0;
    let mk = -1;
    const ax = P[i].x;
    const ay = P[i].y;
    const dx = P[j].x - ax;
    const dy = P[j].y - ay;
    const l = Math.hypot(dx, dy) || 1;
    for (let k = i + 1; k < j; k++) {
      const e = Math.abs((P[k].x - ax) * dy - (P[k].y - ay) * dx) / l;
      if (e > md) {
        md = e;
        mk = k;
      }
    }
    if (md > tol) {
      keep[mk] = 1;
      st.push([i, mk], [mk, j]);
    }
  }
  return P.filter((_, i) => keep[i]);
}

const cross = (ax: number, ay: number, bx: number, by: number): number => ax * by - ay * bx;

/** Cuts swallowtails: when segment i crosses a later one within W segments, the loop becomes the crossing. */
export function unloop(P: XY[], W = 80): XY[] {
  const o = P.slice();
  for (let i = 0; i < o.length - 3; i++) {
    for (let j = i + 2; j < Math.min(o.length - 1, i + W); j++) {
      const rx = o[i + 1].x - o[i].x;
      const ry = o[i + 1].y - o[i].y;
      const qx = o[j + 1].x - o[j].x;
      const qy = o[j + 1].y - o[j].y;
      const den = cross(rx, ry, qx, qy);
      if (!den) continue;
      const wx = o[j].x - o[i].x;
      const wy = o[j].y - o[i].y;
      const t = cross(wx, wy, qx, qy) / den;
      const u = cross(wx, wy, rx, ry) / den;
      if (t > 0 && t < 1 && u > 0 && u < 1) {
        o.splice(i + 1, j - i, { x: o[i].x + rx * t, y: o[i].y + ry * t });
        j = i + 1;
      }
    }
  }
  return o;
}

/** Rounded to 0.01 px. */
export const fmt = (v: number): string => String(Math.round(v * 100) / 100);
export const toD = (P: XY[]): string => P.map((p, i) => (i ? 'L' : 'M') + fmt(p.x) + ' ' + fmt(p.y)).join(' ');

/** Arc-length grid: the periodic `every` px plus every dense sample that is curved or inside a taper ramp. */
function grid(S: Sampled, every: number): number[] {
  const out = new Set<number>([0, S.L]);
  for (let s = 0; s < S.L; s += every) out.add(s);
  for (let s = 0; s < S.L; s += 2) if (taper(S, s)[0] < 1) out.add(s);
  S.pts.forEach((p) => {
    if (p.k) out.add(p.s);
  });
  for (const [a, b] of S.corners) out.add(a).add(b);
  return [...out].sort((a, b) => a - b);
}

/**
 * wave / zigzag: the points of the offset line (still shape, phase 0). Amplitude <= amp, <= 40 % of
 * the local radius of curvature, tapered per stretch (see taper). `jitter` (electric variants):
 * each zigzag peak is 30-100 % of the amplitude, seeded by `jitter`.
 */
export function wavy(S: Sampled, kind: 'wave' | 'zigzag', amp: number, wl: number, jitter = 0): XY[] {
  const tol = FLOW_GEOMETRY.simplifyPx;
  const every = kind === 'wave' ? wl / Math.min(wl, Math.max(12, Math.ceil(Math.PI / Math.acos(Math.max(0, 1 - tol / amp))))) : wl / 4;
  const P = grid(S, every).map((s) => {
    const c = at(S, s);
    const ph = (s / wl) % 1;
    const w = kind === 'wave' ? Math.sin(TAU * ph) : ph < 0.25 ? ph * 4 : ph < 0.75 ? 2 - ph * 4 : ph * 4 - 4;
    const [t, cap] = taper(S, s);
    const j = jitter ? 0.3 + 0.7 * rnd(jitter, Math.floor((s + wl / 4) / (wl / 2))) : 1;
    const a = Math.min(amp * j, cap, c.k ? (FLOW_GEOMETRY.curvatureShare / Math.abs(c.k)) : Infinity) * t;
    return { x: c.x - c.ty * a * w, y: c.y + c.tx * a * w };
  });
  return simplify(P);
}

/** Seeded 0..1 (stable across renders). */
export function rnd(seed: number, i: number): number {
  let h = (seed ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The centre line moved `off` px along its normal (loops cut), between arc lengths s0 and s1. */
export function lane(S: Sampled, off: number, s0 = 0, s1 = S.L): XY[] {
  const q = (p: At): XY => ({ x: p.x - p.ty * off, y: p.y + p.tx * off });
  const mid = S.pts.filter((p) => p.s > s0 && p.s < s1);
  const P = [q(at(S, s0)), ...mid.map(q), q(at(S, s1))];
  return simplify(Math.abs(off) > 0.5 ? unloop(P) : P);
}

/** double: both rails at +-(gap + width) / 2 (inner corners mitred). */
export const rails = (S: Sampled, gap: number, width: number): XY[][] => {
  const o = (gap + width) / 2;
  return [lane(S, o), lane(S, -o)];
};
