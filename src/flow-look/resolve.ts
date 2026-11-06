import { FLOW_LOOK_DEFAULTS, defaultCapSize, FLOW_SPIN_SHAPES, type FlowCap, type FlowLineStyle, type FlowLookResolved, type FlowShape } from '../contracts/flow-look';
import { FLOW_SHAPES, SPACING_MODES, fin, isWideFlowLook } from '../contracts/flow-anchor-wide';
import type { ColorRange, FlowConfig, HomeAssistant } from '../types';
import { FLOW_DEFAULTS } from '../utils/flow-keys';
import type { ResolvedFlow } from '../utils/flow';
import { safeColor } from '../utils/safe-css';
import { entityStateColor, parseEntityColor } from '../utils/entity-color';
import { flowLookRegistry } from './registry';

// resolve() of the flow-look slot: every look key narrowed, clamped and defaulted, the colour mode decided. Value-mode
// colour is written into base.color, the gradient end comes back as look.colorTo, and style default widths and the neon
// glow are applied to base as placeholders of unset keys.

const LINES: ReadonlySet<string> = new Set(['solid', 'dashed', 'dotted', 'double', 'wave', 'zigzag', 'tube', 'neon', 'cable']);
const CAPS: ReadonlySet<string> = new Set(['none', 'round', 'arrow']);
const SHAPES: ReadonlySet<string> = new Set(FLOW_SHAPES);
const SPACING: ReadonlySet<string> = new Set(SPACING_MODES);
const MAX_RANGES = 12;
/** Same pattern as isIconId (src/utils/icon-list.ts), kept here so the chunk does not pull the icon list in. */
const ICON_ID = /^[a-z0-9_-]+:[a-z0-9_.-]+$/i;

/** A finite number in [lo, hi], else `def` (numeric strings count). */
function num(v: unknown, lo: number, hi: number, def: number): number {
  const n = fin(v);
  return n === undefined ? def : Math.min(hi, Math.max(lo, n));
}

const pick = <T extends string>(v: unknown, set: ReadonlySet<string>): T | undefined => (typeof v === 'string' && set.has(v) ? (v as T) : undefined);

/** A configured colour: `entity` / `entity N%` (state colour of the flow's entity), else a safe CSS colour. */
function colour(v: unknown, hass: HomeAssistant | undefined, entityId: string | undefined, fallback?: string): string | undefined {
  const ent = parseEntityColor(v);
  if (!ent) return safeColor(v) ?? fallback;
  const own = (entityId ? entityStateColor(hass?.states?.[entityId]) : undefined) ?? fallback ?? FLOW_DEFAULTS.color;
  return ent.opacity >= 100 ? own : `color-mix(in srgb, ${own} ${ent.opacity}%, transparent)`;
}

/**
 * Colour modes (contract precedence): `color_mode` decides when set; unset: thresholds -> value, else
 * color_to -> gradient, else single. value sets base.color to the last range whose `from` <= |value|
 * (no match or no value: `color` stays); gradient returns the end colour. The default for the slot.
 */
function modes(f: FlowConfig, base: ResolvedFlow, hass: HomeAssistant | undefined, entity: string | undefined): string | undefined {
  const ranges = Array.isArray(f.thresholds) ? f.thresholds.slice(0, MAX_RANGES) : [];
  const mode = pick<'single' | 'gradient' | 'value'>(f.color_mode, new Set(['single', 'gradient', 'value'])) ?? (ranges.length ? 'value' : f.color_to !== undefined ? 'gradient' : 'single');
  if (mode === 'gradient') return colour(f.color_to, hass, entity);
  if (mode === 'value' && base.value !== undefined) {
    const v = Math.abs(base.value);
    let hit: ColorRange | undefined;
    for (const r of ranges) if (r && typeof r.from === 'number' && r.from <= v) hit = r;
    const c = hit ? colour(hit.color, hass, entity) : undefined;
    if (c) base.color = c;
  }
  return undefined;
}

