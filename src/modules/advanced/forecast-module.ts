import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ForecastModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderEntityField, renderAttributeField, renderNumberField, renderSelectField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

class ForecastModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'forecast',
    name: 'Forecast',
    description: 'Display weather forecast data',
    category: 'advanced',
    icon: 'mdi:calendar-week',
  };

  createDefault(): ForecastModuleConfig {
    return {
      id: generateId('forecast'),
      type: 'forecast',
      forecast_type: 'daily',
      num_forecasts: 5,
      show_temperature: true,
      show_precipitation: true,
      show_wind: false,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ForecastModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const forecast = (entity?.attributes.forecast as Array<Record<string, unknown>>) || [];
    const items = forecast.slice(0, c.num_forecasts || 5);

    if (!items.length) {
      return html`
        <div class="mc-module mc-forecast">
          ${Array.from({ length: c.num_forecasts || 5 }).map(
            (_, i) => html`
              <div class="mc-forecast-item">
                <span class="mc-forecast-label">Day ${i + 1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
                <span class="mc-forecast-temp">--°</span>
              </div>
            `,
          )}
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-forecast">
        ${items.map(
          (item) => html`
            <div class="mc-forecast-item">
              <span class="mc-forecast-label">
                ${item.datetime ? new Date(item.datetime as string).toLocaleDateString(undefined, { weekday: 'short' }) : ''}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
              ${c.show_temperature
                ? html`<span class="mc-forecast-temp">${item.temperature ?? '--'}°</span>`
                : nothing}
              ${c.show_precipitation && item.precipitation !== undefined
                ? html`<span class="mc-forecast-label">${item.precipitation}mm</span>`
                : nothing}
            </div>
          `,
        )}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as ForecastModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Weather Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderSelectField('Forecast Type', c.forecast_type, [
          { label: 'Daily', value: 'daily' },
          { label: 'Hourly', value: 'hourly' },
        ], (v) => onChange({ ...c, forecast_type: v as 'daily' | 'hourly' }), 'forecast_type', syncCtx)}
        ${renderNumberField('Number of Forecasts', c.num_forecasts, (v) => onChange({ ...c, num_forecasts: v }), { min: 1, max: 10 }, 'num_forecasts', syncCtx)}
        ${renderToggleField('Show Temperature', c.show_temperature, (v) => onChange({ ...c, show_temperature: v }), 'show_temperature', syncCtx)}
        ${renderToggleField('Show Precipitation', c.show_precipitation, (v) => onChange({ ...c, show_precipitation: v }), 'show_precipitation', syncCtx)}
        ${renderToggleField('Show Wind', c.show_wind, (v) => onChange({ ...c, show_wind: v }), 'show_wind', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new ForecastModule());
