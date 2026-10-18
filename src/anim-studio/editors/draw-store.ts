import { toCubicSubpaths } from '../../path/core';
import { resolveIconGeometry, type IconGeometry } from '../../icons/icon-source';
import { sanitizeSvg } from '../../icons/svg-sanitize';
import { splitIcon } from '../../icons/icon-split';
import type { AnimationDoc } from '../model';
import type { Rig, RigShape, TargetRef } from '../model-v2';
import type { StudioSelection } from '../slots';
import { tileModule, type PreviewTile } from '../tiles';
import { rigViewBox, type ExportPiece } from '../svg-export';
import { cubicsToD, parseViewBox, type Pt } from './draw-utils';
import { m, type MessageId } from '../i18n';

/*
 * State the drawing panels share (the toolbar, the stage overlay and the inspector are separate
 * panel elements): the tool options for new shapes, the last freehand stroke's raw samples (so the
 * smoothing slider can refit it), and the icon pieces the tools snap to and export.
 */

export const DRAW_TOOLS = ['select', 'pen', 'line', 'rect', 'ellipse', 'freehand', 'erase', 'motion'] as const;
export type DrawTool = (typeof DRAW_TOOLS)[number];

export const isDrawTool = (t: unknown): t is DrawTool => typeof t === 'string' && (DRAW_TOOLS as readonly string[]).includes(t);
export const isShapeTarget = (t: unknown): t is `shape:${string}` => typeof t === 'string' && t.startsWith('shape:');
export const isRigRef = (t: unknown): t is TargetRef => typeof t === 'string' && /^(part|group|shape):/.test(t);
export const shapeIdOf = (t: TargetRef | undefined): string | undefined => (isShapeTarget(t) ? t.slice(6) : undefined);

/** The drawing tools are in use: a draw tool is active, or a drawn shape is selected (its inspector). */
export function drawActive(doc: AnimationDoc, sel: StudioSelection): boolean {
  if (doc.kind !== 'keyframes') return false;
  if (sel.kind === 'tool') return isDrawTool(sel.tool);
  return sel.kind === 'target' && isShapeTarget(sel.target) && !!doc.rig?.shapes?.some((s) => `shape:${s.id}` === sel.target);
}

/**
 * A draw tool is picked: the drawing overlay covers the stage (and the toolbar shows the tools). A
 * shape selected from the layers alone leaves the stage to the parts overlay, so a tap picks a part.
 */
export function drawToolActive(doc: AnimationDoc, sel: StudioSelection): boolean {
  return doc.kind === 'keyframes' && sel.kind === 'tool' && isDrawTool(sel.tool);
}

/** The selected shape's id: a shape target, or the shape the select tool holds. */
export function selectedShapeId(sel: StudioSelection): string | undefined {
  return sel.kind === 'target' || (sel.kind === 'tool' && sel.tool === 'select') ? shapeIdOf(sel.target) : undefined;
}

/** The tool the overlay works with (a selected shape: select / move). */
export function activeTool(sel: StudioSelection): DrawTool {
  return sel.kind === 'tool' && isDrawTool(sel.tool) ? sel.tool : 'select';
}

export const TOOL_INFO: Record<DrawTool, { label: MessageId; icon: string; base: string; hint: MessageId }> = {
  select: { label: m('Select'), icon: 'mdi:cursor-default-outline', base: 'shape', hint: m('Click a shape to select it, drag to move it.') },
  pen: { label: m('Pen'), icon: 'mdi:fountain-pen-tip', base: 'path', hint: m('Click to add points, drag for curves. Click the first point to close, Enter to finish.') },
  line: { label: m('Line'), icon: 'mdi:vector-line', base: 'line', hint: m('Drag to draw a line.') },
  rect: { label: m('Rectangle'), icon: 'mdi:square-rounded-outline', base: 'rect', hint: m('Drag to draw. Shift: square, Alt: from the centre.') },
  ellipse: { label: m('Ellipse'), icon: 'mdi:ellipse-outline', base: 'ellipse', hint: m('Drag to draw. Shift: circle, Alt: from the centre.') },
  freehand: { label: m('Freehand'), icon: 'mdi:draw', base: 'stroke', hint: m('Draw freely; the stroke is smoothed when you let go.') },
  erase: { label: m('Erase'), icon: 'mdi:eraser', base: 'shape', hint: m('Click or drag over shapes to delete them.') },
  motion: { label: m('Motion path'), icon: 'mdi:map-marker-path', base: 'path', hint: m('Draw the path the selected part travels, starting where it rests.') },
};

