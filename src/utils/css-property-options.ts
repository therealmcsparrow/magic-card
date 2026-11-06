/** Option lists of the design properties (src/utils/css-properties.ts). */

import { lm } from '../i18n/labels/mark';

export const OVERFLOW_OPTS = [
  { label: lm('labels.css-property-options.visible'), value: 'visible' },
  { label: lm('labels.css-property-options.hidden'), value: 'hidden' },
  { label: lm('labels.css-property-options.scroll'), value: 'scroll' },
  { label: lm('labels.css-property-options.auto'), value: 'auto' },
];

export const FONT_WEIGHT_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.bold'), value: 'bold' },
  { label: lm('labels.css-property-options.100'), value: '100' },
  { label: lm('labels.css-property-options.200'), value: '200' },
  { label: lm('labels.css-property-options.300'), value: '300' },
  { label: lm('labels.css-property-options.400'), value: '400' },
  { label: lm('labels.css-property-options.500'), value: '500' },
  { label: lm('labels.css-property-options.600'), value: '600' },
  { label: lm('labels.css-property-options.700'), value: '700' },
  { label: lm('labels.css-property-options.800'), value: '800' },
  { label: lm('labels.css-property-options.900'), value: '900' },
];

export const FONT_STYLE_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.italic'), value: 'italic' },
  { label: lm('labels.css-property-options.oblique'), value: 'oblique' },
];

export const TEXT_ALIGN_OPTS = [
  { label: lm('labels.css-property-options.left'), value: 'left' },
  { label: lm('labels.css-property-options.centre'), value: 'center' },
  { label: lm('labels.css-property-options.right'), value: 'right' },
  { label: lm('labels.css-property-options.justify'), value: 'justify' },
];

export const TEXT_TRANSFORM_OPTS = [
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.uppercase'), value: 'uppercase' },
  { label: lm('labels.css-property-options.lowercase'), value: 'lowercase' },
  { label: lm('labels.css-property-options.capitalize'), value: 'capitalize' },
];

export const TEXT_DECORATION_OPTS = [
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.underline'), value: 'underline' },
  { label: lm('labels.css-property-options.overline'), value: 'overline' },
  { label: lm('labels.css-property-options.line-through'), value: 'line-through' },
];

export const TEXT_OVERFLOW_OPTS = [
  { label: lm('labels.css-property-options.clip'), value: 'clip' },
  { label: lm('labels.css-property-options.ellipsis'), value: 'ellipsis' },
];

export const WHITE_SPACE_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.nowrap'), value: 'nowrap' },
  { label: lm('labels.css-property-options.pre'), value: 'pre' },
  { label: lm('labels.css-property-options.pre-wrap'), value: 'pre-wrap' },
  { label: lm('labels.css-property-options.pre-line'), value: 'pre-line' },
  { label: lm('labels.css-property-options.break-spaces'), value: 'break-spaces' },
];

export const WORD_BREAK_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.break-all'), value: 'break-all' },
  { label: lm('labels.css-property-options.keep-all'), value: 'keep-all' },
  { label: lm('labels.css-property-options.break-word'), value: 'break-word' },
];

export const OVERFLOW_WRAP_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.break-word'), value: 'break-word' },
  { label: lm('labels.css-property-options.anywhere'), value: 'anywhere' },
];

export const DISPLAY_OPTS = [
  { label: lm('labels.css-property-options.block'), value: 'block' },
  { label: lm('labels.css-property-options.inline'), value: 'inline' },
  { label: lm('labels.css-property-options.inline-block'), value: 'inline-block' },
  { label: lm('labels.css-property-options.flex'), value: 'flex' },
  { label: lm('labels.css-property-options.inline-flex'), value: 'inline-flex' },
  { label: lm('labels.css-property-options.grid'), value: 'grid' },
  { label: lm('labels.css-property-options.inline-grid'), value: 'inline-grid' },
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.contents'), value: 'contents' },
];

export const POSITION_OPTS = [
  { label: lm('labels.css-property-options.static'), value: 'static' },
  { label: lm('labels.css-property-options.relative'), value: 'relative' },
  { label: lm('labels.css-property-options.absolute'), value: 'absolute' },
  { label: lm('labels.css-property-options.fixed'), value: 'fixed' },
  { label: lm('labels.css-property-options.sticky'), value: 'sticky' },
];

