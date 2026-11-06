import type { HassEntity, ValueBound } from '../types';
import { entityNumber } from './entity-value';

/** A min / max that is a number or `{ entity, attribute? }`; anything unreadable is `def`. */
export function resolveBound(v: ValueBound | string | undefined, states: Record<string, HassEntity> | undefined, def: number): number {
  if (v && typeof v === 'object') {
    const id = typeof v.entity === 'string' ? v.entity : '';
    return entityNumber(id ? states?.[id] : undefined, v.attribute || undefined) ?? def;
  }
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : def;
}
