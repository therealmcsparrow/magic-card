import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../utils/form-utils';

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
      min: 0,
      max: 100,
      step: 1,
      show_value: true,
      direction: 'horizontal',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const step = c.step ?? 1;
    const currentValue = entity
      ? c.attribute
        ? Number(entity.attributes[c.attribute] ?? min)
        : Number(entity.state)
      : Math.round((min + max) / 2);
    const isVertical = c.direction === 'vertical';

    return html`
      <div
        class="mc-module mc-slider"
        style="
          display: flex;
          flex-direction: ${isVertical ? 'column' : 'row'};
          align-items: center;
          gap: 8px;
          ${isVertical ? 'height: 120px;' : 'width: 100%;'}
        "
      >
        <input
          type="range"
          .value=${String(currentValue)}
          min=${min}
          max=${max}
          step=${step}
          style="
            flex: 1;
            accent-color: ${c.slider_color || 'var(--primary-color, #03a9f4)'};
            ${isVertical ? 'writing-mode: vertical-lr; direction: rtl; height: 100%;' : 'width: 100%;'}
            ${c.track_color ? `background: ${c.track_color};` : ''}
          "
        />
        ${c.show_value
          ? html`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${currentValue}
            </span>`
          : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as SliderModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderTextField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }))}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }))}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }))}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: v }), { min: 0.01, step: 0.01 })}
        ${renderToggleField('Show Value', c.show_value, (v) => onChange({ ...c, show_value: v }))}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as SliderModuleConfig['direction'] }),
        )}
        ${renderColorField('Slider Color', c.slider_color, (v) => onChange({ ...c, slider_color: v }))}
        ${renderColorField('Track Color', c.track_color, (v) => onChange({ ...c, track_color: v }))}
        ${renderTextField('Thumb Size', c.thumb_size, (v) => onChange({ ...c, thumb_size: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new SliderModule());
