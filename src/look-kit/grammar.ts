// Key tables of the look grammar (contract look-grammar 2.1.0): one LookKeyTable per table name, over its types.ts interface.
// Plus the css declaration and font-family readers the parser and the traits share. Pure TS, no DOM.

import type {
  AnimationConfig,
  ColorRange,
  DesignConfig,
  IconColorsConfig,
  IconFillConfig,
  IconFxConfig,
  ImageModuleConfig,
  MagicCardConfig,
  RingConfig,
  SeasonalConfig,
  SeasonalHoliday,
  ShapeOptions,
  TabStateDesign,
  ValueBackgroundConfig,
  ValueBound,
} from '../types';
import {
  LOOK_CARD_KEYS,
  LOOK_FONT_GENERICS,
  LOOK_FONT_NAME_RE,
  LOOK_MODULE_COMMON_KEYS,
  LOOK_MODULE_KEYS,
  type LookKeyTable,
  type LookTableName,
} from '../contracts/look-grammar';

type ImageColors = NonNullable<ImageModuleConfig['colors']>;
type TabIconFxConfig = Pick<IconFxConfig, 'device' | 'draw' | 'draw_duration'>;
type ValueBoundObject = Exclude<ValueBound, number>;
type ModuleLookKey = (typeof LOOK_MODULE_COMMON_KEYS)[number] | (typeof LOOK_MODULE_KEYS)[keyof typeof LOOK_MODULE_KEYS][number];

/** The interface each table is checked against; a key added to one fails tsc until it is classified. */
interface LookTableShapes {
  CardLook: Pick<MagicCardConfig, (typeof LOOK_CARD_KEYS)[number]>;
  ModuleLook: Record<ModuleLookKey, unknown>;
  DesignConfig: DesignConfig;
  TabStateDesign: TabStateDesign;
  AnimationConfig: AnimationConfig;
  RingConfig: RingConfig;
  ValueBoundObject: ValueBoundObject;
  ShapeOptions: ShapeOptions;
  ValueBackgroundConfig: ValueBackgroundConfig;
  SeasonalConfig: SeasonalConfig;
  SeasonalCalendar: Partial<Record<SeasonalHoliday, string | false>>;
  IconFxConfig: IconFxConfig;
  TabIconFxConfig: TabIconFxConfig;
  IconFillConfig: IconFillConfig;
  IconColorsConfig: IconColorsConfig;
  ImageColors: ImageColors;
  ColorRange: ColorRange;
}

