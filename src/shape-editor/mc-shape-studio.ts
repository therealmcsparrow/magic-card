import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CORNER_TYPES, MAX_SHAPE_POINTS } from '../contracts/custom-shape';
import type { CornerKey, CornerType, CustomShapeOptions } from '../contracts/custom-shape';
import type { SavedShape } from '../contracts/mcu-library';
import type { MagicCardEditorWindowAdditions } from '../contracts/module-editor';
import type { LocaleHassLike } from '../contracts/i18n';
import type { KitButtonOptions, UiMenuEntry, UiPopoverElement, UiToastElement, UiWindowElement } from '../contracts/ui-kit';
import type { TransferItem } from '../contracts/preset-transfer';
import type { BooleanOp } from '../contracts/path-booleans';
import type { CanvasMode, MenuEntry, PathChange, PathContext, PathSelection, PathTransform, TransformBox } from '../contracts/path-canvas';
import { PRIMITIVE_KINDS, type Anchor, type Box, type EditPath, type PathDraw, type PathEdit, type PrimitiveKind, type Pt } from '../contracts/path-model';
import type { ShapeChangeDetail, ShapeEditorPreset, ShapeEditorValue } from '../contracts/svg-editor';
import { bounds, flatten, parseClosed, toPathString } from '../path/core';
import { loadPathBooleans } from '../path-booleans/loader';
import { loadPathCanvas } from '../path-canvas/loader';
import type { ShapeOptions } from '../types';
import { loadCustomShapes } from '../utils/shape-custom-loader';
import { resolveCustomShape } from '../utils/shape-ref';
import { clamp, shapePath } from '../utils/shape-path';
import { RovingFocus, button, chip, defineUiKit, empty, glyph as kitGlyph, notice, row, sectionHead, slider, switchRow, toolbar, topBar } from '../ui-kit';
import { glyph } from './glyphs';
import { deleteShape, freeId, listShapes, LibraryError, lookupFor, saveShape, slug, tooBig, watchLibrary, type Hass, type LibraryProblem } from './library';
import {
  absOf, blankDoc, clamped, cornerPx, cornersOf, cornersToPoints, fromAnchors, KEYS, noSides, presetToCustom, readDoc, repad, reversePoints, segT, SIDES, SIZES, STARTERS, toEditPath, toYaml,
  withAbs, writeDoc, writePoints, type Axis, type Corner, type Doc, type EditSize, type Side, type Sides,
} from './model';
import { isCut, selfCrosses, solveSpace } from './space';
import { setI18nLocale } from '../i18n/runtime';
import { t, locale } from './i18n';
import { BOX, CORNER, DIST, EDIT_AT, FAIL, HANDLE, OPS, presetName, PRIM, SAMPLE, SHORT, SHORTCUTS, SIDE, SIZE, STARTER, TYPE, TYPE_HELP } from './names';
import { studioStyles } from './styles';
import { btn, num, r1, seg } from './ui';

/*
 * <mc-shape-studio> (contract svg-editor 1.0.0 rev 2, shape part; custom-shape 1.0.0 rev 3): the card shape
 * editor. Corner mode needs no canvas (type tiles, sizes, a drawing with corner handles); free path mode
 * hosts <mc-path-canvas> (path-canvas 1.0.0), loaded when it is first needed. Every change is a
 * `mc-shape-change` event (commit false while dragging); the builder comes from the shape-custom chunk
 * (shape-custom-loader), so the previews are the renderer. History keeps whole documents.
 * Templates are written compact on purpose (lit keeps their whitespace in the chunk): keep prettier off them.
 */

export interface Preview {
  id: string;
  w: number;
  h: number;
  d: string;
  inset: Sides;
  poly: Pt[];
  cut: boolean;
  cross: boolean;
}

type LibState = 'idle' | 'loading' | 'ready' | LibraryProblem;

const FIELD = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
const PAD = 24;
const MAX_SIZE = 2000;
const ROW: EditSize = SIZES[1];
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
const coarse = (): boolean => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
/** The kit's rail turns into a row under this viewport width (the same media query). */
const narrow = (): boolean => typeof matchMedia === 'function' && matchMedia('(max-width: 799px)').matches;
const up = (n: Node): Node | null => (n as Element).assignedSlot ?? n.parentNode ?? (n as ShadowRoot).host ?? null;
type Tool = 'nodes' | 'add' | 'remove' | 'pen';
/** Grid spacing and snap reach in edit-size px (Free shape). */
const GRID = 10;
type Pending = { kind: 'pen'; path?: EditPath } | { kind: 'shape'; prim: PrimitiveKind; path: EditPath };
const LOCKED = [{ locked: true }];
const NONE: never[] = [];
const nm = (id: string): string => t(SIZE[id in SIZE ? id : 'custom']);
const sh = (id: string): string => t(SHORT[id in SHORT ? id : 'custom']);

interface Msg {
  id: string;
  tone: 'warn' | 'error' | 'info';
  text: string;
  conflict?: boolean;
}

