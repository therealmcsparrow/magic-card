import { html, css, nothing, TemplateResult, ReactiveController, ReactiveControllerHost } from 'lit';
import type { CardModule, MagicCardConfig } from '../../types';
import type { DesignTarget, EditorStateManager } from '../state/editor-state';
import { DirectionController } from '../../ui-kit/controllers/direction';
import { MenuOpenAt, MenuPopover } from '../../ui-kit/controllers/menu-popover';
import { copyText } from '../components/copy-text';
import { ModuleRegistry } from '../../modules/module-registry';
import { readDesignClipboard } from '../../utils/design-clipboard';
import { cleanItem, readModuleClipboard } from '../state/module-clipboard';
import { toYaml } from '../../utils/yaml-utils';
import { orderedYamlConfig } from '../modes/yaml-editor';
import { TEMPLATE_ID_HINT, templateIdMissing } from '../state/flows';
import { countNotSynced } from '../state/template-sync';
import { childSlots } from '../../utils/module-path';
import { descendantAt, hasSlotNodes } from '../../utils/module-path-edit';
import { slotLabel } from '../slot-label';
import {
  ModuleSelection,
  Selection,
  SlotSelection,
  describeSelection,
  isHiddenItem,
  itemAt,
  layoutModuleAt,
  moduleAt,
  moduleDisplayName,
  moduleLabel,
  parentSelection,
  selectionKey,
  selectionToPath,
} from './selection';
import { t } from '../i18n';
import { applyPlacement } from '../layers/layer-actions';
import { placementOf } from '../layers/placement-model';
import { replaceTypes } from '../state/retype-module';
import { DropPlace, insideSource, moveModuleTo } from '../state/tree-move';
import { placeFor } from './tree-dnd';

/** The menu's list, or one of its second levels in the same popover. */
export type ItemMenuView = 'main' | 'move' | 'wrap' | 'reset' | 'delete' | 'placement' | 'add' | 'arrange' | 'design' | 'clipboard';

/** Layout modules "Wrap in layout" offers, in this order. */
export const WRAP_TYPES = ['vertical', 'horizontal', 'row', 'tabs', 'slider-layout'] as const;

/** Long-press: the finger stays this long within MOVE_PX to open the menu (iOS fires no contextmenu). */
export const LONG_PRESS_MS = 500;
const MOVE_PX = 8;

interface Entry {
  icon: string;
  label: string;
  run: () => void;
  disabled?: boolean;
  /** Why it is disabled (title + aria-description). */
  why?: string;
  danger?: boolean;
  /** Shortcut hint (right-aligned) and its aria-keyshortcuts. */
  kbd?: [string, string];
  /** Opens a second level instead of acting (the menu stays open). */
  view?: ItemMenuView;
  /** Goes back one level (Back, Cancel) instead of acting. */
  back?: boolean;
  /** The second level is a list of choices (aria-haspopup, a chevron); confirms are not. */
  sub?: boolean;
  /** Where focus goes after the action: back to the origin (default) or to the new selection. */
  focus?: 'selection' | 'none';
}

/** "Row 2 · Column 1": where a pasted or moved module goes. */
const rowColumn = (row: number, col: number): string => `${t('card-editor.item-menu.row-n', { n: row + 1 })} · ${t('card-editor.item-menu.column-n', { n: col + 1 })}`;

const KBD = {
  rename: ['F2', 'F2'],
  dup: ['Ctrl+D', 'Control+D'],
  up: ['Alt+↑', 'Alt+ArrowUp'],
  down: ['Alt+↓', 'Alt+ArrowDown'],
  del: ['Del', 'Delete'],
} as const satisfies Record<string, [string, string]>;

/** What the host does differently per surface (tree / canvas). */
export interface ItemMenuOptions {
  surface: 'tree' | 'canvas';
  /** After an action that made a new selection (add, duplicate, paste, wrap, move, delete): focus it. */
  focusSelection(): void;
  /** Rename: the tree's inline field (the canvas asks the Layers panel). */
  rename(sel: Selection): void;
  /** Copy / paste feedback: the studio's status capsule, or HA's toast in the pane. */
  status(message: string): void;
  /** Canvas only: "Add flow from here". */
  connect?(sel: ModuleSelection): void;
  /** Tree: delete / move with its own focus rules. */
  deleteModule?(sel: ModuleSelection): void;
  deleteRow?(row: number): void;
  moveRow?(from: number, to: number): void;
}

type Host = ReactiveControllerHost & HTMLElement & { stateManager?: EditorStateManager };

/** A module's name as menus and the tree show it: its layer name, else "Text · Kitchen". */
export function moduleTitle(mod: CardModule): string {
  const own = typeof mod.editor_name === 'string' && mod.editor_name.trim();
  if (own) return own;
  const label = moduleLabel(mod);
  const name = moduleDisplayName(mod);
  return label ? `${name} · ${label}` : name;
}

/**
 * One context menu per item kind (card, row, column, module, layout child, tab, row-module column),
 * the same for the tree's ⋮ button, right-click, long-press, Shift+F10 and the Menu key, in the
 * structure tree and on the studio canvas. The host renders `render()` in its shadow root and calls
 * `open()`; the menu acts on the item it was opened for.
 */
export class ItemMenu implements ReactiveController {
  sel: Selection | null = null;
  view: ItemMenuView = 'main';
  private readonly _pop: MenuPopover;
  private _focusFirst = false;
  /** The levels above the open one (a submenu goes back to where it was opened from) and the row that opened it. */
  private _trail: Array<{ view: ItemMenuView; opener: string }> = [];
  private _focusLabel: string | null = null;
  /** Copy YAML fallback: the text to copy by hand (a dialog), and where focus goes after it. */
  private _copy: { text: string; title: string } | null = null;
  private _origin: HTMLElement | null = null;

