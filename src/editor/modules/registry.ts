import { html, type TemplateResult } from 'lit';
import {
  DEFAULT_MODULE_TABS,
  type ModuleEditor,
  type LayerGroupContext,
  type ModuleEditorRegistry,
  type ModuleTabRender,
} from '../../contracts/module-editor';
import type { EntitySourceInfo } from '../../contracts/entity-scope';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../../types';
import { renderEntityBlock } from '../components/entity-source';
import { buildSyncContext } from './base-editor';
import { DEFAULT_TAB_RENDERERS, renderNoSettings } from './base-editor';
import { renderLayerGroups } from '../layers/layer-design';
import '../layers/layer-groups'; // defines <mc-layer-design>; the one line to swap for a lazy chunk
import type { LayerEditorContext } from '../layers/placement-model';

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
      scope?: EntitySourceInfo,
      layers?: LayerGroupContext,
    ): TemplateResult {
      const editor = editors.get(config.type);
      if (!editor || !tabs(config.type).includes(tab)) return renderNoSettings();
      const own = (editor as unknown as Partial<Record<EditorTab, ModuleTabRender>>)[tab];
      const fn = tab === 'general' ? editor.general : own ?? DEFAULT_TAB_RENDERERS[tab];
      if (!fn) return renderNoSettings();
      let body = fn(config, hass, onChange, template, scope);
      // module-editor 1.3.0: Placement and Layer groups in front of every design tab
      if (tab === 'design' && layers && editor.layerGroups !== false) body = renderLayerGroups(config, hass, onChange, layers as LayerEditorContext, body);
      // editors that draw no entity field of their own get it in front of General
      if (tab !== 'general' || !scope || editor.entityField) return body;
      return html`${renderEntityBlock(config, hass, onChange, scope, buildSyncContext(config, template))}${body}`;
    },
  };
}

/** The editor's module editor registry, keyed by module type (module-editor 1.0.0). */
export const moduleEditors: ModuleEditorRegistry = createModuleEditorRegistry();
