/*
 * Closed outlines from src/utils/shape-path.ts (absolute M / L / C ... Z) as data: moved, restarted at
 * a point (a ring fills from its start), reversed (counter-clockwise rings), flattened to a polygon
 * (clip-path fallback, hit tests). Pure.
 */

export interface OutlinePoint {
  x: number;
  y: number;
}

/** A line to `to`, or a cubic through `c1`, `c2` to `to`. */
export interface OutlineSeg {
  to: OutlinePoint;
  c1?: OutlinePoint;
  c2?: OutlinePoint;
}

export interface Outline {
  start: OutlinePoint;
  /** Every piece, the closing one included (the last `to` is `start`). */
  segs: OutlineSeg[];
}

const P = (x: number, y: number): OutlinePoint => ({ x, y });
const near = (a: OutlinePoint, b: OutlinePoint) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6;

/** An absolute M / L / C / Z path (one closed subpath). Undefined when it is not one. */
export function parseOutline(d: string): Outline | undefined {
  const cmds = [...(d || '').matchAll(/([MLCZ])([^MLCZ]*)/gi)];
  if (!cmds.length || cmds[0][1] !== 'M') return undefined;
  let start: OutlinePoint | undefined;
  let cur: OutlinePoint | undefined;
  const segs: OutlineSeg[] = [];
  for (const [, c, args] of cmds) {
    const n = (args.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? []).map(Number);
    if (c === 'M') {
      if (start || n.length !== 2) return undefined;
      start = cur = P(n[0], n[1]);
    } else if (c === 'L') {
      if (n.length % 2) return undefined;
      for (let i = 0; i < n.length; i += 2) segs.push({ to: (cur = P(n[i], n[i + 1])) });
    } else if (c === 'C') {
      if (n.length % 6) return undefined;
      for (let i = 0; i < n.length; i += 6) segs.push({ c1: P(n[i], n[i + 1]), c2: P(n[i + 2], n[i + 3]), to: (cur = P(n[i + 4], n[i + 5])) });
    } else if (c === 'Z' && start && cur && !near(cur, start)) {
      segs.push({ to: (cur = start) });
    } else if (c !== 'Z') return undefined;
  }
  if (!start || !segs.length) return undefined;
  if (cur && !near(cur, start)) segs.push({ to: start });
  return { start, segs };
}

const fmt = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return String(Object.is(v, -0) ? 0 : v);
};
const pt = (q: OutlinePoint) => `${fmt(q.x)} ${fmt(q.y)}`;

/** The outline as a path; the closing piece is drawn by Z when it is a line. */
export function outlinePath(o: Outline): string {
  const segs = o.segs.slice();
  const last = segs[segs.length - 1];
  if (last && !last.c1 && near(last.to, o.start) && segs.length > 1) segs.pop();
  return [`M${pt(o.start)}`, ...segs.map((s) => (s.c1 && s.c2 ? `C${pt(s.c1)} ${pt(s.c2)} ${pt(s.to)}` : `L${pt(s.to)}`)), 'Z'].join(' ');
}

/** Moved by dx, dy. */
export function translateOutline(o: Outline, dx: number, dy: number): Outline {
  const m = (q: OutlinePoint) => P(q.x + dx, q.y + dy);
  return { start: m(o.start), segs: o.segs.map((s) => (s.c1 && s.c2 ? { c1: m(s.c1), c2: m(s.c2), to: m(s.to) } : { to: m(s.to) })) };
}

/** Point at t (0..1) of a piece starting at `from`. */
function at(from: OutlinePoint, s: OutlineSeg, t: number): OutlinePoint {
  const u = 1 - t;
  if (!s.c1 || !s.c2) return P(from.x + (s.to.x - from.x) * t, from.y + (s.to.y - from.y) * t);
  return P(
    u * u * u * from.x + 3 * u * u * t * s.c1.x + 3 * u * t * t * s.c2.x + t * t * t * s.to.x,
    u * u * u * from.y + 3 * u * u * t * s.c1.y + 3 * u * t * t * s.c2.y + t * t * t * s.to.y,
  );
}

/** The piece split at t (de Casteljau for a cubic). */
function split(from: OutlinePoint, s: OutlineSeg, t: number): [OutlineSeg, OutlineSeg] {
  const m = at(from, s, t);
  if (!s.c1 || !s.c2) return [{ to: m }, { to: s.to }];
  const l = (a: OutlinePoint, b: OutlinePoint) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  const a = l(from, s.c1);
  const b = l(s.c1, s.c2);
  const c = l(s.c2, s.to);
  const ab = l(a, b);
  const bc = l(b, c);
  return [{ c1: a, c2: ab, to: m }, { c1: bc, c2: c, to: s.to }];
}

