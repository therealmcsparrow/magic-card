import { type Stop } from '../utils/flow-motion';
import type { Sampled } from './sampler';

/*
 * Travel keyframes of the flow-look chunk (transform animations, see src/utils/flow-motion.ts): the
 * stops of a sampled centre line. Curves and corner arcs get one about every 5 px. Straight pieces
 * keep their ends; a shape that turns also swings to a new piece's direction at its start (a sharp
 * corner, as a zigzag has), not gradually along it.
 */
const STEP = 5;
/** A direction change above this many degrees is a corner. */
const CORNER = 10;
/** The start stop of a piece sits this far (px) along it, so it has a keyframe of its own. */
const NUDGE = 0.05;

/** `turn`: every stop also carries the direction of travel (degrees), for shapes that rotate with it. */
export function stops(S: Sampled, turn: boolean): Stop[] {
  const out: Stop[] = [];
  let last = -STEP;
  let was = 0;
  S.pts.forEach((p, i) => {
    const a = (Math.atan2(p.ty, p.tx) * 180) / Math.PI;
    const corner = !!p.ln && (!turn || Math.abs(((a - was + 540) % 360) - 180) > CORNER);
    if (i && i < S.pts.length - 1 && !corner && p.s - last < STEP) return;
    if (turn && i && corner) out.push({ x: S.pts[i - 1].x + p.tx * NUDGE, y: S.pts[i - 1].y + p.ty * NUDGE, a });
    out.push(turn ? { x: p.x, y: p.y, a } : { x: p.x, y: p.y });
    last = p.s;
    was = a;
  });
  return out;
}
