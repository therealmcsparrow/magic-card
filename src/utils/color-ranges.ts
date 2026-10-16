import { html, nothing, TemplateResult } from 'lit';
import type { ColorRange } from '../types';
import type { SyncContext } from './sync-path';
import { renderColorField, renderFieldHead, renderNumberField } from './form-utils';

/**
 * Colour for `value` from a list of ranges: the range with the highest `from` at or below the value
 * wins (a range with a `to` from older configs only applies up to it). Undefined when none applies.
 */
export function rangeColor(value: number | undefined, ranges: ColorRange[] | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value) || !Array.isArray(ranges)) return undefined;
  let best: ColorRange | undefined;
  for (const r of ranges) {
    if (!r || typeof r.color !== 'string' || !r.color) continue;
    const from = Number(r.from);
    if (!Number.isFinite(from) || value < from) continue;
    if (r.to !== undefined && r.to !== null && Number.isFinite(Number(r.to)) && value > Number(r.to)) continue;
    if (!best || from > Number(best.from)) best = r;
  }
  return best?.color;
}

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
                <span class="n">Range ${i + 1} <span class="sub">· from ${r.from}</span></span>
                <button
                  type="button"
                  class="icon-btn sm danger"
                  aria-label="Delete range ${i + 1}"
                  title="Delete range"
                  @click=${() => write(list.filter((_r, j) => j !== i))}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              ${r.to !== undefined && r.to !== null ? html`<p class="help">Ends at ${r.to} (set in YAML).</p>` : nothing}
              <div class="two">
                ${renderNumberField('From', r.from, (v) => update(i, { from: v }))}
                ${renderColorField('Color', r.color, (v) => update(i, { color: v }))}
              </div>
            </div>
          `,
        )}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${add}>
            <ha-icon icon="mdi:plus"></ha-icon>Add range
          </button>
        </div>
      </div>
    </div>
  `;
}
