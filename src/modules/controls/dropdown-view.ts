import { html, TemplateResult, nothing } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HassEntity, HomeAssistant, DropdownModuleConfig } from '../../types';
import { runServiceCall, ServiceCall } from '../../utils/entity-control';
import { selectValue } from '../../utils/select-value';
import { stopControlEvent } from '../../utils/slider-track';
import { entityDisplayName } from '../../utils/entity-value';
import { t } from './i18n';
import { adapterFor, normalizeOptions, validOptions, type DropdownOption, type SelectAdapter } from './dropdown-options';

export class DropdownView implements ModuleView {
  /** An option translated like HA shows it (select states, climate modes, presets, ...). */
  private _optionLabel(hass: HomeAssistant | undefined, stateObj: HassEntity, ad: SelectAdapter, option: string): string {
    try {
      const text = ad.current
        ? hass?.formatEntityAttributeValue?.(stateObj, ad.current, option)
        : hass?.formatEntityState?.(stateObj, option);
      return text || option;
    } catch {
      return option;
    }
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as DropdownModuleConfig;
    const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
    const ad = stateObj ? adapterFor(stateObj, c.attribute) : undefined;
    const custom = normalizeOptions(c.options);
    const valid = validOptions(stateObj, ad, custom);
    const unavailable = !!stateObj && (stateObj.state === 'unavailable' || stateObj.state === 'unknown');

    // Custom options relabel / pick from the entity's options; without an entity they are a static list.
    let options: Array<DropdownOption & { disabled?: boolean }>;
    if (custom.length) {
      options = custom.map((o) => ({ ...o, disabled: !!stateObj && (!ad || !valid.includes(o.value)) }));
    } else if (stateObj && ad) {
      options = valid.map((v) => ({ label: this._optionLabel(hass, stateObj, ad, v), value: v }));
    } else {
      options = [];
    }

    const current = stateObj
      ? ad?.current
        ? String(stateObj.attributes?.[ad.current] ?? '')
        : c.attribute
          ? String(stateObj.attributes?.[c.attribute] ?? '')
          : stateObj.state
      : undefined;
    const known = current !== undefined && options.some((o) => o.value === current);
    const currentLabel = stateObj && current
      ? ad
        ? this._optionLabel(hass, stateObj, ad, current)
        : current
      : '';
    const canSet = !!stateObj && !!ad && !unavailable && !!hass;

    const handleChange = (e: Event) => {
      e.stopPropagation();
      const select = e.target as HTMLSelectElement;
      const value = select.value;
      if (!canSet || !stateObj || !ad || !hass || !valid.includes(value)) {
        select.value = known ? current! : ''; // not sendable: show the entity's option again
        return;
      }
      const call: ServiceCall = {
        domain: stateObj.entity_id.split('.')[0],
        service: ad.service,
        data: { entity_id: stateObj.entity_id, [ad.field]: value },
      };
      runServiceCall(hass, call);
    };

    const name = stateObj ? entityDisplayName(hass, stateObj) : t('controls.dropdown-view.dropdown');
    return html`
      <div class="mc-module mc-dropdown">
        <select
          aria-label=${name}
          ?disabled=${!canSet}
          @change=${handleChange}
          @click=${stopControlEvent}
          @pointerdown=${stopControlEvent}
          @pointerup=${stopControlEvent}
          @keydown=${stopControlEvent}
        >
          ${!known && stateObj
            ? html`<option value="" disabled selected hidden>${unavailable ? (hass?.formatEntityState?.(stateObj) ?? stateObj.state) : currentLabel}</option>`
            : nothing}
          ${options.length > 0
            ? options.map(
                (opt) => html`<option value=${opt.value} ?disabled=${opt.disabled} ?selected=${current === opt.value}>${opt.label}</option>`,
              )
            : html`<option disabled ?selected=${!stateObj}>${t('controls.dropdown-view.no-options')}</option>`}
          ${stateObj && options.length ? selectValue(known ? current! : '') : nothing}
        </select>
      </div>
    `;
  }
}
