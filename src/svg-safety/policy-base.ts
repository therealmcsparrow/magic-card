import type { SvgCssLimits, SvgCssPolicy, SvgCssTable } from '../contracts/svg-safety';

/* What both policies share: the function lists, the CSS property table with its caps, and a deep freeze. Data only. */

/** Freezes a value and everything it holds, so no copy of a policy can be changed after load. */
export const freeze = <T>(v: T): Readonly<T> => {
  if (v && typeof v === 'object') {
    for (const inner of Object.values(v)) freeze(inner);
    Object.freeze(v);
  }
  return v;
};

export const COLOUR_FUNCTIONS = /* @__PURE__ */ freeze(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']);
export const TRANSFORM_FUNCTIONS = /* @__PURE__ */ freeze(['matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy']);

const CSS_LIMITS: SvgCssLimits = /* @__PURE__ */ freeze({
  maxStyleAttrChars: 2000,
  maxStyleBlocks: 16,
  maxCssChars: 32768,
  maxRules: 512,
  maxDeclarations: 64,
  maxSelectors: 32,
  maxClassTokens: 32,
  maxBracketDepth: 8,
  maxPaintChars: 200,
  maxValueChars: 64,
  maxDashValues: 32,
  maxColourFunctionDepth: 2,
  maxHrefHops: 8,
  maxStopsPerGradient: 256,
  maxStopClones: 1024,
});

const keywords = (...k: string[]) => ({ kind: 'keyword' as const, keywords: freeze(k) });

/** The presentation properties a style may set, with how each value is checked. */
export const CSS_PROPERTIES: SvgCssTable = /* @__PURE__ */ freeze({
  'fill': { kind: 'paint' },
  'stroke': { kind: 'paint' },
  'stop-color': { kind: 'stop-paint' },
  'opacity': { kind: 'alpha' },
  'fill-opacity': { kind: 'alpha' },
  'stroke-opacity': { kind: 'alpha' },
  'stop-opacity': { kind: 'alpha' },
  'stroke-width': { kind: 'width' },
  'stroke-miterlimit': { kind: 'miterlimit' },
  'stroke-dashoffset': { kind: 'offset' },
  'stroke-dasharray': { kind: 'dasharray' },
  'stroke-linecap': keywords('butt', 'round', 'square'),
  'stroke-linejoin': keywords('miter', 'round', 'bevel', 'arcs', 'miter-clip'),
  'fill-rule': keywords('nonzero', 'evenodd'),
  'clip-rule': keywords('nonzero', 'evenodd'),
  'paint-order': { kind: 'paint-order' },
  'vector-effect': keywords('none', 'non-scaling-stroke'),
});

export const css = (maxWrittenBytes: number): SvgCssPolicy => freeze({ properties: CSS_PROPERTIES, limits: CSS_LIMITS, maxWrittenBytes });
