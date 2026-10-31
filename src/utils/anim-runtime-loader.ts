import type { LazyChunkControl } from './lazy-chunk';

/*
 * Loader of the v2 animation runtime chunk (dist/magic-card-anim-runtime.js) through lazyChunk():
 * one import per page, retried on failure, base animation plays until it lands. It never imports
 * the chunk table, which would pull every card chunk entry into the studio bundle.
 */

export type AnimRuntime = typeof import('../anim-runtime');

let chunk: LazyChunkControl<AnimRuntime> | undefined;
let pending: Promise<AnimRuntime | undefined> | undefined;

/** Called by src/utils/lazy-chunks.ts. */
export const provideRuntimeChunk = (c: LazyChunkControl<AnimRuntime>): void => void (chunk = c);

/** Load the runtime chunk once; resolves undefined when it cannot be loaded (the chunk retries on its own). */
export function loadRuntime(): Promise<AnimRuntime | undefined> {
  if (!chunk) return Promise.resolve(undefined);
  return (pending ??= chunk.load().then((ok) => {
    if (!ok) pending = undefined;
    return ok ? chunk!.module() : undefined;
  }));
}

/** The runtime when it has loaded, else undefined (never starts a load). */
export const runtimeIfLoaded = (): AnimRuntime | undefined => chunk?.module();

/** Tests: forget the cached load. */
export function __resetRuntimeLoaderForTests(): void {
  chunk?.__reset();
  pending = undefined;
}
