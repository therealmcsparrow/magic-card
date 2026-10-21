import type * as PauseChunk from './pause-chunk';
import { lazyChunks } from '../utils/lazy-chunks';

/** What the installed `pause` chunk gives the card (type only: the chunk is not imported here). */
export type PauseModule = typeof PauseChunk;

/**
 * The `pause` chunk when it has installed, else undefined; never starts a load (the needs table does, and the card
 * when a preview pause asks for it). Only the card imports this file, because the chunk table is evaluated here.
 */
export const pauseIfLoaded = (): PauseModule | undefined => lazyChunks.pause.module() as PauseModule | undefined;