/** Where on the outline (piece index, t) is nearest to `p`. */
function nearest(o: Outline, p: OutlinePoint): { i: number; t: number } {
  let best = { i: 0, t: 0, d: Infinity };
  let from = o.start;
  o.segs.forEach((s, i) => {
    const N = s.c1 ? 48 : 1;
    const test = (t: number) => {
      const q = at(from, s, t);
      const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
      if (d < best.d) best = { i, t, d };
    };
    if (s.c1) for (let k = 0; k <= N; k++) test(k / N);
    else {
      // a line: the projection
      const dx = s.to.x - from.x;
      const dy = s.to.y - from.y;
      const len = dx * dx + dy * dy;
      test(len > 0 ? Math.min(1, Math.max(0, ((p.x - from.x) * dx + (p.y - from.y) * dy) / len)) : 0);
    }
    from = s.to;
  });
  // refine a cubic hit around the sample
  if (o.segs[best.i].c1) {
    const s = o.segs[best.i];
    const f = best.i ? o.segs[best.i - 1].to : o.start;
    let lo = Math.max(0, best.t - 1 / 48);
    let hi = Math.min(1, best.t + 1 / 48);
    for (let k = 0; k < 30; k++) {
      const m1 = lo + (hi - lo) / 3;
      const m2 = hi - (hi - lo) / 3;
      const d1 = (at(f, s, m1).x - p.x) ** 2 + (at(f, s, m1).y - p.y) ** 2;
      const d2 = (at(f, s, m2).x - p.x) ** 2 + (at(f, s, m2).y - p.y) ** 2;
      if (d1 < d2) hi = m2;
      else lo = m1;
    }
    best.t = (lo + hi) / 2;
  }
  return best;
}

/** The same outline starting (and ending) at its point nearest to `p`. */
export function restartOutline(o: Outline, p: OutlinePoint): Outline {
  const { i, t } = nearest(o, p);
  const from = i ? o.segs[i - 1].to : o.start;
  if (t < 1e-6 && i === 0) return o;
  const s = o.segs[i];
  if (t > 1 - 1e-6) return restartAt(o, (i + 1) % o.segs.length);
  if (t < 1e-6) return restartAt(o, i);
  const [a, b] = split(from, s, t);
  return { start: a.to, segs: [b, ...o.segs.slice(i + 1), ...o.segs.slice(0, i), a] };
}

/** Restart at the start of piece i. */
function restartAt(o: Outline, i: number): Outline {
  if (i === 0) return o;
  return { start: o.segs[i - 1].to, segs: [...o.segs.slice(i), ...o.segs.slice(0, i)] };
}

/** The outline walked the other way round (same start). */
export function reverseOutline(o: Outline): Outline {
  const pts = [o.start, ...o.segs.map((s) => s.to)];
  const segs: OutlineSeg[] = [];
  for (let i = o.segs.length - 1; i >= 0; i--) {
    const s = o.segs[i];
    const to = pts[i];
    segs.push(s.c1 && s.c2 ? { c1: s.c2, c2: s.c1, to } : { to });
  }
  return { start: o.start, segs };
}

/** The outline as points (cubics sampled in `steps` pieces), start included once. */
export function flattenOutline(o: Outline, steps = 12): OutlinePoint[] {
  const out = [o.start];
  let from = o.start;
  for (const s of o.segs) {
    if (s.c1) for (let k = 1; k < steps; k++) out.push(at(from, s, k / steps));
    out.push(s.to);
    from = s.to;
  }
  if (out.length > 1 && near(out[out.length - 1], o.start)) out.pop();
  return out;
}

/** `polygon(...)` of the outline in px (the clip-path fallback without path() support). */
export function outlinePolygon(o: Outline, steps = 8): string {
  return `polygon(${flattenOutline(o, steps).map((q) => `${fmt(q.x)}px ${fmt(q.y)}px`).join(', ')})`;
}

/** Distance from `p` to the outline (px). */
export function distanceToOutline(o: Outline, p: OutlinePoint): number {
  const { i, t } = nearest(o, p);
  const q = at(i ? o.segs[i - 1].to : o.start, o.segs[i], t);
  return Math.hypot(q.x - p.x, q.y - p.y);
}
