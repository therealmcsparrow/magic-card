import { THUMB_SIDE_PX } from '../contracts/image-editor';
import type { ImageAnimation } from '../contracts/image-animation';
import { IMAGE_CMD, THUMB_MAX_BYTES, type ImageBinding, type ImageSummary, type SavedImageInput } from '../contracts/mcu-library-images';
import { loadImageTools } from './image-loader';
import { freeId, reasonOf, recordBytes, readCaps, type Failed, type LibraryHass } from './source';

// Saves the animation of a library image back with its drawing and connections in one call.

export interface SaveInput {
  id: string;
  name: string;
  svg: string;
  viewBox: string;
  bindings?: ImageBinding[];
  /** The clips and morphs; none, or no clips, saves the image without an animation. */
  animation: unknown;
  /** `updated_at` of the record when it was opened; the library refuses the save when it changed since. */
  baseUpdatedAt?: string;
  /** Not in the library yet: saved under a free id when `id` was taken since it was opened. */
  isNew?: boolean;
}

/** `id` is the library id the image was saved under. */
export type Saved = { ok: true; id: string; summary: ImageSummary } | Failed;

const hasClips = (a: unknown): boolean => {
  const clips = (a as { clips?: unknown } | null | undefined)?.clips;
  return Array.isArray(clips) && clips.length > 0;
};

/**
 * Checks the record on the allow-lists and the cap, then sends it. The size counts the markup plus the compact JSON of
 * the bindings and the animation. Nothing is sent when a check fails; a library error is a reason, never a throw.
 */
export async function saveAnimation(hass: LibraryHass, input: SaveInput): Promise<Saved> {
  const caps = await readCaps(hass);
  if (!caps) return { ok: false, reason: 'failed' };
  if (!caps.canSave) return { ok: false, reason: 'needs_utils' };
  const wanted = hasClips(input.animation) ? input.animation : undefined;
  if (recordBytes(input.svg, input.bindings, wanted as ImageAnimation | undefined) > caps.maxBytes) return { ok: false, reason: 'too_large' };
  const tools = await loadImageTools();
  if (!tools) return { ok: false, reason: 'failed' };
  const clean = tools.api.sanitizeImage(input.svg, { animation: wanted });
  if (clean.error) return { ok: false, reason: reasonOf(clean.error) };
  let animation: ImageAnimation | undefined;
  if (wanted) {
    animation = tools.check(wanted, new Set(clean.ids));
    if (!animation) return { ok: false, reason: 'invalid_animation' };
  }
  if (recordBytes(clean.markup, input.bindings, animation) > caps.maxBytes) return { ok: false, reason: 'too_large' };
  const thumb = await tools.api.thumbnail(clean.markup, THUMB_SIDE_PX, THUMB_MAX_BYTES).catch(() => undefined);
  const id = input.isNew && caps.ids.has(input.id) ? freeId(input.id, caps.ids) : input.id;
  const image: SavedImageInput = {
    id,
    name: input.name,
    view_box: clean.viewBox || input.viewBox,
    svg: clean.markup,
    ...(input.bindings?.length ? { bindings: input.bindings } : {}),
    ...(animation ? { animation } : {}),
    ...(thumb ? { thumb } : {}),
  };
  try {
    const r = await hass.callWS<{ image: ImageSummary }>({ type: IMAGE_CMD.save, image, ...(input.baseUpdatedAt && !input.isNew ? { base_updated_at: input.baseUpdatedAt } : {}) });
    tools.api.invalidate([id]);
    return { ok: true, id, summary: r.image };
  } catch (err) {
    return { ok: false, reason: (err as { code?: unknown } | null)?.code === 'conflict' ? 'conflict' : 'failed' };
  }
}
