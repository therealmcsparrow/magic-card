import type { MessageId } from '../contracts/i18n';
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

export type CssPropertyType = 'unit' | 'color' | 'text' | 'select' | 'number' | 'box' | 'image' | 'font' | 'segmented' | 'tab_list' | 'animations' | 'tab_animations' | 'icon_anim' | 'ring' | 'shape' | 'value_bg';

export interface CssPropertyOption {
  label: MessageId;
  value: string;
  /** Select options with a group render inside an <optgroup>. */
  group?: string;
}

export interface CssPropertyDef {
  key: string;
  /** CSS property written by designToStyle; empty for card options that are not CSS (`virtual`). */
  cssProperty: string;
  label: MessageId;
  type: CssPropertyType;
  options?: CssPropertyOption[];
  /** Not a CSS property: the card reads the key itself (animation preset, border length, ...). */
  virtual?: boolean;
  /** Label of the select's empty option (default "Not set"). */
  emptyLabel?: MessageId;
  /** Help line under the field. */
  help?: MessageId;
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
  /** The collapsible group of the Tab bar sector this field sits in (see TAB_SUBGROUPS). */
  subgroup?: string;
  /** Number field bounds: min, max and step. */
  range?: [number, number, number];
}

export interface CssSector {
  id: string;
  name: MessageId;
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
  label: MessageId,
  type: CssPropertyType,
  options?: Array<{ label: MessageId; value: string }>,
): CssPropertyDef {
  return { key, cssProperty, label, type, ...(options ? { options } : {}) };
}

