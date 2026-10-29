import { GridRowLike, ParsedWidth, WIDTH_RE, WidthUnit, columnWidthsList, hasColumnWidths, normalizeWidth } from './column-widths';

/* The column width helpers only the card editor uses (the card renders with column-widths.ts). */

export function parseWidth(raw: unknown): ParsedWidth {
  const s = normalizeWidth(raw) ?? '1fr';
  if (s === 'auto') return { value: 0, unit: 'auto' };
  const m = s.match(WIDTH_RE)!;
  return { value: Number(m[1]), unit: m[2] as WidthUnit };
}

/** Weights of a preset layout ("2-1") for `count` columns (equal when the preset doesn't fit). */
function presetFr(layout: string | undefined, count: number): number[] {
  if (layout && /^\d+(?:-\d+)*$/.test(layout)) {
    const w = layout.split('-').map((s) => Math.max(Number(s) || 1, 1));
    if (w.length === count) return w;
  }
  return Array.from({ length: Math.max(count, 1) }, () => 1);
}

/** A custom grid layout ("100px 1fr") as widths, when every part is a valid width and they match `count`. */
function customLayoutWidths(layout: string | undefined, count: number): string[] | null {
  if (!layout || /^\d+(?:-\d+)*$/.test(layout)) return null;
  const parts = layout.trim().split(/\s+/).map(normalizeWidth);
  return parts.length === count && parts.every((p): p is string => p !== null) ? parts : null;
}

/**
 * The width of every column as edited: the stored widths, else a custom grid layout's own widths,
 * else the preset layout's weights as fr.
 */
export function effectiveWidths(row: GridRowLike): string[] {
  const count = row.columns?.length || 1;
  if (hasColumnWidths(row)) return columnWidthsList(row.column_widths, count);
  return customLayoutWidths(row.layout, count) ?? presetFr(row.layout, count).map((w) => `${w}fr`);
}

/**
 * Bar weights for a layout glyph at the columns' real proportions: fr values when every width is
 * fr, else pixel sizes in a `ref` px wide row (auto counts as 1fr).
 */
export function widthWeights(widths: readonly string[], ref = 360): number[] {
  const parsed = widths.map(parseWidth);
  if (parsed.every((p) => p.unit === 'fr')) return parsed.map((p) => p.value);
  let fixed = 0;
  let fr = 0;
  for (const p of parsed) {
    if (p.unit === 'px') fixed += p.value;
    else if (p.unit === '%') fixed += (p.value / 100) * ref;
    else fr += p.unit === 'fr' ? p.value : 1;
  }
  const perFr = fr > 0 ? Math.max(ref - fixed, ref * 0.1 * fr) / fr : 0;
  return parsed.map((p) => {
    const px = p.unit === 'px' ? p.value : p.unit === '%' ? (p.value / 100) * ref : (p.unit === 'fr' ? p.value : 1) * perFr;
    return Math.max(px, ref * 0.02);
  });
}

/**
 * Apply a preset layout ("2-1", "1-1-1") to a card row or row module (mutates: callers pass a copy).
 * Missing columns are added from `newColumn`; surplus columns are removed and their modules move into
 * the last remaining column. A preset replaces custom column widths.
 */
export function applyRowLayout<C extends { modules?: unknown[] }>(
  row: { layout?: string; column_widths?: string[]; columns: C[] },
  layout: string,
  newColumn: () => C,
): void {
  const count = Math.max(layout.split('-').length, 1);
  while (row.columns.length < count) row.columns.push(newColumn());
  while (row.columns.length > count) {
    const removed = row.columns.pop()!;
    const left = row.columns[row.columns.length - 1];
    left.modules = [...(left.modules || []), ...(removed.modules || [])];
  }
  row.layout = layout;
  delete row.column_widths;
}
