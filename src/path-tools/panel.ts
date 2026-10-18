/*
 * The tool panel template (contract path-tools 1.0.0). The SVG editor renders it in its inspector and owns the
 * state, the debounced preview and the dashed preview drawing; this only turns a state into markup. The controls are
 * the ui kit's templates (the host element carries the kit's CSS), so they look like every other editor screen.
 */
import { html, nothing, type TemplateResult } from 'lit';
import { OFFSET_MAX_ABS, OFFSET_MIN_ABS, SIMPLIFY_DEFAULT, SIMPLIFY_MAX, SIMPLIFY_MIN } from '../contracts/path-tools';
import type { PanelActions, PanelState } from '../contracts/path-tools';
import { field, sectionHead, seg, slider, switchRow } from '../ui-kit/templates';
import { t } from './i18n';
import { HELP, REFUSALS, TITLE } from './names';

const num = (e: Event): number => Number((e.target as HTMLInputElement).value);

function joins(s: PanelState, a: PanelActions): TemplateResult {
  return html`<div class="field">
    <div class="field-head"><span class="lbl" id="pt-joins">${t('Corners')}</span></div>
    ${seg({
      role: 'radiogroup',
      label: t('Corners'),
      value: s.join ?? 'round',
      items: [
        { value: 'round', label: t('Round') },
        { value: 'miter', label: t('Sharp') },
      ],
      onChange: (join) => a.change({ join }),
    })}
  </div>`;
}

function fields(s: PanelState, a: PanelActions): TemplateResult | typeof nothing {
  if (s.tool === 'offset')
    return html`${field({
        id: 'pt-amount',
        label: t('Amount'),
        help: t('Positive grows the shape, negative shrinks it. From {min} to {max}.', { min: OFFSET_MIN_ABS, max: OFFSET_MAX_ABS }),
        control: html`<input id="pt-amount" class="input" type="number" inputmode="decimal" step="0.1" min=${-OFFSET_MAX_ABS} max=${OFFSET_MAX_ABS} aria-describedby="pt-amount-help" .value=${String(s.amount ?? 1)} @input=${(e: Event) => {
          const v = num(e);
          if (Number.isFinite(v)) a.change({ amount: v });
        }} />`,
      })}${joins(s, a)}`;
  if (s.tool === 'simplify') {
    const v = s.tolerance ?? SIMPLIFY_DEFAULT;
    return html`${slider({ id: 'pt-tolerance', label: t('Detail kept'), min: SIMPLIFY_MIN, max: SIMPLIFY_MAX, step: 0.01, value: v, valueText: v.toFixed(2), onInput: (x) => a.change({ tolerance: x }), onChange: (x) => a.change({ tolerance: x }) })}
      <p class="help">${t('A higher value drops more points.')}</p>
      ${switchRow({ id: 'pt-smooth', label: t('Smooth corners'), checked: !!s.smooth, onChange: (smooth) => a.change({ smooth }) })}`;
  }
  return nothing;
}

export function renderPanel(s: PanelState, a: PanelActions): TemplateResult {
  const why = s.busy ? t('Working on it') : s.refusal ? t(REFUSALS[s.refusal]) : s.before === undefined || s.after === undefined ? t('Nothing to preview yet.') : '';
  const outcome = why || t('{before, plural, one {# point} other {# points}} now, {after, plural, one {# point} other {# points}} after', { before: s.before ?? 0, after: s.after ?? 0 });
  const blocked = !!why;
  return html`<section class="group pt-panel" aria-label=${t(TITLE[s.tool])}>
    ${sectionHead({ title: t(TITLE[s.tool]), level: 3 })}
    <p class="help">${t(HELP[s.tool])}</p>
    ${fields(s, a)}
    <p id="pt-outcome" class="help" role="status">${outcome}</p>
    <div class="acts">
      <button type="button" class="btn btn-primary btn-sm" data-act="apply" aria-disabled=${blocked ? 'true' : nothing} aria-describedby="pt-outcome" @click=${() => !blocked && a.apply()}>${t('Apply')}</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="cancel" @click=${() => a.cancel()}>${t('Cancel')}</button>
    </div>
  </section>`;
}
