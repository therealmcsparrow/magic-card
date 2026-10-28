/*
 * Path model, runtime-safe part (contract path-model 1.0.0, src/contracts/path-model.ts).
 * Pure: no DOM, no lit. One parser for every SVG path command, the outline maths the shapes and
 * rings use (restart, reverse, flatten, nearest) and the cubic maths the icon morphs use.
 * The editor-only parts live in edit.ts, tidy.ts and draw.ts and are never imported from here.
 */
import type { Box, Cubic, PathData, Pt, Seg, SubPath } from '../contracts/path-model';

export type { Box, Cubic, PathData, Pt, Seg, SubPath };

const EPS = 1e-6;
const samePt = (a: Pt, b: Pt): boolean => Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const lineCubic = (a: Pt, b: Pt): Cubic => [a, lerpPt(a, b, 1 / 3), lerpPt(a, b, 2 / 3), b];
const quadSeg = (a: Pt, q: Pt, b: Pt): Seg => ({
  c1: [a[0] + (2 / 3) * (q[0] - a[0]), a[1] + (2 / 3) * (q[1] - a[1])],
  c2: [b[0] + (2 / 3) * (q[0] - b[0]), b[1] + (2 / 3) * (q[1] - b[1])],
  to: b,
});
const cubicOf = (from: Pt, s: Seg): Cubic => (s.c1 && s.c2 ? [from, s.c1, s.c2, s.to] : lineCubic(from, s.to));

const NUMBER = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

/** Path data scanner: commands, numbers (incl. compact `1.5.5`, exponents) and arc flags. */
class Scanner {
  private i = 0;
  constructor(private readonly d: string) {}
  private skip(): void {
    while (this.i < this.d.length && /[\s,]/.test(this.d[this.i])) this.i++;
  }
  done(): boolean {
    this.skip();
    return this.i >= this.d.length;
  }
  command(): string | undefined {
    this.skip();
    const c = this.d[this.i];
    if (c && /[MmLlHhVvCcSsQqTtAaZz]/.test(c)) {
      this.i++;
      return c;
    }
    return undefined;
  }
  hasNumber(): boolean {
    this.skip();
    return /[-+.\d]/.test(this.d[this.i] ?? '');
  }
  number(): number {
    this.skip();
    NUMBER.lastIndex = this.i;
    const m = NUMBER.exec(this.d);
    if (!m) throw new Error(`Bad path number at ${this.i}`);
    this.i += m[0].length;
    return Number(m[0]);
  }
  flag(): number {
    this.skip();
    const c = this.d[this.i];
    if (c !== '0' && c !== '1') throw new Error(`Bad arc flag at ${this.i}`);
    this.i++;
    return c === '1' ? 1 : 0;
  }
}

/** SVG arc (endpoint form) to pieces: cubics of at most 90 degrees (a flat arc is a line). */
function arcToSegs(p0: Pt, rx: number, ry: number, rotDeg: number, large: number, sweep: number, p1: Pt): Seg[] {
  if (samePt(p0, p1)) return [];
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx < EPS || ry < EPS) return [{ to: p1 }];
  const phi = (rotDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (p0[0] - p1[0]) / 2;
  const dy = (p0[1] - p1[1]) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coef = Math.sqrt(Math.max(0, num / den));
  if (large === sweep) coef = -coef;
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (p0[0] + p1[0]) / 2;
  const cy = sin * cxp + cos * cyp + (p0[1] + p1[1]) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number): number => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx;
  const vy = (-y1p - cyp) / ry;
  const theta1 = angle(1, 0, ux, uy);
  let dtheta = angle(ux, uy, vx, vy);
  if (!sweep && dtheta > 0) dtheta -= 2 * Math.PI;
  else if (sweep && dtheta < 0) dtheta += 2 * Math.PI;
  const n = Math.max(1, Math.ceil(Math.abs(dtheta) / (Math.PI / 2) - 1e-9));
  const delta = dtheta / n;
  const k = (4 / 3) * Math.tan(delta / 4);
  const point = (t: number): Pt => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
  const deriv = (t: number): Pt => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
  const out: Seg[] = [];
  let start = p0;
  for (let s = 0; s < n; s++) {
    const a = theta1 + s * delta;
    const b = a + delta;
    const end = s === n - 1 ? p1 : point(b);
    const da = deriv(a);
    const db = deriv(b);
    out.push({ c1: [start[0] + k * da[0], start[1] + k * da[1]], c2: [end[0] - k * db[0], end[1] - k * db[1]], to: end });
    start = end;
  }
  return out;
}

