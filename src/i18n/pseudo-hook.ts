// Pseudo wrap of this copy of the i18n runtime, set from the window events of the i18n contract.
import type { PseudoWrap } from '../contracts/i18n';

// Same values as I18N_WRAP_EVENT and I18N_WRAP_QUERY_EVENT in the i18n contract (a test compares them).
const I18N_WRAP_EVENT = 'mc-i18n-wrap';
const I18N_WRAP_QUERY_EVENT = 'mc-i18n-wrap-query';

let wrap: PseudoWrap | null = null;
let mine = false;
let sending = false;
let on = false;
const seen: Record<string, 1> = {};
// eslint-disable-next-line no-console
export const dbg = (m: string) => (seen[m] ||= (console.debug('[i18n] ' + m), 1));

export const hasWrap = () => !!wrap;

/** Text through the wrap; the plain text when there is none, when it throws or when it returns a non-string. */
export const wrapText = (s: string, kind: 'msg' | 'num'): string => {
  if (wrap) {
    try {
      const r = wrap(s, kind);
      if (typeof r == 'string') return r;
    } catch {
      // logged below
    }
    dbg('bad wrap');
  }
  return s;
};

const send = () => {
  sending = true;
  try {
    window.dispatchEvent(new CustomEvent(I18N_WRAP_EVENT, { detail: { wrap } }));
  } finally {
    sending = false;
  }
};

/** Starts listening for wraps from any copy, then asks once for the current one. Safe to call again. */
export const listenForWrap = () => {
  if (on || typeof window == 'undefined') return;
  on = true;
  window.addEventListener(I18N_WRAP_EVENT, (e) => {
    const w = (e as CustomEvent<{ wrap?: unknown } | null>).detail?.wrap;
    if (typeof w == 'function' || w === null) {
      wrap = w as PseudoWrap | null;
      mine = sending;
    }
  });
  window.addEventListener(I18N_WRAP_QUERY_EVENT, () => mine && send());
  window.dispatchEvent(new Event(I18N_WRAP_QUERY_EVENT));
};

/** Sets this copy's wrap (null clears it) and sends it to every copy. */
export const broadcastWrap = (w: PseudoWrap | null) => {
  listenForWrap();
  wrap = w;
  send();
};
