import * as jsYaml from 'js-yaml';
import {
  MAX_IMPORT_BYTES,
  MAX_IMPORT_CHARS,
  MAX_IMPORT_DEPTH,
  MAX_IMPORT_EXPANDED_CHARS,
  MAX_IMPORT_NODES,
  MAX_YAML_ALIASES,
} from '../contracts/preset-transfer';
import type { TransferRefusal } from '../contracts/preset-transfer';

/*
 * Safe parsing of untrusted preset text (preset-transfer 1.0.0, "Safe parsing"). Pure, no DOM.
 * Never src/utils/yaml-utils fromYaml: it adds the merge tag.
 */

/** CORE_SCHEMA only: no merge key, timestamps, binary or custom tags. */
export const SAFE_YAML_SCHEMA = jsYaml.CORE_SCHEMA;

export type SafeParse = { ok: true; value: unknown } | { ok: false; refusal: TransferRefusal; message: string };

const TOO_LARGE = 'This file is larger than 1 MB, so it was not read.';
const LIMITS = 'This file is too complex to read safely (too many nested or repeated values).';
const NOT_PARSEABLE = 'Not valid YAML or JSON.';
const DROPPED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Step 1 for a chosen file: refuse before reading it. */
export function checkFileSize(file: { size: number }): SafeParse | undefined {
  return file.size > MAX_IMPORT_BYTES ? { ok: false, refusal: 'too_large', message: TOO_LARGE } : undefined;
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
function boundedCopy(root: unknown): unknown {
  let nodes = 0;
  let chars = 0;
  let revisits = 0;
  const seen = new Set<object>();
  const visit = (v: unknown, depth: number): unknown => {
    if (++nodes > MAX_IMPORT_NODES) throw new Limit('limits', LIMITS);
    if (depth > MAX_IMPORT_DEPTH) throw new Limit('limits', LIMITS);
    if (v === null || typeof v === 'boolean') return v;
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) throw new Limit('not_parseable', 'Numbers must be finite (no .inf or .nan).');
      return v;
    }
    if (typeof v === 'string') {
      chars += v.length;
      if (chars > MAX_IMPORT_EXPANDED_CHARS) throw new Limit('limits', LIMITS);
      return v;
    }
    if (typeof v !== 'object') throw new Limit('not_parseable', NOT_PARSEABLE);
    if (seen.has(v)) {
      if (++revisits > MAX_YAML_ALIASES) throw new Limit('limits', LIMITS);
    } else seen.add(v);
    if (Array.isArray(v)) return v.map((x) => visit(x, depth + 1));
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) {
      if (k === '<<') throw new Limit('not_parseable', 'Merge keys (<<) are not allowed in preset files.');
      chars += k.length;
      if (chars > MAX_IMPORT_EXPANDED_CHARS) throw new Limit('limits', LIMITS);
      if (DROPPED_KEYS.has(k)) continue;
      out[k] = visit((v as Record<string, unknown>)[k], depth + 1);
    }
    return out;
  };
  return visit(root, 1);
}

/** Steps 1-4 on pasted or read text. */
export function safeParse(text: string): SafeParse {
  if (typeof text !== 'string') return { ok: false, refusal: 'not_parseable', message: NOT_PARSEABLE };
  if (text.length > MAX_IMPORT_CHARS) return { ok: false, refusal: 'too_large', message: TOO_LARGE };
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, refusal: 'not_parseable', message: 'Paste or choose a file first.' };

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
  if (!have) {
    try {
      parsed = jsYaml.load(text, { schema: SAFE_YAML_SCHEMA });
    } catch {
      return { ok: false, refusal: 'not_parseable', message: NOT_PARSEABLE };
    }
  }
  try {
    return { ok: true, value: boundedCopy(parsed) };
  } catch (e) {
    if (e instanceof Limit) return { ok: false, refusal: e.reason, message: e.message };
    return { ok: false, refusal: 'limits', message: LIMITS };
  }
}
