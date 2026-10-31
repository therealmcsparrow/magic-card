// Contract: path model. Version 1.0.0. MAX_ANCHORS limits adding only; imported paths of any anchor count load and
// stay editable.

export const PATH_MODEL_CONTRACT_VERSION = '1.0.0';
export const PATH_MODEL_CONTRACT_REVISION = 5;

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
  /** Corner -> smooth with automatic handles, smooth -> corner without handles. */
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

// ── editor-only: draw generators (src/path/draw.ts) ──

/** Shapes offered by the SVG editor's Shapes tool and as the shape editor's starter outlines. Circle, ellipse, semicircle, star and hexagon are the last five of 19. */
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
