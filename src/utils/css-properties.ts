export type CssPropertyType = 'unit' | 'color' | 'text' | 'select' | 'number' | 'box' | 'image' | 'font';

export interface CssPropertyDef {
  key: string;
  cssProperty: string;
  label: string;
  type: CssPropertyType;
  options?: Array<{ label: string; value: string }>;
}

export interface CssSector {
  id: string;
  name: string;
  icon: string;
  properties: CssPropertyDef[];
}

function prop(
  key: string,
  cssProperty: string,
  label: string,
  type: CssPropertyType,
  options?: Array<{ label: string; value: string }>,
): CssPropertyDef {
  return { key, cssProperty, label, type, ...(options ? { options } : {}) };
}

const OVERFLOW_OPTS = [
  { label: 'Visible', value: 'visible' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Scroll', value: 'scroll' },
  { label: 'Auto', value: 'auto' },
];

const FONT_WEIGHT_OPTS = [
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

const FONT_STYLE_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic', value: 'italic' },
  { label: 'Oblique', value: 'oblique' },
];

const TEXT_ALIGN_OPTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' },
];

const TEXT_TRANSFORM_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

const TEXT_DECORATION_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Underline', value: 'underline' },
  { label: 'Overline', value: 'overline' },
  { label: 'Line-through', value: 'line-through' },
];

const TEXT_OVERFLOW_OPTS = [
  { label: 'Clip', value: 'clip' },
  { label: 'Ellipsis', value: 'ellipsis' },
];

const WHITE_SPACE_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Nowrap', value: 'nowrap' },
  { label: 'Pre', value: 'pre' },
  { label: 'Pre-wrap', value: 'pre-wrap' },
  { label: 'Pre-line', value: 'pre-line' },
  { label: 'Break-spaces', value: 'break-spaces' },
];

const WORD_BREAK_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Break-all', value: 'break-all' },
  { label: 'Keep-all', value: 'keep-all' },
  { label: 'Break-word', value: 'break-word' },
];

const OVERFLOW_WRAP_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Break-word', value: 'break-word' },
  { label: 'Anywhere', value: 'anywhere' },
];

const DISPLAY_OPTS = [
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

const POSITION_OPTS = [
  { label: 'Static', value: 'static' },
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute', value: 'absolute' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Sticky', value: 'sticky' },
];

const VISIBILITY_OPTS = [
  { label: 'Visible', value: 'visible' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Collapse', value: 'collapse' },
];

const BG_SIZE_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
];

const BG_REPEAT_OPTS = [
  { label: 'Repeat', value: 'repeat' },
  { label: 'No-repeat', value: 'no-repeat' },
  { label: 'Repeat-x', value: 'repeat-x' },
  { label: 'Repeat-y', value: 'repeat-y' },
  { label: 'Space', value: 'space' },
  { label: 'Round', value: 'round' },
];

const BG_ATTACHMENT_OPTS = [
  { label: 'Scroll', value: 'scroll' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Local', value: 'local' },
];

const BG_CLIP_OPTS = [
  { label: 'Border-box', value: 'border-box' },
  { label: 'Padding-box', value: 'padding-box' },
  { label: 'Content-box', value: 'content-box' },
];

const BORDER_STYLE_OPTS = [
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

const OUTLINE_STYLE_OPTS = BORDER_STYLE_OPTS;

const FLEX_DIRECTION_OPTS = [
  { label: 'Row', value: 'row' },
  { label: 'Row-reverse', value: 'row-reverse' },
  { label: 'Column', value: 'column' },
  { label: 'Column-reverse', value: 'column-reverse' },
];

const FLEX_WRAP_OPTS = [
  { label: 'Nowrap', value: 'nowrap' },
  { label: 'Wrap', value: 'wrap' },
  { label: 'Wrap-reverse', value: 'wrap-reverse' },
];

const JUSTIFY_CONTENT_OPTS = [
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Space-between', value: 'space-between' },
  { label: 'Space-around', value: 'space-around' },
  { label: 'Space-evenly', value: 'space-evenly' },
];

const ALIGN_ITEMS_OPTS = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
];

const ALIGN_CONTENT_OPTS = [
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Space-between', value: 'space-between' },
  { label: 'Space-around', value: 'space-around' },
];

const ALIGN_SELF_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Flex-start', value: 'flex-start' },
  { label: 'Flex-end', value: 'flex-end' },
  { label: 'Center', value: 'center' },
  { label: 'Baseline', value: 'baseline' },
];

