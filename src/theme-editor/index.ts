import './public-path';
import { THEME_EDITOR_TAG } from '../contracts/theme-editor';
import { McteEditorView } from './editor-view';
import { McteFieldGroup } from './field-group';
import { McteIncludeNotice } from './include-notice';
import { McteModeSwitch } from './mode-switch';
import { McteRawRows } from './raw-rows';
import { McteSaveBar } from './save-bar';
import { McteStartView } from './start-view';
import { MagicCardThemeEditor } from './theme-editor';

/*
 * Entry of dist/magic-card-theme-editor.js (loaded by the magic-card-utils panel's Themes tab,
 * never by a dashboard). It defines only its own elements, each guarded; mc-color-picker and
 * mc-unit-field come from magic-card.js through window.MagicCard.loadEditor() and are used by tag.
 * Imports: lit, src/contracts/ and this folder only; one lazy chunk, the presets (presets/loader.ts, ADR 0014).
 */

export const THEME_EDITOR_ELEMENTS: Array<[string, CustomElementConstructor]> = [
  ['mcte-mode-switch', McteModeSwitch],
  ['mcte-include-notice', McteIncludeNotice],
  ['mcte-save-bar', McteSaveBar],
  ['mcte-raw-rows', McteRawRows],
  ['mcte-field-group', McteFieldGroup],
  ['mcte-start-view', McteStartView],
  ['mcte-editor-view', McteEditorView],
  [THEME_EDITOR_TAG, MagicCardThemeEditor],
];

for (const [tag, ctor] of THEME_EDITOR_ELEMENTS) if (!customElements.get(tag)) customElements.define(tag, ctor);

export { MagicCardThemeEditor };

declare global {
  interface HTMLElementTagNameMap {
    'magic-card-theme-editor': MagicCardThemeEditor;
  }
}
