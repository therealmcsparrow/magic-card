import type { SceneId } from './seasonal';

/*
 * The weather and sun-elevation tables of the seasonal scenes. They sit apart from seasonal.ts so the lazy `anim` chunk
 * (resolve.ts) reads them without holding the whole calendar (no copy of utils/seasonal.ts in `anim`).
 * utils/seasonal.ts re-exports them.
 */

export const WEATHER: Record<string, SceneId> = {
  snowy: 'snow',
  'snowy-rainy': 'snow',
  rainy: 'rain',
  pouring: 'rain',
  hail: 'rain',
  lightning: 'storm',
  'lightning-rainy': 'storm',
  sunny: 'sun',
  'clear-night': 'night',
  cloudy: 'clouds',
  partlycloudy: 'clouds',
  fog: 'fog',
  windy: 'wind',
  'windy-variant': 'wind',
};

/** A `weather.*` state as a scene; undefined for unknown / unavailable / exceptional. */
export function weatherScene(state: string | undefined): SceneId | undefined {
  return state ? WEATHER[state] : undefined;
}

/** Sun elevation (deg) within which it counts as dusk / dawn. */
export const TWILIGHT = 6;

/** `sun.sun` as a scene: night below the horizon, dusk / dawn near it, nothing by day. */
export function dayNightScene(state: string | undefined, elevation?: number): SceneId | undefined {
  if (state !== 'below_horizon' && state !== 'above_horizon') return undefined;
  if (typeof elevation === 'number' && Number.isFinite(elevation) && Math.abs(elevation) <= TWILIGHT) return 'dusk';
  return state === 'below_horizon' ? 'night' : undefined;
}
