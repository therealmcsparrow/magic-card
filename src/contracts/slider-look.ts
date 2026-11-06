import type { TemplateResult } from 'lit';
import type { ShapeKind, ShapeOptions } from '../types';
import type { ModuleView } from './lazy-module';

/** Contract: slider looks. Version 1.1.0. */

export const SLIDER_LOOK_CONTRACT = '1.1.0';
export const SLIDER_LOOK_CONTRACT_REVISION = 5;

export type SliderTrackStyle = 'standard' | 'thin' | 'pill' | 'segmented' | 'glass' | 'big-fill';
export type SliderThumb = 'line' | 'circle' | 'pill' | 'square' | 'none';

/** Defaults and ranges: src/contracts/slider-look.defaults.ts, re-exported here. */
export { SLIDER_LOOK_DEFAULTS } from './slider-look.defaults';

export interface SliderStop {
  value: number;
  /** Shown under the tick (8 characters, full text in aria-valuetext). */
  label?: string;
}

export interface SliderLookConfig {
  /** Track style; unset = standard (today). Picking standard in the editor removes the key. */
  track_style?: SliderTrackStyle;
  track_thickness?: number;
  /** Track corners (px); the module's own corners stay in the Design tab. */
  track_radius?: number;
  /** segmented: number of segments and the gap between them (px). */
  segments?: number;
  segment_gap?: number;
  /** glass: blur what is behind the track; false = flat translucent fill. */
  glass_blur?: boolean;
  /** Fill shape; precedence in the header. */
  fill_mode?: 'solid' | 'gradient' | 'auto';
  /** gradient: end colour (the start is the fill colour source). Entity colour grammar allowed. */
  slider_color_to?: string;
  /** P5 The light's own colour as the fill's start colour (combines with fill_mode). */
  use_entity_color?: boolean;
  /** big-fill: show the entity's icon (default true) or `icon`. */
  show_icon?: boolean;
  /** big-fill: icon instead of the entity's (mdi:name). */
  icon?: string;
  /** big-fill: icon position; center only for vertical. */
  icon_position?: 'start' | 'center';
  /** Update the entity while dragging (at most 4 calls a second), every track style; default false. */
  live?: boolean;
  /** Thumb ("Handle" in the UI); unset = line (today's grip). Picking line removes the key. */
  thumb?: SliderThumb;
  thumb_size?: number;
  thumb_border?: number;
  /** Entity colour grammar allowed. */
  thumb_border_color?: string;
  thumb_glow?: number;
  /** MDI icon in a circle / pill / square thumb. */
  thumb_icon?: string;
  /** Where the value shows; precedence with show_value in the header. track = a chip in the track. */
  value_position?: 'beside' | 'bubble' | 'track' | 'hidden';
  /** Tick marks; tick_every unset = auto (5-10 ticks). */
  ticks?: boolean;
  tick_every?: number;
  /** Min and max labels at the ends. */
  show_limits?: boolean;
  /** (m) Track shape from the shapes system. */
  track_shape?: ShapeKind;
  track_shape_options?: ShapeOptions;
  /** P4 Named stops (at most 12) and snapping to them. */
  stops?: SliderStop[];
  snap?: boolean;
}

// SLIDER_LOOK_KEYS and hasSliderLook live in slider-look.needs.ts, which magic-card.js imports; re-exported unchanged.
export { SLIDER_LOOK_KEYS, hasSliderLook } from './slider-look.needs';

/** Additive options of renderTrack (src/utils/slider-track.ts TrackOptions extends this). */
export interface TrackOptionsLook {
  /** Extra children inside the track after the bar (thumb, ticks, bubble, icon, value, error mark). */
  parts?: TemplateResult;
  /** Each drag move, with the snapped value (live updates, bubble text). */
  onInput?: (value: number) => void;
  /** Drag ended (release, tap or cancel): starts the bubble linger. */
  onRelease?: () => void;
  /** Drag snapping (stops); default snapValue to step. */
  snap?: (value: number) => number;
  /** Key handling override (stops); undefined = renderTrack's default for that key. */
  nextValue?: (current: number, key: string) => number | undefined;
}

/** The slot the chunk fills from install(): the full slider view for a slider with a look. */
export type SliderLookView = ModuleView;

/** magic-card.js side: src/modules/controls/slider-look-slot.ts. */
export interface SliderLookSlot {
  provide(v: SliderLookView): void;
  get(): SliderLookView | undefined;
}
