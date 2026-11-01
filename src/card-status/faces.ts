import { css, html, type TemplateResult } from 'lit';
import type { StatusFace } from '../contracts/card-status';
import type { HomeAssistant } from '../types';
import { t } from './i18n';
import { formatWhen } from './time';

// The status badge: a word and an icon in the top-left corner, no layout effect; a tap opens the full sentence.

const SHAPES: Record<StatusFace['kind'], string> = {
  lost: 'M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z',
  back: 'M21 7 9 19l-5.5-5.5 1.4-1.4L9 16.2 19.6 5.6z',
  stale: 'M12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8 8 8 0 0 0-8 8 8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10 10 10 0 0 1-10 10C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.3l4.5 2.6-.8 1.3L11 13V7z',
};

/** Overlay rules; the card adopts them with the chunk. The box stays empty (and zero-sized) until a face shows. */
export const statusStyles = css`
.mc-status{position:absolute;inset-block-start:var(--mc-shape-it,0px);left:var(--mc-shape-il,0px);z-index:7;margin:0;padding:0;max-inline-size:calc(100% - var(--mc-shape-il,0px));pointer-events:none}
ha-card:has(.mc-pause[data-corner=top-left]) .mc-status{left:calc(40px + var(--mc-shape-il,0px))}
.mc-status-badge{display:flex;align-items:center;box-sizing:border-box;min-block-size:44px;min-inline-size:44px;max-inline-size:100%;margin:0;padding:0 0 0 6px;border:0;background:none;color:inherit;font:inherit;cursor:pointer;pointer-events:auto}
span.mc-status-badge{pointer-events:none;cursor:default}
.mc-status-pill{display:flex;align-items:center;gap:var(--ha-space-1,4px);box-sizing:border-box;min-inline-size:0;max-inline-size:100%;padding:2px var(--ha-space-2,8px);background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);border:1px solid var(--divider-color,transparent);border-radius:var(--ha-border-radius-md,8px);font-size:var(--ha-font-size-s,.875rem);line-height:1.3}
.mc-status-icon{flex:none;inline-size:1.15em;block-size:1.15em;fill:currentColor}
.mc-status-word{min-inline-size:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.mc-status-badge:focus-visible{outline:0}
.mc-status-badge:focus-visible .mc-status-pill{outline:2px solid var(--primary-color,currentColor);outline-offset:2px}
.mc-status-text{position:absolute;inline-size:1px;block-size:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.mc-status[data-open] .mc-status-text{position:static;inline-size:fit-content;block-size:auto;max-inline-size:calc(100% - 12px);margin:0 0 0 6px;padding:var(--ha-space-2,8px) var(--ha-space-3,12px);box-sizing:border-box;clip-path:none;overflow:visible;white-space:normal;overflow-wrap:anywhere;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);border:1px solid var(--divider-color,transparent);border-radius:var(--ha-border-radius-md,8px);font-size:var(--ha-font-size-s,.875rem);line-height:1.3;pointer-events:auto}
@media (forced-colors:active){.mc-status-pill,.mc-status[data-open] .mc-status-text{background:Canvas;color:CanvasText;border-color:CanvasText}}
`;

/** The sentence of a face; the time goes in as text. */
export function faceText(face: StatusFace, hass: HomeAssistant): string {
  if (face.kind === 'lost') return t('card-status.faces.connection-lost-at-time', { time: formatWhen(face.since, hass) });
  if (face.kind === 'back') return t('card-status.faces.reconnected');
  return t('card-status.faces.not-updated-since-time', { time: formatWhen(face.since, hass) });
}

const word = (kind: StatusFace['kind']): string =>
  kind === 'lost' ? t('card-status.faces.connection-lost') : kind === 'back' ? t('card-status.faces.reconnected') : t('card-status.faces.not-updated');

/** The badge (a button except for "Reconnected") and the live region with the full sentence, present from the start so each change is announced once. */
export function statusOverlay(face: StatusFace | undefined, hass: HomeAssistant | undefined, open = false, toggle?: () => void): TemplateResult {
  if (!face || !hass) return html`<div class="mc-status"><div role="status" aria-live="polite"></div></div>`;
  const pill = html`<span class="mc-status-pill"><svg class="mc-status-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${SHAPES[face.kind]}></path></svg><span class="mc-status-word">${word(face.kind)}</span></span>`;
  const live = html`<div role="status" aria-live="polite"><span class="mc-status-text" id="mc-status-text">${faceText(face, hass)}</span></div>`;
  if (face.kind === 'back') return html`<div class="mc-status"><span class="mc-status-badge">${pill}</span>${live}</div>`;
  return html`<div class="mc-status" ?data-open=${open}><button type="button" class="mc-status-badge" aria-expanded=${open ? 'true' : 'false'} aria-controls="mc-status-text" @click=${toggle}>${pill}</button>${live}</div>`;
}
