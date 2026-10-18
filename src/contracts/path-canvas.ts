import type { AnchorKind, Box, EditPath, PathEdit, PathTidy, Pt } from './path-model';

/*
 * Contract: path canvas. Version 1.0.0 (Architect-owned). ADR 0017, ADR 0020.
 * Revision 2 (2026-10-18, before any implementation; the designer's "1.1.0" is folded in here):
 * hit sizes 24 / 44 px, touch drag loupe and grab offset, keyboard aligned with design 03 (`[` / `]`,
 * H, fine step, Enter to fields, C and double-click for the kind), Esc cancels a drag, imports over
 * MAX_ANCHORS stay editable, drag performance with large paths.
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
 * - Pointer events with capture: mouse, pen, touch. Pinch = zoom, two-finger drag = pan, Ctrl+wheel
 *   = zoom at the pointer, wheel = pan, Space+drag and middle-drag = pan. `touch-action: none` on the
 *   drawing surface only; `overscroll-behavior: contain` on the canvas element.
 * - Hit areas: a transparent target of at least HIT_MIN_FINE x HIT_MIN_FINE CSS px around each
 *   anchor and handle (HIT_MIN_COARSE on `(pointer: coarse)` or when the event's pointerType is
 *   'touch'); the glyph does not grow. Segment hit band SEGMENT_BAND_FINE / SEGMENT_BAND_COARSE.
 *   Where targets overlap the anchor wins over its handles. No hover-only affordance. A drag or a
 *   marquee starts after DRAG_SLOP_PX of movement, so a tap is never a tiny drag.
 * - Touch drag (pointerType 'touch' only, never pen or mouse): grab offset (the point keeps its
 *   offset to the finger, it never jumps under it) and a drag loupe: LOUPE_SIZE_PX circle,
 *   LOUPE_ZOOM x, centred LOUPE_OFFSET_PX above the contact point, flipped to the side with room
 *   near the canvas edge, never below the finger; label "x 19, y 9" (the host may pass a suffix via
 *   `loupeLabel`). Shown after LOUPE_DELAY_MS of movement or at once on a second finger; aria-hidden;
 *   no fade under reduced motion; a second small SVG of the same path data, redrawn per animation
 *   frame during the drag only. Design 03 section 3 is the visual spec.
 * - Drag an anchor or handle; Alt+click on a segment, double-click on a segment (Node mode), or the
 *   "Add point" mode then tap, inserts. Double-click on an anchor, or C, toggles corner <-> smooth
 *   (symmetric through the host's kind control, within `kinds`).
 * - Keyboard (focus on the canvas, never inside a text field; keys by event.code where the
 *   character needs Shift or Option on some layouts):
 *   Tab / Shift+Tab walk anchors, then the handles of the focused anchor (there is no trap: the
 *   host renders skip links before and after the canvas). BracketLeft / BracketRight = previous /
 *   next anchor of the active subpath (the host maps them to shapes in Select mode). H cycles the
 *   arrow target: anchor, in handle, out handle (announced). Arrows nudge by `nudge`, Shift+arrows
 *   by `bigNudge`, Alt+arrows by `fineNudge` (fine steps are never snapped). Delete / Backspace
 *   removes. Ctrl/Cmd+A selects all anchors of the active subpath. Enter on a focused anchor emits
 *   `mc-path-fields` (the host moves focus to that point's X field; Esc there returns focus to the
 *   same anchor). =, + and - zoom, 0 fits.
 * - Esc: during a drag it cancels the drag (one `mc-path-change` with the start paths, commit false,
 *   label "Cancel", and no commit follows, so no history step); else it clears the selection; with
 *   nothing selected the canvas does nothing and lets the event bubble. The canvas never closes
 *   anything; the editor layer root stops Escape (svg-editor 1.0.0).
 * - Snapping (when `snap.enabled`; Shift held during a drag suspends it; Alt never does): grid step,
 *   other anchors, frame edges and centre, 15 degree handle angles, plus host lines in `snap.extra`.
 * - Large paths: an imported subpath may hold more than MAX_ANCHORS anchors (path-model 1.0.0).
 *   Moving, deleting and changing kind work; 'add' mode and inserting are refused (no event) and
 *   the canvas emits `mc-path-limit` once per attempt so the host can show W10. Dragging one anchor
 *   of a 1,000-anchor path keeps at least 30 frames per second on the 4x throttled profile (only
 *   the changed segments and the selection layer re-render per frame).
 * - Accessibility: next to the SVG the canvas renders a visually hidden listbox of anchors
 *   ("Point 3 of 8, corner, x 24, y 0") kept in step with the selection, and a polite live region
 *   that announces selection changes, adds and deletes, and moves 250 ms after the last key (at
 *   most one message per 500 ms; snaps are not announced). The canvas element has role group,
 *   aria-roledescription "drawing canvas" and the host's aria-label / aria-describedby.
 * - Visuals follow DESIGN.md editor tokens (src/css/editor-system); focus is always visible.
 *
 * Events (bubbling, composed):
 * - `mc-path-change` detail PathChange. `commit` false while dragging, true on pointer up / key up /
 *   any non-drag edit. Hosts push one history step per commit (a drag is one step).
 * - `mc-path-select` detail PathSelection.
 * - `mc-path-view` detail { zoom, pan }: the host may keep it for the next open.
 * - `mc-path-fields` detail { path, anchor }: Enter on a focused anchor.
 * - `mc-path-limit` detail { path, max: MAX_ANCHORS }: an add was refused at the cap.
 *
 * Contract tests (QA, tests/path-canvas.contract.test.ts): controlled rendering, commit sequence of
 * a drag (n x false, then one true), Esc during a drag (start paths, no commit), keyboard-only add /
 * move / delete / kind change, `[` / `]` by event.code, H target cycle, fine step unsnapped, fine
 * and coarse hit size, slop, loupe only for touch, snapping on / off / Shift / Alt, 140-anchor
 * import editable and add refused with mc-path-limit, history coalescing and limit, listbox and
 * live-region text.
 */

export const PATH_CANVAS_CONTRACT_VERSION = '1.0.0';
export const PATH_CANVAS_CONTRACT_REVISION = 2;
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
  /** Show the pixel grid when one unit is drawn 8 CSS px or larger. */
  pixelGrid: boolean;
  /** At most this many subpaths (shape editor: 1). */
  maxPaths: number;
  /** Anchor kinds offered. */
  kinds: readonly AnchorKind[];
  constrain?: ConstrainPoint;
  /** Fit the frame into the element. */
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

/** What `import()` of the chunk resolves to. Draw generators keep the signatures of src/path/draw.ts. */
export interface PathCanvasChunk {
  PATH_CANVAS_CONTRACT_VERSION: string;
  /** Default limit 100 steps. */
  createHistory<T>(initial: T, limit?: number): History<T>;
  pathEdit: PathEdit;
  pathTidy: PathTidy;
  pathDraw: Record<string, (...args: never[]) => unknown>;
}
