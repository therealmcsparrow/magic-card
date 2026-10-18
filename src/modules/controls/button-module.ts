import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ButtonModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { entityStateColor } from '../../utils/entity-color';
import { renderIcon } from '../../icons/render-icon';
import { stateIcon } from '../../utils/entity-icon';
import { formatEntityValue } from '../../utils/entity-value';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

class ButtonModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'button',
    name: lm('Button'),
    description: lm('Interactive button with icon, label, and optional state display'),
    category: 'controls',
    icon: 'mdi:gesture-tap',
  };

  createDefault(): ButtonModuleConfig {
    return {
      id: generateId('button'),
      type: 'button',
      label: 'Button',
      icon: 'mdi:power',
      show_state: false,
      button_style: 'default',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ButtonModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    // the attribute (formatted by HA, with its unit) or the state
    const state = entity && c.show_state ? formatEntityValue(hass, entity, c.attribute || undefined).text : undefined;
    const label = c.label || t('Button');
    const isIconOnly = c.button_style === 'icon-only';
    const icon = c.icon || '';
    const iconFx = { hass, className: 'mc-anim-icon', part: 'icon', fx: c.icon_fx, iconOn: c.icon_on, iconOff: c.icon_off, svg: c.svg, fallbackIcon: 'mdi:gesture-tap' };
    const iconEl = c.use_entity_icon && c.entity
      ? renderIcon({ ...iconFx, icon: icon || 'mdi:gesture-tap', entity: c.entity, useEntityIcon: true })
      : // No `icon`: only the state icon for the current side, else nothing (not an empty <ha-icon>).
        icon || stateIcon(hass, c.entity, c.icon_on, c.icon_off)
        ? renderIcon({ ...iconFx, icon, entity: c.entity })
        : nothing;
    const iconColor = c.use_entity_color && entity ? entityStateColor(entity) : undefined;

    // The wrapper is the interactive element (role button, actions, focus); the inner button is its look.
    return html`
      <div class="mc-module mc-button mc-button--${c.button_style || 'default'}">
        <button
          type="button"
          tabindex="-1"
          class="mc-button-inner mc-button-inner--${c.button_style || 'default'} ${isIconOnly ? 'mc-button-inner--icon-only' : ''}"
          title=${isIconOnly ? label : nothing}
        >
          ${iconColor && iconEl !== nothing ? html`<span class="mc-button-icon" style="color: ${iconColor}">${iconEl}</span>` : iconEl}
          ${!isIconOnly ? html`<span data-mc-part="name">${label}</span>` : nothing}
          ${state
            ? html`<span class="mc-button-state" data-mc-part="state">${state}</span>`
            : nothing}
        </button>
      </div>
    `;
  }
}

ModuleRegistry.register(new ButtonModule());
