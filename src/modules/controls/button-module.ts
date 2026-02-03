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
  renderSelectField,
} from '../../utils/form-utils';

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
          class="mc-button-inner"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: ${isIconOnly ? '8px' : '8px 16px'};
            border-radius: 8px;
            border: ${c.button_style === 'outline' ? '1px solid var(--primary-color, #03a9f4)' : 'none'};
            background: ${c.button_style === 'flat' || c.button_style === 'outline'
              ? 'transparent'
              : 'var(--primary-color, #03a9f4)'};
            color: ${c.button_style === 'flat' || c.button_style === 'outline'
              ? 'var(--primary-color, #03a9f4)'
              : '#fff'};
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          ${c.icon ? html`<ha-icon .icon=${c.icon} style="--mdc-icon-size: 20px;"></ha-icon>` : nothing}
          ${!isIconOnly ? html`<span>${label}</span>` : nothing}
          ${c.show_state && state
            ? html`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${state}</span>`
            : nothing}
        </button>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as ButtonModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderTextField('Label', c.label, (v) => onChange({ ...c, label: v }))}
        ${renderTextField('Icon', c.icon, (v) => onChange({ ...c, icon: v }))}
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
        )}
        ${renderToggleField('Show State', c.show_state, (v) => onChange({ ...c, show_state: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new ButtonModule());
