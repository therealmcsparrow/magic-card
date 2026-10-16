import { html, TemplateResult } from 'lit';
import { MagicModule, MagicModuleMetadata } from './module-types';
import {
  CardModule,
  HomeAssistant,
  EditorTab,
  ActionsConfig,
  ActionConfig,
  DisplayConfig,
  DisplayCondition,
  DesignConfig,
} from '../types';
import { generateId } from '../utils/id-generator';
import { SyncContext } from '../utils/sync-path';
import { renderActionGroups } from '../editor/components/action-editor';
import { renderConditionsList } from '../editor/inspector/conditions-list';
import '../editor/components/design-panel';

export abstract class BaseMagicModule implements MagicModule {
  abstract readonly metadata: MagicModuleMetadata;

  abstract createDefault(): CardModule;

  abstract renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult;

  abstract renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult;

  getAvailableTabs(): EditorTab[] {
    return ['general', 'actions', 'conditions', 'design'];
  }

  validate(_config: CardModule): string[] {
    return [];
  }

  /**
   * Build a SyncContext for this module from the template name and module config.
   */
  protected _buildSyncContext(config: CardModule, template?: string): SyncContext | undefined {
    if (!template) return undefined;
    return {
      templateName: template,
      notSynced: (config.not_synced || []) as string[],
      basePath: '',
    };
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
    return (propertyPath: string, updated: CardModule) => {
      if (template) {
        const currentNotSynced = new Set((config.not_synced || []) as string[]);
        currentNotSynced.add(propertyPath);
        (updated as any).not_synced = Array.from(currentNotSynced);
      }
      onChange(updated);
    };
  }

  renderActionsTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const actions = config.actions as ActionsConfig | undefined;
    const syncCtx = this._buildSyncContext(config, template);

    const updateAction = (key: keyof ActionsConfig, action: ActionConfig) => {
      const updated = {
        ...config,
        actions: { ...actions, [key]: action },
      };
      if (template) {
        const currentNotSynced = new Set((config.not_synced || []) as string[]);
        // Mark the specific action property as not synced
        for (const [prop, val] of Object.entries(action)) {
          if (val !== undefined) {
            currentNotSynced.add(`actions.${key}.${prop}`);
          }
        }
        (updated as any).not_synced = Array.from(currentNotSynced);
      }
      onChange(updated);
    };

    const actionSyncCtx = (key: string): SyncContext | undefined => {
      if (!syncCtx) return undefined;
      return { ...syncCtx, basePath: `actions.${key}` };
    };

    // one group per gesture (icon heading), a single "Action" select, then the fields that action needs
    return renderActionGroups(actions, updateAction, hass, config.entity, (key) => actionSyncCtx(key));
  }

  renderConditionsTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const display = config.display as DisplayConfig | undefined;
    const conditions = display?.conditions || [];
    const mode = display?.mode || 'every';
    const syncCtx = this._buildSyncContext(config, template);

    const updateDisplay = (updates: Partial<DisplayConfig>) => {
      onChange({
        ...config,
        display: { ...display, ...updates },
      });
    };

    const addCondition = () => {
      const newCondition: DisplayCondition = {
        id: generateId('cond'),
        type: 'state',
        entity: '',
        state: '',
      };
      updateDisplay({ conditions: [...conditions, newCondition] });
    };

    const removeCondition = (index: number) => {
      updateDisplay({ conditions: conditions.filter((_c, i) => i !== index) });
    };

    const updateCondition = (index: number, updates: Partial<DisplayCondition>) => {
      updateDisplay({
        conditions: conditions.map((c, i) => (i === index ? { ...c, ...updates } : c)),
      });
    };

    const condSyncCtx = syncCtx ? { ...syncCtx, basePath: 'display' } : undefined;

    return renderConditionsList(
      conditions,
      mode,
      {
        onAdd: addCondition,
        onUpdate: updateCondition,
        onRemove: removeCondition,
        onMode: (m) => updateDisplay({ mode: m }),
      },
      hass,
      condSyncCtx,
      'module',
    );
  }

  renderDesignTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const design = (config.design as DesignConfig) || {};
    const hasTemplate = !!template;
    const notSynced = (config.not_synced || []) as string[];

    const updateDesign = (updates: Record<string, unknown>) => {
      const newDesign = { ...design } as Record<string, unknown>;
      const updatedConfig = { ...config };

      // Handle sync control
      if (updates._markNotSynced) {
        // one design key, or several (a section reset / paste)
        const names = ([] as string[]).concat(updates._markNotSynced as string | string[]);
        const currentNotSynced = new Set(config.not_synced || []);
        for (const name of names) currentNotSynced.add(`design.${name}`);
        (updatedConfig as any).not_synced = Array.from(currentNotSynced);
        delete updates._markNotSynced;
      }

      if (updates._markSynced) {
        const propertyName = updates._markSynced as string;
        const path = `design.${propertyName}`;
        const currentNotSynced = new Set(config.not_synced || []);
        currentNotSynced.delete(path);
        (updatedConfig as any).not_synced = Array.from(currentNotSynced);
        delete updates._markSynced;
      }

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') delete newDesign[key];
        else newDesign[key] = value;
      }

      onChange({ ...updatedConfig, design: newDesign as DesignConfig });
    };

    return html`<mc-design-panel
      .design=${design}
      .hass=${hass}
      .hasTemplate=${hasTemplate}
      .notSynced=${notSynced}
      .moduleEntity=${config.entity || ''}
      .moduleType=${config.type || ''}
      .onChange=${updateDesign}
    ></mc-design-panel>`;
  }
}
