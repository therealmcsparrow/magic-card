import { css, html, nothing, type TemplateResult } from 'lit';
import type { StatusFace } from '../contracts/card-status';
import type { HomeAssistant } from '../types';
import { t } from './i18n';
import { formatWhen } from './time';

// The status strip: one still sentence in a compact pill on the bottom edge, with no layout effect; it fades out while a control inside the card has focus.

/** Overlay rules; the card adopts them with the chunk. The box stays empty (and zero-sized) until a face shows. */
export const statusStyles = css`
.mc-status{position:absolute;inset-block-end:0;inset-inline:0;z-index:7;margin:0;padding:0;display:flex;justify-content:flex-end;pointer-events:none}
.mc-status-text{display:block;inline-size:fit-content;max-inline-size:100%;box-sizing:border-box;padding:var(--ha-space-1,4px) var(--ha-space-3,12px);background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);font-size:var(--ha-font-size-s,.875rem);line-height:1.3;overflow-wrap:anywhere;border-start-start-radius:var(--ha-border-radius-md,8px);border-end-end-radius:var(--ha-card-border-radius,12px);border-block-start:1px solid var(--divider-color,transparent)}
ha-card:focus-within .mc-status-text{opacity:0}
@media (forced-colors:active){.mc-status-text{background:Canvas;color:CanvasText;border-block-start-color:CanvasText}}
`;

/** The sentence of a face; the time goes in as text. */
export function faceText(face: StatusFace, hass: HomeAssistant): string {
  if (face.kind === 'lost') return t('card-status.faces.connection-lost-at-time', { time: formatWhen(face.since, hass) });
  if (face.kind === 'back') return t('card-status.faces.reconnected');
  return t('card-status.faces.not-updated-since-time', { time: formatWhen(face.since, hass) });
}

/** The live region, present from the start so each change is announced once. */
export const statusOverlay = (face: StatusFace | undefined, hass: HomeAssistant | undefined): TemplateResult =>
  html`<div class="mc-status" role="status" aria-live="polite">${face && hass ? html`<span class="mc-status-text">${faceText(face, hass)}</span>` : nothing}</div>`;
