import { PAUSE_STORAGE_PREFIX } from '../contracts/card-pause.needs';

/*
 * The remembered Pause motion state, read by the card bundle so a pause the viewer chose holds from the first paint.
 * The pause chunk writes the same key on toggle, so both sides take it from here. Plain code, no imports of a chunk.
 */

/** FNV-1a (32 bit) as 8 hex digits. */
function fnv(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** The storage key of one card config on this page. An edited config gives a new key. */
export const pauseKey = (source: object): string => PAUSE_STORAGE_PREFIX + location.pathname + ':' + fnv(JSON.stringify(source));

/** True when this key was left paused; localStorage missing or blocked reads as playing. */
export function rememberedPause(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}
