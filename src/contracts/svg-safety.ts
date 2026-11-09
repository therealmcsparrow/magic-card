// Contract: SVG value rules shared by the two sanitisers. Version 1.3.0 (SVG_SAFETY_CONTRACT). One set of value
// rules behind src/icons/svg-sanitize.ts (own icons) and src/svg-image/sanitize.ts (library images). The
// allow-lists stay two: each sanitiser passes its own policy, and the rules only read it.

export const SVG_SAFETY_CONTRACT = '1.3.0';

/**
 * The one SMIL a library image keeps: an editor-written path morph. Element `animate` in the SVG namespace with no
 * prefix (exact, case-sensitive local name), a direct child of `<path>` with no child nodes, at most one per path,
 * and its id named by a checked animation's `morphs[].smil`. Import (upload, paste, transfer) keeps no SMIL.
 */
export const MORPH_ELEMENT = 'animate';
export const MORPH_PARENT = 'path';
/** Every attribute it may carry: no namespace, exact case; any other attribute (href, from, to, by included) is a miss. */
export const MORPH_ATTRIBUTES = ['id', 'attributeName', 'values', 'dur', 'repeatCount', 'keyTimes', 'keySplines', 'calcMode', 'fill', 'begin'] as const;
export type MorphAttribute = (typeof MORPH_ATTRIBUTES)[number];
/** Attributes that must be present, with the one value each may hold. */
export const MORPH_FIXED = { attributeName: 'd', begin: 'indefinite' } as const;
export const MORPH_REQUIRED: readonly MorphAttribute[] = ['id', 'attributeName', 'values', 'dur', 'begin'];
export const MORPH_CALC_MODES = ['linear', 'spline'] as const;
export const MORPH_FILLS = ['freeze', 'remove'] as const;
/** `dur`: a clock value in seconds or milliseconds. */
export const MORPH_DUR_RE = /^(?:\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})(?:s|ms)$/;
/** `repeatCount`: a positive number or indefinite. */
export const MORPH_REPEAT_RE = /^(?:indefinite|\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})$/;
/** keyTimes and keySplines: numbers, spaces and `;`; counts and ranges are checked after splitting. */
export const MORPH_NUMBER_LIST_RE = /^[0-9. ;]+$/;
/** Each `;`-separated frame of `values`: the image-animation path-data allow-list (MORPH_PATH_DATA_RE). */
export const MORPH_VALUES_SEPARATOR = ';';
/** SMIL elements never kept, whatever the policy. */
export const SMIL_NEVER: readonly string[] = ['set', 'animateMotion', 'animateTransform', 'discard'];

/** The morph rule as a sanitiser option: the `<animate>` ids that may stay. Absent or empty: every SMIL element goes. */
export interface SvgMorphOption {
  morphIds?: ReadonlySet<string>;
}

/**
 * Why a morph `<animate>` failed; the card strips it and lists `animate`, Utils refuses the save naming it. `counts`:
 * keyTimes not one per frame from 0 to 1, or with spline not one keySpline of four 0..1 numbers per segment.
 * `frames`: `values` differs from its morph's frames `d`, or the frames differ in command structure.
 */
export type MorphMiss = 'namespace' | 'parent' | 'children' | 'second' | 'attribute' | 'value' | 'unnamed' | 'counts' | 'frames';

/**
 * The only files that may call loadSvgCss (value-import src/svg-safety/css-loader.ts): the places where a user opens
 * or imports an SVG into an editor or a library (the transfer panel, for an SVG text read as an icon or an image).
 * Adding a file here is a change to this contract.
 */
export const SVG_CSS_OPEN_SITES: readonly string[] = [
  'src/svg-editor/mc-svg-editor.ts',
  'src/image-editor/chunk.ts',
  'src/anim-studio/editors/draw-svg-dialog.ts',
  'src/transfer/panel.ts',
];

/** How long one loadSvgCss call waits for the svg-css chunk before it resolves undefined. */
export const SVG_CSS_LOAD_TIMEOUT_MS = 10_000;

/** How an attribute value is checked. `value` is the icon rule for any other drawing attribute. */
export type SvgValueKind =
  | 'paint'
  | 'transform'
  | 'reference'
  | 'id'
  | 'class'
  | 'length'
  | 'numbers'
  | 'path'
  | 'points'
  | 'keyword'
  | 'font'
  | 'data-name'
  | 'value';

export interface SvgWalkLimits {
  maxNodes: number;
  maxDepth: number;
}

/** The CSS properties the resolver may turn into the presentation attribute of the same name. */
export type SvgCssProperty =
  | 'fill'
  | 'stroke'
  | 'stop-color'
  | 'opacity'
  | 'fill-opacity'
  | 'stroke-opacity'
  | 'stop-opacity'
  | 'stroke-width'
  | 'stroke-miterlimit'
  | 'stroke-dashoffset'
  | 'stroke-dasharray'
  | 'stroke-linecap'
  | 'stroke-linejoin'
  | 'fill-rule'
  | 'clip-rule'
  | 'paint-order'
  | 'vector-effect';

