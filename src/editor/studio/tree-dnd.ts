import type { CardModule, MagicCardConfig } from '../../types';
import { childSlots, hasChildSlots, hasSlotNodes } from '../../utils/module-path';
import { insideSource, type DropPlace } from '../state/tree-move';
import { moduleAt, type ModuleSelection, type Selection } from './selection';

/** Where on a tree item the pointer is: next to it, or inside it. */
export type DropZone = 'before' | 'after' | 'inside';

/** The item a drag hovers (its selection key), the zone, and the place a drop there would use. */
export interface PlaceTarget {
  type: 'place';
  key: string;
  zone: DropZone;
  place: DropPlace;
}

/**
 * Zone for a pointer at `fraction` (0 top, 1 bottom) of a module row: leaf modules split in halves,
 * flat layouts (horizontal, vertical, slider-layout) have a 25 % edge each side and take drops inside
 * in the middle, tabs and row modules only take drops beside them (their tabs / columns are inside).
 */
export function zoneAt(mod: CardModule | undefined, fraction: number): DropZone {
  if (!hasChildSlots(mod) || hasSlotNodes(mod)) return fraction < 0.5 ? 'before' : 'after';
  return fraction < 0.25 ? 'before' : fraction > 0.75 ? 'after' : 'inside';
}

/** The drop place for hovering `target` in `zone`; undefined where that zone is not offered. */
export function placeFor(config: MagicCardConfig, target: Selection, zone: DropZone): DropPlace | undefined {
  if (target.kind === 'column') {
    return zone === 'inside' ? { row: target.row, col: target.col, index: 0 } : undefined;
  }
  if (target.kind === 'slot') {
    if (zone !== 'inside') return undefined;
    const owner = moduleAt(config, { kind: 'module', row: target.row, col: target.col, module: target.module, child: target.child });
    const len = childSlots(owner)?.[target.slot]?.length ?? 0;
    return { row: target.row, col: target.col, module: target.module, ...stepsOf(target.child), slot: target.slot, index: len };
  }
  if (target.kind !== 'module') return undefined;
  if (zone === 'inside') {
    const mod = moduleAt(config, target);
    if (!hasChildSlots(mod) || hasSlotNodes(mod)) return undefined;
    const len = childSlots(mod)?.[0]?.length ?? 0;
    return { row: target.row, col: target.col, module: target.module, ...stepsOf(target.child), slot: 0, index: len };
  }
  const shift = zone === 'after' ? 1 : 0;
  const steps = target.child ?? [];
  if (!steps.length) return { row: target.row, col: target.col, index: target.module + shift };
  const last = steps[steps.length - 1];
  return { row: target.row, col: target.col, module: target.module, ...stepsOf(steps.slice(0, -1)), slot: last.slot, index: last.index + shift };
}

const stepsOf = (child: ModuleSelection['child']) => (child?.length ? { child: child.map((s) => ({ ...s })) } : {});

/** Whether dragging `from` onto `place` is allowed (not into itself or its descendants). */
export function canDropAt(from: ModuleSelection, place: DropPlace): boolean {
  return !insideSource(from, place);
}

/** Scroll the nearest scrollable ancestor of `el` while the pointer is within 32 px of its top or bottom edge. */
export function autoScroll(el: Element, clientY: number): void {
  let node: Element | null = el;
  while (node && node.scrollHeight <= node.clientHeight + 1) node = node.parentElement ?? ((node.getRootNode() as ShadowRoot).host ?? null);
  if (!node) return;
  const r = node.getBoundingClientRect();
  if (clientY < r.top + 32) node.scrollTop -= 12;
  else if (clientY > r.bottom - 32) node.scrollTop += 12;
}
