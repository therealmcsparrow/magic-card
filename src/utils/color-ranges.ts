import type { ColorRange } from '../types';

/** Colour for `value` from a list of ranges; undefined when none applies. */
export function rangeColor(value: number | undefined, ranges: ColorRange[] | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value) || !Array.isArray(ranges)) return undefined;
  let best: ColorRange | undefined;
  for (const r of ranges) {
    if (!r || typeof r.color !== 'string' || !r.color) continue;
    const from = Number(r.from);
    if (!Number.isFinite(from) || value < from) continue;
    if (r.to !== undefined && r.to !== null && Number.isFinite(Number(r.to)) && value > Number(r.to)) continue;
    if (!best || from > Number(best.from)) best = r;
  }
  return best?.color;
}
