function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T>>
): T {
  const result = { ...target };

  for (const source of sources) {
    if (!isObject(source)) continue;

    for (const key of Object.keys(source)) {
      const sourceVal = source[key as keyof typeof source];
      const targetVal = result[key as keyof typeof result];

      if (isObject(sourceVal) && isObject(targetVal)) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetVal as Record<string, unknown>,
          sourceVal as Record<string, unknown>,
        );
      } else if (sourceVal !== undefined) {
        (result as Record<string, unknown>)[key] = sourceVal;
      }
    }
  }

  return result;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as T;

  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    result[key] = deepClone((obj as Record<string, unknown>)[key]);
  }
  return result as T;
}
