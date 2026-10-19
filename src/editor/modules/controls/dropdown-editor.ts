import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { DropdownModuleConfig } from '../../../types';
import {
  renderTextField,
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
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const dropdownEditor: ModuleEditor = {
  type: 'dropdown',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as DropdownModuleConfig;
    const eid = entityFor(c, scope);
    const options = normalizeOptions(c.options);
    const stateObj = eid ? hass?.states[eid] : undefined;
    const ad = stateObj ? adapterFor(stateObj, c.attribute) : undefined;
    const valid = validOptions(stateObj, ad, options);
    const write = (next: DropdownOption[]) => onChange({ ...c, options: next.length ? next : undefined });

    const addOption = () => {
      const unused = valid.find((v) => !options.some((o) => o.value === v));
      // not option_N: three of those would read as the old dummy defaults
      const value = unused ?? `value_${options.length + 1}`;
      write([...options, { label: unused ?? t('Option {n}', { n: options.length + 1 }), value }]);
    };
    const removeOption = (index: number) => write(options.filter((_, i) => i !== index));
    const updateOption = (index: number, key: 'label' | 'value', val: string) =>
      write(options.map((opt, i) => (i === index ? { ...opt, [key]: val } : opt)));

    const attrs = dropdownAttributes(eid);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${attrs.length
          ? renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))
          : nothing}
        ${attrs.length
          ? renderFieldHint(t('Sets {attributes}; empty: {fallback}.', { attributes: attrs.join(', '), fallback: stateObj?.entity_id.startsWith('climate.') ? t('the HVAC mode') : attrs[0] }))
          : nothing}
        ${stateObj && !ad
          ? renderFieldHint(t('This entity has no options a dropdown can set (use an input select, select, input text or text with custom options, climate, fan, light, media player, water heater or humidifier).'))
          : nothing}

        <div class="mc-section">
          <div class="mc-field">${renderFieldHead(t('Custom options'), 'options', syncCtx)}</div>
          ${renderFieldHint(
            t("Leave empty to offer the entity's own options. Custom options rename or pick from them; a value the entity does not offer is shown disabled."),
            'mc-field-hint-with-margin',
          )}
          <div class="mc-options-list">
            ${options.map(
              (opt, i) => html`
                <div class="mc-option-item mc-option-row">
                  ${renderTextField(t('Label'), opt.label, (v) => updateOption(i, 'label', v))}
                  ${renderTextField(t('Value'), opt.value, (v) => updateOption(i, 'value', v))}
                  <button type="button" class="mc-btn-icon" aria-label=${t('Remove option')} title=${t('Remove option')} @click=${() => removeOption(i)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                ${stateObj && ad && opt.value && !valid.includes(opt.value)
                  ? renderFieldHint(t('"{value}" is not one of the entity\'s options.', { value: opt.value }))
                  : nothing}
              `,
            )}
          </div>
          <button type="button" class="mc-btn mc-btn-secondary" @click=${addOption}>${t('Add option')}</button>
        </div>
      </div>
    `;
  },
};
