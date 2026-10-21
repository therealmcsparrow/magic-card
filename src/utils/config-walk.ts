type Rec = Record<string, unknown>;

/**
 * The one walk behind every needs(config) predicate (lazy-module 1.4.0 "needs(config)"): the card and everything
 * under it, that is rows, columns, modules and their nested children, `hover`, every `conditional[].design`, and the
 * first 32 `conditional_appearance` rules; each object once; `card_config` subtrees (an embedded card is not ours)
 * are skipped, and so is every key named in `skipKeys`. Stops at the first object `test` accepts. Total: a config that is not an object, one that is too
 * deep, or a test that throws gives false.
 */
export function configHas(config: unknown, test: (node: Rec) => unknown, skipKeys: readonly string[] = []): boolean {
  const seen = new Set<unknown>();
  const walk = (node: unknown): boolean => {
    if (!node || typeof node !== 'object' || seen.has(node)) return false;
    seen.add(node);
    if (Array.isArray(node)) return node.some(walk);
    const rec = node as Rec;
    if (test(rec)) return true;
    return Object.keys(rec).some((key) => key !== 'card_config' && !skipKeys.includes(key) && walk(key === 'conditional_appearance' && Array.isArray(rec[key]) ? (rec[key] as unknown[]).slice(0, 32) : rec[key]));
  };
  try {
    return walk(config);
  } catch {
    return false;
  }
}
