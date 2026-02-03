import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, IconModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField } from '../../utils/form-utils';

class IconModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'icon',
    name: 'Icon',
    description: 'Display an icon from MDI or entity',
    category: 'content',
    icon: 'mdi:emoticon-outline',
  };

  createDefault(): IconModuleConfig {
    return {
      id: generateId('icon'),
      type: 'icon',
      icon: 'mdi:home',
      size: '24px',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as IconModuleConfig;
    let icon = c.icon || 'mdi:help';

    if (c.use_entity_icon && c.entity && hass) {
      const entity = hass.states[c.entity];
      if (entity?.attributes.icon) {
        icon = entity.attributes.icon as string;
      }
    }

    return html`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${c.size || '24px'}; color: ${c.icon_color || 'inherit'}">
        <ha-icon .icon=${icon}></ha-icon>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as IconModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderToggleField('Use Entity Icon', c.use_entity_icon, (v) =>
          onChange({ ...c, use_entity_icon: v }),
        )}
        ${!c.use_entity_icon
          ? renderTextField('Icon', c.icon, (v) => onChange({ ...c, icon: v }))
          : nothing}
        ${renderTextField('Size', c.size, (v) => onChange({ ...c, size: v }))}
        ${renderTextField('Color', c.icon_color, (v) => onChange({ ...c, icon_color: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new IconModule());
