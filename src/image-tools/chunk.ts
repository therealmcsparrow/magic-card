import { VERSION } from '../version';
import { McImagePicker } from './mc-image-picker';
import { McLibraryImageField } from './mc-library-image-field';

/*
 * Chunk entry of dist/magic-card-image-tools.js (contract image-editor 1.0.0, "Card editor"). Evaluating this file
 * changes nothing global: install() defines the elements, each guarded. The card editor never imports a file of this
 * chunk; it renders the tags and loads this entry through src/editor/image-tools-loader.ts.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  const define = (tag: string, ctor: CustomElementConstructor): void => {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
  };
  define('mc-image-picker', McImagePicker);
  define('mc-library-image-field', McLibraryImageField);
}