export class McShapeStudio extends LitElement {
  static styles = studioStyles;
  /** Contract svg-editor revision 5: the Magic Card Utils panel checks this before it creates the element. */
  static contractRevision = 5;

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) value?: ShapeEditorValue;
  @property({ attribute: false }) customShapes?: Record<string, CustomShapeOptions>;
  @property({ type: Boolean }) libraryAvailable = true;
  /** 'mcu': hosted by the Magic Card Utils panel (own value, Save as shape, Close). */
  @property({ reflect: true }) host: 'card' | 'mcu' = 'card';
  /** Host 'mcu': the library shape being edited (its name and update time come from shapes_list). */
  @property() savedId?: string;
  /** "Edit as custom": the preset to start from (its name and `shape_options`). */
  @property({ attribute: false }) preset?: ShapeEditorPreset;
  /** What the shape is for, e.g. "Living room tile" (title). */
  @property() label = '';

  @state() doc: Doc = blankDoc();
  @state() size: EditSize = ROW;
  @state() ready = false;
  @state() failed = false;
  @state() together = false;
  @state() sel: CornerKey = 'tl';
  @state() pointSel?: number;
  @state() cvSel?: PathSelection;
  @state() tool: Tool = 'nodes';
  /** A pen outline being drawn, or a shape waiting to be combined: never in the config or the history. */
  @state() pending?: Pending;
  /** The Start from / Combine with window. */
  @state() picker?: { to: 'start' | 'combine' };
  /** The open menu (Outline actions in Free shape, or Export / Import); the element exists only while it is open. */
  @state() menu?: { kind: 'outline' | 'xfer'; items: UiMenuEntry[]; at?: Pt; touch: boolean; opener?: HTMLElement; anchor?: HTMLElement };
  /** The pending shape as it was when a scale drag began. */
  private tBase?: EditPath;
  /** The press that opened the menu (its segment and where). */
  private hit?: PathContext['hit'];
  @state() busy = '';
  @state() strip?: { text: string; undo: boolean };
  @state() canvas: 'idle' | 'loading' | 'ready' | 'fail' = 'idle';
  @state() cardView = true;
  @state() older = false;
  @state() showText = true;
  @state() panel: 'outline' | 'library' = 'outline';
  @state() sheet = false;
  @state() layout: 'wide' | 'mid' | 'compact' | 'stacked' = 'wide';
  @state() caption = '';
  @state() notice = '';
  @state() live = '';
  @state() side: 'draw' | 'messages' = 'draw';
  @state() msgOpen?: string;
  /** New warnings and errors, read out on their own so they never replace an action's own announcement. */
  @state() msgLive = '';
  private msgTimer?: ReturnType<typeof setTimeout>;
  /** The message window just closed: if its eye button is gone (the message was resolved), focus goes to the Messages tab. */
  private msgReturn = false;
  private seen = new Set<string>();
  @state() pvOpen = false;
  @state() helpOpen = false;
  @state() grid = false;
  @state() snapOn = false;
  @state() allChanged = false;
  @state() stageW = 0;
  @state() name = '';
  @state() saving = false;
  @state() saveName = '';
  @state() saveError = '';
  @state() saveBusy = false;
  @state() saved?: { id: string; name: string; updated_at: string; json: string };
  @state() openedId?: string;
  @state() lib: { state: LibState; items: SavedShape[]; q: string; hidden: Set<string> } = { state: 'idle', items: [], q: '', hidden: new Set() };
  @state() linked?: string;
  @state() leaving = false;
  @state() nameErr = false;
  @state() conflict = false;
  @state() mcuError = '';
  private openJson = '';
  /** The export / import panel (preset-transfer 1.0.0) through window.MagicCard.loadTransfer(). */
  @state() xfer?: { mode: 'import' | 'export'; back?: HTMLElement };

  E?: PathEdit;
  /** The draw generators of the path canvas chunk (the shape editor never imports src/path/draw). */
  D?: PathDraw;
  private baseline = '';
  private fromPath = false;
  private ptr = false;
  private glyphs: Record<string, string> = {};
  an: Preview[] = [];
  opts: CustomShapeOptions = {};
  initial: Doc = blankDoc();
  private past: Doc[] = [];
  private future: Doc[] = [];
  private base?: Doc;
  private mergeKey?: string;
  private mergeAt = 0;
  private raf?: number;
  private emitted = false;
  private sent = '';
  private liveSent = false;
  private anKey = '';
  private anLight = false;
  private opened = false;
  private escHinted = false;
  private drag?: { key: CornerKey; id: number; s0: number; u0: number };
  private ro?: ResizeObserver;
  private dialogs: HTMLDialogElement[] = [];
  private stopLib?: () => void;
  private trash?: { item: SavedShape; timer: ReturnType<typeof setTimeout> };
  private liveTimer?: ReturnType<typeof setTimeout>;
  private stripTimer?: ReturnType<typeof setTimeout>;
  private xferClosed = 0;
  /** What the toast's action button does (the toast element holds only the label). */
  private toastRun?: () => void;
  /** The control that had focus when a window opened: focus returns there. */
  private back?: HTMLElement;
  private roving = new RovingFocus({ items: '.pk', orientation: 'both' });

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    defineUiKit();
    if (this.hass) setI18nLocale(this.hass as unknown as LocaleHassLike);
    this.addEventListener('keydown', this.onKey);
    this.addEventListener('keydown', this.onEsc, true);
    // Home Assistant's dialog must not close on Escape (contract shell rule 2)
    for (let n: Node | null = up(this); n; n = up(n)) {
      if (n instanceof HTMLDialogElement) {
        n.addEventListener('cancel', this.onCancel);
        this.dialogs.push(n);
      }
    }
    if (typeof ResizeObserver !== 'undefined') (this.ro = new ResizeObserver(() => this.measure())).observe(this);
    this.stopLib = watchLibrary(() => (this.analyse(true), this.requestUpdate()));
    void this.boot();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.onKey);
    this.removeEventListener('keydown', this.onEsc, true);
    for (const d of this.dialogs) d.removeEventListener('cancel', this.onCancel);
    this.dialogs = [];
    this.ro?.disconnect();
    this.stopLib?.();
    this.flushDelete();
    clearTimeout(this.liveTimer);
    clearTimeout(this.stripTimer);
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private onCancel = (e: Event): void => e.preventDefault();

  async boot(): Promise<void> {
    this.failed = false;
    this.ready = await loadCustomShapes();
    this.failed = !this.ready;
    if (this.ready && !this.opened) {
      this.open();
      // Magic Card Utils, "New shape": a plain rectangle looks like nothing happened, so the Start from window opens once
      if (this.host === 'mcu' && !this.savedId && !this.preset && !Object.keys(this.value?.shape_options ?? {}).length) this.openPicker('start');
    }
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass) setI18nLocale(this.hass as unknown as LocaleHassLike);
    // the host feeds our own changes back through `value`: only something else (or a new preset) reopens
    const foreign = this.host !== 'mcu' && changed.has('value') && !!this.value && JSON.stringify(this.value.shape_options) !== this.sent;
    if (this.ready && this.opened && (foreign || changed.has('preset'))) this.open();
    if (['doc', 'size', 'ready', 'older', 'customShapes'].some((k) => changed.has(k))) this.analyse();
    const now = this.msgs();
    const key = (m: Msg): string => `${m.id}|${m.text}`;
    const fresh = now.find((m) => m.tone !== 'info' && !this.seen.has(key(m)));
    this.seen = new Set(now.map(key));
    if (fresh) {
      this.msgLive = `${fresh.tone === 'error' ? t('Error') : t('Warning')}: ${fresh.text}`;
      clearTimeout(this.msgTimer);
      this.msgTimer = setTimeout(() => (this.msgLive = ''), 4000);
    }
  }

  protected firstUpdated(): void {
    this.measure();
    this.shadowRoot?.querySelector<HTMLElement>('.layer')?.focus({ preventScroll: true });
  }

  protected updated(): void {
    if (this.msgOpen && !this.msgs().some((m) => m.id === this.msgOpen)) this.msgOpen = undefined;
    if (this.msgReturn && !this.back?.isConnected) {
      this.msgReturn = false;
      this.shadowRoot?.querySelector<HTMLElement>('.left [role=tab][aria-selected=true]')?.focus();
    }
    this.dataset.layout = this.layout;
    const sw = this.shadowRoot?.querySelector('.stage')?.clientWidth ?? 0;
    if (sw && sw !== this.stageW) this.stageW = sw;
    // a window opens the first time it renders; it closes through close() so focus goes back to its opener
    for (const w of this.shadowRoot?.querySelectorAll<UiWindowElement>('mc-ui-window:not([data-shown])') ?? []) {
      w.dataset.shown = '1';
      w.show();
    }
  }

  private measure(): void {
    const w = this.getBoundingClientRect().width || (typeof innerWidth === 'number' ? innerWidth : 1280);
    this.layout = w > 1180 ? 'wide' : w > 900 ? 'mid' : w > 640 ? 'compact' : 'stacked';
    if (this.layout !== 'compact') this.sheet = false;
  }

  // ── opening ──

  /** Take the document from `preset` or `value` (resolving a `ref` the way the card does). */
  open(): void {
    this.opened = true;
    this.past = [];
    this.future = [];
    this.base = undefined;
    this.caption = this.notice = '';
    this.linked = this.saved = this.openedId = undefined;
    this.emitted = false;
    this.size = ROW;
    if (!this.name && this.host !== 'mcu') this.name = t('Custom shape');
    let o: CustomShapeOptions = this.value?.shape_options ?? {};
    if (this.preset) {
      const st = presetToCustom(this.preset.shape, this.preset.shape_options, ROW.w, ROW.h);
      if (st) {
        o = st.options;
        const from = t(presetName(st.from));
        this.caption = this.startedCaption(from, st.note);
        this.name = t('{name} copy', { name: from });
      } else this.notice = t('Ticket, Wave and Blob can\'t be edited yet. Use the preset as it is.');
    } else if (o.ref) {
      const look = lookupFor(this.customShapes);
      this.linked = o.ref;
      if (!look.library(o.ref) && !look.inline(o.ref)) this.notice = t('Saved shape "{id}" was not found. This card uses its own copy.', { id: o.ref });
      o = resolveCustomShape(o, look);
    }
    this.doc = this.read(o);
    this.initial = this.doc;
    this.together = this.allSame();
    this.pointSel = this.cvSel = this.pending = this.picker = this.strip = undefined;
    this.tool = 'nodes';
    this.fromPath = this.doc.mode === 'path';
    this.baseline = JSON.stringify(this.doc.points);
    if (this.doc.mode === 'path') void this.ensureCanvas();
    this.analyse(true);
    this.openJson = JSON.stringify(this.options());
    this.leaving = this.nameErr = this.conflict = false;
    this.mcuError = '';
    if (this.host === 'mcu') {
      this.name = '';
      void this.loadLib().then(() => this.adopt());
    }
  }

  /** What the editor says it started from ("Edit as custom"): the notes are the model's `note` codes. */
  private startedCaption(name: string, note: string): string {
    if (note === 'bevel') return t('Started from Notch. Its corners are cut straight, so they start as Bevel.');
    if (note === 'path') return t('Started from {name}. It opens as a path, so you can move every point.', { name });
    if (note === 'ellipse') return t('Started from Circle. On a wide card the custom shape is a pill, not an ellipse.');
    return t('Started from {name}. Your changes make this shape custom.', { name });
  }

  /** Host 'mcu' Edit: take the name and update time of the library item behind `savedId`. */
  private adopt(): void {
    const it = this.savedId ? this.lib.items.find((i) => i.id === this.savedId) : undefined;
    if (!it) return;
    this.name = it.name;
    this.openedId = it.id;
    this.saved = { id: it.id, name: it.name, updated_at: it.updated_at, json: JSON.stringify(this.options()) };
  }

  /** "All corners together" only for a shape whose four corners are the same and not blank (a blank one opens on Each corner). */
  private allSame(): boolean {
    const c = this.doc.corners;
    return this.doc.mode === 'corners' && c.tl.type !== 'square' && KEYS.every((k) => same(c[k], c.tl));
  }

  private read(o: CustomShapeOptions): Doc {
    const { w, h } = this.size;
    return readDoc(o, w, h, (pts) => this.solve(pts), (x) => shapePath('custom', w, h, x as ShapeOptions)?.inset);
  }

  async ensureCanvas(): Promise<void> {
    if (this.canvas === 'ready') return;
    this.canvas = 'loading';
    const c = await loadPathCanvas();
    this.E = c?.pathEdit;
    this.D = c?.pathDraw;
    this.canvas = c ? 'ready' : 'fail';
  }

  // ── what the builder says ──

  /** Free space (px per side) inside the outline of these points at the edit size. */
  solve(points: Doc['points']): Sides {
    const { w, h } = this.size;
    const d = shapePath('custom', w, h, { points: writePoints(points) } as ShapeOptions)?.d;
    const sub = d ? parseClosed(d) : undefined;
    return sub ? solveSpace(flatten(sub, 16), w, h) : noSides();
  }

  /** The corner mode inset without `padding`: what "Extra space" can only raise. */
  private cornerInset(d: Doc): Sides | undefined {
    return d.mode === 'corners' ? shapePath('custom', this.size.w, this.size.h, writeDoc({ ...d, extra: noSides() }) as ShapeOptions)?.inset : undefined;
  }

  /** The `shape_options` of the document now. */
  options(d: Doc = this.doc): CustomShapeOptions {
    return writeDoc(d, this.cornerInset(d));
  }

  get sizes(): EditSize[] {
    return this.size.id === 'custom' ? [...SIZES, this.size] : SIZES;
  }

  analyse(force = false): void {
    if (!this.ready) return;
    this.opts = this.options();
    const key = JSON.stringify([this.opts, this.sizes, this.older]);
    const light = !!this.base;
    if (!force && key === this.anKey && light === this.anLight) return;
    this.anKey = key;
    this.anLight = light;
    const before = this.an;
    this.an = this.sizes.map((s) => {
      const r = shapePath('custom', s.w, s.h, this.opts as ShapeOptions) ?? { d: `M0 0H${s.w}V${s.h}H0Z`, inset: noSides() };
      const sub = parseClosed(r.d);
      const poly = sub ? flatten(sub, 16) : [];
      const old = light ? before.find((p) => p.id === s.id) : undefined;
      // the checks wait for the end of a drag (they cost a few milliseconds each)
      return { id: s.id, w: s.w, h: s.h, d: r.d, inset: r.inset, poly, cut: old ? old.cut : !!poly.length && isCut(poly, s.w, s.h, r.inset), cross: old ? old.cross : this.doc.mode === 'path' && selfCrosses(poly) };
    });
  }

  get cur(): Preview | undefined {
    return this.an.find((p) => p.id === this.size.id) ?? this.an[1];
  }

  // ── history and events ──

  /** A change in progress (a drag): shown and sent with commit false, no history step. */
  live_(next: Doc, label = ''): void {
    this.base ??= this.doc;
    this.doc = next;
    this.liveSent = true;
    this.raf ??= requestAnimationFrame(() => ((this.raf = undefined), this.send(false, label)));
  }

  /** A finished change: one history step; `merge` joins the steps of one gesture (typing in a field). */
  commit(next: Doc, label: string, merge?: string): void {
    const from = this.base ?? this.doc;
    this.base = undefined;
    this.doc = next;
    if (same(from, next)) return this.liveSent ? this.send(true, label) : undefined;
    const now = Date.now();
    if (!(merge && merge === this.mergeKey && now - this.mergeAt < 1000 && this.past.length)) {
      this.past.push(from);
      if (this.past.length > 100) this.past.shift();
    }
    this.mergeKey = merge;
    this.mergeAt = now;
    this.future = [];
    this.linked = undefined;
    this.notice = '';
    this.strip = undefined;
    this.send(true, label);
    this.say(label);
  }

  private send(commit: boolean, label: string): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = undefined;
    this.emitted = true;
    this.liveSent = false;
    this.fire({ value: { shape: 'custom', shape_options: this.options() }, commit, label });
  }

  private fire(detail: ShapeChangeDetail): void {
    this.sent = JSON.stringify(detail.value.shape_options);
    this.dispatchEvent(new CustomEvent('mc-shape-change', { detail, bubbles: true, composed: true }));
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  undo(): void {
    const p = this.past.pop();
    if (p) this.jump(p, t('Undo'), this.future);
  }

  redo(): void {
    const f = this.future.pop();
    if (f) this.jump(f, t('Redo'), this.past);
  }

  private jump(to: Doc, label: string, stack: Doc[]): void {
    stack.push(this.doc);
    this.doc = to;
    this.pending = this.picker = this.strip = undefined;
    this.tool = 'nodes';
    this.mergeKey = undefined;
    if (to.mode === 'path') void this.ensureCanvas();
    if (this.pointSel !== undefined && this.pointSel >= to.points.length) this.pointSel = undefined;
    this.send(true, label);
    this.say(label);
  }

  say(text: string): void {
    this.live = text;
    clearTimeout(this.liveTimer);
    this.liveTimer = setTimeout(() => (this.live = ''), 4000);
  }

  // ── keys ──

  private onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      // the canvas ends a drag and clears its selection first (and stops the event then); what reaches here is ours
      if (this.sheet) this.sheet = false;
      else if (this.pointSel !== undefined) this.selectPoint(undefined);
      else if (!this.escHinted) {
        this.escHinted = true;
        this.toastShow(this.host === 'mcu' ? t('Esc doesn\'t close the editor. Use Close.') : t('Esc doesn\'t close the editor. Use Done or Back to card editor.'));
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (!mod && !e.altKey && (key === 'v' || key === 'p') && this.doc.mode === 'path' && this.canvas === 'ready' && !FIELD.has((e.composedPath()[0] as Element)?.tagName)) return this.setTool(key === 'v' ? 'nodes' : 'pen');
    if (mod && key === 's') {
      e.preventDefault();
      this.openSave();
    } else if (mod && (key === 'z' || key === 'y') && !FIELD.has((e.composedPath()[0] as Element)?.tagName)) {
      e.preventDefault();
      if (key === 'y' || e.shiftKey) this.redo();
      else this.undo();
    }
  };

  // ── sizes ──

  setSize(s: EditSize): void {
    this.size = s;
    this.pointSel = undefined;
  }

  setDims(w: number, h: number): void {
    const f = (v: number, o: number): number => clamp(Math.round(Number.isFinite(v) ? v : o), 24, MAX_SIZE);
    const [cw, ch] = [f(w, this.size.w), f(h, this.size.h)];
    this.size = SIZES.find((s) => s.w === cw && s.h === ch) ?? { id: 'custom', w: cw, h: ch };
  }

  // ── corners ──

  /** Change one corner (all four while they are edited together). */
  editCorner(patch: Partial<Corner>, label: string, merge?: string): void {
    const corners = { ...this.doc.corners };
    for (const k of this.together ? KEYS : [this.sel]) corners[k] = { ...corners[k], ...patch };
    this.commit({ ...this.doc, corners }, label, merge);
    if (this.together) this.allChanged = true;
  }

  setTogether(on: boolean): void {
    this.together = on;
    this.allChanged = false;
    if (on && KEYS.some((k) => !same(this.doc.corners[k], this.doc.corners.tl))) this.commit({ ...this.doc, corners: cornersOf(this.doc.corners.tl) }, t('Applied Top left to all corners.'));
  }

  setCorners(corners: Doc['corners'], label: string): void {
    this.commit({ ...this.doc, corners }, label);
  }

  resetCorner(): void {
    const corners = { ...this.doc.corners };
    for (const k of this.together ? KEYS : [this.sel]) corners[k] = { ...this.initial.corners[k] };
    this.setCorners(corners, t('Reset'));
  }

  /** Extra space (corner mode) or the padding of a free path: only ever raised above what is computed. */
  setSpace(side: Side, v: number): void {
    const x = Math.max(0, Math.ceil(Number.isFinite(v) ? v : 0));
    const d = this.doc;
    this.commit(d.mode === 'path' ? { ...d, pad: { ...d.pad, [side]: Math.max(d.solver[side], x) } } : { ...d, extra: { ...d.extra, [side]: x } }, t('Extra space'), `sp-${side}`);
  }

  // corner handles on the drawing

  handleDown(e: PointerEvent, key: CornerKey): void {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const [u, v] = this.local(e, key);
    this.sel = key;
    this.drag = { key, id: e.pointerId, u0: u + v, s0: cornerPx(this.doc.corners[key], this.size.w, this.size.h) };
  }

  handleMove(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const [u, v] = this.local(e, d.key);
    const { w, h } = this.size;
    const px = clamp(d.s0 + u + v - d.u0, 0, Math.min(w, h));
    const corners = { ...this.doc.corners };
    for (const k of this.together ? KEYS : [d.key]) {
      const c = corners[k];
      corners[k] = { ...c, size: c.pct ? r1((px / Math.min(w, h)) * 100) : Math.round(px), type: c.type === 'square' ? 'round' : c.type };
    }
    this.live_({ ...this.doc, corners }, t('Size'));
  }

  handleUp(e: PointerEvent): void {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    this.drag = undefined;
    this.commit(this.doc, t('Size'));
  }

  /** The pointer in the corner's own frame (distance from its two sides, px). */
  private local(e: PointerEvent, key: CornerKey): [number, number] {
    const el = this.shadowRoot?.querySelector('svg.cv') as SVGSVGElement | null;
    const { w, h } = this.size;
    let [x, y] = [e.clientX, e.clientY];
    const ctm = el?.getScreenCTM?.();
    if (el && ctm && typeof DOMPoint !== 'undefined') {
      const p = new DOMPoint(x, y).matrixTransform(ctm.inverse());
      [x, y] = [p.x, p.y];
    } else if (el) {
      const r = el.getBoundingClientRect();
      const k = (w + 2 * PAD) / (r.width || 1);
      [x, y] = [(x - r.left) * k - PAD, (y - r.top) * k - PAD];
    }
    return [key === 'tl' || key === 'bl' ? x : w - x, key === 'tl' || key === 'tr' ? y : h - y];
  }

  // ── path mode ──

  get tab(): 'corners' | 'path' {
    return this.doc.mode;
  }

  /** The mode switch: Free shape turns the corners into points, Corners drops the points (one undo step each). */
  setMode(m: 'corners' | 'path'): void {
    if (m === this.doc.mode) return;
    // the switch is rebuilt for the other mode: a keyboard user on it stays on it (arrow keys switch and move together)
    const on = this.shadowRoot?.activeElement;
    const keep = on instanceof HTMLElement && on.getAttribute('role') === 'radio' && on.parentElement?.getAttribute('aria-label') === t('Shape type');
    const refocus = (): void => {
      if (keep) void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLElement>(`[aria-label="${t('Shape type')}"] [data-val="${m}"]`)?.focus());
    };
    this.dropPending();
    this.strip = undefined;
    if (m === 'path') return void this.toPath().then(refocus);
    this.pointSel = this.cvSel = this.picker = undefined;
    this.commit({ ...this.doc, mode: 'corners' }, t('Corners'));
    this.together = this.allSame();
    this.say(t('Corners.'));
    refocus();
  }

  async toPath(): Promise<void> {
    await this.ensureCanvas();
    if (!this.E) return;
    const { w, h } = this.size;
    const points = cornersToPoints(this.doc.corners, w, h, this.doc.smoothing);
    const solver = this.solve(points);
    this.fromPath = false;
    this.baseline = JSON.stringify(points);
    this.commit({ ...this.doc, mode: 'path', points, solver, pad: solver }, t('Free shape'));
    this.panel = 'outline';
    this.selectPoint(0);
    this.note(t('Corners turned into points. Undo brings them back.'), true, `${t('Corners turned into points. Undo brings them back.')} ${t('Free shape. {c, plural, one {# point} other {# points}}.', { c: points.length })}`);
  }

  /** The visible result line under the canvas (the live region says it once). */
  note(text: string, undo = false, say = text): void {
    this.strip = { text, undo };
    this.say(say);
    this.armStrip();
  }

  /** The result note clears 8 s after the last pointer or focus inside it (the next edit and a mode change clear it sooner). */
  armStrip(): void {
    clearTimeout(this.stripTimer);
    this.stripTimer = setTimeout(() => (this.strip = undefined), 8000);
  }

  holdStrip(): void {
    clearTimeout(this.stripTimer);
  }

  toastShow(text: string, action?: { label: string; run: () => void }): void {
    this.toastRun = action?.run;
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<UiToastElement>('mc-ui-toast')?.show({ text, action: action && { id: 'act', label: action.label } }));
  }

  toastHide(): void {
    this.toastRun = undefined;
    this.shadowRoot?.querySelector<UiToastElement>('mc-ui-toast')?.close();
  }

  /** Points changed since the switch: going back to Corners would lose them. */
  get edited(): boolean {
    return this.doc.mode === 'path' && (this.fromPath || JSON.stringify(this.doc.points) !== this.baseline);
  }

  get path(): EditPath {
    return toEditPath(this.doc.points, this.size.w, this.size.h);
  }

  selectPoint(i: number | undefined): void {
    this.pointSel = i;
    this.cvSel = i === undefined ? undefined : { path: 0, anchors: [i] };
  }

  /** Apply an edit-model operation to the path and take the points back. */
  editPath(fn: (e: PathEdit, p: EditPath) => EditPath, label: string, merge?: string): void {
    if (!this.E) return;
    const next = fn(this.E, this.path);
    if (next.anchors.length < 3 || next.anchors.length > MAX_SHAPE_POINTS) return;
    this.commitPoints(fromAnchors(this.doc.points, next.anchors, this.size.w, this.size.h), label, merge);
  }

  commitPoints(points: Doc['points'], label: string, merge?: string): void {
    this.commit(repad({ ...this.doc, points }, this.solve(points)), label, merge);
  }

  onPathChange(e: CustomEvent<PathChange>): void {
    e.stopPropagation();
    const { paths, commit, label } = e.detail;
    if (this.pending) return this.onPending(paths);
    const a = paths[0]?.anchors;
    if (!a) return;
    if (a.length > MAX_SHAPE_POINTS || a.length < 3) {
      if (a.length < 3) this.note(t('A shape needs at least 3 points.'));
      else this.say(t('A shape holds up to {max} points.', { max: MAX_SHAPE_POINTS }));
      return this.requestUpdate();
    }
    const points = fromAnchors(this.doc.points, a, this.size.w, this.size.h);
    if (commit) this.commitPoints(points, label);
    else if (label === 'Cancel') {
      this.base = undefined;
      this.doc = { ...this.doc, points };
      this.send(false, label);
    } else this.live_({ ...this.doc, points }, label);
  }

  onPathSelect(e: CustomEvent<PathSelection>): void {
    e.stopPropagation();
    this.cvSel = e.detail;
    // a pending pen outline or shape is path 1: it never selects a point of the outline
    if (this.pending) return;
    const i = e.detail?.anchors?.length ? e.detail.anchors[e.detail.anchors.length - 1] : undefined;
    this.pointSel = i;
    // Remove point: only a pointer press removes (walking over points with Tab selects them too)
    if (this.tool === 'remove' && this.ptr && i !== undefined && e.detail.anchors.length === 1) {
      this.ptr = false;
      queueMicrotask(() => this.deletePoint());
    }
  }

  /** Capture-phase press on the canvas: tells onPathSelect the selection came from a pointer. */
  ptrDown = { capture: true, handleEvent: (): void => void ((this.ptr = true), setTimeout(() => (this.ptr = false))) };

  // ── pen, picker, pending shape ──

  setTool(tool: Tool): void {
    if (tool === this.tool) return;
    this.dropPending(true);
    this.tool = tool;
    this.picker = undefined;
    if (tool === 'pen') {
      this.pending = { kind: 'pen' };
      this.pointSel = this.cvSel = undefined;
      this.say(t('Drawing a new outline. This replaces your shape when you finish.'));
    }
  }

  /** Drop the pen outline or the shape to combine (nothing was applied). */
  dropPending(say = false): void {
    const was = this.pending;
    if (!was) return;
    this.pending = undefined;
    this.cvSel = undefined;
    if (was.kind === 'pen') {
      this.tool = 'nodes';
      if (say) this.say(t('Pen cancelled.'));
    }
  }

  private onEsc = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || !this.pending) return;
    this.dropPending(true);
    e.preventDefault();
    e.stopPropagation();
  };

  private onPending(paths: EditPath[]): void {
    const p = this.pending;
    const path = paths[1];
    if (!p || !path) return;
    if (p.kind === 'pen') {
      if (path.anchors.length > MAX_SHAPE_POINTS) {
        this.say(t('A shape holds up to {max} points.', { max: MAX_SHAPE_POINTS }));
        return this.requestUpdate();
      }
      this.pending = { kind: 'pen', path };
      if (path.closed && path.anchors.length >= 3) this.finishPen();
    } else this.pending = { ...p, path };
  }

  finishPen(): void {
    const p = this.pending;
    if (p?.kind !== 'pen' || (p.path?.anchors.length ?? 0) < 3) return this.say(t('Add 3 points to finish.'));
    this.replaceOutline(p.path!.anchors, t('Replaced your outline.'));
  }

  /** Pen and Start from: the anchors become the outline with default anchoring, one history step. */
  private replaceOutline(anchors: Anchor[], text: string): void {
    this.pending = this.picker = this.cvSel = undefined;
    this.tool = 'nodes';
    const points = fromAnchors([], anchors, this.size.w, this.size.h);
    if (this.doc.mode === 'corners') {
      // Start from in Corners mode: the outline replaces the corners and the mode switches, in one undo step
      const solver = this.solve(points);
      this.fromPath = false;
      this.baseline = JSON.stringify(points);
      this.commit({ ...this.doc, mode: 'path', points, solver, pad: solver }, text);
      this.panel = 'outline';
    } else this.commitPoints(points, text);
    this.selectPoint(undefined);
    this.note(text, true);
  }

  /** Opens the Start from / Combine with window; the shapes come from the path canvas chunk, loaded now when it is not. */
  openPicker(to: 'start' | 'combine'): void {
    this.back = (this.shadowRoot?.activeElement as HTMLElement | null) ?? undefined;
    this.picker = { to };
    if (!this.D) void this.ensureCanvas();
  }

  /** Closes the windows through their own close(), so focus goes back to the opener. */
  closeWindows(): void {
    for (const w of this.shadowRoot?.querySelectorAll<UiWindowElement>('mc-ui-window') ?? []) if (w.open) w.close('action');
  }

  choose(kind: PrimitiveKind): void {
    const to = this.picker?.to;
    const { w, h } = this.size;
    if (!this.D) return;
    this.closeWindows();
    this.picker = undefined;
    if (to === 'start') {
      const free = this.doc.mode === 'path';
      this.replaceOutline(this.D.primitive(kind, { x: 0, y: 0, w, h }).anchors, free ? t('Started from {k}.', { k: t(PRIM[kind]) }) : t('Started from {k}. Switched to Free shape.', { k: t(PRIM[kind]) }));
      return;
    }
    this.dropPending();
    this.tool = 'nodes';
    this.pointSel = undefined;
    const path = this.D.primitive(kind, { x: w / 4, y: h / 4, w: w / 2, h: h / 2 });
    this.pending = { kind: 'shape', prim: kind, path };
    this.cvSel = { path: 1, anchors: [] };
    this.say(t('{k} ready to combine. Use the arrows or fields to place it.', { k: t(PRIM[kind]) }));
    void this.updateComplete.then(() => this.focusTo('#ox'));
  }

  /** Combine, Subtract or Intersect the outline (bottom) with the pending shape; the result stays one closed outline. */
  async boolean(op: string): Promise<void> {
    if (this.busy || this.pending?.kind !== 'shape') return;
    this.busy = op;
    const B = await loadPathBooleans();
    this.busy = '';
    const p = this.pending;
    if (p?.kind !== 'shape' || !this.E) return;
    if (!B) return this.note(t('Couldn\'t load the shape tools. Try again.'));
    const { w, h } = this.size;
    const r = B.run(op as BooleanOp, [this.path, p.path].map((x) => ({ paths: [x], fillRule: 'nonzero' as const })), { frame: { x: 0, y: 0, w, h } });
    if (!r.ok) return this.note(r.reason === 'too-complex' ? t('These shapes have too many points to combine. Nothing was changed.') : t('Nothing would be left of the shape. Nothing was changed.'));
    const o = B.singleOutline(r);
    const c = o.path.anchors.length;
    if (c > MAX_SHAPE_POINTS) return this.note(t('The result needs {c} points. A card shape can have {max}. Nothing was changed. Try a smaller or simpler shape.', { c: c, max: MAX_SHAPE_POINTS }));
    this.replaceOutline(o.path.anchors, [t('{op, select, union {Combined} subtract {Subtracted} other {Intersected}}. The outline has {c, plural, one {# point} other {# points}}.', { op, c }), o.droppedPieces ? t('Kept the largest piece. {c, plural, one {# smaller piece was} other {# smaller pieces were}} removed.', { c: o.droppedPieces }) : '', o.filledHoles ? t('Card shapes have one outline, so the hole was filled.') : ''].filter(Boolean).join(' '));
    void this.updateComplete.then(() => this.focusTo('[data-pick=combine]'));
  }

  /** The tile glyph: the kind drawn by the same generator in a 20 px box. */
  glyphOf(kind: PrimitiveKind): string {
    if (!this.glyphs[kind] && this.D && this.E) this.glyphs[kind] = toPathString([this.E.fromEdit(this.D.primitive(kind, { x: 1, y: 1, w: 18, h: 18 }))]);
    return this.glyphs[kind] ?? '';
  }

  /** Where the pending shape sits: the box round its curves. */
  get operandBox(): Box | undefined {
    const p = this.pending;
    if (p?.kind !== 'shape' || !p.path.anchors.length) return undefined;
    return this.E ? bounds([this.E.fromEdit(p.path)]) : undefined;
  }

  /** Move or resize the pending shape to this box (fields X, Y, W, H, Centre). */
  setOperand(patch: Partial<Box> | 'centre'): void {
    const p = this.pending;
    const b = this.operandBox;
    if (p?.kind !== 'shape' || !b || !this.E) return;
    const to: Box = patch === 'centre' ? { ...b, x: (this.size.w - b.w) / 2, y: (this.size.h - b.h) / 2 } : { ...b, ...patch };
    to.w = Math.max(1, to.w);
    to.h = Math.max(1, to.h);
    const [sx, sy] = [to.w / (b.w || 1), to.h / (b.h || 1)];
    this.pending = { ...p, path: this.E.transform(p.path, [sx, 0, 0, sy, to.x - b.x * sx, to.y - b.y * sy]) };
  }

  /** The pending shape's scale handles: the matrix applies to the shape saved at the start of the drag. */
  get transformBox(): TransformBox | undefined {
    const box = this.operandBox;
    return box ? { box, scale: true, rotate: false, keepRatio: true, bounds: { x: 0, y: 0, w: this.size.w, h: this.size.h } } : undefined;
  }

  onTransform(e: CustomEvent<PathTransform>): void {
    e.stopPropagation();
    const p = this.pending;
    const { matrix, commit, label, source } = e.detail;
    if (p?.kind !== 'shape' || !this.E) return;
    const from = source === 'pointer' ? (this.tBase ??= p.path) : p.path;
    this.pending = { ...p, path: this.E.transform(from, matrix) };
    if (commit || label === 'Cancel') this.tBase = undefined;
  }

  // ── Outline actions menu ──

  /** The entries for what was pressed: the pending shape, a point, a segment or the empty canvas. */
  menuItems(hit?: PathContext['hit']): MenuEntry[] {
    const m = (id: string, label: string, reason?: string): MenuEntry => ({ id, label, reason });
    if (this.pending?.kind === 'shape') return [...OPS.map(([k, label]) => m(k, t(label))), m('centre', t('Centre')), m('cancel', t('Cancel'))];
    const full = this.doc.points.length >= MAX_SHAPE_POINTS ? t('A shape holds up to {max} points.', { max: MAX_SHAPE_POINTS }) : undefined;
    const a = hit?.anchor === undefined ? undefined : this.path.anchors[hit.anchor];
    if (a) return [m('kind', a.in || a.out ? t('Corner') : t('Smooth')), m('after', t('Add point after'), full), m('remove', t('Remove point'), this.doc.points.length <= 3 ? t('A shape needs at least 3 points.') : undefined)];
    if (hit?.segment !== undefined) return [m('here', t('Add point here'), full)];
    return [m('start', t('Start from a shape...')), m('add', t('Add shape...')), m('pen', t('Pen'))];
  }

  openMenu(hit: PathContext['hit'], at: Pt, touch: boolean, opener?: HTMLElement): void {
    this.hit = hit;
    this.back = opener;
    this.menu = { kind: 'outline', items: this.menuItems(hit), at, touch, opener };
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLElement & { show(): void }>('mc-ui-menu')?.show());
  }

  onContext(e: CustomEvent<PathContext>): void {
    e.stopPropagation();
    const { hit, client, source } = e.detail;
    if (hit?.anchor !== undefined && !this.pending) this.selectPoint(hit.anchor);
    this.openMenu(hit, client, source === 'touch', this.shadowRoot?.querySelector<HTMLElement>('mc-path-canvas') ?? undefined);
  }

  /** The Export / Import menu under its top bar button. */
  openXferMenu(e: Event): void {
    const b = e.currentTarget as HTMLElement;
    if (this.menu?.kind === 'xfer') return void (this.menu = undefined);
    this.menu = {
      kind: 'xfer',
      touch: false,
      opener: b,
      anchor: b,
      items: [
        { id: 'export', label: t('Export file'), icon: 'mdi:file-export-outline' },
        { id: 'import', label: t('Import file'), icon: 'mdi:file-import-outline' },
        { id: 'yaml', label: t('Copy YAML'), glyph: 'copy' },
      ],
    };
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLElement & { show(): void }>('mc-ui-menu')?.show());
  }

  onPick(e: CustomEvent<{ id: string }>): void {
    e.stopPropagation();
    const id = e.detail.id;
    const h = this.hit;
    if (this.menu?.kind === 'xfer') {
      const from = this.menu.anchor;
      if (id === 'yaml') void this.copyText(toYaml(this.options()));
      else void this.openTransfer(id === 'export' ? 'export' : 'import', from);
      return;
    }
    if (OPS.some(([k]) => k === id)) void this.boolean(id);
    else if (id === 'centre') this.setOperand('centre');
    else if (id === 'cancel') this.dropPending(true);
    else if (id === 'kind') this.editPath((E, p) => E.toggleSmooth(p, h!.anchor!), t('Point type'));
    else if (id === 'after') this.addAfter(h?.anchor);
    else if (id === 'remove') this.deletePoint(h?.anchor);
    else if (id === 'here' && h?.segment !== undefined && h.at) this.addAfter(h.segment, segT(this.path, h.segment, h.at));
    else if (id === 'pen') this.setTool('pen');
    else if (id === 'start' || id === 'add') return void this.updateComplete.then(() => this.openPicker(id === 'start' ? 'start' : 'combine'));
    void this.updateComplete.then(() => this.focusTo('.stage mc-path-canvas'));
  }

  onFields(e: CustomEvent<{ anchor: number }>): void {
    e.stopPropagation();
    this.pointSel = e.detail.anchor;
    void this.updateComplete.then(() => this.focusTo('#fx'));
  }

  onLimit(e: Event): void {
    e.stopPropagation();
    this.say(t('A shape holds up to {max} points.', { max: MAX_SHAPE_POINTS }));
  }

  /** Keeps a dragged point (and its handles) inside the box, as the runtime does. */
  constrain = (pt: Pt): Pt => [clamp(pt[0], 0, this.size.w), clamp(pt[1], 0, this.size.h)];

  movePoint(i: number, x?: number, y?: number): void {
    this.editPath((E, p) => E.moveAnchor(p, i, x ?? p.anchors[i].x, y ?? p.anchors[i].y), t('Move point'), `pt-${i}`);
  }

  nudge(dx: number, dy: number, big: boolean): void {
    const i = this.pointSel;
    if (i === undefined) return;
    const a = this.path.anchors[i];
    const s = big ? 10 : 1;
    this.movePoint(i, clamp(a.x + dx * s, 0, this.size.w), clamp(a.y + dy * s, 0, this.size.h));
  }

  setHandle(i: number, which: 'in' | 'out', angle: number, len: number): void {
    const a: Anchor = this.path.anchors[i];
    const r = (angle * Math.PI) / 180;
    this.editPath((E, p) => E.setHandle(p, i, which, [a.x + Math.cos(r) * len, a.y + Math.sin(r) * len]), t(HANDLE[which]), `h-${i}-${which}`);
  }

  addAfter(i = this.pointSel, at = 0.5): void {
    if (i === undefined || !this.E) return;
    if (this.doc.points.length >= MAX_SHAPE_POINTS) return this.say(t('A shape holds up to {max} points.', { max: MAX_SHAPE_POINTS }));
    const r = this.E.insertAt(this.path, i, at);
    if (r.index < 0) return;
    this.commitPoints(fromAnchors(this.doc.points, r.path.anchors, this.size.w, this.size.h), t('Add point after'));
    this.selectPoint(r.index);
  }

  deletePoint(i = this.pointSel): void {
    if (i === undefined) return;
    if (this.doc.points.length <= 3) return this.note(t('A shape needs at least 3 points.'));
    this.editPath((E, p) => E.remove(p, i), t('Delete'));
    this.selectPoint(Math.max(0, i - 1));
    this.say(t('Point removed, {c, plural, one {# point} other {# points}}.', { c: this.doc.points.length }));
  }

  setAxis(i: number, axis: 'x' | 'y', a: Axis): void {
    this.commit({ ...this.doc, points: this.doc.points.map((p, j) => (j === i ? { ...p, [axis]: a } : p)) }, t('Advanced: how this point moves when the card resizes'), `ax-${i}-${axis}`);
  }

  /** Switch what a point is anchored to without moving it. */
  setAnchorKind(i: number, axis: 'x' | 'y', k: Axis['k']): void {
    const cur = this.doc.points[i][axis];
    const size = axis === 'x' ? this.size.w : this.size.h;
    if (cur.k !== k) this.setAxis(i, axis, withAbs({ k, v: 0 }, absOf(cur, size), size));
  }

  // ── library ──

  async loadLib(): Promise<void> {
    if (!this.libraryAvailable) return;
    this.lib = { ...this.lib, state: 'loading' };
    try {
      this.lib = { ...this.lib, state: 'ready', items: await listShapes(this.hass) };
    } catch (e) {
      this.lib = { ...this.lib, state: e instanceof LibraryError ? e.problem : 'unreachable' };
    }
  }

  showPanel(p: 'outline' | 'library'): void {
    this.panel = p;
    if (p === 'library' && this.lib.state === 'idle') void this.loadLib();
  }

  get items(): SavedShape[] {
    const q = this.lib.q.trim().toLowerCase();
    return this.lib.items.filter((i) => !this.lib.hidden.has(i.id) && (!q || i.name.toLowerCase().includes(q))).sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
  }

  get noLib(): boolean {
    return !this.libraryAvailable || this.lib.state === 'missing';
  }

  get dirtyFromSaved(): boolean {
    return !this.saved || this.saved.json !== JSON.stringify(this.options());
  }

  /** Replace the shape in the editor with a library item (one history step: undo brings the old one back). */
  openItem(item: SavedShape): void {
    this.commit(this.read(item.shape), t('Open'));
    this.together = this.allSame();
    this.name = item.name;
    this.openedId = item.id;
    this.saved = { id: item.id, name: item.name, updated_at: item.updated_at, json: JSON.stringify(item.shape) };
    this.caption = '';
    this.fromPath = this.doc.mode === 'path';
    this.baseline = JSON.stringify(this.doc.points);
    if (this.doc.mode === 'path') void this.ensureCanvas();
  }

  openSave(): void {
    if (this.noLib) return this.showPanel('library');
    this.saveName = this.name === t('Custom shape') ? '' : this.name;
    this.saveError = '';
    this.back = (this.shadowRoot?.activeElement as HTMLElement | null) ?? undefined;
    this.saving = true;
    if (this.lib.state === 'idle') void this.loadLib();
  }

  get existing(): SavedShape | undefined {
    const q = this.saveName.trim().toLowerCase();
    return q ? this.lib.items.find((i) => i.name.toLowerCase() === q) : undefined;
  }

  async doSave(): Promise<void> {
    const name = this.saveName.trim().slice(0, 40);
    const shape = this.options();
    if (!name || tooBig(shape)) {
      this.saveError = name ? t('This shape is too big for the library (8 KB).') : t('Give it a name.');
      return;
    }
    const ex = this.existing;
    this.saveBusy = true;
    this.saveError = '';
    try {
      const item = await saveShape(this.hass, { id: ex?.id ?? freeId(name, new Set(this.lib.items.map((i) => i.id))), name, shape }, ex?.updated_at);
      this.lib = { ...this.lib, items: [item, ...this.lib.items.filter((i) => i.id !== item.id)] };
      this.saved = { id: item.id, name: item.name, updated_at: item.updated_at, json: JSON.stringify(shape) };
      this.name = item.name;
      this.openedId = item.id;
      this.closeWindows();
      this.saving = false;
      this.toastShow(t('Saved to library as {name}. Press Done to use it on this card.', { name: item.name }), { label: t('Use on this card'), run: () => this.useSaved() });
    } catch (e) {
      const p = e instanceof LibraryError ? e.problem : 'unreachable';
      this.saveError = t(FAIL[p]) ?? t('Could not save {name}. Try again.', { name: name });
      if (p === 'missing' || p === 'readonly') this.lib = { ...this.lib, state: p };
    }
    this.saveBusy = false;
  }

  /** Make the card use the saved shape (a link, with the inline copy). */
  useSaved(): void {
    const s = this.saved;
    if (!s) return;
    this.emitted = true;
    this.linked = s.id;
    this.toastHide();
    this.fire({ value: { shape: 'custom', shape_options: { ref: s.id } }, customShapes: { [s.id]: this.options() }, commit: true, label: t('Use on this card') });
    this.say(t('Shape applied to {target}', { target: this.label || t('Shape editor') }));
  }

  /** Delete after the snackbar: hidden at once, removed for good when the undo time runs out. */
  removeItem(item: SavedShape): void {
    this.flushDelete();
    this.lib = { ...this.lib, hidden: new Set([...this.lib.hidden, item.id]) };
    this.trash = { item, timer: setTimeout(() => this.flushDelete(), 10000) };
    this.toastShow(t('Deleted {name}. Cards that use it keep their inline copy.', { name: item.name }), { label: t('Undo'), run: this.undoRun });
  }

  private undoRun = (): void => this.undoDelete();

  private undoDelete(): void {
    if (!this.trash) return;
    clearTimeout(this.trash.timer);
    this.unhide(this.trash.item.id);
    this.trash = undefined;
    this.toastHide();
  }

  private unhide(id: string, drop = false): void {
    const hidden = new Set(this.lib.hidden);
    hidden.delete(id);
    this.lib = { ...this.lib, hidden, items: drop ? this.lib.items.filter((i) => i.id !== id) : this.lib.items };
  }

  private flushDelete(): void {
    const p = this.trash;
    if (!p) return;
    clearTimeout(p.timer);
    this.trash = undefined;
    deleteShape(this.hass, p.item.id).then(
      () => this.unhide(p.item.id, true),
      () => this.unhide(p.item.id),
    );
    if (this.toastRun === this.undoRun) this.toastHide();
  }

  async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.say(t('Copied'));
    } catch {
      this.say(text);
    }
  }

  // ── export / import file (preset-transfer) ──

  async openTransfer(mode: 'import' | 'export', back?: HTMLElement): Promise<void> {
    try {
      const load = (window as unknown as { MagicCard?: Partial<MagicCardEditorWindowAdditions> }).MagicCard?.loadTransfer;
      if (!load) throw new Error('no loader');
      await load();
      this.back = back;
      this.xfer = { mode, back };
    } catch {
      this.toastShow(t('Could not load the export and import tool. Try again.'));
    }
  }

  closeTransfer(): void {
    this.closeWindows();
    this.xfer = undefined;
  }

  private get exportItems(): { kind: 'shape'; items: TransferItem<'shape'>[] } {
    const name = this.name.trim() || t('Custom shape');
    const data: CustomShapeOptions = { ...this.options() };
    delete data.ref;
    return { kind: 'shape', items: [{ id: this.saved?.id ?? slug(name), name, data }] };
  }

  /** The first shape of the file becomes the document, as one undoable change. */
  importItems(items: TransferItem[]): void {
    const it = items[0];
    this.closeTransfer();
    if (!it) return;
    const d = this.read(it.data as CustomShapeOptions);
    this.name = it.name || this.name;
    this.together = false;
    this.pointSel = this.cvSel = undefined;
    this.commit(d, t('Imported {name}', { name: it.name }));
    this.together = this.allSame();
    if (d.mode === 'path') void this.ensureCanvas();
    if (items.length > 1) this.say(t('Only the first of {c} shapes in the file was used.', { c: items.length }));
  }

  // ── leaving ──

  done(): void {
    if (this.preset && !this.emitted) this.send(true, t('Shape applied to {target}', { target: this.label || t('Shape editor') }));
    this.leave(true);
  }

  get mcuDirty(): boolean {
    return JSON.stringify(this.options()) !== (this.saved?.json ?? this.openJson);
  }

  /** Host 'mcu': Close asks first when there is unsaved work. */
  close(): void {
    if (!this.mcuDirty) return this.leave(false);
    this.back = (this.shadowRoot?.activeElement as HTMLElement | null) ?? undefined;
    this.leaving = true;
  }

  /** Host 'mcu': Save as shape. `asCopy` after a conflict: a new id, no base time. */
  async saveMcu(asCopy = false): Promise<void> {
    const name = this.name.trim().slice(0, 80);
    if (!name) {
      this.nameErr = true;
      this.focusTo('.topbar .name input');
      return;
    }
    const shape = this.options();
    if (tooBig(shape)) {
      this.mcuError = t('This shape is too big for the library (8 KB).');
      return;
    }
    if (this.saveBusy) return;
    this.saveBusy = true;
    this.mcuError = '';
    this.conflict = false;
    try {
      if (this.lib.state !== 'ready') await this.loadLib();
      const keep = asCopy ? undefined : this.saved;
      const id = keep?.id ?? freeId(name, new Set(this.lib.items.map((i) => i.id)));
      const item = await saveShape(this.hass, { id, name, shape }, keep?.updated_at);
      this.lib = { ...this.lib, items: [item, ...this.lib.items.filter((i) => i.id !== item.id)] };
      this.saved = { id: item.id, name: item.name, updated_at: item.updated_at, json: JSON.stringify(shape) };
      this.openedId = item.id;
      this.name = item.name;
      this.say(t('Saved'));
      this.dispatchEvent(new CustomEvent('mc-shape-save', { detail: { saved: item }, bubbles: true, composed: true }));
    } catch (e) {
      const p = e instanceof LibraryError ? e.problem : 'unreachable';
      if (p === 'conflict') this.conflict = true;
      else this.mcuError = t(FAIL[p]) ?? t('Could not save {name}. Try again.', { name: name });
    }
    this.saveBusy = false;
  }

  /** Conflict: fetch the item again and show the stored version. */
  async reloadMcu(): Promise<void> {
    this.conflict = false;
    await this.loadLib();
    const it = this.lib.items.find((i) => i.id === this.saved?.id);
    if (it) this.openItem(it);
  }

  leave(done: boolean): void {
    this.flushDelete();
    this.dispatchEvent(new CustomEvent('mc-shape-close', { detail: { done }, bubbles: true, composed: true }));
  }

  /** The layer is modal: a sentinel at each end sends Tab to the last or first control instead of out into the page. */
  private wrapFocus(end: boolean): void {
    const all = [...this.shadowRoot!.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')];
    const list = all.filter((el) => !el.classList.contains('sentinel') && !el.closest('[hidden]') && el.getClientRects().length > 0);
    (end ? list[list.length - 1] : list[0])?.focus();
  }

  focusTo(sel: string): void {
    this.shadowRoot?.querySelector<HTMLElement>(sel)?.focus();
  }

  // ── render ──

  // prettier-ignore
  protected render(): TemplateResult {
    const title = this.label ? t('Shape for {target}', { target: this.label }) : t('Shape editor');
    const inPath = this.tab === 'path';
    return html`<div class="layer" lang=${locale()} role="dialog" aria-modal="true" aria-label=${title} tabindex="-1" data-layout=${this.layout}>
<span class="sentinel" tabindex="0" @focus=${() => this.wrapFocus(true)}></span>
<div class="skips">${btn(t('Skip to canvas'), () => this.focusTo('.stage mc-path-canvas, .stage svg'))}${this.pointSel !== undefined ? btn(t('Skip to point fields'), () => this.focusTo('#fx')) : nothing}${btn(t('Skip to inspector'), () => this.focusTo('.insp button, .insp input'))}</div>
${this.top(title)}
${!this.ready ? html`<div class="msg" role=${this.failed ? 'alert' : 'status'}>${this.failed ? html`<p>${t('The shape editor could not load. Check your connection and try again.')}</p>${btn(t('Try again'), () => void this.boot())}` : t('Loading the shape editor')}</div>` : html`<div class="work">
<aside class="left ${this.sheet ? 'sheet' : ''}" aria-label=${this.side === 'messages' ? t('Messages') : inPath ? t('Points') : t('Outline')}>${this.sideTabs()}${this.side === 'messages' ? this.msgList() : html`${this.host === 'mcu' ? nothing : seg('', [['outline', inPath ? t('Points') : t('Outline')], ['library', t('Library')]], this.panel, (p) => this.showPanel(p), true)}${this.panel === 'library' ? this.libPanel() : inPath && this.doc.mode === 'path' ? this.pointRows() : this.cornerRows()}`}</aside>
<main class="center"><div class="stagewrap">${inPath ? this.rail() : nothing}${this.stage()}</div></main>
<aside class="insp" aria-label=${t('Inspector')}>${inPath ? this.pathInspector() : this.cornersInspector()}</aside>
</div>`}
${this.menu ? html`<mc-ui-menu .items=${this.menu.items} .label=${this.menu.kind === 'xfer' ? t('Export / Import') : t('Outline actions')} .at=${this.menu.at} .anchor=${this.menu.anchor} .align=${this.menu.anchor ? 'end' : 'start'} .touch=${this.menu.touch} .opener=${this.menu.opener} @mc-menu-pick=${(e: CustomEvent<{ id: string }>) => this.onPick(e)} @mc-menu-close=${(e: CustomEvent<{ reason: string }>) => this.onMenuClose(e)}></mc-ui-menu>` : nothing}
<mc-ui-popover id="pv-pop" .label=${t('Preview')} @mc-popover-close=${() => (this.pvOpen = false)}>${this.pvOpen ? this.previews() : nothing}</mc-ui-popover>
<mc-ui-popover id="help-pop" .label=${t('Shortcuts')} align="end" @mc-popover-close=${() => (this.helpOpen = false)}>${this.helpOpen ? this.shortcuts() : nothing}</mc-ui-popover>
${this.msgOpen ? this.msgWin() : nothing}${this.picker ? this.pickerWin() : nothing}${this.saving ? this.saveWin() : nothing}${this.leaving ? this.leaveWin() : nothing}${this.xfer ? this.xferWin() : nothing}
<mc-ui-toast @mc-toast-action=${() => (this.toastRun?.(), this.toastHide())}></mc-ui-toast><div class="sr-only" role="status" aria-live="polite">${this.live}</div><div class="sr-only" role="status" aria-live="polite" id="msglive">${this.msgLive}</div>
<span class="sentinel" tabindex="0" @focus=${() => this.wrapFocus(false)}></span></div>`;
  }

  private onMenuClose(e: CustomEvent<{ reason: string }>): void {
    e.stopPropagation();
    // the menu button toggles: its own press closes the menu (reason outside), the click that follows must not open it again
    if (this.menu?.kind === 'xfer') this.xferClosed = e.detail.reason === 'outside' ? Date.now() : 0;
    this.menu = undefined;
  }

  /** Opens or closes an anchored popover (Preview, Shortcuts) under the button that was pressed. */
  private togglePop(e: Event, which: 'pv' | 'help'): void {
    const pop = this.shadowRoot?.querySelector<UiPopoverElement>(`#${which}-pop`);
    if (!pop) return;
    pop.anchor = e.currentTarget as HTMLElement;
    if (pop.open) pop.close('action');
    else {
      this[which === 'pv' ? 'pvOpen' : 'helpOpen'] = true;
      pop.show();
    }
  }

  // prettier-ignore
  private top(title: string): TemplateResult {
    const mcu = this.host === 'mcu';
    const actions: KitButtonOptions[] = [];
    // narrow window or 200 % zoom: shorter words, Export / Import as a glyph, the title for screen readers only (styles.ts), so the bar needs one or two rows
    const tight = this.layout === 'compact' || this.layout === 'stacked';
    if (this.layout === 'compact') actions.push({ label: `${this.tab === 'path' ? t('Points') : t('Outline')}${this.msgCount() ? ` (${this.msgCount()})` : ''}`, expanded: this.sheet, onClick: () => (this.sheet = !this.sheet) });
    actions.push({ label: t('Export / Import'), icon: 'mdi:swap-vertical', iconOnly: tight, haspopup: 'menu', expanded: this.menu?.kind === 'xfer', onClick: (e) => (Date.now() - this.xferClosed < 400 ? (this.xferClosed = 0) : this.openXferMenu(e)) });
    if (mcu) actions.push({ label: t('Save'), variant: 'primary', disabledReason: this.saveBusy ? t('Working...') : undefined, onClick: () => void this.saveMcu() });
    else actions.push({ label: t('Save to library'), onClick: () => this.openSave() }, { label: t('Done'), variant: 'primary', onClick: () => this.done() });
    return topBar({
      back: { label: mcu ? t('Close') : tight ? t('Back') : t('Back to card editor'), onClick: () => (mcu ? this.close() : this.leave(false)) },
      title,
      name: { label: t('Shape name'), placeholder: mcu ? t('Shape name') : undefined, value: this.name, error: mcu && this.nameErr ? t('Give the shape a name.') : undefined, onInput: (v) => ((this.name = v), (this.nameErr = false)) },
      undo: { label: t('Undo'), glyph: 'undo', keys: 'Control+Z', disabledReason: this.canUndo ? undefined : t('Nothing to undo'), onClick: () => this.undo() },
      redo: { label: t('Redo'), glyph: 'redo', keys: 'Control+Shift+Z', disabledReason: this.future.length ? undefined : t('Nothing to redo'), onClick: () => this.redo() },
      actions,
      help: { label: t('Shortcuts'), glyph: 'helpCircle', haspopup: 'dialog', expanded: this.helpOpen, controls: 'help-pop', onClick: (e) => this.togglePop(e, 'help') },
    });
  }

  /** Every warning and error of the editor, in the order they are shown in Messages. */
  private msgs(): Msg[] {
    const out: Msg[] = [];
    if (this.host === 'mcu') {
      if (this.conflict) out.push({ id: 'conflict', tone: 'warn', text: t('This shape was changed somewhere else.'), conflict: true });
      else if (this.mcuError) out.push({ id: 'mcu', tone: 'error', text: this.mcuError });
    }
    if (this.notice) out.push({ id: 'notice', tone: 'warn', text: this.notice });
    else if (this.linked) out.push({ id: 'linked', tone: 'info', text: t('Linked to the saved shape "{id}". Your edits make it this card\'s own shape.', { id: this.linked }) });
    for (const p of this.an) {
      if (p.cut && (this.doc.mode === 'path' || p.id === this.size.id)) out.push({ id: `cut-${p.id}`, tone: 'warn', text: this.doc.mode === 'path' ? t('The outline cuts into the text area at {where}. Raise Extra space, or give the card a minimum height.', { where: sh(p.id) }) : t('The corners cut into the text area. Raise the extra space or make corners smaller.') });
      if (p.cross) out.push({ id: `cross-${p.id}`, tone: 'warn', text: t('The outline crosses itself at {where}.', { where: sh(p.id) }) });
    }
    return out;
  }

  private msgCount(): number {
    return this.msgs().filter((m) => m.tone !== 'info').length;
  }

  /** The left sidebar's tabs: Draw (the panels) and Messages (with a count). The tab is never switched for the user. */
  private sideTabs(): TemplateResult {
    const n = this.msgCount();
    return seg(t('Sidebar'), [['draw', t('Draw')], ['messages', n ? `${t('Messages')} (${n})` : t('Messages')]], this.side, (v) => (this.side = v), true);
  }

  // prettier-ignore
  private msgList(): TemplateResult {
    const list = this.msgs();
    if (!list.length) return html`<p class="help">${t('No messages.')}</p>`;
    const kind = (m: Msg): string => (m.tone === 'error' ? t('Error') : m.tone === 'warn' ? t('Warning') : t('Note'));
    return html`<div class="mlist">${list.map((m) => html`<div class="notice mrow ${m.tone}"><span class="sr-only">${kind(m)}: </span>${kitGlyph(m.tone === 'info' ? 'information' : 'alertCircle', 20)}<span class="ell" title=${m.text}>${m.text}</span>${button({ label: t('Show full message'), glyph: 'eyeOn', iconOnly: true, size: 'sm', onClick: (e) => ((this.back = e.currentTarget as HTMLElement), (this.msgOpen = m.id)) })}</div>`)}</div>`;
  }

  // prettier-ignore
  private msgWin(): TemplateResult | typeof nothing {
    const m = this.msgs().find((x) => x.id === this.msgOpen);
    if (!m) return nothing;
    const heading = m.tone === 'error' ? t('Error') : m.tone === 'warn' ? t('Warning') : t('Note');
    const foot = html`${m.conflict ? html`${btn(t('Save as a copy'), () => (this.closeWindows(), void this.saveMcu(true)))}${btn(t('Reload'), () => (this.closeWindows(), void this.reloadMcu()))}` : nothing}${btn(t('Close'), () => this.closeWindows(), { variant: 'primary', size: 'md' })}`;
    return this.win(heading, html`<p>${m.text}</p>`, foot, { size: 's', onClose: () => ((this.msgOpen = undefined), (this.msgReturn = true), setTimeout(() => (this.msgReturn = false), 1500)) });
  }

  // ── windows ──

  /** One window of the ui kit: title, body and a footer of buttons; movable, resizable and maximisable (an alert has no grips). */
  // prettier-ignore
  private win(heading: string, body: TemplateResult, foot: TemplateResult | typeof nothing, o: { size?: 's' | 'm' | 'l'; variant?: 'dialog' | 'picker'; initialFocus?: string; onClose: () => void }): TemplateResult {
    return html`<mc-ui-window variant=${o.variant ?? 'dialog'} size=${o.size ?? nothing} heading=${heading} closeLabel=${t('Close')} movable resizable maximizable moveLabel=${t('Move window')} resizeLabel=${t('Resize window')} maximizeLabel=${t('Maximise')} restoreLabel=${t('Restore size')} initialFocus=${o.initialFocus ?? nothing} .opener=${this.back} @mc-window-close=${(e: Event) => (e.stopPropagation(), o.onClose())}>${body}${foot === nothing ? nothing : html`<div slot="footer" class="foot">${foot}</div>`}</mc-ui-window>`;
  }

  // prettier-ignore
  private leaveWin(): TemplateResult {
    return html`<mc-ui-window variant="alert" heading=${t('Leave without saving?')} closeLabel=${t('Close')} initialFocus="keep" .opener=${this.back} @mc-window-close=${(e: Event) => (e.stopPropagation(), (this.leaving = false))}>
<p>${t('Changes since the last save are lost.')}</p>
<div slot="footer" class="foot"><button type="button" id="keep" class="btn btn-secondary" @click=${() => this.closeWindows()}>${t('Keep editing')}</button><button type="button" class="btn btn-danger" @click=${() => (this.closeWindows(), this.leave(false))}>${t('Leave')}</button></div></mc-ui-window>`;
  }

  // prettier-ignore
  private saveWin(): TemplateResult {
    const ex = this.existing;
    const asNew = this.openedId && ex?.id === this.openedId;
    const body = html`<div class="dlg" @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), void this.doSave())}>
<label class="field"><span class="fl">${t('Name')}</span><input class="input" id="sn" type="text" maxlength="40" aria-describedby="se" .value=${this.saveName} @input=${(e: Event) => (this.saveName = (e.target as HTMLInputElement).value)} /></label>
<p class="help">${t('Short, no slashes. Shown in the list.')}</p>${ex ? html`<p class="help">${t('A shape named {name} exists. Saving changes every card that uses it.', { name: ex.name })}</p>` : nothing}<p class="help error" id="se" role="alert">${this.saveError}</p></div>`;
    const foot = html`${btn(t('Cancel'), () => this.closeWindows())}${asNew ? btn(t('Save as new'), () => ((this.saveName = t('{name} copy', { name: ex!.name })), this.focusTo('#sn'))) : nothing}${btn(ex ? t('Update "{name}"', { name: ex.name }) : t('Save'), () => void this.doSave(), { variant: 'primary', size: 'md', disabledReason: this.saveBusy ? t('Working...') : undefined })}`;
    return this.win(t('Save to library'), body, foot, { initialFocus: 'sn', onClose: () => (this.saving = false) });
  }

  // prettier-ignore
  private xferWin(): TemplateResult {
    const x = this.xfer!;
    const body = html`<mc-transfer-panel .host=${'shape-editor'} .mode=${x.mode} .exportItems=${x.mode === 'export' ? this.exportItems : undefined} .hasLibrary=${!this.noLib}
@mc-transfer-close=${() => this.closeTransfer()} @mc-transfer-import=${(e: CustomEvent<{ items: TransferItem[] }>) => (e.stopPropagation(), this.importItems(e.detail.items))}></mc-transfer-panel>`;
    return this.win(x.mode === 'export' ? t('Export file') : t('Import file'), body, nothing, { size: 'l', onClose: () => (this.xfer = undefined) });
  }

  /** Start from and Combine with: the groups of shapes as tiles. A tile starts the action at once; arrows only move focus. */
  // prettier-ignore
  private pickerWin(): TemplateResult {
    const p = this.picker!;
    const start = p.to === 'start';
    const group = (name: string, count: number, tiles: TemplateResult): TemplateResult => html`<section class="pgroup"><div class="pgroup-head"><h3>${name}</h3>${chip({ label: String(count), tone: 'count' })}</div>${tiles}</section>`;
    const tile = (val: string, i: number, label: string, pic: TemplateResult, run: () => void): TemplateResult => html`<button type="button" class="tile pk" data-val=${val} tabindex=${i === 0 ? 0 : -1} @click=${run}><span class="thumb">${pic}</span><span>${label}</span></button>`;
    const grid = (name: string, items: TemplateResult[]): TemplateResult => html`<div class="tiles" role="group" aria-label=${name} @keydown=${this.pickKey}>${items}</div>`;
    const shapes = this.D && this.E
      ? grid(t('Shapes'), PRIMITIVE_KINDS.map((k, i) => tile(k, i, t(PRIM[k]), html`<svg viewBox="0 0 20 20" aria-hidden="true"><path d=${this.glyphOf(k)} /></svg>`, () => this.choose(k))))
      : this.canvas === 'fail' ? html`<p class="help" role="alert">${t('The path editor could not load. Check your connection and try again.')}</p>${btn(t('Try again'), () => void this.ensureCanvas())}` : html`<p class="help" role="status">${t('Loading the shape editor')}</p>`;
    const body = html`<div class="dlg">${start ? html`<p class="help">${t('Replaces your current outline. Undo brings it back.')}</p>` : nothing}
${start && this.doc.mode === 'corners' ? group(t('Corner styles'), STARTERS.length, grid(t('Corner styles'), STARTERS.map((s, i) => tile(s.id, i, t(STARTER[s.id]), glyph(s.corners().tl.type), () => this.applyStarter(s.id))))) : nothing}
${group(t('Shapes'), PRIMITIVE_KINDS.length, shapes)}</div>`;
    return this.win(start ? t('Start from a shape') : t('Combine with'), body, btn(t('Cancel'), () => this.closeWindows()), { variant: 'picker', onClose: () => (this.picker = undefined) });
  }

  /** Arrows move focus through the tiles in two dimensions (a tile starts the action only when pressed); Home and End jump. */
  private pickKey = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const els = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.pk')];
    const cur = els.indexOf(e.composedPath().find((x) => els.includes(x as HTMLElement)) as HTMLElement);
    const row = els.findIndex((el) => el.offsetTop !== els[0].offsetTop);
    const cols = row > 0 ? row : coarse() ? 3 : 4;
    const to = { ArrowRight: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur + cols, ArrowUp: cur - cols, Home: 0, End: els.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    this.roving.focus(els, clamp(to, 0, els.length - 1));
  };

  applyStarter(id: string): void {
    const s = STARTERS.find((x) => x.id === id);
    if (!s) return;
    this.closeWindows();
    this.together = s.id !== 'two';
    this.commit({ ...this.doc, mode: 'corners', corners: s.corners() }, t(STARTER[s.id]));
  }

  // ── canvas area ──

  /** The tool rail (Free shape): Select, Add point, Remove point, Pen. */
  // prettier-ignore
  private rail(): TemplateResult {
    const T: Array<[Tool, string, string, string?]> = [['nodes', t('Select'), 'mdi:cursor-default', 'V'], ['add', t('Add point'), 'mdi:vector-polyline-plus'], ['remove', t('Remove point'), 'mdi:vector-polyline-minus'], ['pen', t('Pen'), 'mdi:fountain-pen-tip', 'P']];
    return toolbar({ label: t('Free shape tools'), orientation: narrow() ? 'horizontal' : 'vertical', kind: 'rail', items: T.map(([k, label, icon, keys]) => ({ label, icon, iconOnly: true, keys, pressed: this.tool === k, onClick: () => this.setTool(k) })) });
  }

  /** The float toolbar over the canvas: Preview, Start from, Combine, Grid and Snap. Icons only on a narrow layer. */
  // prettier-ignore
  private floatBar(): TemplateResult {
    const free = this.doc.mode === 'path';
    const iconOnly = this.layout === 'compact' || this.layout === 'stacked';
    const items: Array<KitButtonOptions | 'divider'> = [
      { label: t('Preview'), glyph: 'eyeOn', iconOnly, haspopup: 'dialog', expanded: this.pvOpen, controls: 'pv-pop', onClick: (e) => this.togglePop(e, 'pv') },
      'divider',
      { label: t('Start from...'), icon: 'mdi:shape-outline', iconOnly, haspopup: 'dialog', onClick: () => this.openPicker('start') },
    ];
    if (free) items.push(
      { label: t('Combine...'), icon: 'mdi:vector-combine', iconOnly, haspopup: 'dialog', onClick: () => this.openPicker('combine') },
      'divider',
      { label: t('Grid'), icon: 'mdi:grid', iconOnly, pressed: this.grid, onClick: () => (this.grid = !this.grid) },
      { label: t('Snap'), icon: 'mdi:magnet', iconOnly, pressed: this.snapOn, onClick: () => (this.snapOn = !this.snapOn) },
    );
    return html`<div class="float">${toolbar({ label: t('Canvas tools'), orientation: 'horizontal', kind: 'float', items })}</div>`;
  }

  /** The drawing: corner mode is the runtime outline with corner handles, path mode is the shared canvas. */
  // prettier-ignore
  private stage(): TemplateResult {
    const { w, h } = this.size;
    const cur = this.cur;
    if (this.doc.mode === 'path') {
      if (this.canvas !== 'ready') return html`<div class="stage">${this.floatBar()}<div class="empty-stage" role=${this.canvas === 'fail' ? 'alert' : 'status'}>${this.canvas === 'fail' ? html`<div>${t('The path editor could not load. Check your connection and try again.')} ${btn(t('Try again'), () => void this.ensureCanvas())}</div>` : t('Loading the shape editor')}</div></div>`;
      return html`<div class="stage"><mc-path-canvas aria-label=${t('Shape editor')} aria-describedby="hint" loupeLabel=${t('at {name}', { name: sh(this.size.id) })}
.frame=${{ x: 0, y: 0, w, h }} @pointerdown=${this.ptrDown} .paths=${this.pending?.path ? [this.path, this.pending.path] : [this.path]} .paint=${this.pending ? LOCKED : NONE} .selection=${this.cvSel} .mode=${this.cvMode} .maxPaths=${this.pending ? 2 : 1} .kinds=${['corner', 'smooth', 'symmetric']} .snap=${{ enabled: this.snapOn, grid: GRID, anchors: false, frame: true }} .pixelGrid=${this.grid} .gridStep=${GRID}
.nudge=${1} .bigNudge=${10} .fineNudge=${0.1} .constrain=${this.constrain} .transform=${this.transformBox} .contextMenu=${this.pending?.kind !== 'pen'}
@mc-path-transform=${(e: CustomEvent<PathTransform>) => this.onTransform(e)} @mc-path-context=${(e: CustomEvent<PathContext>) => this.onContext(e)} @mc-path-change=${(e: CustomEvent<PathChange>) => this.onPathChange(e)} @mc-path-select=${(e: CustomEvent<PathSelection>) => this.onPathSelect(e)} @mc-path-fields=${(e: CustomEvent<{ anchor: number }>) => this.onFields(e)} @mc-path-limit=${(e: Event) => this.onLimit(e)}></mc-path-canvas>${this.floatBar()}<span class="sr-only" id="hint">${this.pending?.kind === 'pen' ? t('Click or tap to add points. Drag to curve.') : this.tool === 'add' ? t('Click on the outline to add a point.') : this.tool === 'remove' ? t('Click a point to remove it.') : t('Tab into the canvas. [ and ] choose a point. Arrows move it.')}</span>${this.dock()}</div>`;
    }
    const k = this.stageW ? this.stageW / (w + 2 * PAD) : 1;
    const f = this.doc.mode === 'corners' ? Math.min(1, ...clamped(this.doc.corners, w, h).map((c) => c.to / c.from)) : 1;
    const hit = (coarse() ? 22 : 12) / k;
    return html`<div class="stage"><svg class="cv" viewBox="${-PAD} ${-PAD} ${w + 2 * PAD} ${h + 2 * PAD}" role="img" aria-label=${nm(this.size.id)}><path class="shape" d=${cur?.d ?? ''} />${this.showText && cur ? this.sample(cur) : nothing}
${this.doc.mode === 'corners' ? KEYS.map((key, i) => {
      const o = Math.max(cornerPx(this.doc.corners[key], w, h) * f * 0.5, 14 / k);
      const [x, y] = [i === 0 || i === 3 ? o : w - o, i < 2 ? o : h - o];
      return svg`<g aria-hidden="true"><circle class="handle ${this.sel === key || this.together ? 'on' : ''}" cx=${x} cy=${y} r=${5 / k} /><circle class="hit" cx=${x} cy=${y} r=${hit} @pointerdown=${(e: PointerEvent) => this.handleDown(e, key)} @pointermove=${(e: PointerEvent) => this.handleMove(e)} @pointerup=${(e: PointerEvent) => this.handleUp(e)} @pointercancel=${(e: PointerEvent) => this.handleUp(e)} /></g>`;
    }) : nothing}</svg>${this.floatBar()}${k < 0.995 ? html`<span class="scale">${t('shown at {pct}%', { pct: Math.round(k * 100) })}</span>` : nothing}${this.dock()}</div>`;
  }

  /** The foot of the canvas: the pen's Finish / Cancel bar and the result note (cleared by the next edit, a mode change or 8 s). */
  // prettier-ignore
  private dock(): TemplateResult | typeof nothing {
    const s = this.strip;
    const pen = this.penBar();
    if (!s && pen === nothing) return nothing;
    return html`<div class="dock" @pointerenter=${() => this.holdStrip()} @focusin=${() => this.holdStrip()} @pointerleave=${() => this.strip && this.armStrip()} @focusout=${() => this.strip && this.armStrip()}>${pen}${s ? notice({ tone: 'info', text: s.text, transient: true, action: s.undo && this.canUndo ? { label: t('Undo'), onClick: () => this.undo() } : undefined }) : nothing}</div>`;
  }

  // prettier-ignore
  private penBar(): TemplateResult | typeof nothing {
    const p = this.pending;
    if (p?.kind !== 'pen') return nothing;
    const c = p.path?.anchors.length ?? 0;
    const ok = c >= 3;
    return html`<div class="pen" role="group" aria-label=${t('New outline')}><strong>${t('Drawing a new outline. This replaces your shape when you finish.')}</strong><span class="help why" id="penwhy">${t('Click or tap to add points. Drag to curve.')} ${ok ? t('{c, plural, one {# point} other {# points}}', { c }) : t('Add 3 points to finish.')}</span>
<button type="button" class="btn btn-primary btn-sm" aria-disabled=${!ok} aria-describedby="penwhy" @click=${() => (ok ? this.finishPen() : this.say(t('Add 3 points to finish.')))}>${t('Finish')}</button>${btn(t('Cancel'), () => this.dropPending(true))}</div>`;
  }

  /** The three previews, behind the Preview button (an anchored popover): they are the renderer's own outlines. */
  // prettier-ignore
  private previews(): TemplateResult {
    const mark = this.doc.mode === 'path' || Object.values(this.doc.corners).some((c) => c.type !== 'square');
    return html`<div class="pop-body"><div class="pv-head">${seg(t('Preview'), [['card', t('On card')], ['outline', t('Outlines')]], this.cardView ? 'card' : 'outline', (v) => (this.cardView = v === 'card'), false, false)}</div>
${switchRow({ id: 'older', label: t('Show older browser look'), checked: this.older, onChange: (b) => (this.older = b) })}
<div class="pv-row">${this.an.map((p) => {
      const sc = p.w <= 120 ? 1 : p.w <= 360 ? 0.5 : 0.4;
      const bare = this.cardView ? '' : 'bare';
      return html`<button type="button" class="pv ${this.cardView ? 'card' : ''} ${p.cut || p.cross ? 'cut' : ''}" aria-pressed=${this.size.id === p.id} aria-label=${t('Preview at {name} size, {w} by {h}', { name: sh(p.id), w: p.w, h: p.h })} @click=${() => this.setSize(this.sizes.find((s) => s.id === p.id)!)}>
<svg viewBox="0 0 ${p.w} ${p.h}" style="width:${Math.max(96, Math.round(p.w * sc))}px" aria-hidden="true">${this.older ? svg`<polygon class="shape ${bare}" points=${p.poly.map((q) => `${r1(q[0])},${r1(q[1])}`).join(' ')} />` : svg`<path class="shape ${bare}" d=${p.d} />`}${this.cardView ? this.sample(p) : nothing}</svg>
<span class="help">${nm(p.id)}${sc < 1 ? ` (${Math.round(sc * 100)}%)` : ''}</span></button>`;
    })}</div><p class="help">${t('Ring, border, shadow and value background follow the outline.')}</p>${this.older ? html`<p class="help">${t('Older browsers draw the curved corners as straight facets. Border, ring and shadow stay.')}</p>` : nothing}${mark ? html`<p class="help">${t('Focus rings and hover scale of content that touches a cut edge are clipped by the shape.')}</p>` : nothing}</div>`;
  }

  private shortcuts(): TemplateResult {
    return html`<div class="pop-body"><h3>${t('Shortcuts')}</h3><ul class="keys">${SHORTCUTS.map((k) => html`<li>${t(k)}</li>`)}</ul></div>`;
  }

  /** The text area (dashed) and two lines of sample text where the card would put its content. */
  sample(p: Preview): TemplateResult {
    const { left, top, right, bottom } = p.inset;
    const wd = p.w - left - right;
    return svg`<rect class="textarea" x=${left} y=${top} width=${Math.max(0, wd)} height=${Math.max(0, p.h - top - bottom)} />${wd > 40 ? svg`<text x=${left + 4} y=${top + 18}>${t(SAMPLE[0])}</text><text x=${left + 4} y=${top + 36}>${t(SAMPLE[1])}</text>` : nothing}`;
  }

  // ── left panel ──

  // prettier-ignore
  private cornerRows(): TemplateResult {
    return html`<div class="rows" role="list" aria-label=${t('Outline')}>${KEYS.map((k) => {
      const c = this.doc.corners[k];
      const on = this.sel === k;
      return html`<div class="row ${on ? 'selected' : ''}" role="listitem"><button type="button" class="name" aria-current=${on ? 'true' : nothing} @click=${() => (this.sel = k)}>${t(CORNER[k])}</button><span class="mono">${c.type === 'square' ? t(TYPE.square).toLowerCase() : `${c.type} ${c.size}${c.pct ? '%' : ''}`}</span></div>`;
    })}</div>`;
  }

  // prettier-ignore
  private pointRows(): TemplateResult {
    return html`<div class="rows" role="list" aria-label=${t('Points')}>${this.path.anchors.map((q, i) => {
      const on = this.pointSel === i;
      return html`<div class="row ${on ? 'selected' : ''}" role="listitem"><button type="button" class="name" aria-current=${on ? 'true' : nothing} @click=${() => (this.selectPoint(i), this.shadowRoot?.querySelector<HTMLElement & { focusAnchor(p: number, a: number): void }>('mc-path-canvas')?.focusAnchor(0, i))}>${t('Point {i}', { i: i + 1 })}</button><span class="mono">${t('{x}, {y}', { x: r1(q.x), y: r1(q.y) })}</span></div>`;
    })}</div>`;
  }

  // prettier-ignore
  private libPanel(): TemplateResult {
    const st = this.lib.state;
    if (this.noLib) return html`${empty({ title: t('Keep your own shapes'), text: t('Keep your own shapes for every dashboard with the free Magic Card Utils add-on. Until then, what you build is saved in this card only.'), icon: 'mdi:shape-outline' })}<a href="https://github.com/therealmcsparrow/magic-card-utils" target="_blank" rel="noopener">${t('How to install')}</a>`;
    if (st === 'loading' || st === 'idle') return html`<p class="help" role="status">${t('Loading your shapes')}</p>`;
    if (st !== 'ready') return html`<div role="alert">${notice({ tone: 'error', text: st === 'readonly' ? t(FAIL.readonly) : t('Could not reach Magic Card Utils. Your work is safe in this card.') })}${btn(t('Try again'), () => void this.loadLib())}</div>`;
    const items = this.items;
    return html`<p class="help">${t('Use follows the library: change "Lamp" and every card that uses it changes. Use as copy makes the card independent.')}</p><input class="input" type="search" aria-label=${t('Search my shapes')} placeholder=${t('Search my shapes')} .value=${this.lib.q} @input=${(e: Event) => (this.lib = { ...this.lib, q: (e.target as HTMLInputElement).value })} />
${items.length ? html`<div class="rows libs" role="list">${items.map((it) => row({ id: it.id, name: it.name, content: html`<button type="button" class="thumb-li" aria-label=${t('Open {name}', { name: it.name })} @click=${() => this.openItem(it)}><svg viewBox="0 0 48 32" aria-hidden="true"><path class="shape" d=${shapePath('custom', 48, 32, it.shape as ShapeOptions)?.d ?? ''} /></svg><span>${it.name}</span></button>`, actions: [{ label: t('Delete {name}', { name: it.name }), glyph: 'delete', variant: 'danger', onClick: () => this.removeItem(it) }] }))}</div>` : empty(this.lib.q ? { title: t('No shapes match "{q}".', { q: this.lib.q }) } : { title: t('No saved shapes yet'), text: t('Save a shape here and use it on any dashboard.'), icon: 'mdi:shape-outline' })}
${btn(t('Save current shape'), () => this.openSave())}`;
  }

  // ── inspectors ──

  /** The Shape section head: its name and, once saved, whether the shape changed since. */
  private shapeHead(): TemplateResult {
    const dirty = this.host === 'mcu' ? this.mcuDirty : this.dirtyFromSaved;
    return html`<div class="sec-head">${sectionHead({ title: t('Shape'), level: 3 })}<span aria-live="polite">${this.saved ? chip({ label: dirty ? t('Changed since saved') : t('Saved'), tone: dirty ? 'warn' : 'accent' }) : nothing}</span></div>`;
  }

  // prettier-ignore
  private modeSwitch(): TemplateResult {
    const note = this.edited ? (this.fromPath ? t('Corners will be square.') : t('Going back to Corners drops your edited points. Undo brings them back.')) : '';
    return html`${seg(t('Shape type'), [['corners', t('Corners')], ['path', t('Free shape')]], this.tab, (m) => this.setMode(m))}${note ? html`<p class="help" id="modenote">${note}</p>` : nothing}`;
  }

  /** Edit at: the size the shape is drawn and checked at (Width and Height for a custom size). */
  // prettier-ignore
  private editAt(): TemplateResult {
    const { w, h, id } = this.size;
    return html`<div class="field" role="group" aria-label=${t('Edit at')}><span class="fl">${t('Edit at')}</span>${seg(t('Edit at'), EDIT_AT.map(([k, label]) => [k, t(label)] as [string, string]), id, (k) => this.setSize(k === 'custom' ? { id: 'custom', w, h } : SIZES.find((s) => s.id === k)!))}</div>
${id === 'custom' ? html`<div class="grid2">${num(t('Width'), w, (v) => this.setDims(v, h), { min: 24, max: MAX_SIZE })}${num(t('Height'), h, (v) => this.setDims(w, v), { min: 24, max: MAX_SIZE })}</div>` : nothing}`;
  }

  // prettier-ignore
  private cornersInspector(): TemplateResult {
    const d = this.doc;
    const c = d.corners[this.sel];
    const worst = Math.max(0, ...SIDES.map((s) => this.cur?.inset[s] ?? 0));
    const turn = [0, 90, 180, 270];
    const toPct = (on: boolean): number => { const m = Math.min(this.size.w, this.size.h); return c.pct === on ? c.size : on ? r1((c.size / m) * 100) : Math.round((c.size / 100) * m); };
    const arrow = (e: KeyboardEvent, list: readonly string[], at: string, pick: (k: string) => void, sel: string): void => {
      const to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!to) return;
      e.preventDefault();
      pick(list[(list.indexOf(at) + to + list.length) % list.length]);
      void this.updateComplete.then(() => this.focusTo(sel));
    };
    return html`<section class="sec">${this.shapeHead()}${this.caption ? html`<p class="help" role="status">${this.caption}</p>` : nothing}${this.modeSwitch()}${this.editAt()}</section>
<section class="sec">${sectionHead({ title: t('Starters'), level: 4 })}<div class="acts" role="group" aria-label=${t('Starters')}>${STARTERS.map((s) => chip({ label: t(STARTER[s.id]), onClick: () => this.applyStarter(s.id) }))}</div></section>
<section class="sec"><fieldset ?disabled=${d.mode === 'path'} class="bare-set">${sectionHead({ title: t('Corner'), level: 4 })}<div class="field"><span class="fl">${t('Edit corners')}</span>${seg(t('Edit corners'), [['each', t('Each corner')], ['all', t('All corners together')]], this.together ? 'all' : 'each', (k) => this.setTogether(k === 'all'))}</div>
${this.together && this.allChanged ? html`<p class="help" role="status">${t('All four corners changed. Change just one?')} ${btn(t('Edit corners separately'), () => this.setTogether(false), { variant: 'text' })}</p>` : nothing}
<div class="corner-form"><div class="cmini" role="radiogroup" aria-label=${t('Corner')} @keydown=${(e: KeyboardEvent) => arrow(e, KEYS, this.sel, (k) => (this.sel = k as CornerKey), '.cmini [tabindex="0"]')}>${KEYS.map((k, i) => html`<button type="button" role="radio" aria-label=${t(CORNER[k])} aria-checked=${this.together || this.sel === k} tabindex=${this.sel === k ? 0 : -1} @click=${() => (this.sel = k)}>${glyph(d.corners[k].type, turn[i])}</button>`)}</div>
<div class="cf"><h4 class="sub-label">${this.together ? t('All four corners') : t(CORNER[this.sel])}</h4><span class="fl" id="ct">${t('Type')}</span><div class="ctiles" role="radiogroup" aria-labelledby="ct" aria-describedby="th" @keydown=${(e: KeyboardEvent) => arrow(e, CORNER_TYPES, c.type, (ty) => this.editCorner({ type: ty as CornerType }, t(TYPE[ty as CornerType])), '.ctiles [tabindex="0"]')}>${CORNER_TYPES.map((ty) => html`<button type="button" role="radio" aria-label=${t(TYPE[ty])} aria-checked=${c.type === ty} tabindex=${c.type === ty ? 0 : -1} title=${t(TYPE_HELP[ty])} @click=${() => this.editCorner({ type: ty }, t(TYPE[ty]))}>${glyph(ty)}${t(TYPE[ty])}</button>`)}</div><p class="help" id="th">${t(TYPE_HELP[c.type])}</p>
${c.type === 'square' ? html`<p class="help">${t('Square corners have no size.')}</p>` : html`<div class="field"><span class="fl">${t('Size')}</span><div class="unit"><input class="input" type="number" min="0" inputmode="decimal" aria-label=${t('Size')} .value=${String(r1(c.size))} @change=${(e: Event) => this.editCorner({ size: Math.max(0, +(e.target as HTMLInputElement).value || 0) }, t('Size'), `size-${this.sel}`)} /><div class="select"><select class="input" aria-label=${t('Unit')} @change=${(e: Event) => { const p = (e.target as HTMLSelectElement).value === '%'; this.editCorner({ pct: p, size: toPct(p) }, t('Unit')); }}><option value="px" ?selected=${!c.pct}>px</option><option value="%" ?selected=${c.pct}>%</option></select><ha-icon icon="mdi:chevron-down"></ha-icon></div></div><p class="help">${c.pct ? t('Follows the card\'s shorter side.') : t('Stays the same on every card size.')}</p></div>`}
<div class="acts">${btn(t('Copy to all corners'), () => this.setCorners(cornersOf(c), t('Copy to all corners')), { variant: 'text' })}${btn(t('Reset'), () => this.resetCorner(), { variant: 'text' })}</div></div></div>
${clamped(d.corners, this.size.w, this.size.h).map((x) => html`<span class="chip is-warn" role="status">${t('Corner is smaller on small cards: {v} px on {size}.', { size: sh(this.size.id), v: r1(x.to) })}</span>`)}
${Object.values(d.corners).some((x) => x.type === 'round' || x.type === 'squircle') ? slider({ id: 'smooth', label: t('Smoothing'), min: 0, max: 1, step: 0.05, value: d.smoothing, onInput: (v) => this.commit({ ...d, smoothing: clamp(v, 0, 1) }, t('Smoothing'), 'smooth'), onChange: (v) => this.commit({ ...this.doc, smoothing: clamp(v, 0, 1) }, t('Smoothing'), 'smooth') }) : nothing}</fieldset></section>
${this.spaceBlock(worst)}<div class="acts">${btn(t('Reset shape'), () => this.commit(this.initial, t('Reset shape')), { variant: 'text' })}</div>`;
  }

  // prettier-ignore
  private spaceBlock(worst: number): TemplateResult {
    const d = this.doc;
    const ins = this.cur?.inset ?? noSides();
    const path = d.mode === 'path';
    return html`<section class="sec">${sectionHead({ title: t('Space for text'), level: 4 })}<span class="mono" aria-label=${t('Space for text: top, right, bottom, left')}>${SIDES.map((s) => Math.round(ins[s])).join(' ')}</span><p class="help">${path ? t('Measured inside the outline at the size you edit at. Raise a side if you need more.') : t('Keeps text away from the corners. The card works it out for you.')}</p>${!path && worst > 0 ? html`<p class="help">${t('Corners use up to {v} px per side.', { v: r1(worst) })}</p>` : nothing}
${switchRow({ id: 'show-text', label: t('Show text area'), checked: this.showText, onChange: (b) => (this.showText = b) })}<div class="field"><span class="fl" id="xs">${t('Extra space')}</span><div class="grid4" role="group" aria-labelledby="xs">${SIDES.map((s) => num(t(SIDE[s]), path ? d.pad[s] : d.extra[s], (v) => this.setSpace(s, v), { min: path ? d.solver[s] : 0 }))}</div><p class="help">${t('Can raise the space, not lower it.')}</p></div></section>`;
  }

  // prettier-ignore
  private pathInspector(): TemplateResult {
    const d = this.doc;
    return html`<section class="sec">${this.shapeHead()}<p class="help">${t('Drag points, or pick one in the list.')}</p>${this.modeSwitch()}${this.editAt()}</section>
${this.pointSel === undefined ? nothing : this.pointSection(this.pointSel)}${this.combine()}<section class="sec">${sectionHead({ title: t('Points'), level: 4 })}<span class="mono" role="status">${t('{c} of {max} points', { c: d.points.length, max: MAX_SHAPE_POINTS })}</span>
<div class="acts">${btn(t('Reverse direction'), () => (this.commitPoints(reversePoints(d.points), t('Reverse direction')), this.selectPoint(undefined)))}</div></section>${this.spaceBlock(0)}`;
  }

  get cvMode(): CanvasMode {
    const p = this.pending;
    return p?.kind === 'shape' ? 'select' : p?.kind === 'pen' || this.tool === 'add' ? 'add' : 'nodes';
  }

  /** The pending shape of Combine: placed with its fields, then Combine, Subtract or Intersect. Nothing renders while none is pending. */
  // prettier-ignore
  private combine(): TemplateResult | typeof nothing {
    const p = this.pending;
    const b = this.operandBox;
    if (p?.kind !== 'shape' || !b) return nothing;
    return html`<section class="sec" role="group" aria-label=${t('Shape to combine')}>${sectionHead({ title: t('Combine'), level: 4 })}<div class="pv-head"><strong>${t('{k} (not applied yet)', { k: t(PRIM[p.prim]) })}</strong><span class="grow"></span>${btn(t('Cancel'), () => this.dropPending(), { variant: 'text' })}</div>
<div class="grid4">${num(t(BOX.x), b.x, (v) => this.setOperand({ x: v }), { id: 'ox' })}${num(t(BOX.y), b.y, (v) => this.setOperand({ y: v }))}${num(t(BOX.w), b.w, (v) => this.setOperand({ w: v }), { min: 1 })}${num(t(BOX.h), b.h, (v) => this.setOperand({ h: v }), { min: 1 })}</div>
<div class="acts">${btn(t('Centre'), () => this.setOperand('centre'))}</div><p class="help">${t('Move it with the arrow keys or drag it on the canvas.')}</p><div class="acts ops">${OPS.map(([k, label]) => html`<button type="button" class="btn btn-secondary btn-sm" aria-busy=${this.busy === k} @click=${() => void this.boolean(k)}>${this.busy === k ? t('Working...') : t(label)}</button>`)}</div><p class="help">${t('Combine adds it to the outline. Subtract cuts it out. Intersect keeps only the overlap.')}</p></section>`;
  }

  // prettier-ignore
  private pointSection(i: number): TemplateResult {
    const { w, h } = this.size;
    const p = this.doc.points[i];
    const a = this.path.anchors[i];
    if (!p || !a) return html``;
    const cnt = this.doc.points.length;
    const smooth = !!(a.in || a.out) && p.kind !== 'corner';
    const hdl = (which: 'in' | 'out'): TemplateResult => {
      const q = a[which];
      const [dx, dy] = q ? [q[0] - a.x, q[1] - a.y] : [0, 0];
      const len = Math.hypot(dx, dy);
      const ang = q ? (Math.atan2(dy, dx) * 180) / Math.PI : which === 'in' ? 180 : 0;
      return html`<fieldset class="grid2 bare-set"><legend>${t(HANDLE[which])}</legend>${num(t('Angle'), ang, (v) => this.setHandle(i, which, v, len || 20))}${num(t('Length'), len, (v) => this.setHandle(i, which, ang, Math.max(0, v)), { min: 0 })}</fieldset>`;
    };
    const ax = (axis: 'x' | 'y'): TemplateResult => {
      const cur = p[axis];
      const size = axis === 'x' ? w : h;
      const x = axis === 'x';
      const lbl = cur.k === 's' ? (x ? t('Position across the width') : t('Position down the height')) : t(DIST[`${axis}${cur.k}`]);
      return html`<div class="field"><span class="fl">${x ? t('Horizontal anchor') : t('Vertical anchor')}</span>${seg(x ? t('Horizontal anchor') : t('Vertical anchor'), [['l', x ? t('Left') : t('Top')], ['r', x ? t('Right') : t('Bottom')], ['s', t('Stretch')]] as Array<[Axis['k'], string]>, cur.k, (k) => this.setAnchorKind(i, axis, k))}
${num(lbl, cur.v, (v) => this.setAxis(i, axis, { ...cur, v: clamp(v, 0, cur.k === 's' ? 100 : size) }), { step: cur.k === 's' ? 0.5 : 1, min: 0 })}<span class="help mono">${r1(x ? a.x : a.y)} / ${size}</span></div>`;
    };
    const pad = (label: string, icon: string, dx: number, dy: number): TemplateResult => button({ label: t('Move {dir, select, left {left} up {up} down {down} other {right}}', { dir: label }), icon, iconOnly: true, onClick: (e) => this.nudge(dx, dy, e.shiftKey) });
    return html`<section class="sec" aria-label=${t('Selected point')}>${sectionHead({ title: t('Point {i} of {c}', { i: i + 1, c: cnt }), level: 3 })}<div class="acts">${btn(t('Previous'), () => this.selectPoint((i + cnt - 1) % cnt))}${btn(t('Next'), () => this.selectPoint((i + 1) % cnt))}</div>
${seg(t('Point type'), [['c', t('Corner')], ['s', t('Smooth')]], smooth ? 's' : 'c', (k) => this.editPath((E, pa) => E.setKind(pa, i, k === 's' ? 'smooth' : 'corner'), t('Point type')))}
<div class="grid2">${num(t('X, from the left edge'), a.x, (v) => this.movePoint(i, clamp(v, 0, w)), { id: 'fx' })}${num(t('Y, from the top edge'), a.y, (v) => this.movePoint(i, undefined, clamp(v, 0, h)))}</div><p class="help">${t('at {name}, {w} x {h}', { name: sh(this.size.id), w: w, h: h })}</p>
${coarse() ? html`<div class="acts" role="group" aria-label=${t('Nudge')}>${pad('left', 'mdi:arrow-left', -1, 0)}${pad('up', 'mdi:arrow-up', 0, -1)}${pad('down', 'mdi:arrow-down', 0, 1)}${pad('right', 'mdi:arrow-right', 1, 0)}</div>` : nothing}
${hdl('in')}${hdl('out')}<div class="acts">${btn(t('Add point after'), () => this.addAfter())}${btn(t('Remove point'), () => this.deletePoint())}</div><details><summary>${t('Advanced: how this point moves when the card resizes')}</summary>${ax('x')}${ax('y')}</details></section>`;
  }
}
