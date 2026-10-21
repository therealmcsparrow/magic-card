import {
  IDLE_PAUSE_MS, STALE_FAILED_REFRESHES, STALE_MIN_AGE_MS,
  type BgPanZoom, type BgStackFx, type BgStackItem, type BgStackRun, type BgStackView,
} from '../../contracts/bg-stack';
import { anchorXY, isAnchor, num } from './values';

/*
 * The motion and refresh part of <mc-bg-stack>: pan / zoom settings and state, camera snapshot refresh,
 * the stale state with its pill, idle input, and the visibility, off-screen and reduced-motion wiring.
 * Nothing runs while the stack is off screen, the page is hidden or the card is paused: refresh, stale
 * ticker and idle timers are cleared and restarted on return.
 */

const PILL_TICK_MS = 60_000;
const REDUCED = '(prefers-reduced-motion: reduce)';
const PILL_STYLE = 'display:inline-block;font:13px/1.4 sans-serif;color:#fff;background:rgba(0,0,0,.85);padding:2px 8px;border-radius:999px';
const INPUT_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart'] as const;

// one passive input listener per page, shared by every stack, throttled to 1 Hz
const inputSubs = new Set<() => void>();
let lastInputAt = 0;
let lastInputTick = 0;
const onInput = (): void => {
  const now = Date.now();
  if (now - lastInputTick < 1000) return;
  lastInputTick = lastInputAt = now;
  inputSubs.forEach((f) => f());
};
function subscribeInput(f: () => void): () => void {
  if (!inputSubs.size) for (const e of INPUT_EVENTS) document.addEventListener(e, onInput, { passive: true });
  inputSubs.add(f);
  lastInputAt = Date.now();
  return () => {
    inputSubs.delete(f);
    if (!inputSubs.size) for (const e of INPUT_EVENTS) document.removeEventListener(e, onInput);
  };
}

/** `href` with a changing query parameter, set on the parsed URL (never string concatenation). */
function busted(href: string): string {
  if (/^data:/i.test(href)) return href;
  try {
    const u = new URL(href);
    u.searchParams.set('mc_t', String(Date.now()));
    return u.href;
  } catch {
    return href;
  }
}

/** Pan / zoom settings with the contract defaults and clamps; undefined when the key is not an object. */
export function panZoomOf(v: unknown): BgPanZoom | undefined {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
  const o = v as Record<string, unknown>;
  const [fx, fy] = anchorXY(isAnchor(o.focus) ? o.focus : 'center');
  return {
    from: num(o.from, 100, 200, 100) / 100,
    to: num(o.to, 100, 200, 115) / 100,
    fx,
    fy,
    duration: num(o.duration, 10, 120, 30),
    alternate: o.alternate !== false,
    idle: o.pause_when_idle === true,
  };
}

/** Refresh period in ms of a camera layer: 5 s to 1 h, default 10 s. */
const refreshOf = (i: BgStackItem): number => {
  const r = i.cfg.refresh;
  return Math.min(3600, Math.max(5, typeof r === 'number' && Number.isFinite(r) ? r : 10)) * 1000;
};

class StackRun implements BgStackRun {
  private _onScreen: boolean;
  private _visible = document.visibilityState !== 'hidden';
  private _reduced: boolean;
  private _idle = false;
  private _mq?: MediaQueryList;
  private _mo: MutationObserver;
  private _stopInput?: () => void;
  private _idleTimer?: ReturnType<typeof setTimeout>;
  private _pillTimer?: ReturnType<typeof setInterval>;
  private _pill?: HTMLElement;

  constructor(private readonly _el: BgStackView) {
    this._onScreen = !_el.hasAttribute('offscreen');
    this._mq = typeof window.matchMedia === 'function' ? window.matchMedia(REDUCED) : undefined;
    this._reduced = !!this._mq?.matches;
    this._mq?.addEventListener?.('change', this._onMotion);
    document.addEventListener('visibilitychange', this._onVisibility);
    this._mo = new MutationObserver(this._onOffscreen);
    this._mo.observe(_el, { attributes: true, attributeFilter: ['offscreen'] });
  }

  stop(): void {
    this._mq?.removeEventListener?.('change', this._onMotion);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._mo.disconnect();
    this._disarm();
    this._removePill();
  }

  pan(v: unknown): BgPanZoom | undefined {
    return panZoomOf(v);
  }

  private _onOffscreen = (): void => {
    const on = !this._el.hasAttribute('offscreen');
    if (on === this._onScreen) return;
    this._onScreen = on;
    this.arm();
    this._el.requestUpdate();
  };

  private _onVisibility = (): void => {
    this._visible = document.visibilityState !== 'hidden';
    this.arm();
    this._el.requestUpdate();
  };

