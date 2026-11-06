import type { CardModule } from '../types';
import { ChildStep, childSlots, hasChildSlots } from './module-path';

/* The module tree helpers only the card editor uses (the card reads children with module-path.ts). */

/** Layouts whose slots are tree nodes (tabs, row-module columns). */
export function hasSlotNodes(mod: CardModule | undefined): boolean {
  return mod?.type === 'row' || mod?.type === 'tabs';
}

export function childAt(mod: CardModule | undefined, step: ChildStep): CardModule | undefined {
  return childSlots(mod)?.[step.slot]?.[step.index];
}

/** The module at the end of a chain of steps below `mod` (`mod` itself for an empty chain). */
export function descendantAt(mod: CardModule | undefined, chain: readonly ChildStep[]): CardModule | undefined {
  let cur = mod;
  for (const step of chain) {
    cur = childAt(cur, step);
    if (!cur) return undefined;
  }
  return cur;
}

/**
 * The (mutable) child list of `mod` for `slot`, created when YAML omitted it. Only for configs the
 * caller owns (a deep clone).
 */
export function mutableSlot(mod: CardModule, slot: number): CardModule[] | undefined {
  const rec = mod as Record<string, unknown>;
  if (mod.type === 'row' || mod.type === 'tabs') {
    const key = mod.type === 'row' ? 'columns' : 'tabs';
    const list = rec[key] as Array<{ modules?: CardModule[] }> | undefined;
    const entry = list?.[slot];
    if (!entry) return undefined;
    if (!Array.isArray(entry.modules)) entry.modules = [];
    return entry.modules;
  }
  if (slot !== 0 || !hasChildSlots(mod)) return undefined;
  if (!Array.isArray(rec.modules)) rec.modules = [];
  return rec.modules as CardModule[];
}

/** "slot.index/slot.index" — the child part of an editor path. */
export function formatChildChain(chain: readonly ChildStep[]): string {
  return chain.map((s) => `${s.slot}.${s.index}`).join('/');
}

/** A copy of `mod` with the descendant at `chain` replaced (copies only the modules on the way). */
export function replaceDescendant(mod: CardModule, chain: readonly ChildStep[], next: CardModule): CardModule {
  if (!chain.length) return next;
  const [step, ...rest] = chain;
  const current = childAt(mod, step);
  if (!current) return mod;
  const replaced = replaceDescendant(current, rest, next);
  const rec = mod as Record<string, unknown>;
  const swap = (list: CardModule[] | undefined) => (list || []).map((m, i) => (i === step.index ? replaced : m));
  if (mod.type === 'row' || mod.type === 'tabs') {
    const key = mod.type === 'row' ? 'columns' : 'tabs';
    const slots = (rec[key] as Array<{ modules?: CardModule[] }>).map((s, i) =>
      i === step.slot ? { ...s, modules: swap(s.modules) } : s,
    );
    return { ...mod, [key]: slots } as CardModule;
  }
  return { ...mod, modules: swap(rec.modules as CardModule[]) } as CardModule;
}
