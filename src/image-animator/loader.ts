import type { ImageAnimatorApi } from '../contracts/image-animator';
import { lazyChunk } from '../utils/lazy-chunk';

// The only importer of the image animator chunk (image-animator 1.0.0), through the shared lazyChunk() helper.

export interface ImageAnimatorModule {
  api: Omit<ImageAnimatorApi, 'countImageUse'>;
  install(): void;
  BUILD: string;
}

export const imageAnimatorChunk = lazyChunk('image-animator', () => import(/* webpackChunkName: "image-animator" */ './index'));

/** The chunk's api, loaded once; undefined when the load fails. */
export async function loadImageAnimator(): Promise<ImageAnimatorModule['api'] | undefined> {
  if (!(await imageAnimatorChunk.load())) return undefined;
  return (imageAnimatorChunk.module() as ImageAnimatorModule | undefined)?.api;
}
