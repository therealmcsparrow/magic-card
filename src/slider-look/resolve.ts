import type { SliderModuleConfig } from '../types';
import type { SliderThumb, SliderTrackStyle } from '../contracts/slider-look';
import { safeColor } from '../utils/animation';

/*
 * Config to a plain, clamped look model (CFG rules): every number is narrowed and clamped, every
 * colour goes through safeColor, every enum falls back to its default. Style keys of another style
 * are kept in YAML and ignored here.
 */

export const STYLES: readonly SliderTrackStyle[] = ['standard', 'thin', 'pill', 'segmented', 'glass', 'big-fill'];
const THUMBS: readonly SliderThumb[] = ['line', 'circle', 'pill', 'square', 'none'];
const THICKNESS: Record<SliderTrackStyle, number> = { standard: 40, thin: 6, pill: 16, segmented: 16, glass: 28, 'big-fill': 64 };
const THUMB_SIZE = { circle: 20, pill: 28, square: 18 } as const;
const MAX_STOPS = 12;
const MAX_TICKS = 50;
const MAX_LABEL = 8;

/** Bubble linger after a release or a tap (touch has no hover), ms. */
export const LINGER_MS = 2000;
/** The failed-call hint stays this long (at least 3 s, 5 s for low vision). */
export const ERROR_MS = 5000;
/** The touch area of every track is at least this tall (px). */
export const HIT_PX = 40;

export interface Stop {
  value: number;
  /** Full text (aria-valuetext). */
  label?: string;
  /** At most 8 characters, drawn under the tick. */
  short?: string;
}

export interface Look {
  style: SliderTrackStyle;
  /** Track thickness (px). */
  thickness: number;
  /** Track corners, a CSS length. */
  radius: string;
  segments: number;
  gap: number;
  blur: boolean;
  fillMode: 'solid' | 'gradient' | 'auto';
  fillTo?: string;
  entityColour: boolean;
  thumb: SliderThumb;
  thumbSize: number;
  thumbBorder: number;
  thumbBorderColour: string;
  thumbGlow: number;
  thumbIcon?: string;
  /** Update the entity while dragging (any style). */
  live: boolean;
  /** big-fill: the icon (default on), an own icon id, and its place (centre only counts for vertical). */
  showIcon: boolean;
  icon?: string;
  iconPos: 'start' | 'center';
  position: 'beside' | 'bubble' | 'track' | 'hidden';
  ticks: boolean;
  tickEvery?: number;
  limits: boolean;
  snap: boolean;
  rawStops: Stop[];
}

// same test as isIconId (src/utils/icon-list.ts), whose file holds the editor's icon catalogue
const isIconId = (v: string): boolean => /^[a-z0-9_-]+:[a-z0-9_.-]+$/i.test(v.trim());
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const clamp = (v: unknown, lo: number, hi: number, def: number): number => (isNum(v) ? Math.max(lo, Math.min(hi, v)) : def);
const oneOf = <T extends string>(v: unknown, all: readonly T[], def: T): T => (all.includes(v as T) ? (v as T) : def);

