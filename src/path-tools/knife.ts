/*
 * Knife (contract path-tools 1.0.0): a straight cut along the infinite line through a and b. Closed areas become
 * the two sides (booleans intersect with a half-plane each), open subpaths are split at every crossing. Pure.
 */
import { MAX_TOOL_SEGMENTS } from '../contracts/path-tools';
import type { KnifePiece, KnifeResult, PathToolsDeps, ToolOptions } from '../contracts/path-tools';
import type { Anchor, Cubic, EditPath, Pt } from '../contracts/path-model';
import { copyAnchor, copyPath, cubicAt, dist, same, segCount, segCubic, splitCubic, totalSegments } from './geom';
import { isArea, type RuleOptions } from './offset';

/** Parameters in (0, 1) where the cubic crosses the line (point a, unit normal n). */
function crossings(c: Cubic, a: Pt, n: Pt): number[] {
  const f = (t: number): number => {
    const p = cubicAt(c, t);
    return (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1];
  };
  const out: number[] = [];
  const N = 24;
  let t0 = 0;
  let f0 = f(0);
  for (let i = 1; i <= N; i++) {
    const t1 = i / N;
    const f1 = f(t1);
    if (f0 < 0 !== f1 < 0) {
      let lo = t0;
      let hi = t1;
      let flo = f0;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        const fm = f(mid);
        if (flo < 0 === fm < 0) {
          lo = mid;
          flo = fm;
        } else hi = mid;
      }
      const t = (lo + hi) / 2;
      if (t > 1e-6 && t < 1 - 1e-6) out.push(t);
    }
    t0 = t1;
    f0 = f1;
  }
  return out;
}

/** The open path cut at every crossing; undefined when the line misses it. */
function cutOpen(p: EditPath, a: Pt, n: Pt): EditPath[] | undefined {
  const groups: Anchor[][] = [];
  let cur: Anchor[] = [copyAnchor(p.anchors[0])];
  let cut = false;
  for (let i = 0; i < segCount(p); i++) {
    const c = segCubic(p, i);
    const ts = crossings(c, a, n);
    const pieces: Cubic[] = [];
    let rest = c;
    let done = 0;
    for (const t of ts) {
      const [l, r] = splitCubic(rest, (t - done) / (1 - done));
      pieces.push(l);
      rest = r;
      done = t;
    }
    pieces.push(rest);
    pieces.forEach((pc, j) => {
      const last = cur[cur.length - 1];
      delete last.out;
      if (!same(pc[1], pc[0])) last.out = [pc[1][0], pc[1][1]];
      if (j < pieces.length - 1) {
        const end: Anchor = { x: pc[3][0], y: pc[3][1], kind: 'corner' };
        if (!same(pc[2], pc[3])) end.in = [pc[2][0], pc[2][1]];
        cur.push(end);
        groups.push(cur);
        cur = [{ x: pc[3][0], y: pc[3][1], kind: 'corner' }];
        cut = true;
      } else {
        const nb = copyAnchor(p.anchors[i + 1]);
        delete nb.in;
        if (!same(pc[2], pc[3])) nb.in = [pc[2][0], pc[2][1]];
        cur.push(nb);
      }
    });
  }
  delete cur[cur.length - 1].out;
  groups.push(cur);
  return cut ? groups.map((anchors) => ({ anchors, closed: false })) : undefined;
}

export function knife(operands: EditPath[][], a: Pt, b: Pt, o: ToolOptions, deps: PathToolsDeps): KnifeResult {
  const len = dist(a, b);
  if (!(len > 1e-9)) return { ok: false, reason: 'no-line' };
  if (totalSegments(operands.flat()) > MAX_TOOL_SEGMENTS) return { ok: false, reason: 'too-complex' };
  const u: Pt = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n: Pt = [-u[1], u[0]];
  // a reach that covers every operand, the frame and both points
  let reach = 2 * (o.frame.w + o.frame.h) + len + Math.abs(a[0]) + Math.abs(a[1]);
  for (const ps of operands) for (const p of ps) for (const q of p.anchors) reach = Math.max(reach, 2 * (Math.abs(q.x - a[0]) + Math.abs(q.y - a[1])));
  const L = reach * 2;
  const half = (s: number): EditPath => ({
    closed: true,
    anchors: [
      { x: a[0] - u[0] * L, y: a[1] - u[1] * L },
      { x: a[0] + u[0] * L, y: a[1] + u[1] * L },
      { x: a[0] + u[0] * L + s * n[0] * L, y: a[1] + u[1] * L + s * n[1] * L },
      { x: a[0] - u[0] * L + s * n[0] * L, y: a[1] - u[1] * L + s * n[1] * L },
    ],
  });
  const fillRule = (o as RuleOptions).fillRule ?? 'nonzero';
  const pieces: KnifePiece[] = [];
  const cutFlags: boolean[] = [];
  for (let k = 0; k < operands.length; k++) {
    const ps = operands[k];
    const areas = ps.filter(isArea);
    const lines = ps.filter((p) => !isArea(p) && p.anchors.length >= 2);
    const mine: KnifePiece[] = [];
    let cut = false;
    if (areas.length) {
      const sides: EditPath[][] = [];
      for (const s of [1, -1]) {
        const r = deps.booleans.run(
          'intersect',
          [
            { paths: areas, fillRule },
            { paths: [half(s)], fillRule: 'nonzero' },
          ],
          { frame: o.frame, tolerance: o.tolerance },
        );
        if (!r.ok && r.reason === 'too-complex') return { ok: false, reason: 'too-complex' };
        if (r.ok) sides.push(r.paths);
      }
      if (sides.length === 2) {
        cut = true;
        for (const s of sides) mine.push({ operand: k, paths: s });
      }
    }
    const rest: EditPath[] = cut ? [] : areas.map(copyPath);
    for (const p of lines) {
      const runs = cutOpen(p, a, n);
      if (runs) {
        cut = true;
        for (const r of runs) mine.push({ operand: k, paths: [r] });
      } else rest.push(copyPath(p));
    }
    cutFlags.push(cut);
    if (!cut) pieces.push({ operand: k, paths: ps.map(copyPath) });
    else {
      if (rest.length) mine.push({ operand: k, paths: rest });
      pieces.push(...mine);
    }
  }
  return { ok: true, pieces, cut: cutFlags };
}

