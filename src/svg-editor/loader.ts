import { SVG_EDITOR_TAG } from '../contracts/svg-editor';

/*
 * Loads the SVG editor chunk (magic-card-svg-editor.js) for the card-editor chunk, which exposes it as
 * window.MagicCard.loadSvgEditor(). One shared promise; false on failure or after 8 s, and the next call
 * tries again (a failed import() of the same URL is cached by the browser, so the retry only helps once
 * the network is back: the chunk loader rewrites nothing here).
 */

let pending: Promise<boolean> | undefined;
const TIMEOUT_MS = 8000;

export function loadSvgEditorChunk(): Promise<boolean> {
  if (customElements.get(SVG_EDITOR_TAG)) return Promise.resolve(true);
  pending ??= Promise.race([
    import(/* webpackChunkName: "svg-editor" */ './index').then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), TIMEOUT_MS)),
  ]).then(
    (ok) => {
      if (!ok) pending = undefined;
      return ok;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: SVG editor not loaded', err);
      return false;
    },
  );
  return pending;
}

/** Tests: forget the shared promise. */
export function __resetSvgEditorForTests(): void {
  pending = undefined;
}
