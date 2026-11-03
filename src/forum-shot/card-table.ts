// Rows of the forum shot card table: keys, readable names and locale-aware sorting. Pure; no DOM, no requests.
import type { ForumShotLockReason, MagicCardRef } from '../contracts/forum-shot';

export type SortKey = 'dashboard' | 'view' | 'card' | 'status';
export type SortDir = 'ascending' | 'descending';
export interface Sort {
  key: SortKey;
  dir: SortDir;
}

export const SORT_KEYS: readonly SortKey[] = ['card', 'dashboard', 'view', 'status'];

const LOCK_ORDER: readonly ForumShotLockReason[] = ['custom_card', 'limit', 'outside_address', 'cannot_judge'];

/** Identity of a row: the dashboard plus the index path, which stays put when the rows are sorted. */
export const rowKey = (ref: MagicCardRef): string => `${ref.dashboard ?? ''}\u0000${ref.path.join('.')}`;

/** The dashboard's name for display: its title, else the default dashboard's `fallback` name, else its address. */
export function dashboardName(ref: MagicCardRef, fallback: string): string {
  if (ref.dashboardTitle) return ref.dashboardTitle;
  return ref.dashboard === null ? fallback : ref.dashboard;
}

const statusRank = (ref: MagicCardRef): number => (ref.lock === null ? 0 : 1 + LOCK_ORDER.indexOf(ref.lock));

function collatorOf(locale: string): Intl.Collator {
  try {
    return new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  } catch {
    return new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  }
}

/** A sorted copy of `rows`; ties keep dashboard order. No sort returns the rows as they came. */
export function sortedRows(rows: readonly MagicCardRef[], sort: Sort | null, locale: string, defaultName = ''): MagicCardRef[] {
  const out = rows.slice();
  if (!sort) return out;
  const collator = collatorOf(locale);
  const sign = sort.dir === 'ascending' ? 1 : -1;
  const compare = (a: MagicCardRef, b: MagicCardRef): number => {
    switch (sort.key) {
      case 'dashboard':
        return collator.compare(dashboardName(a, defaultName), dashboardName(b, defaultName));
      case 'view':
        return collator.compare(a.view, b.view);
      case 'card':
        return collator.compare(a.cardName, b.cardName);
      default:
        return statusRank(a) - statusRank(b);
    }
  };
  const index = new Map(rows.map((r, i) => [r, i]));
  return out.sort((a, b) => sign * compare(a, b) || (index.get(a) ?? 0) - (index.get(b) ?? 0));
}

/** Rows whose card, dashboard or view name holds `query`, ignoring case; a blank query keeps every row. */
export function filteredRows(rows: readonly MagicCardRef[], query: string, defaultName = ''): MagicCardRef[] {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return rows.slice();
  return rows.filter((r) => [r.cardName, dashboardName(r, defaultName), r.view].some((s) => s.toLocaleLowerCase().includes(q)));
}
