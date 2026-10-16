import {
  OVERFLOW_OPTS,
  FONT_WEIGHT_OPTS,
  FONT_STYLE_OPTS,
  TEXT_ALIGN_OPTS,
  TEXT_TRANSFORM_OPTS,
  TEXT_DECORATION_OPTS,
  TEXT_OVERFLOW_OPTS,
  WHITE_SPACE_OPTS,
  WORD_BREAK_OPTS,
  OVERFLOW_WRAP_OPTS,
  DISPLAY_OPTS,
  POSITION_OPTS,
  VISIBILITY_OPTS,
  BG_SIZE_OPTS,
  BG_REPEAT_OPTS,
  BG_ATTACHMENT_OPTS,
  BG_CLIP_OPTS,
  BORDER_STYLE_OPTS,
  OUTLINE_STYLE_OPTS,
  FLEX_DIRECTION_OPTS,
  FLEX_WRAP_OPTS,
  JUSTIFY_CONTENT_OPTS,
  ALIGN_ITEMS_OPTS,
  ALIGN_CONTENT_OPTS,
  ALIGN_SELF_OPTS,
  GRID_AUTO_FLOW_OPTS,
  LIST_STYLE_TYPE_OPTS,
  LIST_STYLE_POSITION_OPTS,
  BORDER_COLLAPSE_OPTS,
  TABLE_LAYOUT_OPTS,
  CAPTION_SIDE_OPTS,
  ANIMATION_DIRECTION_OPTS,
  ANIMATION_FILL_OPTS,
  ANIMATION_PLAY_OPTS,
  BOX_SIZING_OPTS,
  CURSOR_OPTS,
} from './css-property-options';

export type CssPropertyType = 'unit' | 'color' | 'text' | 'select' | 'number' | 'box' | 'image' | 'font' | 'segmented' | 'animations' | 'ring' | 'shape' | 'value_bg';

export interface CssPropertyOption {
  label: string;
  value: string;
  /** Select options with a group render inside an <optgroup>. */
  group?: string;
}

export interface CssPropertyDef {
  key: string;
  /** CSS property written by designToStyle; empty for card options that are not CSS (`virtual`). */
  cssProperty: string;
  label: string;
  type: CssPropertyType;
  options?: CssPropertyOption[];
  /** Not a CSS property: the card reads the key itself (animation preset, border length, ...). */
  virtual?: boolean;
  /** Label of the select's empty option (default "Not set"). */
  emptyLabel?: string;
  /** Help line under the field. */
  help?: string;
  /** Value the card uses when the key is unset (shown selected in segmented controls). */
  defaultValue?: string;
  /** Units offered by a unit field (default: all). */
  units?: string[];
}

