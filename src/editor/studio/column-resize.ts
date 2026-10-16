import { parseWidth, WidthUnit } from '../../utils/column-widths';

/** Narrowest a column gets from a drag / key press, in card px. */
export const MIN_COLUMN_PX = 40;
/** Snap step per unit (drag, arrow keys). */
export const WIDTH_STEP: Record<WidthUnit, number> = { fr: 0.05, '%': 1, px: 4 };

export interface ResizeOptions {
  /** Snap to WIDTH_STEP (false: Alt held). Default true. */
  snap?: boolean;
  minPx?: number;
}

/** The two columns either side of gutter `i`, in one unit. */
interface Pair {
  unit: WidthUnit;
  a: number;
  b: number;
  /** Their pixel sizes summed. */
  total: number;
}

const round = (v: number, unit: WidthUnit): number => (unit === 'px' ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100);
const fmt = (v: number, unit: WidthUnit): string => `${round(v, unit)}${unit}`;

/**
 * Columns `i` and `i + 1` in a shared unit. Same unit (fr, % or px): kept. Mixed (or auto): both
 * become fr proportional to their current pixel sizes, at the fr scale of the row's other fr
 * columns (none: the pair sums to 2fr).
 */
function pairOf(widths: readonly string[], i: number, px: readonly number[]): Pair {
  const pa = parseWidth(widths[i]);
  const pb = parseWidth(widths[i + 1]);
  const total = Math.max((px[i] ?? 0) + (px[i + 1] ?? 0), 1);
  if (pa.unit === pb.unit && pa.unit !== 'auto') return { unit: pa.unit, a: pa.value, b: pb.value, total };
  let frSum = 0;
  let frPx = 0;
  widths.forEach((w, k) => {
    if (k === i || k === i + 1) return;
    const p = parseWidth(w);
    if (p.unit === 'fr' && (px[k] ?? 0) > 0) {
      frSum += p.value;
      frPx += px[k];
    }
  });
  const perPx = frSum > 0 && frPx > 0 ? frSum / frPx : 2 / total;
  return { unit: 'fr', a: (px[i] ?? 0) * perPx, b: (px[i + 1] ?? 0) * perPx, total };
}

/** Set the pair's first column to `a` (its unit), clamped so both stay >= minPx; the sum is kept. */
function setA(widths: readonly string[], i: number, pair: Pair, a: number, opts: ResizeOptions): string[] {
  const snap = opts.snap !== false;
  const step = WIDTH_STEP[pair.unit];
  const sum = pair.a + pair.b;
  const minPx = opts.minPx ?? MIN_COLUMN_PX;
  let lo = Math.min((sum * minPx) / pair.total, sum / 2);
  if (snap) lo = Math.min(Math.ceil(lo / step - 1e-9) * step, sum / 2);
  let next = snap ? Math.round(a / step) * step : a;
  next = Math.min(Math.max(next, lo), sum - lo);
  const out = [...widths];
  const na = round(next, pair.unit);
  out[i] = fmt(na, pair.unit);
  out[i + 1] = fmt(sum - na, pair.unit);
  return out;
}

/**
 * Drag the gutter after column `i` by `deltaPx` (card px) from the widths at drag start: the two
 * neighbours trade width (the pair's sum stays), the rest of the row is unchanged.
 * `px`: the columns' measured widths at drag start.
 */
export function resizePair(widths: readonly string[], i: number, px: readonly number[], deltaPx: number, opts: ResizeOptions = {}): string[] {
  const pair = pairOf(widths, i, px);
  const sum = pair.a + pair.b;
  const aPx = (px[i] ?? 0) + deltaPx;
  return setA(widths, i, pair, (aPx / pair.total) * sum, opts);
}

/** Arrow keys: move the gutter by `steps` snap steps of the pair's unit (negative: left). */
export function stepPair(widths: readonly string[], i: number, px: readonly number[], steps: number, opts: ResizeOptions = {}): string[] {
  const pair = pairOf(widths, i, px);
  return setA(widths, i, pair, pair.a + steps * WIDTH_STEP[pair.unit], { ...opts, snap: false });
}

/** Double-click: the two neighbours get the same width. */
export function equalizePair(widths: readonly string[], i: number, px: readonly number[]): string[] {
  const pair = pairOf(widths, i, px);
  const half = (pair.a + pair.b) / 2;
  const out = [...widths];
  out[i] = fmt(half, pair.unit);
  out[i + 1] = fmt(half, pair.unit);
  return out;
}
