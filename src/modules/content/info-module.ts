import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, InfoModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderSelectField,
} from '../../utils/form-utils';

class InfoModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'info',
    name: 'Info',
    description: 'Display entity name, state, and attributes',
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

    const name = entity?.attributes.friendly_name || c.entity || 'No entity';
    const state = entity ? hass!.formatEntityState(entity) : '—';

    return html`
      <div class="mc-module mc-info">
        ${c.show_name ? html`<span class="mc-info-name">${name}</span>` : nothing}
        ${c.show_state
          ? html`<span class="mc-info-state">
              ${c.prefix || ''}${c.attribute && entity
                ? String(entity.attributes[c.attribute] ?? '—')
                : state}${c.suffix || ''}
            </span>`
          : nothing}
        ${c.secondary_info && entity
          ? html`<span class="mc-info-secondary"
              >${String(entity.attributes[c.secondary_info] ?? '')}</span
            >`
          : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as InfoModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderTextField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }))}
        ${renderToggleField('Show Name', c.show_name, (v) => onChange({ ...c, show_name: v }))}
        ${renderToggleField('Show State', c.show_state, (v) => onChange({ ...c, show_state: v }))}
        ${renderToggleField('Show Unit', c.show_unit, (v) => onChange({ ...c, show_unit: v }))}
        ${renderTextField('Prefix', c.prefix, (v) => onChange({ ...c, prefix: v }))}
        ${renderTextField('Suffix', c.suffix, (v) => onChange({ ...c, suffix: v }))}
        ${renderTextField('Secondary Info (attribute)', c.secondary_info, (v) =>
          onChange({ ...c, secondary_info: v }),
        )}
      </div>
    `;
  }
}

ModuleRegistry.register(new InfoModule());
