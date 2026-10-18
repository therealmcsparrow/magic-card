import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, EditorState, RowConfig, RowModuleConfig, TabsModuleConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorSystem } from '../../css/editor-stack';
import { ItemMenu, LongPress, itemMenuStyles, moduleTitle } from './item-menu';
import { renderLayoutGlyph } from '../components/layout-glyph';
import { effectiveWidths, hasColumnWidths, widthWeights } from '../../utils/column-widths';
import {
  Selection,
  selectionFromKey,
  selectionFromPath,
  selectionKey,
  selectionToPath,
  ENTITY_RE,
  breakableId,
  moduleAt,
  moduleSelection,
  parentSelection,
  sameSelection,
  clampSelection,
  slotSelection,
  layoutModuleAt,
  itemAt,
  isHiddenItem,
  layerName,
} from './selection';
import type { SlotSelection } from './selection';
import { ChildStep, childSlots, hasSlotNodes, slotLabel } from '../../utils/module-path';
import { t } from '../i18n';

type DragState =
  | { type: 'row'; row: number }
  | { type: 'module'; row: number; col: number; module: number };

/** Where a drop would land: before row `index`, or at module slot `index` in column `col`. */
type DropTarget =
  | { type: 'row'; index: number }
  | { type: 'module'; row: number; col: number; index: number };

type ModuleSel = Extract<Selection, { kind: 'module' }>;

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/** New index of an item at `i` after moving the item at `from` to `to` (splice semantics). */
function remapIndex(i: number, from: number, to: number): number {
  if (i === from) return to;
  if (from < i && i <= to) return i - 1;
  if (to <= i && i < from) return i + 1;
  return i;
}

function isEditable(node: EventTarget | undefined): boolean {
  return node instanceof Element && (node.matches(EDITABLE_SELECTOR) || (node as HTMLElement).isContentEditable === true);
}

/**
 * Card -> Rows -> Columns -> Modules outline.
 * variant 'pane'   : dialog pane outline (48px module rows)
 * variant 'layers' : studio layers panel (36px rows)
 */
