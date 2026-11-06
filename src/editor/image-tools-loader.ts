import { html, type TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { BUILD_VERSION } from '../utils/build-version';

// Loader of the image-tools chunk: `loadImageTools()` resolves true once the chunk matches this build.

export const IMAGE_TOOLS_FILE = 'magic-card-image-tools.js';
/** A chunk that has not arrived after this long counts as failed. */
export const IMAGE_TOOLS_TIMEOUT_MS = 15_000;

interface ImageToolsChunk {
  BUILD?: string;
  install?: () => void;
}

const realImport = (): Promise<unknown> => import(/* webpackChunkName: "image-tools" */ '../image-tools/chunk');
let importer: () => Promise<unknown> = realImport;
let pending: Promise<boolean> | undefined;
let loaded = false;

export function loadImageTools(): Promise<boolean> {
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
        console.warn(`Magic Card: ${IMAGE_TOOLS_FILE} did not load`, ...(why === undefined ? [] : [why]));
      }
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false, 'timed out'), IMAGE_TOOLS_TIMEOUT_MS);
    importer().then(
      (m) => {
        const mod = m as ImageToolsChunk;
        if (mod?.BUILD !== BUILD_VERSION) return finish(false, `Magic Card was updated, reload the page (editor ${BUILD_VERSION}, ${IMAGE_TOOLS_FILE} ${String(mod?.BUILD)}).`);
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

/** Whether the chunk has loaded in this page (hosts render the field synchronously then). */
export const imageToolsLoaded = (): boolean => loaded;

/**
 * The library image field once the chunk is there, the plain fields until then and when it cannot load.
 * Starts the load; the template swaps itself.
 */
export function withImageTools(field: () => TemplateResult, fallback: () => TemplateResult): TemplateResult {
  if (loaded) return field();
  return html`${until(loadImageTools().then((ok) => (ok ? field() : fallback())), fallback())}`;
}

/** The module or layer with the keys of an `image-change` applied; a key set to undefined is removed. */
export function applyKeys<T extends object>(target: T, keys: Record<string, unknown>): T {
  const next = { ...target, ...keys } as Record<string, unknown>;
  for (const k of Object.keys(keys)) if (next[k] === undefined) delete next[k];
  return next as T;
}

/** Tests: forget the load state; `load` replaces the import (restored when omitted). */
export function __setImageToolsImportForTests(load?: () => Promise<unknown>): void {
  pending = undefined;
  loaded = false;
  importer = load ?? realImport;
}
