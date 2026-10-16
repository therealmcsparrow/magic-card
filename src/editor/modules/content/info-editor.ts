import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { InfoModuleConfig } from '../../../types';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderIconField,
} from '../../../utils/form-utils';
import { entityIcon } from '../../../utils/entity-icon';
import { infoToggles } from '../../../modules/content/info-module';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';

export const infoEditor: ModuleEditor = {
  type: 'info',
  general(config, hass, onChange, template) {
    const c = config as InfoModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    const shown = infoToggles(c);
    // A toggle writes both keys, so switching one off never switches the other (a missing key) off.
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderToggleField('Show name', shown.name, (v) => onChange({ ...c, show_name: v, show_state: shown.state }), 'show_name', syncCtx)}
        ${renderToggleField('Show state', shown.state, (v) => onChange({ ...c, show_name: shown.name, show_state: v }), 'show_state', syncCtx,
          !shown.name && !shown.state && !c.secondary_info ? 'With nothing else shown, the state is shown anyway.' : undefined)}
        ${shown.state
          ? renderToggleField('Show unit', c.show_unit !== false, (v) => onChange({ ...c, show_unit: v }), 'show_unit', syncCtx)
          : nothing}
        ${renderToggleField('Show icon', c.show_icon, (v) => onChange({ ...c, show_icon: v }), 'show_icon', syncCtx)}
        ${c.show_icon && c.icon !== 'svg'
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v || undefined }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${c.show_icon
          ? renderIconFxEditor(c, hass, onChange, {
              entity: c.entity,
              icon: c.icon || entityIcon(hass, c.entity) || 'mdi:information-outline',
              allowSvg: true,
              allowStateIcons: !!c.entity,
              syncCtx,
            })
          : nothing}
        ${renderTextField('Prefix', c.prefix, (v) => onChange({ ...c, prefix: v }), 'prefix', syncCtx)}
        ${renderTextField('Suffix', c.suffix, (v) => onChange({ ...c, suffix: v }), 'suffix', syncCtx)}
        ${renderAttributeField('Secondary info', c.secondary_info, (v) =>
          onChange({ ...c, secondary_info: v }), hass, c.entity, 'secondary_info', syncCtx)}
      </div>
    `;
  },
};
