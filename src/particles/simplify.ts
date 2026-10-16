import type { BakedStop } from '../contracts/particles-v2';

/** A stop before simplification; `keep` marks stops that must survive (birth, death, the period wrap). */
export interface RawStop extends BakedStop {
  keep?: boolean;
}

/** Start tolerance, % of the layer (ADR 0004 / plan T2.2). */
export const BASE_TOLERANCE = 0.5;

/**
 * Largest error of `p` against the straight line a..b, in % units: position in % of the layer,
 * rotation with 100 % = 360 deg, opacity and scale with 100 % = 1.
 */
function error(a: RawStop, b: RawStop, p: RawStop): number {
  const span = b.t - a.t;
  const u = span > 0 ? (p.t - a.t) / span : 0;
  const at = (k: 'x' | 'y' | 'rotate' | 'opacity' | 'scale') => a[k] + (b[k] - a[k]) * u;
  return Math.max(
    Math.abs(p.x - at('x')),
    Math.abs(p.y - at('y')),
    Math.abs(p.rotate - at('rotate')) / 3.6,
    Math.abs(p.opacity - at('opacity')) * 100,
    Math.abs(p.scale - at('scale')) * 100,
  );
}

/**
 * Douglas-Peucker ranks, computed once: each stop gets the error at which DP would keep it
 * (never more than the stop that split its segment, so the ranks are monotone). Ends and `keep`
 * stops rank Infinity. The stops kept at tolerance `tol` are exactly those ranked above it.
 */
export function rankStops(stops: RawStop[]): Float64Array {
  const n = stops.length;
  const rank = new Float64Array(n);
  if (!n) return rank;
  rank[0] = Infinity;
  rank[n - 1] = Infinity;
  for (let i = 1; i < n - 1; i++) if (stops[i].keep) rank[i] = Infinity;
  const anchors: number[] = [];
  for (let i = 0; i < n; i++) if (rank[i] === Infinity) anchors.push(i);
  const stack: Array<[number, number, number]> = [];
  for (let k = 0; k + 1 < anchors.length; k++) stack.push([anchors[k], anchors[k + 1], Infinity]);
  while (stack.length) {
    const [i, j, cap] = stack.pop()!;
    if (j - i < 2) continue;
    let worst = -1;
    let at = i + 1;
    for (let k = i + 1; k < j; k++) {
      const e = error(stops[i], stops[j], stops[k]);
      if (e > worst) {
        worst = e;
        at = k;
      }
    }
    const r = Math.min(worst, cap);
    rank[at] = r;
    stack.push([i, at, r], [at, j, r]);
  }
  return rank;
}

/** Stops kept at `tol`, then coarser until at most `max` remain (highest ranks win). */
export function simplifyRanked(stops: RawStop[], rank: Float64Array, tol: number, max: number): RawStop[] {
  let kept = 0;
  for (let i = 0; i < rank.length; i++) if (rank[i] > tol) kept++;
  let cut = tol;
  if (kept > max) {
    const sorted = Array.from(rank).sort((a, b) => b - a);
    cut = Math.max(tol, sorted[max - 1] === Infinity ? Infinity : sorted[max]);
    // ties at the cut: drop them all (fewer stops, never more than max)
    if (cut === Infinity) return stops.filter((_, i) => rank[i] === Infinity).slice(0, max);
  }
  return stops.filter((_, i) => rank[i] > cut);
}

/** One-off simplification at `tol` (no cap). */
export const simplify = (stops: RawStop[], tol: number): RawStop[] => simplifyRanked(stops, rankStops(stops), tol, Infinity);
