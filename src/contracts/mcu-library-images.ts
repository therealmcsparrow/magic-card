import type { ItemMeta } from './mcu-library';

/** Contract: mcu-library 1.1.0, images part. Version 1.1.0. Mirror of magic-card-utils
 * custom_components/magic_card_utils/library_images_contract.py, which holds the storage, command and validation rules. */

export const MCU_LIBRARY_IMAGES_CONTRACT_VERSION = '1.1.0';

export const IMAGE_CMD = {
  list: 'magic_card_utils/images_list',
  get: 'magic_card_utils/images_get',
  save: 'magic_card_utils/images_save',
  remove: 'magic_card_utils/images_delete',
} as const;

export const IMAGE_MAX_BYTES = 256 * 1024;
export const THUMB_MAX_BYTES = 16 * 1024;
export const MAX_IMAGES = 200;
export const MAX_IMAGE_GET_IDS = 8;
export const MAX_IMAGE_BOX = 4096;
export const IMAGES_MIN_CONTRACT_REVISION = 6;
export const BINDING_COLOUR_RE = /^(#[0-9a-fA-F]{3,8}|theme:[a-z0-9][a-z0-9-]{0,63}|main|accent|entity)$/;
export const THUMB_RE = /^data:image\/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
/** The one xmlns value the server takes, on the root <svg> only. */
export const IMAGE_ROOT_XMLNS = 'http://www.w3.org/2000/svg';

/** images_get error code for more than MAX_IMAGE_GET_IDS ids. */
export const IMAGE_ERR_TOO_MANY = 'too_many';

export type BindingSet = 'fill' | 'stroke' | 'opacity' | 'visible';
export type BindingValue = string | number | boolean;

export interface BindingRule {
  state?: string;
  above?: number;
  below?: number;
  value: BindingValue;
}

export interface ImageBinding {
  target: string;
  entity: string;
  attribute?: string;
  set: BindingSet;
  rules: BindingRule[];
  default?: BindingValue;
}

export interface ImageSummary extends ItemMeta {
  id: string;
  name: string;
  keywords?: string[];
  view_box: string;
  /** svg + bindings, UTF-8. */
  bytes: number;
  /** Number of bindings. */
  bindings: number;
  thumb?: string;
  updated_at: string;
}

export interface ImageEventSummary {
  id: string;
  name: string;
  view_box: string;
  bytes: number;
  updated_at: string;
}

export interface SavedImageInput extends ItemMeta {
  id: string;
  name: string;
  keywords?: string[];
  view_box: string;
  /** sanitizeImage output (svg-image.ts). */
  svg: string;
  bindings?: ImageBinding[];
  /** Small raster preview made by the editor; not counted in IMAGE_MAX_BYTES. */
  thumb?: string;
}

export interface SavedImage extends SavedImageInput {
  created_at: string;
  updated_at: string;
}
