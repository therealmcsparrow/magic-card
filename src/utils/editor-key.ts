import type { CardModule } from '../types';

/** Key of the module whose editor is being rendered; editor UI state is kept per key. */
let current: string | undefined;

export function withEditorKey<T>(key: string, fn: () => T): T {
  const previous = current;
  current = key;
  try {
    return fn();
  } finally {
    current = previous;
  }
}

/** The key of the module being edited; its id outside an inspector render (other hosts, tests). */
export function editorKey(config: CardModule): string {
  return current ?? config.id ?? '';
}
