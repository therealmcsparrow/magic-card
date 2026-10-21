import type { Box, EditPath } from './path-model';

/*
 * Contract: path booleans. Version 1.0.0.
 *
 * Combine (union), subtract, intersect and exclude for closed outlines. One implementation shared by the
 * SVG editor and the shape editor.
 *
 * Implementation: module `path-booleans`, folder src/path-booleans/, lazy chunk PATH_BOOLEANS_CHUNK_FILE
 * (webpackChunkName PATH_BOOLEANS_CHUNK). Own code, no dependency (no polygon-clipping library).
 * Loaded with import() through src/path-booleans/loader.ts by the svg-editor and
 * shape-editor chunks, on the FIRST press of a boolean button, never when an editor opens, never by
 * magic-card.js or the card-editor chunk. Loader: memoised, 8 s timeout, retried on the next call after a
 * failure (same as the path-canvas loader); the button shows busy while it loads and a failure shows
 * "Couldn't load the shape tools. Try again." with nothing changed.
 * Imports: this contract, src/contracts/path-model.ts types and src/path/core.ts (already in magic-card.js,
 * so not copied). NOT src/path/edit.ts, draw.ts or tidy.ts (they live in the path-canvas chunk and would be
 * copied), nothing from src/svg-editor/, src/shape-editor/, src/path-canvas/, src/anim-studio/, lit
 * (import scan test). Size: CAPS entry = measured + 5 %, rounded up to 1 KiB, never above
 * PATH_BOOLEANS_CEILING_BYTES (16 KiB).
 *
 * ── Semantics ──
 * - Input: operands in drawing order. Each operand is the AREA of its closed subpaths under its own fill
 *   rule. Open subpaths have no area: they are ignored and counted in `skippedOpen`. Stroke width is
 *   ignored (stroke to path is not in scope); a closed stroked-only layer counts as the area inside it.
 * - union: everything covered by any operand (one operand with several overlapping subpaths is valid:
 *   "merge to one path").
 * - subtract: operands[0] minus the union of all the others (bottom-most minus the rest, as Inkscape and
 *   Figma do; the host passes the bottom-most first).
 * - intersect: area covered by every operand.
 * - exclude: area covered by an odd number of operands.
 *
 * ── Geometry ──
 * 1. Flatten every closed subpath adaptively: a cubic is split until its control points lie within
 *    `tolerance` of the chord (default frame longest side / FLATTEN_DIVISOR: 0.01 at 24 x 24, 0.15 px on a
 *    360 px shape editor frame), at most MAX_PIECES_PER_CUBIC pieces per cubic. Every flattened vertex
 *    keeps its provenance: operand, subpath, segment index and t.
 * 2. Snap vertices to a grid of tolerance / 8, split every edge at every crossing (sweep by x, not all
 *    pairs), merge coincident edges into one edge that carries both operands' winding.
 * 3. Classify each edge by the winding of each operand on its left and right side (each operand's fill
 *    rule), keep the edges where the result's inside differs between the two sides, chain them into rings.
 * 4. Clean up: drop rings with an area under frame area x MIN_RING_AREA_RATIO (slivers), remove collinear
 *    middle points within tolerance.
 * 5. Curves: NO re-fitting. A run of output vertices that comes from one source segment becomes that
 *    segment's exact sub-curve between its first and last t (splitCubic from core.ts); straight source
 *    segments stay straight; a new vertex at a crossing is a 'corner' anchor; a surviving source anchor
 *    keeps its kind. Where provenance is lost (overlapping collinear edges after the merge) the result
 *    keeps straight pieces. So an untouched part of an outline comes back with its own anchors, and
 *    only crossings add anchors.
 * 6. Orientation: outer rings clockwise in frame coordinates (y down), holes counter-clockwise, so the
 *    result draws the same under nonzero and evenodd. Hosts set fillRule 'nonzero' on the result.
 * Anchor counts are not capped here: a result subpath over MAX_ANCHORS stays editable (path-model 1.0.0,
 * the SVG editor shows W10); the shape editor applies MAX_SHAPE_POINTS itself (svg-editor contract).
 *
 * Limits: more than MAX_BOOLEAN_EDGES flattened edges in total returns { ok: false, reason: 'too-complex' }
 * before any work (a pasted 32 KB icon can not freeze the page). Budget: two 100-anchor icon outlines
 * take at most 100 ms on the 4x throttled CPU profile; run synchronously (no worker), no timers, no DOM.
 * Pure function: same input, same output (no Date, no Math.random), so undo and tests are stable.
 *
 * Contract tests (tests/path-booleans.contract.test.ts): the four ops on two overlapping squares
 * (areas exact within tolerance); circle minus circle keeps curves (anchor count of the untouched arc is
 * the source's, sub-curves within tolerance of the source); identical operands; shared edge; touching
 * vertex; collinear overlap; tangent circles; ring with a hole under nonzero and under evenodd; disjoint
 * union gives two pieces; exclude of nested squares gives a hole; open subpath counted in skippedOpen;
 * empty intersect gives reason 'empty'; MAX_BOOLEAN_EDGES + 1 gives 'too-complex' in under 5 ms;
 * orientation rule; determinism (same input twice, deep-equal output); union of each of the 192 library
 * icons' own subpaths keeps its drawn area within 0.5 % (sampled 64 x 64); timing on the throttled profile;
 * import scan; size under the ceiling.
 */

