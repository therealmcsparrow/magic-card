import { SHAPE_EDITOR_TAG } from '../contracts/svg-editor';

// Loads the shape editor chunk (magic-card-shape-editor.js) for the card-editor chunk; false on failure or after 8 s.

let pending: Promise<boolean> | undefined;
const TIMEOUT_MS = 8000;

export function loadShapeEditorChunk(): Promise<boolean> {
  if (customElements.get(SHAPE_EDITOR_TAG)) return Promise.resolve(true);
  pending ??= Promise.race([
    import(/* webpackChunkName: "shape-editor" */ './index').then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), TIMEOUT_MS)),
  ]).then(
    (ok) => {
      if (!ok) pending = undefined;
      return ok;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: shape editor not loaded', err);
      return false;
    },
  );
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetShapeEditorForTests(): void {
  pending = undefined;
}
