import type { ColumnConfig, NestedColumnConfig } from '../../types';
import { generateId } from '../../utils/id-generator';

/**
 * The one create path for card columns and a row module's columns: they share their entity with the
 * modules inside (`share_entity: true`, contract entity-scope 1.1.0). Duplicate and paste keep their YAML.
 */
export const newColumn = (): ColumnConfig & NestedColumnConfig => ({ id: generateId('col'), share_entity: true, modules: [] });

/** `merged` without the keys that `updates` sets to undefined (a removed entity leaves no `entity: undefined` behind). */
export function dropUndefined<T extends object>(merged: T, updates: object): T {
  for (const [k, v] of Object.entries(updates)) if (v === undefined) delete (merged as Record<string, unknown>)[k];
  return merged;
}
