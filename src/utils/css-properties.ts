import type { MessageIndex } from '../contracts/i18n';
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
import { lm } from '../i18n/labels/mark';

export type CssPropertyType = 'unit' | 'color' | 'text' | 'select' | 'number' | 'box' | 'image' | 'font' | 'segmented' | 'tab_list' | 'animations' | 'tab_animations' | 'icon_anim' | 'sides' | 'ring' | 'shape' | 'value_bg';

export interface CssPropertyOption {
  label: MessageIndex;
  value: string;
  /** Select options with a group render inside an <optgroup>. */
  group?: string;
}

export interface CssPropertyDef {
  key: string;
  /** CSS property written by designToStyle; empty for card options that are not CSS (`virtual`). */
  cssProperty: string;
  label: MessageIndex;
  type: CssPropertyType;
  options?: CssPropertyOption[];
  /** Not a CSS property: the card reads the key itself (animation preset, border length, ...). */
  virtual?: boolean;
  /** Label of the select's empty option (default "Not set"). */
  emptyLabel?: MessageIndex;
  /** Help line under the field. */
  help?: MessageIndex;
  /** Value the card uses when the key is unset (shown selected in segmented controls). */
  defaultValue?: string;
  /** Units offered by a unit field (default: all). */
  units?: string[];
  /** A virtual key that is still valid in the hover design and in conditional rules (the button part keys). */
  hover?: boolean;
  /** Button variants (`button_style`) that do not show this field. */
  hideForVariant?: string[];
  /** Read from the module's own design only: not offered in the hover design or in conditional rules. */
  baseOnly?: boolean;
  /** A per-tab field that also shows in the Active tab and Disabled tab designs (and in Hover). */
  tabState?: boolean;
  /** A `sides` field: one key holding a 1 to 4 value shorthand, edited per side (what a side holds; corners name the four corners). */
  sides?: { cell: 'length' | 'color' | 'style'; corners?: boolean };
  /** The collapsible group of the Tab bar sector this field sits in (see TAB_SUBGROUPS). */
  subgroup?: string;
  /** Number field bounds: min, max and step. */
  range?: [number, number, number];
  /** Every design key this field edits, when more than its own (the position offsets). */
  keys?: string[];
  /** A key the field before it edits: it has no field of its own. */
  part?: boolean;
}

export interface CssSector {
  id: string;
  name: MessageIndex;
  icon: string;
  /** Cascade order: designToStyle emits properties in this order (shorthands before longhands). */
  properties: CssPropertyDef[];
  /** Keys shown first in the editor; the rest follow in `properties` order. */
  leading?: string[];
  /** Module types that show this sector (default: every design). */
  modules?: string[];
}

function prop(
  key: string,
  cssProperty: string,
  label: MessageIndex,
  type: CssPropertyType,
  options?: Array<{ label: MessageIndex; value: string }>,
): CssPropertyDef {
  return { key, cssProperty, label, type, ...(options ? { options } : {}) };
}

