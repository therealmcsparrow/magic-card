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
        ${renderEntitySourceField(t('card-editor.icon-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderToggleField(t('card-editor.icon-editor.use-entity-icon'), c.use_entity_icon, (v) =>
          onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)}
        ${renderToggleField(t('card-editor.icon-editor.use-entity-colour'), c.use_entity_color, (v) =>
          onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
          t("card-editor.icon-editor.colours-the-icon-like-home-assistant"))}
        ${!c.use_entity_icon && c.icon !== 'svg'
          ? renderIconField(t('card-editor.icon-editor.icon'), c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: eid,
          icon: c.use_entity_icon ? entityIcon(hass, eid) || c.icon : c.icon || 'mdi:help',
          allowSvg: !c.use_entity_icon,
          allowStateIcons: !!eid,
          syncCtx,
        })}
        ${renderColorField(t('card-editor.icon-editor.icon-colour'), c.icon_color, (v) => onChange({ ...c, icon_color: v || undefined }), 'icon_color', syncCtx, 'linear', t('card-editor.icon-editor.the-icon-uses-this-gradient-as-its-fill'))}
        ${c.use_entity_color && c.icon_color
          ? renderFieldHint(t('card-editor.icon-editor.use-entity-colour-wins-while-the-entity'))
          : nothing}
        ${renderUnitField(t('card-editor.icon-editor.size'), c.size, (v) => onChange({ ...c, size: v || undefined }), 'size', syncCtx, '24')}
      </div>
    `;
  },
};
