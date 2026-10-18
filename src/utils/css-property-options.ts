/** Option lists of the design properties (src/utils/css-properties.ts). */

import { lm } from '../i18n/labels/mark';

export const OVERFLOW_OPTS = [
  { label: lm('Visible'), value: 'visible' },
  { label: lm('Hidden'), value: 'hidden' },
  { label: lm('Scroll'), value: 'scroll' },
  { label: lm('Auto'), value: 'auto' },
];

export const FONT_WEIGHT_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Bold'), value: 'bold' },
  { label: lm('100'), value: '100' },
  { label: lm('200'), value: '200' },
  { label: lm('300'), value: '300' },
  { label: lm('400'), value: '400' },
  { label: lm('500'), value: '500' },
  { label: lm('600'), value: '600' },
  { label: lm('700'), value: '700' },
  { label: lm('800'), value: '800' },
  { label: lm('900'), value: '900' },
];

export const FONT_STYLE_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Italic'), value: 'italic' },
  { label: lm('Oblique'), value: 'oblique' },
];

export const TEXT_ALIGN_OPTS = [
  { label: lm('Left'), value: 'left' },
  { label: lm('Centre'), value: 'center' },
  { label: lm('Right'), value: 'right' },
  { label: lm('Justify'), value: 'justify' },
];

export const TEXT_TRANSFORM_OPTS = [
  { label: lm('None'), value: 'none' },
  { label: lm('Uppercase'), value: 'uppercase' },
  { label: lm('Lowercase'), value: 'lowercase' },
  { label: lm('Capitalize'), value: 'capitalize' },
];

export const TEXT_DECORATION_OPTS = [
  { label: lm('None'), value: 'none' },
  { label: lm('Underline'), value: 'underline' },
  { label: lm('Overline'), value: 'overline' },
  { label: lm('Line-through'), value: 'line-through' },
];

export const TEXT_OVERFLOW_OPTS = [
  { label: lm('Clip'), value: 'clip' },
  { label: lm('Ellipsis'), value: 'ellipsis' },
];

export const WHITE_SPACE_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Nowrap'), value: 'nowrap' },
  { label: lm('Pre'), value: 'pre' },
  { label: lm('Pre-wrap'), value: 'pre-wrap' },
  { label: lm('Pre-line'), value: 'pre-line' },
  { label: lm('Break-spaces'), value: 'break-spaces' },
];

export const WORD_BREAK_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Break-all'), value: 'break-all' },
  { label: lm('Keep-all'), value: 'keep-all' },
  { label: lm('Break-word'), value: 'break-word' },
];

export const OVERFLOW_WRAP_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Break-word'), value: 'break-word' },
  { label: lm('Anywhere'), value: 'anywhere' },
];

export const DISPLAY_OPTS = [
  { label: lm('Block'), value: 'block' },
  { label: lm('Inline'), value: 'inline' },
  { label: lm('Inline-block'), value: 'inline-block' },
  { label: lm('Flex'), value: 'flex' },
  { label: lm('Inline-flex'), value: 'inline-flex' },
  { label: lm('Grid'), value: 'grid' },
  { label: lm('Inline-grid'), value: 'inline-grid' },
  { label: lm('None'), value: 'none' },
  { label: lm('Contents'), value: 'contents' },
];

export const POSITION_OPTS = [
  { label: lm('Static'), value: 'static' },
  { label: lm('Relative'), value: 'relative' },
  { label: lm('Absolute'), value: 'absolute' },
  { label: lm('Fixed'), value: 'fixed' },
  { label: lm('Sticky'), value: 'sticky' },
];

export const VISIBILITY_OPTS = [
  { label: lm('Visible'), value: 'visible' },
  { label: lm('Hidden'), value: 'hidden' },
  { label: lm('Collapse'), value: 'collapse' },
];

export const BG_SIZE_OPTS = [
  { label: lm('Auto'), value: 'auto' },
  { label: lm('Cover'), value: 'cover' },
  { label: lm('Contain'), value: 'contain' },
];

export const BG_REPEAT_OPTS = [
  { label: lm('Repeat'), value: 'repeat' },
  { label: lm('No-repeat'), value: 'no-repeat' },
  { label: lm('Repeat-x'), value: 'repeat-x' },
  { label: lm('Repeat-y'), value: 'repeat-y' },
  { label: lm('Space'), value: 'space' },
  { label: lm('Round'), value: 'round' },
];

export const BG_ATTACHMENT_OPTS = [
  { label: lm('Scroll'), value: 'scroll' },
  { label: lm('Fixed'), value: 'fixed' },
  { label: lm('Local'), value: 'local' },
];

export const BG_CLIP_OPTS = [
  { label: lm('Border-box'), value: 'border-box' },
  { label: lm('Padding-box'), value: 'padding-box' },
  { label: lm('Content-box'), value: 'content-box' },
];

export const BORDER_STYLE_OPTS = [
  { label: lm('None'), value: 'none' },
  { label: lm('Solid'), value: 'solid' },
  { label: lm('Dashed'), value: 'dashed' },
  { label: lm('Dotted'), value: 'dotted' },
  { label: lm('Double'), value: 'double' },
  { label: lm('Groove'), value: 'groove' },
  { label: lm('Ridge'), value: 'ridge' },
  { label: lm('Inset'), value: 'inset' },
  { label: lm('Outset'), value: 'outset' },
];

