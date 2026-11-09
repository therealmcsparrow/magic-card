import { VERSION } from '../version';
import { IMAGE_ANIMATION_CONTRACT, type ImageAnimChunk } from '../contracts/image-animation';
import { checkImageAnimation } from './check';
import { play } from './play';

// Chunk entry of dist/magic-card-image-anim.js (contract image-animation 1.0.0): plays the animation of a library image.

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export const api: ImageAnimChunk = { version: IMAGE_ANIMATION_CONTRACT, play };

/** The record check the viewer runs before play(); the drawing's ids decide which targets exist. */
export { checkImageAnimation };

/** Nothing to register: the viewer is plain functions. */
export const install = (): void => {};
