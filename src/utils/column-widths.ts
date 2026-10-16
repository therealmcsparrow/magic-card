import { layoutToGridTemplate } from './css-utils';

/** A card row or a row module: what its grid template depends on. */
export interface GridRowLike {
  layout?: string;
  column_widths?: string[];
  columns?: readonly unknown[];
}

/**
 * A row's `column_widths`: one entry per column, `<n>fr`, `<n>%`, `<n>px` or `auto`. When present it
 * overrides the row's `layout` preset for the grid template; missing / invalid entries are `1fr`.
 */

const WIDTH_RE = /^((?:\d+\.?\d*|\.\d+))(fr|%|px)$/;

export type WidthUnit = 'fr' | '%' | 'px';

export interface ParsedWidth {
  value: number;
  unit: WidthUnit | 'auto';
}

/** A valid column width, normalised (`" 2FR "` → `2fr`, `2` → `2fr`), or null. fr must be > 0. */
export function normalizeWidth(raw: unknown): string | null {
  if (typeof raw === 'number') return Number.isFinite(raw) && raw > 0 ? `${raw}fr` : null;
  if (typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase();
  if (s === 'auto') return 'auto';
  const m = s.match(WIDTH_RE);
  if (!m) return null;
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value < 0 || (m[2] === 'fr' && value === 0)) return null;
  return `${value}${m[2]}`;
}

export function parseWidth(raw: unknown): ParsedWidth {
  const s = normalizeWidth(raw) ?? '1fr';
  if (s === 'auto') return { value: 0, unit: 'auto' };
  const m = s.match(WIDTH_RE)!;
  return { value: Number(m[1]), unit: m[2] as WidthUnit };
}

/** The row has its own column widths (a non-empty array). */
export function hasColumnWidths(row: Pick<GridRowLike, 'column_widths'> | undefined): boolean {
  return Array.isArray(row?.column_widths) && row!.column_widths.length > 0;
}

/** One normalised width per column: padded with 1fr, extras ignored. */
export function columnWidthsList(widths: unknown, count: number): string[] {
  const list = Array.isArray(widths) ? widths : [];
  return Array.from({ length: Math.max(count, 1) }, (_, i) => normalizeWidth(list[i]) ?? '1fr');
}

export function columnWidthsTemplate(widths: unknown, count: number): string {
  return columnWidthsList(widths, count).join(' ');
}

/** The grid template of a card row: its column widths, else its layout preset. */
export function rowGridTemplate(row: GridRowLike, fallbackLayout?: string): string {
  const count = row.columns?.length || 1;
  if (hasColumnWidths(row)) return columnWidthsTemplate(row.column_widths, count);
  return layoutToGridTemplate(row.layout || fallbackLayout, count);
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
