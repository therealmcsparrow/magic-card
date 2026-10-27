import type { AnchorKind, Box, EditPath, PathDraw, PathEdit, PathTidy, Pt } from './path-model';
import type { UiMenuClose, UiMenuElement, UiMenuEntry, UiMenuPick } from './ui-kit';

/*
 * Contract: path canvas. Version 1.0.0 (PATH_CANVAS_CONTRACT_VERSION).
 * Hit sizes 24 / 44 px, touch drag loupe and grab offset, keyboard (`[` / `]`, H, fine step, Enter to
 * fields, C and double-click for the kind), Esc cancels a drag, imports over MAX_ANCHORS stay
 * editable, drag performance with large paths.
 *
 * One editing surface for anchors and handles, used by the SVG editor (many subpaths in a fixed
 * viewBox) and the shape editor (one closed subpath in a resizable box with anchored coordinates).
 *
 * Implementation: module `path-canvas`, folder src/path-canvas/, lazy chunk PATH_CANVAS_CHUNK_FILE
 * (webpackChunkName PATH_CANVAS_CHUNK). Loaded with import() by the svg-editor and shape-editor
 * chunks, each through src/path-canvas/loader.ts, the only import() of the chunk;
 * never by magic-card.js, never by the card-editor chunk statically. The chunk defines
 * one element, PATH_CANVAS_TAG (guarded by customElements.get), and its module exports
 * PathCanvasChunk below. Uses path-model 1.0.0. Imports nothing from src/anim-studio/,
 * src/editor/, src/svg-editor/, src/shape-editor/ or src/path-booleans/.
 *
 * The chunk exports `pathDraw` (path-model PathDraw, incl. the primitives): the shape editor draws
 * too (pen, starter outlines), so the draw generators are shared by both editors. Neither editor
 * chunk imports src/path/draw.ts or src/path/edit.ts (with splitChunks false that would copy them:
 * draw 6.2 KB + edit 5.9 KB measured). Element properties: `gridStep` (drawn grid spacing, the SVG
 * editor's grid size setting) and `underlay` (ground and frame see-through so the host can draw the
 * artwork underneath).
 *
 * The chunk defines no menu. <mc-ui-menu> (UI_MENU_TAG, UiMenuElement) comes from the ui-kit Module,
 * which the card-editor chunk defines once (defineUiKit()); the svg-editor and shape-editor layers
 * render it inside their own shadow root. PathMenuElement is an alias of UiMenuElement;
 * MenuEntry = UiMenuEntry, MenuPick = UiMenuPick, MenuClose = UiMenuClose. Events 'mc-menu-pick' and
 * 'mc-menu-close'. Open the menu with show(); `open` is the read-only state.
 * Menu behaviour: right-click, long-press, ContextMenu / Shift+F10, roving focus, one submenu
 * level, Esc, Tab, focus back to `opener`, 8 px viewport margin, reasons as aria-description; the items
 * follow the kit look: --mc-hit high (44 on coarse), MDI glyphs, kit tokens. The canvas's styles read
 * the kit tokens (--mc-*) directly.
 *
 * Transform box, box snapping, context gesture and menu:
 * - Transform box: property `transform` (TransformBox). In 'select' mode only, the canvas draws the
 *   host's box with eight scale handles (corners, edge midpoints) and, when `rotate`, a rotate handle on
 *   a stem ROTATE_STEM_PX (ROTATE_STEM_COARSE_PX on coarse) above the top centre, below the box when there
 *   is no room. Handles: HANDLE_GLYPH_PX visible, HIT_MIN_FINE / HIT_MIN_COARSE hit. They never overlap:
 *   when the box is under 3 hit sizes on screen, edge handles hide first, then corner handles move
 *   outside the corners by half a hit size. Handle targets win over path bodies.
 *   Scale: a corner keeps the ratio when `keepRatio` (Shift inverts it) and scales about the opposite
 *   corner (Alt / Option: about the centre); an edge handle scales one axis. A side never goes under
 *   MIN_BOX_SIDE frame units and never past the opposite side (flips are host buttons); with `bounds` set
 *   the scaled box stays inside it. Rotate: about the box centre, Shift snaps to 15 degrees.
 *   During a drag the canvas draws the box (rotated for a rotate) from its own gesture state and a readout
 *   next to the pointer ("W 12 H 8", "45 degrees"; above the finger on touch; the loupe is for points
 *   only). Each step emits `mc-path-transform` (PathTransform: a matrix relative to the geometry at
 *   gesture start; commit false while dragging, one commit true at the end). Esc during the drag emits
 *   the identity matrix, commit false, label "Cancel", and no commit follows. The canvas never changes
 *   `paths` for a transform: the host applies the matrix to the geometry it kept at gesture start and
 *   passes back `paths` and a new axis-aligned `transform.box`.
 * - Keyboard for the box (WCAG 2.5.7; scale handles are not tab stops): Ctrl/Cmd+Shift+Arrows on the
 *   focused canvas resize by `nudge` from the top-left corner (Right and Down grow), with Alt by
 *   `fineNudge`; one commit per key (hosts merge them by label within 1 s). When `rotate`, the rotate
 *   handle is a focusable role="slider" right after the canvas in the tab order, named `rotateLabel`
 *   (default "Rotation"), aria-valuenow = `transform.angle` (default 0), aria-valuetext "45 degrees";
 *   Arrows 1 degree, Shift+Arrows 15, Home back to 0; each key emits one commit rotate; the value is
 *   announced 250 ms after the last key. BracketLeft / BracketRight with Ctrl or Cmd are not handled by
 *   the canvas and bubble to the host (arrange keys).
 * - Box snapping: with `transform` set and `snap.enabled`, a whole-path move in 'select' snaps the moving
 *   box (its edges and centre) and a scale snaps the dragged edges, not the grabbed point, so a
 *   multi-layer move lines up as one. Targets: the grid, frame edges and centre, `snap.extra`, and with
 *   `snap.safeArea` and `safeArea` > 0 the four safe-area edges and its centre lines. Reach SNAP_REACH_PX
 *   (SNAP_REACH_COARSE_PX on coarse). A held snap draws a 1 px guide with a text label ("Safe area edge",
 *   "Centre", "Edge"; canvas strings, English), never colour only. Snaps are not announced. Point drags in
 *   'nodes' also use the safe-area lines when `snap.safeArea`.
 * - Context gesture: with `contextMenu` true the canvas emits `mc-path-context` (PathContext) on a
 *   right-click (the browser menu is prevented on the drawing surface only), a touch long-press of
 *   LONG_PRESS_MS that moves less than LONG_PRESS_SLOP_PX (more movement or a second finger cancels it and
 *   the gesture goes on as a drag, pan or pinch; the loupe waits until the press resolves), and the
 *   ContextMenu key or Shift+F10 on the focused canvas (point: the focused anchor, else the transform box
 *   centre, else the canvas centre). A right-click or long-press on a path that is not selected first
 *   emits `mc-path-select` for it; on a selected path the selection stays. One gesture, one event: a
 *   `contextmenu` event within CONTEXT_DEDUPE_MS after the canvas emitted (Shift+F10 in Firefox, an
 *   Android long-press) is prevented and ignored. The pointer-up that ends a long-press does nothing else.
 *   The drawing surface has `-webkit-touch-callout: none` and `user-select: none`. With `contextMenu`
 *   false (default) the canvas leaves the browser's behaviour alone. The canvas never opens a menu itself.
 * - Menu element (<mc-ui-menu>): a generic menu both editors use for the canvas, layer rows and a "More actions"
 *   button. role="menu" named by `label`; items role menuitem (menuitemcheckbox when `checked` is set);
 *   `separatorBefore` renders role="separator"; an item with `items` is a submenu parent
 *   (aria-haspopup="menu", aria-expanded); at most one submenu level. Keys: Up / Down (wrap), Home / End,
 *   a letter moves to the next item starting with it, Enter / Space picks, Right opens a submenu, Left or
 *   Esc closes it, Esc closes the menu, Tab closes it and lets focus move on. An item with `reason` is
 *   unavailable: focusable, aria-disabled, dimmed, the reason as aria-description and as visible text
 *   while focused; picking it does nothing. Items are 32 px high (44 on coarse; shortcut hints hidden on
 *   coarse). position: fixed at `at` (client px), flipped and clamped into the viewport with 8 px margin,
 *   at least 8 px from a touch point, scrolling when taller than the viewport (200 % zoom, 320 px). It
 *   opens with the first available item focused; a click or tap outside closes without acting. Events
 *   `mc-menu-pick` (MenuPick) and `mc-menu-close` (MenuClose); on close without a pick focus returns to
 *   `opener`; after a pick the host moves focus. Esc that closed the menu is stopped there (editor Esc
 *   order: gesture, then overlay). No motion under reduced motion. No strings of its own: the host passes
 *   every label. The host places the element inside its own layer (shadow root), so focus stays inside.
 * - Size: the chunk measures about 15.1 KB minified (menu 6.0 KB, canvas 9.1 KB). Ceiling 62 KiB = 63,488 B.
 *
 * One copy rule: webpack runs with splitChunks false, so a file imported statically by two lazy
 * chunks is copied into both. The editor chunks therefore take the editor-only path-model parts
 * (edit, tidy, draw) from this chunk's exports and do not import src/path/edit.ts, tidy.ts or
 * draw.ts themselves (import scan test). They may import src/path/core.ts (small, in the shared
 * path-core chunk). Boolean operations are their own chunk (path-booleans 1.0.0), not part of this one.
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
 *   frame during the drag only.
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
 *   Plus the safe area with `snap.safeArea`; on scale handle drags Shift is the ratio key, so there
 *   snapping is suspended by Ctrl / Cmd instead.
 * - Grid drawing: with `pixelGrid` on, lines every `gridStep` frame units from the frame
 *   origin (default 1). When gridStep x zoom is under 8 CSS px the canvas draws every k-th line, k the
 *   smallest whole number that reaches 8 px; at most 256 lines per axis. Hosts keep snap.grid and
 *   gridStep equal.
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
 * - `mc-path-transform` detail PathTransform: a scale or rotate from the transform box or its keys.
 * - `mc-path-context` detail PathContext: a context gesture (only with `contextMenu` true).
 * - From the menu (<mc-ui-menu>): `mc-menu-pick` detail MenuPick, `mc-menu-close` detail MenuClose.
 *
 * Contract tests (tests/path-canvas.contract.test.ts): controlled rendering, commit sequence of
 * a drag (n x false, then one true), Esc during a drag (start paths, no commit), keyboard-only add /
 * move / delete / kind change, `[` / `]` by event.code, H target cycle, fine step unsnapped, fine
 * and coarse hit size, slop, loupe only for touch, snapping on / off / Shift / Alt, 140-anchor
 * import editable and add refused with mc-path-limit, history coalescing and limit, listbox and
 * live-region text. The chunk exports `pathDraw` with every PathDraw member; every
 * PRIMITIVE_KINDS entry gives one closed clockwise subpath inside its box with at most
 * PRIMITIVE_MAX_ANCHORS anchors at 24 x 24 and 360 x 120; gridStep 0.5 / 2 / 3 line positions and
 * the 8 px thinning; `underlay` leaves ground and frame unpainted. Corner scale keeps the
 * ratio with keepRatio and Shift inverts it, Alt scales about the centre, edge handles scale one axis,
 * MIN_BOX_SIDE and `bounds` hold; rotate about the centre with Shift 15 degree steps; commit sequence
 * and Esc cancel for both; edge handles hide on a small box; no box outside 'select'; Ctrl/Cmd+Shift+
 * Arrow resize; slider keys, aria-valuetext and its place in the tab order; a whole-path move snaps
 * its box to a safe-area edge with the guide label; Ctrl/Cmd+BracketLeft bubbles; right-click on an
 * unselected path selects it first; long-press opens at 500 ms and 8 px of movement turns it into a
 * drag; ContextMenu and Shift+F10 emit once (dedupe of the following contextmenu); contextMenu false
 * leaves contextmenu alone; menu roles, keys, typeahead, submenu open / close, reason on an unavailable
 * item, viewport clamp at 320 px, focus return to the opener; the import scan.
 */

export const PATH_CANVAS_CONTRACT_VERSION = '1.0.0';
/** Revision number of this contract. */
export const PATH_CANVAS_CONTRACT_REVISION = 7;
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
  /** Grid line spacing in frame units, default 1. */
  gridStep?: number;
  /** Boolean attribute; ground and frame are transparent, the host draws underneath. */
  underlay?: boolean;
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

/** What `import()` of the chunk resolves to. `pathDraw` is shared by both editors. */
export interface PathCanvasChunk {
  PATH_CANVAS_CONTRACT_VERSION: string;
  /** Default limit 100 steps. */
  createHistory<T>(initial: T, limit?: number): History<T>;
  pathEdit: PathEdit;
  pathTidy: PathTidy;
  pathDraw: PathDraw;
}
