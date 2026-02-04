import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, LightModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderToggleField,
  renderEntityField,
} from '../../utils/form-utils';

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
        style="
          display: flex;
          flex-direction: ${c.compact ? 'row' : 'column'};
          align-items: ${c.compact ? 'center' : 'stretch'};
          gap: ${c.compact ? '12px' : '8px'};
        "
      >
        <div
          class="mc-light-header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <ha-icon
            .icon=${'mdi:lightbulb'}
            style="color: ${iconColor}; --mdc-icon-size: ${c.compact ? '24px' : '32px'};"
          ></ha-icon>
          ${!c.compact
            ? html`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${name}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${isOn ? (brightnessPct !== undefined ? `${brightnessPct}%` : 'On') : 'Off'}
                  </div>
                </div>
              `
            : html`<span style="font-weight: 500; flex: 1;">${name}</span>`}
        </div>

        ${c.show_brightness
          ? html`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${'mdi:brightness-6'} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
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
                  ? html`<span style="font-size: 12px; min-width: 32px; text-align: right;">${brightnessPct}%</span>`
                  : nothing}
              </div>
            `
          : nothing}

        ${c.show_color_temp
          ? html`
              <div class="mc-light-color-temp" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${'mdi:thermometer'} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${((colorTemp ?? 300) - minMireds) / (maxMireds - minMireds)}; --mc-slider-color: #ff9800; touch-action: none;"
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
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${'mdi:palette'} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
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
  ): TemplateResult {
    const c = config as LightModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'light')}
        ${renderToggleField('Show Brightness', c.show_brightness, (v) =>
          onChange({ ...c, show_brightness: v }),
        )}
        ${renderToggleField('Show Color Temp', c.show_color_temp, (v) =>
          onChange({ ...c, show_color_temp: v }),
        )}
        ${renderToggleField('Show Color Picker', c.show_color, (v) =>
          onChange({ ...c, show_color: v }),
        )}
        ${renderToggleField('Compact Mode', c.compact, (v) => onChange({ ...c, compact: v }))}
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
