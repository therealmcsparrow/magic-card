// Checks a gallery index.json: size, envelope, Ed25519 signature under either fixed key, then the payload (look-index v2.0.0).
import {
  LOOK_AUTHOR_RE,
  LOOK_ID_RE,
  LOOK_INDEX_FORMAT,
  LOOK_INDEX_MAX_BYTES,
  LOOK_INDEX_MAX_LOOKS,
  LOOK_INDEX_MAX_SEQ,
  LOOK_INDEX_PUBLIC_KEYS,
  LOOK_INDEX_SIGN_PREFIX,
  LOOK_LICENCES,
  LOOK_NAME_MAX_CHARS,
  SHA512_HEX_RE,
} from '../contracts/look-index';
import type { LookIndexPayload, VerifyIndex } from '../contracts/look-index';
import { verifyEd25519 } from './crypto';
import { LOOK_INDEX_MIN_SEQ } from './min-seq';

const BASE64_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const PAYLOAD_KEYS = ['format', 'seq', 'issued', 'expires', 'looks'];
const ENTRY_KEYS = [
  'id',
  'name',
  'author',
  'licence',
  'grammar',
  'sha512',
  'bytes',
  'preview',
  'animated',
  'fonts',
];

type Json = Record<string, unknown>;

const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);

const isObject = (v: unknown): v is Json =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

// True when the object has exactly these own members, no more and no fewer.
const exactKeys = (o: Json, keys: string[]): boolean =>
  Object.keys(o).length === keys.length && keys.every((k) => has(o, k));

// Decodes canonical standard base64 to bytes, or null; the text must re-encode to itself.
const decodeBase64 = (text: unknown): Uint8Array | null => {
  if (typeof text !== 'string' || !BASE64_RE.test(text)) return null;
  const bin = atob(text);
  if (btoa(bin) !== text) return null;
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const isIso = (v: unknown): boolean =>
  typeof v === 'string' && ISO_RE.test(v) && !isNaN(Date.parse(v));

// C0 and C1 controls, line and paragraph separators, and the bidirectional formatting characters.
const isForbiddenChar = (c: number): boolean =>
  c <= 0x1f ||
  (c >= 0x7f && c <= 0x9f) ||
  c === 0x61c ||
  c === 0x200e ||
  c === 0x200f ||
  c === 0x2028 ||
  c === 0x2029 ||
  (c >= 0x202a && c <= 0x202e) ||
  (c >= 0x2066 && c <= 0x2069);

const isName = (v: unknown): boolean => {
  if (typeof v !== 'string' || v.normalize('NFC') !== v) return false;
  const chars = Array.from(v);
  return (
    chars.length >= 1 &&
    chars.length <= LOOK_NAME_MAX_CHARS &&
    !chars.some((ch) => isForbiddenChar(ch.codePointAt(0) as number))
  );
};

const isEntry = (e: unknown): boolean => {
  if (!isObject(e) || !exactKeys(e, ENTRY_KEYS)) return false;
  return (
    typeof e.id === 'string' &&
    LOOK_ID_RE.test(e.id) &&
    isName(e.name) &&
    typeof e.author === 'string' &&
    LOOK_AUTHOR_RE.test(e.author) &&
    (LOOK_LICENCES as readonly unknown[]).includes(e.licence) &&
    Number.isSafeInteger(e.grammar) &&
    (e.grammar as number) >= 1 &&
    typeof e.sha512 === 'string' &&
    SHA512_HEX_RE.test(e.sha512) &&
    Number.isSafeInteger(e.bytes) &&
    (e.bytes as number) >= 1 &&
    typeof e.preview === 'string' &&
    SHA512_HEX_RE.test(e.preview) &&
    typeof e.animated === 'boolean' &&
    Array.isArray(e.fonts) &&
    e.fonts.every((f) => typeof f === 'string')
  );
};

// True when the payload has the exact members, a seq in range, ISO dates and unique, well-formed looks.
const isPayload = (p: Json): boolean => {
  if (!exactKeys(p, PAYLOAD_KEYS)) return false;
  if (
    !Number.isSafeInteger(p.seq) ||
    (p.seq as number) < 1 ||
    (p.seq as number) > LOOK_INDEX_MAX_SEQ
  )
    return false;
  if (!isIso(p.issued) || !isIso(p.expires)) return false;
  if (!Array.isArray(p.looks) || p.looks.length > LOOK_INDEX_MAX_LOOKS || !p.looks.every(isEntry))
    return false;
  const entries = p.looks as { id: string; sha512: string }[];
  return (
    new Set(entries.map((e) => e.id)).size === entries.length &&
    new Set(entries.map((e) => e.sha512)).size === entries.length
  );
};

const utf8 = (s: string): Uint8Array => new TextEncoder().encode(s);

/** Verifies the signature before it decodes or parses the payload; fails closed with one fixed code and never throws. */
export const verifyIndex: VerifyIndex = (envelopeText, keys = LOOK_INDEX_PUBLIC_KEYS) => {
  if (
    envelopeText.length > LOOK_INDEX_MAX_BYTES ||
    utf8(envelopeText).length > LOOK_INDEX_MAX_BYTES
  )
    return { ok: false, code: 'index_too_large' };
  const bad = { ok: false, code: 'index_signature' } as const;

  let envelope: unknown;
  try {
    envelope = JSON.parse(envelopeText);
  } catch {
    return bad;
  }
  if (!isObject(envelope) || !exactKeys(envelope, ['payload', 'sig'])) return bad;
  const payloadBytes = decodeBase64(envelope.payload);
  const sig = decodeBase64(envelope.sig);
  if (!payloadBytes || !sig) return bad;

  const prefix = utf8(LOOK_INDEX_SIGN_PREFIX);
  const message = new Uint8Array(prefix.length + payloadBytes.length);
  message.set(prefix);
  message.set(payloadBytes, prefix.length);
  const signed = keys.some((key) => {
    const pk = decodeBase64(key);
    return pk !== null && verifyEd25519(sig, message, pk);
  });
  if (!signed) return bad;

  let payload: unknown;
  try {
    payload = JSON.parse(
      new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(payloadBytes),
    );
  } catch {
    return { ok: false, code: 'index_parse' };
  }
  if (!isObject(payload)) return { ok: false, code: 'index_parse' };
  if (payload.format !== LOOK_INDEX_FORMAT) return { ok: false, code: 'index_version' };
  if (!isPayload(payload)) return { ok: false, code: 'index_parse' };
  if ((payload.seq as number) < LOOK_INDEX_MIN_SEQ) return { ok: false, code: 'index_rollback' };
  return { ok: true, payload: payload as unknown as LookIndexPayload, payloadBytes };
};
