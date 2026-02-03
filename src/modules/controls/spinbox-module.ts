import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SpinboxModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderEntityField,
  renderNumberField,
} from '../../utils/form-utils';

class SpinboxModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'spinbox',
    name: 'Spinbox',
    description: 'Numeric input with increment and decrement buttons',
    category: 'controls',
    icon: 'mdi:numeric',
  };

  createDefault(): SpinboxModuleConfig {
    return {
      id: generateId('spinbox'),
      type: 'spinbox',
      min: 0,
      max: 100,
      step: 1,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SpinboxModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const currentValue = entity
      ? c.attribute
        ? Number(entity.attributes[c.attribute] ?? min)
        : Number(entity.state)
      : Math.round((min + max) / 2);

    const btnStyle = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      line-height: 1;
    `;

    return html`
      <div
        class="mc-module mc-spinbox"
        style="display: flex; align-items: center; gap: 12px;"
      >
        <button class="mc-spinbox-decrement" style="${btnStyle}">
          &minus;
        </button>
        <span
          class="mc-spinbox-value"
          style="font-size: 20px; font-weight: 600; min-width: 40px; text-align: center;"
        >
          ${currentValue}
        </span>
        <button class="mc-spinbox-increment" style="${btnStyle}">
          +
        </button>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as SpinboxModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderTextField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }))}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }))}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }))}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: v }), { min: 0.01, step: 0.01 })}
      </div>
    `;
  }
}

ModuleRegistry.register(new SpinboxModule());
