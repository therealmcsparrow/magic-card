import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CORNER_TYPES, MAX_SHAPE_POINTS } from '../contracts/custom-shape';
import type { CornerKey, CornerType, CustomShapeOptions } from '../contracts/custom-shape';
import type { SavedShape } from '../contracts/mcu-library';
import type { MagicCardEditorWindowAdditions } from '../contracts/module-editor';
import type { TransferItem } from '../contracts/preset-transfer';
import type { PathChange, PathSelection } from '../contracts/path-canvas';
import type { Anchor, EditPath, PathEdit, Pt } from '../contracts/path-model';
import type { ShapeChangeDetail, ShapeEditorPreset, ShapeEditorValue } from '../contracts/svg-editor';
import { flatten, parseClosed } from '../path/core';
import { loadPathCanvas } from '../path-canvas/loader';
import type { ShapeOptions } from '../types';
import { loadCustomShapes } from '../utils/shape-custom-loader';
import { resolveCustomShape } from '../utils/shape-ref';
import { clamp, shapePath } from '../utils/shape-path';
import { glyph } from './glyphs';
import { deleteShape, freeId, listShapes, LibraryError, lookupFor, saveShape, slug, tooBig, watchLibrary, type Hass, type LibraryProblem } from './library';
import {
  absOf, blankDoc, clamped, cornerPx, cornersOf, cornersToPoints, fromAnchors, KEYS, noSides, presetToCustom, readDoc, rectPoints, repad, reversePoints, SIDES, SIZES, STARTERS, toEditPath, toYaml,
  withAbs, writeDoc, writePoints, type Axis, type Corner, type Doc, type EditSize, type Side, type Sides,
} from './model';
import { isCut, selfCrosses, solveSpace } from './space';
import { S } from './strings';
import { studioStyles } from './styles';
import { btn, check, num, r1, seg } from './ui';

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
const up = (n: Node): Node | null => (n as Element).assignedSlot ?? n.parentNode ?? (n as ShadowRoot).host ?? null;
const nm = (id: string): string => S.size[id] ?? S.size.custom;
const sh = (id: string): string => S.short[id] ?? S.short.custom;

