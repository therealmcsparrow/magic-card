import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, HassEntity, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderSelectField,
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
      show_value: true,
      direction: 'horizontal',
    };
  }

  private _getEntityLimits(
    entity: HassEntity | undefined,
    attribute?: string,
  ): { min: number; max: number; step: number } {
    if (!entity) return { min: 0, max: 100, step: 1 };

    const domain = entity.entity_id.split('.')[0];
    const attrs = entity.attributes;

    switch (domain) {
      case 'input_number':
      case 'number':
        return {
          min: Number(attrs.min ?? 0),
          max: Number(attrs.max ?? 100),
          step: Number(attrs.step ?? 1),
        };
      case 'light':
        if (attribute === 'color_temp') {
          return {
            min: Number(attrs.min_mireds ?? 153),
            max: Number(attrs.max_mireds ?? 500),
            step: 1,
          };
        }
        return { min: 0, max: 100, step: 1 };
      case 'fan':
        return {
          min: 0,
          max: 100,
          step: Number(attrs.percentage_step ?? 1),
        };
      case 'cover':
        return { min: 0, max: 100, step: 1 };
      case 'media_player':
        return { min: 0, max: 100, step: 1 };
      case 'climate':
        return {
          min: Number(attrs.min_temp ?? 7),
          max: Number(attrs.max_temp ?? 35),
          step: Number(attrs.target_temp_step ?? 0.5),
        };
      default:
        return {
          min: Number(attrs.min ?? 0),
          max: Number(attrs.max ?? 100),
          step: Number(attrs.step ?? 1),
        };
    }
  }

  private _createSliderHandler(
    hass: HomeAssistant,
    entityId: string,
    config: SliderModuleConfig,
    limits: { min: number; max: number; step: number },
  ): (e: PointerEvent) => void {
    const isVertical = config.direction === 'vertical';
    const { min, max, step } = limits;

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
    const { min, max } = this._getEntityLimits(entity, c.attribute);
    const currentValue = entity
      ? c.attribute
        ? Number(entity.attributes[c.attribute] ?? min)
        : Number(entity.state)
      : Math.round((min + max) / 2);
    const isVertical = c.direction === 'vertical';
    const percentage = max > min ? (currentValue - min) / (max - min) : 0;

    const limits = this._getEntityLimits(entity, c.attribute);
    const handlePointerDown = c.entity && hass
      ? this._createSliderHandler(hass, c.entity, c, limits)
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
