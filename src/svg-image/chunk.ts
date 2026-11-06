import { VERSION } from '../version';
import type { SvgImageApi } from '../contracts/svg-image';
import { McSvgImage } from './mc-svg-image';
import { getImage, invalidateImages } from './client';
import { fileBlob, fragment, thumbnail } from './export';
import { bindingValue } from './binding-value';
import { sanitizeImage } from './sanitize';

// Chunk entry of dist/magic-card-svg-image.js (contract svg-image 1.0.0); everything happens in install().

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/** The one copy of the image client's state and the one place library-image markup meets an SVG sink. */
export const api: SvgImageApi = { sanitizeImage, getImage, fragment, thumbnail, fileBlob, bindingValue, invalidate: invalidateImages };

export function install(): void {
  if (!customElements.get('mc-svg-image')) customElements.define('mc-svg-image', McSvgImage);
}