  constructor(private readonly host: Host, private readonly opts: ItemMenuOptions) {
    new DirectionController(host);
    this._pop = new MenuPopover(host, {
      menu: () => host.shadowRoot?.querySelector<HTMLElement>('.item-menu'),
      onClose: () => {
        this.sel = null;
        this.view = 'main';
        this._trail = [];
      },
      align: opts.surface === 'tree' ? 'end' : 'start',
      fixedFallback: true,
    });
    host.addController(this);
  }

  get isOpen(): boolean {
    return this._pop.isOpen && !!this.sel;
  }

  /** Selection key of the item whose menu is open (null when closed). */
  get openKey(): string | null {
    return this.isOpen && this.sel ? selectionKey(this.sel) : null;
  }

  get trigger(): HTMLElement | null {
    return this._pop.trigger;
  }

  /**
   * Open for `sel`. Without a point it sits at `trigger` (the ⋮ button toggles: the same trigger
   * closes it); with `at.point` it opens there (right-click, long-press).
   */
  open(sel: Selection, trigger: HTMLElement, at: MenuOpenAt = {}, view: ItemMenuView = 'main'): void {
    if (!at.point && this._pop.trigger === trigger && this.isOpen) {
      this.close(true);
      return;
    }
    this._pop.close(false);
    this.sel = sel;
    this.view = view;
    this._trail = [];
    this._origin = at.returnFocus ?? trigger;
    this._pop.openAt(trigger, at);
  }

  close(restoreFocus: boolean): void {
    if (this._pop.isOpen) this._pop.close(restoreFocus);
    else {
      this.sel = null;
      this.view = 'main';
      this._trail = [];
    }
  }

  /** Open a second level from the row labelled `opener`; focus lands on its first action. */
  setView(view: ItemMenuView, opener = ''): void {
    this._trail.push({ view: this.view, opener });
    this.view = view;
    this._focusFirst = true;
    this._focusLabel = null;
    this.host.requestUpdate();
  }

  /** One level back, focus on the row that opened the level. False when this level was the first one shown. */
  back(): boolean {
    const prev = this._trail.pop();
    if (!prev) {
      if (this.view === 'main') return false;
      this.view = 'main';
      this._focusFirst = true;
      this.host.requestUpdate();
      return true;
    }
    this.view = prev.view;
    this._focusFirst = true;
    this._focusLabel = prev.opener || null;
    this.host.requestUpdate();
    return true;
  }

