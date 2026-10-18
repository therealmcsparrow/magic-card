import { BUILD_VERSION } from './build-version';
import { LAZY_CHUNK_FILES } from '../contracts/lazy-module';
import type { LazyChunk, LazyChunkModule, LazyChunkName } from '../contracts/lazy-module';

/*
 * The one loader for the lazy chunks of epic D (contract lazy-module 1.0.0, ADR 0024). Memoised load,
 * BUILD check, install, one warning on failure, no retry until the page reloads (the particles
 * pattern). The server ignores the `?v=<contenthash>` query, so a cached magic-card.js can receive
 * the chunk of a newer release: the chunk is evaluated (harmless by contract) but never installed.
 */

/** The release this magic-card.js was built from; chunk entries carry their own copy as BUILD. */
export { BUILD_VERSION };

export { sameBuild } from './build-version';

export type LazyImporter = () => Promise<LazyChunkModule>;

/** A LazyChunk plus the test hook that forgets its state (identity stays, the registry holds it). */
export interface LazyChunkControl extends LazyChunk {
  /** Tests: forget the load and swap the import (undefined restores the real one). */
  __reset(importer?: LazyImporter): void;
}

export function lazyChunk(name: LazyChunkName, realImporter: LazyImporter): LazyChunkControl {
  const file = LAZY_CHUNK_FILES[name];
  let importer = realImporter;
  let pending: Promise<boolean> | undefined;
  let state: 'idle' | 'loading' | 'ready' | 'failed' = 'idle';
  let waiting = new Set<() => void>();
  let generation = 0;

  const fail = (gen: number, message: string, err?: unknown): false => {
    if (gen !== generation) return false;
    state = 'failed';
    waiting.clear();
    console.warn(message, ...(err === undefined ? [] : [err]));
    return false;
  };

  const run = async (gen: number): Promise<boolean> => {
    let mod: LazyChunkModule;
    try {
      mod = await importer();
    } catch (err) {
      return fail(gen, `Magic Card: ${file} did not load`, err);
    }
    if (gen !== generation) return false;
    if (mod?.BUILD !== BUILD_VERSION) {
      return fail(gen, `Magic Card was updated, reload the page (magic-card.js ${BUILD_VERSION}, ${file} ${String(mod?.BUILD)}).`);
    }
    try {
      mod.install();
    } catch (err) {
      return fail(gen, `Magic Card: ${file} did not load`, err);
    }
    state = 'ready';
    const callbacks = [...waiting];
    waiting.clear();
    for (const cb of callbacks) {
      try {
        cb();
      } catch (err) {
        console.warn(`Magic Card: a ${file} callback failed`, err);
      }
    }
    return true;
  };

  return {
    name,
    load() {
      if (!pending) {
        state = 'loading';
        pending = run(generation);
      }
      return pending;
    },
    ready: () => state === 'ready',
    failed: () => state === 'failed',
    whenReady(cb) {
      if (state === 'ready') cb();
      else if (state !== 'failed') waiting.add(cb);
    },
    __reset(next) {
      generation++;
      importer = next ?? realImporter;
      pending = undefined;
      state = 'idle';
      waiting = new Set();
    },
  };
}
