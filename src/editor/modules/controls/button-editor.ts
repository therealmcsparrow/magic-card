import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ButtonModuleConfig, CardModule } from '../../../types';
import {
  renderTextField,
  renderToggleField,
  renderAttributeField,
  renderSegField,
  renderIconField,
} from '../../../utils/form-utils';
import { defaultButtonActions } from '../../../utils/entity-control';
import { entityIcon } from '../../../utils/entity-icon';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField, withEntityKey } from '../../components/entity-source';

/**
 * The first entity picked for a new button (no entity, no actions yet) writes default actions
 * into the config, like HA's button card offers; existing buttons keep their (possibly empty) actions.
 */
function withEntity(config: CardModule, entity: string | undefined, current: string | undefined): CardModule {
  const c = config as ButtonModuleConfig;
  const isNew = !current && c.actions === undefined;
  return isNew && entity ? { ...c, entity, actions: defaultButtonActions(entity) } : withEntityKey(c, entity);
}

export const buttonEditor: ModuleEditor = {
  type: 'button',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as ButtonModuleConfig;
    const eid = entityFor(c, scope);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx, write: (m, e) => withEntity(m, e, eid) })}
        ${renderTextField(t('Label'), c.label, (v) => onChange({ ...c, label: v }), 'label', syncCtx)}
        ${eid
          ? renderToggleField(t('Use entity icon'), c.use_entity_icon, (v) => onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)
          : nothing}
        ${!(c.use_entity_icon && eid) && c.icon !== 'svg'
          ? renderIconField(t('Icon'), c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: eid,
          icon: c.use_entity_icon && eid ? entityIcon(hass, eid) || c.icon || 'mdi:gesture-tap' : c.icon,
          allowSvg: !(c.use_entity_icon && eid),
          allowStateIcons: !!eid,
          syncCtx,
        })}
        ${eid
          ? renderToggleField(t('Use entity colour'), c.use_entity_color, (v) => onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
            t("Colours the icon like Home Assistant does for this entity's state."))
          : nothing}
        ${renderSegField(
          t('Button style'),
          c.button_style,
          [
            { label: t('Default'), value: 'default' },
            { label: t('Outline'), value: 'outline' },
            { label: t('Flat'), value: 'flat' },
            { label: t('Icon only'), value: 'icon-only' },
          ],
          (v) => onChange({ ...c, button_style: v as ButtonModuleConfig['button_style'] }),
          'button_style',
          syncCtx,
        )}
        ${renderToggleField(
          t('Show state'),
          c.show_state,
          (v) => onChange({ ...c, show_state: v }),
          'show_state',
          syncCtx,
          t("Shows the entity's state (or the attribute picked below) next to the label."),
        )}
        ${c.show_state
          ? renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx)
          : nothing}
      </div>
    `;
  },
};
