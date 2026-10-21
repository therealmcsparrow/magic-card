import type { HassEntity } from '../types';
import { safeColor } from '../utils/safe-css';
import { ENTITY_COLOR_VAR, entityStateColor, parseEntityColor } from '../utils/entity-color';
import { entityNumber, isUnavailable } from '../utils/entity-value';

/*
 * The value helpers shared by `icon_fx` (<mc-svg-icon>) and `design.value_background`: stateless,
 * so the card entry carries them without the icon effects.
 */

/** Range of a value when no min / max is configured. */
export const FX_RANGE = { min: 0, max: 100 };

export const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};
export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
export const mix = (c: string, pct: number) => (pct >= 100 ? c : `color-mix(in srgb, ${c} ${clamp(pct, 0, 100)}%, transparent)`);

/** `25%`, `0.25` or 25 → 0.25; undefined when not a share. */
export function share(v: unknown): number | undefined {
  if (typeof v === 'string' && /^\s*\d*\.?\d+\s*%\s*$/.test(v)) return clamp(parseFloat(v) / 100, 0, 1);
  const n = num(v);
  if (n === undefined) return undefined;
  return clamp(n > 1 ? n / 100 : n, 0, 1);
}

/**
 * A colour value: `entity` / `entity N%` (the entity's state colour, else the wrapper's entity
 * colour var, else currentColor) or a safe CSS colour; undefined when unset / unsafe.
 */
export function colour(v: unknown, stateObj: HassEntity | undefined): string | undefined {
  const ent = parseEntityColor(v);
  if (ent) return mix(entityStateColor(stateObj) ?? `var(${ENTITY_COLOR_VAR}, currentColor)`, ent.opacity);
  return safeColor(v);
}

/**
 * 0..1 of an entity's state (or attribute) between min and max (default 0..100), clamped; undefined
 * when unavailable / not numeric or the range is empty. Shared by liquid fill and value backgrounds.
 */
export function entityLevel(stateObj: HassEntity | undefined, attribute: string | undefined, minV: unknown, maxV: unknown): number | undefined {
  if (isUnavailable(stateObj, attribute)) return undefined;
  const v = entityNumber(stateObj, attribute);
  const min = num(minV) ?? FX_RANGE.min;
  const max = num(maxV) ?? FX_RANGE.max;
  if (v === undefined || max === min) return undefined;
  return clamp((v - min) / (max - min), 0, 1);
}
