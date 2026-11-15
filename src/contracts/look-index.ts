// Contract: look index. Version 2.0.0 (LOOK_INDEX_CONTRACT), index format 1 (LOOK_INDEX_FORMAT). The signed list of gallery looks
// that the gallery repository publishes on its Pages site and the card reads: the envelope, the signed payload, the look entries,
// the two public keys, how a fetched or cached index is accepted, and the fixed codes the card shows. `verifyIndex` and
// `acceptIndex` live in src/look-kit/ next to `parseLook` and ship in the same dist/look-kit.mjs the gallery CI and smoke test run.

import type { LookParseCode } from './look-grammar';

export const LOOK_INDEX_CONTRACT = '2.0.0';
export const LOOK_INDEX_FORMAT = 1;

/** Where the gallery lives. The card builds every gallery address from these constants, never from index content. */
export const GALLERY_REPO = 'therealmcsparrow/magic-card-gallery';
export const GALLERY_ORIGIN = 'https://therealmcsparrow.github.io';
export const GALLERY_BASE = `${GALLERY_ORIGIN}/magic-card-gallery/`;
export const GALLERY_INDEX_URL = `${GALLERY_BASE}index.json`;
/** A look's bytes: content-addressed by SHA-512 (lower-case hex), so a cached body never goes stale. */
export const galleryLookUrl = (sha512: string): string => `${GALLERY_BASE}looks/${sha512}.json`;
/** A preview's bytes, addressed by the SHA-512 of the re-encoded file (LookIndexEntry.preview), never of the submitted one. */
export const galleryPreviewUrl = (sha512: string): string => `${GALLERY_BASE}previews/${sha512}.webp`;
/** Report link for a refused or applicable look; `id` and `code` are URL-encoded by the caller. */
export const GALLERY_REPORT_URL = `https://github.com/${GALLERY_REPO}/issues/new?template=report-look.yml`;

/**
 * Raw 32-byte Ed25519 public keys, base64. Slot 1 signs now; slot 2 is the backup for rotation. An index is valid when its signature
 * verifies under either slot. Exactly two slots; rotating means a card release that moves slot 2 to slot 1 and adds a new slot 2.
 */
export const LOOK_INDEX_PUBLIC_KEYS: readonly [string, string] = [
  '1lFywtMJ82nZJyW91MUFOwB1mqgbmPGsvHmBPvN92OY=',
  '44wOqzj3IKQgjn9P8p5S7Mi57GpRhgR0FJjUHT2rlf4=',
];

/** Signed message = this prefix (UTF-8) followed by the payload bytes, so a signature over anything else never verifies here. */
export const LOOK_INDEX_SIGN_PREFIX = 'magic-card-look-index-v1\n';

/**
 * Crypto, the same code on every path (card chunk, dist/look-kit.mjs in gallery CI and smoke test): Ed25519 verify and SHA-512
 * from a trimmed, vendored TweetNaCl.js 1.0.3 (src/look-kit/nacl-verify.ts). No Web Crypto, no `crypto.subtle`, no random bytes,
 * so it runs on a plain-http origin. SHA-512 is the only hash: content addresses, entry hashes and preview hashes are all SHA-512.
 * Before the curve check a signature's S half (bytes 32-63, little-endian) must be below the group order L; otherwise
 * `index_signature`. The signer is node:crypto (standard RFC 8032 signatures).
 */
export const LOOK_HASH = 'sha512';

/** Limits. */
export const LOOK_INDEX_MAX_BYTES = 64 * 1024;
export const LOOK_INDEX_MAX_LOOKS = 50;
export const LOOK_PREVIEW_MAX_BYTES = 96 * 1024;
/** Longest side of a submitted preview, in pixels; the gallery CI refuses a larger one before decoding its pixels. */
export const LOOK_PREVIEW_MAX_SIDE = 1024;

