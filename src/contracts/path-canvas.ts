import type { AnchorKind, Box, EditPath, PathEdit, PathTidy, Pt } from './path-model';

/*
 * Contract: path canvas. Version 1.0.0 (Architect-owned). ADR 0017.
 *
 * One editing surface for anchors and handles, used by the SVG editor (many subpaths in a fixed
 * viewBox) and the shape editor (one closed subpath in a resizable box with anchored coordinates).
 *
 * Implementation: module `path-canvas`, folder src/path-canvas/, lazy chunk PATH_CANVAS_CHUNK_FILE
 * (webpackChunkName PATH_CANVAS_CHUNK). Loaded with import() by the svg-editor and shape-editor
 * chunks only; never by magic-card.js, never by the card-editor chunk statically. The chunk defines
 * one element, PATH_CANVAS_TAG (guarded by customElements.get), and its module exports
 * PathCanvasChunk below. Uses path-model 1.0.0. Imports nothing from src/anim-studio/,
 * src/editor/, src/svg-editor/ or src/shape-editor/.
 *
 * One copy rule: webpack runs with splitChunks false, so a file imported statically by two lazy
 * chunks is copied into both. The editor chunks therefore take the editor-only path-model parts
 * (edit, tidy, draw) from this chunk's exports and do not import src/path/edit.ts, tidy.ts or
 * draw.ts themselves (import scan test). They may import src/path/core.ts (small, also in the card).
 *
 * The canvas is controlled: it never keeps its own copy of the paths. It renders `paths`, and every
 * change is an `mc-path-change` event the host applies (or refuses) and passes back.
 *
 * Interaction (all of it also reachable without a drag, WCAG 2.5.7):
 * - Pointer events with capture: mouse, pen, touch. Pinch = zoom, two-finger drag = pan, wheel =
 *   zoom at the pointer, Space+drag = pan.
 * - Hit areas: anchors and handles at least HIT_MIN_COARSE CSS px on `(pointer: coarse)`, else
 *   HIT_MIN_FINE. No hover-only affordance.
 * - Drag an anchor or handle; Alt+click on a segment (or the "Add point" mode, then tap) inserts;
 *   double-click / Enter on an anchor cycles corner -> smooth -> symmetric (within `kinds`).
 * - Keyboard (focus on the canvas): Tab / Shift+Tab walk anchors, then the handles of the focused
 *   anchor; arrows nudge by `nudge` (Shift = bigNudge); Delete removes; Ctrl+A selects all anchors
 *   of the active subpath; Esc clears the selection; + / - zoom, 0 fits.
 * - Snapping (when `snap.enabled`; Shift held during a drag suspends it): grid step, other anchors,
 *   frame edges and centre, 15 degree handle angles, plus host lines in `snap.extra`.
 * - Accessibility: next to the SVG the canvas renders a visually hidden listbox of anchors
 *   ("Point 3 of 8, corner, x 24, y 0") kept in step with the selection, and a polite live region
 *   that announces selection changes and nudges (at most one message per 500 ms).
 * - Visuals follow DESIGN.md editor tokens (src/css/editor-system); focus is always visible.
 *
 * Events (bubbling, composed):
 * - `mc-path-change` detail PathChange. `commit` false while dragging, true on pointer up / key up /
 *   any non-drag edit. Hosts push one history step per commit (a drag is one step).
 * - `mc-path-select` detail PathSelection.
 * - `mc-path-view` detail { zoom, pan }: the host may keep it for the next open.
 *
 * Contract tests (QA, tests/path-canvas.contract.test.ts): controlled rendering, commit sequence of
 * a drag (n x false, then one true), keyboard-only add / move / delete / kind change, coarse hit
 * size, snapping on / off / Shift, history coalescing and limit, listbox and live-region text.
 */

export const PATH_CANVAS_CONTRACT_VERSION = '1.0.0';
export const PATH_CANVAS_TAG = 'mc-path-canvas';
export const PATH_CANVAS_CHUNK = 'path-canvas';
export const PATH_CANVAS_CHUNK_FILE = 'magic-card-path-canvas.js';
export const HIT_MIN_COARSE = 24;
export const HIT_MIN_FINE = 12;

/** What may be edited. 'view' = render only (thumbnails, previews). */
export type CanvasMode = 'view' | 'select' | 'nodes' | 'add';

export interface SnapConfig {
  enabled: boolean;
  /** Grid step in frame units (0 = off). */
  grid: number;
  anchors: boolean;
  frame: boolean;
  /** Extra snap lines in frame units: vertical x = n, horizontal y = n. */
  extra?: { x?: number[]; y?: number[] };
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
  /** Short verb for the history label and live region, e.g. "Move point", "Add point". */
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
  bigNudge: number;
  /** Safe-area guide inside the frame (SVG editor: 2 units = the 20 x 20 live area). */
  safeArea?: number;
  /** Show the pixel grid when one unit is drawn 8 CSS px or larger. */
  pixelGrid: boolean;
  /** At most this many subpaths (shape editor: 1). */
  maxPaths: number;
  /** Anchor kinds offered. */
  kinds: readonly AnchorKind[];
  constrain?: ConstrainPoint;
  /** Fit the frame into the element. */
  fit(): void;
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

/** What `import()` of the chunk resolves to. Draw generators keep the signatures of src/path/draw.ts. */
export interface PathCanvasChunk {
  PATH_CANVAS_CONTRACT_VERSION: string;
  /** Default limit 100 steps. */
  createHistory<T>(initial: T, limit?: number): History<T>;
  pathEdit: PathEdit;
  pathTidy: PathTidy;
  pathDraw: Record<string, (...args: never[]) => unknown>;
}
