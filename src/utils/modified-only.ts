/** The inspector's "Modified only" filter: field helpers skip a field whose key is absent (its default). */

/** One filtered render: labels that stay, and the counts. */
interface Filter {
  keep: ReadonlySet<string>;
  shown: number;
  skipped: number;
}

let current: Filter | undefined;

/** Result of one filtered render: how many fields showed and how many were left out. */
export interface ModifiedOnlyCount {
  shown: number;
  skipped: number;
}

/** Runs `fn` with the filter on; `keep` holds labels of fields the user is editing, which stay until they leave the filter. */
export function withModifiedOnly<T>(keep: ReadonlySet<string>, fn: () => T): { value: T; count: ModifiedOnlyCount } {
  const previous = current;
  const filter: Filter = { keep, shown: 0, skipped: 0 };
  current = filter;
  try {
    const value = fn();
    return { value, count: { shown: filter.shown, skipped: filter.skipped } };
  } finally {
    current = previous;
  }
}

/** A field with no value (key absent, empty text) is at its default. */
export function isDefaultValue(value: unknown): boolean {
  return value === undefined || value === null || value === '' || (typeof value === 'number' && Number.isNaN(value));
}

/** True when the filter is on and this field is at its default and not being edited: the helper renders nothing. */
export function skipField(label: string, value: unknown): boolean {
  if (!current) return false;
  if (!isDefaultValue(value) || current.keep.has(label)) {
    current.shown++;
    return false;
  }
  current.skipped++;
  return true;
}
