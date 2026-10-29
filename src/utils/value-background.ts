import type { HomeAssistant, ValueBackgroundConfig } from '../types';
import { colour, entityLevel, share } from '../icons/fx-values';
import { parseGradient } from './gradient';

/*
 * `design.value_background` resolved against the entity states (pure, no DOM): a tank fill level or
 * the options of a history sparkline. The sparkline's path from history samples is in
 * src/card/value-bg-sparkline.ts (the decor chunk).
 */

export type ValueBgDirection = 'up' | 'down' | 'left' | 'right';

export interface ResolvedValueBackground {
  type: 'fill' | 'sparkline';
  /** Fill: 0..1 of the current value between min and max; undefined = no value (a hatched empty tank). Not set for a sparkline. */
  level?: number;
  color: string;
  /** The fill's gradient (CSS string) when the colour is one: `color` is its first stop. */
  paint?: string;
  /** Fill opacity / sparkline area opacity, 0..1. */
  opacity: number;
  direction: ValueBgDirection;
  wave: boolean;
  hours: number;
  lineWidth: number;
  area: boolean;
  smoothing: boolean;
  entity?: string;
  attribute?: string;
  /** As configured (undefined = fill 0..100 / sparkline auto range). */
  min?: number;
  max?: number;
}

export const VALUE_BG_DEFAULTS = {
  color: 'var(--mc-primary, var(--primary-color))',
  /** Fill opacity. */
  opacity: 0.25,
  /** Sparkline area opacity (at the bottom; the area fades out upwards). */
  areaOpacity: 0.18,
  /** Sparkline line opacity (`--mc-value-bg-line-opacity`): faint behind text. */
  lineOpacity: 0.45,
  hours: 24,
  /** Longest sparkline window (a week, like the graphs module). */
  maxHours: 168,
  lineWidth: 1.5,
  /** Most points a sparkline draws. */
  maxPoints: 60,
};

const DIRECTIONS: ValueBgDirection[] = ['up', 'down', 'left', 'right'];

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
const positive = (v: unknown, def: number) => {
  const n = num(v);
  return n !== undefined && n > 0 ? n : def;
};

/**
 * What to draw behind an element: undefined when off / unknown type / without an entity (rows,
 * columns and the card need their own). `ctx.entity` is the module's entity (the default).
 */
export function resolveValueBackground(
  cfg: ValueBackgroundConfig | undefined,
  ctx: { hass?: HomeAssistant; entity?: string },
): ResolvedValueBackground | undefined {
  if (!cfg || typeof cfg !== 'object') return undefined;
  if (cfg.type !== 'fill' && cfg.type !== 'sparkline') return undefined;
  const entity = cfg.entity || ctx.entity;
  if (!entity) return undefined;
  const stateObj = ctx.hass?.states?.[entity];
  const attribute = cfg.attribute || undefined;
  const min = num(cfg.min);
  const max = num(cfg.max);
  const fill = cfg.type === 'fill';
  const gradient = parseGradient(cfg.color);
  const out: ResolvedValueBackground = {
    type: cfg.type,
    color: gradient?.stops[0] ?? colour(cfg.color, stateObj) ?? VALUE_BG_DEFAULTS.color,
    paint: gradient && cfg.color,
    opacity: share(cfg.opacity) ?? (fill ? VALUE_BG_DEFAULTS.opacity : VALUE_BG_DEFAULTS.areaOpacity),
    direction: DIRECTIONS.includes(cfg.direction as ValueBgDirection) ? (cfg.direction as ValueBgDirection) : 'up',
    wave: cfg.wave !== false,
    hours: Math.min(VALUE_BG_DEFAULTS.maxHours, positive(cfg.hours, VALUE_BG_DEFAULTS.hours)),
    lineWidth: positive(cfg.line_width, VALUE_BG_DEFAULTS.lineWidth),
    area: cfg.area !== false,
    smoothing: cfg.smoothing !== false,
    entity,
  };
  // a sparkline draws the history, not the level (a level in it would re-render the layer for nothing)
  if (fill) out.level = entityLevel(stateObj, attribute, min, max);
  if (attribute) out.attribute = attribute;
  if (min !== undefined) out.min = min;
  if (max !== undefined) out.max = max;
  return out;
}