  /** Escape, ArrowLeft and Backspace go back inside a submenu (Left/Right swap in RTL); ArrowRight opens a submenu row. */
  private _onKey = (e: KeyboardEvent): void => {
    const inSub = this._trail.length > 0;
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    const open = rtl ? 'ArrowLeft' : 'ArrowRight';
    const close = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (inSub && (e.key === 'Escape' || e.key === close || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      this.back();
      return;
    }
    if (e.key === open) {
      const active = (this.host.shadowRoot?.activeElement ?? null) as HTMLElement | null;
      if (active?.getAttribute('aria-haspopup') === 'menu' && !active.hasAttribute('disabled')) {
        e.preventDefault();
        e.stopPropagation();
        active.click();
        return;
      }
    }
    // Backspace is a tree shortcut for delete: never while a menu is open
    if (e.key === 'Backspace') {
      e.stopPropagation();
      return;
    }
    this._pop.onKeydown(e);
  };

  hostUpdated(): void {
    if (this._focusFirst) {
      this._focusFirst = false;
      this._pop.position();
      const items = Array.from(this.host.shadowRoot?.querySelectorAll<HTMLElement>('.item-menu [role="menuitem"]:not([disabled])') ?? []);
      const opener = this._focusLabel;
      this._focusLabel = null;
      const hit = opener ? items.find((b) => b.textContent?.trim() === opener) : undefined;
      // a submenu opens on its first action, not on Back (Enter, Enter would undo itself)
      const first = items[0]?.hasAttribute('data-back') ? items[1] ?? items[0] : items[0];
      (hit ?? first)?.focus({ preventScroll: true });
    }
    const dlg = this.host.shadowRoot?.querySelector<HTMLDialogElement>('dialog.copy-dlg');
    if (dlg && this._copy && !dlg.open) {
      try {
        dlg.showModal();
      } catch {
        dlg.setAttribute('open', '');
      }
      dlg.querySelector('textarea')?.select();
    }
  }

  hostDisconnected(): void {
    this._copy = null;
  }

  private get _sm(): EditorStateManager | undefined {
    return this.host.stateManager;
  }

  private _fire(name: string, detail?: unknown): void {
    this.host.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /** The item's name as the canvas tag and inspector show it ("Row 2", "Button", "Kitchen"). */
  private _name(config: MagicCardConfig, sel: Selection): string {
    if (sel.kind === 'module') {
      const mod = moduleAt(config, sel);
      return mod ? moduleTitle(mod) : t('card-editor.item-menu.module');
    }
    return sel.kind === 'card' ? config.name?.trim() || t('card-editor.item-menu.card') : describeSelection(config, sel).title;
  }

  // ── shortcuts shared by both surfaces ──

  /**
   * Keyboard shortcuts on an item: Shift+F10 / Menu key open its menu, F2 renames, Ctrl+D duplicates
   * (module, row), Delete removes (row, column; a tab / column holding modules asks first). True when
   * handled. `anchor`: where a keyboard-opened menu sits; `returnFocus`: where Escape goes back to.
   */
  shortcut(e: KeyboardEvent, sel: Selection, anchor: HTMLElement, at: MenuOpenAt = {}): boolean {
    const sm = this._sm;
    if (!sm) return false;
    const mod = (e.ctrlKey || e.metaKey) && !e.altKey;
    if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
      this.open(sel, anchor, at);
      return true;
    }
    if (e.key === 'F2' && !mod && !e.altKey) {
      this.opts.rename(sel);
      return true;
    }
    if (mod && e.key.toLowerCase() === 'd' && (sel.kind === 'module' || sel.kind === 'row')) {
      if (sel.kind === 'row') sm.duplicateRow(sel.row);
      else sm.duplicateModule(sel.row, sel.col, sel.module, sel.child);
      this.opts.focusSelection();
      return true;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !mod) {
      if (sel.kind === 'row') {
        this._deleteRow(sel.row);
        return true;
      }
      if (sel.kind === 'column') {
        // the only column: the menu, whose Delete is disabled with the reason
        if ((sm.getConfig().rows[sel.row]?.columns.length ?? 0) <= 1) this.open(sel, anchor, at);
        else {
          sm.deleteColumn(sel.row, sel.col);
          this.opts.focusSelection();
        }
        return true;
      }
      if (sel.kind === 'slot') {
        const slots = childSlots(layoutModuleAt(sm.getConfig(), sel));
        if (!slots?.[sel.slot]) return false;
        if (slots.length <= 1) this.open(sel, anchor, at);
        else if (slots[sel.slot].length) this.open(sel, anchor, at, 'delete');
        else this._deleteSlot(sel);
        return true;
      }
    }
    return false;
  }

  // ── actions ──

  private _deleteRow(row: number): void {
    if (this.opts.deleteRow) return this.opts.deleteRow(row);
    this._sm?.deleteRow(row);
    this.opts.focusSelection();
  }

  private _moveRow(from: number, to: number): void {
    if (this.opts.moveRow) return this.opts.moveRow(from, to);
    const sm = this._sm;
    if (!sm || to < 0 || to >= sm.getConfig().rows.length) return;
    sm.moveRow(from, to);
    sm.setSelectedPath({ rowIndex: to });
    this.opts.focusSelection();
  }

  private _deleteModule(sel: ModuleSelection): void {
    if (this.opts.deleteModule) return this.opts.deleteModule(sel);
    this._sm?.deleteModule(sel.row, sel.col, sel.module, sel.child);
    this.opts.focusSelection();
  }

  private _deleteSlot(sel: SlotSelection): void {
    const sm = this._sm;
    const owner = sm && layoutModuleAt(sm.getConfig(), sel);
    if (!sm || !owner) return;
    if (owner.type === 'tabs') sm.deleteTab(sel.row, sel.col, sel.module, sel.child?.map((s) => ({ ...s })), sel.slot);
    else sm.deleteNestedColumn(sel.row, sel.col, sel.module, sel.child?.map((s) => ({ ...s })), sel.slot);
    this.opts.focusSelection();
  }

  private _moveSlot(sel: SlotSelection, delta: -1 | 1): void {
    const sm = this._sm;
    const owner = sm && layoutModuleAt(sm.getConfig(), sel);
    if (!sm || !owner) return;
    const child = sel.child?.map((s) => ({ ...s }));
    if (owner.type === 'tabs') sm.moveTab(sel.row, sel.col, sel.module, child, sel.slot, delta);
    else sm.moveNestedColumn(sel.row, sel.col, sel.module, child, sel.slot, delta);
  }

  private _select(sel: Selection): void {
    this._sm?.setSelectedPath(selectionToPath(sel));
  }

  private _edit(sel: Selection): void {
    this._select(sel);
    this._fire('mc-edit-module', { path: selectionToPath(sel) });
  }

  private _addChild(owner: ModuleSelection, slot: number): void {
    this._fire('add-module', { rowIndex: owner.row, colIndex: owner.col, moduleIndex: owner.module, child: owner.child, slot });
  }

  private async _copyYaml(sel: Selection, name: string): Promise<void> {
    const config = this._sm?.getConfig();
    if (!config) return;
    const item = sel.kind === 'card' ? orderedYamlConfig(config) : cleanItem(itemAt(config, sel));
    // undefined keys (no name / template) are left out like the YAML editor does
    const text = toYaml(JSON.parse(JSON.stringify(item ?? {})));
    const label = t('card-editor.item-menu.name-yaml', { name });
    if (await copyText(text, this.host.shadowRoot ?? this.host)) {
      this.opts.status(t('card-editor.item-menu.name-yaml-copied', { name }));
      return;
    }
    this._copy = { text, title: label };
    this.host.requestUpdate();
  }

  private _closeCopy = (): void => {
    this._copy = null;
    this.host.requestUpdate();
    if (this._origin?.isConnected) this._origin.focus({ preventScroll: true });
  };

  private _paste(sel: Selection, where: string): void {
    const sm = this._sm;
    const clip = readModuleClipboard();
    if (!sm || !clip || !sm.pasteModule(sel)) return;
    this.opts.status(t('card-editor.item-menu.module-pasted-into-where', { module: moduleTitle(clip), where }));
  }

  private _run(e: Entry): void {
    if (e.back) {
      this.back();
      return;
    }
    if (e.view) {
      this.setView(e.view, e.label);
      return;
    }
    this._pop.close(e.focus === undefined);
    e.run();
    if (e.focus === 'selection') this.opts.focusSelection();
  }

  // ── model ──

  /**
   * "Move to…" targets: the card's other columns, or for a layout child the other slots of its layout;
   * then "Into {container}" for every other layout slot of the card (never the module's own subtree) and,
   * for a layout child, "Out to {parent}" (placed after the parent). The keyboard path of the tree drag.
   */
  private _moveTargets(config: MagicCardConfig, sel: ModuleSelection): Entry[] {
    const sm = this._sm!;
    const child = sel.child;
    const go = (label: string, run: () => void): Entry => ({ icon: 'mdi:arrow-right', label, run, focus: 'selection' });
    const near: Entry[] = [];
    if (child?.length) {
      const parent = descendantAt(config.rows[sel.row]?.columns[sel.col]?.modules?.[sel.module], child.slice(0, -1));
      const slots = parent ? childSlots(parent) : undefined;
      const current = child[child.length - 1].slot;
      if (!parent || !slots) return [];
      near.push(...slots.flatMap((_, slot) => (slot === current ? [] : [go(slotLabel(parent, slot) ?? t('card-editor.item-menu.slot-n', { n: slot + 1 }),
        () => sm.moveChildToSlot(sel.row, sel.col, sel.module, child, slot))])));
    } else {
      near.push(...config.rows.flatMap((row, r) => row.columns.flatMap((_, c) => (r === sel.row && c === sel.col ? [] : [go(
        rowColumn(r, c), () => sm.moveModuleToColumn(sel.row, sel.col, sel.module, r, c))]))));
    }
    const move = (place: DropPlace, where: string): void => {
      const r = moveModuleTo(sm.getConfig(), sel, place);
      if (!r) return;
      sm.updateConfig(r.config);
      sm.setSelectedPath(r.path);
      this.opts.status(t('card-editor.item-menu.moved-name-to-where', { name: moduleTitle(moduleAt(config, sel)!), where }));
    };
    const into: Entry[] = [];
    const ownerSteps = child?.slice(0, -1) ?? [];
    const sameSteps = (a: readonly { slot: number; index: number }[], b: readonly { slot: number; index: number }[]) =>
      a.length === b.length && a.every((x, i) => x.slot === b[i].slot && x.index === b[i].index);
    config.rows.forEach((row, r) => row.columns.forEach((col, c) => {
      const visit = (mod: CardModule, topIndex: number, steps: Array<{ slot: number; index: number }>, trail: string): void => {
        const slots = childSlots(mod);
        if (!slots) return;
        const label = `${trail} > ${moduleTitle(mod)}`;
        slots.forEach((list, slot) => {
          const place: DropPlace = { row: r, col: c, module: topIndex, ...(steps.length ? { child: steps.map((x) => ({ ...x })) } : {}), slot, index: list.length };
          const here = hasSlotNodes(mod) ? `${label} > ${slotLabel(mod, slot) ?? ''}` : label;
          const sameOwner = r === sel.row && c === sel.col && topIndex === sel.module && sameSteps(steps, ownerSteps);
          if (!sameOwner && !insideSource(sel, place)) into.push(go(t('card-editor.item-menu.into-container', { container: here }), () => move(place, here)));
          list.forEach((kid, index) => visit(kid, topIndex, [...steps, { slot, index }], here));
        });
      };
      (col.modules ?? []).forEach((mod, index) => visit(mod, index, [], rowColumn(r, c)));
    }));
    const out: Entry[] = [];
    if (child?.length) {
      const owner = { kind: 'module' as const, row: sel.row, col: sel.col, module: sel.module, ...(ownerSteps.length ? { child: ownerSteps } : {}) };
      const place = placeFor(config, owner, 'after');
      const ownerMod = moduleAt(config, owner);
      if (place && ownerMod) out.push(go(t('card-editor.item-menu.out-to-parent', { parent: moduleTitle(ownerMod) }), () => move(place, moduleTitle(ownerMod))));
    }
    return [...near, ...into, ...out];
  }

  /** The groups of the open menu (separators between them) and its accessible name. */
  private _model(config: MagicCardConfig, sel: Selection): { label: string; note?: string; groups: Entry[][] } | null {
    const sm = this._sm!;
    const linked = !!config.template;
    const name = this._name(config, sel);
    const back: Entry = { icon: 'mdi:arrow-left', label: t('card-editor.item-menu.back'), run: () => undefined, back: true };
    const cancel: Entry = { icon: 'mdi:arrow-left', label: t('card-editor.item-menu.cancel'), run: () => undefined, back: true };
    const submenu = (icon: string, label: string, view: ItemMenuView, disabled = false, why?: string): Entry => ({
      icon, label, run: () => undefined, view, sub: true, disabled, why,
    });
    const sub = (title: string, ...groups: Entry[][]) => ({ label: `${t('card-editor.item-menu.name-actions', { name })}, ${title}`, groups: [[back], ...groups] });
    const rename: Entry = { icon: 'mdi:rename-box', label: t('card-editor.item-menu.rename'), run: () => this.opts.rename(sel), kbd: KBD.rename, focus: 'none' };
    const yaml: Entry = { icon: 'mdi:code-braces', label: t('card-editor.item-menu.copy-yaml'), run: () => void this._copyYaml(sel, name) };
    const noDesign = !readDesignClipboard();
    const noModule = !readModuleClipboard();
    const designItems = (target: DesignTarget): Entry[] => {
      const why = noDesign ? t('card-editor.item-menu.copy-a-design-first') : undefined;
      return [
        { icon: 'mdi:content-copy', label: t('card-editor.item-menu.copy-design'), run: () => { sm.copyDesign(target); this.opts.status(t('card-editor.item-menu.name-design-copied', { name })); } },
        { icon: 'mdi:content-paste', label: t('card-editor.item-menu.paste-design'), run: () => sm.pasteDesign(target, 'replace'), disabled: noDesign, why },
        { icon: 'mdi:set-merge', label: t('card-editor.item-menu.merge-pasted-design'), run: () => sm.pasteDesign(target, 'merge'), disabled: noDesign, why },
      ];
    };
    const paste = (label: string, where: string): Entry => ({
      icon: 'mdi:content-paste', label, run: () => this._paste(sel, where), disabled: noModule, why: noModule ? t('card-editor.item-menu.copy-a-module-first') : undefined, focus: 'selection',
    });
    const item = itemAt(config, sel);
    const hidden = isHiddenItem(item);
    const hide = (tab = false): Entry => ({
      icon: hidden ? 'mdi:eye-outline' : 'mdi:eye-off-outline',
      label: tab ? (hidden ? t('card-editor.item-menu.show-tab-on-dashboard') : t('card-editor.item-menu.hide-tab-on-dashboard')) : hidden ? t('card-editor.item-menu.show-on-dashboard') : t('card-editor.item-menu.hide-on-dashboard'),
      run: () => sm.setHidden(sel, !hidden),
    });
    const overrides = sm.hasOverrides(sel);
    const reset = (label: string): Entry[] => (linked ? [{
      icon: 'mdi:backup-restore', label, run: () => undefined, view: 'reset', disabled: !overrides, why: overrides ? undefined : t('card-editor.item-menu.nothing-differs-from-the-template'),
    }] : []);
    const actionsLabel = t('card-editor.item-menu.name-actions', { name });
    const resetView = (note: string) => ({
      label: actionsLabel,
      note,
      groups: [[cancel, { icon: 'mdi:backup-restore', label: t('card-editor.item-menu.reset'), danger: true, focus: 'selection', run: () => {
        if (sel.kind === 'card') this._fire('template-resync');
        // a column owning its module list resets only after the editor fetched the template
        else if (sm.ownsModuleList(sel)) this._fire('mc-template-reapply', { resetColumn: sel });
        else if (sm.resetItem(sel)) this._fire('mc-template-reapply');
      } } as Entry]],
    });

    if (sel.kind === 'card') {
      if (this.view === 'reset') return resetView(t('card-editor.item-menu.reset-the-whole-card-to-the-template-all'));
      const changed = countNotSynced(config) > 0;
      return {
        label: actionsLabel,
        groups: [
          [
            { icon: 'mdi:card-outline', label: t('card-editor.item-menu.edit-card-settings'), run: () => this._edit(sel), focus: 'none' },
            { icon: 'mdi:plus', label: t('card-editor.item-menu.add-row'), run: () => this._fire('request-add-row'), focus: 'none' },
          ],
          [rename, yaml],
          linked ? [{ icon: 'mdi:backup-restore', label: t('card-editor.item-menu.reset-card-to-template'), run: () => undefined, view: 'reset', disabled: !changed, why: changed ? undefined : t('card-editor.item-menu.nothing-differs-from-the-template') }] : [],
        ],
      };
    }

    const row = config.rows[sel.row];
    if (!row) return null;

    if (sel.kind === 'row') {
      if (this.view === 'reset') return resetView(t('card-editor.item-menu.reset-name-to-the-template-your-changes', { name }));
      const r = sel.row;
      if (this.view === 'design') return sub(t('card-editor.item-menu.design'), designItems({ row: r }), [hide(), yaml], reset(t('card-editor.item-menu.reset-row-to-template')));
      return {
        label: actionsLabel,
        groups: [
          [
            { icon: 'mdi:table-column-plus-after', label: t('card-editor.item-menu.add-column'), run: () => { sm.addColumn(r); this._select({ kind: 'column', row: r, col: sm.getConfig().rows[r].columns.length - 1 }); }, focus: 'selection' },
            { icon: 'mdi:content-duplicate', label: t('card-editor.item-menu.duplicate-row'), run: () => sm.duplicateRow(r), kbd: KBD.dup, focus: 'selection' },
            rename,
            { icon: 'mdi:arrow-up', label: t('card-editor.item-menu.move-up'), run: () => this._moveRow(r, r - 1), disabled: r === 0, kbd: KBD.up, focus: 'none' },
            { icon: 'mdi:arrow-down', label: t('card-editor.item-menu.move-down'), run: () => this._moveRow(r, r + 1), disabled: r >= config.rows.length - 1, kbd: KBD.down, focus: 'none' },
          ],
          [submenu('mdi:palette-outline', t('card-editor.item-menu.design'), 'design')],
          [{ icon: 'mdi:delete-outline', label: t('card-editor.item-menu.delete-row'), run: () => this._deleteRow(r), danger: true, kbd: KBD.del, focus: 'none' }],
        ],
      };
    }

    if (sel.kind === 'column') {
      if (this.view === 'reset') return resetView(t('card-editor.item-menu.reset-name-to-the-template-your-changes', { name }));
      const only = row.columns.length <= 1;
      const colLabel = t('card-editor.item-menu.row-row-column-column-actions', { row: sel.row + 1, column: sel.col + 1 });
      if (this.view === 'design') {
        return { label: `${colLabel}, ${t('card-editor.item-menu.design')}`, groups: [[back], designItems({ row: sel.row, col: sel.col }), [hide(), yaml], reset(t('card-editor.item-menu.reset-column-to-template'))] };
      }
      return {
        label: colLabel,
        groups: [
          [
            { icon: 'mdi:plus', label: t('card-editor.item-menu.add-module'), run: () => this._fire('add-module', { rowIndex: sel.row, colIndex: sel.col }), focus: 'none' },
            paste(t('card-editor.item-menu.paste-module'), rowColumn(sel.row, sel.col)),
            rename,
          ],
          [submenu('mdi:palette-outline', t('card-editor.item-menu.design'), 'design')],
          [{
            icon: 'mdi:delete-outline', label: t('card-editor.item-menu.delete-column'), danger: true, kbd: KBD.del, focus: 'selection',
            run: () => sm.deleteColumn(sel.row, sel.col), disabled: only, why: only ? t('card-editor.item-menu.a-row-needs-one-column') : undefined,
          }],
        ],
      };
    }

    if (sel.kind === 'slot') {
      const owner = layoutModuleAt(config, sel);
      const slots = childSlots(owner);
      if (!owner || !slots?.[sel.slot]) return null;
      const isTabs = owner.type === 'tabs';
      const n = slots[sel.slot].length;
      const only = slots.length <= 1;
      const ownerSel = parentSelection(sel) as ModuleSelection;
      const del = (): void => this._deleteSlot(sel);
      if (this.view === 'delete') {
        return {
          label: actionsLabel,
          note: isTabs
            ? t('card-editor.item-menu.delete-tab-name-and-its-n', { name, n })
            : t('card-editor.item-menu.delete-column-name-and-its-n', { name, n }),
          groups: [[cancel, { icon: 'mdi:delete-outline', label: isTabs ? t('card-editor.item-menu.delete-tab') : t('card-editor.item-menu.delete-column'), run: del, danger: true, focus: 'none' }]],
        };
      }
      const target = { row: sel.row, col: sel.col, module: sel.module, child: sel.child, slot: sel.slot };
      if (this.view === 'design') return sub(t('card-editor.item-menu.design'), ...(isTabs ? [] : [designItems(target)]), [hide(isTabs), yaml]);
      return {
        label: actionsLabel,
        groups: [
          [
            { icon: 'mdi:plus', label: t('card-editor.item-menu.add-module'), run: () => this._addChild(ownerSel, sel.slot), focus: 'none' },
            paste(t('card-editor.item-menu.paste-module'), `${moduleTitle(owner)} · ${name}`),
            rename,
            { icon: 'mdi:arrow-up', label: t('card-editor.item-menu.move-up'), run: () => this._moveSlot(sel, -1), disabled: sel.slot <= 0, kbd: KBD.up, focus: 'selection' },
            { icon: 'mdi:arrow-down', label: t('card-editor.item-menu.move-down'), run: () => this._moveSlot(sel, 1), disabled: sel.slot >= slots.length - 1, kbd: KBD.down, focus: 'selection' },
          ],
          [submenu('mdi:palette-outline', t('card-editor.item-menu.design'), 'design')],
          [{
            icon: 'mdi:delete-outline', label: isTabs ? t('card-editor.item-menu.delete-tab') : t('card-editor.item-menu.delete-column'), danger: true, kbd: KBD.del,
            run: del, view: n && !only ? 'delete' : undefined, focus: 'none',
            disabled: only, why: only ? (isTabs ? t('card-editor.item-menu.a-tabs-module-needs-one-tab') : t('card-editor.item-menu.a-row-needs-one-column')) : undefined,
          }],
        ],
      };
    }

    // module or layout child
    const mod = moduleAt(config, sel);
    if (!mod) return null;
    const nested = !!sel.child?.length;
    const top = config.rows[sel.row]?.columns[sel.col]?.modules?.[sel.module];
    if (this.view === 'reset') {
      return resetView(nested && top
        ? t('card-editor.item-menu.reset-name-to-the-template-changes-to', { name: moduleTitle(top) })
        : t('card-editor.item-menu.reset-name-to-the-template-your-changes', { name }));
    }
    const targets = this._moveTargets(config, sel);
    // layer placement (layer-placement 1.0.0): the choices that apply to this module right now
    const at = placementOf(mod);
    const place: Entry[] = [
      ...(at !== 'background' ? [{ icon: 'mdi:arrange-send-to-back', label: t('card-editor.item-menu.put-behind-others'), run: () => void applyPlacement(sm, sel, 'background'), focus: 'selection' as const }] : []),
      ...(at !== 'overlay' ? [{ icon: 'mdi:arrange-bring-to-front', label: t('card-editor.item-menu.put-on-top'), run: () => void applyPlacement(sm, sel, 'overlay'), focus: 'selection' as const }] : []),
      ...(at !== 'flow' ? [{ icon: 'mdi:view-sequential-outline', label: t('card-editor.item-menu.back-to-normal'), run: () => void applyPlacement(sm, sel, 'flow'), focus: 'selection' as const }] : []),
    ];
    if (this.view === 'placement') return { label: actionsLabel, groups: [[cancel], place] };
    if (this.view === 'move') return sub(t('card-editor.item-menu.move-to'), targets);
    if (this.view === 'wrap') {
      return sub(t('card-editor.item-menu.wrap-in-layout'), WRAP_TYPES.map((type) => {
        const meta = ModuleRegistry.get(type)?.metadata;
        return { icon: meta?.icon || 'mdi:view-grid-outline', label: moduleDisplayName({ type } as CardModule), run: () => sm.wrapInLayout(sel, type), focus: 'selection' } as Entry;
      }));
    }
    const index = nested ? sel.child![sel.child!.length - 1].index : sel.module;
    const list = nested
      ? childSlots(descendantAt(top, sel.child!.slice(0, -1)))?.[sel.child![sel.child!.length - 1].slot]
      : row.columns[sel.col]?.modules;
    const count = list?.length ?? 0;
    const add: Entry[] = mod.type === 'tabs' || mod.type === 'row'
      ? [{
          icon: mod.type === 'tabs' ? 'mdi:tab-plus' : 'mdi:table-column-plus-after', label: mod.type === 'tabs' ? t('card-editor.item-menu.add-tab') : t('card-editor.item-menu.add-column'), focus: 'selection',
          run: () => (mod.type === 'tabs' ? sm.addTab(sel.row, sel.col, sel.module, sel.child?.map((s) => ({ ...s }))) : sm.addNestedColumn(sel.row, sel.col, sel.module, sel.child?.map((s) => ({ ...s })))),
        }]
      : hasSlotNodes(mod) || !childSlots(mod) ? [] : [{ icon: 'mdi:plus', label: t('card-editor.item-menu.add-module'), run: () => this._addChild(sel, 0), focus: 'none' }];
    const locked = templateIdMissing(config, sel);
    const connect: Entry[] = this.opts.surface === 'canvas' && this.opts.connect ? [{
      icon: 'mdi:transit-connection-variant', label: t('card-editor.item-menu.add-flow-from-here'), run: () => this.opts.connect!(sel), focus: 'none',
      disabled: locked, why: locked ? t(TEMPLATE_ID_HINT) : undefined,
    }] : [];
    const swap = replaceTypes(mod).length > 0;
    const replace: Entry = {
      icon: 'mdi:swap-horizontal', label: t('card-editor.item-menu.replace-with'), focus: 'none',
      run: () => this._fire('replace-module', { sel, status: this.opts.status, focus: () => this.opts.focusSelection() }),
      disabled: locked || !swap, why: locked ? t(TEMPLATE_ID_HINT) : swap ? undefined : t('card-editor.item-menu.no-other-module-type-to-replace-with'),
    };
    const where = nested ? describeSelection(config, parentSelection(sel, config)).title : rowColumn(sel.row, sel.col);
    const adds = [...add, ...connect];
    if (this.view === 'add') return sub(t('card-editor.item-menu.add'), adds);
    if (this.view === 'arrange') {
      return sub(t('card-editor.item-menu.arrange'),
        [
          { icon: 'mdi:folder-move-outline', label: t('card-editor.item-menu.move-to'), run: () => undefined, view: 'move', sub: true, disabled: !targets.length, why: targets.length ? undefined : t('card-editor.item-menu.no-other-column-to-move-to') },
          { icon: 'mdi:group', label: t('card-editor.item-menu.wrap-in-layout'), run: () => undefined, view: 'wrap', sub: true },
        ],
        place);
    }
    if (this.view === 'design') {
      return sub(t('card-editor.item-menu.design'),
        designItems({ row: sel.row, col: sel.col, module: sel.module, child: sel.child }),
        [hide(), ...reset(nested ? t('card-editor.item-menu.reset-layout-to-template') : t('card-editor.item-menu.reset-to-template'))]);
    }
    if (this.view === 'clipboard') {
      return sub(t('card-editor.item-menu.copy-and-paste'), [
        { icon: 'mdi:content-copy', label: t('card-editor.item-menu.copy-module'), run: () => { if (sm.copyModule(sel)) this.opts.status(t('card-editor.item-menu.name-copied', { name })); } },
        paste(t('card-editor.item-menu.paste-module-after'), where),
        yaml,
      ]);
    }
    return {
      label: actionsLabel,
      groups: [
        [
          { icon: 'mdi:pencil-outline', label: t('card-editor.item-menu.edit'), run: () => this._edit(sel), focus: 'none' },
          rename,
          { icon: 'mdi:content-duplicate', label: t('card-editor.item-menu.duplicate'), run: () => sm.duplicateModule(sel.row, sel.col, sel.module, sel.child), kbd: KBD.dup, focus: 'selection' },
          replace,
          { icon: 'mdi:arrow-up', label: t('card-editor.item-menu.move-up'), run: () => sm.moveModuleBy(sel.row, sel.col, sel.module, -1, sel.child), disabled: index <= 0, kbd: KBD.up, focus: 'selection' },
          { icon: 'mdi:arrow-down', label: t('card-editor.item-menu.move-down'), run: () => sm.moveModuleBy(sel.row, sel.col, sel.module, 1, sel.child), disabled: index >= count - 1, kbd: KBD.down, focus: 'selection' },
        ],
        [
          ...(adds.length ? [submenu('mdi:plus', t('card-editor.item-menu.add'), 'add')] : []),
          submenu('mdi:arrange-bring-forward', t('card-editor.item-menu.arrange'), 'arrange'),
          submenu('mdi:palette-outline', t('card-editor.item-menu.design'), 'design'),
          submenu('mdi:content-copy', t('card-editor.item-menu.copy-and-paste'), 'clipboard'),
        ],
        [{ icon: 'mdi:delete-outline', label: t('card-editor.item-menu.delete'), run: () => this._deleteModule(sel), danger: true, kbd: KBD.del, focus: 'none' }],
      ],
    };
  }

  // ── render ──

  private _renderEntry(e: Entry): TemplateResult {
    return html`<button
      type="button"
      role="menuitem"
      class=${e.danger ? 'danger' : ''}
      title=${e.why ?? nothing}
      aria-description=${e.why ?? nothing}
      aria-haspopup=${e.sub ? 'menu' : nothing}
      aria-keyshortcuts=${e.kbd?.[1] ?? nothing}
      data-kbd=${e.kbd?.[0] ?? nothing}
      data-arrow=${e.icon.startsWith('mdi:arrow-') ? '' : nothing}
      data-back=${e.back && e.label === t('card-editor.item-menu.back') ? '' : nothing}
      ?disabled=${e.disabled}
      @click=${() => this._run(e)}
    ><ha-icon icon=${e.icon}></ha-icon>${e.label}</button>`;
  }

  /** The open menu (top layer) and the Copy YAML fallback dialog; nothing while both are closed. */
  render(): TemplateResult | typeof nothing {
    const sm = this._sm;
    const sel = this.sel;
    const model = this.isOpen && sel && sm ? this._model(sm.getConfig(), sel) : null;
    const groups = model?.groups.filter((g) => g.length) ?? [];
    const menu = model
      ? html`<div class="menu item-menu" role="menu" aria-label=${model.label} aria-describedby=${model.note ? 'menu-note' : nothing} @keydown=${this._onKey}>
          ${model.note ? html`<p class="menu-note" id="menu-note">${model.note}</p>` : nothing}
          ${groups.map((g, i) => html`${i ? html`<hr />` : nothing}${g.map((e) => this._renderEntry(e))}`)}
        </div>`
      : nothing;
    const c = this._copy;
    const dialog = c
      ? html`<dialog class="copy-dlg" aria-labelledby="copy-dlg-title" aria-describedby="copy-dlg-hint"
          @close=${this._closeCopy}
          @keydown=${(e: KeyboardEvent) => { if (e.key === 'Escape') e.stopPropagation(); }}>
          <h2 id="copy-dlg-title">${t('card-editor.item-menu.copy-this-yaml')}</h2>
          <p id="copy-dlg-hint">${t('card-editor.item-menu.title-press-ctrl-c-c-on-a-mac-to-copy', { title: c.title })}</p>
          <textarea readonly rows="12" aria-labelledby="copy-dlg-title" .value=${c.text}></textarea>
          <div class="actions">
            <button type="button" class="btn btn-secondary" @click=${(e: Event) => (e.currentTarget as HTMLElement).closest('dialog')?.close()}>${t('card-editor.item-menu.close')}</button>
          </div>
        </dialog>`
      : nothing;
    return html`${menu}${dialog}`;
  }
}

/**
 * Touch long-press for the context menu: 500 ms with the finger within 8 px. iOS / iPadOS Safari fire
 * no contextmenu event, Android does (then the timer is dropped). A drag (tree rows are draggable),
 * lifting the finger or a cancel drops it too. After it fired, the click that follows is swallowed.
 */
export class LongPress {
  private _timer = 0;
  private _x = 0;
  private _y = 0;
  private _firedAt = -Infinity;

