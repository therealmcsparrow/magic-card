import { LitElement, html, css, svg, nothing, type PropertyValues, type TemplateResult, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { editorSystem } from '../../css/editor-system';
import { toCubicSubpaths } from '../../path/core';
import { entityColorCss } from '../../utils/entity-color';
import type { AnimationDoc } from '../model';
import { V2_CAPS, type RigShape, type TargetRef } from '../model-v2';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { ExportPiece } from '../svg-export';
import {
  TOOL_INFO,
  activeTool,
  drawToolActive,
  selectedShapeId,
  drawStore,
  isDrawTool,
  isRigRef,
  newShapeStyle,
  rigPieces,
  sourceViewBox,
  tileIcon,
  type DrawTool,
  type IconPieces,
} from './draw-store';
import './draw-svg-dialog';
// the other drawing panels register with the tools
import './draw-layers';
import './shape-inspector';
import type { AnimSvgDialog } from './draw-svg-dialog';
import { readSvgFile } from './draw-svg-dialog';
import {
  addShape,
  anchorsOf,
  dragBox,
  ellipsePath,
  fitFreehand,
  hitShape,
  isFilled,
  isStroked,
  linePath,
  MAX_FREEHAND_SAMPLES,
  nextShapeId,
  paintOrder,
  parseViewBox,
  pathBBox,
  rectPath,
  removeShape,
  rigIds,
  setTrackPath,
  snapPoint,
  translateD,
  updateShape,
  type Pt,
} from './draw-utils';
import { appendPoint, isSmooth, moveAnchor, parsePath, removePoint, serializePath, setClosed, setHandle, type EditPath } from './path-utils';

/*
 * Drawing on the icon (spec section C), two stage-tool panels:
 * - mc-anim-draw-toolbar: the Draw button group on the stage (select, pen, line, rectangle,
 *   ellipse, freehand, erase, motion path; import SVG and save as icon). Choosing a tool emits
 *   selection-change { kind: 'tool', tool }.
 * - mc-anim-draw-overlay: drawn over the stage while a draw tool is active or a shape is selected.
 *   Maps the icon's viewBox onto the stage (the stage's subject box, else a centred square), draws
 *   the rig's shapes as a preview only when asked (`preview`; the stage's card renders rig shapes
 *   itself), and edits them with pointer events (mouse, pen or finger; handles have 26 px targets).
 *   Snaps to a 1-unit grid and to icon / shape anchors (Shift: free). Every finished gesture is one
 *   doc-change (drags send transient moves first).
 */

const DRAG_SLOP = 3;
/** Anchor snapping reach, stage px. */
const SNAP_PX = 10;
/** Pointer tolerance for hitting a thin shape, stage px. */
const HIT_PX = 6;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface View {
  w: number;
  h: number;
  /** Stage px per viewBox unit. */
  k: number;
  ox: number;
  oy: number;
  vb: [number, number, number, number];
}

type Drag =
  | { kind: 'box'; tool: 'line' | 'rect' | 'ellipse'; pointerId: number; a: Pt; b: Pt; shift: boolean; alt: boolean }
  | { kind: 'free'; tool: 'freehand' | 'motion'; pointerId: number; raw: Pt[]; poly: string; last: Pt }
  | { kind: 'move'; pointerId: number; id: string; base: AnimationDoc; d: string; start: Pt; startStage: Pt; moved: boolean; delta: Pt }
  | { kind: 'anchor'; pointerId: number; id: string; base: AnimationDoc; path: EditPath; index: number; which?: 'in' | 'out'; grab: Pt; startStage: Pt; moved: boolean }
  | { kind: 'pen'; pointerId: number; index: number; startStage: Pt; moved: boolean }
  | { kind: 'erase'; pointerId: number; base: AnimationDoc; ids: string[] };

/** Least pointer travel (stage px) between two kept freehand samples. */
const SAMPLE_PX = 0.75;

/** A stored colour as CSS for the preview (entity colours through the entity variable). */
const paintCss = (v: string | undefined): string | undefined => (v ? (entityColorCss(v) ?? v) : undefined);

function shapeStyle(s: RigShape): Record<string, string> {
  return {
    fill: isFilled(s) ? (paintCss(s.fill) ?? 'currentColor') : 'none',
    stroke: isStroked(s) ? (paintCss(s.stroke) ?? 'currentColor') : 'none',
    'stroke-width': String(s.stroke_width ?? 1),
    'stroke-linecap': s.linecap ?? 'butt',
    'stroke-linejoin': 'round',
  };
}

const emitSelection = (el: HTMLElement, selection: StudioSelection): void => {
  el.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
};

// ── the stage overlay ──

@customElement('mc-anim-draw-overlay')
export class AnimDrawOverlay extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      color: var(--state-icon-color, #44739e);
      --do-accent: var(--primary-color, #03a9f4);
      --do-ink: var(--primary-text-color, #212121);
      --do-surface: var(--card-background-color, #fff);
      --do-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      z-index: 1;
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.55;
    }
    /* a tab stop for the keyboard (nudge, delete, finish the pen); pointer focus shows no ring */
    :host(:focus) {
      outline: none;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--do-accent);
      outline-offset: -2px;
    }
    svg.stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
      cursor: crosshair;
      outline: none;
    }
    svg.stage.t-select {
      cursor: default;
    }
    svg.stage.t-erase {
      cursor: cell;
    }
    .bg {
      fill: transparent;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--do-ink) 6%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .board {
      fill: none;
      stroke: color-mix(in srgb, var(--do-ink) 30%, transparent);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      pointer-events: none;
    }
    .shapes {
      pointer-events: none;
    }
    /* under-layer shapes sit behind the icon on the card; over it here, so they are dimmed */
    .shapes .under {
      opacity: 0.5;
    }
    .ghost-casing {
      fill: none;
      stroke: var(--do-surface);
      stroke-width: 3;
      stroke-linejoin: round;
      opacity: 0.85;
      pointer-events: none;
    }
    .ghost {
      fill: none;
      stroke: var(--do-ink);
      stroke-width: 1.25;
      stroke-dasharray: 2 3;
      stroke-linecap: round;
      pointer-events: none;
    }
    .draft {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .draft.fillable {
      fill: color-mix(in srgb, var(--do-accent) 12%, transparent);
    }
    .motion {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1.5;
      stroke-dasharray: 5 4;
      pointer-events: none;
    }
    .bbox {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1;
      pointer-events: none;
    }
    .hline {
      stroke: color-mix(in srgb, var(--do-ink) 55%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .knob {
      fill: var(--do-surface);
      stroke: var(--do-ink);
      stroke-width: 1.5;
    }
    .handle {
      cursor: grab;
    }
    .handle:hover .knob {
      fill: var(--do-accent);
    }
    .anchor {
      cursor: move;
    }
    .anchor .mark {
      fill: var(--do-surface);
      stroke: var(--do-accent);
      stroke-width: 2;
    }
    .anchor.first .mark {
      fill: var(--do-accent);
      stroke: var(--do-surface);
    }
    .anchor.sel .mark {
      fill: var(--do-fill);
      stroke: var(--do-surface);
    }
    .anchor.closable .mark {
      stroke-width: 3;
    }
    .snap {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1.5;
      pointer-events: none;
    }
    .dots circle {
      fill: color-mix(in srgb, var(--do-ink) 50%, transparent);
      pointer-events: none;
    }
    .drop {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--do-accent) 10%, transparent);
      border: 2px dashed var(--do-accent);
      border-radius: 12px;
      color: var(--do-ink);
      font-size: 0.875rem;
      font-weight: 500;
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
  `;

  @property({ attribute: false }) doc?: AnimationDoc;

  private _selection: StudioSelection = { kind: 'none' };
  /** Leaving the pen finishes the path drawn so far, before the new tool takes over. */
  @property({ attribute: false })
  get selection(): StudioSelection {
    return this._selection;
  }
  set selection(v: StudioSelection) {
    const next = v ?? { kind: 'none' };
    if (this._pen && activeTool(next) !== 'pen') this._finishPen(false);
    this._selection = next;
  }

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) tile?: string;
  @property({ type: Number }) time = 0;
  /** Contract props, unused here. */
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  /**
   * The stage: the preview card's size and the icon's box (subject) in unscaled card px, the scale
   * the card is shown at (screen px = card px x scale; the overlay covers the scaled frame), and the
   * icon's viewBox.
   */
  @property({ attribute: false }) stage?: StageInfo;
  /** Older shell props (v1 overlay contract), used when `stage` is missing. */
  @property({ attribute: false }) stageRect?: { width: number; height: number; subject?: Box };
  @property({ attribute: false }) subjectRect?: Box;
  /** The icon's box on the stage (stage px); wins over the stage's subject. */
  @property({ attribute: false }) iconRect?: Box;
  /** The icon's pieces (snapping); resolved from the rig / tile icon when not given. */
  @property({ attribute: false }) pieces?: ExportPiece[];
  /** The viewBox shapes are drawn in; default the stage's, else the source's (sourceViewBox). */
  @property({ type: String }) viewBox?: string;
  /**
   * Draw the rig's shapes here. Off: the stage's card draws them itself (icon rig, rig.ts). A stage
   * without a real card (harness pages) or a tile without an icon can turn it on.
   */
  @property({ type: Boolean }) preview = false;

  @state() private _box?: { width: number; height: number };
  @state() private _resolved?: IconPieces;
  @state() private _pen?: EditPath;
  @state() private _penSel = -1;
  @state() private _anchorSel = -1;
  @state() private _snapAt?: Pt;
  @state() private _dropping = false;
  @state() private _announce = '';

  private _drag?: Drag;
  private _ro?: ResizeObserver;
  private _unsub?: () => void;
  private _piecesKey = '';
  private _dialog?: AnimSvgDialog;
  /** Where events go after a mid-gesture unmount (the panel's old parent, if still in the page). */
  private _parent?: Node | null;
  private _anchorCache?: { shapes: RigShape[]; pieces: ExportPiece[]; exclude?: string; pts: Pt[] };
  private _ghostCache?: { raw: Pt[]; key: string; pts: string };
  /** Arrow keys held: one undo step for the whole nudge. */
  private _nudge?: { id: string; base: AnimationDoc; d: string; dx: number; dy: number };

  /** Tests and the harness: the current pen draft. */
  get penPath(): EditPath | undefined {
    return this._pen;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._unsub = drawStore.subscribe(() => this.requestUpdate());
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => {
        const r = this.getBoundingClientRect();
        if (r.width && r.height && (r.width !== this._box?.width || r.height !== this._box?.height)) this._box = { width: r.width, height: r.height };
      });
      this._ro.observe(this);
    }
    this._parent = this.parentNode;
    this.addEventListener('keydown', this._onKey);
    this.addEventListener('keyup', this._onKeyUp);
    this.addEventListener('blur', this._endNudge);
    this.addEventListener('dragover', this._onDragOver);
    this.addEventListener('dragleave', this._onDragLeave);
    this.addEventListener('drop', this._onDrop);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    this._ro?.disconnect();
    this._ro = undefined;
    this.removeEventListener('keydown', this._onKey);
    this.removeEventListener('keyup', this._onKeyUp);
    this.removeEventListener('blur', this._endNudge);
    this.removeEventListener('dragover', this._onDragOver);
    this.removeEventListener('dragleave', this._onDragLeave);
    this.removeEventListener('drop', this._onDrop);
    // unmounted mid-gesture (the tool changed, the panel went): finish it, so the shell is not left
    // with a transient change and the pen path is kept (events go to the old parent)
    this._end(true);
    this._endNudge();
    this._finishPen(false);
    drawStore.setHint('');
  }

  protected firstUpdated(): void {
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('selection')) {
      const prev = changed.get('selection') as StudioSelection | undefined;
      if (prev?.target !== this.selection.target) this._anchorSel = -1;
    }
    if ((changed.has('doc') || changed.has('tile') || changed.has('pieces')) && !this.pieces && this.doc) {
      const key = `${this.doc.rig?.svg ?? this.doc.rig?.icon ?? ''}|${this.tile ?? ''}`;
      if (key !== this._piecesKey) {
        this._piecesKey = key;
        void rigPieces(this.doc, this.tile).then((r) => {
          if (this._piecesKey === key) this._resolved = r;
        });
      }
    }
  }

  // ── geometry ──

  /** The viewBox the shapes are drawn in. */
  private get _viewBox(): string {
    return this.viewBox ?? this.stage?.viewBox?.join(' ') ?? sourceViewBox(this.doc?.rig, this._resolved);
  }

  /** The view in screen px of the overlay: the stage's unscaled card px times its scale. */
  private _view(): View {
    const sc = this.stage && this.stage.scale > 0 ? this.stage.scale : 1;
    const u = this._cardView(sc);
    return { w: u.w * sc, h: u.h * sc, k: u.k * sc, ox: u.ox * sc, oy: u.oy * sc, vb: u.vb };
  }

  /** The view in unscaled card px. */
  private _cardView(sc: number): View {
    const w = this.stage?.rect?.width || this.stageRect?.width || (this._box ? this._box.width / sc : 0) || 360;
    const h = this.stage?.rect?.height || this.stageRect?.height || (this._box ? this._box.height / sc : 0) || 240;
    const vb = parseViewBox(this._viewBox);
    const given = this.iconRect ?? this.stage?.subject ?? this.stageRect?.subject ?? this.subjectRect;
    let box: Box;
    if (given && given.width > 8 && given.height > 8) box = given;
    else {
      const side = Math.max(48, Math.min(w, h) - 48);
      box = { x: (w - side) / 2, y: (h - side) / 2, width: side, height: side };
    }
    const k = Math.min(box.width / vb[2], box.height / vb[3]);
    return { w, h, k, vb, ox: box.x + (box.width - vb[2] * k) / 2 - vb[0] * k, oy: box.y + (box.height - vb[3] * k) / 2 - vb[1] * k };
  }

  private _toStage(v: View, p: Pt): Pt {
    return [v.ox + p[0] * v.k, v.oy + p[1] * v.k];
  }

  private _toVB(v: View, p: Pt): Pt {
    return [(p[0] - v.ox) / v.k, (p[1] - v.oy) / v.k];
  }

  /** The pointer in overlay px (measured against the overlay's own box, so any CSS scaling cancels out). */
  private _local(e: PointerEvent | MouseEvent, v: View): Pt {
    const r = this.getBoundingClientRect();
    const kx = r.width ? v.w / r.width : 1;
    const ky = r.height ? v.h / r.height : 1;
    return [(e.clientX - r.left) * kx, (e.clientY - r.top) * ky];
  }

  /** Draw the shapes here: asked to, or the tile has no icon for the card to draw them on (text). */
  private get _previewShapes(): boolean {
    return this.preview || (!!this.tile && !tileIcon(this.tile));
  }

  private get _shapes(): RigShape[] {
    return this.doc?.rig?.shapes ?? [];
  }

  private get _pieceList(): ExportPiece[] {
    return this.pieces ?? this._resolved?.pieces ?? [];
  }

  private get _selectedId(): string | undefined {
    return selectedShapeId(this.selection);
  }

  private _snapAnchors(exclude?: string): Pt[] {
    if (!drawStore.options.anchors) return this._pen?.anchors.length ? [[this._pen.anchors[0].x, this._pen.anchors[0].y]] : [];
    const c = this._anchorCache;
    const shapes = this._shapes;
    const pieces = this._pieceList;
    if (!c || c.shapes !== shapes || c.pieces !== pieces || c.exclude !== exclude) {
      const pts: Pt[] = [];
      for (const p of pieces) pts.push(...anchorsOf(p.d));
      for (const s of shapes) if (s.id !== exclude) pts.push(...anchorsOf(s.d));
      this._anchorCache = { shapes, pieces, exclude, pts };
    }
    if (!this._pen) return this._anchorCache!.pts;
    return [...this._anchorCache!.pts, ...this._pen.anchors.map((a) => [a.x, a.y] as Pt)];
  }

  private _snap(v: View, p: Pt, free: boolean, exclude?: string): Pt {
    if (free) {
      this._snapAt = undefined;
      return [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];
    }
    const r = snapPoint(p, { grid: drawStore.options.grid ? 1 : 0, anchors: this._snapAnchors(exclude), radius: SNAP_PX / v.k });
    this._snapAt = r.kind === 'anchor' ? r.p : undefined;
    return r.p;
  }

  // ── writing ──

  private _emitDoc(doc: AnimationDoc, label: string, transient = false): void {
    if (!transient) this._announce = label;
    const target = this.isConnected ? this : this._parent?.isConnected ? this._parent : this;
    target.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
  }

  /** A finished drawing as a new shape (the tool options give its style). */
  private _commitShape(tool: DrawTool, d: string, closed: boolean): string | undefined {
    if (!this.doc || !d) return undefined;
    if (this._shapes.length >= V2_CAPS.shapes) {
      this._announce = `At most ${V2_CAPS.shapes} shapes fit in a rig.`;
      return undefined;
    }
    const info = TOOL_INFO[tool];
    const id = nextShapeId(rigIds(this.doc), info.base);
    const n = this._shapes.filter((s) => s.id.startsWith(`${info.base}-`)).length + 1;
    const shape: RigShape = { id, name: `${tool === 'pen' ? 'Path' : tool === 'freehand' ? 'Stroke' : info.label} ${n}`, d, layer: drawStore.options.layer, ...newShapeStyle(drawStore.options, closed) };
    const doc = addShape(this.doc, shape);
    if (!doc) return undefined;
    this._emitDoc(doc, `Draw ${info.label.toLowerCase()}`);
    return id;
  }

  /** Finish the pen path: closed, or open (needs two points; one point is dropped). */
  private _finishPen(close: boolean): void {
    const p = this._pen;
    this._pen = undefined;
    this._penSel = -1;
    if (!p || p.anchors.length < 2) return;
    const path = close ? setClosed(p, true) : p;
    this._commitShape('pen', serializePath(path), path.closed);
  }

  // ── pointer ──

  private _capture(e: PointerEvent): void {
    e.preventDefault();
    try {
      (this.renderRoot.querySelector('svg.stage') as SVGElement | null)?.setPointerCapture(e.pointerId);
    } catch {
      // synthetic events (tests) have no active pointer
    }
  }

  private _onDown(e: PointerEvent): void {
    if (this.disabled || e.button > 0 || !this.doc || this._drag) return;
    this._endNudge();
    // pointer focus: keys work, no focus ring (preventDefault on pointerdown stops the native focus)
    this.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    const v = this._view();
    const local = this._local(e, v);
    const raw = this._toVB(v, local);
    const tool = activeTool(this.selection);
    switch (tool) {
      case 'select': {
        const id = hitShape(this._shapes, raw, HIT_PX / v.k);
        if (!id) {
          if (this._selectedId) emitSelection(this, { kind: 'tool', tool: 'select' });
          return;
        }
        // the select tool keeps the stage: the shape is selected with it
        if (id !== this._selectedId) emitSelection(this, { kind: 'tool', tool: 'select', target: `shape:${id}` });
        const s = this._shapes.find((x) => x.id === id)!;
        this._capture(e);
        this._drag = { kind: 'move', pointerId: e.pointerId, id, base: this.doc, d: s.d, start: raw, startStage: local, moved: false, delta: [0, 0] };
        return;
      }
      case 'erase': {
        this._capture(e);
        this._drag = { kind: 'erase', pointerId: e.pointerId, base: this.doc, ids: [] };
        this._eraseAt(raw, v);
        return;
      }
      case 'line':
      case 'rect':
      case 'ellipse': {
        const a = this._snap(v, raw, e.shiftKey && tool === 'line');
        this._capture(e);
        this._drag = { kind: 'box', tool, pointerId: e.pointerId, a, b: a, shift: e.shiftKey, alt: e.altKey };
        return;
      }
      case 'freehand':
      case 'motion': {
        if (tool === 'motion' && !isRigRef(this.selection.target)) {
          this._announce = 'Select a part or shape first.';
          return;
        }
        this._capture(e);
        this._drag = { kind: 'free', tool, pointerId: e.pointerId, raw: [raw], poly: `${local[0].toFixed(1)},${local[1].toFixed(1)}`, last: local };
        this.requestUpdate();
        return;
      }
      case 'pen':
        this._penDown(e, v, local, raw);
        return;
    }
  }

  private _penDown(e: PointerEvent, v: View, local: Pt, raw: Pt): void {
    const pen = this._pen;
    const near = (i: number): boolean => {
      const a = pen!.anchors[i];
      const s = this._toStage(v, [a.x, a.y]);
      return Math.hypot(s[0] - local[0], s[1] - local[1]) <= 13;
    };
    if (pen && pen.anchors.length >= 2 && near(0)) {
      this._finishPen(true);
      return;
    }
    if (pen && pen.anchors.length >= 2 && near(pen.anchors.length - 1)) {
      this._finishPen(false);
      return;
    }
    const p = this._snap(v, raw, e.shiftKey);
    const r = appendPoint(pen ?? { anchors: [], closed: false }, p);
    if (r.index < 0) {
      this._announce = 'The path has the most points it can hold.';
      return;
    }
    this._pen = r.path;
    this._penSel = r.index;
    this._capture(e);
    this._drag = { kind: 'pen', pointerId: e.pointerId, index: r.index, startStage: local, moved: false };
  }

  private _eraseAt(p: Pt, v: View): void {
    const d = this._drag;
    if (d?.kind !== 'erase') return;
    let doc = d.base;
    for (const id of d.ids) doc = removeShape(doc, id);
    const id = hitShape(doc.rig?.shapes ?? [], p, HIT_PX / v.k);
    if (!id) return;
    d.ids.push(id);
    this._emitDoc(removeShape(doc, id), 'Erase shape', true);
  }

  /** On a selected shape's anchor or handle (single-subpath shapes): drag it. */
  private _onAnchorDown(e: PointerEvent, index: number, which?: 'in' | 'out'): void {
    if (this.disabled || e.button > 0 || !this.doc) return;
    e.stopPropagation();
    const id = this._selectedId;
    const s = id ? this._shapes.find((x) => x.id === id) : undefined;
    if (!s) return;
    const v = this._view();
    const local = this._local(e, v);
    const raw = this._toVB(v, local);
    const path = parsePath(s.d);
    const a = path.anchors[index];
    if (!a) return;
    const at = which ? a[which]! : ([a.x, a.y] as Pt);
    this._anchorSel = index;
    this._capture(e);
    this._drag = { kind: 'anchor', pointerId: e.pointerId, id: s.id, base: this.doc, path, index, which, grab: [at[0] - raw[0], at[1] - raw[1]], startStage: local, moved: false };
  }

  private _onMove(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    const v = this._view();
    const local = this._local(e, v);
    const raw = this._toVB(v, local);
    switch (d.kind) {
      case 'box':
        d.b = this._snap(v, raw, e.shiftKey && d.tool === 'line');
        d.shift = e.shiftKey;
        d.alt = e.altKey;
        this.requestUpdate();
        return;
      case 'free': {
        // samples: spaced at least SAMPLE_PX apart, at most MAX_FREEHAND_SAMPLES; the preview line
        // grows by appending (no rebuild per move)
        const coalesced = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
        let added = false;
        for (const c of coalesced.length ? coalesced : [e]) {
          if (d.raw.length >= MAX_FREEHAND_SAMPLES) break;
          const q = this._local(c, v);
          if (Math.hypot(q[0] - d.last[0], q[1] - d.last[1]) < SAMPLE_PX) continue;
          d.raw.push(this._toVB(v, q));
          d.poly += ` ${q[0].toFixed(1)},${q[1].toFixed(1)}`;
          d.last = q;
          added = true;
        }
        if (added) this.requestUpdate();
        return;
      }
      case 'erase':
        this._eraseAt(raw, v);
        return;
      case 'move': {
        if (!d.moved && Math.hypot(local[0] - d.startStage[0], local[1] - d.startStage[1]) < DRAG_SLOP) return;
        d.moved = true;
        let dx = raw[0] - d.start[0];
        let dy = raw[1] - d.start[1];
        if (!e.shiftKey && drawStore.options.grid) {
          dx = Math.round(dx);
          dy = Math.round(dy);
        }
        d.delta = [Math.round(dx * 100) / 100, Math.round(dy * 100) / 100];
        this._emitDoc(updateShape(d.base, d.id, { d: translateD(d.d, d.delta[0], d.delta[1]) }), 'Move shape', true);
        return;
      }
      case 'anchor': {
        if (!d.moved && Math.hypot(local[0] - d.startStage[0], local[1] - d.startStage[1]) < DRAG_SLOP) return;
        d.moved = true;
        const target = this._snap(v, [raw[0] + d.grab[0], raw[1] + d.grab[1]], e.shiftKey, d.id);
        const a = d.path.anchors[d.index];
        const next = d.which ? setHandle(d.path, d.index, d.which, target, isSmooth(a) && !e.altKey) : moveAnchor(d.path, d.index, target[0], target[1]);
        this._emitDoc(updateShape(d.base, d.id, { d: serializePath(next) }), d.which ? 'Move handle' : 'Move point', true);
        return;
      }
      case 'pen': {
        if (!d.moved && Math.hypot(local[0] - d.startStage[0], local[1] - d.startStage[1]) < DRAG_SLOP) return;
        d.moved = true;
        if (!this._pen) return;
        // dragging out of a new point pulls its handles (a smooth point; Alt: only the outgoing one)
        const q: Pt = e.shiftKey ? raw : [Math.round(raw[0] * 10) / 10, Math.round(raw[1] * 10) / 10];
        this._pen = setHandle(this._pen, d.index, 'out', q, !e.altKey);
        return;
      }
    }
  }

  private _onUp(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    this._end(true);
  }

  /** Finish the current gesture (`write`: commit it). */
  private _end(write: boolean): void {
    const d = this._drag;
    if (!d) return;
    this._drag = undefined;
    this._snapAt = undefined;
    try {
      const el = this.renderRoot.querySelector('svg.stage') as SVGElement | null;
      if (el?.hasPointerCapture?.(d.pointerId)) el.releasePointerCapture(d.pointerId);
    } catch {
      // already released
    }
    if (!write || !this.doc) {
      // cancelled: a gesture that already sent transient changes puts the document back
      // (a final change: the shell closes the gesture and leaves no undo step for it)
      if (d.kind === 'move' && d.moved) this._emitDoc(d.base, 'Move shape');
      if (d.kind === 'anchor' && d.moved) this._emitDoc(d.base, 'Move point');
      if (d.kind === 'erase' && d.ids.length) this._emitDoc(d.base, 'Erase shape');
      this.requestUpdate();
      return;
    }
    switch (d.kind) {
      case 'box': {
        const { tool, a, b } = d;
        if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.2) break;
        if (tool === 'line') this._commitShape('line', linePath(a, b), false);
        else {
          const box = dragBox(a, b, d.shift, d.alt);
          if (box.w < 0.2 || box.h < 0.2) break;
          const path =
            tool === 'rect' ? rectPath(box.x, box.y, box.w, box.h, drawStore.options.radius) : ellipsePath(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2);
          this._commitShape(tool, path, true);
        }
        break;
      }
      case 'free': {
        const fit = fitFreehand(d.raw, drawStore.options.tolerance);
        if (!fit.d) break;
        if (d.tool === 'freehand') {
          const id = this._commitShape('freehand', fit.d, fit.closed);
          if (id) drawStore.setLastFreehand({ id, raw: d.raw });
        } else {
          const target = this.selection.target as TargetRef;
          const doc = setTrackPath(this.doc, target, fit.d, drawStore.options.follow);
          if (doc) this._emitDoc(doc, 'Draw motion path');
          else this._announce = `At most ${V2_CAPS.tracks} animated targets.`;
        }
        break;
      }
      case 'move':
        if (d.moved) {
          this._emitDoc(updateShape(d.base, d.id, { d: translateD(d.d, d.delta[0], d.delta[1]) }), 'Move shape');
          this._followFreehand(d.id, d.delta[0], d.delta[1]);
        }
        break;
      case 'anchor':
        if (d.moved) {
          const s = this._shapes.find((x) => x.id === d.id);
          if (s) this._emitDoc(updateShape(d.base, d.id, { d: s.d }), d.which ? 'Move handle' : 'Move point');
          // the raw samples no longer match an edited stroke: smoothing can't refit it
          if (drawStore.lastFreehand?.id === d.id) drawStore.setLastFreehand(undefined);
        }
        break;
      case 'erase': {
        if (!d.ids.length) break;
        let doc = d.base;
        for (const id of d.ids) doc = removeShape(doc, id);
        this._emitDoc(doc, d.ids.length === 1 ? 'Erase shape' : 'Erase shapes');
        break;
      }
      case 'pen':
        break;
    }
    this.requestUpdate();
  }

  // ── keyboard ──

  /** The last freehand stroke moved: its raw samples move with it (the smoothing slider stays true). */
  private _followFreehand(id: string, dx: number, dy: number): void {
    const last = drawStore.lastFreehand;
    if (last?.id === id && (dx || dy)) drawStore.setLastFreehand({ id, raw: last.raw.map((p) => [p[0] + dx, p[1] + dy] as Pt) });
  }

  /** Arrow keys released (or focus gone): the nudge becomes one undo step. */
  private _endNudge = (): void => {
    const n = this._nudge;
    if (!n) return;
    this._nudge = undefined;
    const dx = Math.round(n.dx * 100) / 100;
    const dy = Math.round(n.dy * 100) / 100;
    this._emitDoc(updateShape(n.base, n.id, { d: translateD(n.d, dx, dy) }), 'Nudge shape');
    this._followFreehand(n.id, dx, dy);
  };

  private _onKeyUp = (e: KeyboardEvent): void => {
    if (/^Arrow/.test(e.key)) this._endNudge();
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (this.disabled || !this.doc) return;
    if (this._drag && e.key === 'Escape') {
      // Escape drops the gesture in progress (a moved shape goes back)
      e.preventDefault();
      e.stopPropagation();
      this._end(false);
      return;
    }
    if (!/^Arrow/.test(e.key)) this._endNudge();
    if (this._pen) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._finishPen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this._finishPen(false);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        const next = removePoint(this._pen, this._pen.anchors.length - 1);
        this._pen = next.anchors.length ? next : undefined;
        this._penSel = next.anchors.length - 1;
      }
      return;
    }
    const id = this._selectedId;
    if (e.key === 'Escape' && id) {
      e.preventDefault();
      e.stopPropagation();
      emitSelection(this, { kind: 'tool', tool: 'select' });
      return;
    }
    if (!id) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this._emitDoc(removeShape(this.doc, id), 'Delete shape');
      emitSelection(this, { kind: 'tool', tool: 'select' });
      return;
    }
    const dir: Record<string, Pt> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const step = dir[e.key];
    if (!step) return;
    e.preventDefault();
    if (this._nudge && this._nudge.id !== id) this._endNudge();
    if (!this._nudge) {
      const s = this._shapes.find((x) => x.id === id);
      if (!s) return;
      this._nudge = { id, base: this.doc, d: s.d, dx: 0, dy: 0 };
    }
    const n = this._nudge;
    const k = e.shiftKey ? 1 : 0.1;
    n.dx += step[0] * k;
    n.dy += step[1] * k;
    this._emitDoc(updateShape(n.base, id, { d: translateD(n.d, Math.round(n.dx * 100) / 100, Math.round(n.dy * 100) / 100) }), 'Nudge shape', true);
  };

  // ── dropping an .svg file on the stage ──

  private _onDragOver = (e: DragEvent): void => {
    if (this.disabled || !e.dataTransfer?.types?.includes('Files')) return;
    e.preventDefault();
    this._dropping = true;
  };

  private _onDragLeave = (): void => {
    this._dropping = false;
  };

  private _onDrop = async (e: DragEvent): Promise<void> => {
    this._dropping = false;
    const file = e.dataTransfer?.files?.[0];
    if (!file || this.disabled) return;
    e.preventDefault();
    const r = await readSvgFile(file);
    this._dialog ??= this.renderRoot.querySelector('mc-anim-svg-dialog') ?? undefined;
    if ('error' in r) {
      this._announce = r.error;
      this._dialog?.openImport('', file.name);
      return;
    }
    this._dialog?.openImport(r.text, file.name);
  };

  // ── drawing ──

  private _grid(v: View): SVGTemplateResult | typeof nothing {
    const tool = activeTool(this.selection);
    if (!drawStore.options.grid || v.k < 6 || tool === 'select' || tool === 'erase') return nothing;
    const [x0, y0, w, h] = v.vb;
    const parts: string[] = [];
    for (let i = 0; i <= w; i++) {
      const [sx] = this._toStage(v, [x0 + i, y0]);
      parts.push(`M${sx.toFixed(1)} ${(v.oy + y0 * v.k).toFixed(1)}v${(h * v.k).toFixed(1)}`);
    }
    for (let j = 0; j <= h; j++) {
      const [, sy] = this._toStage(v, [x0, y0 + j]);
      parts.push(`M${(v.ox + x0 * v.k).toFixed(1)} ${sy.toFixed(1)}h${(w * v.k).toFixed(1)}`);
    }
    return svg`<path class="grid" d=${parts.join('')}></path>`;
  }

  private _shapesLayer(v: View): SVGTemplateResult | typeof nothing {
    if (!this._previewShapes || !this._shapes.length) return nothing;
    const sel = this._selectedId;
    return svg`<g class="shapes" transform="translate(${v.ox} ${v.oy}) scale(${v.k})">
      ${paintOrder(this._shapes).map((s) => svg`<path class="${s.id === sel ? 'sel' : ''} ${s.layer}" data-id=${s.id} d=${s.d} style=${styleMap(shapeStyle(s))}></path>`)}
    </g>`;
  }

  private _stageD(v: View, d: string): string {
    if (!d) return '';
    return toCubicSubpaths(d)
      .map((s) => {
        if (!s.length) return '';
        const m = (p: Pt) => this._toStage(v, p);
        const st = m(s[0][0]);
        return `M${st[0].toFixed(1)} ${st[1].toFixed(1)}${s.map((c) => `C${[c[1], c[2], c[3]].map((p) => m(p).map((n) => n.toFixed(1)).join(' ')).join(' ')}`).join('')}`;
      })
      .join('');
  }

  /** The selected shape: its box, and anchors with handles when it is one subpath. */
  private _selectionLayer(v: View): SVGTemplateResult | typeof nothing {
    const id = this._selectedId;
    const s = id ? this._shapes.find((x) => x.id === id) : undefined;
    if (!s) return nothing;
    const b = pathBBox(s.d);
    const box = b
      ? (() => {
          const [x, y] = this._toStage(v, [b.x, b.y]);
          return svg`<rect class="bbox" x=${x - 4} y=${y - 4} width=${b.w * v.k + 8} height=${b.h * v.k + 8} rx="2"></rect>`;
        })()
      : nothing;
    if (toCubicSubpaths(s.d).length !== 1 || this._drag?.kind === 'move') return box;
    const path = parsePath(s.d);
    if (path.anchors.length > 100) return box;
    return svg`${box}${this._handlesOf(v, path, this._anchorSel, (i, which) => (e: PointerEvent) => this._onAnchorDown(e, i, which))}
      ${path.anchors.map((a, i) => {
        const [x, y] = this._toStage(v, [a.x, a.y]);
        return svg`<g class="anchor ${i === this._anchorSel ? 'sel' : ''}" data-i=${i} @pointerdown=${(e: PointerEvent) => this._onAnchorDown(e, i)}>
          <circle cx=${x} cy=${y} r="13" fill="transparent"></circle>
          <rect class="mark" x=${x - 4.5} y=${y - 4.5} width="9" height="9" rx="1.5"></rect>
        </g>`;
      })}`;
  }

  private _handlesOf(v: View, path: EditPath, i: number, down?: (i: number, which: 'in' | 'out') => (e: PointerEvent) => void): SVGTemplateResult | typeof nothing {
    const a = path.anchors[i];
    if (!a) return nothing;
    const at = this._toStage(v, [a.x, a.y]);
    const one = (which: 'in' | 'out'): SVGTemplateResult | typeof nothing => {
      const h = a[which];
      if (!h) return nothing;
      const p = this._toStage(v, h);
      return svg`<line class="hline" x1=${at[0]} y1=${at[1]} x2=${p[0]} y2=${p[1]}></line>
        <g class="handle" data-which=${which} @pointerdown=${down ? down(i, which) : null}>
          <circle cx=${p[0]} cy=${p[1]} r="13" fill="transparent"></circle>
          <circle class="knob" cx=${p[0]} cy=${p[1]} r="4.5"></circle>
        </g>`;
    };
    return svg`${one('in')}${one('out')}`;
  }

  private _penLayer(v: View): SVGTemplateResult | typeof nothing {
    const pen = this._pen;
    if (!pen) return nothing;
    const d = serializePath(pen);
    const n = pen.anchors.length;
    const closable = n >= 2;
    return svg`<path class="draft" d=${this._stageD(v, d)}></path>
      ${this._handlesOf(v, pen, this._penSel)}
      ${pen.anchors.map((a, i) => {
        const [x, y] = this._toStage(v, [a.x, a.y]);
        return svg`<g class="anchor pen ${i === 0 ? 'first' : ''} ${i === this._penSel ? 'sel' : ''} ${i === 0 && closable ? 'closable' : ''}" data-i=${i}>
          <circle cx=${x} cy=${y} r="13" fill="transparent"></circle>
          ${a.in || a.out ? svg`<circle class="mark" cx=${x} cy=${y} r="5"></circle>` : svg`<rect class="mark" x=${x - 4.5} y=${y - 4.5} width="9" height="9" rx="1.5"></rect>`}
        </g>`;
      })}`;
  }

  private _dragLayer(v: View): SVGTemplateResult | typeof nothing {
    const d = this._drag;
    if (!d) return nothing;
    if (d.kind === 'box') {
      let path = '';
      if (d.tool === 'line') path = linePath(d.a, d.b);
      else {
        const b = dragBox(d.a, d.b, d.shift, d.alt);
        if (b.w > 0 && b.h > 0) path = d.tool === 'rect' ? rectPath(b.x, b.y, b.w, b.h, drawStore.options.radius) : ellipsePath(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2);
      }
      return path ? svg`<path class="draft ${d.tool === 'line' ? '' : 'fillable'}" d=${this._stageD(v, path)}></path>` : nothing;
    }
    if (d.kind === 'free') return svg`<polyline class="draft" points=${d.poly}></polyline>`;
    return nothing;
  }

  /** The last freehand stroke's raw samples, while it is selected or the freehand tool is on. */
  private _ghost(v: View): SVGTemplateResult | typeof nothing {
    const last = drawStore.lastFreehand;
    if (!last || !this._shapes.some((s) => s.id === last.id)) return nothing;
    const tool = activeTool(this.selection);
    if (this._selectedId !== last.id && tool !== 'freehand') return nothing;
    const key = `${v.k}|${v.ox}|${v.oy}`;
    if (this._ghostCache?.raw !== last.raw || this._ghostCache.key !== key) {
      this._ghostCache = { raw: last.raw, key, pts: last.raw.map((p) => this._toStage(v, p).map((n) => n.toFixed(1)).join(',')).join(' ') };
    }
    const pts = this._ghostCache.pts;
    return svg`<polyline class="ghost-casing" points=${pts}></polyline><polyline class="ghost" points=${pts}></polyline>`;
  }

  /** The selected target's motion path, drawn from its resting centre. */
  private _motion(v: View): SVGTemplateResult | typeof nothing {
    const target = this.selection.target;
    if (!isRigRef(target)) return nothing;
    const track = this.doc?.tracks?.find((t) => t.target === target);
    if (!track?.path?.d) return nothing;
    const centre = this._targetCentre(target);
    if (!centre) return nothing;
    return svg`<path class="motion" d=${this._stageD(v, translateD(track.path.d, centre[0], centre[1]))}></path>`;
  }

  private _targetCentre(target: TargetRef): Pt | undefined {
    const [kind, id] = target.split(':');
    const rig = this.doc?.rig;
    const parts = kind === 'group' ? (rig?.groups?.find((g) => g.id === id)?.parts ?? []) : [id];
    const from = new Set(parts.flatMap((p) => rig?.parts.find((x) => x.id === p)?.from ?? []));
    const d =
      kind === 'shape'
        ? (this._shapes.find((s) => s.id === id)?.d ?? '')
        : this._pieceList
            .filter((p) => from.has(p.index))
            .map((p) => p.d)
            .join(' ');
    const b = d ? pathBBox(d) : undefined;
    if (b) return [b.x + b.w / 2, b.y + b.h / 2];
    const vb = parseViewBox(this._viewBox);
    return [vb[0] + vb[2] / 2, vb[1] + vb[3] / 2];
  }

  private _dots(v: View): SVGTemplateResult | typeof nothing {
    const d = this._drag;
    const drawing = (d && (d.kind === 'box' || d.kind === 'anchor' || d.kind === 'pen')) || !!this._pen;
    if (!drawing || !drawStore.options.anchors) return nothing;
    const pts = this._snapAnchors(d?.kind === 'anchor' ? d.id : undefined);
    return svg`<g class="dots">${pts.slice(0, 600).map((p) => {
      const [x, y] = this._toStage(v, p);
      return svg`<circle cx=${x} cy=${y} r="1.5"></circle>`;
    })}</g>`;
  }

  private _hint(): string {
    const tool = activeTool(this.selection);
    if (this._pen) return this._pen.anchors.length < 2 ? 'Click to add the next point' : TOOL_INFO.pen.hint;
    if (tool === 'motion' && !isRigRef(this.selection.target)) return 'Select a part or shape, then draw its motion path.';
    if (tool === 'select' && !this._shapes.length) return 'No shapes yet: pick a drawing tool.';
    if (this._drag || this._selectedId) return '';
    return TOOL_INFO[tool].hint;
  }

  protected updated(): void {
    // the hint shows in the toolbar (top dock), off the card
    drawStore.setHint(this.disabled ? '' : this._hint());
  }

  protected render(): TemplateResult {
    const v = this._view();
    const tool = activeTool(this.selection);
    const [bx, by] = this._toStage(v, [v.vb[0], v.vb[1]]);
    return html`
      <svg
        class="stage t-${tool}"
        viewBox="0 0 ${v.w} ${v.h}"
        preserveAspectRatio="none"
        role="application"
        aria-roledescription="drawing area"
        aria-label=${`${TOOL_INFO[tool].label} tool. ${TOOL_INFO[tool].hint}`}
        @pointerdown=${(e: PointerEvent) => this._onDown(e)}
        @pointermove=${(e: PointerEvent) => this._onMove(e)}
        @pointerup=${(e: PointerEvent) => this._onUp(e)}
        @pointercancel=${() => this._end(false)}
        @lostpointercapture=${(e: PointerEvent) => {
          if (this._drag && e.pointerId === this._drag.pointerId) this._end(true);
        }}
      >
        <rect class="bg" x="0" y="0" width=${v.w} height=${v.h}></rect>
        ${this._grid(v)}
        <rect class="board" x=${bx} y=${by} width=${v.vb[2] * v.k} height=${v.vb[3] * v.k} rx="2"></rect>
        ${this._shapesLayer(v)} ${this._ghost(v)} ${this._motion(v)} ${this._dots(v)} ${this._selectionLayer(v)} ${this._penLayer(v)} ${this._dragLayer(v)}
        ${this._snapAt
          ? (() => {
              const [x, y] = this._toStage(v, this._snapAt!);
              return svg`<circle class="snap" cx=${x} cy=${y} r="7"></circle>`;
            })()
          : nothing}
      </svg>
      ${this._dropping ? html`<div class="drop">Drop the .svg to import it</div>` : nothing}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `;
  }
}

// ── the toolbar ──

const TOOLBAR_TOOLS: DrawTool[] = ['select', 'pen', 'line', 'rect', 'ellipse', 'freehand', 'erase', 'motion'];

@customElement('mc-anim-draw-toolbar')
export class AnimDrawToolbar extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        pointer-events: none;
      }
      /* what to do next with the tool (the overlay's hint), under the bar and off the card */
      .hint {
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 4px 12px;
        border-radius: 9999px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        font-size: 0.75rem;
        font-weight: 500;
        text-align: center;
      }
      .bar {
        pointer-events: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 3px;
        border-radius: 10px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .bar .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 7px;
      }
      .bar .icon-btn[aria-pressed='true'] {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
        color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
      }
      .sep {
        width: 1px;
        align-self: stretch;
        margin: 4px 3px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      .open {
        pointer-events: auto;
        height: 36px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) tile?: string;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ attribute: false }) stage?: StageInfo;
  /** The icon's pieces for "Save as icon"; resolved from the rig / tile icon when not given. */
  @property({ attribute: false }) pieces?: ExportPiece[];

  @state() private _resolved?: { pieces: ExportPiece[]; viewBox: string };
  private _key = '';
  private _offHint?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._offHint = drawStore.onHint(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._offHint?.();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has('doc') || changed.has('tile')) && this.doc && !this.pieces) {
      const key = `${this.doc.rig?.svg ?? this.doc.rig?.icon ?? ''}|${this.tile ?? ''}`;
      if (key !== this._key) {
        this._key = key;
        void rigPieces(this.doc, this.tile).then((r) => {
          if (this._key === key) this._resolved = r;
        });
      }
    }
  }

  private get _dialog(): AnimSvgDialog | null {
    return this.renderRoot.querySelector('mc-anim-svg-dialog');
  }

  /** Open "Save as icon" (tests, shortcuts; `animated`: on the animated SVG). */
  openExport(animated = false): void {
    this._dialog?.openExport(animated);
  }

  /** Open "Import SVG" (tests, shortcuts). */
  openImport(text = '', name = ''): void {
    this._dialog?.openImport(text, name);
  }

  private _choose(tool: DrawTool): void {
    const sel = this.selection;
    const current = this.doc && drawToolActive(this.doc, sel) ? activeTool(sel) : undefined;
    if (current === tool && sel.kind === 'tool') {
      emitSelection(this, { kind: 'none' });
      return;
    }
    const target = isRigRef(sel.target) ? sel.target : undefined;
    emitSelection(this, { kind: 'tool', tool, ...(target ? { target } : {}) });
  }

  protected render(): TemplateResult {
    const doc = this.doc;
    if (!doc || doc.kind !== 'keyframes') return html``;
    const active = drawToolActive(doc, this.selection);
    const tool = active ? activeTool(this.selection) : undefined;
    const hint = active ? drawStore.hint : '';
    const pieces = this.pieces ?? this._resolved?.pieces ?? [];
    const dialog = html`<mc-anim-svg-dialog
      .doc=${doc}
      .pieces=${pieces}
      .viewBox=${sourceViewBox(this.doc?.rig, this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;
    if (!active) {
      return html`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${() => this._choose('select')}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>Draw
        </button>
        ${dialog}`;
    }
    const canMotion = isRigRef(this.selection.target);
    return html`<div class="bar" role="toolbar" aria-label="Drawing tools">
        ${TOOLBAR_TOOLS.map((t) => {
          const info = TOOL_INFO[t];
          const off = this.disabled || (t === 'motion' && !canMotion);
          return html`<button
            type="button"
            class="icon-btn tool"
            data-tool=${t}
            aria-pressed=${tool === t ? 'true' : 'false'}
            aria-label=${info.label}
            title=${t === 'motion' && !canMotion ? 'Motion path: select a part or shape first' : info.label}
            ?disabled=${off}
            @click=${() => this._choose(t)}
          >
            <ha-icon icon=${info.icon}></ha-icon>
          </button>`;
        })}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label="Import SVG" title="Import SVG" ?disabled=${this.disabled} @click=${() => this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label="Save as icon" title="Save as icon" ?disabled=${this.disabled} @click=${() => this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label="Stop drawing" title="Stop drawing" @click=${() => emitSelection(this, { kind: 'none' })}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${hint ? html`<p class="hint">${hint}</p>` : nothing}
      ${dialog}`;
  }
}

// ── panels ──

registerPanel({ tag: 'mc-anim-draw-overlay', place: 'stage-tool', when: drawToolActive, title: 'Drawing', order: 40 });
registerPanel({ tag: 'mc-anim-draw-toolbar', place: 'stage-tool', when: (doc) => doc.kind === 'keyframes', title: 'Draw', order: 90, dock: 'top' });

export { isDrawTool };

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-draw-overlay': AnimDrawOverlay;
    'mc-anim-draw-toolbar': AnimDrawToolbar;
  }
}
