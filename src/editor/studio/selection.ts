import { t } from '../../i18n/labels';
import { html, TemplateResult } from 'lit';
import { CardModule, EditorPath, MagicCardConfig } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { ChildStep, childSlots, descendantAt, formatChildChain, hasSlotNodes, parseChildChain, slotLabel } from '../../utils/module-path';
import { hasColumnWidths } from '../../utils/column-widths';

export type Selection =
  | { kind: 'card' }
  | { kind: 'row'; row: number }
  | { kind: 'column'; row: number; col: number }
  /** A module in a column, or (`child`) a module nested in that layout module, outermost step first. */
  | { kind: 'module'; row: number; col: number; module: number; child?: ChildStep[] }
  /** A tab or row-module column (`slot`) of the layout module at row/col/module/child. */
  | { kind: 'slot'; row: number; col: number; module: number; child?: ChildStep[]; slot: number };

export type ModuleSelection = Extract<Selection, { kind: 'module' }>;
export type SlotSelection = Extract<Selection, { kind: 'slot' }>;

const copySteps = (child?: readonly ChildStep[]) =>
  child?.length ? { child: child.map((s) => ({ slot: s.slot, index: s.index })) } : {};

/** A module selection; `child` only when it has steps (plain modules compare equal to old selections). */
export function moduleSelection(row: number, col: number, module: number, child?: readonly ChildStep[]): ModuleSelection {
  return { kind: 'module', row, col, module, ...copySteps(child) };
}

/** A slot selection (tab / row-module column); `child` only when it has steps. */
export function slotSelection(row: number, col: number, module: number, child: readonly ChildStep[] | undefined, slot: number): SlotSelection {
  return { kind: 'slot', row, col, module, ...copySteps(child), slot };
}

/**
 * The parent of a selection. A layout child's parent is its layout module, or with `config` its tab /
 * row-module column (the tree's slot node) when the layout has slot nodes.
 */
export function parentSelection(sel: Selection, config?: MagicCardConfig): Selection {
  switch (sel.kind) {
    case 'card': return sel;
    case 'row': return { kind: 'card' };
    case 'column': return { kind: 'row', row: sel.row };
    case 'slot': return moduleSelection(sel.row, sel.col, sel.module, sel.child);
    case 'module': {
      if (!sel.child?.length) return { kind: 'column', row: sel.row, col: sel.col };
      const up = sel.child.slice(0, -1);
      const owner = config ? moduleAt(config, moduleSelection(sel.row, sel.col, sel.module, up)) : undefined;
      return hasSlotNodes(owner)
        ? slotSelection(sel.row, sel.col, sel.module, up, sel.child[sel.child.length - 1].slot)
        : moduleSelection(sel.row, sel.col, sel.module, up);
    }
  }
}

/** The module a selection points at (top-level or nested), if it exists. */
export function moduleAt(config: MagicCardConfig, sel: Selection): CardModule | undefined {
  if (sel.kind !== 'module') return undefined;
  const top = config.rows?.[sel.row]?.columns?.[sel.col]?.modules?.[sel.module];
  return descendantAt(top, sel.child ?? []);
}

/** The layout module owning a slot selection, if it exists. */
export function layoutModuleAt(config: MagicCardConfig, sel: Selection): CardModule | undefined {
  return sel.kind === 'slot' ? moduleAt(config, parentSelection(sel)) : undefined;
}

/**
 * The object a selection points at: the card config, a row, a column, a module, or a tab /
 * row-module column (slot) entry. Undefined when it does not exist.
 */
export function itemAt(config: MagicCardConfig, sel: Selection): Record<string, unknown> | undefined {
  switch (sel.kind) {
    case 'card': return config as unknown as Record<string, unknown>;
    case 'row': return config.rows?.[sel.row] as unknown as Record<string, unknown> | undefined;
    case 'column': return config.rows?.[sel.row]?.columns?.[sel.col] as unknown as Record<string, unknown> | undefined;
    case 'module': return moduleAt(config, sel);
    case 'slot': {
      const owner = layoutModuleAt(config, sel) as Record<string, unknown> | undefined;
      const list = owner?.type === 'tabs' ? owner.tabs : owner?.type === 'row' ? owner.columns : undefined;
      const entry = Array.isArray(list) ? list[sel.slot] : undefined;
      return entry && typeof entry === 'object' ? entry : undefined;
    }
  }
}

