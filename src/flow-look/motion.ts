import { type Stop } from '../utils/flow-motion';
import { at, type Sampled } from './sampler';

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

/** A pixel either side of a hide window: the bar fades out and in over this much. */
const FADE = 0.05;

/**
 * The stops of a highlight bar and its opacity at each: 0 while any part of the bar (`half` = half its
 * length) is over a corner arc, 1 elsewhere. A straight bar cannot bend, so on an arc its ends would
 * overhang the line; opacity keyframes run on the compositor like the transform ones. A line with no
 * corner arcs comes back as stops() gives it, with no opacities (o is a Stop field).
 */
export function barStops(S: Sampled, half: number): Stop[] {
  const base = stops(S, true);
  if (!S.corners.length) return base;
  const win = S.corners.map(([a, b]) => [a - half, b + half]);
  const hidden = (s: number) => win.some(([a, b]) => s > a && s < b);
  // a stop's place along the line = the chord length so far (what travelFrames turns into percentages)
  let s = 0;
  const items = base.map((p, i) => ({ s: (s += i ? Math.hypot(p.x - base[i - 1].x, p.y - base[i - 1].y) : 0), p: { ...p, o: +!hidden(s) } }));
  // the edges of each window; a fade-in edge that lies inside a neighbouring window is dropped
  for (const [a, b] of win) {
    for (const [x, o] of [[a - FADE, 1], [a, 0], [b, 0], [b + FADE, 1]]) {
      const q = at(S, x);
      if (!o || !hidden(x)) items.push({ s: x, p: { x: q.x, y: q.y, a: (Math.atan2(q.ty, q.tx) * 180) / Math.PI, o } });
    }
  }
  return items.sort((u, v) => u.s - v.s).map((i) => i.p);
}
