import { LitElement, html, svg, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import {
  CONTEXT_DEDUPE_MS,
  DRAG_SLOP_PX,
  HANDLE_GLYPH_PX,
  HIT_MIN_COARSE,
  HIT_MIN_FINE,
  LONG_PRESS_MS,
  LONG_PRESS_SLOP_PX,
  LOUPE_DELAY_MS,
  LOUPE_SIZE_PX,
  GRID_MIN_PX,
  LOUPE_ZOOM,
  ROTATE_STEM_COARSE_PX,
  ROTATE_STEM_PX,
  SNAP_REACH_COARSE_PX,
  SNAP_REACH_PX,
  type CanvasMode,
  type ConstrainPoint,
  type PathChange,
  type PathContext,
  type PathPaint,
  type PathSelection,
  type PathTransform,
  type SnapConfig,
  type TransformBox,
} from '../contracts/path-canvas';
import { cursorFor } from './cursor';
import { MAX_ANCHORS, type AnchorKind, type Box, type EditPath, type Pt } from '../contracts/path-model';
import { append, canAdd, fromEdit, insertAt, isSmooth, nearestOnPath, serialize, setClosed, setHandle } from '../path/edit';
import { flatten } from '../path/core';
import { canvasStyles } from './styles';
import {
  bandHalf,
  clampZoom,
  defaultSteps,
  dist,
  fitView,
  hitHalf,
  inTarget,
  insidePolygon,
  kindWord,
  loupeCentre,
  num,
  pointsWord,
  snapAngle,
  snapEdges,
  snapLines,
  snapPoint,
  stepValue,
  toFrame,
  toScreen,
  zoomAt,
  type Line,
  type SnapContext,
  type View,
} from './geometry';
import { IDENTITY, angleOf, boxMatrix, placeHandles, resizeBy, rotateMatrix, rotateSpot, scaleBox, wrap180 } from './transform';
import { anchorsInRect, effectiveKind, moveAll, moveSet, removeSet, stopIndex, stops, toggleKind } from './ops';

/*
 * <mc-path-canvas> (contract path-canvas 1.0.0 rev 2). Controlled: it renders `paths` and every edit
 * is an `mc-path-change` the host applies. The drag works from a snapshot taken at pointer-down, so a
 * host that refuses a change cannot corrupt it. Hit testing is geometric (a square of 24 / 44 CSS px
 * around each point), so the glyphs stay small and there are no thousands of hit nodes.
 */

type Hit =
  | { t: 'anchor'; path: number; i: number }
  | { t: 'handle'; path: number; i: number; which: 'in' | 'out' }
  | { t: 'segment'; path: number; seg: number; at: number }
  | { t: 'body'; path: number }
  | { t: 'scale'; sx: -1 | 0 | 1; sy: -1 | 0 | 1 }
  | { t: 'rotate' }
  | { t: 'none' };

interface Gesture {
  id: number;
  type: string;
  down: Pt;
  hit: Hit;
  kind: 'anchor' | 'handle' | 'path' | 'marquee' | 'pan' | 'add' | 'scale' | 'rotate' | 'none';
  /** Where the pointer went down in client px (long-press). */
  client: Pt;
  /** The transform box at pointer-down (scale, rotate, and a snapped whole-path move). */
  box?: Box;
  rot?: { prev: number; total: number };
  /** The last transform emitted (committed on pointer-up). */
  tr?: PathTransform;
  startPaths: EditPath[];
  started: boolean;
  /** Touch only: where the point sits relative to the finger (CSS px). */
  offset: Pt;
  startView: View;
  last?: EditPath[];
  label: string;
  shift: boolean;
  /** add: the path list with the new point, its path and anchor index. */
  add?: { paths: EditPath[]; path: number; index: number; label: string; close?: boolean };
  /** selected anchors that move together with a dragged anchor */
  set?: number[];
}

const DIRS: Record<string, Pt> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
/** A key the canvas acted on: nothing else (the browser, Home Assistant's shortcuts) gets it. */
const eat = (e: Event): void => {
  e.preventDefault();
  e.stopPropagation();
};

export class PathCanvas extends LitElement {
  static styles = canvasStyles;

  @property({ attribute: false }) frame: Box = { x: 0, y: 0, w: 24, h: 24 };
  @property({ attribute: false }) paths: EditPath[] = [];
  @property({ attribute: false }) paint: PathPaint[] = [];
  @property({ attribute: false }) mode: CanvasMode = 'nodes';
  @property({ attribute: false }) snap: SnapConfig = { enabled: false, grid: 0, anchors: false, frame: false };
  @property({ attribute: false }) loupeLabel?: string;
  @property({ type: Number }) safeArea?: number;
  @property({ type: Boolean }) pixelGrid = false;
  /** Grid line spacing in frame units (path-canvas rev 4). */
  @property({ type: Number }) gridStep = 1;
  @property({ type: Number }) maxPaths = 64;
  @property({ attribute: false }) kinds: readonly AnchorKind[] = ['corner', 'smooth', 'symmetric'];
  @property({ attribute: false }) constrain?: ConstrainPoint;
  /** Selection box with scale and rotate handles ('select' mode only; path-canvas rev 5). */
  @property({ attribute: false }) transform?: TransformBox;
  @property() rotateLabel = 'Rotation';
  /** Emit `mc-path-context` and keep the browser menu off the drawing surface. */
  @property({ attribute: false }) contextMenu = false;

  private _nudge?: number;
  private _big?: number;
  private _fine?: number;
  @property({ type: Number })
  get nudge(): number {
    return this._nudge ?? defaultSteps(this.frame).nudge;
  }
  set nudge(v: number) {
    this._nudge = v;
    this.requestUpdate();
  }
  @property({ type: Number })
  get bigNudge(): number {
    return this._big ?? defaultSteps(this.frame).bigNudge;
  }
  set bigNudge(v: number) {
    this._big = v;
    this.requestUpdate();
  }
  @property({ type: Number })
  get fineNudge(): number {
    return this._fine ?? defaultSteps(this.frame).fineNudge;
  }
  set fineNudge(v: number) {
    this._fine = v;
    this.requestUpdate();
  }

  @property({ attribute: false })
  get selection(): PathSelection | undefined {
    return this._sel;
  }
  set selection(v: PathSelection | undefined) {
    this._sel = v;
    this.requestUpdate();
  }

  @state() private _sel?: PathSelection;
  @state() private _view: View = { zoom: 10, x: 0, y: 0 };
  @state() private _size: Pt = [480, 480];
  @state() private _live = '';
  @state() private _loupe?: { contact: Pt; at: Pt };
  @state() private _loupeOn = false;
  @state() private _guides: { x?: Line; y?: Line } = {};
  @state() private _gbox?: { box: Box; angle: number };
  @state() private _read?: { at: Pt; text: string; touch: boolean };
  @state() private _marquee?: [Pt, Pt];
  @state() private _kbd = false;
  @state() private _focused = false;
  @state() private _cross?: Pt;
  @state() private _panning = false;
  @state() private _hover: Hit = { t: 'none' };
  private _hoverAt?: Pt;

  private _g?: Gesture;
  private _touches = new Map<number, Pt>();
  private _pinch?: { dist: number; mid: Pt; view: View };
  private _viewSet = false;
  private _space = false;
  private _ro?: ResizeObserver;
  private _liveText = '';
  private _liveAt = -Infinity;
  private _liveTimer?: ReturnType<typeof setTimeout>;
  private _loupeTimer?: ReturnType<typeof setTimeout>;
  private _commitTimer?: ReturnType<typeof setTimeout>;
  private _pending?: PathChange;
  private _lastLimit = 0;
  private _list?: TemplateResult;
  private _lp?: ReturnType<typeof setTimeout>;
  private _ctxAt = -Infinity;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    if (!this.hasAttribute('aria-roledescription')) this.setAttribute('aria-roledescription', 'drawing canvas');
    for (const [n, f, c] of this.listeners()) this.addEventListener(n, f as EventListener, c);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const [n, f, c] of this.listeners()) this.removeEventListener(n, f as EventListener, c);
    this._ro?.disconnect();
    clearTimeout(this._liveTimer);
    clearTimeout(this._loupeTimer);
    clearTimeout(this._commitTimer);
    this.clearLp();
  }

  private listeners(): Array<[string, unknown, boolean?]> {
    return [['keydown', this._onKey], ['keyup', this._onKeyUp], ['focus', this._onFocus], ['blur', this._onBlur], ['dblclick', this._onDblClick], ['pointerdown', this._onHostDown, true], ['contextmenu', this._onContext]];
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('mode')) this.tabIndex = this.mode === 'view' ? -1 : 0;
    if (changed.has('mode') && this.mode !== 'add') this._cross = undefined;
  }

  protected firstUpdated(): void {
    const s = this.surface();
    s?.addEventListener('wheel', this._onWheel, { passive: false });
    this.measure();
    if (!this._viewSet) this.fit();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => {
        this.measure();
        if (!this._viewSet) this.fit();
      });
      this._ro.observe(this);
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('frame') && !this._viewSet) this.fit();
    if (this._hoverAt && !this._g && (changed.has('mode') || changed.has('transform') || changed.has('paint') || changed.has('paths'))) this.hoverAt(this._hoverAt);
  }

  // ── public API ──

  /** Fit the frame into the element. */
  fit(): void {
    this.measure();
    this._view = fitView(this.frame, this._size[0], this._size[1]);
    this._viewSet = false;
    this.emitView();
  }

  /** Move keyboard focus to an anchor (the host's Points list, Esc from a field). */
  focusAnchor(path: number, anchor: number): void {
    this._kbd = true;
    this.setSel({ path, anchors: [anchor] });
    this.focus({ preventScroll: true });
  }

  /** Restore a view the host kept (zoom in CSS px per unit, pan = where unit 0, 0 sits). */
  setView(zoom: number, pan: Pt): void {
    this._view = { zoom: clampZoom(zoom), x: pan[0], y: pan[1] };
    this._viewSet = true;
  }

  get view(): { zoom: number; pan: Pt } {
    return { zoom: this._view.zoom, pan: [this._view.x, this._view.y] };
  }

  // ── small helpers ──

  private surface(): SVGSVGElement | null {
    return this.renderRoot?.querySelector('svg.surface') ?? null;
  }

  private measure(): void {
    const r = this.getBoundingClientRect();
    this._size = [r.width || 480, r.height || 480];
  }

  private screenOf(e: { clientX: number; clientY: number }): Pt {
    const r = this.surface()?.getBoundingClientRect();
    return [e.clientX - (r?.left ?? 0), e.clientY - (r?.top ?? 0)];
  }

  private coarse(e?: { pointerType?: string }): boolean {
    if (e?.pointerType) return e.pointerType === 'touch';
    return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  }

  private emit<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private emitChange(paths: EditPath[], commit: boolean, label: string): void {
    this.emit<PathChange>('mc-path-change', { paths, commit, label });
  }

  private emitView(): void {
    this.emit('mc-path-view', { zoom: this._view.zoom, pan: [this._view.x, this._view.y] as Pt });
  }

  private emitLimit(path: number): void {
    this._lastLimit = Date.now();
    this.emit('mc-path-limit', { path, max: MAX_ANCHORS });
    this.announce(`This path has ${MAX_ANCHORS} points, the most you can add. Move, delete or change them instead.`);
  }

  /** The path that keys and taps act on. */
  private active(): number {
    const p = this._sel?.path;
    if (p !== undefined && p >= 0 && p < this.paths.length) return p;
    return this.paths.length ? 0 : -1;
  }

  private visible(i: number): boolean {
    return !this.paint[i]?.hidden;
  }

  private editable(i: number): boolean {
    return this.visible(i) && !this.paint[i]?.locked;
  }

  private setSel(sel: PathSelection | undefined, say = true): void {
    const prev = this._sel;
    this._sel = sel;
    this.emit('mc-path-select', sel);
    if (say) this.announce(this.describeSel(sel, prev));
  }

  private describeAnchor(path: number, i: number): string {
    const p = this.paths[path];
    const a = p?.anchors[i];
    if (!a) return '';
    return `Point ${i + 1} of ${p.anchors.length}, ${kindWord(a, isSmooth(a))}, x ${num(a.x)}, y ${num(a.y)}`;
  }

  private describeSel(sel: PathSelection | undefined, prev?: PathSelection): string {
    if (!sel) return prev ? 'Selection cleared.' : '';
    const p = this.paths[sel.path];
    if (!p) return '';
    if (sel.handle) {
      const h = p.anchors[sel.handle.anchor]?.[sel.handle.which];
      return `${sel.handle.which === 'in' ? 'In' : 'Out'} handle of point ${sel.handle.anchor + 1}${h ? `, x ${num(h[0])}, y ${num(h[1])}` : ''}.`;
    }
    if (sel.anchors.length === 1) return `${this.describeAnchor(sel.path, sel.anchors[0])}.`;
    if (sel.anchors.length > 1) return `${sel.anchors.length} points selected.`;
    return `Path, ${pointsWord(p.anchors.length)}, ${p.closed ? 'closed' : 'open'}.`;
  }

  private announce(text: string, delay = 0): void {
    if (!text) return;
    this._liveText = text;
    clearTimeout(this._liveTimer);
    const wait = Math.max(delay, this._liveAt + 500 - Date.now());
    const flush = (): void => {
      this._live = this._liveText;
      this._liveAt = Date.now();
    };
    if (wait <= 0) flush();
    else this._liveTimer = setTimeout(flush, wait);
  }

  private sctx(others: Pt[], reach: number): SnapContext {
    return { snap: this.snap, frame: this.frame, others, reach, safeArea: this.safeArea };
  }

  // ── hit testing ──

  private boxRect(b: Box): [number, number, number, number] {
    const a = toScreen(this._view, [b.x, b.y]);
    const c = toScreen(this._view, [b.x + b.w, b.y + b.h]);
    return [a[0], a[1], c[0], c[1]];
  }

  /** The rotate handle's centre in canvas px, or undefined without a box. */
  private rotSpot(coarse = this.coarse()): Pt | undefined {
    const t = this.transform;
    return t?.rotate && this.mode === 'select' ? rotateSpot(this.boxRect(t.box), coarse ? ROTATE_STEM_COARSE_PX : ROTATE_STEM_PX, coarse ? HIT_MIN_COARSE : HIT_MIN_FINE) : undefined;
  }

  /** Handle targets win over path bodies. */
  private boxHit(s: Pt, coarse: boolean): Hit | undefined {
    const t = this.transform;
    if (!t || this.mode !== 'select') return undefined;
    const half = hitHalf(coarse);
    const q = this.rotSpot(coarse);
    if (q && inTarget(q, s, half)) return { t: 'rotate' };
    let best: Hit | undefined;
    let bd = Infinity;
    if (t.scale)
      for (const h of placeHandles(this.boxRect(t.box), half * 2)) {
        const d = dist(h.at, s);
        if (inTarget(h.at, s, half) && d < bd) {
          bd = d;
          best = { t: 'scale', sx: h.sx, sy: h.sy };
        }
      }
    return best;
  }

  private hitTest(s: Pt, coarse: boolean): Hit {
    const bh = this.boxHit(s, coarse);
    if (bh) return bh;
    const v = this._view;
    const half = hitHalf(coarse);
    const ap = this.active();
    const nodes = this.mode === 'nodes' || this.mode === 'add';
    if (nodes && ap >= 0 && this.editable(ap)) {
      const p = this.paths[ap];
      let best = -1;
      let bd = Infinity;
      for (let i = 0; i < p.anchors.length; i++) {
        const a = p.anchors[i];
        const sp = toScreen(v, [a.x, a.y]);
        if (inTarget(sp, s, half)) {
          const d = dist(sp, s);
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
      }
      if (best >= 0) return { t: 'anchor', path: ap, i: best };
      if (this.mode === 'nodes') {
        const sel = this._sel;
        const idx = sel && sel.path === ap ? (sel.anchors.length ? sel.anchors : sel.handle ? [sel.handle.anchor] : []) : [];
        let hb: Hit | undefined;
        bd = Infinity;
        for (const i of idx) {
          for (const which of ['in', 'out'] as const) {
            const h = p.anchors[i]?.[which];
            if (!h) continue;
            const sp = toScreen(v, h);
            const d = dist(sp, s);
            if (inTarget(sp, s, half) && d < bd) {
              bd = d;
              hb = { t: 'handle', path: ap, i, which };
            }
          }
        }
        if (hb) return hb;
      }
      const seg = this.segmentHit(ap, s, coarse);
      if (seg) return seg;
    }
    // bodies of paths, topmost first (in node mode the active path was handled above)
    for (let i = this.paths.length - 1; i >= 0; i--) {
      if (this.editable(i) && !(nodes && i === ap) && (this.segmentHit(i, s, coarse) || this.inside(i, s))) return { t: 'body', path: i };
    }
    if (this.mode === 'nodes' && ap >= 0 && this.editable(ap) && this.inside(ap, s)) return { t: 'body', path: ap };
    return { t: 'none' };
  }

  private segmentHit(pi: number, s: Pt, coarse: boolean): Hit | undefined {
    const p = this.paths[pi];
    if (!p || p.anchors.length < 2) return undefined;
    const z = this._view.zoom;
    const f = toFrame(this._view, s);
    const n = nearestOnPath(p, f, [z, z]);
    if (n && n.dist <= bandHalf(coarse)) return { t: 'segment', path: pi, seg: n.seg, at: n.t };
    return undefined;
  }

  private inside(pi: number, s: Pt): boolean {
    const p = this.paths[pi];
    if (!p?.closed || p.anchors.length < 3) return false;
    if (this.paint[pi]?.fill === 'none') return false;
    return insidePolygon(toFrame(this._view, s), flatten(fromEdit(p), 8));
  }

  // ── pointer: down ──

  private _onHostDown = (): void => {
    this._kbd = false;
    this._cross = undefined;
  };

  private _down = (e: PointerEvent): void => {
    if (this.mode === 'view') return;
    const s = this.screenOf(e);
    if (e.pointerType === 'touch') {
      this._touches.set(e.pointerId, s);
      if (this._touches.size === 2) {
        this.beginPinch();
        return;
      }
      if (this._touches.size > 2) return;
    }
    if (this._pinch) return;
    this.focus({ preventScroll: true });
    const start: Gesture = {
      id: e.pointerId,
      type: e.pointerType || 'mouse',
      down: s,
      client: [e.clientX, e.clientY],
      hit: { t: 'none' },
      kind: 'none',
      startPaths: this.paths.slice(),
      started: false,
      offset: [0, 0],
      startView: this._view,
      label: '',
      shift: e.shiftKey,
    };
    this._g = start;
    try {
      this.surface()?.setPointerCapture(e.pointerId);
    } catch {
      /* not capturable (synthetic event): the gesture still works */
    }
    if (e.button === 1 || (e.button === 0 && this._space)) {
      start.kind = 'pan';
      e.preventDefault();
      return;
    }
    if (e.button !== 0) {
      this._g = undefined;
      return;
    }
    const hit = this.hitTest(s, this.coarse(e));
    start.hit = hit;
    this.requestUpdate();
    if (this.mode === 'add') this.downAdd(start, e, s);
    else if (this.mode === 'nodes') this.downNodes(start, e, s);
    else this.downSelect(start, e);
    if (this._g === start && this.contextMenu && start.type === 'touch' && this._touches.size === 1) this._lp = setTimeout(() => this.longPress(start), LONG_PRESS_MS);
  };

  private downNodes(g: Gesture, e: PointerEvent, s: Pt): void {
    const h = g.hit;
    const sel = this._sel;
    if (h.t === 'anchor') {
      const cur = sel && sel.path === h.path ? sel.anchors : [];
      let anchors: number[];
      if (e.shiftKey) anchors = cur.includes(h.i) ? cur.filter((x) => x !== h.i) : [...cur, h.i];
      else anchors = cur.includes(h.i) ? cur : [h.i];
      this.setSel({ path: h.path, anchors });
      g.kind = anchors.includes(h.i) ? 'anchor' : 'none';
      g.set = anchors;
      const a = this.paths[h.path].anchors[h.i];
      if (g.type === 'touch') {
        const sp = toScreen(this._view, [a.x, a.y]);
        g.offset = [sp[0] - s[0], sp[1] - s[1]];
      }
    } else if (h.t === 'handle') {
      this.setSel({ path: h.path, anchors: sel?.anchors ?? [h.i], handle: { anchor: h.i, which: h.which } });
      g.kind = 'handle';
      const q = this.paths[h.path].anchors[h.i][h.which]!;
      if (g.type === 'touch') {
        const sp = toScreen(this._view, q);
        g.offset = [sp[0] - s[0], sp[1] - s[1]];
      }
    } else if (h.t === 'segment') {
      if (e.altKey) {
        this.insertOnSegment(h.path, h.seg, h.at);
        this._g = undefined;
      } else {
        if (!sel || sel.path !== h.path) this.setSel({ path: h.path, anchors: [] });
        g.kind = 'none';
      }
    } else if (h.t === 'body') {
      this.setSel({ path: h.path, anchors: [] });
      g.kind = 'none';
    } else {
      g.kind = g.type === 'touch' ? 'pan' : 'marquee';
    }
  }

  private downSelect(g: Gesture, e: PointerEvent): void {
    const h = g.hit;
    if (h.t === 'scale' || h.t === 'rotate') {
      g.kind = h.t;
      g.box = this.transform?.box;
      const b = g.box;
      if (b) g.rot = { prev: angleOf([b.x + b.w / 2, b.y + b.h / 2], toFrame(this._view, g.down)), total: 0 };
    } else if (h.t === 'body' || h.t === 'segment') {
      const pi = h.path;
      if (!this._sel || this._sel.path !== pi || this._sel.anchors.length) this.setSel({ path: pi, anchors: [] });
      g.kind = 'path';
      g.box = this.transform?.box;
    } else {
      g.kind = g.type === 'touch' ? 'pan' : 'none';
    }
    void e;
  }

  private downAdd(g: Gesture, e: PointerEvent, s: Pt): void {
    const h = g.hit;
    const ap = this.active();
    const p = ap >= 0 ? this.paths[ap] : undefined;
    const f = toFrame(this._view, s);
    if (h.t === 'anchor') {
      if (p && !p.closed && h.i === 0 && p.anchors.length >= 3) {
        g.kind = 'add';
        g.add = { paths: this.paths.map((x, i) => (i === ap ? setClosed(x, true) : x)), path: ap, index: 0, label: 'Close path', close: true };
      } else {
        this.setSel({ path: h.path, anchors: [h.i] });
        g.kind = 'none';
      }
      return;
    }
    if (h.t === 'segment') {
      if (!canAdd(this.paths[h.path])) {
        this.emitLimit(h.path);
        g.kind = 'none';
        return;
      }
      const r = insertAt(this.paths[h.path], h.seg, h.at);
      g.kind = 'add';
      g.add = { paths: this.paths.map((x, i) => (i === h.path ? r.path : x)), path: h.path, index: r.index, label: 'Add point' };
      return;
    }
    const pt = this.place(f, e.shiftKey);
    const res = this.appendPoint(pt);
    if (!res) {
      g.kind = 'none';
      return;
    }
    g.kind = 'add';
    g.add = res;
  }

  /** Where a clicked point lands: snapped and constrained like a drag. */
  private place(f: Pt, suspend: boolean, skip?: { path: number; anchor: number }): Pt {
    let out = f;
    if (!suspend) {
      const others: Pt[] = [];
      if (this.snap.enabled && this.snap.anchors) {
        this.paths.forEach((p, pi) =>
          p.anchors.forEach((a, ai) => {
            if (!(skip && skip.path === pi && skip.anchor === ai)) others.push([a.x, a.y]);
          }),
        );
      }
      out = snapPoint(f, this.sctx(others, 6 / this._view.zoom)).pt;
    }
    return out;
  }

  /** The paths with a new last point on the active open path (or a new path), or undefined (refused). */
  private appendPoint(pt: Pt): { paths: EditPath[]; path: number; index: number; label: string } | undefined {
    const ap = this.active();
    const p = ap >= 0 ? this.paths[ap] : undefined;
    if (p && !p.closed && this.editable(ap)) {
      if (!canAdd(p)) {
        this.emitLimit(ap);
        return undefined;
      }
      const q = this.constrain ? this.constrain(pt, { path: ap, anchor: p.anchors.length, which: 'anchor' }) : pt;
      const r = append(p, q);
      return { paths: this.paths.map((x, i) => (i === ap ? r.path : x)), path: ap, index: r.index, label: 'Add point' };
    }
    if (this.paths.length >= this.maxPaths) return undefined;
    const q = this.constrain ? this.constrain(pt, { path: this.paths.length, anchor: 0, which: 'anchor' }) : pt;
    return { paths: [...this.paths, { anchors: [{ x: q[0], y: q[1] }], closed: false }], path: this.paths.length, index: 0, label: 'Add point' };
  }

  private insertOnSegment(path: number, seg: number, t: number): void {
    const p = this.paths[path];
    if (!p) return;
    if (!canAdd(p)) {
      this.emitLimit(path);
      return;
    }
    const r = insertAt(p, seg, t);
    if (r.index < 0) return;
    this.emitChange(
      this.paths.map((x, i) => (i === path ? r.path : x)),
      true,
      'Add point',
    );
    this.setSel({ path, anchors: [r.index] }, false);
    this.announce(`Point added, ${pointsWord(r.path.anchors.length)}.`);
  }

  // ── pointer: move ──

  /** The cursor target under the pointer when no drag runs (mouse and pen only: touch has no hover). */
  private hoverAt(s: Pt, type = 'mouse'): void {
    this._hoverAt = s;
    if (this._g || type === 'touch' || this.mode === 'view') return;
    const h = this.hitTest(s, false);
    const k = (x: Hit): string => (x.t === 'scale' ? `scale${x.sx}${x.sy}` : x.t);
    if (k(h) !== k(this._hover)) this._hover = h;
  }

  private _move = (e: PointerEvent): void => {
    const s = this.screenOf(e);
    this.hoverAt(s, e.pointerType);
    if (e.pointerType === 'touch' && this._touches.has(e.pointerId)) {
      this._touches.set(e.pointerId, s);
      if (this._pinch) {
        this.updatePinch();
        return;
      }
    }
    const g = this._g;
    if (!g || g.id !== e.pointerId) return;
    if (!g.started) {
      if (dist(s, g.down) < DRAG_SLOP_PX) return;
      if (this._lp) {
        // a touch press may still become the context menu: no drag (and no loupe) until it resolves
        if (dist(s, g.down) < LONG_PRESS_SLOP_PX) return;
        this.clearLp();
      }
      if (g.kind === 'none' || g.kind === 'add') return; // a tap places, whatever the jitter
      g.started = true;
      if (g.type === 'touch' && (g.kind === 'anchor' || g.kind === 'handle')) this.startLoupe();
      if (g.kind === 'pan') this._panning = true;
      if (g.kind === 'marquee') this._marquee = [g.down, s];
    }
    this.drag(g, s, e);
  };

  private startLoupe(): void {
    clearTimeout(this._loupeTimer);
    if (this._touches.size >= 2) this._loupeOn = true;
    else this._loupeTimer = setTimeout(() => (this._loupeOn = true), LOUPE_DELAY_MS);
  }

  private stopLoupe(): void {
    clearTimeout(this._loupeTimer);
    this._loupeOn = false;
    this._loupe = undefined;
    this._guides = {};
    this._gbox = undefined;
    this._read = undefined;
  }

  private drag(g: Gesture, s: Pt, e: PointerEvent): void {
    const v = this._view;
    const suspend = e.shiftKey;
    const target: Pt = [s[0] + g.offset[0], s[1] + g.offset[1]];
    const f = toFrame(v, target);
    if (g.kind === 'pan') {
      this._view = { zoom: g.startView.zoom, x: g.startView.x + (s[0] - g.down[0]), y: g.startView.y + (s[1] - g.down[1]) };
      this._viewSet = true;
      return;
    }
    if (g.kind === 'marquee') {
      this._marquee = [g.down, s];
      return;
    }
    if (g.kind === 'scale' || g.kind === 'rotate') return this.dragBox(g, s, e);
    const reach = 6 / v.zoom;
    if (g.kind === 'anchor' && g.hit.t === 'anchor') {
      const { path: pi, i } = g.hit;
      const sp = g.startPaths[pi];
      const set = g.set?.length ? g.set : [i];
      const start = sp.anchors[i];
      const others: Pt[] = [];
      if (this.snap.enabled && this.snap.anchors && !suspend) {
        sp.anchors.forEach((a, k) => {
          if (!set.includes(k)) others.push([a.x, a.y]);
        });
      }
      const sn = suspend ? { pt: f, guides: {} } : snapPoint(f, this.sctx(others, reach));
      let pt = sn.pt;
      if (this.constrain) pt = this.constrain(pt, { path: pi, anchor: i, which: 'anchor' });
      this._guides = sn.guides;
      const np = moveSet(sp, set, pt[0] - start.x, pt[1] - start.y);
      this.pushDrag(g, pi, np, set.length > 1 ? 'Move points' : 'Move point');
      this._loupe = { contact: s, at: pt };
      return;
    }
    if (g.kind === 'handle' && g.hit.t === 'handle') {
      const { path: pi, i, which } = g.hit;
      const sp = g.startPaths[pi];
      const a = sp.anchors[i];
      let pt: Pt = f;
      if (!suspend && this.snap.enabled) {
        const ang = snapAngle([a.x, a.y], f);
        pt = ang ?? snapPoint(f, this.sctx([], reach)).pt;
      }
      if (this.constrain) pt = this.constrain(pt, { path: pi, anchor: i, which });
      this.pushDrag(g, pi, setHandle(sp, i, which, pt), 'Move handle');
      this._loupe = { contact: s, at: pt };
      return;
    }
    if (g.kind === 'path' && 'path' in g.hit) {
      const pi = g.hit.path;
      const sp = g.startPaths[pi];
      if (!sp?.anchors.length) return;
      const f0 = toFrame(v, g.down);
      let dx = f[0] - f0[0];
      let dy = f[1] - f0[1];
      this._guides = {};
      if (!suspend && this.snap.enabled) {
        const b = g.box;
        if (b) {
          // the moving box (edges and centre) snaps, so a group lines up as one
          const c = this.sctx([], reach);
          const rx = snapEdges([b.x + dx, b.x + dx + b.w / 2, b.x + dx + b.w], snapLines(c, 0), this.snap.grid, reach);
          const ry = snapEdges([b.y + dy, b.y + dy + b.h / 2, b.y + dy + b.h], snapLines(c, 1), this.snap.grid, reach);
          dx += rx.d;
          dy += ry.d;
          this._guides = { x: rx.line, y: ry.line };
        } else {
          const a0 = sp.anchors[0];
          const sn = snapPoint([a0.x + dx, a0.y + dy], this.sctx([], reach));
          dx = sn.pt[0] - a0.x;
          dy = sn.pt[1] - a0.y;
        }
      }
      this.pushDrag(g, pi, moveAll(sp, dx, dy), 'Move path');
      return;
    }
  }

  /** A scale or rotate drag: the matrix is relative to the geometry at gesture start. */
  private dragBox(g: Gesture, s: Pt, e: PointerEvent): void {
    const t = this.transform;
    const b = g.box;
    const h = g.hit;
    if (!t || !b || (h.t !== 'scale' && h.t !== 'rotate')) return;
    const v = this._view;
    const f = toFrame(v, s);
    let tr: PathTransform;
    let nb = b;
    let turned = 0;
    let text: string;
    this._guides = {};
    if (h.t === 'rotate' && g.rot) {
      const c: Pt = [b.x + b.w / 2, b.y + b.h / 2];
      const r = g.rot;
      const cur = angleOf(c, f);
      r.total += wrap180(cur - r.prev);
      r.prev = cur;
      const base = t.angle ?? 0;
      turned = e.shiftKey ? Math.round((base + r.total) / 15) * 15 - base : r.total;
      text = `${num(base + turned)} degrees`;
      tr = { kind: 'rotate', matrix: rotateMatrix(c, turned), angle: turned, commit: false, label: 'Rotate', source: 'pointer' };
    } else if (h.t === 'scale') {
      const f0 = toFrame(v, g.down);
      const edge: Pt = [(h.sx > 0 ? b.x + b.w : b.x) + f[0] - f0[0], (h.sy > 0 ? b.y + b.h : b.y) + f[1] - f0[1]];
      if (this.snap.enabled && !e.ctrlKey && !e.metaKey) {
        const reach = (this.coarse(e) ? SNAP_REACH_COARSE_PX : SNAP_REACH_PX) / v.zoom;
        const c = this.sctx([], reach);
        for (const i of [0, 1] as const) {
          if (!(i ? h.sy : h.sx)) continue;
          const r = snapEdges([edge[i]], snapLines(c, i), this.snap.grid, reach);
          edge[i] += r.d;
          if (r.line) this._guides = { ...this._guides, [i ? 'y' : 'x']: r.line };
        }
      }
      nb = scaleBox(b, h.sx, h.sy, edge, { ratio: t.keepRatio !== e.shiftKey, centre: e.altKey, bounds: t.bounds });
      text = `W ${num(nb.w)} H ${num(nb.h)}`;
      tr = { kind: 'scale', matrix: boxMatrix(b, nb), size: { w: nb.w, h: nb.h }, commit: false, label: 'Scale', source: 'pointer' };
    } else return;
    g.tr = tr;
    this._gbox = { box: nb, angle: turned };
    const touch = g.type === 'touch';
    this._read = { at: touch ? [s[0], s[1] - 56] : [s[0] + 14, s[1] + 18], text, touch };
    this.emit('mc-path-transform', tr);
  }

  private pushDrag(g: Gesture, pi: number, np: EditPath, label: string): void {
    const list = g.startPaths.map((p, i) => (i === pi ? np : p));
    g.last = list;
    g.label = label;
    this.emitChange(list, false, label);
  }

  // ── pointer: up / cancel ──

  private _up = (e: PointerEvent): void => {
    this.clearLp();
    if (e.pointerType === 'touch') {
      this._touches.delete(e.pointerId);
      if (this._pinch) {
        if (this._touches.size < 2) this._pinch = undefined;
        this.emitView();
        return;
      }
    }
    const g = this._g;
    if (!g || g.id !== e.pointerId) return;
    this._g = undefined;
    this.release(e.pointerId);
    this._panning = false;
    this.stopLoupe();
    const s = this.screenOf(e);
    this.hoverAt(s, e.pointerType);
    if (g.started) {
      if (g.kind === 'pan') this.emitView();
      else if (g.kind === 'marquee') this.finishMarquee(g, s);
      else if (g.tr) this.emit('mc-path-transform', { ...g.tr, commit: true });
      else if (g.last) this.emitChange(g.last, true, g.label);
      this._marquee = undefined;
      return;
    }
    // a tap
    this._marquee = undefined;
    if (g.kind === 'add' && g.add) {
      this.emitChange(g.add.paths, true, g.add.label);
      this.afterAdd(g.add.path, g.add.index, g.add.paths, g.add.close);
      return;
    }
    if (g.hit.t === 'none' && this._sel && (this.mode === 'select' || this.mode === 'nodes')) {
      this.setSel(undefined);
    }
  };

  private _cancel = (e: PointerEvent): void => {
    this.clearLp();
    if (e.pointerType === 'touch') {
      this._touches.delete(e.pointerId);
      if (this._pinch && this._touches.size < 2) this._pinch = undefined;
    }
    const g = this._g;
    if (g && g.id === e.pointerId) this.cancelDrag();
  };

  private release(id: number): void {
    try {
      this.surface()?.releasePointerCapture(id);
    } catch {
      /* already released */
    }
  }

  private afterAdd(path: number, index: number, list: EditPath[], closed?: boolean): void {
    const n = list[path]?.anchors.length ?? 0;
    this.setSel({ path, anchors: [closed ? 0 : index] }, false);
    this.announce(closed ? 'Path closed.' : `Point added, ${pointsWord(n)}.`);
  }

  private finishMarquee(g: Gesture, s: Pt): void {
    const ap = this.active();
    if (ap < 0) return;
    const p = this.paths[ap];
    const inside = anchorsInRect(p, (q) => toScreen(this._view, q), g.down, s);
    const cur = this._sel && this._sel.path === ap ? this._sel.anchors : [];
    const anchors = g.shift ? [...new Set([...cur, ...inside])].sort((a, b) => a - b) : inside;
    this.setSel(anchors.length || g.shift ? { path: ap, anchors } : undefined);
  }

  /** Esc, or the browser taking the pointer: the drag ends where it started. */
  private cancelDrag(): boolean {
    const g = this._g;
    if (!g) return false;
    this._g = undefined;
    this.release(g.id);
    this._panning = false;
    if (this._hoverAt) this.hoverAt(this._hoverAt);
    this._marquee = undefined;
    this.stopLoupe();
    this.clearLp();
    if (g.started && (g.kind === 'scale' || g.kind === 'rotate')) {
      this.emit('mc-path-transform', { kind: g.kind, matrix: IDENTITY, commit: false, label: 'Cancel', source: 'pointer' } satisfies PathTransform);
    } else if (g.started && g.kind !== 'pan' && g.kind !== 'marquee') {
      this.emitChange(g.startPaths, false, 'Cancel');
    } else if (g.started && g.kind === 'pan') {
      this._view = g.startView;
    }
    return true;
  }

  // ── double click ──

  private _onDblClick = (e: MouseEvent): void => {
    if (this.mode === 'view') return;
    const s = this.screenOf(e);
    const hit = this.hitTest(s, this.coarse());
    this.doubleAction(hit);
  };

  private doubleAction(hit: Hit): void {
    if (hit.t === 'anchor' && (this.mode === 'nodes' || this.mode === 'add')) {
      this.setSel({ path: hit.path, anchors: [hit.i] }, false);
      this.toggleKindOf(hit.path, [hit.i]);
    } else if (hit.t === 'segment' && this.mode === 'nodes') {
      this.insertOnSegment(hit.path, hit.seg, hit.at);
    }
  }

  private toggleKindOf(path: number, set: number[]): void {
    let p = this.paths[path];
    if (!p || !set.length) return;
    for (const i of set) p = toggleKind(p, i, this.kinds);
    if (p === this.paths[path]) return;
    this.emitChange(
      this.paths.map((x, i) => (i === path ? p : x)),
      true,
      'Change point type',
    );
    const a = p.anchors[set[0]];
    this.announce(`Point ${set[0] + 1} is now ${a ? effectiveKind(a) : 'changed'}.`);
  }

  // ── view: pinch, wheel ──

  private beginPinch(): void {
    this.clearLp();
    if (this._g?.started) {
      // a second finger while a point is dragged: the loupe comes at once
      this._loupeOn = true;
      return;
    }
    this._g = undefined;
    const [a, b] = [...this._touches.values()];
    this._pinch = { dist: Math.max(1, dist(a, b)), mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], view: this._view };
  }

  private updatePinch(): void {
    const pn = this._pinch;
    if (!pn || this._touches.size < 2) return;
    const [a, b] = [...this._touches.values()];
    const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const z = zoomAt(pn.view, pn.view.zoom * (dist(a, b) / pn.dist), pn.mid);
    this._view = { zoom: z.zoom, x: z.x + (mid[0] - pn.mid[0]), y: z.y + (mid[1] - pn.mid[1]) };
    this._viewSet = true;
  }

  private _onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : 1;
    const dx = e.deltaX * unit;
    const dy = e.deltaY * unit;
    if (e.ctrlKey) this.zoomBy(Math.exp(-dy * 0.01), this.screenOf(e));
    else {
      this.panBy(-dx, -dy);
    }
  };

  private zoomBy(factor: number, at?: Pt): void {
    this._view = zoomAt(this._view, this._view.zoom * factor, at ?? [this._size[0] / 2, this._size[1] / 2]);
    this._viewSet = true;
    this.emitView();
  }

  // ── keyboard ──

  private _onFocus = (): void => {
    this._focused = true;
  };

  private _onBlur = (): void => {
    this._focused = false;
    this._space = false;
    this.requestUpdate();
    this.flushPending();
  };

  private flushPending(): void {
    clearTimeout(this._commitTimer);
    const p = this._pending;
    this._pending = undefined;
    if (p) this.emitChange(p.paths, true, p.label);
  }

  private _onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this._space = false;
      this.requestUpdate();
    }
    if (e.key.startsWith('Arrow')) this.flushPending();
  };

  private _onKey = (e: KeyboardEvent): void => {
    const t = e.composedPath()[0] as HTMLElement | undefined;
    if (t && (INPUT_TAGS.has(t.tagName) || t.isContentEditable)) return;
    if (t?.classList?.contains('rot') && e.key !== 'Escape') return; // the rotation slider has its own keys
    this._kbd = true;
    if (e.code === 'Space' || e.key === ' ') {
      this._space = true;
      this.requestUpdate();
      eat(e);
      return;
    }
    if (e.key === 'Escape') {
      this.escape(e);
      return;
    }
    if (this.mode === 'view') return;
    if (this.contextMenu && (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey))) {
      eat(e);
      this.keyContext();
      return;
    }
    const mod = e.ctrlKey || e.metaKey;
    if (mod) {
      const tb = this.transform;
      if (e.shiftKey && e.key in DIRS && tb?.scale && this.mode === 'select') {
        // resize from the top-left corner (WCAG 2.5.7)
        eat(e);
        const nb = resizeBy(tb.box, DIRS[e.key][0], DIRS[e.key][1], e.altKey ? this.fineNudge : this.nudge, tb.bounds);
        this.emit<PathTransform>('mc-path-transform', { kind: 'scale', matrix: boxMatrix(tb.box, nb), size: { w: nb.w, h: nb.h }, commit: true, label: 'Scale', source: 'keyboard' });
        this.announce(`W ${num(nb.w)} H ${num(nb.h)}`, 250);
        return;
      }
      if ((e.key === 'a' || e.key === 'A') && this.active() >= 0 && this.mode !== 'select') {
        eat(e);
        const ap = this.active();
        const n = this.paths[ap].anchors.length;
        this.setSel({ path: ap, anchors: Array.from({ length: n }, (_, i) => i) }, false);
        this.announce(`All ${pointsWord(n)} selected.`);
      }
      return;
    }
    const code = e.code;
    if (e.key === '=' || e.key === '+') return this.zoomKey(e, 1.25);
    if (e.key === '-' || e.key === '_') return this.zoomKey(e, 0.8);
    if (e.key === '0' && !e.shiftKey) {
      eat(e);
      this.fit();
      return;
    }
    const nodes = this.mode === 'nodes' || this.mode === 'add';
    if (e.key === 'Tab' && nodes) return this.tab(e);
    if (nodes && (code === 'BracketLeft' || code === 'BracketRight' || e.key === '[' || e.key === ']')) {
      eat(e);
      this.step(code === 'BracketRight' || e.key === ']' ? 1 : -1);
      return;
    }
    if (e.key in DIRS) return this.arrow(e);
    if (!nodes) return;
    switch (true) {
      case code === 'KeyH' || e.key === 'h' || e.key === 'H':
        eat(e);
        this.cycleTarget();
        return;
      case code === 'KeyC' || e.key === 'c' || e.key === 'C':
        eat(e);
        if (this._sel?.anchors.length) this.toggleKindOf(this._sel.path, this._sel.anchors);
        return;
      case e.key === 'Delete' || e.key === 'Backspace':
        eat(e);
        this.deleteKey();
        return;
      case e.key === 'Insert':
        eat(e);
        this.insertAfter();
        return;
      case e.key === 'Enter':
        eat(e);
        this.enter();
        return;
    }
  };

  private zoomKey(e: KeyboardEvent, f: number): void {
    eat(e);
    this.zoomBy(f);
  }

  private escape(e: KeyboardEvent): void {
    if (this.cancelDrag()) {
      eat(e);
      return;
    }
    if (this._sel) {
      eat(e);
      this.setSel(undefined);
    }
  }

  private tab(e: KeyboardEvent): void {
    const ap = this.active();
    if (ap < 0 || !this.editable(ap)) return;
    const list = stops(this.paths[ap]);
    if (!list.length) return;
    const sel = this._sel;
    const cur = sel && sel.path === ap && sel.anchors.length ? stopIndex(list, sel.handle?.anchor ?? sel.anchors[sel.anchors.length - 1], sel.handle?.which) : -1;
    let next: number;
    if (cur < 0) {
      if (e.shiftKey) return;
      next = 0;
    } else next = cur + (e.shiftKey ? -1 : 1);
    if (next < 0 || next >= list.length) return; // out of the canvas: no trap
    eat(e);
    const st = list[next];
    this.setSel(st.which ? { path: ap, anchors: [st.i], handle: { anchor: st.i, which: st.which } } : { path: ap, anchors: [st.i] });
  }

  /** [ and ]: the previous / next anchor of the active subpath. */
  private step(dir: 1 | -1): void {
    const ap = this.active();
    if (ap < 0) return;
    const p = this.paths[ap];
    const n = p.anchors.length;
    if (!n) return;
    const sel = this._sel;
    const cur = sel && sel.path === ap && sel.anchors.length ? sel.handle?.anchor ?? sel.anchors[sel.anchors.length - 1] : -1;
    let next = cur < 0 ? (dir > 0 ? 0 : n - 1) : cur + dir;
    if (p.closed) next = (next + n) % n;
    else next = Math.min(n - 1, Math.max(0, next));
    this.setSel({ path: ap, anchors: [next] });
  }

  private cycleTarget(): void {
    const sel = this._sel;
    if (!sel || sel.anchors.length !== 1) return;
    const i = sel.anchors[0];
    const a = this.paths[sel.path]?.anchors[i];
    if (!a) return;
    const order: Array<'in' | 'out' | undefined> = [undefined];
    if (a.in) order.push('in');
    if (a.out) order.push('out');
    if (order.length === 1) {
      this.announce('This point has no handles. Press C to make it smooth.');
      return;
    }
    const cur = sel.handle ? order.indexOf(sel.handle.which) : 0;
    const which = order[(cur + 1) % order.length];
    this._sel = { path: sel.path, anchors: [i], handle: which ? { anchor: i, which } : undefined };
    this.emit('mc-path-select', this._sel);
    this.announce(which ? `Arrow keys move the ${which} handle.` : 'Arrow keys move the point.');
  }

  private arrow(e: KeyboardEvent): void {
    const d = DIRS[e.key];
    const amount = e.altKey ? this.fineNudge : e.shiftKey ? this.bigNudge : this.nudge;
    const snapped = !e.altKey && this.snap.enabled;
    const sel = this._sel;
    const ap = this.active();
    const step = (v: number, k: number): number => stepValue(v, d[k] * amount, snapped);
    if (this.mode === 'add') {
      eat(e);
      const a = this._cross ?? this.crossStart();
      this._cross = [step(a[0], 0), step(a[1], 1)];
      this.announce(`Cursor at x ${num(this._cross[0])}, y ${num(this._cross[1])}. Press Enter to place a point.`, 250);
      return;
    }
    const p = this.paths[ap];
    if (!p || !this.editable(ap)) {
      if (!sel) this.panBy(-d[0] * 40, -d[1] * 40, e);
      return;
    }
    if (!sel) return;
    eat(e);
    const h = sel.handle;
    const set = sel.anchors.length ? sel.anchors : p.anchors.map((_, i) => i);
    const i = h ? h.anchor : set[set.length - 1];
    const a = p.anchors[i];
    const cur = h ? a?.[h.which] : a && ([a.x, a.y] as Pt);
    if (!cur) return;
    let q: Pt = [step(cur[0], 0), step(cur[1], 1)];
    if (this.constrain) q = this.constrain(q, { path: ap, anchor: i, which: h ? h.which : 'anchor' });
    const np = h ? setHandle(p, i, h.which, q) : moveSet(p, set, q[0] - cur[0], q[1] - cur[1]);
    const label = h ? 'Move handle' : !sel.anchors.length ? 'Move path' : set.length > 1 ? 'Move points' : 'Move point';
    const list = this.paths.map((x, k) => (k === ap ? np : x));
    this._pending = { paths: list, commit: true, label };
    this.emitChange(list, false, label);
    clearTimeout(this._commitTimer);
    this._commitTimer = setTimeout(() => this.flushPending(), 800);
    if (sel.anchors.length) this.announce(`x ${num(q[0])}, y ${num(q[1])}`, 250);
  }

  private panBy(dx: number, dy: number, e?: Event): void {
    if (e) eat(e);
    this._view = { ...this._view, x: this._view.x + dx, y: this._view.y + dy };
    this._viewSet = true;
    this.emitView();
  }

  private crossStart(): Pt {
    const p = this.paths[this.active()];
    const a = p && !p.closed ? p.anchors[p.anchors.length - 1] : undefined;
    return a ? [a.x, a.y] : [this.frame.x + this.frame.w / 2, this.frame.y + this.frame.h / 2];
  }

  private deleteKey(): void {
    const sel = this._sel;
    const ap = this.active();
    const p = this.paths[ap];
    if (!sel || !p || !this.editable(ap)) return;
    const h = sel.handle;
    const a = h && p.anchors[h.anchor];
    if (h && a) {
      this.emitChange(
        this.paths.map((x, i) => (i === ap ? setHandle(p, h.anchor, h.which, [a.x, a.y]) : x)),
        true,
        'Delete handle',
      );
      this._sel = { path: ap, anchors: [h.anchor] };
      this.emit('mc-path-select', this._sel);
      this.announce('Handle deleted.');
      return;
    }
    if (!sel.anchors.length) return;
    const np = removeSet(p, sel.anchors);
    const n = np.anchors.length;
    this.emitChange(n ? this.paths.map((x, i) => (i === ap ? np : x)) : this.paths.filter((_, i) => i !== ap), true, sel.anchors.length > 1 ? 'Delete points' : 'Delete point');
    this.setSel(n ? { path: ap, anchors: [Math.min(n - 1, Math.max(0, Math.min(...sel.anchors) - 1))] } : undefined, false);
    this.announce(n ? `${sel.anchors.length > 1 ? 'Points' : 'Point'} deleted, ${pointsWord(n)}.` : 'Path deleted.');
  }

  private insertAfter(): void {
    const sel = this._sel;
    const ap = this.active();
    if (!sel || ap < 0 || sel.anchors.length !== 1 || !this.editable(ap)) return;
    const p = this.paths[ap];
    const i = sel.anchors[0];
    const segs = p.closed ? p.anchors.length : p.anchors.length - 1;
    if (i >= segs) return; // the end of an open path has no segment after it
    this.insertOnSegment(ap, i, 0.5);
  }

  private enter(): void {
    const sel = this._sel;
    const ap = this.active();
    if (this.mode === 'add') {
      const at = this._cross ?? this.crossStart();
      const res = this.appendPoint(this.place(at, false));
      if (!res) return;
      this.emitChange(res.paths, true, res.label);
      this.afterAdd(res.path, res.index, res.paths);
      return;
    }
    if (sel && sel.anchors.length === 1 && ap >= 0) this.emit('mc-path-fields', { path: ap, anchor: sel.handle?.anchor ?? sel.anchors[0] });
  }

  // ── context gesture ──

  private clearLp(): void {
    clearTimeout(this._lp);
    this._lp = undefined;
  }

  private longPress(g: Gesture): void {
    this._lp = undefined;
    if (this._g !== g || g.started) return;
    this._g = undefined;
    this.release(g.id);
    this.contextAt(g.down, g.client, 'touch');
  }

  private emitContext(client: Pt, frame: Pt, hit: PathContext['hit'], source: PathContext['source']): void {
    this._ctxAt = Date.now();
    this.emit<PathContext>('mc-path-context', { client, frame, hit, source });
  }

  /** Right-click or long-press at canvas px `s`: select what is under it first, then say where. */
  private contextAt(s: Pt, client: Pt, source: PathContext['source']): void {
    let h = this.hitTest(s, source === 'touch');
    const sel = this._sel;
    if (h.t === 'scale' || h.t === 'rotate') h = sel ? { t: 'body', path: sel.path } : { t: 'none' };
    const f = toFrame(this._view, s);
    if (h.t === 'none') return this.emitContext(client, f, undefined, source);
    const on = h.t === 'anchor' ? [h.i] : [];
    if (sel?.path !== h.path || (h.t === 'anchor' && !sel.anchors.includes(h.i))) this.setSel({ path: h.path, anchors: on });
    this.emitContext(client, f, { path: h.path, anchor: h.t === 'anchor' ? h.i : undefined, segment: h.t === 'segment' ? h.seg : undefined, at: h.t === 'segment' ? f : undefined }, source);
  }

  private _onContext = (e: MouseEvent): void => {
    const t = e.composedPath()[0] as Node;
    if (!this.contextMenu || this.mode === 'view' || (t !== this && !this.surface()?.contains(t))) return;
    e.preventDefault();
    if (Date.now() - this._ctxAt < CONTEXT_DEDUPE_MS) return;
    if (t === this) return this.keyContext();
    const pt = (e as PointerEvent).pointerType;
    this.contextAt(this.screenOf(e), [e.clientX, e.clientY], pt === 'touch' ? 'touch' : pt === 'pen' ? 'pen' : 'mouse');
  };

  /** ContextMenu key or Shift+F10: at the focused point, else the box centre, else the canvas centre. */
  private keyContext(): void {
    const sel = this._sel;
    const b = this.transform?.box ?? this.frame;
    const i = sel?.anchors.length ? (sel.handle?.anchor ?? sel.anchors[sel.anchors.length - 1]) : -1;
    const a = sel && i >= 0 ? this.paths[sel.path]?.anchors[i] : undefined;
    const f: Pt = a ? [a.x, a.y] : [b.x + b.w / 2, b.y + b.h / 2];
    const sc = toScreen(this._view, f);
    const r = this.surface()?.getBoundingClientRect();
    this.emitContext([(r?.left ?? 0) + sc[0], (r?.top ?? 0) + sc[1]], f, sel ? { path: sel.path, anchor: a ? i : undefined } : undefined, 'keyboard');
  }

  /** Rotation slider: Arrows 1 degree, Shift+Arrows 15, Home back to 0; one commit per key. */
  private _rotKey = (e: KeyboardEvent): void => {
    const t = this.transform;
    if (!t || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    const step = e.shiftKey ? 15 : 1;
    const d = k === 'ArrowRight' || k === 'ArrowUp' ? step : k === 'ArrowLeft' || k === 'ArrowDown' ? -step : k === 'Home' ? -(t.angle ?? 0) : undefined;
    if (d === undefined) return;
    eat(e);
    if (!d) return;
    const b = t.box;
    this.emit<PathTransform>('mc-path-transform', { kind: 'rotate', matrix: rotateMatrix([b.x + b.w / 2, b.y + b.h / 2], d), angle: d, commit: true, label: 'Rotate', source: 'keyboard' });
    this.announce(`${num((t.angle ?? 0) + d)} degrees`, 250);
  };

  // ── render ──

  /** Path i as painted, plus the 1 px edit outline when `cls` is given. */
  private drawPath(i: number, cls = ''): TemplateResult | typeof nothing {
    const p = this.paths[i];
    const pt = this.paint[i];
    if (pt?.hidden || !p.anchors.length) return nothing;
    const d = serialize(p);
    return svg`<path d=${d} fill=${pt?.fill ?? 'none'} stroke=${pt?.stroke ?? 'none'} stroke-width=${pt?.strokeWidth ?? 1} fill-rule=${pt?.fillRule ?? 'nonzero'}></path>${cls ? svg`<path class=${cls} d=${d}></path>` : nothing}`;
  }

  private renderArt(): TemplateResult {
    const { x, y, zoom } = this._view;
    const fr = this.frame;
    const ap = this.active();
    const edit = this.mode !== 'view';
    let grid = '';
    if (this.pixelGrid) {
      const step = this.gridStep && this.gridStep > 0 ? this.gridStep : 1;
      const k = Math.max(1, Math.ceil(GRID_MIN_PX / (step * zoom) - 1e-9), Math.ceil(Math.max(fr.w, fr.h) / (step * 256)));
      const s = step * k;
      const at = (i: number): number => Math.round(i * s * 1000) / 1000;
      for (let i = 1; at(i) < fr.w - 1e-9; i++) grid += `M${fr.x + at(i)} ${fr.y}v${fr.h}`;
      for (let i = 1; at(i) < fr.h - 1e-9; i++) grid += `M${fr.x} ${fr.y + at(i)}h${fr.w}`;
    }
    const sa = this.safeArea;
    return svg`<g transform="translate(${x} ${y}) scale(${zoom})">
      <rect class="frame" x=${fr.x} y=${fr.y} width=${fr.w} height=${fr.h}></rect>
      ${grid ? svg`<path class="grid" d=${grid}></path>` : nothing}
      ${sa ? svg`<rect class="safe" x=${fr.x + sa} y=${fr.y + sa} width=${Math.max(0, fr.w - sa * 2)} height=${Math.max(0, fr.h - sa * 2)}></rect>` : nothing}
      ${this.paths.map((p, i) => this.drawPath(i, edit ? `outline${p.closed && !this.paint[i]?.fill ? ' wash' : ''}${i === ap ? '' : ' dim'}` : ''))}
    </g>`;
  }

  private renderEdit(): TemplateResult | typeof nothing {
    const v = this._view;
    const ap = this.active();
    const sel = this._sel;
    const out: TemplateResult[] = [];
    const p = this.paths[ap];
    if ((this.mode === 'nodes' || this.mode === 'add') && p && this.visible(ap)) {
      const mine = sel?.path === ap ? sel : undefined;
      const picked = mine?.anchors ?? [];
      const items = p.anchors.map((a, i) => {
        const sp = toScreen(v, [a.x, a.y]);
        const on = picked.includes(i);
        const hs = on || mine?.handle?.anchor === i;
        const kind = effectiveKind(a);
        const hin = hs ? a.in : undefined;
        const hout = hs ? a.out : undefined;
        return guard([sp[0], sp[1], kind, on, hin?.[0], hin?.[1], hout?.[0], hout?.[1], v.zoom, v.x, v.y], () => {
          const hl = ([['in', hin], ['out', hout]] as const).map(([w, h]) => {
            if (!h) return nothing;
            const hp = toScreen(v, h);
            const cur = mine?.handle?.anchor === i && mine.handle.which === w;
            return svg`<line class="hline" x1=${sp[0]} y1=${sp[1]} x2=${hp[0]} y2=${hp[1]}></line><circle class=${cur ? 'pt h sel' : 'pt h'} cx=${hp[0]} cy=${hp[1]} r=${cur ? 4.5 : 3.5}></circle>`;
          });
          const r = on ? 5.5 : 4.5;
          return svg`${hl}${kind === 'corner' ? svg`<rect class=${on ? 'pt sel' : 'pt'} x=${sp[0] - r} y=${sp[1] - r} width=${r * 2} height=${r * 2}></rect>` : svg`<circle class=${on ? 'pt sel' : 'pt'} cx=${sp[0]} cy=${sp[1]} r=${r + 0.5}></circle>`}`;
        });
      });
      out.push(svg`<g class="anchors">${items}</g>`);
      const cur = this._kbd && this._focused && mine && picked.length ? p.anchors[mine.handle?.anchor ?? picked[picked.length - 1]] : undefined;
      if (cur) {
        const c = toScreen(v, (mine?.handle && cur[mine.handle.which]) || [cur.x, cur.y]);
        out.push(svg`<circle class="ring" cx=${c[0]} cy=${c[1]} r="9"></circle>`);
      }
    }
    const g = this._guides;
    const [w, h] = this._size;
    const tag = (text: string, x: number, y: number): TemplateResult => svg`<g class="tag"><rect x=${x - 3} y=${y - 11} width=${text.length * 6.4 + 6} height="15" rx="3"></rect><text x=${x} y=${y}>${text}</text></g>`;
    if (g.x) {
      const x = toScreen(v, [g.x.v, 0])[0];
      out.push(svg`<path class="guide" d="M${x} 0V${h}"></path>`, tag(g.x.label, x + 6, 16));
    }
    if (g.y) {
      const y = toScreen(v, [0, g.y.v])[1];
      out.push(svg`<path class="guide" d="M0 ${y}H${w}"></path>`, tag(g.y.label, 8, y - 6));
    }
    const tb = this.transform;
    if (tb && this.mode === 'select') out.push(this.renderBox(tb));
    const m = this._marquee;
    if (m) out.push(svg`<rect class="marquee" x=${Math.min(m[0][0], m[1][0])} y=${Math.min(m[0][1], m[1][1])} width=${Math.abs(m[0][0] - m[1][0])} height=${Math.abs(m[0][1] - m[1][1])}></rect>`);
    if (this.mode === 'add' && this._cross) {
      const c = toScreen(v, this._cross);
      out.push(svg`<path class="cross" d="M${c[0] - 8} ${c[1]}h16M${c[0]} ${c[1] - 8}v16"></path>`);
    }
    return out.length ? svg`${out}` : nothing;
  }

  /** The selection box, its eight scale handles and the rotate handle; during a drag from the gesture's own state. */
  private renderBox(tb: TransformBox): TemplateResult {
    const gb = this._gbox;
    const r = this.boxRect(gb?.box ?? tb.box);
    const coarse = this.coarse();
    const k = HANDLE_GLYPH_PX;
    const cx = (r[0] + r[2]) / 2;
    const cy = (r[1] + r[3]) / 2;
    const turning = gb && gb.angle !== 0;
    const sq = (x: number, y: number): TemplateResult => svg`<rect class="tbh" x=${x - k / 2} y=${y - k / 2} width=${k} height=${k}></rect>`;
    const q = turning ? undefined : this.rotSpot(coarse);
    return svg`<g class="tbox"><rect class="tb" x=${r[0]} y=${r[1]} width=${r[2] - r[0]} height=${r[3] - r[1]} transform=${turning ? `rotate(${gb.angle} ${cx} ${cy})` : nothing}></rect>${
      turning || !tb.scale ? nothing : placeHandles(r, coarse ? HIT_MIN_COARSE : HIT_MIN_FINE).map((h) => sq(h.at[0], h.at[1]))
    }${q ? svg`<path class="tb" d="M${cx} ${q[1] < r[1] ? r[1] : r[3]}V${q[1]}"></path><circle class="tbh" cx=${q[0]} cy=${q[1]} r=${k / 2}></circle>` : nothing}</g>`;
  }

  private renderSlider(): TemplateResult | typeof nothing {
    const q = this.rotSpot();
    const tb = this.transform;
    if (!q || !tb) return nothing;
    const hit = this.coarse() ? HIT_MIN_COARSE : HIT_MIN_FINE;
    const a = tb.angle ?? 0;
    return html`<div class="rot" role="slider" tabindex="0" aria-label=${this.rotateLabel} aria-valuemin="-360" aria-valuemax="360" aria-valuenow=${a} aria-valuetext="${num(a)} degrees" style="left:${q[0] - hit / 2}px;top:${q[1] - hit / 2}px;width:${hit}px;height:${hit}px" @keydown=${this._rotKey}></div>`;
  }

  private renderLoupe(): TemplateResult | typeof nothing {
    const L = this._loupe;
    if (!L || !this._loupeOn) return nothing;
    const c = loupeCentre(L.contact, this._size[0]);
    const r = LOUPE_SIZE_PX / 2;
    const label = `x ${num(L.at[0])}, y ${num(L.at[1])}${this.loupeLabel ? ` ${this.loupeLabel}` : ''}`;
    return html`<div class="loupe" aria-hidden="true" style="left:${c[0] - r}px;top:${c[1] - r}px"><div class="lens"><svg viewBox="0 0 ${r * 2} ${r * 2}"><g transform="translate(${r} ${r}) scale(${this._view.zoom * LOUPE_ZOOM}) translate(${-L.at[0]} ${-L.at[1]})">${this.paths.map((_, i) => this.drawPath(i, 'outline'))}</g><rect class="pt sel" x=${r - 5.5} y=${r - 5.5} width="11" height="11"></rect></svg></div><span class="lbl">${label}</span></div>`;
  }

  private renderList(): TemplateResult | typeof nothing {
    if (this.mode === 'view') return nothing;
    if (this._g?.started && this._list) return this._list;
    const ap = this.active();
    const sel = this._sel;
    this._list = html`<ul class="sr" role="listbox" aria-label="Points">${(this.paths[ap]?.anchors ?? []).map((_, i) => html`<li role="option" aria-selected=${sel?.path === ap && sel.anchors.includes(i)}>${this.describeAnchor(ap, i)}</li>`)}</ul>`;
    return this._list;
  }

  protected render(): TemplateResult {
    const g = this._g;
    const cur = cursorFor({ mode: this.mode, hit: g ? g.hit : this._hover, drag: g?.kind, space: this._space, panning: this._panning, delegated: this.mode === 'select' && !this.contextMenu });
    return html`<svg class="surface" style=${cur ? `cursor:${cur}` : nothing} part="surface" aria-hidden="true" @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._cancel}>
        ${this.renderArt()}${this.renderEdit()}
      </svg>
      ${this.renderSlider()}${this.renderLoupe()}${this._read ? html`<div class="read${this._read.touch ? ' up' : ''}" aria-hidden="true" style="left:${this._read.at[0]}px;top:${this._read.at[1]}px">${this._read.text}</div>` : nothing}${this.renderList()}
      <div class="sr" role="status" aria-live="polite">${this._live}</div>`;
  }
}
