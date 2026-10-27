import { resolveCss } from './css';

declare const __MC_BUILD_VERSION__: string | undefined;

/*
 * Entry of the svg-css chunk (magic-card-svg-css.js): the CSS paint resolver, loaded by css-loader.ts where an SVG is
 * opened or imported. Nothing runs when it is evaluated: it defines no element and fills no slot. BUILD is the release
 * this chunk was built for; the loader hands out the resolver only when it equals its own.
 */

/** The build define of this chunk (empty where the define is missing, such as in tests). */
export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : '';

export { resolveCss };
