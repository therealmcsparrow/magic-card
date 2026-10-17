import type { ColorRange, HassEntity, RingAnimation, RingConfig, RingPosition, RingStart } from '../types';
import { animationTriggerActive, cssTime, safeColor } from './animation';
import { rangeColor } from './color-ranges';
import { entityColorCss } from './entity-color';
import { entityNumber } from './entity-value';
import { isTimer, timerFraction, timerProgress } from './timer';
import { resolveBound } from './value-bound';

/*
 * The ring of a card / row / column / module design (RingConfig): what to draw, resolved from the
 * config and the entity states. The outline itself is drawn by <mc-ring> (src/card/mc-ring.ts)
 * from the element's rendered size and radii (src/utils/ring-path.ts).
 */

export const RING_DEFAULTS = {
  width: 3,
  transition: '1s',
  speed: '3s',
  length: 25,
  start: 'top' as RingStart,
  direction: 'cw' as const,
  linecap: 'round' as const,
  position: 'inside' as RingPosition,
  animation: 'snake' as RingAnimation,
  min: 0,
  max: 100,
};

/** Number of dots of the Chase dots ring. */
export const RING_DOTS = 12;


const ANIMATIONS: RingAnimation[] = ['snake', 'pulse', 'full', 'dots', 'dashes'];
const STARTS: RingStart[] = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'];
const POSITIONS: RingPosition[] = ['inside', 'center', 'outside'];
const DEFAULT_COLOR = 'var(--primary-color, #03a9f4)';

export interface ResolvedRing {
  mode: 'value' | 'animated';
  /** 0..1 of the outline (value mode); 1 when animated. */
  fill: number;
  animation?: RingAnimation;
  color: string;
  track?: string;
  width: number;
  linecap: 'round' | 'butt';
  glow: number;
  position: RingPosition;
  start: RingStart;
  direction: 'cw' | 'ccw';
  /** Snake segment, % of the outline. */
  length: number;
  speed: string;
  transition: string;
  /** Easing, delay, repeat and direction of the stroke animation (default "linear infinite"). */
  timing?: string;
  /** 0-1 opacity of the whole ring (an animation preset's Strength). */
  opacity?: number;
  /** A running timer: <mc-ring> moves the fill every second (ringTimerTick). */
  timer?: RingTimer;
}

/** What an active timer ring needs to redraw itself on each tick. */
export interface RingTimer {
  /** Epoch ms of the end (browser clock) and the duration. */
  end: number;
  total: number;
  elapsed: boolean;
  /** Colour without thresholds, and the thresholds (on the remaining %). */
  color: string;
  thresholds?: ColorRange[];
  /** Track opacity when the track is the ring colour (no track_color): it follows the tick colour. */
  trackOpacity?: number;
}

/** A timer ring's fill transition: at most 1s, so a long one does not lag behind the ticks. */
function tickTransition(t: string): string {
  const ms = t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000;
  return ms > 1000 ? '1s' : t;
}

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const pick = <T>(v: unknown, list: T[], def: T): T => (list.includes(v as T) ? (v as T) : def);

/** A colour value: `entity` / `entity N%` (the wrapper's entity colour) or a safe CSS colour. */
const colour = (v: unknown): string | undefined => entityColorCss(v) ?? safeColor(v);

const withOpacity = (c: string, pct: number | undefined) =>
  pct === undefined || pct >= 100 ? c : `color-mix(in srgb, ${c} ${clamp(pct, 0, 100)}%, transparent)`;

/**
 * What the ring draws, or undefined when it is off or its "Show only while" condition is false.
 * `defaultEntity`: the module's entity (value and condition default); none for card / row / column.
 * `clipped`: the ring's element clips its edge (the card: ha-card has overflow: hidden), so an
 * Outside ring would draw nothing; it is drawn Inside. `shaped`: the element is clipped to its
 * shape, which would cut off half of a Center ring too: every ring is drawn Inside.
 */
