// Decides whether a verified fetched index may replace the cached one (look-index v2.0.0).
import type { AcceptIndex } from '../contracts/look-index';

const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

/** Accepts when there is no cache, the seq is higher, or seq and bytes are equal (unchanged); otherwise `index_rollback`. */
export const acceptIndex: AcceptIndex = (cached, fetched) => {
  if (!cached || fetched.seq > cached.seq) return { ok: true, changed: true };
  if (fetched.seq === cached.seq && sameBytes(cached.payloadBytes, fetched.payloadBytes))
    return { ok: true, changed: false };
  return { ok: false, code: 'index_rollback' };
};
