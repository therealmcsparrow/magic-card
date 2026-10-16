import type { HassEntity } from '../types';
import type { RenderContext } from '../services/render-context';

/** Weather helpers shared by the weather and forecast modules (icons, forecast subscription). */

export type ForecastType = 'daily' | 'hourly' | 'twice_daily';

export interface ForecastItem {
  datetime: string;
  condition?: string;
  temperature?: number | null;
  templow?: number | null;
  precipitation?: number | null;
  precipitation_probability?: number | null;
  wind_speed?: number | null;
  wind_bearing?: number | string | null;
  /** twice_daily: day or night part. */
  is_daytime?: boolean;
}

/** HA's WeatherEntityFeature bits for forecasts. */
const FEATURE: Record<ForecastType, number> = { daily: 1, hourly: 2, twice_daily: 4 };
const ORDER: ForecastType[] = ['daily', 'hourly', 'twice_daily'];

/** Condition -> mdi icon, as HA's weatherIcons (night variants for clear / partly cloudy). */
const ICONS: Record<string, string> = {
  'clear-night': 'mdi:weather-night',
  cloudy: 'mdi:weather-cloudy',
  exceptional: 'mdi:alert-circle-outline',
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
};
const NIGHT_ICONS: Record<string, string> = {
  sunny: 'mdi:weather-night',
  partlycloudy: 'mdi:weather-night-partly-cloudy',
};

export function weatherIcon(condition: string | undefined, night = false): string {
  const c = condition ?? '';
  return (night && NIGHT_ICONS[c]) || ICONS[c] || 'mdi:weather-partly-cloudy';
}

/** Forecast types the weather entity provides (supported_features). */
export function supportedForecastTypes(entity: HassEntity | undefined): ForecastType[] {
  const features = Number(entity?.attributes.supported_features) || 0;
  return ORDER.filter((t) => features & FEATURE[t]);
}

export type ForecastState =
  | { status: 'pending' }
  | { status: 'ok'; type: ForecastType; forecast: ForecastItem[] }
  /** The entity provides no forecast at all. */
  | { status: 'none' }
  /** The entity is unavailable / unknown (e.g. while Home Assistant starts): its features are not known. */
  | { status: 'unavailable' }
  | { status: 'error'; error: string };

function legacyForecast(entity: HassEntity): ForecastItem[] | undefined {
  const f = entity.attributes.forecast;
  return Array.isArray(f) ? (f as ForecastItem[]) : undefined;
}

/**
 * The entity's forecast of the wanted type (or the first type it supports) through the card's
 * `weather/subscribe_forecast` subscription. HA before 2023.9 only has the `forecast` attribute:
 * that is used when the entity declares no forecast feature, and while the subscription is
 * pending or failed.
 */
export function weatherForecast(
  entity: HassEntity,
  wanted: ForecastType | undefined,
  ctx: Pick<RenderContext, 'subscribe'> | undefined,
): ForecastState {
  if (entity.state === 'unavailable' || entity.state === 'unknown') return { status: 'unavailable' };
  const types = supportedForecastTypes(entity);
  const legacy = legacyForecast(entity);
  const legacyType = wanted ?? 'daily';
  if (!types.length) return legacy ? { status: 'ok', type: legacyType, forecast: legacy } : { status: 'none' };
  const type = wanted && types.includes(wanted) ? wanted : types[0];
  const state = ctx?.subscribe?.<{ type?: string; forecast?: ForecastItem[] | null }>({
    type: 'weather/subscribe_forecast',
    entity_id: entity.entity_id,
    forecast_type: type,
  });
  if (state?.status === 'ok') return { status: 'ok', type, forecast: state.data?.forecast ?? [] };
  if (legacy) return { status: 'ok', type, forecast: legacy };
  if (!state || state.status === 'unavailable') return { status: 'pending' };
  return state;
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/** A wind bearing in degrees as a compass direction (strings are kept). */
export function windDirection(bearing: number | string | null | undefined): string {
  if (bearing === null || bearing === undefined || bearing === '') return '';
  const n = Number(bearing);
  if (Number.isNaN(n)) return String(bearing);
  return COMPASS[Math.round((((n % 360) + 360) % 360) / 22.5) % 16];
}
