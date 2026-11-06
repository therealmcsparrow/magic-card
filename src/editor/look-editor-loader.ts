import { BUILD_VERSION } from '../utils/build-version';

// Loader of the look-editor chunk: `loadLookEditor()` resolves true once the chunk matches this build.

export const LOOK_EDITOR_FILE = 'magic-card-look-editor.js';
/** A chunk that has not arrived after this long counts as failed (the skeleton must not spin for ever). */
export const LOOK_EDITOR_TIMEOUT_MS = 15_000;

interface LookEditorChunk {
  BUILD?: string;
  install?: () => void;
}

const realImport = (): Promise<unknown> => import(/* webpackChunkName: "look-editor" */ '../look-editor/chunk');
let importer: () => Promise<unknown> = realImport;
let pending: Promise<boolean> | undefined;
let loaded = false;

export function loadLookEditor(): Promise<boolean> {
  if (loaded) return Promise.resolve(true);
  pending ??= new Promise<boolean>((resolve) => {
    let done = false;
    const finish = (ok: boolean, why?: unknown): void => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (ok) loaded = true;
      else {
        pending = undefined;
        console.warn(`Magic Card: ${LOOK_EDITOR_FILE} did not load`, ...(why === undefined ? [] : [why]));
      }
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false, 'timed out'), LOOK_EDITOR_TIMEOUT_MS);
    importer().then(
      (m) => {
        const mod = m as LookEditorChunk;
        if (mod?.BUILD !== BUILD_VERSION) return finish(false, `Magic Card was updated, reload the page (editor ${BUILD_VERSION}, ${LOOK_EDITOR_FILE} ${String(mod?.BUILD)}).`);
        try {
          mod.install?.();
        } catch (err) {
          return finish(false, err);
        }
        finish(true);
      },
      (err: unknown) => finish(false, err),
    );
  });
  return pending;
}

/** Whether the chunk has loaded in this page (hosts render the real editor synchronously then). */
export const lookEditorLoaded = (): boolean => loaded;

/** Tests: forget the load state; `load` replaces the import (restored when omitted). */
export function __setLookEditorImportForTests(load?: () => Promise<unknown>): void {
  pending = undefined;
  loaded = false;
  importer = load ?? realImport;
}
