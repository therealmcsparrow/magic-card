import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HassEntity, HomeAssistant, SpinboxModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderEntityField,
  renderNumberField,
  renderAttributeField,
  renderFieldHint,
} from '../../utils/form-utils';
import { formatControlValue, numericControl, runServiceCall, snapValue } from '../../utils/entity-control';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { stopControlEvent } from '../../utils/slider-track';
import { currentRenderContext } from '../../services/render-context';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';

const optional = (v: number) => (Number.isFinite(v) ? v : undefined);

/**
 * A thermostat in a range mode (heat_cool) has no single target temperature: its low / high ends,
 * when the spinbox shows the target temperature.
 */
function climateRange(stateObj: HassEntity | undefined, attribute: string | undefined): [number, number] | undefined {
  if (!stateObj?.entity_id.startsWith('climate.') || (attribute && attribute !== 'temperature')) return undefined;
  const a = stateObj.attributes || {};
  const low = typeof a.target_temp_low === 'number' ? a.target_temp_low : undefined;
  const high = typeof a.target_temp_high === 'number' ? a.target_temp_high : undefined;
  return low !== undefined && high !== undefined && typeof a.temperature !== 'number' ? [low, high] : undefined;
}

/**
 * Minus / value / plus for an entity's numeric value, with the same per-domain adapters as the
 * slider (input_number / number, climate target temperature, light brightness in %, fan speed, ...).
 * Clicks are collected and sent once after a short pause.
 */
class SpinboxModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'spinbox',
    name: 'Spinbox',
    description: 'Numeric input with increment and decrement buttons',
    category: 'controls',
    icon: 'mdi:numeric',
  };

  createDefault(): SpinboxModuleConfig {
    // no min / max / step: the entity's own range and step apply
    return {
      id: generateId('spinbox'),
      type: 'spinbox',
    };
  }

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
    const name = stateObj ? entityDisplayName(hass, stateObj) : 'Spinbox';
    const atMin = value !== undefined && ctrl !== undefined && value <= ctrl.min;
    const atMax = value !== undefined && ctrl !== undefined && value >= ctrl.max;

    return html`
      <div class="mc-module mc-spinbox" role="group" aria-label=${name}>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-decrement"
          aria-label=${`Decrease ${name}`}
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
          aria-label=${`Increase ${name}`}
          ?disabled=${disabled || atMax}
          @click=${change(1)}
          @pointerdown=${stopControlEvent}
          @pointerup=${stopControlEvent}
          @keydown=${stopControlEvent}
        >+</button>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as SpinboxModuleConfig;
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const own = stateObj ? numericControl(hass, stateObj, c.attribute) : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${stateObj && own?.readOnly
          ? renderFieldHint('This value can only be shown: the entity (or this attribute) cannot be set from a spinbox.')
          : nothing}
        ${climateRange(stateObj, c.attribute)
          ? renderFieldHint('The thermostat keeps a range (low / high): pick target_temp_low or target_temp_high as the attribute to set one end.')
          : nothing}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint("Empty: the entity's own range and step. Min and max can only narrow that range; a step that is not a multiple of the entity's step is replaced by the entity's.")}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const c = config as SpinboxModuleConfig;
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) return ['Min must be less than max'];
    if (c.step !== undefined && !(c.step > 0)) return ['Step must be greater than 0'];
    return [];
  }
}

ModuleRegistry.register(new SpinboxModule());
