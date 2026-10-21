/*
 * The numbers of the slider looks (contract slider-look.ts, which re-exports them).
 * A stateless leaf with no imports: the look editor takes them from here.
 */

export const SLIDER_LOOK_DEFAULTS = {
  track_style: 'standard',
  /** Thickness per style (px, 2-96); vertical uses it as width. Vertical big-fill height: 12rem. */
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
  /** Thumb long side (px, 4-64) per shape; line: 50 % of the thickness; pill short side = 0.57 x size. */
  thumb_size: { circle: 20, pill: 28, square: 18 },
  thumb_border: 0, // 0-6 px
  thumb_border_color: '#ffffff',
  thumb_glow: 0, // 0-30 px, colour follows the fill
  value_position: 'beside',
  bubble_linger_ms: 2000,
  error_ms: 5000,
  live_throttle_ms: 250,
  outline_opacity: 0.55,
  brightness_overlay: 'rgba(0, 0, 0, 0.75)',
  vertical_big_fill_height: '12rem',
  ticks: false,
  show_limits: false,
  snap: false,
  max_stops: 12,
} as const;
