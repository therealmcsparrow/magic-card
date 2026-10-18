import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { LightModuleConfig } from '../../../types';
import { renderToggleField, renderEntityField, renderFieldHint, renderIconField } from '../../../utils/form-utils';
import { lightSupportsBrightness, lightSupportsColor, lightSupportsColorTemp } from '../../../utils/entity-control';
import { entityIcon } from '../../../utils/entity-icon';
import { supportsEffect } from '../../../modules/controls/light-module';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const lightEditor: ModuleEditor = {
  type: 'light',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as LightModuleConfig;
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const lacks = (on: boolean | undefined, ok: boolean, what: string) =>
      on && stateObj && !ok ? renderFieldHint(t('This light has no {what}; the control is hidden.', { what })) : nothing;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField(t('Entity'), c.entity, (v) => onChange({ ...c, entity: v }), hass, 'light', 'entity', syncCtx)}
        ${renderToggleField(t('Show brightness'), c.show_brightness !== false, (v) =>
          onChange({ ...c, show_brightness: v }),
        'show_brightness', syncCtx)}
        ${lacks(c.show_brightness !== false, !stateObj || lightSupportsBrightness(stateObj), t('brightness'))}
        ${renderToggleField(t('Show colour temp'), c.show_color_temp, (v) =>
          onChange({ ...c, show_color_temp: v }),
        'show_color_temp', syncCtx)}
        ${lacks(c.show_color_temp, !stateObj || lightSupportsColorTemp(stateObj), t('colour temperature'))}
        ${renderToggleField(t('Show colour picker'), c.show_color, (v) =>
          onChange({ ...c, show_color: v }),
        'show_color', syncCtx)}
        ${lacks(c.show_color, !stateObj || lightSupportsColor(stateObj), t('colours'))}
        ${renderToggleField(t('Show effects'), c.show_effect, (v) =>
          onChange({ ...c, show_effect: v }),
        'show_effect', syncCtx)}
        ${lacks(c.show_effect, !stateObj || supportsEffect(stateObj), t('effects'))}
        ${renderToggleField(t('Compact mode'), c.compact, (v) => onChange({ ...c, compact: v }), 'compact', syncCtx)}
        ${renderFieldHint(t("Tap the icon to turn the light on or off. Leave Icon empty to show the light's own icon."))}
        ${c.icon !== 'svg'
          ? renderIconField(t('Icon'), c.icon, (v) => onChange({ ...c, icon: v || undefined }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: c.entity,
          icon: c.icon || entityIcon(hass, c.entity) || 'mdi:lightbulb',
          allowStateIcons: !!c.entity,
          syncCtx,
        })}
      </div>
    `;
  },
};
