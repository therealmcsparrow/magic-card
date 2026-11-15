// The gallery cache: one localStorage key, re-verified on every read. Any failure removes the key.

import { LOOK_CACHE_KEY, SHA512_HEX_RE, type LookIndexPayload } from '../contracts/look-index';
import { LOOK_MAX_BYTES } from '../contracts/look-grammar';
import { sha512Hex } from '../look-kit/crypto';
import { parseLook } from '../look-kit/parse-look';
import { lookTraits } from '../look-kit/traits';
import { verifyIndex } from '../look-kit/verify-index';

export interface GalleryCache {
  payload: LookIndexPayload;
  payloadBytes: Uint8Array;
  envelope: string;
  looks: Record<string, string>;
}

const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);

const drop = (): null => {
  try {
    localStorage.removeItem(LOOK_CACHE_KEY);
  } catch {
    /* storage unavailable */
  }
  return null;
};

const sameFonts = (a: string[], b: string[]): boolean => a.length === b.length && a.every((f, i) => f === b[i]);

/** Reads and fully verifies the cache; null (and the key removed) when anything is wrong. */
export const readCache = (): GalleryCache | null => {
  let raw: string | null;
  try {
    raw = localStorage.getItem(LOOK_CACHE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return drop();
    const box = parsed as Record<string, unknown>;
    if (!has(box, 'cache') || box.cache !== 1 || !has(box, 'envelope') || typeof box.envelope !== 'string') return drop();
    const rawLooks = has(box, 'looks') ? box.looks : {};
    if (typeof rawLooks !== 'object' || rawLooks === null || Array.isArray(rawLooks)) return drop();

    const verified = verifyIndex(box.envelope);
    if (!verified.ok) return drop();
    const looks: Record<string, string> = {};
    for (const key of Object.keys(rawLooks)) {
      const text = (rawLooks as Record<string, unknown>)[key];
      const entry = SHA512_HEX_RE.test(key) ? verified.payload.looks.find((e) => e.sha512 === key) : undefined;
      if (!entry || typeof text !== 'string') return drop();
      const bytes = new TextEncoder().encode(text);
      if (bytes.length > LOOK_MAX_BYTES || sha512Hex(bytes) !== key) return drop();
      const look = parseLook(text);
      if (!look.ok) return drop();
      const traits = lookTraits(look.look);
      if (traits.animated !== entry.animated || !sameFonts(traits.fonts, entry.fonts)) return drop();
      looks[key] = text;
    }
    return { payload: verified.payload, payloadBytes: verified.payloadBytes, envelope: box.envelope, looks };
  } catch {
    return drop();
  }
};

/** Stores an accepted index and its checked looks; on a quota failure only the envelope is kept. */
export const writeCache = (envelope: string, looks: Record<string, string>): void => {
  try {
    localStorage.setItem(LOOK_CACHE_KEY, JSON.stringify({ cache: 1, envelope, looks }));
    return;
  } catch {
    /* quota: fall through to the envelope alone */
  }
  try {
    localStorage.setItem(LOOK_CACHE_KEY, JSON.stringify({ cache: 1, envelope, looks: {} }));
  } catch {
    /* nothing more to try */
  }
};
