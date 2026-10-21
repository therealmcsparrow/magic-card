import { useCustomBuilder } from './shape-path';
import type { LazyChunkControl } from './lazy-chunk';

/*
 * The `shape: custom` builder (src/utils/shape-custom.ts) is a lazy chunk, dist/magic-card-shape-custom.js
 *, loaded through lazyChunk() (lazy-module 1.4.0). A card that uses a custom shape starts the load;
 * until the builder is registered the element renders as `shape: none`, and the card renders again when the
 * load resolves. A failed load is retried (silent, then in the background) with the failure notice; the
 * element stays unshaped meanwhile. The chunk comes from a slot the chunk table (src/utils/lazy-chunks.ts)
 * fills, like in anim-runtime-loader.ts.
 */

type Chunk = LazyChunkControl<typeof import('./shape-custom')>;
let chunk: Chunk | undefined;

// runs in the install step, also for a load that succeeds on a background retry
const register = (): void => void chunk?.whenReady(() => useCustomBuilder(chunk!.module()!.buildCustom));

/** Called by src/utils/lazy-chunks.ts. */
export const provideShapeChunk = (c: Chunk): void => {
  chunk = c;
  register();
};

/** Load the builder chunk once and register it; resolves false when it cannot be loaded. */
export const loadCustomShapes = (): Promise<boolean> => chunk?.load() ?? Promise.resolve(false);

/** The builder is registered (never starts a load). */
export const customShapesReady = (): boolean => !!chunk?.ready();

/** Tests: forget the load and the registered builder. */
export function __resetCustomShapesForTests(): void {
  chunk?.__reset();
  useCustomBuilder(undefined);
  register();
}
