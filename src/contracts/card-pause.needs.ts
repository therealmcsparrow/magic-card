/*
 * card-pause 2.0.0, the names magic-card.js needs at run time. They sit in this predicate file, not in card-pause.ts,
 * because the entry may import only *.needs.ts of a contract (see tools/check-entry-graph.mjs); card-pause.ts
 * re-exports them.
 */

export const PAUSE_ATTRIBUTE = 'data-mc-paused';
export const PAUSE_EVENT = 'mc-pause-change';
export const PAUSE_STORAGE_PREFIX = 'mc-paused:';