@customElement('mc-structure-outline')
export class StructureOutline extends LitElement {
  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ reflect: true }) variant: 'pane' | 'layers' = 'pane';

  @state() private _state?: EditorState;
  @state() private _collapsed = new Set<string>();
  @state() private _focusKey: string | null = null;
  /** Key of the item being renamed inline (any kind: layer name, tab label, card name). */
  @state() private _renaming: string | null = null;
  @state() private _drop: DropTarget | null = null;

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _pendingFocus: string | null = null;
  private _drag: DragState | null = null;
  private _ignoreClickUntil = 0;
  private _lastSelKey = '';
  /** Where focus goes after an inline rename asked for by someone else (the canvas). */
  private _renameReturn: HTMLElement | null = null;
  /** The context menu of every tree item (⋮, right-click, long-press, Shift+F10, Menu key). */
  private _itemMenu = new ItemMenu(this, {
    surface: 'tree',
    focusSelection: () => this._focusSelection(),
    rename: (sel) => this.startRename(selectionKey(sel)),
    status: (message) => this._status(message),
    deleteModule: (sel) => this._deleteModule(sel),
    deleteRow: (row) => {
      this.stateManager?.deleteRow(row);
      this._pendingFocus = row > 0 ? selectionKey({ kind: 'row', row: row - 1 }) : 'card';
      this.requestUpdate();
    },
    moveRow: (from, to) => {
      this._moveRow(from, to);
      this._focusSelection();
    },
  });
  private _longPress = new LongPress((path, x, y) => this._contextAt(path, x, y));

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
    this._itemMenu.close(false);
    this._longPress.cancel();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('stateManager') && this.stateManager !== this._subscribedTo) this._subscribe();
  }

  protected updated(): void {
    const rename = this._renaming ? this.shadowRoot?.querySelector<HTMLInputElement>('input.rename') : null;
    if (rename && this.shadowRoot?.activeElement !== rename) {
      rename.focus();
      rename.select();
    }
    if (this._pendingFocus) {
      const key = this._pendingFocus;
      this._pendingFocus = null;
      const el = this._item(key) || this._item(this._selectedKey) || this._item('card');
      if (el) {
        this._focusKey = el.dataset.key || null;
        el.focus();
      }
    }
  }

  private _subscribe(): void {
    this._unsubscribe?.();
    this._subscribedTo = this.stateManager;
    if (!this.stateManager) {
      this._unsubscribe = undefined;
      return;
    }
    this._unsubscribe = this.stateManager.subscribe((s) => {
      this._state = s;
      const key = selectionKey(selectionFromPath(s.selectedPath));
      if (key !== this._lastSelKey) {
        this._lastSelKey = key;
        this._revealSelection(key);
      }
    });
  }

  /** Expand a collapsed row that holds the selection and scroll the item into view once rendered. */
  private _revealSelection(key: string): void {
    const sel = selectionFromKey(key);
    if (sel.kind === 'module' || sel.kind === 'column' || sel.kind === 'slot') {
      const id = this._rowId(sel.row);
      if (id && this._collapsed.has(id)) {
        const next = new Set(this._collapsed);
        next.delete(id);
        this._collapsed = next;
      }
    }
    this.updateComplete.then(() => {
      const el = this._item(key);
      if (this.isConnected && el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // ── helpers ──

  private get _rows(): RowConfig[] {
    return this._state?.config.rows || [];
  }

  private get _selectedKey(): string {
    return selectionKey(selectionFromPath(this._state?.selectedPath ?? null));
  }

  private _rowId(r: number): string | undefined {
    const row = this._rows[r];
    return row ? row.id || `#${r}` : undefined;
  }

  private _isOpen(r: number): boolean {
    return !this._collapsed.has(this._rowId(r) || '');
  }

  private _item(key: string): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>(`[role="treeitem"][data-key="${key}"]`) || null;
  }

  private _visibleItems(): HTMLElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>('[role="treeitem"][data-key]') || []);
  }

  private _select(sel: Selection): void {
    this._focusKey = selectionKey(sel);
    this.stateManager?.setSelectedPath(selectionToPath(sel));
  }

  private _setCollapsed(r: number, collapsed: boolean): void {
    const id = this._rowId(r);
    if (!id || this._collapsed.has(id) === collapsed) return;
    const next = new Set(this._collapsed);
    if (collapsed) next.add(id);
    else next.delete(id);
    this._collapsed = next;
  }

  private _fire(name: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  private _addModule(row: number, col: number): void {
    this._fire('add-module', { rowIndex: row, colIndex: col });
  }

  /** Open the module picker for a layout's slot (a tab, a row-module column, 0 for flat layouts). */
  private _addChild(owner: ModuleSel, slot: number): void {
    this._fire('add-module', { rowIndex: owner.row, colIndex: owner.col, moduleIndex: owner.module, child: owner.child, slot });
  }

  /** "Add tab" / "Add column" on a tabs or row module; the new slot is selected. */
  private _addSlot(owner: ModuleSel, type: string): void {
    const sm = this.stateManager;
    if (type === 'tabs') sm?.addTab(owner.row, owner.col, owner.module, owner.child);
    else sm?.addNestedColumn(owner.row, owner.col, owner.module, owner.child);
    this._focusSelection();
  }

  /** Delete a tab / row-module column; the state manager selects its neighbour. */
  private _deleteSlot(sel: SlotSelection): void {
    const sm = this.stateManager;
    const owner = this._state ? layoutModuleAt(this._state.config, sel) : undefined;
    if (!sm || !owner) return;
    if (owner.type === 'tabs') sm.deleteTab(sel.row, sel.col, sel.module, sel.child, sel.slot);
    else sm.deleteNestedColumn(sel.row, sel.col, sel.module, sel.child, sel.slot);
    this._focusSelection();
  }

  /** Move a tab, or a row-module column (with its width), one place up / down. */
  private _moveSlot(sel: SlotSelection, delta: -1 | 1): void {
    const sm = this.stateManager;
    const owner = this._state ? layoutModuleAt(this._state.config, sel) : undefined;
    if (!sm || !owner) return;
    if (owner.type === 'tabs') sm.moveTab(sel.row, sel.col, sel.module, sel.child, sel.slot, delta);
    else sm.moveNestedColumn(sel.row, sel.col, sel.module, sel.child, sel.slot, delta);
    this._focusSelection();
  }

  /**
   * Rename an item inline: the card's name, a tab's label, else its editor-only layer name. The row
   * holding it opens; `returnFocus` (the canvas) gets focus back after Enter / Escape.
   */
  startRename(key: string, returnFocus?: HTMLElement): void {
    const sel = selectionFromKey(key);
    if (sel.kind !== 'card' && sel.kind !== 'row') this._setCollapsed(sel.row, false);
    this._renameReturn = returnFocus ?? null;
    this._focusKey = key;
    this._renaming = key;
  }

  /** The name an item shows without a layer name ("Row 2", "Column 1", "Button · Toggle"). */
  private _defaultLabel(sel: Selection): string | undefined {
    const config = this._state?.config;
    if (!config) return undefined;
    if (sel.kind === 'row') return t('Row {n}', { n: sel.row + 1 });
    if (sel.kind === 'column') return t('Column {n}', { n: sel.col + 1 });
    if (sel.kind === 'slot') return t('Column {n}', { n: sel.slot + 1 });
    const mod = sel.kind === 'module' ? moduleAt(config, sel) : undefined;
    return mod ? moduleTitle({ ...mod, editor_name: undefined }) : undefined;
  }

  /** The text the rename field starts with: what the item shows now. */
  private _renameValue(sel: Selection): string {
    const config = this._state?.config;
    if (!config) return '';
    const item = itemAt(config, sel);
    if (sel.kind === 'card') return config.name ?? '';
    if (sel.kind === 'slot' && layoutModuleAt(config, sel)?.type === 'tabs') return String(item?.label ?? '');
    return layerName(item) ?? this._defaultLabel(sel) ?? '';
  }

  private _commitRename(sel: Selection, value: string, blurred = false): void {
    if (this._renaming !== selectionKey(sel)) return;
    this._renaming = null;
    this.stateManager?.setLayerName(sel, value, this._defaultLabel(sel));
    this._afterRename(sel, blurred);
  }

  /** Focus returns to the canvas after Enter / Escape, not after a blur (the user clicked elsewhere). */
  private _afterRename(sel: Selection, blurred = false): void {
    const back = this._renameReturn;
    this._renameReturn = null;
    if (blurred) {
      if (back?.isConnected) this._fire('mc-rename-done');
    } else if (back?.isConnected) {
      this.updateComplete.then(() => back.focus({ preventScroll: true }));
      this._fire('mc-rename-done');
    } else this._pendingFocus = selectionKey(sel);
    this.requestUpdate();
  }

  private _onRenameKeydown(e: KeyboardEvent, sel: Selection): void {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      this._commitRename(sel, (e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._renaming = null;
      this._afterRename(sel);
    }
  }

  /** The inline rename field in place of an item's name. */
  private _renderRename(sel: Selection, label: string): TemplateResult {
    return html`<input class="rename" aria-label=${label} .value=${this._renameValue(sel)}
      @click=${(e: Event) => e.stopPropagation()}
      @keydown=${(e: KeyboardEvent) => this._onRenameKeydown(e, sel)}
      @blur=${(e: Event) => this._commitRename(sel, (e.target as HTMLInputElement).value, true)} />`;
  }

  /** "Hidden on dashboard" mark after an item's name. */
  private _hiddenMark(item: unknown): TemplateResult | typeof nothing {
    return isHiddenItem(item)
      ? html`<ha-icon class="hid-ico" icon="mdi:eye-off-outline" title=${t('Hidden on dashboard')}></ha-icon><span class="sr-only">${t('Hidden on dashboard')}</span>`
      : nothing;
  }

  /** Copy / paste feedback: the studio's status capsule (Layers), else HA's toast (pane in HA's dialog). */
  private _status(message: string): void {
    if (this.variant === 'layers') this._fire('mc-status', { message });
    else document.querySelector('home-assistant')?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message } }));
  }

  // ── context menu: right-click, long-press ──

  /** The tree item on an event path, with its ⋮ button (the menu's anchor for the keyboard). */
  private _itemOnPath(path: EventTarget[]): HTMLElement | null {
    for (const t of path) {
      if (t === this) return null;
      if (t instanceof HTMLElement && t.getAttribute('role') === 'treeitem' && t.dataset.key) return t;
    }
    return null;
  }

  /** Right-click (and Android's long-press): select the item, open its menu at the pointer. */
  private _onContextMenu = (e: MouseEvent): void => {
    const path = e.composedPath();
    // the browser menu stays in text fields (rename) and with Shift
    if (e.shiftKey || isEditable(path[0])) return;
    const item = this._itemOnPath(path);
    if (!item) return;
    e.preventDefault();
    this._longPress.cancel();
    if (this._longPress.justFired) return;
    this._contextAt(path, e.clientX, e.clientY);
  };

  private _contextAt(path: EventTarget[], x: number, y: number): void {
    const item = this._itemOnPath(path);
    if (!item || !this.stateManager) return;
    const sel = selectionFromKey(item.dataset.key || 'card');
    this._select(sel);
    this._ignoreClickUntil = Date.now() + 400;
    this._itemMenu.open(sel, item, { point: { x, y }, returnFocus: item });
  }

  /** Number of tabs / columns of the slot's layout module. */
  private _slotTotal(sel: SlotSelection): number {
    const owner = this._state ? layoutModuleAt(this._state.config, sel) : undefined;
    return childSlots(owner)?.length ?? 0;
  }

  /** Modules in a slot. */
  private _slotCount(sel: SlotSelection): number {
    const owner = this._state ? layoutModuleAt(this._state.config, sel) : undefined;
    return childSlots(owner)?.[sel.slot]?.length ?? 0;
  }

  private _addColumn(row: number): void {
    const sm = this.stateManager;
    if (!sm || !this._rows[row]) return;
    sm.addColumn(row);
    this._select({ kind: 'column', row, col: this._rows[row].columns.length - 1 });
  }

  private _requestAddRow(): void {
    this._fire('request-add-row');
  }

  /** Move a row and keep the selection pointing at the same row. */
  private _moveRow(from: number, to: number): void {
    const sm = this.stateManager;
    if (!sm || from === to || to < 0 || to >= this._rows.length) return;
    const path = sm.getState().selectedPath;
    sm.moveRow(from, to);
    if (path && path.rowIndex !== undefined) {
      const rowIndex = remapIndex(path.rowIndex, from, to);
      if (rowIndex !== path.rowIndex) sm.setSelectedPath({ ...path, rowIndex });
    }
  }

  // ── click / keyboard ──

  /** A press on the caret or the ⋮ button belongs to the button, not to the item that holds it. */
  private _onButton(e: Event): boolean {
    return e.composedPath().some((n) => n instanceof HTMLButtonElement);
  }

  private _rename(e: Event, key: string): void {
    if (!this._onButton(e)) this.startRename(key);
  }

  private _onItemClick(e: Event): void {
    if (Date.now() < this._ignoreClickUntil || this._onButton(e)) return;
    const el = (e.currentTarget as HTMLElement);
    const key = el.dataset.key;
    if (key) this._select(selectionFromKey(key));
  }

  private _onKeydown(e: KeyboardEvent): void {
    const origin = e.composedPath()[0];
    if (isEditable(origin)) return;

    // An open menu handles its own keys (MenuPopover.onKeydown on the menu element).
    if (this._itemMenu.isOpen) return;

    const item = origin instanceof Element ? (origin.closest('[role="treeitem"]') as HTMLElement | null) : null;
    // Keys only act on tree items themselves, not on the caret/overflow buttons beside them.
    if (!item || item !== origin) return;
    const key = item.dataset.key || 'card';
    const sel = selectionFromKey(key);
    const sm = this.stateManager;
    if (!sm) return;

    const handled = (): void => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      const delta = e.key === 'ArrowUp' ? -1 : 1;
      if (sel.kind === 'module') {
        handled();
        this._moveModuleBy(sel, delta);
      } else if (sel.kind === 'slot') {
        handled();
        this._moveSlot(sel, delta);
      } else if (sel.kind === 'row') {
        handled();
        const to = sel.row + delta;
        if (to >= 0 && to < this._rows.length) {
          this._moveRow(sel.row, to);
          this._pendingFocus = selectionKey({ kind: 'row', row: to });
          this.requestUpdate();
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End': {
        handled();
        const items = this._visibleItems();
        const i = items.indexOf(item);
        const next = e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1)
          : e.key === 'ArrowUp' ? Math.max(0, i - 1)
          : e.key === 'Home' ? 0
          : items.length - 1;
        this._focusItem(items[next]);
        return;
      }
      case 'ArrowRight':
        if (sel.kind === 'row') {
          handled();
          if (!this._isOpen(sel.row)) this._setCollapsed(sel.row, false);
          else this._focusItem(this._item(selectionKey({ kind: 'column', row: sel.row, col: 0 })));
        }
        return;
      case 'ArrowLeft':
        if (sel.kind === 'row') {
          handled();
          this._setCollapsed(sel.row, true);
        } else if (sel.kind === 'column' || sel.kind === 'module' || sel.kind === 'slot') {
          handled();
          this._focusItem(this._item(selectionKey(parentSelection(sel, this._state?.config))));
        }
        return;
      case 'Enter':
      case ' ':
        handled();
        this._select(sel);
        return;
      case 'Delete':
      case 'Backspace':
        if (sel.kind === 'module') {
          handled();
          this._deleteModule(sel);
          return;
        }
        break;
      default:
        break;
    }
    // F2, Ctrl+D, Delete on rows / columns / tabs, Shift+F10 and the Menu key: the same as the canvas
    const anchor = item.querySelector<HTMLElement>(':scope > .more') ?? item;
    if (this._itemMenu.shortcut(e, sel, anchor, { returnFocus: item })) handled();
  }

  /** Move a module (or layout child) by one within its column / slot; focus follows it. */
  private _moveModuleBy(sel: ModuleSel, delta: -1 | 1): void {
    const sm = this.stateManager;
    if (sm?.moveModuleBy(sel.row, sel.col, sel.module, delta, sel.child)) this._focusSelection();
  }

  /** Delete a module (or layout child); focus a sibling, else its column / layout. */
  private _deleteModule(sel: ModuleSel): void {
    const sm = this.stateManager;
    if (!sm) return;
    if (sel.child?.length) {
      sm.deleteModule(sel.row, sel.col, sel.module, sel.child);
      this._focusSelection();
      return;
    }
    sm.deleteModule(sel.row, sel.col, sel.module);
    const mods = this._rows[sel.row]?.columns[sel.col]?.modules?.length ?? 0;
    this._pendingFocus = mods
      ? selectionKey({ ...sel, module: Math.min(sel.module, mods - 1) })
      : selectionKey({ kind: 'column', row: sel.row, col: sel.col });
    this.requestUpdate();
  }

  /** Focus the item the state manager selected last (after a move / duplicate / delete). */
  private _focusSelection(): void {
    const sm = this.stateManager;
    if (!sm) return;
    this._pendingFocus = selectionKey(selectionFromPath(sm.getState().selectedPath));
    this.requestUpdate();
  }

  private _focusItem(el: HTMLElement | null | undefined): void {
    if (!el) return;
    this._focusKey = el.dataset.key || null;
    el.focus();
  }

  // ── menus ──

  /** The ⋮ button: the item's menu (toggle), anchored to the button. */
  private _openMenuFor(sel: Selection, e: Event): void {
    this._itemMenu.open(sel, e.currentTarget as HTMLElement);
  }

  private _menuOpenFor(sel: Selection): boolean {
    return this._itemMenu.openKey === selectionKey(sel);
  }

  // ── drag and drop (ported from form-editor) ──

  private _onRowDragStart(e: DragEvent, row: number): void {
    this._itemMenu.close(false);
    this._longPress.cancel();
    this._drag = { type: 'row', row };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(this._drag));
    }
    (e.currentTarget as HTMLElement).closest('li')?.classList.add('dragging');
    e.stopPropagation();
  }

  private _onModuleDragStart(e: DragEvent, row: number, col: number, module: number): void {
    this._itemMenu.close(false);
    this._longPress.cancel();
    this._drag = { type: 'module', row, col, module };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(this._drag));
    }
    (e.currentTarget as HTMLElement).closest('li')?.classList.add('dragging');
    e.stopPropagation();
  }

  private _onDragEnd(e: DragEvent): void {
    (e.currentTarget as HTMLElement).closest('li')?.classList.remove('dragging');
    this._drag = null;
    this._drop = null;
    this._ignoreClickUntil = Date.now() + 250;
  }

  private _isLowerHalf(e: DragEvent, el: Element): boolean {
    const r = el.getBoundingClientRect();
    return e.clientY > r.top + r.height / 2;
  }

  private _setDrop(target: DropTarget | null): void {
    const a = this._drop;
    const same = a && target && a.type === target.type && a.index === target.index &&
      (a.type === 'row' || (target.type === 'module' && a.row === target.row && a.col === target.col));
    if (!same && (a || target)) this._drop = target;
  }

  private _onRowDragOver(e: DragEvent, row: number): void {
    if (this._drag?.type !== 'row') return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._setDrop({ type: 'row', index: this._isLowerHalf(e, e.currentTarget as Element) ? row + 1 : row });
  }

  private _onRowDrop(e: DragEvent): void {
    e.preventDefault();
    const drag = this._drag;
    const drop = this._drop;
    this._drag = null;
    this._drop = null;
    if (drag?.type !== 'row' || drop?.type !== 'row') return;
    const to = drop.index > drag.row ? drop.index - 1 : drop.index;
    this._moveRow(drag.row, to);
  }

  /** Hovering a module item: insertion line above or below it. */
  private _onModuleDragOver(e: DragEvent, row: number, col: number, module: number): void {
    if (this._drag?.type !== 'module') return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    const index = this._isLowerHalf(e, e.currentTarget as Element) ? module + 1 : module;
    this._setDrop({ type: 'module', row, col, index });
  }

  /** Hovering a column label or its empty box: drop at a fixed slot. */
  private _onSlotDragOver(e: DragEvent, row: number, col: number, index: number): void {
    if (this._drag?.type !== 'module') return;
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    this._setDrop({ type: 'module', row, col, index });
  }

  private _dropModule(e: DragEvent): void {
    // Not a module drag (e.g. a row drag): let the event bubble to the row's drop handler untouched.
    if (this._drag?.type !== 'module') return;
    e.preventDefault();
    e.stopPropagation();
    const drag = this._drag;
    const drop = this._drop;
    this._drag = null;
    this._drop = null;
    this._ignoreClickUntil = Date.now() + 300;
    if (drag?.type !== 'module' || drop?.type !== 'module' || !this.stateManager) return;
    let target = drop.index;
    if (drag.row === drop.row && drag.col === drop.col && drag.module < target) target -= 1;
    if (drag.row === drop.row && drag.col === drop.col && drag.module === target) return;
    this.stateManager.moveModule(drag.row, drag.col, drag.module, drop.row, drop.col, target);
    this.stateManager.setSelectedPath({ rowIndex: drop.row, columnIndex: drop.col, moduleIndex: target });
  }

  private _onTreeDragLeave(e: DragEvent): void {
    const to = e.relatedTarget as Node | null;
    if (!to || !(e.currentTarget as Node).contains(to)) this._drop = null;
  }

  // ── render ──

  private _itemAttrs(key: string, selKey: string, focusKey: string) {
    return { current: key === selKey, tab: key === focusKey ? 0 : -1 };
  }

  protected render(): TemplateResult {
    const rows = this._rows;
    const selKey = this._selectedKey;
    const focusKey = this._resolveFocusKey(selKey);
    const cardName = this._state?.config.name?.trim() || t('Card');
    const card = this._itemAttrs('card', selKey, focusKey);
    const renamingCard = this._renaming === 'card';

    return html`
      <div
        class="outline-root"
        @keydown=${this._onKeydown}
        @contextmenu=${this._onContextMenu}
        @pointerdown=${this._longPress.down}
        @pointermove=${this._longPress.move}
        @pointerup=${this._longPress.cancel}
        @pointercancel=${this._longPress.cancel}
        @dragstart=${this._longPress.cancel}
      >
        <ul
          class="tree"
          role="tree"
          aria-label=${t('Card structure')}
          @dragleave=${this._onTreeDragLeave}
        >
          <li role="none">
            <div class="line">
              <div
                class="item card-item k-card"
                role="treeitem"
                aria-level="1"
                data-key="card"
                tabindex=${card.tab}
                aria-selected=${card.current ? 'true' : 'false'}
                aria-current=${card.current ? 'true' : nothing}
                @click=${this._onItemClick}
                @dblclick=${() => this.startRename('card')}
              >
                <ha-icon icon="mdi:card-outline"></ha-icon>
                ${renamingCard ? this._renderRename({ kind: 'card' }, t('Card name')) : html`<span class="text"><span class="name">${cardName}</span></span>`}
              </div>
            </div>
          </li>
          ${rows.map((row, ri) => this._renderRow(row, ri, selKey, focusKey))}
        </ul>
        ${rows.length
          ? html`
              <div class="foot">
                <button type="button" class="btn btn-secondary btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${t('Add row')}
                </button>
              </div>
            `
          : html`
              <div class="empty card-empty">
                <ha-icon icon="mdi:view-sequential-outline"></ha-icon>
                <strong>${t('No rows yet')}</strong>
                <p>${t('Rows hold columns, columns hold modules.')}</p>
                <button type="button" class="btn btn-text btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${t('Add row')}
                </button>
              </div>
            `}
        ${this._itemMenu.render()}
      </div>
    `;
  }

  /** The one tree item that is in the tab order: last focused, else selection, else its row, else the card. */
  private _resolveFocusKey(selKey: string): string {
    if (this._focusKey && this._keyRendered(this._focusKey)) return this._focusKey;
    if (this._keyRendered(selKey)) return selKey;
    const sel = selectionFromKey(selKey);
    if (sel.kind !== 'card' && this._keyRendered(`r${sel.row}`)) return `r${sel.row}`;
    return 'card';
  }

  private _keyRendered(key: string): boolean {
    const s = selectionFromKey(key);
    if (s.kind === 'card') return true;
    const row = this._rows[s.row];
    if (!row) return false;
    if (s.kind === 'row') return true;
    if (!this._isOpen(s.row)) return false;
    const col = row.columns[s.col];
    if (!col) return false;
    if (s.kind === 'column') return true;
    if (s.kind === 'slot') return !!this._state && sameSelection(clampSelection(this._state.config, s), s);
    return !!this._state && !!moduleAt(this._state.config, s);
  }

  private _renderGlyph(row: RowConfig): TemplateResult {
    return renderLayoutGlyph(widthWeights(effectiveWidths(row)));
  }

  private _renderRow(row: RowConfig, ri: number, selKey: string, focusKey: string): TemplateResult {
    const key = selectionKey({ kind: 'row', row: ri });
    const a = this._itemAttrs(key, selKey, focusKey);
    const open = this._isOpen(ri);
    const drop = this._drop;
    const lineBefore = drop?.type === 'row' && drop.index === ri;
    const lineAfter = drop?.type === 'row' && ri === this._rows.length - 1 && drop.index === ri + 1;
    const sel: Selection = { kind: 'row', row: ri };
    const menuOpen = this._menuOpenFor(sel);
    const name = layerName(row) ?? t('Row {n}', { n: ri + 1 });
    const renaming = this._renaming === key;

    return html`
      <li
        role="none"
        class="row ${lineBefore ? 'drop-before' : ''} ${lineAfter ? 'drop-after' : ''}"
        @dragover=${(e: DragEvent) => this._onRowDragOver(e, ri)}
        @drop=${this._onRowDrop}
      >
        <div class="line k-row" role="treeitem" aria-level="2" data-key=${key} data-hidden=${isHiddenItem(row) ? '' : nothing} tabindex=${a.tab} aria-labelledby=${`i-${key}`}
          aria-expanded=${open ? 'true' : 'false'} aria-selected=${a.current ? 'true' : 'false'} aria-current=${a.current ? 'true' : nothing}
          draggable="true" @dragstart=${(e: DragEvent) => this._onRowDragStart(e, ri)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${(e: Event) => this._rename(e, key)}>
          <button
            type="button"
            class="caret"
            tabindex="-1"
            aria-expanded=${open ? 'true' : 'false'}
            aria-label=${open ? t('Collapse row {n}', { n: ri + 1 }) : t('Expand row {n}', { n: ri + 1 })}
            @click=${() => this._setCollapsed(ri, open)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <div
            class="item row-item k-row"
            id=${`i-${key}`}
            data-hidden=${isHiddenItem(row) ? '' : nothing}
            data-current=${a.current ? '' : nothing}
          >
            ${renaming
              ? this._renderRename(sel, t('Row name'))
              : this.variant === 'pane'
                ? html`${this._renderGlyph(row)}<span class="text"><span class="name">${name} · ${hasColumnWidths(row) ? 'custom' : row.layout || '1'}</span></span>`
                : html`<span class="text"><span class="name">${name}</span></span>${this._renderGlyph(row)}`}
            ${this._hiddenMark(row)}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${t('{name} actions', { name })}
            aria-haspopup="menu"
            aria-expanded=${menuOpen ? 'true' : 'false'}
            @click=${(e: Event) => this._openMenuFor(sel, e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${open
          ? html`<ul role="group">
              ${row.columns.map((col, ci) => this._renderColumn(ri, ci, col.modules ?? [], selKey, focusKey))}
              ${this._renderAddColumn(ri)}
            </ul>`
          : nothing}
      </li>
    `;
  }

  private _renderColumn(
    ri: number,
    ci: number,
    modules: CardModule[],
    selKey: string,
    focusKey: string,
  ): TemplateResult {
    const key = selectionKey({ kind: 'column', row: ri, col: ci });
    const a = this._itemAttrs(key, selKey, focusKey);
    const n = modules.length;
    const drop = this._drop;
    const dropHere = drop?.type === 'module' && drop.row === ri && drop.col === ci ? drop.index : -1;
    const sel: Selection = { kind: 'column', row: ri, col: ci };
    const menuOpen = this._menuOpenFor(sel);
    const col = this._rows[ri]?.columns[ci];
    const name = layerName(col) ?? t('Column {n}', { n: ci + 1 });

    return html`
      <li role="none" class="col">
        <div class="line k-column" role="treeitem" aria-level="3" data-key=${key} data-hidden=${isHiddenItem(col) ? '' : nothing} tabindex=${a.tab} aria-labelledby=${`i-${key}`}
          aria-selected=${a.current ? 'true' : 'false'} aria-current=${a.current ? 'true' : nothing}
          @click=${this._onItemClick} @dblclick=${(e: Event) => this._rename(e, key)}
          @dragover=${(e: DragEvent) => this._onSlotDragOver(e, ri, ci, 0)} @drop=${this._dropModule}>
          <div
            class="item col-item k-column"
            id=${`i-${key}`}
            data-hidden=${isHiddenItem(col) ? '' : nothing}
            data-current=${a.current ? '' : nothing}
          >
            ${this._renaming === key ? this._renderRename(sel, t('Column name')) : html`<span class="text"><span class="name">${name}</span></span>`}
            ${this._hiddenMark(col)}
            ${this.stateManager?.ownsModuleList(sel) ? html`<ha-icon class="own-ico" icon="mdi:format-list-bulleted" title=${t('Own module list: not synced with the template. Reset column restores it.')}></ha-icon><span class="sr-only">${t('Own module list, not synced with the template')}</span>` : nothing}
            <span class="chip is-count">${n}<span class="sr-only"> ${t('{n, plural, one {module} other {modules}}', { n })}</span></span>
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${t('Row {row} column {column} actions', { row: ri + 1, column: ci + 1 })}
            aria-haspopup="menu"
            aria-expanded=${menuOpen ? 'true' : 'false'}
            @click=${(e: Event) => this._openMenuFor(sel, e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${n
          ? html`<ul role="group">
              ${modules.map((m, mi) => this._renderModule(m, ri, ci, mi, n, dropHere, selKey, focusKey))}
              ${this.variant === 'layers' ? this._renderAddRow(ri, ci) : nothing}
            </ul>`
          : html`
              <div
                class="empty col-empty ${dropHere === 0 ? 'drop-into' : ''}"
                role="treeitem"
                aria-level="4"
                data-empty=${key}
                @dragover=${(e: DragEvent) => this._onSlotDragOver(e, ri, ci, 0)}
                @drop=${this._dropModule}
              >
                <p>${t('Empty column')}</p>
                <button
                  type="button"
                  class="btn btn-text btn-sm"
                  aria-label=${t('Add module to Row {row} Column {column}', { row: ri + 1, column: ci + 1 })}
                  @click=${() => this._addModule(ri, ci)}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>${t('Add module')}
                </button>
              </div>
            `}
      </li>
    `;
  }

  /** Layers: a compact "Add module" row under a column's last module (opens the module picker). */
  private _renderAddRow(ri: number, ci: number): TemplateResult {
    return html`
      <li role="treeitem" aria-level="4" class="add-mod">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label=${t('Add module to Row {row} Column {column}', { row: ri + 1, column: ci + 1 })}
          @click=${() => this._addModule(ri, ci)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${t('Add module')}
        </button>
      </li>
    `;
  }

  /** A compact "Add column" row under a row's last column (adds an empty column and selects it). */
  private _renderAddColumn(ri: number): TemplateResult {
    return html`
      <li role="treeitem" aria-level="3" class="add-col">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label=${t('Add column to Row {row}', { row: ri + 1 })}
          @click=${() => this._addColumn(ri)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${t('Add column')}
        </button>
      </li>
    `;
  }

  private _renderModule(
    mod: CardModule,
    ri: number,
    ci: number,
    mi: number,
    count: number,
    dropHere: number,
    selKey: string,
    focusKey: string,
  ): TemplateResult {
    const sel = moduleSelection(ri, ci, mi) as ModuleSel;
    const key = selectionKey(sel);
    const a = this._itemAttrs(key, selKey, focusKey);
    const icon = ModuleRegistry.get(mod.type)?.metadata.icon || 'mdi:puzzle-outline';
    // Mockup: "<Type> · <label>" (or its layer name) with the entity id (mono) under it.
    const sub = typeof mod.entity === 'string' && ENTITY_RE.test(mod.entity) ? mod.entity : undefined;
    const overrides = !!mod.not_synced?.length;
    const before = dropHere === mi;
    const after = mi === count - 1 && dropHere === count;

    return html`
      <li
        role="none"
        class="mod ${before ? 'drop-before' : ''} ${after ? 'drop-after' : ''}"
        @dragover=${(e: DragEvent) => this._onModuleDragOver(e, ri, ci, mi)}
        @drop=${this._dropModule}
      >
        <div class="line mod-line k-module" role="treeitem" aria-level="4" data-key=${key} data-hidden=${isHiddenItem(mod) ? '' : nothing} tabindex=${a.tab} aria-labelledby=${`i-${key}`}
          aria-selected=${a.current ? 'true' : 'false'} aria-current=${a.current ? 'true' : nothing}
          draggable=${this._renaming === key ? 'false' : 'true'} @dragstart=${(e: DragEvent) => this._onModuleDragStart(e, ri, ci, mi)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${(e: Event) => this._rename(e, key)}>
          <div
            class="item mod-item k-module"
            id=${`i-${key}`}
            data-hidden=${isHiddenItem(mod) ? '' : nothing}
            data-current=${a.current ? '' : nothing}
          >
            <ha-icon icon=${icon}></ha-icon>
            ${this._renaming === key
              ? this._renderRename(sel, t('Module name'))
              : html`<span class="text">
                  <span class="name">${moduleTitle(mod)}</span>
                  ${sub ? html`<span class="sub is-entity">${breakableId(sub)}</span>` : nothing}
                </span>`}
            ${this._hiddenMark(mod)}
            ${overrides
              ? html`<span class="ovr-dot" title=${t('Has local overrides')}></span><span class="sr-only">${t('Has local overrides')}</span>`
              : nothing}
          </div>
          ${this._renderModuleMore(mod, sel, a.tab)}
        </div>
        ${this._renderChildren(mod, ri, ci, mi, [], 5, selKey, focusKey)}
      </li>
    `;
  }

  /**
   * A layout module's children, nested under it (any depth), each list ending in an "Add module" row.
   * Tabs and row-module columns are tree nodes of their own (kind 'slot') holding their children.
   * Children are selected, moved (Alt+Up/Down) and deleted like modules; dragging stays for top-level modules.
   */
  private _renderChildren(
    parent: CardModule,
    ri: number,
    ci: number,
    mi: number,
    chain: ChildStep[],
    level: number,
    selKey: string,
    focusKey: string,
  ): TemplateResult | typeof nothing {
    const slots = childSlots(parent);
    if (!slots) return nothing;
    const owner = moduleSelection(ri, ci, mi, chain) as ModuleSel;
    if (!hasSlotNodes(parent)) {
      return html`<ul role="group">
        ${(slots[0] ?? []).map((child, index) => this._renderChild(child, owner, 0, index, level, selKey, focusKey))}
        ${this._renderAddChild(owner, 0, this._moduleName(parent), level)}
      </ul>`;
    }
    const isTabs = parent.type === 'tabs';
    const weights = isTabs ? [] : widthWeights(effectiveWidths(parent as RowModuleConfig));
    return html`<ul role="group">
      ${slots.map((list, slot) => {
        const sel = slotSelection(ri, ci, mi, chain, slot);
        const key = selectionKey(sel);
        const a = this._itemAttrs(key, selKey, focusKey);
        const entry = this._state ? itemAt(this._state.config, sel) : undefined;
        const label = (isTabs ? undefined : layerName(entry)) ?? slotLabel(parent, slot)!;
        const icon = isTabs ? (parent as TabsModuleConfig).tabs?.[slot]?.icon || 'mdi:tab' : '';
        const n = list.length;
        const menuOpen = this._menuOpenFor(sel);
        const renaming = this._renaming === key;
        return html`
          <li role="none" class="col slot">
            <div class="line mod-line k-column" role="treeitem" aria-level=${level} data-key=${key} data-hidden=${isHiddenItem(entry) ? '' : nothing} tabindex=${a.tab} aria-labelledby=${`i-${key}`}
              aria-selected=${a.current ? 'true' : 'false'} aria-current=${a.current ? 'true' : nothing}
              @click=${this._onItemClick} @dblclick=${(e: Event) => this._rename(e, key)}>
              <div
                class="item col-item slot-item k-column"
                id=${`i-${key}`}
                data-hidden=${isHiddenItem(entry) ? '' : nothing}
                data-current=${a.current ? '' : nothing}
              >
                ${isTabs ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
                ${renaming
                  ? this._renderRename(sel, isTabs ? t('Tab name') : t('Column name'))
                  : html`<span class="text"><span class="name">${label}</span></span>`}
                ${this._hiddenMark(entry)}
                ${isTabs ? nothing : html`<span class="slot-glyph">${renderLayoutGlyph(weights, slot)}</span>`}
                <span class="chip is-count">${n}<span class="sr-only"> ${t('{n, plural, one {module} other {modules}}', { n })}</span></span>
              </div>
              <button
                type="button"
                class="icon-btn sm more"
                tabindex=${a.tab}
                aria-label=${t('{name} actions', { name: label })}
                aria-haspopup="menu"
                aria-expanded=${menuOpen ? 'true' : 'false'}
                @click=${(e: Event) => this._openMenuFor(sel, e)}
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            </div>
            <ul role="group">
              ${list.map((child, index) => this._renderChild(child, owner, slot, index, level + 1, selKey, focusKey))}
              ${this._renderAddChild(owner, slot, `${this._moduleName(parent)} ${label}`, level + 1)}
            </ul>
          </li>
        `;
      })}
      <li role="treeitem" aria-level=${level} class="add-col">
        <button type="button" class="btn btn-text btn-sm" aria-label=${isTabs ? t('Add tab to {name}', { name: this._moduleName(parent) }) : t('Add column to {name}', { name: this._moduleName(parent) })}
          @click=${() => this._addSlot(owner, parent.type)}>
          <ha-icon icon="mdi:plus"></ha-icon>${isTabs ? t('Add tab') : t('Add column')}
        </button>
      </li>
    </ul>`;
  }

  /** One layout child (and its own children). */
  private _renderChild(child: CardModule, owner: ModuleSel, slot: number, index: number, level: number, selKey: string, focusKey: string): TemplateResult {
    const steps = [...(owner.child ?? []), { slot, index }];
    const sel = moduleSelection(owner.row, owner.col, owner.module, steps) as ModuleSel;
    const key = selectionKey(sel);
    const a = this._itemAttrs(key, selKey, focusKey);
    const icon = ModuleRegistry.get(child.type)?.metadata.icon || 'mdi:puzzle-outline';
    const title = moduleTitle(child);
    const sub = typeof child.entity === 'string' && ENTITY_RE.test(child.entity) ? child.entity : undefined;
    return html`
      <li role="none" class="mod child">
        <div class="line mod-line k-module" role="treeitem" aria-level=${level} data-key=${key} data-hidden=${isHiddenItem(child) ? '' : nothing} tabindex=${a.tab} aria-labelledby=${`i-${key}`}
          aria-selected=${a.current ? 'true' : 'false'} aria-current=${a.current ? 'true' : nothing}
          title=${this.variant === 'layers' ? `${title}${sub ? ` · ${sub}` : ''}` : nothing}
          @click=${this._onItemClick} @dblclick=${(e: Event) => this._rename(e, key)}>
          <div
            class="item mod-item k-module"
            id=${`i-${key}`}
            data-hidden=${isHiddenItem(child) ? '' : nothing}
            data-current=${a.current ? '' : nothing}
          >
            <ha-icon icon=${icon}></ha-icon>
            ${this._renaming === key
              ? this._renderRename(sel, t('Module name'))
              : html`<span class="text">
                  <span class="name">${title}</span>
                  ${sub ? html`<span class="sub is-entity">${this.variant === 'layers' ? sub : breakableId(sub)}</span>` : nothing}
                </span>`}
            ${this._hiddenMark(child)}
          </div>
          ${this._renderModuleMore(child, sel, a.tab)}
        </div>
        ${this._renderChildren(child, owner.row, owner.col, owner.module, steps, level + 1, selKey, focusKey)}
      </li>
    `;
  }

  /** "Add module" under a layout's list (also when empty): opens the module picker for that slot. */
  private _renderAddChild(owner: ModuleSel, slot: number, where: string, level: number): TemplateResult {
    return html`
      <li role="treeitem" aria-level=${level} class="add-mod">
        <button type="button" class="btn btn-text btn-sm" aria-label=${t('Add module to {where}', { where })} @click=${() => this._addChild(owner, slot)}>
          <ha-icon icon="mdi:plus"></ha-icon>${t('Add module')}
        </button>
      </li>
    `;
  }

  /** "Text · Kitchen" (or its layer name): a module's name as its outline item shows it. */
  private _moduleName(mod: CardModule): string {
    return moduleTitle(mod);
  }

  /** A module item's ⋮ (in the tab order only beside the roving tree item). */
  private _renderModuleMore(mod: CardModule, sel: ModuleSel, tab: number): TemplateResult {
    const open = this._menuOpenFor(sel);
    return html`
      <button
        type="button"
        class="icon-btn sm more"
        tabindex=${tab}
        aria-label=${t('Module options for {name}', { name: this._moduleName(mod) })}
        aria-haspopup="menu"
        aria-expanded=${open ? 'true' : 'false'}
        @click=${(e: Event) => this._openMenuFor(sel, e)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `;
  }

  static styles = [
    editorSystem,
    itemMenuStyles,
    css`
      :host {
        display: block;
        container: mc-outline / inline-size;
        --o-item-h: 36px;
        --o-mod-h: 36px;
        --o-icon: 18px;
        --o-gap: 8px;
        --o-font: 0.8125rem;
      }
      :host([variant='pane']) {
        --o-item-h: 40px;
        --o-mod-h: 48px;
        --o-icon: 20px;
        --o-gap: 12px;
        --o-font: 0.875rem;
      }

      .tree,
      .tree ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tree ul {
        padding-left: 12px;
        margin-left: 12px;
        border-left: 1px solid var(--mc-divider);
      }
      .line {
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
      }

      .item {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: var(--o-gap);
        min-height: var(--o-item-h);
        padding: 6px 8px;
        border: 1px solid transparent;
        border-radius: var(--mc-radius);
        font-size: var(--o-font);
        color: var(--mc-text);
        cursor: pointer;
        user-select: none;
        transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
      }
      .item:hover {
        background: var(--mc-surface-2);
      }
      /* The line is the tree item (it owns the caret and the menu button); the plate inside it shows the ring. */
      .line:focus-visible {
        outline: none;
      }
      .line:focus-visible > .item,
      .card-item:focus-visible {
        outline: 2px solid var(--mc-focus);
        outline-offset: -2px;
      }
      /* Selected item: 12% wash + ink of its level (.k-card / .k-row / .k-column / .k-module). */
      .item[data-current] {
        background: var(--k-tint);
        color: var(--k-ink);
      }
      :host([variant='pane']) .item[data-current] {
        border-color: color-mix(in srgb, var(--k) 45%, transparent);
      }
      .item > ha-icon {
        --mdc-icon-size: var(--o-icon);
        color: var(--mc-text-2);
        flex: none;
      }
      .item[data-current] > ha-icon {
        color: var(--k-ink);
      }
      .text {
        flex: 1;
        min-width: 0;
        display: grid;
      }
      .name {
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .sub {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
        line-height: 1.35;
      }
      .sub.is-entity {
        font-family: var(--mc-mono);
      }
      .mod-item {
        min-height: var(--o-mod-h);
      }
      /* layout children, nested under their layout module */
      .mod > ul {
        padding-left: 8px;
        margin-left: 18px;
      }
      .sub .mono {
        font-family: var(--mc-mono);
      }
      :host([variant='pane']) .mod-item {
        padding: 6px 12px;
      }
      .card-item {
        margin-left: 26px;
      }
      .col-item {
        min-height: 32px;
        padding: 4px 8px;
      }
      .col-item .name {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .col-item[data-current] .name {
        color: var(--k-ink);
      }
      .ovr-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--warning-color, #ff9800);
        flex: none;
      }

      .caret {
        width: 24px;
        height: 24px;
        border: 0;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        display: grid;
        place-items: center;
        color: var(--mc-text-2);
        flex: none;
      }
      .caret:hover {
        background: var(--mc-surface-2);
      }
      .caret ha-icon {
        --mdc-icon-size: 18px;
        transition: transform 0.15s ease-out;
      }
      .caret[aria-expanded='false'] ha-icon {
        transform: rotate(-90deg);
      }
      .more[aria-expanded='true'] {
        background: var(--mc-surface-2);
        color: var(--mc-text);
      }
      /*
       * Module ⋮ keeps its slot (no layout shift). Pointer devices: shown on hover, focus, selection
       * and while its menu is open. Touch (no hover): always shown.
       */
      .mod-line > .more {
        opacity: 0;
        transition: opacity 0.15s ease-out, background-color 0.15s ease-out;
      }
      .mod-line:hover > .more,
      .mod-line:focus-within > .more,
      .mod-line > .item[data-current] + .more,
      .mod-line > .more[aria-expanded='true'] {
        opacity: 1;
      }
      @media (hover: none) {
        .mod-line > .more {
          opacity: 1;
        }
      }

      .add-mod .btn,
      .add-col .btn {
        width: 100%;
        justify-content: flex-start;
        min-height: 28px;
        padding: 0 8px;
        gap: var(--o-gap);
        font-size: 0.75rem;
      }
      .add-mod .btn ha-icon,
      .add-col .btn ha-icon {
        --mdc-icon-size: var(--o-icon);
      }
      /* pane (touch dialog): a taller target */
      :host([variant='pane']) .add-col .btn,
      :host([variant='pane']) .add-mod .btn {
        min-height: 36px;
        font-size: 0.8125rem;
      }

      .col-empty {
        gap: 4px;
        padding: 8px 12px;
        margin: 2px 0 4px;
        border-radius: var(--mc-radius);
      }
      .col-empty p {
        font-size: 0.75rem;
      }

      /* drop indicator: 2px accent insertion line */
      .row,
      .mod {
        position: relative;
      }
      .drop-before::before,
      .drop-after::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        border-radius: 1px;
        background: var(--mc-accent);
        pointer-events: none;
        z-index: 1;
      }
      .drop-before::before {
        top: -1px;
      }
      .drop-after::after {
        bottom: -1px;
      }
      .col-empty.drop-into {
        border-color: var(--mc-accent);
        background: var(--mc-accent-tint);
      }
      .dragging {
        opacity: 0.5;
      }

      .foot {
        padding: 12px 0 4px;
      }
      .foot .btn {
        width: 100%;
      }
      .card-empty {
        margin-top: 8px;
      }

      .menu {
        position: fixed;
      }
      /* hidden on the dashboard: quieter name and an eye-off mark */
      .item[data-hidden] .name {
        color: var(--mc-text-2);
      }
      .item > ha-icon.hid-ico,
      .item > ha-icon.own-ico {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
      }
      /* no iOS callout on a long-press (it opens the item menu) */
      .item {
        -webkit-touch-callout: none;
      }
      /* tab name, renamed in place */
      input.rename {
        flex: 1;
        min-width: 0;
        height: 28px;
        box-sizing: border-box;
        padding: 0 8px;
        border: 1px solid var(--mc-accent);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text);
        font: inherit;
        font-size: var(--o-font);
      }
      /* a row module's column: its share of the row */
      .slot-glyph {
        display: inline-flex;
        color: var(--mc-text-2);
      }
      .slot-glyph .layout-glyph i {
        opacity: 0.3;
      }
      .slot-glyph .layout-glyph i.on {
        opacity: 1;
      }
      .slot-item > ha-icon {
        --mdc-icon-size: 16px;
      }
      .slot-item .name,
      :host([variant='layers']) .child > .line .name,
      :host([variant='layers']) .child > .line .sub {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /* Layers (240px): a tab / column shows its name and glyph; its modules are listed right under it */
      :host([variant='layers']) .slot-item .chip {
        display: none;
      }
      /* layout children nest deep: Layers (240px) indents them less */
      :host([variant='layers']) .mod > ul,
      :host([variant='layers']) .slot > ul {
        padding-left: 4px;
        margin-left: 12px;
      }

      /* Narrow pane (phone dialog): reclaim indentation so entity ids keep their width. */
      @container mc-outline (max-width: 419px) {
        .row > ul {
          padding-left: 0;
          margin-left: 26px;
          border-left: 0;
        }
        .col > ul {
          padding-left: 6px;
          margin-left: 6px;
        }
        :host([variant='pane']) .mod-item {
          padding: 6px 8px;
          gap: 8px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .item,
        .caret ha-icon,
        .mod-line > .more {
          transition: none;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-structure-outline': StructureOutline;
  }
}
