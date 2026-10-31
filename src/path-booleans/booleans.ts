// Path booleans: union, subtract, intersect and exclude of closed outlines. Pure, own code.
// Edges are noded and classified by winding, result rings are traced, then exact sub-curves rebuilt.
import {
  FLATTEN_DIVISOR,
  MAX_BOOLEAN_EDGES,
  MAX_PIECES_PER_CUBIC,
  MIN_RING_AREA_RATIO,
  PATH_BOOLEANS_CONTRACT_VERSION,
} from '../contracts/path-booleans';
import type {
  BooleanOp,
  BooleanOperand,
  BooleanOptions,
  BooleanPiece,
  BooleanResult,
  SingleOutline,
} from '../contracts/path-booleans';
import type { Anchor, AnchorKind, Cubic, EditPath, Pt } from '../contracts/path-model';
import { splitCubic } from '../path/core';

export { PATH_BOOLEANS_CONTRACT_VERSION };

/** A directed flattened edge on the integer grid; s = source segment (-1: none), ta / tb = t at its ends. */
interface E {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  o: number;
  s: number;
  ta: number;
  tb: number;
}
/** A source segment: its exact cubic (curves only), end points and the global ids of its end anchors. */
interface Src {
  cub?: Cubic;
  p0: Pt;
  p3: Pt;
  k0: number;
  k1: number;
}
/** A merged edge, canonical order (a before b by y, then x), w = signed multiplicity per operand. */
interface M {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  w: number[];
  s: number;
  ta: number;
  tb: number;
  n: number;
}
/** A kept edge in walking order (inside on its right). */
type D = Pick<E, 'x0' | 'y0' | 'x1' | 'y1' | 's' | 'ta' | 'tb'>;

const key = (x: number, y: number): number => (x + 1048576) * 2097152 + (y + 1048576);

/** Points (with t) along a cubic until each piece's control points lie within tol of its chord. */
function flat(
  c: Cubic,
  t0: number,
  t1: number,
  tol: number,
  depth: number,
  out: [Pt, number][],
): void {
  const [a, b, c1, d] = [c[0], c[3], c[1], c[2]];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const off = (p: Pt): number =>
    len > 1e-12
      ? Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len
      : Math.hypot(p[0] - a[0], p[1] - a[1]);
  if (depth >= Math.log2(MAX_PIECES_PER_CUBIC) || Math.max(off(c1), off(d)) <= tol) {
    out.push([b, t1]);
    return;
  }
  const [l, r] = splitCubic(c, 0.5);
  const m = (t0 + t1) / 2;
  flat(l, t0, m, tol, depth + 1, out);
  flat(r, m, t1, tol, depth + 1, out);
}

const sub = (c: Cubic, t0: number, t1: number): Cubic => {
  if (t0 > t1) {
    const r = sub(c, t1, t0);
    return [r[3], r[2], r[1], r[0]];
  }
  let q = c;
  if (t1 < 1) q = splitCubic(q, t1)[0];
  if (t0 > 0) q = splitCubic(q, t0 / t1)[1];
  return q;
};

interface Built {
  edges: E[];
  srcs: Src[];
  kinds: (AnchorKind | undefined)[];
  skipped: number;
  areas: number;
}

function build(operands: BooleanOperand[], tol: number, g: number): Built | undefined {
  const srcs: Src[] = [];
  const kinds: (AnchorKind | undefined)[] = [];
  const edges: E[] = [];
  let skipped = 0;
  let areas = 0;
  let count = 0;
  for (const op of operands) for (const p of op.paths) if (p.closed) count += p.anchors.length;
  if (count > MAX_BOOLEAN_EDGES) return undefined;
  const snap = (v: number): number => Math.round(v / g);
  for (let o = 0; o < operands.length; o++) {
    let has = false;
    for (const p of operands[o].paths) {
      const A = p.anchors;
      const n = A.length;
      if (!p.closed) {
        skipped++;
        continue;
      }
      if (n < 2) continue;
      if (n > 2 || A.some((a) => a.in || a.out)) has = true;
      const base = kinds.length;
      for (const a of A) kinds.push(a.kind);
      let cx = snap(A[0].x);
      let cy = snap(A[0].y);
      for (let i = 0; i < n; i++) {
        const a = A[i];
        const b = A[(i + 1) % n];
        const curved = !!(a.out || b.in);
        const p0: Pt = [a.x, a.y];
        const p3: Pt = [b.x, b.y];
        const cub: Cubic | undefined = curved ? [p0, a.out ?? p0, b.in ?? p3, p3] : undefined;
        const sid = srcs.length;
        srcs.push({ cub, p0, p3, k0: base + i, k1: base + ((i + 1) % n) });
        const pts: [Pt, number][] = [];
        if (cub) flat(cub, 0, 1, tol, 0, pts);
        else pts.push([p3, 1]);
        let ct = 0;
        let last: E | undefined;
        for (const [q, t] of pts) {
          const x = snap(q[0]);
          const y = snap(q[1]);
          if (x === cx && y === cy) {
            if (last) last.tb = t;
            continue;
          }
          edges.push((last = { x0: cx, y0: cy, x1: x, y1: y, o, s: sid, ta: ct, tb: t }));
          cx = x;
          cy = y;
          ct = t;
        }
        if (edges.length > MAX_BOOLEAN_EDGES) return undefined;
      }
    }
    if (has) areas++;
  }
  return { edges, srcs, kinds, skipped, areas };
}

