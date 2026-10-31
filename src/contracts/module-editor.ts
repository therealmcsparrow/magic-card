import type { TemplateResult } from 'lit';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../types';
import type { EntitySourceInfo } from './entity-scope';
import type { TransferChunk } from './preset-transfer';

/**
 * Contract: per-module editors. Version 1.3.0. Seam: dashboard module classes (src/modules/**) keep metadata,
 * createDefault, renderPreview, validate, hints, migrate and getDependencies.
 */

export const MODULE_EDITOR_CONTRACT = '1.3.0';
export const MODULE_EDITOR_CONTRACT_REVISION = 3;

/** Elements the studio bundle uses by tag; defined once loadEditor() resolves true. */
export const STUDIO_EDITOR_TAGS: readonly string[] = ['mc-unit-field', 'mc-color-picker', 'mc-icon-picker'];

/** Tabs of a module whose editor lists none. */
export const DEFAULT_MODULE_TABS: readonly EditorTab[] = ['general', 'actions', 'conditions', 'design'];

/** (1.1.0) What the editor chunk adds to window.MagicCard. */
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
