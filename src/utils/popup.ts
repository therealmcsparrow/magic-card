import type { PopupConfig } from '../types';

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

/** The card config sets up a pop-up (the `popup` chunk's needs row); total, a throwing getter is false. */
export function wantsPopup(c: unknown): boolean {
  try {
    return isPopupEnabled((c as { popup?: PopupConfig } | null)?.popup);
  } catch {
    return false;
  }
}

/** The valid pop-up ID of a config, if any. */
export function popupHash(popup: PopupConfig | undefined): string | undefined {
  const hash = normalizePopupHash(popup?.hash);
  return isValidPopupHash(hash) ? hash : undefined;
}

/** The current URL with `#hash` (or without any hash when undefined). */
export function urlWithHash(href: string, hash?: string): string {
  const base = href.split('#')[0];
  return hash ? `${base}#${hash}` : base;
}
