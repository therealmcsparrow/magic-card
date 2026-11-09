import type { CheckImageAnimation, ImageAnimChunk, ImageTrackCompiler } from '../contracts/image-animation';
import { loadRuntime } from '../utils/anim-runtime-loader';
import { lazyChunk } from '../utils/lazy-chunk';

// The one way into the image-anim chunk from the svg-image part; the chunk is fetched only for a record with an animation.

export interface ImageAnimModule {
  api: ImageAnimChunk;
  checkImageAnimation: CheckImageAnimation;
  install(): void;
  BUILD: string;
}

const chunk = lazyChunk('image-anim', () => import(/* webpackChunkName: "image-anim" */ '../image-anim/chunk'));

/** The chunk module, loaded once; undefined when the load fails (a later call tries again). */
export function loadImageAnim(): Promise<ImageAnimModule | undefined> {
  return chunk.load().then((ok) => (ok ? chunk.module() : undefined));
}

/** The track compiler of the anim-runtime chunk; undefined when that chunk does not load. */
export function loadTrackCompiler(): Promise<ImageTrackCompiler | undefined> {
  return loadRuntime().then((rt) => rt?.compileTracks);
}

/** True when a raw animation has a clip with tracks, the only kind that needs the compiler. */
export function wantsTracks(raw: unknown): boolean {
  const clips = (raw as { clips?: unknown } | null | undefined)?.clips;
  return Array.isArray(clips) && clips.some((c) => Array.isArray((c as { tracks?: unknown } | null)?.tracks) && (c as { tracks: unknown[] }).tracks.length > 0);
}
