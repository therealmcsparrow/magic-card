/**
 * Compositor-friendly travel along a flow line. A dot or shape that rides a path is animated with
 * `transform` keyframes sampled from the path (translate, plus rotate for shapes that turn), not with
 * `offset-distance`: a transform animation runs on the compositor, so a running flow costs the main
 * thread nothing per frame (offset-distance re-runs style, layout and paint every frame, flow-look
 * spike S3 and the 4x CPU measurements of the hands-on test). Pure: no DOM.
 */

/** A place on a path: position in px and the direction of travel along the path in degrees. */
export interface Pose {
  x: number;
  y: number;
  a: number;
}

/** Keyframe samples are about this far apart along the path (px) ... */
const STEP = 6;
/** ... and never more than this many per path. */
const MAX_SAMPLES = 100;

const r2 = (v: number): string => String(Math.round(v * 100) / 100 || 0);
const deg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * `@keyframes name`: the path from 0 % to 100 % at constant speed. `turn`: 'auto' also rotates the
 * element to the direction of travel, 'reverse' to the opposite direction (a flow that runs backwards
 * plays these frames in reverse), false does not rotate. `knots` are arc lengths that always get a
 * keyframe (corners). Samples on a straight stretch are dropped: a straight line is two keyframes.
 */
export function travelFrames(name: string, at: (s: number) => Pose, length: number, turn: false | 'auto' | 'reverse', knots: readonly number[] = []): string {
  const grid = new Set<number>([0, length]);
  const n = Math.min(MAX_SAMPLES, Math.max(2, Math.ceil(length / STEP)));
  for (let i = 1; i < n; i++) grid.add((length * i) / n);
  for (const k of knots) if (k > 0 && k < length) grid.add(k);
  const at0 = [...grid].sort((a, b) => a - b);
  const extra = turn === 'reverse' ? 180 : 0;
  // continuous angles: no 359 -> 0 jump between two samples
  let prev = 0;
  const poses = at0.map((s, i) => {
    const p = at(s);
    let a = p.a + extra;
    if (i) a += Math.round((prev - a) / 360) * 360;
    prev = a;
    return { s, x: p.x, y: p.y, a };
  });
  // a sample on the straight line between its neighbours (and not turning) adds nothing
  const kept = poses.filter((p, i) => {
    const q = poses[i - 1];
    const z = poses[i + 1];
    if (!q || !z) return true;
    if (Math.abs(p.a - q.a) > 0.05 || Math.abs(z.a - p.a) > 0.05) return true;
    const f = (p.s - q.s) / (z.s - q.s);
    return Math.hypot(q.x + (z.x - q.x) * f - p.x, q.y + (z.y - q.y) * f - p.y) > 0.05;
  });
  const frames = kept.map((p) => `${r2((p.s / (length || 1)) * 100)}%{transform:translate(${r2(p.x)}px,${r2(p.y)}px)${turn ? ` rotate(${r2(p.a)}deg)` : ''}}`);
  return `@keyframes ${name}{${frames.join('')}}`;
}

/** The pose function of a polyline (a lane beside the centre line): position by arc length. */
export function polylineAt(P: ReadonlyArray<{ x: number; y: number }>): { at: (s: number) => Pose; length: number } {
  const cum = [0];
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y));
  const length = cum[cum.length - 1];
  const at = (s: number): Pose => {
    if (P.length < 2) return { x: P[0]?.x ?? 0, y: P[0]?.y ?? 0, a: 0 };
    let i = 1;
    while (i < P.length - 1 && cum[i] < s) i++;
    const a = P[i - 1];
    const b = P[i];
    const f = cum[i] > cum[i - 1] ? Math.min(1, Math.max(0, (s - cum[i - 1]) / (cum[i] - cum[i - 1]))) : 0;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, a: deg(Math.atan2(b.y - a.y, b.x - a.x)) };
  };
  return { at, length };
}
