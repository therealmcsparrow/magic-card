import type { HassEntity, PopupConfig, PopupTrigger } from '../types';

/** A pop-up ID: letters, digits, '-' and '_' (it becomes the URL hash `#id`). */
const POPUP_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

/** Defaults of the pop-up surface and backdrop. */
export const POPUP_DEFAULTS = {
  style: 'sheet' as const,
  width: '600px',
  max_height: '90vh',
  backdrop_blur: '8px',
  backdrop_opacity: 0.4,
  show_close: true,
  auto_close: 0,
};

/** The stored form of a typed pop-up ID: trimmed, without leading '#'. */
export function normalizePopupHash(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().replace(/^#+/, '') : '';
}

export function isValidPopupHash(hash: unknown): hash is string {
  return typeof hash === 'string' && POPUP_ID.test(hash);
}

/** Editor message for an invalid pop-up ID ('' when valid or empty). */
export function popupHashError(raw: unknown): string {
  const hash = normalizePopupHash(raw);
  if (!hash || isValidPopupHash(hash)) return '';
  return 'Use letters, digits, - and _ only (no spaces).';
}

/** The card is a pop-up. */
export function isPopupEnabled(popup: PopupConfig | undefined): popup is PopupConfig {
  return !!popup && typeof popup === 'object' && popup.enabled === true;
}

/** The valid pop-up ID of a config, if any. */
export function popupHash(popup: PopupConfig | undefined): string | undefined {
  const hash = normalizePopupHash(popup?.hash);
  return isValidPopupHash(hash) ? hash : undefined;
}

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

/** The current URL with `#hash` (or without any hash when undefined). */
export function urlWithHash(href: string, hash?: string): string {
  const base = href.split('#')[0];
  return hash ? `${base}#${hash}` : base;
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
