import {
  MagicCardConfig,
  EditorState,
  EditorMode,
  EditorTab,
  EditorPath,
  CardModule,
  RowConfig,
  ColumnConfig,
  ModuleType,
  DesignConfig,
  NestedColumnConfig,
  RowModuleConfig,
} from '../../types';
import { UndoRedoStack } from './undo-redo';
import { localiseCreationDefaults } from './creation-defaults';
import { t } from '../i18n';
import { followIcons } from '../components/icon-animator/loader';
import { prunedConfig } from '../custom/library';
import { applyRowLayout, columnWidthsList } from '../../utils/column-widths';
import { dropUndefined, newColumn } from './containers';
import { deepClone } from '../../utils/deep-merge';
import { generateId } from '../../utils/id-generator';

/** `{ ...obj, ...patch }` without the keys the patch sets to undefined. */
function withPatch<T extends object>(obj: T, patch: object): T {
  const out = { ...obj, ...patch } as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) if (v === undefined) delete out[k];
  return out as T;
}

/** Remove not_synced from a module and every nested layout child (mutates: a clone). */
function dropMarks(mod: CardModule): void {
  if (!mod || typeof mod !== 'object') return;
  delete mod.not_synced;
  for (const slot of childSlots(mod) ?? []) for (const child of slot) dropMarks(child);
}

/** New ids for a copied module and everything nested in it (mutates: callers pass a clone). */
function giveFreshIds(mod: CardModule): void {
  if (!mod || typeof mod !== 'object') return;
  mod.id = generateId(mod.type);
  const rec = mod as Record<string, unknown>;
  if (mod.type === 'row' && Array.isArray(rec.columns)) {
    for (const col of rec.columns as Array<{ id?: string }>) if (col && typeof col === 'object' && col.id) col.id = generateId('col');
  }
  for (const slot of childSlots(mod) ?? []) for (const child of slot) giveFreshIds(child);
}
import { ModuleRegistry } from '../../modules/module-registry';
import { debounce } from '../../utils/debounce';
import { EDITOR_DEBOUNCE_MS, EDITOR_DRAG_IDLE_MS, EDITOR_DRAG_SEND_MS } from '../../utils/constants';
import { clampSelection, itemAt, layoutModuleAt, moduleAt, selectionFromPath, selectionToPath } from '../studio/selection';
import { ChildStep, childListKey, childSlots, descendantAt, hasSlotNodes, mutableSlot } from '../../utils/module-path';
import { copyModuleToClipboard, docPool, pasteAnimations, readModuleClip, referencedDocs } from './module-clipboard';
import { animationDocList, customAnimationIds } from '../../utils/custom-animations';
import { withTemplateAnimations } from '../../services/template-merge';
import { animLibrary } from '../../utils/anim-hooks';
import { PasteMode, copyDesign, pastedDesign, readDesignClipboard } from '../../utils/design-clipboard';
import { ensureModuleId, markFlowsOverridden, newFlow, pruneFlows } from './flows';
import { flowKeys } from '../../utils/flow-keys';
import { markChildList, markColumnModules } from './template-marks';
import type { ModuleSelection, Selection } from '../studio/selection';

/** A module (or a layout child below it: `child`), column or row, by index. */
export interface DesignTarget {
  row: number;
  col?: number;
  module?: number;
  child?: readonly ChildStep[];
  /** With `module`: a column (slot) of that row module. */
  slot?: number;
}

/** A layout module as the slot operations edit it (tabs or row module fields). */
type TabEntry = { label?: string; icon?: string; modules: CardModule[] };
type LayoutRec = CardModule & {
  tabs?: TabEntry[];
  columns?: NestedColumnConfig[];
  layout?: string;
  column_widths?: string[];
  active_tab?: number;
};

/** Which designs of a tabs module had a tab_disabled_tabs list rewritten. */
interface DisabledTabsTouched {
  base: boolean;
  rules: boolean;
}

const isRec = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Rewrites one design's tab_disabled_tabs through `map` (-1 drops a position); true when the design had a list. */
function remapList(design: unknown, map: (i: number) => number): boolean {
  if (!isRec(design) || !Array.isArray(design.tab_disabled_tabs)) return false;
  const next = [...new Set((design.tab_disabled_tabs as unknown[]).map((n) => (typeof n === 'number' ? map(n) : -1)).filter((n) => n >= 0))].sort((a, b) => a - b);
  if (next.length) design.tab_disabled_tabs = next;
  else delete design.tab_disabled_tabs;
  return true;
}

/** Positions of the disabled tabs follow a moved or deleted tab, in the base design and in every rule. */
function remapDisabledTabs(layout: LayoutRec, map: (i: number) => number): DisabledTabsTouched {
  const design = (layout as { design?: unknown }).design;
  const base = remapList(design, map);
  let rules = false;
  const list = isRec(design) && Array.isArray(design.conditional) ? design.conditional : [];
  for (const rule of list) if (isRec(rule) && remapList(rule.design, map)) rules = true;
  return { base, rules };
}

/** The module's own keys a template-linked tabs module marks once its disabled lists moved. */
const disabledTabsKeys = (t: DisabledTabsTouched): string[] => [...(t.base ? ['design.tab_disabled_tabs'] : []), ...(t.rules ? ['design.conditional'] : [])];

type StateListener = (state: EditorState) => void;

export class EditorStateManager {
  private state: EditorState;
  private undoRedo = new UndoRedoStack<MagicCardConfig>();
  private listeners: Set<StateListener> = new Set();
  private dispatchConfigChanged: ((config: MagicCardConfig) => void) & { cancel: () => void; flush: () => void };
  /** False while the card editor is detached: pending icon follows wait (follow-icon.ts). */
  attached = true;
  private dragEnd = 0;
  /** True once the drag in progress has pushed its undo entry. */
  private dragUndone = false;
  private dragPace?: ReturnType<typeof setTimeout>;
  /** The newest config of a drag that has not gone out yet. */
  private dragNext?: MagicCardConfig;

  constructor(private fireEvent: (config: MagicCardConfig) => void) {
    this.state = {
      config: { type: 'custom:magic-card', rows: [] },
      selectedPath: null,
      activeTab: 'general',
      editorMode: 'form',
      isDirty: false,
    };

    this.dispatchConfigChanged = debounce((config: MagicCardConfig) => {
      this.fireEvent(config);
    }, EDITOR_DEBOUNCE_MS);
  }

  // ── config-changed toward HA ──

