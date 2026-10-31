import type { AnchorKind, Box, EditPath, PathDraw, PathEdit, PathTidy, Pt } from './path-model';
import type { UiMenuClose, UiMenuElement, UiMenuEntry, UiMenuPick } from './ui-kit';

/** Contract: path canvas. Version 1.1.0 (PATH_CANVAS_CONTRACT_VERSION). */

export const PATH_CANVAS_CONTRACT_VERSION = '1.1.0';
/** Revision number of this contract. */
export const PATH_CANVAS_CONTRACT_REVISION = 8;
/** The first element contractRevision with overlay mode (section "Overlay mode"). */
export const PATH_CANVAS_OVERLAY_REVISION = 8;
export const PATH_CANVAS_TAG = 'mc-path-canvas';
export const PATH_CANVAS_CHUNK = 'path-canvas';
export const PATH_CANVAS_CHUNK_FILE = 'magic-card-path-canvas.js';
/** WCAG 2.5.8 is 24; touch follows the 44 px platform norm. */
export const HIT_MIN_FINE = 24;
export const HIT_MIN_COARSE = 44;
export const SEGMENT_BAND_FINE = 12;
export const SEGMENT_BAND_COARSE = 24;
export const DRAG_SLOP_PX = 4;
export const LOUPE_SIZE_PX = 72;
export const LOUPE_ZOOM = 3;
export const LOUPE_OFFSET_PX = 64;
export const LOUPE_DELAY_MS = 120;
/** Drawn grid lines are at least this far apart on screen. */
export const GRID_MIN_PX = 8;
/** Transform box handles. */
export const HANDLE_GLYPH_PX = 10;
export const ROTATE_STEM_PX = 24;
export const ROTATE_STEM_COARSE_PX = 32;
/** Smallest box side a scale may leave, in frame units. */
export const MIN_BOX_SIDE = 0.05;
/** Snap reach of lines in CSS px. */
export const SNAP_REACH_PX = 6;
export const SNAP_REACH_COARSE_PX = 12;
/** Touch long-press for the context menu. */
export const LONG_PRESS_MS = 500;
export const LONG_PRESS_SLOP_PX = 8;
/** A contextmenu event this soon after an emitted context gesture is ignored. */
export const CONTEXT_DEDUPE_MS = 500;
/**
 * Overlay drag speed on the 4x throttled profile (section "Overlay mode"): frame interval in ms during a point drag
 * of a path with `anchors` anchors, the first `warmFrames` frames dropped. p95 21 ms = three 7 ms display steps.
 */
export const OVERLAY_DRAG_BUDGET = { anchors: 64, medianMs: 16.7, p95Ms: 21, warmFrames: 3 } as const;
/** What may be edited. 'view' = render only (thumbnails, previews). */
export type CanvasMode = 'view' | 'select' | 'nodes' | 'add';

/** Unit of frame coordinates in overlay mode texts (section "Overlay mode"). */
export type CanvasUnits = 'px' | '%';

