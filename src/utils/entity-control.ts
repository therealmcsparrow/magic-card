import type { ActionConfig, ActionsConfig, HassEntity, HomeAssistant } from '../types';
import { entityNumber, formatFixed, joinUnit } from './entity-value';
import { pendingAttributeValue, pendingScope } from './pending-value';

/** A Home Assistant service call. */
export interface ServiceCall {
  domain: string;
  service: string;
  data: Record<string, unknown>;
}

/**
 * A numeric value of an entity that a slider or spinbox can show and (for controllable domains)
 * set: its current value, limits, step, unit and the service call that sets it.
 */
export interface NumericControl {
  /** The current value; undefined when the entity has none (unavailable, a media player that is off). */
  value: number | undefined;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Nothing can set this value (a sensor, an unavailable entity, a feature the entity lacks). */
  readOnly: boolean;
  /** The service call that sets `value` (undefined when read-only). */
  call?: (value: number) => ServiceCall;
}

/** Limits from the module config; they narrow the entity's own range. */
export interface ControlLimits {
  min?: number;
  max?: number;
  step?: number;
}

interface Adapter {
  value: number | undefined;
  /** The entity's own limits (undefined: none, the config or 0..100 / 1 decide). */
  min?: number;
  max?: number;
  step?: number;
  unit: string;
  call?: (value: number) => ServiceCall;
}

const UNAVAILABLE = new Set(['unavailable', 'unknown']);

/** Light colour modes that have a brightness (HA's lightSupportsBrightness). */
const BRIGHTNESS_MODES = new Set(['brightness', 'color_temp', 'hs', 'xy', 'rgb', 'rgbw', 'rgbww', 'white']);
/** Light colour modes with a colour (HA's lightSupportsColor). */
const COLOR_MODES = new Set(['hs', 'xy', 'rgb', 'rgbw', 'rgbww']);

const num = (v: unknown): number | undefined => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

function colorModes(stateObj: HassEntity): string[] | undefined {
  const modes = stateObj.attributes?.supported_color_modes;
  return Array.isArray(modes) ? (modes as string[]) : undefined;
}

/** The light can dim (no colour mode list, e.g. while unavailable, counts as yes). */
export function lightSupportsBrightness(stateObj: HassEntity): boolean {
  const modes = colorModes(stateObj);
  return !modes || modes.some((m) => BRIGHTNESS_MODES.has(m));
}

export function lightSupportsColorTemp(stateObj: HassEntity): boolean {
  const modes = colorModes(stateObj);
  return !modes || modes.includes('color_temp');
}

export function lightSupportsColor(stateObj: HassEntity): boolean {
  const modes = colorModes(stateObj);
  return !modes || modes.some((m) => COLOR_MODES.has(m));
}

/** The entity declares the feature bit (an entity without supported_features is not restricted). */
function hasFeature(stateObj: HassEntity, bit: number): boolean {
  const f = stateObj.attributes?.supported_features;
  return f === undefined || f === null || (Number(f) & bit) !== 0;
}

/**
 * Kelvin limits of a light: its kelvin attributes, else its mired limits (older HA; the most mireds
 * are the warmest kelvin), else HA's defaults.
 */
export function lightKelvinRange(stateObj: HassEntity): { min: number; max: number } {
  const a = stateObj.attributes || {};
  const fromMireds = (m: unknown) => {
    const n = num(m);
    return n && n > 0 ? Math.round(1000000 / n) : undefined;
  };
  return {
    min: num(a.min_color_temp_kelvin) ?? fromMireds(a.max_mireds) ?? 2000,
    max: num(a.max_color_temp_kelvin) ?? fromMireds(a.min_mireds) ?? 6500,
  };
}

/** The light's colour temperature in kelvin (from mireds on HA versions that only report those). */
export function lightKelvin(stateObj: HassEntity): number | undefined {
  const a = stateObj.attributes || {};
  const k = num(a.color_temp_kelvin);
  if (k !== undefined) return k;
  const mireds = num(a.color_temp);
  return mireds ? Math.round(1000000 / mireds) : undefined;
}

/**
 * The light's brightness in percent: 0 when off, at least 1 while on (brightness 1-2 of 255 would
 * round to 0, which reads as off; HA shows 1%), undefined when it has no brightness.
 */
