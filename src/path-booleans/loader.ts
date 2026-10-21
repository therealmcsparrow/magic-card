import type { PathBooleansChunk } from '../contracts/path-booleans';

/*
 * Loads the booleans chunk (magic-card-svg-booleans.js) on the first press of a boolean button. Holds
 * no state: webpack joins repeated import() calls to one request. A failure or an 8 s timeout
 * resolves undefined (console.warn) and the next call tries again.
 */

const TIMEOUT_MS = 8000;

export function loadPathBooleans(): Promise<PathBooleansChunk | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const load = import(/* webpackChunkName: "svg-booleans" */ './index').then((m) => m as unknown as PathBooleansChunk);
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS);
  });
  return Promise.race([load, timeout])
    .catch((err: unknown): undefined => {
      console.warn('Magic Card: shape tools not loaded', err);
      return undefined;
    })
    .finally(() => clearTimeout(timer));
}
