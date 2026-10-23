import type { CardModule, EditorPath, MagicCardConfig, ModuleType } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { CSS_SECTORS } from '../../utils/css-properties';
import { ChildStep, childSlots, descendantAt, hasChildSlots, mutableSlot } from '../../utils/module-path';
import { deepClone } from '../../utils/deep-merge';
import type { ModuleSelection } from '../studio/selection';
import { selectionToPath } from '../studio/selection';
import { localiseCreationDefaults } from './creation-defaults';
import { CHILD_KEYS, COMMON_MODULE_KEYS, LAYOUT_TYPES, MODULE_KEYS } from './module-keys';
import { markChildList, markColumnModules } from './template-marks';

type Loose = Record<string, unknown>;

const isLayoutType = (type: string): boolean => (LAYOUT_TYPES as readonly string[]).includes(type);

/** The types a module can be replaced with: layouts by layouts, everything else (a separator too) by non-layouts. Not its own type. */
export function replaceTypes(mod: CardModule): ModuleType[] {
  const layout = isLayoutType(mod.type);
  const pool: readonly ModuleType[] = layout ? LAYOUT_TYPES : ModuleRegistry.types.filter((type) => !isLayoutType(type));
  return pool.filter((type) => type !== mod.type && ModuleRegistry.has(type));
}

/** Design keys of sectors that are not shown for `type` (the button part keys, the tab bar keys). */
function foreignDesignKeys(type: ModuleType): Set<string> {
  const keys = new Set<string>();
  for (const sector of CSS_SECTORS) {
    if (sector.modules && !sector.modules.includes(type)) for (const p of sector.properties) keys.add(p.key);
  }
  return keys;
}

/** `design` without the keys of other types' sectors, also in its hover design and conditional rules; `count` counts what went. */
function pruneDesign(design: unknown, foreign: Set<string>, count: { n: number }): unknown {
  if (!design || typeof design !== 'object' || Array.isArray(design)) return design;
  const out: Loose = {};
  for (const [k, v] of Object.entries(design as Loose)) {
    if (foreign.has(k)) {
      count.n++;
      continue;
    }
    if (k === 'hover') out[k] = pruneDesign(v, foreign, count);
    else if (k === 'conditional' && Array.isArray(v)) {
      out[k] = v.map((rule) => (rule && typeof rule === 'object' ? { ...(rule as Loose), design: pruneDesign((rule as Loose).design, foreign, count) } : rule));
    } else out[k] = v;
  }
  return out;
}

/** The module list holding the selected module in `config` (a clone the caller owns), and its index there. */
function listOf(config: MagicCardConfig, sel: ModuleSelection): { list: CardModule[]; index: number } | undefined {
  const modules = config.rows[sel.row]?.columns[sel.col]?.modules;
  if (!modules) return undefined;
  if (!sel.child?.length) return modules[sel.module] ? { list: modules, index: sel.module } : undefined;
  const steps: ChildStep[] = sel.child;
  const parent = descendantAt(modules[sel.module], steps.slice(0, -1));
  const last = steps[steps.length - 1];
  const list = parent ? mutableSlot(parent, last.slot) : undefined;
  return list?.[last.index] ? { list, index: last.index } : undefined;
}

/**
 * Replace the selected module by a module of `type`, in a copy of `config`. Keeps the common keys
 * (entity, design, actions, conditions, name ...) and every key the new type lists; drops the rest, and
 * the design keys that only another type shows. A layout's modules are all kept: flattened in slot order
 * into a flat layout, one column of a row, one tab of tabs. Undefined for a type of the other kind, the
 * same type or an unknown one. `dropped` counts the settings that did not carry over. Pure: the caller
 * applies it with one updateConfig and selects `path` (the same place).
 */
export function retypeModule(
  config: MagicCardConfig,
  sel: ModuleSelection,
  type: ModuleType,
): { config: MagicCardConfig; path: EditorPath; dropped: number } | undefined {
  const found = listOf(config, sel);
  const old = found?.list[found.index];
  if (!old || !replaceTypes(old).includes(type)) return undefined;
  const next = deepClone(config);
  const at = listOf(next, sel);
  const made = ModuleRegistry.createDefault(type);
  if (!at || !made) return undefined;
  const from = at.list[at.index] as unknown as Loose;
  const fresh = localiseCreationDefaults(made) as unknown as Loose;

  const count = { n: 0 };
  const own = MODULE_KEYS[type];
  const children = hasChildSlots(from as unknown as CardModule) ? (childSlots(from as unknown as CardModule) ?? []).flat() : [];
  for (const [k, v] of Object.entries(from)) {
    if (k === 'type' || CHILD_KEYS.includes(k)) continue;
    if (COMMON_MODULE_KEYS.includes(k) || own.includes(k)) fresh[k] = v;
    else count.n++;
  }
  if (isLayoutType(type) && isLayoutType(String(from.type)) && !('share_entity' in from)) delete fresh.share_entity;

  if (isLayoutType(type)) {
    if (type === 'row') {
      const col = (fresh.columns as Loose[])[0];
      col.modules = children;
      fresh.columns = [col];
      fresh.layout = '1';
      delete fresh.column_widths;
    } else if (type === 'tabs') {
      const tab = (fresh.tabs as Loose[])[0];
      tab.modules = children;
      fresh.tabs = [tab];
      fresh.active_tab = 0;
    } else fresh.modules = children;
  }

  const foreign = foreignDesignKeys(type);
  if (fresh.design) fresh.design = pruneDesign(fresh.design, foreign, count);
  if (Array.isArray(fresh.not_synced)) {
    const kept = (fresh.not_synced as string[]).filter((p) => String(p).split('.')[0] in fresh);
    if (kept.length) fresh.not_synced = kept;
    else delete fresh.not_synced;
  }

  at.list[at.index] = fresh as unknown as CardModule;
  if (sel.child?.length) markChildList(next, sel.row, sel.col, sel.module);
  else markColumnModules(next, sel.row, sel.col);
  const path = selectionToPath(sel);
  return path ? { config: next, path, dropped: count.n } : undefined;
}
