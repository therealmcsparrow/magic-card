import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EditorState, HomeAssistant, MagicCardConfig, RowModuleConfig } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import type { MagicCard } from '../../card/magic-card';
import { CARD_TAG } from '../../utils/constants';
import { editorSystem } from '../../css/editor-system';
import { placeFloatBar } from './float-bar';
import {
  ModuleSelection,
  Selection,
  describeSelection,
  modulePathAttr,
  moduleAt,
  parentSelection,
  sameSelection,
  selectionFromPath,
  selectionFromPathAttr,
  slotSelection,
  selectionToPath,
} from './selection';
import { childSlots } from '../../utils/module-path';
import { TEMPLATE_ID_HINT, templateIdMissing } from '../state/flows';
import { GridRowLike, columnWidthsTemplate, effectiveWidths, widthWeights } from '../../utils/column-widths';
import { equalizePair, resizePair, stepPair } from './column-resize';
import { withTemplateAnimations } from '../../services/template-merge';

/** A card row or a row module whose column gutters get resize handles. */
interface ResizeTarget {
  /** The card row index, or the row module's path. */
  id: string;
  grid: GridRowLike;
  count: number;
  /** Selector of the row element (none: the columns' parent, a row module's grid). */
  rowQ?: string;
  colQ(c: number): string;
  write(widths: string[], coalesce?: boolean): void;
}

/** A gutter drag in progress (studio canvas column resize). */
interface ColumnDrag {
  row: ResizeTarget;
  /** Gutter after column `i`. */
  i: number;
  pointerId: number;
  startX: number;
  /** Screen px per card px (the studio dialog's opening transform). */
  scale: number;
  widths: string[];
  /** Column widths in card px at drag start. */
  px: number[];
  rowEl: HTMLElement;
  /** The row's inline grid template before the drag (restored on cancel). */
  template: string;
  /** The config at drag start: a different one (undo, YAML, another edit) cancels the drag. */
  config: MagicCardConfig | undefined;
  next?: string[];
}

/** Key presses on the same gutter this close together (or held down) are one undo step. */
const KEY_COALESCE_MS = 500;

export type StudioDevice = 'phone' | 'tablet' | 'desktop';

export const DEVICES: Record<StudioDevice, { label: string; width: number; icon: string }> = {
  phone: { label: 'Phone', width: 360, icon: 'mdi:cellphone' },
  tablet: { label: 'Tablet', width: 560, icon: 'mdi:tablet' },
  desktop: { label: 'Desktop', width: 760, icon: 'mdi:monitor' },
};

/** Events the canvas swallows before they reach the live card (module previews may call services). */
const BLOCKED = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'dblclick', 'contextmenu', 'keyup'];
/** Event types whose default must survive (scrolling, the tap's click, pointer capture). */
const KEEP_DEFAULT = new Set(['pointerdown', 'pointerup', 'touchstart', 'touchend']);
/** Events HA cards use to ask the frontend to act (toggle, more-info). */
const HA_ACTION_EVENTS = ['hass-action', 'hass-more-info'];
/** Read-only websocket types allowed by name, besides the get / list / subscribe patterns. */
const WS_READ_ONLY = new Set([
  'render_template',
  'auth/sign_path',
  'camera_thumbnail',
  'weather/subscribe_forecast',
  'magic_card_utils/get_templates',
  'media_source/resolve_media',
  'media_source/browse_media',
]);
/** recorder/* commands that write; everything else under recorder/ only reads statistics. */
const RECORDER_WRITES = /^recorder\/(clear|import|update|change|adjust|backup|async_)/;

/**
 * The event happened in the card's "Preview pop-up" dialog (top layer, over the studio): it belongs
 * to the pop-up (close button, backdrop, swipe, Escape), not to canvas selection.
 */
function inPopupPreview(e: Event): boolean {
  return e.composedPath().some((t) => t instanceof HTMLElement && t.hasAttribute('data-mc-popup'));
}

/** Whether a websocket message type is read-only and may reach Home Assistant from the live preview. */
export function isReadOnlyWsType(type: unknown): boolean {
  if (typeof type !== 'string' || !type) return false;
  if (WS_READ_ONLY.has(type)) return true;
  const last = type.slice(type.lastIndexOf('/') + 1);
  if (type.startsWith('get') || last.startsWith('get') || last === 'list') return true;
  if (type.startsWith('subscribe') || last.startsWith('subscribe')) return true;
  if (type.startsWith('history/')) return true;
  if (type.startsWith('recorder/')) return !RECORDER_WRITES.test(type);
  return false;
}

const msgType = (msg: unknown): unknown => (msg && typeof msg === 'object' ? (msg as { type?: unknown }).type : undefined);

/** Connection proxy: sendMessage / sendMessagePromise / subscribeMessage only carry read-only types; event subscriptions pass through. */
function inertConnection<T extends object>(connection: T): T {
  return new Proxy(connection, {
    get(target, prop) {
      const value = Reflect.get(target, prop, target) as unknown;
      if (typeof value !== 'function') return value;
      if (prop === 'sendMessagePromise') {
        return (msg: unknown, ...rest: unknown[]) =>
          (isReadOnlyWsType(msgType(msg)) ? value.call(target, msg, ...rest) : Promise.resolve(undefined));
      }
      if (prop === 'subscribeMessage') {
        // a subscription is a message too (execute_script, call_service with return_response, ...)
        return (callback: unknown, msg: unknown, ...rest: unknown[]) =>
          (isReadOnlyWsType(msgType(msg)) ? value.call(target, callback, msg, ...rest) : Promise.resolve(() => undefined));
      }
      if (prop === 'sendMessage') {
        return (msg: unknown, ...rest: unknown[]) => {
          if (isReadOnlyWsType(msgType(msg))) value.call(target, msg, ...rest);
        };
      }
      return value.bind(target);
    },
  });
}

