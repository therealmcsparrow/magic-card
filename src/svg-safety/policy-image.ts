import { IMAGE_ATTRIBUTES, IMAGE_ELEMENTS, IMAGE_MAX_BYTES, IMAGE_MAX_DEPTH, IMAGE_MAX_NODES } from '../contracts/svg-image';
import type { SvgPolicy, SvgValueKind } from '../contracts/svg-safety';
import { COLOUR_FUNCTIONS, css, freeze, TRANSFORM_FUNCTIONS } from './policy-base';

/* The image policy: every allowed attribute has a value kind of its own. Data only. */

const KEYWORD_ATTRIBUTES = [
  'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'spreadMethod', 'gradientUnits', 'clipPathUnits', 'maskUnits',
  'maskContentUnits', 'visibility', 'vector-effect', 'paint-order', 'font-style', 'font-weight', 'text-anchor', 'dominant-baseline',
  'preserveAspectRatio',
];

const imageKind = (name: string): SvgValueKind =>
  name === 'd' ? 'path'
  : name === 'points' ? 'points'
  : name === 'fill' || name === 'stroke' || name === 'stop-color' ? 'paint'
  : name === 'transform' || name === 'gradientTransform' ? 'transform'
  : name === 'clip-path' || name === 'mask' ? 'reference'
  : name === 'font-family' ? 'font'
  : name === 'id' ? 'id'
  : name === 'data-name' ? 'data-name'
  : name === 'class' ? 'class'
  : KEYWORD_ATTRIBUTES.includes(name) ? 'keyword'
  : 'length';

export const IMAGE_POLICY: SvgPolicy = /* @__PURE__ */ freeze({
  name: 'image' as const,
  elements: IMAGE_ELEMENTS,
  kinds: freeze(Object.fromEntries(IMAGE_ATTRIBUTES.map((n) => [n, imageKind(n)]))),
  colourFunctions: COLOUR_FUNCTIONS,
  transformFunctions: TRANSFORM_FUNCTIONS,
  paintVar: true,
  maxTransformFunctions: 16,
  maxValueChars: 2000,
  maxPaintChars: 200,
  denyExtra: freeze([]),
  limits: freeze({ maxNodes: IMAGE_MAX_NODES, maxDepth: IMAGE_MAX_DEPTH }),
  css: css(IMAGE_MAX_BYTES),
});
