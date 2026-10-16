import type { CardModule } from '../types';

/**
 * One step from a layout module to one of its children: `slot` is the column (row module) or tab
 * (tabs module) and is 0 for layouts with one flat `modules` list (horizontal, vertical,
 * slider-layout); `index` is the child's position in that slot.
 */
export interface ChildStep {
  slot: number;
  index: number;
}

/** The child lists of a layout module, one per slot; undefined for modules without children. */
export function childSlots(mod: CardModule | undefined): CardModule[][] | undefined {
  if (!mod || typeof mod !== 'object') return undefined;
  const rec = mod as Record<string, unknown>;
  if (mod.type === 'row') {
    const cols = rec.columns as Array<{ modules?: CardModule[] }> | undefined;
    return Array.isArray(cols) ? cols.map((c) => (Array.isArray(c?.modules) ? c.modules : [])) : [];
  }
  if (mod.type === 'tabs') {
    const tabs = rec.tabs as Array<{ modules?: CardModule[] }> | undefined;
    return Array.isArray(tabs) ? tabs.map((t) => (Array.isArray(t?.modules) ? t.modules : [])) : [];
  }
  if (Array.isArray(rec.modules)) return [rec.modules as CardModule[]];
  if (mod.type === 'horizontal' || mod.type === 'vertical' || mod.type === 'slider-layout') return [[]];
  return undefined;
}

/**
 * The config key holding a layout module's children (`columns` for a row, `tabs` for tabs, `modules`
 * for flat layouts); undefined for modules without children. On a template-linked card this key is
 * the one override for all of the layout's children.
 */
export function childListKey(mod: CardModule | undefined): 'columns' | 'tabs' | 'modules' | undefined {
  if (!hasChildSlots(mod)) return undefined;
  return mod!.type === 'row' ? 'columns' : mod!.type === 'tabs' ? 'tabs' : 'modules';
}

/** Whether a module is a layout module that holds child modules. */
export function hasChildSlots(mod: CardModule | undefined): boolean {
  return childSlots(mod) !== undefined;
}

/** Layouts whose slots are tree nodes (tabs, row-module columns). */
export function hasSlotNodes(mod: CardModule | undefined): boolean {
  return mod?.type === 'row' || mod?.type === 'tabs';
}

/** Name of a slot as the editor shows it ("Column 2", "Tab label"); undefined for flat layouts. */
export function slotLabel(mod: CardModule, slot: number): string | undefined {
  if (mod.type === 'row') return `Column ${slot + 1}`;
  if (mod.type === 'tabs') {
    const tab = (mod as { tabs?: Array<{ label?: string }> }).tabs?.[slot];
    return tab?.label?.trim() || `Tab ${slot + 1}`;
  }
  return undefined;
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

/** Parse "slot.index/slot.index" (a bare "index" means slot 0); undefined when malformed. */
export function parseChildChain(text: string): ChildStep[] | undefined {
  if (!text) return [];
  const out: ChildStep[] = [];
  for (const part of text.split('/')) {
    const m = /^(?:(\d+)\.)?(\d+)$/.exec(part);
    if (!m) return undefined;
    out.push({ slot: m[1] === undefined ? 0 : Number(m[1]), index: Number(m[2]) });
  }
  return out;
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
