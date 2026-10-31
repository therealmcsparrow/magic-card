import { VERSION } from '../../version';
import { McAnchorGrid } from '../components/mc-anchor-grid';
import { McBgLayers } from './bg-layers';
import { McLayerDesign, McLayerGroups } from './layer-groups';
import { McLayersSheet } from './layers-sheet';

/*
 * Entry of the lazy layer-editor chunk: install() defines the elements, each guarded, and runs only when BUILD matches magic-card.js.
 * The host loads it through layer-editor-loader.ts.
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
