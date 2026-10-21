import { html, TemplateResult } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HomeAssistant, SpinboxModuleConfig } from '../../types';
import { formatControlValue, numericControl, runServiceCall, snapValue } from '../../utils/entity-control';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { stopControlEvent } from '../../utils/slider-track';
import { currentRenderContext } from '../../services/render-context';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';
import { t } from '../../card/i18n';
import { climateRange } from './spinbox-range';

/**
 * Minus / value / plus for an entity's numeric value, with the same per-domain adapters as the
 * slider (input_number / number, climate target temperature, light brightness in %, fan speed, ...).
 * Clicks are collected and sent once after a short pause.
 */
export class SpinboxView implements ModuleView {
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SpinboxModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const ctrl = stateObj ? numericControl(hass, stateObj, c.attribute, { min: c.min, max: c.max, step: c.step }) : undefined;
    const key = controlKey(c.entity, c.attribute, 'spinbox');
    const value = ctrl ? pendingValue(key, ctrl.value) ?? ctrl.value : undefined;
    const ctx = currentRenderContext();

    const range = ctrl && value === undefined ? climateRange(stateObj, c.attribute) : undefined;
    let text: string;
    if (ctrl && value !== undefined) text = formatControlValue(hass, ctrl, value);
    else if (ctrl && range) text = `${formatControlValue(hass, { ...ctrl, unit: '' }, range[0])} – ${formatControlValue(hass, ctrl, range[1])}`;
    else if (stateObj) text = formatEntityValue(hass, stateObj).text;
    else text = '–';

    // without a current value there is nothing to step from (no jump to an end of the range)
    const disabled = !ctrl || ctrl.readOnly || !hass || value === undefined;
    const change = (dir: 1 | -1) => (e: Event) => {
      e.stopPropagation();
      if (!ctrl?.call || !hass || disabled || value === undefined) return;
      const call = ctrl.call;
      const next = snapValue(value + dir * ctrl.step, ctrl.min, ctrl.max, ctrl.step);
      if (next === value) return;
      setPendingValue(key, next, ctrl.value, (v) => runServiceCall(hass, call(v)), () => ctx?.requestUpdate());
    };
    const name = stateObj ? entityDisplayName(hass, stateObj) : t('Spinbox');
    const atMin = value !== undefined && ctrl !== undefined && value <= ctrl.min;
    const atMax = value !== undefined && ctrl !== undefined && value >= ctrl.max;

    return html`
      <div class="mc-module mc-spinbox" role="group" aria-label=${name}>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-decrement"
          aria-label=${t('Decrease {name}', { name })}
          ?disabled=${disabled || atMin}
          @click=${change(-1)}
          @pointerdown=${stopControlEvent}
          @pointerup=${stopControlEvent}
          @keydown=${stopControlEvent}
        >&minus;</button>
        <span class="mc-spinbox-value ${ctrl && value !== undefined ? '' : 'mc-spinbox-value--text'}" aria-live="polite">${text}</span>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-increment"
          aria-label=${t('Increase {name}', { name })}
          ?disabled=${disabled || atMax}
          @click=${change(1)}
          @pointerdown=${stopControlEvent}
          @pointerup=${stopControlEvent}
          @keydown=${stopControlEvent}
        >+</button>
      </div>
    `;
  }

}