export interface DrawOptions {
  /** New closed shapes: fill colour ('' none). */
  fill: string;
  /** New shapes: stroke colour ('' none; open shapes always get one). */
  stroke: string;
  strokeWidth: number;
  linecap: NonNullable<RigShape['linecap']>;
  layer: RigShape['layer'];
  /** Rectangle corner radius, viewBox units. */
  radius: number;
  /** Freehand smoothing tolerance, viewBox units. */
  tolerance: number;
  /** Snap to the 1-unit grid. */
  grid: boolean;
  /** Snap to icon and shape anchors. */
  anchors: boolean;
  /** Motion paths drawn with follow rotation. */
  follow: boolean;
}

export const DEFAULT_DRAW_OPTIONS: DrawOptions = {
  fill: 'currentColor',
  stroke: '',
  strokeWidth: 1.5,
  linecap: 'round',
  layer: 'over',
  radius: 2,
  tolerance: 0.4,
  grid: true,
  anchors: true,
  follow: false,
};

export const TOLERANCE_RANGE = { min: 0.05, max: 2, step: 0.05 } as const;

/** The style a new shape gets from the tool options. */
export function newShapeStyle(o: DrawOptions, closed: boolean): Partial<RigShape> {
  const stroke = (): Partial<RigShape> => ({ stroke: o.stroke || 'currentColor', stroke_width: o.strokeWidth, linecap: o.linecap });
  if (!closed) return stroke();
  const s: Partial<RigShape> = {};
  if (o.fill) s.fill = o.fill;
  if (o.stroke) Object.assign(s, stroke());
  if (!o.fill && !o.stroke) s.fill = 'currentColor';
  return s;
}

type Listener = () => void;

class DrawStore {
  options: DrawOptions = { ...DEFAULT_DRAW_OPTIONS };
  /** The overlay's hint for what to do next (the toolbar shows it in the top dock, off the card). */
  hint = '';
  private _hintListeners = new Set<Listener>();

  setHint(hint: string): void {
    if (hint === this.hint) return;
    this.hint = hint;
    for (const fn of this._hintListeners) fn();
  }

  onHint(fn: Listener): () => void {
    this._hintListeners.add(fn);
    return () => this._hintListeners.delete(fn);
  }
  /** The last freehand stroke: its shape id and raw samples (viewBox units). */
  lastFreehand?: { id: string; raw: Pt[] };
  private _listeners = new Set<Listener>();

  set(patch: Partial<DrawOptions>): void {
    this.options = { ...this.options, ...patch };
    this._emit();
  }

  setLastFreehand(v: { id: string; raw: Pt[] } | undefined): void {
    this.lastFreehand = v;
    this._emit();
  }

