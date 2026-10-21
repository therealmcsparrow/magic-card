import { html, TemplateResult, nothing } from 'lit';
import { hasIconFx, renderIcon } from '../../icons/render-icon';
import { weatherIconSvg } from '../../icons/weather-icon-svg';
import { CardModule, HomeAssistant, HassEntity, ForecastModuleConfig } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { currentRenderContext } from '../../services/render-context';
import { t } from '../i18n';
import { t as cardT } from '../../card/i18n';
import { dateTimeFormat, formatNumber, uses12h } from '../../utils/locale-format';
import {
  ForecastItem,
  ForecastType,
  weatherForecast,
  weatherIcon,
  windDirection,
} from '../../utils/weather';
import { forecastSkeleton } from './forecast-module';

/* Chunk-only (magic-card-modules-extra.js): no effects at evaluation. */

type Localize = (key: string) => string;

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

export class ForecastView implements ModuleView {
  private _placeholder(count: number, config: ForecastModuleConfig): TemplateResult {
    return forecastSkeleton(count, config);
  }

  private _message(text: string, cls = 'mc-forecast-empty'): TemplateResult {
    return html`<div class="mc-module mc-forecast ${cls}">${text}</div>`;
  }

  /** Weekday (daily), hour (hourly) or weekday + day / night (twice daily), in the user's locale. */
  private _label(item: ForecastItem, type: ForecastType, hass: HomeAssistant | undefined): TemplateResult | string {
    const date = new Date(item.datetime);
    if (Number.isNaN(date.getTime())) return '';
    if (type === 'hourly') {
      const h12 = uses12h(hass);
      return dateTimeFormat(hass, { hour: 'numeric', ...(h12 ? { hourCycle: 'h12' } : { hourCycle: 'h23', minute: '2-digit' }) }).format(date);
    }
    const weekday = dateTimeFormat(hass, { weekday: 'short' }).format(date);
    if (type !== 'twice_daily' || item.is_daytime === undefined) return weekday;
    const localize = (hass as { localize?: Localize } | undefined)?.localize;
    const part = item.is_daytime
      ? localize?.('ui.card.weather.day') || t('Day')
      : localize?.('ui.card.weather.night') || t('Night');
    return html`${weekday}<br />${part}`;
  }

  /** Translated condition name (HA formats a weather state with the entity's translations). */
  private _conditionName(entity: HassEntity, condition: string | undefined, hass: HomeAssistant | undefined): string {
    if (!condition) return '';
    try {
      return hass?.formatEntityState?.(entity, condition) || condition;
    } catch {
      return condition;
    }
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ForecastModuleConfig;
    const count = Math.max(1, Math.round(c.num_forecasts || 5));
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    if (!entity) return this._placeholder(count, c);

    const result = weatherForecast(entity, c.forecast_type, currentRenderContext());
    if (result.status === 'pending') return this._placeholder(count, c);
    if (result.status === 'unavailable') {
      let state = '';
      try {
        state = hass?.formatEntityState?.(entity) ?? '';
      } catch {
        // the translated state is optional
      }
      return this._message(state || cardT('Unavailable'), 'mc-forecast-empty mc-forecast-unavailable');
    }
    if (result.status === 'none') return this._message(t('This entity has no forecast'));
    if (result.status === 'error') return this._message(t('Forecast not available: {error}', { error: result.error }));

    const items = result.forecast.slice(0, count);
    if (!items.length) return this._message(t('No forecast data'));

    const a = entity.attributes;
    const units = hass?.config?.unit_system;
    const tempUnit = String(a.temperature_unit ?? units?.temperature ?? '°');
    const precipUnit = String(a.precipitation_unit ?? units?.accumulated_precipitation ?? 'mm');
    const windUnit = String(a.wind_speed_unit ?? units?.wind_speed ?? '');
    const temp = (v: number) => `${formatNumber(hass, v)}${tempUnit}`;

    return html`
      <div class="mc-module mc-forecast" data-forecast-type=${result.type}>
        ${items.map((item) => {
          // Like HA's forecast card: night icons only for items marked as night (twice daily).
          const night = item.is_daytime === false;
          const condition = this._conditionName(entity, item.condition, hass);
          const high = num(item.temperature);
          const low = num(item.templow);
          const precip = num(item.precipitation);
          const probability = num(item.precipitation_probability);
          const wind = num(item.wind_speed);
          const animated = c.animated_icons !== false && item.condition
            ? weatherIconSvg(item.condition, { night, label: condition || undefined })
            : undefined;
          return html`
            <div class="mc-forecast-item" title=${condition || nothing}>
              <span class="mc-forecast-label">${this._label(item, result.type, hass)}</span>
              ${animated ?? (hasIconFx(c.icon_fx)
                ? renderIcon({ icon: weatherIcon(item.condition, night), entity: c.entity, hass, fx: c.icon_fx, svg: c.svg, ariaLabel: condition || undefined })
                : html`<ha-icon icon=${weatherIcon(item.condition, night)} aria-label=${condition || nothing} role=${condition ? 'img' : nothing}></ha-icon>`)}
              ${c.show_temperature !== false
                ? html`<span class="mc-forecast-temp">${high !== undefined ? temp(high) : '--°'}</span>
                    ${low !== undefined ? html`<span class="mc-forecast-templow">${temp(low)}</span>` : nothing}`
                : nothing}
              ${c.show_precipitation !== false && precip !== undefined
                ? html`<span class="mc-forecast-label mc-forecast-precip">${formatNumber(hass, precip)} ${precipUnit}</span>`
                : c.show_precipitation !== false && probability !== undefined
                  ? html`<span class="mc-forecast-label mc-forecast-precip">${formatNumber(hass, probability, 0)} %</span>`
                  : nothing}
              ${c.show_wind && wind !== undefined
                ? html`<span class="mc-forecast-label mc-forecast-wind">${formatNumber(hass, wind)}${windUnit ? ` ${windUnit}` : ''}${item.wind_bearing !== undefined && item.wind_bearing !== null ? ` ${windDirection(item.wind_bearing)}` : ''}</span>`
                : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}
