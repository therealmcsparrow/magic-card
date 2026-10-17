import { THEME_EDITOR_TAG } from '../contracts/theme-editor';
import { MagicCardThemeEditor } from './theme-editor';

/*
 * Entry of dist/magic-card-theme-editor.js (loaded by the magic-card-utils panel's Themes tab,
 * never by a dashboard). It defines only its own elements, each guarded; mc-color-picker and
 * mc-unit-field come from magic-card.js through window.MagicCard.loadEditor() and are used by tag.
 * Imports: lit, src/contracts/ and this folder only; no dynamic imports.
 */

export const THEME_EDITOR_ELEMENTS: Array<[string, CustomElementConstructor]> = [[THEME_EDITOR_TAG, MagicCardThemeEditor]];

for (const [tag, ctor] of THEME_EDITOR_ELEMENTS) if (!customElements.get(tag)) customElements.define(tag, ctor);

export { MagicCardThemeEditor };

declare global {
  interface HTMLElementTagNameMap {
    'magic-card-theme-editor': MagicCardThemeEditor;
  }
}
