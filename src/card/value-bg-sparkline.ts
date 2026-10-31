import { chainPath } from '../utils/shape-path';
import { bucketWindow } from '../services/history-cache';
import { VALUE_BG_DEFAULTS } from '../utils/value-background';

/*
 * The path of a history sparkline (design `value_background` of type `sparkline`): history samples to an SVG line
 * and area. Pure, no DOM. <mc-value-bg> (the decor chunk) draws it; the entry resolves the options only
 * (src/utils/value-background.ts).
 */

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};

interface Sample {
  t: number;
  v: number;
}

/**
 * The sparkline of history samples in a w x h box over the window `start`..`end`: long series are
 * averaged into time buckets, the last value is held to the window end, the line is a monotone
 * cubic or straight. `{ line: '' }` without samples, a time span or a box.
 */
export function sparklinePath(
  points: Sample[],
  w: number,
  h: number,
  opts: {
    min?: number;
    max?: number;
    smoothing: boolean;
    area: boolean;
    pad?: number;
    start?: number;
    end?: number;
    /** The value held to the window's end (default: the last sample's). */
    hold?: number;
    /** Return the held end (the last value carried to the window's end) as a separate `tail`. */
    splitHeld?: boolean;
  },
): { line: string; area?: string; tail?: string } {
  const clean = (Array.isArray(points) ? points : [])
    .filter((q) => q && Number.isFinite(q.t) && Number.isFinite(q.v))
    .sort((a, b) => a.t - b.t);
  if (!clean.length || !(w > 0 && h > 0)) return { line: '' };
  const start = num(opts.start) ?? clean[0].t;
  const end = num(opts.end) ?? clean[clean.length - 1].t;
  if (!(end > start)) return { line: '' };
  const inWindow = clean.filter((q) => q.t <= end).map((q) => ({ t: Math.max(q.t, start), v: q.v }));
  if (!inWindow.length) return { line: '' };

  // at most maxPoints with the held end point
  const max = VALUE_BG_DEFAULTS.maxPoints - 1;
  let pts = inWindow.length > max ? bucketWindow(inWindow, start, end, max) : inWindow;
  // the first bucket starts where the data starts (not at its middle)
  if (pts !== inWindow && pts.length) pts[0] = { t: Math.min(pts[0].t, inWindow[0].t), v: pts[0].v };
  // one point per time (the latest wins), then the last value held to the end
  pts = pts.filter((q, i) => i === pts.length - 1 || pts[i + 1].t > q.t);
  const lastValue = num(opts.hold) ?? inWindow[inWindow.length - 1].v;
  const held = pts[pts.length - 1].t < end;
  if (held) pts.push({ t: end, v: lastValue });
  if (pts.length < 2) return { line: '' };

  // a loop, not Math.min(...values): spreading a long history overflows the call stack
  let lo = Infinity;
  let hi = -Infinity;
  for (const q of pts) {
    if (q.v < lo) lo = q.v;
    if (q.v > hi) hi = q.v;
  }
  let min = num(opts.min);
  let max2 = num(opts.max);
  if (min !== undefined && max2 !== undefined && min > max2) [min, max2] = [max2, min];
  const from = min ?? Math.min(lo, max2 ?? lo);
  const to = max2 ?? Math.max(hi, min ?? hi);
  const range = to - from;
  // no range: flat data in the middle; with only a min (max) set, data all below it (above it) on that edge
  const flat = min === undefined && max2 === undefined ? 0.5 : max2 === undefined ? 0 : min === undefined ? 1 : 0.5;
  const level = (v: number) => (range > 0 ? Math.min(1, Math.max(0, (v - from) / range)) : flat);
  const pad = Math.min(Math.max(0, num(opts.pad) ?? 2), h / 4);
  const coords = pts.map((q) => ({
    x: ((q.t - start) / (end - start)) * w,
    y: h - pad - level(q.v) * (h - 2 * pad),
  }));
  const full = chainPath(coords, w, h, opts.smoothing);
  if (!full) return { line: '' };
  const f = (n: number) => String(Math.round(n * 100) / 100);
  const out: { line: string; area?: string; tail?: string } = { line: full };
  if (opts.splitHeld && held) {
    // the line up to the last sample, the held end drawn on its own (dashed: no live value)
    const a = coords[coords.length - 2];
    const b = coords[coords.length - 1];
    out.line = coords.length > 2 ? chainPath(coords.slice(0, -1), w, h, opts.smoothing) : '';
    out.tail = `M${f(a.x)} ${f(a.y)} L${f(b.x)} ${f(b.y)}`;
  }
  if (opts.area) out.area = `${full} L${f(coords[coords.length - 1].x)} ${f(h)} L${f(coords[0].x)} ${f(h)} Z`;
  return out;
}

/**
 * A sparkline's history between `start` and `end` (ms), at most `maxPoints - 2` points (bucketed like
 * sparklinePath), so the live value and the held end fit without bucketing again: worked out once per
 * fetched history, then each render only appends the live value. `last` is the latest sample's value
 * (what the line holds to the end without a live value).
 */
export function sparklineHistory(samples: Sample[], start: number, end: number): { points: Sample[]; last?: number } {
  const inWindow = (Array.isArray(samples) ? samples : [])
    .filter((q) => q && Number.isFinite(q.t) && Number.isFinite(q.v) && q.t <= end)
    .sort((a, b) => a.t - b.t)
    .map((q) => ({ t: Math.max(q.t, start), v: q.v }));
  if (!inWindow.length) return { points: [] };
  const last = inWindow[inWindow.length - 1].v;
  const max = VALUE_BG_DEFAULTS.maxPoints - 2;
  if (inWindow.length <= max || !(end > start)) return { points: inWindow, last };
  const points = bucketWindow(inWindow, start, end, max);
  if (points.length) points[0] = { t: Math.min(points[0].t, inWindow[0].t), v: points[0].v };
  return { points, last };
}
