import type { CardModule, ColumnConfig } from '../types';
import { cardStateOf } from '../editor/custom/bridge';
import { deepClone } from '../utils/deep-merge';
import { generateId } from '../utils/id-generator';

// "Add an image module behind the content": appends an image module with `placement: background` to the first column of the card.
export function addImageModuleBehind(from: EventTarget, ref: string, aspect?: string): boolean {
  const sm = cardStateOf(from);
  if (!sm) return false;
  const config = deepClone(sm.getConfig());
  const column: ColumnConfig | undefined = config.rows?.[0]?.columns?.[0];
  if (!column) return false;
  const module: CardModule & Record<string, unknown> = { id: generateId('image'), type: 'image', image: ref, fit: 'cover', placement: 'background' };
  if (aspect) module.aspect_ratio = aspect;
  column.modules = [...(column.modules ?? []), module];
  sm.updateConfig(config, true);
  return true;
}
