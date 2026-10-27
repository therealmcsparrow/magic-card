import * as jsYaml from 'js-yaml';
import { MAX_IMAGE_IMPORT_BYTES } from '../contracts/image-editor';
import {
  MAX_IMAGE_IMPORT_NODES,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_CHARS,
  MAX_IMPORT_DEPTH,
  MAX_IMPORT_EXPANDED_CHARS,
  MAX_IMPORT_NODES,
  MAX_YAML_ALIASES,
} from '../contracts/preset-transfer';
import type { TransferRefusal } from '../contracts/preset-transfer';
import { t } from './i18n';

/*
 * Safe parsing of untrusted preset text (preset-transfer 1.0.0, "Safe parsing"). Pure, no DOM.
 * Never src/utils/yaml-utils fromYaml: it adds the merge tag.
 */

/** CORE_SCHEMA only: no merge key, timestamps, binary or custom tags. */
export const SAFE_YAML_SCHEMA = jsYaml.CORE_SCHEMA;

export type SafeParse = { ok: true; value: unknown } | { ok: false; refusal: TransferRefusal; message: string };

const TOO_LARGE = (): string => t('This file is larger than 1 MB, so it was not read.');
const TOO_LARGE_IMAGES = (): string => t('This file is larger than 8 MB, so it was not read.');
const JSON_ONLY = (): string => t('Image files are JSON, not YAML. Export them as JSON.');
const LIMITS = (): string => t('This file is too complex to read safely (too many nested or repeated values).');
const NOT_PARSEABLE = (): string => t('Not valid YAML or JSON.');
const DROPPED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Step 1 for a chosen file: refuse before reading it. Only a .json file may be larger than 1 MB (image envelopes), and
 * an .svg file where the panel accepts images only; the kind is checked once the file is read.
 */
export function checkFileSize(file: { size: number; name?: string }, accept?: readonly string[]): SafeParse | undefined {
  const name = file.name ?? '';
  const json = /\.json$/i.test(name) || (/\.svg$/i.test(name) && accept?.length === 1 && accept[0] === 'image');
  if (json && file.size > MAX_IMAGE_IMPORT_BYTES) return { ok: false, refusal: 'too_large', message: TOO_LARGE_IMAGES() };
  return file.size > MAX_IMPORT_BYTES && !json ? { ok: false, refusal: 'too_large', message: TOO_LARGE() } : undefined;
}

class Limit extends Error {
  constructor(
    readonly reason: 'limits' | 'not_parseable',
    msg: string,
  ) {
    super(msg);
  }
}

/**
 * Step 4: copy the parsed value into fresh JSON-only data. A shared object (a YAML alias) is walked,
 * and counted, at every place it is used; the walk throws at the first limit hit.
 */
function boundedCopy(root: unknown, maxNodes = MAX_IMPORT_NODES, maxChars = MAX_IMPORT_EXPANDED_CHARS): unknown {
  let nodes = 0;
  let chars = 0;
  let revisits = 0;
  const seen = new Set<object>();
  const visit = (v: unknown, depth: number): unknown => {
    if (++nodes > maxNodes) throw new Limit('limits', LIMITS());
    if (depth > MAX_IMPORT_DEPTH) throw new Limit('limits', LIMITS());
    if (v === null || typeof v === 'boolean') return v;
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) throw new Limit('not_parseable', t('Numbers must be finite (no .inf or .nan).'));
      return v;
    }
    if (typeof v === 'string') {
      chars += v.length;
      if (chars > maxChars) throw new Limit('limits', LIMITS());
      return v;
    }
    if (typeof v !== 'object') throw new Limit('not_parseable', NOT_PARSEABLE());
    if (seen.has(v)) {
      if (++revisits > MAX_YAML_ALIASES) throw new Limit('limits', LIMITS());
    } else seen.add(v);
    if (Array.isArray(v)) return v.map((x) => visit(x, depth + 1));
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) {
      if (k === '<<') throw new Limit('not_parseable', t('Merge keys (<<) are not allowed in preset files.'));
      chars += k.length;
      if (chars > maxChars) throw new Limit('limits', LIMITS());
      if (DROPPED_KEYS.has(k)) continue;
      out[k] = visit((v as Record<string, unknown>)[k], depth + 1);
    }
    return out;
  };
  return visit(root, 1);
}

/** Steps 1-4 on pasted or read text. */
export function safeParse(text: string): SafeParse {
  if (typeof text !== 'string') return { ok: false, refusal: 'not_parseable', message: NOT_PARSEABLE() };
  if (text.length > MAX_IMAGE_IMPORT_BYTES) return { ok: false, refusal: 'too_large', message: TOO_LARGE_IMAGES() };
  const trimmed = text.trim();
  // over 1 MB only an image envelope written as JSON is read; the YAML parser never sees such a text
  const big = text.length > MAX_IMPORT_CHARS;
  if (big && trimmed[0] !== '{') return { ok: false, refusal: 'too_large', message: TOO_LARGE() };
  if (!trimmed) return { ok: false, refusal: 'not_parseable', message: t('Paste or choose a file first.') };

  let parsed: unknown;
  let have = false;
  if (trimmed[0] === '{' || trimmed[0] === '[') {
    try {
      parsed = JSON.parse(trimmed);
      have = true;
    } catch {
      /* flow-style YAML below */
    }
  }
  if (!have && big) return { ok: false, refusal: 'too_large', message: TOO_LARGE() };
  if (!have) {
    try {
      parsed = jsYaml.load(text, { schema: SAFE_YAML_SCHEMA });
    } catch {
      return { ok: false, refusal: 'not_parseable', message: NOT_PARSEABLE() };
    }
  }
  try {
    const value = big ? boundedCopy(parsed, MAX_IMAGE_IMPORT_NODES, MAX_IMAGE_IMPORT_BYTES) : boundedCopy(parsed);
    const kind = (value as { magic_card_export?: unknown; kind?: unknown } | null)?.magic_card_export !== undefined ? (value as { kind?: unknown }).kind : undefined;
    if (big && kind !== 'image') return { ok: false, refusal: 'too_large', message: TOO_LARGE() };
    if (!have && kind === 'image') return { ok: false, refusal: 'not_parseable', message: JSON_ONLY() };
    return { ok: true, value };
  } catch (e) {
    if (e instanceof Limit) return { ok: false, refusal: e.reason, message: e.message };
    return { ok: false, refusal: 'limits', message: LIMITS() };
  }
}
