/*
 * Contract: path model. Version 1.0.0 (Architect-owned). ADR 0017, ADR 0020.
 * Revision 2 (2026-10-18, before any implementation): MAX_ANCHORS limits adding only; imported
 * paths of any anchor count load and stay editable (design W10).
 * Revision 3 (2026-10-18, CEO decisions after the hands-on demo, ADR 0025; nothing shipped, so in
 * place): PathDraw is written down (it was only named) and gains `primitive()` with PRIMITIVE_KINDS
 * (rounded rectangle, arrow, heart, speech bubble, ticket, tab, leaf, ...), used by the SVG editor's
 * Shapes tool and the shape editor's starter outlines. draw.ts is now reached by both editors through
 * the path-canvas chunk (path-canvas revision 4). PathEdit lists `toggleSmooth` (T10 found it missing;
 * edit.ts already exports it).
 *
 * One path model for the whole product. It replaces three private copies:
 * - src/icons/path-math.ts      (parser for every SVG command, arcs to cubics, resample, morph)
 * - src/utils/shape-outline.ts  (M/L/C outline: restart, reverse, translate, flatten, polygon())
 * - src/anim-studio/editors/path-utils.ts (anchor/handle edit model)
 *
 * Implementation: module `path-model`, folder src/path/:
 * - src/path/core.ts  RUNTIME-SAFE. Pure, no DOM, no lit. The only part magic-card.js may import.
 *                     Everything in PathCore below.
 * - src/path/edit.ts  EDITOR-ONLY. Anchor model and edit operations (PathEdit below). Never in the
 *                     src/index.ts static graph (contract test: the built magic-card.js holds none of
 *                     its exported names' unique strings; see path-model.contract.test.ts).
 * - src/path/tidy.ts  EDITOR-ONLY. Export rounding and clean-up (PathTidy below).
 * - src/path/draw.ts  EDITOR-ONLY. Pure generators for draw tools (rect, ellipse, polygon, star,
 *                     freehand fit, primitives; PathDraw below). Shared by the SVG editor and the
 *                     shape editor (both through the path-canvas chunk's `pathDraw`, revision 3) and
 *                     the animation studio (its own bundle, static import).
 *
 * Migration rules (the merge must not grow magic-card.js; target is a net saving because the
 * second parser in shape-outline.ts goes away):
 * - path-math.ts and shape-outline.ts become thin re-export shims of core.ts for one release, then
 *   are deleted. path-utils.ts becomes a re-export shim of edit.ts. Callers move in the same PR when
 *   it is cheap; shims keep the rest compiling.
 * - Output strings of every existing runtime caller stay byte-identical: shapePath, shapeRingPath,
 *   shapeInsetPath, outlinePolygon, cubicsToPath, interpolate, sanitizeSvg markup. Golden test over
 *   all 9 presets x 3 sizes, the ring/inset paths, and the 192 library icons (before/after).
 * - Point type is the tuple Pt = [x, y] everywhere. shape-path.ts may keep its private {x, y} type
 *   internally; it converts at the boundary.
 *
 * Anchor limit (MAX_ANCHORS per subpath) limits ADDING only:
 * - toEdit, moveAnchor, setHandle, setKind, remove, reverse, translate, transform and fromEdit
 *   accept any anchor count. The only bound on an imported path is its source size (an icon's
 *   ICON_MAX_BYTES, mcu-library 1.0.0).
 * - insertAt and append on a subpath that already has MAX_ANCHORS or more return the path unchanged
 *   with index -1. canAdd() tells the canvas and the tools beforehand (design W10).
 * - The animation studio keeps its own cap behaviour through the path-utils shim (unchanged).
 *
 * Primitives (revision 3):
 * - primitive(kind, box) returns ONE closed subpath inside `box`, clockwise (y down), at most
 *   PRIMITIVE_MAX_ANCHORS anchors, so every kind is also a valid card shape outline (custom-shape
 *   MAX_SHAPE_POINTS 64) and a valid boolean operand. Only straight sides and cubics, no arcs.
 * - Proportions are fixed per kind and scale with the box (rounded-rect radius = 20 % of the shorter
 *   side; speech bubble tail at the bottom left, 20 % of the height; arrow points right, head 40 % of
 *   the width). Not parametric after insertion: the result is a plain editable path. The rect tool
 *   keeps its own radius field.
 * - Existing generators (rectPath, ellipsePath, polygonPath, starPath, linePath, fitFreehand,
 *   fitCubics, rdp) keep their output strings byte-identical (golden test; the studio uses them).
 *
 * Numbers: 2 decimals in every serialised string (fmt), -0 written as 0. Editors may ask tidy for 1.
 */

export const PATH_MODEL_CONTRACT_VERSION = '1.0.0';
export const PATH_MODEL_CONTRACT_REVISION = 3;

export type Pt = [number, number];
/** start, c1, c2, end (morph and math code). */
export type Cubic = [Pt, Pt, Pt, Pt];

/** One piece: a straight line to `to`, or a cubic through c1, c2 to `to`. Lines stay lines. */
export interface Seg {
  to: Pt;
  c1?: Pt;
  c2?: Pt;
}

/** One subpath. Closed: the last seg ends on `start` (a closing line is stored, written as Z). */
export interface SubPath {
  start: Pt;
  segs: Seg[];
  closed: boolean;
}