/** Any SVG path string (M L H V C S Q T A Z, absolute and relative) as subpaths. Invalid: []. */
export function parsePath(d: string): PathData {
  const sc = new Scanner(d);
  const subs: SubPath[] = [];
  let cur: SubPath | undefined;
  let pos: Pt = [0, 0];
  let start: Pt = [0, 0];
  let lastC: Pt | undefined; // previous cubic c2 (for S)
  let lastQ: Pt | undefined; // previous quadratic control (for T)
  let cmd: string | undefined;
  const push = (s: Seg): void => {
    if (!cur) {
      cur = { start: pos, segs: [], closed: false };
      subs.push(cur);
      start = pos;
    }
    cur.segs.push(s);
  };
  try {
    while (!sc.done()) {
      const next = sc.command();
      if (next) cmd = next;
      else if (!cmd || !sc.hasNumber()) break;
      else if (cmd === 'M') cmd = 'L';
      else if (cmd === 'm') cmd = 'l';
      const rel = cmd === cmd.toLowerCase();
      const ox = rel ? pos[0] : 0;
      const oy = rel ? pos[1] : 0;
      const pt = (): Pt => {
        const x = sc.number() + ox;
        return [x, sc.number() + oy];
      };
      let c: Pt | undefined;
      let q: Pt | undefined;
      let p: Pt | undefined;
      switch (cmd.toUpperCase()) {
        case 'M':
          pos = pt();
          start = pos;
          cur = undefined;
          break;
        case 'L':
          push({ to: (p = pt()) });
          break;
        case 'H':
          push({ to: (p = [sc.number() + ox, pos[1]]) });
          break;
        case 'V':
          push({ to: (p = [pos[0], sc.number() + oy]) });
          break;
        case 'C': {
          const c1 = pt();
          c = pt();
          push({ c1, c2: c, to: (p = pt()) });
          break;
        }
        case 'S': {
          const c1: Pt = lastC ? [2 * pos[0] - lastC[0], 2 * pos[1] - lastC[1]] : pos;
          c = pt();
          push({ c1, c2: c, to: (p = pt()) });
          break;
        }
        case 'Q':
          q = pt();
          push(quadSeg(pos, q, (p = pt())));
          break;
        case 'T':
          q = lastQ ? [2 * pos[0] - lastQ[0], 2 * pos[1] - lastQ[1]] : pos;
          push(quadSeg(pos, q, (p = pt())));
          break;
        case 'A': {
          const rx = sc.number();
          const ry = sc.number();
          const rot = sc.number();
          const large = sc.flag();
          const sweep = sc.flag();
          p = pt();
          arcToSegs(pos, rx, ry, rot, large, sweep, p).forEach(push);
          break;
        }
        case 'Z':
          if (cur && cur.segs.length) {
            if (!samePt(pos, start)) cur.segs.push({ to: start });
            cur.closed = true;
          }
          pos = start;
          cur = undefined;
          // Z takes no numbers: a following number is an error, stop parsing.
          cmd = undefined;
          break;
      }
      if (p) pos = p;
      lastC = c;
      lastQ = q;
    }
  } catch {
    // Malformed tail: keep what parsed (like browsers render up to the error).
  }
  return subs.filter((s) => s.segs.length > 0);
}

/** The first subpath of `d` as a closed outline (a missing closing line added); undefined when empty. */
export function parseClosed(d: string): SubPath | undefined {
  const s = parsePath(d)[0];
  if (!s) return undefined;
  const last = s.segs[s.segs.length - 1].to;
  return { start: s.start, segs: samePt(last, s.start) ? s.segs : [...s.segs, { to: s.start }], closed: true };
}

const num = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return String(Object.is(v, -0) ? 0 : v);
};
const xy = (q: Pt): string => `${num(q[0])} ${num(q[1])}`;

