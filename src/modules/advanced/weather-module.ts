import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, WeatherModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderEntityField, renderNumberField } from '../../utils/form-utils';

class WeatherModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'weather',
    name: 'Weather',
    description: 'Display weather entity information',
    category: 'advanced',
    icon: 'mdi:weather-partly-cloudy',
  };

  createDefault(): WeatherModuleConfig {
    return {
      id: generateId('weather'),
      type: 'weather',
      show_temperature: true,
      show_condition: true,
      show_forecast: false,
      forecast_days: 5,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as WeatherModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;

    const temp = entity?.attributes.temperature;
    const condition = entity?.state || 'unknown';
    const unit = entity?.attributes.temperature_unit || '°C';
    const icon = this._conditionIcon(condition);

    return html`
      <div class="mc-module mc-weather">
        <ha-icon icon=${icon} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${c.show_temperature && temp !== undefined
            ? html`<div class="mc-weather-temp">${temp}${unit}</div>`
            : nothing}
          ${c.show_condition
            ? html`<div class="mc-weather-condition">${condition}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as WeatherModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Weather Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderToggleField('Show Temperature', c.show_temperature, (v) => onChange({ ...c, show_temperature: v }))}
        ${renderToggleField('Show Condition', c.show_condition, (v) => onChange({ ...c, show_condition: v }))}
        ${renderToggleField('Show Forecast', c.show_forecast, (v) => onChange({ ...c, show_forecast: v }))}
        ${c.show_forecast
          ? renderNumberField('Forecast Days', c.forecast_days, (v) => onChange({ ...c, forecast_days: v }), { min: 1, max: 7 })
          : nothing}
      </div>
    `;
  }

  private _conditionIcon(condition: string): string {
    const map: Record<string, string> = {
      'clear-night': 'mdi:weather-night',
      cloudy: 'mdi:weather-cloudy',
      fog: 'mdi:weather-fog',
      hail: 'mdi:weather-hail',
      lightning: 'mdi:weather-lightning',
      'lightning-rainy': 'mdi:weather-lightning-rainy',
      partlycloudy: 'mdi:weather-partly-cloudy',
      pouring: 'mdi:weather-pouring',
      rainy: 'mdi:weather-rainy',
      snowy: 'mdi:weather-snowy',
      'snowy-rainy': 'mdi:weather-snowy-rainy',
      sunny: 'mdi:weather-sunny',
      windy: 'mdi:weather-windy',
      'windy-variant': 'mdi:weather-windy-variant',
      exceptional: 'mdi:alert-circle-outline',
    };
    return map[condition] || 'mdi:weather-partly-cloudy';
  }
}

ModuleRegistry.register(new WeatherModule());
