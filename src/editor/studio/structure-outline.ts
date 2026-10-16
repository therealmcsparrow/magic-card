import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, EditorState, RowConfig, RowModuleConfig, TabsModuleConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorSystem } from '../../css/editor-system';
import { readDesignClipboard } from '../../utils/design-clipboard';
import { MenuPopover } from '../components/menu-popover';
import { renderLayoutGlyph } from '../components/layout-glyph';
import { effectiveWidths, hasColumnWidths, widthWeights } from '../../utils/column-widths';
import {
  Selection,
  selectionFromKey,
  selectionFromPath,
  selectionKey,
  selectionToPath,
  moduleDisplayName,
  moduleLabel,
  ENTITY_RE,
  breakableId,
  moduleAt,
  moduleSelection,
  parentSelection,
  sameSelection,
  clampSelection,
  slotSelection,
  layoutModuleAt,
} from './selection';
import type { SlotSelection } from './selection';
import { ChildStep, childSlots, descendantAt, hasSlotNodes, slotLabel } from '../../utils/module-path';

type DragState =
  | { type: 'row'; row: number }
  | { type: 'module'; row: number; col: number; module: number };

/** Where a drop would land: before row `index`, or at module slot `index` in column `col`. */
type DropTarget =
  | { type: 'row'; index: number }
  | { type: 'module'; row: number; col: number; index: number };

