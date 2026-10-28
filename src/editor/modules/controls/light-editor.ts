import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { LightModuleConfig } from '../../../types';
import { renderToggleField, renderFieldHint, renderIconField } from '../../../utils/form-utils';
import { lightSupportsBrightness, lightSupportsColor, lightSupportsColorTemp } from '../../../utils/entity-control';
import { entityIcon } from '../../../utils/entity-icon';
import { supportsEffect } from '../../../modules/controls/light-effect';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

export const lightEditor: ModuleEditor = {
  type: 'light',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as LightModuleConfig;
    const eid = entityFor(c, scope);
    const stateObj = eid ? hass?.states[eid] : undefined;
    const lacks = (on: boolean | undefined, ok: boolean, what: string) =>
      on && stateObj && !ok ? renderFieldHint(t('card-editor.light-editor.this-light-has-no-what-the-control-is', { what })) : nothing;
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.light-editor.entity'), c, onChange, hass, scope, { domain: 'light', syncCtx })}
        ${renderToggleField(t('card-editor.light-editor.show-brightness'), c.show_brightness !== false, (v) =>
          onChange({ ...c, show_brightness: v }),
        'show_brightness', syncCtx)}
        ${lacks(c.show_brightness !== false, !stateObj || lightSupportsBrightness(stateObj), t('card-editor.light-editor.brightness'))}
        ${renderToggleField(t('card-editor.light-editor.show-colour-temp'), c.show_color_temp, (v) =>
          onChange({ ...c, show_color_temp: v }),
        'show_color_temp', syncCtx)}
        ${lacks(c.show_color_temp, !stateObj || lightSupportsColorTemp(stateObj), t('card-editor.light-editor.colour-temperature'))}
        ${renderToggleField(t('card-editor.light-editor.show-colour-picker'), c.show_color, (v) =>
          onChange({ ...c, show_color: v }),
        'show_color', syncCtx)}
        ${lacks(c.show_color, !stateObj || lightSupportsColor(stateObj), t('card-editor.light-editor.colours'))}
        ${renderToggleField(t('card-editor.light-editor.show-effects'), c.show_effect, (v) =>
          onChange({ ...c, show_effect: v }),
        'show_effect', syncCtx)}
        ${lacks(c.show_effect, !stateObj || supportsEffect(stateObj), t('card-editor.light-editor.effects'))}
        ${renderToggleField(t('card-editor.light-editor.compact-mode'), c.compact, (v) => onChange({ ...c, compact: v }), 'compact', syncCtx)}
        ${renderFieldHint(t("card-editor.light-editor.tap-the-icon-to-turn-the-light-on-or-off"))}
        ${c.icon !== 'svg'
          ? renderIconField(t('card-editor.light-editor.icon'), c.icon, (v) => onChange({ ...c, icon: v || undefined }), hass, 'icon', syncCtx, { module: c, onModule: onChange })
          : nothing}
        ${renderIconFxEditor(c, hass, onChange, {
          entity: eid,
          icon: c.icon || entityIcon(hass, eid) || 'mdi:lightbulb',
          allowStateIcons: !!eid,
          syncCtx,
        })}
      </div>
    `;
  },
};
