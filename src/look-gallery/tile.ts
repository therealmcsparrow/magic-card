import { html, nothing, type TemplateResult } from 'lit';
import { GALLERY_REPORT_URL } from '../contracts/look-index';
import { glyph } from '../ui-kit';
import { t } from './i18n';
import type { GalleryTile } from './store';

// Tiles of the gallery grid, the refused list and the fixed reason tables. Everything the index says is shown as text.

export type TileReason = 'L-HASH' | 'L-GRAMMAR' | 'L-META' | 'L-FETCH' | 'L-PARSE';
export type IndexReason = 'I-SIG' | 'I-VER' | 'I-ROLL' | 'C-TAMPER' | 'N-FETCH' | 'I-PARSE';

/** The short code shown for a refused look; anything unknown counts as a parse refusal. */
export const tileReason = (code: string | null): TileReason =>
  code === 'look_hash' ? 'L-HASH' : code === 'look_grammar' ? 'L-GRAMMAR' : code === 'look_meta' ? 'L-META' : code === 'look_fetch' ? 'L-FETCH' : 'L-PARSE';

/** The short code shown for a refused index or cache. */
export const indexReason = (code: string | null): IndexReason =>
  code === 'index_signature'
    ? 'I-SIG'
    : code === 'index_version'
      ? 'I-VER'
      : code === 'index_rollback'
        ? 'I-ROLL'
        : code === 'cache_discarded'
          ? 'C-TAMPER'
          : code === 'index_fetch'
            ? 'N-FETCH'
            : 'I-PARSE';

export const reasonText = (r: TileReason | IndexReason): string => {
  switch (r) {
    case 'L-HASH':
      return t('look-gallery.reason.l-hash');
    case 'L-GRAMMAR':
      return t('look-gallery.reason.l-grammar');
    case 'L-META':
      return t('look-gallery.reason.l-meta');
    case 'L-FETCH':
      return t('look-gallery.reason.l-fetch');
    case 'L-PARSE':
      return t('look-gallery.reason.l-parse');
    case 'I-SIG':
      return t('look-gallery.reason.i-sig');
    case 'I-VER':
      return t('look-gallery.reason.i-ver');
    case 'I-ROLL':
      return t('look-gallery.reason.i-roll');
    case 'C-TAMPER':
      return t('look-gallery.reason.c-tamper');
    case 'N-FETCH':
      return t('look-gallery.reason.n-fetch');
    default:
      return t('look-gallery.reason.i-parse');
  }
};

export interface TileView {
  selected: boolean;
  tabindex: number;
  onPick: () => void;
}

export const tileTemplate = (tile: GalleryTile, v: TileView): TemplateResult => {
  const label =
    t('look-gallery.tile.label', { name: tile.name, author: tile.author, spdx: tile.licence }) +
    (tile.fonts.length ? t('look-gallery.tile.label-font') : '') +
    (tile.animated ? t('look-gallery.tile.label-anim') : '');
  // an image only from a preview that passed its check (blob URL); anything else is the no-image state
  const img = tile.previewUrl && tile.previewUrl.startsWith('blob:') ? tile.previewUrl : null;
  return html`<div
    class="tile"
    role="radio"
    aria-checked=${v.selected ? 'true' : 'false'}
    aria-label=${label}
    tabindex=${v.tabindex}
    data-id=${tile.id}
    @click=${v.onPick}
  >
    <div class="thumb">${img ? html`<img src=${img} alt="" />` : html`<span class="initial" aria-hidden="true">${Array.from(tile.name)[0] ?? ''}</span>`}</div>
    <span class="name">${tile.name}</span>
    <span class="meta">${t('look-gallery.tile.by', { author: tile.author })}</span>
    <span class="meta">${t('look-gallery.tile.licence', { spdx: tile.licence })}</span>
    <div class="chips">
      <span class="pill">${t('look-gallery.tile.chip')}</span>
      ${tile.fonts.length ? html`<span class="pill">${t('look-gallery.tile.font')}</span>` : nothing}
      ${tile.animated ? html`<span class="pill warn">${t('look-gallery.tile.animated')}</span>` : nothing}
    </div>
    ${v.selected ? html`<span class="check" data-check>${glyph('check', 14)}</span>` : nothing}
  </div>`;
};

export const refusedTemplate = (refused: GalleryTile[]): TemplateResult | typeof nothing =>
  refused.length
    ? html`<section class="refused">
        <h3>${t('look-gallery.tile.refused-section', { count: refused.length })}</h3>
        <ul>
          ${refused.map((r) => {
            const reason = tileReason(r.code);
            return html`<li>
              <span class="name">${r.name}</span>
              <span class="reason">${glyph('close', 16)}<span>${reasonText(reason)}</span></span>
              <span class="code">${t('look-gallery.tile.code', { code: reason })}</span>
              <a
                class="report"
                href=${`${GALLERY_REPORT_URL}&title=${encodeURIComponent(`Look ${r.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label=${t('look-gallery.tile.report-label', { name: r.name })}
                >${t('look-gallery.tile.report')}</a
              >
            </li>`;
          })}
        </ul>
      </section>`
    : nothing;
