import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, LightModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderToggleField,
  renderEntityField,
  renderAttributeField,
} from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

class LightModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'light',
    name: 'Light',
    description: 'Light control with brightness, color temp, and color options',
    category: 'controls',
    icon: 'mdi:lightbulb',
  };

  createDefault(): LightModuleConfig {
    return {
      id: generateId('light'),
      type: 'light',
      show_brightness: true,
      show_color_temp: false,
      show_color: false,
      compact: false,
    };
  }

  private _createSliderHandler(
    hass: HomeAssistant,
    entityId: string,
    onRelease: (pct: number) => void,
  ): (e: PointerEvent) => void {
    return (e: PointerEvent) => {
      e.stopPropagation();
      const slider = e.currentTarget as HTMLElement;
      slider.setPointerCapture(e.pointerId);

      const calcPct = (evt: PointerEvent) => {
        const rect = slider.getBoundingClientRect();
        return Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
      };

      slider.style.setProperty('--slider-value', String(calcPct(e)));

      const onMove = (evt: PointerEvent) => {
        slider.style.setProperty('--slider-value', String(calcPct(evt)));
      };

      const onUp = (evt: PointerEvent) => {
        slider.removeEventListener('pointermove', onMove);
        slider.removeEventListener('pointerup', onUp);
        onRelease(calcPct(evt));
      };

      slider.addEventListener('pointermove', onMove);
      slider.addEventListener('pointerup', onUp);
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as LightModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const isOn = entity ? entity.state === 'on' : false;
    const brightness = entity?.attributes.brightness as number | undefined;
    const brightnessPct = brightness !== undefined ? Math.round((brightness / 255) * 100) : undefined;
    const colorTemp = entity?.attributes.color_temp as number | undefined;
    const minMireds = (entity?.attributes.min_mireds as number | undefined) ?? 153;
    const maxMireds = (entity?.attributes.max_mireds as number | undefined) ?? 500;
    const name = entity?.attributes.friendly_name || c.entity || 'Light';
    const iconColor = isOn ? 'var(--state-light-active-color, #fdd835)' : 'var(--state-icon-color, #9e9e9e)';

    const handleBrightness = c.entity && hass
      ? this._createSliderHandler(hass, c.entity, (pct) => {
          hass.callService('light', 'turn_on', {
            entity_id: c.entity,
            brightness_pct: Math.round(pct * 100),
          });
        })
      : undefined;

    const handleColorTemp = c.entity && hass
      ? this._createSliderHandler(hass, c.entity, (pct) => {
          hass.callService('light', 'turn_on', {
            entity_id: c.entity,
            color_temp: Math.round(minMireds + pct * (maxMireds - minMireds)),
          });
        })
      : undefined;

    const handleColorChange = (e: InputEvent) => {
      e.stopPropagation();
      if (!c.entity || !hass) return;
      const hex = (e.target as HTMLInputElement).value;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      hass.callService('light', 'turn_on', {
        entity_id: c.entity,
        rgb_color: [r, g, b],
      });
    };

    return html`
      <div
        class="mc-module mc-light ${c.compact ? 'mc-light--compact' : ''}"
      >
        <div class="mc-light-header">
          <ha-icon
            .icon=${'mdi:lightbulb'}
            style="color: ${iconColor};"
          ></ha-icon>
          ${!c.compact
            ? html`
                <div class="mc-light-info">
                  <div class="mc-light-name">${name}</div>
                  <div class="mc-light-secondary">
                    ${isOn ? (brightnessPct !== undefined ? `${brightnessPct}%` : 'On') : 'Off'}
                  </div>
                </div>
              `
            : html`<span class="mc-light-name--compact">${name}</span>`}
        </div>

        ${c.show_brightness
          ? html`
              <div class="mc-light-control mc-light-brightness">
                <ha-icon .icon=${'mdi:brightness-6'}></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${(brightnessPct ?? 50) / 100}; --mc-slider-color: var(--state-light-active-color, #fdd835); touch-action: none;"
                  @pointerdown=${handleBrightness}
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
                ${brightnessPct !== undefined
                  ? html`<span class="mc-light-value">${brightnessPct}%</span>`
                  : nothing}
              </div>
            `
          : nothing}

        ${c.show_color_temp
          ? html`
              <div class="mc-light-control mc-light-color-temp">
                <ha-icon .icon=${'mdi:thermometer'}></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${((colorTemp ?? 300) - minMireds) / (maxMireds - minMireds)}; --mc-slider-color: var(--mc-light-color-temp); touch-action: none;"
                  @pointerdown=${handleColorTemp}
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
              </div>
            `
          : nothing}

        ${c.show_color
          ? html`
              <div class="mc-light-control mc-light-color">
                <ha-icon .icon=${'mdi:palette'}></ha-icon>
                <input
                  type="color"
                  class="mc-light-color-input"
                  @input=${handleColorChange}
                  @click=${(e: Event) => e.stopPropagation()}
                />
              </div>
            `
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
    const c = config as LightModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'light', 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderToggleField('Show Brightness', c.show_brightness, (v) =>
          onChange({ ...c, show_brightness: v }),
        'show_brightness', syncCtx)}
        ${renderToggleField('Show Color Temp', c.show_color_temp, (v) =>
          onChange({ ...c, show_color_temp: v }),
        'show_color_temp', syncCtx)}
        ${renderToggleField('Show Color Picker', c.show_color, (v) =>
          onChange({ ...c, show_color: v }),
        'show_color', syncCtx)}
        ${renderToggleField('Compact Mode', c.compact, (v) => onChange({ ...c, compact: v }), 'compact', syncCtx)}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as LightModuleConfig;
    if (!c.entity) {
      errors.push('Entity is required for light module');
    }
    return errors;
  }
}

ModuleRegistry.register(new LightModule());
