import { LIBRARY_WARN_BYTES } from '../contracts/image-editor';
import { IMAGE_CAPS_ANIMATION, IMAGE_CMD, imageMaxBytes, type ImageListResult, type ImageSummary } from '../contracts/mcu-library-images';

export interface LibraryWarning {
  /** Total size of the library in bytes. */
  bytes: number;
}

/** The warning once the library holds LIBRARY_WARN_BYTES or more; it only informs and never blocks a save. */
export const libraryWarning = (images: readonly { bytes: number }[]): LibraryWarning | undefined => {
  const bytes = images.reduce((n, i) => n + (Number.isFinite(i.bytes) ? i.bytes : 0), 0);
  return bytes >= LIBRARY_WARN_BYTES ? { bytes } : undefined;
};

export interface LibraryState {
  images: ImageSummary[];
  /** The cap a save may use: caps.image_max_bytes, else 256 KiB (an older Utils). */
  cap: number;
  warning?: LibraryWarning;
  /** Magic Card Utils reports `caps.animation`: it can store an animation. */
  animates: boolean;
}

/** One images_list read: the rows, the effective byte cap and the size warning. */
export async function readLibrary(hass: { callWS<T>(msg: Record<string, unknown>): Promise<T> } | undefined): Promise<LibraryState | undefined> {
  if (!hass) return undefined;
  const r = await hass.callWS<ImageListResult>({ type: IMAGE_CMD.list });
  const images = r?.images ?? [];
  return { images, cap: imageMaxBytes(r), animates: r?.caps?.animation === IMAGE_CAPS_ANIMATION, warning: libraryWarning(images) };
}
