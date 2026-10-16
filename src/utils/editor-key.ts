import type { CardModule } from '../types';

/**
 * Key of the module whose editor is being rendered: its editor path ("r0.c1.m2/1.0"), set by the
 * inspector (and extended for inline child editors) for the duration of the synchronous render.
 * Editor UI state of a module (edited tab / column, expanded children, embedded card editors) is
 * kept per key, so two modules never share it, even without ids or with duplicated ids.
 */
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
