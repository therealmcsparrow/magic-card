import type { TemplateResult } from 'lit';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../types';

/*
 * Contract: per-module editors. Version 1.0.0 (Architect-owned). ADR 0007.
 *
 * Seam: dashboard module classes (src/modules/**) keep metadata, createDefault, renderPreview,
 * validate, hints, migrate and getDependencies. Settings tabs are ModuleEditor entries in the editor
 * chunk (src/editor/modules/**), keyed by module type, held by one ModuleEditorRegistry
 * (src/editor/modules/registry.ts). The inspector is the only caller.
 *
 * Rules:
 * - Every ModuleRegistry type has exactly one ModuleEditor.
 * - Missing `tabs` = DEFAULT_MODULE_TABS. A listed tab without its function uses the default renderer
 *   from src/editor/modules/base-editor.ts (actions, conditions, design; not_synced marking included).
 * - Registry: unknown type has tabs ['general'] and renders "No settings for this module."
 *   The last register for a type wins.
 * - Dashboard code (the src/index.ts static graph) never imports src/editor/**, src/css/editor-*.ts,
 *   src/utils/form-utils.ts, src/utils/yaml-utils.ts or js-yaml. The editor chunk may import
 *   dashboard modules.
 * - Loader (Core item "lazy chunk loaders"): `loadEditor(): Promise<boolean>` in
 *   src/utils/editor-loader.ts. Memoised; false on failure and retried on the next call. The chunk's
 *   EDITOR_VERSION must equal magic-card.js VERSION; a mismatch counts as a failure with the console
 *   hint "Magic Card was updated, reload the page".
 * - `MagicCard.getConfigElement(): Promise<HTMLElement>` awaits loadEditor and throws when it is
 *   false, so HA falls back to its YAML editor. getStubConfig stays synchronous in magic-card.js.
 * - Window contract, additive: `window.MagicCard.loadEditor` (apiVersion stays 1). The studio bundle
 *   uses it to get STUDIO_EDITOR_TAGS, still by tag.
 *
 * Types only (0 B), apart from the constants below.
 */

export const MODULE_EDITOR_CONTRACT = '1.0.0';

/** Tabs of a module whose editor lists none. */
export const DEFAULT_MODULE_TABS: readonly EditorTab[] = ['general', 'actions', 'conditions', 'design'];

/** Elements the studio bundle uses by tag; defined once loadEditor() resolves true. */
export const STUDIO_EDITOR_TAGS: readonly string[] = ['mc-unit-field', 'mc-color-picker', 'mc-icon-picker'];

export type ModuleTabRender = (
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  template?: string,
) => TemplateResult;

export interface ModuleEditor {
  type: ModuleType;
  /** Tabs in display order; missing = DEFAULT_MODULE_TABS. */
  tabs?: readonly EditorTab[];
  general: ModuleTabRender;
  actions?: ModuleTabRender;
  conditions?: ModuleTabRender;
  design?: ModuleTabRender;
}

export interface ModuleEditorRegistry {
  register(e: ModuleEditor): void;
  get(type: ModuleType): ModuleEditor | undefined;
  tabs(type: ModuleType): EditorTab[];
  render(
    tab: EditorTab,
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (m: CardModule) => void,
    template?: string,
  ): TemplateResult;
}
