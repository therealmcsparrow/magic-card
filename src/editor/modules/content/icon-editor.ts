import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { IconModuleConfig } from '../../../types';
import { renderUnitField, renderToggleField, renderColorField, renderIconField, renderFieldHint } from '../../../utils/form-utils';
import { entityIcon } from '../../../utils/entity-icon';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

export const iconEditor: ModuleEditor = {
  type: 'icon',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as IconModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderToggleField(t('Use entity icon'), c.use_entity_icon, (v) =>
          onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)}
        ${renderToggleField(t('Use entity colour'), c.use_entity_color, (v) =>
          onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
          t("Colours the icon like Home Assistant does for this entity's state."))}
        ${!c.use_entity_icon && c.icon !== 'svg'
          ? renderIconField(t('Icon'), c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: eid,
          icon: c.use_entity_icon ? entityIcon(hass, eid) || c.icon : c.icon || 'mdi:help',
          allowSvg: !c.use_entity_icon,
          allowStateIcons: !!eid,
          syncCtx,
        })}
        ${renderColorField(t('Icon colour'), c.icon_color, (v) => onChange({ ...c, icon_color: v || undefined }), 'icon_color', syncCtx, 'linear', t('The icon uses this gradient as its fill. Older tablets show the first colour.'))}
        ${c.use_entity_color && c.icon_color
          ? renderFieldHint(t('Use entity colour wins while the entity has a state colour; this colour applies otherwise.'))
          : nothing}
        ${renderUnitField(t('Size'), c.size, (v) => onChange({ ...c, size: v || undefined }), 'size', syncCtx, '24')}
      </div>
    `;
  },
};
