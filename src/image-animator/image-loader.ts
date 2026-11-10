import type { CheckImageAnimation } from '../contracts/image-animation';
import type { SvgImageApi } from '../contracts/svg-image';
import { loadImageAnim, loadTrackCompiler } from '../svg-image/anim-loader';
import type { PreviewKit } from './preview';

// Loads the svg-image chunk (its only import() in the animator), the animation check and the preview player; one shared load.

export interface ImageTools {
  api: SvgImageApi;
  check: CheckImageAnimation;
  /** Defines <mc-svg-image>, the preview of the animator. */
  install(): void;
  /** The image-anim player and the anim-runtime track compiler that the preview plays with. */
  kit: PreviewKit;
}

let pending: Promise<ImageTools | undefined> | undefined;

async function load(): Promise<ImageTools | undefined> {
  try {
    const [images, anim, compile] = await Promise.all([
      import(/* webpackChunkName: "svg-image" */ '../svg-image/chunk'),
      loadImageAnim(),
      loadTrackCompiler(),
    ]);
    if (!anim || !compile) return undefined;
    return { api: images.api, check: anim.checkImageAnimation, install: images.install, kit: { play: anim.api.play, compile } };
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