/** Split edges at every crossing, T-junction and collinear overlap; repeat until stable. */
function node(edges: E[]): E[] {
  for (let pass = 0; pass < 8; pass++) {
    const n = edges.length;
    const minx = edges.map((e) => Math.min(e.x0, e.x1));
    const maxx = edges.map((e) => Math.max(e.x0, e.x1));
    const miny = edges.map((e) => Math.min(e.y0, e.y1));
    const maxy = edges.map((e) => Math.max(e.y0, e.y1));
    const order = edges.map((_, i) => i).sort((i, j) => minx[i] - minx[j] || i - j);
    const cuts: [number, number][][] = [];
    let any = false;
    const cut = (i: number, x: number, y: number): void => {
      const e = edges[i];
      if ((x === e.x0 && y === e.y0) || (x === e.x1 && y === e.y1)) return;
      (cuts[i] ??= []).push([x, y]);
      any = true;
    };
    const inside = (i: number, x: number, y: number): void => {
      const e = edges[i];
      const rx = e.x1 - e.x0;
      const ry = e.y1 - e.y0;
      const dot = (x - e.x0) * rx + (y - e.y0) * ry;
      if (dot > 0 && dot < rx * rx + ry * ry) cut(i, x, y);
    };
    for (let u = 0; u < n; u++) {
      const i = order[u];
      const p = edges[i];
      const rx = p.x1 - p.x0;
      const ry = p.y1 - p.y0;
      for (let v = u + 1; v < n && minx[order[v]] <= maxx[i]; v++) {
        const j = order[v];
        if (miny[j] > maxy[i] || maxy[j] < miny[i]) continue;
        const q = edges[j];
        const sx = q.x1 - q.x0;
        const sy = q.y1 - q.y0;
        const qx = q.x0 - p.x0;
        const qy = q.y0 - p.y0;
        let d = rx * sy - ry * sx;
        if (d === 0) {
          if (qx * ry - qy * rx !== 0) continue;
          inside(i, q.x0, q.y0);
          inside(i, q.x1, q.y1);
          inside(j, p.x0, p.y0);
          inside(j, p.x1, p.y1);
          continue;
        }
        let tn = qx * sy - qy * sx;
        let un = qx * ry - qy * rx;
        if (d < 0) {
          d = -d;
          tn = -tn;
          un = -un;
        }
        if (tn < 0 || tn > d || un < 0 || un > d) continue;
        const ti = tn > 0 && tn < d;
        const uj = un > 0 && un < d;
        if (!ti && !uj) continue;
        const x = Math.round(p.x0 + (rx * tn) / d);
        const y = Math.round(p.y0 + (ry * tn) / d);
        if (ti) cut(i, x, y);
        if (uj) cut(j, x, y);
      }
    }
    if (!any) break;
    const next: E[] = [];
    edges.forEach((e, i) => {
      const c = cuts[i];
      if (!c) {
        next.push(e);
        return;
      }
      const rx = e.x1 - e.x0;
      const ry = e.y1 - e.y0;
      const len2 = rx * rx + ry * ry;
      const ps = c
        .map(([x, y]) => ({ x, y, s: ((x - e.x0) * rx + (y - e.y0) * ry) / len2 }))
        .sort((a, b) => a.s - b.s || a.x - b.x || a.y - b.y)
        .filter((q, k, all) => k === 0 || q.x !== all[k - 1].x || q.y !== all[k - 1].y);
      let fx = e.x0;
      let fy = e.y0;
      let ft = e.ta;
      for (let k = 0; k <= ps.length; k++) {
        const last = k === ps.length;
        const tx = last ? e.x1 : ps[k].x;
        const ty = last ? e.y1 : ps[k].y;
        const tt = last ? e.tb : e.ta + (e.tb - e.ta) * ps[k].s;
        if (tx !== fx || ty !== fy)
          next.push({ x0: fx, y0: fy, x1: tx, y1: ty, o: e.o, s: e.s, ta: ft, tb: tt });
        fx = tx;
        fy = ty;
        ft = tt;
      }
    });
    edges = next;
  }
  return edges;
}