  constructor(private readonly onFire: (path: EventTarget[], x: number, y: number) => void) {}

  down = (e: PointerEvent): void => {
    this.cancel();
    if (e.pointerType !== 'touch') return;
    const path = e.composedPath();
    this._x = e.clientX;
    this._y = e.clientY;
    this._timer = window.setTimeout(() => {
      this._timer = 0;
      this._firedAt = Date.now();
      this.onFire(path, this._x, this._y);
    }, LONG_PRESS_MS);
  };

  move = (e: PointerEvent): void => {
    if (this._timer && Math.hypot(e.clientX - this._x, e.clientY - this._y) > MOVE_PX) this.cancel();
  };

  cancel = (): void => {
    if (this._timer) clearTimeout(this._timer);
    this._timer = 0;
  };

  /** A long-press just opened the menu: the click (or Android's own contextmenu) after it is not an action. */
  get justFired(): boolean {
    return Date.now() - this._firedAt < 800;
  }
}

/** Menu additions for the context menus (shortcut hints, focus ring, submenu chevron, fallback dialog). */
export const itemMenuStyles = css`
  .item-menu {
    min-width: 240px;
    max-width: min(320px, calc(100vw - 16px));
  }
  .item-menu button {
    width: 100%;
    font-size: 0.875rem;
    color: var(--mc-text);
    white-space: nowrap;
  }
  .item-menu button[data-kbd]::after,
  .item-menu button[aria-haspopup]::after {
    margin-inline-start: auto;
    padding-inline-start: 16px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .item-menu button[data-kbd]::after {
    content: attr(data-kbd);
    font-family: var(--mc-mono);
  }
  .item-menu button[aria-haspopup]::after {
    content: '›';
    font-size: 1rem;
  }
  :host([dir='rtl']) .item-menu button[aria-haspopup]::after {
    content: '‹';
  }
  :host([dir='rtl']) .item-menu button[data-arrow] ha-icon {
    transform: scaleX(-1);
  }
  .item-menu .menu-note {
    margin: 4px 8px 8px;
    max-width: 260px;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
    white-space: normal;
  }
  /* a long module menu fits a 768 px laptop with a mouse */
  @media (pointer: fine) {
    .item-menu button {
      min-height: 36px;
    }
  }
  dialog.copy-dlg {
    width: min(520px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
  }
  dialog.copy-dlg::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }
  dialog.copy-dlg h2 {
    margin: 0 0 4px;
    font-size: 1rem;
    font-weight: 500;
  }
  dialog.copy-dlg p {
    margin: 0 0 12px;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  dialog.copy-dlg textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
    color: var(--mc-text);
    background: var(--mc-surface-2);
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius);
    padding: 8px;
    resize: vertical;
  }
  dialog.copy-dlg .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
`;
