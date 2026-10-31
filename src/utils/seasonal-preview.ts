// The editor's "Preview date" for seasonal scenes: a date the cards in an editor preview resolve
// auto with instead of today. Never part of the config; cards listen for SEASONAL_PREVIEW_EVENT.

import { SEASONAL_PREVIEW_EVENT } from './seasonal.needs';

export { SEASONAL_PREVIEW_EVENT };

let previewDate: Date | undefined;

export function seasonalPreviewDate(): Date | undefined {
  return previewDate;
}

/** Set (or clear with undefined) the preview date and tell the cards. */
export function setSeasonalPreviewDate(date: Date | undefined): void {
  const next = date && Number.isFinite(date.getTime()) ? new Date(date.getTime()) : undefined;
  if ((next?.getTime() ?? null) === (previewDate?.getTime() ?? null)) return;
  previewDate = next;
  window.dispatchEvent(new CustomEvent(SEASONAL_PREVIEW_EVENT));
}
