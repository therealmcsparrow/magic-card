import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HassEntity, HomeAssistant, LightModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderEntityField, renderFieldHint, renderIconField } from '../../utils/form-utils';
import {
  lightBrightnessPct,
  lightKelvin,
  lightKelvinRange,
  lightSupportsBrightness,
  lightSupportsColor,
  lightSupportsColorTemp,
  runServiceCall,
  toggleCall,
} from '../../utils/entity-control';
import { entityStateColor } from '../../utils/entity-color';
import { renderIcon } from '../../icons/render-icon';
import { renderIconFxEditor } from '../../editor/components/icon-fx-editor';
import { entityIcon } from '../../utils/entity-icon';
import { entityDisplayName, formatFixed } from '../../utils/entity-value';
import { controlKey, pendingValue, setPendingValue } from '../../utils/pending-value';
import { renderTrack, stopControlEvent } from '../../utils/slider-track';
import { selectValue } from '../../utils/select-value';
import { currentRenderContext } from '../../services/render-context';

/** LightEntityFeature.EFFECT */
const FEATURE_EFFECT = 4;

const hex2 = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

/** The light's colour as #rrggbb for the colour input (white when it reports none). */
function lightHex(stateObj: HassEntity | undefined): string {
  const rgb = stateObj?.attributes?.rgb_color;
  if (Array.isArray(rgb) && rgb.length >= 3 && rgb.every((n) => typeof n === 'number')) {
    return `#${hex2(rgb[0])}${hex2(rgb[1])}${hex2(rgb[2])}`;
  }
  const color = stateObj ? entityStateColor(stateObj) : undefined;
  const m = color?.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  return m ? `#${hex2(+m[1])}${hex2(+m[2])}${hex2(+m[3])}` : '#ffffff';
}

function supportsEffect(stateObj: HassEntity): boolean {
  const list = stateObj.attributes?.effect_list;
  return Array.isArray(list) && list.length > 0 && (Number(stateObj.attributes?.supported_features ?? FEATURE_EFFECT) & FEATURE_EFFECT) !== 0;
}

/**
 * A light: icon (tap toggles), name and state, and the controls the light supports per its
 * supported_color_modes (brightness, colour temperature in kelvin, colour) and effect list.
 */
class LightModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'light',
    name: 'Light',
    description: 'Light control with brightness, color temp, and color options',
    category: 'controls',
    icon: 'mdi:lightbulb-outline',
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

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as LightModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const ctx = currentRenderContext();
    const unavailable = !stateObj || stateObj.state === 'unavailable' || stateObj.state === 'unknown';
    const live = !!stateObj && !!hass && !unavailable;
    const isOn = stateObj?.state === 'on';
    const name = stateObj ? entityDisplayName(hass, stateObj) : c.entity || 'Light';
    const update = () => ctx?.requestUpdate();

    // brightness (0 when off), pending while HA has not reported the new value yet
    const bKey = controlKey(c.entity, 'brightness', 'light');
    const brightness = stateObj ? pendingValue(bKey, lightBrightnessPct(stateObj)) ?? lightBrightnessPct(stateObj) : undefined;
    const kKey = controlKey(c.entity, 'color_temp_kelvin', 'light');
    const ownKelvin = stateObj && isOn ? lightKelvin(stateObj) : undefined;
    const kelvin = stateObj ? pendingValue(kKey, ownKelvin) ?? ownKelvin : undefined;
    const kRange = stateObj ? lightKelvinRange(stateObj) : { min: 2000, max: 6500 };

    let secondary: string;
    if (!stateObj) secondary = 'Off';
    else if (isOn && brightness !== undefined && lightSupportsBrightness(stateObj)) secondary = `${formatFixed(hass, brightness, 0)}%`;
    else secondary = hass?.formatEntityState?.(stateObj) ?? stateObj.state;

    // the light's own colour when on (HA's state colour), a design colour overrides it
    const iconColor = `var(--mc-design-color, ${(stateObj && entityStateColor(stateObj)) || 'var(--state-icon-color, #9e9e9e)'})`;

    const onToggle = (e: Event) => {
      e.stopPropagation();
      if (live && c.entity) runServiceCall(hass!, toggleCall(hass, c.entity));
    };

    const showBrightness = c.show_brightness !== false && (!stateObj || lightSupportsBrightness(stateObj));
    const showTemp = c.show_color_temp && (!stateObj || lightSupportsColorTemp(stateObj));
    const showColor = c.show_color && (!stateObj || lightSupportsColor(stateObj));
    const showEffect = c.show_effect && !!stateObj && supportsEffect(stateObj);
    const effects = showEffect ? (stateObj!.attributes.effect_list as unknown[]).map(String) : [];
    const effect = stateObj?.attributes?.effect as string | undefined;

    const icon = renderIcon({
      icon: c.icon && c.icon !== 'svg' ? c.icon : 'mdi:lightbulb',
      entity: c.entity,
      hass,
      // an own icon replaces the light's entity icon; empty keeps it
      useEntityIcon: !c.icon || c.icon === 'svg',
      className: 'mc-anim-icon',
      part: 'icon',
      fx: c.icon_fx,
      iconOn: c.icon_on,
      iconOff: c.icon_off,
      svg: c.svg,
    });

    return html`
      <div class="mc-module mc-light ${c.compact ? 'mc-light--compact' : ''}">
        <div class="mc-light-header">
          <button
            type="button"
            class="mc-light-toggle"
            style="color: ${iconColor};"
            aria-label=${`Toggle ${name}`}
            aria-pressed=${isOn ? 'true' : 'false'}
            ?disabled=${!live}
            @click=${onToggle}
            @pointerdown=${stopControlEvent}
            @pointerup=${stopControlEvent}
            @keydown=${stopControlEvent}
          >${icon}</button>
          ${!c.compact
            ? html`
                <div class="mc-light-info">
                  <div class="mc-light-name" data-mc-part="name">${name}</div>
                  <div class="mc-light-secondary" data-mc-part="state">${secondary}</div>
                </div>
              `
            : html`<span class="mc-light-name--compact" data-mc-part="name">${name}</span>`}
        </div>

        ${showBrightness
          ? html`
              <div class="mc-light-control mc-light-brightness">
                <ha-icon .icon=${'mdi:brightness-6'}></ha-icon>
                ${renderTrack({
                  value: brightness ?? 0,
                  min: 0,
                  max: 100,
                  step: 1,
                  disabled: !live,
                  label: `${name} brightness`,
                  valueText: `${brightness ?? 0}%`,
                  style: '--mc-slider-color: var(--state-light-active-color, #fdd835);',
                  onCommit: (v) => {
                    if (!live) return;
                    // 0 turns the light off (HA's brightness_pct 0 does the same)
                    setPendingValue(bKey, v, lightBrightnessPct(stateObj!), (sent) => runServiceCall(hass!, sent <= 0
                      ? { domain: 'light', service: 'turn_off', data: { entity_id: c.entity } }
                      : { domain: 'light', service: 'turn_on', data: { entity_id: c.entity, brightness_pct: Math.round(sent) } }), update, 300);
                  },
                })}
                <span class="mc-light-value">${brightness ?? 0}%</span>
              </div>
            `
          : nothing}

        ${showTemp
          ? html`
              <div class="mc-light-control mc-light-color-temp">
                <ha-icon .icon=${'mdi:thermometer'}></ha-icon>
                ${renderTrack({
                  value: kelvin,
                  min: kRange.min,
                  max: kRange.max,
                  step: 50,
                  disabled: !live,
                  label: `${name} color temperature`,
                  valueText: kelvin !== undefined ? `${formatFixed(hass, kelvin, 0)} K` : undefined,
                  style: '--mc-slider-color: var(--mc-light-color-temp);',
                  onCommit: (v) => {
                    if (!live) return;
                    setPendingValue(kKey, v, ownKelvin, (sent) => runServiceCall(hass!, {
                      domain: 'light', service: 'turn_on', data: { entity_id: c.entity, color_temp_kelvin: Math.round(sent) },
                    }), update, 300);
                  },
                })}
                <span class="mc-light-value">${kelvin !== undefined ? `${formatFixed(hass, kelvin, 0)} K` : ''}</span>
              </div>
            `
          : nothing}

        ${showColor
          ? html`
              <div class="mc-light-control mc-light-color">
                <ha-icon .icon=${'mdi:palette'}></ha-icon>
                <input
                  type="color"
                  class="mc-light-color-input"
                  aria-label=${`${name} color`}
                  .value=${lightHex(stateObj)}
                  ?disabled=${!live}
                  @change=${(e: Event) => {
                    e.stopPropagation();
                    if (!live) return;
                    const hex = (e.target as HTMLInputElement).value;
                    runServiceCall(hass!, {
                      domain: 'light',
                      service: 'turn_on',
                      data: { entity_id: c.entity, rgb_color: [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) },
                    });
                  }}
                  @click=${stopControlEvent}
                  @pointerdown=${stopControlEvent}
                  @pointerup=${stopControlEvent}
                  @keydown=${stopControlEvent}
                />
              </div>
            `
          : nothing}

        ${showEffect
          ? html`
              <div class="mc-light-control mc-light-effect">
                <ha-icon .icon=${'mdi:creation'}></ha-icon>
                <select
                  class="mc-light-effect-select"
                  aria-label=${`${name} effect`}
                  ?disabled=${!live}
                  @change=${(e: Event) => {
                    e.stopPropagation();
                    const value = (e.target as HTMLSelectElement).value;
                    if (!live || !effects.includes(value)) return;
                    runServiceCall(hass!, { domain: 'light', service: 'turn_on', data: { entity_id: c.entity, effect: value } });
                  }}
                  @click=${stopControlEvent}
                  @pointerdown=${stopControlEvent}
                  @pointerup=${stopControlEvent}
                  @keydown=${stopControlEvent}
                >
                  ${!effect || !effects.includes(effect) ? html`<option value="" selected disabled hidden>Effect</option>` : nothing}
                  ${effects.map((ef) => html`<option value=${ef} ?selected=${ef === effect}>${this._effectLabel(hass, stateObj!, ef)}</option>`)}
                  ${selectValue(effect && effects.includes(effect) ? effect : '')}
                </select>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _effectLabel(hass: HomeAssistant | undefined, stateObj: HassEntity, effect: string): string {
    try {
      return hass?.formatEntityAttributeValue?.(stateObj, 'effect', effect) || effect;
    } catch {
      return effect;
    }
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as LightModuleConfig;
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const lacks = (on: boolean | undefined, ok: boolean, what: string) =>
      on && stateObj && !ok ? renderFieldHint(`This light has no ${what}; the control is hidden.`) : nothing;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'light', 'entity', syncCtx)}
        ${renderToggleField('Show brightness', c.show_brightness !== false, (v) =>
          onChange({ ...c, show_brightness: v }),
        'show_brightness', syncCtx)}
        ${lacks(c.show_brightness !== false, !stateObj || lightSupportsBrightness(stateObj), 'brightness')}
        ${renderToggleField('Show color temp', c.show_color_temp, (v) =>
          onChange({ ...c, show_color_temp: v }),
        'show_color_temp', syncCtx)}
        ${lacks(c.show_color_temp, !stateObj || lightSupportsColorTemp(stateObj), 'color temperature')}
        ${renderToggleField('Show color picker', c.show_color, (v) =>
          onChange({ ...c, show_color: v }),
        'show_color', syncCtx)}
        ${lacks(c.show_color, !stateObj || lightSupportsColor(stateObj), 'colors')}
        ${renderToggleField('Show effects', c.show_effect, (v) =>
          onChange({ ...c, show_effect: v }),
        'show_effect', syncCtx)}
        ${lacks(c.show_effect, !stateObj || supportsEffect(stateObj), 'effects')}
        ${renderToggleField('Compact mode', c.compact, (v) => onChange({ ...c, compact: v }), 'compact', syncCtx)}
        ${renderFieldHint("Tap the icon to turn the light on or off. Leave Icon empty to show the light's own icon.")}
        ${c.icon !== 'svg'
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v || undefined }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: c.entity,
          icon: c.icon || entityIcon(hass, c.entity) || 'mdi:lightbulb',
          allowStateIcons: !!c.entity,
          syncCtx,
        })}
      </div>
    `;
  }

  // No entity yet is not an error: the preview shows a generic, inert light until one is picked.
  validate(_config: CardModule): string[] {
    return [];
  }
}

ModuleRegistry.register(new LightModule());