/** Where `frame` sits on screen in overlay mode: CSS px relative to the canvas element's top-left corner. */
export interface CanvasPlacement {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SnapConfig {
  enabled: boolean;
  /** Grid step in frame units (0 = off). */
  grid: number;
  anchors: boolean;
  frame: boolean;
  /** Extra snap lines in frame units: vertical x = n, horizontal y = n. */
  extra?: { x?: number[]; y?: number[] };
  /** Snap to the safe-area edges and centre lines (needs `safeArea` > 0). */
  safeArea?: boolean;
}

export interface PathSelection {
  /** Index into `paths`. */
  path: number;
  /** Selected anchor indices of that path (empty = the whole path selected). */
  anchors: number[];
  /** A handle under keyboard focus, if any. */
  handle?: { anchor: number; which: 'in' | 'out' };
}

export interface PathChange {
  paths: EditPath[];
  commit: boolean;
  /** Short verb for the history label and live region, e.g. "Move point", "Add point", "Cancel". */
  label: string;
}

/** Per-path styling the canvas draws under the edit layer. Set as attributes through lit, never innerHTML. */
export interface PathPaint {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fillRule?: 'nonzero' | 'evenodd';
  hidden?: boolean;
  locked?: boolean;
}

/**
 * Host hook: the shape editor maps a dragged point to its anchored form and back (custom-shape
 * 1.0.0). Return the point to use; the canvas renders the returned point.
 */
export type ConstrainPoint = (pt: Pt, ctx: { path: number; anchor: number; which: 'anchor' | 'in' | 'out' }) => Pt;

/** SVG matrix order, (x, y) -> (a x + c y + e, b x + d y + f), as PathEdit.transform takes it. */
export type Matrix6 = [number, number, number, number, number, number];

/** The selection box the host asks the canvas to draw with handles ('select' mode only). */
export interface TransformBox {
  /** Axis-aligned box in frame units (the host's bounds of what is selected). */
  box: Box;
  /** Eight scale handles. */
  scale: boolean;
  /** Rotate handle and the Rotation slider. */
  rotate: boolean;
  /** Corners keep the ratio (Shift inverts). The SVG editor's "Lock ratio" switch. */
  keepRatio: boolean;
  /** Current angle in degrees for the slider (default 0). */
  angle?: number;
  /** The scaled box stays inside this box (shape editor: the Edit-at frame). */
  bounds?: Box;
}

/** Detail of `mc-path-transform`. */
export interface PathTransform {
  kind: 'scale' | 'rotate';
  /** Relative to the geometry at gesture start (a keyboard step: relative to the current geometry). */
  matrix: Matrix6;
  /** Scale: the box size it leads to. Rotate: degrees turned in this gesture (clockwise positive). */
  size?: { w: number; h: number };
  angle?: number;
  commit: boolean;
  /** "Scale", "Rotate" or "Cancel". */
  label: string;
  source: 'pointer' | 'keyboard';
}

/** Detail of `mc-path-context`. */
export interface PathContext {
  /** Where to open a menu, client CSS px. */
  client: Pt;
  /** The same point in frame units. */
  frame: Pt;
  /** What is under the point (undefined = empty canvas). `segment` = index of the segment's start anchor. */
  hit?: { path: number; anchor?: number; segment?: number; at?: Pt };
  source: 'mouse' | 'touch' | 'pen' | 'keyboard';
}

/** The menu data and events are the ui-kit's. */
export type MenuEntry = UiMenuEntry;
export type MenuPick = UiMenuPick;
export type MenuClose = UiMenuClose;
/** The menu element is <mc-ui-menu>; open it with show(). */
export type PathMenuElement = UiMenuElement;

/** <mc-path-canvas> properties. */
export interface PathCanvasElement extends HTMLElement {
  /** The frame in user units: the SVG editor's viewBox (0 0 24 24), the shape editor's preview box. */
  frame: Box;
  paths: EditPath[];
  paint: PathPaint[];
  selection: PathSelection | undefined;
  mode: CanvasMode;
  snap: SnapConfig;
  /** Nudge per arrow key in frame units (default 0.5 at 24 x 24, 1 otherwise). */
  nudge: number;
  /** Shift+arrow (default 4 units at 24 x 24, 10 otherwise). */
  bigNudge: number;
  /** Alt+arrow, never snapped (default 0.1). */
  fineNudge: number;
  /** Text after the loupe's coordinates, e.g. "at Row" (shape editor). */
  loupeLabel?: string;
  /** Safe-area guide inside the frame (SVG editor: 2 units = the 20 x 20 live area). */
  safeArea?: number;
  /** Show the grid (lines every `gridStep`, thinned below GRID_MIN_PX). */
  pixelGrid: boolean;
  /** Grid line spacing in frame units, default 1 (0 = no grid, from 1.1.0). */
  gridStep?: number;
  /** Boolean attribute; ground and frame are transparent, the host draws underneath. */
  underlay?: boolean;
  /** Boolean attribute, from 1.1.0 (section "Overlay mode"): edit over the host's picture; implies `underlay`. */
  overlay?: boolean;
  /** Overlay mode only: the on-screen rectangle of `frame`; the host sets a new object on every picture change. */
  placement?: CanvasPlacement;
  /** Overlay mode only: unit written after the numbers in the loupe, listbox, live region and readout. */
  units?: CanvasUnits;
  /** At most this many subpaths (shape editor: 1; 2 while a boolean operand or a pen outline is pending). */
  maxPaths: number;
  /** Anchor kinds offered. */
  kinds: readonly AnchorKind[];
  constrain?: ConstrainPoint;
  /** Selection box with handles ('select' mode only; undefined = none). */
  transform?: TransformBox;
  /** Name of the rotate slider (default "Rotation"). */
  rotateLabel?: string;
  /** Emit `mc-path-context` and prevent the browser menu on the drawing surface. Default false. */
  contextMenu?: boolean;
  /** Fit the frame into the element (does nothing in overlay mode). */
  fit(): void;
  /** Move keyboard focus to an anchor (the host's Points list, Esc from a field). */
  focusAnchor(path: number, anchor: number): void;
}

/** History helper (hosts own their history; the canvas only emits commits). */
export interface History<T> {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  /** Record a committed state. Same `merge` key as the previous push within 1 s = one step (typing). */
  push(state: T, label: string, merge?: string): void;
  undo(): T | undefined;
  redo(): T | undefined;
  clear(state: T): void;
}

/** What `import()` of the chunk resolves to. `pathDraw` is shared by both editors. */
export interface PathCanvasChunk {
  PATH_CANVAS_CONTRACT_VERSION: string;
  /** Default limit 100 steps. */
  createHistory<T>(initial: T, limit?: number): History<T>;
  pathEdit: PathEdit;
  pathTidy: PathTidy;
  pathDraw: PathDraw;
}
