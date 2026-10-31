import type { HassEntity } from '../types';
import { unwatchOffscreen, watchOffscreen } from '../icons/offscreen';

/** Home Assistant timer entities (timer.*): time left and one shared 1 s ticker. */

/** A timer's progress: `remaining` and `total` in ms. Idle timers have nothing left. */
export interface TimerProgress {
  state: 'active' | 'paused' | 'idle';
  remaining: number;
  total: number;
  /** Active: epoch ms of the end (the browser clock), so the remaining time follows Date.now(). */
  end?: number;
}

export const isTimer = (id: string | undefined): boolean => !!id && id.startsWith('timer.');

/** "H:MM:SS", "1 day, 2:00:00" or a number of seconds, in ms; undefined when unreadable. */
export function parseDuration(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) && v >= 0 ? v * 1000 : undefined;
  if (typeof v !== 'string') return undefined;
  const m = /^\s*(?:(\d+)\s+days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?\s*$/.exec(v);
  if (!m) return undefined;
  const [, d, h, mi, s] = m;
  return ((Number(d || 0) * 24 + Number(h)) * 3600 + Number(mi) * 60 + Number(s || 0)) * 1000;
}

/** Progress of a timer entity, or undefined when it is not a timer (or has no readable duration). */
export function timerProgress(stateObj: HassEntity | undefined, now = Date.now()): TimerProgress | undefined {
  if (!stateObj || !isTimer(stateObj.entity_id)) return undefined;
  const a = stateObj.attributes || {};
  const total = parseDuration(a.duration);
  const left = parseDuration(a.remaining);
  const state = stateObj.state;
  if (state === 'active') {
    const end = typeof a.finishes_at === 'string' ? Date.parse(a.finishes_at) : NaN;
    if (Number.isFinite(end)) {
      return { state, remaining: Math.max(0, end - now), total: total ?? left ?? 0, end };
    }
    if (left === undefined) return undefined;
    // no finishes_at: `remaining` was true at the last state change, so count down from there
    const since = typeof stateObj.last_updated === 'string' ? Date.parse(stateObj.last_updated) : NaN;
    if (!Number.isFinite(since)) return { state, remaining: left, total: total ?? left };
    return { state, remaining: Math.max(0, since + left - now), total: total ?? left, end: since + left };
  }
  if (state === 'paused') return left === undefined ? undefined : { state, remaining: left, total: total ?? left };
  return { state: 'idle', remaining: 0, total: total ?? 0 };
}

/** Remaining 0..1 of the timer's duration (0 when it has no duration). */
export const timerFraction = (p: TimerProgress, now = Date.now()): number => {
  const left = p.end !== undefined ? Math.max(0, p.end - now) : p.remaining;
  return p.total > 0 ? Math.min(1, left / p.total) : 0;
};

/** Seconds as H:MM:SS, or M:SS under an hour. */
export function formatCountdown(ms: number): string {
  const t = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** The countdown text of an active / paused timer, else undefined (idle shows its state). */
export function timerCountdown(stateObj: HassEntity | undefined, now = Date.now()): string | undefined {
  const p = timerProgress(stateObj, now);
  if (!p || p.state === 'idle') return undefined;
  return formatCountdown(p.end !== undefined ? p.end - now : p.remaining);
}

// ── Shared ticker ──

const ticks = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | undefined;

/** Call `cb` every second with every other subscriber, from one interval; returns the unsubscribe. */
export function onTick(cb: () => void): () => void {
  ticks.add(cb);
  interval ??= setInterval(() => ticks.forEach((f) => f()), 1000);
  return () => {
    ticks.delete(cb);
    if (!ticks.size && interval !== undefined) {
      clearInterval(interval);
      interval = undefined;
    }
  };
}

/** For tests: is the shared interval running, and for how many subscribers. */
export const tickerState = (): { running: boolean; subscribers: number } => ({ running: interval !== undefined, subscribers: ticks.size });

/**
 * Ticks `cb` every second while `run(true)` and `el` is on screen (the shared off-screen observer; always on screen
 * without IntersectionObserver). Not pausable: a clock keeps ticking in a paused card. `run(false)` stops ticking and watching.
 */
export class TimerTick {
  private _on = false;
  private _off?: () => void;

  constructor(
    private readonly _el: Element,
    private readonly _cb: () => void,
  ) {}

  run(on: boolean): void {
    if (on === this._on) return;
    this._on = on;
    if (!on) {
      unwatchOffscreen(this._el);
      this._tick(false);
    } else if (!watchOffscreen(this._el, (visible) => this._tick(visible), { pausable: false })) {
      this._tick(true);
    }
  }

  private _tick(on: boolean): void {
    if (on && !this._off) this._off = onTick(this._cb);
    else if (!on && this._off) {
      this._off();
      this._off = undefined;
    }
  }
}
