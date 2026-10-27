import { K } from './kit';
import type { LibraryProblem } from '../svg-editor/library';
import { IMAGE_CMD, type ImageSummary, type SavedImage, type SavedImageInput } from '../contracts/mcu-library-images';

/* The editor's side of the image library (mcu-library 1.1.0 images part). The call and its error map are the shared client (handed over through the kit); here a failure becomes an ImageError. */

export interface ImageHass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type ImageProblem = LibraryProblem | 'too_large' | 'failed';

export class ImageError extends Error {
  constructor(
    public problem: ImageProblem,
    public bytes?: number,
    public limit?: number,
    /** The library's own reason for refusing the markup, and the denied word when that was the reason. */
    public detail?: string,
    public word?: string,
  ) {
    super(problem);
  }
}

const obj = (v: unknown): Record<string, unknown> => (typeof v === 'object' && v ? (v as Record<string, unknown>) : {});

/** The image library's reading of a failure: the size when too large, its reason or the denied word when it refused the markup, `failed` for any other server error. */
function fault(problem: LibraryProblem, raw?: unknown): ImageError {
  const err = obj(raw);
  if (problem === 'invalid') {
    const list = Array.isArray(err.errors) ? err.errors.map(obj) : [];
    const big = list.find((x) => x.message === 'too_large');
    if (big) return new ImageError('too_large', big.bytes as number, big.limit as number);
    const first = list.find((x) => x.message === 'forbidden_text') ?? list[0];
    const word = first?.message === 'forbidden_text';
    return new ImageError('invalid', undefined, undefined, word ? undefined : (first?.message as string), word ? (first.word as string) : undefined);
  }
  return new ImageError(problem === 'unreachable' && err.code ? 'failed' : problem);
}

const call = <T>(hass: ImageHass | undefined, msg: Record<string, unknown>): Promise<T> => K.libraryCall<T>(hass, msg, fault);

export const listImages = (h?: ImageHass): Promise<ImageSummary[]> => call<{ images: ImageSummary[] }>(h, { type: IMAGE_CMD.list }).then((r) => r.images ?? []);

/** The stored image straight from the library (not the card's cache). */
export const fetchImage = (h: ImageHass | undefined, id: string): Promise<SavedImage | undefined> => call<{ images: SavedImage[] }>(h, { type: IMAGE_CMD.get, ids: [id] }).then((r) => r.images?.[0]);

export const storeImage = (h: ImageHass | undefined, image: SavedImageInput, baseUpdatedAt?: string): Promise<ImageSummary> =>
  call<{ image: ImageSummary }>(h, { type: IMAGE_CMD.save, image, ...(baseUpdatedAt ? { base_updated_at: baseUpdatedAt } : {}) }).then((r) => r.image);
