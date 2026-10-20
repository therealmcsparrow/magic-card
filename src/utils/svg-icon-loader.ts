import type { RetryableLazyChunk } from '../contracts/lazy-module';

/*
 * The svg-icon chunk as the icon renderer sees it. The card fills the slot (src/utils/lazy-chunks.ts, like the
 * anim-runtime, particles and shape-custom loaders); a bundle without the chunk table (the animation studio, the theme
 * editor) leaves it empty and renderIcon draws <ha-icon>.
 */

let chunk: RetryableLazyChunk | undefined;

export const provideSvgIconChunk = (c: RetryableLazyChunk | undefined): void => void (chunk = c);

export const svgIconChunk = (): RetryableLazyChunk | undefined => chunk;
