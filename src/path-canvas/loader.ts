import type { PathCanvasChunk } from '../contracts/path-canvas';

/*
 * Loads the path canvas chunk (magic-card-path-canvas.js). Used by the SVG editor and shape editor
 * chunks only. One shared promise; a failure resolves undefined (console.warn) and the next call
 * tries again.
 */

let pending: Promise<PathCanvasChunk | undefined> | undefined;

export function loadPathCanvas(): Promise<PathCanvasChunk | undefined> {
  pending ??= import(/* webpackChunkName: "path-canvas" */ './index').then(
    (m) => m as unknown as PathCanvasChunk,
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: path canvas not loaded', err);
      return undefined;
    },
  );
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetPathCanvasForTests(): void {
  pending = undefined;
}
