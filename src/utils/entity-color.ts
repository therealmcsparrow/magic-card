import type { HassEntity } from '../types';
import { ENTITY_PAINT_RE } from '../contracts/entity-colour';

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

/**
 * A colour from attribute `attr` as clamped integer [r, g, b]: a numeric array of three (hs_color:
 * hue / saturation). Read as an own property only, never a string (hass data is untrusted).
 */
export function attrRgb(attrs: Record<string, unknown> | undefined, attr: string): number[] | undefined {
  if (!attrs || !Object.prototype.hasOwnProperty.call(attrs, attr)) return undefined;
  const v = attrs[attr];
  if (!Array.isArray(v)) return undefined;
  const n = [v[0], v[1], v[2]];
  if (attr === 'hs_color' && n.slice(0, 2).every(Number.isFinite)) return hsToRgb(((n[0] % 360) + 360) % 360, n[1]);
  return n.every(Number.isFinite) ? n.map((x) => Math.max(0, Math.min(255, Math.round(x)))) : undefined;
}

function lightColor(attrs: Record<string, unknown>): string | undefined {
  const rgb = attrRgb(attrs, 'rgb_color') || attrRgb(attrs, 'hs_color');
  return rgb ? `rgb(${rgb.join(', ')})` : undefined;
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

let mixOk: boolean | undefined;

/**
 * CSS for a slider colour value (`entity`, `entity N%`, `entity.<attr>`, `entity.<attr> N%`; contract
 * entity-colour 1.0.0) of `stateObj`; undefined when it is not one or gives no colour. A known rgb
 * comes out as rgb() / rgba() computed here, a theme chain only gets color-mix() where supported.
 */
export function entityPaint(
  value: unknown,
  stateObj: { entity_id: string; state: string; attributes?: Record<string, unknown> } | undefined,
): string | undefined {
  const m = typeof value === 'string' ? value.trim().match(ENTITY_PAINT_RE) : null;
  if (!m || !stateObj) return undefined;
  const op = m[2] === undefined ? 100 : Math.min(100, Number(m[2]));
  const state = m[1] ? undefined : entityStateColor(stateObj as HassEntity);
  const rgb = m[1] ? attrRgb(stateObj.attributes, m[1]) : state?.match(/^rgb\((\d+), (\d+), (\d+)\)$/)?.slice(1);
  if (rgb) return op >= 100 ? `rgb(${rgb.join(', ')})` : `rgba(${rgb.join(', ')}, ${+(op / 100).toFixed(2)})`;
  if (!state || op >= 100) return state;
  mixOk ??= typeof CSS !== 'undefined' && !!CSS.supports?.('color', 'color-mix(in srgb, red 50%, red)');
  return mixOk ? `color-mix(in srgb, ${state} ${+op.toFixed(2)}%, transparent)` : state;
}
