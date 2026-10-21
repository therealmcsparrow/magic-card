import type * as FlowsChunk from './flows-chunk';
import { lazyChunks } from '../utils/lazy-chunks';

/** What the installed `flows` chunk gives the card (type only: the chunk is not imported here). */
export type FlowsModule = typeof FlowsChunk;

/**
 * The `flows` chunk when it has installed, else undefined; never starts a load (the needs table does, and the card
 * when it meets flows the config walk missed). Only the card imports this file, because the chunk table is evaluated here.
 */
export const flowsIfLoaded = (): FlowsModule | undefined => lazyChunks.flows.module() as FlowsModule | undefined;
