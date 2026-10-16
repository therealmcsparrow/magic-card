import { HomeAssistant } from './types';

declare global {
  /** webpack's public path (chunk URLs); set from import.meta.url in src/index.ts. */
  var __webpack_public_path__: string;

  interface Window {
    /** Contract read by the magic-card-utils panel: `apiVersion` 1 is the current one. */
    MagicCard?: { version: string; apiVersion: number; [key: string]: unknown };
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
