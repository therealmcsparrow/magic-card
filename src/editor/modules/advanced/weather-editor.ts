import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { WeatherModuleConfig } from '../../../types';
import { renderToggleField, renderNumberField, renderFieldHint } from '../../../utils/form-utils';
import { supportedForecastTypes } from '../../../utils/weather';
import { animatedIconsNote, renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

export const weatherEditor: ModuleEditor = {
  type: 'weather',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as WeatherModuleConfig;
    const eid = entityFor(c, scope);
    const entity = eid ? hass?.states[eid] : undefined;
    const types = entity ? supportedForecastTypes(entity) : [];
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.weather-editor.weather-entity'), c, onChange, hass, scope, { domain: 'weather', syncCtx })}
        ${renderToggleField(t('card-editor.weather-editor.show-temperature'), c.show_temperature !== false, (v) => onChange({ ...c, show_temperature: v }), 'show_temperature', syncCtx)}
        ${renderToggleField(t('card-editor.weather-editor.show-condition'), c.show_condition !== false, (v) => onChange({ ...c, show_condition: v }), 'show_condition', syncCtx)}
        ${renderToggleField(t('card-editor.weather-editor.animated-icons'), c.animated_icons !== false, (v) => onChange({ ...c, animated_icons: v }), 'animated_icons', syncCtx, t('card-editor.weather-editor.animated-weather-icons-instead-of-static'))}
        ${c.animated_icons !== false ? renderFieldHint(animatedIconsNote(c.icon_fx)) : renderIconFxEditor(c, hass, onChange, { entity: eid, icon: '', syncCtx })}
        ${renderToggleField(t('card-editor.weather-editor.show-forecast'), c.show_forecast, (v) => onChange({ ...c, show_forecast: v }), 'show_forecast', syncCtx)}
        ${c.show_forecast
          ? renderNumberField(t('card-editor.weather-editor.forecast-days'), c.forecast_days, (v) => onChange({ ...c, forecast_days: v }), { min: 1, max: 14 }, 'forecast_days', syncCtx)
          : nothing}
        ${c.show_forecast && entity && types.length && !types.includes('daily')
          ? renderFieldHint(t('card-editor.weather-editor.this-entity-has-no-daily-forecast-its'))
          : nothing}
      </div>
    `;
  },
};
