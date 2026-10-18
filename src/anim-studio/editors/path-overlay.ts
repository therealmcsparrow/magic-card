import { LitElement, html, css, svg, nothing, type PropertyValues, type TemplateResult, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AnimationDoc } from '../model';
import type { StageInfo } from '../slots';
import { append as appendPoint, insertAt as insertPoint, isSmooth, moveAnchor, nearestOnPath, remove as removePoint, serialize as serializePath, setClosed, snap, toggleSmooth, type EditPath, type Pt } from '../../path/edit';
import { parsePath, pointAtTime, setHandle } from './path-utils';

/** Grid step in document units: 5% (percent paths) or 10 px. */
const gridStep = (units: string | undefined): number => (units === 'px' ? 10 : 5);
/** Two taps on the same point within this many ms: a double tap / double click. */
const DOUBLE_TAP_MS = 350;
/** Pointer travel (px) before a press counts as a drag. */
const DRAG_SLOP = 3;

interface View {
  w: number;
  h: number;
  /** The path's (0, 0) on the stage, px. */
  ox: number;
  oy: number;
  /** Stage px per document unit. */
  sx: number;
  sy: number;
}

interface Drag {
  pointerId: number;
  kind: 'anchor' | 'handle';
  index: number;
  which?: 'in' | 'out';
  /** The pointer's stage position at the press. */
  start: Pt;
  /** Anchor or handle position minus the pointer's, document units (no jump on grab). */
  grab: Pt;
  moved: boolean;
  /** The press added the point (one undo step "Add point", sent on release even without a move). */
  added: boolean;
  label: string;
  /** Selection before the press (a click on the first point with the last selected closes the path). */
  prevSel: number;
}

/**
 * The path motion editor's stage overlay (editor contract: absolutely positioned over the preview
 * card, `.stageRect` its size). Draws the document's path in stage coordinates and edits it:
 * - click the stage: add a point at the end (at the start while the first point is selected);
 *   click the line: insert a point there; drag points and their bezier handles (a smooth point's
 *   handles stay mirrored, Alt moves one alone); double-click / double-tap a point: smooth <-> corner;
 * - click the first point while the last is selected (or the other way round): close the path;
 * - keyboard: Tab to a point, arrows nudge (Shift: a grid step), Enter smooth/corner, Delete
 *   removes, Escape deselects;
 * - positions snap to a 5% grid (10 px for px paths); Shift while dragging places freely.
 * Mapping: percent units are % of the stage size, px are stage px; (0, 0) is the stage centre (the
 * element's rest position) or, for particles, its top left corner (the fx layer's origin). An
 * optional `.subjectRect` narrows element / icon paths to the moving element's own box.
 * Events: doc-change { doc, label, transient } like every kind editor.
 */