/**
 * Previews. The submitted `preview.webp` is never published or hashed. The gallery CI decodes it and re-encodes it with the WebP
 * encoder pinned to an exact version in the gallery's package.json and package-lock.json (sharp, which bundles libvips and libwebp),
 * and only that output is written to `previews/<sha512>.webp` and named in the index:
 * - input: RIFF/WEBP magic bytes, at most LOOK_PREVIEW_MAX_BYTES, width and height 1-LOOK_PREVIEW_MAX_SIDE read from the header and
 *   enforced again as the decoder's pixel limit, one frame only (an animated WebP is refused), decoder warnings are failures;
 * - output: a still WebP with no EXIF, XMP or ICC chunk, the input's width and height, at most LOOK_PREVIEW_MAX_BYTES, else the look fails;
 * - the decoder runs in the PR check and in a deploy job that holds no secret; the job that signs never decodes an image.
 * The card shows a preview only when its bytes are at most LOOK_PREVIEW_MAX_BYTES, their SHA-512 equals the entry's `preview`, they
 * start with `RIFF` … `WEBP` and the first chunk is `VP8 `, `VP8L` or a `VP8X` whose animation flag is clear; otherwise the tile
 * shows no image, as while loading, and the look stays applicable (a preview is never part of the look).
 */
/** Days from `issued` to `expires` the gallery CI writes; the card only reads `expires`. */
export const LOOK_INDEX_EXPIRY_DAYS = 180;

/**
 * index.json, the file the card fetches: `payload` is the base64 of the exact UTF-8 JSON bytes that were signed; `sig` the base64 of
 * the 64-byte Ed25519 signature over LOOK_INDEX_SIGN_PREFIX + payload bytes. No other members. The card verifies before it parses
 * the payload, so no canonical JSON form is needed.
 */
export interface LookIndexEnvelope {
  payload: string;
  sig: string;
}

