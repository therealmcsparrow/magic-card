import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, DesignConfig, HomeAssistant, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { formatControlValue, numericControl, runServiceCall } from '../../utils/entity-control';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { renderTrack } from '../../utils/slider-track';
import { currentRenderContext } from '../../services/render-context';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';
import { t } from '../../card/i18n';


/**
 * Slider for an entity's numeric value. Per domain (see numericControl): input_number / number
 * value, light brightness or colour temperature (kelvin), fan speed, cover position or tilt, valve
 * position, media player volume, climate / water heater target temperature, humidifier humidity.
 * Other entities (sensors) are shown read-only. The service call goes out after release.
 */
class SliderModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'slider',
    get name() {
      return t('Slider');
    },
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
    const name = stateObj ? entityDisplayName(hass, stateObj) : t('Slider');

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

  validate(config: CardModule): string[] {
    const c = config as SliderModuleConfig;
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) return [t('Min must be less than max')];
    if (c.step !== undefined && !(c.step > 0)) return [t('Step must be greater than 0')];
    return [];
  }
}

ModuleRegistry.register(new SliderModule());
