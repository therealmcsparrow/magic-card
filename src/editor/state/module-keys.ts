import type { ModuleType } from '../../types';
import { SLIDER_LOOK_KEYS } from '../../contracts/slider-look.needs';

/** Layout modules, the ones with child slots. A separator is not one. */
export const LAYOUT_TYPES = ['vertical', 'horizontal', 'row', 'tabs', 'slider-layout'] as const satisfies readonly ModuleType[];

/** Keys every module carries; a replacement keeps them whatever its type. */
export const COMMON_MODULE_KEYS: readonly string[] = [
  'id', 'type', 'entity', 'attribute', 'display', 'design', 'actions', 'hidden', 'editor_name', 'not_synced', 'placement', 'layer',
];

/** Keys of modules that draw a main icon through renderIcon(). */
const ICON_FX = ['icon_fx', 'icon_on', 'icon_off', 'svg'] as const;

/**
 * The keys each module type reads besides the common ones (editor only: Replace with… keeps the old
 * module's value for a key the new type lists, and drops the rest).
 */
const KEYS = {
  text: ['text', 'use_template', 'use_entity', 'entity_display'],
  icon: ['icon', 'size', 'icon_color', 'use_entity_icon', 'use_entity_color', ...ICON_FX],
  info: ['prefix', 'suffix', 'show_name', 'show_state', 'show_unit', 'secondary_info', 'show_icon', 'icon', ...ICON_FX],
  image: ['image', 'entity_picture', 'aspect_ratio', 'fit'],
  markdown: ['content'],
  bar: ['min', 'max', 'severity', 'decimals', 'bar_height', 'bar_color', 'bar_background', 'show_value', 'direction'],
  graphs: ['hours_to_show', 'points_per_hour', 'line_color', 'line_width', 'fill', 'fill_color', 'show_points', 'show_labels', 'height'],
  camera: ['aspect_ratio', 'camera_view', 'refresh_interval', 'show_controls'],
  button: ['label', 'icon', 'show_state', 'use_entity_icon', 'use_entity_color', 'button_style', ...ICON_FX],
  slider: ['show_value', 'min', 'max', 'step', 'slider_color', 'track_color', 'direction', ...SLIDER_LOOK_KEYS],
  spinbox: ['min', 'max', 'step'],
  dropdown: ['options'],
  light: ['icon', 'show_brightness', 'show_color_temp', 'show_color', 'show_effect', 'compact', ...ICON_FX],
  gauge: ['min', 'max', 'severity', 'needle', 'show_name', 'show_unit', 'decimals', 'gauge_style'],
  horizontal: ['modules', 'gap', 'align', 'justify', 'share_entity'],
  vertical: ['modules', 'gap', 'align', 'justify', 'share_entity'],
  row: ['columns', 'layout', 'column_widths', 'gap', 'padding', 'share_entity'],
  tabs: ['tabs', 'active_tab', 'tab_style', 'share_entity', ...ICON_FX],
  separator: ['separator_style', 'separator_color', 'separator_width', 'direction'],
  'slider-layout': ['modules', 'pagination', 'navigation', 'slides_per_view', 'space_between', 'loop', 'autoplay', 'autoplay_delay', 'share_entity'],
  clock: ['format_12h', 'show_seconds', 'show_date', 'date_format'],
  weather: ['animated_icons', 'show_temperature', 'show_condition', 'show_forecast', 'forecast_days', ...ICON_FX],
  forecast: ['animated_icons', 'forecast_type', 'num_forecasts', 'show_temperature', 'show_precipitation', 'show_wind', ...ICON_FX],
  'video-bg': ['url', 'poster', 'autoplay', 'loop', 'muted', 'fit'],
  'custom-card': ['name', 'card_type', 'card_config', 'card_config_yaml'],
} as const satisfies Record<ModuleType, readonly string[]>;

export const MODULE_KEYS: Record<ModuleType, readonly string[]> = KEYS;

/** The keys that hold a layout's children: never copied across, the children are re-seated. */
export const CHILD_KEYS: readonly string[] = ['modules', 'columns', 'tabs'];
