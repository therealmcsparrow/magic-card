import type { SvgImageApi } from '../contracts/svg-image';
import { onDemandChunks } from '../utils/lazy-chunks';
import type { ImageShell, ImageUi } from './image-seam';

/*
 * Loads the image-editor chunk (magic-card-image-editor.js) for an image source, together with the svg-image chunk
 * whose api it uses for every sanitiser, thumbnail and download. The only import() of the image-editor chunk. An icon
 * source never calls this. null on failure or after 8 s; the next call tries again.
 */

const TIMEOUT_MS = 8000;
type Entry = (shell: ImageShell, api: SvgImageApi) => ImageUi;

/** The svg-image chunk's api once its chunk is installed. */
export const imageApi = (): SvgImageApi | undefined => (onDemandChunks['svg-image'].module() as { api?: SvgImageApi } | undefined)?.api;

let pending: Promise<Entry | null> | undefined;

export function loadImageEditor(): Promise<Entry | null> {
  pending ??= Promise.race([
    Promise.all([onDemandChunks['svg-image'].load(), import(/* webpackChunkName: "image-editor" */ '../image-editor/chunk')]).then(([ok, m]) => (ok && imageApi() ? (m.createImageExt as Entry) : null)),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]).then(
    (e) => {
      if (!e) pending = undefined;
      return e;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: image editor not loaded', err);
      return null;
    },
  );
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetImageEditorForTests(): void {
  pending = undefined;
}
