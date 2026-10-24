import { THUMB_SIDE_PX } from '../contracts/image-editor';
import { IMAGE_MAX_BYTES, THUMB_MAX_BYTES, type ImageBinding, type SavedImageInput } from '../contracts/mcu-library-images';
import type { SvgImageApi } from '../contracts/svg-image';
import { savedBytes } from './meter';

export interface SaveMeta {
  id: string;
  name: string;
  keywords?: string[];
  author?: string;
  description?: string;
}

export type Built = { ok: true; input: SavedImageInput; bytes: number } | { ok: false; reason: 'too_large' | 'invalid' | 'empty'; bytes: number };

/**
 * The save payload: the markup goes through the image sanitiser last, the view box comes from its result, the size
 * counts the markup and the compact JSON of the connections (the `bindings` key is left out when there are none),
 * and the thumbnail is the browser's drawing of the sanitised markup (left out when it cannot be made).
 */
export async function buildSave(api: SvgImageApi, raw: string, bindings: readonly ImageBinding[], meta: SaveMeta): Promise<Built> {
  const s = api.sanitizeImage(raw);
  if (s.error) return { ok: false, reason: s.error === 'too_large' ? 'too_large' : s.error === 'empty' ? 'empty' : 'invalid', bytes: s.bytes };
  const bytes = savedBytes(s.markup, bindings);
  if (bytes > IMAGE_MAX_BYTES) return { ok: false, reason: 'too_large', bytes };
  const thumb = await api.thumbnail(s.markup, THUMB_SIDE_PX, THUMB_MAX_BYTES);
  const input: SavedImageInput = {
    id: meta.id,
    name: meta.name,
    ...(meta.keywords?.length ? { keywords: meta.keywords } : {}),
    ...(meta.author ? { author: meta.author } : {}),
    ...(meta.description ? { description: meta.description } : {}),
    view_box: s.viewBox,
    svg: s.markup,
    ...(bindings.length ? { bindings: [...bindings] } : {}),
    ...(thumb ? { thumb } : {}),
  };
  return { ok: true, input, bytes };
}
