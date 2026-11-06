import type { BooleanResult, PathBooleansChunk } from './path-booleans';
import type { Box, EditPath, PathDraw, Pt } from './path-model';

/** Contract: path tools (SVG editor). Version 1.0.0. Tools: Outline stroke, Offset path, Simplify (doubles as smooth),
 * Join, Split at an anchor and a straight Knife. Implementation: module `path-tools`, folder src/path-tools/, lazy chunk
 * PATH_TOOLS_CHUNK_FILE (webpackChunkName PATH_TOOLS_CHUNK). */

export const PATH_TOOLS_CONTRACT_VERSION = '1.0.0';
export const PATH_TOOLS_CONTRACT_REVISION = 2;
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
