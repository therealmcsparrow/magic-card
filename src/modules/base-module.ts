import { TemplateResult } from 'lit';
import { MagicModule, MagicModuleMetadata } from './module-types';
import { CardModule, HomeAssistant, EditorTab } from '../types';
import { SyncContext } from '../utils/sync-path';
import {
  buildSyncContext,
  syncedOnChange,
  renderDefaultActionsTab,
  renderDefaultConditionsTab,
  renderDefaultDesignTab,
} from '../editor/modules/base-editor';
import { moduleEditors } from '../editor/modules/registry';

export abstract class BaseMagicModule implements MagicModule {
  abstract readonly metadata: MagicModuleMetadata;

  abstract createDefault(): CardModule;

  abstract renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult;

  /** Content modules: their General tab is a ModuleEditor in the registry. This delegation goes in T1.5d. */
  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    return moduleEditors.render('general', config, hass, onChange, template);
  }

  getAvailableTabs(): EditorTab[] {
    return ['general', 'actions', 'conditions', 'design'];
  }

  validate(_config: CardModule): string[] {
    return [];
  }

  /** Build a SyncContext for this module from the template name and module config. */
  protected _buildSyncContext(config: CardModule, template?: string): SyncContext | undefined {
    return buildSyncContext(config, template);
  }

  /**
   * Create a wrapped onChange that automatically tracks not_synced when linked to a template.
   * The propertyPath is the dot-notation path of the changed property (e.g., "entity", "actions.tap_action.action").
   */
  protected _syncedOnChange(
    config: CardModule,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): (propertyPath: string, updated: CardModule) => void {
    return syncedOnChange(config, onChange, template);
  }

  // The default tabs live in the editor chunk (src/editor/modules/base-editor.ts); these delegations go in T1.5d.
  renderActionsTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    return renderDefaultActionsTab(config, hass, onChange, template);
  }

  renderConditionsTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    return renderDefaultConditionsTab(config, hass, onChange, template);
  }

  renderDesignTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    return renderDefaultDesignTab(config, hass, onChange, template);
  }
}
