/*
 * Contract: sanitised SVG markup to editable shapes. Version 1.0.0 (SVG_READER_CONTRACT).
 * One reader for the SVG editor (icon and image editing) and the animation studio's Draw import. It replaces the
 * walk in src/svg-editor/import.ts readMarkup and src/anim-studio/svg-export.ts importSvgFile; each caller maps the
 * neutral ReadShape list onto its own model.
 *
 * ── Module ──
 * src/svg-io/read.ts. Stateless (no module-level state, so its copies in several chunks hold none), no element, no
 * template, no unsafeSVG, no Blob: not an SVG sink. It value-imports the geometry module and src/path/core.ts, never
 * a sanitiser and never src/svg-safety/**.
 *
 * ── Input: sanitiser output only ──
 * readShapes takes SanitisedIconMarkup or SanitisedImageMarkup. The brands are set inside the two sanitisers only
 * (src/icons/svg-sanitize.ts types SanitizedSvg.markup as SanitisedIconMarkup; src/svg-image/sanitize.ts types svg-image
 * SanitizedImage.markup as SanitisedImageMarkup). No cast to a brand anywhere else; tests get branded text by calling
 * a sanitiser. File or clipboard text never reaches the reader without the sanitiser in the same code path. The
 * reader parses the markup into an inert XML document (DOMParser, image/svg+xml) and does not rewrite it; shapes go
 * back through the sanitiser on save and export.
 *
 * ── Output ──
 * One ReadShape per drawn shape (path, circle, ellipse, rect, line, polyline, polygon), in paint order, outlines as
 * path data with every transform up the tree applied (then `opts.matrix`). Shapes inside defs, clipPath, mask and
 * gradients are not drawn and not read. With keepGroups, every <g> becomes a ReadGroup up to MAX_GROUP_DEPTH (svg-editor)
 * and deeper content goes into the last level (notes.mergedGroups); without it the tree is flattened. Paint, stroke
 * width, caps, joins, fill rule, opacity and the mc-accent class are read as svg-editor import reads them today;
 * opts.paint lets the image editor map a paint value the icon model does not hold (gradients, theme colours) and
 * opts.each lets a caller add its own fields per element (text, locked parts). Same shapes as today's readMarkup and
 * importSvgFile on the corpus (gallery icons, library images, hostile files after sanitising).
 * Limits, checked before the work they bound: the shape count before each shape is converted (over maxShapes ->
 * 'too_many'); the summed path data length after each shape (over maxPathChars -> 'too_detailed', the read stops
 * there). Defaults READ_MAX_SHAPES and READ_MAX_PATH_CHARS; a caller may pass lower numbers, never higher.
 * Errors: 'not_svg' (no root svg), 'empty' (nothing drawable), 'too_many', 'too_detailed'. Codes only; callers word
 * them in their own namespace. A refused read changes nothing in the caller's document.
 *
 * ── Geometry ──
 * Matrix, multiply, parseTransform, transformPath and shapePath live in src/icons/svg-geometry.ts: pure maths on
 * strings and on attribute reads of an Element passed in, no DOM at load, no state, no value import of a sanitiser,
 * not an SVG sink. svg-sanitize imports them from there and does not re-export them; the reader, svg-editor and the
 * studio import them from svg-geometry. Geometry is not a value rule, so it stays out of src/svg-safety/ (svg-safety
 * 1.0.0). The icon sanitiser's output is byte-identical to the golden corpus. svg-geometry's Matrix is the type below.
 *
 * ── The studio's Draw import ──
 * importSvgFile (src/anim-studio/svg-export.ts) keeps its signature and reads through readShapes; its own walk, paint
 * inheritance and per-element matrix code go. Order: sanitizeSvg(text, { css }) first (refusal: its error, as today),
 * then readShapes(markup, opts) with
 * - viewBox: the target viewBox, keepGroups: false (a rig shape list is flat);
 * - matrix: the uniform centred fit as one matrix, [k, 0, 0, k, dx, dy] from draw-utils viewBoxMap(sanitised viewBox,
 *   target viewBox). ReadShape.strokeWidth already carries every matrix, so the widths of stroked shapes come out
 *   fitted;
 * - maxShapes: `room` (the shapes that still fit), maxPathChars: room x ANIMATION_CAPS.pathLength, at most
 *   READ_MAX_PATH_CHARS;
 * - no `paint` or `each` hook: the studio maps paint afterwards.
 * Per ReadShape the studio then does what it does today: fill and stroke through its importPaint (safe colours kept,
 * the rest currentColor), `line` unfilled, an unpainted or flat shape drawn as a hairline stroke, the stroke width
 * rounded to 3 decimals, cap kept, the outline rounded to the studio's precision (draw-utils mapD with the identity),
 * the element id kept when it is a free PART_ID_RE id, else the next `shape-<n>`, and a shape over
 * ANIMATION_CAPS.pathLength refused. Fill rule, joins, opacity, accent and groups are not kept: a rig shape holds none
 * of them, as today.
 * Hairline width: max(k, 0.05), k the fit scale of `matrix`. It is not ReadShape.strokeWidth, which carries an
 * inherited stroke-width the shape does not paint (a stroke="none" rect under stroke-width="2" would come out 2 wide),
 * and it leaves out the shape's own transforms: a hairline inside a group that scales is k wide, where the walk this
 * replaces also applied the group's scale. ReadShape has no field for a shape's own scale and needs none: a hairline
 * only makes a shape that paints nothing visible, it carries no width from the file.
 * Error texts: 'not_svg' "No <svg> element found.", 'empty' "The SVG has no shapes to draw.",
 * 'too_detailed' and a long shape "A shape in the SVG is too detailed (over 8192 characters of path data).",
 * 'too_many' "The SVG has too many shapes; at most {room} fit." (the reader stops at the cap, so the count is gone).
 * The corpus test (tests/studio-import-corpus.test.ts) compares importSvgFile with a golden written from the walk it
 * replaces (tests/fixtures/studio-import-golden.json): same ids, names, paint and stroke widths, outlines equal within
 * 0.001 units. No corpus file holds an unpainted or flat shape inside a scaling transform, the one case where a width
 * differs from that walk.
 */

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
