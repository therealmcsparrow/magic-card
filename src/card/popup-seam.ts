import type * as PopupChunk from './popup-chunk';
import { lazyChunks } from '../utils/lazy-chunks';

/** What the installed `popup` chunk gives the card and the editor (type only: the chunk is not imported here). */
export type PopupModule = typeof PopupChunk;

/**
 * The `popup` chunk when it has installed, else undefined; never starts a load (the needs table does, and the editor's
 * "Preview pop-up"). No chunk means no pop-up can be open. The card and the editor import this file, never the chunk or
 * its coordinator: a second copy of the coordinator would be a second, empty one.
 */
export const popupIfLoaded = (): PopupModule | undefined => lazyChunks.popup.module() as PopupModule | undefined;
