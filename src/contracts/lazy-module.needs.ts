// lazy-module 1.4.0, the numbers magic-card.js needs at run time. They sit in this predicate file, not in
// lazy-module.ts, because the entry may import only *.needs.ts of a contract (see tools/check-entry-graph.mjs);
// lazy-module.ts re-exports them.

/** One attempt (the import plus install) is a failure after this long. */
export const CHUNK_TIMEOUT_MS = 10_000;

/** A load error is retried once, silently, after this long, under a new URL. */
export const SILENT_RETRY_MS = 2_000;

/** After the notice shows: one background attempt after each of these delays (30 s, 90 s, 5 min), per chunk. */
export const BACKGROUND_RETRY_MS: readonly number[] = [30_000, 90_000, 300_000];
