import type { ItemMeta } from './mcu-library';

/*
 * Contract: mcu-library 1.1.0, images part. Version 1.1.0.
 * Mirror of magic-card-utils custom_components/magic_card_utils/library_images_contract.py (of record: storage, commands,
 * server validation, provider and panel rules are written there). mcu-library 1.1.0 = mcu-library.ts plus this file;
 * nothing in mcu-library.ts changes meaning. Card-side use: svg-image.ts.
 *
 * Commands (reads: any authenticated user; writes: admin):
 *   magic_card_utils/images_list   {}                                  -> { images: ImageSummary[] }   (with thumb)
 *   magic_card_utils/images_get    { ids } (1..MAX_IMAGE_GET_IDS)      -> { images: SavedImage[] }     (unknown or unreadable ids left out)
 *   magic_card_utils/images_save   { image: SavedImageInput, base_updated_at? } -> { image: ImageSummary }
 *   magic_card_utils/images_delete { image_id }                        -> {}                           (unknown id: success)
 *   subscribe_library events: { action: 'saved', kind: 'images', image: ImageEventSummary } | { action: 'deleted', kind: 'images', id }
 * images_get with more than MAX_IMAGE_GET_IDS ids answers the error IMAGE_ERR_TOO_MANY ('too_many'), with no partial
 * result; an empty ids list is invalid_format. Callers split longer lists into calls of at most MAX_IMAGE_GET_IDS.
 * Ids: chosen by the editor when an image is first saved (the slug of its name, made unique) and never changed;
 * rename saves the same id with a new name. A save of an id that exists without base_updated_at is a conflict.
 * Size: UTF-8 bytes of svg + compact JSON of bindings <= IMAGE_MAX_BYTES (counted on the text, not the file); over it
 * the server answers invalid_format with errors [{ path: 'svg', message: 'too_large', bytes, limit }]. A new id beyond
 * MAX_IMAGES -> library_full. The editor checks both before it sends and names the size ("312 KB of 256 KB") or the
 * count.
 * Root namespace: the root <svg> (the first opening tag) may carry the attribute xmlns with exactly the value
 * IMAGE_ROOT_XMLNS. xmlns with any other value, xmlns on any other element and every xmlns:* name are refused
 * (invalid_format), like any attribute outside the allow-list.
 * Card output passes the server: every markup the card's image sanitiser and serialiser emit (sanitizeImage output,
 * the editor's save payload, a transfer import, a Duplicate) passes the server validation unchanged. A shared
 * conformance test sends real serialiser output through the server's validate_image; a card change that emits a new
 * element, attribute or value form changes this contract and the server in the same release.
 * Bindings: at most one binding per (target, set); a second one is invalid_format.
 * Provider: forwards image events as window `mcu-library-changed` { kind: 'images', ids: [id] }; nothing else.
 * Panel: tab 'images' after 'shapes' (MCU_PANEL_TABS); the Library tab lists images too.
 */

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
