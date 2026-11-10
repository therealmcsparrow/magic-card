import type { HomeAssistant } from '../types';

// Contract: the image animator, the lazy editor that animates a whole library image. Version 1.0.0.

export const IMAGE_ANIMATOR_CONTRACT = '1.0.0';

export const IMAGE_ANIMATOR_CHUNK = 'image-animator';
export const IMAGE_ANIMATOR_CHUNK_FILE = 'magic-card-image-animator.js';
export const IMAGE_ANIMATOR_CHUNK_CEILING = 131_072;
export const IMAGE_ANIMATOR_TAG = 'mc-image-animator';

/** Bubbling, composed CustomEvent on the host after a confirmed save; detail ImageAnimatorSaved. */
export const IMAGE_ANIMATOR_SAVED_EVENT = 'mc-image-animator-saved';

export interface ImageAnimatorSaved {
  /** Library id of the saved image; a field shows it as `mcu-image:<id>`. */
  id: string;
}

/** What the animator opens: a library image, or an uploaded .svg that is sanitised with all SMIL stripped. */
export type ImageAnimatorSource = { kind: 'image'; id: string } | { kind: 'upload'; file: File };

/** The element that opens the animator; the dialog mounts in its root and the saved event fires on it. */
export interface ImageAnimatorHost extends HTMLElement {
  hass?: HomeAssistant;
}

/** Opens the animator; resolves when the dialog is shown, false when the chunk or Magic Card Utils is unavailable. */
export type OpenImageAnimator = (host: ImageAnimatorHost, source: ImageAnimatorSource) => Promise<boolean>;

/**
 * Cards whose JSON holds `mcu-image:<id>`, over every dashboard the user can read (the default one included, nested
 * stacks and sections walked); a dashboard that cannot be read is skipped. Never rejects.
 */
export type CountImageUse = (hass: HomeAssistant, id: string) => Promise<number>;

/** What the image-animator chunk exports as `api`. */
export interface ImageAnimatorApi {
  readonly version: typeof IMAGE_ANIMATOR_CONTRACT;
  openImageAnimator: OpenImageAnimator;
  countImageUse: CountImageUse;
}
