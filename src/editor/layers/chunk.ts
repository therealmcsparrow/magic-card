import { VERSION } from '../../version';
import { McAnchorGrid } from '../components/mc-anchor-grid';
import { McBgLayers } from './bg-layers';
import { McLayerDesign, McLayerGroups } from './layer-groups';
import { McLayersSheet } from './layers-sheet';

/*
 * Chunk entry of dist/magic-card-layer-editor.js (contracts layer-editor 1.0.0 and lazy-module 1.2.0).
 * Evaluating this file changes nothing global: install() defines the elements, each guarded, and runs only
 * when BUILD matches the loading magic-card.js. The host (magic-card-editor.js) never imports a file of
 * this chunk; it renders the tags and loads this entry through layer-editor-loader.ts.
 * The contract also lists mc-bg-layer-editor, but bg-layer-editor.ts is a render function, not an element.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  const define = (tag: string, ctor: CustomElementConstructor): void => {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
  };
  define('mc-anchor-grid', McAnchorGrid);
  define('mc-layer-groups', McLayerGroups);
  define('mc-layer-design', McLayerDesign);
  define('mc-bg-layers', McBgLayers);
  define('mc-layers-sheet', McLayersSheet);
}
