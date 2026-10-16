import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, DesignConfig, HomeAssistant, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderAttributeField,
  renderNumberField,
  renderColorField,
  renderFieldHint,
} from '../../utils/form-utils';
import { formatControlValue, numericControl, runServiceCall } from '../../utils/entity-control';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { renderTrack } from '../../utils/slider-track';
import { currentRenderContext } from '../../services/render-context';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';

const optional = (v: number) => (Number.isFinite(v) ? v : undefined);

/**
 * Slider for an entity's numeric value. Per domain (see numericControl): input_number / number
 * value, light brightness or colour temperature (kelvin), fan speed, cover position or tilt, valve
 * position, media player volume, climate / water heater target temperature, humidifier humidity.
 * Other entities (sensors) are shown read-only. The service call goes out after release.
 */
class SliderModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'slider',
    name: 'Slider',
    description: 'Range slider for controlling numeric values',
    category: 'controls',
    icon: 'mdi:tune-vertical',
  };

  createDefault(): SliderModuleConfig {
    return {
      id: generateId('slider'),
      type: 'slider',
      show_value: true,
      direction: 'horizontal',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const isVertical = c.direction === 'vertical';
    const design = (c.design || {}) as DesignConfig;
    // the module's own colours beat the design colours (like the icon colour of the icon module)
    const sliderColor = c.slider_color || (design.color as string | undefined) || 'var(--primary-color, #03a9f4)';
    const trackColor = c.track_color || (design.background as string | undefined);
    const style = `--mc-slider-color: ${sliderColor}; ${trackColor ? `--mc-slider-background: ${trackColor};` : ''}`;
    const ctrl = stateObj ? numericControl(hass, stateObj, c.attribute, { min: c.min, max: c.max, step: c.step }) : undefined;

    const key = controlKey(c.entity, c.attribute, 'slider');
    const value = ctrl ? pendingValue(key, ctrl.value) ?? ctrl.value : undefined;
    const ctx = currentRenderContext();
    const valueText = ctrl && value !== undefined
      ? formatControlValue(hass, ctrl, value)
      : stateObj
        ? formatEntityValue(hass, stateObj).text
        : '';
    const name = stateObj ? entityDisplayName(hass, stateObj) : 'Slider';

    const track = renderTrack({
      value,
      min: ctrl?.min ?? c.min ?? 0,
      max: ctrl?.max ?? c.max ?? 100,
      step: ctrl?.step ?? c.step ?? 1,
      vertical: isVertical,
      disabled: !ctrl || ctrl.readOnly || !hass,
      label: name,
      valueText,
      style,
      onCommit: (v) => {
        if (!ctrl?.call || !hass) return;
        const call = ctrl.call;
        setPendingValue(key, v, ctrl.value, (sent) => runServiceCall(hass, call(sent)), () => ctx?.requestUpdate(), 300);
      },
    });

    return html`
      <div
        class="mc-module mc-slider mc-slider-container ${isVertical ? 'mc-slider-container--vertical' : 'mc-slider-container--horizontal'}"
      >
        ${track}
        ${c.show_value !== false && stateObj
          ? html`<span class="mc-slider-value">${valueText}</span>`
          : nothing}
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
    const c = config as SliderModuleConfig;
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const own = stateObj ? numericControl(hass, stateObj, c.attribute) : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${stateObj && own?.readOnly
          ? renderFieldHint('This value can only be shown: the entity (or this attribute) cannot be set from a slider.')
          : nothing}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint("Empty: the entity's own range and step. Min and max can only narrow that range.")}
        ${renderToggleField('Show value', c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as SliderModuleConfig['direction'] }),
          'direction',
          syncCtx,
        )}
        ${renderColorField('Slider color', c.slider_color, (v) => onChange({ ...c, slider_color: v || undefined }), 'slider_color', syncCtx)}
        ${renderColorField('Track color', c.track_color, (v) => onChange({ ...c, track_color: v || undefined }), 'track_color', syncCtx)}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const c = config as SliderModuleConfig;
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) return ['Min must be less than max'];
    if (c.step !== undefined && !(c.step > 0)) return ['Step must be greater than 0'];
    return [];
  }
}

ModuleRegistry.register(new SliderModule());
