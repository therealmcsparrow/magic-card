import type { LazyChunk } from '../contracts/lazy-module';
import type { NeedSvgImage } from '../contracts/svg-image';

/** The svg-image chunk as the card entry sees it; the chunk table fills the slot. */

let chunk: Pick<LazyChunk, 'load'> | undefined;

export const provideSvgImageChunk = (c: Pick<LazyChunk, 'load'> | undefined): void => void (chunk = c);

/** A render shows a library image: start the chunk (idempotent) and let the card show its failure notice. */
export const needSvgImage: NeedSvgImage = (ctx) => {
  void chunk?.load();
  ctx?.metChunk?.('svg-image');
};
