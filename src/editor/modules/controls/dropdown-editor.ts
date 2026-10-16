import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { DropdownModuleConfig } from '../../../types';
import {
  renderTextField,
  renderEntityField,
  renderAttributeField,
  renderFieldHint,
  renderFieldHead,
} from '../../../utils/form-utils';
import {
  adapterFor,
  dropdownAttributes,
  normalizeOptions,
  validOptions,
  type DropdownOption,
} from '../../../modules/controls/dropdown-module';
import { buildSyncContext } from '../base-editor';

export const dropdownEditor: ModuleEditor = {
  type: 'dropdown',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as DropdownModuleConfig;
    const options = normalizeOptions(c.options);
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const ad = stateObj ? adapterFor(stateObj, c.attribute) : undefined;
    const valid = validOptions(stateObj, ad, options);
    const write = (next: DropdownOption[]) => onChange({ ...c, options: next.length ? next : undefined });

    const addOption = () => {
      const unused = valid.find((v) => !options.some((o) => o.value === v));
      // not option_N: three of those would read as the old dummy defaults
      const value = unused ?? `value_${options.length + 1}`;
      write([...options, { label: unused ?? `Option ${options.length + 1}`, value }]);
    };
    const removeOption = (index: number) => write(options.filter((_, i) => i !== index));
    const updateOption = (index: number, key: 'label' | 'value', val: string) =>
      write(options.map((opt, i) => (i === index ? { ...opt, [key]: val } : opt)));

    const attrs = dropdownAttributes(c.entity);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${attrs.length
          ? renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)
          : nothing}
        ${attrs.length
          ? renderFieldHint(`Sets ${attrs.join(', ')}; empty: ${stateObj?.entity_id.startsWith('climate.') ? 'the HVAC mode' : attrs[0]}.`)
          : nothing}
        ${stateObj && !ad
          ? renderFieldHint('This entity has no options a dropdown can set (use an input select, select, input text or text with custom options, climate, fan, light, media player, water heater or humidifier).')
          : nothing}

        <div class="mc-section">
          <div class="mc-field">${renderFieldHead('Custom options', 'options', syncCtx)}</div>
          ${renderFieldHint(
            "Leave empty to offer the entity's own options. Custom options rename or pick from them; a value the entity does not offer is shown disabled.",
            'mc-field-hint-with-margin',
          )}
          <div class="mc-options-list">
            ${options.map(
              (opt, i) => html`
                <div class="mc-option-item mc-option-row">
                  ${renderTextField('Label', opt.label, (v) => updateOption(i, 'label', v))}
                  ${renderTextField('Value', opt.value, (v) => updateOption(i, 'value', v))}
                  <button type="button" class="mc-btn-icon" aria-label="Remove option" title="Remove option" @click=${() => removeOption(i)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                ${stateObj && ad && opt.value && !valid.includes(opt.value)
                  ? renderFieldHint(`"${opt.value}" is not one of the entity's options.`)
                  : nothing}
              `,
            )}
          </div>
          <button type="button" class="mc-btn mc-btn-secondary" @click=${addOption}>Add option</button>
        </div>
      </div>
    `;
  },
};
