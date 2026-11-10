import type { ImageAnimation } from '../contracts/image-animation';
import {
  IMAGE_CAPS_ANIMATION,
  IMAGE_CMD,
  imageMaxBytes,
  type ImageBinding,
  type ImageListResult,
  type SavedImage,
} from '../contracts/mcu-library-images';
import type { SanitizedImage } from '../contracts/svg-image';
import { loadImageTools } from './image-loader';
import { t } from './i18n';

// Opens what the animator works on: a library image by id, or an uploaded .svg that is sanitised and becomes a new image on save.

/** UTF-8 length of a text. */
const byteLength = (text: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length);

export interface LibraryHass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type FailReason = 'missing' | 'too_large' | 'not_svg' | 'unsafe_markup' | 'needs_utils' | 'invalid_animation' | 'conflict' | 'failed';
export interface Failed {
  ok: false;
  reason: FailReason;
}

export type Source = { kind: 'image'; id: string } | { kind: 'upload'; file: File };

export interface Opened {
  ok: true;
  id: string;
  name: string;
  /** Sanitised markup. */
  svg: string;
  viewBox: string;
  bindings: ImageBinding[];
  animation?: ImageAnimation;
  updatedAt?: string;
  canSave: boolean;
  maxBytes: number;
  /** An upload that is not in the library yet; the first save adds it. */
  isNew?: boolean;
}

export interface Caps {
  maxBytes: number;
  /** False for a Utils whose images_list has no valid `caps`: it cannot store an animation. */
  canSave: boolean;
  ids: ReadonlySet<string>;
}

/** What the library says it can take, and the ids it holds; undefined when it cannot be reached. */
export async function readCaps(hass: LibraryHass): Promise<Caps | undefined> {
  try {
    const r = await hass.callWS<ImageListResult>({ type: IMAGE_CMD.list });
    const maxBytes = imageMaxBytes(r);
    const caps = r?.caps;
    const canSave = !!caps && caps.image_max_bytes === maxBytes && caps.animation === IMAGE_CAPS_ANIMATION;
    return { maxBytes, canSave, ids: new Set((r?.images ?? []).map((i) => i.id)) };
  } catch {
    return undefined;
  }
}

/** The reason a sanitiser error is shown as. */
export function reasonOf(error: NonNullable<SanitizedImage['error']>): FailReason {
  return error === 'too_large' ? 'too_large' : error === 'unsafe_markup' || error === 'too_complex' ? 'unsafe_markup' : 'not_svg';
}

/** Bytes a record counts against the cap: the svg plus the compact JSON of its bindings and animation (each left out when empty). */
export function recordBytes(svg: string, bindings: readonly ImageBinding[] | undefined, animation: ImageAnimation | undefined): number {
  return byteLength(svg) + (bindings?.length ? byteLength(JSON.stringify(bindings)) : 0) + (animation ? byteLength(JSON.stringify(animation)) : 0);
}

/** A library id from a name, not yet taken. */
export function freeId(name: string, taken: ReadonlySet<string>): string {
  const base = name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 56).replace(/-+$/, '') || 'image';
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}

async function openImage(hass: LibraryHass, id: string): Promise<Opened | Failed> {
  const caps = await readCaps(hass);
  if (!caps) return { ok: false, reason: 'failed' };
  let record: SavedImage | undefined;
  try {
    record = (await hass.callWS<{ images: SavedImage[] }>({ type: IMAGE_CMD.get, ids: [id] })).images?.[0];
  } catch {
    return { ok: false, reason: 'failed' };
  }
  if (!record) return { ok: false, reason: 'missing' };
  const tools = await loadImageTools();
  if (!tools) return { ok: false, reason: 'failed' };
  const clean = tools.api.sanitizeImage(record.svg, { animation: record.animation });
  if (clean.error) return { ok: false, reason: reasonOf(clean.error) };
  let animation: ImageAnimation | undefined;
  if (record.animation !== undefined) {
    animation = tools.check(record.animation, new Set(clean.ids));
    if (!animation) return { ok: false, reason: 'invalid_animation' };
  }
  return {
    ok: true,
    id: record.id,
    name: record.name,
    svg: clean.markup,
    viewBox: clean.viewBox || record.view_box,
    bindings: record.bindings ?? [],
    ...(animation ? { animation } : {}),
    updatedAt: record.updated_at,
    canSave: caps.canSave,
    maxBytes: caps.maxBytes,
  };
}

async function openUpload(hass: LibraryHass, file: File): Promise<Opened | Failed> {
  const caps = await readCaps(hass);
  if (!caps) return { ok: false, reason: 'failed' };
  if (!caps.canSave) return { ok: false, reason: 'needs_utils' };
  if (file.size > caps.maxBytes) return { ok: false, reason: 'too_large' };
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, reason: 'failed' };
  }
  const tools = await loadImageTools();
  if (!tools) return { ok: false, reason: 'failed' };
  const clean = tools.api.sanitizeImage(text, { file: true });
  if (clean.error) return { ok: false, reason: reasonOf(clean.error) };
  if (recordBytes(clean.markup, undefined, undefined) > caps.maxBytes) return { ok: false, reason: 'too_large' };
  const name = file.name.replace(/\.svg$/i, '').replace(/[-_]+/g, ' ').trim().slice(0, 64) || t('image-animator.source.image');
  return { ok: true, id: freeId(name, caps.ids), name, svg: clean.markup, viewBox: clean.viewBox, bindings: [], canSave: true, maxBytes: caps.maxBytes, isNew: true };
}

/** Opens a library image, or a sanitised upload as a new image that is written to the library on its first save. */
export function openSource(hass: LibraryHass, source: Source): Promise<Opened | Failed> {
  return source.kind === 'image' ? openImage(hass, source.id) : openUpload(hass, source.file);
}
