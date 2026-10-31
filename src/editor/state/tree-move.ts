import type { CardModule, EditorPath, MagicCardConfig } from '../../types';
import type { ModuleSelection } from '../studio/selection';
import { ChildStep, childSlots } from '../../utils/module-path';
import { descendantAt, mutableSlot } from '../../utils/module-path-edit';
import { deepClone } from '../../utils/deep-merge';
import { markChildList, markColumnModules } from './template-marks';

// Where a moved module lands: a card column row/col, or a slot of a layout module.
export interface DropPlace {
  row: number;
  col: number;
  module?: number;
  child?: ChildStep[];
  slot?: number;
  index: number;
}

const sameSteps = (a: readonly ChildStep[], b: readonly ChildStep[]) =>
  a.every((s, i) => b[i] && b[i].slot === s.slot && b[i].index === s.index);

/** Whether the destination container is the source module or inside it (a move there is not allowed). */
export function insideSource(from: ModuleSelection, to: DropPlace): boolean {
  if (to.module === undefined) return false;
  if (to.row !== from.row || to.col !== from.col || to.module !== from.module) return false;
  const src = from.child ?? [];
  const dst = to.child ?? [];
  return dst.length >= src.length && sameSteps(src, dst);
}

function findPath(config: MagicCardConfig, target: CardModule): EditorPath | undefined {
  const walk = (list: CardModule[], chain: ChildStep[]): ChildStep[] | undefined => {
    for (let index = 0; index < list.length; index++) {
      if (list[index] === target) return [...chain, { slot: -1, index }];
      const slots = childSlots(list[index]);
      for (let slot = 0; slots && slot < slots.length; slot++) {
        const hit = walk(slots[slot], [...chain, { slot, index }]);
        if (hit) return hit;
      }
    }
    return undefined;
  };
  for (let r = 0; r < config.rows.length; r++) {
    for (let c = 0; c < config.rows[r].columns.length; c++) {
      const hit = walk(config.rows[r].columns[c].modules ?? [], []);
      if (!hit) continue;
      const [top, ...rest] = hit;
      const path: EditorPath = { rowIndex: r, columnIndex: c, moduleIndex: top.index };
      if (rest.length) {
        // a walk entry holds the slot its module is entered through, so a step takes the slot of the entry before it
        const steps: ChildStep[] = [];
        let prevSlot = top.slot;
        for (const s of rest) {
          steps.push({ slot: prevSlot, index: s.index });
          prevSlot = s.slot;
        }
        path.childPath = steps;
      }
      return path;
    }
  }
  return undefined;
}

/**
 * Move a module to a drop place (card column or a layout slot, any depth) in a copy of `config`.
 * Undefined when the move is not allowed (into itself or its descendants), the place does not
 * exist or nothing would change. Pure: the caller applies it with one updateConfig.
 */
export function moveModuleTo(
  config: MagicCardConfig,
  from: ModuleSelection,
  to: DropPlace,
): { config: MagicCardConfig; path: EditorPath } | undefined {
  if (insideSource(from, to)) return undefined;
  const next = deepClone(config);
  const topOf = (row: number, col: number, module: number) => next.rows[row]?.columns[col]?.modules?.[module];

  const srcTop = topOf(from.row, from.col, from.module);
  const srcSteps = from.child ?? [];
  let srcList: CardModule[] | undefined;
  let srcIndex: number;
  if (srcSteps.length) {
    const owner = descendantAt(srcTop, srcSteps.slice(0, -1));
    const last = srcSteps[srcSteps.length - 1];
    srcList = owner && mutableSlot(owner, last.slot);
    srcIndex = last.index;
  } else {
    srcList = next.rows[from.row]?.columns[from.col]?.modules;
    srcIndex = from.module;
  }
  const moved = srcList?.[srcIndex];
  if (!srcList || !moved) return undefined;

  const dstTop = to.module === undefined ? undefined : topOf(to.row, to.col, to.module);
  let dstList: CardModule[] | undefined;
  if (to.module === undefined) {
    dstList = next.rows[to.row]?.columns[to.col]?.modules;
  } else {
    const owner = descendantAt(dstTop, to.child ?? []);
    dstList = owner && mutableSlot(owner, to.slot ?? 0);
  }
  if (!dstList) return undefined;

  let index = Math.max(0, Math.min(to.index, dstList.length));
  if (dstList === srcList) {
    if (srcIndex < index) index -= 1;
    if (index === srcIndex) return undefined;
  }
  srcList.splice(srcIndex, 1);
  dstList.splice(index, 0, moved);

  if (next.template) {
    const srcNested = srcSteps.length > 0;
    const dstNested = to.module !== undefined;
    const topIndex = (top: CardModule | undefined, row: number, col: number) =>
      next.rows[row].columns[col].modules.indexOf(top as CardModule);
    if (srcNested) markChildList(next, from.row, from.col, topIndex(srcTop, from.row, from.col));
    if (dstNested) markChildList(next, to.row, to.col, topIndex(dstTop, to.row, to.col));
    if (!srcNested && dstNested) markColumnModules(next, from.row, from.col);
    if (srcNested && !dstNested) markColumnModules(next, to.row, to.col);
  }

  const path = findPath(next, moved);
  return path ? { config: next, path } : undefined;
}
