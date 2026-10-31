import type { RetryableLazyChunk } from '../contracts/lazy-module';
import type * as IconChunk from '../icons/chunk';

/** The svg-icon chunk as the icon renderer sees it; an empty slot falls back to <ha-icon>. */

type Slot = RetryableLazyChunk & { module(): unknown };
let chunk: Slot | undefined;

export const provideSvgIconChunk = (c: Slot | undefined): void => void (chunk = c);

export const svgIconChunk = (): RetryableLazyChunk | undefined => chunk;

/**
 * The icon source's one copy: the installed chunk's `api`. The card editor and the editors it loads call
 * it with `!`: loadEditor() loads `svg-icon` before the editor chunk runs. Undefined until the chunk has installed.
 */
export const svgIconApi = (): typeof IconChunk.api | undefined => (chunk?.module() as typeof IconChunk | undefined)?.api;
