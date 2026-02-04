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

  private _createSliderHandler(
    hass: HomeAssistant,
    entityId: string,
    config: SliderModuleConfig,
  ): (e: PointerEvent) => void {
    const isVertical = config.direction === 'vertical';
    const min = config.min ?? 0;
    const max = config.max ?? 100;
    const step = config.step ?? 1;

    return (e: PointerEvent) => {
      e.stopPropagation();
      const slider = e.currentTarget as HTMLElement;
      slider.setPointerCapture(e.pointerId);

      const calcPct = (evt: PointerEvent) => {
        const rect = slider.getBoundingClientRect();
        if (isVertical) {
          return Math.max(0, Math.min(1, 1 - (evt.clientY - rect.top) / rect.height));
        }
        return Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
      };

      slider.style.setProperty('--slider-value', String(calcPct(e)));

      const onMove = (evt: PointerEvent) => {
        slider.style.setProperty('--slider-value', String(calcPct(evt)));
      };

      const onUp = (evt: PointerEvent) => {
        slider.removeEventListener('pointermove', onMove);
        slider.removeEventListener('pointerup', onUp);
        const pct = calcPct(evt);
        const raw = min + pct * (max - min);
        const value = Math.round(raw / step) * step;
        this._callEntityService(hass, entityId, value, config.attribute);
      };

      slider.addEventListener('pointermove', onMove);
      slider.addEventListener('pointerup', onUp);
    };
  }

  private _callEntityService(
    hass: HomeAssistant,
    entityId: string,
    value: number,
    attribute?: string,
  ): void {
    const domain = entityId.split('.')[0];

    switch (domain) {
      case 'input_number':
      case 'number':
        hass.callService(domain, 'set_value', { entity_id: entityId, value });
        break;
      case 'light':
        if (!attribute || attribute === 'brightness') {
          hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: Math.round(value) });
        } else if (attribute === 'color_temp') {
          hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: Math.round(value) });
        }
        break;
      case 'fan':
        hass.callService('fan', 'set_percentage', { entity_id: entityId, percentage: Math.round(value) });
        break;
      case 'cover':
        hass.callService('cover', 'set_cover_position', { entity_id: entityId, position: Math.round(value) });
        break;
      case 'media_player':
        hass.callService('media_player', 'volume_set', { entity_id: entityId, volume_level: value / 100 });
        break;
      case 'climate':
        hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: value });
        break;
      default:
        hass.callService(domain, 'set_value', { entity_id: entityId, value });
        break;
    }
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const currentValue = entity
      ? c.attribute
        ? Number(entity.attributes[c.attribute] ?? min)
        : Number(entity.state)
      : Math.round((min + max) / 2);
    const isVertical = c.direction === 'vertical';
    const percentage = max > min ? (currentValue - min) / (max - min) : 0;

    const handlePointerDown = c.entity && hass
      ? this._createSliderHandler(hass, c.entity, c)
      : undefined;

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
        <div
          class="mc-tile-slider ${isVertical ? 'mc-tile-slider--vertical' : ''}"
          style="--slider-value: ${percentage}; --mc-slider-color: ${c.slider_color || 'var(--primary-color, #03a9f4)'}; ${c.track_color ? `--mc-slider-background: ${c.track_color};` : ''} touch-action: none;"
          @pointerdown=${handlePointerDown}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="mc-tile-slider-background"></div>
          <div class="mc-tile-slider-bar"></div>
        </div>
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
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as SliderModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
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
