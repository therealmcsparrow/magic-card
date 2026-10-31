import type { MessageIndex } from '../contracts/i18n';
import { lm } from '../i18n/labels/mark';
import type { DeviceAnim, HassEntity } from '../types';
import { isEntityActive } from '../utils/entity-color';
import { isUnavailable } from '../utils/entity-value';

// Smart device animations (`icon_fx.device: auto`): which animation an entity's state calls for.
// `speed` = seconds per cycle (0 = a static pose), `intensity` 0..1.

export interface DeviceAnimSpec {
  anim: DeviceAnim;
  speed: number;
  intensity: number;
  color?: string;
}

export const DEVICE_ANIMS: DeviceAnim[] = ['spin', 'glow', 'flame', 'drum', 'swing', 'pulse', 'snow', 'shake', 'eq'];

/** Speed of a forced animation without a meaningful entity value. */
export const DEFAULT_DEVICE_SPEED = 1.5;

/** Cycle lengths that read well per animation, where the state doesn't set one. */
const SPEED: Record<DeviceAnim, number> = {
  spin: 1.5, glow: 2.4, flame: 1.2, drum: 1.2, swing: 1, pulse: 1.5, snow: 2.4, shake: 1.2, eq: 1.2,
};

const ALERT_COLOR = 'var(--error-color, #db4437)';
const ALERT_CLASSES = new Set(['problem', 'smoke', 'gas', 'moisture', 'safety', 'carbon_monoxide', 'heat', 'tamper']);
const OPENING_CLASSES = new Set(['door', 'window', 'garage_door', 'opening']);
/** Washer / dryer sensor states that mean the drum turns. */
const RUNNING_STATES = new Set(['run', 'running', 'washing', 'drying', 'spin', 'spinning', 'rinse', 'wash', 'dry']);

const spec = (anim: DeviceAnim, extra: Partial<DeviceAnimSpec> = {}): DeviceAnimSpec => ({ anim, speed: SPEED[anim], intensity: 1, ...extra });
const finite = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function autoDeviceAnim(stateObj: HassEntity | undefined): DeviceAnimSpec | undefined {
  if (!stateObj || typeof stateObj.entity_id !== 'string') return undefined;
  const domain = stateObj.entity_id.split('.')[0];
  const state = stateObj.state;
  const a = stateObj.attributes || {};
  const deviceClass = typeof a.device_class === 'string' ? a.device_class : '';

  switch (domain) {
    case 'fan': {
      if (state !== 'on') return undefined;
      const pct = clamp01((finite(a.percentage) ?? 100) / 100);
      return spec('spin', { speed: 0.6 + (1 - pct) * 2.4 });
    }
    case 'light': {
      if (state !== 'on') return undefined;
      const rgb = a.rgb_color;
      const color = Array.isArray(rgb) && rgb.length >= 3 && rgb.slice(0, 3).every((n) => finite(n) !== undefined)
        ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        : undefined;
      const b = finite(a.brightness);
      // A dim light still glows visibly: 0.25 at the lowest brightness, 1 at full.
      return spec('glow', { intensity: b === undefined ? 1 : 0.25 + 0.75 * clamp01(b / 255), ...(color ? { color } : {}) });
    }
    case 'climate':
      // defrosting / drying (and idle / off) have no animation
      if (a.hvac_action === 'heating' || a.hvac_action === 'preheating') return spec('flame');
      if (a.hvac_action === 'cooling') return spec('snow');
      if (a.hvac_action === 'fan') return spec('spin', { speed: 1.5 });
      return undefined;
    case 'vacuum':
      return state === 'cleaning' ? spec('drum', { speed: 1.2 }) : undefined;
    case 'sensor':
      return RUNNING_STATES.has(state) ? spec('drum', { speed: 1.2 }) : undefined;
    case 'binary_sensor':
      if (state !== 'on') return undefined;
      if (deviceClass === 'running') return spec('drum', { speed: 1.2 });
      if (OPENING_CLASSES.has(deviceClass)) return spec('swing', { speed: 0, intensity: 0.3 });
      if (ALERT_CLASSES.has(deviceClass)) return spec('pulse', { color: ALERT_COLOR });
      return undefined;
    case 'cover':
      if (state === 'opening' || state === 'closing') return spec('swing', { speed: 1 });
      return state === 'open' ? spec('swing', { speed: 0, intensity: 0.3 }) : undefined;
    case 'lock':
      if (state === 'jammed') return spec('shake');
      return state === 'locking' || state === 'unlocking' || state === 'opening' ? spec('pulse') : undefined;
    case 'media_player':
      return state === 'playing' ? spec('eq') : undefined;
    case 'alarm_control_panel':
      return state === 'triggered' ? spec('pulse', { color: ALERT_COLOR }) : undefined;
    case 'siren':
      return state === 'on' ? spec('pulse', { color: ALERT_COLOR }) : undefined;
    default:
      return undefined;
  }
}

