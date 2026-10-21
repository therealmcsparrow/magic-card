import type { DeviceAnim, HomeAssistant, IconFxConfig } from '../types';
import { cssTime } from '../utils/safe-css';
import { resolveDeviceAnim } from './device-anim';
import { clamp, colour, entityLevel, FX_RANGE, mix, num, share } from './fx-values';

/*
 * `icon_fx` resolved against the entity states: what <mc-svg-icon> draws. Pure (no DOM), so the
 * value / colour math is unit-tested on its own.
 */

export type FillDirection = 'up' | 'down' | 'left' | 'right';
export type ColorStyle = 'solid' | 'duotone' | 'gradient' | 'value';

export interface ResolvedIconFx {
  /**
   * Liquid fill. `level` 0..1; undefined = no value (the icon stays dimmed and empty). The empty part
   * is the icon at `emptyOpacity`, or in `emptyColor` (opaque) when `empty_color` is a colour.
   */
  fill?: { level: number | undefined; color: string; emptyOpacity: number; emptyColor?: string; wave: boolean; direction: FillDirection };
  colors: { style: ColorStyle; primary: string; secondary?: string; stops?: string[]; angle: number; valueColor?: string; valueMissing?: boolean };
  /** Device animation; `speed` = seconds per cycle (0 = a static pose), `intensity` 0..1. */
  device?: { anim: DeviceAnim; speed: number; intensity: number; color?: string };
  draw: 'off' | 'load' | 'change' | 'loop';
  /** Line-draw duration in seconds. */
  drawDuration: number;
  morph: boolean;
}

export const ICON_FX_DEFAULTS = {
  ...FX_RANGE,
  emptyOpacity: 0.25,
  angle: 90,
  drawDuration: 1.2,
  /** Duotone second tone: the primary at this opacity. */
  secondaryPct: 40,
  stops: ['#2196f3', '#f44336'],
};

const DIRECTIONS: FillDirection[] = ['up', 'down', 'left', 'right'];
const STYLES: ColorStyle[] = ['solid', 'duotone', 'gradient', 'value'];
const DRAWS: ResolvedIconFx['draw'][] = ['off', 'load', 'change', 'loop'];

const pick = <T>(v: unknown, list: T[], def: T): T => (list.includes(v as T) ? (v as T) : def);

interface Rgb { r: number; g: number; b: number }

function parseRgb(c: string): Rgb | undefined {
  const s = c.trim();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (m) {
    const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(s);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : undefined;
}

/**
 * The colour at `t` (0..1) along evenly spaced stops, as `rgb(r, g, b)`. Stops that aren't hex /
 * rgb() (theme vars) can't be mixed: the nearest stop is returned as is.
 */
export function interpolateStops(stops: string[], t: number): string {
  if (!stops.length) return 'currentColor';
  const x = clamp(Number.isFinite(t) ? t : 0, 0, 1) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  if (stops.length === 1 || i < 0) return parseRgb(stops[0]) ? rgbOf(parseRgb(stops[0])!) : stops[0];
  const f = x - i;
  const a = parseRgb(stops[i]);
  const b = parseRgb(stops[i + 1]);
  if (!a || !b) return f < 0.5 ? stops[i] : stops[i + 1];
  return rgbOf({ r: a.r + (b.r - a.r) * f, g: a.g + (b.g - a.g) * f, b: a.b + (b.b - a.b) * f });
}

const rgbOf = (c: Rgb) => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;

/** 0..1 of the value between min and max; undefined without a numeric value or with an empty range. */
function valueLevel(fx: IconFxConfig, ctx: { hass?: HomeAssistant; entity?: string }): number | undefined {
  const f = fx.fill && typeof fx.fill === 'object' ? fx.fill : {};
  const id = f.entity || ctx.entity;
  return entityLevel(id ? ctx.hass?.states?.[id] : undefined, f.attribute || undefined, f.min, f.max);
}

export function resolveIconFx(
  fx: IconFxConfig | undefined,
  ctx: { hass?: HomeAssistant; entity?: string; baseColor: string },
): ResolvedIconFx {
  const cfg: IconFxConfig = fx && typeof fx === 'object' ? fx : {};
  const own = ctx.entity ? ctx.hass?.states?.[ctx.entity] : undefined;
  const c = cfg.colors && typeof cfg.colors === 'object' ? cfg.colors : {};
  const style = pick(c.style, STYLES, 'solid');
  const primary = colour(c.primary, own) ?? ctx.baseColor;
  const level = cfg.fill || style === 'value' ? valueLevel(cfg, ctx) : undefined;

  const colors: ResolvedIconFx['colors'] = { style, primary, angle: num(c.angle) ?? ICON_FX_DEFAULTS.angle };
  // Second tone: duotone's (default: the primary at 40%), or an own SVG's accent colour when set.
  const pct = typeof c.secondary === 'string' && /%\s*$/.test(c.secondary) ? share(c.secondary) : undefined;
  const secondary = pct !== undefined ? mix(primary, Math.round(pct * 100)) : colour(c.secondary, own);
  if (style === 'duotone') colors.secondary = secondary ?? mix(primary, ICON_FX_DEFAULTS.secondaryPct);
  else if (secondary) colors.secondary = secondary;
  if (style === 'gradient' || style === 'value') {
    const stops = (Array.isArray(c.gradient) ? c.gradient : []).map((s) => colour(s, own)).filter((s): s is string => !!s);
    colors.stops = stops.length >= 2 ? stops : stops.length === 1 ? [stops[0], stops[0]] : [...ICON_FX_DEFAULTS.stops];
    if (style === 'value') {
      colors.valueColor = level === undefined ? colors.stops[0] : interpolateStops(colors.stops, level);
      // No value: the first stop, dimmed (like bar / gauge)
      if (level === undefined) colors.valueMissing = true;
    }
  }

  const out: ResolvedIconFx = {
    colors,
    draw: pick(cfg.draw, DRAWS, 'off'),
    drawDuration: parseSeconds(cfg.draw_duration) ?? ICON_FX_DEFAULTS.drawDuration,
    morph: cfg.morph === true,
  };
  const device = resolveDeviceAnim(cfg.device, own);
  if (device) out.device = device;

  if (cfg.fill && typeof cfg.fill === 'object') {
    const f = cfg.fill;
    // empty_color: N% / a share = the icon's opacity when empty; else a colour for the empty part
    const opacity = share(f.empty_color);
    const emptyColor = opacity === undefined ? colour(f.empty_color, own) : undefined;
    out.fill = {
      level,
      color: colour(f.color, own) ?? colors.valueColor ?? primary,
      emptyOpacity: emptyColor ? 1 : opacity ?? ICON_FX_DEFAULTS.emptyOpacity,
      ...(emptyColor ? { emptyColor } : {}),
      wave: f.wave !== false,
      direction: pick(f.direction, DIRECTIONS, 'up'),
    };
  }
  return out;
}

function parseSeconds(v: unknown): number | undefined {
  const t = cssTime(v);
  if (!t) return undefined;
  const s = t.endsWith('ms') ? parseFloat(t) / 1000 : parseFloat(t);
  return s > 0 ? s : undefined;
}
