import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { layoutWeights } from '../state/layouts';
import { t } from '../i18n';

// A row's column layout drawn as bars (`.layout-glyph`): one bar per column at its share of the row.
export function renderLayoutGlyph(weights: readonly number[], active?: number): TemplateResult {
  const cols = weights.map((w) => `${Number.isFinite(w) && w > 0 ? +w.toFixed(3) : 1}fr`).join(' ');
  // `active`: that column's bar is marked (class "on"), e.g. a row module's column in the tree.
  return html`<span class="layout-glyph" aria-hidden="true" style=${styleMap({ gridTemplateColumns: cols })}>${weights.map((_, i) =>
    (i === active ? html`<i class="on"></i>` : html`<i></i>`))}</span>`;
}

/** Weights of a preset layout ("2-1") for `colCount` columns (equal when it doesn't fit). */
export function presetWeights(layout: string, colCount?: number): number[] {
  const count = colCount ?? Math.max(layout.split('-').length, 1);
  return layoutWeights(layout || '1', count);
}

/** Accessible name of a layout: "1 column", "2 columns, 2 to 1". */
export function layoutName(weights: readonly number[]): string {
  const n = weights.length;
  if (n <= 1) return t('card-editor.layout-glyph.1-column');
  const ratio = weights.map((w) => String(+w.toFixed(2))).reduce((acc, w) => t('card-editor.layout-glyph.from-to-to', { from: acc, to: w }));
  return t('card-editor.layout-glyph.n-columns-ratio', { n, ratio });
}
