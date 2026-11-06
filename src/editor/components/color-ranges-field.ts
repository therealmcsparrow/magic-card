import { html, nothing, TemplateResult } from 'lit';
import type { ColorRange } from '../../types';
import type { SyncContext } from '../../utils/sync-path';
import { renderColorField, renderFieldHead, renderNumberField } from '../../utils/form-utils';
import { t } from '../i18n';

const DEFAULT_COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];

/**
 * Editor for colour ranges (the design system's repeatable-item list): one card per range with
 * From and Color, a delete button, and "Add range" below. A `to` from YAML is kept and noted.
 */
export function renderColorRangesField(
  label: string,
  ranges: ColorRange[] | undefined,
  onChange: (ranges: ColorRange[] | undefined) => void,
  opts: { min?: number; max?: number; help?: string; propertyName?: string; syncCtx?: SyncContext } = {},
): TemplateResult {
  const list = Array.isArray(ranges) ? ranges : [];
  const write = (next: ColorRange[]) => onChange(next.length ? next : undefined);
  const update = (i: number, patch: Partial<ColorRange>) => write(list.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => {
    const last = list.length ? Number(list[list.length - 1].from) : undefined;
    const min = opts.min ?? 0;
    const max = opts.max ?? 100;
    const from = last === undefined || !Number.isFinite(last) ? min : Math.min(max, last + Math.max(1, Math.round((max - min) / 4)));
    write([...list, { from, color: DEFAULT_COLORS[list.length % DEFAULT_COLORS.length] }]);
  };
  return html`
    <div class="mc-field mc-color-ranges">
      ${renderFieldHead(label, opts.propertyName, opts.syncCtx)}
      ${opts.help ? html`<p class="help">${opts.help}</p>` : nothing}
      <div class="range-list">
        ${list.map(
          (r, i) => html`
            <div class="cond">
              <div class="cond-head">
                <span class="n">${t('card-editor.color-ranges-field.range-n', { n: i + 1 })} <span class="sub">· ${t('card-editor.color-ranges-field.from-value', { value: r.from })}</span></span>
                <button
                  type="button"
                  class="icon-btn sm danger"
                  aria-label=${t('card-editor.color-ranges-field.delete-range-n', { n: i + 1 })}
                  title=${t('card-editor.color-ranges-field.delete-range')}
                  @click=${() => write(list.filter((_r, j) => j !== i))}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              ${r.to !== undefined && r.to !== null ? html`<p class="help">${t('card-editor.color-ranges-field.ends-at-value-set-in-yaml', { value: r.to })}</p>` : nothing}
              <div class="two">
                ${renderNumberField(t('card-editor.color-ranges-field.from'), r.from, (v) => update(i, { from: v }))}
                ${renderColorField(t('card-editor.color-ranges-field.colour'), r.color, (v) => update(i, { color: v }))}
              </div>
            </div>
          `,
        )}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${add}>
            <ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.color-ranges-field.add-range')}
          </button>
        </div>
      </div>
    </div>
  `;
}