/** A whole path: the subpaths in drawing order. */
export type PathData = SubPath[];

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Runtime-safe API (src/path/core.ts). */
export interface PathCore {
  /** Any SVG path string (M L H V C S Q T A Z, abs and rel). Arcs and quadratics become cubics. Invalid: []. */
  parsePath(d: string): PathData;
  /** Absolute M / L / C / Z with 2-decimal numbers. Same string the old outlinePath / cubicsToPath wrote. */
  toPathString(p: PathData): string;
  /** Cubic form (lines as degenerate cubics), for morph code. Replaces toCubicSubpaths. */
  toCubics(p: PathData): Cubic[][];
  fromCubics(c: Cubic[][], closed?: boolean): PathData;
  /** Points along one subpath, `steps` per cubic, start once, no duplicate end on closed paths. */
  flatten(s: SubPath, steps?: number): Pt[];
  /** CSS polygon() in px of one closed subpath (clip-path fallback). */
  polygonCss(s: SubPath, steps?: number): string;
  translate(s: SubPath, dx: number, dy: number): SubPath;
  reverse(s: SubPath): SubPath;
  /** Same closed outline starting at its point nearest `p`. */
  restartAt(s: SubPath, p: Pt): SubPath;
  /** Nearest point on a subpath: piece index, t, the point and its distance. */
  nearest(s: SubPath, p: Pt): { seg: number; t: number; point: Pt; dist: number };
  splitSeg(from: Pt, s: Seg, t: number): [Seg, Seg];
  bounds(p: PathData): Box | undefined;
  /** Resample one subpath to `count` cubics (morph); matchShapes / interpolate keep their old contract. */
  resample(c: Cubic[], count: number): Cubic[];
}

// ── editor-only: anchor model (src/path/edit.ts) ──

/** Node type, as in Penpot / Inkscape. */
export type AnchorKind = 'corner' | 'smooth' | 'symmetric';

/**
 * An anchor in absolute units of its frame. `in` / `out` are handle positions (absolute), absent
 * for a straight side. The kind rules how setHandle moves the opposite handle: corner = free,
 * smooth = same direction, own length, symmetric = mirrored.
 */
export interface Anchor {
  x: number;
  y: number;
  in?: Pt;
  out?: Pt;
  kind?: AnchorKind;
}

export interface EditPath {
  anchors: Anchor[];
  closed: boolean;
}

/** Most anchors a subpath can GROW to (adding stops here). Imported paths may hold more. */
export const MAX_ANCHORS = 100;

export interface PathEdit {
  toEdit(s: SubPath): EditPath;
  fromEdit(p: EditPath): SubPath;
  /** False when p has MAX_ANCHORS or more anchors. */
  canAdd(p: EditPath): boolean;
  /** At the cap: p unchanged, index -1. */
  insertAt(p: EditPath, seg: number, t: number): { path: EditPath; index: number };
  /** At the cap: p unchanged, index -1. */
  append(p: EditPath, q: Pt, atStart?: boolean): { path: EditPath; index: number };
  remove(p: EditPath, i: number): EditPath;
  moveAnchor(p: EditPath, i: number, x: number, y: number): EditPath;
  setHandle(p: EditPath, i: number, which: 'in' | 'out', q: Pt): EditPath;
  setKind(p: EditPath, i: number, kind: AnchorKind): EditPath;
  /** Revision 3: corner -> smooth with automatic handles, smooth -> corner without handles. */
  toggleSmooth(p: EditPath, i: number): EditPath;
  setClosed(p: EditPath, closed: boolean): EditPath;
  reverse(p: EditPath): EditPath;
  translate(p: EditPath, dx: number, dy: number): EditPath;
  /** Scale / rotate / flip around a pivot (2x3 matrix). */
  transform(p: EditPath, m: [number, number, number, number, number, number]): EditPath;
  bounds(p: EditPath): Box | undefined;
}

// ── editor-only: tidy (src/path/tidy.ts) ──

export interface TidyOptions {
  /** Decimals; default 2, 1 when the viewBox is 24 x 24 or smaller. */
  decimals?: number;
  /** Relative commands when shorter. Default true. */
  relative?: boolean;
  /** Drop zero-length pieces and empty subpaths. Default true. */
  dropEmpty?: boolean;
}

export interface PathTidy {
  tidyPath(p: PathData, o?: TidyOptions): string;
}

// ── editor-only: draw generators (src/path/draw.ts), revision 3 ──

/** Shapes offered by the SVG editor's Shapes tool and as the shape editor's starter outlines (additive: circle, ellipse, semicircle, star and hexagon joined the first 14). */
export const PRIMITIVE_KINDS = [
  'rounded-rect',
  'triangle',
  'arrow',
  'chevron',
  'plus',
  'heart',
  'speech-bubble',
  'drop',
  'leaf',
  'shield',
  'cloud',
  'ticket',
  'tab',
  'tag',
  'circle',
  'ellipse',
  'semicircle',
  'star',
  'hexagon',
] as const;
export type PrimitiveKind = (typeof PRIMITIVE_KINDS)[number];
export const PRIMITIVE_MAX_ANCHORS = 24;

export interface FreehandFit {
  d: string;
  segments: number;
  closed: boolean;
}

export interface PathDraw {
  rectPath(x: number, y: number, w: number, h: number, radius: number): string;
  ellipsePath(cx: number, cy: number, rx: number, ry: number): string;
  linePath(a: Pt, b: Pt): string;
  polygonPath(cx: number, cy: number, r: number, sides: number, rotation?: number): string;
  starPath(cx: number, cy: number, outer: number, inner: number, points: number, rotation?: number, plain?: boolean): string;
  fitFreehand(points: Pt[], tolerance: number): FreehandFit;
  fitCubics(points: Pt[], tolerance: number): Cubic[];
  rdp(points: Pt[], tolerance: number): Pt[];
  /** One closed clockwise subpath filling `box`, at most PRIMITIVE_MAX_ANCHORS anchors. */
  primitive(kind: PrimitiveKind, box: Box): EditPath;
}