export const LOOK_KEY_TABLES: { [N in LookTableName]: LookKeyTable<LookTableShapes[N]> } = {
  CardLook: {
    background: 'value',
    border_radius: 'value',
    padding: 'value',
    border_width: 'value',
    border_style: 'value',
    border_color: 'value',
    opacity: 'value',
    backdrop_filter: 'value',
    margin: 'value',
    box_shadow: 'value',
    card_height: 'value',
    overflow: 'value',
    shape: 'value',
    shape_options: { object: 'ShapeOptions' },
    ring: { object: 'RingConfig' },
    value_background: { object: 'ValueBackgroundConfig' },
    pause_button: 'value',
    pause_button_corner: 'value',
    layers_low_power: 'value',
    hover: { object: 'DesignConfig' },
    seasonal: { value: true, object: 'SeasonalConfig' },
    css: 'value',
  },
  ModuleLook: {
    design: { object: 'DesignConfig' },
    size: 'value',
    icon_color: 'value',
    icon_fx: { object: 'IconFxConfig' },
    bar_height: 'value',
    bar_color: 'value',
    bar_background: 'value',
    severity: { array: 'ColorRange' },
    line_color: 'value',
    line_width: 'value',
    fill: 'value',
    fill_color: 'value',
    slider_color: 'value',
    track_color: 'value',
    slider_color_to: 'value',
    fill_mode: 'value',
    track_style: 'value',
    track_thickness: 'value',
    track_radius: 'value',
    segments: 'value',
    segment_gap: 'value',
    glass_blur: 'value',
    icon_position: 'value',
    thumb: 'value',
    thumb_size: 'value',
    thumb_border: 'value',
    thumb_border_color: 'value',
    thumb_glow: 'value',
    value_position: 'value',
    ticks: 'value',
    tick_every: 'value',
    show_limits: 'value',
    track_shape: 'value',
    track_shape_options: { object: 'ShapeOptions' },
    button_style: 'value',
    fit: 'value',
    aspect_ratio: 'value',
    colors: { object: 'ImageColors' },
  },
  DesignConfig: {
    font_size: 'value',
    font_weight: 'value',
    font_family: 'value',
    line_height: 'value',
    text_align: 'value',
    text_transform: 'value',
    letter_spacing: 'value',
    color: 'value',
    background: 'value',
    opacity: 'value',
    padding: 'value',
    margin: 'value',
    border: 'value',
    border_radius: 'value',
    border_color: 'value',
    border_length: 'value',
    border_length_align: 'value',
    border_length_sides: 'value',
    box_shadow: 'value',
    text_shadow: 'value',
    width: 'value',
    height: 'value',
    min_width: 'value',
    min_height: 'value',
    max_width: 'value',
    max_height: 'value',
    overflow: 'value',
    flex: 'value',
    filter: 'value',
    backdrop_filter: 'value',
    transform: 'value',
    transition: 'value',
    animation: 'drop',
    animations: { array: 'AnimationConfig' },
    animation_preset: 'drop',
    animation_target: 'drop',
    animation_speed: 'drop',
    animation_trigger: 'drop',
    animation_state: 'drop',
    animation_color: 'drop',
    ring: { object: 'RingConfig' },
    shape: 'value',
    shape_options: { object: 'ShapeOptions' },
    value_background: { object: 'ValueBackgroundConfig' },
    icon_position: 'value',
    content_align: 'value',
    content_vertical_align: 'value',
    icon_size: 'value',
    icon_gap: 'value',
    label_overflow: 'value',
    state_position: 'value',
    icon_color: 'value',
    label_color: 'value',
    state_color: 'value',
    icon_background: 'value',
    icon_background_shape: 'value',
    label_font_family: 'value',
    label_font_size: 'value',
    label_font_weight: 'value',
    label_text_transform: 'value',
    state_font_size: 'value',
    tab_bar_background: 'value',
    tab_bar_border_width: 'value',
    tab_bar_border_style: 'value',
    tab_bar_border_color: 'value',
    tab_bar_padding: 'value',
    tab_bar_position: 'value',
    tab_align: 'value',
    tab_gap: 'value',
    tab_color: 'value',
    tab_background: 'value',
    tab_active_color: 'value',
    tab_active_background: 'value',
    tab_indicator_color: 'value',
    tab_border_width: 'value',
    tab_border_style: 'value',
    tab_border_color: 'value',
    tab_letter_spacing: 'value',
    tab_shadow: 'value',
    tab_icon_color: 'value',
    tab_animations: { array: 'AnimationConfig' },
    tab_icon_fx: { object: 'TabIconFxConfig' },
    tab_radius: 'value',
    tab_padding: 'value',
    tab_font_family: 'value',
    tab_font_size: 'value',
    tab_font_weight: 'value',
    tab_text_transform: 'value',
    tab_icon_position: 'value',
    tab_icon_size: 'value',
    tab_animation: 'value',
    tab_opacity: 'value',
    tab_active: { object: 'TabStateDesign' },
    tab_disabled: { object: 'TabStateDesign' },
    tab_disabled_tabs: 'drop',
    hover: { object: 'DesignConfig' },
    css: 'value',
    conditional: 'drop',
  },
  TabStateDesign: {
    tab_color: 'value',
    tab_background: 'value',
    tab_border_width: 'value',
    tab_border_style: 'value',
    tab_border_color: 'value',
    tab_radius: 'value',
    tab_padding: 'value',
    tab_font_family: 'value',
    tab_font_size: 'value',
    tab_font_weight: 'value',
    tab_text_transform: 'value',
    tab_letter_spacing: 'value',
    tab_shadow: 'value',
    tab_icon_size: 'value',
    tab_icon_color: 'value',
    tab_opacity: 'value',
    tab_animations: { array: 'AnimationConfig' },
    tab_icon_fx: { object: 'TabIconFxConfig' },
  },
  AnimationConfig: {
    id: 'drop',
    preset: 'value',
    target: 'value',
    trigger: 'value',
    trigger_entity: 'drop',
    state: 'drop',
    color: 'value',
    duration: 'value',
    delay: 'value',
    easing: 'value',
    iterations: 'value',
    direction: 'value',
    intensity: 'value',
    strength: 'value',
    decorations: 'value',
    entity: 'drop',
    library_icon: 'drop',
    icon_style: 'drop',
  },
  RingConfig: {
    mode: 'value',
    entity: 'drop',
    attribute: 'drop',
    min: { value: true, object: 'ValueBoundObject' },
    max: { value: true, object: 'ValueBoundObject' },
    timer_fill: 'value',
    thresholds: { array: 'ColorRange' },
    transition: 'value',
    animation: 'value',
    length: 'value',
    speed: 'value',
    width: 'value',
    color: 'value',
    track_color: 'value',
    track_opacity: 'value',
    start: 'value',
    direction: 'value',
    linecap: 'value',
    glow: 'value',
    position: 'value',
    trigger: 'drop',
    trigger_entity: 'drop',
    state: 'drop',
  },
  ValueBoundObject: { entity: 'drop', attribute: 'drop' },
  ShapeOptions: {
    corner: 'value',
    corner_type: 'value',
    corners: 'drop',
    smoothing: 'value',
    points: 'drop',
    padding: 'drop',
    ref: 'drop',
    edge: 'value',
    amplitude: 'value',
    waves: 'value',
    seed: 'value',
    wobble: 'value',
    animate: 'value',
    phase: 'drop',
  },
  ValueBackgroundConfig: {
    type: 'value',
    entity: 'drop',
    attribute: 'drop',
    min: 'value',
    max: 'value',
    color: 'value',
    opacity: 'value',
    direction: 'value',
    wave: 'value',
    hours: 'value',
    line_width: 'value',
    area: 'value',
    smoothing: 'value',
  },
  SeasonalConfig: {
    scene: 'value',
    layer: 'drop',
    intensity: 'value',
    decorations: 'value',
    entity: 'drop',
    weather_entity: 'drop',
    hemisphere: 'value',
    calendar: { object: 'SeasonalCalendar' },
    combine: { array: 'value' },
  },
  SeasonalCalendar: { christmas: 'value', new_year: 'value', valentine: 'value', easter: 'value', halloween: 'value' },
  IconFxConfig: {
    fill: { object: 'IconFillConfig' },
    device: 'value',
    draw: 'value',
    draw_duration: 'value',
    morph: 'value',
    colors: { object: 'IconColorsConfig' },
  },
  TabIconFxConfig: { device: 'value', draw: 'value', draw_duration: 'value' },
  IconFillConfig: {
    entity: 'drop',
    attribute: 'drop',
    min: 'value',
    max: 'value',
    color: 'value',
    empty_color: 'value',
    wave: 'value',
    direction: 'value',
  },
  IconColorsConfig: { style: 'value', primary: 'value', secondary: 'value', gradient: { array: 'value' }, angle: 'value' },
  ImageColors: { main: 'value', accent: 'value' },
  ColorRange: { from: 'value', to: 'value', color: 'value' },
};