export function lightBrightnessPct(stateObj: HassEntity): number | undefined {
  if (stateObj.state === 'off') return 0;
  const b = num(stateObj.attributes?.brightness);
  return b === undefined ? undefined : Math.max(1, Math.round((b / 255) * 100));
}

const call = (domain: string, service: string, entityId: string, data: Record<string, unknown> = {}): ServiceCall => ({
  domain,
  service,
  data: { entity_id: entityId, ...data },
});

function adapter(hass: HomeAssistant | undefined, stateObj: HassEntity, attribute: string | undefined): Adapter {
  const id = stateObj.entity_id;
  const domain = id.split('.')[0];
  const a = stateObj.attributes || {};
  const tempUnit = String(hass?.config?.unit_system?.temperature ?? a.temperature_unit ?? '');
  const readOnly = (): Adapter => ({
    value: entityNumber(stateObj, attribute),
    unit: attribute ? '' : String(a.unit_of_measurement ?? ''),
  });

  switch (domain) {
    case 'input_number':
    case 'number':
      if (attribute) return readOnly();
      return {
        value: entityNumber(stateObj),
        min: num(a.min),
        max: num(a.max),
        step: num(a.step),
        unit: String(a.unit_of_measurement ?? ''),
        call: (v) => call(domain, 'set_value', id, { value: v }),
      };
    case 'climate': {
      const limits = { min: num(a.min_temp), max: num(a.max_temp), step: num(a.target_temp_step) ?? (tempUnit === '°F' ? 1 : 0.5) };
      if (!attribute || attribute === 'temperature') {
        return { value: num(a.temperature), ...limits, unit: tempUnit, call: (v) => call('climate', 'set_temperature', id, { temperature: v }) };
      }
      if (attribute === 'target_temp_low' || attribute === 'target_temp_high') {
        const low = attribute === 'target_temp_low';
        const other = low ? 'target_temp_high' : 'target_temp_low';
        const scope = pendingScope();
        const otherNow = num(a[other]);
        return {
          value: num(a[attribute]),
          ...limits,
          unit: tempUnit,
          // set_temperature needs both ends of the range: the other one as last set on this card
          // (a value another control has not had confirmed yet) or as the entity reports it
          call: num(a[attribute]) === undefined || otherNow === undefined
            ? undefined
            : (v) => {
              const o = pendingAttributeValue(scope, id, other) ?? otherNow;
              return call('climate', 'set_temperature', id, {
                target_temp_low: low ? v : o,
                target_temp_high: low ? o : v,
              });
            },
        };
      }
      if (attribute === 'humidity') {
        return {
          value: num(a.humidity),
          min: num(a.min_humidity) ?? 30,
          max: num(a.max_humidity) ?? 99,
          step: 1,
          unit: '%',
          call: (v) => call('climate', 'set_humidity', id, { humidity: Math.round(v) }),
        };
      }
      return readOnly();
    }
    case 'water_heater':
      if (attribute && attribute !== 'temperature') return readOnly();
      return {
        value: num(a.temperature),
        min: num(a.min_temp),
        max: num(a.max_temp),
        step: num(a.target_temp_step) ?? (tempUnit === '°F' ? 1 : 0.5),
        unit: tempUnit,
        call: (v) => call('water_heater', 'set_temperature', id, { temperature: v }),
      };
    case 'humidifier':
      if (attribute && attribute !== 'humidity') return readOnly();
      return {
        value: num(a.humidity),
        min: num(a.min_humidity) ?? 0,
        max: num(a.max_humidity) ?? 100,
        step: 1,
        unit: '%',
        call: (v) => call('humidifier', 'set_humidity', id, { humidity: Math.round(v) }),
      };
    case 'light': {
      if (!attribute || attribute === 'brightness' || attribute === 'brightness_pct') {
        if (!lightSupportsBrightness(stateObj)) return { value: stateObj.state === 'on' ? 100 : 0, min: 0, max: 100, step: 1, unit: '%' };
        return {
          value: lightBrightnessPct(stateObj),
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          call: (v) => (v <= 0
            ? call('light', 'turn_off', id)
            : call('light', 'turn_on', id, { brightness_pct: Math.round(v) })),
        };
      }
      // colour temperature in kelvin; `color_temp` (mireds) from older configs means the same control
      if (attribute === 'color_temp_kelvin' || attribute === 'color_temp') {
        const range = lightKelvinRange(stateObj);
        return {
          value: stateObj.state === 'on' ? lightKelvin(stateObj) : undefined,
          ...range,
          step: 50,
          unit: 'K',
          call: lightSupportsColorTemp(stateObj)
            ? (v) => call('light', 'turn_on', id, { color_temp_kelvin: Math.round(v) })
            : undefined,
        };
      }
      return readOnly();
    }
    case 'fan':
      if (attribute && attribute !== 'percentage') return readOnly();
      return {
        value: stateObj.state === 'off' ? 0 : num(a.percentage),
        min: 0,
        max: 100,
        step: num(a.percentage_step) ?? 1,
        unit: '%',
        // FanEntityFeature.SET_SPEED
        call: hasFeature(stateObj, 1) ? (v) => call('fan', 'set_percentage', id, { percentage: Math.round(v) }) : undefined,
      };
    case 'cover':
      if (attribute === 'current_tilt_position') {
        return {
          value: num(a.current_tilt_position),
          min: 0,
          max: 100,
          step: 1,
          unit: '%',
          // CoverEntityFeature.SET_TILT_POSITION
          call: hasFeature(stateObj, 128) ? (v) => call('cover', 'set_cover_tilt_position', id, { tilt_position: Math.round(v) }) : undefined,
        };
      }
      if (attribute && attribute !== 'current_position') return readOnly();
      return {
        value: num(a.current_position),
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        // CoverEntityFeature.SET_POSITION
        call: hasFeature(stateObj, 4) ? (v) => call('cover', 'set_cover_position', id, { position: Math.round(v) }) : undefined,
      };
    case 'valve':
      if (attribute && attribute !== 'current_position') return readOnly();
      return {
        value: num(a.current_position),
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        // ValveEntityFeature.SET_POSITION
        call: hasFeature(stateObj, 4) ? (v) => call('valve', 'set_valve_position', id, { position: Math.round(v) }) : undefined,
      };
    case 'media_player': {
      if (attribute && attribute !== 'volume_level') return readOnly();
      const vol = num(a.volume_level);
      return {
        value: vol === undefined ? undefined : Math.round(vol * 100),
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        // MediaPlayerEntityFeature.VOLUME_SET; no volume while the player is off
        call: vol !== undefined && hasFeature(stateObj, 4) ? (v) => call('media_player', 'volume_set', id, { volume_level: Math.round(v) / 100 }) : undefined,
      };
    }
    default:
      return readOnly();
  }
}

