import type { LazyChunkControl } from './lazy-chunk';
import type { CustomShapeChunk } from '../contracts/custom-shape';

/** Loader of the `shape: custom` builder chunk (dist/magic-card-shape-custom.js) through lazyChunk(). */

type Chunk = LazyChunkControl<typeof import('./shape-custom')>;
let chunk: Chunk | undefined;
let builder: CustomShapeChunk['buildCustom'] | undefined;

/** Register (or, with nothing, remove) the custom builder; shape-path drops the outlines it memoised. */
export const useCustomBuilder = (fn?: CustomShapeChunk['buildCustom']): void => {
  builder = fn;
};

/** The registered builder; undefined until the chunk has loaded. */
export const customBuilder = (): CustomShapeChunk['buildCustom'] | undefined => builder;

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
