// The numbers of the flow looks (contract flow-look.ts, which re-exports them). A stateless leaf with no imports:
// the look editor takes them from here, so its chunk does not pull in the contract file, and the flow-look chunk
// keeps its own copy.

/** Defaults and ranges (clamped by resolve(); the editor uses the same numbers). */
export const FLOW_LOOK_DEFAULTS = {
  line_style: 'solid',
  dash_length: 10, // 2-40
  dash_gap: 6, // 2-40 (dashed and dotted)
  rail_gap: 6, // 2-24
  amplitude: 6, // 1-20
  wavelength_wave: 32, // 8-80
  wavelength_zigzag: 24, // 8-80
  electric: false,
  // tube_tint and neon_core: no string default; unset uses FLOW_LOOK_THEME
  bubbles: true, // on once line_style is tube
  bubble_count: 4, // 1-8
  tube_fill_value: false,
  flicker: 'off',
  neon_glow: 8, // `glow` unset on a neon line; static blur radius at most 8 px (rule 2); also the shapes' halo
  twisted: false,
  color_mode: 'single',
  start_cap: 'none',
  end_cap: 'none',
  cap_size_factor: 2, // cap_size unset: 2 x width, at most cap_size_default_max; set: 4-40 px (3 x width made a tube's arrowhead cover module text)
  cap_size_default_max: 24, // px; upper bound of the unset default only, a set cap_size may go to 40
  shape: 'dot',
  shape_icon_rotate: true,
  shape_spin: false,
  spacing_mode: 'even',
  spacing: 32, // 4-400 px
  size_variation: 0, // 0-60 %
  motion: 'travel',
  arrival: 'none',
  arrival_size: 24, // 8-80 px
  /** Style default widths (placeholder of `width` while it is unset). */
  width: { tube: 12, neon: 3, cable: 5 },
} as const;

/** The marker size when `cap_size` is unset: 2 x the line width, at most 24 px (resolve() and the editor). */
export function defaultCapSize(width: number): number {
  return Math.min(FLOW_LOOK_DEFAULTS.cap_size_default_max, FLOW_LOOK_DEFAULTS.cap_size_factor * width);
}
