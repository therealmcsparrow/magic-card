// The card's check of a preview's bytes (look-index 2.0.0, Previews). Pure; a failure means no image, never a refused look.

import { LOOK_PREVIEW_MAX_BYTES } from '../contracts/look-index';
import { sha512Hex } from '../look-kit/crypto';

export type PreviewCheck = { ok: true } | { ok: false; reason: 'size' | 'hash' | 'magic' | 'animated' | 'header' };

const tagAt = (b: Uint8Array, at: number, tag: string): boolean => {
  if (at + tag.length > b.length) return false;
  for (let i = 0; i < tag.length; i++) if (b[at + i] !== tag.charCodeAt(i)) return false;
  return true;
};

/** Size cap, SHA-512 of the exact bytes, RIFF/WEBP magic, then the first chunk: `VP8 `, `VP8L`, or a `VP8X` with the animation flag clear. */
export const checkPreview = (bytes: Uint8Array, expectedSha512: string): PreviewCheck => {
  if (bytes.length > LOOK_PREVIEW_MAX_BYTES) return { ok: false, reason: 'size' };
  if (sha512Hex(bytes) !== expectedSha512) return { ok: false, reason: 'hash' };
  if (!tagAt(bytes, 0, 'RIFF') || !tagAt(bytes, 8, 'WEBP')) return { ok: false, reason: 'magic' };
  if (bytes.length < 20) return { ok: false, reason: 'header' };
  if (tagAt(bytes, 12, 'VP8 ') || tagAt(bytes, 12, 'VP8L')) return { ok: true };
  if (tagAt(bytes, 12, 'VP8X')) {
    if (bytes.length < 21) return { ok: false, reason: 'header' };
    return (bytes[20] & 0x02) !== 0 ? { ok: false, reason: 'animated' } : { ok: true };
  }
  return { ok: false, reason: 'header' };
};