  private _onMotion = (): void => {
    this._reduced = !!this._mq?.matches;
    this._el.requestUpdate();
  };

  private _active(): boolean {
    return this._el.isConnected && this._onScreen && this._visible;
  }

  arm(): void {
    if (!this._active()) {
      this._disarm();
      return;
    }
    for (const i of this._el.items) this.schedule(i);
    if (this._el.items.some((i) => i.pz?.idle && !i.cfg.hidden)) {
      if (!this._stopInput) {
        this._idle = false;
        this._stopInput = subscribeInput(this._wake);
      }
      this._armIdle();
    } else {
      this._stopInput?.();
      this._stopInput = undefined;
    }
    this._armPill();
  }

  private _disarm(): void {
    for (const i of this._el.items) {
      clearTimeout(i.timer);
      i.timer = undefined;
    }
    clearTimeout(this._idleTimer);
    this._idleTimer = undefined;
    clearInterval(this._pillTimer);
    this._pillTimer = undefined;
    this._stopInput?.();
    this._stopInput = undefined;
  }

  private _wake = (): void => {
    const was = this._idle;
    this._idle = false;
    this._armIdle();
    if (was) this._el.requestUpdate();
  };

  private _armIdle(): void {
    clearTimeout(this._idleTimer);
    if (!this._stopInput) return;
    this._idleTimer = setTimeout(() => {
      this._idleTimer = undefined;
      this._idle = true;
      this._el.requestUpdate();
    }, Math.max(0, IDLE_PAUSE_MS - (Date.now() - lastInputAt)));
  }

  motion(pz: BgPanZoom): 'play' | 'pause' | 'start' | 'end' {
    const el = this._el;
    if (el.preview) return el.preview;
    if (this._reduced || el.host?.lowPower()) return 'start';
    return this._active() && !(pz.idle && this._idle) ? 'play' : 'pause';
  }

  schedule(i: BgStackItem): void {
    if (!i.camera || i.cfg.hidden || i.timer !== undefined || i.loading || !i.base || !this._active()) return;
    const delay = i.lastTry ? Math.max(0, i.lastTry + refreshOf(i) - Date.now()) : 0;
    i.timer = setTimeout(() => {
      i.timer = undefined;
      if (this._active() && i.base) void this._el.load(i, i.base, busted(i.base));
    }, delay);
  }

  good(i: BgStackItem): void {
    i.failures = 0;
    i.lastGood = Date.now();
    this._evalStale(i);
  }

  bad(i: BgStackItem): void {
    i.failures = (i.failures ?? 0) + 1;
    this._evalStale(i);
    if (!i.stale) this._el.status(i, i.shown ? 'ok' : 'error', i.shown ? undefined : 'snapshot-failed', i.shown ? undefined : i.cfg.entity);
  }

  private _evalStale(i: BgStackItem): void {
    if (!i.camera || i.cfg.stale_badge === false) return;
    const age = Date.now() - (i.lastGood || i.since);
    const stale = (i.failures ?? 0) >= STALE_FAILED_REFRESHES || age > Math.max(3 * refreshOf(i), STALE_MIN_AGE_MS);
    if (stale === i.stale) return;
    i.stale = stale;
    if (stale && i.shown) this._el.status(i, 'ok', 'stale', Math.floor(age / 1000));
    else if (stale) this._el.status(i, 'error', 'snapshot-failed', i.cfg.entity);
    this._updatePill();
    this._armPill();
  }

  private _armPill(): void {
    const any = this._el.items.some((i) => i.stale);
    if (any && this._active() && this._pillTimer === undefined) this._pillTimer = setInterval(() => this._updatePill(), PILL_TICK_MS);
    else if (!any || !this._active()) {
      clearInterval(this._pillTimer);
      this._pillTimer = undefined;
    }
  }

  private _updatePill(): void {
    const el = this._el;
    const stale = el.items.filter((i) => i.stale);
    const badge = el.host?.badgeHost();
    if (!stale.length || !badge || !el.host) {
      this._removePill();
      return;
    }
    const secs = Math.floor(Math.max(...stale.map((i) => Date.now() - (i.lastGood || i.since))) / 1000);
    if (!this._pill) {
      this._pill = document.createElement('span');
      this._pill.setAttribute('style', PILL_STYLE);
      badge.appendChild(this._pill);
    }
    this._pill.textContent = el.host.staleText(secs);
    el.requestUpdate();
  }

  private _removePill(): void {
    this._pill?.remove();
    this._pill = undefined;
  }
}

export const bgFx: BgStackFx = { attach: (el) => new StackRun(el) };
