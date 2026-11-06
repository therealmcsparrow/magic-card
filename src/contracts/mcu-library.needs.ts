// mcu-library 1.0.0, the event name magic-card.js needs at run time (mc-shape). It sits in this predicate file,
// not in mcu-library.ts, because the entry may import only *.needs.ts of a contract (see
// tools/check-entry-graph.mjs); mcu-library.ts re-exports it.

export const LIBRARY_CHANGED_EVENT = 'mcu-library-changed';
