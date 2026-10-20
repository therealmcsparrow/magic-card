import { BUILD_VERSION } from '../utils/build-version';

/*
 * Chunk entry of dist/magic-card-anim.js (lazy-module 1.4.0 chunk `anim`, ADR 0043): the animation resolve, the
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
