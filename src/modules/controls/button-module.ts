import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ButtonModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderSegField,
  renderIconField,
} from '../../utils/form-utils';
import { defaultButtonActions } from '../../utils/entity-control';
import { entityStateColor } from '../../utils/entity-color';
import { renderIcon } from '../../icons/render-icon';
import { renderIconFxEditor } from '../../editor/components/icon-fx-editor';
import { entityIcon, stateIcon } from '../../utils/entity-icon';
import { formatEntityValue } from '../../utils/entity-value';

class ButtonModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'button',
    name: 'Button',
    description: 'Interactive button with icon, label, and optional state display',
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
    const label = c.label || 'Button';
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

  /**
   * The first entity picked for a new button (no entity, no actions yet) writes default actions
   * into the config, like HA's button card offers; existing buttons keep their (possibly empty) actions.
   */
  private _withEntity(c: ButtonModuleConfig, entity: string): ButtonModuleConfig {
    const isNew = !c.entity && c.actions === undefined;
    return isNew && entity ? { ...c, entity, actions: defaultButtonActions(entity) } : { ...c, entity };
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as ButtonModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange(this._withEntity(c, v)), hass, undefined, 'entity', syncCtx)}
        ${renderTextField('Label', c.label, (v) => onChange({ ...c, label: v }), 'label', syncCtx)}
        ${c.entity
          ? renderToggleField('Use entity icon', c.use_entity_icon, (v) => onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)
          : nothing}
        ${!(c.use_entity_icon && c.entity) && c.icon !== 'svg'
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: c.entity,
          icon: c.use_entity_icon && c.entity ? entityIcon(hass, c.entity) || c.icon || 'mdi:gesture-tap' : c.icon,
          allowSvg: !(c.use_entity_icon && c.entity),
          allowStateIcons: !!c.entity,
          syncCtx,
        })}
        ${c.entity
          ? renderToggleField('Use entity color', c.use_entity_color, (v) => onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
            "Colors the icon like Home Assistant does for this entity's state.")
          : nothing}
        ${renderSegField(
          'Button style',
          c.button_style,
          [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Flat', value: 'flat' },
            { label: 'Icon only', value: 'icon-only' },
          ],
          (v) => onChange({ ...c, button_style: v as ButtonModuleConfig['button_style'] }),
          'button_style',
          syncCtx,
        )}
        ${renderToggleField(
          'Show state',
          c.show_state,
          (v) => onChange({ ...c, show_state: v }),
          'show_state',
          syncCtx,
          "Shows the entity's state (or the attribute picked below) next to the label.",
        )}
        ${c.show_state
          ? renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)
          : nothing}
      </div>
    `;
  }
}

ModuleRegistry.register(new ButtonModule());
