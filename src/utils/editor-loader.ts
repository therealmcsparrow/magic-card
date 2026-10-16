import { VERSION } from '../version';

/*
 * The card editor (magic-card-editor, every module's settings tabs, the editor CSS and js-yaml) is a
 * lazy chunk, dist/magic-card-editor.js, loaded next to magic-card.js (public path: src/index.ts).
 * Dashboards never load it; MagicCard.getConfigElement() and window.MagicCard.loadEditor() (the
 * animation studio) do. Contract module-editor 1.0.0, ADR 0007.
 *
 * Memoised while it loads or once it has loaded. A failure (offline, file missing, or a chunk from
 * another release next to a cached magic-card.js) resolves false, is logged, and the next call tries
 * again.
 */

interface EditorChunk {
  EDITOR_VERSION: string;
}

const importEditor = (): Promise<EditorChunk> => import(/* webpackChunkName: "editor" */ '../editor/editor-entry');

let importer: () => Promise<EditorChunk> = importEditor;
let pending: Promise<boolean> | undefined;

const fail = (message: string, err?: unknown): false => {
  pending = undefined;
  console.warn(message, ...(err === undefined ? [] : [err]));
  return false;
};

/** Load the editor chunk; true once its elements are defined, false when it could not be loaded. */
export function loadEditor(): Promise<boolean> {
  pending ??= importer().then(
    (m) =>
      m.EDITOR_VERSION === VERSION
        ? true
        : fail(`Magic Card was updated, reload the page (magic-card.js ${VERSION}, magic-card-editor.js ${m.EDITOR_VERSION}).`),
    (err: unknown) => fail('Magic Card: the editor (magic-card-editor.js) could not be loaded.', err),
  );
  return pending;
}

/** Tests: replace the chunk import (undefined restores it) and forget the cached load. */
export function __setEditorImportForTests(fn: (() => Promise<EditorChunk>) | undefined): void {
  importer = fn ?? importEditor;
  pending = undefined;
}