export const VISIBILITY_OPTS = [
  { label: lm('labels.css-property-options.visible'), value: 'visible' },
  { label: lm('labels.css-property-options.hidden'), value: 'hidden' },
  { label: lm('labels.css-property-options.collapse'), value: 'collapse' },
];

export const BG_SIZE_OPTS = [
  { label: lm('labels.css-property-options.auto'), value: 'auto' },
  { label: lm('labels.css-property-options.cover'), value: 'cover' },
  { label: lm('labels.css-property-options.contain'), value: 'contain' },
];

export const BG_REPEAT_OPTS = [
  { label: lm('labels.css-property-options.repeat'), value: 'repeat' },
  { label: lm('labels.css-property-options.no-repeat'), value: 'no-repeat' },
  { label: lm('labels.css-property-options.repeat-x'), value: 'repeat-x' },
  { label: lm('labels.css-property-options.repeat-y'), value: 'repeat-y' },
  { label: lm('labels.css-property-options.space'), value: 'space' },
  { label: lm('labels.css-property-options.round'), value: 'round' },
];

export const BG_ATTACHMENT_OPTS = [
  { label: lm('labels.css-property-options.scroll'), value: 'scroll' },
  { label: lm('labels.css-property-options.fixed'), value: 'fixed' },
  { label: lm('labels.css-property-options.local'), value: 'local' },
];

export const BG_CLIP_OPTS = [
  { label: lm('labels.css-property-options.border-box'), value: 'border-box' },
  { label: lm('labels.css-property-options.padding-box'), value: 'padding-box' },
  { label: lm('labels.css-property-options.content-box'), value: 'content-box' },
];

export const BORDER_STYLE_OPTS = [
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.solid'), value: 'solid' },
  { label: lm('labels.css-property-options.dashed'), value: 'dashed' },
  { label: lm('labels.css-property-options.dotted'), value: 'dotted' },
  { label: lm('labels.css-property-options.double'), value: 'double' },
  { label: lm('labels.css-property-options.groove'), value: 'groove' },
  { label: lm('labels.css-property-options.ridge'), value: 'ridge' },
  { label: lm('labels.css-property-options.inset'), value: 'inset' },
  { label: lm('labels.css-property-options.outset'), value: 'outset' },
];

export const OUTLINE_STYLE_OPTS = BORDER_STYLE_OPTS;

export const FLEX_DIRECTION_OPTS = [
  { label: lm('labels.css-property-options.row'), value: 'row' },
  { label: lm('labels.css-property-options.row-reverse'), value: 'row-reverse' },
  { label: lm('labels.css-property-options.column'), value: 'column' },
  { label: lm('labels.css-property-options.column-reverse'), value: 'column-reverse' },
];

export const FLEX_WRAP_OPTS = [
  { label: lm('labels.css-property-options.nowrap'), value: 'nowrap' },
  { label: lm('labels.css-property-options.wrap'), value: 'wrap' },
  { label: lm('labels.css-property-options.wrap-reverse'), value: 'wrap-reverse' },
];

export const JUSTIFY_CONTENT_OPTS = [
  { label: lm('labels.css-property-options.flex-start'), value: 'flex-start' },
  { label: lm('labels.css-property-options.flex-end'), value: 'flex-end' },
  { label: lm('labels.css-property-options.centre'), value: 'center' },
  { label: lm('labels.css-property-options.space-between'), value: 'space-between' },
  { label: lm('labels.css-property-options.space-around'), value: 'space-around' },
  { label: lm('labels.css-property-options.space-evenly'), value: 'space-evenly' },
];

export const ALIGN_ITEMS_OPTS = [
  { label: lm('labels.css-property-options.stretch'), value: 'stretch' },
  { label: lm('labels.css-property-options.flex-start'), value: 'flex-start' },
  { label: lm('labels.css-property-options.flex-end'), value: 'flex-end' },
  { label: lm('labels.css-property-options.centre'), value: 'center' },
  { label: lm('labels.css-property-options.baseline'), value: 'baseline' },
];

export const ALIGN_CONTENT_OPTS = [
  { label: lm('labels.css-property-options.stretch'), value: 'stretch' },
  { label: lm('labels.css-property-options.flex-start'), value: 'flex-start' },
  { label: lm('labels.css-property-options.flex-end'), value: 'flex-end' },
  { label: lm('labels.css-property-options.centre'), value: 'center' },
  { label: lm('labels.css-property-options.space-between'), value: 'space-between' },
  { label: lm('labels.css-property-options.space-around'), value: 'space-around' },
];