const shoelace = (ring: D[]): number => ring.reduce((a, d) => a + d.x0 * d.y1 - d.x1 * d.y0, 0) / 2;

const decide = (op: BooleanOp, ins: boolean[]): boolean => {
  if (op === 'union') return ins.some(Boolean);
  if (op === 'subtract') return ins[0] && !ins.slice(1).some(Boolean);
  if (op === 'intersect') return ins.every(Boolean);
  return ins.filter(Boolean).length % 2 === 1;
};

/** Classify merged edges and return the kept ones, inside on their right. */
function classify(merged: M[], op: BooleanOp, operands: BooleanOperand[]): D[] {
  const K = operands.length;
  if (!merged.length) return [];
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const m of merged) {
    ymin = Math.min(ymin, m.y0);
    ymax = Math.max(ymax, m.y1);
  }
  const R = 64;
  const span = ymax - ymin + 1;
  const row = (y: number): number =>
    Math.max(0, Math.min(R - 1, Math.floor(((y - ymin) / span) * R)));
  const rows: M[][] = Array.from({ length: R }, () => []);
  for (const m of merged) for (let r = row(m.y0); r <= row(m.y1); r++) rows[r].push(m);
  const ins = (W: number[]): boolean[] =>
    W.map((w, k) => (operands[k].fillRule === 'evenodd' ? Math.abs(w) % 2 === 1 : w !== 0));
  const out: D[] = [];
  for (const m of merged) {
    const mx = m.x0 + m.x1;
    const my = m.y0 + m.y1;
    const horizontal = m.y0 === m.y1;
    const wa = new Array<number>(K).fill(0); // rule A: point at y + epsilon
    const wb = new Array<number>(K).fill(0); // rule B: point at y - epsilon (horizontal edges only)
    for (const f of rows[row(my / 2)]) {
      if (f === m || f.y0 === f.y1) continue;
      const dy = f.y1 - f.y0;
      const a = 2 * f.y0 <= my && my < 2 * f.y1;
      const b = horizontal && 2 * f.y0 < my && my <= 2 * f.y1;
      if (!a && !b) continue;
      if ((2 * f.x0 - mx) * dy + (my - 2 * f.y0) * (f.x1 - f.x0) <= 0) continue;
      for (let k = 0; k < K; k++) {
        if (a) wa[k] += f.w[k];
        if (b) wb[k] += f.w[k];
      }
    }
    // P: right of a -> b (smaller x side, or y + epsilon for a horizontal edge). Q: the other side.
    const wp = horizontal ? wa : wa.map((w, k) => w + m.w[k]);
    const wq = horizontal ? wb : wa;
    const ip = decide(op, ins(wp));
    if (ip === decide(op, ins(wq))) continue;
    out.push(
      ip
        ? { x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, s: m.s, ta: m.ta, tb: m.tb }
        : { x0: m.x1, y0: m.y1, x1: m.x0, y1: m.y0, s: m.s, ta: m.tb, tb: m.ta },
    );
  }
  return out;
}

