import type { PopupConfig } from '../types';

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
