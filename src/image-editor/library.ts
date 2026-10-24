import { IMAGE_CMD, type ImageSummary, type SavedImage, type SavedImageInput } from '../contracts/mcu-library-images';

/* The editor's side of the image library (mcu-library 1.1.0 images part). Errors become a few problems the editor can word. */

export interface ImageHass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type ImageProblem = 'missing' | 'readonly' | 'conflict' | 'full' | 'invalid' | 'too_large' | 'unreachable';

export class ImageError extends Error {
  constructor(
    public problem: ImageProblem,
    public bytes?: number,
    public limit?: number,
  ) {
    super(problem);
  }
}

function fail(e: unknown): never {
  const err = e as { code?: string; errors?: Array<{ message?: string; bytes?: number; limit?: number }> };
  const big = err?.errors?.find((x) => x.message === 'too_large');
  if (err?.code === 'invalid_format' && big) throw new ImageError('too_large', big.bytes, big.limit);
  const c = err?.code ?? '';
  throw new ImageError(c === 'unknown_command' ? 'missing' : c === 'unauthorized' ? 'readonly' : c === 'conflict' ? 'conflict' : c === 'library_full' ? 'full' : c === 'invalid_format' ? 'invalid' : 'unreachable');
}

async function call<T>(hass: ImageHass | undefined, msg: Record<string, unknown>): Promise<T> {
  if (!hass?.callWS) throw new ImageError('missing');
  try {
    return await hass.callWS<T>(msg);
  } catch (e) {
    return fail(e);
  }
}

export const listImages = (h?: ImageHass): Promise<ImageSummary[]> => call<{ images: ImageSummary[] }>(h, { type: IMAGE_CMD.list }).then((r) => r.images ?? []);

/** The stored image straight from the library (not the card's cache). */
export const fetchImage = (h: ImageHass | undefined, id: string): Promise<SavedImage | undefined> => call<{ images: SavedImage[] }>(h, { type: IMAGE_CMD.get, ids: [id] }).then((r) => r.images?.[0]);

export const storeImage = (h: ImageHass | undefined, image: SavedImageInput, baseUpdatedAt?: string): Promise<ImageSummary> =>
  call<{ image: ImageSummary }>(h, { type: IMAGE_CMD.save, image, ...(baseUpdatedAt ? { base_updated_at: baseUpdatedAt } : {}) }).then((r) => r.image);
