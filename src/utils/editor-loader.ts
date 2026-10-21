import { VERSION } from '../version';
import type { LazyChunkControl } from './lazy-chunk';
import { lazyChunks } from './lazy-chunks';

/*
 * The card editor (magic-card-editor, every module's settings tabs, the editor CSS and js-yaml) is a
 * lazy chunk, dist/magic-card-editor.js, loaded next to magic-card.js (public path: src/index.ts).
 * Dashboards never load it; MagicCard.getConfigElement() and window.MagicCard.loadEditor() (the
 * animation studio) do. Contract module-editor 1.0.0.
 *
 * Memoised while it loads or once it has loaded. A failure (offline, file missing, or a chunk from
 * another release next to a cached magic-card.js) resolves false, is logged, and the next call tries
 * again. The retry is not verified against a failed fetch: webpack forgets a failed chunk, but a
 * browser may keep the failed module request for that URL until the page reloads, so the warning
 * tells the user to reload.
 *
 * The editor's labels (CSS property names, animation presets, module names, ... : namespace 'labels',
 * contract i18n 1.0.0) sit in a second lazy chunk, magic-card-i18n-labels.js, that the editor chunk
 * imports. This file never imports it (magic-card.js carries only the label numbers); it awaits the
 * chunk's ready() and takes the same failure path when the labels cannot load.
 */

interface EditorChunk {
  EDITOR_VERSION: string;
  /** Resolves true once the labels tables are loaded, false when magic-card-i18n-labels.js failed (never rejects). */
  labelsReady(): Promise<boolean>;
}

/**
 * The editor chunk is a child of `anim` (lazy-module 1.4.0): its import() sits in src/anim-studio/anim-chunk.ts,
 * so `anim` and `svg-icon` (the one copy of the icon source, read through svgIconApi()) load first. Either one failing is an
 * editor load failure: false, the same warning, retried on the next call, and HA falls back to its YAML editor.
 */
/** Load a parent; one that has failed gets another attempt (a plain load() would hand back its failed verdict). */
const ensure = (c: LazyChunkControl): Promise<boolean> => (c.failed() ? c.retry() : c.load());

const importEditor = (): Promise<EditorChunk> =>
  Promise.all([ensure(lazyChunks.anim), ensure(lazyChunks['svg-icon'])]).then(([a, s]) => {
    const m = lazyChunks.anim.module() as { importEditor(): Promise<EditorChunk> } | undefined;
    if (!a || !s || !m) throw new Error('editor parents');
    return m.importEditor();
  });

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
      m.EDITOR_VERSION !== VERSION
        ? fail(`Magic Card was updated, reload the page (magic-card.js ${VERSION}, magic-card-editor.js ${m.EDITOR_VERSION}).`)
        : m.labelsReady().then((ok) => (ok ? true : fail('Magic Card: the editor texts (magic-card-i18n-labels.js) could not be loaded, reload the page.'))),
    (err: unknown) => fail('Magic Card: the editor (magic-card-editor.js) could not be loaded, reload the page.', err),
  );
  return pending;
}

/** Tests: replace the chunk import (undefined restores it) and forget the cached load. */
export function __setEditorImportForTests(fn: (() => Promise<EditorChunk>) | undefined): void {
  importer = fn ?? importEditor;
  pending = undefined;
}
