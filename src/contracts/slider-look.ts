import type { TemplateResult } from 'lit';
import type { ShapeKind, ShapeOptions, SliderModuleConfig } from '../types';
import type { ModuleView } from './lazy-module';

/*
 * Contract: slider looks. Version 1.0.0 (Architect-owned). ADR 0037. Task flow-slider-styles.
 * Applies to `type: slider` only (the light module's track and the slider layout are unchanged).
 *
 * Seam: the slider Module (src/modules/controls/slider-module.ts, magic-card.js) keeps today's
 * markup and owns one view slot (src/modules/controls/slider-look-slot.ts). The slider-look Module
 * (lazy chunk magic-card-slider-look.js, entry src/slider-look/chunk.ts, lazy-module 1.2.0 name
 * 'slider-look') fills it from install() with a ModuleView. Nothing else imports src/slider-look/**.
 * Not to be confused with the existing 'slider' chunk, which is the slider layout (swiper).
 *
 * ── YAML (flat keys on the slider module; all optional) ──
 * SliderLookConfig below. A slider "has a look" when any SLIDER_LOOK_KEYS key is not undefined
 * (hasSliderLook). Without a look the module renders exactly as before (AC1) and never loads the
 * chunk. Existing keys keep their meaning: `slider_color` (fill colour; the gradient's start),
 * `track_color`, `show_value`, `direction`, `min` / `max` / `step`.
 *
 * Precedence:
 * - Value display: `show_value: false` hides the value whatever `value_position` says. The editor
 *   keeps them in sync (Hidden writes show_value: false; picking a position removes show_value).
 * - Fill: `fill_mode` unset = solid for every entity (AC1; the editor shows Solid as default).
 *   auto: brightness -> slider colour from 25 % to 100 % lightness; colour temperature (kelvin)
 *   -> #ffa94d to #bfe0ff; any other entity -> solid. gradient: slider_color -> slider_color_to.
 * - use_entity_color: the light's rgb (lifted to 3:1 against the empty track) replaces
 *   slider_color, falls back to slider_color when the light is off or reports none.
 * - thumb options apply to circle / pill / square; thumb_icon only to those; none of them to
 *   line or none. Style-specific keys of another style are kept in YAML and ignored.
 * - stops outside [min, max] are ignored at render; with `snap`, drag and keys go stop to stop.
 *
 * ── magic-card.js side (slider Module) ──
 * - types.ts: `SliderModuleConfig extends SliderLookConfig`.
 * - renderPreview: hasSliderLook(c) and the slot is filled -> slot.renderPreview(c, hass). Slot
 *   empty -> start the 'slider-look' load, whenReady -> currentRenderContext()?.requestUpdate, and
 *   render today's markup meanwhile (failed: today's markup for good, no retry).
 * - prefetchLazy(config) loads 'slider-look' when a slider module (nested included, card_config
 *   skipped) hasSliderLook.
 * - src/utils/slider-track.ts gains TrackOptionsLook (below), additive: interaction, ARIA and
 *   keyboard stay in renderTrack; the chunk imports renderTrack, never copies it.
 *
 * ── Renderer rules (the chunk) ──
 * 1. The focusable element is always renderTrack's `.mc-tile-slider` with role=slider and
 *    aria-valuenow / min / max / valuetext, for every thumb including none (AC10). With stops,
 *    valuetext is "<label>, <value text>" when the value sits on a labelled stop.
 * 2. Keys: arrows by step, Page Up / Down by a tenth, Home / End; with snap: arrows and Page go to
 *    the next / previous stop (nextValue).
 * 3. live (default false; the Big fill preset sets it, CEO 2026-10-19): during a drag service calls
 *    go out at most 4 per second (250 ms throttle, leading and trailing) through onInput, and the
 *    final value always goes out on release (onCommit). Without live: only on release (today).
 * 4. Shape (track_shape): track and fill are clipped to shapePath() (src/utils/shape-path.ts, from
 *    magic-card.js; custom shapes through the custom-shape 1.0.0 loader); the clip sits on an inner
 *    element, never on the focusable element or its ancestors, so the focus ring is never clipped
 *    (AC13). A 1 px outline of the shape in the track colour at 40 % shows an empty fill.
 * 5. Contrast: thumb vs track >= 3:1; focus ring 2 px accent with a 1 px inner ring in the
 *    opposite of the surface (>= 3:1 on any fill); in-track value text and the big-fill icon flip
 *    light / dark for >= 4.5:1 (AC13).
 * 6. Motion: thumb scale on drag and the bubble fade are off under reduced motion. No animation
 *    runs while idle. glass_blur uses backdrop-filter on a static element only.
 * 7. Thin and segmented tracks keep a 40 px hit area (touch).
 */

