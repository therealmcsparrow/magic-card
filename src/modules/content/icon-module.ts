import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, IconModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField, renderAttributeField, renderColorField, renderIconField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

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
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as IconModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderToggleField('Use Entity Icon', c.use_entity_icon, (v) =>
          onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)}
        ${!c.use_entity_icon
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx)
          : nothing}
        ${renderTextField('Size', c.size, (v) => onChange({ ...c, size: v }), 'size', syncCtx)}
      </div>
    `;
  }
}
/*         ${renderColorField('Color', c.icon_color, (v) => onChange({ ...c, icon_color: v }))}  */
ModuleRegistry.register(new IconModule());
