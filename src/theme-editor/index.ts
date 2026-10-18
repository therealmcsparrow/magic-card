import './public-path';
import { THEME_EDITOR_TAG } from '../contracts/theme-editor';
import { UI_TOAST_TAG, UI_WINDOW_TAG } from '../contracts/ui-kit';
import { defineKitElements } from '../ui-kit/define-parts';
import { UiToast } from '../ui-kit/elements/toast';
import { UiWindow } from '../ui-kit/elements/window';
import { McteEditorView } from './editor-view';
import { McteFieldGroup } from './field-group';
import { McteIncludeNotice } from './include-notice';
import { McteModeSwitch } from './mode-switch';
import { MctePresetDialog } from './preset-dialog';
import { McteRawRows } from './raw-rows';
import { McteSaveBar } from './save-bar';
import { McteStartView } from './start-view';
import { MagicCardThemeEditor } from './theme-editor';

/*
 * Entry of dist/magic-card-theme-editor.js (loaded by the magic-card-utils panel's Themes tab,
 * never by a dashboard). It defines only its own elements, each guarded; mc-color-picker and
 * mc-unit-field come from magic-card.js through window.MagicCard.loadEditor() and are used by tag.
 * Imports: lit, src/contracts/, src/css/editor-system.ts (editorTokens) and src/ui-kit/ (contract 1.2.0), and this folder; one lazy chunk, the presets (presets/loader.ts, ADR 0014).
 */

export const THEME_EDITOR_ELEMENTS: Array<[string, CustomElementConstructor]> = [
  ['mcte-mode-switch', McteModeSwitch],
  ['mcte-include-notice', McteIncludeNotice],
  ['mcte-preset-dialog', MctePresetDialog],
  ['mcte-save-bar', McteSaveBar],
  ['mcte-raw-rows', McteRawRows],
  ['mcte-field-group', McteFieldGroup],
  ['mcte-start-view', McteStartView],
  ['mcte-editor-view', McteEditorView],
  [THEME_EDITOR_TAG, MagicCardThemeEditor],
];

for (const [tag, ctor] of THEME_EDITOR_ELEMENTS) if (!customElements.get(tag)) customElements.define(tag, ctor);
// the kit's window and toast (ui-kit 1.0.0 r2): this entry compiles its own copy of just these two; the guard keeps whichever defined a tag first
defineKitElements([
  [UI_WINDOW_TAG, UiWindow],
  [UI_TOAST_TAG, UiToast],
]);

export { MagicCardThemeEditor };

declare global {
  interface HTMLElementTagNameMap {
    'magic-card-theme-editor': MagicCardThemeEditor;
  }
}
