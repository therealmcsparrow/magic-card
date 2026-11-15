// Gallery store: one index fetch, verified and accepted, every look fetched, hash-checked, parsed and traits-checked before a tile
// exists; a preview becomes a blob URL only after checkPreview. Fixed codes only; fetched text is never echoed.

import { LOOK_GRAMMAR, LOOK_MAX_BYTES, type LookDoc } from '../contracts/look-grammar';
import {
  GALLERY_INDEX_URL,
  LOOK_INDEX_MAX_BYTES,
  LOOK_PREVIEW_MAX_BYTES,
  galleryLookUrl,
  galleryPreviewUrl,
  type LookIndexCode,
  type LookIndexEntry,
  type LookIndexPayload,
  type LookTileCode,
} from '../contracts/look-index';
import { acceptIndex } from '../look-kit/accept-index';
import { sha512Hex } from '../look-kit/crypto';
import { parseLook } from '../look-kit/parse-look';
import { lookTraits } from '../look-kit/traits';
import { verifyIndex } from '../look-kit/verify-index';
import { readCache, writeCache, type GalleryCache } from './cache';
import { fetchBytes, fetchText } from './fetch';
import { checkPreview } from './preview-bytes';

export interface GalleryTile {
  id: string;
  name: string;
  author: string;
  licence: string;
  sha512: string;
  animated: boolean;
  fonts: string[];
  state: 'ok' | 'refused';
  code: LookTileCode | null;
  look: LookDoc | null;
  previewUrl: string | null;
}

export interface GalleryState {
  status: 'off' | 'ready' | 'empty';
  source: 'network' | 'cache' | 'none';
  savedCopy: boolean;
  old: boolean;
  error: LookIndexCode | null;
  tiles: GalleryTile[];
}

const sameFonts = (a: string[], b: string[]): boolean => a.length === b.length && a.every((f, i) => f === b[i]);

const tile = (e: LookIndexEntry, over: Partial<GalleryTile>): GalleryTile => ({
  id: e.id,
  name: e.name,
  author: e.author,
  licence: e.licence,
  sha512: e.sha512,
  animated: e.animated,
  fonts: e.fonts.slice(),
  state: 'refused',
  code: null,
  look: null,
  previewUrl: null,
  ...over,
});

const refused = (e: LookIndexEntry, code: LookTileCode): GalleryTile => tile(e, { state: 'refused', code });

/** Parses one look text against its entry; the traits must match what the index claims. */
const readLook = (e: LookIndexEntry, text: string): { ok: true; look: LookDoc } | { ok: false; code: LookTileCode } => {
  const parsed = parseLook(text);
  if (!parsed.ok) return { ok: false, code: `look_parse:${parsed.code}` };
  const traits = lookTraits(parsed.look);
  if (traits.animated !== e.animated || !sameFonts(traits.fonts, e.fonts)) return { ok: false, code: 'look_meta' };
  return { ok: true, look: parsed.look };
};

const loadPreview = async (e: LookIndexEntry): Promise<string | null> => {
  const got = await fetchBytes(galleryPreviewUrl(e.preview), LOOK_PREVIEW_MAX_BYTES);
  if (!got.ok || !checkPreview(got.bytes, e.preview).ok) return null;
  try {
    return URL.createObjectURL(new Blob([got.bytes as BlobPart], { type: 'image/webp' }));
  } catch {
    return null;
  }
};

/** One tile from the network; a checked look body is added to `keep` for the cache. */
const networkTile = async (e: LookIndexEntry, cached: GalleryCache | null, keep: Record<string, string>): Promise<GalleryTile> => {
  if (e.grammar > LOOK_GRAMMAR) return refused(e, 'look_grammar');
  let text: string;
  const known = cached && Object.prototype.hasOwnProperty.call(cached.looks, e.sha512) ? cached.looks[e.sha512] : null;
  if (known !== null) {
    text = known;
  } else {
    const got = await fetchText(galleryLookUrl(e.sha512), LOOK_MAX_BYTES);
    if (!got.ok) return refused(e, got.reason === 'decode' ? 'look_parse:json' : got.reason === 'too_large' ? 'look_hash' : 'look_fetch');
    if (got.bytes.length !== e.bytes || sha512Hex(got.bytes) !== e.sha512) return refused(e, 'look_hash');
    text = got.text;
  }
  const read = readLook(e, text);
  if (!read.ok) return refused(e, read.code);
  keep[e.sha512] = text;
  return tile(e, { state: 'ok', look: read.look, previewUrl: await loadPreview(e) });
};

/** Tiles of a verified cache; a look the cache could not hold (quota) has no body to show. */
const cacheTiles = (cache: GalleryCache): GalleryTile[] =>
  cache.payload.looks.map((e) => {
    if (e.grammar > LOOK_GRAMMAR) return refused(e, 'look_grammar');
    if (!Object.prototype.hasOwnProperty.call(cache.looks, e.sha512)) return refused(e, 'look_fetch');
    const read = readLook(e, cache.looks[e.sha512]);
    return read.ok ? tile(e, { state: 'ok', look: read.look }) : refused(e, read.code);
  });

const isOld = (payload: LookIndexPayload, now: number): boolean => Date.parse(payload.expires) < now;

const fromCache = (cache: GalleryCache | null, error: LookIndexCode, now: number): GalleryState =>
  cache
    ? { status: 'ready', source: 'cache', savedCopy: true, old: isOld(cache.payload, now), error, tiles: cacheTiles(cache) }
    : { status: 'empty', source: 'none', savedCopy: false, old: false, error, tiles: [] };

/** Opens the gallery. Retry is another call. With `allowed` false nothing is requested or stored. */
export const loadGallery = async (opts: { allowed: boolean; now?: () => number }): Promise<GalleryState> => {
  if (!opts.allowed) return { status: 'off', source: 'none', savedCopy: false, old: false, error: null, tiles: [] };
  const now = (opts.now ?? Date.now)();
  const cached = readCache();

  const got = await fetchText(GALLERY_INDEX_URL, LOOK_INDEX_MAX_BYTES);
  if (!got.ok) {
    const code: LookIndexCode = got.reason === 'too_large' ? 'index_too_large' : got.reason === 'decode' ? 'index_signature' : 'index_fetch';
    return fromCache(cached, code, now);
  }
  const verified = verifyIndex(got.text);
  if (!verified.ok) return fromCache(cached, verified.code, now);
  const accepted = acceptIndex(
    cached ? { seq: cached.payload.seq, payloadBytes: cached.payloadBytes } : null,
    { seq: verified.payload.seq, payloadBytes: verified.payloadBytes },
  );
  if (!accepted.ok) return fromCache(cached, accepted.code, now);

  const keep: Record<string, string> = {};
  const tiles = await Promise.all(verified.payload.looks.map((e) => networkTile(e, cached, keep)));
  writeCache(got.text, keep);
  return {
    status: 'ready',
    source: 'network',
    savedCopy: false,
    old: isOld(verified.payload, now),
    error: null,
    tiles,
  };
};

/** Releases the blob URLs a state holds; call when the gallery closes. */
export const revokePreviews = (state: GalleryState): void => {
  for (const t of state.tiles) if (t.previewUrl !== null) URL.revokeObjectURL(t.previewUrl);
};