/**
 * What Auto does for an entity's domain / device class, whatever its state is right now (the editor's
 * help). Kept next to autoDeviceAnim so both cover the same entities; undefined where Auto has nothing.
 */
export function autoDeviceRule(stateObj: HassEntity | undefined, entityId = stateObj?.entity_id ?? ''): MessageIndex | undefined {
  const domain = entityId.split('.')[0];
  const dc = String(stateObj?.attributes?.device_class ?? '');
  switch (domain) {
    case 'fan':
      return lm('labels.device-anim.spin-while-on-faster-at-a-higher-speed');
    case 'light':
      return lm("labels.device-anim.glow-while-on-in-the-light-s-colour-and");
    case 'climate':
      return lm('labels.device-anim.flame-while-heating-snow-while-cooling');
    case 'vacuum':
      return lm('labels.device-anim.drum-while-cleaning');
    case 'sensor':
      return lm('labels.device-anim.drum-while-the-state-is-running-washing');
    case 'binary_sensor':
      if (dc === 'running') return lm('labels.device-anim.drum-while-running');
      if (OPENING_CLASSES.has(dc)) return lm('labels.device-anim.swing-a-slightly-opened-pose-while-open');
      if (ALERT_CLASSES.has(dc)) return lm('labels.device-anim.pulse-in-the-alert-colour-while-on');
      return undefined;
    case 'cover':
      return lm('labels.device-anim.swing-while-opening-or-closing-a');
    case 'lock':
      return lm('labels.device-anim.shake-while-jammed-pulse-while-locking');
    case 'media_player':
      return lm('labels.device-anim.equalizer-while-playing');
    case 'alarm_control_panel':
      return lm('labels.device-anim.pulse-in-the-alert-colour-while');
    case 'siren':
      return lm('labels.device-anim.pulse-in-the-alert-colour-while-on');
    default:
      return undefined;
  }
}

/** Domains with an on / off notion: a forced animation rests while they are off-like. */
const ON_OFF_DOMAINS = new Set([
  'alarm_control_panel', 'automation', 'binary_sensor', 'camera', 'climate', 'cover', 'fan', 'humidifier',
  'input_boolean', 'lawn_mower', 'light', 'lock', 'media_player', 'remote', 'script', 'siren', 'switch',
  'timer', 'vacuum', 'valve', 'water_heater',
]);

/**
 * A forced animation rests: the entity is unavailable / unknown, or an on/off entity is off-like
 * (off, closed, locked, docked; climate idle / off by hvac_action; media paused / idle / off).
 * Entities without an on/off notion (sensors, weather, ...) and icons without an entity keep it.
 */
function forcedRests(stateObj: HassEntity | undefined): boolean {
  if (!stateObj || typeof stateObj.entity_id !== 'string') return false;
  if (isUnavailable(stateObj)) return true;
  const domain = stateObj.entity_id.split('.')[0];
  if (!ON_OFF_DOMAINS.has(domain)) return false;
  if (domain === 'climate' && ['idle', 'off'].includes(String(stateObj.attributes?.hvac_action))) return true;
  if (domain === 'media_player' && stateObj.state === 'paused') return true;
  return !isEntityActive(stateObj);
}

/**
 * The animation for `icon_fx.device`: `auto` → the mapping; a named animation is forced, except
 * while the entity rests (forcedRests). When the mapping picks the same animation its speed,
 * intensity and colour are kept; any other forced animation runs at 1.5 s, full intensity (never
 * another animation's speed). `off` / unset / unknown → none.
 */
export function resolveDeviceAnim(device: unknown, stateObj: HassEntity | undefined): DeviceAnimSpec | undefined {
  if (device === 'auto') return autoDeviceAnim(stateObj);
  if (!DEVICE_ANIMS.includes(device as DeviceAnim)) return undefined;
  if (forcedRests(stateObj)) return undefined;
  const anim = device as DeviceAnim;
  const auto = autoDeviceAnim(stateObj);
  if (auto?.anim === anim) return { ...auto, speed: auto.speed > 0 ? auto.speed : DEFAULT_DEVICE_SPEED };
  return { anim, speed: DEFAULT_DEVICE_SPEED, intensity: 1 };
}