/** Absolute M / L / C (and Z on closed subpaths) with 2-decimal numbers, a closing line left to Z. */
export function toPathString(p: PathData): string {
  return p
    .map((s) => {
      const segs = s.segs.slice();
      const last = segs[segs.length - 1];
      if (s.closed && last && !last.c1 && samePt(last.to, s.start) && segs.length > 1) segs.pop();
      return [`M${xy(s.start)}`, ...segs.map((g) => (g.c1 && g.c2 ? `C${xy(g.c1)} ${xy(g.c2)} ${xy(g.to)}` : `L${xy(g.to)}`)), ...(s.closed ? ['Z'] : [])].join(' ');
    })
    .join(' ');
}

/** Cubic form (lines as degenerate cubics), for morph code. */
export function toCubics(p: PathData): Cubic[][] {
  return p.map((s) => {
    let from = s.start;
    return s.segs.map((g) => {
      const c = cubicOf(from, g);
      from = g.to;
      return c;
    });
  });
}

const isClosed = (sub: Cubic[]): boolean => sub.length > 1 && samePt(sub[0][0], sub[sub.length - 1][3]);

export function fromCubics(c: Cubic[][], closed?: boolean): PathData {
  return c.filter((s) => s.length).map((s) => ({ start: s[0][0], segs: s.map((q) => ({ c1: q[1], c2: q[2], to: q[3] })), closed: closed ?? isClosed(s) }));
}

/** Path data -> absolute cubic subpaths (icon morph and split code). */
export const toCubicSubpaths = (d: string): Cubic[][] => toCubics(parsePath(d));

/** Point at t (0..1) of a piece starting at `from`. */
function at(from: Pt, s: Seg, t: number): Pt {
  const u = 1 - t;
  if (!s.c1 || !s.c2) return [from[0] + (s.to[0] - from[0]) * t, from[1] + (s.to[1] - from[1]) * t];
  return [
    u * u * u * from[0] + 3 * u * u * t * s.c1[0] + 3 * u * t * t * s.c2[0] + t * t * t * s.to[0],
    u * u * u * from[1] + 3 * u * u * t * s.c1[1] + 3 * u * t * t * s.c2[1] + t * t * t * s.to[1],
  ];
}

/** Split a cubic at t (de Casteljau). */
export function splitCubic(c: Cubic, t: number): [Cubic, Cubic] {
  const [p0, p1, p2, p3] = c;
  const a = lerpPt(p0, p1, t);
  const b = lerpPt(p1, p2, t);
  const cc = lerpPt(p2, p3, t);
  const d = lerpPt(a, b, t);
  const e = lerpPt(b, cc, t);
  const f = lerpPt(d, e, t);
  return [
    [p0, a, d, f],
    [f, e, cc, p3],
  ];
}

/** The piece starting at `from` split at t: two pieces that draw the same line or curve. */
export function splitSeg(from: Pt, s: Seg, t: number): [Seg, Seg] {
  const m = at(from, s, t);
  if (!s.c1 || !s.c2) return [{ to: m }, { to: s.to }];
  const [l, r] = splitCubic([from, s.c1, s.c2, s.to], t);
  return [
    { c1: l[1], c2: l[2], to: m },
    { c1: r[1], c2: r[2], to: s.to },
  ];
}

export function translate(s: SubPath, dx: number, dy: number): SubPath {
  const m = (q: Pt): Pt => [q[0] + dx, q[1] + dy];
  return { start: m(s.start), segs: s.segs.map((g) => (g.c1 && g.c2 ? { c1: m(g.c1), c2: m(g.c2), to: m(g.to) } : { to: m(g.to) })), closed: s.closed };
}

/** The outline walked the other way round (same start). */
export function reverse(s: SubPath): SubPath {
  const pts = [s.start, ...s.segs.map((g) => g.to)];
  const segs: Seg[] = [];
  for (let i = s.segs.length - 1; i >= 0; i--) {
    const g = s.segs[i];
    segs.push(g.c1 && g.c2 ? { c1: g.c2, c2: g.c1, to: pts[i] } : { to: pts[i] });
  }
  return { start: s.start, segs, closed: s.closed };
}

