import type { SvgImageApi } from '../contracts/svg-image';
import type { Kit } from '../image-editor/kit';
import type { ImageShell, ImageUi } from './image-seam';

/*
 * Loads the image-editor chunk together with the svg-image chunk; the only import() of the image-editor chunk.
 * Returns null on failure or after 8 s; the next call tries again.
 */

const TIMEOUT_MS = 8000;
type Entry = (shell: ImageShell, api: SvgImageApi, kit: Kit) => ImageUi;
interface Loaded {
  create: Entry;
  api: SvgImageApi;
}

let pending: Promise<Loaded | null> | undefined;
let api: SvgImageApi | undefined;

/** The svg-image chunk's api once loadImageEditor() resolved. */
export const imageApi = (): SvgImageApi | undefined => api;

export function loadImageEditor(): Promise<Entry | null> {
  pending ??= Promise.race([
    Promise.all([import(/* webpackChunkName: "svg-image" */ '../svg-image/chunk'), import(/* webpackChunkName: "image-editor" */ '../image-editor/chunk')]).then(([images, editor]) => {
      api = images.api;
      return { create: editor.createImageExt as Entry, api: images.api };
    }),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]).then(
    (l) => {
      if (!l) pending = undefined;
      return l;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: image editor not loaded', err);
      return null;
    },
  );
  return pending.then((l) => l?.create ?? null);
}

/** Tests: forget the shared promise. */
export function __resetImageEditorForTests(): void {
  pending = undefined;
  api = undefined;
}
