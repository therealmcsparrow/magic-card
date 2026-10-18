import { html, TemplateResult, nothing } from 'lit';
import { hasIconFx, renderIcon } from '../../icons/render-icon';
import { weatherIconSvg } from '../../icons/weather-icon-svg';
import { CardModule, ForecastModuleConfig, HassEntity, HomeAssistant, WeatherModuleConfig } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { weatherIcon } from '../../utils/weather';
import { formatNumber } from '../../utils/locale-format';
import { ForecastView } from './forecast-view';
import { isNight } from './weather-module';

/* Chunk-only (magic-card-modules-extra.js): no effects at evaluation. */

const forecastView = new ForecastView();

/**
 * Current weather of a weather entity: condition icon, temperature in the entity's unit, the
 * translated condition, and (optionally) the daily forecast below it, rendered by the forecast
 * view through weather/subscribe_forecast.
 */
export class WeatherView implements ModuleView {
  /** The condition as HA shows it (translated weather state). */
  private _condition(hass: HomeAssistant | undefined, entity: HassEntity): string {
    try {
      return hass?.formatEntityState?.(entity) || entity.state;
    } catch {
      return entity.state;
    }
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
      ? forecastView.renderPreview({
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
