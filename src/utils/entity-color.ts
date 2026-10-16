import type { HassEntity } from '../types';

/** States that are never "active", whatever the domain (HA's OFF_STATES plus idle / standby). */
const ALWAYS_INACTIVE = new Set(['off', 'unavailable', 'unknown', 'idle', 'standby']);

/** Domains Home Assistant colours by state (its STATE_COLORED_DOMAIN). Others (sensor, ...) get none. */
const STATE_COLORED = new Set([
  'alarm_control_panel', 'alert', 'automation', 'binary_sensor', 'calendar', 'camera', 'climate', 'cover',
  'device_tracker', 'fan', 'group', 'humidifier', 'input_boolean', 'lawn_mower', 'light', 'lock',
  'media_player', 'person', 'plant', 'remote', 'schedule', 'script', 'siren', 'sun', 'switch', 'timer',
  'update', 'vacuum', 'valve', 'water_heater',
]);

/** HA's per-domain notion of "active" (frontend stateActive), simplified. */
export function isEntityActive(stateObj: HassEntity | undefined): boolean {
  if (!stateObj) return false;
  const domain = stateObj.entity_id.split('.')[0];
  const state = stateObj.state;
  if (ALWAYS_INACTIVE.has(state)) return false;
  switch (domain) {
    case 'alarm_control_panel':
      return state !== 'disarmed';
    case 'cover':
    case 'valve':
      return state !== 'closed';
    case 'device_tracker':
    case 'person':
      return state !== 'not_home';
    case 'lock':
      return state !== 'locked';
    case 'vacuum':
      return !['docked', 'paused', 'returning'].includes(state);
    case 'lawn_mower':
      return ['mowing', 'error'].includes(state);
    case 'plant':
      return state === 'problem';
    case 'timer':
      return state === 'active';
    case 'camera':
      return state === 'streaming';
    case 'sun':
      return state === 'above_horizon';
    default:
      return true;
  }
}

function hsToRgb(h: number, s: number): [number, number, number] {
  // HSV with full value, as HA's hs_color is hue/saturation of a full-brightness colour.
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return 1 - sat * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [f(5), f(3), f(1)].map((v) => Math.round(v * 255)) as [number, number, number];
}

function lightColor(attrs: Record<string, unknown>): string | undefined {
  const rgb = attrs.rgb_color;
  if (Array.isArray(rgb) && rgb.length >= 3 && rgb.every((n) => typeof n === 'number')) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }
  const hs = attrs.hs_color;
  if (Array.isArray(hs) && hs.length >= 2 && typeof hs[0] === 'number' && typeof hs[1] === 'number') {
    const [r, g, b] = hsToRgb(hs[0], hs[1]);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return undefined;
}

/**
 * The colour Home Assistant gives an entity's icon for its current state: the light's own colour
 * when on, else HA's theme variable chain for the active / inactive state. Undefined for domains
 * HA does not colour by state (sensors, ...), so the caller falls back to its next colour.
 */
export function entityStateColor(stateObj: HassEntity | undefined): string | undefined {
  if (!stateObj) return undefined;
  const domain = stateObj.entity_id.split('.')[0];
  if (!STATE_COLORED.has(domain)) return undefined;
  if (!isEntityActive(stateObj)) {
    return `var(--state-${domain}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;
  }
  const own = lightColor(stateObj.attributes || {});
  if (own) return own;
  const state = stateObj.state.replace(/[^a-z0-9_-]/gi, '_');
  return `var(--state-${domain}-${state}-color, var(--state-${domain}-active-color, var(--state-active-color, var(--primary-color))))`;
}

// ── Entity colour as a design colour value ──

/** CSS var the card sets on a module wrapper to its entity's state colour (when a design colour uses it). */
export const ENTITY_COLOR_VAR = '--mc-entity-color';

const ENTITY_COLOR_RE = /^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;

/**
 * A design colour value of `entity` (the module entity's state colour) or `entity N%` (the same at
 * N% opacity); undefined for any other value.
 */
export function parseEntityColor(value: unknown): { opacity: number } | undefined {
  if (typeof value !== 'string') return undefined;
  const m = value.trim().match(ENTITY_COLOR_RE);
  if (!m) return undefined;
  return { opacity: m[1] === undefined ? 100 : Math.min(100, Number(m[1])) };
}

export function isEntityColor(value: unknown): boolean {
  return parseEntityColor(value) !== undefined;
}

/** The CSS for an entity colour value (currentColor without an entity colour); undefined for other values. */
export function entityColorCss(value: unknown): string | undefined {
  const parsed = parseEntityColor(value);
  if (!parsed) return undefined;
  const color = `var(${ENTITY_COLOR_VAR}, currentColor)`;
  return parsed.opacity >= 100 ? color : `color-mix(in srgb, ${color} ${parsed.opacity}%, transparent)`;
}