export function resolveLook(f: FlowConfig, base: ResolvedFlow, hass: HomeAssistant | undefined, entity: string | undefined): FlowLookResolved {
  const D = FLOW_LOOK_DEFAULTS;
  const line = pick<FlowLineStyle>(f.line_style, LINES) ?? 'solid';
  // style default width / neon glow while the key is unset (a scaled width keeps its ratio)
  if (!(typeof f.width === 'number' && f.width > 0) && (line === 'tube' || line === 'neon' || line === 'cable')) {
    base.width = Math.min(40, (D.width[line] * base.width) / FLOW_DEFAULTS.width);
  }
  if (line === 'neon' && f.glow === undefined) base.glow = D.neon_glow;
  const colorTo = (flowLookRegistry.colour ?? modes)(f, base, hass, entity);

  const min = Math.max(0, num(f.min, -Infinity, Infinity, FLOW_DEFAULTS.min));
  const max = num(f.max, -Infinity, Infinity, FLOW_DEFAULTS.max);
  const level = f.tube_fill_value === true && base.value !== undefined && max > min ? Math.min(1, Math.max(0, (Math.abs(base.value) - min) / (max - min))) : 1;
  const motion = f.motion === 'pulse' ? 'pulse' : 'travel';
  const spacingMode = pick<'even' | 'pixels' | 'random'>(f.spacing_mode, SPACING) ?? (f.spacing !== undefined ? 'pixels' : 'even');
  const shape = pick<FlowShape>(f.shape, SHAPES) ?? D.shape;
  const alt = pick<FlowShape>(f.shape_alternate, SHAPES);
  const arrival = pick<'none' | 'ring' | 'splash'>(f.arrival, new Set(['ring', 'splash'])) ?? 'none';
  const out: FlowLookResolved = {
    line,
    dashLength: num(f.dash_length, 2, 40, D.dash_length),
    dashGap: num(f.dash_gap, 2, 40, D.dash_gap),
    railGap: num(f.rail_gap, 2, 24, D.rail_gap),
    amplitude: num(f.amplitude, 1, 20, D.amplitude),
    wavelength: num(f.wavelength, 8, 80, line === 'zigzag' ? D.wavelength_zigzag : D.wavelength_wave),
    electric: f.electric === true,
    wide: isWideFlowLook(f),
    bubbles: line === 'tube' && f.bubbles !== false ? Math.round(num(f.bubble_count, 1, 8, D.bubble_count)) : 0,
    level,
    flicker: line === 'neon' && (f.flicker === 'subtle' || f.flicker === 'strong') ? f.flicker : 'off',
    twisted: f.twisted === true,
    startCap: pick<FlowCap>(f.start_cap, CAPS) ?? 'none',
    endCap: pick<FlowCap>(f.end_cap, CAPS) ?? 'none',
    capSize: f.cap_size !== undefined ? num(f.cap_size, 4, 40, defaultCapSize(base.width)) : defaultCapSize(base.width),
    shape,
    iconRotate: f.shape_icon_rotate !== false,
    spin: f.shape_spin === true && FLOW_SPIN_SHAPES.some((s) => s === shape || s === alt),
    sizeVariation: num(f.size_variation, 0, 60, D.size_variation),
    motion,
    arrival: motion === 'pulse' ? 'none' : arrival,
    arrivalSize: num(f.arrival_size, 8, 80, D.arrival_size),
  };
  if (spacingMode !== 'even') out.spacing = { mode: spacingMode, px: num(f.spacing, 4, 400, D.spacing) };
  const set = <K extends 'tubeTint' | 'neonCore' | 'cableColor' | 'shapeColor' | 'colorTo'>(k: K, v: string | undefined) => {
    if (v !== undefined) out[k] = v;
  };
  set('tubeTint', safeColor(f.tube_tint));
  set('neonCore', safeColor(f.neon_core));
  set('cableColor', safeColor(f.cable_color));
  set('shapeColor', colour(f.shape_color, hass, entity));
  set('colorTo', colorTo);
  if (typeof f.shape_icon === 'string' && ICON_ID.test(f.shape_icon.trim())) out.icon = f.shape_icon.trim();
  if (alt) out.alternate = alt;
  return out;
}
