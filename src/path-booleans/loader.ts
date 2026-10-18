import type { PathBooleansChunk } from '../contracts/path-booleans';

/*
 * Loads the booleans chunk (magic-card-svg-booleans.js) on the first press of a boolean button.
 * Used by the SVG editor and shape editor chunks only. One shared promise; a failure or an 8 s
 * timeout resolves undefined (console.warn) and the next call tries again.
 */

const TIMEOUT_MS = 8000;
let pending: Promise<PathBooleansChunk | undefined> | undefined;

export function loadPathBooleans(): Promise<PathBooleansChunk | undefined> {
  if (!pending) {
    const fail = (err: unknown): undefined => {
      pending = undefined;
      console.warn('Magic Card: shape tools not loaded', err);
      return undefined;
    };
    const load = import(/* webpackChunkName: "svg-booleans" */ './index').then(
      (m) => m as unknown as PathBooleansChunk,
    );
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS),
    );
    pending = Promise.race([load, timeout]).catch(fail);
  }
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetPathBooleansForTests(): void {
  pending = undefined;
}
