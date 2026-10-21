import { VERSION } from '../../version';
import { LAYER_CSS } from '../layer-css';
import { layerSlot } from '../layer-slot';
import { arrange, resolveLayer, scanFills, scrimCss } from '../placement';
import { defineBgStack } from './mc-bg-stack';

/*
 * Chunk entry of dist/magic-card-layers.js (contract lazy-module 1.2.0). Evaluating this file changes
 * nothing global: install() defines <mc-bg-stack> (contract bg-stack 1.0.0), guarded, and fills the layer slot with
 * the placement runtime and its CSS (layer-placement 1.0.0). placement.ts and layer-css.ts are
 * imported by this file only.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  defineBgStack();
  layerSlot.provide({ resolveLayer, arrange, scanFills, scrimCss, css: LAYER_CSS });
}