  /** Debounced as a rule; while a slider is being dragged (see sliderMoved) at a steady pace. */
  private sendConfig(config: MagicCardConfig): void {
    if (Date.now() < this.dragEnd) {
      this.dispatchConfigChanged.cancel();
      this.dragNext = config;
      if (this.dragPace === undefined) this.dragSend();
    } else this.dispatchConfigChanged(config);
  }

  /** Sends the newest config not yet sent; with `more`, waits EDITOR_DRAG_SEND_MS for the next one. */
  private dragSend(more = true): void {
    const config = this.dragNext;
    this.dragNext = this.dragPace = undefined;
    if (!config) return;
    this.fireEvent(config);
    if (more) this.dragPace = setTimeout(() => this.dragSend(), EDITOR_DRAG_SEND_MS);
  }

  /** A slider moved: for a moment after this, only the first write of the drag is undoable; config-changed goes out right away and then about every EDITOR_DRAG_SEND_MS, the last value included. */
  sliderMoved(): void {
    if (Date.now() >= this.dragEnd) this.dragUndone = false;
    this.dragEnd = Date.now() + EDITOR_DRAG_IDLE_MS;
  }

  // ── Subscription ──

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  // ── Getters ──

  getState(): EditorState {
    return this.state;
  }

  getConfig(): MagicCardConfig {
    return this.state.config;
  }

  /** The selected module, a nested layout child included. */
  getSelectedModule(): CardModule | null {
    return moduleAt(this.state.config, selectionFromPath(this.state.selectedPath)) ?? null;
  }

  /**
   * The list holding a module and its index in it: a column's modules, or for a nested child
   * (`child` steps below the top-level module) the slot of its layout module. On a cloned config.
   */
  private _moduleList(
    config: MagicCardConfig,
    rowIndex: number,
    colIndex: number,
    moduleIndex: number,
    child?: readonly ChildStep[],
  ): { list: CardModule[]; index: number } | undefined {
    const top = config.rows[rowIndex]?.columns[colIndex]?.modules;
    if (!top) return undefined;
    if (!child?.length) return { list: top, index: moduleIndex };
    const parent = descendantAt(top[moduleIndex], child.slice(0, -1));
    const last = child[child.length - 1];
    const list = parent ? mutableSlot(parent, last.slot) : undefined;
    return list ? { list, index: last.index } : undefined;
  }

  /** selectedPath with its last step (the module itself) set to `index`. */
  private _pathWithIndex(rowIndex: number, colIndex: number, moduleIndex: number, child: readonly ChildStep[] | undefined, index: number): EditorPath {
    if (!child?.length) return { rowIndex, columnIndex: colIndex, moduleIndex: index };
    const chain = child.map((s) => ({ ...s }));
    chain[chain.length - 1].index = index;
    return { rowIndex, columnIndex: colIndex, moduleIndex, childPath: chain };
  }

  /** Template-linked card: see markChildList (mutates: a clone). */
  private _markChildList(config: MagicCardConfig, rowIndex: number, colIndex: number, moduleIndex: number): void {
    markChildList(config, rowIndex, colIndex, moduleIndex);
  }

  // ── Config Management ──

  /** Keep selectedPath valid for the current config. */
  private _clampedPath(config: MagicCardConfig, path: EditorPath | null): EditorPath | null {
    return selectionToPath(clampSelection(config, selectionFromPath(path)));
  }

  /** The selected flow key while that flow still exists in `config`, else null. */
  private _liveFlow(config: MagicCardConfig): string | null {
    const key = this.state.selectedFlow ?? null;
    return key && flowKeys(Array.isArray(config.flows) ? config.flows : []).includes(key) ? key : null;
  }

  setConfig(config: MagicCardConfig): void {
    const next = deepClone(config);
    this.state = {
      ...this.state,
      config: next,
      isDirty: false,
      selectedPath: this._clampedPath(next, this.state.selectedPath),
      selectedFlow: this._liveFlow(next),
    };
    this.notify();
  }

  /** The linked template's custom animations (fetched with the template; undefined when none). */
  setTemplateAnimations(docs: Array<Record<string, unknown>> | undefined): void {
    this.state = { ...this.state, templateAnimations: docs };
    this.notify();
  }

