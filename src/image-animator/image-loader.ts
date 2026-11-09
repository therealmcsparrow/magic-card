import type { CheckImageAnimation } from '../contracts/image-animation';
import type { SvgImageApi } from '../contracts/svg-image';
import { loadImageAnim } from '../svg-image/anim-loader';

// Loads the svg-image chunk (its only import() in the animator) and the animation check; one shared load.

export interface ImageTools {
  api: SvgImageApi;
  check: CheckImageAnimation;
  /** Defines <mc-svg-image>, the preview of the animator. */
  install(): void;
}

let pending: Promise<ImageTools | undefined> | undefined;

async function load(): Promise<ImageTools | undefined> {
  try {
    const [images, anim] = await Promise.all([import(/* webpackChunkName: "svg-image" */ '../svg-image/chunk'), loadImageAnim()]);
    if (!anim) return undefined;
    return { api: images.api, check: anim.checkImageAnimation, install: images.install };
  } catch (err) {
    console.warn('Magic Card: image animator could not load the image tools', err);
    return undefined;
  }
}

/** The tools, loaded once; undefined when a chunk fails (a later call tries again). */
export function loadImageTools(): Promise<ImageTools | undefined> {
  pending ??= load().then((tools) => {
    if (!tools) pending = undefined;
    return tools;
  });
  return pending;
}

/** Tests: forget the shared load. */
export function __resetImageToolsForTests(): void {
  pending = undefined;
}
