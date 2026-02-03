import { HomeAssistant } from './types';

declare global {
  interface Window {
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
    'mc-form-editor': import('./editor/modes/form-editor').FormEditor;
    'mc-yaml-editor': import('./editor/modes/yaml-editor').YamlEditor;
    'mc-tree-editor': import('./editor/modes/tree-editor').TreeEditor;
    'mc-module-selector': import('./editor/panels/module-selector').ModuleSelector;
    'mc-tree-node': import('./editor/components/tree-node').TreeNode;
    'mc-color-picker': import('./editor/components/color-picker').ColorPicker;
  }
}

export {};
