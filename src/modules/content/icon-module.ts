import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, IconModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderUnitField, renderToggleField, renderEntityField, renderColorField, renderIconField, renderFieldHint } from '../../utils/form-utils';
import { entityStateColor } from '../../utils/entity-color';
import { renderIcon } from '../../icons/render-icon';
import { renderIconFxEditor } from '../../editor/components/icon-fx-editor';
import { entityIcon } from '../../utils/entity-icon';

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
    const icon = c.icon || 'mdi:help';
    // Entity icon as HA resolves it (registry, attribute, translations / state defaults), not only
    // the `icon` attribute most entities don't have.
    const iconEl = renderIcon({
      icon,
      entity: c.entity,
      hass,
      useEntityIcon: c.use_entity_icon,
      className: 'mc-anim-icon',
      part: 'icon',
      fx: c.icon_fx,
      iconOn: c.icon_on,
      iconOff: c.icon_off,
      svg: c.svg,
      fallbackIcon: 'mdi:help',
    });

    // use_entity_color > icon_color > design colour (inherited) > theme default
    const entityColor = c.use_entity_color && c.entity ? entityStateColor(hass?.states[c.entity]) : undefined;
    const color = entityColor || c.icon_color || 'inherit';

    return html`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${c.size || '24px'}; color: ${color}">
        ${iconEl}
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
        ${renderToggleField('Use entity icon', c.use_entity_icon, (v) =>
          onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)}
        ${renderToggleField('Use entity color', c.use_entity_color, (v) =>
          onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
          "Colors the icon like Home Assistant does for this entity's state.")}
        ${!c.use_entity_icon && c.icon !== 'svg'
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: c.entity,
          icon: c.use_entity_icon ? entityIcon(hass, c.entity) || c.icon : c.icon || 'mdi:help',
          allowSvg: !c.use_entity_icon,
          allowStateIcons: !!c.entity,
          syncCtx,
        })}
        ${renderColorField('Icon color', c.icon_color, (v) => onChange({ ...c, icon_color: v || undefined }), 'icon_color', syncCtx)}
        ${c.use_entity_color && c.icon_color
          ? renderFieldHint('Use entity color wins while the entity has a state color; this color applies otherwise.')
          : nothing}
        ${renderUnitField('Size', c.size, (v) => onChange({ ...c, size: v || undefined }), 'size', syncCtx, '24')}
      </div>
    `;
  }
}
ModuleRegistry.register(new IconModule());