/** Nearest point on a subpath: piece index, t, the point and its distance. */
export function nearest(s: SubPath, p: Pt): { seg: number; t: number; point: Pt; dist: number } {
  const best = { seg: 0, t: 0, d: Infinity };
  let from = s.start;
  s.segs.forEach((g, seg) => {
    const test = (t: number): void => {
      const q = at(from, g, t);
      const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
      if (d < best.d) {
        best.seg = seg;
        best.t = t;
        best.d = d;
      }
    };
    if (g.c1) for (let k = 0; k <= 48; k++) test(k / 48);
    else {
      // a line: the projection
      const dx = g.to[0] - from[0];
      const dy = g.to[1] - from[1];
      const len = dx * dx + dy * dy;
      test(len > 0 ? Math.min(1, Math.max(0, ((p[0] - from[0]) * dx + (p[1] - from[1]) * dy) / len)) : 0);
    }
    from = g.to;
  });
  const g = s.segs[best.seg];
  const f = best.seg ? s.segs[best.seg - 1].to : s.start;
  if (g.c1) {
    // refine a cubic hit around the sample
    const d2 = (t: number): number => {
      const q = at(f, g, t);
      return (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
    };
    let lo = Math.max(0, best.t - 1 / 48);
    let hi = Math.min(1, best.t + 1 / 48);
    for (let k = 0; k < 30; k++) {
      const m1 = lo + (hi - lo) / 3;
      const m2 = hi - (hi - lo) / 3;
      if (d2(m1) < d2(m2)) hi = m2;
      else lo = m1;
    }
    best.t = (lo + hi) / 2;
  }
  const point = at(f, g, best.t);
  return { seg: best.seg, t: best.t, point, dist: Math.hypot(point[0] - p[0], point[1] - p[1]) };
}

/** Restart at the start of piece i. */
const rotate = (s: SubPath, i: number): SubPath => (i === 0 ? s : { start: s.segs[i - 1].to, segs: [...s.segs.slice(i), ...s.segs.slice(0, i)], closed: s.closed });

/** The same closed outline starting (and ending) at its point nearest to `p`. */
export function restartAt(s: SubPath, p: Pt): SubPath {
  const { seg: i, t } = nearest(s, p);
  if (t < 1e-6 && i === 0) return s;
  if (t > 1 - 1e-6) return rotate(s, (i + 1) % s.segs.length);
  if (t < 1e-6) return rotate(s, i);
  const [a, b] = splitSeg(i ? s.segs[i - 1].to : s.start, s.segs[i], t);
  return { start: a.to, segs: [b, ...s.segs.slice(i + 1), ...s.segs.slice(0, i), a], closed: s.closed };
}

/** The subpath as points (cubics sampled in `steps` pieces), start included once. */
export function flatten(s: SubPath, steps = 12): Pt[] {
  const out: Pt[] = [s.start];
  let from = s.start;
  for (const g of s.segs) {
    if (g.c1) for (let k = 1; k < steps; k++) out.push(at(from, g, k / steps));
    out.push(g.to);
    from = g.to;
  }
  if (out.length > 1 && samePt(out[out.length - 1], s.start)) out.pop();
  return out;
}

/** `polygon(...)` of a closed subpath in px (the clip-path fallback without path() support). */
export function polygonCss(s: SubPath, steps = 8): string {
  return `polygon(${flatten(s, steps)
    .map((q) => `${num(q[0])}px ${num(q[1])}px`)
    .join(', ')})`;
}

/** The box around every subpath (cubics sampled). */
export function bounds(p: PathData): Box | undefined {
  const pts = p.flatMap((s) => flatten(s, 24));
  if (!pts.length) return undefined;
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

export const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Tolerance of the draw geometry (zero-length tests in the freehand fit). */
export const GEOM_EPS = 1e-9;

/** Distance from `p` to the segment `a`-`b`. */
export const segDist = (p: Pt, a: Pt, b: Pt): number => {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const l2 = abx * abx + aby * aby;
  if (l2 < GEOM_EPS) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby) / l2));
  return dist(p, [a[0] + abx * t, a[1] + aby * t]);
};

/** The point at `t` on a cubic. */
export const bez = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * c[0][0] + 3 * u * u * t * c[1][0] + 3 * u * t * t * c[2][0] + t * t * t * c[3][0],
    u * u * u * c[0][1] + 3 * u * u * t * c[1][1] + 3 * u * t * t * c[2][1] + t * t * t * c[3][1],
  ];
};
/** Approximate cubic length: mean of chord and control-net length. */
const approxLength = (c: Cubic): number => (dist(c[0], c[3]) + dist(c[0], c[1]) + dist(c[1], c[2]) + dist(c[2], c[3])) / 2;