/** A design option the card handles itself (no CSS property of its own). */
function option(
  key: string,
  label: MessageId,
  type: CssPropertyType,
  extra: Partial<Pick<CssPropertyDef, 'options' | 'emptyLabel' | 'help' | 'defaultValue' | 'units' | 'hover' | 'hideForVariant' | 'baseOnly' | 'tabState' | 'subgroup' | 'range'>> = {},
): CssPropertyDef {
  return { key, cssProperty: '', label, type, virtual: true, ...extra };
}
/** A bar-wide tab key: a tabs module reads it from its design and its rules (not from a tab state or the hover design). */
const tb = (key: string, label: MessageId, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => option(key, label, type, extra);
/** A per-tab key that every tab state (active, disabled, hover) can also set. */
const ts = (key: string, label: MessageId, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => tb(key, label, type, { hover: true, tabState: true, ...extra });
/** A button part key: allowed in the hover design and in rules. */
const bo = (key: string, label: MessageId, type: CssPropertyType, extra: Parameters<typeof option>[3] = {}) => option(key, label, type, { hover: true, ...extra });
const LABEL = { hideForVariant: ['icon-only'] };
const LENGTH = ['px', 'em', 'rem'];
const PCT = [...LENGTH, '%'];
const TAB_LENGTHS_HELP = lm('One to four lengths, for example 4px 8px.');

/** The collapsible groups of the Tab bar sector, in display order: Bar is bar-wide, the others hold per-tab fields. */
export const TAB_SUBGROUPS: Array<{ id: string; name: MessageId }> = [
  { id: 'bar', name: lm('Bar') },
  { id: 'text', name: lm('Text') },
  { id: 'border', name: lm('Border') },
  { id: 'icon', name: lm('Icon') },
  { id: 'effects', name: lm('Effects') },
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
    name: lm('Spacing & box model'),
    icon: 'mdi:arrow-expand-all',
    leading: ['padding', 'margin', 'width', 'min_height'],
    properties: [
      prop('margin', 'margin', lm('Margin'), 'box'),
      prop('padding', 'padding', lm('Padding'), 'box'),
      prop('width', 'width', lm('Width'), 'unit'),
      prop('height', 'height', lm('Height'), 'unit'),
      prop('min_width', 'min-width', lm('Min width'), 'unit'),
      prop('min_height', 'min-height', lm('Min height'), 'unit'),
      prop('max_width', 'max-width', lm('Max width'), 'unit'),
      prop('max_height', 'max-height', lm('Max height'), 'unit'),
      prop('box_sizing', 'box-sizing', lm('Box sizing'), 'select', BOX_SIZING_OPTS),
    ],
  },

  // 2. Borders & Outlines
  {
    id: 'borders',
    name: lm('Borders & outlines'),
    icon: 'mdi:border-all',
    leading: ['border_radius', 'border_width', 'border_style', 'border_color', 'border_length', 'border_length_align', 'border_length_sides', 'box_shadow'],
    properties: [
      prop('border', 'border', lm('Border'), 'text'),
      prop('border_top', 'border-top', lm('Border top'), 'text'),
      prop('border_right', 'border-right', lm('Border right'), 'text'),
      prop('border_bottom', 'border-bottom', lm('Border bottom'), 'text'),
      prop('border_left', 'border-left', lm('Border left'), 'text'),
      prop('border_width', 'border-width', lm('Border width'), 'unit'),
      { ...prop('border_style', 'border-style', lm('Border style'), 'select', BORDER_STYLE_OPTS), emptyLabel: lm('Solid when width is set') },
      prop('border_color', 'border-color', lm('Border colour'), 'color'),
      option('border_length', lm('Border length'), 'unit', {
        units: ['%', 'px'],
        help: lm('Shorten the border line, e.g. 40% for a short accent line.'),
      }),
      option('border_length_align', lm('Alignment'), 'segmented', {
        defaultValue: 'center',
        options: [
          { label: lm('Start'), value: 'start' },
          { label: lm('Centre'), value: 'center' },
          { label: lm('End'), value: 'end' },
        ],
      }),
      option('border_length_sides', lm('Sides'), 'select', {
        emptyLabel: lm('All'),
        options: [
          { label: lm('Top'), value: 'top' },
          { label: lm('Right'), value: 'right' },
          { label: lm('Bottom'), value: 'bottom' },
          { label: lm('Left'), value: 'left' },
        ],
      }),
      prop('border_radius', 'border-radius', lm('Border radius'), 'box'),
      prop('outline', 'outline', lm('Outline'), 'text'),
      prop('outline_width', 'outline-width', lm('Outline width'), 'unit'),
      prop('outline_style', 'outline-style', lm('Outline style'), 'select', OUTLINE_STYLE_OPTS),
      prop('outline_color', 'outline-color', lm('Outline colour'), 'color'),
      prop('outline_offset', 'outline-offset', lm('Outline offset'), 'unit'),
      prop('box_shadow', 'box-shadow', lm('Box shadow'), 'text'),
    ],
  },

  // 2b. Shape: an outline shape instead of the border radius (mc-shape-editor, src/utils/shape-path.ts)
  {
    id: 'shape',
    name: lm('Shape'),
    icon: 'mdi:hexagon-outline',
    properties: [option('shape', lm('Shape'), 'shape')],
  },

  // 2c. Value background: a tank fill or history sparkline behind the content (mc-value-bg-editor)
  {
    id: 'value-background',
    name: lm('Value background'),
    icon: 'mdi:chart-areaspline-variant',
    properties: [option('value_background', lm('Value background'), 'value_bg')],
  },

  // 3. Positioning & Layout
  {
    id: 'positioning',
    name: lm('Positioning & layout'),
    icon: 'mdi:page-layout-body',
    properties: [
      prop('position', 'position', lm('Position'), 'select', POSITION_OPTS),
      prop('top', 'top', lm('Top'), 'unit'),
      prop('right', 'right', lm('Right'), 'unit'),
      prop('bottom', 'bottom', lm('Bottom'), 'unit'),
      prop('left', 'left', lm('Left'), 'unit'),
      prop('inset', 'inset', lm('Inset'), 'unit'),
      prop('display', 'display', lm('Display'), 'select', DISPLAY_OPTS),
      prop('visibility', 'visibility', lm('Visibility'), 'select', VISIBILITY_OPTS),
      prop('opacity', 'opacity', lm('Opacity'), 'text'),
      prop('z_index', 'z-index', lm('Z-index'), 'number'),
      prop('overflow', 'overflow', lm('Overflow'), 'select', OVERFLOW_OPTS),
      prop('overflow_x', 'overflow-x', lm('Overflow X'), 'select', OVERFLOW_OPTS),
      prop('overflow_y', 'overflow-y', lm('Overflow Y'), 'select', OVERFLOW_OPTS),
      prop('float', 'float', lm('Float'), 'select', [
        { label: lm('None'), value: 'none' },
        { label: lm('Left'), value: 'left' },
        { label: lm('Right'), value: 'right' },
      ]),
      prop('clear', 'clear', lm('Clear'), 'select', [
        { label: lm('None'), value: 'none' },
        { label: lm('Left'), value: 'left' },
        { label: lm('Right'), value: 'right' },
        { label: lm('Both'), value: 'both' },
      ]),
      prop('cursor', 'cursor', lm('Cursor'), 'select', CURSOR_OPTS),
      prop('pointer_events', 'pointer-events', lm('Pointer events'), 'select', [
        { label: lm('Auto'), value: 'auto' },
        { label: lm('None'), value: 'none' },
      ]),
    ],
  },

  // 4. Typography
  {
    id: 'typography',
    name: lm('Typography'),
    icon: 'mdi:format-font',
    leading: ['color', 'font_family', 'font_weight', 'font_size', 'text_transform'],
    properties: [
      prop('font_family', 'font-family', lm('Font family'), 'font'),
      prop('font_size', 'font-size', lm('Font size'), 'unit'),
      prop('font_weight', 'font-weight', lm('Font weight'), 'select', FONT_WEIGHT_OPTS),
      prop('font_style', 'font-style', lm('Font style'), 'select', FONT_STYLE_OPTS),
      prop('font_variant', 'font-variant', lm('Font variant'), 'text'),
      prop('color', 'color', lm('Colour'), 'color'),
      prop('text_align', 'text-align', lm('Text align'), 'select', TEXT_ALIGN_OPTS),
      prop('text_decoration', 'text-decoration', lm('Text decoration'), 'select', TEXT_DECORATION_OPTS),
      prop('text_transform', 'text-transform', lm('Text transform'), 'select', TEXT_TRANSFORM_OPTS),
      prop('text_indent', 'text-indent', lm('Text indent'), 'unit'),
      prop('text_overflow', 'text-overflow', lm('Text overflow'), 'select', TEXT_OVERFLOW_OPTS),
      prop('text_shadow', 'text-shadow', lm('Text shadow'), 'text'),
      prop('line_height', 'line-height', lm('Line height'), 'text'),
      prop('letter_spacing', 'letter-spacing', lm('Letter spacing'), 'unit'),
      prop('word_spacing', 'word-spacing', lm('Word spacing'), 'unit'),
      prop('white_space', 'white-space', lm('White space'), 'select', WHITE_SPACE_OPTS),
      prop('word_break', 'word-break', lm('Word break'), 'select', WORD_BREAK_OPTS),
      prop('overflow_wrap', 'overflow-wrap', lm('Overflow wrap'), 'select', OVERFLOW_WRAP_OPTS),
    ],
  },

  // 5. Backgrounds
  {
    id: 'backgrounds',
    name: lm('Backgrounds'),
    icon: 'mdi:image-area',
    properties: [
      prop('background', 'background', lm('Background'), 'text'),
      prop('background_color', 'background-color', lm('Background colour'), 'color'),
      prop('background_image', 'background-image', lm('Background image'), 'image'),
      prop('background_position', 'background-position', lm('Background position'), 'text'),
      prop('background_size', 'background-size', lm('Background size'), 'select', BG_SIZE_OPTS),
      prop('background_repeat', 'background-repeat', lm('Background repeat'), 'select', BG_REPEAT_OPTS),
      prop('background_attachment', 'background-attachment', lm('Background attachment'), 'select', BG_ATTACHMENT_OPTS),
      prop('background_clip', 'background-clip', lm('Background clip'), 'select', BG_CLIP_OPTS),
      prop('background_origin', 'background-origin', lm('Background origin'), 'select', BG_CLIP_OPTS),
      prop('backdrop_filter', 'backdrop-filter', lm('Backdrop filter'), 'text'),
    ],
  },

  // 6. Flexbox
  {
    id: 'flexbox',
    name: lm('Flexbox'),
    icon: 'mdi:view-column',
    properties: [
      prop('flex_direction', 'flex-direction', lm('Direction'), 'select', FLEX_DIRECTION_OPTS),
      prop('flex_wrap', 'flex-wrap', lm('Wrap'), 'select', FLEX_WRAP_OPTS),
      prop('justify_content', 'justify-content', lm('Justify content'), 'select', JUSTIFY_CONTENT_OPTS),
      prop('align_items', 'align-items', lm('Align items'), 'select', ALIGN_ITEMS_OPTS),
      prop('align_content', 'align-content', lm('Align content'), 'select', ALIGN_CONTENT_OPTS),
      prop('gap', 'gap', lm('Gap'), 'unit'),
      prop('row_gap', 'row-gap', lm('Row gap'), 'unit'),
      prop('column_gap', 'column-gap', lm('Column gap'), 'unit'),
      prop('flex', 'flex', lm('Flex'), 'text'),
      prop('flex_grow', 'flex-grow', lm('Flex grow'), 'number'),
      prop('flex_shrink', 'flex-shrink', lm('Flex shrink'), 'number'),
      prop('flex_basis', 'flex-basis', lm('Flex basis'), 'unit'),
      prop('align_self', 'align-self', lm('Align self'), 'select', ALIGN_SELF_OPTS),
      prop('order', 'order', lm('Order'), 'number'),
    ],
  },

  // 7. CSS Grid
  {
    id: 'grid',
    name: lm('CSS grid'),
    icon: 'mdi:grid',
    properties: [
      prop('grid_template_columns', 'grid-template-columns', lm('Template columns'), 'text'),
      prop('grid_template_rows', 'grid-template-rows', lm('Template rows'), 'text'),
      prop('grid_template_areas', 'grid-template-areas', lm('Template areas'), 'text'),
      prop('grid_auto_columns', 'grid-auto-columns', lm('Auto columns'), 'text'),
      prop('grid_auto_rows', 'grid-auto-rows', lm('Auto rows'), 'text'),
      prop('grid_auto_flow', 'grid-auto-flow', lm('Auto flow'), 'select', GRID_AUTO_FLOW_OPTS),
      prop('grid_column', 'grid-column', lm('Column'), 'text'),
      prop('grid_row', 'grid-row', lm('Row'), 'text'),
      prop('grid_area', 'grid-area', lm('Area'), 'text'),
    ],
  },

  // 8. Transitions & Animations
  {
    id: 'transitions',
    name: lm('Transitions & animations'),
    icon: 'mdi:animation',
    leading: ['animations'],
    properties: [
      // the list of preset animations (mc-animation-list); legacy single keys are read into it
      option('animations', lm('Animations'), 'animations'),
      prop('transition', 'transition', lm('Transition'), 'text'),
      prop('transition_property', 'transition-property', lm('Transition property'), 'text'),
      { ...prop('transition_duration', 'transition-duration', lm('Transition duration'), 'unit'), units: ['s', 'ms'] },
      prop('transition_timing_function', 'transition-timing-function', lm('Transition timing'), 'text'),
      { ...prop('transition_delay', 'transition-delay', lm('Transition delay'), 'unit'), units: ['s', 'ms'] },
      prop('transform', 'transform', lm('Transform'), 'text'),
      prop('transform_origin', 'transform-origin', lm('Transform origin'), 'text'),
      prop('animation_name', 'animation-name', lm('Animation name'), 'text'),
      { ...prop('animation_duration', 'animation-duration', lm('Animation duration'), 'unit'), units: ['s', 'ms'] },
      prop('animation_timing_function', 'animation-timing-function', lm('Animation timing'), 'text'),
      { ...prop('animation_delay', 'animation-delay', lm('Animation delay'), 'unit'), units: ['s', 'ms'] },
      prop('animation_iteration_count', 'animation-iteration-count', lm('Iteration count'), 'text'),
      prop('animation_direction', 'animation-direction', lm('Animation direction'), 'select', ANIMATION_DIRECTION_OPTS),
      prop('animation_fill_mode', 'animation-fill-mode', lm('Fill mode'), 'select', ANIMATION_FILL_OPTS),
      prop('animation_play_state', 'animation-play-state', lm('Play state'), 'select', ANIMATION_PLAY_OPTS),
      prop('filter', 'filter', lm('Filter'), 'text'),
    ],
  },

  // 8b. Ring: an SVG outline following the border radius (mc-ring-editor, src/utils/ring.ts)
  {
    id: 'ring',
    name: lm('Ring'),
    icon: 'mdi:circle-double',
    properties: [option('ring', lm('Ring'), 'ring')],
  },

  // 9. Lists & Tables
  {
    id: 'lists-tables',
    name: lm('Lists & tables'),
    icon: 'mdi:format-list-bulleted',
    properties: [
      prop('list_style', 'list-style', lm('List style'), 'text'),
      prop('list_style_type', 'list-style-type', lm('List style type'), 'select', LIST_STYLE_TYPE_OPTS),
      prop('list_style_position', 'list-style-position', lm('List style position'), 'select', LIST_STYLE_POSITION_OPTS),
      prop('list_style_image', 'list-style-image', lm('List style image'), 'text'),
      prop('border_collapse', 'border-collapse', lm('Border collapse'), 'select', BORDER_COLLAPSE_OPTS),
      prop('border_spacing', 'border-spacing', lm('Border spacing'), 'unit'),
      prop('table_layout', 'table-layout', lm('Table layout'), 'select', TABLE_LAYOUT_OPTS),
      prop('caption_side', 'caption-side', lm('Caption side'), 'select', CAPTION_SIDE_OPTS),
    ],
  },

  // 9b. Tab bar: the tab_ keys a tabs module reads (src/modules/layout/tabs-look.ts); virtual; every per-tab (ts) field also shows in Hover, Active tab and Disabled tab. The properties of a sub-group sit together.
  {
    id: 'tabs-bar',
    name: lm('Tab bar'),
    icon: 'mdi:tab',
    modules: ['tabs'],
    properties: [
      tb('tab_disabled_tabs', lm('Disabled tabs'), 'tab_list', { help: lm('Tick the tabs that cannot be opened.'), subgroup: 'bar' }),
      tb('tab_bar_position', lm('Bar position'), 'segmented', {
        options: [{ label: lm('Top'), value: 'top' }, { label: lm('Bottom'), value: 'bottom' }],
        defaultValue: 'top',
        subgroup: 'bar',
      }),
      tb('tab_align', lm('Tab alignment'), 'segmented', {
        options: [{ label: lm('Start'), value: 'start' }, { label: lm('Centre'), value: 'center' }, { label: lm('End'), value: 'end' }, { label: lm('Stretch'), value: 'stretch' }],
        defaultValue: 'start',
        subgroup: 'bar',
      }),
      tb('tab_bar_background', lm('Bar background'), 'color', { subgroup: 'bar' }),
      tb('tab_bar_border_color', lm('Bar border colour'), 'color', { subgroup: 'bar' }),
      tb('tab_bar_border_width', lm('Bar border width'), 'unit', { units: ['px'], subgroup: 'bar' }),
      tb('tab_bar_padding', lm('Bar padding'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'bar' }),
      tb('tab_gap', lm('Gap between tabs'), 'unit', { units: PCT, subgroup: 'bar' }),
      tb('tab_animation', lm('Tab switch animation'), 'segmented', {
        options: [{ label: lm('None'), value: 'none' }, { label: lm('Fade'), value: 'fade' }, { label: lm('Slide'), value: 'slide' }],
        defaultValue: 'none',
        help: lm('Ignored when the viewer prefers reduced motion.'),
        subgroup: 'bar',
      }),
      ts('tab_color', lm('Tab text colour'), 'color', { subgroup: 'text' }),
      ts('tab_font_family', lm('Tab font family'), 'font', { subgroup: 'text' }),
      ts('tab_font_size', lm('Tab font size'), 'unit', { units: PCT, subgroup: 'text' }),
      ts('tab_font_weight', lm('Tab font weight'), 'select', { options: FONT_WEIGHT_OPTS.filter((o) => /^(?:normal|bold|[1-9]00)$/.test(o.value)), subgroup: 'text' }),
      ts('tab_text_transform', lm('Tab text transform'), 'select', { options: TEXT_TRANSFORM_OPTS, subgroup: 'text' }),
      ts('tab_letter_spacing', lm('Tab letter spacing'), 'text', { help: lm('normal, or one length, for example 0.05em.'), subgroup: 'text' }),
      ts('tab_border_color', lm('Tab border colour'), 'color', { subgroup: 'border' }),
      ts('tab_border_width', lm('Tab border width'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'border' }),
      ts('tab_border_style', lm('Tab border style'), 'select', { options: BORDER_STYLE_OPTS.filter((o) => /^(?:none|solid|dashed|dotted|double)$/.test(o.value)), subgroup: 'border' }),
      ts('tab_radius', lm('Tab corner radius'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'border' }),
      ts('tab_padding', lm('Tab padding'), 'text', { help: TAB_LENGTHS_HELP, subgroup: 'border' }),
      ts('tab_icon_color', lm('Tab icon colour'), 'color', { subgroup: 'icon' }),
      ts('tab_icon_size', lm('Tab icon size'), 'unit', { units: ['px'], subgroup: 'icon' }),
      tb('tab_icon_position', lm('Tab icon position'), 'segmented', {
        options: [{ label: lm('Left'), value: 'left' }, { label: lm('Right'), value: 'right' }, { label: lm('Above'), value: 'above' }, { label: lm('Below'), value: 'below' }],
        defaultValue: 'left',
        help: lm('Left and right follow the text direction.'),
        subgroup: 'icon',
      }),
      ts('tab_icon_fx', lm('Tab icon animation'), 'icon_anim', { help: lm('Ignored when the viewer prefers reduced motion.'), subgroup: 'icon' }),
      ts('tab_background', lm('Tab background'), 'color', { subgroup: 'effects' }),
      ts('tab_opacity', lm('Tab opacity'), 'number', { range: [0, 1, 0.1], subgroup: 'effects' }),
      ts('tab_shadow', lm('Tab shadow'), 'text', { help: lm('none, or up to two shadows, for example 0 2px 6px rgba(0, 0, 0, .25).'), subgroup: 'effects' }),
      ts('tab_animations', lm('Tab animations'), 'tab_animations', { help: lm('Plays on the tab button. The content fade or slide is set under Bar.'), subgroup: 'effects' }),
    ],
  },

  // 10. Button icon and text: the part keys a button reads (src/utils/button-parts.ts); virtual, so hover and rules carry them
  {
    id: 'button-content',
    name: lm('Icon & text'),
    icon: 'mdi:format-align-center',
    modules: ['button'],
    properties: [
      bo('icon_position', lm('Icon position'), 'segmented', {
        options: [{ label: lm('Left'), value: 'left' }, { label: lm('Right'), value: 'right' }, { label: lm('Above'), value: 'above' }, { label: lm('Below'), value: 'below' }],
        defaultValue: 'left',
        help: lm('Left and right follow the text direction.'),
      }),
      bo('content_align', lm('Content alignment'), 'segmented', {
        options: [{ label: lm('Start'), value: 'start' }, { label: lm('Centre'), value: 'center' }, { label: lm('End'), value: 'end' }],
        defaultValue: 'center',
      }),
      bo('content_vertical_align', lm('Vertical content alignment'), 'segmented', {
        options: [{ label: lm('Top'), value: 'start' }, { label: lm('Centre'), value: 'center' }, { label: lm('Bottom'), value: 'end' }],
        defaultValue: 'center',
      }),
      bo('icon_size', lm('Icon size'), 'unit', { units: LENGTH }),
      bo('icon_gap', lm('Icon gap'), 'unit', { units: LENGTH }),
      bo('icon_color', lm('Icon colour'), 'color'),
      bo('icon_background', lm('Icon background'), 'color'),
      bo('icon_background_shape', lm('Icon background shape'), 'segmented', {
        options: [{ label: lm('Circle'), value: 'circle' }, { label: lm('Rounded'), value: 'rounded' }],
        defaultValue: 'circle',
      }),
      bo('label_overflow', lm('Label overflow'), 'segmented', {
        options: [{ label: lm('Wrap'), value: 'wrap' }, { label: lm('Truncate'), value: 'truncate' }],
        defaultValue: 'wrap',
        help: lm('A truncated label ends in an ellipsis and shows in full as a tooltip.'),
        ...LABEL,
      }),
      bo('label_color', lm('Label colour'), 'color', LABEL),
      bo('label_font_family', lm('Label font family'), 'font', LABEL),
      bo('label_font_size', lm('Label font size'), 'unit', { ...LABEL, units: PCT }),
      bo('label_font_weight', lm('Label font weight'), 'select', { ...LABEL, options: FONT_WEIGHT_OPTS }),
      bo('label_text_transform', lm('Label text transform'), 'select', { ...LABEL, options: TEXT_TRANSFORM_OPTS }),
      bo('state_position', lm('State position'), 'segmented', {
        options: [{ label: lm('Beside'), value: 'beside' }, { label: lm('Below'), value: 'below' }],
        defaultValue: 'beside',
      }),
      bo('state_color', lm('State colour'), 'color'),
      bo('state_font_size', lm('State font size'), 'unit', { units: PCT }),
    ],
  },
];

/** The Custom CSS field's entry in a design group (it is not a CSS sector). */
export const CUSTOM_CSS_ENTRY = 'custom-css';

export interface DesignGroup {
  id: 'layout' | 'style' | 'effects' | 'advanced';
  name: MessageId;
  /** Sector ids in display order (CSS_SECTORS keeps the cascade order); `custom-css` is the Custom CSS field. */
  entries: string[];
  /** Open on first render; a group holding a set value opens regardless. */
  defaultOpen: boolean;
}

/** The Design tab's headed groups, in display order. Every CSS sector belongs to exactly one group. */
export const DESIGN_GROUPS: DesignGroup[] = [
  { id: 'layout', name: lm('Layout'), entries: ['spacing', 'positioning', 'flexbox', 'grid'], defaultOpen: true },
  { id: 'style', name: lm('Style'), entries: ['backgrounds', 'borders', 'typography', 'button-content', 'tabs-bar', 'shape', 'value-background'], defaultOpen: true },
  { id: 'effects', name: lm('Effects'), entries: ['ring', 'transitions'], defaultOpen: false },
  { id: 'advanced', name: lm('Advanced'), entries: ['lists-tables', CUSTOM_CSS_ENTRY], defaultOpen: false },
];

/** A sector's properties in editor display order: `leading` keys first, then the rest. */
export function displayProperties(sector: CssSector): CssPropertyDef[] {
  const lead = sector.leading || [];
  const first = lead
    .map((k) => sector.properties.find((p) => p.key === k))
    .filter((p): p is CssPropertyDef => !!p);
  return [...first, ...sector.properties.filter((p) => !lead.includes(p.key))];
}
