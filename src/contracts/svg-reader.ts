// Contract: sanitised SVG markup to editable shapes. Version 1.0.0 (SVG_READER_CONTRACT). One reader for the SVG
// editor (icon and image editing) and the animation studio's Draw import.

export const SVG_READER_CONTRACT = '1.0.0';

/** Same number as svg-image IMAGE_MAX_NODES: no sanitised drawing holds more shapes. */
export const READ_MAX_SHAPES = 10_000;
/** Summed path data of one read, in characters (1 MiB). */
export const READ_MAX_PATH_CHARS = 1024 * 1024;

/** Affine matrix [a, b, c, d, e, f] in SVG order. */
export type Matrix = [number, number, number, number, number, number];

declare const SANITISED: unique symbol;
/** Markup returned by sanitizeSvg. */
export type SanitisedIconMarkup = string & { readonly [SANITISED]: 'icon' };
/** Markup returned by sanitizeImage. */
export type SanitisedImageMarkup = string & { readonly [SANITISED]: 'image' };
export type SanitisedMarkup = SanitisedIconMarkup | SanitisedImageMarkup;

export interface ReadGroup {
  /** Index of the enclosing group in `groups`; absent = top level. */
  parent?: number;
  /** The element's id when it had one. */
  id?: string;
}

export interface ReadShape {
  /** Source element local name. */
  from: 'path' | 'circle' | 'ellipse' | 'rect' | 'line' | 'polyline' | 'polygon';
  /** Outline with every transform applied. */
  d: string;
  /** Raw paint values after inheritance (undefined = not set anywhere up the tree). */
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cap?: string;
  join?: string;
  evenodd?: boolean;
  /** Product of opacity values up the tree, 0..1, when any was set. */
  opacity?: number;
  /** Inside an element with class mc-accent. */
  accent?: boolean;
  /** Innermost group (index in `groups`). */
  group?: number;
  id?: string;
}

export interface ReadNotes {
  /** A transform was flattened into the outlines. */
  transforms: boolean;
  /** A paint the target model cannot hold was replaced. */
  colours: boolean;
  /** An opacity was dropped or folded. */
  opacity: boolean;
  /** Groups deeper than the cap were merged. */
  mergedGroups: boolean;
}

export interface ReadOptions {
  viewBox: string;
  keepGroups: boolean;
  maxShapes?: number;
  maxPathChars?: number;
  /** Applied to every outline after its own transforms (a caller's fit into its own box). */
  matrix?: Matrix;
  paint?: (raw: string) => string | undefined;
  each?: (el: Element, shape: ReadShape) => ReadShape;
}

export type ReadResult =
  | { ok: true; shapes: ReadShape[]; groups: ReadGroup[]; viewBox: string; notes: ReadNotes }
  | { ok: false; error: 'not_svg' | 'empty' | 'too_many' | 'too_detailed' };

/** What src/svg-io/read.ts exports. */
export type ReadShapes = (markup: SanitisedMarkup, opts: ReadOptions) => ReadResult;
