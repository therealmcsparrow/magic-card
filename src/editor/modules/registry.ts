import type { TemplateResult } from 'lit';
import {
  DEFAULT_MODULE_TABS,
  type ModuleEditor,
  type ModuleEditorRegistry,
  type ModuleTabRender,
} from '../../contracts/module-editor';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../../types';
import { DEFAULT_TAB_RENDERERS, renderNoSettings } from './base-editor';

/** A fresh registry (tests); the editor uses the shared `moduleEditors`. */
export function createModuleEditorRegistry(): ModuleEditorRegistry {
  const editors = new Map<ModuleType, ModuleEditor>();

  const tabs = (type: ModuleType): EditorTab[] => {
    const editor = editors.get(type);
    if (!editor) return ['general'];
    return [...(editor.tabs ?? DEFAULT_MODULE_TABS)];
  };

  return {
    register(e: ModuleEditor): void {
      editors.set(e.type, e);
    },
    get(type: ModuleType): ModuleEditor | undefined {
      return editors.get(type);
    },
    tabs,
    render(
      tab: EditorTab,
      config: CardModule,
      hass: HomeAssistant | undefined,
      onChange: (m: CardModule) => void,
      template?: string,
    ): TemplateResult {
      const editor = editors.get(config.type);
      if (!editor || !tabs(config.type).includes(tab)) return renderNoSettings();
      const own = (editor as unknown as Partial<Record<EditorTab, ModuleTabRender>>)[tab];
      const fn = tab === 'general' ? editor.general : own ?? DEFAULT_TAB_RENDERERS[tab];
      return fn ? fn(config, hass, onChange, template) : renderNoSettings();
    },
  };
}

/** The editor's module editor registry, keyed by module type (module-editor 1.0.0). */
export const moduleEditors: ModuleEditorRegistry = createModuleEditorRegistry();
