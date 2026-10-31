import { html, css, svg, nothing, type CSSResultGroup, type PropertyValues, type TemplateResult, type SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { toCubicSubpaths } from '../../path/core';
import { entityColorCss } from '../../utils/entity-color';
import type { EditPath } from '../../contracts/path-model';
import type { CanvasPlacement, PathChange, PathPaint, PathSelection, SnapConfig } from '../../contracts/path-canvas';
import type { AnimationDoc } from '../model';
import { V2_CAPS, type RigShape, type TargetRef } from '../model-v2';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { LayerView } from '../../contracts/studio-layers';
import { isLocked } from '../layer-view';
import type { ExportPiece } from '../svg-export';
import { TOOL_INFO, activeTool, drawToolActive, selectedShapeId, drawStore, isRigRef, newShapeStyle, rigPieces, sourceViewBox, tileIcon, type DrawTool, type IconPieces } from './draw-store';
import './draw-svg-dialog';
import type { AnimSvgDialog } from './draw-svg-dialog';
import { readSvgFile } from './draw-svg-dialog';
import {
  addShape,
  anchorsOf,
  dragBox,
  hitShape,
  isFilled,
  isStroked,
  nextShapeId,
  paintOrder,
  parseViewBox,
  pathBBox,
  removeShape,
  rigIds,
  setTrackPath,
  snapPoint,
  translateD,
  updateShape,
  type Pt,
} from './draw-utils';
import { parsePath, serializePath } from './path-utils';
import { CanvasHost, placeBox, stepLabel } from './canvas-host';
import { t, m } from '../i18n';
import { validationText } from '../validation-text';

const DRAG_SLOP = 3;
/** Anchor snapping reach, screen px. */
const SNAP_PX = 10;
/** Pointer tolerance for hitting a thin shape, screen px. */
const HIT_PX = 6;
/** Least pointer travel (screen px) between two kept freehand samples. */
const SAMPLE_PX = 0.75;
/** Most pointer samples one freehand stroke keeps (the fit in the chunk takes the same cap). */
const MAX_FREEHAND_SAMPLES = 4000;
/** Most snap lines handed to the canvas on each axis. */
const MAX_SNAP_LINES = 300;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The icon's viewBox on screen: `place` is its rectangle, `ppu` the screen px per unit. */
interface View {
  vb: [number, number, number, number];
  place: CanvasPlacement;
  ppu: number;
}

type Drag =
  | { kind: 'box'; tool: 'line' | 'rect' | 'ellipse'; pointerId: number; a: Pt; b: Pt; shift: boolean; alt: boolean }
  | { kind: 'free'; tool: 'freehand' | 'motion'; pointerId: number; raw: Pt[]; poly: string; last: Pt }
  | { kind: 'move'; pointerId: number; id: string; base: AnimationDoc; d: string; start: Pt; startPx: Pt; moved: boolean; delta: Pt }
  | { kind: 'erase'; pointerId: number; base: AnimationDoc; ids: string[] };

/** The tools that can also be drawn by placing points with the keyboard. */
type KbTool = 'line' | 'rect' | 'ellipse' | 'freehand';
const KB_TOOLS = new Set<DrawTool>(['line', 'rect', 'ellipse', 'freehand']);
/** Keyboard step in icon units: arrows, with Shift, with Alt. */
const KB_ARROWS: Record<string, Pt | undefined> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const KB_STEP = { plain: 1, shift: 5, alt: 0.1 };
/** Spacing of the samples between two placed freehand points, icon units. */
const KB_SAMPLE = 0.5;

/** The tools whose presses the studio's own layer under the canvas takes. */
const OWN_TOOLS = new Set<DrawTool>(['select', 'line', 'rect', 'ellipse', 'freehand', 'erase', 'motion']);
const NO_PATHS: EditPath[] = [];
const NO_PAINT: PathPaint[] = [];
const FLAT: PathPaint[] = [{ fill: 'none' }];
const SNAPS = new Map<string, SnapConfig>();

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

// Drawing on the icon over the stage: an <mc-path-canvas> in overlay mode edits shapes with anchors, and the studio's own
// layer under it creates and moves shapes (line, rectangle, ellipse, freehand, erase, select). The pen draws a draft path
// that closes into one shape; a selected single-subpath shape is edited in nodes mode. `frame` is the icon viewBox and
// `placement` its box on screen. Snaps to a 1-unit grid and anchors (Shift: free). Events: doc-change { doc, label,
// transient? }, selection-change { selection }.
@customElement('mc-anim-draw-host')
export class AnimDrawHost extends CanvasHost {
  static styles: CSSResultGroup = [
    CanvasHost.styles,
    css`
      :host {
        position: absolute;
        inset: 0;
        color: var(--state-icon-color, #44739e);
        --do-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      :host(:focus) {
        outline: none;
      }
      :host(:focus-visible) {
        outline: 2px solid var(--ch-accent);
        outline-offset: -2px;
      }
      svg.tool {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: auto;
        cursor: crosshair;
      }
      svg.tool.t-select {
        cursor: default;
      }
      svg.tool.t-erase {
        cursor: cell;
      }
      .bg {
        fill: transparent;
      }
      .grid {
        fill: none;
        stroke: color-mix(in srgb, var(--ch-ink) 6%, transparent);
      }
      .board {
        fill: none;
        stroke: color-mix(in srgb, var(--ch-ink) 30%, transparent);
        stroke-dasharray: 4 3;
      }
      .shapes .under {
        opacity: 0.5;
      }
      .ghost-casing {
        fill: none;
        stroke: var(--ch-surface);
        stroke-width: 3;
        stroke-linejoin: round;
        opacity: 0.85;
      }
      .ghost {
        fill: none;
        stroke: var(--ch-ink);
        stroke-width: 1.25;
        stroke-dasharray: 2 3;
        stroke-linecap: round;
      }
      .draft {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .draft.fillable {
        fill: color-mix(in srgb, var(--ch-accent) 12%, transparent);
      }
      .motion {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1.5;
        stroke-dasharray: 5 4;
      }
      .bbox {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1;
      }
      .snap {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1.5;
      }
      .cross {
        fill: none;
        stroke: var(--ch-ink);
        stroke-width: 1.5;
        stroke-linecap: round;
      }
      .cross-casing {
        fill: none;
        stroke: var(--ch-surface);
        stroke-width: 4;
        stroke-linecap: round;
      }
      .dots circle {
        fill: color-mix(in srgb, var(--ch-ink) 50%, transparent);
      }
      .finish {
        position: absolute;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        min-height: 32px;
        padding: 0 14px;
        border: 0;
        border-radius: 9999px;
        background: var(--ch-action);
        color: var(--text-primary-color, #fff);
        font: inherit;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        pointer-events: auto;
      }
      .finish:focus-visible {
        outline: 2px solid var(--ch-ink);
        outline-offset: 2px;
      }
      .drop {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--ch-accent) 10%, transparent);
        border: 2px dashed var(--ch-accent);
        border-radius: 12px;
        color: var(--ch-ink);
        font-size: 0.875rem;
        font-weight: 500;
        pointer-events: none;
      }
    `,
  ];

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
    if (activeTool(next) !== activeTool(this._selection)) this._kb = this._cross = undefined;
    this._selection = next;
  }

  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Preview-only locks: a locked shape cannot be picked, moved, nudged, deleted or erased. */
  @property({ attribute: false }) layerView?: LayerView;
  @property({ attribute: false }) tile?: string;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  /** The stage geometry (slots.ts StageInfo): card size, icon box, scale, viewBox and `screen`, which places everything. */
  @property({ attribute: false }) stage?: StageInfo;
  @property({ attribute: false }) stageRect?: { width: number; height: number; subject?: Box };
  @property({ attribute: false }) subjectRect?: Box;
  /** The icon's box on the card (unscaled px); wins over the stage's subject. */
  @property({ attribute: false }) iconRect?: Box;
  /** The icon's pieces (snapping); resolved from the rig / tile icon when not given. */
  @property({ attribute: false }) pieces?: ExportPiece[];
  /** The viewBox shapes are drawn in; default the stage's, else the source's (sourceViewBox). */
  @property({ type: String }) viewBox?: string;
  /** Draw the rig's shapes here (a stage without a real card, or a tile without an icon). */
  @property({ type: Boolean }) preview = false;

  @state() private _resolved?: IconPieces;
  @state() private _pen?: EditPath;
  @state() private _snapAt?: Pt;
  @state() private _dropping = false;
  @state() private _announce = '';
  /** The keyboard cursor, in viewBox units; undefined until an arrow key has moved it. */
  @state() private _cross?: Pt;
  /** A shape being drawn with the keyboard: the points set so far (one for a box tool, any number for freehand). */
  @state() private _kb?: { tool: KbTool; pts: Pt[] };
  /** The selected shape as the canvas shows it: the committed path, then the live one during a drag. */
  private _live?: { id: string; d: string; list: EditPath[] };

  private _drag?: Drag;
  private _unsub?: () => void;
  private _piecesKey = '';
  private _dialog?: AnimSvgDialog;
  /** Where events go after a mid-gesture unmount (the panel's old parent, if still in the page). */
  private _parent?: Node | null;
  private _anchorCache?: { shapes: RigShape[]; pieces: ExportPiece[]; exclude?: string; pts: Pt[] };
  private _ghostCache?: { raw: Pt[]; key: string; pts: string };
  private _nudge?: { id: string; base: AnimationDoc; d: string; dx: number; dy: number };
  /** Whether the canvas has points of the selected shape selected (its keys then move or delete them, not the shape). */
  private _pointsSel = false;
  private _lines?: { key: unknown[]; extra: { x: number[]; y: number[] } };

  /** Tests and the harness: the current pen draft. */
  get penPath(): EditPath | undefined {
    return this._pen;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._unsub = drawStore.subscribe(() => this.requestUpdate());
    this._parent = this.parentNode;
    this.addEventListener('keydown', this._onKeyCapture, true);
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
    this.removeEventListener('keydown', this._onKeyCapture, true);
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
      if (prev?.target !== this.selection.target) this._pointsSel = false;
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
    this.ensureCanvas();
  }

  // ── geometry ──

  private get _viewBox(): string {
    return this.viewBox ?? this.stage?.viewBox?.join(' ') ?? sourceViewBox(this.doc?.rig, this._resolved);
  }

  /** The viewBox on screen, or undefined until the stage has said where the card is. */
  private _view(): View | undefined {
    const st = this.stage;
    const w = st?.rect?.width || this.stageRect?.width || 360;
    const h = st?.rect?.height || this.stageRect?.height || 240;
    const vb = parseViewBox(this._viewBox);
    const given = this.iconRect ?? st?.subject ?? this.stageRect?.subject ?? this.subjectRect;
    let box: Box;
    if (given && given.width > 8 && given.height > 8) box = given;
    else {
      const side = Math.max(48, Math.min(w, h) - 48);
      box = { x: (w - side) / 2, y: (h - side) / 2, width: side, height: side };
    }
    const k = Math.min(box.width / vb[2], box.height / vb[3]);
    const place = placeBox(st, { x: box.x + (box.width - vb[2] * k) / 2, y: box.y + (box.height - vb[3] * k) / 2, width: vb[2] * k, height: vb[3] * k });
    if (!place || !(k > 0)) return undefined;
    const old = this._viewCache;
    if (old && old.vb.every((n, i) => n === vb[i]) && ['left', 'top', 'width', 'height'].every((p) => Math.abs((old.place as never)[p] - (place as never)[p]) < 0.005)) return old;
    return (this._viewCache = { vb, place, ppu: place.width / vb[2] });
  }
  private _viewCache?: View;

  private _toPx(v: View, p: Pt): Pt {
    return [v.place.left + (p[0] - v.vb[0]) * v.ppu, v.place.top + (p[1] - v.vb[1]) * v.ppu];
  }

  private _toVB(v: View, p: Pt): Pt {
    return [v.vb[0] + (p[0] - v.place.left) / v.ppu, v.vb[1] + (p[1] - v.place.top) / v.ppu];
  }

  /** The pointer in host px (the canvas slot's own origin). */
  private _local(e: PointerEvent | MouseEvent): Pt {
    const r = this.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  private get _previewShapes(): boolean {
    return this.preview || (!!this.tile && !tileIcon(this.tile));
  }

  private get _shapes(): RigShape[] {
    return this.doc?.rig?.shapes ?? [];
  }

  private get _pieceList(): ExportPiece[] {
    return this.pieces ?? this._resolved?.pieces ?? [];
  }

  private _isLocked(id: string): boolean {
    return !!this.doc && !!this.layerView?.locked.length && isLocked(this.doc, this.layerView, `shape:${id}`);
  }

  /** Refuse an edit of a locked shape and say so; true when refused. */
  private _refuseLocked(id: string): boolean {
    if (!this._isLocked(id)) return false;
    this._announce = t('anim-studio.draw-host.name-is-locked-unlock-it-in-layers', { name: this._shapes.find((s) => s.id === id)?.name ?? t('anim-studio.draw-host.shape') });
    return true;
  }

  private get _selectedId(): string | undefined {
    return selectedShapeId(this.selection);
  }

  private _snapAnchors(exclude?: string): Pt[] {
    if (!drawStore.options.anchors) return [];
    const c = this._anchorCache;
    const shapes = this._shapes;
    const pieces = this._pieceList;
    if (!c || c.shapes !== shapes || c.pieces !== pieces || c.exclude !== exclude) {
      const pts: Pt[] = [];
      for (const p of pieces) pts.push(...anchorsOf(p.d));
      for (const s of shapes) if (s.id !== exclude) pts.push(...anchorsOf(s.d));
      this._anchorCache = { shapes, pieces, exclude, pts };
    }
    return this._anchorCache!.pts;
  }

  private _snap(v: View, p: Pt, free: boolean): Pt {
    if (free) {
      this._snapAt = undefined;
      return [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];
    }
    const r = snapPoint(p, { grid: drawStore.options.grid ? 1 : 0, anchors: this._snapAnchors(), radius: SNAP_PX / v.ppu });
    this._snapAt = r.kind === 'anchor' ? r.p : undefined;
    return r.p;
  }

  /** The canvas snaps to the grid and, as vertical and horizontal lines, to the icon's and the other shapes' anchors. */
  private _snapConfig(exclude?: string): SnapConfig {
    const grid = drawStore.options.grid ? 1 : 0;
    let extra: SnapConfig['extra'];
    if (drawStore.options.anchors) {
      const key = [this._shapes, this._pieceList, exclude];
      if (!this._lines || this._lines.key.some((k, i) => k !== key[i])) {
        const xs = new Set<number>();
        const ys = new Set<number>();
        for (const p of this._snapAnchors(exclude)) {
          if (xs.size < MAX_SNAP_LINES) xs.add(p[0]);
          if (ys.size < MAX_SNAP_LINES) ys.add(p[1]);
        }
        this._lines = { key, extra: { x: [...xs], y: [...ys] } };
      }
      extra = this._lines.extra;
    }
    const id = `${grid}|${exclude ?? ''}`;
    const old = SNAPS.get(id);
    if (old && old.extra === extra) return old;
    const cfg: SnapConfig = { enabled: true, grid, anchors: false, frame: false, extra };
    SNAPS.set(id, cfg);
    return cfg;
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
      this._announce = t('anim-studio.draw-host.at-most-count-shapes-fit-in-a-rig', { count: V2_CAPS.shapes });
      return undefined;
    }
    const info = TOOL_INFO[tool];
    const id = nextShapeId(rigIds(this.doc), info.base);
    const n = this._shapes.filter((s) => s.id.startsWith(`${info.base}-`)).length + 1;
    const shape: RigShape = { id, name: `${tool === 'pen' ? t('anim-studio.draw-host.path') : tool === 'freehand' ? t('anim-studio.draw-host.stroke') : t(info.label)} ${n}`, d, layer: drawStore.options.layer, ...newShapeStyle(drawStore.options, closed) };
    const doc = addShape(this.doc, shape);
    if (!doc) return undefined;
    this._emitDoc(doc, `Draw ${tool}`);
    this._announce = tool === 'pen' ? t('anim-studio.draw-host.name-added-count-points', { name: shape.name, count: anchorsOf(d).length }) : t('anim-studio.draw-host.name-added', { name: shape.name });
    return id;
  }

  /** Finish the pen path: closed, or open (needs two points; one point is dropped). */
  private _finishPen(close: boolean): void {
    const p = this._pen;
    this._pen = undefined;
    if (!p || p.anchors.length < 2) return;
    const path = close ? { ...p, closed: true } : p;
    this._commitShape('pen', serializePath(path), path.closed);
  }

  /** A change from the canvas: the pen draft, or the selected shape's points. */
  private _onCanvas = (e: Event): void => {
    e.stopPropagation();
    const detail = (e as CustomEvent<PathChange>).detail;
    const next = detail.paths[0];
    if (activeTool(this.selection) === 'pen') {
      this._pen = next && next.anchors.length ? next : undefined;
      if (detail.commit && next?.closed) this._finishPen(true);
      return;
    }
    const live = this._live;
    const s = live ? this._shapes.find((x) => x.id === live.id) : undefined;
    if (!live || !s || !this.doc) return;
    // transient: the canvas outline is live, the card shows the committed shape
    this._live = { ...live, list: detail.paths };
    this.requestUpdate();
    if (!detail.commit) return;
    if (detail.label === 'Cancel') return;
    if (!next || !next.anchors.length) {
      this._emitDoc(removeShape(this.doc, s.id), 'Delete shape');
      emitSelection(this, { kind: 'tool', tool: 'select' });
      return;
    }
    const d = serializePath(next);
    this._live = { id: s.id, d, list: detail.paths };
    if (drawStore.lastFreehand?.id === s.id) drawStore.setLastFreehand(undefined);
    this._emitDoc(updateShape(this.doc, s.id, { d }), stepLabel(detail.label));
  };

  private _onCanvasSelect = (e: Event): void => {
    this._pointsSel = ((e as CustomEvent<PathSelection | undefined>).detail?.anchors.length ?? 0) > 0;
  };

  // ── pointer: the layer under the canvas ──

  private _capture(e: PointerEvent): void {
    e.preventDefault();
    try {
      (this.renderRoot.querySelector('svg.tool') as SVGElement | null)?.setPointerCapture(e.pointerId);
    } catch {
      // synthetic events (tests) have no active pointer
    }
  }

  private _onDown(e: PointerEvent): void {
    const v = this._view();
    if (this.disabled || e.button > 0 || !this.doc || this._drag || !v) return;
    this._endNudge();
    // pointer focus: keys work, no focus ring (preventDefault on pointerdown stops the native focus)
    this.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    const local = this._local(e);
    const raw = this._toVB(v, local);
    const tool = activeTool(this.selection);
    if ((KB_TOOLS.has(tool) || tool === 'motion') && !this.chunk) {
      this._announce = t('anim-studio.draw-host.the-drawing-tools-are-not-loaded-yet');
      return;
    }
    switch (tool) {
      case 'select': {
        // a locked shape is passed over; when only locked ones are there, say so and select nothing
        const id = hitShape(this._shapes.filter((s) => !this._isLocked(s.id)), raw, HIT_PX / v.ppu);
        if (!id) {
          const lockedHit = hitShape(this._shapes, raw, HIT_PX / v.ppu);
          if (lockedHit && this._refuseLocked(lockedHit)) return;
          if (this._selectedId) emitSelection(this, { kind: 'tool', tool: 'select' });
          return;
        }
        if (id !== this._selectedId) emitSelection(this, { kind: 'tool', tool: 'select', target: `shape:${id}` });
        const s = this._shapes.find((x) => x.id === id)!;
        this._capture(e);
        this._drag = { kind: 'move', pointerId: e.pointerId, id, base: this.doc, d: s.d, start: raw, startPx: local, moved: false, delta: [0, 0] };
        return;
      }
      case 'erase':
        this._capture(e);
        this._drag = { kind: 'erase', pointerId: e.pointerId, base: this.doc, ids: [] };
        this._eraseAt(raw, v);
        return;
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
          this._announce = t('anim-studio.draw-host.select-a-part-or-shape-first');
          return;
        }
        if (tool === 'motion' && this.layerView && isLocked(this.doc, this.layerView, this.selection.target!)) {
          this._announce = t('anim-studio.draw-host.that-layer-is-locked-unlock-it-in-layers');
          return;
        }
        this._capture(e);
        this._drag = { kind: 'free', tool, pointerId: e.pointerId, raw: [raw], poly: `${local[0].toFixed(1)},${local[1].toFixed(1)}`, last: local };
        this.requestUpdate();
        return;
      }
    }
  }

  /** The outline of a line, rectangle or ellipse dragged from a to b; undefined while it is too small to draw. */
  private _boxPath(tool: 'line' | 'rect' | 'ellipse', a: Pt, b: Pt, shift: boolean, alt: boolean): string | undefined {
    const draw = this.chunk?.pathDraw;
    if (!draw || Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.2) return undefined;
    if (tool === 'line') return draw.linePath(a, b);
    const box = dragBox(a, b, shift, alt);
    if (box.w < 0.2 || box.h < 0.2) return undefined;
    return tool === 'rect' ? draw.rectPath(box.x, box.y, box.w, box.h, drawStore.options.radius) : draw.ellipsePath(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2);
  }

  private _commitBox(tool: 'line' | 'rect' | 'ellipse', a: Pt, b: Pt, shift: boolean, alt: boolean): boolean {
    const path = this._boxPath(tool, a, b, shift, alt);
    if (path) this._commitShape(tool, path, tool !== 'line');
    return !!path;
  }

  private _eraseAt(p: Pt, v: View): void {
    const d = this._drag;
    if (d?.kind !== 'erase') return;
    let doc = d.base;
    for (const id of d.ids) doc = removeShape(doc, id);
    const id = hitShape((doc.rig?.shapes ?? []).filter((s) => !this._isLocked(s.id)), p, HIT_PX / v.ppu);
    if (!id) return;
    d.ids.push(id);
    this._emitDoc(removeShape(doc, id), 'Erase shape', true);
  }

  private _onMove(e: PointerEvent): void {
    const d = this._drag;
    const v = this._view();
    if (!d || !v || e.pointerId !== d.pointerId) return;
    const local = this._local(e);
    const raw = this._toVB(v, local);
    switch (d.kind) {
      case 'box':
        d.b = this._snap(v, raw, e.shiftKey && d.tool === 'line');
        d.shift = e.shiftKey;
        d.alt = e.altKey;
        this.requestUpdate();
        return;
      case 'free': {
        // samples: spaced at least SAMPLE_PX apart, at most MAX_FREEHAND_SAMPLES; the preview line grows by appending
                const coalesced = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
        let added = false;
        for (const c of coalesced.length ? coalesced : [e]) {
          if (d.raw.length >= MAX_FREEHAND_SAMPLES) break;
          const q = this._local(c);
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
        if (!d.moved && Math.hypot(local[0] - d.startPx[0], local[1] - d.startPx[1]) < DRAG_SLOP) return;
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
      const el = this.renderRoot.querySelector('svg.tool') as SVGElement | null;
      if (el?.hasPointerCapture?.(d.pointerId)) el.releasePointerCapture(d.pointerId);
    } catch {
      // already released
    }
    if (!write || !this.doc) {
      // cancelled: a gesture that already sent transient changes puts the document back
      // (a final change: the shell closes the gesture and leaves no undo step for it)
      if (d.kind === 'move' && d.moved) this._emitDoc(d.base, 'Move shape');
      if (d.kind === 'erase' && d.ids.length) this._emitDoc(d.base, 'Erase shape');
      this.requestUpdate();
      return;
    }
    const draw = this.chunk?.pathDraw;
    switch (d.kind) {
      case 'box': {
        this._commitBox(d.tool, d.a, d.b, d.shift, d.alt);
        break;
      }
      case 'free': {
        const fit = draw?.fitFreehand(d.raw, drawStore.options.tolerance);
        if (!fit?.d) break;
        if (d.tool === 'freehand') {
          const id = this._commitShape('freehand', fit.d, fit.closed);
          if (id) drawStore.setLastFreehand({ id, raw: d.raw });
        } else {
          const target = this.selection.target as TargetRef;
          const doc = setTrackPath(this.doc, target, fit.d, drawStore.options.follow);
          if (doc) this._emitDoc(doc, 'Draw motion path');
          else this._announce = t('anim-studio.draw-host.at-most-tracks-animated-targets', { tracks: V2_CAPS.tracks });
        }
        break;
      }
      case 'move':
        if (d.moved) {
          this._emitDoc(updateShape(d.base, d.id, { d: translateD(d.d, d.delta[0], d.delta[1]) }), 'Move shape');
          this._followFreehand(d.id, d.delta[0], d.delta[1]);
        }
        break;
      case 'erase': {
        if (!d.ids.length) break;
        let doc = d.base;
        for (const id of d.ids) doc = removeShape(doc, id);
        this._emitDoc(doc, t('anim-studio.draw-host.erase-shapes', { count: d.ids.length }));
        break;
      }
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

  /** The Finish button: ends the pen path or the keyboard stroke, then focus goes to the drawing area (the button is gone). */
  private _finishButton(): void {
    if (this._kb) this._finishStroke();
    else this._finishPen(false);
    this._focusArea();
  }

  /** Focus goes to the path canvas while it takes the keys (pen, shape points), else to the host. */
  private _focusArea(): void {
    void this.updateComplete.then(() => {
      const canvas = this._canvasPaths().mode !== 'view' ? this.renderRoot.querySelector<HTMLElement>('mc-path-canvas') : null;
      (canvas ?? this).focus({ preventScroll: true });
    });
  }

  /** The points placed with the keyboard as one smoothed stroke (samples between the points feed the same fit as a drag). */
  private _finishStroke(): void {
    const kb = this._kb;
    this._kb = undefined;
    const draw = this.chunk?.pathDraw;
    if (!kb || !draw || kb.pts.length < 2) return;
    const raw: Pt[] = [kb.pts[0]];
    for (let i = 1; i < kb.pts.length; i++) {
      const a = kb.pts[i - 1];
      const b = kb.pts[i];
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / KB_SAMPLE));
      for (let k = 1; k <= n; k++) raw.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    }
    const fit = draw.fitFreehand(raw, drawStore.options.tolerance);
    if (!fit?.d) return;
    const id = this._commitShape('freehand', fit.d, fit.closed);
    if (id) drawStore.setLastFreehand({ id, raw });
  }

  /**
   * Line, rectangle, ellipse and freehand without a pointer: arrows move a cursor (Shift: 5 units, Alt: a tenth), Enter sets
   * the start and then the end (freehand: Enter places a point, Enter again on the last one finishes), Escape drops it.
   * Only keys pressed on the drawing area itself; a button inside keeps its own Enter.
   */
  private _kbKey(e: KeyboardEvent): boolean {
    const tool = activeTool(this.selection);
    if (!KB_TOOLS.has(tool) || this._selectedId || this._pen || e.composedPath()[0] !== this || e.ctrlKey || e.metaKey) return false;
    if (e.key === 'Escape') {
      if (!this._kb) return false;
      e.preventDefault();
      e.stopPropagation();
      this._kb = undefined;
      this._announce = t('anim-studio.draw-host.drawing-cancelled');
      return true;
    }
    const dir = KB_ARROWS[e.key];
    if (!dir && e.key !== 'Enter') return false;
    e.preventDefault();
    e.stopPropagation();
    const v = this._view();
    if (!v) return true;
    if (!this.chunk) {
      this._announce = t('anim-studio.draw-host.the-drawing-tools-are-not-loaded-yet');
      return true;
    }
    const kbTool = tool as KbTool;
    const at: Pt = this._cross ?? [v.vb[0] + v.vb[2] / 2, v.vb[1] + v.vb[3] / 2];
    const fmt = (n: number): string => String(Math.round(n * 100) / 100);
    if (dir) {
      const k = e.altKey ? KB_STEP.alt : e.shiftKey ? KB_STEP.shift : KB_STEP.plain;
      const snap = drawStore.options.grid && !e.altKey;
      const to = (n: number, lo: number, size: number): number => {
        const c = Math.min(lo + size, Math.max(lo, n));
        return snap ? Math.round(c) : Math.round(c * 100) / 100;
      };
      const p: Pt = [to(at[0] + dir[0] * k, v.vb[0], v.vb[2]), to(at[1] + dir[1] * k, v.vb[1], v.vb[3])];
      this._cross = p;
      const ends = kbTool !== 'freehand' && !!this._kb;
      const args = { x: fmt(p[0]), y: fmt(p[1]) };
      this._announce = kbTool === 'freehand' ? t('anim-studio.draw-host.cursor-at-x-x-y-y-press-enter-to-add-a', args) : ends ? t('anim-studio.draw-host.cursor-at-x-x-y-y-press-enter-to-finish', args) : t('anim-studio.draw-host.cursor-at-x-x-y-y-press-enter-to-start', args);
      return true;
    }
    this._cross = at;
    const kb = this._kb;
    if (kbTool === 'freehand') {
      const last = kb?.pts[kb.pts.length - 1];
      if (kb && last && last[0] === at[0] && last[1] === at[1]) {
        if (kb.pts.length > 1) this._finishStroke();
        else this._announce = t('anim-studio.draw-host.move-away-from-the-start-first');
        return true;
      }
      const pts = [...(kb?.pts ?? []), at];
      this._kb = { tool: kbTool, pts };
      this._announce = t('anim-studio.draw-host.point-count-placed-enter-again-on-the', { count: pts.length });
      return true;
    }
    if (!kb) {
      this._kb = { tool: kbTool, pts: [at] };
      this._announce = t('anim-studio.draw-host.started-at-x-x-y-y-move-the-cursor-and', { x: fmt(at[0]), y: fmt(at[1]) });
    } else if (this._commitBox(kbTool, kb.pts[0], at, false, false)) this._kb = undefined;
    else this._announce = t('anim-studio.draw-host.move-away-from-the-start-first');
    return true;
  }

  protected toolsReady(): void {
    this._announce = t('anim-studio.draw-host.the-drawing-tools-are-ready');
    this._focusArea();
  }

  /**
   * Before the canvas sees a key: with no points selected, Delete and Backspace remove the whole selected shape (the canvas
   * would otherwise take them for a point), and a locked shape refuses its keys.
   */
  private _onKeyCapture = (e: KeyboardEvent): void => {
    const id = this._selectedId;
    if (this.disabled || !this.doc || !id || this._pen || this._drag) return;
    const del = e.key === 'Delete' || e.key === 'Backspace';
    if (!del && !/^Arrow/.test(e.key)) return;
    if (this._refuseLocked(id)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (del && !this._pointsSel) {
      e.preventDefault();
      e.stopPropagation();
      this._emitDoc(removeShape(this.doc, id), 'Delete shape');
      emitSelection(this, { kind: 'tool', tool: 'select' });
    }
  };

  /** Keys the canvas left alone: Escape, and the arrows when no point is selected (they move the shape). */
  private _onKey = (e: KeyboardEvent): void => {
    if (this.disabled || !this.doc) return;
    if (this._drag && e.key === 'Escape') {
      // Escape drops the gesture in progress (a moved shape goes back)
      e.preventDefault();
      e.stopPropagation();
      this._end(false);
      return;
    }
    if (this._kbKey(e)) return;
    if (!/^Arrow/.test(e.key)) this._endNudge();
    if (this._pen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this._finishPen(false);
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
      this._announce = validationText(r.error);
      this._dialog?.openImport('', file.name);
      return;
    }
    this._dialog?.openImport(r.text, file.name);
  };

  // ── the picture under the canvas ──

  private _grid(v: View): SVGTemplateResult | typeof nothing {
    const tool = activeTool(this.selection);
    if (!drawStore.options.grid || v.ppu < 6 || tool === 'select' || tool === 'erase') return nothing;
    const [x0, y0, w, h] = v.vb;
    const parts: string[] = [];
    for (let i = 0; i <= w; i++) parts.push(`M${(v.place.left + i * v.ppu).toFixed(1)} ${v.place.top.toFixed(1)}v${v.place.height.toFixed(1)}`);
    for (let j = 0; j <= h; j++) parts.push(`M${v.place.left.toFixed(1)} ${(v.place.top + j * v.ppu).toFixed(1)}h${v.place.width.toFixed(1)}`);
    void x0;
    void y0;
    return svg`<path class="grid" d=${parts.join('')}></path>`;
  }

  private _shapesLayer(v: View): SVGTemplateResult | typeof nothing {
    if (!this._previewShapes || !this._shapes.length) return nothing;
    const sel = this._selectedId;
    return svg`<g class="shapes" transform="translate(${v.place.left - v.vb[0] * v.ppu} ${v.place.top - v.vb[1] * v.ppu}) scale(${v.ppu})">
      ${paintOrder(this._shapes).map((s) => svg`<path class="${s.id === sel ? 'sel' : ''} ${s.layer}" data-id=${s.id} d=${s.d} style=${styleMap(shapeStyle(s))}></path>`)}
    </g>`;
  }

  private _pxD(v: View, d: string): string {
    if (!d) return '';
    return toCubicSubpaths(d)
      .map((s) => {
        if (!s.length) return '';
        const proj = (p: Pt) => this._toPx(v, p);
        const st = proj(s[0][0]);
        return `M${st[0].toFixed(1)} ${st[1].toFixed(1)}${s.map((c) => `C${[c[1], c[2], c[3]].map((p) => proj(p).map((n) => n.toFixed(1)).join(' ')).join(' ')}`).join('')}`;
      })
      .join('');
  }

  /** The selected shape's box (its points are the canvas's). */
  private _selectionBox(v: View): SVGTemplateResult | typeof nothing {
    const id = this._selectedId;
    const s = id ? this._shapes.find((x) => x.id === id) : undefined;
    const b = s ? pathBBox(s.d) : undefined;
    if (!b) return nothing;
    const [x, y] = this._toPx(v, [b.x, b.y]);
    return svg`<rect class="bbox" x=${x - 4} y=${y - 4} width=${b.w * v.ppu + 8} height=${b.h * v.ppu + 8} rx="2"></rect>`;
  }

  private _dragLayer(v: View): SVGTemplateResult | typeof nothing {
    const d = this._drag;
    const kb = this._kb;
    if (kb && this._cross) {
      if (kb.tool === 'freehand') return svg`<polyline class="draft" points=${[...kb.pts, this._cross].map((p) => this._toPx(v, p).map((n) => n.toFixed(1)).join(',')).join(' ')}></polyline>`;
      const path = this._boxPath(kb.tool, kb.pts[0], this._cross, false, false);
      return path ? svg`<path class="draft ${kb.tool === 'line' ? '' : 'fillable'}" d=${this._pxD(v, path)}></path>` : nothing;
    }
    if (!d) return nothing;
    if (d.kind === 'box') {
      const path = this._boxPath(d.tool, d.a, d.b, d.shift, d.alt);
      return path ? svg`<path class="draft ${d.tool === 'line' ? '' : 'fillable'}" d=${this._pxD(v, path)}></path>` : nothing;
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
    const key = `${v.ppu}|${v.place.left}|${v.place.top}`;
    if (this._ghostCache?.raw !== last.raw || this._ghostCache.key !== key) {
      this._ghostCache = { raw: last.raw, key, pts: last.raw.map((p) => this._toPx(v, p).map((n) => n.toFixed(1)).join(',')).join(' ') };
    }
    const pts = this._ghostCache.pts;
    return svg`<polyline class="ghost-casing" points=${pts}></polyline><polyline class="ghost" points=${pts}></polyline>`;
  }

  /** The selected target's motion path, drawn from its resting centre. */
  private _motion(v: View): SVGTemplateResult | typeof nothing {
    const target = this.selection.target;
    if (!isRigRef(target)) return nothing;
    const track = this.doc?.tracks?.find((x) => x.target === target);
    if (!track?.path?.d) return nothing;
    const centre = this._targetCentre(target);
    if (!centre) return nothing;
    return svg`<path class="motion" d=${this._pxD(v, translateD(track.path.d, centre[0], centre[1]))}></path>`;
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

  /** The keyboard cursor. */
  private _crossMark(v: View): SVGTemplateResult | typeof nothing {
    if (!this._cross || !KB_TOOLS.has(activeTool(this.selection))) return nothing;
    const [x, y] = this._toPx(v, this._cross);
    const d = `M${x - 9} ${y}h18M${x} ${y - 9}v18`;
    return svg`<path class="cross-casing" d=${d}></path><path class="cross" d=${d}></path>`;
  }

  private _dots(v: View): SVGTemplateResult | typeof nothing {
    const drawing = this._drag?.kind === 'box' || !!this._pen;
    if (!drawing || !drawStore.options.anchors) return nothing;
    return svg`<g class="dots">${this._snapAnchors()
      .slice(0, 600)
      .map((p) => {
        const [x, y] = this._toPx(v, p);
        return svg`<circle cx=${x} cy=${y} r="1.5"></circle>`;
      })}</g>`;
  }

  private _hint(): string {
    const tool = activeTool(this.selection);
    if (this._pen) return this._pen.anchors.length < 2 ? t('anim-studio.draw-host.click-to-add-the-next-point') : t(TOOL_INFO.pen.hint);
    if (tool === 'motion' && !isRigRef(this.selection.target)) return t('anim-studio.draw-host.select-a-part-or-shape-then-draw-its');
    if (tool === 'select' && !this._shapes.length) return t('anim-studio.draw-host.no-shapes-yet-pick-a-drawing-tool');
    if (this._drag || this._selectedId) return '';
    return t(TOOL_INFO[tool].hint);
  }

  /** The drawing area is the host itself: one focus stop that names the tool and the keys. */
  private _labelArea(): void {
    const tool = activeTool(this.selection);
    if (this.disabled || !OWN_TOOLS.has(tool)) {
      for (const a of ['role', 'aria-roledescription', 'aria-label']) this.removeAttribute(a);
      return;
    }
    this.setAttribute('role', 'application');
    this.setAttribute('aria-roledescription', t('anim-studio.draw-host.drawing-area'));
    const keys = KB_TOOLS.has(tool) ? ` ${t('anim-studio.draw-host.arrow-keys-move-the-cursor-enter-places')}` : '';
    this.setAttribute('aria-label', t('anim-studio.draw-host.label-tool-hint', { label: t(TOOL_INFO[tool].label), hint: t(TOOL_INFO[tool].hint) }) + keys);
  }

  protected updated(): void {
    this._labelArea();
    // the hint shows in the toolbar (top dock), off the card
    drawStore.setHint(this.disabled ? '' : this._hint());
  }

  /** What the canvas edits: the pen draft, or the selected shape when it is one subpath that is not locked. */
  private _canvasPaths(): { mode: 'add' | 'nodes' | 'view'; paths: EditPath[]; paint: PathPaint[]; exclude?: string } {
    if (this.disabled || this.canvasState !== 'ready') return { mode: 'view', paths: NO_PATHS, paint: NO_PAINT };
    if (activeTool(this.selection) === 'pen') {
      const live = this._penList;
      if (live.src !== this._pen) this._penList = { src: this._pen, list: this._pen ? [this._pen] : NO_PATHS };
      return { mode: 'add', paths: this._penList.list, paint: NO_PAINT };
    }
    const id = this._selectedId;
    const s = id ? this._shapes.find((x) => x.id === id) : undefined;
    if (!s || this._isLocked(s.id) || toCubicSubpaths(s.d).length !== 1) return { mode: 'view', paths: NO_PATHS, paint: NO_PAINT };
    if (this._live?.id !== s.id || this._live.d !== s.d) this._live = { id: s.id, d: s.d, list: [parsePath(s.d)] };
    return { mode: 'nodes', paths: this._live.list, paint: FLAT, exclude: s.id };
  }
  private _penList: { src?: EditPath; list: EditPath[] } = { list: NO_PATHS };

  protected render(): TemplateResult {
    const v = this._view();
    if (!v) return html`${this.renderNotice()}`;
    const tool = activeTool(this.selection);
    const c = this._canvasPaths();
    const ownLayer = OWN_TOOLS.has(tool) && !this.disabled;
    const frame = { x: v.vb[0], y: v.vb[1], w: v.vb[2], h: v.vb[3] };
    return html`
      <svg class="layer" aria-hidden="true">
        ${this._grid(v)}
        <rect class="board" x=${v.place.left} y=${v.place.top} width=${v.place.width} height=${v.place.height} rx="2"></rect>
        ${this._shapesLayer(v)} ${this._ghost(v)} ${this._motion(v)} ${this._dots(v)} ${this._selectionBox(v)} ${this._dragLayer(v)} ${this._crossMark(v)}
        ${this._snapAt ? svg`<circle class="snap" cx=${this._toPx(v, this._snapAt)[0]} cy=${this._toPx(v, this._snapAt)[1]} r="7"></circle>` : nothing}
      </svg>
      ${ownLayer
        ? html`<svg
            class="tool t-${tool}"
            aria-hidden="true"
            @pointerdown=${(e: PointerEvent) => this._onDown(e)}
            @pointermove=${(e: PointerEvent) => this._onMove(e)}
            @pointerup=${(e: PointerEvent) => this._onUp(e)}
            @pointercancel=${() => this._end(false)}
            @lostpointercapture=${(e: PointerEvent) => {
              if (this._drag && e.pointerId === this._drag.pointerId) this._end(true);
            }}
          >
            <rect class="bg" x="0" y="0" width="100%" height="100%"></rect>
          </svg>`
        : nothing}
      ${this.canvasState === 'ready'
        ? html`<mc-path-canvas
            overlay
            .placement=${v.place}
            .frame=${frame}
            .paths=${c.paths}
            .paint=${c.paint}
            .mode=${c.mode}
            .maxPaths=${1}
            .gridStep=${1}
            .snap=${this._snapConfig(c.exclude)}
            .nudge=${1}
            .bigNudge=${5}
            .fineNudge=${0.1}
            aria-label=${tool === 'pen' ? t('anim-studio.draw-host.pen-click-to-add-points-click-the-first') : t('anim-studio.draw-host.shape-points-drag-a-point-to-move-it')}
            @mc-path-change=${this._onCanvas}
            @mc-path-select=${this._onCanvasSelect}
            @mc-path-limit=${() => (this._announce = t('anim-studio.draw-host.the-path-has-the-most-points-it-can-hold'))}
          ></mc-path-canvas>`
        : nothing}
      ${(this._pen && this._pen.anchors.length >= 2) || (this._kb?.tool === 'freehand' && this._kb.pts.length >= 2) ? html`<button type="button" class="finish" @click=${() => this._finishButton()}>${t('anim-studio.draw-host.finish-path')}</button>` : nothing}
      ${this._dropping ? html`<div class="drop">${t('anim-studio.draw-host.drop-the-svg-to-import-it')}</div>` : nothing} ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `;
  }
}

registerPanel({ tag: 'mc-anim-draw-host', place: 'stage-tool', when: drawToolActive, title: m('anim-studio.draw-host.drawing'), order: 40, dock: 'canvas' });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-draw-host': AnimDrawHost;
  }
}
