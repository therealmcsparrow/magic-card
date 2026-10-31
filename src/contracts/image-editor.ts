import type { HomeAssistant } from '../types';
import type { ImageBinding, SavedImageInput } from './mcu-library-images';

/** Contract: image editing. Version 1.2.0 (IMAGE_EDITOR_CONTRACT), revision 7. Full drawings are edited in
 * <mc-svg-editor> (svg-editor 1.2.0) in image mode. */

export const IMAGE_EDITOR_CONTRACT = '1.2.0';
export const IMAGE_EDITOR_CONTRACT_REVISION = 7;

export const IMAGE_EDITOR_CHUNK = 'image-editor';
export const IMAGE_EDITOR_CHUNK_FILE = 'magic-card-image-editor.js';
export const IMAGE_EDITOR_CHUNK_CEILING = 96 * 1024;
export const IMAGE_TOOLS_CHUNK = 'image-tools';
export const IMAGE_TOOLS_CHUNK_FILE = 'magic-card-image-tools.js';
export const IMAGE_TOOLS_CHUNK_CEILING = 32 * 1024;

export const IMAGE_CANVAS_PRESETS: readonly { ratio: string; width: number; height: number }[] = [
  { ratio: '1:1', width: 1024, height: 1024 },
  { ratio: '4:3', width: 1280, height: 960 },
  { ratio: '16:9', width: 1920, height: 1080 },
  { ratio: '9:16', width: 1080, height: 1920 },
];
export const IMAGE_CANVAS_MIN = 16;
export const IMAGE_THEME_COLOURS: readonly string[] = [
  '--primary-color', '--accent-color', '--primary-text-color', '--secondary-text-color', '--disabled-text-color',
  '--card-background-color', '--primary-background-color', '--secondary-background-color', '--divider-color',
  '--state-icon-color', '--error-color', '--warning-color', '--success-color', '--info-color',
];
export const THUMB_SIDE_PX = 320;
export const MAX_IMAGE_IMPORT_BYTES = 8 * 1024 * 1024;

/** New image ids: the slug of the name. */
export const IMAGE_ID_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,47})$/;

/** The class that marks an imported part's group in the saved markup. */
export const IMAGE_PART_CLASS = 'mc-part';
/** Most part data of one image, in UTF-16 code units. */
export const IMAGE_PART_DATA_MAX = 2 * 256 * 1024;

export const REFERENCE_TYPES: readonly string[] = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'];
export const REFERENCE_MAX_FILE_BYTES = 64 * 1024 * 1024;
export const REFERENCE_MAX_SIDE = 4096;
export const REFERENCE_ALIGN_KEY_PREFIX = 'mc-image-reference:';

/** What the shell hands createImageExt. */
export interface ImageEditorHost {
  hass: HomeAssistant | undefined;
  host: 'mcu' | 'card';
  /** Library writes allowed (Magic Card Utils present and the user is an admin). */
  canWrite: boolean;
  requestUpdate(): void;
}

/** Seam between <mc-svg-editor> and the image-editor chunk; shapes of the parts are internal to the two folders. */
export interface ImageEditorExt {
  readonly revision: number;
  /** Paint, text and gradient attributes for the saved markup of one layer. */
  serialiseLayer(layer: unknown): string;
  /** Layers from imported markup (text, gradients, locked parts) the icon importer does not handle. */
  importParts(markup: string): unknown[];
  bindings(): ImageBinding[];
  /** Builds the save payload (sanitised markup, bindings, thumb) or the reason it cannot be saved. */
  buildSave(meta: { id: string; name: string }): Promise<{ ok: true; input: SavedImageInput } | { ok: false; reason: 'too_large' | 'full' | 'invalid'; bytes?: number }>;
  /** The drawing as a download (api.fileBlob); undefined when nothing is drawable. */
  exportFile(): Blob | undefined;
  dispose(): void;
}
