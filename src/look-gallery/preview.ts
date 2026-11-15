import { html, nothing, type TemplateResult } from 'lit';
import type { LookApplyArea, LookApplySummary } from '../contracts/look-grammar';
import type { HomeAssistant, MagicCardConfig } from '../types';
import { applyLook } from '../look-kit/index';
import { loadConfigFonts } from '../utils/google-fonts';
import { inertHass } from '../utils/inert-hass';
import { t } from './i18n';
import type { GalleryTile } from './store';

// The preview of one look: a separate, inert magic-card built from applyLook(...).config, and the bar under it.

export interface Preview {
  tile: GalleryTile;
  config: MagicCardConfig;
  summary: LookApplySummary;
  paused: boolean;
  open: boolean;
}

const matches = (query: string): boolean => typeof matchMedia === 'function' && matchMedia(query).matches;

/** Applies the tile's look to a copy of the config; null when the tile has no parsed look. */
export const buildPreview = (config: MagicCardConfig, tile: GalleryTile): Preview | null => {
  if (!tile.look) return null;
  const applied = applyLook(config, tile.look);
  return {
    tile,
    config: applied.config,
    summary: applied.summary,
    paused: tile.animated && matches('(prefers-reduced-motion: reduce)'),
    open: !matches('(max-width: 599px)'),
  };
};

type PreviewCard = HTMLElement & { setConfig?: (c: MagicCardConfig) => void; hass?: HomeAssistant; previewPaused?: boolean };
const shown = new WeakMap<Element, Preview['config']>();

/** Hands the rendered card its config, the inert hass and the pause state; fonts load here, on preview only. */
export const mountPreview = (root: ParentNode, p: Preview, hass: HomeAssistant): void => {
  const card = root.querySelector('.card-wrap magic-card') as PreviewCard | null;
  if (!card) return;
  if (shown.get(card) !== p.config) {
    shown.set(card, p.config);
    if (typeof card.setConfig === 'function') {
      try {
        card.setConfig(p.config);
      } catch {
        // an unreadable config leaves the card empty; Keep still applies the same output
      }
    }
    loadConfigFonts(p.config);
  }
  card.hass = inertHass(hass);
  card.previewPaused = p.paused;
};

/** Events a card raises to reach Home Assistant; the preview never lets one out. */
const stop = (e: Event): void => e.stopPropagation();

export const stageTemplate = (p: Preview): TemplateResult =>
  html`<div class="stage"><div
    class="card-wrap"
    role="img"
    aria-label=${p.tile.name}
    style="pointer-events:none"
    @hass-action=${stop}
    @hass-more-info=${stop}
    @hass-toggle-menu=${stop}
    @location-changed=${stop}
  ><magic-card inert></magic-card></div></div>`;

const settingName = (n: string): string => n.replace(/^design\./, '').replace(/_/g, ' ');

const areaName = (a: LookApplyArea): string =>
  a.target === 'card' ? t('look-gallery.preview.area-card') : t('look-gallery.preview.area-type', { type: a.target });

export interface BarView {
  onDetails: () => void;
  onPlay: () => void;
  onCancel: () => void;
  onKeep: () => void;
}

export const barTemplate = (p: Preview, v: BarView): TemplateResult => html`<div class="bar" role="region" aria-label=${t('look-gallery.preview.region')}>
  <p class="status" role="status">${t('look-gallery.preview.status', { name: p.tile.name })}</p>
  ${p.tile.animated
    ? html`<div class="chips"><span class="pill warn">${t('look-gallery.tile.animated')}</span><span>${t('look-gallery.preview.anim-warn')}</span></div>`
    : nothing}
  <div class="buttons">
    <button type="button" class="btn grow" aria-expanded=${p.open ? 'true' : 'false'} aria-controls="look-details" @click=${v.onDetails}>${t('look-gallery.preview.details')}</button>
  </div>
  <div class="details" id="look-details" ?hidden=${!p.open}>
    <p>${t('look-gallery.preview.summary')}</p>
    <h4>${t('look-gallery.preview.changes-title')}</h4>
    <p>${t('look-gallery.preview.changes-count', { count: p.summary.count })}</p>
    <ul>
      ${p.summary.areas.map(
        (a) => html`<li>
          ${areaName(a)}
          <ul>
            ${a.set.length ? html`<li><b>${t('look-gallery.preview.set')}</b> ${a.set.map(settingName).join(', ')}</li>` : nothing}
            ${a.cleared.length ? html`<li><b>${t('look-gallery.preview.cleared')}</b> ${a.cleared.map(settingName).join(', ')}</li>` : nothing}
          </ul>
        </li>`,
      )}
    </ul>
    <p>${t('look-gallery.preview.changes-note')}</p>
    ${p.tile.fonts.length ? html`<p>${t('look-gallery.preview.font-ok', { font: p.tile.fonts.join(', ') })}</p>` : nothing}
  </div>
  <div class="buttons">
    ${p.tile.animated
      ? html`<button type="button" class="btn grow" @click=${v.onPlay}>${p.paused ? t('look-gallery.preview.play') : t('look-gallery.preview.pause')}</button>`
      : nothing}
    <button type="button" class="btn" @click=${v.onCancel}>${t('look-gallery.preview.cancel')}</button>
    <button type="button" class="btn btn-primary" @click=${v.onKeep}>${t('look-gallery.preview.keep')}</button>
  </div>
</div>`;