export class McShapeStudio extends LitElement {
  static styles = studioStyles;

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) value?: ShapeEditorValue;
  @property({ attribute: false }) customShapes?: Record<string, CustomShapeOptions>;
  @property({ type: Boolean }) libraryAvailable = true;
  /** "Edit as custom": the preset to start from (its name and `shape_options`). */
  @property({ attribute: false }) preset?: ShapeEditorPreset;
  /** What the shape is for, e.g. "Living room tile" (title). */
  @property() label = '';

  @state() doc: Doc = blankDoc();
  @state() size: EditSize = ROW;
  @state() ready = false;
  @state() failed = false;
  @state() tab: 'corners' | 'path' = 'corners';
  @state() together = false;
  @state() sel: CornerKey = 'tl';
  @state() pointSel?: number;
  @state() cvSel?: PathSelection;
  @state() tool: 'nodes' | 'add' = 'nodes';
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
  @state() toast?: { text: string; action?: { label: string; run: () => void } };
  @state() allChanged = false;
  @state() stageW = 0;
  @state() name: string = S.untitled;
  @state() saving = false;
  @state() saveName = '';
  @state() saveError = '';
  @state() saveBusy = false;
  @state() saved?: { id: string; name: string; updated_at: string; json: string };
  @state() openedId?: string;
  @state() lib: { state: LibState; items: SavedShape[]; q: string; hidden: Set<string> } = { state: 'idle', items: [], q: '', hidden: new Set() };
  @state() linked?: string;
  /** The export / import panel (preset-transfer 1.0.0) through window.MagicCard.loadTransfer(). */
  @state() xfer?: { mode: 'import' | 'export'; back?: HTMLElement };

  E?: PathEdit;
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
  private pending?: { item: SavedShape; timer: ReturnType<typeof setTimeout> };
  private liveTimer?: ReturnType<typeof setTimeout>;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this.onKey);
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
    for (const d of this.dialogs) d.removeEventListener('cancel', this.onCancel);
    this.dialogs = [];
    this.ro?.disconnect();
    this.stopLib?.();
    this.flushDelete();
    clearTimeout(this.liveTimer);
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private onCancel = (e: Event): void => e.preventDefault();

  async boot(): Promise<void> {
    this.failed = false;
    this.ready = await loadCustomShapes();
    this.failed = !this.ready;
    if (this.ready && !this.opened) this.open();
  }

  protected willUpdate(changed: PropertyValues): void {
    // the host feeds our own changes back through `value`: only something else (or a new preset) reopens
    const foreign = changed.has('value') && !!this.value && JSON.stringify(this.value.shape_options) !== this.sent;
    if (this.ready && this.opened && (foreign || changed.has('preset'))) this.open();
    if (['doc', 'size', 'ready', 'older', 'customShapes'].some((k) => changed.has(k))) this.analyse();
  }

  protected firstUpdated(): void {
    this.measure();
    this.shadowRoot?.querySelector<HTMLElement>('.layer')?.focus({ preventScroll: true });
  }

  protected updated(): void {
    this.dataset.layout = this.layout;
    const sw = this.shadowRoot?.querySelector('.stage')?.clientWidth ?? 0;
    if (sw && sw !== this.stageW) this.stageW = sw;
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
    let o: CustomShapeOptions = this.value?.shape_options ?? {};
    if (this.preset) {
      const st = presetToCustom(this.preset.shape, this.preset.shape_options, ROW.w, ROW.h);
      if (st) {
        o = st.options;
        this.caption = S.started(st.from, st.note);
        this.name = S.copyOf(st.from);
      } else this.notice = S.noEdit;
    } else if (o.ref) {
      const look = lookupFor(this.customShapes);
      this.linked = o.ref;
      if (!look.library(o.ref) && !look.inline(o.ref)) this.notice = S.refMissing(o.ref);
      o = resolveCustomShape(o, look);
    }
    this.doc = this.read(o);
    this.initial = this.doc;
    this.tab = this.doc.mode;
    this.together = this.allSame();
    this.pointSel = this.cvSel = undefined;
    if (this.doc.mode === 'path') void this.ensureCanvas();
    this.analyse(true);
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
    if (p) this.jump(p, S.undo, this.future);
  }

  redo(): void {
    const f = this.future.pop();
    if (f) this.jump(f, S.redo, this.past);
  }

  private jump(to: Doc, label: string, stack: Doc[]): void {
    stack.push(this.doc);
    this.doc = to;
    this.tab = to.mode;
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
      if (this.saving) this.saving = false;
      else if (this.sheet) this.sheet = false;
      else if (this.pointSel !== undefined) this.selectPoint(undefined);
      else if (!this.escHinted) {
        this.escHinted = true;
        this.toast = { text: S.escHint };
        setTimeout(() => (this.toast = undefined), 6000);
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
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
    if (on && KEYS.some((k) => !same(this.doc.corners[k], this.doc.corners.tl))) this.commit({ ...this.doc, corners: cornersOf(this.doc.corners.tl) }, S.appliedFirst);
  }

  setCorners(corners: Doc['corners'], label: string): void {
    this.commit({ ...this.doc, corners }, label);
  }

  resetCorner(): void {
    const corners = { ...this.doc.corners };
    for (const k of this.together ? KEYS : [this.sel]) corners[k] = { ...this.initial.corners[k] };
    this.setCorners(corners, S.reset);
  }

  /** Extra space (corner mode) or the padding of a free path: only ever raised above what is computed. */
  setSpace(side: Side, v: number): void {
    const x = Math.max(0, Math.ceil(Number.isFinite(v) ? v : 0));
    const d = this.doc;
    this.commit(d.mode === 'path' ? { ...d, pad: { ...d.pad, [side]: Math.max(d.solver[side], x) } } : { ...d, extra: { ...d.extra, [side]: x } }, S.extra, `sp-${side}`);
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
    this.live_({ ...this.doc, corners }, S.sizeL);
  }

  handleUp(e: PointerEvent): void {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    this.drag = undefined;
    this.commit(this.doc, S.sizeL);
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

  async toPath(rect: boolean): Promise<void> {
    await this.ensureCanvas();
    if (!this.E) return;
    const { w, h } = this.size;
    const points = rect ? rectPoints() : cornersToPoints(this.doc.corners, w, h, this.doc.smoothing);
    const solver = this.solve(points);
    this.commit({ ...this.doc, mode: 'path', points, solver, pad: solver }, S.convert);
    this.tab = 'path';
    this.panel = 'outline';
    this.selectPoint(0);
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
    const a = paths[0]?.anchors;
    if (!a) return;
    if (a.length > MAX_SHAPE_POINTS || a.length < 3) {
      this.say(a.length < 3 ? S.fewest : S.atMax(MAX_SHAPE_POINTS));
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
    this.pointSel = e.detail?.anchors?.length ? e.detail.anchors[e.detail.anchors.length - 1] : undefined;
  }

  onFields(e: CustomEvent<{ anchor: number }>): void {
    e.stopPropagation();
    this.pointSel = e.detail.anchor;
    void this.updateComplete.then(() => this.focusTo('#fx'));
  }

  onLimit(e: Event): void {
    e.stopPropagation();
    this.say(S.atMax(MAX_SHAPE_POINTS));
  }

  /** Keeps a dragged point (and its handles) inside the box, as the runtime does. */
  constrain = (pt: Pt): Pt => [clamp(pt[0], 0, this.size.w), clamp(pt[1], 0, this.size.h)];

  movePoint(i: number, x?: number, y?: number): void {
    this.editPath((E, p) => E.moveAnchor(p, i, x ?? p.anchors[i].x, y ?? p.anchors[i].y), S.point, `pt-${i}`);
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
    this.editPath((E, p) => E.setHandle(p, i, which, [a.x + Math.cos(r) * len, a.y + Math.sin(r) * len]), S.handle[which], `h-${i}-${which}`);
  }

  addAfter(): void {
    const i = this.pointSel;
    if (i === undefined || !this.E) return;
    if (this.doc.points.length >= MAX_SHAPE_POINTS) return this.say(S.atMax(MAX_SHAPE_POINTS));
    const r = this.E.insertAt(this.path, i, 0.5);
    if (r.index < 0) return;
    this.commitPoints(fromAnchors(this.doc.points, r.path.anchors, this.size.w, this.size.h), S.addAfter);
    this.selectPoint(r.index);
  }

  deletePoint(): void {
    const i = this.pointSel;
    if (i === undefined) return;
    if (this.doc.points.length <= 3) return this.say(S.fewest);
    this.editPath((E, p) => E.remove(p, i), S.del);
    this.selectPoint(Math.max(0, i - 1));
  }

  setAxis(i: number, axis: 'x' | 'y', a: Axis): void {
    this.commit({ ...this.doc, points: this.doc.points.map((p, j) => (j === i ? { ...p, [axis]: a } : p)) }, S.advanced, `ax-${i}-${axis}`);
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
    this.commit(this.read(item.shape), S.open);
    this.tab = this.doc.mode;
    this.together = this.allSame();
    this.name = item.name;
    this.openedId = item.id;
    this.saved = { id: item.id, name: item.name, updated_at: item.updated_at, json: JSON.stringify(item.shape) };
    this.caption = '';
    if (this.doc.mode === 'path') void this.ensureCanvas();
  }

  openSave(): void {
    if (this.noLib) return this.showPanel('library');
    this.saveName = this.name === S.untitled ? '' : this.name;
    this.saveError = '';
    this.saving = true;
    if (this.lib.state === 'idle') void this.loadLib();
    void this.updateComplete.then(() => this.focusTo('#sn'));
  }

  get existing(): SavedShape | undefined {
    const q = this.saveName.trim().toLowerCase();
    return q ? this.lib.items.find((i) => i.name.toLowerCase() === q) : undefined;
  }

  async doSave(): Promise<void> {
    const name = this.saveName.trim().slice(0, 40);
    const shape = this.options();
    if (!name || tooBig(shape)) {
      this.saveError = name ? S.tooBig : S.nameEmpty;
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
      this.saving = false;
      this.toast = { text: S.saved(item.name), action: { label: S.useOnCard, run: () => this.useSaved() } };
    } catch (e) {
      const p = e instanceof LibraryError ? e.problem : 'unreachable';
      this.saveError = S.fail[p] ?? S.saveFail(name);
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
    this.toast = undefined;
    this.fire({ value: { shape: 'custom', shape_options: { ref: s.id } }, customShapes: { [s.id]: this.options() }, commit: true, label: S.useOnCard });
    this.say(S.applied(this.label || S.title));
  }

  /** Delete after the snackbar: hidden at once, removed for good when the undo time runs out. */
  removeItem(item: SavedShape): void {
    this.flushDelete();
    this.lib = { ...this.lib, hidden: new Set([...this.lib.hidden, item.id]) };
    this.pending = { item, timer: setTimeout(() => this.flushDelete(), 10000) };
    this.toast = { text: S.deleted(item.name), action: { label: S.undo, run: () => this.undoDelete() } };
  }

  private undoDelete(): void {
    if (!this.pending) return;
    clearTimeout(this.pending.timer);
    this.unhide(this.pending.item.id);
    this.pending = this.toast = undefined;
  }

  private unhide(id: string, drop = false): void {
    const hidden = new Set(this.lib.hidden);
    hidden.delete(id);
    this.lib = { ...this.lib, hidden, items: drop ? this.lib.items.filter((i) => i.id !== id) : this.lib.items };
  }

  private flushDelete(): void {
    const p = this.pending;
    if (!p) return;
    clearTimeout(p.timer);
    this.pending = undefined;
    deleteShape(this.hass, p.item.id).then(
      () => this.unhide(p.item.id, true),
      () => this.unhide(p.item.id),
    );
    if (this.toast?.action?.label === S.undo) this.toast = undefined;
  }

  async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.say(S.copied);
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
      this.xfer = { mode, back };
    } catch {
      this.toast = { text: S.transferFail };
      setTimeout(() => (this.toast = undefined), 6000);
    }
  }

  closeTransfer(): void {
    const back = this.xfer?.back;
    this.xfer = undefined;
    void this.updateComplete.then(() => (back?.isConnected ? back : this.shadowRoot?.querySelector<HTMLElement>('[data-xfer]'))?.focus());
  }

  private get exportItems(): { kind: 'shape'; items: TransferItem<'shape'>[] } {
    const name = this.name.trim() || S.untitled;
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
    this.tab = d.mode;
    this.together = false;
    this.pointSel = this.cvSel = undefined;
    this.commit(d, S.imported(it.name));
    this.together = this.allSame();
    if (d.mode === 'path') void this.ensureCanvas();
    if (items.length > 1) this.say(S.importedFirst(items.length));
  }

  private xferLayer(): TemplateResult {
    const x = this.xfer!;
    return html`<div class="xfer" role="dialog" aria-modal="true" aria-label=${x.mode === 'export' ? S.exportFile : S.importFile} @keydown=${(e: Event) => e.stopPropagation()}>
<mc-transfer-panel .host=${'shape-editor'} .mode=${x.mode} .exportItems=${x.mode === 'export' ? this.exportItems : undefined} .hasLibrary=${!this.noLib}
@mc-transfer-close=${() => this.closeTransfer()} @mc-transfer-import=${(e: CustomEvent<{ items: TransferItem[] }>) => (e.stopPropagation(), this.importItems(e.detail.items))}></mc-transfer-panel></div>`;
  }

  private xferBtns(): TemplateResult {
    const b = (mode: 'import' | 'export', label: string): TemplateResult => html`<button class="b" data-xfer=${mode} @click=${(e: Event) => void this.openTransfer(mode, e.currentTarget as HTMLElement)}>${label}</button>`;
    return html`<div class="acts">${b('export', S.exportFile)}${b('import', S.importFile)}</div>`;
  }

  // ── leaving ──

  done(): void {
    if (this.preset && !this.emitted) this.send(true, S.applied(this.label || S.title));
    this.leave(true);
  }

  leave(done: boolean): void {
    this.flushDelete();
    this.dispatchEvent(new CustomEvent('mc-shape-close', { detail: { done }, bubbles: true, composed: true }));
  }

  focusTo(sel: string): void {
    this.shadowRoot?.querySelector<HTMLElement>(sel)?.focus();
  }

  // ── render ──

  // prettier-ignore
  protected render(): TemplateResult {
    const title = this.label ? S.titleFor(this.label) : S.title;
    const inPath = this.tab === 'path';
    return html`<div class="layer" role="dialog" aria-modal="true" aria-label=${title} tabindex="-1" data-layout=${this.layout}>
<div class="skips">${btn(S.skip.canvas, () => this.focusTo('.stage mc-path-canvas, .stage svg'))}${btn(S.skip.past, () => this.focusTo('.previews button'))}${this.pointSel !== undefined ? btn(S.skip.point, () => this.focusTo('#fx')) : nothing}${btn(S.skip.insp, () => this.focusTo('.insp button, .insp input'))}</div>
${this.top(title)}${this.banners()}
${!this.ready ? html`<div class="empty" role="status">${this.failed ? html`${S.loadFail} ${btn(S.retry, () => void this.boot())}` : S.loading}</div>` : html`<div class="work">
<aside class="left ${this.sheet ? 'sheet' : ''}" aria-label=${inPath ? S.points : S.outline}>${seg('', [['outline', inPath ? S.points : S.outline], ['library', S.library]], this.panel, (p) => this.showPanel(p), true)}${this.panel === 'library' ? this.libPanel() : inPath && this.doc.mode === 'path' ? this.pointRows() : this.cornerRows()}</aside>
<main class="center">${this.editBar()}${this.stage()}${this.pointBar()}${this.previews()}</main>
<aside class="insp" aria-label=${S.inspector}>${seg('', [['corners', S.tabCorners], ['path', S.tabPath]], this.tab, (t) => ((this.tab = t), t === 'path' && void this.ensureCanvas()), true)}${inPath ? this.pathInspector() : this.cornersInspector()}</aside>
</div>`}
${this.toast ? html`<div class="toast" role="status">${this.toast.text}${this.toast.action ? btn(this.toast.action.label, this.toast.action.run, 'ghost') : nothing}</div>` : nothing}
${this.saving ? this.savePop() : nothing}${this.xfer ? this.xferLayer() : nothing}<div class="sr" role="status" aria-live="polite">${this.live}</div></div>`;
  }

  // prettier-ignore
  private top(title: string): TemplateResult {
    return html`<header class="top" role="toolbar" aria-label=${S.title}>${btn(S.back, () => this.leave(false), 'ghost')}<h2>${title}</h2>
${this.layout === 'compact' ? html`<button class="b" aria-expanded=${this.sheet} @click=${() => (this.sheet = !this.sheet)}>${this.tab === 'path' ? S.points : S.outline}</button>` : nothing}
<input class="name" type="text" aria-label=${S.nameLabel} title=${S.nameTip} .value=${this.name} @input=${(e: Event) => (this.name = (e.target as HTMLInputElement).value)} /><span class="mark" aria-live="polite">${this.saved ? (this.dirtyFromSaved ? S.markChanged : S.markSaved) : ''}</span><span class="grow"></span>
<button class="b icon" aria-label=${S.undo} aria-disabled=${!this.canUndo} @click=${() => this.undo()}>&#8630;</button><button class="b icon" aria-label=${S.redo} aria-disabled=${!this.future.length} @click=${() => this.redo()}>&#8631;</button>
${this.noLib ? html`<span class="sr" id="m1d">${S.m1}</span>` : nothing}<button class="b" aria-disabled=${this.noLib} aria-describedby=${this.noLib ? 'm1d' : nothing} @click=${() => this.openSave()}>${S.saveLib}</button>${btn(S.done, () => this.done(), 'primary')}</header>`;
  }

  private banners(): TemplateResult | typeof nothing {
    const list: Array<[string, string]> = [];
    if (this.notice) list.push(['warn', this.notice]);
    else if (this.linked) list.push(['', S.linked(this.linked)]);
    if (this.tab === 'corners' && this.doc.mode === 'path') list.push(['', S.locked]);
    for (const p of this.an) {
      if (p.cut && (this.doc.mode === 'path' || p.id === this.size.id)) list.push(['warn', this.doc.mode === 'path' ? S.w6Path(sh(p.id)) : S.w6Corners]);
      if (p.cross) list.push(['warn', S.crosses(sh(p.id))]);
    }
    return list.length ? html`<div class="banners">${list.map(([k, t]) => html`<div class="banner ${k}" role=${k ? 'alert' : 'status'}>${t}</div>`)}</div>` : nothing;
  }

  // prettier-ignore
  private editBar(): TemplateResult {
    const { w, h, id } = this.size;
    return html`<div class="editbar" role="group" aria-label=${S.editAt}><div class="f"><span>${S.editAt}</span>${seg(S.editAt, Object.entries(S.tab) as Array<[string, string]>, id, (k) => this.setSize(k === 'custom' ? { id: 'custom', w, h } : SIZES.find((s) => s.id === k)!))}</div>
${num(S.width, w, (v) => this.setDims(v, h), { min: 24, max: MAX_SIZE })}${num(S.height, h, (v) => this.setDims(w, v), { min: 24, max: MAX_SIZE })}</div>`;
  }

  /** The drawing: corner mode is the runtime outline with corner handles, path mode is the shared canvas. */
  // prettier-ignore
  private stage(): TemplateResult {
    const { w, h } = this.size;
    const cur = this.cur;
    if (this.tab === 'path' && this.doc.mode === 'path') {
      if (this.canvas !== 'ready') return html`<div class="stage"><div class="empty" role=${this.canvas === 'fail' ? 'alert' : 'status'}>${this.canvas === 'fail' ? html`${S.canvasFail} ${btn(S.retry, () => void this.ensureCanvas())}` : S.loading}</div></div>`;
      return html`<div class="stage"><mc-path-canvas aria-label=${S.title} aria-describedby="hint" loupeLabel=${`at ${sh(this.size.id)}`}
.frame=${{ x: 0, y: 0, w, h }} .paths=${[this.path]} .selection=${this.cvSel} .mode=${this.tool} .maxPaths=${1} .kinds=${['corner', 'smooth', 'symmetric']} .snap=${{ enabled: false, grid: 0, anchors: false, frame: false }}
.nudge=${1} .bigNudge=${10} .fineNudge=${0.1} .constrain=${this.constrain}
@mc-path-change=${(e: CustomEvent<PathChange>) => this.onPathChange(e)} @mc-path-select=${(e: CustomEvent<PathSelection>) => this.onPathSelect(e)} @mc-path-fields=${(e: CustomEvent<{ anchor: number }>) => this.onFields(e)} @mc-path-limit=${(e: Event) => this.onLimit(e)}></mc-path-canvas></div>`;
    }
    const k = this.stageW ? this.stageW / (w + 2 * PAD) : 1;
    const f = this.doc.mode === 'corners' ? Math.min(1, ...clamped(this.doc.corners, w, h).map((c) => c.to / c.from)) : 1;
    const hit = (coarse() ? 22 : 12) / k;
    return html`<div class="stage"><svg class="cv" viewBox="${-PAD} ${-PAD} ${w + 2 * PAD} ${h + 2 * PAD}" role="img" aria-label=${nm(this.size.id)}><path class="shape" d=${cur?.d ?? ''} />${this.showText && cur ? this.sample(cur) : nothing}
${this.doc.mode === 'corners' ? KEYS.map((key, i) => {
      const o = Math.max(cornerPx(this.doc.corners[key], w, h) * f * 0.5, 14 / k);
      const [x, y] = [i === 0 || i === 3 ? o : w - o, i < 2 ? o : h - o];
      return svg`<g aria-hidden="true"><circle class="handle ${this.sel === key || this.together ? 'on' : ''}" cx=${x} cy=${y} r=${5 / k} /><circle class="hit" cx=${x} cy=${y} r=${hit} @pointerdown=${(e: PointerEvent) => this.handleDown(e, key)} @pointermove=${(e: PointerEvent) => this.handleMove(e)} @pointerup=${(e: PointerEvent) => this.handleUp(e)} @pointercancel=${(e: PointerEvent) => this.handleUp(e)} /></g>`;
    }) : nothing}</svg>${k < 0.995 ? html`<span class="scale">${S.scaled(Math.round(k * 100))}</span>` : nothing}</div>`;
  }

  /** The text area (dashed) and two lines of sample text where the card would put its content. */
  sample(p: Preview): TemplateResult {
    const { left, top, right, bottom } = p.inset;
    const wd = p.w - left - right;
    return svg`<rect class="textarea" x=${left} y=${top} width=${Math.max(0, wd)} height=${Math.max(0, p.h - top - bottom)} />${wd > 40 ? svg`<text x=${left + 4} y=${top + 18}>${S.sample[0]}</text><text x=${left + 4} y=${top + 36}>${S.sample[1]}</text>` : nothing}`;
  }

  // prettier-ignore
  private pointBar(): TemplateResult | typeof nothing {
    if (this.tab !== 'path' || this.doc.mode !== 'path') return nothing;
    const i = this.pointSel;
    const cnt = this.doc.points.length;
    const pad = (l: string, dx: number, dy: number, c: string) => html`<button class="b icon" aria-label=${S.move(l)} @click=${(e: MouseEvent) => this.nudge(dx, dy, e.shiftKey)}>${c}</button>`;
    return html`<div class="pointbar" role="group" aria-label=${S.pointHead}>${seg(S.tool, [['nodes', S.toolSelect], ['add', S.toolAdd]], this.tool, (t) => (this.tool = t))}
<span class="help" id="hint">${this.tool === 'add' ? S.hintAdd : S.hint}</span>${i === undefined ? nothing : html`<strong>${S.pointOf(i + 1, cnt)}</strong>${btn(S.prev, () => this.selectPoint((i + cnt - 1) % cnt))}${btn(S.next, () => this.selectPoint((i + 1) % cnt))}<span role="group" aria-label=${S.nudgeL}>${pad('left', -1, 0, '←')}${pad('up', 0, -1, '↑')}${pad('down', 0, 1, '↓')}${pad('right', 1, 0, '→')}</span>`}</div>`;
  }

  // prettier-ignore
  private previews(): TemplateResult {
    const mark = this.doc.mode === 'path' || Object.values(this.doc.corners).some((c) => c.type !== 'square');
    return html`<section class="previews" aria-label=${S.preview}><div class="pv-head"><strong>${S.preview}</strong>${seg(S.preview, [['card', S.onCard], ['outline', S.outlines]], this.cardView ? 'card' : 'outline', (v) => (this.cardView = v === 'card'))}${check(S.older, this.older, (b) => (this.older = b))}</div>
<div class="pv-row">${this.an.map((p) => {
      const sc = p.w <= 120 ? 1 : p.w <= 360 ? 0.5 : 0.4;
      const bare = this.cardView ? '' : 'bare';
      return html`<button class="pv ${this.cardView ? 'card' : ''} ${p.cut || p.cross ? 'cut' : ''}" aria-pressed=${this.size.id === p.id} aria-label=${S.previewAt(sh(p.id), p.w, p.h)} @click=${() => this.setSize(this.sizes.find((s) => s.id === p.id)!)}>
<svg viewBox="0 0 ${p.w} ${p.h}" style="width:${Math.max(96, Math.round(p.w * sc))}px" aria-hidden="true">${this.older ? svg`<polygon class="shape ${bare}" points=${p.poly.map((q) => `${r1(q[0])},${r1(q[1])}`).join(' ')} />` : svg`<path class="shape ${bare}" d=${p.d} />`}${this.cardView ? this.sample(p) : nothing}</svg>
<span class="help">${nm(p.id)}${sc < 1 ? ` (${Math.round(sc * 100)}%)` : ''}</span></button>`;
    })}</div><p class="help">${S.follow}</p>${this.older ? html`<p class="help">${S.olderNote}</p>` : nothing}${mark ? html`<p class="help">${S.w7}</p>` : nothing}</section>`;
  }

  // ── left panel ──

  // prettier-ignore
  private cornerRows(): TemplateResult {
    return html`<ul class="rows" role="listbox" aria-label=${S.outline}>${KEYS.map((k) => {
      const c = this.doc.corners[k];
      return html`<li class="row ${this.sel === k ? 'on' : ''}" role="option" aria-selected=${this.sel === k}><button @click=${() => (this.sel = k)}>${S.corner[k]}</button><span class="mono">${c.type === 'square' ? S.type.square.toLowerCase() : `${c.type} ${c.size}${c.pct ? '%' : ''}`}</span></li>`;
    })}</ul>`;
  }

  // prettier-ignore
  private pointRows(): TemplateResult {
    return html`<ul class="rows" role="listbox" aria-label=${S.points}>${this.path.anchors.map((q, i) => html`<li class="row ${this.pointSel === i ? 'on' : ''}" role="option" aria-selected=${this.pointSel === i}><button @click=${() => (this.selectPoint(i), this.shadowRoot?.querySelector<HTMLElement & { focusAnchor(p: number, a: number): void }>('mc-path-canvas')?.focusAnchor(0, i))}>${S.pointRow(i + 1, q.x, q.y)}</button></li>`)}</ul>`;
  }

  // prettier-ignore
  private libPanel(): TemplateResult {
    const st = this.lib.state;
    if (this.noLib) return html`<div class="empty">${S.m1} <a href="https://github.com/therealmcsparrow/magic-card-utils" target="_blank" rel="noopener">${S.m1Link}</a></div>${btn(S.copyYaml, () => this.copyText(toYaml(this.options())))}`;
    if (st === 'loading' || st === 'idle') return html`<div class="empty" role="status">${S.libLoading}</div>`;
    if (st !== 'ready') return html`<div class="empty" role="alert">${st === 'readonly' ? S.fail.readonly : S.e5} ${btn(S.retry, () => void this.loadLib())}</div>`;
    const items = this.items;
    return html`<p class="help">${S.libRule}</p><input type="search" aria-label=${S.libSearch} placeholder=${S.libSearch} .value=${this.lib.q} @input=${(e: Event) => (this.lib = { ...this.lib, q: (e.target as HTMLInputElement).value })} />
${items.length ? html`<ul class="libs">${items.map((it) => html`<li><svg viewBox="0 0 48 32" aria-hidden="true"><path class="shape" d=${shapePath('custom', 48, 32, it.shape as ShapeOptions)?.d ?? ''} /></svg><span class="nm">${it.name}</span><button class="b" aria-label="${S.open} ${it.name}" @click=${() => this.openItem(it)}>${S.open}</button><button class="b ghost" aria-label="${S.del} ${it.name}" @click=${() => this.removeItem(it)}>&times;</button></li>`)}</ul>` : html`<div class="empty">${this.lib.q ? S.libNoMatch(this.lib.q) : S.libEmpty}</div>`}
${btn(S.libSaveCurrent, () => this.openSave())}`;
  }

  // prettier-ignore
  private savePop(): TemplateResult {
    const ex = this.existing;
    const asNew = this.openedId && ex?.id === this.openedId;
    return html`<div class="pop" role="dialog" aria-label=${S.saveLib} @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), void this.doSave())}><h3>${S.saveLib}</h3>
<label class="f"><span>${S.saveName}</span><input id="sn" type="text" maxlength="40" aria-describedby="se" .value=${this.saveName} @input=${(e: Event) => (this.saveName = (e.target as HTMLInputElement).value)} /></label>
<span class="help">${S.saveNameHelp}</span>${ex ? html`<span class="help">${S.nameExists(ex.name)}</span>` : nothing}<span class="warn" id="se" role="alert">${this.saveError}</span>
<div class="acts end">${btn(S.cancel, () => (this.saving = false), 'ghost')}${asNew ? btn(S.saveAsNew, () => ((this.saveName = S.copyOf(ex!.name)), this.focusTo('#sn'))) : nothing}<button class="b primary" aria-disabled=${this.saveBusy} @click=${() => void this.doSave()}>${ex ? S.update(ex.name) : S.save}</button></div></div>`;
  }

  // ── inspectors ──

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
    return html`${this.caption ? html`<p class="help" role="status">${this.caption}</p>` : nothing}
<div role="toolbar" aria-label=${S.starters} class="acts">${STARTERS.map((s) => btn(S.starter[s.id], () => ((this.together = s.id !== 'two'), this.commit({ ...d, mode: 'corners', corners: s.corners() }, S.starter[s.id]), (this.tab = 'corners'))))}</div>
<fieldset ?disabled=${d.mode === 'path'} class="bare-set"><div class="f"><span>${S.editMode}</span>${seg(S.editMode, [['each', S.each], ['all', S.together]], this.together ? 'all' : 'each', (k) => this.setTogether(k === 'all'))}</div>
${this.together && this.allChanged ? html`<p class="help" role="status">${S.allChanged} ${btn(S.editSeparately, () => this.setTogether(false), 'ghost')}</p>` : nothing}
<div class="corner-form"><div class="mini" role="radiogroup" aria-label=${S.cornerL} @keydown=${(e: KeyboardEvent) => arrow(e, KEYS, this.sel, (k) => (this.sel = k as CornerKey), '.mini [tabindex="0"]')}>${KEYS.map((k, i) => html`<button role="radio" aria-label=${S.corner[k]} aria-checked=${this.together || this.sel === k} tabindex=${this.sel === k ? 0 : -1} @click=${() => (this.sel = k)}>${glyph(d.corners[k].type, turn[i])}</button>`)}</div>
<div class="f"><h4>${this.together ? S.allFour : S.corner[this.sel]}</h4><span id="ct">${S.typeL}</span><div class="tiles" role="radiogroup" aria-labelledby="ct" aria-describedby="th" @keydown=${(e: KeyboardEvent) => arrow(e, CORNER_TYPES, c.type, (t) => this.editCorner({ type: t as CornerType }, S.type[t]), '.tiles [tabindex="0"]')}>${CORNER_TYPES.map((t) => html`<button role="radio" aria-checked=${c.type === t} tabindex=${c.type === t ? 0 : -1} title=${S.typeHelp[t]} @click=${() => this.editCorner({ type: t }, S.type[t])}>${glyph(t)}${S.type[t]}</button>`)}</div><span class="help" id="th">${S.typeHelp[c.type]}</span>
${c.type === 'square' ? html`<span class="help">${S.squareNoSize}</span>` : html`<div class="f"><span>${S.sizeL}</span><div class="unit"><input type="number" min="0" inputmode="decimal" aria-label=${S.sizeL} .value=${String(r1(c.size))} @change=${(e: Event) => this.editCorner({ size: Math.max(0, +(e.target as HTMLInputElement).value || 0) }, S.sizeL, `size-${this.sel}`)} /><select aria-label=${S.unitL} @change=${(e: Event) => { const p = (e.target as HTMLSelectElement).value === '%'; this.editCorner({ pct: p, size: toPct(p) }, S.unitL); }}><option value="px" ?selected=${!c.pct}>px</option><option value="%" ?selected=${c.pct}>%</option></select></div><span class="help">${c.pct ? S.sizePctHelp : S.sizePxHelp}</span></div>`}
<div class="acts">${btn(S.copyAll, () => this.setCorners(cornersOf(c), S.copyAll), 'ghost')}${btn(S.reset, () => this.resetCorner(), 'ghost')}</div></div></div>
${clamped(d.corners, this.size.w, this.size.h).map((x) => html`<span class="chip is-warn" role="status">${S.clampChip(sh(this.size.id), x.to)}</span>`)}
${Object.values(d.corners).some((x) => x.type === 'round' || x.type === 'squircle') ? html`<label class="f"><span>${S.smoothing}</span><input type="range" min="0" max="1" step="0.05" .value=${String(d.smoothing)} @input=${(e: Event) => this.commit({ ...d, smoothing: clamp(+(e.target as HTMLInputElement).value, 0, 1) }, S.smoothing, 'smooth')} /></label>` : nothing}</fieldset>
${this.spaceBlock(worst)}<div class="acts">${btn(S.convert, () => ((this.tab = 'path'), void this.ensureCanvas()), 'ghost')}${btn(S.resetShape, () => this.commit(this.initial, S.resetShape), 'ghost')}</div>${this.yamlBlock()}`;
  }

  // prettier-ignore
  private spaceBlock(worst: number): TemplateResult {
    const d = this.doc;
    const ins = this.cur?.inset ?? noSides();
    const path = d.mode === 'path';
    return html`<div class="f"><h4>${S.space}</h4><span class="mono" aria-label="${S.space}: ${S.spaceOrder}">${SIDES.map((s) => Math.round(ins[s])).join(' ')}</span><span class="help">${path ? S.spaceHelpPath : S.spaceHelp}</span>${!path && worst > 0 ? html`<span class="help">${S.spaceCost(worst)}</span>` : nothing}
${check(S.showText, this.showText, (b) => (this.showText = b))}<span id="xs">${S.extra}</span><div class="grid4" role="group" aria-labelledby="xs">${SIDES.map((s) => num(S.side[s], path ? d.pad[s] : d.extra[s], (v) => this.setSpace(s, v), { min: path ? d.solver[s] : 0 }))}</div><span class="help">${S.extraHelp}</span></div>`;
  }

  // prettier-ignore
  private yamlBlock(): TemplateResult {
    const y = toYaml(this.options());
    return html`<details><summary>${S.yaml}</summary><textarea readonly rows="8" aria-label=${S.yaml} .value=${y}></textarea>${btn(S.copyYaml, () => this.copyText(y))}</details>${this.xferBtns()}`;
  }

  // prettier-ignore
  private pathInspector(): TemplateResult {
    const d = this.doc;
    if (d.mode === 'corners') return html`<p class="help">${S.pathStart}</p><div class="acts">${btn(S.fromCorners, () => void this.toPath(false), 'primary')}${btn(S.fromBlank, () => void this.toPath(true))}</div>`;
    return html`${this.pointSel === undefined ? nothing : this.pointSection(this.pointSel)}<div class="f"><h4>${S.points}</h4><span class="mono" role="status">${S.count(d.points.length, MAX_SHAPE_POINTS)}</span>
<div class="acts">${btn(S.reverse, () => (this.commitPoints(reversePoints(d.points), S.reverse), this.selectPoint(undefined)))}</div></div>${this.spaceBlock(0)}${this.yamlBlock()}`;
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
      return html`<fieldset class="grid2 bare-set"><legend class="help">${S.handle[which]}</legend>${num(S.angle, ang, (v) => this.setHandle(i, which, v, len || 20))}${num(S.length, len, (v) => this.setHandle(i, which, ang, Math.max(0, v)), { min: 0 })}</fieldset>`;
    };
    const ax = (axis: 'x' | 'y'): TemplateResult => {
      const cur = p[axis];
      const size = axis === 'x' ? w : h;
      const x = axis === 'x';
      const lbl = cur.k === 's' ? (x ? S.acrossW : S.downH) : S.dist[`${axis}${cur.k}`];
      return html`<div class="f"><span>${x ? S.anchorX : S.anchorY}</span>${seg(x ? S.anchorX : S.anchorY, [['l', x ? S.aLeft : S.aTop], ['r', x ? S.aRight : S.aBottom], ['s', S.aStretch]] as Array<[Axis['k'], string]>, cur.k, (k) => this.setAnchorKind(i, axis, k))}
${num(lbl, cur.v, (v) => this.setAxis(i, axis, { ...cur, v: clamp(v, 0, cur.k === 's' ? 100 : size) }), { step: cur.k === 's' ? 0.5 : 1, min: 0 })}<span class="help mono">${r1(x ? a.x : a.y)} / ${size}</span></div>`;
    };
    return html`<section class="f" aria-label=${S.pointHead}><h4>${S.pointHead}</h4><div class="pv-head"><strong>${S.pointOf(i + 1, cnt)}</strong>${btn(S.prev, () => this.selectPoint((i + cnt - 1) % cnt))}${btn(S.next, () => this.selectPoint((i + 1) % cnt))}</div>
${seg(S.pointType, [['c', S.pCorner], ['s', S.pSmooth]], smooth ? 's' : 'c', (k) => this.editPath((E, pa) => E.setKind(pa, i, k === 's' ? 'smooth' : 'corner'), S.pointType))}
<div class="grid2">${num(S.xField, a.x, (v) => this.movePoint(i, clamp(v, 0, w)), { id: 'fx' })}${num(S.yField, a.y, (v) => this.movePoint(i, undefined, clamp(v, 0, h)))}</div><span class="help">${S.atSize(sh(this.size.id), w, h)}</span>
${hdl('in')}${hdl('out')}<div class="acts">${btn(S.addAfter, () => this.addAfter())}${btn(S.del, () => this.deletePoint())}</div><details><summary>${S.advanced}</summary>${ax('x')}${ax('y')}</details></section>`;
  }
}
