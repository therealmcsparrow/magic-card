import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { InfoModuleConfig } from '../../../types';
import {
  renderTextField,
  renderToggleField,
    renderAttributeField,
  renderIconField,
} from '../../../utils/form-utils';
import { entityIcon } from '../../../utils/entity-icon';
import { infoToggles } from '../../../modules/content/info-module';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const infoEditor: ModuleEditor = {
  type: 'info',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as InfoModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);
    const shown = infoToggles(c);
    // A toggle writes both keys, so switching one off never switches the other (a missing key) off.
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${renderToggleField(t('Show name'), shown.name, (v) => onChange({ ...c, show_name: v, show_state: shown.state }), 'show_name', syncCtx)}
        ${renderToggleField(t('Show state'), shown.state, (v) => onChange({ ...c, show_name: shown.name, show_state: v }), 'show_state', syncCtx,
          !shown.name && !shown.state && !c.secondary_info ? t('With nothing else shown, the state is shown anyway.') : undefined)}
        ${shown.state
          ? renderToggleField(t('Show unit'), c.show_unit !== false, (v) => onChange({ ...c, show_unit: v }), 'show_unit', syncCtx)
          : nothing}
        ${renderToggleField(t('Show icon'), c.show_icon, (v) => onChange({ ...c, show_icon: v }), 'show_icon', syncCtx)}
        ${c.show_icon && c.icon !== 'svg'
          ? renderIconField(t('Icon'), c.icon, (v) => onChange({ ...c, icon: v || undefined }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${c.show_icon
          ? renderIconFxEditor(c, hass, onChange, {
              entity: eid,
              icon: c.icon || entityIcon(hass, eid) || 'mdi:information-outline',
              allowSvg: true,
              allowStateIcons: !!eid,
              syncCtx,
            })
          : nothing}
        ${renderTextField(t('Prefix'), c.prefix, (v) => onChange({ ...c, prefix: v }), 'prefix', syncCtx)}
        ${renderTextField(t('Suffix'), c.suffix, (v) => onChange({ ...c, suffix: v }), 'suffix', syncCtx)}
        ${renderAttributeField(t('Secondary info'), c.secondary_info, (v) =>
          onChange({ ...c, secondary_info: v }), hass, eid, 'secondary_info', syncCtx, attributeCaption(scope))}
      </div>
    `;
  },
};