  updateConfig(config: MagicCardConfig, recordUndo = true): void {
    const prev = this.state.config;
    if (recordUndo && !(Date.now() < this.dragEnd && this.dragUndone)) {
      this.undoRedo.push(this.state.config);
      this.dragUndone = Date.now() < this.dragEnd;
    }
    // kept copies of saved icons and shapes nothing uses any more go (library.ts; not while typing YAML)
    const cloned = deepClone(config);
    const next = this.state.editorMode === 'yaml' ? cloned : prunedConfig(cloned);
    this.state = {
      ...this.state,
      config: next,
      isDirty: true,
      selectedPath: this._clampedPath(next, this.state.selectedPath),
      selectedFlow: this._liveFlow(next),
    };
    this.notify();
    this.sendConfig(this.state.config);
    // "This icon" animations follow their module's new icon, library ones go (lazy icon animator
    // chunk, loaded only when a module plays a custom:quick-* document or has an anim-icon-N entry);
    // there also catalogue copies (custom:cat-*) nothing plays any more go
    const cat = (c: MagicCardConfig) => JSON.stringify(c).includes('"custom:cat-');
    if (/"(custom:quick-|anim-icon-)/.test(JSON.stringify(next.rows)) || cat(prev) || cat(next)) followIcons(this, prev, next);
  }

  // ── Editor State ──

  setEditorMode(mode: EditorMode | string): void {
    this.state = { ...this.state, editorMode: mode === 'yaml' ? 'yaml' : 'form' };
    this.notify();
  }

  /** Counts selections; with `selectionReveal` it lets every inspector see whether the last one should scroll into view. */
  private _selectionSeq = 0;
  private _selectionReveal = true;

  get selectionSeq(): number {
    return this._selectionSeq;
  }

  get selectionReveal(): boolean {
    return this._selectionReveal;
  }

  /** `reveal: false` (context click): select without scrolling the inspector into view. */
  setSelectedPath(path: EditorPath | null, opts: { reveal?: boolean } = {}): void {
    this._selectionSeq++;
    this._selectionReveal = opts.reveal !== false;
    const selectedPath = this._clampedPath(this.state.config, path);
    this.state = { ...this.state, selectedPath, selectedFlow: selectedPath ? null : this.state.selectedFlow };
    this.notify();
  }

  // ── Flows ──

  /** Select a flow by its key (canvas highlight, Card settings → Flows); the card becomes the selection. */
  selectFlow(key: string | null): void {
    this.state = { ...this.state, selectedFlow: key, selectedPath: key ? null : this.state.selectedPath };
    this.notify();
  }

  /**
   * A new flow from one module to another (studio connect mode), one undo step: modules without an id
   * get one. The new flow is selected. Undefined (no change) when both ends are the same module.
   */
  addFlow(from: ModuleSelection, to: ModuleSelection): string | undefined {
    const config = deepClone(this.state.config);
    const a = ensureModuleId(config, from);
    const b = ensureModuleId(config, to);
    if (!a || !b || a === b) return undefined;
    const flow = { ...newFlow(), from: a, to: b };
    config.flows = [...(Array.isArray(config.flows) ? config.flows : []), flow];
    markFlowsOverridden(config);
    this.updateConfig(config);
    this.selectFlow(flow.id);
    return flow.id;
  }

  /** updateConfig after an edit that may have removed modules: their flows go in the same step. */
  private _commitRemoval(config: MagicCardConfig): void {
    pruneFlows(this.state.config, config);
    this.updateConfig(config);
  }

  setActiveTab(tab: EditorTab): void {
    this.state = { ...this.state, activeTab: tab };
    this.notify();
  }

  private _equalLayout(colCount: number): string {
    return Array.from({ length: Math.max(colCount, 1) }, () => '1').join('-');
  }

  // ── Row Operations ──

  addRow(layout = '1'): void {
    const config = deepClone(this.state.config);
    const colCount = layout.split('-').length;
    const columns: ColumnConfig[] = Array.from({ length: colCount }, newColumn);

    config.rows.push({
      id: generateId('row'),
      share_entity: true,
      layout,
      columns,
    });

    this.updateConfig(config);
  }

  deleteRow(rowIndex: number): void {
    const config = deepClone(this.state.config);
    config.rows.splice(rowIndex, 1);
    this._commitRemoval(config);
  }

  moveRow(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const config = deepClone(this.state.config);
    const [row] = config.rows.splice(fromIndex, 1);
    config.rows.splice(toIndex, 0, row);
    this.updateConfig(config);
  }

  updateRow(rowIndex: number, updates: Partial<RowConfig>): void {
    const config = deepClone(this.state.config);
    config.rows[rowIndex] = dropUndefined({ ...config.rows[rowIndex], ...updates }, updates);
    this.updateConfig(config);
  }

  /**
   * Apply a column layout preset ("2-1", "1-1-1", ...). Missing columns are added empty;
   * surplus columns are removed and their modules move into the last remaining column (to the left).
   */
  setRowLayout(rowIndex: number, layout: string): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    if (!row) return;
    applyRowLayout(row, layout, newColumn);
    this._markRowLocal(config, row, 'layout', 'column_widths');
    this.updateConfig(config);
  }

