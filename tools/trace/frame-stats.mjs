// Pure frame and box-shift measures for the first-card trace. No I/O and no clock, so every function runs on
// fake timestamps.
//
// A frame is the gap between two requestAnimationFrame callbacks. Timestamps are in ms from navigation start.

export const FRAME_MS = 1000 / 60;
export const WINDOW_MS = 500;
export const SHIFT_PX = 1;
export const LAYOUT_SHIFT_LIMIT = 0.01;
export const ANIMATED_TYPES = ['[data-mc-anim]', '[data-mc-v2]', '.mc-anim-fx', 'mc-flows', 'mc-seasonal', 'mc-ring'];

const SIDES = ['left', 'top', 'width', 'height'];

/** Gaps between neighbouring frames: [{ start, gap }], where start is the earlier timestamp. */
export function frameGaps(frames) {
  const out = [];
  for (let i = 1; i < frames.length; i++) out.push({ start: frames[i - 1], gap: frames[i] - frames[i - 1] });
  return out;
}

/** The largest gap between two frames, in ms. */
export function worstFrame(frames) {
  return frameGaps(frames).reduce((m, g) => Math.max(m, g.gap), 0);
}

/** Sum over gaps of the 60 Hz frames missed inside the gap. */
export function droppedFrames(frames) {
  return frameGaps(frames).reduce((n, g) => n + Math.max(0, Math.round(g.gap / FRAME_MS) - 1), 0);
}

/** The largest gap that starts within windowMs after any chunk's responseEnd (both ends included). */
export function worstAfterChunk(frames, chunkEnds, windowMs = WINDOW_MS) {
  let worst = 0;
  for (const g of frameGaps(frames)) {
    if (chunkEnds.some((end) => g.start >= end && g.start <= end + windowMs)) worst = Math.max(worst, g.gap);
  }
  return worst;
}

/**
 * Compares two snapshots of untransformed layout boxes: [{ id, types, box: { left, top, width, height } }].
 * An element only in the settle snapshot is late, not a shift (its wrapper is in both and is compared). An
 * element only in the first snapshot is gone, which is not a shift either.
 */
export function boxShifts(first, settle, tolerance = SHIFT_PX) {
  const before = new Map(first.map((e) => [e.id, e]));
  const after = new Set(settle.map((e) => e.id));
  const shifts = [];
  const late = [];
  const byType = {};
  for (const e of settle) {
    const was = before.get(e.id);
    if (!was) { late.push({ id: e.id, types: e.types, box: e.box }); continue; }
    const changes = {};
    for (const side of SIDES) {
      const d = e.box[side] - was.box[side];
      if (Math.abs(d) >= tolerance) changes[side] = d;
    }
    if (!Object.keys(changes).length) continue;
    shifts.push({ id: e.id, types: e.types, from: was.box, to: e.box, changes });
    for (const t of e.types) byType[t] = (byType[t] ?? 0) + 1;
  }
  const gone = first.filter((e) => !after.has(e.id)).map((e) => e.id);
  return { shifts, late, gone, byType };
}

/** True when the run counts as a shift: any box change, or a layout-shift sum above the limit. */
export function shiftVerdict(result, layoutShiftSum) {
  return result.shifts.length > 0 || layoutShiftSum > LAYOUT_SHIFT_LIMIT;
}

/** The maximum of the numbers in a list, ignoring null and undefined; 0 for an empty list. */
export function maxOf(values) {
  return values.reduce((m, v) => (v == null ? m : Math.max(m, v)), 0);
}
