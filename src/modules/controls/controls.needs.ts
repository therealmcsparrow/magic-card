/*
 * Which module types the `controls` chunk serves, and the height their placeholder reserves before it arrives
 * (ADR 0040 "default reserve"). Both read the card config only. A size the config sets (`design.height` or
 * `design.min_height`) belongs to the module's wrapper, so the placeholder then adds nothing of its own.
 */

export const CONTROL_MODULE_TYPES = ['slider', 'spinbox', 'dropdown', 'light', 'gauge'] as const;

type Cfg = {
  direction?: unknown;
  compact?: unknown;
  show_brightness?: unknown;
  show_color_temp?: unknown;
  show_color?: unknown;
  show_effect?: unknown;
  gauge_style?: unknown;
  needle?: unknown;
  show_name?: unknown;
  entity?: unknown;
  design?: { height?: unknown; min_height?: unknown } | null;
};

/** Rendered height in px of each control on the default theme: the horizontal slider, the spinbox, the dropdown. */
const SLIDER = 40;
const SPINBOX = 32;
const DROPDOWN = 41;
/** The light: the header row, then one row per control the config asks for, and the compact light as a whole. */
const LIGHT_HEADER = 33;
const LIGHT_BRIGHTNESS = 48;
const LIGHT_COLOR_TEMP = 48;
const LIGHT_COLOR = 40;
const LIGHT_EFFECT = 37;
const LIGHT_COMPACT = 40;
/** The gauge: its drawing per style (the half gauge is 109 with its needle and 100 without), and the name line under it. */
const GAUGE_FULL = 120;
const GAUGE_HALF = 109;
const GAUGE_HALF_NO_NEEDLE = 100;
const GAUGE_NAME = 18;

/** The min-height in px a control's placeholder reserves; undefined when the config sets its own size or the CSS gives one. */
export function controlReserve(type: string, config: unknown): number | undefined {
  const c = (config ?? {}) as Cfg;
  const d = c.design;
  if (d && (d.height !== undefined || d.min_height !== undefined)) return undefined;
  switch (type) {
    case 'slider':
      return c.direction === 'vertical' ? undefined : SLIDER;
    case 'spinbox':
      return SPINBOX;
    case 'dropdown':
      return DROPDOWN;
    case 'light':
      return c.compact
        ? LIGHT_COMPACT
        : LIGHT_HEADER +
            (c.show_brightness === false ? 0 : LIGHT_BRIGHTNESS) +
            (c.show_color_temp ? LIGHT_COLOR_TEMP : 0) +
            (c.show_color ? LIGHT_COLOR : 0) +
            (c.show_effect ? LIGHT_EFFECT : 0);
    case 'gauge': {
      const style = c.gauge_style;
      const drawing = style === 'full' || style === 'quarter' ? GAUGE_FULL : c.needle === false ? GAUGE_HALF_NO_NEEDLE : GAUGE_HALF;
      return drawing + (c.entity && c.show_name !== false ? GAUGE_NAME : 0);
    }
    default:
      return undefined;
  }
}