export interface CssSector {
  id: string;
  name: string;
  icon: string;
  /** Cascade order: designToStyle emits properties in this order (shorthands before longhands). */
  properties: CssPropertyDef[];
  /** Keys shown first in the editor (mockup order); the rest follow in `properties` order. */
  leading?: string[];
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

/** A design option the card handles itself (no CSS property of its own). */
function option(
  key: string,
  label: string,
  type: CssPropertyType,
  extra: Partial<Pick<CssPropertyDef, 'options' | 'emptyLabel' | 'help' | 'defaultValue' | 'units'>> = {},
): CssPropertyDef {
  return { key, cssProperty: '', label, type, virtual: true, ...extra };
}

/** Design keys that only matter once another key is set (key → the key it depends on). */
export const DEPENDENT_OPTIONS: Record<string, string> = {
  border_length_align: 'border_length',
  border_length_sides: 'border_length',
};

export const CSS_SECTORS: CssSector[] = [
  // 1. Spacing & Box Model
  {
    id: 'spacing',
    name: 'Spacing & box model',
    icon: 'mdi:arrow-expand-all',
    leading: ['padding', 'margin', 'width', 'min_height'],
    properties: [
      prop('margin', 'margin', 'Margin', 'box'),
      prop('padding', 'padding', 'Padding', 'box'),
      prop('width', 'width', 'Width', 'unit'),
      prop('height', 'height', 'Height', 'unit'),
      prop('min_width', 'min-width', 'Min width', 'unit'),
      prop('min_height', 'min-height', 'Min height', 'unit'),
      prop('max_width', 'max-width', 'Max width', 'unit'),
      prop('max_height', 'max-height', 'Max height', 'unit'),
      prop('box_sizing', 'box-sizing', 'Box sizing', 'select', BOX_SIZING_OPTS),
    ],
  },

  // 2. Borders & Outlines
  {
    id: 'borders',
    name: 'Borders & outlines',
    icon: 'mdi:border-all',
    leading: ['border_radius', 'border_width', 'border_style', 'border_color', 'border_length', 'border_length_align', 'border_length_sides', 'box_shadow'],
    properties: [
      prop('border', 'border', 'Border', 'text'),
      prop('border_top', 'border-top', 'Border top', 'text'),
      prop('border_right', 'border-right', 'Border right', 'text'),
      prop('border_bottom', 'border-bottom', 'Border bottom', 'text'),
      prop('border_left', 'border-left', 'Border left', 'text'),
      prop('border_width', 'border-width', 'Border width', 'unit'),
      { ...prop('border_style', 'border-style', 'Border style', 'select', BORDER_STYLE_OPTS), emptyLabel: 'Solid when width is set' },
      prop('border_color', 'border-color', 'Border color', 'color'),
      option('border_length', 'Border length', 'unit', {
        units: ['%', 'px'],
        help: 'Shorten the border line, e.g. 40% for a short accent line.',
      }),
      option('border_length_align', 'Alignment', 'segmented', {
        defaultValue: 'center',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
        ],
      }),
      option('border_length_sides', 'Sides', 'select', {
        emptyLabel: 'All',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Right', value: 'right' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
        ],
      }),
      prop('border_radius', 'border-radius', 'Border radius', 'box'),
      prop('outline', 'outline', 'Outline', 'text'),
      prop('outline_width', 'outline-width', 'Outline width', 'unit'),
      prop('outline_style', 'outline-style', 'Outline style', 'select', OUTLINE_STYLE_OPTS),
      prop('outline_color', 'outline-color', 'Outline color', 'color'),
      prop('outline_offset', 'outline-offset', 'Outline offset', 'unit'),
      prop('box_shadow', 'box-shadow', 'Box shadow', 'text'),
    ],
  },

  // 2b. Shape: an outline shape instead of the border radius (mc-shape-editor, src/utils/shape-path.ts)
  {
    id: 'shape',
    name: 'Shape',
    icon: 'mdi:hexagon-outline',
    properties: [option('shape', 'Shape', 'shape')],
  },

  // 2c. Value background: a tank fill or history sparkline behind the content (mc-value-bg-editor)
  {
    id: 'value-background',
    name: 'Value background',
    icon: 'mdi:chart-areaspline-variant',
    properties: [option('value_background', 'Value background', 'value_bg')],
  },

  // 3. Positioning & Layout
  {
    id: 'positioning',
    name: 'Positioning & layout',
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
      prop('z_index', 'z-index', 'Z-index', 'number'),
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
      prop('pointer_events', 'pointer-events', 'Pointer events', 'select', [
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
    leading: ['color', 'font_family', 'font_weight', 'font_size', 'text_transform'],
    properties: [
      prop('font_family', 'font-family', 'Font family', 'font'),
      prop('font_size', 'font-size', 'Font size', 'unit'),
      prop('font_weight', 'font-weight', 'Font weight', 'select', FONT_WEIGHT_OPTS),
      prop('font_style', 'font-style', 'Font style', 'select', FONT_STYLE_OPTS),
      prop('font_variant', 'font-variant', 'Font variant', 'text'),
      prop('color', 'color', 'Color', 'color'),
      prop('text_align', 'text-align', 'Text align', 'select', TEXT_ALIGN_OPTS),
      prop('text_decoration', 'text-decoration', 'Text decoration', 'select', TEXT_DECORATION_OPTS),
      prop('text_transform', 'text-transform', 'Text transform', 'select', TEXT_TRANSFORM_OPTS),
      prop('text_indent', 'text-indent', 'Text indent', 'unit'),
      prop('text_overflow', 'text-overflow', 'Text overflow', 'select', TEXT_OVERFLOW_OPTS),
      prop('text_shadow', 'text-shadow', 'Text shadow', 'text'),
      prop('line_height', 'line-height', 'Line height', 'text'),
      prop('letter_spacing', 'letter-spacing', 'Letter spacing', 'unit'),
      prop('word_spacing', 'word-spacing', 'Word spacing', 'unit'),
      prop('white_space', 'white-space', 'White space', 'select', WHITE_SPACE_OPTS),
      prop('word_break', 'word-break', 'Word break', 'select', WORD_BREAK_OPTS),
      prop('overflow_wrap', 'overflow-wrap', 'Overflow wrap', 'select', OVERFLOW_WRAP_OPTS),
    ],
  },

  // 5. Backgrounds
  {
    id: 'backgrounds',
    name: 'Backgrounds',
    icon: 'mdi:image-area',
    properties: [
      prop('background', 'background', 'Background', 'text'),
      prop('background_color', 'background-color', 'Background color', 'color'),
      prop('background_image', 'background-image', 'Background image', 'image'),
      prop('background_position', 'background-position', 'Background position', 'text'),
      prop('background_size', 'background-size', 'Background size', 'select', BG_SIZE_OPTS),
      prop('background_repeat', 'background-repeat', 'Background repeat', 'select', BG_REPEAT_OPTS),
      prop('background_attachment', 'background-attachment', 'Background attachment', 'select', BG_ATTACHMENT_OPTS),
      prop('background_clip', 'background-clip', 'Background clip', 'select', BG_CLIP_OPTS),
      prop('background_origin', 'background-origin', 'Background origin', 'select', BG_CLIP_OPTS),
      prop('backdrop_filter', 'backdrop-filter', 'Backdrop filter', 'text'),
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
      prop('justify_content', 'justify-content', 'Justify content', 'select', JUSTIFY_CONTENT_OPTS),
      prop('align_items', 'align-items', 'Align items', 'select', ALIGN_ITEMS_OPTS),
      prop('align_content', 'align-content', 'Align content', 'select', ALIGN_CONTENT_OPTS),
      prop('gap', 'gap', 'Gap', 'unit'),
      prop('row_gap', 'row-gap', 'Row gap', 'unit'),
      prop('column_gap', 'column-gap', 'Column gap', 'unit'),
      prop('flex', 'flex', 'Flex', 'text'),
      prop('flex_grow', 'flex-grow', 'Flex grow', 'number'),
      prop('flex_shrink', 'flex-shrink', 'Flex shrink', 'number'),
      prop('flex_basis', 'flex-basis', 'Flex basis', 'unit'),
      prop('align_self', 'align-self', 'Align self', 'select', ALIGN_SELF_OPTS),
      prop('order', 'order', 'Order', 'number'),
    ],
  },

  // 7. CSS Grid
  {
    id: 'grid',
    name: 'CSS grid',
    icon: 'mdi:grid',
    properties: [
      prop('grid_template_columns', 'grid-template-columns', 'Template columns', 'text'),
      prop('grid_template_rows', 'grid-template-rows', 'Template rows', 'text'),
      prop('grid_template_areas', 'grid-template-areas', 'Template areas', 'text'),
      prop('grid_auto_columns', 'grid-auto-columns', 'Auto columns', 'text'),
      prop('grid_auto_rows', 'grid-auto-rows', 'Auto rows', 'text'),
      prop('grid_auto_flow', 'grid-auto-flow', 'Auto flow', 'select', GRID_AUTO_FLOW_OPTS),
      prop('grid_column', 'grid-column', 'Column', 'text'),
      prop('grid_row', 'grid-row', 'Row', 'text'),
      prop('grid_area', 'grid-area', 'Area', 'text'),
    ],
  },

  // 8. Transitions & Animations
  {
    id: 'transitions',
    name: 'Transitions & animations',
    icon: 'mdi:animation',
    leading: ['animations'],
    properties: [
      // the list of preset animations (mc-animation-list); legacy single keys are read into it
      option('animations', 'Animations', 'animations'),
      prop('transition', 'transition', 'Transition', 'text'),
      prop('transition_property', 'transition-property', 'Transition property', 'text'),
      { ...prop('transition_duration', 'transition-duration', 'Transition duration', 'unit'), units: ['s', 'ms'] },
      prop('transition_timing_function', 'transition-timing-function', 'Transition timing', 'text'),
      { ...prop('transition_delay', 'transition-delay', 'Transition delay', 'unit'), units: ['s', 'ms'] },
      prop('transform', 'transform', 'Transform', 'text'),
      prop('transform_origin', 'transform-origin', 'Transform origin', 'text'),
      prop('animation_name', 'animation-name', 'Animation name', 'text'),
      { ...prop('animation_duration', 'animation-duration', 'Animation duration', 'unit'), units: ['s', 'ms'] },
      prop('animation_timing_function', 'animation-timing-function', 'Animation timing', 'text'),
      { ...prop('animation_delay', 'animation-delay', 'Animation delay', 'unit'), units: ['s', 'ms'] },
      prop('animation_iteration_count', 'animation-iteration-count', 'Iteration count', 'text'),
      prop('animation_direction', 'animation-direction', 'Animation direction', 'select', ANIMATION_DIRECTION_OPTS),
      prop('animation_fill_mode', 'animation-fill-mode', 'Fill mode', 'select', ANIMATION_FILL_OPTS),
      prop('animation_play_state', 'animation-play-state', 'Play state', 'select', ANIMATION_PLAY_OPTS),
      prop('filter', 'filter', 'Filter', 'text'),
    ],
  },

  // 8b. Ring: an SVG outline following the border radius (mc-ring-editor, src/utils/ring.ts)
  {
    id: 'ring',
    name: 'Ring',
    icon: 'mdi:circle-double',
    properties: [option('ring', 'Ring', 'ring')],
  },

  // 9. Lists & Tables
  {
    id: 'lists-tables',
    name: 'Lists & tables',
    icon: 'mdi:format-list-bulleted',
    properties: [
      prop('list_style', 'list-style', 'List style', 'text'),
      prop('list_style_type', 'list-style-type', 'List style type', 'select', LIST_STYLE_TYPE_OPTS),
      prop('list_style_position', 'list-style-position', 'List style position', 'select', LIST_STYLE_POSITION_OPTS),
      prop('list_style_image', 'list-style-image', 'List style image', 'text'),
      prop('border_collapse', 'border-collapse', 'Border collapse', 'select', BORDER_COLLAPSE_OPTS),
      prop('border_spacing', 'border-spacing', 'Border spacing', 'unit'),
      prop('table_layout', 'table-layout', 'Table layout', 'select', TABLE_LAYOUT_OPTS),
      prop('caption_side', 'caption-side', 'Caption side', 'select', CAPTION_SIDE_OPTS),
    ],
  },
];

/** The Custom CSS field's entry in a design group (it is not a CSS sector). */
export const CUSTOM_CSS_ENTRY = 'custom-css';

export interface DesignGroup {
  id: 'layout' | 'style' | 'effects' | 'advanced';
  name: string;
  /** Sector ids in display order (CSS_SECTORS keeps the cascade order); `custom-css` is the Custom CSS field. */
  entries: string[];
  /** Open on first render; a group holding a set value opens regardless. */
  defaultOpen: boolean;
}

/** The Design tab's headed groups, in display order. Every CSS sector belongs to exactly one group. */
export const DESIGN_GROUPS: DesignGroup[] = [
  { id: 'layout', name: 'Layout', entries: ['spacing', 'positioning', 'flexbox', 'grid'], defaultOpen: true },
  { id: 'style', name: 'Style', entries: ['backgrounds', 'borders', 'typography', 'shape', 'value-background'], defaultOpen: true },
  { id: 'effects', name: 'Effects', entries: ['ring', 'transitions'], defaultOpen: false },
  { id: 'advanced', name: 'Advanced', entries: ['lists-tables', CUSTOM_CSS_ENTRY], defaultOpen: false },
];

/** A sector's properties in editor display order: `leading` keys first, then the rest. */
export function displayProperties(sector: CssSector): CssPropertyDef[] {
  const lead = sector.leading || [];
  const first = lead
    .map((k) => sector.properties.find((p) => p.key === k))
    .filter((p): p is CssPropertyDef => !!p);
  return [...first, ...sector.properties.filter((p) => !lead.includes(p.key))];
}

/**
 * Per-side longhands of the `box` properties, as written by mc-box-field (design key → CSS property).
 * They are not separate fields in the panel (the box field edits them), but they are design keys
 * that must reach the CSS, count as "set" and sync with their box field.
 */
export const BOX_LONGHANDS: Record<string, Array<{ key: string; cssProperty: string }>> = {
  margin: ['top', 'right', 'bottom', 'left'].map((s) => ({ key: `margin_${s}`, cssProperty: `margin-${s}` })),
  padding: ['top', 'right', 'bottom', 'left'].map((s) => ({ key: `padding_${s}`, cssProperty: `padding-${s}` })),
  border_radius: ['top_left', 'top_right', 'bottom_right', 'bottom_left'].map((c) => ({
    key: `border_${c}_radius`,
    cssProperty: `border-${c.replace('_', '-')}-radius`,
  })),
};

/** Design keys edited (and synced with a template) together with another one: the shape and its options. */
const GROUPED_KEYS: Record<string, string[]> = {
  shape: ['shape_options'],
};

/** Design keys a property covers: itself plus its per-side longhands (box properties) or grouped keys. */
export function propertyKeys(key: string): string[] {
  return [key, ...(BOX_LONGHANDS[key] || []).map((l) => l.key), ...(GROUPED_KEYS[key] || [])];
}

export function buildDesignToCssMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const sector of CSS_SECTORS) {
    for (const p of sector.properties) {
      if (p.virtual) continue;
      map[p.key] = p.cssProperty;
      // longhands right after their shorthand, so a side overrides the shorthand
      for (const l of BOX_LONGHANDS[p.key] || []) map[l.key] = l.cssProperty;
    }
  }
  return map;
}
