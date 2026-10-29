import type { HassEntity, PopupConfig, PopupTrigger } from '../types';
import { POPUP_DEFAULTS, isValidPopupHash, normalizePopupHash, urlWithHash } from './popup-hash';

/*
 * The run-time half of the pop-up helpers (hash match, "Open pop-up" navigation, open and close triggers, the dialog's CSS
 * variables, the swipe tracker). Only the `popup` chunk imports it; the config tests the card needs are in popup.ts, the
 * hash helpers the editor shares in popup-hash.ts.
 */

/** location.hash ('#kitchen', possibly percent-encoded) names this pop-up (case-sensitive). */
export function hashMatches(locationHash: string, hash: string | undefined): boolean {
  if (!hash || !locationHash || locationHash.length < 2) return false;
  let value = locationHash.slice(1);
  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep the raw value */
  }
  return value === hash;
}


/**
 * Open the pop-up `id` the way HA's navigate action does: push `#id` onto the current URL and fire
 * `location-changed`, so it works across cards (and with HA's own navigate to `#id`).
 */
export function navigateToPopup(rawId: unknown): boolean {
  const id = normalizePopupHash(rawId);
  if (!isValidPopupHash(id)) return false;
  if (window.location.hash === `#${id}`) {
    // already the URL (e.g. its pop-up was closed by a trigger): let the cards look again
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: true } }));
    return true;
  }
  history.pushState(history.state, '', urlWithHash(window.location.href, id));
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
  return true;
}

/**
 * The trigger entity changed into the trigger state (or, without a state, changed state at all).
 * Attribute-only updates and the first hass (no old state) never fire.
 */
export function triggerFired(
  trigger: PopupTrigger | undefined,
  oldStates: Record<string, HassEntity> | undefined,
  newStates: Record<string, HassEntity> | undefined,
): boolean {
  const entity = trigger?.entity?.trim();
  if (!entity || !oldStates || !newStates) return false;
  const before = oldStates[entity]?.state;
  const after = newStates[entity]?.state;
  if (before === undefined || after === undefined || before === after) return false;
  const want = trigger?.state?.trim();
  return want ? after === want : true;
}

/** A CSS length: numbers are px, strings are kept (trimmed); invalid → undefined. */
function cssLength(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return `${v}px`;
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s || /[;{}<>]/.test(s)) return undefined;
  return /^-?\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
}

/** Backdrop darkness 0..1 (accepts 0..100 as percent). */
export function backdropOpacity(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) return POPUP_DEFAULTS.backdrop_opacity;
  const x = n > 1 ? n / 100 : n;
  return Math.min(1, Math.max(0, x));
}

/** Seconds of inactivity before auto close (0: off). */
export function autoCloseMs(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.round(n * 1000) : 0;
}

export function popupStyle(popup: PopupConfig | undefined): 'sheet' | 'dialog' {
  return popup?.style === 'dialog' ? 'dialog' : 'sheet';
}

/** CSS custom properties of the pop-up dialog element (the surface and backdrop read them). */
export function popupStyleVars(popup: PopupConfig | undefined, cardRadius?: string): string {
  const parts = [
    `--mc-popup-width: ${cssLength(popup?.width) ?? POPUP_DEFAULTS.width}`,
    `--mc-popup-max-height: ${cssLength(popup?.max_height) ?? POPUP_DEFAULTS.max_height}`,
    `--mc-popup-blur: ${cssLength(popup?.backdrop_blur) ?? POPUP_DEFAULTS.backdrop_blur}`,
    `--mc-popup-backdrop-opacity: ${backdropOpacity(popup?.backdrop_opacity)}`,
  ];
  // the card's own corner radius (one value) shapes the surface; a shorthand keeps the default
  const radius = cssLength(cardRadius);
  if (radius && !/\s/.test(radius)) parts.push(`--mc-popup-radius: ${radius}`);
  return parts.join('; ');
}

/** Distance (px) or share of the sheet height a downward swipe needs to close it. */
export const SWIPE_CLOSE_PX = 80;
export const SWIPE_CLOSE_SHARE = 0.25;
/** A quick flick closes from this distance on when faster than SWIPE_FLICK_SPEED (px/ms). */
export const SWIPE_FLICK_PX = 24;
export const SWIPE_FLICK_SPEED = 0.6;

/** Follows one swipe on the sheet handle: the offset the sheet follows, and whether letting go closes. */
export class SwipeTracker {
  private _startY = 0;
  private _startT = 0;
  private _active = false;
  offset = 0;

  get active(): boolean {
    return this._active;
  }

  start(y: number, time: number): void {
    this._active = true;
    this._startY = y;
    this._startT = time;
    this.offset = 0;
  }

  /** The sheet's downward offset for pointer `y` (never above its resting place). */
  move(y: number): number {
    if (!this._active) return 0;
    this.offset = Math.max(0, y - this._startY);
    return this.offset;
  }

  /** Let go at `y`: true when the sheet should close (far enough, or a quick flick down). */
  end(y: number, time: number, sheetHeight: number): boolean {
    if (!this._active) return false;
    const offset = this.move(y);
    this._active = false;
    this.offset = 0;
    const speed = offset / Math.max(1, time - this._startT);
    const distance = sheetHeight > 0 ? Math.min(SWIPE_CLOSE_PX, sheetHeight * SWIPE_CLOSE_SHARE) : SWIPE_CLOSE_PX;
    return offset >= distance || (offset >= SWIPE_FLICK_PX && speed >= SWIPE_FLICK_SPEED);
  }

  cancel(): void {
    this._active = false;
    this.offset = 0;
  }
}
