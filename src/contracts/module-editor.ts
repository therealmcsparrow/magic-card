import type { TemplateResult } from 'lit';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../types';
import type { EntitySourceInfo } from './entity-scope';
import type { TransferChunk } from './preset-transfer';

/** Contract: per-module editors. Version 1.4.0. Module classes (src/modules/**) keep metadata, createDefault,
 * renderPreview, validate, hints, migrate and getDependencies. */

export const MODULE_EDITOR_CONTRACT = '1.4.0';
export const MODULE_EDITOR_CONTRACT_REVISION = 3;

/** Elements the studio bundle uses by tag; defined once loadEditor() resolves true. */
export const STUDIO_EDITOR_TAGS: readonly string[] = ['mc-unit-field', 'mc-color-picker', 'mc-icon-picker'];

/**
 * (1.4.0) Elements the theme editor (shipped with Magic Card Utils) uses by tag from the card's lazy chunks:
 * mc-color-picker and mc-font-picker once loadEditor() resolves true, mc-transfer-panel once loadTransfer()
 * resolves. Removing or renaming one is a major change and needs a paired Magic Card Utils release.
 */
export const UTILS_TOOL_EDITOR_TAGS: readonly string[] = ['mc-color-picker', 'mc-font-picker', 'mc-transfer-panel'];

/** Tabs of a module whose editor lists none. */
export const DEFAULT_MODULE_TABS: readonly EditorTab[] = ['general', 'actions', 'conditions', 'design'];

/**
 * (1.1.0) What the editor chunk adds to window.MagicCard. (1.4.0) loadEditor, loadTransfer and setLocale on
 * window.MagicCard are a cross-repo surface: the Magic Card Utils tools feature-detect each one and fail cleanly
 * without it. A breaking change to any of them is a major and ships with a paired Magic Card Utils release.
 */
export interface MagicCardEditorWindowAdditions {
  loadTransfer: () => Promise<TransferChunk>;
}

export type ModuleTabRender = (
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  template?: string,
  scope?: EntitySourceInfo,
) => TemplateResult;

/** (1.3.0) What the inspector knows about the module's place, for the Placement / Layer groups. */
export interface LayerGroupContext {
  /** Visible in-flow siblings in the same container. */
  siblings: number;
  /** fill: row / card may be offered (module directly in a card grid or row module column). */
  canHoist: boolean;
  /** Position among the container's backgrounds or overlays, for "2nd from the front, of 3". */
  rank?: { index: number; count: number };
}

export interface ModuleEditor {
  type: ModuleType;
  /** Tabs in display order; missing = DEFAULT_MODULE_TABS. */
  tabs?: readonly EditorTab[];
  /** (1.2.0) true: General draws the entity field itself; absent: the registry puts it in front. */
  entityField?: true;
  /** (1.3.0) false: no Placement / Layer groups on the design tab. Absent = shown. */
  layerGroups?: false;
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
    scope?: EntitySourceInfo,
    /** (1.3.0) Placement / Layer group context; absent: the groups are not drawn. */
    layers?: LayerGroupContext,
  ): TemplateResult;
}