  subscribe(fn: Listener): () => void {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  /** Tests: back to the defaults. */
  reset(): void {
    this.options = { ...DEFAULT_DRAW_OPTIONS };
    this.lastFreehand = undefined;
    this._emit();
  }

  private _emit(): void {
    for (const fn of this._listeners) fn();
  }
}

export const drawStore = new DrawStore();

// ── the icon's pieces (snapping, export) ──

export type PieceSplitter = (geometry: IconGeometry) => ExportPiece[];

/**
 * The interim split (before the rig's own split was wired in; see rigSplitter): one piece per subpath of the filled paths,
 * then of the accent (secondary) paths, then one per stroked shape, in that order. Accent pieces
 * keep `accent`, stroked ones their stroke, so an export paints them as the source did.
 */
export const defaultSplitter: PieceSplitter = (g) => {
  const out: ExportPiece[] = [];
  const subs = (d: string) => toCubicSubpaths(d).filter((s) => s.length);
  for (const d of g.paths) for (const s of subs(d)) out.push({ index: out.length, d: cubicsToD([s]) });
  for (const d of g.secondary ?? []) for (const s of subs(d)) out.push({ index: out.length, d: cubicsToD([s]), accent: true });
  for (const st of g.strokes ?? [])
    out.push({
      index: out.length,
      d: st.d,
      stroke: { width: st.width, ...(st.cap ? { cap: st.cap } : {}), ...(st.join ? { join: st.join } : {}) },
      ...(st.accent ? { accent: true } : {}),
    });
  return out;
};
/**
 * The rig's own split (icon-split.ts, what the card's rig draws), as export pieces: piece indices
 * match `RigPart.from`; secondary pieces export as accent, stroked ones keep their stroke, evenodd
 * fills their fill rule.
 */
export const rigSplitter: PieceSplitter = (g) =>
  splitIcon(g).map((p) => ({
    index: p.index,
    d: p.d,
    ...(p.stroke ? { stroke: p.stroke } : {}),
    ...(p.secondary ? { accent: true } : {}),
    ...(p.evenodd ? { evenodd: true } : {}),
  }));
let splitter: PieceSplitter = rigSplitter;

/** Replace how an icon is cut into pieces (integration: the rig's splitIcon, so indices match `from`). */
export function usePieceSplitter(fn: PieceSplitter): void {
  splitter = fn;
  pieceCache.clear();
}

/** The icon a preview tile shows (the rig's source when it has none). */
export function tileIcon(tile: string | undefined): string | undefined {
  // the stage's own tile module (tiles.ts), so the card tile's thermometer is drawn on too; text has none
  const icon = tileModule((tile ?? 'icon') as PreviewTile, 'm', false)?.icon;
  return typeof icon === 'string' ? icon : undefined;
}

export interface IconPieces {
  pieces: ExportPiece[];
  viewBox: string;
}

const pieceCache = new Map<string, Promise<IconPieces | undefined>>();

/** An own SVG as icon geometry, like icon-source builds it (paths, accent paths as secondary, strokes). */
export function ownSvgGeometry(svg: string): IconGeometry | undefined {
  const r = sanitizeSvg(svg);
  if (r.error) return undefined;
  const g: IconGeometry = { paths: r.paths, viewBox: r.viewBox };
  if (r.accentPaths.length) g.secondary = r.accentPaths;
  if (r.strokes.length) g.strokes = r.strokes;
  if (r.evenodd) g.evenodd = r.evenodd;
  return g;
}

/**
 * The viewBox the rig is drawn in: its own SVG's, else the resolved source icon's, else 24 x 24.
 * One helper for the overlay, the dialogs, import and export.
 */
export function sourceViewBox(rig: Pick<Rig, 'svg'> | undefined, resolved?: Pick<IconPieces, 'viewBox'>): string {
  if (rig?.svg) return rigViewBox(rig);
  return parseViewBox(resolved?.viewBox).join(' ');
}

/** The rig source's pieces: its own SVG (one per drawn element) or the icon (resolved, cached). */
export function rigPieces(doc: AnimationDoc, tile: string | undefined): Promise<IconPieces | undefined> {
  const rig = doc.rig;
  if (rig?.svg) {
    const g = ownSvgGeometry(rig.svg);
    return Promise.resolve(g ? { viewBox: g.viewBox, pieces: splitter(g) } : undefined);
  }
  const ref = rig?.icon ?? tileIcon(tile);
  if (!ref) return Promise.resolve(undefined);
  let p = pieceCache.get(ref);
  if (!p) {
    p = resolveIconGeometry(ref, { timeoutMs: 4000 })
      .then((g) => (g ? { viewBox: g.viewBox, pieces: splitter(g) } : undefined))
      .catch(() => undefined);
    pieceCache.set(ref, p);
    // a failed lookup may work later (the icon pack loads late): forget it
    void p.then((v) => {
      if (!v) pieceCache.delete(ref);
    });
  }
  return p;
}
