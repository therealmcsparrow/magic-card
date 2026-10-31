import type { SliderModuleConfig } from '../types';
import type { SliderLookConfig } from './slider-look';

/** slider-look 1.1.0, the predicate and key list magic-card.js needs at run time (slider-module, lazy-features). They sit
 * in this file, not in slider-look.ts, because the entry may import only *.needs.ts of a contract (see
 * tools/check-entry-graph.mjs); slider-look.ts re-exports them. */

/** Every look key; any of them set = the slider needs the slider-look chunk. */
export const SLIDER_LOOK_KEYS: readonly (keyof SliderLookConfig)[] = [
  'track_style', 'track_thickness', 'track_radius', 'segments', 'segment_gap', 'glass_blur', 'fill_mode',
  'slider_color_to', 'use_entity_color', 'show_icon', 'icon', 'icon_position', 'live', 'thumb', 'thumb_size',
  'thumb_border', 'thumb_border_color', 'thumb_glow', 'thumb_icon', 'value_position', 'ticks', 'tick_every',
  'show_limits', 'track_shape', 'track_shape_options', 'stops', 'snap',
];

export const hasSliderLook = (c: Partial<SliderModuleConfig> | undefined): boolean =>
  !!c && SLIDER_LOOK_KEYS.some((k) => (c as Record<string, unknown>)[k] !== undefined);
