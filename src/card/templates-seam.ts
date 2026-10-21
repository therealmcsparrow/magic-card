import type * as TemplatesChunk from '../services/templates-chunk';
import { lazyChunks } from '../utils/lazy-chunks';

/** What the installed `templates` chunk gives the card (type only: the chunk is not imported here). */
export type TemplatesModule = typeof TemplatesChunk;

/**
 * The `templates` chunk when it has installed, else undefined; never starts a load (the needs table does). Only the
 * card imports this file, because the chunk table is evaluated here.
 */
export const templatesIfLoaded = (): TemplatesModule | undefined => lazyChunks.templates.module() as TemplatesModule | undefined;
