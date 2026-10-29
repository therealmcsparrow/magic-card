import type { CardModule, FlowConfig, HomeAssistant, MagicCardConfig } from '../../types';
import { generateId } from '../../utils/id-generator';
import { childListKey, childSlots } from '../../utils/module-path';
import { slotLabel } from '../slot-label';
import { ModuleSelection, moduleAt, moduleDisplayName, moduleLabel, moduleSelection, modulePathAttr } from '../studio/selection';
import { t, m } from '../i18n';

/**
 * Editor side of flow lines: the modules a flow can connect, module ids for flow endpoints (written
 * when a module has none) and keeping `flows` consistent when modules are deleted.
 */

/** One module a flow can start or end at (nested layout children included). */
export interface FlowModuleOption {
  /** Select value: the module id, or `@<path>` for a module without an id (gets one when picked). */
  value: string;
  id?: string;
  /** "Row 1 · Column 2 · Button · Toggle" (its label, else its entity's name). */
  label: string;
  /** Short name for headers: "Toggle" (its own label), its entity's name, or "Button". */
  name: string;
  sel: ModuleSelection;
  /** The module's `type` (the editor shows "Attach to" for the types in FLOW_ANCHOR_TYPES). */
  type?: string;
  /** Template-linked card, a template module without an id: not pickable (`templateIdMissing`). */
  locked?: boolean;
}

/** Why a locked module can't be picked (From / To, studio connect mode). */
export const TEMPLATE_ID_HINT = m('card-editor.flows.give-this-module-an-id-in-the-template');

/** Prefix of a select value for a module without an id. */
const PATH_PREFIX = '@';

function idOf(mod: CardModule | undefined): string | undefined {
  return mod && typeof mod.id === 'string' && mod.id ? mod.id : undefined;
}

/** A module's own label, else its entity's friendly name (or id): what tells two Info modules apart. */
function ownName(mod: CardModule, hass?: HomeAssistant): string | undefined {
  const label = moduleLabel(mod);
  if (label) return label;
  const entity = typeof mod.entity === 'string' ? mod.entity.trim() : '';
  if (!entity) return undefined;
  const friendly = hass?.states?.[entity]?.attributes?.friendly_name;
  return typeof friendly === 'string' && friendly.trim() ? friendly.trim() : entity;
}

/**
 * A top-level module of a template-linked card without an id came from the template (the merge
 * matches modules by id): an id written locally would duplicate it or lose the flow on the next sync.
 * The same for an id-less child of such a module (its child-list override can't be matched either).
 */
export function templateIdMissing(config: MagicCardConfig, sel: ModuleSelection): boolean {
  if (!config.template) return false;
  const mod = moduleAt(config, sel);
  if (!mod || idOf(mod)) return false;
  return !sel.child?.length || !idOf(config.rows[sel.row]?.columns[sel.col]?.modules[sel.module]);
}

/** Every module of the card, in reading order, nested children after their layout module. */
export function flowModuleOptions(config: MagicCardConfig, hass?: HomeAssistant): FlowModuleOption[] {
  const out: FlowModuleOption[] = [];
  const visit = (mod: CardModule, sel: ModuleSelection, trail: string[]) => {
    if (!mod || typeof mod !== 'object') return;
    const type = moduleDisplayName(mod);
    const own = ownName(mod, hass);
    const id = idOf(mod);
    out.push({
      value: id ?? `${PATH_PREFIX}${modulePathAttr(sel)}`,
      id,
      label: [...trail, type, ...(own ? [own] : [])].join(' · '),
      name: own ?? type,
      ...(typeof mod.type === 'string' ? { type: mod.type } : {}),
      sel,
      ...(templateIdMissing(config, sel) ? { locked: true } : {}),
    });
    (childSlots(mod) ?? []).forEach((slot, s) => {
      const slotName = slotLabel(mod, s);
      slot.forEach((child, i) =>
        visit(child, moduleSelection(sel.row, sel.col, sel.module, [...(sel.child ?? []), { slot: s, index: i }]), [
          ...trail,
          type,
          ...(slotName ? [slotName] : []),
        ]),
      );
    });
  };
  (config.rows || []).forEach((row, r) =>
    (row?.columns || []).forEach((col, c) =>
      (col?.modules || []).forEach((mod, m) => visit(mod, moduleSelection(r, c, m), [t('card-editor.flows.row-n', { n: r + 1 }), t('card-editor.flows.column-n', { n: c + 1 })])),
    ),
  );
  // Identical labels (two unlabelled Text modules in a column) get their position in their list.
  const count = new Map<string, number>();
  for (const o of out) count.set(o.label, (count.get(o.label) ?? 0) + 1);
  for (const o of out) {
    if ((count.get(o.label) ?? 0) < 2) continue;
    const step = o.sel.child?.[o.sel.child.length - 1];
    o.label = `${o.label} · ${t('card-editor.flows.module-n', { n: (step ? step.index : o.sel.module) + 1 })}`;
  }
  return out;
}

