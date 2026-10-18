import type { PathToolsChunk } from '../contracts/path-tools';

/*
 * Loads the path tools chunk (magic-card-path-tools.js) on the first use of a path tool. Used by the SVG editor
 * chunk only, together with the booleans loader. One shared promise; a failure or an 8 s timeout resolves
 * undefined (console.warn) and the next call tries again.
 */

const TIMEOUT_MS = 8000;
let pending: Promise<PathToolsChunk | undefined> | undefined;

export function loadPathTools(): Promise<PathToolsChunk | undefined> {
  if (!pending) {
    const fail = (err: unknown): undefined => {
      pending = undefined;
      console.warn('Magic Card: path tools not loaded', err);
      return undefined;
    };
    const load = import(/* webpackChunkName: "path-tools" */ './index').then((m) => m as unknown as PathToolsChunk);
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS));
    pending = Promise.race([load, timeout]).catch(fail);
  }
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetPathToolsForTests(): void {
  pending = undefined;
}
