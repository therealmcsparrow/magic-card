import { BUILD_VERSION } from '../utils/build-version';
import { animationStyles } from '../css/animations';
import { layerRevealStyles } from '../reveal/layer-reveal';

// Chunk entry of dist/magic-card-anim.js: animation resolve, document compiler and model, the custom-animation stylesheet,
// the animation library, the sequence player and the preset keyframes. It defines no element; the card reads it through
// lazyChunks.anim.module() and draws a plain card until it has installed.

export const BUILD: string = BUILD_VERSION;

/** The preset keyframes, particle layers and animation rules of the card, then the layer fade-in; Core adopts them with the chunk. */
export const styles = [animationStyles, layerRevealStyles];

export function install(): void {}

export { resolveAnimations } from './resolve';
export { animationLibrary } from './animation-library';
export { adoptAnimationSheet, useAnimationCss } from '../card/custom-anim-sheet';
export { stopSequences, syncSequences } from '../card/sequence-player';

/*
 * Parent of anim-runtime, particles and editor (lazy-module 1.4.0). The three literal import()s sit here,
 * so webpack leaves every module this chunk holds out of them. Each only returns the import() promise: the chunk table
 * (src/utils/lazy-chunks.ts) and src/utils/editor-loader.ts call them in the same synchronous call as their retry.
 */
export const importRuntime = () => import(/* webpackChunkName: "anim-runtime" */ '../anim-runtime');
export const importParticles = () => import(/* webpackChunkName: "particles" */ '../particles');
export const importEditor = () => import(/* webpackChunkName: "editor" */ '../editor/editor-entry');