function trace(ds: D[]): D[][] {
  const out = new Map<number, number[]>();
  ds.forEach((d, i) => {
    const k = key(d.x0, d.y0);
    const l = out.get(k);
    if (l) l.push(i);
    else out.set(k, [i]);
  });
  const used = new Array<boolean>(ds.length).fill(false);
  const rings: D[][] = [];
  for (let i = 0; i < ds.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const ring = [ds[i]];
    const start = key(ds[i].x0, ds[i].y0);
    for (;;) {
      const cur = ring[ring.length - 1];
      const ek = key(cur.x1, cur.y1);
      if (ek === start) {
        rings.push(ring);
        break;
      }
      let best = -1;
      let bestAng = -Infinity;
      const ux = cur.x1 - cur.x0;
      const uy = cur.y1 - cur.y0;
      for (const j of out.get(ek) ?? []) {
        if (used[j]) continue;
        const d = ds[j];
        const vx = d.x1 - d.x0;
        const vy = d.y1 - d.y0;
        const ang = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
        if (ang > bestAng) {
          bestAng = ang;
          best = j;
        }
      }
      if (best < 0) break;
      used[best] = true;
      ring.push(ds[best]);
    }
  }
  return rings;
}

const EXACT = 1e-12;

/** Ring edges -> an editable closed path: exact sub-curves per source run, crossings are corners. */
function ringToPath(
  ring: D[],
  srcs: Src[],
  kinds: (AnchorKind | undefined)[],
  g: number,
  tol: number,
): EditPath {
  const contig = (p: D, d: D): boolean => d.s >= 0 && p.s === d.s && Math.abs(d.ta - p.tb) < 1e-9;
  const N = ring.length;
  let first = 0;
  for (let j = 0; j < N; j++) {
    if (!contig(ring[(j + N - 1) % N], ring[j])) {
      first = j;
      break;
    }
  }
  const runs: D[] = [];
  for (let c = 0; c < N; c++) {
    const d = ring[(first + c) % N];
    const r = runs[runs.length - 1];
    if (r && contig(r, d)) {
      r.x1 = d.x1;
      r.y1 = d.y1;
      r.tb = d.tb;
    } else runs.push({ ...d });
  }
  const m = runs.length;
  const subs = runs.map((r) => {
    const c = r.s >= 0 ? srcs[r.s].cub : undefined;
    return c ? sub(c, r.ta, r.tb) : undefined;
  });
  const exact = (r: D, atStart: boolean): Pt | undefined => {
    if (r.s < 0) return undefined;
    const t = atStart ? r.ta : r.tb;
    return Math.abs(t) < EXACT ? srcs[r.s].p0 : Math.abs(t - 1) < EXACT ? srcs[r.s].p3 : undefined;
  };
  const anchorId = (r: D, atStart: boolean): number => {
    if (r.s < 0) return -1;
    const t = atStart ? r.ta : r.tb;
    return Math.abs(t) < EXACT ? srcs[r.s].k0 : Math.abs(t - 1) < EXACT ? srcs[r.s].k1 : -1;
  };
  const anchors: Anchor[] = runs.map((r, j) => {
    const q = runs[(j + m - 1) % m];
    const e = exact(r, true) ?? exact(q, false);
    const a: Anchor = e
      ? { x: e[0], y: e[1] }
      : { x: Math.round(r.x0 * g * 1e9) / 1e9, y: Math.round(r.y0 * g * 1e9) / 1e9 };
    const out = subs[j];
    const inn = subs[(j + m - 1) % m];
    if (out) a.out = [out[1][0], out[1][1]];
    if (inn) a.in = [inn[2][0], inn[2][1]];
    const id = anchorId(r, true);
    const k = id >= 0 && id === anchorId(q, false) ? kinds[id] : 'corner';
    if (k) a.kind = k;
    return a;
  });
  // drop middle points of straight runs that lie on the chord of their neighbours
  for (let i = 0; i < anchors.length && anchors.length > 3;) {
    const a = anchors[i];
    const p = anchors[(i + anchors.length - 1) % anchors.length];
    const n = anchors[(i + 1) % anchors.length];
    const cx = n.x - p.x;
    const cy = n.y - p.y;
    const len = Math.hypot(cx, cy);
    const straight = !a.in && !a.out && !p.out && !n.in;
    if (
      straight &&
      len > 0 &&
      Math.abs((a.x - p.x) * cy - (a.y - p.y) * cx) / len <= tol &&
      (a.x - p.x) * cx + (a.y - p.y) * cy > 0 &&
      (n.x - a.x) * cx + (n.y - a.y) * cy > 0
    ) {
      anchors.splice(i, 1);
      i = Math.max(0, i - 1);
    } else i++;
  }
  // start at the top-left anchor so the output does not depend on where tracing began
  let lo = 0;
  anchors.forEach((a, i) => {
    if (a.y < anchors[lo].y || (a.y === anchors[lo].y && a.x < anchors[lo].x)) lo = i;
  });
  return { anchors: [...anchors.slice(lo), ...anchors.slice(0, lo)], closed: true };
}

