import type { RingPosition, RingStart } from '../types';
import { rangeColor } from '../utils/color-ranges';
import { colour, withOpacity } from '../utils/ring';
import type { ResolvedRing, RingTimer } from '../utils/ring';

/** How <mc-ring> draws a resolved ring: dash pattern, motion, stroke offset and timer tick. Pure, no DOM. */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Number of dots of the Chase dots ring. */
export const RING_DOTS = 12;

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

const MIRRORED: Record<RingStart, RingStart> = {
  top: 'top',
  'top-right': 'top-left',
  right: 'left',
  'bottom-right': 'bottom-left',
  bottom: 'bottom',
  'bottom-left': 'bottom-right',
  left: 'right',
  'top-left': 'top-right',
};

/** The start point and direction of a ring mirrored on the vertical axis (right to left), so the same outline is walked the mirrored way. */
export function mirrorSweep(start: RingStart | undefined, direction: 'cw' | 'ccw' | undefined, rtl: boolean): { start: RingStart | undefined; direction: 'cw' | 'ccw' | undefined } {
  if (!rtl) return { start, direction };
  return { start: MIRRORED[start ?? 'top'], direction: direction === 'ccw' ? 'cw' : 'ccw' };
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
