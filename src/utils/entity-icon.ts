import { html, nothing, TemplateResult } from 'lit';
import type { HassEntity, HomeAssistant } from '../types';

/** [active, inactive] default icons for domains whose icon follows the state. */
const STATEFUL: Record<string, [string, string]> = {
  light: ['mdi:lightbulb', 'mdi:lightbulb-outline'],
  switch: ['mdi:toggle-switch-variant', 'mdi:toggle-switch-variant-off'],
  input_boolean: ['mdi:check-circle-outline', 'mdi:close-circle-outline'],
  binary_sensor: ['mdi:checkbox-marked-circle', 'mdi:radiobox-blank'],
  fan: ['mdi:fan', 'mdi:fan-off'],
  automation: ['mdi:robot', 'mdi:robot-off'],
  lock: ['mdi:lock', 'mdi:lock-open-variant'],
  cover: ['mdi:window-shutter-open', 'mdi:window-shutter'],
  valve: ['mdi:valve-open', 'mdi:valve-closed'],
  media_player: ['mdi:cast-connected', 'mdi:cast'],
  person: ['mdi:account', 'mdi:account-arrow-right'],
  device_tracker: ['mdi:account', 'mdi:account-arrow-right'],
  siren: ['mdi:bullhorn', 'mdi:bullhorn-outline'],
  remote: ['mdi:remote', 'mdi:remote-off'],
};

const DOMAIN: Record<string, string> = {
  sensor: 'mdi:eye',
  climate: 'mdi:thermostat',
  camera: 'mdi:video',
  script: 'mdi:script-text',
  scene: 'mdi:palette',
  input_number: 'mdi:ray-vertex',
  number: 'mdi:ray-vertex',
  input_select: 'mdi:format-list-bulleted',
  select: 'mdi:format-list-bulleted',
  input_text: 'mdi:form-textbox',
  text: 'mdi:form-textbox',
  input_datetime: 'mdi:calendar-clock',
  input_button: 'mdi:button-pointer',
  button: 'mdi:button-pointer',
  weather: 'mdi:weather-partly-cloudy',
  sun: 'mdi:white-balance-sunny',
  vacuum: 'mdi:robot-vacuum',
  water_heater: 'mdi:water-boiler',
  humidifier: 'mdi:air-humidifier',
  alarm_control_panel: 'mdi:shield-home',
  zone: 'mdi:map-marker-radius',
  timer: 'mdi:timer-outline',
  counter: 'mdi:counter',
  update: 'mdi:package-up',
  calendar: 'mdi:calendar',
  todo: 'mdi:clipboard-list',
  event: 'mdi:eye-check',
  image: 'mdi:image',
};

/**
 * Whether the entity shows its "on" state icon (`icon_on`) rather than `icon_off`: lock locked,
 * cover / valve not closed, person home, media playing, climate heating / cooling (its hvac_action,
 * else a heat / cool mode), alarm armed, vacuum cleaning, else `on`. Unavailable / unknown are off.
 * Not entity-color's isEntityActive (which decides the state colour).
 */
export function isIconStateOn(domain: string, state: string, attributes?: Record<string, unknown>): boolean {
  if (!state || state === 'unavailable' || state === 'unknown') return false;
  switch (domain) {
    case 'lock':
      return state === 'locked';
    case 'cover':
    case 'valve':
      return state !== 'closed';
    case 'person':
    case 'device_tracker':
      return state === 'home';
    case 'media_player':
      return !['off', 'standby', 'idle'].includes(state);
    case 'climate': {
      const action = attributes?.hvac_action;
      if (typeof action === 'string' && action) return action === 'heating' || action === 'cooling';
      return state === 'heat' || state === 'cool' || state === 'heat_cool';
    }
    case 'alarm_control_panel':
      return state.startsWith('armed_');
    case 'vacuum':
      return state === 'cleaning';
    default:
      return state === 'on';
  }
}

/** Default icon for an entity's domain (and state), like HA's when nothing else is set. */
export function domainIcon(domain: string, state?: string): string | undefined {
  const pair = STATEFUL[domain];
  if (pair) return isIconStateOn(domain, state ?? '') ? pair[0] : pair[1];
  return DOMAIN[domain];
}

/**
 * The entity's icon as HA picks it, without HA's icon translations: entity registry icon
 * (hass.entities) -> `icon` state attribute -> domain / state default. Undefined for an unknown entity.
 */
export function entityIcon(hass: HomeAssistant | undefined, entityId: string | undefined): string | undefined {
  if (!hass || !entityId) return undefined;
  const reg = hass.entities?.[entityId]?.icon;
  if (reg) return reg;
  const stateObj: HassEntity | undefined = hass.states?.[entityId];
  const attr = stateObj?.attributes?.icon;
  if (typeof attr === 'string' && attr) return attr;
  if (!stateObj) return undefined;
  return domainIcon(entityId.split('.')[0], stateObj.state);
}

/**
 * State icons: `iconOn` while the entity is on (isIconStateOn), else `iconOff`. Undefined when the entity is
 * unknown or the icon for its current side isn't set (the module's own icon logic applies).
 */
export function stateIcon(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  iconOn: string | undefined,
  iconOff: string | undefined,
): string | undefined {
  if (!entityId || (!iconOn && !iconOff)) return undefined;
  const stateObj = hass?.states?.[entityId];
  if (!stateObj) return undefined;
  return (isIconStateOn(entityId.split('.')[0], stateObj.state, stateObj.attributes) ? iconOn : iconOff) || undefined;
}

/**
 * The entity's icon element. Inside HA: `<ha-state-icon>` (registry icon -> attribute -> icon
 * translations / device class / state defaults, updating with the state). Elsewhere: `<ha-icon>` with
 * entityIcon(), else `fallback`.
 */
export function renderEntityIcon(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  fallback: string,
  className = '',
  part?: string,
): TemplateResult {
  const stateObj = entityId ? hass?.states?.[entityId] : undefined;
  if (stateObj && typeof customElements !== 'undefined' && customElements.get('ha-state-icon')) {
    return html`<ha-state-icon class=${className} data-mc-part=${part ?? nothing} .hass=${hass} .stateObj=${stateObj}></ha-state-icon>`;
  }
  return html`<ha-icon class=${className} data-mc-part=${part ?? nothing} .icon=${entityIcon(hass, entityId) || fallback}></ha-icon>`;
}
