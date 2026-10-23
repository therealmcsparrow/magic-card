import type { MagicCardConfig } from '../../types';
import { childListKey } from '../../utils/module-path';

/**
 * Template-linked card: a change to a layout's children (any depth) overrides the top-level layout
 * module's whole child list, the same as editing a child in the inspector (mutates: a clone).
 */
export function markChildList(config: MagicCardConfig, rowIndex: number, colIndex: number, moduleIndex: number): void {
  if (!config.template) return;
  const top = config.rows[rowIndex]?.columns[colIndex]?.modules[moduleIndex];
  const key = childListKey(top);
  if (!top || !key) return;
  const marks = (top.not_synced || []) as string[];
  if (!marks.includes(key)) top.not_synced = [...marks, key];
}

/**
 * Template-linked card: the template merge matches top-level modules by id, so a changed module list
 * of a column becomes this card's own (mutates: a clone).
 */
export function markColumnModules(config: MagicCardConfig, rowIndex: number, colIndex: number): void {
  if (!config.template) return;
  const col = config.rows[rowIndex]?.columns[colIndex];
  if (col && !col.not_synced?.includes('modules')) col.not_synced = [...(col.not_synced || []), 'modules'];
}
