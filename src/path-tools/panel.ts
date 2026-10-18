/*
 * The tool panel template (contract path-tools 1.0.0). The SVG editor renders it in its inspector and owns the
 * state, the debounced preview and the dashed preview drawing; this only turns a state into markup.
 */
import { html, nothing, type TemplateResult } from 'lit';
import { OFFSET_MAX_ABS, OFFSET_MIN_ABS, SIMPLIFY_DEFAULT, SIMPLIFY_MAX, SIMPLIFY_MIN } from '../contracts/path-tools';
import type { PanelActions, PanelState } from '../contracts/path-tools';
import { REFUSALS, T } from './strings';

const num = (e: Event): number => Number((e.target as HTMLInputElement).value);

function joins(s: PanelState, a: PanelActions): TemplateResult {
  const items: Array<['round' | 'miter', string]> = [
    ['round', T.round],
    ['miter', T.miter],
  ];
  const cur = s.join ?? 'round';
  return html`<div class="f" role="group" aria-labelledby="pt-joins">
    <span id="pt-joins">${T.joins}</span>
    <div class="seg" role="radiogroup" aria-labelledby="pt-joins">
      ${items.map(
        ([k, text]) =>
          html`<button type="button" role="radio" aria-checked=${k === cur ? 'true' : 'false'} tabindex=${k === cur ? 0 : -1} @click=${() => a.change({ join: k })} @keydown=${(e: KeyboardEvent) => {
            const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
            if (!d) return;
            e.preventDefault();
            const i = (items.findIndex((x) => x[0] === k) + d + items.length) % items.length;
            a.change({ join: items[i][0] });
            (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('button')[i]?.focus();
          }}>${text}</button>`,
      )}
    </div>
  </div>`;
}

function fields(s: PanelState, a: PanelActions): TemplateResult | typeof nothing {
  if (s.tool === 'offset')
    return html`<label class="f"><span>${T.amount}</span
        ><input type="number" inputmode="decimal" step="0.1" min=${-OFFSET_MAX_ABS} max=${OFFSET_MAX_ABS} data-field="amount" aria-describedby="pt-amount-h" .value=${String(s.amount ?? 1)} @input=${(e: Event) => {
          const v = num(e);
          if (Number.isFinite(v)) a.change({ amount: v });
        }} /><small id="pt-amount-h">${T.amountHelp} ${OFFSET_MIN_ABS} to ${OFFSET_MAX_ABS}.</small></label
      >${joins(s, a)}`;
  if (s.tool === 'simplify') {
    const v = s.tolerance ?? SIMPLIFY_DEFAULT;
    return html`<label class="f"><span>${T.tolerance}</span
        ><span class="row-u"
          ><input type="range" min=${SIMPLIFY_MIN} max=${SIMPLIFY_MAX} step="0.01" data-field="tolerance" aria-describedby="pt-tol-h" .value=${String(v)} @input=${(e: Event) => a.change({ tolerance: num(e) })} /><output>${v.toFixed(2)}</output></span
        ><small id="pt-tol-h">${T.toleranceHelp}</small></label
      ><label class="switch"><input type="checkbox" data-field="smooth" .checked=${!!s.smooth} @change=${(e: Event) => a.change({ smooth: (e.target as HTMLInputElement).checked })} /><span>${T.smooth}</span></label>`;
  }
  return nothing;
}

export function renderPanel(s: PanelState, a: PanelActions): TemplateResult {
  const why = s.busy ? T.working : s.refusal ? REFUSALS[s.refusal] : s.before === undefined || s.after === undefined ? T.noPreview : '';
  const outcome = why || T.outcome(s.before ?? 0, s.after ?? 0);
  const blocked = !!why;
  return html`<section class="pt-panel" aria-labelledby="pt-title">
    <h3 id="pt-title">${T.title[s.tool]}</h3>
    <p class="pt-help">${T.help[s.tool]}</p>
    ${fields(s, a)}
    <p id="pt-outcome" class="pt-outcome" role="status" aria-live="polite" data-refusal=${s.refusal ?? nothing}>${outcome}</p>
    <div class="pt-actions">
      <button type="button" class="b primary" data-act="apply" aria-disabled=${blocked ? 'true' : nothing} aria-describedby="pt-outcome" @click=${() => !blocked && a.apply()}><span>${T.apply}</span></button>
      <button type="button" class="b" data-act="cancel" @click=${() => a.cancel()}><span>${T.cancel}</span></button>
    </div>
  </section>`;
}
