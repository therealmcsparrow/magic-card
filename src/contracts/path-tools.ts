import type { BooleanResult, PathBooleansChunk } from './path-booleans';
import type { Box, EditPath, PathDraw, Pt } from './path-model';

/*
 * Contract: path tools (SVG editor). Version 1.0.0.
 * Tools: Outline stroke, Offset path, Simplify (doubles as smooth), Join, Split at an anchor and a
 * straight Knife.
 *
 * Implementation: module `path-tools`, folder src/path-tools/, lazy chunk PATH_TOOLS_CHUNK_FILE
 * (webpackChunkName PATH_TOOLS_CHUNK). Loaded with import() through src/path-tools/loader.ts by the
 * svg-editor chunk only, on the FIRST use of a path tool (button, menu item or key), never when the editor
 * opens, never by magic-card.js, the card-editor chunk or the shape editor. Loader rules as path-booleans: memoised, 8 s timeout, a failure resolves undefined,
 * clears the memo and the editor shows "Couldn't load the path tools. Try again." with the drawing unchanged.
 *
 * One-copy rule (splitChunks is false, so a static import copies a module into this chunk):
 * - Imports: this contract, path-model / path-booleans types, src/path/core.ts (already in magic-card.js),
 *   `lit` (already in magic-card.js) for the panel template only.
 * - NOT src/path/edit.ts, draw.ts, primitives.ts, tidy.ts (path-canvas chunk), NOT src/path-booleans/**
 *   (booleans chunk), nothing from src/svg-editor/, src/shape-editor/, src/path-canvas/, src/anim-studio/,
 *   src/editor/ (import scan test).
 * - The geometry it needs from those chunks is INJECTED: every call takes PathToolsDeps, which the SVG editor
 *   fills from the booleans chunk (loadPathBooleans(), loaded together with this chunk on first use) and the
 *   path-canvas chunk's `pathDraw` (already loaded while the editor is open).
 * Size: CAPS entry = measured + 5 %, rounded up to 1 KiB, never above PATH_TOOLS_CEILING_BYTES.
 *
 * ── Common rules ──
 * - Units are the editor's frame (the viewBox, 24 x 24 by default). Tolerance default = longest frame side /
 *   FLATTEN_DIVISOR (path-booleans), passed by the host in ToolOptions.frame.
 * - Pure and deterministic (no Date, no Math.random, no DOM, no timers): same input, deep-equal output.
 * - Input segments over MAX_TOOL_SEGMENTS (all subpaths of all operands) -> { ok: false, reason:
 *   'too-complex' } before any work; booleans' own 'too-complex' passes through.
 * - Budget: a 100-anchor icon outline in under 100 ms on the 4x throttled CPU profile, per call.
 * - Output curves: cubics and lines only, 'corner' anchors at joins, crossings and caps, source anchor kinds
 *   kept where a source anchor survives. Results over MAX_ANCHORS stay editable (W10).
 * - Every result is applied by the host as ONE history step; the chunk never touches the document.
 *
 * ── Tools ──
 * outlineStroke (Outline stroke): the stroked area of `paths` with `stroke` (width, cap, join, miter limit
 *   STROKE_MITER_LIMIT, then bevel). Built as closed rings: per segment the band between its offset curves
 *   at +-width/2 (offset cubics approximated by subdivision until within tolerance), a join piece at every
 *   inner anchor (round: arc as cubics; miter: the miter triangle or bevel past the limit; bevel), caps on
 *   open subpath ends (butt: none; round: half disc; square: half square). Then booleans union of all rings,
 *   fillRule nonzero. Accuracy: the outline is within OUTLINE_ACCURACY of the true stroke edge (sampled).
 *   Zero width or no stroke -> 'no-stroke'.
 * offset (Offset path): the area of the closed subpaths grown (amount > 0) or shrunk (amount < 0) by |amount|.
 *   = booleans union(area, band) / subtract(area, band), band = outlineStroke(closed rings, width 2|amount|,
 *   cap butt, join as chosen: 'round' | 'miter'). Self-intersections are gone by construction. Open subpaths
 *   are ignored (skippedOpen). |amount| in OFFSET_MIN_ABS..OFFSET_MAX_ABS frame units; nothing left ->
 *   'empty'. Contract: +a then -a on a convex outline returns it within OUTLINE_ACCURACY (both joins).
 * simplify (Simplify): per subpath, flatten (tolerance / 4), keep as fixed points the source anchors of kind
 *   'corner' whose turn exceeds CORNER_KEEP_DEG (unless `smooth` is true: then only open ends are fixed),
 *   refit each run between fixed points with deps.draw.fitCubics(points, tolerance). Closed stays closed.
 *   Every result point lies within `tolerance` of the source outline and vice versa (sampled). If no subpath
 *   loses an anchor -> 'no-change'. Tolerance: SIMPLIFY_MIN..SIMPLIFY_MAX x the 24-unit scale (frame longest
 *   side / 24), default SIMPLIFY_DEFAULT.
 * join (Join): two open subpaths (a, b): the nearest pair of ends is joined; ends closer than JOIN_MERGE_DIST
 *   merge into one corner anchor, else a straight segment joins them; the result keeps a's direction. One
 *   open subpath and no b: closes it (same merge rule). A closed input -> 'not-open'.
 * split (Split at point): subpath `path`, anchor index i. Open: two open subpaths, both holding a copy of
 *   anchor i (ends 'corner'); i at an end -> 'at-end'. Closed: one open subpath starting and ending at
 *   anchor i (same look when filled; the host keeps the fill).
 * knife (Knife): a straight cut along the infinite line through a and b (a != b, else 'no-line'). Closed
 *   areas: pieces = booleans intersect(area, half-plane polygon) for each side (each half-plane is the frame
 *   grown by its own size, cut by the line); pieces under MIN_RING_AREA_RATIO are dropped. Open subpaths:
 *   split at every crossing with the line. An operand the line does not cross is returned unchanged with
 *   cut false.
 *
 * ── Panel (UI that lives in the chunk to keep the SVG editor small) ──
 * renderPanel(state, actions) returns a lit TemplateResult the SVG editor renders in its inspector (or bottom
 * sheet when narrow): the tool's title, its fields (Offset: amount + Joins round/miter; Simplify: tolerance
 * slider with the number shown + "Smooth corners" switch; Outline stroke, Join, Split, Knife: none), the
 * outcome line (anchor count before -> after, or the refusal message), "Apply" and "Cancel". Fields are real
 * labelled inputs; Apply is disabled with its reason while there is no valid preview. Strings live in
 * src/path-tools/strings.ts (en, externalised like the editor's). The SVG editor owns the state, the
 * debounced preview run (PREVIEW_DEBOUNCE_MS) and the dashed preview drawing on the canvas.
 *
 * ── Messages (first sentence of the message) ──
 * 'too-complex' "This shape has too many points for this tool." 'empty' "Nothing would be left of this
 * shape." 'no-stroke' "This shape has no stroke to outline." 'no-area' "Select a closed shape. Open lines
 * have no area." 'no-change' "This shape is already as simple as this setting allows." 'not-open' "Join works
 * on open paths. Use Split first to open a closed one." 'at-end' "Pick a point between the ends to split
 * here." 'no-line' "Draw a longer cut line."
 *
 * Contract tests (tests/path-tools.contract.test.ts): 2 px round-cap line -> one filled path within
 * OUTLINE_ACCURACY of the true stroke at 96 px (sampled 256 points on both edges); each cap and join; a closed
 * stroked circle gives a ring with a hole; miter limit falls back to bevel; Offset +1 / -1 round trip on a
 * square, a circle and a rounded rect within OUTLINE_ACCURACY; Offset -big gives 'empty'; a self-crossing
 * outline grown gives no self-intersection; Simplify a 120-anchor freehand at default tolerance drops >= 50 %
 * anchors and stays within tolerance; corners kept unless smooth; 'no-change'; Join nearest ends, merge
 * within JOIN_MERGE_DIST, close one path, 'not-open'; Split open and closed, 'at-end'; Knife through a circle
 * gives two pieces with the circle's area, a line that misses gives cut false, an open line split at a
 * crossing; MAX_TOOL_SEGMENTS + 1 -> 'too-complex' in under 5 ms; determinism; timing on the throttled
 * profile; import scan (no edit / draw / tidy / primitives / path-booleans / editor folders); size under the
 * ceiling; the chunk is not fetched when the SVG editor opens.
 */

