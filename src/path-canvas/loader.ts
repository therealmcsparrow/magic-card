import type { PathCanvasChunk } from '../contracts/path-canvas';

/*
 * Loads the path canvas chunk (magic-card-path-canvas.js). Holds no state: webpack joins repeated
 * import() calls to one request. A failure resolves undefined (console.warn) and the next call tries again.
 */

export function loadPathCanvas(): Promise<PathCanvasChunk | undefined> {
  return import(/* webpackChunkName: "path-canvas" */ './index').then(
    (m) => m as unknown as PathCanvasChunk,
    (err: unknown) => {
      console.warn('Magic Card: path canvas not loaded', err);
      return undefined;
    },
  );
}
