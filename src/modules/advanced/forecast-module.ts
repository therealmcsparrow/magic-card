import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ForecastModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderEntityField, renderNumberField, renderSelectField } from '../../utils/form-utils';

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
                <span style="font-size:0.75rem;color:var(--mc-text-secondary)">Day ${i + 1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
                <span style="font-size:0.875rem">--°</span>
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
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${item.datetime ? new Date(item.datetime as string).toLocaleDateString(undefined, { weekday: 'short' }) : ''}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${c.show_temperature
                ? html`<span style="font-size:0.875rem">${item.temperature ?? '--'}°</span>`
                : nothing}
              ${c.show_precipitation && item.precipitation !== undefined
                ? html`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${item.precipitation}mm</span>`
                : nothing}
            </div>
          `,
        )}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as ForecastModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Weather Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderSelectField('Forecast Type', c.forecast_type, [
          { label: 'Daily', value: 'daily' },
          { label: 'Hourly', value: 'hourly' },
        ], (v) => onChange({ ...c, forecast_type: v as 'daily' | 'hourly' }))}
        ${renderNumberField('Number of Forecasts', c.num_forecasts, (v) => onChange({ ...c, num_forecasts: v }), { min: 1, max: 10 })}
        ${renderToggleField('Show Temperature', c.show_temperature, (v) => onChange({ ...c, show_temperature: v }))}
        ${renderToggleField('Show Precipitation', c.show_precipitation, (v) => onChange({ ...c, show_precipitation: v }))}
        ${renderToggleField('Show Wind', c.show_wind, (v) => onChange({ ...c, show_wind: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new ForecastModule());