/** A design option the card handles itself (no CSS property of its own). */
function option(
  key: string,
  label: MessageIndex,
  type: CssPropertyType,
  extra: Partial<Pick<CssPropertyDef, 'options' | 'emptyLabel' | 'help' | 'defaultValue' | 'units' | 'hover' | 'hideForVariant' | 'baseOnly' | 'tabState' | 'subgroup' | 'sides' | 'range'>> = {},
): CssPropertyDef {
  return { key, cssProperty: '', label, type, virtual: true, ...extra };
}
/** A bar-wide tab key: a tabs module reads it from its design and its rules (not from a tab state or the hover design). */
const tb = (key: string, label: MessageIndex, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => option(key, label, type, extra);
/** A per-tab key that every tab state (active, disabled, hover) can also set. */
const ts = (key: string, label: MessageIndex, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => tb(key, label, type, { hover: true, tabState: true, ...extra });
/** A button part key: allowed in the hover design and in rules. */
const bo = (key: string, label: MessageIndex, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => option(key, label, type, { hover: true, ...extra });
const LABEL = { hideForVariant: ['icon-only'] };
const LENGTH = ['px', 'em', 'rem'];
const PCT = [...LENGTH, '%'];
const TAB_LENGTHS_HELP = lm('labels.css-properties.one-to-four-lengths-for-example-4px-8px');

/** The collapsible groups of the Tab bar sector, in display order: Bar is bar-wide, the others hold per-tab fields. */
export const TAB_SUBGROUPS: Array<{ id: string; name: MessageIndex }> = [
  { id: 'bar', name: lm('labels.css-properties.bar') },
  { id: 'text', name: lm('labels.css-properties.text') },
  { id: 'border', name: lm('labels.css-properties.border') },
  { id: 'icon', name: lm('labels.css-properties.icon') },
  { id: 'effects', name: lm('labels.css-properties.effects') },
];

/** Design keys that only matter once another key is set (key → the key it depends on). */
export const DEPENDENT_OPTIONS: Record<string, string> = {
  border_length_align: 'border_length',
  border_length_sides: 'border_length',
  icon_background_shape: 'icon_background',
};

export const CSS_SECTORS: CssSector[] = [
  // 1. Spacing & Box Model
  {
    id: 'spacing',
    name: lm('labels.css-properties.spacing-box-model'),
    icon: 'mdi:arrow-expand-all',
    leading: ['padding', 'margin', 'width', 'min_height'],
    properties: [
      prop('margin', 'margin', lm('labels.css-properties.margin'), 'box'),
      prop('padding', 'padding', lm('labels.css-properties.padding'), 'box'),
      prop('width', 'width', lm('labels.css-properties.width'), 'unit'),
      prop('height', 'height', lm('labels.css-properties.height'), 'unit'),
      prop('min_width', 'min-width', lm('labels.css-properties.min-width'), 'unit'),
      prop('min_height', 'min-height', lm('labels.css-properties.min-height'), 'unit'),
      prop('max_width', 'max-width', lm('labels.css-properties.max-width'), 'unit'),
      prop('max_height', 'max-height', lm('labels.css-properties.max-height'), 'unit'),
      prop('box_sizing', 'box-sizing', lm('labels.css-properties.box-sizing'), 'select', BOX_SIZING_OPTS),
    ],
  },

  // 2. Borders & Outlines
  {
    id: 'borders',
    name: lm('labels.css-properties.borders-outlines'),
    icon: 'mdi:border-all',
    leading: ['border_radius', 'border_width', 'border_style', 'border_color', 'border_length', 'border_length_align', 'border_length_sides', 'box_shadow'],
    properties: [
      prop('border', 'border', lm('labels.css-properties.border'), 'text'),
      prop('border_top', 'border-top', lm('labels.css-properties.border-top'), 'text'),
      prop('border_right', 'border-right', lm('labels.css-properties.border-right'), 'text'),
      prop('border_bottom', 'border-bottom', lm('labels.css-properties.border-bottom'), 'text'),
      prop('border_left', 'border-left', lm('labels.css-properties.border-left'), 'text'),
      { ...prop('border_width', 'border-width', lm('labels.css-properties.border-width'), 'sides'), sides: { cell: 'length' }, units: ['px', 'em', 'rem'] },
      { ...prop('border_style', 'border-style', lm('labels.css-properties.border-style'), 'sides', BORDER_STYLE_OPTS), sides: { cell: 'style' } },
      { ...prop('border_color', 'border-color', lm('labels.css-properties.border-colour'), 'sides'), sides: { cell: 'color' } },
      option('border_length', lm('labels.css-properties.border-length'), 'unit', {
        units: ['%', 'px'],
        help: lm('labels.css-properties.shorten-the-border-line-e-g-40-for-a'),
      }),
      option('border_length_align', lm('labels.css-properties.alignment'), 'segmented', {
        defaultValue: 'center',
        options: [
          { label: lm('labels.css-properties.start'), value: 'start' },
          { label: lm('labels.css-properties.centre'), value: 'center' },
          { label: lm('labels.css-properties.end'), value: 'end' },
        ],
      }),
      option('border_length_sides', lm('labels.css-properties.sides'), 'select', {
        emptyLabel: lm('labels.css-properties.all'),
        options: [
          { label: lm('labels.css-properties.top'), value: 'top' },
          { label: lm('labels.css-properties.right'), value: 'right' },
          { label: lm('labels.css-properties.bottom'), value: 'bottom' },
          { label: lm('labels.css-properties.left'), value: 'left' },
        ],
      }),
      prop('border_radius', 'border-radius', lm('labels.css-properties.border-radius'), 'box'),
      prop('outline', 'outline', lm('labels.css-properties.outline'), 'text'),
      prop('outline_width', 'outline-width', lm('labels.css-properties.outline-width'), 'unit'),
      prop('outline_style', 'outline-style', lm('labels.css-properties.outline-style'), 'select', OUTLINE_STYLE_OPTS),
      prop('outline_color', 'outline-color', lm('labels.css-properties.outline-colour'), 'color'),
      prop('outline_offset', 'outline-offset', lm('labels.css-properties.outline-offset'), 'unit'),
      prop('box_shadow', 'box-shadow', lm('labels.css-properties.box-shadow'), 'text'),
    ],
  },

  // 2b. Shape: an outline shape instead of the border radius (mc-shape-editor, src/utils/shape-path.ts)
  {
    id: 'shape',
    name: lm('labels.css-properties.shape'),
    icon: 'mdi:hexagon-outline',
    properties: [option('shape', lm('labels.css-properties.shape'), 'shape')],
  },

  // 2c. Value background: a tank fill or history sparkline behind the content (mc-value-bg-editor)
  {
    id: 'value-background',
    name: lm('labels.css-properties.value-background'),
    icon: 'mdi:chart-areaspline-variant',
    properties: [option('value_background', lm('labels.css-properties.value-background'), 'value_bg')],
  },

  // 3. Positioning & Layout
  {
    id: 'positioning',
    name: lm('labels.css-properties.positioning-layout'),
    icon: 'mdi:page-layout-body',
    properties: [
      prop('position', 'position', lm('labels.css-properties.position'), 'select', POSITION_OPTS),
      { ...prop('top', 'top', lm('labels.css-properties.offsets'), 'box'), keys: ['top', 'right', 'bottom', 'left'] },
      { ...prop('right', 'right', lm('labels.css-properties.right'), 'unit'), part: true },
      { ...prop('bottom', 'bottom', lm('labels.css-properties.bottom'), 'unit'), part: true },
      { ...prop('left', 'left', lm('labels.css-properties.left'), 'unit'), part: true },
      prop('inset', 'inset', lm('labels.css-properties.inset'), 'unit'),
      prop('display', 'display', lm('labels.css-properties.display'), 'select', DISPLAY_OPTS),
      prop('visibility', 'visibility', lm('labels.css-properties.visibility'), 'select', VISIBILITY_OPTS),
      prop('opacity', 'opacity', lm('labels.css-properties.opacity'), 'text'),
      prop('z_index', 'z-index', lm('labels.css-properties.z-index'), 'number'),
      prop('overflow', 'overflow', lm('labels.css-properties.overflow'), 'select', OVERFLOW_OPTS),
      prop('overflow_x', 'overflow-x', lm('labels.css-properties.overflow-x'), 'select', OVERFLOW_OPTS),
      prop('overflow_y', 'overflow-y', lm('labels.css-properties.overflow-y'), 'select', OVERFLOW_OPTS),
      prop('float', 'float', lm('labels.css-properties.float'), 'select', [
        { label: lm('labels.css-properties.none'), value: 'none' },
        { label: lm('labels.css-properties.left'), value: 'left' },
        { label: lm('labels.css-properties.right'), value: 'right' },
      ]),
      prop('clear', 'clear', lm('labels.css-properties.clear'), 'select', [
        { label: lm('labels.css-properties.none'), value: 'none' },
        { label: lm('labels.css-properties.left'), value: 'left' },
        { label: lm('labels.css-properties.right'), value: 'right' },
        { label: lm('labels.css-properties.both'), value: 'both' },
      ]),
      prop('cursor', 'cursor', lm('labels.css-properties.cursor'), 'select', CURSOR_OPTS),
      prop('pointer_events', 'pointer-events', lm('labels.css-properties.pointer-events'), 'select', [
        { label: lm('labels.css-properties.auto'), value: 'auto' },
        { label: lm('labels.css-properties.none'), value: 'none' },
      ]),
    ],
  },

  // 4. Typography
  {
    id: 'typography',
    name: lm('labels.css-properties.typography'),
    icon: 'mdi:format-font',
    leading: ['color', 'font_family', 'font_weight', 'font_size', 'text_transform'],
    properties: [
      prop('font_family', 'font-family', lm('labels.css-properties.font-family'), 'font'),
      prop('font_size', 'font-size', lm('labels.css-properties.font-size'), 'unit'),
      prop('font_weight', 'font-weight', lm('labels.css-properties.font-weight'), 'select', FONT_WEIGHT_OPTS),
      prop('font_style', 'font-style', lm('labels.css-properties.font-style'), 'select', FONT_STYLE_OPTS),
      prop('font_variant', 'font-variant', lm('labels.css-properties.font-variant'), 'text'),
      prop('color', 'color', lm('labels.css-properties.colour'), 'color'),
      prop('text_align', 'text-align', lm('labels.css-properties.text-align'), 'select', TEXT_ALIGN_OPTS),
      prop('text_decoration', 'text-decoration', lm('labels.css-properties.text-decoration'), 'select', TEXT_DECORATION_OPTS),
      prop('text_transform', 'text-transform', lm('labels.css-properties.text-transform'), 'select', TEXT_TRANSFORM_OPTS),
      prop('text_indent', 'text-indent', lm('labels.css-properties.text-indent'), 'unit'),
      prop('text_overflow', 'text-overflow', lm('labels.css-properties.text-overflow'), 'select', TEXT_OVERFLOW_OPTS),
      prop('text_shadow', 'text-shadow', lm('labels.css-properties.text-shadow'), 'text'),
      prop('line_height', 'line-height', lm('labels.css-properties.line-height'), 'text'),
      prop('letter_spacing', 'letter-spacing', lm('labels.css-properties.letter-spacing'), 'unit'),
      prop('word_spacing', 'word-spacing', lm('labels.css-properties.word-spacing'), 'unit'),
      prop('white_space', 'white-space', lm('labels.css-properties.white-space'), 'select', WHITE_SPACE_OPTS),
      prop('word_break', 'word-break', lm('labels.css-properties.word-break'), 'select', WORD_BREAK_OPTS),
      prop('overflow_wrap', 'overflow-wrap', lm('labels.css-properties.overflow-wrap'), 'select', OVERFLOW_WRAP_OPTS),
    ],
  },

  // 5. Backgrounds
  {
    id: 'backgrounds',
    name: lm('labels.css-properties.backgrounds'),
    icon: 'mdi:image-area',
    properties: [
      prop('background', 'background', lm('labels.css-properties.background'), 'text'),
      prop('background_color', 'background-color', lm('labels.css-properties.background-colour'), 'color'),
      prop('background_image', 'background-image', lm('labels.css-properties.background-image'), 'image'),
      prop('background_position', 'background-position', lm('labels.css-properties.background-position'), 'text'),
      prop('background_size', 'background-size', lm('labels.css-properties.background-size'), 'select', BG_SIZE_OPTS),
      prop('background_repeat', 'background-repeat', lm('labels.css-properties.background-repeat'), 'select', BG_REPEAT_OPTS),
      prop('background_attachment', 'background-attachment', lm('labels.css-properties.background-attachment'), 'select', BG_ATTACHMENT_OPTS),
      prop('background_clip', 'background-clip', lm('labels.css-properties.background-clip'), 'select', BG_CLIP_OPTS),
      prop('background_origin', 'background-origin', lm('labels.css-properties.background-origin'), 'select', BG_CLIP_OPTS),
      prop('backdrop_filter', 'backdrop-filter', lm('labels.css-properties.backdrop-filter'), 'text'),
    ],
  },

  // 6. Flexbox
  {
    id: 'flexbox',
    name: lm('labels.css-properties.flexbox'),
    icon: 'mdi:view-column',
    properties: [
      prop('flex_direction', 'flex-direction', lm('labels.css-properties.direction'), 'select', FLEX_DIRECTION_OPTS),
      prop('flex_wrap', 'flex-wrap', lm('labels.css-properties.wrap'), 'select', FLEX_WRAP_OPTS),
      prop('justify_content', 'justify-content', lm('labels.css-properties.justify-content'), 'select', JUSTIFY_CONTENT_OPTS),
      prop('align_items', 'align-items', lm('labels.css-properties.align-items'), 'select', ALIGN_ITEMS_OPTS),
      prop('align_content', 'align-content', lm('labels.css-properties.align-content'), 'select', ALIGN_CONTENT_OPTS),
      prop('gap', 'gap', lm('labels.css-properties.gap'), 'unit'),
      prop('row_gap', 'row-gap', lm('labels.css-properties.row-gap'), 'unit'),
      prop('column_gap', 'column-gap', lm('labels.css-properties.column-gap'), 'unit'),
      prop('flex', 'flex', lm('labels.css-properties.flex'), 'text'),
      prop('flex_grow', 'flex-grow', lm('labels.css-properties.flex-grow'), 'number'),
      prop('flex_shrink', 'flex-shrink', lm('labels.css-properties.flex-shrink'), 'number'),
      prop('flex_basis', 'flex-basis', lm('labels.css-properties.flex-basis'), 'unit'),
      prop('align_self', 'align-self', lm('labels.css-properties.align-self'), 'select', ALIGN_SELF_OPTS),
      prop('order', 'order', lm('labels.css-properties.order'), 'number'),
    ],
  },

  // 7. CSS Grid
  {
    id: 'grid',
    name: lm('labels.css-properties.css-grid'),
    icon: 'mdi:grid',
    properties: [
      prop('grid_template_columns', 'grid-template-columns', lm('labels.css-properties.template-columns'), 'text'),
      prop('grid_template_rows', 'grid-template-rows', lm('labels.css-properties.template-rows'), 'text'),
      prop('grid_template_areas', 'grid-template-areas', lm('labels.css-properties.template-areas'), 'text'),
      prop('grid_auto_columns', 'grid-auto-columns', lm('labels.css-properties.auto-columns'), 'text'),
      prop('grid_auto_rows', 'grid-auto-rows', lm('labels.css-properties.auto-rows'), 'text'),
      prop('grid_auto_flow', 'grid-auto-flow', lm('labels.css-properties.auto-flow'), 'select', GRID_AUTO_FLOW_OPTS),
      prop('grid_column', 'grid-column', lm('labels.css-properties.column'), 'text'),
      prop('grid_row', 'grid-row', lm('labels.css-properties.row'), 'text'),
      prop('grid_area', 'grid-area', lm('labels.css-properties.area'), 'text'),
    ],
  },

  // 8. Transitions & Animations
  {
    id: 'transitions',
    name: lm('labels.css-properties.transitions-animations'),
    icon: 'mdi:animation',
    leading: ['animations'],
    properties: [
      // the list of preset animations (mc-animation-list); legacy single keys are read into it
      option('animations', lm('labels.css-properties.animations'), 'animations'),
      prop('transition', 'transition', lm('labels.css-properties.transition'), 'text'),
      prop('transition_property', 'transition-property', lm('labels.css-properties.transition-property'), 'text'),
      { ...prop('transition_duration', 'transition-duration', lm('labels.css-properties.transition-duration'), 'unit'), units: ['s', 'ms'] },
      prop('transition_timing_function', 'transition-timing-function', lm('labels.css-properties.transition-timing'), 'text'),
      { ...prop('transition_delay', 'transition-delay', lm('labels.css-properties.transition-delay'), 'unit'), units: ['s', 'ms'] },
      prop('transform', 'transform', lm('labels.css-properties.transform'), 'text'),
      prop('transform_origin', 'transform-origin', lm('labels.css-properties.transform-origin'), 'text'),
      prop('animation_name', 'animation-name', lm('labels.css-properties.animation-name'), 'text'),
      { ...prop('animation_duration', 'animation-duration', lm('labels.css-properties.animation-duration'), 'unit'), units: ['s', 'ms'] },
      prop('animation_timing_function', 'animation-timing-function', lm('labels.css-properties.animation-timing'), 'text'),
      { ...prop('animation_delay', 'animation-delay', lm('labels.css-properties.animation-delay'), 'unit'), units: ['s', 'ms'] },
      prop('animation_iteration_count', 'animation-iteration-count', lm('labels.css-properties.iteration-count'), 'text'),
      prop('animation_direction', 'animation-direction', lm('labels.css-properties.animation-direction'), 'select', ANIMATION_DIRECTION_OPTS),
      prop('animation_fill_mode', 'animation-fill-mode', lm('labels.css-properties.fill-mode'), 'select', ANIMATION_FILL_OPTS),
      prop('animation_play_state', 'animation-play-state', lm('labels.css-properties.play-state'), 'select', ANIMATION_PLAY_OPTS),
      prop('filter', 'filter', lm('labels.css-properties.filter'), 'text'),
    ],
  },

  // 8b. Ring: an SVG outline following the border radius (mc-ring-editor, src/utils/ring.ts)
  {
    id: 'ring',
    name: lm('labels.css-properties.ring'),
    icon: 'mdi:circle-double',
    properties: [option('ring', lm('labels.css-properties.ring'), 'ring')],
  },

  // 9. Lists & Tables
  {
    id: 'lists-tables',
    name: lm('labels.css-properties.lists-tables'),
    icon: 'mdi:format-list-bulleted',
    properties: [
      prop('list_style', 'list-style', lm('labels.css-properties.list-style'), 'text'),
      prop('list_style_type', 'list-style-type', lm('labels.css-properties.list-style-type'), 'select', LIST_STYLE_TYPE_OPTS),
      prop('list_style_position', 'list-style-position', lm('labels.css-properties.list-style-position'), 'select', LIST_STYLE_POSITION_OPTS),
      prop('list_style_image', 'list-style-image', lm('labels.css-properties.list-style-image'), 'text'),
      prop('border_collapse', 'border-collapse', lm('labels.css-properties.border-collapse'), 'select', BORDER_COLLAPSE_OPTS),
      prop('border_spacing', 'border-spacing', lm('labels.css-properties.border-spacing'), 'unit'),
      prop('table_layout', 'table-layout', lm('labels.css-properties.table-layout'), 'select', TABLE_LAYOUT_OPTS),
      prop('caption_side', 'caption-side', lm('labels.css-properties.caption-side'), 'select', CAPTION_SIDE_OPTS),
    ],
  },

  // 9b. Tab bar: the tab_ keys a tabs module reads (src/modules/layout/tabs-look.ts); virtual; every per-tab (ts) field also shows in Hover, Active tab and Disabled tab. The properties of a sub-group sit together.
  {
    id: 'tabs-bar',
    name: lm('labels.css-properties.tab-bar'),
    icon: 'mdi:tab',
    modules: ['tabs'],
    properties: [
      tb('tab_disabled_tabs', lm('labels.css-properties.disabled-tabs'), 'tab_list', { help: lm('labels.css-properties.tick-the-tabs-that-cannot-be-opened'), subgroup: 'bar' }),
      tb('tab_bar_position', lm('labels.css-properties.bar-position'), 'segmented', {
        options: [{ label: lm('labels.css-properties.top'), value: 'top' }, { label: lm('labels.css-properties.bottom'), value: 'bottom' }],
        defaultValue: 'top',
        subgroup: 'bar',
      }),
      tb('tab_align', lm('labels.css-properties.tab-alignment'), 'segmented', {
        options: [{ label: lm('labels.css-properties.start'), value: 'start' }, { label: lm('labels.css-properties.centre'), value: 'center' }, { label: lm('labels.css-properties.end'), value: 'end' }, { label: lm('labels.css-properties.stretch'), value: 'stretch' }],
        defaultValue: 'start',
        subgroup: 'bar',
      }),
      tb('tab_bar_background', lm('labels.css-properties.bar-background'), 'color', { subgroup: 'bar' }),
      tb('tab_bar_border_color', lm('labels.css-properties.bar-border-colour'), 'sides', { sides: { cell: 'color' }, subgroup: 'bar' }),
      tb('tab_bar_border_width', lm('labels.css-properties.bar-border-width'), 'sides', { sides: { cell: 'length' }, units: ['px', 'em', 'rem'], subgroup: 'bar' }),
      tb('tab_bar_border_style', lm('labels.css-properties.bar-border-style'), 'sides', { sides: { cell: 'style' }, options: [...BORDER_STYLE_OPTS, { label: lm('labels.css-properties.hidden'), value: 'hidden' }], subgroup: 'bar' }),
      tb('tab_bar_padding', lm('labels.css-properties.bar-padding'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'bar' }),
      tb('tab_gap', lm('labels.css-properties.gap-between-tabs'), 'unit', { units: PCT, subgroup: 'bar' }),
      tb('tab_animation', lm('labels.css-properties.tab-switch-animation'), 'segmented', {
        options: [{ label: lm('labels.css-properties.none'), value: 'none' }, { label: lm('labels.css-properties.fade'), value: 'fade' }, { label: lm('labels.css-properties.slide'), value: 'slide' }],
        defaultValue: 'none',
        help: lm('labels.css-properties.ignored-when-the-viewer-prefers-reduced'),
        subgroup: 'bar',
      }),
      ts('tab_color', lm('labels.css-properties.tab-text-colour'), 'color', { subgroup: 'text' }),
      ts('tab_font_family', lm('labels.css-properties.tab-font-family'), 'font', { subgroup: 'text' }),
      ts('tab_font_size', lm('labels.css-properties.tab-font-size'), 'unit', { units: PCT, subgroup: 'text' }),
      ts('tab_font_weight', lm('labels.css-properties.tab-font-weight'), 'select', { options: FONT_WEIGHT_OPTS.filter((o) => /^(?:normal|bold|[1-9]00)$/.test(o.value)), subgroup: 'text' }),
      ts('tab_text_transform', lm('labels.css-properties.tab-text-transform'), 'select', { options: TEXT_TRANSFORM_OPTS, subgroup: 'text' }),
      ts('tab_letter_spacing', lm('labels.css-properties.tab-letter-spacing'), 'text', { help: lm('labels.css-properties.normal-or-one-length-for-example-0-05em'), subgroup: 'text' }),
      ts('tab_border_color', lm('labels.css-properties.tab-border-colour'), 'sides', { sides: { cell: 'color' }, subgroup: 'border' }),
      ts('tab_border_width', lm('labels.css-properties.tab-border-width'), 'sides', { sides: { cell: 'length' }, units: ['px', 'em', 'rem'], subgroup: 'border' }),
      ts('tab_border_style', lm('labels.css-properties.tab-border-style'), 'sides', { sides: { cell: 'style' }, options: [...BORDER_STYLE_OPTS, { label: lm('labels.css-properties.hidden'), value: 'hidden' }], subgroup: 'border' }),
      ts('tab_radius', lm('labels.css-properties.tab-corner-radius'), 'sides', { sides: { cell: 'length', corners: true }, units: PCT, subgroup: 'border' }),
      ts('tab_padding', lm('labels.css-properties.tab-padding'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'border' }),
      ts('tab_icon_color', lm('labels.css-properties.tab-icon-colour'), 'color', { subgroup: 'icon' }),
      ts('tab_icon_size', lm('labels.css-properties.tab-icon-size'), 'unit', { units: ['px'], subgroup: 'icon' }),
      tb('tab_icon_position', lm('labels.css-properties.tab-icon-position'), 'segmented', {
        options: [{ label: lm('labels.css-properties.left'), value: 'left' }, { label: lm('labels.css-properties.right'), value: 'right' }, { label: lm('labels.css-properties.above'), value: 'above' }, { label: lm('labels.css-properties.below'), value: 'below' }],
        defaultValue: 'left',
        help: lm('labels.css-properties.left-and-right-follow-the-text-direction'),
        subgroup: 'icon',
      }),
      ts('tab_icon_fx', lm('labels.css-properties.tab-icon-animation'), 'icon_anim', { help: lm('labels.css-properties.ignored-when-the-viewer-prefers-reduced'), subgroup: 'icon' }),
      ts('tab_background', lm('labels.css-properties.tab-background'), 'color', { subgroup: 'effects' }),
      ts('tab_opacity', lm('labels.css-properties.tab-opacity'), 'number', { range: [0, 1, 0.1], subgroup: 'effects' }),
      ts('tab_shadow', lm('labels.css-properties.tab-shadow'), 'text', { help: lm('labels.css-properties.none-or-up-to-two-shadows-for-example-0'), subgroup: 'effects' }),
      ts('tab_animations', lm('labels.css-properties.tab-animations'), 'tab_animations', { help: lm('labels.css-properties.plays-on-the-tab-button-the-content-fade'), subgroup: 'effects' }),
    ],
  },

  // 10. Button icon and text: the part keys a button reads (src/utils/button-parts.ts); virtual, so hover and rules carry them
  {
    id: 'button-content',
    name: lm('labels.css-properties.icon-text'),
    icon: 'mdi:format-align-center',
    modules: ['button'],
    properties: [
      bo('icon_position', lm('labels.css-properties.icon-position'), 'segmented', {
        options: [{ label: lm('labels.css-properties.left'), value: 'left' }, { label: lm('labels.css-properties.right'), value: 'right' }, { label: lm('labels.css-properties.above'), value: 'above' }, { label: lm('labels.css-properties.below'), value: 'below' }],
        defaultValue: 'left',
        help: lm('labels.css-properties.left-and-right-follow-the-text-direction'),
      }),
      bo('content_align', lm('labels.css-properties.content-alignment'), 'segmented', {
        options: [{ label: lm('labels.css-properties.start'), value: 'start' }, { label: lm('labels.css-properties.centre'), value: 'center' }, { label: lm('labels.css-properties.end'), value: 'end' }],
        defaultValue: 'center',
      }),
      bo('content_vertical_align', lm('labels.css-properties.vertical-content-alignment'), 'segmented', {
        options: [{ label: lm('labels.css-properties.top'), value: 'start' }, { label: lm('labels.css-properties.centre'), value: 'center' }, { label: lm('labels.css-properties.bottom'), value: 'end' }],
        defaultValue: 'center',
      }),
      bo('icon_size', lm('labels.css-properties.icon-size'), 'unit', { units: LENGTH }),
      bo('icon_gap', lm('labels.css-properties.icon-gap'), 'unit', { units: LENGTH }),
      bo('icon_color', lm('labels.css-properties.icon-colour'), 'color'),
      bo('icon_background', lm('labels.css-properties.icon-background'), 'color'),
      bo('icon_background_shape', lm('labels.css-properties.icon-background-shape'), 'segmented', {
        options: [{ label: lm('labels.css-properties.circle'), value: 'circle' }, { label: lm('labels.css-properties.rounded'), value: 'rounded' }],
        defaultValue: 'circle',
      }),
      bo('label_overflow', lm('labels.css-properties.label-overflow'), 'segmented', {
        options: [{ label: lm('labels.css-properties.wrap'), value: 'wrap' }, { label: lm('labels.css-properties.truncate'), value: 'truncate' }],
        defaultValue: 'wrap',
        help: lm('labels.css-properties.a-truncated-label-ends-in-an-ellipsis'),
        ...LABEL,
      }),
      bo('label_color', lm('labels.css-properties.label-colour'), 'color', LABEL),
      bo('label_font_family', lm('labels.css-properties.label-font-family'), 'font', LABEL),
      bo('label_font_size', lm('labels.css-properties.label-font-size'), 'unit', { ...LABEL, units: PCT }),
      bo('label_font_weight', lm('labels.css-properties.label-font-weight'), 'select', { ...LABEL, options: FONT_WEIGHT_OPTS }),
      bo('label_text_transform', lm('labels.css-properties.label-text-transform'), 'select', { ...LABEL, options: TEXT_TRANSFORM_OPTS }),
      bo('state_position', lm('labels.css-properties.state-position'), 'segmented', {
        options: [{ label: lm('labels.css-properties.beside'), value: 'beside' }, { label: lm('labels.css-properties.below'), value: 'below' }],
        defaultValue: 'beside',
      }),
      bo('state_color', lm('labels.css-properties.state-colour'), 'color'),
      bo('state_font_size', lm('labels.css-properties.state-font-size'), 'unit', { units: PCT }),
    ],
  },
];

/** The Custom CSS field's entry in a design group (it is not a CSS sector). */
export const CUSTOM_CSS_ENTRY = 'custom-css';

export interface DesignGroup {
  id: 'layout' | 'style' | 'effects' | 'advanced';
  name: MessageIndex;
  /** Sector ids in display order (CSS_SECTORS keeps the cascade order); `custom-css` is the Custom CSS field. */
  entries: string[];
  /** Open on first render; a group holding a set value opens regardless. */
  defaultOpen: boolean;
}

/** The Design tab's headed groups, in display order. Every CSS sector belongs to exactly one group. */
export const DESIGN_GROUPS: DesignGroup[] = [
  { id: 'layout', name: lm('labels.css-properties.layout'), entries: ['spacing', 'positioning', 'flexbox', 'grid'], defaultOpen: true },
  { id: 'style', name: lm('labels.css-properties.style'), entries: ['backgrounds', 'borders', 'typography', 'button-content', 'tabs-bar', 'shape', 'value-background'], defaultOpen: true },
  { id: 'effects', name: lm('labels.css-properties.effects'), entries: ['ring', 'transitions'], defaultOpen: false },
  { id: 'advanced', name: lm('labels.css-properties.advanced'), entries: ['lists-tables', CUSTOM_CSS_ENTRY], defaultOpen: false },
];

/** A sector's properties in editor display order: `leading` keys first, then the rest. */
export function displayProperties(sector: CssSector): CssPropertyDef[] {
  const lead = sector.leading || [];
  const first = lead
    .map((k) => sector.properties.find((p) => p.key === k))
    .filter((p): p is CssPropertyDef => !!p);
  return [...first, ...sector.properties.filter((p) => !lead.includes(p.key))];
}