export const PATH_TOOLS_CONTRACT_VERSION = '1.0.0';
export const PATH_TOOLS_CONTRACT_REVISION = 1;
export const PATH_TOOLS_CHUNK = 'path-tools';
export const PATH_TOOLS_CHUNK_FILE = 'magic-card-path-tools.js';
/** 20 KiB ceiling; the CAPS entry is measured + 5 % below it. */
export const PATH_TOOLS_CEILING_BYTES = 20_480;

export const MAX_TOOL_SEGMENTS = 4_000;
/** Frame units at the 24-unit scale (scaled by frame longest side / 24). */
export const OUTLINE_ACCURACY = 0.05;
export const STROKE_MITER_LIMIT = 4;
export const OFFSET_MIN_ABS = 0.05;
export const OFFSET_MAX_ABS = 12;
export const SIMPLIFY_MIN = 0.01;
export const SIMPLIFY_MAX = 2;
export const SIMPLIFY_DEFAULT = 0.1;
export const CORNER_KEEP_DEG = 30;
export const JOIN_MERGE_DIST = 0.01;
export const PREVIEW_DEBOUNCE_MS = 120;

export type PathTool = 'outline-stroke' | 'offset' | 'simplify' | 'join' | 'split' | 'knife';
export const PATH_TOOLS: readonly PathTool[] = ['outline-stroke', 'offset', 'simplify', 'join', 'split', 'knife'];

