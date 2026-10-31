import type { HassEntity, DropdownModuleConfig } from '../../types';

/**
 * What a dropdown sets on an entity: the option list it offers (an attribute of the entity), where
 * the current option comes from (the state or an attribute) and the service that selects one.
 */
export interface SelectAdapter {
  /** Attribute holding the current option; undefined: the state. */
  current?: string;
  /** Attribute listing the options ('' : only the custom options). */
  list: string;
  service: string;
  /** Service data key of the option. */
  field: string;
}

/** Per domain: the state (key '') or an attribute (key = attribute name) the dropdown can set. */
export const ADAPTERS: Record<string, Record<string, SelectAdapter>> = {
  input_select: { '': { list: 'options', service: 'select_option', field: 'option' } },
  select: { '': { list: 'options', service: 'select_option', field: 'option' } },
  // free text: the custom options are the choices
  input_text: { '': { list: '', service: 'set_value', field: 'value' } },
  text: { '': { list: '', service: 'set_value', field: 'value' } },
  climate: {
    '': { list: 'hvac_modes', service: 'set_hvac_mode', field: 'hvac_mode' },
    preset_mode: { current: 'preset_mode', list: 'preset_modes', service: 'set_preset_mode', field: 'preset_mode' },
    fan_mode: { current: 'fan_mode', list: 'fan_modes', service: 'set_fan_mode', field: 'fan_mode' },
    swing_mode: { current: 'swing_mode', list: 'swing_modes', service: 'set_swing_mode', field: 'swing_mode' },
  },
  fan: { preset_mode: { current: 'preset_mode', list: 'preset_modes', service: 'set_preset_mode', field: 'preset_mode' } },
  light: { effect: { current: 'effect', list: 'effect_list', service: 'turn_on', field: 'effect' } },
  media_player: {
    source: { current: 'source', list: 'source_list', service: 'select_source', field: 'source' },
    sound_mode: { current: 'sound_mode', list: 'sound_mode_list', service: 'select_sound_mode', field: 'sound_mode' },
  },
  water_heater: { operation_mode: { current: 'operation_mode', list: 'operation_list', service: 'set_operation_mode', field: 'operation_mode' } },
  humidifier: { mode: { current: 'mode', list: 'available_modes', service: 'set_mode', field: 'mode' } },
};

const DEFAULT_ATTRIBUTE: Record<string, string> = { fan: 'preset_mode', light: 'effect', media_player: 'source', water_heater: 'operation_mode', humidifier: 'mode' };

export function adapterFor(stateObj: HassEntity, attribute: string | undefined): SelectAdapter | undefined {
  const byDomain = ADAPTERS[stateObj.entity_id.split('.')[0]];
  if (!byDomain) return undefined;
  if (attribute) return byDomain[attribute];
  return byDomain[''] ?? byDomain[DEFAULT_ATTRIBUTE[stateObj.entity_id.split('.')[0]]];
}

/** The attributes (besides the state) a dropdown can set for this entity's domain. */
export function dropdownAttributes(entityId: string | undefined): string[] {
  if (!entityId) return [];
  return Object.keys(ADAPTERS[entityId.split('.')[0]] ?? {}).filter(Boolean);
}

export type DropdownOption = { label: string; value: string };

/** The values the entity accepts: its option list, or the custom options for free text entities. */
export function validOptions(stateObj: HassEntity | undefined, ad: SelectAdapter | undefined, custom: DropdownOption[]): string[] {
  if (!stateObj || !ad) return [];
  if (!ad.list) return custom.map((o) => o.value);
  const raw = stateObj.attributes?.[ad.list];
  return Array.isArray(raw) ? raw.map(String) : [];
}

/** The dummy options new dropdowns were created with before: they hide the entity's own options. */
const isOldDefault = (options: DropdownOption[]): boolean =>
  options.length === 3 && options.every((o, i) => o.label === `Option ${i + 1}` && o.value === `option_${i + 1}`);

/**
 * Configured options; YAML may list plain strings (`options: [a, b]`). Exactly the old dummy
 * default triple counts as none, so the entity's own options show.
 */
export function normalizeOptions(options: DropdownModuleConfig['options']): DropdownOption[] {
  if (!Array.isArray(options)) return [];
  const list = options
    .map((o) => (typeof o === 'string' || typeof o === 'number'
      ? { label: String(o), value: String(o) }
      : o && typeof o === 'object'
        ? { label: String(o.label ?? o.value ?? ''), value: String(o.value ?? o.label ?? '') }
        : undefined))
    .filter((o): o is DropdownOption => !!o && o.value !== '');
  return isOldDefault(list) ? [] : list;
}
