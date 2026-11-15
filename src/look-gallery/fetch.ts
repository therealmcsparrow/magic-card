// Bounded gallery requests: one fixed request shape, a size cap checked before and while reading, a 10 s timeout.

import { LOOK_INDEX_TIMEOUT_MS } from '../contracts/look-index';

export type FetchBytesResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; reason: 'fetch' | 'too_large' };

export type FetchTextResult =
  | { ok: true; text: string; bytes: Uint8Array }
  | { ok: false; reason: 'fetch' | 'too_large' | 'decode' };

/** Concatenates the chunks read so far into one array. */
const join = (chunks: Uint8Array[], total: number): Uint8Array => {
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
};

/**
 * GET with no credentials, no referrer, no redirect and no custom header. Refuses a Content-Length over `maxBytes`, then reads the body
 * through a reader and cancels it at the cap. The timer covers the request and the body read.
 */
export const fetchBytes = async (url: string, maxBytes: number): Promise<FetchBytesResult> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOOK_INDEX_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      signal: controller.signal,
    });
    if (response.status !== 200) return { ok: false, reason: 'fetch' };
    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > maxBytes) {
      if (response.body) await response.body.cancel().catch(() => undefined);
      return { ok: false, reason: 'too_large' };
    }
    if (!response.body || typeof response.body.getReader !== 'function') {
      const all = new Uint8Array(await response.arrayBuffer());
      return all.length > maxBytes ? { ok: false, reason: 'too_large' } : { ok: true, bytes: all };
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: 'too_large' };
      }
      chunks.push(value);
    }
    return { ok: true, bytes: join(chunks, total) };
  } catch {
    return { ok: false, reason: 'fetch' };
  } finally {
    clearTimeout(timer);
  }
};

/** fetchBytes, then strict UTF-8; a leading BOM stays in the text, so JSON parsing refuses it. */
export const fetchText = async (url: string, maxBytes: number): Promise<FetchTextResult> => {
  const got = await fetchBytes(url, maxBytes);
  if (!got.ok) return got;
  try {
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(got.bytes), bytes: got.bytes };
  } catch {
    return { ok: false, reason: 'decode' };
  }
};
