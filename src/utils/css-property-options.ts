/** Option lists of the design properties (src/utils/css-properties.ts). */

export const OVERFLOW_OPTS = [
  { label: 'Visible', value: 'visible' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Scroll', value: 'scroll' },
  { label: 'Auto', value: 'auto' },
];

export const FONT_WEIGHT_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Bold', value: 'bold' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '500', value: '500' },
  { label: '600', value: '600' },
  { label: '700', value: '700' },
  { label: '800', value: '800' },
  { label: '900', value: '900' },
];

export const FONT_STYLE_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic', value: 'italic' },
  { label: 'Oblique', value: 'oblique' },
];

export const TEXT_ALIGN_OPTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' },
];

export const TEXT_TRANSFORM_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export const TEXT_DECORATION_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Underline', value: 'underline' },
  { label: 'Overline', value: 'overline' },
  { label: 'Line-through', value: 'line-through' },
];

export const TEXT_OVERFLOW_OPTS = [
  { label: 'Clip', value: 'clip' },
  { label: 'Ellipsis', value: 'ellipsis' },
];

export const WHITE_SPACE_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Nowrap', value: 'nowrap' },
  { label: 'Pre', value: 'pre' },
  { label: 'Pre-wrap', value: 'pre-wrap' },
  { label: 'Pre-line', value: 'pre-line' },
  { label: 'Break-spaces', value: 'break-spaces' },
];

export const WORD_BREAK_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Break-all', value: 'break-all' },
  { label: 'Keep-all', value: 'keep-all' },
  { label: 'Break-word', value: 'break-word' },
];

export const OVERFLOW_WRAP_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Break-word', value: 'break-word' },
  { label: 'Anywhere', value: 'anywhere' },
];

export const DISPLAY_OPTS = [
  { label: 'Block', value: 'block' },
  { label: 'Inline', value: 'inline' },
  { label: 'Inline-block', value: 'inline-block' },
  { label: 'Flex', value: 'flex' },
  { label: 'Inline-flex', value: 'inline-flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Inline-grid', value: 'inline-grid' },
  { label: 'None', value: 'none' },
  { label: 'Contents', value: 'contents' },
];

export const POSITION_OPTS = [
  { label: 'Static', value: 'static' },
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute', value: 'absolute' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Sticky', value: 'sticky' },
];

export const VISIBILITY_OPTS = [
  { label: 'Visible', value: 'visible' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Collapse', value: 'collapse' },
];

export const BG_SIZE_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
];

export const BG_REPEAT_OPTS = [
  { label: 'Repeat', value: 'repeat' },
  { label: 'No-repeat', value: 'no-repeat' },
  { label: 'Repeat-x', value: 'repeat-x' },
  { label: 'Repeat-y', value: 'repeat-y' },
  { label: 'Space', value: 'space' },
  { label: 'Round', value: 'round' },
];

export const BG_ATTACHMENT_OPTS = [
  { label: 'Scroll', value: 'scroll' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Local', value: 'local' },
];

export const BG_CLIP_OPTS = [
  { label: 'Border-box', value: 'border-box' },
  { label: 'Padding-box', value: 'padding-box' },
  { label: 'Content-box', value: 'content-box' },
];

export const BORDER_STYLE_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
  { label: 'Double', value: 'double' },
  { label: 'Groove', value: 'groove' },
  { label: 'Ridge', value: 'ridge' },
  { label: 'Inset', value: 'inset' },
  { label: 'Outset', value: 'outset' },
];

export const OUTLINE_STYLE_OPTS = BORDER_STYLE_OPTS;

export const FLEX_DIRECTION_OPTS = [
  { label: 'Row', value: 'row' },
  { label: 'Row-reverse', value: 'row-reverse' },
  { label: 'Column', value: 'column' },
  { label: 'Column-reverse', value: 'column-reverse' },
];

export const FLEX_WRAP_OPTS = [
  { label: 'Nowrap', value: 'nowrap' },
  { label: 'Wrap', value: 'wrap' },
  { label: 'Wrap-reverse', value: 'wrap-reverse' },
];

export const JUSTIFY_CONTENT_OPTS = [
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Space-between', value: 'space-between' },
  { label: 'Space-around', value: 'space-around' },
  { label: 'Space-evenly', value: 'space-evenly' },
];

export const ALIGN_ITEMS_OPTS = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
];

export const ALIGN_CONTENT_OPTS = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Space-between', value: 'space-between' },
  { label: 'Space-around', value: 'space-around' },
];

export const ALIGN_SELF_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
];

export const GRID_AUTO_FLOW_OPTS = [
  { label: 'Row', value: 'row' },
  { label: 'Column', value: 'column' },
  { label: 'Dense', value: 'dense' },
  { label: 'Row dense', value: 'row dense' },
  { label: 'Column dense', value: 'column dense' },
];

export const LIST_STYLE_TYPE_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Disc', value: 'disc' },
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'square' },
  { label: 'Decimal', value: 'decimal' },
  { label: 'Lower-alpha', value: 'lower-alpha' },
  { label: 'Upper-alpha', value: 'upper-alpha' },
  { label: 'Lower-roman', value: 'lower-roman' },
  { label: 'Upper-roman', value: 'upper-roman' },
];

export const LIST_STYLE_POSITION_OPTS = [
  { label: 'Outside', value: 'outside' },
  { label: 'Inside', value: 'inside' },
];

export const BORDER_COLLAPSE_OPTS = [
  { label: 'Separate', value: 'separate' },
  { label: 'Collapse', value: 'collapse' },
];

export const TABLE_LAYOUT_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Fixed', value: 'fixed' },
];

export const CAPTION_SIDE_OPTS = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

export const ANIMATION_DIRECTION_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Reverse', value: 'reverse' },
  { label: 'Alternate', value: 'alternate' },
  { label: 'Alternate-reverse', value: 'alternate-reverse' },
];

export const ANIMATION_FILL_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Forwards', value: 'forwards' },
  { label: 'Backwards', value: 'backwards' },
  { label: 'Both', value: 'both' },
];

export const ANIMATION_PLAY_OPTS = [
  { label: 'Running', value: 'running' },
  { label: 'Paused', value: 'paused' },
];

export const BOX_SIZING_OPTS = [
  { label: 'Content-box', value: 'content-box' },
  { label: 'Border-box', value: 'border-box' },
];

export const CURSOR_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Default', value: 'default' },
  { label: 'Pointer', value: 'pointer' },
  { label: 'Move', value: 'move' },
  { label: 'Text', value: 'text' },
  { label: 'Wait', value: 'wait' },
  { label: 'Crosshair', value: 'crosshair' },
  { label: 'Not-allowed', value: 'not-allowed' },
  { label: 'Grab', value: 'grab' },
  { label: 'None', value: 'none' },
];
