import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ButtonModuleConfig } from '../../../types';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderSegField,
  renderIconField,
} from '../../../utils/form-utils';
import { defaultButtonActions } from '../../../utils/entity-control';
import { entityIcon } from '../../../utils/entity-icon';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';

/**
 * The first entity picked for a new button (no entity, no actions yet) writes default actions
 * into the config, like HA's button card offers; existing buttons keep their (possibly empty) actions.
 */
function withEntity(c: ButtonModuleConfig, entity: string): ButtonModuleConfig {
  const isNew = !c.entity && c.actions === undefined;
  return isNew && entity ? { ...c, entity, actions: defaultButtonActions(entity) } : { ...c, entity };
}

export const buttonEditor: ModuleEditor = {
  type: 'button',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as ButtonModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange(withEntity(c, v)), hass, undefined, 'entity', syncCtx)}
        ${renderTextField('Label', c.label, (v) => onChange({ ...c, label: v }), 'label', syncCtx)}
        ${c.entity
          ? renderToggleField('Use entity icon', c.use_entity_icon, (v) => onChange({ ...c, use_entity_icon: v }), 'use_entity_icon', syncCtx)
          : nothing}
        ${!(c.use_entity_icon && c.entity) && c.icon !== 'svg'
          ? renderIconField('Icon', c.icon, (v) => onChange({ ...c, icon: v }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: c.entity,
          icon: c.use_entity_icon && c.entity ? entityIcon(hass, c.entity) || c.icon || 'mdi:gesture-tap' : c.icon,
          allowSvg: !(c.use_entity_icon && c.entity),
          allowStateIcons: !!c.entity,
          syncCtx,
        })}
        ${c.entity
          ? renderToggleField('Use entity color', c.use_entity_color, (v) => onChange({ ...c, use_entity_color: v }), 'use_entity_color', syncCtx,
            "Colors the icon like Home Assistant does for this entity's state.")
          : nothing}
        ${renderSegField(
          'Button style',
          c.button_style,
          [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Flat', value: 'flat' },
            { label: 'Icon only', value: 'icon-only' },
          ],
          (v) => onChange({ ...c, button_style: v as ButtonModuleConfig['button_style'] }),
          'button_style',
          syncCtx,
        )}
        ${renderToggleField(
          'Show state',
          c.show_state,
          (v) => onChange({ ...c, show_state: v }),
          'show_state',
          syncCtx,
          "Shows the entity's state (or the attribute picked below) next to the label.",
        )}
        ${c.show_state
          ? renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)
          : nothing}
      </div>
    `;
  },
};
