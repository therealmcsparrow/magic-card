import type { HomeAssistant, ValueBackgroundConfig } from '../types';
import { colour, entityLevel, share } from '../icons/icon-fx';
import { chainPath } from './shape-path';
import { bucketWindow } from '../services/history-cache';

/*
 * `design.value_background` resolved against the entity states (pure, no DOM): a tank fill level or
 * the options of a history sparkline, plus the sparkline's path from history samples.
 */

export type ValueBgDirection = 'up' | 'down' | 'left' | 'right';

export interface ResolvedValueBackground {
  type: 'fill' | 'sparkline';
  /** Fill: 0..1 of the current value between min and max; undefined = no value (a hatched empty tank). Not set for a sparkline. */
  level?: number;
  color: string;
  /** Fill opacity / sparkline area opacity, 0..1. */
  opacity: number;
  direction: ValueBgDirection;
  wave: boolean;
  hours: number;
  lineWidth: number;
  area: boolean;
  smoothing: boolean;
  entity?: string;
  attribute?: string;
  /** As configured (undefined = fill 0..100 / sparkline auto range). */
  min?: number;
  max?: number;
}

export const VALUE_BG_DEFAULTS = {
  color: 'var(--mc-primary, var(--primary-color))',
  /** Fill opacity. */
  opacity: 0.25,
  /** Sparkline area opacity (at the bottom; the area fades out upwards). */
  areaOpacity: 0.18,
  /** Sparkline line opacity (`--mc-value-bg-line-opacity`): faint behind text. */
  lineOpacity: 0.45,
  hours: 24,
  /** Longest sparkline window (a week, like the graphs module). */
  maxHours: 168,
  lineWidth: 1.5,
  /** Most points a sparkline draws. */
  maxPoints: 60,
};

const DIRECTIONS: ValueBgDirection[] = ['up', 'down', 'left', 'right'];

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
const positive = (v: unknown, def: number) => {
  const n = num(v);
  return n !== undefined && n > 0 ? n : def;
};

/**
 * What to draw behind an element: undefined when off / unknown type / without an entity (rows,
 * columns and the card need their own). `ctx.entity` is the module's entity (the default).
 */
export function resolveValueBackground(
  cfg: ValueBackgroundConfig | undefined,
  ctx: { hass?: HomeAssistant; entity?: string },
): ResolvedValueBackground | undefined {
  if (!cfg || typeof cfg !== 'object') return undefined;
  if (cfg.type !== 'fill' && cfg.type !== 'sparkline') return undefined;
  const entity = cfg.entity || ctx.entity;
  if (!entity) return undefined;
  const stateObj = ctx.hass?.states?.[entity];
  const attribute = cfg.attribute || undefined;
  const min = num(cfg.min);
  const max = num(cfg.max);
  const fill = cfg.type === 'fill';
  const out: ResolvedValueBackground = {
    type: cfg.type,
    color: colour(cfg.color, stateObj) ?? VALUE_BG_DEFAULTS.color,
    opacity: share(cfg.opacity) ?? (fill ? VALUE_BG_DEFAULTS.opacity : VALUE_BG_DEFAULTS.areaOpacity),
    direction: DIRECTIONS.includes(cfg.direction as ValueBgDirection) ? (cfg.direction as ValueBgDirection) : 'up',
    wave: cfg.wave !== false,
    hours: Math.min(VALUE_BG_DEFAULTS.maxHours, positive(cfg.hours, VALUE_BG_DEFAULTS.hours)),
    lineWidth: positive(cfg.line_width, VALUE_BG_DEFAULTS.lineWidth),
    area: cfg.area !== false,
    smoothing: cfg.smoothing !== false,
    entity,
  };
  // a sparkline draws the history, not the level (a level in it would re-render the layer for nothing)
  if (fill) out.level = entityLevel(stateObj, attribute, min, max);
  if (attribute) out.attribute = attribute;
  if (min !== undefined) out.min = min;
  if (max !== undefined) out.max = max;
  return out;
}

interface Sample {
  t: number;
  v: number;
}

/**
 * The sparkline of history samples in a w x h box over the time window `start`..`end` (ms; the data's
 * own span when unset): samples before the window start at its left edge, later ones are dropped,
 * more than ~60 are averaged into equal time buckets (gaps keep the last value), and the last value
 * is held to the window's end (a value that never changed is a flat line across). The line is a
 * monotone cubic (no backtracking or overshoot) or straight; the area runs under it to the bottom.
 * Values scale between min and max (the data's own range when unset; swapped when reversed; clamped
 * when outside), inside `pad` px from the top and bottom; flat data is a line through the middle.
 * `{ line: '' }` without numeric samples, without a time span or for an empty box.
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