export const SLIDER_LOOK_CONTRACT = '1.0.0';

export type SliderTrackStyle = 'standard' | 'thin' | 'pill' | 'segmented' | 'glass' | 'big-fill';
export type SliderThumb = 'line' | 'circle' | 'pill' | 'square' | 'none';

export const SLIDER_LOOK_DEFAULTS = {
  track_style: 'standard',
  /** Thickness per style (px, 2-96); vertical uses it as width. */
  track_thickness: { standard: 40, thin: 6, pill: 16, segmented: 16, glass: 28, 'big-fill': 64 },
  /** Track corners (px, 0-48): unset follows the style (standard: --mc-slider-radius; pill: 999; big-fill: 20). */
  segment_gap: 2, // 1-8 px; segments unset: from step, at most 20 (2-20)
  glass_blur: false,
  fill_mode: 'solid',
  use_entity_color: false,
  show_icon: true, // big-fill only
  icon_position: 'start',
  live: false,
  thumb: 'line',
  /** Thumb long side (px, 4-64) per shape; line: 50 % of the thickness. */
  thumb_size: { circle: 20, pill: 28, square: 18 },
  thumb_border: 0, // 0-6 px
  thumb_border_color: '#fff',
  thumb_glow: 0, // 0-30 px, colour follows the fill
  value_position: 'beside',
  ticks: false,
  show_limits: false,
  snap: false,
  max_stops: 12,
} as const;

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
  /** glass: blur what is behind the track (CEO 2026-10-19); false = flat translucent fill. */
  glass_blur?: boolean;
  /** Fill colouring; precedence in the header. */
  fill_mode?: 'solid' | 'gradient' | 'auto';
  /** gradient: end colour (slider_color is the start). */
  slider_color_to?: string;
  /** P5 Use the light's own colour for the fill. */
  use_entity_color?: boolean;
  /** big-fill: show the entity's icon (default true) or `icon`. */
  show_icon?: boolean;
  icon?: string;
  /** big-fill: icon position; center only for vertical. */
  icon_position?: 'start' | 'center';
  /** Update the entity while dragging (at most 4 calls a second); default false. */
  live?: boolean;
  /** Thumb; unset = line (today's grip). Picking line in the editor removes the key. */
  thumb?: SliderThumb;
  thumb_size?: number;
  thumb_border?: number;
  thumb_border_color?: string;
  thumb_glow?: number;
  /** MDI icon in a circle / pill / square thumb. */
  thumb_icon?: string;
  /** Where the value shows; precedence with show_value in the header. */
  value_position?: 'beside' | 'bubble' | 'track' | 'hidden';
  /** Tick marks; tick_every unset = auto (5-10 ticks). */
  ticks?: boolean;
  tick_every?: number;
  /** Min and max labels at the ends. */
  show_limits?: boolean;
  /** (m) Track shape from the shapes system. */
  track_shape?: ShapeKind;
  track_shape_options?: ShapeOptions;
  /** P4 Named stops (at most 12, sorted by value) and snapping to them. */
  stops?: SliderStop[];
  snap?: boolean;
}

/** Every look key; any of them set = the slider needs the slider-look chunk. */
export const SLIDER_LOOK_KEYS: readonly (keyof SliderLookConfig)[] = [
  'track_style', 'track_thickness', 'track_radius', 'segments', 'segment_gap', 'glass_blur', 'fill_mode',
  'slider_color_to', 'use_entity_color', 'show_icon', 'icon', 'icon_position', 'live', 'thumb', 'thumb_size',
  'thumb_border', 'thumb_border_color', 'thumb_glow', 'thumb_icon', 'value_position', 'ticks', 'tick_every',
  'show_limits', 'track_shape', 'track_shape_options', 'stops', 'snap',
];

export const hasSliderLook = (c: Partial<SliderModuleConfig> | undefined): boolean =>
  !!c && SLIDER_LOOK_KEYS.some((k) => (c as Record<string, unknown>)[k] !== undefined);

/** Additive options of renderTrack (src/utils/slider-track.ts TrackOptions extends this). */
export interface TrackOptionsLook {
  /** Extra children inside the track after the bar (thumb, ticks, bubble, icon, value). */
  parts?: TemplateResult;
  /** Each drag move, with the snapped value (live updates, bubble text). */
  onInput?: (value: number) => void;
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