const GRID_AUTO_FLOW_OPTS = [
  { label: 'Row', value: 'row' },
  { label: 'Column', value: 'column' },
  { label: 'Dense', value: 'dense' },
  { label: 'Row dense', value: 'row dense' },
  { label: 'Column dense', value: 'column dense' },
];

const LIST_STYLE_TYPE_OPTS = [
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

const LIST_STYLE_POSITION_OPTS = [
  { label: 'Outside', value: 'outside' },
  { label: 'Inside', value: 'inside' },
];

const BORDER_COLLAPSE_OPTS = [
  { label: 'Separate', value: 'separate' },
  { label: 'Collapse', value: 'collapse' },
];

const TABLE_LAYOUT_OPTS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Fixed', value: 'fixed' },
];

const CAPTION_SIDE_OPTS = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

const ANIMATION_DIRECTION_OPTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Reverse', value: 'reverse' },
  { label: 'Alternate', value: 'alternate' },
  { label: 'Alternate-reverse', value: 'alternate-reverse' },
];

const ANIMATION_FILL_OPTS = [
  { label: 'None', value: 'none' },
  { label: 'Forwards', value: 'forwards' },
  { label: 'Backwards', value: 'backwards' },
  { label: 'Both', value: 'both' },
];

const ANIMATION_PLAY_OPTS = [
  { label: 'Running', value: 'running' },
  { label: 'Paused', value: 'paused' },
];

const BOX_SIZING_OPTS = [
  { label: 'Content-box', value: 'content-box' },
  { label: 'Border-box', value: 'border-box' },
];

