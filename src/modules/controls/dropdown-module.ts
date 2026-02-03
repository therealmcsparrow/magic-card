import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, DropdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderEntityField,
} from '../../utils/form-utils';

class DropdownModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'Select dropdown for choosing from a list of options',
    category: 'controls',
    icon: 'mdi:form-dropdown',
  };

  createDefault(): DropdownModuleConfig {
    return {
      id: generateId('dropdown'),
      type: 'dropdown',
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ],
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as DropdownModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const currentValue = entity
      ? c.attribute
        ? String(entity.attributes[c.attribute] ?? '')
        : entity.state
      : undefined;
    const options = c.options || [];

    return html`
      <div class="mc-module mc-dropdown" style="width: 100%;">
        <select
          class="mc-dropdown-select"
          style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #212121);
            font-size: 14px;
            cursor: pointer;
            appearance: auto;
          "
        >
          ${options.length > 0
            ? options.map(
                (opt) => html`
                  <option value=${opt.value} ?selected=${currentValue === opt.value}>
                    ${opt.label}
                  </option>
                `,
              )
            : html`<option disabled selected>No options</option>`}
        </select>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as DropdownModuleConfig;
    const options = c.options || [];

    const addOption = () => {
      const newOptions = [...options, { label: `Option ${options.length + 1}`, value: `option_${options.length + 1}` }];
      onChange({ ...c, options: newOptions });
    };

    const removeOption = (index: number) => {
      const newOptions = options.filter((_, i) => i !== index);
      onChange({ ...c, options: newOptions });
    };

    const updateOption = (index: number, key: 'label' | 'value', val: string) => {
      const newOptions = options.map((opt, i) =>
        i === index ? { ...opt, [key]: val } : opt,
      );
      onChange({ ...c, options: newOptions });
    };

    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderTextField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${options.map(
              (opt, i) => html`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${renderTextField('Label', opt.label, (v) => updateOption(i, 'label', v))}
                  ${renderTextField('Value', opt.value, (v) => updateOption(i, 'value', v))}
                  <button class="mc-btn-icon" @click=${() => removeOption(i)}>&times;</button>
                </div>
              `,
            )}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${addOption}>Add Option</button>
        </div>
      </div>
    `;
  }
}

ModuleRegistry.register(new DropdownModule());
