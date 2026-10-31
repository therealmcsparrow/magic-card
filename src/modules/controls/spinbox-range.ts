import type { HassEntity } from '../../types';

// A thermostat in a range mode (heat_cool) has no single target temperature: its low / high ends,
// when the spinbox shows the target temperature.
export function climateRange(stateObj: HassEntity | undefined, attribute: string | undefined): [number, number] | undefined {
  if (!stateObj?.entity_id.startsWith('climate.') || (attribute && attribute !== 'temperature')) return undefined;
  const a = stateObj.attributes || {};
  const low = typeof a.target_temp_low === 'number' ? a.target_temp_low : undefined;
  const high = typeof a.target_temp_high === 'number' ? a.target_temp_high : undefined;
  return low !== undefined && high !== undefined && typeof a.temperature !== 'number' ? [low, high] : undefined;
}
