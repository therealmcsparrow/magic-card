/*
 * The tool panel template (contract path-tools 1.0.0). The SVG editor renders it in its inspector and owns the
 * state, the debounced preview and the dashed preview drawing; this only turns a state into markup. The controls are
 * the ui kit's templates (the host element carries the kit's CSS), so they look like every other editor screen.
 */
import { html, nothing, type TemplateResult } from 'lit';
import { OFFSET_MAX_ABS, OFFSET_MIN_ABS, SIMPLIFY_DEFAULT, SIMPLIFY_MAX, SIMPLIFY_MIN } from '../contracts/path-tools';
import type { PanelActions, PanelState } from '../contracts/path-tools';
import { field, sectionHead, seg, slider, switchRow } from '../ui-kit/templates';
import { REFUSALS, T } from './strings';

const num = (e: Event): number => Number((e.target as HTMLInputElement).value);

function joins(s: PanelState, a: PanelActions): TemplateResult {
  return html`<div class="field">
    <div class="field-head"><span class="lbl" id="pt-joins">${T.joins}</span></div>
    ${seg({
      role: 'radiogroup',
      label: T.joins,
      value: s.join ?? 'round',
      items: [
        { value: 'round', label: T.round },
        { value: 'miter', label: T.miter },
      ],
      onChange: (join) => a.change({ join }),
    })}
  </div>`;
}

function fields(s: PanelState, a: PanelActions): TemplateResult | typeof nothing {
  if (s.tool === 'offset')
    return html`${field({
        id: 'pt-amount',
        label: T.amount,
        help: `${T.amountHelp} ${OFFSET_MIN_ABS} to ${OFFSET_MAX_ABS}.`,
        control: html`<input id="pt-amount" class="input" type="number" inputmode="decimal" step="0.1" min=${-OFFSET_MAX_ABS} max=${OFFSET_MAX_ABS} data-field="amount" aria-describedby="pt-amount-help" .value=${String(s.amount ?? 1)} @input=${(e: Event) => {
          const v = num(e);
          if (Number.isFinite(v)) a.change({ amount: v });
        }} />`,
      })}${joins(s, a)}`;
  if (s.tool === 'simplify') {
    const v = s.tolerance ?? SIMPLIFY_DEFAULT;
    return html`${slider({ id: 'pt-tolerance', label: T.tolerance, min: SIMPLIFY_MIN, max: SIMPLIFY_MAX, step: 0.01, value: v, valueText: v.toFixed(2), onInput: (x) => a.change({ tolerance: x }), onChange: (x) => a.change({ tolerance: x }) })}
      <p class="help">${T.toleranceHelp}</p>
      ${switchRow({ id: 'pt-smooth', label: T.smooth, checked: !!s.smooth, onChange: (smooth) => a.change({ smooth }) })}`;
  }
  return nothing;
}

export function renderPanel(s: PanelState, a: PanelActions): TemplateResult {
  const why = s.busy ? T.working : s.refusal ? REFUSALS[s.refusal] : s.before === undefined || s.after === undefined ? T.noPreview : '';
  const outcome = why || T.outcome(s.before ?? 0, s.after ?? 0);
  const blocked = !!why;
  return html`<section class="group pt-panel" aria-label=${T.title[s.tool]}>
    ${sectionHead({ title: T.title[s.tool], level: 3 })}
    <p class="help">${T.help[s.tool]}</p>
    ${fields(s, a)}
    <p id="pt-outcome" class="help" role="status" aria-live="polite" data-refusal=${s.refusal ?? nothing}>${outcome}</p>
    <div class="acts">
      <button type="button" class="btn btn-primary btn-sm" data-act="apply" aria-disabled=${blocked ? 'true' : nothing} aria-describedby="pt-outcome" @click=${() => !blocked && a.apply()}>${T.apply}</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="cancel" @click=${() => a.cancel()}>${T.cancel}</button>
    </div>
  </section>`;
}
