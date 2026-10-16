/**
 * SVG path math for icon morphs: parse path data into absolute cubic Bézier subpaths, resample
 * subpaths to equal segment counts and interpolate between two shapes. Hand-written, no deps.
 */

export type Pt = [number, number];
export type Cubic = [Pt, Pt, Pt, Pt]; // start, c1, c2, end

const EPS = 1e-6;
const samePt = (a: Pt, b: Pt): boolean => Math.abs(a[0] - b[0]) < EPS && Math.abs(a[1] - b[1]) < EPS;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const lineCubic = (a: Pt, b: Pt): Cubic => [a, lerpPt(a, b, 1 / 3), lerpPt(a, b, 2 / 3), b];
const quadCubic = (a: Pt, q: Pt, b: Pt): Cubic => [a, [a[0] + (2 / 3) * (q[0] - a[0]), a[1] + (2 / 3) * (q[1] - a[1])], [b[0] + (2 / 3) * (q[0] - b[0]), b[1] + (2 / 3) * (q[1] - b[1])], b];

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
    const m = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(this.d.slice(this.i));
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

/** SVG arc (endpoint form) to cubics, each ≤ 90°. */
function arcToCubics(p0: Pt, rx: number, ry: number, rotDeg: number, large: number, sweep: number, p1: Pt): Cubic[] {
  if (samePt(p0, p1)) return [];
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx < EPS || ry < EPS) return [lineCubic(p0, p1)];
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
  const segs = Math.max(1, Math.ceil(Math.abs(dtheta) / (Math.PI / 2) - 1e-9));
  const delta = dtheta / segs;
  const k = (4 / 3) * Math.tan(delta / 4);
  const point = (t: number): Pt => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
  const deriv = (t: number): Pt => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
  const out: Cubic[] = [];
  let start = p0;
  for (let s = 0; s < segs; s++) {
    const a = theta1 + s * delta;
    const b = a + delta;
    const end = s === segs - 1 ? p1 : point(b);
    const da = deriv(a);
    const db = deriv(b);
    out.push([start, [start[0] + k * da[0], start[1] + k * da[1]], [end[0] - k * db[0], end[1] - k * db[1]], end]);
    start = end;
  }
  return out;
}

/** Path data -> absolute cubic subpaths. Supports M L H V C S Q T A Z (absolute and relative). */
export function toCubicSubpaths(d: string): Cubic[][] {
  const sc = new Scanner(d);
  const subs: Cubic[][] = [];
  let cur: Cubic[] | undefined;
  let pos: Pt = [0, 0];
  let start: Pt = [0, 0];
  let lastC: Pt | undefined; // previous cubic c2 (for S)
  let lastQ: Pt | undefined; // previous quadratic control (for T)
  let cmd: string | undefined;
  const push = (c: Cubic): void => {
    if (!cur) {
      cur = [];
      subs.push(cur);
      start = c[0];
    }
    cur.push(c);
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
      switch (cmd.toUpperCase()) {
        case 'M': {
          pos = pt();
          start = pos;
          cur = undefined;
          break;
        }
        case 'L': {
          const p = pt();
          push(lineCubic(pos, p));
          pos = p;
          break;
        }
        case 'H': {
          const p: Pt = [sc.number() + ox, pos[1]];
          push(lineCubic(pos, p));
          pos = p;
          break;
        }
        case 'V': {
          const p: Pt = [pos[0], sc.number() + oy];
          push(lineCubic(pos, p));
          pos = p;
          break;
        }
        case 'C': {
          const c1 = pt();
          const c2 = pt();
          const p = pt();
          push([pos, c1, c2, p]);
          c = c2;
          pos = p;
          break;
        }
        case 'S': {
          const c1: Pt = lastC ? [2 * pos[0] - lastC[0], 2 * pos[1] - lastC[1]] : pos;
          const c2 = pt();
          const p = pt();
          push([pos, c1, c2, p]);
          c = c2;
          pos = p;
          break;
        }
        case 'Q': {
          const qc = pt();
          const p = pt();
          push(quadCubic(pos, qc, p));
          q = qc;
          pos = p;
          break;
        }
        case 'T': {
          const qc: Pt = lastQ ? [2 * pos[0] - lastQ[0], 2 * pos[1] - lastQ[1]] : pos;
          const p = pt();
          push(quadCubic(pos, qc, p));
          q = qc;
          pos = p;
          break;
        }
        case 'A': {
          const rx = sc.number();
          const ry = sc.number();
          const rot = sc.number();
          const large = sc.flag();
          const sweep = sc.flag();
          const p = pt();
          const from = pos;
          arcToCubics(from, rx, ry, rot, large, sweep, p).forEach(push);
          pos = p;
          break;
        }
        case 'Z': {
          if (cur && cur.length && !samePt(pos, start)) cur.push(lineCubic(pos, start));
          pos = start;
          cur = undefined;
          // Z takes no numbers: a following number is an error, stop parsing.
          cmd = undefined;
          break;
        }
      }
      lastC = c;
      lastQ = q;
    }
  } catch {
    // Malformed tail: keep what parsed (like browsers render up to the error).
  }
  return subs.filter((s) => s.length > 0);
}

/** Split a cubic at t (de Casteljau). */
function split(c: Cubic, t: number): [Cubic, Cubic] {
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

const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
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
    out.splice(idx, 1, ...split(out[idx], 0.5));
  }
  return out;
}

const isClosed = (sub: Cubic[]): boolean => sub.length > 1 && samePt(sub[0][0], sub[sub.length - 1][3]);

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

const fmt = (v: number): string => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Cubic subpaths -> path data (closed subpaths end with Z). */
export function cubicsToPath(subs: Cubic[][]): string {
  return subs
    .map((sub) => {
      if (!sub.length) return '';
      const p = (pt: Pt): string => `${fmt(pt[0])} ${fmt(pt[1])}`;
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
