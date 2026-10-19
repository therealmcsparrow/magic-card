import type { ColumnConfig, NestedColumnConfig } from '../../types';
import { generateId } from '../../utils/id-generator';

/**
 * The one create path for card columns and a row module's columns: they share their entity with the
 * modules inside (`share_entity: true`, contract entity-scope 1.1.0). Duplicate and paste keep their YAML.
 */
export const newColumn = (): ColumnConfig & NestedColumnConfig => ({ id: generateId('col'), share_entity: true, modules: [] });
