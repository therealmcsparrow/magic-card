import { BUILD_VERSION } from '../utils/build-version';

/*
 * Chunk entry of dist/magic-card-anim.js (lazy-module 1.4.0 chunk `anim`): the animation resolve, the
 * document compiler and model it calls, the custom-animation stylesheet and the sequence player. It defines no
 * element and fills no slot: the card reads this module through lazyChunks.anim.module() (src/utils/anim-seam.ts) and
 * draws a plain card until it has installed. Nothing here runs at import time except model.ts and compile-v2's
 * registration of their hooks (src/utils/anim-hooks.ts, in the entry).
 */

export const BUILD: string = BUILD_VERSION;

export function install(): void {}

export { resolveAnimations } from './resolve';
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
