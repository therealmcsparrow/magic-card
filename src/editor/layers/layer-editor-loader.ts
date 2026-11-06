import { html, nothing, type TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { lazyChunk } from '../../utils/lazy-chunk';
import { t } from '../i18n';

// The only importer of the layer editor chunk (layer-editor 1.0.0), through the shared lazyChunk() helper.

export const layerEditorChunk = lazyChunk('layer-editor', () => import(/* webpackChunkName: "layer-editor" */ './chunk'));

/** Start (or join) the load. Resolves true once the elements are defined, false on failure. */
export const loadLayerEditor = (): Promise<boolean> => layerEditorChunk.load();

/** True once the elements are defined; never starts a load. */
export const layerEditorReady = (): boolean => layerEditorChunk.ready();

const NOTE = 'margin:0 0 8px;color:var(--secondary-text-color)';

/**
 * What the host shows where a panel of the chunk goes: nothing when it is ready, one line while it loads,
 * and the failure line (the YAML tab keeps working) when the import failed. Updates itself.
 */
export function layerEditorNote(): TemplateResult | typeof nothing {
  if (layerEditorChunk.ready()) return nothing;
  const failed = html`<p role="alert" style=${NOTE}>${t('card-editor.layer-editor-loader.layer-settings-could-not-load-reload-the')}</p>`;
  if (layerEditorChunk.failed()) return failed;
  const loading = html`<p role="status" style=${NOTE}>${t('card-editor.layer-editor-loader.loading-layer-settings')}</p>`;
  return html`${until(loadLayerEditor().then((ok) => (ok ? nothing : failed)), loading)}`;
}