export function resolveLook(c: Partial<SliderModuleConfig>): Look {
  const style = oneOf(c.track_style, STYLES, 'standard');
  const thumb = oneOf(c.thumb, THUMBS, 'line');
  const thickness = clamp(c.track_thickness, 2, 96, THICKNESS[style]);
  const defaultRadius = style === 'standard' || style === 'glass' ? 'var(--mc-slider-radius)' : style === 'segmented' ? '4px' : style === 'big-fill' ? '20px' : '999px';
  const raw = Array.isArray(c.stops) ? c.stops : [];
  const rawStops: Stop[] = [];
  for (const s of raw.slice(0, MAX_STOPS)) {
    if (!s || !isNum(s.value)) continue;
    // an unquoted YAML Off / On is a boolean: show it as the word (YAML 1.1), not as a missing label
    const raw: unknown = s.label;
    const label = typeof raw === 'string' && raw.trim() ? raw.trim() : typeof raw === 'boolean' ? (raw ? 'On' : 'Off') : undefined;
    rawStops.push({ value: s.value, label, short: label ? [...label].slice(0, MAX_LABEL).join('') : undefined });
  }
  const colour = (v: unknown) => safeColor(v);
  return {
    style,
    thickness,
    radius: isNum(c.track_radius) ? `${clamp(c.track_radius, 0, 48, 0)}px` : defaultRadius,
    segments: Math.round(clamp(c.segments, 2, 20, 0)),
    gap: clamp(c.segment_gap, 1, 8, 2),
    blur: c.glass_blur === true,
    fillMode: oneOf(c.fill_mode, ['solid', 'gradient', 'auto'] as const, 'solid'),
    fillTo: colour(c.slider_color_to),
    entityColour: c.use_entity_color === true,
    thumb,
    thumbSize: Math.round(clamp(c.thumb_size, 4, 64, thumb === 'line' || thumb === 'none' ? 0 : THUMB_SIZE[thumb])),
    thumbBorder: clamp(c.thumb_border, 0, 6, 0),
    thumbBorderColour: colour(c.thumb_border_color) ?? '#ffffff',
    thumbGlow: clamp(c.thumb_glow, 0, 30, 0),
    thumbIcon: typeof c.thumb_icon === 'string' && isIconId(c.thumb_icon) ? c.thumb_icon.trim() : undefined,
    live: c.live === true,
    showIcon: c.show_icon !== false,
    icon: typeof c.icon === 'string' && isIconId(c.icon) ? c.icon.trim() : undefined,
    iconPos: c.icon_position === 'center' ? 'center' : 'start',
    // show_value: false hides the value whatever value_position says; big fill shows it in the track unless told otherwise
    position: c.show_value === false ? 'hidden' : oneOf(c.value_position, ['beside', 'bubble', 'track', 'hidden'] as const, style === 'big-fill' ? 'track' : 'beside'),
    ticks: c.ticks === true,
    tickEvery: isNum(c.tick_every) && c.tick_every > 0 ? c.tick_every : undefined,
    limits: c.show_limits === true,
    snap: c.snap === true,
    rawStops,
  };
}

/** Stops inside [min, max], sorted, one per value. */
export function stopsIn(look: Look, min: number, max: number): Stop[] {
  const seen = new Set<number>();
  return look.rawStops
    .filter((s) => s.value >= min && s.value <= max && !seen.has(s.value) && !!seen.add(s.value))
    .sort((a, b) => a.value - b.value);
}

/** Segment count: the config, else from the step (at most 20). */
export function segmentCount(look: Look, min: number, max: number, step: number): number {
  if (look.segments) return look.segments;
  const n = step > 0 ? Math.round((max - min) / step) : 10;
  return Math.max(2, Math.min(20, n || 10));
}

const NICE = [1, 2, 2.5, 5];

/** Tick values: every `tick_every`, else a nice step that gives 5-10 intervals; capped at 50 ticks. */
export function tickValues(look: Look, min: number, max: number): number[] {
  const range = max - min;
  if (!(range > 0)) return [];
  let every = look.tickEvery && range / look.tickEvery <= MAX_TICKS ? look.tickEvery : 0;
  if (!every) {
    const base = 10 ** Math.floor(Math.log10(range / 10));
    every = [...NICE, 10].map((n) => n * base).find((s) => range / s <= 10) ?? range;
  }
  const out: number[] = [];
  const eps = every * 1e-6;
  for (let i = 0; min + i * every <= max + eps && out.length <= MAX_TICKS; i++) out.push(+(min + i * every).toFixed(10));
  return out;
}

/** Drag snapping to the nearest stop. */
export function nearestStop(stops: Stop[], v: number): number {
  let best = stops[0].value;
  for (const s of stops) if (Math.abs(s.value - v) < Math.abs(best - v)) best = s.value;
  return best;
}

/** Keys with snap: arrows and Page go to the next / previous stop, Home / End to the first / last. */
export function stopKey(stops: Stop[], current: number, key: string): number | undefined {
  const eps = 1e-9;
  switch (key) {
    case 'ArrowRight': case 'ArrowUp': case 'PageUp':
      return (stops.find((s) => s.value > current + eps) ?? stops[stops.length - 1]).value;
    case 'ArrowLeft': case 'ArrowDown': case 'PageDown':
      return ([...stops].reverse().find((s) => s.value < current - eps) ?? stops[0]).value;
    case 'Home': return stops[0].value;
    case 'End': return stops[stops.length - 1].value;
    default: return undefined;
  }
}
