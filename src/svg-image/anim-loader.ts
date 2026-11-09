import type { CheckImageAnimation, ImageAnimChunk } from '../contracts/image-animation';

// The one way into the image-anim chunk from the svg-image part; the chunk is fetched only for a record with an animation.

export interface ImageAnimModule {
  api: ImageAnimChunk;
  checkImageAnimation: CheckImageAnimation;
}

let loading: Promise<ImageAnimModule | undefined> | undefined;

/** The chunk module, loaded once; undefined when the load fails (a later call tries again). */
export function loadImageAnim(): Promise<ImageAnimModule | undefined> {
  return (loading ??= import(/* webpackChunkName: "image-anim" */ '../image-anim/chunk').then(
    (m) => m,
    () => {
      loading = undefined;
      return undefined;
    },
  ));
}
