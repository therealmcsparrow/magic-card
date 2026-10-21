/*
 * What magic-card.js needs at run time to decide whether a card wants the `flows` chunk (lazy-module needs(config)).
 * Plain code, no imports. The config walk (src/utils/config-walk.ts) calls it on every object of the card.
 */

/** A `flows` list with at least one entry that is an object (the card draws an overlay for it). */
export const hasFlows = (node: unknown): boolean => {
  const c = node as { flows?: unknown } | null;
  return !!c && typeof c === 'object' && Array.isArray(c.flows) && c.flows.some((f) => !!f && typeof f === 'object');
};
