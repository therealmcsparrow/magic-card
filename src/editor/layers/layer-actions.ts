import type { Placement } from '../../contracts/layer-placement';
import type { CardModule } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import { wrapOnChangeWithSync } from '../state/template-sync';
import type { ModuleSelection } from '../studio/selection';
import { containerOf, reorderTarget, setPlacement, type MoveTo } from './placement-model';

/*
 * Editor-state actions of the layer editor, shared by the inspector (order buttons), the tree / canvas item
 * menu (Put behind others, Put on top, Back to normal) and the float bar. The editor state manager is the
 * only writer; every action is one undo step except a nested reorder over several places.
 */

/** Write a module the way the inspector does: a template-linked top-level module marks the changed keys not synced. */
export function writeModule(sm: EditorStateManager, sel: ModuleSelection, next: CardModule): void {
  const config = sm.getConfig();
  const current = containerOf(config, sel)?.list[sel.child?.length ? sel.child[sel.child.length - 1].index : sel.module];
  const write = (m: CardModule): void => sm.replaceModule(sel.row, sel.col, sel.module, m, sel.child);
  if (config.template && !sel.child?.length && current) wrapOnChangeWithSync(current, write)(next);
  else write(next);
}

/** Put the module behind others, on top or back to normal. */
export function applyPlacement(sm: EditorStateManager, sel: ModuleSelection, placement: Placement): boolean {
  const config = sm.getConfig();
  const found = containerOf(config, sel);
  const mod = found?.list[found.index];
  if (!mod) return false;
  writeModule(sm, sel, setPlacement(mod, placement));
  return true;
}

/** Move a layered module among the layers of its placement; the selection follows it. */
export function moveLayer(sm: EditorStateManager, sel: ModuleSelection, to: MoveTo): boolean {
  const config = sm.getConfig();
  const found = containerOf(config, sel);
  if (!found) return false;
  const target = reorderTarget(found.list, found.index, to);
  if (target === undefined) return false;
  if (!sel.child?.length) {
    sm.setSelectedPath({ rowIndex: sel.row, columnIndex: sel.col, moduleIndex: target });
    sm.moveModule(sel.row, sel.col, found.index, sel.row, sel.col, target);
    return true;
  }
  // nested: one step at a time through the state manager (it marks a linked card's child list)
  const dir = target > found.index ? 1 : -1;
  let step = sel;
  for (let i = found.index; i !== target; i += dir) {
    const last = step.child![step.child!.length - 1];
    if (!sm.moveModuleBy(step.row, step.col, step.module, dir, step.child)) return false;
    step = { ...step, child: [...step.child!.slice(0, -1), { slot: last.slot, index: last.index + dir }] };
  }
  return true;
}

/** Card key `layers_low_power`: one undo step. */
export function turnOnLowPower(sm: EditorStateManager): void {
  sm.updateConfig({ ...sm.getConfig(), layers_low_power: true });
}
