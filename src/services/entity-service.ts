import { HomeAssistant, HassEntity } from '../types';

export class EntityService {
  static getEntity(hass: HomeAssistant, entityId: string): HassEntity | undefined {
    return hass.states[entityId];
  }

  static getState(hass: HomeAssistant, entityId: string): string | undefined {
    return hass.states[entityId]?.state;
  }

  static getAttribute(
    hass: HomeAssistant,
    entityId: string,
    attribute: string,
  ): unknown {
    return hass.states[entityId]?.attributes[attribute];
  }

  static getNumericState(hass: HomeAssistant, entityId: string): number | undefined {
    const state = hass.states[entityId]?.state;
    if (state === undefined) return undefined;
    const num = Number(state);
    return isNaN(num) ? undefined : num;
  }

  static isOn(hass: HomeAssistant, entityId: string): boolean {
    const state = hass.states[entityId]?.state;
    return state === 'on' || state === 'home' || state === 'open' || state === 'playing';
  }

  static isOff(hass: HomeAssistant, entityId: string): boolean {
    const state = hass.states[entityId]?.state;
    return state === 'off' || state === 'not_home' || state === 'closed' || state === 'idle' || state === 'paused';
  }

  static isUnavailable(hass: HomeAssistant, entityId: string): boolean {
    const state = hass.states[entityId]?.state;
    return state === 'unavailable' || state === 'unknown' || state === undefined;
  }

  static getDomain(entityId: string): string {
    return entityId.split('.')[0];
  }

  static getFriendlyName(hass: HomeAssistant, entityId: string): string {
    return (hass.states[entityId]?.attributes.friendly_name as string) || entityId;
  }

  static getIcon(hass: HomeAssistant, entityId: string): string | undefined {
    return hass.states[entityId]?.attributes.icon as string | undefined;
  }

  static getUnitOfMeasurement(hass: HomeAssistant, entityId: string): string | undefined {
    return hass.states[entityId]?.attributes.unit_of_measurement as string | undefined;
  }

  static formatState(hass: HomeAssistant, entityId: string): string {
    const entity = hass.states[entityId];
    if (!entity) return 'Unknown';
    return hass.formatEntityState(entity);
  }
}