/** The ids of a module and every module nested in it. */
export function moduleIdsIn(mod: CardModule | undefined, out = new Set<string>()): Set<string> {
  if (!mod || typeof mod !== 'object') return out;
  const id = idOf(mod);
  if (id) out.add(id);
  for (const slot of childSlots(mod) ?? []) for (const child of slot) moduleIdsIn(child, out);
  return out;
}

/** The ids of every module in the card (nested children included). */
export function allModuleIds(config: MagicCardConfig): Set<string> {
  const out = new Set<string>();
  for (const row of config.rows || []) for (const col of row?.columns || []) for (const mod of col?.modules || []) moduleIdsIn(mod, out);
  return out;
}

/**
 * The id of the module at `sel`, generated and written into `config` when it has none (mutates: a
 * clone). On a template-linked card a nested child's new id overrides its layout's child list; an
 * id-less top-level module gets none (undefined: `templateIdMissing`).
 */
export function ensureModuleId(config: MagicCardConfig, sel: ModuleSelection): string | undefined {
  const mod = moduleAt(config, sel);
  if (!mod) return undefined;
  const id = idOf(mod);
  if (id) return id;
  if (templateIdMissing(config, sel)) return undefined;
  mod.id = generateId(mod.type || 'module');
  if (config.template && sel.child?.length) {
    const top = config.rows[sel.row]?.columns[sel.col]?.modules[sel.module];
    const key = childListKey(top);
    const marks = (top?.not_synced || []) as string[];
    if (top && key && !marks.includes(key)) top.not_synced = [...marks, key];
  }
  return mod.id;
}

/**
 * A select value (`id` or `@path`) to a module id, writing an id into a module that has none
 * (mutates: a clone); undefined when the module is gone.
 */
export function resolveFlowEndpoint(config: MagicCardConfig, value: string, options = flowModuleOptions(config)): string | undefined {
  if (!value.startsWith(PATH_PREFIX)) return value;
  const opt = options.find((o) => o.value === value);
  return opt && !opt.locked ? ensureModuleId(config, opt.sel) : undefined;
}

/** A new, empty flow (the editor shows "Pick the start module" / "Pick the end module"). */
export function newFlow(): FlowConfig {
  return { id: generateId('flow') } as FlowConfig;
}

/** Mark `flows` overridden on a template-linked card (mutates). */
export function markFlowsOverridden(config: MagicCardConfig): void {
  if (!config.template) return;
  const marks = config.not_synced || [];
  if (!marks.includes('flows')) config.not_synced = [...marks, 'flows'];
}

/**
 * After an edit that removed modules: drop the flows that pointed at a module that existed in
 * `before` and is gone from `after` (mutates `after`). Flows with ids that were already unknown
 * stay (the editor shows "Module not found"). True when flows changed.
 */
export function pruneFlows(before: MagicCardConfig, after: MagicCardConfig): boolean {
  const flows = after.flows;
  if (!Array.isArray(flows) || !flows.length) return false;
  const had = allModuleIds(before);
  const has = allModuleIds(after);
  const gone = (id: unknown) => typeof id === 'string' && had.has(id) && !has.has(id);
  const kept = flows.filter((f) => !(f && typeof f === 'object' && (gone(f.from) || gone(f.to))));
  if (kept.length === flows.length) return false;
  if (kept.length) after.flows = kept;
  else delete after.flows;
  markFlowsOverridden(after);
  return true;
}