@customElement('mc-anim-path-overlay')
export class AnimPathOverlay extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 40px;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      --po-accent: var(--primary-color, #03a9f4);
      --po-ink: var(--primary-text-color, #212121);
      --po-surface: var(--card-background-color, #fff);
      --po-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.55;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
      cursor: crosshair;
    }
    :host([closed]) svg {
      cursor: default;
    }
    .bg {
      fill: transparent;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--po-ink) 9%, transparent);
      stroke-width: 1;
      pointer-events: none;
      transition: stroke 0.15s ease-out;
    }
    .dragging .grid {
      stroke: color-mix(in srgb, var(--po-ink) 16%, transparent);
    }
    .free .grid {
      stroke: transparent;
    }
    .origin {
      fill: none;
      stroke: color-mix(in srgb, var(--po-ink) 45%, transparent);
      stroke-width: 1.25;
      pointer-events: none;
    }
    .casing {
      fill: none;
      stroke: color-mix(in srgb, var(--po-surface) 85%, transparent);
      stroke-width: calc(6px * var(--u, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .line {
      fill: none;
      stroke: var(--po-accent);
      stroke-width: calc(2px * var(--u, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .hit {
      fill: none;
      stroke: transparent;
      stroke-width: calc(16px * var(--u, 1));
      pointer-events: stroke;
      cursor: copy;
    }
    .arrow {
      fill: var(--po-accent);
      stroke: var(--po-surface);
      stroke-width: 1;
      pointer-events: none;
    }
    .hline {
      stroke: color-mix(in srgb, var(--po-ink) 55%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .handle {
      cursor: grab;
    }
    .handle .knob {
      fill: var(--po-surface);
      stroke: var(--po-ink);
      stroke-width: calc(1.5px * var(--u, 1));
    }
    .handle:hover .knob,
    .handle.active .knob {
      fill: var(--po-accent);
      stroke: var(--po-surface);
    }
    .anchor {
      cursor: move;
      outline: none;
    }
    .anchor .mark {
      fill: var(--po-surface);
      stroke: var(--po-accent);
      stroke-width: calc(2px * var(--u, 1));
      transition: fill 0.15s ease-out;
    }
    .anchor.start .mark {
      fill: var(--po-accent);
      stroke: var(--po-surface);
    }
    .anchor:hover .mark {
      fill: color-mix(in srgb, var(--po-accent) 30%, var(--po-surface));
    }
    .anchor.sel .mark {
      fill: var(--po-fill);
      stroke: var(--po-surface);
    }
    .anchor .ring {
      fill: none;
      stroke: transparent;
      stroke-width: 2;
    }
    .anchor.sel .ring {
      stroke: var(--po-accent);
    }
    .anchor:focus-visible .ring {
      stroke: var(--po-accent);
      stroke-dasharray: 3 2;
    }
    .closable .mark {
      stroke-width: 3;
    }
    .tag {
      font:
        500 10px/1 Roboto,
        system-ui,
        sans-serif;
      fill: var(--po-ink);
      paint-order: stroke;
      stroke: var(--po-surface);
      stroke-width: 3px;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .subject {
      pointer-events: none;
    }
    /* the subject: neutral, so it never reads as a selected (accent) point */
    .subject .body {
      fill: color-mix(in srgb, var(--po-ink) 14%, transparent);
      stroke: color-mix(in srgb, var(--po-ink) 75%, transparent);
      stroke-width: 1.5;
      stroke-dasharray: 3 2;
    }
    .subject .core {
      fill: var(--po-ink);
    }
    .subject .heading {
      fill: var(--po-ink);
    }
    .hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 6px 12px;
      border-radius: 9999px;
      background: var(--po-surface);
      color: var(--po-ink);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.16),
        0 2px 6px rgba(0, 0, 0, 0.08);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    @media (prefers-reduced-motion: reduce) {
      .grid,
      .anchor .mark {
        transition: none;
      }
    }
  `;

  @property({ attribute: false }) doc?: AnimationDoc;
  /** The preview card's size (stage px); the overlay covers it exactly. */
  @property({ attribute: false }) stageRect?: { width: number; height: number };
  /**
   * Optional: the moving element's box at rest, in stage px (x, y from the overlay's top left), e.g.
   * the module icon for an icon path. Element and icon paths then start at its centre and % units
   * are of its size; without it they are of the whole stage. Particles always use the stage.
   */
  @property({ attribute: false }) subjectRect?: { x: number; y: number; width: number; height: number };
  /** 0-1: where the subject is drawn along the path. */
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * The stage geometry (slots.ts StageInfo): the overlay is drawn inside the scaled preview frame,
   * so handles, hit areas and strokes are counter-scaled by 1 / scale to stay touch-sized (24 px+).
   */
  @property({ attribute: false }) stage?: StageInfo;
  /** Contract props, unused here. */
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;
  /** Reflects a closed path (a click on the stage no longer adds points). */
  @property({ type: Boolean, reflect: true }) closed = false;

  /** Selected anchor, -1: none. */
  @state() private _sel = -1;
  /** Measured own size, when no stageRect is given. */
  @state() private _box?: { width: number; height: number };
  /** Shift held during the current drag (no snapping). */
  @state() private _free = false;
  @state() private _announce = '';

  private _path: EditPath = { anchors: [], closed: false };
  /** The path data `_path` stands for (an incoming doc with other data is parsed again). */
  private _d?: string;
  private _drag?: Drag;
  private _lastTap?: { index: number; at: number };
  private _ro?: ResizeObserver;

  /** The selected anchor (for tests and the shell). */
  get selected(): number {
    return this._sel;
  }

  /** Select anchor `i` (-1: none). */
  select(i: number): void {
    this._sel = i >= 0 && i < this._path.anchors.length ? i : -1;
  }

  constructor() {
    super();
    // on the host: keys reach it from a focused point and from the focused overlay itself
    this.addEventListener('keydown', (e) => this._onKey(e));
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => {
        const r = this.getBoundingClientRect();
        if (r.width && r.height && (r.width !== this._box?.width || r.height !== this._box?.height)) this._box = { width: r.width, height: r.height };
      });
      this._ro.observe(this);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = undefined;
    this._endDrag(true);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc')) {
      const d = this.doc?.path?.d ?? '';
      if (d !== this._d) {
        this._path = parsePath(d);
        this._d = d;
        if (this._sel >= this._path.anchors.length) this._sel = -1;
        // an outside change (undo, a template) during a drag ends it without writing
        if (this._drag) this._endDrag(false);
      }
    }
    this.closed = this._path.closed;
  }

  // ── geometry ──

  private _view(): View {
    const w = this.stageRect?.width || this._box?.width || 360;
    const h = this.stageRect?.height || this._box?.height || 120;
    const spec = this.doc?.path;
    const px = spec?.units === 'px';
    if (spec?.subject === 'particles') return { w, h, ox: 0, oy: 0, sx: px ? 1 : w / 100, sy: px ? 1 : h / 100 };
    const r = this.subjectRect && this.subjectRect.width > 0 && this.subjectRect.height > 0 ? this.subjectRect : { x: 0, y: 0, width: w, height: h };
    return { w, h, ox: r.x + r.width / 2, oy: r.y + r.height / 2, sx: px ? 1 : r.width / 100, sy: px ? 1 : r.height / 100 };
  }

  private _toStage(v: View, p: Pt): Pt {
    return [v.ox + p[0] * v.sx, v.oy + p[1] * v.sy];
  }

  private _toDoc(v: View, p: Pt): Pt {
    return [(p[0] - v.ox) / v.sx, (p[1] - v.oy) / v.sy];
  }

  /** The pointer's position in stage px (the svg may be scaled by a CSS transform). */
  private _local(e: PointerEvent | MouseEvent, v: View): Pt {
    const r = this.getBoundingClientRect();
    const kx = r.width ? v.w / r.width : 1;
    const ky = r.height ? v.h / r.height : 1;
    return [(e.clientX - r.left) * kx, (e.clientY - r.top) * ky];
  }

  private _snapPt(p: Pt, free: boolean): Pt {
    if (free) return [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];
    const g = gridStep(this.doc?.path?.units);
    return [snap(p[0], g), snap(p[1], g)];
  }

  // ── writing ──

  private _emit(path: EditPath, label: string, transient = false): void {
    if (!this.doc) return;
    const d = serializePath(path);
    this._path = path;
    this._d = d;
    this.closed = path.closed;
    const doc: AnimationDoc = { ...this.doc, path: { ...(this.doc.path ?? { units: 'percent', follow_rotation: false, subject: 'element' }), d } };
    if (!transient) this._announce = label;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
    this.requestUpdate();
  }

  // ── pointer ──

  private _press(e: PointerEvent, drag: Omit<Drag, 'pointerId' | 'start' | 'moved'>, v: View): void {
    e.preventDefault();
    e.stopPropagation();
    const svgEl = this.renderRoot.querySelector('svg');
    try {
      svgEl?.setPointerCapture(e.pointerId);
    } catch {
      // synthetic events (tests) have no active pointer
    }
    this._drag = { ...drag, pointerId: e.pointerId, start: this._local(e, v), moved: false };
    this._free = e.shiftKey;
  }

  private _onAnchorDown(e: PointerEvent, i: number): void {
    if (this.disabled || e.button > 0) return;
    const v = this._view();
    const now = e.timeStamp || performance.now();
    if (this._lastTap && this._lastTap.index === i && now - this._lastTap.at < DOUBLE_TAP_MS) {
      e.preventDefault();
      e.stopPropagation();
      this._lastTap = undefined;
      this._toggleSmooth(i);
      return;
    }
    this._lastTap = { index: i, at: now };
    const prevSel = this._sel;
    this._sel = i;
    const a = this._path.anchors[i];
    const p = this._toDoc(v, this._local(e, v));
    this._press(e, { kind: 'anchor', index: i, grab: [a.x - p[0], a.y - p[1]], added: false, label: 'Move point', prevSel }, v);
    (e.currentTarget as SVGElement | null)?.focus?.({ preventScroll: true });
  }

  private _onHandleDown(e: PointerEvent, i: number, which: 'in' | 'out'): void {
    if (this.disabled || e.button > 0) return;
    const v = this._view();
    const h = this._path.anchors[i]?.[which];
    if (!h) return;
    const p = this._toDoc(v, this._local(e, v));
    this._press(e, { kind: 'handle', index: i, which, grab: [h[0] - p[0], h[1] - p[1]], added: false, label: 'Move handle', prevSel: this._sel }, v);
  }

  /** On the line: insert a point there and drag it. */
  private _onLineDown(e: PointerEvent): void {
    if (this.disabled || e.button > 0) return;
    const v = this._view();
    const q = this._toDoc(v, this._local(e, v));
    const near = nearestOnPath(this._path, q, [v.sx, v.sy]);
    if (!near) return;
    const { path, index } = insertPoint(this._path, near.seg, near.t);
    if (index < 0) return;
    this._sel = index;
    this._lastTap = { index, at: e.timeStamp || performance.now() };
    this._press(e, { kind: 'anchor', index, grab: [0, 0], added: true, label: 'Add point', prevSel: index }, v);
    this._emit(path, 'Add point', true);
  }

  /** On the empty stage: add a point at the end of an open path (the start while it is selected). */
  private _onStageDown(e: PointerEvent): void {
    if (this.disabled || e.button > 0) return;
    this.focus({ preventScroll: true });
    if (this._path.closed) {
      this._sel = -1;
      return;
    }
    const v = this._view();
    const q = this._snapPt(this._toDoc(v, this._local(e, v)), e.shiftKey);
    const atStart = this._sel === 0 && this._path.anchors.length > 1;
    const { path, index } = appendPoint(this._path, q, atStart);
    if (index < 0) return;
    this._sel = index;
    this._lastTap = { index, at: e.timeStamp || performance.now() };
    this._press(e, { kind: 'anchor', index, grab: [0, 0], added: true, label: 'Add point', prevSel: index }, v);
    this._emit(path, 'Add point', true);
  }

  private _onMove(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const v = this._view();
    const local = this._local(e, v);
    if (!drag.moved && Math.hypot(local[0] - drag.start[0], local[1] - drag.start[1]) < DRAG_SLOP) return;
    drag.moved = true;
    this._lastTap = undefined;
    this._free = e.shiftKey;
    const p = this._toDoc(v, local);
    const target = this._snapPt([p[0] + drag.grab[0], p[1] + drag.grab[1]], e.shiftKey);
    let next: EditPath;
    if (drag.kind === 'anchor') next = moveAnchor(this._path, drag.index, target[0], target[1]);
    else {
      const a = this._path.anchors[drag.index];
      next = setHandle(this._path, drag.index, drag.which!, target, isSmooth(a) && !e.altKey);
    }
    this._emit(next, drag.label, true);
  }

  private _onUp(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.pointerId) return;
    // a click on one end while the other is selected closes an open path
    if (!drag.moved && !drag.added && drag.kind === 'anchor' && !this._path.closed && this._path.anchors.length > 2) {
      const last = this._path.anchors.length - 1;
      if ((drag.index === 0 && drag.prevSel === last) || (drag.index === last && drag.prevSel === 0)) {
        this._drag = undefined;
        this._free = false;
        this._emit(setClosed(this._path, true), 'Close path');
        return;
      }
    }
    this._endDrag(true);
  }

  /** Finish a drag: `write` sends the final (non-transient) change when anything changed. */
  private _endDrag(write: boolean): void {
    const drag = this._drag;
    if (!drag) return;
    this._drag = undefined;
    this._free = false;
    const svgEl = this.renderRoot?.querySelector('svg');
    try {
      if (svgEl?.hasPointerCapture?.(drag.pointerId)) svgEl.releasePointerCapture(drag.pointerId);
    } catch {
      // already released
    }
    if (write && (drag.moved || drag.added)) this._emit(this._path, drag.label);
    else this.requestUpdate();
  }

  // ── commands (keyboard and gestures) ──

  private _toggleSmooth(i: number): void {
    const a = this._path.anchors[i];
    if (!a) return;
    const toCorner = !!(a.in || a.out);
    this._sel = i;
    this._emit(toggleSmooth(this._path, i), toCorner ? 'Corner point' : 'Smooth point');
  }

  /** Delete the selected point (the one before it is selected next). */
  deleteSelected(): void {
    const i = this._sel;
    if (i < 0 || this.disabled) return;
    const next = removePoint(this._path, i);
    this._sel = next.anchors.length ? Math.max(0, i - 1) : -1;
    this._emit(next, 'Delete point');
    void this.updateComplete.then(() => this._focusAnchor(this._sel));
  }

  /** Close or open the path. */
  toggleClosed(): void {
    if (this.disabled || this._path.anchors.length < 2) return;
    const closed = !this._path.closed;
    this._emit(setClosed(this._path, closed), closed ? 'Close path' : 'Open path');
  }

  private _focusAnchor(i: number): void {
    if (i < 0) return;
    this.renderRoot.querySelector<SVGGElement>(`.anchor[data-i="${i}"]`)?.focus({ preventScroll: true });
  }

  private _onKey(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === 'Escape') {
      if (this._drag) this._endDrag(true);
      if (this._sel >= 0) {
        e.preventDefault();
        e.stopPropagation();
        this._sel = -1;
        this.focus({ preventScroll: true });
      }
      return;
    }
    const i = this._sel;
    if (i < 0) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this.deleteSelected();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggleSmooth(i);
      return;
    }
    const dir: Record<string, Pt> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const d = dir[e.key];
    if (!d) return;
    e.preventDefault();
    const step = e.shiftKey ? gridStep(this.doc?.path?.units) : 1;
    const a = this._path.anchors[i];
    this._emit(moveAnchor(this._path, i, Math.round((a.x + d[0] * step) * 100) / 100, Math.round((a.y + d[1] * step) * 100) / 100), 'Nudge point');
  }

  // ── drawing ──

  private _grid(v: View): SVGTemplateResult {
    const g = gridStep(this.doc?.path?.units);
    const parts: string[] = [];
    const sx = g * v.sx;
    const sy = g * v.sy;
    if (sx >= 4) for (let x = v.ox % sx; x <= v.w + 0.01; x += sx) parts.push(`M${x.toFixed(1)} 0V${v.h}`);
    if (sy >= 4) for (let y = v.oy % sy; y <= v.h + 0.01; y += sy) parts.push(`M0 ${y.toFixed(1)}H${v.w}`);
    return svg`<path class="grid" d=${parts.join('')}></path>`;
  }

  /** The path in stage px (same anchors, mapped). */
  private _stageD(v: View): string {
    const map = (p: Pt): Pt => this._toStage(v, p);
    return serializePath({
      closed: this._path.closed,
      anchors: this._path.anchors.map((a) => {
        const [x, y] = map([a.x, a.y]);
        return { x, y, in: a.in ? map(a.in) : undefined, out: a.out ? map(a.out) : undefined };
      }),
    });
  }

  /** Small arrows along the line: the direction of travel. */
  private _arrows(v: View): SVGTemplateResult[] {
    const d = this._d ?? '';
    if (this._path.anchors.length < 2 || !d) return [];
    return [0.25, 0.5, 0.75].map((t) => {
      const a = pointAtTime(d, t - 0.01);
      const b = pointAtTime(d, t + 0.01);
      const c = pointAtTime(d, t);
      if (!a || !b || !c) return svg``;
      const pa = this._toStage(v, [a.x, a.y]);
      const pb = this._toStage(v, [b.x, b.y]);
      const pc = this._toStage(v, [c.x, c.y]);
      if (Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) < 0.5) return svg``;
      const ang = (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI;
      return svg`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${pc[0].toFixed(1)} ${pc[1].toFixed(1)}) rotate(${ang.toFixed(1)})"></path>`;
    });
  }

  /** Screen-size factor: 1 / the preview's scale (never below 1), so handles keep their size on screen. */
  private get _u(): number {
    const k = this.stage?.scale;
    return k && k > 0 && k < 1 ? 1 / k : 1;
  }

  private _handles(v: View): SVGTemplateResult | typeof nothing {
    const i = this._sel;
    const a = this._path.anchors[i];
    if (!a) return nothing;
    const at = this._toStage(v, [a.x, a.y]);
    const u = this._u;
    const one = (which: 'in' | 'out'): SVGTemplateResult | typeof nothing => {
      const h = a[which];
      if (!h) return nothing;
      const p = this._toStage(v, h);
      const active = this._drag?.kind === 'handle' && this._drag.which === which;
      return svg`
        <line class="hline" x1=${at[0]} y1=${at[1]} x2=${p[0]} y2=${p[1]}></line>
        <g class="handle ${active ? 'active' : ''}" data-which=${which} @pointerdown=${(e: PointerEvent) => this._onHandleDown(e, i, which)}>
          <circle cx=${p[0]} cy=${p[1]} r=${12 * u} fill="transparent"></circle>
          <circle class="knob" cx=${p[0]} cy=${p[1]} r=${4.5 * u}></circle>
        </g>`;
    };
    return svg`${one('in')}${one('out')}`;
  }

  private _anchors(v: View): SVGTemplateResult[] {
    const n = this._path.anchors.length;
    const last = n - 1;
    const closable = !this._path.closed && n > 2 && (this._sel === 0 || this._sel === last);
    const u = this._u;
    return this._path.anchors.map((a, i) => {
      const [x, y] = this._toStage(v, [a.x, a.y]);
      const smooth = !!(a.in || a.out);
      const sel = i === this._sel;
      const target = closable && ((this._sel === 0 && i === last) || (this._sel === last && i === 0));
      const kind = smooth ? 'smooth' : 'corner';
      const label = `Point ${i + 1} of ${n}${i === 0 ? ', start' : ''}, ${kind}, at ${Math.round(a.x * 10) / 10}, ${Math.round(a.y * 10) / 10}`;
      return svg`<g
        class="anchor ${sel ? 'sel' : ''} ${i === 0 ? 'start' : ''} ${target ? 'closable' : ''}"
        data-i=${i}
        data-kind=${kind}
        tabindex=${this.disabled ? -1 : 0}
        role="button"
        aria-pressed=${sel ? 'true' : 'false'}
        aria-label=${label}
        @pointerdown=${(e: PointerEvent) => this._onAnchorDown(e, i)}
        @focus=${() => {
          if (!this._drag) this._sel = i;
        }}
      >
        <circle cx=${x} cy=${y} r=${13 * u} fill="transparent"></circle>
        <circle class="ring" cx=${x} cy=${y} r=${10 * u}></circle>
        ${
          smooth
            ? svg`<circle class="mark" cx=${x} cy=${y} r=${5.5 * u}></circle>`
            : svg`<rect class="mark" x=${x - 5 * u} y=${y - 5 * u} width=${10 * u} height=${10 * u} rx=${1.5 * u}></rect>`
        }
      </g>`;
    });
  }

  /** The subject at `t`: a neutral ghost dot, with its heading when it follows the path. */
  private _dot(v: View, d: string, t: number, follow: boolean, k: number): SVGTemplateResult | typeof nothing {
    const s = pointAtTime(d, t);
    if (!s) return nothing;
    const [x, y] = this._toStage(v, [s.x, s.y]);
    let heading: SVGTemplateResult | typeof nothing = nothing;
    if (follow) {
      const a = pointAtTime(d, Math.max(0, t - 0.005));
      const b = pointAtTime(d, Math.min(1, t + 0.005));
      if (a && b) {
        const pa = this._toStage(v, [a.x, a.y]);
        const pb = this._toStage(v, [b.x, b.y]);
        const ang = (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI;
        heading = svg`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${ang.toFixed(1)})"></path>`;
      }
    }
    return svg`<g class="subject" data-k=${k} transform="translate(${x.toFixed(1)} ${y.toFixed(1)})${this._u !== 1 ? ` scale(${this._u})` : ''}">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${heading}
    </g>`;
  }

  /** Where the subject is at `.time`; particles: each one, spaced evenly along the path like the compiled layer. */
  private _subject(v: View): Array<SVGTemplateResult | typeof nothing> | typeof nothing {
    const d = this._d ?? '';
    if (this._path.anchors.length < 2) return nothing;
    const spec = this.doc?.path;
    const follow = !!spec?.follow_rotation;
    const t = Math.min(1, Math.max(0, Number.isFinite(this.time) ? this.time : 0));
    const n = spec?.subject === 'particles' ? Math.min(60, Math.max(1, spec.particles?.count ?? 3)) : 1;
    return Array.from({ length: n }, (_, k) => this._dot(v, d, k === 0 ? t : (t + k / n) % 1, follow, k));
  }

  protected render(): TemplateResult {
    const v = this._view();
    const n = this._path.anchors.length;
    const sd = this._stageD(v);
    const startTag = n > 1 ? this._toStage(v, [this._path.anchors[0].x, this._path.anchors[0].y]) : undefined;
    const cls = [this._drag ? 'dragging' : '', this._free ? 'free' : ''].join(' ');
    return html`
      <svg
        class=${cls}
        style="--u: ${this._u}"
        viewBox="0 0 ${v.w} ${v.h}"
        preserveAspectRatio="none"
        role="group"
        aria-label="Motion path. Click to add points, drag to move them."
        @pointerdown=${(e: PointerEvent) => this._onStageDown(e)}
        @pointermove=${(e: PointerEvent) => this._onMove(e)}
        @pointerup=${(e: PointerEvent) => this._onUp(e)}
        @pointercancel=${() => this._endDrag(true)}
        @lostpointercapture=${(e: PointerEvent) => {
          if (this._drag && e.pointerId === this._drag.pointerId) this._endDrag(true);
        }}
      >
        <rect class="bg" x="0" y="0" width=${v.w} height=${v.h}></rect>
        ${this._grid(v)}
        <path class="origin" d="M${v.ox - 6} ${v.oy}h12M${v.ox} ${v.oy - 6}v12"></path>
        ${
          sd
            ? svg`<path class="casing" d=${sd}></path><path class="line" d=${sd}></path>
              <path class="hit" d=${sd} @pointerdown=${(e: PointerEvent) => this._onLineDown(e)}></path>`
            : nothing
        }
        ${this._arrows(v)} ${this._subject(v)} ${this._handles(v)} ${this._anchors(v)}
        ${startTag ? svg`<text class="tag" x=${startTag[0] + 10} y=${startTag[1] - 9}>Start</text>` : nothing}
      </svg>
      ${n === 0 && !this.disabled ? html`<p class="hint">Click to place the first point</p>` : n === 1 && !this.disabled ? html`<p class="hint">Click to add the next point</p>` : nothing}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `;
  }

  protected firstUpdated(): void {
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-path-overlay': AnimPathOverlay;
  }
}
