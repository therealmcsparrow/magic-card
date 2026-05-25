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
  renderSelectField,
  renderIconField,
} from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

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
    const state = entity ? hass!.formatEntityState(entity) : undefined;
    const label = c.label || 'Button';
    const isIconOnly = c.button_style === 'icon-only';

    return html`
      <div class="mc-module mc-button mc-button--${c.button_style || 'default'}">
        <button
          class="mc-button-inner mc-button-inner--${c.button_style || 'default'} ${isIconOnly ? 'mc-button-inner--icon-only' : ''}"
        >
          ${c.icon ? html`<ha-icon .icon=${c.icon}></ha-icon>` : nothing}
          ${!isIconOnly ? html`<span>${label}</span>` : nothing}
          ${c.show_state && state
            ? html`<span class="mc-button-state">${state}</span>`
            : nothing}
        </button>
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
    const c = config as ButtonModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderTextField('Label', c.label, (v) => onChange({ ...c, label: v }), 'label', syncCtx)}
        ${renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx)}
        ${renderSelectField(
          'Button Style',
          c.button_style,
          [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Flat', value: 'flat' },
            { label: 'Icon Only', value: 'icon-only' },
          ],
          (v) => onChange({ ...c, button_style: v as ButtonModuleConfig['button_style'] }),
          'button_style',
          syncCtx,
        )}
        ${renderToggleField('Show State', c.show_state, (v) => onChange({ ...c, show_state: v }), 'show_state', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new ButtonModule());
