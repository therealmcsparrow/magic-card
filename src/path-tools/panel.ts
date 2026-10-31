/* The tool panel template: turns a state into markup with the ui kit's templates; the SVG editor owns state and preview. */
import { html, nothing, type TemplateResult } from 'lit';
import { OFFSET_MAX_ABS, OFFSET_MIN_ABS, SIMPLIFY_DEFAULT, SIMPLIFY_MAX, SIMPLIFY_MIN } from '../contracts/path-tools';
import type { PanelActions, PanelState } from '../contracts/path-tools';
import { field, sectionHead, seg, slider, switchRow } from '../ui-kit/templates';
import { t } from './i18n';
import { HELP, REFUSALS, TITLE } from './names';

const num = (e: Event): number => Number((e.target as HTMLInputElement).value);

function joins(s: PanelState, a: PanelActions): TemplateResult {
  return html`<div class="field">
    <div class="field-head"><span class="lbl" id="pt-joins">${t('path-tools.panel.corners')}</span></div>
    ${seg({
      role: 'radiogroup',
      label: t('path-tools.panel.corners'),
      value: s.join ?? 'round',
      items: [
        { value: 'round', label: t('path-tools.panel.round') },
        { value: 'miter', label: t('path-tools.panel.sharp') },
      ],
      onChange: (join) => a.change({ join }),
    })}
  </div>`;
}

function fields(s: PanelState, a: PanelActions): TemplateResult | typeof nothing {
  if (s.tool === 'offset')
    return html`${field({
        id: 'pt-amount',
        label: t('path-tools.panel.amount'),
        help: t('path-tools.panel.positive-grows-the-shape-negative', { min: OFFSET_MIN_ABS, max: OFFSET_MAX_ABS }),
        control: html`<input id="pt-amount" class="input" type="number" inputmode="decimal" step="0.1" min=${-OFFSET_MAX_ABS} max=${OFFSET_MAX_ABS} aria-describedby="pt-amount-help" .value=${String(s.amount ?? 1)} @input=${(e: Event) => {
          const v = num(e);
          if (Number.isFinite(v)) a.change({ amount: v });
        }} />`,
      })}${joins(s, a)}`;
  if (s.tool === 'simplify') {
    const v = s.tolerance ?? SIMPLIFY_DEFAULT;
    return html`${slider({ id: 'pt-tolerance', label: t('path-tools.panel.detail-kept'), min: SIMPLIFY_MIN, max: SIMPLIFY_MAX, step: 0.01, value: v, valueText: v.toFixed(2), onInput: (x) => a.change({ tolerance: x }), onChange: (x) => a.change({ tolerance: x }) })}
      <p class="help">${t('path-tools.panel.a-higher-value-drops-more-points')}</p>
      ${switchRow({ id: 'pt-smooth', label: t('path-tools.panel.smooth-corners'), checked: !!s.smooth, onChange: (smooth) => a.change({ smooth }) })}`;
  }
  return nothing;
}

export function renderPanel(s: PanelState, a: PanelActions): TemplateResult {
  const why = s.busy ? t('path-tools.panel.working-on-it') : s.refusal ? t(REFUSALS[s.refusal]) : s.before === undefined || s.after === undefined ? t('path-tools.panel.nothing-to-preview-yet') : '';
  const outcome = why || t('path-tools.panel.before-now-after-after', { before: s.before ?? 0, after: s.after ?? 0 });
  const blocked = !!why;
  return html`<section class="group pt-panel" aria-label=${t(TITLE[s.tool])}>
    ${sectionHead({ title: t(TITLE[s.tool]), level: 3 })}
    <p class="help">${t(HELP[s.tool])}</p>
    ${fields(s, a)}
    <p id="pt-outcome" class="help" role="status">${outcome}</p>
    <div class="acts">
      <button type="button" class="btn btn-primary btn-sm" data-act="apply" aria-disabled=${blocked ? 'true' : nothing} aria-describedby="pt-outcome" @click=${() => !blocked && a.apply()}>${t('path-tools.panel.apply')}</button>
      <button type="button" class="btn btn-secondary btn-sm" data-act="cancel" @click=${() => a.cancel()}>${t('path-tools.panel.cancel')}</button>
    </div>
  </section>`;
}
