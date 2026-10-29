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

export const WIDTH_RE = /^((?:\d+\.?\d*|\.\d+))(fr|%|px)$/;

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