interface OpenMenu {
  kind: 'row' | 'column' | 'module' | 'slot';
  row: number;
  col?: number;
  module?: number;
  child?: ChildStep[];
  /** kind 'slot': the tab / row-module column. */
  slot?: number;
  trigger: HTMLElement;
}

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
  @state() private _menu: OpenMenu | null = null;
  /** Module menu: its main list or the "Move to…" targets (second level in the same popover). */
  @state() private _menuView: 'main' | 'move' | 'confirm' = 'main';
  /** Key of the tab being renamed inline. */
  @state() private _renaming: string | null = null;
  @state() private _drop: DropTarget | null = null;

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _pendingFocus: string | null = null;
  private _drag: DragState | null = null;
  private _ignoreClickUntil = 0;
  private _lastSelKey = '';
  private _menuFocusFirst = false;
  private _menuPop = new MenuPopover(this, {
    menu: () => this.shadowRoot?.querySelector<HTMLElement>('.menu'),
    onClose: () => {
      this._menu = null;
      this._menuView = 'main';
    },
    align: 'end',
    fixedFallback: true,
  });

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
    this._closeMenu(false);
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
    if (this._menuFocusFirst) {
      this._menuFocusFirst = false;
      this._menuPop.position();
      this.shadowRoot?.querySelector<HTMLElement>('.menu [role="menuitem"]:not([disabled])')?.focus({ preventScroll: true });
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
    return Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>('[role="treeitem"]') || []);
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

  private _commitRename(sel: SlotSelection, value: string): void {
    if (this._renaming !== selectionKey(sel)) return;
    this._renaming = null;
    const label = value.trim(); // blank keeps the tab's label
    const tab = (this._state && layoutModuleAt(this._state.config, sel) as { tabs?: Array<{ label?: string }> } | undefined)?.tabs?.[sel.slot];
    if (tab && label && label !== (tab.label ?? '')) this.stateManager?.renameTab(sel.row, sel.col, sel.module, sel.child, sel.slot, label);
    this._pendingFocus = selectionKey(sel);
    this.requestUpdate();
  }

  private _onRenameKeydown(e: KeyboardEvent, sel: SlotSelection): void {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      this._commitRename(sel, (e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._renaming = null;
      this._pendingFocus = selectionKey(sel);
    }
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

  private _onItemClick(e: Event): void {
    if (Date.now() < this._ignoreClickUntil) return;
    const el = (e.currentTarget as HTMLElement);
    const key = el.dataset.key;
    if (key) this._select(selectionFromKey(key));
  }

  private _onKeydown(e: KeyboardEvent): void {
    const origin = e.composedPath()[0];
    if (isEditable(origin)) return;

    // An open menu handles its own keys (MenuPopover.onKeydown on the menu element).
    if (this._menu) return;

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
        } else if (sel.kind === 'slot') {
          handled();
          const trigger = item.closest('.line')?.querySelector<HTMLElement>(':scope > .more');
          // the only tab / column: the menu, whose Delete is disabled with the reason;
          // a tab / column holding modules asks first (the menu's confirm view), like the ⋮ menu
          if (this._slotTotal(sel) <= 1 && trigger) this._openSlotMenu(sel, trigger);
          else if (this._slotCount(sel) && trigger) this._openSlotMenu(sel, trigger, 'confirm');
          else if (this._slotTotal(sel) > 1) this._deleteSlot(sel);
        }
        return;
      case 'F2':
        if (sel.kind === 'slot' && this._state && layoutModuleAt(this._state.config, sel)?.type === 'tabs') {
          handled();
          this._renaming = key;
          this._focusKey = key;
        }
        return;
      case 'ContextMenu':
      case 'F10':
        if (e.key === 'ContextMenu' || e.shiftKey) {
          const trigger = item.parentElement?.querySelector<HTMLElement>(':scope > .more');
          if (trigger) {
            handled();
            if (sel.kind === 'module') this._openModuleMenu(sel, trigger);
            else if (sel.kind === 'slot') this._openSlotMenu(sel, trigger);
            else if (sel.kind === 'row' || sel.kind === 'column') this._openMenu(sel.kind, sel.row, sel.kind === 'column' ? sel.col : undefined, trigger);
          }
        }
        return;
      default:
        return;
    }
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

  private _openMenu(kind: 'row' | 'column', row: number, col: number | undefined, trigger: HTMLElement): void {
    if (this._menu && this._menu.trigger === trigger) {
      this._closeMenu(true);
      return;
    }
    this._menuPop.close(false);
    this._menuView = 'main';
    this._menu = { kind, row, col, trigger };
    this._menuPop.open(trigger);
  }

  private _openModuleMenu(sel: ModuleSel, trigger: HTMLElement): void {
    if (this._menu && this._menu.trigger === trigger) {
      this._closeMenu(true);
      return;
    }
    this._menuPop.close(false);
    this._menuView = 'main';
    const child = sel.child?.map((s) => ({ ...s }));
    this._menu = { kind: 'module', row: sel.row, col: sel.col, module: sel.module, child, trigger };
    this._menuPop.open(trigger);
  }

  private _openSlotMenu(sel: SlotSelection, trigger: HTMLElement, view: 'main' | 'confirm' = 'main'): void {
    if (this._menu && this._menu.trigger === trigger) {
      this._closeMenu(true);
      return;
    }
    this._menuPop.close(false);
    this._menuView = view;
    this._menu = { kind: 'slot', row: sel.row, col: sel.col, module: sel.module, child: sel.child?.map((s) => ({ ...s })), slot: sel.slot, trigger };
    this._menuPop.open(trigger);
  }

  /** Switch the open menu between its main list and a second level ("Move to…" targets, delete confirm). */
  private _setMenuView(view: 'main' | 'move' | 'confirm'): void {
    this._menuView = view;
    this._menuFocusFirst = true;
  }

  private _closeMenu(restoreFocus: boolean): void {
    if (this._menuPop.isOpen) this._menuPop.close(restoreFocus);
    else this._menu = null;
  }

  private _menuAction(fn: () => void): void {
    this._closeMenu(true);
    fn();
  }

  // ── drag and drop (ported from form-editor) ──

  private _onRowDragStart(e: DragEvent, row: number): void {
    this._closeMenu(false);
    this._drag = { type: 'row', row };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(this._drag));
    }
    (e.currentTarget as HTMLElement).closest('li')?.classList.add('dragging');
    e.stopPropagation();
  }

  private _onModuleDragStart(e: DragEvent, row: number, col: number, module: number): void {
    this._closeMenu(false);
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
    const cardName = this._state?.config.name?.trim() || 'Card';
    const card = this._itemAttrs('card', selKey, focusKey);

    return html`
      <div class="outline-root" @keydown=${this._onKeydown}>
        <ul
          class="tree"
          role="tree"
          aria-label="Card structure"
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
              >
                <ha-icon icon="mdi:card-outline"></ha-icon>
                <span class="text"><span class="name">${cardName}</span></span>
              </div>
            </div>
          </li>
          ${rows.map((row, ri) => this._renderRow(row, ri, selKey, focusKey))}
        </ul>
        ${rows.length
          ? html`
              <div class="foot">
                <button type="button" class="btn btn-secondary btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>Add row
                </button>
              </div>
            `
          : html`
              <div class="empty card-empty">
                <ha-icon icon="mdi:view-sequential-outline"></ha-icon>
                <strong>No rows yet</strong>
                <p>Rows hold columns, columns hold modules.</p>
                <button type="button" class="btn btn-text btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>Add row
                </button>
              </div>
            `}
        ${this._renderMenu()}
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
    const menuOpen = this._menu?.kind === 'row' && this._menu.row === ri;

    return html`
      <li
        role="none"
        class="row ${lineBefore ? 'drop-before' : ''} ${lineAfter ? 'drop-after' : ''}"
        @dragover=${(e: DragEvent) => this._onRowDragOver(e, ri)}
        @drop=${this._onRowDrop}
      >
        <div class="line">
          <button
            type="button"
            class="caret"
            tabindex="-1"
            aria-expanded=${open ? 'true' : 'false'}
            aria-label="${open ? 'Collapse' : 'Expand'} row ${ri + 1}"
            @click=${() => this._setCollapsed(ri, open)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <div
            class="item row-item k-row"
            role="treeitem"
            aria-level="2"
            data-key=${key}
            tabindex=${a.tab}
            aria-expanded=${open ? 'true' : 'false'}
            aria-selected=${a.current ? 'true' : 'false'}
            aria-current=${a.current ? 'true' : nothing}
            draggable="true"
            @dragstart=${(e: DragEvent) => this._onRowDragStart(e, ri)}
            @dragend=${this._onDragEnd}
            @click=${this._onItemClick}
          >
            ${this.variant === 'pane'
              ? html`${this._renderGlyph(row)}<span class="text"><span class="name">Row ${ri + 1} · ${hasColumnWidths(row) ? 'custom' : row.layout || '1'}</span></span>`
              : html`<span class="text"><span class="name">Row ${ri + 1}</span></span>${this._renderGlyph(row)}`}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label="Row ${ri + 1} actions"
            aria-haspopup="menu"
            aria-expanded=${menuOpen ? 'true' : 'false'}
            @click=${(e: Event) => this._openMenu('row', ri, undefined, e.currentTarget as HTMLElement)}
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
    const menuOpen = this._menu?.kind === 'column' && this._menu.row === ri && this._menu.col === ci;

    return html`
      <li role="none" class="col">
        <div class="line" @dragover=${(e: DragEvent) => this._onSlotDragOver(e, ri, ci, 0)} @drop=${this._dropModule}>
          <div
            class="item col-item k-column"
            role="treeitem"
            aria-level="3"
            data-key=${key}
            tabindex=${a.tab}
            aria-selected=${a.current ? 'true' : 'false'}
            aria-current=${a.current ? 'true' : nothing}
            @click=${this._onItemClick}
          >
            <span class="text"><span class="name">Column ${ci + 1}</span></span>
            <span class="chip is-count">${n}<span class="sr-only"> module${n === 1 ? '' : 's'}</span></span>
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label="Row ${ri + 1} column ${ci + 1} actions"
            aria-haspopup="menu"
            aria-expanded=${menuOpen ? 'true' : 'false'}
            @click=${(e: Event) => this._openMenu('column', ri, ci, e.currentTarget as HTMLElement)}
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
                data-empty=${key}
                @dragover=${(e: DragEvent) => this._onSlotDragOver(e, ri, ci, 0)}
                @drop=${this._dropModule}
              >
                <p>Empty column</p>
                <button
                  type="button"
                  class="btn btn-text btn-sm"
                  aria-label="Add module to Row ${ri + 1} Column ${ci + 1}"
                  @click=${() => this._addModule(ri, ci)}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>Add module
                </button>
              </div>
            `}
      </li>
    `;
  }

  /** Layers: a compact "Add module" row under a column's last module (opens the module picker). */
  private _renderAddRow(ri: number, ci: number): TemplateResult {
    return html`
      <li role="none" class="add-mod">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label="Add module to Row ${ri + 1} Column ${ci + 1}"
          @click=${() => this._addModule(ri, ci)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>Add module
        </button>
      </li>
    `;
  }

  /** A compact "Add column" row under a row's last column (adds an empty column and selects it). */
  private _renderAddColumn(ri: number): TemplateResult {
    return html`
      <li role="none" class="add-col">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label="Add column to Row ${ri + 1}"
          @click=${() => this._addColumn(ri)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>Add column
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
    const key = selectionKey({ kind: 'module', row: ri, col: ci, module: mi });
    const a = this._itemAttrs(key, selKey, focusKey);
    const icon = ModuleRegistry.get(mod.type)?.metadata.icon || 'mdi:puzzle-outline';
    // Mockup: "<Type> · <label>" with the entity id (mono) under it.
    const label = moduleLabel(mod);
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
        <div class="line mod-line">
          <div
            class="item mod-item k-module"
            role="treeitem"
            aria-level="4"
            data-key=${key}
            tabindex=${a.tab}
            aria-selected=${a.current ? 'true' : 'false'}
            aria-current=${a.current ? 'true' : nothing}
            draggable="true"
            @dragstart=${(e: DragEvent) => this._onModuleDragStart(e, ri, ci, mi)}
            @dragend=${this._onDragEnd}
            @click=${this._onItemClick}
          >
            <ha-icon icon=${icon}></ha-icon>
            <span class="text">
              <span class="name">${moduleDisplayName(mod)}${label ? ` · ${label}` : ''}</span>
              ${sub ? html`<span class="sub is-entity">${breakableId(sub)}</span>` : nothing}
            </span>
            ${overrides
              ? html`<span class="ovr-dot" title="Has local overrides"></span><span class="sr-only">Has local overrides</span>`
              : nothing}
          </div>
          ${this._renderModuleMore(mod, moduleSelection(ri, ci, mi) as ModuleSel, a.tab)}
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
        ${this._renderAddChild(owner, 0, this._moduleName(parent))}
      </ul>`;
    }
    const isTabs = parent.type === 'tabs';
    const weights = isTabs ? [] : widthWeights(effectiveWidths(parent as RowModuleConfig));
    return html`<ul role="group">
      ${slots.map((list, slot) => {
        const sel = slotSelection(ri, ci, mi, chain, slot);
        const key = selectionKey(sel);
        const a = this._itemAttrs(key, selKey, focusKey);
        const label = slotLabel(parent, slot)!;
        const icon = isTabs ? (parent as TabsModuleConfig).tabs?.[slot]?.icon || 'mdi:tab' : '';
        const n = list.length;
        const m = this._menu;
        const menuOpen = m?.kind === 'slot' && selectionKey(slotSelection(m.row, m.col ?? 0, m.module ?? 0, m.child, m.slot ?? 0)) === key;
        const renaming = this._renaming === key;
        return html`
          <li role="none" class="col slot">
            <div class="line mod-line">
              <div
                class="item col-item slot-item k-column"
                role="treeitem"
                aria-level=${level}
                data-key=${key}
                tabindex=${a.tab}
                aria-selected=${a.current ? 'true' : 'false'}
                aria-current=${a.current ? 'true' : nothing}
                @click=${this._onItemClick}
                @dblclick=${isTabs ? () => { this._renaming = key; } : nothing}
              >
                ${isTabs ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
                ${renaming
                  ? html`<input class="rename" aria-label="Tab name" .value=${(parent as TabsModuleConfig).tabs?.[slot]?.label ?? ''}
                      @keydown=${(e: KeyboardEvent) => this._onRenameKeydown(e, sel)}
                      @blur=${(e: Event) => this._commitRename(sel, (e.target as HTMLInputElement).value)} />`
                  : html`<span class="text"><span class="name">${label}</span></span>`}
                ${isTabs ? nothing : html`<span class="slot-glyph">${renderLayoutGlyph(weights, slot)}</span>`}
                <span class="chip is-count">${n}<span class="sr-only"> module${n === 1 ? '' : 's'}</span></span>
              </div>
              <button
                type="button"
                class="icon-btn sm more"
                tabindex=${a.tab}
                aria-label="${label} actions"
                aria-haspopup="menu"
                aria-expanded=${menuOpen ? 'true' : 'false'}
                @click=${(e: Event) => this._openSlotMenu(sel, e.currentTarget as HTMLElement)}
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            </div>
            <ul role="group">
              ${list.map((child, index) => this._renderChild(child, owner, slot, index, level + 1, selKey, focusKey))}
              ${this._renderAddChild(owner, slot, `${this._moduleName(parent)} ${label}`)}
            </ul>
          </li>
        `;
      })}
      <li role="none" class="add-col">
        <button type="button" class="btn btn-text btn-sm" aria-label="Add ${isTabs ? 'tab' : 'column'} to ${this._moduleName(parent)}"
          @click=${() => this._addSlot(owner, parent.type)}>
          <ha-icon icon="mdi:plus"></ha-icon>Add ${isTabs ? 'tab' : 'column'}
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
    const label = moduleLabel(child);
    const sub = typeof child.entity === 'string' && ENTITY_RE.test(child.entity) ? child.entity : undefined;
    return html`
      <li role="none" class="mod child">
        <div class="line mod-line">
          <div
            class="item mod-item k-module"
            role="treeitem"
            aria-level=${level}
            data-key=${key}
            title=${this.variant === 'layers' ? `${moduleDisplayName(child)}${label ? ` · ${label}` : ''}${sub ? ` · ${sub}` : ''}` : nothing}
            tabindex=${a.tab}
            aria-selected=${a.current ? 'true' : 'false'}
            aria-current=${a.current ? 'true' : nothing}
            @click=${this._onItemClick}
          >
            <ha-icon icon=${icon}></ha-icon>
            <span class="text">
              <span class="name">${moduleDisplayName(child)}${label ? ` · ${label}` : ''}</span>
              ${sub ? html`<span class="sub is-entity">${this.variant === 'layers' ? sub : breakableId(sub)}</span>` : nothing}
            </span>
          </div>
          ${this._renderModuleMore(child, sel, a.tab)}
        </div>
        ${this._renderChildren(child, owner.row, owner.col, owner.module, steps, level + 1, selKey, focusKey)}
      </li>
    `;
  }

  /** "Add module" under a layout's list (also when empty): opens the module picker for that slot. */
  private _renderAddChild(owner: ModuleSel, slot: number, where: string): TemplateResult {
    return html`
      <li role="none" class="add-mod">
        <button type="button" class="btn btn-text btn-sm" aria-label="Add module to ${where}" @click=${() => this._addChild(owner, slot)}>
          <ha-icon icon="mdi:plus"></ha-icon>Add module
        </button>
      </li>
    `;
  }

  /** "Text · Kitchen": a module's name as its outline item shows it. */
  private _moduleName(mod: CardModule): string {
    const label = moduleLabel(mod);
    return `${moduleDisplayName(mod)}${label ? ` · ${label}` : ''}`;
  }

  /** A module item's ⋮ (in the tab order only beside the roving tree item). */
  private _renderModuleMore(mod: CardModule, sel: ModuleSel, tab: number): TemplateResult {
    const m = this._menu;
    const open = m?.kind === 'module' && selectionKey(this._menuSelection(m)) === selectionKey(sel);
    return html`
      <button
        type="button"
        class="icon-btn sm more"
        tabindex=${tab}
        aria-label="Module options for ${this._moduleName(mod)}"
        aria-haspopup="menu"
        aria-expanded=${open ? 'true' : 'false'}
        @click=${(e: Event) => this._openModuleMenu(sel, e.currentTarget as HTMLElement)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `;
  }

  private _menuSelection(m: OpenMenu): ModuleSel {
    return moduleSelection(m.row, m.col ?? 0, m.module ?? 0, m.child) as ModuleSel;
  }

  /** Number of modules in the list holding `sel` (its column, or its slot of the layout module). */
  private _siblingCount(sel: ModuleSel): number {
    const top = this._rows[sel.row]?.columns[sel.col]?.modules;
    if (!sel.child?.length) return top?.length ?? 0;
    const parent = descendantAt(top?.[sel.module], sel.child.slice(0, -1));
    return childSlots(parent)?.[sel.child[sel.child.length - 1].slot]?.length ?? 0;
  }

  /** "Move to…" targets: the card's other columns, or for a layout child the other slots of its layout. */
  private _moveTargets(sel: ModuleSel): Array<{ label: string; run: () => void }> {
    const sm = this.stateManager;
    if (!sm) return [];
    const rows = this._rows;
    const child = sel.child;
    if (child?.length) {
      const parent = descendantAt(rows[sel.row]?.columns[sel.col]?.modules?.[sel.module], child.slice(0, -1));
      const slots = parent ? childSlots(parent) : undefined;
      const current = child[child.length - 1].slot;
      if (!parent || !slots) return [];
      return slots.flatMap((_, slot) => (slot === current ? [] : [{
        label: slotLabel(parent, slot) ?? `Slot ${slot + 1}`,
        run: () => sm.moveChildToSlot(sel.row, sel.col, sel.module, child, slot),
      }]));
    }
    return rows.flatMap((row, r) => row.columns.flatMap((_, c) => (r === sel.row && c === sel.col ? [] : [{
      label: `Row ${r + 1} · Column ${c + 1}`,
      run: () => sm.moveModuleToColumn(sel.row, sel.col, sel.module, r, c),
    }])));
  }

  private _renderMenu(): TemplateResult | typeof nothing {
    const m = this._menu;
    const sm = this.stateManager;
    if (!m || !sm) return nothing;
    const rows = this._rows;
    const row = rows[m.row];
    if (!row) return nothing;

    type ItemOpts = { disabled?: boolean; danger?: boolean; title?: string; keepOpen?: boolean };
    const item = (icon: string, label: string, fn: () => void, opts: ItemOpts = {}) => html`
      <button
        type="button"
        role="menuitem"
        class=${opts.danger ? 'danger' : ''}
        title=${opts.title ?? nothing}
        ?disabled=${opts.disabled}
        @click=${() => (opts.keepOpen ? fn() : this._menuAction(fn))}
      >
        <ha-icon icon=${icon}></ha-icon>${label}
      </button>
    `;

    const r = m.row;
    // copy / paste of the row's, column's or module's design (src/utils/design-clipboard.ts)
    const target = m.kind === 'row' ? { row: r }
      : m.kind === 'column' ? { row: r, col: m.col! }
      : { row: r, col: m.col!, module: m.module!, child: m.child, ...(m.kind === 'slot' ? { slot: m.slot } : {}) };
    const noClip = !readDesignClipboard();
    const pasteOpts = { disabled: noClip, title: noClip ? 'Copy a design first' : undefined };
    const design = html`
      <hr />
      ${item('mdi:content-copy', 'Copy design', () => sm.copyDesign(target))}
      ${item('mdi:content-paste', 'Paste design', () => sm.pasteDesign(target, 'replace'), pasteOpts)}
      ${item('mdi:set-merge', 'Merge pasted design', () => sm.pasteDesign(target, 'merge'), pasteOpts)}
    `;
    if (m.kind === 'slot') {
      const sel = slotSelection(r, m.col!, m.module!, m.child, m.slot!);
      const owner = this._state ? layoutModuleAt(this._state.config, sel) : undefined;
      const slots = childSlots(owner);
      if (!owner || !slots?.[sel.slot]) return nothing;
      const name = slotLabel(owner, sel.slot)!;
      const n = slots[sel.slot].length;
      const isTabs = owner.type === 'tabs';
      const ownerSel = parentSelection(sel) as ModuleSel;
      const del = () => this._deleteSlot(sel);
      const what = isTabs ? 'tab' : 'column';
      const only = slots.length <= 1;
      const deleteItem = item('mdi:delete-outline', `Delete ${what}`, n ? () => this._setMenuView('confirm') : del, {
        danger: true,
        keepOpen: !!n,
        disabled: only,
        title: only ? `${isTabs ? 'A tabs module' : 'A row'} needs one ${what}` : undefined,
      });
      const moveItems = html`
        ${item('mdi:arrow-up', 'Move up', () => this._moveSlot(sel, -1), { disabled: sel.slot <= 0 })}
        ${item('mdi:arrow-down', 'Move down', () => this._moveSlot(sel, 1), { disabled: sel.slot >= slots.length - 1 })}
      `;
      const body = this._menuView === 'confirm'
        ? html`
            <p class="menu-note">Delete ${isTabs ? 'tab' : 'column'} "${name}" and its ${n} module${n === 1 ? '' : 's'}?</p>
            ${item('mdi:arrow-left', 'Cancel', () => this._setMenuView('main'), { keepOpen: true })}
            ${item('mdi:delete-outline', `Delete ${isTabs ? 'tab' : 'column'}`, del, { danger: true })}
          `
        : isTabs
          ? html`
              ${item('mdi:plus', 'Add module', () => this._addChild(ownerSel, sel.slot))}
              ${item('mdi:pencil-outline', 'Rename', () => { this._select(sel); this._renaming = selectionKey(sel); })}
              <hr />
              ${moveItems}
              <hr />
              ${deleteItem}
            `
          : html`
              ${item('mdi:plus', 'Add module', () => this._addChild(ownerSel, sel.slot))}
              ${design}
              <hr />
              ${moveItems}
              <hr />
              ${deleteItem}
            `;
      return html`<div class="menu" role="menu" aria-label="${name} actions" @keydown=${this._menuPop.onKeydown}>${body}</div>`;
    }
    if (m.kind === 'module') {
      const sel = this._menuSelection(m);
      const mod = this._state ? moduleAt(this._state.config, sel) : undefined;
      if (!mod) return nothing;
      const targets = this._moveTargets(sel);
      const index = sel.child?.length ? sel.child[sel.child.length - 1].index : sel.module;
      const body = this._menuView === 'move'
        ? html`
            ${item('mdi:arrow-left', 'Back', () => this._setMenuView('main'), { keepOpen: true })}
            <hr />
            ${targets.map((t) => item('mdi:arrow-right', t.label, () => {
              t.run();
              this._focusSelection();
            }))}
          `
        : html`
            ${item('mdi:pencil-outline', 'Edit', () => {
              this._select(sel);
              this._fire('mc-edit-module', { path: selectionToPath(sel) });
            })}
            ${mod.type === 'tabs' || mod.type === 'row'
              ? item(mod.type === 'tabs' ? 'mdi:tab-plus' : 'mdi:table-column-plus-after', mod.type === 'tabs' ? 'Add tab' : 'Add column',
                () => this._addSlot(sel, mod.type))
              : hasSlotNodes(mod) || !childSlots(mod)
                ? nothing
                : item('mdi:plus', 'Add module', () => this._addChild(sel, 0))}
            <hr />
            ${item('mdi:arrow-up', 'Move up', () => this._moveModuleBy(sel, -1), { disabled: index <= 0 })}
            ${item('mdi:arrow-down', 'Move down', () => this._moveModuleBy(sel, 1), { disabled: index >= this._siblingCount(sel) - 1 })}
            ${item('mdi:folder-move-outline', 'Move to…', () => this._setMenuView('move'), {
              keepOpen: true,
              disabled: !targets.length,
              title: targets.length ? undefined : 'No other column to move to',
            })}
            ${item('mdi:content-duplicate', 'Duplicate', () => {
              sm.duplicateModule(sel.row, sel.col, sel.module, sel.child);
              this._focusSelection();
            })}
            ${design}
            <hr />
            ${item('mdi:delete-outline', 'Delete', () => this._deleteModule(sel), { danger: true })}
          `;
      const label = `Module options for ${this._moduleName(mod)}`;
      return html`<div class="menu" role="menu" aria-label=${label} @keydown=${this._menuPop.onKeydown}>${body}</div>`;
    }
    const body = m.kind === 'row'
      ? html`
          ${item('mdi:table-column-plus-after', 'Add column', () => sm.addColumn(r))}
          ${item('mdi:content-duplicate', 'Duplicate row', () => sm.duplicateRow(r))}
          ${design}
          <hr />
          ${item('mdi:arrow-up', 'Move up', () => this._moveRow(r, r - 1), { disabled: r === 0 })}
          ${item('mdi:arrow-down', 'Move down', () => this._moveRow(r, r + 1), { disabled: r >= rows.length - 1 })}
          <hr />
          ${item('mdi:delete-outline', 'Delete row', () => {
            sm.deleteRow(r);
            this._pendingFocus = r > 0 ? selectionKey({ kind: 'row', row: r - 1 }) : 'card';
          }, { danger: true })}
        `
      : html`
          ${item('mdi:plus', 'Add module', () => this._addModule(r, m.col!))}
          ${design}
          <hr />
          ${item('mdi:delete-outline', 'Delete column', () => sm.deleteColumn(r, m.col!), {
            danger: true,
            disabled: row.columns.length <= 1,
          })}
        `;

    const label = m.kind === 'row' ? `Row ${r + 1} actions` : `Row ${r + 1} column ${(m.col ?? 0) + 1} actions`;
    return html`<div class="menu" role="menu" aria-label=${label} @keydown=${this._menuPop.onKeydown}>${body}</div>`;
  }

  static styles = [
    editorSystem,
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
      .item:focus-visible {
        outline-offset: -2px;
      }
      /* Selected item: 12% wash + ink of its level (.k-card / .k-row / .k-column / .k-module). */
      .item[aria-current='true'] {
        background: var(--k-tint);
        color: var(--k-ink);
      }
      :host([variant='pane']) .item[aria-current='true'] {
        border-color: color-mix(in srgb, var(--k) 45%, transparent);
      }
      .item > ha-icon {
        --mdc-icon-size: var(--o-icon);
        color: var(--mc-text-2);
        flex: none;
      }
      .item[aria-current='true'] > ha-icon {
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
      .col-item[aria-current='true'] .name {
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
      .mod-line > .item[aria-current='true'] + .more,
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
        min-width: 200px;
      }
      .menu-note {
        margin: 4px 8px 8px;
        max-width: 240px;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
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
      .menu button {
        width: 100%;
        font-size: 0.875rem;
        color: var(--mc-text);
      }
      .menu button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        background: transparent;
      }
      .menu button.danger,
      .menu button.danger ha-icon {
        color: var(--mc-error-ink);
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
