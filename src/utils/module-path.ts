import type { CardModule } from '../types';

/** One step from a layout module to one of its children: `slot` and `index`. */
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
