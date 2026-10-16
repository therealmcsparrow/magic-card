import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { ForecastModuleConfig } from '../../../types';
import { renderToggleField, renderEntityField, renderNumberField, renderSelectField, renderFieldHint } from '../../../utils/form-utils';
import { type ForecastType, supportedForecastTypes } from '../../../utils/weather';
import { animatedIconsNote, renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';

const TYPE_LABELS: Record<ForecastType, string> = { daily: 'Daily', hourly: 'Hourly', twice_daily: 'Twice daily' };

export const forecastEditor: ModuleEditor = {
  type: 'forecast',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as ForecastModuleConfig;
    const entity = c.entity ? hass?.states[c.entity] : undefined;
    const supported = entity ? supportedForecastTypes(entity) : [];
    const current = c.forecast_type ?? 'daily';
    const fallback = entity && supported.length && !supported.includes(current) ? supported[0] : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Weather entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'weather', 'entity', syncCtx)}
        ${renderSelectField('Forecast type', current, (['daily', 'hourly', 'twice_daily'] as ForecastType[]).map((t) => ({
          label: entity && supported.length && !supported.includes(t) ? `${TYPE_LABELS[t]} (not provided by this entity)` : TYPE_LABELS[t],
          value: t,
        })), (v) => onChange({ ...c, forecast_type: v as ForecastType }), 'forecast_type', syncCtx)}
        ${fallback
          ? renderFieldHint(`This entity has no ${TYPE_LABELS[current].toLowerCase()} forecast; ${TYPE_LABELS[fallback].toLowerCase()} is shown.`)
          : nothing}
        ${renderNumberField('Number of forecasts', c.num_forecasts, (v) => onChange({ ...c, num_forecasts: v }), { min: 1, max: 48 }, 'num_forecasts', syncCtx)}
        ${renderToggleField('Animated icons', c.animated_icons !== false, (v) => onChange({ ...c, animated_icons: v }), 'animated_icons', syncCtx, 'Animated weather icons instead of static ones')}
        ${c.animated_icons !== false ? renderFieldHint(animatedIconsNote(c.icon_fx)) : renderIconFxEditor(c, hass, onChange, { entity: c.entity, icon: '', syncCtx })}
        ${renderToggleField('Show temperature', c.show_temperature !== false, (v) => onChange({ ...c, show_temperature: v }), 'show_temperature', syncCtx)}
        ${renderToggleField('Show precipitation', c.show_precipitation !== false, (v) => onChange({ ...c, show_precipitation: v }), 'show_precipitation', syncCtx)}
        ${renderToggleField('Show wind', c.show_wind, (v) => onChange({ ...c, show_wind: v }), 'show_wind', syncCtx)}
      </div>
    `;
  },
};