/** The editor-only layer name (`editor_name`) of an item, trimmed; undefined when it has none. */
export function layerName(item: unknown): string | undefined {
  const v = item && typeof item === 'object' ? (item as { editor_name?: unknown }).editor_name : undefined;
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Whether an item carries the studio's Hide flag (`hidden: true`). */
export function isHiddenItem(item: unknown): boolean {
  return !!item && typeof item === 'object' && (item as { hidden?: unknown }).hidden === true;
}

/** `data-mc-path` of a module selection in the studio canvas ("row.col.module/slot.index/..."). */
export function modulePathAttr(sel: ModuleSelection): string {
  const top = `${sel.row}.${sel.col}.${sel.module}`;
  return sel.child?.length ? `${top}/${formatChildChain(sel.child)}` : top;
}

/** Module selection from a `data-mc-path` value; null when malformed. */
export function selectionFromPathAttr(attr: string): ModuleSelection | null {
  const [top, ...rest] = attr.split('/');
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(top);
  const child = parseChildChain(rest.join('/'));
  if (!m || !child) return null;
  return moduleSelection(Number(m[1]), Number(m[2]), Number(m[3]), child);
}

export interface SelectionInfo {
  title: string;
  icon: string;
  crumbs: string[];
  subtitle?: string;
}

export function selectionFromPath(path: EditorPath | null): Selection {
  if (!path || path.rowIndex === undefined) return { kind: 'card' };
  if (path.columnIndex === undefined) return { kind: 'row', row: path.rowIndex };
  if (path.moduleIndex === undefined) return { kind: 'column', row: path.rowIndex, col: path.columnIndex };
  if (path.slotIndex !== undefined) return slotSelection(path.rowIndex, path.columnIndex, path.moduleIndex, path.childPath, path.slotIndex);
  return moduleSelection(path.rowIndex, path.columnIndex, path.moduleIndex, path.childPath);
}

export function selectionToPath(sel: Selection): EditorPath | null {
  switch (sel.kind) {
    case 'card': return null;
    case 'row': return { rowIndex: sel.row };
    case 'column': return { rowIndex: sel.row, columnIndex: sel.col };
    case 'module':
      return sel.child?.length
        ? { rowIndex: sel.row, columnIndex: sel.col, moduleIndex: sel.module, childPath: sel.child.map((s) => ({ ...s })) }
        : { rowIndex: sel.row, columnIndex: sel.col, moduleIndex: sel.module };
    case 'slot':
      return { ...selectionToPath(parentSelection(sel)), slotIndex: sel.slot };
  }
}

export function selectionKey(sel: Selection): string {
  switch (sel.kind) {
    case 'card': return 'card';
    case 'row': return `r${sel.row}`;
    case 'column': return `r${sel.row}.c${sel.col}`;
    case 'module': {
      const key = `r${sel.row}.c${sel.col}.m${sel.module}`;
      return sel.child?.length ? `${key}/${formatChildChain(sel.child)}` : key;
    }
    case 'slot': return `${selectionKey(parentSelection(sel))}#${sel.slot}`;
  }
}

export function selectionFromKey(key: string): Selection {
  const hash = key.indexOf('#');
  if (hash >= 0) {
    const owner = selectionFromKey(key.slice(0, hash));
    const slot = key.slice(hash + 1);
    return owner.kind === 'module' && /^\d+$/.test(slot)
      ? slotSelection(owner.row, owner.col, owner.module, owner.child, Number(slot))
      : { kind: 'card' };
  }
  const m = /^r(\d+)(?:\.c(\d+)(?:\.m(\d+)(?:\/(.+))?)?)?$/.exec(key);
  if (!m) return { kind: 'card' };
  const row = Number(m[1]);
  if (m[2] === undefined) return { kind: 'row', row };
  const col = Number(m[2]);
  if (m[3] === undefined) return { kind: 'column', row, col };
  const child = parseChildChain(m[4] ?? '');
  if (!child) return { kind: 'card' };
  return moduleSelection(row, col, Number(m[3]), child);
}

export function sameSelection(a: Selection, b: Selection): boolean {
  return selectionKey(a) === selectionKey(b);
}

/** Walk up to the nearest selection that exists in `config`. Modules clamp to the last module in the column. */
export function clampSelection(config: MagicCardConfig, sel: Selection): Selection {
  const rows = config.rows || [];
  if (sel.kind === 'card') return sel;
  const row = rows[sel.row];
  if (!row) return { kind: 'card' };
  if (sel.kind === 'row') return sel;
  const col = row.columns?.[sel.col];
  if (!col) return { kind: 'row', row: sel.row };
  if (sel.kind === 'column') return sel;
  if (sel.kind === 'slot') {
    // A tab / column that is gone, or a layout without slot nodes: its (clamped) layout module.
    const owner = clampSelection(config, parentSelection(sel));
    const mod = moduleAt(config, owner);
    const ok = sameSelection(owner, parentSelection(sel)) && hasSlotNodes(mod) && sel.slot < childSlots(mod)!.length;
    return ok ? sel : owner;
  }
  const count = col.modules?.length || 0;
  if (count === 0) return { kind: 'column', row: sel.row, col: sel.col };
  const module = Math.min(sel.module, count - 1);
  // A nested child that no longer exists: select its nearest existing layout module.
  const chain: ChildStep[] = [];
  let cur: CardModule | undefined = col.modules[module];
  for (const step of module === sel.module ? sel.child ?? [] : []) {
    const next: CardModule | undefined = childSlots(cur)?.[step.slot]?.[step.index];
    if (!next) break;
    chain.push(step);
    cur = next;
  }
  return moduleSelection(sel.row, sel.col, module, chain);
}

/**
 * Crumbs from the top-level module down to the selected child: one per module, with its slot
 * ("Column 2", tab label) where the layout has several, e.g. "Tabs › Living › Button".
 */
export function childCrumbs(config: MagicCardConfig, sel: ModuleSelection): Array<{ label: string; target: ModuleSelection }> {
  const out: Array<{ label: string; target: ModuleSelection }> = [];
  let cur = config.rows[sel.row].columns[sel.col].modules[sel.module];
  const chain = sel.child ?? [];
  out.push({ label: layerName(cur) ?? moduleDisplayName(cur), target: moduleSelection(sel.row, sel.col, sel.module) });
  for (const [i, step] of chain.entries()) {
    const slot = slotLabel(cur, step.slot);
    const next = childSlots(cur)?.[step.slot]?.[step.index];
    if (!next || typeof next !== 'object') break;
    cur = next;
    const name = layerName(cur) ?? moduleDisplayName(cur);
    out.push({ label: slot ? `${slot} · ${name}` : name, target: moduleSelection(sel.row, sel.col, sel.module, chain.slice(0, i + 1)) });
  }
  return out;
}

/** Total modules in a config; YAML columns may omit `modules`. */
export function countModules(config: MagicCardConfig): number {
  return (config.rows || []).reduce((n, r) => n + (r.columns || []).reduce((m, c) => m + (c.modules?.length ?? 0), 0), 0);
}

export function moduleDisplayName(mod: CardModule): string {
  const name = ModuleRegistry.get(mod.type)?.metadata.name;
  return name === undefined || name === '' ? mod.type : t(name);
}

export function moduleSubtitle(mod: CardModule): string | undefined {
  const rec = mod as Record<string, unknown>;
  for (const key of ['entity', 'label', 'text', 'name']) {
    const v = rec[key];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return undefined;
}

/** The module's own name (label / text / name), never an entity id: "Button · Toggle" in headers and layers. */
export function moduleLabel(mod: CardModule): string | undefined {
  const rec = mod as Record<string, unknown>;
  for (const key of ['label', 'text', 'name']) {
    // A text module showing an entity keeps its static text hidden: don't name it by that text.
    if (key === 'text' && rec.use_entity) continue;
    const v = rec[key];
    if (typeof v !== 'string') continue;
    const t = v.trim().split('\n')[0];
    if (t && !ENTITY_RE.test(t)) return t.length > 40 ? `${t.slice(0, 39)}…` : t;
  }
  return undefined;
}

export function describeSelection(config: MagicCardConfig, sel: Selection): SelectionInfo {
  const cardTitle = config.name?.trim() || 'Card';
  const s = clampSelection(config, sel);
  if (s.kind === 'card') return { title: cardTitle, icon: 'mdi:card-outline', crumbs: [cardTitle] };
  const rowLabel = layerName(config.rows[s.row]) ?? `Row ${s.row + 1}`;
  if (s.kind === 'row') {
    return { title: rowLabel, icon: 'mdi:view-sequential-outline', crumbs: [cardTitle, rowLabel],
      subtitle: hasColumnWidths(config.rows[s.row]) ? 'Custom widths' : `Layout ${config.rows[s.row].layout || '1'}` };
  }
  const colLabel = layerName(config.rows[s.row].columns[s.col]) ?? `Column ${s.col + 1}`;
  if (s.kind === 'column') {
    const n = config.rows[s.row].columns[s.col].modules?.length ?? 0;
    return { title: colLabel, icon: 'mdi:view-column-outline', crumbs: [cardTitle, rowLabel, colLabel],
      subtitle: `${n} module${n === 1 ? '' : 's'}` };
  }
  if (s.kind === 'slot') {
    const owner = parentSelection(s);
    const mod = moduleAt(config, owner);
    const list = childSlots(mod)?.[s.slot];
    // a tab / column (or its layout) that is gone, e.g. a hover over a canvas a step behind the config
    if (!mod || !list || !hasSlotNodes(mod)) return { title: mod?.type === 'tabs' ? 'Tab' : 'Column', icon: 'mdi:view-column-outline', crumbs: [cardTitle, rowLabel, colLabel] };
    const title = (mod.type === 'row' ? layerName((mod as { columns?: unknown[] }).columns?.[s.slot]) : undefined) ?? slotLabel(mod, s.slot)!;
    const n = list.length;
    const tabIcon = (mod as { tabs?: Array<{ icon?: string }> }).tabs?.[s.slot]?.icon;
    return {
      title,
      icon: mod.type === 'tabs' ? tabIcon || 'mdi:tab' : 'mdi:view-column-outline',
      crumbs: [...describeSelection(config, owner).crumbs, title],
      subtitle: `${n} module${n === 1 ? '' : 's'}`,
    };
  }
  const mod = moduleAt(config, s);
  // a module that is gone (or a YAML entry that is not a module)
  if (!mod || typeof mod !== 'object') return { title: 'Module', icon: 'mdi:puzzle-outline', crumbs: [cardTitle, rowLabel, colLabel] };
  const name = layerName(mod) ?? moduleDisplayName(mod);
  return {
    title: name,
    icon: ModuleRegistry.get(mod.type)?.metadata.icon || 'mdi:puzzle-outline',
    crumbs: [cardTitle, rowLabel, colLabel, ...childCrumbs(config, s).map((c) => c.label)],
    subtitle: moduleSubtitle(mod),
  };
}

/** Entity id shape (`domain.object_id`). */
export const ENTITY_RE = /^[a-z_]+\.[a-z0-9_]+$/;

/** An entity id with `<wbr>` after every '.' and '_', so wrapping lands on separators instead of mid-word. */
export function breakableId(id: string): TemplateResult {
  const parts = id.split(/(?<=[._])/);
  return html`${parts.map((p, i) => (i ? html`<wbr>${p}` : p))}`;
}
