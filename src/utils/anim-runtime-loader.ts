import { docNeedsRuntime, type AnimationDoc } from '../anim-studio/model';
import type { LazyChunkControl } from './lazy-chunk';

/*
 * The v2 animation runtime (icon rigs, card-part targets, clips, bindings) is a lazy chunk,
 * dist/magic-card-anim-runtime.js, loaded next to magic-card.js (public path: src/index.ts). Cards
 * whose animations need none of it never load it. It loads through lazyChunk() (lazy-module 1.4.0): one
 * import per page, a failure is retried (silent, then in the background) and shows the failure notice;
 * until it lands, or when it cannot be loaded, the base animation plays.
 *
 * The chunk comes from a slot that the chunk table (src/utils/lazy-chunks.ts) fills. This file never imports the
 * table: the animation studio bundle imports it through animation.ts, and the table would pull every card chunk
 * entry into that bundle's chunk graph. A bundle without the table has no chunk, loads nothing and
 * runtimeIfLoaded() stays undefined, as it always did there.
 */

export type AnimRuntime = typeof import('../anim-runtime');

let chunk: LazyChunkControl<AnimRuntime> | undefined;
let pending: Promise<AnimRuntime | undefined> | undefined;

/** Called by src/utils/lazy-chunks.ts. */
export const provideRuntimeChunk = (c: LazyChunkControl<AnimRuntime>): void => void (chunk = c);

/** The document needs the runtime chunk (rig, tracks, clips or bindings). */
export const needsRuntime = (doc: AnimationDoc): boolean => docNeedsRuntime(doc);

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