const valid = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/**
 * Decimals a number has (0.5 -> 1, 0.05 -> 2), undefined when it does not end within 6 decimals
 * (a fan's percentage_step of 33.333333333333336).
 */
export function stepDecimals(n: number): number | undefined {
  if (!valid(n)) return 0;
  for (let d = 0; d <= 6; d++) {
    const scaled = n * 10 ** d;
    if (Math.abs(scaled - Math.round(scaled)) < 1e-9 * Math.max(1, Math.abs(scaled))) return d;
  }
  return undefined;
}

/** `value` on the step grid from `min`, within min..max, without float artefacts (0.30000000000000004). */
export function snapValue(value: number, min: number, max: number, step: number): number {
  const d = Math.max(stepDecimals(step) ?? 4, stepDecimals(min) ?? 4);
  const stepped = step > 0 ? min + Math.round((value - min) / step) * step : value;
  const clamped = Math.min(max, Math.max(min, stepped));
  return Number(clamped.toFixed(d));
}

/** The config step when it fits the entity's step grid (a multiple of it), else the entity's. */
function pickStep(own: number | undefined, configured: number | undefined): number {
  const cfg = valid(configured) && configured > 0 ? configured : undefined;
  const ent = valid(own) && own > 0 ? own : undefined;
  if (cfg !== undefined && ent !== undefined) {
    const ratio = cfg / ent;
    return Math.abs(ratio - Math.round(ratio)) < 1e-6 && Math.round(ratio) >= 1 ? cfg : ent;
  }
  return cfg ?? ent ?? 1;
}

/**
 * The numeric control of an entity (or one of its attributes): per-domain value, limits and
 * service. Configured min / max narrow the entity's range (they never widen it, so a value outside
 * what the entity accepts is never sent); a configured step is used when it is a multiple of the
 * entity's step. Unavailable entities and domains without a setter are read-only.
 */
