import { html, TemplateResult, nothing } from 'lit';
import { hasIconFx, renderIcon } from '../../icons/render-icon';
import { weatherIconSvg } from '../../icons/weather-icons';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { CardModule, ForecastModuleConfig, HassEntity, HomeAssistant, WeatherModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { weatherIcon } from '../../utils/weather';
import { formatNumber } from '../../utils/locale-format';

const isNight = (hass: HomeAssistant | undefined): boolean => hass?.states?.['sun.sun']?.state === 'below_horizon';

/**
 * Current weather of a weather entity: condition icon, temperature in the entity's unit, the
 * translated condition, and (optionally) the daily forecast below it, rendered by the forecast
 * module through weather/subscribe_forecast.
 */
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
      animated_icons: true,
    };
  }

  /** The condition as HA shows it (translated weather state). */
  private _condition(hass: HomeAssistant | undefined, entity: HassEntity): string {
    try {
      return hass?.formatEntityState?.(entity) || entity.state;
    } catch {
      return entity.state;
    }
  }

  /** The night icon reads sun.sun, so the card re-renders when the sun sets or rises. */
  getDependencies(config: CardModule): ModuleDependencies {
    return config.entity ? { entities: ['sun.sun'] } : {};
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as WeatherModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const unavailable = !entity || entity.state === 'unavailable' || entity.state === 'unknown';

    const temp = entity && !unavailable && typeof entity.attributes.temperature === 'number' ? entity.attributes.temperature : undefined;
    const unit = String(entity?.attributes.temperature_unit ?? hass?.config?.unit_system?.temperature ?? '°');
    const icon = entity && !unavailable ? weatherIcon(entity.state, isNight(hass)) : 'mdi:weather-cloudy-alert';
    const animated = c.animated_icons !== false && entity && !unavailable
      ? weatherIconSvg(entity.state, { night: isNight(hass), className: 'mc-anim-icon' })
      : undefined;
    const condition = entity ? this._condition(hass, entity) : '';

    const forecast = c.show_forecast && entity
      ? ModuleRegistry.get('forecast')?.renderPreview({
          id: `${c.id}~forecast`,
          type: 'forecast',
          entity: c.entity,
          forecast_type: 'daily',
          animated_icons: c.animated_icons !== false,
          num_forecasts: Math.max(1, Math.min(14, Math.round(Number(c.forecast_days) || 5))),
          show_temperature: true,
          show_precipitation: false,
          show_wind: false,
        } as ForecastModuleConfig, hass)
      : undefined;

    return html`
      <div class="mc-module mc-weather ${forecast ? 'mc-weather--forecast' : ''}">
        <div class="mc-weather-now">
          ${animated ?? (hasIconFx(c.icon_fx)
            ? renderIcon({ icon, entity: c.entity, hass, className: 'mc-anim-icon', fx: c.icon_fx, svg: c.svg, ariaHidden: true })
            : html`<ha-icon class="mc-anim-icon" icon=${icon} aria-hidden="true"></ha-icon>`)}
          <div>
            ${c.show_temperature !== false && temp !== undefined
              ? html`<div class="mc-weather-temp">${formatNumber(hass, temp)}${unit}</div>`
              : nothing}
            ${c.show_condition !== false && condition
              ? html`<div class="mc-weather-condition">${condition}</div>`
              : nothing}
          </div>
        </div>
        ${forecast ?? nothing}
      </div>
    `;
  }
}

ModuleRegistry.register(new WeatherModule());