export const OUTLINE_STYLE_OPTS = BORDER_STYLE_OPTS;

export const FLEX_DIRECTION_OPTS = [
  { label: lm('Row'), value: 'row' },
  { label: lm('Row-reverse'), value: 'row-reverse' },
  { label: lm('Column'), value: 'column' },
  { label: lm('Column-reverse'), value: 'column-reverse' },
];

export const FLEX_WRAP_OPTS = [
  { label: lm('Nowrap'), value: 'nowrap' },
  { label: lm('Wrap'), value: 'wrap' },
  { label: lm('Wrap-reverse'), value: 'wrap-reverse' },
];

export const JUSTIFY_CONTENT_OPTS = [
  { label: lm('Flex-start'), value: 'flex-start' },
  { label: lm('Flex-end'), value: 'flex-end' },
  { label: lm('Centre'), value: 'center' },
  { label: lm('Space-between'), value: 'space-between' },
  { label: lm('Space-around'), value: 'space-around' },
  { label: lm('Space-evenly'), value: 'space-evenly' },
];

export const ALIGN_ITEMS_OPTS = [
  { label: lm('Stretch'), value: 'stretch' },
  { label: lm('Flex-start'), value: 'flex-start' },
  { label: lm('Flex-end'), value: 'flex-end' },
  { label: lm('Centre'), value: 'center' },
  { label: lm('Baseline'), value: 'baseline' },
];

export const ALIGN_CONTENT_OPTS = [
  { label: lm('Stretch'), value: 'stretch' },
  { label: lm('Flex-start'), value: 'flex-start' },
  { label: lm('Flex-end'), value: 'flex-end' },
  { label: lm('Centre'), value: 'center' },
  { label: lm('Space-between'), value: 'space-between' },
  { label: lm('Space-around'), value: 'space-around' },
];

export const ALIGN_SELF_OPTS = [
  { label: lm('Auto'), value: 'auto' },
  { label: lm('Stretch'), value: 'stretch' },
  { label: lm('Flex-start'), value: 'flex-start' },
  { label: lm('Flex-end'), value: 'flex-end' },
  { label: lm('Centre'), value: 'center' },
  { label: lm('Baseline'), value: 'baseline' },
];

export const GRID_AUTO_FLOW_OPTS = [
  { label: lm('Row'), value: 'row' },
  { label: lm('Column'), value: 'column' },
  { label: lm('Dense'), value: 'dense' },
  { label: lm('Row dense'), value: 'row dense' },
  { label: lm('Column dense'), value: 'column dense' },
];

export const LIST_STYLE_TYPE_OPTS = [
  { label: lm('None'), value: 'none' },
  { label: lm('Disc'), value: 'disc' },
  { label: lm('Circle'), value: 'circle' },
  { label: lm('Square'), value: 'square' },
  { label: lm('Decimal'), value: 'decimal' },
  { label: lm('Lower-alpha'), value: 'lower-alpha' },
  { label: lm('Upper-alpha'), value: 'upper-alpha' },
  { label: lm('Lower-roman'), value: 'lower-roman' },
  { label: lm('Upper-roman'), value: 'upper-roman' },
];

export const LIST_STYLE_POSITION_OPTS = [
  { label: lm('Outside'), value: 'outside' },
  { label: lm('Inside'), value: 'inside' },
];

export const BORDER_COLLAPSE_OPTS = [
  { label: lm('Separate'), value: 'separate' },
  { label: lm('Collapse'), value: 'collapse' },
];

export const TABLE_LAYOUT_OPTS = [
  { label: lm('Auto'), value: 'auto' },
  { label: lm('Fixed'), value: 'fixed' },
];

export const CAPTION_SIDE_OPTS = [
  { label: lm('Top'), value: 'top' },
  { label: lm('Bottom'), value: 'bottom' },
];

export const ANIMATION_DIRECTION_OPTS = [
  { label: lm('Normal'), value: 'normal' },
  { label: lm('Reverse'), value: 'reverse' },
  { label: lm('Alternate'), value: 'alternate' },
  { label: lm('Alternate-reverse'), value: 'alternate-reverse' },
];

export const ANIMATION_FILL_OPTS = [
  { label: lm('None'), value: 'none' },
  { label: lm('Forwards'), value: 'forwards' },
  { label: lm('Backwards'), value: 'backwards' },
  { label: lm('Both'), value: 'both' },
];

export const ANIMATION_PLAY_OPTS = [
  { label: lm('Running'), value: 'running' },
  { label: lm('Paused'), value: 'paused' },
];

export const BOX_SIZING_OPTS = [
  { label: lm('Content-box'), value: 'content-box' },
  { label: lm('Border-box'), value: 'border-box' },
];

export const CURSOR_OPTS = [
  { label: lm('Auto'), value: 'auto' },
  { label: lm('Default'), value: 'default' },
  { label: lm('Pointer'), value: 'pointer' },
  { label: lm('Move'), value: 'move' },
  { label: lm('Text'), value: 'text' },
  { label: lm('Wait'), value: 'wait' },
  { label: lm('Crosshair'), value: 'crosshair' },
  { label: lm('Not-allowed'), value: 'not-allowed' },
  { label: lm('Grab'), value: 'grab' },
  { label: lm('None'), value: 'none' },
];
