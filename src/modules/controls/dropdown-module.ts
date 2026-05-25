import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, DropdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderEntityField,
  renderAttributeField,
  renderFieldHint,
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

  private _callEntityService(
    hass: HomeAssistant,
    entityId: string,
    value: string,
  ): void {
    const domain = entityId.split('.')[0];

    switch (domain) {
      case 'input_select':
        hass.callService('input_select', 'select_option', { entity_id: entityId, option: value });
        break;
      case 'select':
        hass.callService('select', 'select_option', { entity_id: entityId, option: value });
        break;
      case 'input_text':
        hass.callService('input_text', 'set_value', { entity_id: entityId, value });
        break;
      default:
        hass.callService(domain, 'select_option', { entity_id: entityId, option: value });
        break;
    }
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as DropdownModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const currentValue = entity
      ? c.attribute
        ? String(entity.attributes[c.attribute] ?? '')
        : entity.state
      : undefined;

    // Use entity's options if available and no custom options defined
    const entityOptions = entity?.attributes.options as string[] | undefined;
    const customOptions = c.options || [];
    const options = customOptions.length > 0
      ? customOptions
      : (entityOptions || []).map((opt) => ({ label: opt, value: opt }));

    const handleChange = (e: Event) => {
      e.stopPropagation();
      if (!c.entity || !hass) return;
      const value = (e.target as HTMLSelectElement).value;
      this._callEntityService(hass, c.entity, value);
    };

    return html`
      <div class="mc-module mc-dropdown">
        <select @change=${handleChange} @click=${(e: Event) => e.stopPropagation()}>
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
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
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
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}

        <div class="mc-section">
          <div class="mc-section-header">Custom Options</div>
          ${renderFieldHint(
            "Leave empty to use entity's built-in options (input_select/select entities).",
            'mc-field-hint-with-margin',
          )}
          <div class="mc-options-list">
            ${options.map(
              (opt, i) => html`
                <div class="mc-option-item mc-option-row">
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