  /**
   * Set (or with `undefined` remove) a row's column widths, optionally with a new layout preset, as
   * one undo step. A template-linked card keeps them as a local override (not_synced); removing them
   * without a layout (the field's reset) syncs them with the template again.
   * `coalesce`: fold into the previous undo step (arrow key repeats).
   */
  setColumnWidths(rowIndex: number, widths: string[] | undefined, layout?: string, coalesce = false): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    if (!row) return;
    if (widths?.length) row.column_widths = [...widths];
    else delete row.column_widths;
    if (layout) row.layout = layout;
    if (widths?.length || layout) this._markRowLocal(config, row, 'column_widths', ...(layout ? ['layout'] : []));
    else if (row.not_synced?.includes('column_widths')) {
      row.not_synced = row.not_synced.filter((k) => k !== 'column_widths');
      if (!row.not_synced.length) delete row.not_synced;
    }
    this.updateConfig(config, !coalesce);
  }

  /** Template-linked card: mark row keys as local overrides (mutates: a clone). */
  private _markRowLocal(config: MagicCardConfig, row: RowConfig, ...keys: string[]): void {
    if (!config.template) return;
    const marks = row.not_synced || [];
    const add = keys.filter((k) => !marks.includes(k));
    if (add.length) row.not_synced = [...marks, ...add];
  }

  // ── Column Operations ──

  addColumn(rowIndex: number): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    row.columns.push(newColumn());
    // custom widths keep theirs (the new column gets 1fr); a preset layout is re-equalised
    if (Array.isArray(row.column_widths) && row.column_widths.length) {
      row.column_widths = [...columnWidthsList(row.column_widths, row.columns.length - 1), '1fr'];
      this._markRowLocal(config, row, 'column_widths');
    } else {
      delete row.column_widths;
      row.layout = this._equalLayout(row.columns.length);
    }
    this.updateConfig(config);
  }

  deleteColumn(rowIndex: number, colIndex: number): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    row.columns.splice(colIndex, 1);
    if (row.columns.length === 0) {
      config.rows.splice(rowIndex, 1);
    } else {
      row.layout = this._equalLayout(row.columns.length);
      if (Array.isArray(row.column_widths) && row.column_widths.length) {
        const widths = columnWidthsList(row.column_widths, row.columns.length + 1);
        widths.splice(colIndex, 1);
        // one column left: widths mean nothing (and no field could reset them)
        if (row.columns.length < 2) delete row.column_widths;
        else row.column_widths = widths;
        this._markRowLocal(config, row, 'column_widths');
      }
    }
    this._commitRemoval(config);
  }

  updateColumn(rowIndex: number, colIndex: number, updates: Partial<ColumnConfig>): void {
    const config = deepClone(this.state.config);
    config.rows[rowIndex].columns[colIndex] = dropUndefined({ ...config.rows[rowIndex].columns[colIndex], ...updates }, updates);
    this.updateConfig(config);
  }

  // ── Design copy / paste ──

  private _designItem(config: MagicCardConfig, t: DesignTarget): RowConfig | ColumnConfig | CardModule | undefined {
    const row = config.rows[t.row];
    const col = t.col !== undefined ? row?.columns[t.col] : undefined;
    if (t.module !== undefined) {
      const mod = descendantAt(col?.modules[t.module], t.child ?? []);
      if (t.slot === undefined) return mod;
      return mod?.type === 'row' ? (mod as RowModuleConfig).columns?.[t.slot] as ColumnConfig | undefined : undefined;
    }
    return t.col !== undefined ? col : row;
  }

  /** Copy the target's design to the design clipboard (src/utils/design-clipboard.ts). */
  copyDesign(target: DesignTarget): void {
    copyDesign(this._designItem(this.state.config, target)?.design as DesignConfig | undefined);
  }

  /**
   * Paste the clipboard design onto the target (one undo step). On a template-linked card it is an
   * override: a module marks each changed design key, a row / column its whole design.
   */
  pasteDesign(target: DesignTarget, mode: PasteMode): boolean {
    const clip = readDesignClipboard();
    if (!clip) return false;
    const config = deepClone(this.state.config);
    const item = this._designItem(config, target) as (RowConfig | ColumnConfig | CardModule) & { not_synced?: string[] };
    if (!item) return false;
    const before = (item.design || {}) as Record<string, unknown>;
    const next = pastedDesign(item.design as DesignConfig | undefined, clip, mode) as Record<string, unknown>;
    item.design = next as DesignConfig;
    if (config.template && target.module !== undefined && (target.child?.length || target.slot !== undefined)) {
      this._markChildList(config, target.row, target.col!, target.module);
    } else if (config.template) {
      const marks = new Set(item.not_synced || []);
      if (target.module === undefined) marks.add('design');
      else
        for (const k of new Set([...Object.keys(before), ...Object.keys(next)]))
          if (JSON.stringify(before[k]) !== JSON.stringify(next[k])) marks.add(`design.${k}`);
      item.not_synced = [...marks];
    }
    this.updateConfig(config);
    return true;
  }

  // ── Module Operations ──

  addModule(rowIndex: number, colIndex: number, type: ModuleType): void {
    const config = deepClone(this.state.config);
    const created = ModuleRegistry.createDefault(type);
    if (!created) return;
    const newModule = localiseCreationDefaults(created);

    config.rows[rowIndex].columns[colIndex].modules.push(newModule);
    const moduleIndex = config.rows[rowIndex].columns[colIndex].modules.length - 1;

    this.updateConfig(config);
    this.setSelectedPath({ rowIndex, columnIndex: colIndex, moduleIndex });
  }

  deleteModule(rowIndex: number, colIndex: number, moduleIndex: number, child?: readonly ChildStep[]): void {
    const config = deepClone(this.state.config);
    if (child?.length) {
      const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
      if (!at || !at.list[at.index]) return;
      at.list.splice(at.index, 1);
      this._markChildList(config, rowIndex, colIndex, moduleIndex);
      // Select a sibling, or once the slot is empty its tab / column (tree node), else the layout module.
      const up = child.slice(0, -1);
      const owner = descendantAt(config.rows[rowIndex].columns[colIndex].modules[moduleIndex], up);
      this.state = { ...this.state, selectedPath: at.list.length
        ? this._pathWithIndex(rowIndex, colIndex, moduleIndex, child, Math.min(at.index, at.list.length - 1))
        : hasSlotNodes(owner)
          ? this._slotPath(rowIndex, colIndex, moduleIndex, up, child[child.length - 1].slot)
          : { rowIndex, columnIndex: colIndex, moduleIndex, ...(up.length ? { childPath: up.map((s) => ({ ...s })) } : {}) } };
      this._commitRemoval(config);
      return;
    }
    config.rows[rowIndex].columns[colIndex].modules.splice(moduleIndex, 1);
    const sel = this.state.selectedPath;
    if (
      sel?.rowIndex === rowIndex &&
      sel.columnIndex === colIndex &&
      sel.moduleIndex !== undefined &&
      sel.moduleIndex > moduleIndex
    ) {
      this.state = { ...this.state, selectedPath: { ...sel, moduleIndex: sel.moduleIndex - 1 } };
    }
    this._commitRemoval(config);
  }

  updateModule(
    rowIndex: number,
    colIndex: number,
    moduleIndex: number,
    updates: Partial<CardModule>,
    child?: readonly ChildStep[],
  ): void {
    const config = deepClone(this.state.config);
    const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
    if (!at || !at.list[at.index]) return;
    at.list[at.index] = { ...at.list[at.index], ...updates };
    // A layout's child list edit can remove modules: their flows go in the same step.
    this._commitRemoval(config);
  }

  /**
   * Replace a module with its edited version (a module editor's onChange gives the whole module):
   * a key the editor removed is removed, where updateModule's merge would keep the old value.
   */
  replaceModule(rowIndex: number, colIndex: number, moduleIndex: number, next: CardModule, child?: readonly ChildStep[]): void {
    const config = deepClone(this.state.config);
    const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
    if (!at || !at.list[at.index]) return;
    at.list[at.index] = deepClone(next);
    this._commitRemoval(config);
  }

  moveModule(
    fromRow: number,
    fromCol: number,
    fromIdx: number,
    toRow: number,
    toCol: number,
    toIdx: number,
  ): void {
    const config = deepClone(this.state.config);
    const [mod] = config.rows[fromRow].columns[fromCol].modules.splice(fromIdx, 1);
    config.rows[toRow].columns[toCol].modules.splice(toIdx, 0, mod);
    this.updateConfig(config);
  }

  duplicateModule(rowIndex: number, colIndex: number, moduleIndex: number, child?: readonly ChildStep[]): void {
    const config = deepClone(this.state.config);
    const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
    if (!at || !at.list[at.index]) return;
    const copy = deepClone(at.list[at.index]);
    giveFreshIds(copy);
    at.list.splice(at.index + 1, 0, copy);
    if (child?.length) this._markChildList(config, rowIndex, colIndex, moduleIndex);
    this.state = { ...this.state, selectedPath: this._pathWithIndex(rowIndex, colIndex, moduleIndex, child, at.index + 1) };
    this.updateConfig(config);
  }

  duplicateRow(rowIndex: number): void {
    const config = deepClone(this.state.config);
    const copy = deepClone(config.rows[rowIndex]);
    copy.id = generateId('row');
    for (const col of copy.columns) {
      col.id = generateId('col');
      for (const mod of col.modules) giveFreshIds(mod);
    }
    config.rows.splice(rowIndex + 1, 0, copy);
    this.state = { ...this.state, selectedPath: { rowIndex: rowIndex + 1 } };
    this.updateConfig(config);
  }

  moveModuleBy(rowIndex: number, colIndex: number, moduleIndex: number, delta: -1 | 1, child?: readonly ChildStep[]): boolean {
    if (child?.length) {
      const config = deepClone(this.state.config);
      const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
      const to = (at?.index ?? -1) + delta;
      if (!at || !at.list[at.index] || to < 0 || to >= at.list.length) return false;
      const [mod] = at.list.splice(at.index, 1);
      at.list.splice(to, 0, mod);
      this._markChildList(config, rowIndex, colIndex, moduleIndex);
      this.state = { ...this.state, selectedPath: this._pathWithIndex(rowIndex, colIndex, moduleIndex, child, to) };
      this.updateConfig(config);
      return true;
    }
    const mods = this.state.config.rows[rowIndex]?.columns[colIndex]?.modules;
    const to = moduleIndex + delta;
    if (!mods || to < 0 || to >= mods.length) return false;
    this.state = { ...this.state, selectedPath: { rowIndex, columnIndex: colIndex, moduleIndex: to } };
    this.moveModule(rowIndex, colIndex, moduleIndex, rowIndex, colIndex, to);
    return true;
  }

  /** Move a top-level module to the end of another column (one undo step); the selection follows it. */
  moveModuleToColumn(rowIndex: number, colIndex: number, moduleIndex: number, toRow: number, toCol: number): boolean {
    const rows = this.state.config.rows;
    const target = rows[toRow]?.columns[toCol];
    if (!rows[rowIndex]?.columns[colIndex]?.modules?.[moduleIndex] || !target) return false;
    if (rowIndex === toRow && colIndex === toCol) return false;
    const config = deepClone(this.state.config);
    const [mod] = config.rows[rowIndex].columns[colIndex].modules.splice(moduleIndex, 1);
    const dest = config.rows[toRow].columns[toCol];
    if (!Array.isArray(dest.modules)) dest.modules = [];
    dest.modules.push(mod);
    this.state = { ...this.state, selectedPath: { rowIndex: toRow, columnIndex: toCol, moduleIndex: dest.modules.length - 1 } };
    this.updateConfig(config);
    return true;
  }

  /**
   * Move a layout child to the end of another slot (column / tab) of the same layout module (one undo
   * step); the selection follows it.
   */
  moveChildToSlot(rowIndex: number, colIndex: number, moduleIndex: number, child: readonly ChildStep[], slot: number): boolean {
    if (!child.length) return false;
    const last = child[child.length - 1];
    if (last.slot === slot) return false;
    const config = deepClone(this.state.config);
    const at = this._moduleList(config, rowIndex, colIndex, moduleIndex, child);
    const parent = descendantAt(config.rows[rowIndex]?.columns[colIndex]?.modules[moduleIndex], child.slice(0, -1));
    const dest = parent ? mutableSlot(parent, slot) : undefined;
    if (!at || !at.list[at.index] || !dest) return false;
    const [mod] = at.list.splice(at.index, 1);
    dest.push(mod);
    this._markChildList(config, rowIndex, colIndex, moduleIndex);
    const chain = child.map((s) => ({ ...s }));
    chain[chain.length - 1] = { slot, index: dest.length - 1 };
    this.state = { ...this.state, selectedPath: { rowIndex, columnIndex: colIndex, moduleIndex, childPath: chain } };
    this.updateConfig(config);
    return true;
  }

  // ── Item menu: hide, layer name, module clipboard, wrap, reset (studio context menus) ──

  /**
   * Edit the object a selection points at in a clone (one undo step). Template-linked card: a top-level
   * row, column or module marks `key` (not_synced); a layout child or a tab / row-module column marks
   * its top-level layout module's child list. `fn` returns false for no change.
   */
  private _editItem(sel: Selection, key: string, fn: (item: Record<string, unknown>) => boolean | void): boolean {
    const config = deepClone(this.state.config);
    const item = itemAt(config, sel);
    if (!item || fn(item) === false) return false;
    if (config.template && sel.kind !== 'card') {
      if (sel.kind === 'slot' || (sel.kind === 'module' && sel.child?.length)) this._markChildList(config, sel.row, sel.col, sel.module);
      else {
        const marks = (item.not_synced || []) as string[];
        if (!marks.includes(key)) item.not_synced = [...marks, key];
      }
    }
    this.updateConfig(config);
    return true;
  }

  /** Studio Hide / Show: `hidden: true` leaves the item out on the dashboard (not for the card). */
  setHidden(sel: Selection, hidden: boolean): boolean {
    if (sel.kind === 'card') return false;
    return this._editItem(sel, 'hidden', (item) => {
      if ((item.hidden === true) === hidden) return false;
      if (hidden) item.hidden = true;
      else delete item.hidden;
    });
  }

  /**
   * Rename from the tree or canvas: the card's `name`, a tab's visible label (blank keeps it), else the
   * editor-only layer name `editor_name` (blank, or the item's default label, removes it).
   */
  setLayerName(sel: Selection, name: string, defaultLabel?: string): boolean {
    const v = name.trim();
    if (sel.kind === 'card') {
      return this._editItem(sel, 'name', (c) => {
        if ((c.name ?? '') === v) return false;
        if (v) c.name = v;
        else delete c.name;
      });
    }
    if (sel.kind === 'slot' && layoutModuleAt(this.state.config, sel)?.type === 'tabs') {
      const tab = itemAt(this.state.config, sel);
      if (!v || !tab || tab.label === v) return false;
      this.renameTab(sel.row, sel.col, sel.module, sel.child?.map((s) => ({ ...s })), sel.slot, v);
      return true;
    }
    const next = v && v !== defaultLabel ? v : undefined;
    return this._editItem(sel, 'editor_name', (item) => {
      if (item.editor_name === next) return false;
      if (next) item.editor_name = next;
      else delete item.editor_name;
    });
  }

  /**
   * The inline documents a card plays: its own, and on a linked card the template's it does not leave
   * out (hidden_animations, or custom_animations in not_synced: only its own), as the card merges them.
   */
  private _playedDocs(config: MagicCardConfig): unknown {
    return withTemplateAnimations(config, this.state.templateAnimations).custom_animations;
  }

  /**
   * Copy module: the module (with its children) to the module clipboard, with the inline animation
   * documents it plays (the card's own, else the linked template's).
   */
  copyModule(sel: Selection): CardModule | undefined {
    const mod = moduleAt(this.state.config, sel);
    if (!mod) return undefined;
    const pool = docPool(this._playedDocs(this.state.config));
    return copyModuleToClipboard(mod, referencedDocs(mod, pool));
  }

  /**
   * Paste the clipboard module (new ids) after a module, or at the end of a column or of a tab /
   * row-module column. The pasted module is selected. False when nothing (valid) was copied.
   */
  pasteModule(sel: Selection): boolean {
    const clip = readModuleClip();
    if (!clip) return false;
    const mod = deepClone(clip.module);
    giveFreshIds(mod);
    const config = deepClone(this.state.config);
    // the documents it plays that this card lacks (renamed on a clash), in the same undo step
    const own = animationDocList(config.custom_animations);
    // new ids stay clear of the card's ids, its references and the animation library's
    const taken = [...customAnimationIds(config), ...animLibrary().list().map((d) => d.id)];
    const add = pasteAnimations(mod, clip.docs, docPool(this._playedDocs(config)), taken);
    if (add.length) config.custom_animations = [...own, ...add] as typeof config.custom_animations;
    let path: EditorPath;
    if (sel.kind === 'module') {
      const at = this._moduleList(config, sel.row, sel.col, sel.module, sel.child);
      if (!at || !at.list[at.index]) return false;
      at.list.splice(at.index + 1, 0, mod);
      if (sel.child?.length) this._markChildList(config, sel.row, sel.col, sel.module);
      path = this._pathWithIndex(sel.row, sel.col, sel.module, sel.child, at.index + 1);
    } else if (sel.kind === 'column') {
      const col = config.rows[sel.row]?.columns[sel.col];
      if (!col) return false;
      if (!Array.isArray(col.modules)) col.modules = [];
      path = { rowIndex: sel.row, columnIndex: sel.col, moduleIndex: col.modules.push(mod) - 1 };
    } else if (sel.kind === 'slot') {
      const layout = this._layoutIn(config, sel.row, sel.col, sel.module, sel.child);
      const list = layout ? mutableSlot(layout, sel.slot) : undefined;
      if (!list) return false;
      const index = list.push(mod) - 1;
      this._markChildList(config, sel.row, sel.col, sel.module);
      path = {
        rowIndex: sel.row,
        columnIndex: sel.col,
        moduleIndex: sel.module,
        childPath: [...(sel.child ?? []).map((s) => ({ ...s })), { slot: sel.slot, index }],
      };
    } else {
      return false;
    }
    this.state = { ...this.state, selectedPath: path };
    this.updateConfig(config);
    return true;
  }

  /**
   * Wrap a module (or a layout child, in place) in a new layout module of `type` (vertical, horizontal,
   * row, tabs, slider-layout): the module becomes the only child of its first slot. The layout is selected.
   */
  wrapInLayout(sel: Selection, type: string): boolean {
    if (sel.kind !== 'module') return false;
    const made = ModuleRegistry.createDefault(type as ModuleType);
    const wrapper = made && localiseCreationDefaults(made);
    // a layout's first slot (undefined for modules without children); no extra dashboard export needed
    const slot = wrapper ? mutableSlot(wrapper, 0) : undefined;
    if (!wrapper || !slot) return false;
    const config = deepClone(this.state.config);
    const at = this._moduleList(config, sel.row, sel.col, sel.module, sel.child);
    if (!at || !at.list[at.index]) return false;
    slot.splice(0, slot.length, at.list[at.index]);
    at.list[at.index] = wrapper;
    if (sel.child?.length) this._markChildList(config, sel.row, sel.col, sel.module);
    // the column's module list becomes this card's own, else the template module would come back
    // in its old place next to the wrapper
    else markColumnModules(config, sel.row, sel.col);
    this.state = { ...this.state, selectedPath: this._pathWithIndex(sel.row, sel.col, sel.module, sel.child, at.index) };
    this.updateConfig(config);
    return true;
  }

  /**
   * What Reset to template clears on a template-linked card: a row's, column's or top-level module's
   * overrides; for a layout child, tab or row-module column its layout's child list. Undefined when
   * the card is not linked or nothing is overridden.
   */
  private _resetTarget(config: MagicCardConfig, sel: Selection): { item: Record<string, unknown>; key?: string } | undefined {
    if (!config.template || sel.kind === 'card') return undefined;
    if (sel.kind === 'slot' || (sel.kind === 'module' && sel.child?.length)) {
      const top = config.rows[sel.row]?.columns[sel.col]?.modules?.[sel.module];
      const key = childListKey(top);
      return top && key && (top.not_synced as string[] | undefined)?.includes(key) ? { item: top, key } : undefined;
    }
    const item = itemAt(config, sel);
    if (!item) return undefined;
    const own = (item.not_synced as string[] | undefined)?.length;
    // children of an old config may carry marks of their own: those go too
    const nested = sel.kind === 'module' && JSON.stringify(childSlots(item as CardModule) ?? []).includes('"not_synced"');
    return own || nested ? { item } : undefined;
  }

  /** Whether the item has template overrides that Reset to template would clear. */
  hasOverrides(sel: Selection): boolean {
    return !!this._resetTarget(this.state.config, sel);
  }

  /** A column of a linked card whose module list is the card's own (`modules` marked, Wrap in layout). */
  ownsModuleList(sel: Selection): boolean {
    if (sel.kind !== 'column' || !this.state.config.template) return false;
    return !!this.state.config.rows[sel.row]?.columns[sel.col]?.not_synced?.includes('modules');
  }

  /**
   * Reset to template: the item's overrides go (one undo step); the editor then re-merges the template
   * (`mc-template-reapply`) so the template's values come back. False when there was nothing to reset.
   * A column that owns its module list also drops its modules, so only with `withOwnList`: the editor
   * calls that once the template was fetched (until then, and when the fetch fails, nothing changes).
   */
  resetItem(sel: Selection, withOwnList = false): boolean {
    if (this.ownsModuleList(sel) && !withOwnList) return false;
    const config = deepClone(this.state.config);
    const t = this._resetTarget(config, sel);
    if (!t) return false;
    if (t.key) {
      const left = (t.item.not_synced as string[]).filter((k) => k !== t.key);
      if (left.length) t.item.not_synced = left;
      else delete t.item.not_synced;
    } else if (sel.kind === 'module') {
      dropMarks(t.item as CardModule);
    } else {
      // a column that owned its module list: the template's list again (the re-merge right after fills
      // it); kept local modules would come back as additions next to the template's
      if (withOwnList && sel.kind === 'column') t.item.modules = [];
      delete t.item.not_synced;
    }
    this.updateConfig(config);
    return true;
  }

  // ── Layout slots (tabs, row-module columns) ──

  /** The layout module at row/col/module/child in a cloned config. */
  private _layoutIn(config: MagicCardConfig, row: number, col: number, module: number, child?: readonly ChildStep[]): LayoutRec | undefined {
    return descendantAt(config.rows[row]?.columns[col]?.modules?.[module], child ?? []) as LayoutRec | undefined;
  }

  /**
   * Edit a layout module in place (one undo step, flows of removed modules pruned). Template-linked:
   * a nested layout overrides its top-level module's child list; a top-level one marks `keys` (its
   * child list key and / or own keys like layout, column_widths). A row module's columns get ids.
   * `fn` returns false for no change; `select` is the selection afterwards.
   */
  private _editLayout(
    at: [number, number, number, (readonly ChildStep[] | undefined)?],
    keys: string[] | ((layout: CardModule) => string[]),
    fn: (layout: LayoutRec) => boolean | void,
    select?: (layout: LayoutRec) => EditorPath | null,
    coalesce = false,
  ): void {
    const [row, col, module, child] = at;
    const config = deepClone(this.state.config);
    const layout = this._layoutIn(config, row, col, module, child);
    if (!layout || fn(layout) === false) return;
    if (layout.type === 'row' && Array.isArray(layout.columns)) {
      for (const c of layout.columns) if (c && typeof c === 'object' && !c.id) c.id = generateId('col');
    }
    if (config.template) {
      if (child?.length) this._markChildList(config, row, col, module);
      else {
        const marks = (layout.not_synced || []) as string[];
        const add = (typeof keys === 'function' ? keys(layout as CardModule) : keys).filter((k) => !marks.includes(k));
        if (add.length) layout.not_synced = [...marks, ...add];
      }
    }
    if (select) this.state = { ...this.state, selectedPath: select(layout) };
    pruneFlows(this.state.config, config);
    this.updateConfig(config, !coalesce);
  }

  private _slotPath(row: number, col: number, module: number, child: readonly ChildStep[] | undefined, slot: number): EditorPath {
    return { rowIndex: row, columnIndex: col, moduleIndex: module, ...(child?.length ? { childPath: child.map((s) => ({ ...s })) } : {}), slotIndex: slot };
  }

  /** Add a new module of `type` to a layout's slot (tab, row-module column, 0 for flat layouts) and select it. */
  addChildModule(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, type: string): void {
    const made = ModuleRegistry.createDefault(type as ModuleType);
    if (!made) return;
    const created = localiseCreationDefaults(made);
    let index = -1;
    this._editLayout([row, col, module, child], (l) => [childListKey(l)!], (layout) => {
      const list = mutableSlot(layout as CardModule, slot);
      if (!list) return false;
      index = list.push(created) - 1;
    }, () => ({ rowIndex: row, columnIndex: col, moduleIndex: module, childPath: [...(child ?? []).map((s) => ({ ...s })), { slot, index }] }));
  }

  private _tabsEdit(at: [number, number, number, (readonly ChildStep[] | undefined)?], fn: (tabs: TabEntry[], layout: LayoutRec) => boolean | void, select?: (layout: LayoutRec) => EditorPath | null, extraKeys: () => string[] = () => []): void {
    this._editLayout(at, () => ['tabs', ...extraKeys()], (layout) => {
      if (layout.type !== 'tabs') return false;
      if (!Array.isArray(layout.tabs)) layout.tabs = [];
      return fn(layout.tabs, layout);
    }, select);
  }

  addTab(row: number, col: number, module: number, child?: ChildStep[]): void {
    this._tabsEdit([row, col, module, child], (tabs) => {
      tabs.push({ label: t('Tab {n}', { n: tabs.length + 1 }), modules: [] });
    }, (l) => this._slotPath(row, col, module, child, l.tabs!.length - 1));
  }

  renameTab(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, label: string): void {
    this.updateTab(row, col, module, child, slot, { label });
  }

  /** Patch a tab (label, icon, icon when active); undefined removes a key. A blank label keeps the tab's label (else "Tab N"). */
  updateTab(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, patch: { label?: string; icon?: string; active_icon?: string }): void {
    this._tabsEdit([row, col, module, child], (tabs) => {
      if (!tabs[slot]) return false;
      if ('label' in patch && !patch.label?.trim()) {
        const label = tabs[slot].label?.trim() ? tabs[slot].label : t('Tab {n}', { n: slot + 1 });
        if (label === tabs[slot].label && Object.keys(patch).length === 1) return false;
        patch = { ...patch, label };
      }
      tabs[slot] = withPatch(tabs[slot], patch);
    });
  }

  moveTab(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, delta: -1 | 1): void {
    const to = slot + delta;
    let touched: DisabledTabsTouched = { base: false, rules: false };
    this._tabsEdit([row, col, module, child], (tabs, layout) => {
      if (!tabs[slot] || to < 0 || to >= tabs.length) return false;
      const [tab] = tabs.splice(slot, 1);
      tabs.splice(to, 0, tab);
      // the default tab stays on the same tab
      const active = Number(layout.active_tab ?? 0);
      if (active === slot) layout.active_tab = to;
      else if (active === to) layout.active_tab = slot;
      touched = remapDisabledTabs(layout, (i) => (i === slot ? to : i === to ? slot : i));
    }, () => this._slotPath(row, col, module, child, to), () => disabledTabsKeys(touched));
  }

  /** Delete a tab and its modules (their flows go in the same step; never the only tab); the next tab is selected. */
  deleteTab(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number): void {
    let touched: DisabledTabsTouched = { base: false, rules: false };
    this._tabsEdit([row, col, module, child], (tabs, layout) => {
      if (!tabs[slot] || tabs.length <= 1) return false;
      tabs.splice(slot, 1);
      const active = Number(layout.active_tab ?? 0);
      if (active > slot) layout.active_tab = active - 1;
      if (Number(layout.active_tab ?? 0) >= tabs.length) {
        if (tabs.length > 1) layout.active_tab = tabs.length - 1;
        else delete layout.active_tab;
      }
      touched = remapDisabledTabs(layout, (i) => (i === slot ? -1 : i > slot ? i - 1 : i));
    }, (l) => (l.tabs!.length
      ? this._slotPath(row, col, module, child, Math.min(slot, l.tabs!.length - 1))
      : { rowIndex: row, columnIndex: col, moduleIndex: module, ...(child?.length ? { childPath: child.map((s) => ({ ...s })) } : {}) }), () => disabledTabsKeys(touched));
  }

  private _rowEdit(at: [number, number, number, (readonly ChildStep[] | undefined)?], keys: string[] | ((layout: CardModule) => string[]), fn: (cols: NestedColumnConfig[], layout: LayoutRec) => boolean | void, select?: (layout: LayoutRec) => EditorPath | null, coalesce = false): void {
    this._editLayout(at, keys, (layout) => {
      if (layout.type !== 'row') return false;
      if (!Array.isArray(layout.columns)) layout.columns = [];
      return fn(layout.columns, layout);
    }, select, coalesce);
  }

  /** Add an empty column to a row module (custom widths get 1fr; a preset is re-equalised) and select it. */
  addNestedColumn(row: number, col: number, module: number, child?: ChildStep[]): void {
    this._rowEdit([row, col, module, child], ['columns', 'layout', 'column_widths'], (cols, layout) => {
      cols.push(newColumn());
      if (Array.isArray(layout.column_widths) && layout.column_widths.length) {
        layout.column_widths = [...columnWidthsList(layout.column_widths, cols.length - 1), '1fr'];
      } else {
        delete layout.column_widths;
        layout.layout = this._equalLayout(cols.length);
      }
    }, (l) => this._slotPath(row, col, module, child, l.columns!.length - 1));
  }

  /** Delete a row-module column and its modules (never the last column). */
  deleteNestedColumn(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number): void {
    this._rowEdit([row, col, module, child], ['columns', 'layout', 'column_widths'], (cols, layout) => {
      if (cols.length <= 1 || !cols[slot]) return false;
      cols.splice(slot, 1);
      layout.layout = this._equalLayout(cols.length);
      if (Array.isArray(layout.column_widths) && layout.column_widths.length) {
        const widths = columnWidthsList(layout.column_widths, cols.length + 1);
        widths.splice(slot, 1);
        if (cols.length < 2) delete layout.column_widths;
        else layout.column_widths = widths;
      }
    }, (l) => this._slotPath(row, col, module, child, Math.min(slot, l.columns!.length - 1)));
  }

  /**
   * Move a row-module column one place left / right (Alt+Up/Down, Move up/down). Its modules, design
   * and other keys move with it, and so does its width: the `column_widths` entry, else its part of
   * the preset ("2-1" becomes "1-2") or custom grid layout. The moved column is selected.
   */
  moveNestedColumn(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, delta: -1 | 1): void {
    const to = slot + delta;
    const keys = ['columns'];
    this._rowEdit([row, col, module, child], () => keys, (cols, layout) => {
      if (slot < 0 || slot >= cols.length || to < 0 || to >= cols.length) return false;
      const swap = <T>(list: T[]) => {
        [list[slot], list[to]] = [list[to], list[slot]];
      };
      swap(cols);
      if (Array.isArray(layout.column_widths) && layout.column_widths.length) {
        const widths = columnWidthsList(layout.column_widths, cols.length);
        swap(widths);
        layout.column_widths = widths;
        keys.push('column_widths');
      } else if (typeof layout.layout === 'string') {
        const preset = /^\d+(?:-\d+)*$/.test(layout.layout);
        const parts = preset ? layout.layout.split('-') : layout.layout.trim().split(/\s+/);
        if (parts.length === cols.length) {
          swap(parts);
          const next = parts.join(preset ? '-' : ' ');
          if (next !== layout.layout) {
            layout.layout = next;
            keys.push('layout');
          }
        }
      }
    }, () => this._slotPath(row, col, module, child, to));
  }

  /**
   * A preset layout for a row module, like setRowLayout: surplus columns' modules move to the last kept column.
   * Template-linked card: like the General tab, `columns` is marked only when the column count changes,
   * `layout` when it changes, and `column_widths` always (the preset drops the widths: a local override).
   */
  setNestedRowLayout(row: number, col: number, module: number, child: ChildStep[] | undefined, layout: string): void {
    const keys = ['column_widths'];
    this._rowEdit([row, col, module, child], () => keys, (cols, mod) => {
      const count = cols.length;
      const before = mod.layout;
      applyRowLayout({ ...mod, columns: cols }, layout, newColumn);
      mod.layout = layout;
      delete mod.column_widths;
      if (before !== layout) keys.push('layout');
      if (cols.length !== count) keys.push('columns');
    });
  }

  /** A row module's column widths (undefined removes them), like setColumnWidths. */
  setNestedColumnWidths(row: number, col: number, module: number, child: ChildStep[] | undefined, widths: string[] | undefined, layout?: string, coalesce = false): void {
    const set = !!widths?.length || !!layout;
    this._rowEdit([row, col, module, child], set ? ['column_widths', ...(layout ? ['layout'] : [])] : [], (_cols, mod) => {
      if (widths?.length) mod.column_widths = [...widths];
      else delete mod.column_widths;
      if (layout) mod.layout = layout;
      // the widths field's reset on a top-level row module: synced with the template again
      if (!set && !child?.length && Array.isArray(mod.not_synced)) {
        mod.not_synced = mod.not_synced.filter((k: string) => k !== 'column_widths');
        if (!mod.not_synced.length) delete mod.not_synced;
      }
    }, undefined, coalesce);
  }

  /** Patch a row-module column (gap, padding, vertical_align, display, design); undefined removes a key. */
  updateNestedColumn(row: number, col: number, module: number, child: ChildStep[] | undefined, slot: number, patch: Partial<NestedColumnConfig>): void {
    this._rowEdit([row, col, module, child], ['columns'], (cols) => {
      if (!cols[slot]) return false;
      cols[slot] = withPatch(cols[slot], patch);
    });
  }

  // ── Undo / Redo ──

  undo(): void {
    const prev = this.undoRedo.undo(this.state.config);
    if (prev) {
      this.state = {
        ...this.state,
        config: prev,
        isDirty: true,
        selectedPath: this._clampedPath(prev, this.state.selectedPath),
        selectedFlow: this._liveFlow(prev),
      };
      this.notify();
      this.sendConfig(prev);
    }
  }

  redo(): void {
    const next = this.undoRedo.redo(this.state.config);
    if (next) {
      this.state = {
        ...this.state,
        config: next,
        isDirty: true,
        selectedPath: this._clampedPath(next, this.state.selectedPath),
        selectedFlow: this._liveFlow(next),
      };
      this.notify();
      this.sendConfig(next);
    }
  }

  canUndo(): boolean {
    return this.undoRedo.canUndo();
  }

  canRedo(): boolean {
    return this.undoRedo.canRedo();
  }

  // ── Cleanup ──

  /** Send a pending (debounced) config-changed right away. */
  flush(): void {
    clearTimeout(this.dragPace);
    this.dragSend(false);
    this.dispatchConfigChanged.flush();
  }

  destroy(): void {
    clearTimeout(this.dragPace);
    this.dragNext = this.dragPace = undefined;
    this.dispatchConfigChanged.cancel();
    this.listeners.clear();
    this.undoRedo.clear();
  }
}