const CURSOR_OPTS = [
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

export const CSS_SECTORS: CssSector[] = [
  // 1. Spacing & Box Model
  {
    id: 'spacing',
    name: 'Spacing & Box Model',
    icon: 'mdi:arrow-expand-all',
    properties: [
      prop('margin', 'margin', 'Margin', 'box'),
      prop('padding', 'padding', 'Padding', 'box'),
      prop('width', 'width', 'Width', 'unit'),
      prop('height', 'height', 'Height', 'unit'),
      prop('min_width', 'min-width', 'Min Width', 'unit'),
      prop('min_height', 'min-height', 'Min Height', 'unit'),
      prop('max_width', 'max-width', 'Max Width', 'unit'),
      prop('max_height', 'max-height', 'Max Height', 'unit'),
      prop('box_sizing', 'box-sizing', 'Box Sizing', 'select', BOX_SIZING_OPTS),
    ],
  },

  // 2. Borders & Outlines
  {
    id: 'borders',
    name: 'Borders & Outlines',
    icon: 'mdi:border-all',
    properties: [
      prop('border', 'border', 'Border', 'text'),
      prop('border_top', 'border-top', 'Border Top', 'text'),
      prop('border_right', 'border-right', 'Border Right', 'text'),
      prop('border_bottom', 'border-bottom', 'Border Bottom', 'text'),
      prop('border_left', 'border-left', 'Border Left', 'text'),
      prop('border_width', 'border-width', 'Border Width', 'unit'),
      prop('border_style', 'border-style', 'Border Style', 'select', BORDER_STYLE_OPTS),
      prop('border_color', 'border-color', 'Border Color', 'color'),
      prop('border_radius', 'border-radius', 'Border Radius', 'box'),
      prop('outline', 'outline', 'Outline', 'text'),
      prop('outline_width', 'outline-width', 'Outline Width', 'unit'),
      prop('outline_style', 'outline-style', 'Outline Style', 'select', OUTLINE_STYLE_OPTS),
      prop('outline_color', 'outline-color', 'Outline Color', 'color'),
      prop('outline_offset', 'outline-offset', 'Outline Offset', 'unit'),
      prop('box_shadow', 'box-shadow', 'Box Shadow', 'text'),
    ],
  },

  // 3. Positioning & Layout
  {
    id: 'positioning',
    name: 'Positioning & Layout',
    icon: 'mdi:page-layout-body',
    properties: [
      prop('position', 'position', 'Position', 'select', POSITION_OPTS),
      prop('top', 'top', 'Top', 'unit'),
      prop('right', 'right', 'Right', 'unit'),
      prop('bottom', 'bottom', 'Bottom', 'unit'),
      prop('left', 'left', 'Left', 'unit'),
      prop('inset', 'inset', 'Inset', 'unit'),
      prop('display', 'display', 'Display', 'select', DISPLAY_OPTS),
      prop('visibility', 'visibility', 'Visibility', 'select', VISIBILITY_OPTS),
      prop('opacity', 'opacity', 'Opacity', 'text'),
      prop('z_index', 'z-index', 'Z-Index', 'number'),
      prop('overflow', 'overflow', 'Overflow', 'select', OVERFLOW_OPTS),
      prop('overflow_x', 'overflow-x', 'Overflow X', 'select', OVERFLOW_OPTS),
      prop('overflow_y', 'overflow-y', 'Overflow Y', 'select', OVERFLOW_OPTS),
      prop('float', 'float', 'Float', 'select', [
        { label: 'None', value: 'none' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ]),
      prop('clear', 'clear', 'Clear', 'select', [
        { label: 'None', value: 'none' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'Both', value: 'both' },
      ]),
      prop('cursor', 'cursor', 'Cursor', 'select', CURSOR_OPTS),
      prop('pointer_events', 'pointer-events', 'Pointer Events', 'select', [
        { label: 'Auto', value: 'auto' },
        { label: 'None', value: 'none' },
      ]),
    ],
  },

  // 4. Typography
  {
    id: 'typography',
    name: 'Typography',
    icon: 'mdi:format-font',
    properties: [
      prop('font_family', 'font-family', 'Font Family', 'font'),
      prop('font_size', 'font-size', 'Font Size', 'unit'),
      prop('font_weight', 'font-weight', 'Font Weight', 'select', FONT_WEIGHT_OPTS),
      prop('font_style', 'font-style', 'Font Style', 'select', FONT_STYLE_OPTS),
      prop('font_variant', 'font-variant', 'Font Variant', 'text'),
      prop('color', 'color', 'Color', 'color'),
      prop('text_align', 'text-align', 'Text Align', 'select', TEXT_ALIGN_OPTS),
      prop('text_decoration', 'text-decoration', 'Text Decoration', 'select', TEXT_DECORATION_OPTS),
      prop('text_transform', 'text-transform', 'Text Transform', 'select', TEXT_TRANSFORM_OPTS),
      prop('text_indent', 'text-indent', 'Text Indent', 'unit'),
      prop('text_overflow', 'text-overflow', 'Text Overflow', 'select', TEXT_OVERFLOW_OPTS),
      prop('text_shadow', 'text-shadow', 'Text Shadow', 'text'),
      prop('line_height', 'line-height', 'Line Height', 'text'),
      prop('letter_spacing', 'letter-spacing', 'Letter Spacing', 'unit'),
      prop('word_spacing', 'word-spacing', 'Word Spacing', 'unit'),
      prop('white_space', 'white-space', 'White Space', 'select', WHITE_SPACE_OPTS),
      prop('word_break', 'word-break', 'Word Break', 'select', WORD_BREAK_OPTS),
      prop('overflow_wrap', 'overflow-wrap', 'Overflow Wrap', 'select', OVERFLOW_WRAP_OPTS),
    ],
  },

  // 5. Backgrounds
  {
    id: 'backgrounds',
    name: 'Backgrounds',
    icon: 'mdi:image-area',
    properties: [
      prop('background', 'background', 'Background', 'text'),
      prop('background_color', 'background-color', 'Background Color', 'color'),
      prop('background_image', 'background-image', 'Background Image', 'image'),
      prop('background_position', 'background-position', 'Background Position', 'text'),
      prop('background_size', 'background-size', 'Background Size', 'select', BG_SIZE_OPTS),
      prop('background_repeat', 'background-repeat', 'Background Repeat', 'select', BG_REPEAT_OPTS),
      prop('background_attachment', 'background-attachment', 'Background Attachment', 'select', BG_ATTACHMENT_OPTS),
      prop('background_clip', 'background-clip', 'Background Clip', 'select', BG_CLIP_OPTS),
      prop('background_origin', 'background-origin', 'Background Origin', 'select', BG_CLIP_OPTS),
      prop('backdrop_filter', 'backdrop-filter', 'Backdrop Filter', 'text'),
    ],
  },

  // 6. Flexbox
  {
    id: 'flexbox',
    name: 'Flexbox',
    icon: 'mdi:view-column',
    properties: [
      prop('flex_direction', 'flex-direction', 'Direction', 'select', FLEX_DIRECTION_OPTS),
      prop('flex_wrap', 'flex-wrap', 'Wrap', 'select', FLEX_WRAP_OPTS),
      prop('justify_content', 'justify-content', 'Justify Content', 'select', JUSTIFY_CONTENT_OPTS),
      prop('align_items', 'align-items', 'Align Items', 'select', ALIGN_ITEMS_OPTS),
      prop('align_content', 'align-content', 'Align Content', 'select', ALIGN_CONTENT_OPTS),
      prop('gap', 'gap', 'Gap', 'unit'),
      prop('row_gap', 'row-gap', 'Row Gap', 'unit'),
      prop('column_gap', 'column-gap', 'Column Gap', 'unit'),
      prop('flex', 'flex', 'Flex', 'text'),
      prop('flex_grow', 'flex-grow', 'Flex Grow', 'number'),
      prop('flex_shrink', 'flex-shrink', 'Flex Shrink', 'number'),
      prop('flex_basis', 'flex-basis', 'Flex Basis', 'unit'),
      prop('align_self', 'align-self', 'Align Self', 'select', ALIGN_SELF_OPTS),
      prop('order', 'order', 'Order', 'number'),
    ],
  },

  // 7. CSS Grid
  {
    id: 'grid',
    name: 'CSS Grid',
    icon: 'mdi:grid',
    properties: [
      prop('grid_template_columns', 'grid-template-columns', 'Template Columns', 'text'),
      prop('grid_template_rows', 'grid-template-rows', 'Template Rows', 'text'),
      prop('grid_template_areas', 'grid-template-areas', 'Template Areas', 'text'),
      prop('grid_auto_columns', 'grid-auto-columns', 'Auto Columns', 'text'),
      prop('grid_auto_rows', 'grid-auto-rows', 'Auto Rows', 'text'),
      prop('grid_auto_flow', 'grid-auto-flow', 'Auto Flow', 'select', GRID_AUTO_FLOW_OPTS),
      prop('grid_column', 'grid-column', 'Column', 'text'),
      prop('grid_row', 'grid-row', 'Row', 'text'),
      prop('grid_area', 'grid-area', 'Area', 'text'),
    ],
  },

  // 8. Transitions & Animations
  {
    id: 'transitions',
    name: 'Transitions & Animations',
    icon: 'mdi:animation',
    properties: [
      prop('transition', 'transition', 'Transition', 'text'),
      prop('transition_property', 'transition-property', 'Transition Property', 'text'),
      prop('transition_duration', 'transition-duration', 'Transition Duration', 'text'),
      prop('transition_timing_function', 'transition-timing-function', 'Transition Timing', 'text'),
      prop('transition_delay', 'transition-delay', 'Transition Delay', 'text'),
      prop('transform', 'transform', 'Transform', 'text'),
      prop('transform_origin', 'transform-origin', 'Transform Origin', 'text'),
      prop('animation_name', 'animation-name', 'Animation Name', 'text'),
      prop('animation_duration', 'animation-duration', 'Animation Duration', 'text'),
      prop('animation_timing_function', 'animation-timing-function', 'Animation Timing', 'text'),
      prop('animation_delay', 'animation-delay', 'Animation Delay', 'text'),
      prop('animation_iteration_count', 'animation-iteration-count', 'Iteration Count', 'text'),
      prop('animation_direction', 'animation-direction', 'Animation Direction', 'select', ANIMATION_DIRECTION_OPTS),
      prop('animation_fill_mode', 'animation-fill-mode', 'Fill Mode', 'select', ANIMATION_FILL_OPTS),
      prop('animation_play_state', 'animation-play-state', 'Play State', 'select', ANIMATION_PLAY_OPTS),
      prop('filter', 'filter', 'Filter', 'text'),
    ],
  },

  // 9. Lists & Tables
  {
    id: 'lists-tables',
    name: 'Lists & Tables',
    icon: 'mdi:format-list-bulleted',
    properties: [
      prop('list_style', 'list-style', 'List Style', 'text'),
      prop('list_style_type', 'list-style-type', 'List Style Type', 'select', LIST_STYLE_TYPE_OPTS),
      prop('list_style_position', 'list-style-position', 'List Style Position', 'select', LIST_STYLE_POSITION_OPTS),
      prop('list_style_image', 'list-style-image', 'List Style Image', 'text'),
      prop('border_collapse', 'border-collapse', 'Border Collapse', 'select', BORDER_COLLAPSE_OPTS),
      prop('border_spacing', 'border-spacing', 'Border Spacing', 'unit'),
      prop('table_layout', 'table-layout', 'Table Layout', 'select', TABLE_LAYOUT_OPTS),
      prop('caption_side', 'caption-side', 'Caption Side', 'select', CAPTION_SIDE_OPTS),
    ],
  },
];

export function buildDesignToCssMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const sector of CSS_SECTORS) {
    for (const p of sector.properties) {
      map[p.key] = p.cssProperty;
    }
  }
  return map;
}
