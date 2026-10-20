import type { TemplateResult } from 'lit';
import type { CardModule, EditorTab, HomeAssistant, ModuleType } from '../types';
import type { EntitySourceInfo } from './entity-scope';
import type { TransferChunk } from './preset-transfer';

/*
 * Contract: per-module editors. Version 1.3.0 revision 2 (Architect-owned). ADR 0007, ADR 0022.
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
 * - (r3, 2026-10-20, 39-architect-dup-rulings.md) loadEditor() loads the `anim` and `svg-icon` chunks first and calls anim's importEditor(); the editor chunk is a child of `anim` (ADR 0045) and reads icon geometry through svgIconApi(), never its own icon-source copy. Either chunk failing is an editor load failure (false, HA's YAML editor).
 * - `MagicCard.getConfigElement(): Promise<HTMLElement>` awaits loadEditor and throws when it is
 *   false, so HA falls back to its YAML editor. getStubConfig stays synchronous in magic-card.js.
 * - Window contract, additive: `window.MagicCard.loadEditor` (apiVersion stays 1). The studio bundle
 *   uses it to get STUDIO_EDITOR_TAGS, still by tag.
 * - (1.1.0, additive, epic C) When the editor chunk evaluates it sets
 *   `window.MagicCard.loadTransfer: () => Promise<TransferChunk>` (preset-transfer 1.0.0), which
 *   calls src/editor/transfer-loader.ts. magic-card.js gains no code for it (+0 B): the property
 *   exists only after loadEditor() resolved true. The theme editor and animation studio entries
 *   use it, so the transfer chunk is loaded by the magic-card.js runtime and shares its modules.
 *   apiVersion stays 1.
 * - (1.1.0, additive, 2026-10-18, revision r1 of the window contract) `window.MagicCard.setLocale(hass)`
 *   is the card runtime's `setI18nLocale` (i18n 1.0.0). An entry that carries its own i18n runtime copy
 *   (the standalone animation studio) calls it next to its own `setI18nLocale`, so the colour, unit and
 *   icon pickers, which run on magic-card.js's copy, follow the Home Assistant language. Optional on
 *   the type (an old magic-card.js lacks it): call `window.MagicCard?.setLocale?.(hass)`. +16 B in
 *   magic-card.js. apiVersion stays 1.
 *
 * - (1.2.0, additive, 2026-10-19, card entity) `ModuleTabRender` takes an optional 5th argument `scope`
 *   (EntitySourceInfo, contract entity-scope 1.0.0), which the inspector computes with
 *   resolveEntitySource and `ModuleEditorRegistry.render` passes on as its 6th argument to every tab. The
 *   default actions and design tabs use `scope.effective` instead of `config.entity`. A ModuleEditor with
 *   `entityField: true` draws the entity field itself (renderEntitySourceField, in place of
 *   renderEntityField); for every other editor the registry puts the field in front of General. Callers
 *   that pass no scope get the plain entity field and `config.entity`, as in 1.1.0.
 *
 * - (1.3.0, additive, 2026-10-19, background-layers, layer-placement 1.0.0) The design tab of every
 *   module starts with the Placement group and, for background / overlay, the Layer group
 *   (03-ui-ux-designer.md sections 2-3, 11). They edit the module's top-level `placement` and `layer`
 *   keys, never `design`, and are not shown in the Hover view or inside conditional design rules.
 *   The registry draws them in front of the design tab for every editor (default or own `design`),
 *   so no ModuleEditor changes; an editor that must hide them sets `layerGroups: false` (none does in
 *   1.3.0). The inspector supplies the context (LayerGroupContext; the layer-editor contract's
 *   LayerEditorContext extends it).
 *   r2 (2026-10-20, CEO size ruling): the groups are the <mc-layer-design> element of the editor-side
 *   chunk 'layer-editor' (contract layer-editor 1.0.0). The registry keeps the light tag helper
 *   src/editor/layers/layer-design.ts `renderLayerGroups(config, hass, onChange, ctx, below?)` and
 *   calls loadLayerEditor() instead of importing the element; the loading and failure lines are those
 *   of layer-editor 1.0.0.
 *
 * Types only (0 B), apart from the constants below.
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
