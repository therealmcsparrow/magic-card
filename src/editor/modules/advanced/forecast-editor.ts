import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ForecastModuleConfig } from '../../../types';
import { renderToggleField, renderNumberField, renderSelectField, renderFieldHint } from '../../../utils/form-utils';
import { type ForecastType, supportedForecastTypes } from '../../../utils/weather';
import { animatedIconsNote, renderIconFxEditor } from '../../components/icon-fx-editor';
import { entityFor, buildSyncContext } from '../base-editor';
import { t, m, type MessageIndex } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

const TYPE_LABELS: Record<ForecastType, MessageIndex> = { daily: m('card-editor.forecast-editor.daily'), hourly: m('card-editor.forecast-editor.hourly'), twice_daily: m('card-editor.forecast-editor.twice-daily') };

export const forecastEditor: ModuleEditor = {
  type: 'forecast',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as ForecastModuleConfig;
    const eid = entityFor(c, scope);
    const entity = eid ? hass?.states[eid] : undefined;
    const supported = entity ? supportedForecastTypes(entity) : [];
    const current = c.forecast_type ?? 'daily';
    const fallback = entity && supported.length && !supported.includes(current) ? supported[0] : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.forecast-editor.weather-entity'), c, onChange, hass, scope, { domain: 'weather', syncCtx })}
        ${renderSelectField(t('card-editor.forecast-editor.forecast-type'), current, (['daily', 'hourly', 'twice_daily'] as ForecastType[]).map((ft) => ({
          label: entity && supported.length && !supported.includes(ft) ? t('card-editor.forecast-editor.type-not-provided-by-this-entity', { type: t(TYPE_LABELS[ft]) }) : t(TYPE_LABELS[ft]),
          value: ft,
        })), (v) => onChange({ ...c, forecast_type: v as ForecastType }), 'forecast_type', syncCtx)}
        ${fallback
          ? renderFieldHint(t('card-editor.forecast-editor.this-entity-has-no-type-forecast', { type: t(TYPE_LABELS[current]).toLowerCase(), fallback: t(TYPE_LABELS[fallback]).toLowerCase() }))
          : nothing}
        ${renderNumberField(t('card-editor.forecast-editor.number-of-forecasts'), c.num_forecasts, (v) => onChange({ ...c, num_forecasts: v }), { min: 1, max: 48 }, 'num_forecasts', syncCtx)}
        ${renderToggleField(t('card-editor.forecast-editor.animated-icons'), c.animated_icons !== false, (v) => onChange({ ...c, animated_icons: v }), 'animated_icons', syncCtx, t('card-editor.forecast-editor.animated-weather-icons-instead-of-static'))}
        ${c.animated_icons !== false ? renderFieldHint(animatedIconsNote(c.icon_fx)) : renderIconFxEditor(c, hass, onChange, { entity: eid, icon: '', syncCtx })}
        ${renderToggleField(t('card-editor.forecast-editor.show-temperature'), c.show_temperature !== false, (v) => onChange({ ...c, show_temperature: v }), 'show_temperature', syncCtx)}
        ${renderToggleField(t('card-editor.forecast-editor.show-precipitation'), c.show_precipitation !== false, (v) => onChange({ ...c, show_precipitation: v }), 'show_precipitation', syncCtx)}
        ${renderToggleField(t('card-editor.forecast-editor.show-wind'), c.show_wind, (v) => onChange({ ...c, show_wind: v }), 'show_wind', syncCtx)}
      </div>
    `;
  },
};
