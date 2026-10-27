import type { SvgPolicy, SvgValueKind } from '../contracts/svg-safety';
import { COLOUR_FUNCTIONS, css, freeze, TRANSFORM_FUNCTIONS } from './policy-base';

/* The own-icon policy: a small attribute set, all checked with the one `value` rule. Data only. */

/** Own-icon limits: the byte cap of an icon and its nesting depth. */
export const ICON_MAX_BYTES = 32 * 1024;
export const ICON_MAX_DEPTH = 64;

const ICON_ATTRIBUTES = [
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points', 'fill', 'stroke',
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform',
  'viewBox', 'id', 'class', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform',
  'clip-path', 'mask', 'fill-rule', 'clip-rule',
];

const iconKind = (name: string): SvgValueKind =>
  name === 'transform' || name === 'gradientTransform' ? 'transform' : name === 'id' ? 'id' : name === 'class' ? 'class' : 'value';

export const ICON_POLICY: SvgPolicy = /* @__PURE__ */ freeze({
  name: 'icon' as const,
  elements: freeze([
    'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient',
    'radialGradient', 'stop', 'clipPath', 'mask', 'title',
  ]),
  kinds: freeze(Object.fromEntries(ICON_ATTRIBUTES.map((n) => [n, iconKind(n)]))),
  colourFunctions: COLOUR_FUNCTIONS,
  transformFunctions: TRANSFORM_FUNCTIONS,
  paintVar: false,
  maxValueChars: ICON_MAX_BYTES,
  denyExtra: freeze([]),
  limits: freeze({ maxNodes: ICON_MAX_BYTES, maxDepth: ICON_MAX_DEPTH }),
  css: css(ICON_MAX_BYTES),
});
