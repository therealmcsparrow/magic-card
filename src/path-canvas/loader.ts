import type { PathCanvasChunk } from '../contracts/path-canvas';

// Loads the path canvas chunk (magic-card-path-canvas.js); a failure resolves undefined and the next call tries again.

export function loadPathCanvas(): Promise<PathCanvasChunk | undefined> {
  return import(/* webpackChunkName: "path-canvas" */ './index').then(
    (m) => m as unknown as PathCanvasChunk,
    (err: unknown) => {
      console.warn('Magic Card: path canvas not loaded', err);
      return undefined;
    },
  );
}
