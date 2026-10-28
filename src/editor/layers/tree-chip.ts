import { css, html, nothing, type TemplateResult } from 'lit';
import type { LayerAnchor } from '../../contracts/layer-placement';
import type { CardModule } from '../../types';
import { childSlots } from '../../utils/module-path';
import { anchorName } from './anchor-names';
import { t } from '../i18n';
import { isAnchor, layerOf, placementOf } from './placement-model';

/*
 * Structure tree chips. A module put behind others or on top carries a chip
 * with the word always visible (never an icon alone); an overlay adds a 14 px mini 3 x 3 glyph with its
 * anchor dot. The anchor is in the accessible name and a tooltip. Under 280 px the name wraps first, then
 * the glyph hides (container query on the outline host). A container holding layers shows "{n} layers".
 */

const COL = (a: LayerAnchor): number => (a.includes('left') ? 0 : a.includes('right') ? 2 : 1);
const ROW = (a: LayerAnchor): number => (a.includes('top') ? 0 : a.includes('bottom') ? 2 : 1);

function miniGlyph(a: LayerAnchor): TemplateResult {
  return html`<span class="lglyph" aria-hidden="true">${Array.from({ length: 9 }, (_, i) =>
    (i === ROW(a) * 3 + COL(a) ? html`<i class="on"></i>` : html`<i></i>`))}</span>`;
}

/** The chip of a layered module; nothing for a normal module. */
export function renderLayerChip(mod: CardModule): TemplateResult | typeof nothing {
  const p = placementOf(mod);
  if (p === 'flow') return nothing;
  if (p === 'background') {
    return html`<span class="lchip" data-layer="background" title=${t('card-editor.tree-chip.behind-others')}><ha-icon icon="mdi:arrange-send-to-back" aria-hidden="true"></ha-icon>${t('card-editor.tree-chip.behind-others')}</span>`;
  }
  const raw = layerOf(mod).anchor;
  const anchor: LayerAnchor = isAnchor(raw) ? raw : 'top-left';
  const where = anchorName(anchor).toLowerCase();
  return html`<span class="lchip" data-layer="overlay" title=${t('card-editor.tree-chip.on-top-anchor', { anchor: where })}><ha-icon icon="mdi:arrange-bring-to-front" aria-hidden="true"></ha-icon>${t('card-editor.tree-chip.on-top')}${miniGlyph(anchor)}<span class="sr-only">, ${where}</span></span>`;
}

/** Layered modules among a list (one level) or, for a layout module, among all its slots. */
export function countLayers(mods: readonly CardModule[] | undefined, deep = false): number {
  let n = 0;
  for (const m of mods ?? []) {
    if (placementOf(m) !== 'flow') n++;
    if (deep) for (const list of childSlots(m) ?? []) n += countLayers(list, true);
  }
  return n;
}

/** "{n} layers" beside a container's module count; nothing when it holds none. */
export function renderLayerCount(n: number): TemplateResult | typeof nothing {
  if (n <= 0) return nothing;
  return html`<span class="chip is-count lcount">${t('card-editor.tree-chip.n', { n })}</span>`;
}

export const layerChipCss = css`
  .lchip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex: none;
    min-height: 20px;
    padding: 0 8px;
    border: 1px solid var(--mc-field-border);
    border-radius: 9999px;
    background: var(--mc-surface);
    color: var(--mc-text);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    --mdc-icon-size: 14px;
  }
  .lglyph {
    display: inline-grid;
    grid-template-columns: repeat(3, 3px);
    gap: 1px;
    width: 14px;
    height: 14px;
    flex: none;
  }
  .lglyph i {
    border-radius: 1px;
    background: var(--mc-field-border);
  }
  .lglyph i.on {
    background: var(--mc-text);
  }
  .lcount {
    gap: 3px;
  }
  @container mc-outline (max-width: 280px) {
    .lchip .lglyph {
      display: none;
    }
    .lchip {
      padding: 0 6px;
    }
  }
  @media (forced-colors: active) {
    .lchip {
      border-color: CanvasText;
    }
    .lglyph i.on {
      background: CanvasText;
    }
  }
`;
