import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, InfoModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { entityDisplayName, formatEntityValue } from '../../utils/entity-value';
import { renderIcon } from '../../icons/render-icon';
import { entityStateColor } from '../../utils/entity-color';
import { timerCountdown } from '../../utils/timer';
import { countdown } from '../../utils/timer-countdown';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

/**
 * Name and state toggles: both on when neither key is set (new YAML, like the default). Once one is
 * set, a missing other key is off, as in configs from before the defaults.
 */
export function infoToggles(c: InfoModuleConfig): { name: boolean; state: boolean } {
  if (c.show_name === undefined && c.show_state === undefined) return { name: true, state: true };
  return { name: !!c.show_name, state: !!c.show_state };
}

class InfoModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'info',
    name: lm('labels.info-module.info'),
    description: lm('labels.info-module.display-entity-name-state-and-attributes'),
    category: 'content',
    icon: 'mdi:information-outline',
  };

  createDefault(): InfoModuleConfig {
    return {
      id: generateId('info'),
      type: 'info',
      show_name: true,
      show_state: true,
      show_unit: true,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as InfoModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;

    // With both off and no secondary info the module would be empty: it shows the state.
    let { name: showName, state: showState } = infoToggles(c);
    if (!showName && !showState && !c.secondary_info) showState = true;
    if (!showName && !showState && !entity) showName = true;

    const name = entity ? entityDisplayName(hass, entity) : c.entity || t('No entity');
    let state: string | ReturnType<typeof countdown> = '—';
    if (entity && !c.attribute && timerCountdown(entity) !== undefined) {
      // an active / paused timer: its remaining time, counting down live
      state = countdown(entity);
    } else if (entity) {
      const v = formatEntityValue(hass, entity, c.attribute || undefined);
      state = c.show_unit === false ? v.value : v.text;
    }
    const secondary = entity && c.secondary_info ? formatEntityValue(hass, entity, c.secondary_info).text : '';

    const lines = html`
      ${showName ? html`<span class="mc-info-name" data-mc-part="name">${name}</span>` : nothing}
      ${showState
        ? html`<span class="mc-info-state" data-mc-part="state">${c.prefix || ''}${state}${c.suffix || ''}</span>`
        : nothing}
      ${secondary ? html`<span class="mc-info-secondary">${secondary}</span>` : nothing}
    `;
    if (!c.show_icon) return html`<div class="mc-module mc-info">${lines}</div>`;

    // icon: the configured one, else the entity's (as HA picks it), in its state colour unless a design colour is set
    const icon = renderIcon({
      icon: c.icon || 'mdi:information-outline',
      entity: c.entity,
      hass,
      useEntityIcon: !c.icon,
      className: 'mc-anim-icon',
      part: 'icon',
      fx: c.icon_fx,
      iconOn: c.icon_on,
      iconOff: c.icon_off,
      svg: c.svg,
      fallbackIcon: 'mdi:information-outline',
    });
    const color = entity ? entityStateColor(entity) : undefined;
    return html`
      <div class="mc-module mc-info mc-info--icon">
        <span class="mc-info-icon" style=${color ? `color: var(--mc-design-color, ${color})` : nothing}>${icon}</span>
        <div class="mc-info-text">${lines}</div>
      </div>
    `;
  }

}

ModuleRegistry.register(new InfoModule());
