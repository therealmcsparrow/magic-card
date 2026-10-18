import { HomeAssistant } from './types';

declare global {
  /** webpack's public path (chunk URLs); set from import.meta.url in src/index.ts. */
  var __webpack_public_path__: string;

  interface Window {
    /**
     * Contract read by the magic-card-utils panel: `apiVersion` 1 is the current one. `loadEditor`
     * loads the editor chunk (true once its elements are defined); the animation studio calls it.
     */
    MagicCard?: { version: string; apiVersion: number; loadEditor?: () => Promise<boolean>; loadSeasonal?: () => Promise<boolean>; setLocale?: import('./contracts/i18n').SetI18nLocale; [key: string]: unknown };
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }

  interface HTMLElementTagNameMap {
    'magic-card': import('./card/magic-card').MagicCard;
    'magic-card-editor': import('./editor/magic-card-editor').MagicCardEditor;
    'mc-yaml-editor': import('./editor/modes/yaml-editor').YamlEditor;
    'mc-module-selector': import('./editor/panels/module-selector').ModuleSelector;
    'mc-color-picker': import('./editor/components/color-picker').ColorPicker;
    'mc-icon-picker': import('./editor/components/icon-picker').IconPicker;
  }
}

export {};
