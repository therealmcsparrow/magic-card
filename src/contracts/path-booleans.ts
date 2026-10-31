import type { Box, EditPath } from './path-model';

/**
 * Contract: path booleans. Version 1.0.0. Combine (union), subtract, intersect and exclude for closed outlines.
 * One implementation shared by the SVG editor and the shape editor. Implementation: module `path-booleans`, folder
 * src/path-booleans/, lazy chunk PATH_BOOLEANS_CHUNK_FILE (webpackChunkName PATH_BOOLEANS_CHUNK).
 */

export const PATH_BOOLEANS_CONTRACT_VERSION = '1.0.0';
export const PATH_BOOLEANS_CONTRACT_REVISION = 2;
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