export const ALIGN_SELF_OPTS = [
  { label: lm('labels.css-property-options.auto'), value: 'auto' },
  { label: lm('labels.css-property-options.stretch'), value: 'stretch' },
  { label: lm('labels.css-property-options.flex-start'), value: 'flex-start' },
  { label: lm('labels.css-property-options.flex-end'), value: 'flex-end' },
  { label: lm('labels.css-property-options.centre'), value: 'center' },
  { label: lm('labels.css-property-options.baseline'), value: 'baseline' },
];

export const GRID_AUTO_FLOW_OPTS = [
  { label: lm('labels.css-property-options.row'), value: 'row' },
  { label: lm('labels.css-property-options.column'), value: 'column' },
  { label: lm('labels.css-property-options.dense'), value: 'dense' },
  { label: lm('labels.css-property-options.row-dense'), value: 'row dense' },
  { label: lm('labels.css-property-options.column-dense'), value: 'column dense' },
];

export const LIST_STYLE_TYPE_OPTS = [
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.disc'), value: 'disc' },
  { label: lm('labels.css-property-options.circle'), value: 'circle' },
  { label: lm('labels.css-property-options.square'), value: 'square' },
  { label: lm('labels.css-property-options.decimal'), value: 'decimal' },
  { label: lm('labels.css-property-options.lower-alpha'), value: 'lower-alpha' },
  { label: lm('labels.css-property-options.upper-alpha'), value: 'upper-alpha' },
  { label: lm('labels.css-property-options.lower-roman'), value: 'lower-roman' },
  { label: lm('labels.css-property-options.upper-roman'), value: 'upper-roman' },
];

export const LIST_STYLE_POSITION_OPTS = [
  { label: lm('labels.css-property-options.outside'), value: 'outside' },
  { label: lm('labels.css-property-options.inside'), value: 'inside' },
];

export const BORDER_COLLAPSE_OPTS = [
  { label: lm('labels.css-property-options.separate'), value: 'separate' },
  { label: lm('labels.css-property-options.collapse'), value: 'collapse' },
];

export const TABLE_LAYOUT_OPTS = [
  { label: lm('labels.css-property-options.auto'), value: 'auto' },
  { label: lm('labels.css-property-options.fixed'), value: 'fixed' },
];

export const CAPTION_SIDE_OPTS = [
  { label: lm('labels.css-property-options.top'), value: 'top' },
  { label: lm('labels.css-property-options.bottom'), value: 'bottom' },
];

export const ANIMATION_DIRECTION_OPTS = [
  { label: lm('labels.css-property-options.normal'), value: 'normal' },
  { label: lm('labels.css-property-options.reverse'), value: 'reverse' },
  { label: lm('labels.css-property-options.alternate'), value: 'alternate' },
  { label: lm('labels.css-property-options.alternate-reverse'), value: 'alternate-reverse' },
];

export const ANIMATION_FILL_OPTS = [
  { label: lm('labels.css-property-options.none'), value: 'none' },
  { label: lm('labels.css-property-options.forwards'), value: 'forwards' },
  { label: lm('labels.css-property-options.backwards'), value: 'backwards' },
  { label: lm('labels.css-property-options.both'), value: 'both' },
];

export const ANIMATION_PLAY_OPTS = [
  { label: lm('labels.css-property-options.running'), value: 'running' },
  { label: lm('labels.css-property-options.paused'), value: 'paused' },
];

export const BOX_SIZING_OPTS = [
  { label: lm('labels.css-property-options.content-box'), value: 'content-box' },
  { label: lm('labels.css-property-options.border-box'), value: 'border-box' },
];

export const CURSOR_OPTS = [
  { label: lm('labels.css-property-options.auto'), value: 'auto' },
  { label: lm('labels.css-property-options.default'), value: 'default' },
  { label: lm('labels.css-property-options.pointer'), value: 'pointer' },
  { label: lm('labels.css-property-options.move'), value: 'move' },
  { label: lm('labels.css-property-options.text'), value: 'text' },
  { label: lm('labels.css-property-options.wait'), value: 'wait' },
  { label: lm('labels.css-property-options.crosshair'), value: 'crosshair' },
  { label: lm('labels.css-property-options.not-allowed'), value: 'not-allowed' },
  { label: lm('labels.css-property-options.grab'), value: 'grab' },
  { label: lm('labels.css-property-options.none'), value: 'none' },
];