/**
 * hass for the live preview: service calls and every websocket message that is not on the read-only
 * allowlist resolve to undefined without reaching Home Assistant, so modules and embedded cards stay
 * inert whatever the input method (touch, native select `change`, raw connection, ...).
 */
export function inertHass(hass: HomeAssistant): HomeAssistant {
  const callWS = hass.callWS?.bind(hass);
  const connection = (hass as { connection?: object }).connection;
  return {
    ...hass,
    ...(connection ? { connection: inertConnection(connection) } : {}),
    callService: async () => undefined,
    callApi: async () => undefined,
    callWS: async (msg: { type: string }) => (isReadOnlyWsType(msg?.type) && callWS ? callWS(msg) : undefined),
  } as unknown as HomeAssistant;
}

function isTyping(e: Event): boolean {
  const t = e.composedPath()[0] as HTMLElement | undefined;
  if (!t || !(t instanceof HTMLElement)) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
}

/** Element target of a selection inside the card's shadow root (or the card itself). */
function selector(sel: Selection): string | null {
  switch (sel.kind) {
    case 'card': return null;
    case 'row': return `[data-mc-row="${sel.row}"]`;
    case 'column': return `[data-mc-col="${sel.row}.${sel.col}"]`;
    case 'module': return `[data-mc-path="${modulePathAttr(sel)}"]`;
    case 'slot': return `[data-mc-slot="${modulePathAttr(parentSelection(sel) as ModuleSelection)}#${sel.slot}"]`;
  }
}

/** Selection carried by one element's editor attributes, if any. */
function selectionOf(el: HTMLElement): Selection | null {
  const d = el.dataset;
  if (d.mcPath) return selectionFromPathAttr(d.mcPath);
  if (d.mcSlot) {
    const [owner, slot] = d.mcSlot.split('#');
    const m = selectionFromPathAttr(owner);
    return m ? slotSelection(m.row, m.col, m.module, m.child, Number(slot)) : null;
  }
  if (d.mcCol) {
    const [row, col] = d.mcCol.split('.').map(Number);
    return { kind: 'column', row, col };
  }
  if (d.mcRow) return { kind: 'row', row: Number(d.mcRow) };
  return null;
}

/** First element on an event path that carries an editor path, with its selection. */
function targetFromEvent(path: EventTarget[]): { el: HTMLElement; sel: Selection } | null {
  for (const t of path) {
    if (!(t instanceof HTMLElement)) continue;
    const sel = selectionOf(t);
    if (sel) return { el: t, sel };
  }
  return null;
}

function selectionFromEvent(path: EventTarget[]): Selection | null {
  return targetFromEvent(path)?.sel ?? null;
}

/** Class that sets the --k selection colours of a level (see editor-system `.k-*`). */
export function levelClass(sel: Selection): string {
  return `k-${sel.kind === 'slot' ? 'column' : sel.kind}`;
}

/**
 * Maps screen rects (getBoundingClientRect) to `inner`'s own layout px, the space the absolutely
 * positioned frames live in. An ancestor transform (the studio dialog opens from scale(0.985))
 * scales screen px: dividing by the measured scale keeps the frames on their targets whenever
 * they are measured, so nothing has to re-measure when the transition ends.
 */
export function layoutSpace(inner: HTMLElement): (r: DOMRect) => { top: number; left: number; width: number; height: number } {
  const ir = inner.getBoundingClientRect();
  const sx = inner.offsetWidth > 0 && ir.width > 0 ? ir.width / inner.offsetWidth : 1;
  const sy = inner.offsetHeight > 0 && ir.height > 0 ? ir.height / inner.offsetHeight : 1;
  return (r) => ({
    top: (r.top - ir.top) / sy,
    left: (r.left - ir.left) / sx,
    width: r.width / sx,
    height: r.height / sy,
  });
}

/**
 * Studio canvas: dotted ground, device frame and ONE live `<magic-card editMode>`.
 * Click selects, hover outlines modules, a selection frame + floating toolbar track the selection.
 */
@customElement('mc-studio-canvas')
export class StudioCanvas extends LitElement {
  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() device: StudioDevice = 'phone';

  @state() private _state?: EditorState;
  @state() private _hoverLabel = '';
  @state() private _hoverSel: Selection | null = null;
  @state() private _cardError = '';
  /** Connect mode ("Add flow from here"): the start module; the next module clicked ends the flow. */
  @state() private _connectFrom: ModuleSelection | null = null;
  /** Connect mode: why the last module clicked can't end the flow (template module without an id). */
  @state() private _connectNote = '';
  /** The config connect mode started on: any edit (undo, a field, YAML) ends the mode. */
  private _connectConfig?: MagicCardConfig;

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _card?: MagicCard;
  private _cardConfig?: MagicCardConfig;
  private _ro?: ResizeObserver;
  private _hoverEl: HTMLElement | null = null;
  private _placeQueued = false;
  /** Column resize: the drag in progress, and its widths for the handles' aria values. */
  private _colDrag: ColumnDrag | null = null;
  @state() private _colPreview: string[] | null = null;
  /**
   * The last committed key resize (gutter, time and the config it wrote), for one undo step per
   * burst: any other change in between (undo, a drag, an edit) starts a new step.
   */
  private _lastKeyResize: { row: string; i: number; t: number; config: MagicCardConfig | undefined } | null = null;

