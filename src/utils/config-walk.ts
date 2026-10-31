type Rec = Record<string, unknown>;

/**
 * The one walk behind every needs(config) predicate: the card and everything under it (rows,
 * columns, modules, `hover`, conditional designs and the first 32 appearance rules), each object
 * once. Skips `card_config` and `skipKeys`; stops at the first object `test` accepts. Total: bad
 * input or a throwing test gives false.
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