export function numericControl(
  hass: HomeAssistant | undefined,
  stateObj: HassEntity,
  attribute: string | undefined,
  limits: ControlLimits = {},
): NumericControl {
  const ad = adapter(hass, stateObj, attribute || undefined);
  let min = valid(ad.min) ? ad.min : undefined;
  let max = valid(ad.max) ? ad.max : undefined;
  if (valid(limits.min)) min = min === undefined ? limits.min : Math.max(min, limits.min);
  if (valid(limits.max)) max = max === undefined ? limits.max : Math.min(max, limits.max);
  min = min ?? 0;
  max = max ?? 100;
  if (max <= min) {
    // configured limits outside the entity's range: fall back to the entity's own
    min = valid(ad.min) ? ad.min : 0;
    max = valid(ad.max) && ad.max > min ? ad.max : min + 100;
  }
  const step = pickStep(ad.step, limits.step);
  const unavailable = UNAVAILABLE.has(stateObj.state);
  const value = unavailable || ad.value === undefined ? undefined : ad.value;
  const readOnly = unavailable || !ad.call;
  return { value, min, max, step, unit: ad.unit, readOnly, call: readOnly ? undefined : ad.call };
}

/** The value with the decimals its step needs and its unit ("21.5 °C", "40%"). */
export function formatControlValue(hass: HomeAssistant | undefined, ctrl: NumericControl, value: number): string {
  const d = Math.max(stepDecimals(ctrl.step) ?? 0, Math.min(2, stepDecimals(value) ?? 2));
  return joinUnit(formatFixed(hass, value, d), ctrl.unit);
}

export function runServiceCall(hass: HomeAssistant, c: ServiceCall): void {
  void Promise.resolve(hass.callService(c.domain, c.service, c.data)).catch((err: unknown) => {
    console.warn(`Magic Card: ${c.domain}.${c.service} failed`, err);
  });
}

/** HA's STATES_OFF: a toggle turns these on and everything else off. */
const STATES_OFF = new Set(['closed', 'locked', 'off']);

/**
 * The service call of HA's toggleEntity / turnOnOffEntity: groups through `homeassistant`, locks,
 * covers and valves open / close, buttons press, scenes turn on, everything else turn_on / turn_off.
 */
export function toggleCall(hass: HomeAssistant | undefined, entityId: string): ServiceCall {
  const domain = entityId.split('.')[0];
  const state = hass?.states?.[entityId]?.state;
  const turnOn = state !== undefined && STATES_OFF.has(state);
  const serviceDomain = domain === 'group' ? 'homeassistant' : domain;
  let service: string;
  switch (domain) {
    case 'lock':
      service = turnOn ? 'unlock' : 'lock';
      break;
    case 'cover':
      service = turnOn ? 'open_cover' : 'close_cover';
      break;
    case 'valve':
      service = turnOn ? 'open_valve' : 'close_valve';
      break;
    case 'button':
    case 'input_button':
      service = 'press';
      break;
    case 'scene':
      service = 'turn_on';
      break;
    default:
      service = turnOn ? 'turn_on' : 'turn_off';
  }
  return { domain: serviceDomain, service, data: { entity_id: entityId } };
}

/**
 * Domains a new button toggles on tap: switching them by accident is harmless. Locks, covers,
 * valves, garage doors, alarm panels, groups (which may hold any of those), climate, media players
 * and sirens open more info instead.
 */
export const SAFE_TOGGLE_DOMAINS = new Set(['light', 'switch', 'fan', 'input_boolean', 'automation', 'humidifier']);
/** Domains a new button turns on (running a script or scene; a toggle would stop a running script). */
const TURN_ON_DOMAINS = new Set(['script', 'scene']);

/**
 * Actions written into the config when the first entity is picked for a new button: tap toggles
 * a safe toggle domain, turns on a script / scene, else opens more info; hold opens more info.
 */
export function defaultButtonActions(entityId: string): ActionsConfig {
  const domain = entityId.split('.')[0];
  const tap: ActionConfig = SAFE_TOGGLE_DOMAINS.has(domain)
    ? { action: 'toggle' }
    : TURN_ON_DOMAINS.has(domain)
      ? { action: 'perform-action', service: `${domain}.turn_on`, data: { entity_id: entityId } }
      : { action: 'more-info' };
  return { tap_action: tap, hold_action: { action: 'more-info' } };
}