export function resolveRing(
  ring: RingConfig | undefined,
  ctx: { states?: Record<string, HassEntity>; defaultEntity?: string; clipped?: boolean; shaped?: boolean },
): ResolvedRing | undefined {
  if (!ring || typeof ring !== 'object' || (ring.mode !== 'value' && ring.mode !== 'animated')) return undefined;
  const own = ctx.defaultEntity ? ctx.states?.[ctx.defaultEntity] : undefined;
  if (ring.trigger !== 'tap' && !animationTriggerActive(ring, own, ctx.states)) return undefined;

  let fill = 1;
  let color = colour(ring.color);
  let timer: RingTimer | undefined;
  if (ring.mode === 'value') {
    const id = ring.entity || ctx.defaultEntity;
    const stateObj = id ? ctx.states?.[id] : undefined;
    const progress = !ring.attribute && isTimer(id) ? timerProgress(stateObj) : undefined;
    if (progress) {
      // a timer: the remaining share of its duration (thresholds read it as 0-100)
      const left = timerFraction(progress);
      const elapsed = ring.timer_fill === 'elapsed';
      fill = progress.state === 'idle' ? 0 : elapsed ? 1 - left : left;
      if (progress.end !== undefined && progress.total > 0) {
        timer = { end: progress.end, total: progress.total, elapsed, color: color ?? DEFAULT_COLOR, ...(ring.thresholds ? { thresholds: ring.thresholds } : {}) };
      }
      color = colour(rangeColor(left * 100, ring.thresholds)) ?? color;
    } else {
      const value = entityNumber(stateObj, ring.attribute || undefined);
      const min = resolveBound(ring.min, ctx.states, RING_DEFAULTS.min);
      const max = resolveBound(ring.max, ctx.states, RING_DEFAULTS.max);
      fill = value === undefined || max === min ? 0 : clamp((value - min) / (max - min), 0, 1);
      color = colour(rangeColor(value, ring.thresholds)) ?? color;
    }
  }
  color ??= DEFAULT_COLOR;

  const position = pick(ring.position, POSITIONS, RING_DEFAULTS.position);
  const trackColour = colour(ring.track_color);
  const trackOpacity = num(ring.track_opacity);
  const track = trackColour || trackOpacity !== undefined ? withOpacity(trackColour ?? color, trackOpacity) : undefined;
  if (timer && !trackColour && trackOpacity !== undefined) timer.trackOpacity = trackOpacity;
  const transition = cssTime(ring.transition) ?? RING_DEFAULTS.transition;

  return {
    mode: ring.mode,
    fill,
    ...(ring.mode === 'animated' ? { animation: pick(ring.animation, ANIMATIONS, RING_DEFAULTS.animation) } : {}),
    color,
    ...(track ? { track } : {}),
    width: clamp(num(ring.width) ?? RING_DEFAULTS.width, 0.5, 40),
    linecap: ring.linecap === 'butt' ? 'butt' : 'round',
    glow: clamp(num(ring.glow) ?? 0, 0, 40),
    position: ctx.shaped || (ctx.clipped && position === 'outside') ? 'inside' : position,
    start: pick(ring.start, STARTS, RING_DEFAULTS.start),
    direction: ring.direction === 'ccw' ? 'ccw' : 'cw',
    length: clamp(num(ring.length) ?? RING_DEFAULTS.length, 1, 99),
    speed: cssTime(ring.speed) ?? RING_DEFAULTS.speed,
    transition: timer ? tickTransition(transition) : transition,
    ...(timer ? { timer } : {}),
  };
}

/** Fill and colour (and the track, when it is the ring colour) of a running timer ring at `now`. */
export function ringTimerTick(t: RingTimer, now = Date.now()): { fill: number; color: string; track?: string } {
  const left = clamp((t.end - now) / t.total, 0, 1);
  const color = colour(rangeColor(left * 100, t.thresholds)) ?? t.color;
  return { fill: t.elapsed ? 1 - left : left, color, ...(t.trackOpacity !== undefined ? { track: withOpacity(color, t.trackOpacity) } : {}) };
}

/** How far the outline sits inside the border edge: half the stroke inside, on it, or half outside. */
export function ringInset(position: RingPosition, width: number): number {
  return position === 'inside' ? width / 2 : position === 'outside' ? -width / 2 : 0;
}

export interface RingStroke {
  dasharray: string;
  dashoffset: string;
  linecap: 'round' | 'butt';
  /** CSS animation of the stroke (keyframes in mc-ring), or "none". */
  animation: string;
  transition: string;
  opacity: number;
}

const r3 = (n: number) => String(+n.toFixed(3));

/**
 * Dash pattern and motion of the ring stroke, in percent of the outline (pathLength="100").
 * Value: a 100 dash shifted back by the empty part, so it fills from the start point.
 * Reduced motion: nothing moves, value changes are instant.
 */
export function ringStroke(r: ResolvedRing, reducedMotion: boolean): RingStroke {
  const still = (s: Omit<RingStroke, 'animation' | 'transition'>, animation = 'none', transition = 'none'): RingStroke => ({
    ...s,
    animation: reducedMotion ? 'none' : animation,
    transition: reducedMotion ? 'none' : transition,
  });
  if (r.mode === 'value') {
    return still(
      { dasharray: '100 101', dashoffset: r3(100 - r.fill * 100), linecap: r.linecap, opacity: r.fill > 0 ? 1 : 0 },
      'none',
      // a running timer moves every second: linear, so the steps join up
      `stroke-dashoffset ${r.transition} ${r.timer ? 'linear' : 'ease-in-out'}, stroke 0.5s ease`,
    );
  }
  const run = `mc-ring-run ${r.speed} ${r.timing ?? 'linear infinite'}`;
  switch (r.animation) {
    case 'pulse':
      return still({ dasharray: 'none', dashoffset: '0', linecap: r.linecap, opacity: 1 }, `mc-ring-pulse ${r.speed} ${r.timing ?? 'ease-in-out infinite'}`);
    case 'full':
      return still({ dasharray: 'none', dashoffset: '0', linecap: r.linecap, opacity: 1 });
    case 'dots':
      return still({ dasharray: `0 ${r3(100 / RING_DOTS)}`, dashoffset: '0', linecap: 'round', opacity: 1 }, run);
    case 'dashes':
      return still({ dasharray: '1.5 1.5', dashoffset: '0', linecap: r.linecap, opacity: 1 }, run);
    default:
      return still({ dasharray: `${r3(r.length)} ${r3(100 - r.length)}`, dashoffset: '0', linecap: r.linecap, opacity: 1 }, run);
  }
}
