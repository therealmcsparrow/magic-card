import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { IconModuleConfig } from '../../../types';
import { renderUnitField, renderToggleField, renderEntityField, renderColorField, renderIconField, renderFieldHint } from '../../../utils/form-utils';
import { entityIcon } from '../../../utils/entity-icon';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';

export const iconEditor: ModuleEditor = {
  type: 'icon',
  general(config, hass, onChange, template) {
    const c = config as IconModuleConfig;
    const syncCtx = buildSyncContext(config, template);
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
  },
};
