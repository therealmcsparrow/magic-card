import type * as AnimChunk from '../anim-studio/anim-chunk';
import { lazyChunks } from './lazy-chunks';

/** What the installed `anim` chunk gives the card (type only: the chunk is not imported here). */
export type AnimModule = typeof AnimChunk;

/**
 * The `anim` chunk when it has installed, else undefined; never starts a load (the needs table does, and the card
 * seam when it meets a design the config walk missed). Only the card imports this file, because the chunk table is
 * evaluated here.
 */
export const animIfLoaded = (): AnimModule | undefined => lazyChunks.anim.module() as AnimModule | undefined;
