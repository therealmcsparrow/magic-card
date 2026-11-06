// flow-anchor 1.2.0, the string magic-card.js needs at run time. It sits in this predicate file, not in
// flow-anchor.ts, because the entry may import only *.needs.ts of a contract (see tools/check-entry-graph.mjs);
// flow-anchor.ts re-exports it.

/** The two main-visual markers (DOM seam). magic-card.js inlines this string once (mc-flows). */
export const FLOW_END_SELECTOR = '.mc-anim-icon,[data-mc-flow-end]';