/** Splits the longest segments until the subpath has `count` segments. */
export function resample(sub: Cubic[], count: number): Cubic[] {
  const out = sub.map((c) => c.map((p) => [p[0], p[1]] as Pt) as Cubic);
  if (!out.length) return out;
  while (out.length < count) {
    let idx = 0;
    let best = -1;
    out.forEach((c, i) => {
      const l = approxLength(c);
      if (l > best) {
        best = l;
        idx = i;
      }
    });
    out.splice(idx, 1, ...splitCubic(out[idx], 0.5));
  }
  return out;
}

/** Signed area of a subpath's control polygon (shoelace): its sign is the winding direction. */
function signedArea(sub: Cubic[]): number {
  let a = 0;
  for (const c of sub) {
    for (let j = 0; j < 3; j++) a += c[j][0] * c[j + 1][1] - c[j + 1][0] * c[j][1];
  }
  return a / 2;
}

/** The same subpath drawn the other way round. */
const reversed = (sub: Cubic[]): Cubic[] => sub.map((c) => [c[3], c[2], c[1], c[0]] as Cubic).reverse();

/** Rotates a closed subpath's start to minimise the point distance to `ref`. */
function bestRotation(ref: Cubic[], sub: Cubic[]): Cubic[] {
  let best = sub;
  let bestCost = Infinity;
  for (let r = 0; r < sub.length; r++) {
    const rot = [...sub.slice(r), ...sub.slice(0, r)];
    let cost = 0;
    for (let i = 0; i < rot.length && cost < bestCost; i++) {
      for (let j = 0; j < 4; j++) cost += (rot[i][j][0] - ref[i][j][0]) ** 2 + (rot[i][j][1] - ref[i][j][1]) ** 2;
    }
    if (cost < bestCost) {
      bestCost = cost;
      best = rot;
    }
  }
  return best;
}

/** Normalises two paths to matching cubic subpaths; undefined when the subpath counts differ. */
export function matchShapes(a: string, b: string): { from: Cubic[][]; to: Cubic[][] } | undefined {
  const sa = toCubicSubpaths(a);
  const sb = toCubicSubpaths(b);
  if (!sa.length || sa.length !== sb.length) return undefined;
  const from: Cubic[][] = [];
  const to: Cubic[][] = [];
  // Opposite windings turn a shape inside out (collapse) mid-morph: reverse the target's closed
  // subpaths when every closed pair is wound the other way. Only all together, so the target's
  // relative windings (holes under the nonzero fill rule) and its end frame stay the same.
  const closedPairs = sa.map((subA, i) => isClosed(subA) && isClosed(sb[i]));
  const signs = sa.map((subA, i) => (closedPairs[i] ? signedArea(subA) * signedArea(sb[i]) : 0));
  const flip = signs.some((v) => v < 0) && signs.every((v, i) => !closedPairs[i] || v < 0);
  sa.forEach((subA, i) => {
    const subB = flip && closedPairs[i] ? reversed(sb[i]) : sb[i];
    const n = Math.max(subA.length, subB.length);
    const ra = resample(subA, n);
    let rb = resample(subB, n);
    if (isClosed(ra) && isClosed(rb)) rb = bestRotation(ra, rb);
    from.push(ra);
    to.push(rb);
  });
  return { from, to };
}

const fmt3 = (v: number): string => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Cubic subpaths -> path data, 3 decimals, closed subpaths end with Z (icon morph and split output). */
export function cubicsToPath(subs: Cubic[][]): string {
  return subs
    .map((sub) => {
      if (!sub.length) return '';
      const p = (pt: Pt): string => `${fmt3(pt[0])} ${fmt3(pt[1])}`;
      const body = sub.map((c) => `C${p(c[1])} ${p(c[2])} ${p(c[3])}`).join('');
      return `M${p(sub[0][0])}${body}${isClosed(sub) ? 'Z' : ''}`;
    })
    .join('');
}

/** Path data at progress t (0 = from, 1 = to) of a matched pair. */
export function interpolate(m: { from: Cubic[][]; to: Cubic[][] }, t: number): string {
  const subs = m.from.map((sub, i) => sub.map((c, j) => c.map((p, k) => lerpPt(p, m.to[i][j][k], t)) as Cubic));
  return cubicsToPath(subs);
}