export interface CssDeclaration {
  property: string;
  value: string;
  important: boolean;
}

/** Splits a declaration list on `;` into lower-cased property, value and `!important`; null when a part has no `property: value` shape. */
export const readCssDeclarations = (css: string): CssDeclaration[] | null => {
  const out: CssDeclaration[] = [];
  for (const part of css.split(';')) {
    const text = part.trim();
    if (text === '') continue;
    const colon = text.indexOf(':');
    if (colon < 1) return null;
    let value = text.slice(colon + 1).trim();
    let important = false;
    const bang = /!\s*important$/i.exec(value);
    if (bang) {
      important = true;
      value = value.slice(0, bang.index).trim();
    }
    out.push({ property: text.slice(0, colon).trim().toLowerCase(), value, important });
  }
  return out;
};

/** The items of a font-family list with quotes removed; null when the list is longer than 4, empty or an item breaks the name rule. */
export const readFontFamily = (value: string): string[] | null => {
  const items = value.split(',');
  if (items.length > 4) return null;
  const out: string[] = [];
  for (const raw of items) {
    const item = raw.trim();
    if (isGenericFont(item)) {
      out.push(item);
      continue;
    }
    if (!LOOK_FONT_NAME_RE.test(item)) return null;
    const quoted = item.charAt(0) === '"' || item.charAt(0) === "'";
    const name = (quoted ? item.slice(1, -1) : item).trim();
    if (name === '') return null;
    out.push(name);
  }
  return out;
};

/** True for a generic family name (`serif`, `system-ui`, ...). */
export const isGenericFont = (name: string): boolean => (LOOK_FONT_GENERICS as readonly string[]).indexOf(name.toLowerCase()) >= 0;