export interface PathToolsDeps {
  booleans: Pick<PathBooleansChunk, 'run'>;
  draw: Pick<PathDraw, 'fitCubics'>;
}

export interface ToolOptions {
  /** The editor's frame (viewBox). */
  frame: Box;
  /** Default: longest frame side / FLATTEN_DIVISOR. */
  tolerance?: number;
}

export interface StrokeSpec {
  width: number;
  cap: 'butt' | 'round' | 'square';
  join: 'miter' | 'round' | 'bevel';
}

export type ToolRefusal = 'too-complex' | 'empty' | 'no-stroke' | 'no-area' | 'no-change' | 'not-open' | 'at-end' | 'no-line';

export type ToolResult =
  | { ok: true; paths: EditPath[]; skippedOpen: number }
  | { ok: false; reason: ToolRefusal; skippedOpen: number };

export interface KnifePiece {
  /** Index of the operand it came from. */
  operand: number;
  paths: EditPath[];
}

export type KnifeResult =
  | { ok: true; pieces: KnifePiece[]; cut: boolean[] }
  | { ok: false; reason: Extract<ToolRefusal, 'too-complex' | 'no-line'> };

export interface PanelState {
  tool: PathTool;
  amount?: number;
  join?: 'round' | 'miter';
  tolerance?: number;
  smooth?: boolean;
  /** Anchor counts for the outcome line. */
  before?: number;
  after?: number;
  refusal?: ToolRefusal;
  busy?: boolean;
}

export interface PanelActions {
  change(patch: Partial<PanelState>): void;
  apply(): void;
  cancel(): void;
}

/** What `import()` of the chunk resolves to. */
export interface PathToolsChunk {
  PATH_TOOLS_CONTRACT_VERSION: string;
  outlineStroke(paths: EditPath[], stroke: StrokeSpec, o: ToolOptions, deps: PathToolsDeps): ToolResult;
  offset(paths: EditPath[], amount: number, join: 'round' | 'miter', o: ToolOptions, deps: PathToolsDeps): ToolResult;
  simplify(paths: EditPath[], tolerance: number, smooth: boolean, o: ToolOptions, deps: PathToolsDeps): ToolResult;
  join(a: EditPath, b: EditPath | undefined, o: ToolOptions): ToolResult;
  split(path: EditPath, anchor: number): ToolResult;
  knife(operands: EditPath[][], a: Pt, b: Pt, o: ToolOptions, deps: PathToolsDeps): KnifeResult;
  /** lit TemplateResult (typed loosely so the contract does not import lit). */
  renderPanel(state: PanelState, actions: PanelActions): unknown;
}

/** Re-exported for hosts that pass booleans results through. */
export type { BooleanResult };