const hit = (x: number, y: number, ring: D[]): boolean => {
  let c = false;
  for (const d of ring) {
    if (d.y0 > y !== d.y1 > y && x < d.x0 + ((y - d.y0) * (d.x1 - d.x0)) / (d.y1 - d.y0)) c = !c;
  }
  return c;
};

export function run(op: BooleanOp, operands: BooleanOperand[], o: BooleanOptions): BooleanResult {
  const fw = o.frame.w;
  const fh = o.frame.h;
  const tol = o.tolerance ?? Math.max(fw, fh) / FLATTEN_DIVISOR;
  const g = tol / 8;
  const b = build(operands, tol, g);
  if (!b)
    return {
      ok: false,
      reason: 'too-complex',
      skippedOpen: operands.reduce((n, p) => n + p.paths.filter((q) => !q.closed).length, 0),
    };
  const skippedOpen = b.skipped;
  if (b.areas < (op === 'subtract' ? 2 : 1)) return { ok: false, reason: 'no-area', skippedOpen };
  const K = operands.length;
  const map = new Map<string, M>();
  for (const e of node(b.edges)) {
    const flip = e.y0 > e.y1 || (e.y0 === e.y1 && e.x0 > e.x1);
    const [x0, y0, x1, y1] = flip ? [e.x1, e.y1, e.x0, e.y0] : [e.x0, e.y0, e.x1, e.y1];
    const k = `${x0},${y0},${x1},${y1}`;
    let m = map.get(k);
    if (!m)
      map.set(
        k,
        (m = {
          x0,
          y0,
          x1,
          y1,
          w: new Array<number>(K).fill(0),
          s: e.s,
          ta: flip ? e.tb : e.ta,
          tb: flip ? e.ta : e.tb,
          n: 0,
        }),
      );
    m.n++;
    if (m.n > 1) m.s = -1;
    m.w[e.o] += flip ? -1 : 1;
  }
  const rings = trace(
    classify(
      [...map.values()].filter((m) => m.w.some((w) => w !== 0)),
      op,
      operands,
    ),
  );
  const gg = g * g;
  const minArea = fw * fh * MIN_RING_AREA_RATIO;
  const kept = rings
    .map((ring) => ({ ring, area: shoelace(ring) * gg }))
    .filter((r) => Math.abs(r.area) >= minArea);
  const outers = kept.filter((r) => r.area > 0);
  const holesOf = outers.map(() => [] as typeof kept);
  for (const h of kept.filter((r) => r.area < 0)) {
    const d = h.ring[0];
    const x = (d.x0 + d.x1) / 2;
    const y = (d.y0 + d.y1) / 2;
    let best = -1;
    outers.forEach((ou, i) => {
      if (ou.area > -h.area && hit(x, y, ou.ring) && (best < 0 || ou.area < outers[best].area))
        best = i;
    });
    if (best >= 0) holesOf[best].push(h);
  }
  const pieces = outers
    .map((ou, i) => ({
      ou,
      holes: holesOf[i],
      area: ou.area + holesOf[i].reduce((a, h) => a + h.area, 0),
    }))
    .sort((a, c) => c.area - a.area);
  if (!pieces.length) return { ok: false, reason: 'empty', skippedOpen };
  const paths: EditPath[] = [];
  const out: BooleanPiece[] = [];
  for (const p of pieces) {
    const piece: BooleanPiece = { outer: paths.length, holes: [], area: p.area };
    paths.push(ringToPath(p.ou.ring, b.srcs, b.kinds, g, tol));
    for (const h of p.holes) {
      piece.holes.push(paths.length);
      paths.push(ringToPath(h.ring, b.srcs, b.kinds, g, tol));
    }
    out.push(piece);
  }
  return { ok: true, paths, pieces: out, skippedOpen };
}

export function singleOutline(r: Extract<BooleanResult, { ok: true }>): SingleOutline {
  const p = r.pieces[0];
  return {
    path: r.paths[p.outer],
    droppedPieces: r.pieces.length - 1,
    filledHoles: p.holes.length,
  };
}