export const PATH_BOOLEANS_CONTRACT_VERSION = '1.0.0';
export const PATH_BOOLEANS_CONTRACT_REVISION = 1;
export const PATH_BOOLEANS_CHUNK = 'svg-booleans';
export const PATH_BOOLEANS_CHUNK_FILE = 'magic-card-svg-booleans.js';
/** 16 KiB; the CAPS entry is measured + 5 % below it. */
export const PATH_BOOLEANS_CEILING_BYTES = 16_384;
/** Default flatten tolerance = longest frame side / this. */
export const FLATTEN_DIVISOR = 2400;
export const MAX_PIECES_PER_CUBIC = 64;
/** Total flattened edges over all operands. */
export const MAX_BOOLEAN_EDGES = 20_000;
/** Rings smaller than frame area x this are dropped as slivers. */
export const MIN_RING_AREA_RATIO = 1e-6;

export type BooleanOp = 'union' | 'subtract' | 'intersect' | 'exclude';
export const BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];

export interface BooleanOperand {
  /** Closed subpaths make the area; open ones are skipped. Frame units. */
  paths: EditPath[];
  fillRule: 'nonzero' | 'evenodd';
}

export interface BooleanOptions {
  /** The editor's frame (24 x 24 viewBox, or the shape editor's Edit-at box in px). */
  frame: Box;
  /** Flatten tolerance in frame units. Default: longest frame side / FLATTEN_DIVISOR. */
  tolerance?: number;
}

/** One connected piece of the result: an outer ring and the holes inside it. */
export interface BooleanPiece {
  /** Index into `paths`. */
  outer: number;
  holes: number[];
  /** Area of the piece (outer minus holes), frame units squared. */
  area: number;
}

export type BooleanResult =
  | {
      ok: true;
      /** Closed subpaths, outer rings clockwise, holes counter-clockwise. */
      paths: EditPath[];
      /** Largest area first. */
      pieces: BooleanPiece[];
      skippedOpen: number;
    }
  | {
      ok: false;
      /** 'empty': no area left; 'no-area': fewer than the op needs have any closed area; 'too-complex': MAX_BOOLEAN_EDGES. */
      reason: 'empty' | 'no-area' | 'too-complex';
      skippedOpen: number;
    };

/** The shape editor's rule (card shapes are one closed outline, holes are a Won't). */
export interface SingleOutline {
  /** The outer ring of the largest piece. */
  path: EditPath;
  /** Other pieces left out. */
  droppedPieces: number;
  /** Holes of the kept piece that were filled. */
  filledHoles: number;
}

/** What `import()` of the chunk resolves to. */
export interface PathBooleansChunk {
  PATH_BOOLEANS_CONTRACT_VERSION: string;
  /** union / intersect / exclude need 1+ operands with area (union of one merges its subpaths); subtract needs 2+. */
  run(op: BooleanOp, operands: BooleanOperand[], o: BooleanOptions): BooleanResult;
  /** Largest piece's outer ring; counts what was dropped. */
  singleOutline(r: Extract<BooleanResult, { ok: true }>): SingleOutline;
}