/** Open licences a look may carry (SPDX ids). */
export const LOOK_LICENCES = ['CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'MIT'] as const;
export type LookLicence = (typeof LOOK_LICENCES)[number];

export const LOOK_ID_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
/** GitHub login shape. */
export const LOOK_AUTHOR_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
/** Counted in Unicode code points (`Array.from(name).length`), after the gallery CI's NFC normalisation. */
export const LOOK_NAME_MAX_CHARS = 40;
export const SHA512_HEX_RE = /^[0-9a-f]{128}$/;

/** One look in the payload. Metadata only; the look itself is fetched from galleryLookUrl(sha512). Every member is required. */
export interface LookIndexEntry {
  id: string;
  /** Display name: 1-LOOK_NAME_MAX_CHARS code points, NFC, no control or bidi characters; rendered as text, wrapped, never clamped. */
  name: string;
  author: string;
  licence: LookLicence;
  /** The look's `grammar` number, so the card can refuse a newer grammar before fetching. */
  grammar: number;
  /** SHA-512 of the look file's exact bytes, lower-case hex. */
  sha512: string;
  bytes: number;
  /** SHA-512 of the re-encoded WebP preview's exact bytes (see Previews above). */
  preview: string;
  /**
   * lookTraits(parsed look).animated, written by the gallery CI. The tile shows "Animated" from it before the look is fetched; the
   * card recomputes it from the parsed look and refuses the tile with `look_meta` when they differ.
   */
  animated: boolean;
  /** lookTraits(parsed look).fonts (sorted, unique, generics excluded); checked the same way as `animated`. */
  fonts: string[];
}

/** The signed payload. Members other than these refuse the index with `index_parse`. */
export interface LookIndexPayload {
  format: 1;
  /**
   * `Number.isSafeInteger(seq)` and 1 <= seq <= LOOK_INDEX_MAX_SEQ, else `index_parse`. Every deploy is exactly one higher than the
   * live index it replaces and never re-signs a seq already deployed (see Deploy sequence below).
   */
  seq: number;
  /** ISO 8601 UTC, seconds precision. */
  issued: string;
  expires: string;
  looks: LookIndexEntry[];
}

/** Highest seq an index may carry (2^31 - 1), so one bad deploy cannot push the sequence out of reach of every later one. */
export const LOOK_INDEX_MAX_SEQ = 2_147_483_647;

/**
 * Seq floor: `LOOK_INDEX_MIN_SEQ`, exported by src/look-kit/min-seq.ts (data, not part of this file, so a release does not change the
 * Contract), is the lowest seq this card build accepts, fetched or cached. Each card release sets it to the seq of the gallery's
 * newest `index-<seq>` release at the time the release is built (1 while the gallery has none), so a device with no cache cannot be
 * served an old signed index that a later deploy replaced. The release workflow fails when it is above that newest seq (it would
 * lock every card out) and warns when it is below. A positive safe integer, never above LOOK_INDEX_MAX_SEQ.
 */
export type LookIndexMinSeq = number;

/**
 * Deploy sequence, kept by the gallery deploy: L = seq of the live index.json after verifyIndex (0 when none), N = highest
 * `index-<seq>` release (0 when none). The deploy refuses unless L is N or N + 1 (N + 1: an earlier run went live but did not finish
 * its release, which this run then creates from the live envelope), so a stray or mistyped tag cannot move the sequence. The new
 * seq is L + 1. A re-run never signs a seq that is already live with a new `issued`; it always takes the next seq.
 */

/** Index-level codes (the whole index is refused). `cache_discarded` is never shown; the card logs it and acts as if no cache existed. */
export type LookIndexCode =
  | 'index_fetch' // network error, HTTP status other than 200, or no response in LOOK_INDEX_TIMEOUT_MS
  | 'index_too_large'
  | 'index_signature' // envelope shape wrong, base64 wrong, S not below L, or the signature verifies under neither key
  | 'index_version' // `format` is not LOOK_INDEX_FORMAT
  | 'index_parse' // payload not JSON, a member missing or extra, a limit broken, duplicate id or sha512
  | 'index_rollback' // seq below LOOK_INDEX_MIN_SEQ, below the cached seq, or equal seq with different bytes
  | 'cache_discarded';

/** Look-level codes (one tile is refused, the rest stay). The parser code is appended: `look_parse:unsafe_value`. */
export type LookTileCode =
  | 'look_fetch'
  | 'look_hash' // bytes do not match the entry's sha512 or `bytes`
  | 'look_grammar' // entry `grammar` above LOOK_GRAMMAR
  | `look_parse:${LookParseCode}`
  | 'look_meta'; // the entry's `animated` or `fonts` differ from lookTraits of the parsed look

export const LOOK_INDEX_TIMEOUT_MS = 10_000;

export type VerifiedIndex = { ok: true; payload: LookIndexPayload; payloadBytes: Uint8Array } | { ok: false; code: Exclude<LookIndexCode, 'index_fetch' | 'cache_discarded'> };

/**
 * verifyIndex(envelopeText, keys?): size check, envelope shape, signature under either key, then payload parse and limits, then
 * `seq` below LOOK_INDEX_MIN_SEQ is `index_rollback`. Pure and synchronous. A cached envelope goes through the same call, so a cache
 * below the floor is discarded. `keys` defaults to LOOK_INDEX_PUBLIC_KEYS; only tests pass their own pair: no code under
 * src/look-gallery/ and nothing in the gallery's scripts/smoke.mjs passes a second argument, and a test in each repo greps for it.
 */
export type VerifyIndex = (envelopeText: string, keys?: readonly [string, string]) => VerifiedIndex;

/**
 * acceptIndex(cached, fetched): both already verified (cached may be null). Accept when there is no cache, when fetched.seq is
 * higher, or when seq and payload bytes are equal (no change). Otherwise `index_rollback`, and the cache stays. Pure.
 */
export type AcceptIndex = (
  cached: { seq: number; payloadBytes: Uint8Array } | null,
  fetched: { seq: number; payloadBytes: Uint8Array },
) => { ok: true; changed: boolean } | { ok: false; code: 'index_rollback' };

/** Lower-case hex SHA-512 of the bytes. Pure and synchronous; same function in card, CI and smoke test. */
export type Sha512Hex = (bytes: Uint8Array) => string;

/** Ages the card shows a note for. `expired` does not refuse anything: looks stay applicable. */
export type LookIndexAge = 'fresh' | 'expired';

/**
 * Cache: one localStorage key holding `{ cache: 1, envelope, looks: { <sha512>: <look text> } }`. Every read verifies the envelope,
 * re-hashes and re-parses every look; any failure removes the key (`cache_discarded`). `looks` is keyed by sha512. A look body is
 * stored only after its hash, parse and traits check passed. When storing the looks hits the quota, only the envelope is stored. The key is written only after a fetched index
 * was accepted; a refused fetch never touches it.
 */
export const LOOK_CACHE_KEY = 'magic-card.look-gallery.v1';