/** How a CSS declaration value is checked. */
export type SvgCssValueKind =
  | 'paint'
  | 'stop-paint'
  | 'alpha'
  | 'width'
  | 'miterlimit'
  | 'offset'
  | 'dasharray'
  | 'keyword'
  | 'paint-order';

export interface SvgCssPropertyRule {
  readonly kind: SvgCssValueKind;
  /** For kind `keyword`: the allowed values, lower-case except where CSS spells them otherwise. */
  readonly keywords?: readonly string[];
}

/**
 * The property table, one frozen object shared by both policies: fill, stroke: paint | stop-color: stop-paint |
 * opacity, fill-opacity, stroke-opacity, stop-opacity: alpha | stroke-width: width | stroke-miterlimit: miterlimit
 * | stroke-dashoffset: offset | stroke-dasharray: dasharray | stroke-linecap: keyword butt, round, square |.
 */
export type SvgCssTable = Readonly<Record<SvgCssProperty, SvgCssPropertyRule>>;

/** Resolver caps; the numbers are part of the contract. */
export interface SvgCssLimits {
  readonly maxStyleAttrChars: 2000;
  readonly maxStyleBlocks: 16;
  readonly maxCssChars: 32768;
  readonly maxRules: 512;
  readonly maxDeclarations: 64;
  readonly maxSelectors: 32;
  readonly maxClassTokens: 32;
  readonly maxBracketDepth: 8;
  readonly maxPaintChars: 200;
  readonly maxValueChars: 64;
  readonly maxDashValues: 32;
  readonly maxColourFunctionDepth: 2;
  readonly maxHrefHops: 8;
  readonly maxStopsPerGradient: 256;
  readonly maxStopClones: 1024;
}

export interface SvgCssPolicy {
  readonly properties: SvgCssTable;
  readonly limits: SvgCssLimits;
  /** Most bytes the resolver may write (icon: svg-sanitize SVG_MAX_BYTES; image: svg-image IMAGE_MAX_BYTES). */
  readonly maxWrittenBytes: number;
}

/** What resolveCss reports. `dropped` holds the listing names (`style`, `<element>@style`, a gradient's href name). */
export type SvgCssOutcome = { status: 'ok'; dropped: readonly string[] } | { status: 'too_complex' };

export interface SvgPolicy {
  readonly name: 'icon' | 'image';
  /** Element local names kept (canonical case). */
  readonly elements: readonly string[];
  /** Attribute name -> how its value is checked; a name not listed is dropped unless `fallback` is set. */
  readonly kinds: Readonly<Record<string, SvgValueKind>>;
  /** The kind of a listed element attribute without an entry in `kinds` (icon: 'value'; image: none). */
  readonly fallback?: SvgValueKind;
  /** Function names a paint (and, for the icon, any `value`) may call, lower-case. */
  readonly colourFunctions: readonly string[];
  /** Function names a transform list may hold, lower-case. */
  readonly transformFunctions: readonly string[];
  /** Paint may be var(--name) or var(--name, #hex) with the name per THEME_VAR_NAME_RE (image only). */
  readonly paintVar: boolean;
  /** Most functions in one transform list; undefined = no cap of its own. */
  readonly maxTransformFunctions?: number;
  /** Longest value checked, and longest paint; longer is dropped. */
  readonly maxValueChars?: number;
  readonly maxPaintChars?: number;
  /** Deny tokens on top of the shared set, lower-case. */
  readonly denyExtra: readonly string[];
  readonly limits: SvgWalkLimits;
  /** CSS paint resolver data. */
  readonly css: SvgCssPolicy;
}

export type SvgParse = { root: Element; via: 'xml' | 'html'; doc: Document } | undefined;

/** What src/svg-safety/index.ts exports. */
export interface SvgSafety {
  denied(value: string, policy: SvgPolicy): boolean;
  onlyFunctions(value: string, allowed: readonly string[]): boolean;
  cleanValue(kind: SvgValueKind, value: string, policy: SvgPolicy): string | undefined;
  withinLimits(root: Element, limits: SvgWalkLimits): 'ok' | 'too_complex';
  parseLenient(text: string): SvgParse;
  /** Changes `root` in place. */
  resolveCss(root: Element, policy: SvgPolicy): SvgCssOutcome;
  byteLength(text: string): number;
  escapeText(s: string): string;
  escapeAttr(s: string): string;
}

/** The resolver as a value: what loadSvgCss hands an open site and the site passes to a sanitiser as `css`. */
export type SvgCssResolve = (root: Element, policy: SvgPolicy) => SvgCssOutcome;

/** The resolver option of a sanitiser call (icon: sanitizeSvg's second argument; image: part of svg-image SanitizeOptions). */
export interface SvgCssOption {
  /** Only from an open site; absent: styles are dropped and listed. */
  css?: SvgCssResolve;
}

/** What src/svg-safety/css-chunk.ts (dist/magic-card-svg-css.js) exports. */
export interface SvgCssChunk {
  /** The build define of the build that made this chunk. */
  readonly BUILD: string;
  readonly resolveCss: SvgCssResolve;
}

/** src/svg-safety/css-loader.ts loadSvgCss: never rejects; undefined on failure, timeout or another build. */
export type LoadSvgCss = () => Promise<SvgCssResolve | undefined>;