  /** Focus the keyboard surface of the canvas. */
  focusCanvas(): void {
    this.shadowRoot?.querySelector<HTMLElement>('.canvas')?.focus({ preventScroll: true });
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager && !this._unsubscribe) this._subscribe();
    if (this.hasUpdated) this._observe();
    window.addEventListener('resize', this._queuePlace);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
    this._ro?.disconnect();
    this._ro = undefined;
    window.removeEventListener('resize', this._queuePlace);
    this._endColumnDrag(false);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('stateManager') && this.stateManager !== this._subscribedTo) this._subscribe();
    const d = this._colDrag;
    if (d && changed.has('_state') && this._state?.config !== d.config) this._endColumnDrag(false);
  }

  private _subscribe(): void {
    this._unsubscribe?.();
    this._subscribedTo = this.stateManager;
    this._unsubscribe = this.stateManager?.subscribe((s) => {
      this._state = s;
    });
  }

  protected firstUpdated(): void {
    const card = document.createElement(CARD_TAG) as MagicCard;
    card.editMode = true; // before setConfig / connect: no template registration in the studio
    this._card = card;
    if (this.hass) card.hass = inertHass(this.hass);
    this._syncCard();
    const host = this.shadowRoot!.querySelector<HTMLElement>('.card-host')!;
    for (const type of BLOCKED) host.addEventListener(type, this._block, true);
    host.addEventListener('click', this._onCardClick, true);
    host.addEventListener('keydown', this._onCardKeydown, true);
    for (const type of HA_ACTION_EVENTS) host.addEventListener(type, this._stop);
    host.appendChild(card);
    this._observe();
    // Late web fonts move the card without resizing what the ResizeObserver watches.
    document.fonts?.ready.then(this._queuePlace, () => undefined);
  }

  private _observe(): void {
    if (this._ro || typeof ResizeObserver === 'undefined') return;
    this._ro = new ResizeObserver(this._queuePlace);
    const inner = this.shadowRoot?.querySelector('.canvas-inner');
    if (inner) this._ro.observe(inner);
    if (this._card) this._ro.observe(this._card);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('hass') && this._card && this.hass) this._card.hass = inertHass(this.hass);
    if (changed.has('_state')) {
      this._syncCard();
      // Tabs / slider layouts show the tab or slide holding a selected child.
      const sel = this._sel;
      if (this._card) {
        this._card.selectedPath = sel.kind === 'module' ? modulePathAttr(sel)
          : sel.kind === 'slot' ? `${modulePathAttr(parentSelection(sel) as ModuleSelection)}#${sel.slot}` : undefined;
        this._card.selectedFlow = this._state?.selectedFlow ?? null;
      }
      // Another selection (Layers, undo, delete) or any config change: connect mode ends.
      if (this._connectFrom && (!sameSelection(sel, this._connectFrom) || this._state?.config !== this._connectConfig)) this._connectFrom = null;
    }
    this._queuePlace();
  }

  private _syncCard(): void {
    const card = this._card;
    const config = this._state?.config;
    if (!card || !config || config === this._cardConfig) return;
    this._cardConfig = config;
    // a linked card plays the template's custom animations too (the config holds only its own)
    const live = { ...withTemplateAnimations(config, this._state?.templateAnimations) };
    delete live.template;
    try {
      card.setConfig(live);
      this._cardError = '';
    } catch (err) {
      this._cardError = err instanceof Error ? err.message : String(err);
    }
  }

  // ── selection ──

  private get _sel(): Selection {
    return selectionFromPath(this._state?.selectedPath ?? null);
  }

  private _select(sel: Selection): void {
    this.stateManager?.setSelectedPath(selectionToPath(sel));
  }

  private _block = (e: Event): void => {
    if (inPopupPreview(e)) return;
    if (e.type === 'pointerdown' || e.type === 'mousedown') this.focusCanvas();
    e.stopPropagation();
    // Touch/pointer keep their default: cancelling would block canvas scrolling and the tap's click.
    if (!KEEP_DEFAULT.has(e.type)) e.preventDefault();
  };

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

  private _onCardClick = (e: MouseEvent): void => {
    if (inPopupPreview(e)) return;
    e.stopPropagation();
    e.preventDefault();
    const target = selectionFromEvent(e.composedPath()) ?? { kind: 'card' };
    if (this._connectFrom) {
      // Connect mode: another module ends the flow; anything else keeps waiting.
      const config = this._state?.config;
      if (target.kind === 'module' && config && templateIdMissing(config, target)) {
        this._connectNote = TEMPLATE_ID_HINT;
      } else if (target.kind === 'module' && !sameSelection(target, this._connectFrom)) {
        const from = this._connectFrom;
        this._connectFrom = null;
        this.stateManager?.addFlow(from, target);
      }
      this.focusCanvas();
      return;
    }
    // Between modules (column, row, card): a click on a flow line selects that flow.
    const flow = target.kind === 'module' ? undefined : this._flowAt(e);
    if (flow) this.stateManager?.selectFlow(flow);
    else this._select(target);
    this.focusCanvas();
  };

  /** Key of the flow line under a click on the canvas card, if any. */
  private _flowAt(e: MouseEvent): string | undefined {
    const overlays = this._card?.shadowRoot?.querySelectorAll<HTMLElement & { flowAt?: (x: number, y: number) => string | undefined }>('mc-flows');
    for (const fl of overlays ?? []) {
      const key = fl.flowAt?.(e.clientX, e.clientY);
      if (key) return key;
    }
    return undefined;
  }

  /** "Add flow from here": the next module clicked on the canvas ends a new flow (Escape cancels). */
  private _startConnect(): void {
    const sel = this._sel;
    const config = this._state?.config;
    if (sel.kind !== 'module' || !config || templateIdMissing(config, sel)) return;
    this._connectNote = '';
    this._connectConfig = config;
    this._connectFrom = sel;
    this.focusCanvas();
  }

  private _cancelConnect = (): void => {
    this._connectFrom = null;
    this.focusCanvas();
  };

  /** The connect hint sits outside the canvas: Escape there leaves connect mode, never the studio. */
  private _onHintKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    this._cancelConnect();
  };

  private _onCardKeydown = (e: KeyboardEvent): void => {
    if (inPopupPreview(e)) return;
    // Keep keyboard activation away from module previews; Tab still moves focus.
    // A clone continues from the canvas so canvas and studio shortcuts keep working.
    if (e.key === 'Tab') return;
    e.stopPropagation();
    // Focus in a field inside the live card: Delete / Backspace / Alt+Arrow / Ctrl+D belong to that field,
    // never to the module. Only Escape still continues to the canvas (parent selection, close).
    if (isTyping(e) && e.key !== 'Escape') {
      e.preventDefault();
      return;
    }
    const clone = new KeyboardEvent(e.type, { key: e.key, code: e.code, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
      altKey: e.altKey, shiftKey: e.shiftKey, repeat: e.repeat, bubbles: true, composed: true, cancelable: true });
    const canvas = this.shadowRoot?.querySelector('.canvas');
    if (canvas) canvas.dispatchEvent(clone);
    if (clone.defaultPrevented || e.key !== 'Escape') e.preventDefault();
  };

  private _onGroundClick = (e: MouseEvent): void => {
    if (e.composedPath().some((t) => t instanceof HTMLElement && t.classList.contains('float-bar'))) return;
    if (this._connectFrom) {
      this._connectFrom = null;
      return;
    }
    // The ground clears a selected flow too (the card stays the selection).
    if (this._state?.selectedFlow) this.stateManager?.selectFlow(null);
    this._select({ kind: 'card' });
  };

  private _onKeydown = (e: KeyboardEvent): void => {
    if (isTyping(e) || !this.stateManager) return;
    if (this._connectFrom && e.key === 'Escape') {
      // Escape leaves connect mode only (no parent selection, the studio stays open).
      e.preventDefault();
      this._connectFrom = null;
      return;
    }
    const sel = this._sel;
    const mod = (e.ctrlKey || e.metaKey) && !e.altKey;
    if (sel.kind === 'module' && e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this._op(e.key === 'ArrowUp' ? 'up' : 'down');
    } else if (sel.kind === 'module' && (e.key === 'Delete' || e.key === 'Backspace') && !mod) {
      e.preventDefault();
      this._op('delete');
    } else if (sel.kind === 'module' && mod && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      this._op('duplicate');
    } else if (e.key === 'Escape' && sel.kind !== 'card') {
      // Parent selection; on the card itself Escape falls through and closes the studio.
      e.preventDefault();
      this._select(parentSelection(sel, this._state?.config));
    }
  };

  private _op(op: 'up' | 'down' | 'duplicate' | 'delete'): void {
    const sm = this.stateManager;
    const sel = this._sel;
    if (!sm || sel.kind !== 'module') return;
    if (op === 'up' || op === 'down') sm.moveModuleBy(sel.row, sel.col, sel.module, op === 'up' ? -1 : 1, sel.child);
    else if (op === 'duplicate') sm.duplicateModule(sel.row, sel.col, sel.module, sel.child);
    else sm.deleteModule(sel.row, sel.col, sel.module, sel.child);
  }

  private async _onBarClick(op: 'up' | 'down' | 'duplicate' | 'delete', e: Event): Promise<void> {
    const btn = e.currentTarget as HTMLButtonElement;
    this._op(op);
    await this.updateComplete;
    if (op === 'delete' || btn.disabled || !btn.isConnected || this._sel.kind !== 'module') this.focusCanvas();
  }

  // ── hover ──

  /** Hover previews what a click would select: module, column, row, or the card itself. */
  private _onPointerMove = (e: PointerEvent): void => {
    const path = e.composedPath();
    const card = this._card;
    const hit = targetFromEvent(path)
      ?? (card && path.includes(card) ? { el: card as HTMLElement, sel: { kind: 'card' } as Selection } : null);
    const el = hit?.el ?? null;
    if (el === this._hoverEl) return;
    this._hoverEl = el;
    this._hoverSel = hit?.sel ?? null;
    const config = this._state?.config;
    this._hoverLabel = hit && config && hit.sel.kind !== 'card' ? describeSelection(config, hit.sel).title : '';
    this._placeHover();
  };

  private _onPointerLeave = (): void => {
    this._hoverEl = null;
    this._hoverSel = null;
    this._placeHover();
  };

  // ── geometry ──

  private _queuePlace = (): void => {
    if (this._placeQueued) return;
    this._placeQueued = true;
    const card = this._card;
    const wait = card ? card.updateComplete : Promise.resolve(true);
    wait.then(() => requestAnimationFrame(() => {
      this._placeQueued = false;
      this._place();
    }));
  };

  private _rectOf(sel: Selection): DOMRect | null {
    const card = this._card;
    if (!card) return null;
    const q = selector(sel);
    const el = q ? card.shadowRoot?.querySelector<HTMLElement>(q) ?? (sel.kind === 'slot' ? card.shadowRoot?.querySelector<HTMLElement>(selector(parentSelection(sel))!) : null) : card;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width || r.height ? r : null;
  }

  private _place(): void {
    const root = this.shadowRoot;
    const inner = root?.querySelector<HTMLElement>('.canvas-inner');
    const frame = root?.querySelector<HTMLElement>('.sel-frame');
    const bar = root?.querySelector<HTMLElement>('.float-bar');
    if (!inner || !frame || !bar) return;
    const sel = this._sel;
    const tr = this._rectOf(sel);
    const canvasEl = root?.querySelector<HTMLElement>('.canvas');
    const toLocal = layoutSpace(inner);
    this._placeColumnHandles(toLocal);
    if (!tr) {
      frame.hidden = true;
      bar.hidden = true;
      canvasEl?.classList.remove('framed');
      this._placeHover();
      return;
    }
    const t = toLocal(tr);
    const top = t.top - 6;
    const left = t.left - 6;
    const w = t.width + 12;
    const h = t.height + 12;
    frame.hidden = false;
    Object.assign(frame.style, { top: `${top}px`, left: `${left}px`, width: `${w}px`, height: `${h}px` });
    if (sel.kind !== 'module') {
      bar.hidden = true;
    } else {
      bar.hidden = false;
      const canvas = canvasEl!;
      const own = modulePathAttr(sel);
      // Other modules, not the selected module's own layout parents or children (they overlap it).
      const related = (p: string) => p === own || own.startsWith(`${p}/`) || p.startsWith(`${own}/`);
      const obstacles = [...(this._card?.shadowRoot?.querySelectorAll<HTMLElement>('[data-mc-path]') ?? [])]
        .filter((el) => !related(el.dataset.mcPath ?? ''))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width || r.height)
        .map(toLocal);
      const viewport = {
        top: canvas.scrollTop,
        left: canvas.scrollLeft,
        width: Math.min(canvas.clientWidth, inner.clientWidth),
        height: canvas.clientHeight,
      };
      const pos = placeFloatBar(
        { top, left, width: w, height: h },
        { width: bar.offsetWidth, height: bar.offsetHeight },
        obstacles,
        viewport,
      );
      Object.assign(bar.style, { top: `${pos.top}px`, left: `${pos.left}px` });
    }
    canvasEl?.classList.toggle('framed', !frame.hidden);
    this._placeHover();
  }

  // ── column resize ──

  /**
   * The row whose gutters get resize handles: the selected row or the selected column's row, or a
   * selected row module or one of its columns.
   */
  private get _resizeRow(): ResizeTarget | null {
    const sel = this._sel;
    const config = this._state?.config;
    const sm = this.stateManager;
    if (this._connectFrom || !config || !sm) return null;
    if (sel.kind === 'row' || sel.kind === 'column') {
      const row = config.rows[sel.row];
      return row && row.columns.length > 1
        ? {
            id: `${sel.row}`,
            grid: row,
            count: row.columns.length,
            rowQ: `[data-mc-row="${sel.row}"]`,
            colQ: (c) => `[data-mc-col="${sel.row}.${c}"]`,
            write: (w, coalesce) => sm.setColumnWidths(sel.row, w, undefined, coalesce),
          }
        : null;
    }
    const owner = sel.kind === 'slot' ? (parentSelection(sel) as ModuleSelection) : sel.kind === 'module' ? sel : null;
    const mod = owner ? (moduleAt(config, owner) as RowModuleConfig | undefined) : undefined;
    const count = mod?.type === 'row' ? mod.columns?.length ?? 0 : 0;
    if (!owner || count < 2) return null;
    const path = modulePathAttr(owner);
    return {
      id: path,
      grid: mod!,
      count,
      colQ: (c) => `[data-mc-slot="${path}#${c}"]`,
      write: (w, coalesce) => sm.setNestedColumnWidths(owner.row, owner.col, owner.module, owner.child, w, undefined, coalesce),
    };
  }

  private _rowEls(t: ResizeTarget): { rowEl: HTMLElement | null; cols: HTMLElement[] } {
    const root = this._card?.shadowRoot;
    const cols: HTMLElement[] = [];
    for (let c = 0; c < t.count; c++) {
      const el = root?.querySelector<HTMLElement>(t.colQ(c));
      if (el) cols.push(el);
    }
    return { rowEl: (t.rowQ ? root?.querySelector<HTMLElement>(t.rowQ) : cols[0]?.closest<HTMLElement>('.mc-nested-row')) ?? null, cols };
  }

  /** Each handle centred on its gutter, as tall as the row (layout px, like the frames). */
  private _placeColumnHandles(toLocal: ReturnType<typeof layoutSpace>): void {
    const handles = this.shadowRoot?.querySelectorAll<HTMLElement>('.col-handle');
    if (!handles?.length) return;
    const row = this._resizeRow;
    const { rowEl, cols } = row === null ? { rowEl: null, cols: [] as HTMLElement[] } : this._rowEls(row);
    const rr = rowEl ? rowEl.getBoundingClientRect() : null;
    for (const h of handles) {
      const i = Number(h.dataset.i);
      const a = cols[i]?.getBoundingClientRect();
      const b = cols[i + 1]?.getBoundingClientRect();
      if (!rr || !a || !b || !(rr.width || rr.height)) {
        h.hidden = true;
        continue;
      }
      const r = toLocal(rr);
      const la = toLocal(a);
      const x = (la.left + la.width + toLocal(b).left) / 2;
      h.hidden = false;
      // centred by the stylesheet (margin-left: half the hit strip)
      Object.assign(h.style, { left: `${x}px`, top: `${r.top}px`, height: `${r.height}px` });
    }
  }

  /** Column widths in card px, and screen px per card px. */
  private _measureColumns(row: ResizeTarget): { px: number[]; scale: number } | null {
    const inner = this.shadowRoot?.querySelector<HTMLElement>('.canvas-inner');
    const { cols } = this._rowEls(row);
    if (!inner || !cols.length) return null;
    const ir = inner.getBoundingClientRect();
    const scale = inner.offsetWidth > 0 && ir.width > 0 ? ir.width / inner.offsetWidth : 1;
    return { px: cols.map((c) => c.getBoundingClientRect().width / scale), scale };
  }

  private _widthsOf(row: ResizeTarget): string[] {
    return effectiveWidths(row.grid);
  }

  /** One undo step, only for an actual change. */
  private _commitWidths(row: ResizeTarget, next: string[], from: string[]): void {
    if (next.join(' ') !== from.join(' ')) row.write(next);
  }

  private _onHandleDown = (e: PointerEvent): void => {
    const row = this._resizeRow;
    const handle = e.currentTarget as HTMLElement;
    if (row === null || e.button !== 0 || this._colDrag) return;
    e.preventDefault();
    e.stopPropagation();
    const m = this._measureColumns(row);
    const { rowEl } = this._rowEls(row);
    if (!m || !rowEl) return;
    try {
      handle.setPointerCapture?.(e.pointerId);
    } catch {
      // not an active pointer (synthetic events): the window listeners still follow it
    }
    this._colDrag = {
      row,
      i: Number(handle.dataset.i),
      pointerId: e.pointerId,
      startX: e.clientX,
      scale: m.scale,
      widths: this._widthsOf(row),
      px: m.px,
      rowEl,
      template: rowEl.style.gridTemplateColumns,
      config: this._state?.config,
    };
    window.addEventListener('pointermove', this._onDragMove);
    window.addEventListener('pointerup', this._onDragUp);
    window.addEventListener('pointercancel', this._onDragCancel);
    window.addEventListener('keydown', this._onDragKey, true);
  };

  private _onDragMove = (e: PointerEvent): void => {
    const d = this._colDrag;
    if (!d || e.pointerId !== d.pointerId) return;
    e.preventDefault();
    const next = resizePair(d.widths, d.i, d.px, (e.clientX - d.startX) / d.scale, { snap: !e.altKey });
    d.next = next;
    // live preview on the canvas card only: nothing is written until the pointer is released
    d.rowEl.style.gridTemplateColumns = columnWidthsTemplate(next, next.length);
    this._colPreview = next;
    this._queuePlace();
  };

  private _onDragUp = (e: PointerEvent): void => {
    if (this._colDrag && e.pointerId === this._colDrag.pointerId) this._endColumnDrag(true);
  };

  private _onDragCancel = (e: PointerEvent): void => {
    if (this._colDrag && e.pointerId === this._colDrag.pointerId) this._endColumnDrag(false);
  };

  /** Escape during a drag cancels it and goes no further (no parent selection, the studio stays open). */
  private _onDragKey = (e: KeyboardEvent): void => {
    if (!this._colDrag || e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    this._endColumnDrag(false);
  };

  private _endColumnDrag(commit: boolean): void {
    const d = this._colDrag;
    if (!d) return;
    this._colDrag = null;
    this._colPreview = null;
    window.removeEventListener('pointermove', this._onDragMove);
    window.removeEventListener('pointerup', this._onDragUp);
    window.removeEventListener('pointercancel', this._onDragCancel);
    window.removeEventListener('keydown', this._onDragKey, true);
    if (commit && d.next && d.next.join(' ') !== d.widths.join(' ')) {
      d.row.write(d.next);
    } else {
      d.rowEl.style.gridTemplateColumns = d.template;
    }
    this._queuePlace();
  }

  /**
   * Arrow keys move the gutter one snap step (Shift: five), Home / End all the way left / right; the
   * handle keeps focus. A held key or quick presses on one gutter are one undo step.
   */
  private _onHandleKey = (e: KeyboardEvent): void => {
    if (this._colDrag || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const row = this._resizeRow;
    const m = row === null ? null : this._measureColumns(row);
    if (row === null || !m) return;
    const i = Number((e.currentTarget as HTMLElement).dataset.i);
    const widths = this._widthsOf(row);
    const next =
      e.key === 'Home' || e.key === 'End'
        ? resizePair(widths, i, m.px, (e.key === 'Home' ? -1 : 1) * 1e6)
        : stepPair(widths, i, m.px, (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 5 : 1));
    if (next.join(' ') === widths.join(' ')) return;
    const now = Date.now();
    const last = this._lastKeyResize;
    const coalesce =
      !!last && last.row === row.id && last.i === i && last.config === this._state?.config && (e.repeat || now - last.t < KEY_COALESCE_MS);
    row.write(next, coalesce);
    this._lastKeyResize = { row: row.id, i, t: now, config: this._state?.config };
  };

  /** Double-click: the two neighbours get equal widths. */
  private _onHandleDblClick = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const row = this._resizeRow;
    const m = row === null ? null : this._measureColumns(row);
    if (row === null || !m) return;
    const widths = this._widthsOf(row);
    this._commitWidths(row, equalizePair(widths, Number((e.currentTarget as HTMLElement).dataset.i), m.px), widths);
  };

  private _renderColumnHandles(): TemplateResult | typeof nothing {
    const row = this._resizeRow;
    if (row === null) return nothing;
    const widths = this._colPreview ?? this._widthsOf(row);
    const weights = widthWeights(widths);
    return html`${widths.slice(1).map((_, i) => {
      const share = Math.round((weights[i] / (weights[i] + weights[i + 1] || 1)) * 100);
      return html`<div
        class="col-handle k-row ${this._colDrag?.i === i ? 'dragging' : ''}"
        data-i=${i}
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        aria-label="Resize between Column ${i + 1} and Column ${i + 2}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${share}
        aria-valuetext="Column ${i + 1} ${widths[i]}, Column ${i + 2} ${widths[i + 1]}"
        title="Drag to resize, double-click for equal widths"
        hidden
        @pointerdown=${this._onHandleDown}
        @keydown=${this._onHandleKey}
        @dblclick=${this._onHandleDblClick}
        @click=${this._stop}
      ></div>`;
    })}`;
  }

  private _placeHover(): void {
    const root = this.shadowRoot;
    const inner = root?.querySelector<HTMLElement>('.canvas-inner');
    const hover = root?.querySelector<HTMLElement>('.hover-frame');
    if (!inner || !hover) return;
    const el = this._hoverEl;
    const selected = !!this._hoverSel && sameSelection(this._hoverSel, this._sel);
    if (!el || !el.isConnected || selected) {
      hover.hidden = true;
      return;
    }
    const r = layoutSpace(inner)(el.getBoundingClientRect());
    hover.hidden = false;
    Object.assign(hover.style, {
      top: `${r.top - 4}px`,
      left: `${r.left - 4}px`,
      width: `${r.width + 8}px`,
      height: `${r.height + 8}px`,
    });
  }

  // ── render ──

  protected render(): TemplateResult {
    const s = this._state;
    const dev = DEVICES[this.device] || DEVICES.phone;
    const sel = this._sel;
    const config = s?.config;
    const label = config ? describeSelection(config, sel).title : '';
    // Position of the module in its list: a column, or a layout module's slot for a nested child.
    let index = 0;
    let count = 0;
    if (sel.kind === 'module' && config) {
      const step = sel.child?.[sel.child.length - 1];
      if (step) {
        const parent = moduleAt(config, parentSelection(sel));
        index = step.index;
        count = childSlots(parent)?.[step.slot]?.length ?? 0;
      } else {
        index = sel.module;
        count = config.rows[sel.row]?.columns[sel.col]?.modules?.length ?? 0;
      }
    }
    const first = sel.kind === 'module' && index === 0;
    const last = sel.kind === 'module' && index >= count - 1;
    const locked = sel.kind === 'module' && !!config && templateIdMissing(config, sel);

    return html`
      <div
        class="canvas ${this._connectFrom ? 'connecting' : ''}"
        tabindex="0"
        role="region"
        aria-label="Canvas, ${label} selected"
        aria-describedby=${this._connectFrom ? 'connect-hint' : 'canvas-hint'}
        @click=${this._onGroundClick}
        @keydown=${this._onKeydown}
        @scroll=${this._queuePlace}
        @pointermove=${this._onPointerMove}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="canvas-inner">
          <div class="device" style="--device-w:${dev.width}px" @transitionend=${this._queuePlace}>
            <div class="device-label"><span>${dev.label} · ${dev.width} px</span><span>Live data</span></div>
            ${this._cardError
              ? html`<p class="card-error" role="status">Preview not updated: ${this._cardError}</p>`
              : nothing}
            <div class="card-host"></div>
          </div>
          <div class="hover-frame ${levelClass(this._hoverSel ?? { kind: 'module', row: 0, col: 0, module: 0 })}"
            hidden aria-hidden="true">${this._hoverLabel ? html`<span class="tag">${this._hoverLabel}</span>` : nothing}</div>
          <div class="sel-frame ${levelClass(sel)}" hidden aria-hidden="true">
            ${sel.kind === 'card' ? nothing : html`<span class="tag">${label}</span>`}
            ${sel.kind === 'module'
              ? html`<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i>`
              : nothing}
          </div>
          ${this._renderColumnHandles()}
          <div class="float-bar" role="toolbar" aria-label="Module actions" hidden>
            <button type="button" class="icon-btn sm" aria-label="Move up" title="Move up (Alt+Up)" ?disabled=${first}
              @click=${(e: Event) => this._onBarClick('up', e)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label="Move down" title="Move down (Alt+Down)" ?disabled=${last}
              @click=${(e: Event) => this._onBarClick('down', e)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <span class="sep" aria-hidden="true"></span>
            <button type="button" class="icon-btn sm" aria-label="Duplicate" title="Duplicate (Ctrl+D)"
              @click=${(e: Event) => this._onBarClick('duplicate', e)}><ha-icon icon="mdi:content-copy"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label="Add flow from here"
              title=${locked ? `Add flow from here. ${TEMPLATE_ID_HINT}` : 'Add flow from here'} ?disabled=${locked}
              aria-pressed=${this._connectFrom ? 'true' : 'false'}
              @click=${() => (this._connectFrom ? this._cancelConnect() : this._startConnect())}><ha-icon icon="mdi:transit-connection-variant"></ha-icon></button>
            <button type="button" class="icon-btn sm danger" aria-label="Delete" title="Delete (Del)"
              @click=${(e: Event) => this._onBarClick('delete', e)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
          </div>
        </div>
      </div>
      ${this._connectFrom
        ? html`<div class="connect-hint" id="connect-hint" @keydown=${this._onHintKeydown}>
            <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
            <span>${this._connectNote
              ? html`${this._connectNote}, or pick another. <kbd>Esc</kbd> cancels.`
              : html`Click the module to connect to. <kbd>Esc</kbd> cancels.`}</span>
            <button type="button" class="btn btn-text btn-sm" @click=${this._cancelConnect}>Cancel</button>
          </div>`
        : nothing}
      <p class="sr-only" id="connect-status" role="status">${this._connectFrom
        ? this._connectNote
          ? `${this._connectNote}, or pick another. Escape cancels.`
          : 'Click the module to connect to. Escape cancels.'
        : ''}</p>
      <p class="canvas-hint" id="canvas-hint" ?hidden=${!!this._connectFrom}>
        Click a module to select it. <kbd>Alt</kbd> + <kbd>Up</kbd>/<kbd>Down</kbd> moves it, <kbd>Del</kbd> removes it.
      </p>
    `;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        position: relative;
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        min-height: 0;
        min-width: 0;
      }
      .canvas {
        overflow: auto;
        min-height: 0;
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 16px 16px;
      }
      /* The selection frame is the focus indicator; a subtle ring only when nothing is framed. */
      .canvas:focus-visible {
        /* --mc-text-2: non-accent, >= 3:1 against --mc-canvas in light (5.2:1) and dark (6.0:1) */
        outline: 2px solid var(--mc-text-2);
        outline-offset: -2px;
      }
      .canvas.framed:focus-visible {
        outline: none;
      }
      .canvas-inner {
        position: relative;
        min-height: 100%;
        padding: 56px 24px 96px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .device {
        width: var(--device-w, 360px);
        max-width: 100%;
        transition: width 0.22s ease-out;
      }
      .device-label {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .card-host {
        cursor: default;
      }
      .canvas.connecting .card-host {
        cursor: crosshair;
      }
      /* connect mode: a floating capsule at the canvas foot (Float shadow), with Cancel */
      .connect-hint {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 6;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: calc(100% - 32px);
        padding: 4px 4px 4px 12px;
        border-radius: 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        box-shadow: var(--mc-shadow-float);
        font-size: 0.8125rem;
        color: var(--mc-text);
        --mdc-icon-size: 18px;
      }
      .canvas-hint[hidden] {
        display: none;
      }
      .connect-hint > ha-icon {
        color: var(--mc-accent-ink);
        flex: none;
      }
      .float-bar [aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .card-error {
        margin: 0 0 8px;
        font-size: 0.75rem;
        color: var(--mc-error-ink);
        overflow-wrap: anywhere;
      }
      .hover-frame,
      .sel-frame {
        position: absolute;
        pointer-events: none;
      }
      /* Colours per level come from .k-card / .k-row / .k-column / .k-module (--k, --k-fill, --k-ink). */
      .hover-frame {
        z-index: 3;
        border: 1px solid color-mix(in srgb, var(--k) 70%, transparent);
        border-radius: 11px;
      }
      .hover-frame .tag {
        position: absolute;
        left: 0;
        top: -22px;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.5;
        white-space: nowrap;
        background: var(--mc-surface);
        color: var(--k-ink);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--k) 55%, transparent);
      }
      .sel-frame {
        z-index: 4;
        border: 2px solid var(--k);
        border-radius: 10px;
        transition: border-color 0.15s ease-out, top 0.2s ease-out, left 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
      }
      .sel-frame .h {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--mc-surface);
        border: 2px solid var(--k);
        border-radius: 2px;
      }
      .sel-frame .h.tl { left: -5px; top: -5px; }
      .sel-frame .h.tr { right: -5px; top: -5px; }
      .sel-frame .h.bl { left: -5px; bottom: -5px; }
      .sel-frame .h.br { right: -5px; bottom: -5px; }
      .sel-frame .tag {
        position: absolute;
        left: -2px;
        top: -28px;
        padding: 2px 8px;
        border-radius: 6px;
        background: var(--k-fill);
        color: var(--mc-on-accent);
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.5;
        white-space: nowrap;
      }
      /* column resize: a 16 px hit strip on the gutter (24 px for touch), a 2 px line and a grip in the row colour */
      .col-handle {
        --col-hit: 16px;
        position: absolute;
        z-index: 5;
        width: var(--col-hit);
        margin-left: calc(var(--col-hit) / -2);
        cursor: col-resize;
        touch-action: none;
        border-radius: 6px;
      }
      .col-handle[hidden] {
        display: none;
      }
      .col-handle::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(50% - 1px);
        width: 2px;
        border-radius: 1px;
        background: color-mix(in srgb, var(--k) 45%, transparent);
        transition: background-color 0.15s ease-out;
      }
      .col-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: calc(50% - 4px);
        width: 8px;
        height: 28px;
        margin-top: -14px;
        box-sizing: border-box;
        border-radius: 4px;
        background: var(--mc-surface);
        border: 2px solid var(--k);
      }
      .col-handle:hover::before,
      .col-handle.dragging::before,
      .col-handle:focus-visible::before {
        background: var(--k);
      }
      .col-handle.dragging::after {
        background: var(--k);
      }
      .col-handle:focus-visible {
        outline: 2px solid var(--k);
        outline-offset: 2px;
      }
      @media (pointer: coarse) {
        .col-handle {
          --col-hit: 24px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .col-handle::before {
          transition: none;
        }
      }
      .float-bar {
        position: absolute;
        z-index: 5;
        display: flex;
        gap: 2px;
        padding: 4px;
        border-radius: 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        box-shadow: var(--mc-shadow-float);
        transition: top 0.2s ease-out, left 0.2s ease-out;
      }
      .float-bar .sep {
        width: 1px;
        margin: 4px 2px;
        background: var(--mc-divider);
      }
      .canvas-hint {
        position: absolute;
        left: 16px;
        bottom: 16px;
        z-index: 3;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 6px 10px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
      }
      @media (max-width: 640px) {
        .canvas-hint {
          display: none;
        }
        /* Stacked studio: the canvas grows to fit the card; the studio workspace does the scrolling. */
        :host {
          grid-template-rows: auto;
        }
        .canvas {
          overflow: visible;
        }
        .canvas-inner {
          padding: 56px 16px 64px;
        }
      }
      kbd {
        font-family: var(--mc-mono);
        font-size: 0.75rem;
        padding: 0 4px;
        border: 1px solid var(--mc-divider);
        border-radius: 4px;
        background: var(--mc-surface-2);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-studio-canvas': StudioCanvas;
  }
}
