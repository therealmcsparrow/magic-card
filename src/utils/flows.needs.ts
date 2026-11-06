// Whether a card wants the `flows` chunk (needs(config)). Plain code, no imports; the config
// walk calls it on every object of the card.

/** A `flows` list with at least one entry that is an object (the card draws an overlay for it). */
export const hasFlows = (node: unknown): boolean => {
  const c = node as { flows?: unknown } | null;
  return !!c && typeof c === 'object' && Array.isArray(c.flows) && c.flows.some((f) => !!f && typeof f === 'object');
};
