import type { PathBooleansChunk } from '../contracts/path-booleans';

// Loads the booleans chunk (magic-card-svg-booleans.js) on the first press of a boolean button; a failure or 8 s timeout resolves undefined.

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
