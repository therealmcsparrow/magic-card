import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, DesignConfig, HomeAssistant, HassEntity, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderAttributeField,
} from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

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

  private _toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
  }

  private _clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private _getCurrentValue(
    entity: HassEntity | undefined,
    attribute: string | undefined,
    limits: { min: number; max: number },
  ): number {
    const { min, max } = limits;
    if (!entity) return Math.round((min + max) / 2);

    const attrs = entity.attributes as Record<string, unknown>;
    const domain = entity.entity_id.split('.')[0];

    // Explicit attribute always has priority.
    if (attribute) {
      const attrNum = this._toNumber(attrs[attribute]);
      if (attrNum !== undefined) return this._clamp(attrNum, min, max);
    }

    let value: number | undefined;
    switch (domain) {
      case 'light': {
        // Prefer brightness level when no specific attribute is selected.
        const brightness = this._toNumber(attrs.brightness);
        const brightnessPct = this._toNumber(attrs.brightness_pct);
        if (brightnessPct !== undefined) value = brightnessPct;
        else if (brightness !== undefined) value = Math.round((brightness / 255) * 100);
        break;
      }
      case 'fan':
        value = this._toNumber(attrs.percentage);
        break;
      case 'cover':
        value = this._toNumber(attrs.current_position);
        break;
      case 'media_player': {
        const volume = this._toNumber(attrs.volume_level);
        value = volume !== undefined ? Math.round(volume * 100) : undefined;
        break;
      }
      case 'climate':
        value = this._toNumber(attrs.temperature);
        break;
      default:
        value = undefined;
    }

    if (value === undefined) {
      value = this._toNumber(entity.state);
    }

    if (value === undefined) {
      return Math.round((min + max) / 2);
    }

    return this._clamp(value, min, max);
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
    const limits = this._getEntityLimits(entity, c.attribute);
    const { min, max, step } = limits;
    const currentValue = this._getCurrentValue(entity, c.attribute, limits);
    const isVertical = c.direction === 'vertical';
    const percentage = this._clamp(max > min ? (currentValue - min) / (max - min) : 0, 0, 1);
    const design = (c.design || {}) as DesignConfig;
    const sliderColor = (design.color as string | undefined) || c.slider_color || 'var(--primary-color, #03a9f4)';
    const trackColor = (design.background as string | undefined) || c.track_color;
    const displayValue = step < 1 ? String(Math.round(currentValue / step) * step) : String(Math.round(currentValue));

    const handlePointerDown = c.entity && hass
      ? this._createSliderHandler(hass, c.entity, c, limits)
      : undefined;

    return html`
      <div
        class="mc-module mc-slider mc-slider-container ${isVertical ? 'mc-slider-container--vertical' : 'mc-slider-container--horizontal'}"
      >
        <div
          class="mc-tile-slider ${isVertical ? 'mc-tile-slider--vertical' : ''}"
          style="--slider-value: ${percentage}; --mc-slider-color: ${sliderColor}; ${trackColor ? `--mc-slider-background: ${trackColor};` : ''} touch-action: none;"
          @pointerdown=${handlePointerDown}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="mc-tile-slider-background"></div>
          <div class="mc-tile-slider-bar"></div>
        </div>
        ${c.show_value
          ? html`<span class="mc-slider-value">
              ${displayValue}
            </span>`
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
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderToggleField('Show Value', c.show_value, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
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
      </div>
    `;
  }
}

ModuleRegistry.register(new SliderModule());
