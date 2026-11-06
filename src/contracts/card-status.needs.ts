// card-status 1.0.0, what magic-card.js needs at run time: does a config use quiet_time, and is a quiet_time readable
// (the duration reading is shared with the timer helpers).
// It sits in this file, not in card-status.ts, because the entry may import only *.needs.ts of a contract.

/** "H:MM:SS", "1 day, 2:00:00" or a number of seconds, in ms; undefined when unreadable. */
export function parseDuration(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) && v >= 0 ? v * 1000 : undefined;
  if (typeof v !== 'string') return undefined;
  const m = /^\s*(?:(\d+)\s+days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?\s*$/.exec(v);
  if (!m) return undefined;
  const [, d, h, mi, s] = m;
  return ((Number(d || 0) * 24 + Number(h)) * 3600 + Number(mi) * 60 + Number(s || 0)) * 1000;
}

/** Longest quiet_time text read; a longer one is unreadable. */
export const QUIET_TIME_MAX_CHARS = 32;

/** quiet_time in ms: `H:MM:SS` or seconds >= 0, as a number or a quoted number; undefined when unreadable. */
export function quietMs(v: unknown): number | undefined {
  if (typeof v === 'string') {
    if (v.length > QUIET_TIME_MAX_CHARS) return undefined;
    const n = /^\s*(\d{1,9})\s*$/.exec(v);
    if (n) return Number(n[1]) * 1000;
  }
  const ms = parseDuration(v);
  return ms !== undefined && Number.isFinite(ms) ? ms : undefined;
}

/** The status chunk is wanted: some node of the config (card, module or child) has its own `quiet_time` key. */
export function wantsStatus(config: unknown): boolean {
  try {
    return !!JSON.stringify(config)?.includes('"quiet_time":');
  } catch {
    return false;
  }
}

/** True when some node of the config has an own `quiet_time` that cannot be read (walk capped at 5000 nodes). */
export function hasBadQuiet(node: unknown, budget = { n: 5000 }): boolean {
  if (!node || typeof node !== 'object' || budget.n-- <= 0) return false;
  if ((node as Record<string, unknown>).quiet_time !== undefined && Object.prototype.hasOwnProperty.call(node, 'quiet_time') && quietMs((node as Record<string, unknown>).quiet_time) === undefined) return true;
  return Object.values(node).some((v) => hasBadQuiet(v, budget));
}
