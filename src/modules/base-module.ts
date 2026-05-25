import { html, TemplateResult, nothing } from 'lit';
import { MagicModule, MagicModuleMetadata } from './module-types';
import {
  CardModule,
  HomeAssistant,
  EditorTab,
  ActionsConfig,
  ActionConfig,
  ActionType,
  DisplayConfig,
  DisplayCondition,
  DesignConfig,
} from '../types';
import { generateId } from '../utils/id-generator';
import { SyncContext } from '../utils/sync-path';
import {
  renderTextField,
  renderSelectField,
  renderToggleField,
  renderEntityField,
  renderServiceField,
  renderNumberField,
  renderColorField,
  renderUnitField,
  renderTextareaField,
} from '../utils/form-utils';
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

    const moduleEntity = config.entity;

    return html`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(actions?.tap_action, (a) => updateAction('tap_action', a), hass, moduleEntity, actionSyncCtx('tap_action'))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(actions?.hold_action, (a) => updateAction('hold_action', a), hass, moduleEntity, actionSyncCtx('hold_action'))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(actions?.double_tap_action, (a) =>
            updateAction('double_tap_action', a), hass, moduleEntity, actionSyncCtx('double_tap_action'),
          )}
        </div>
      </div>
    `;
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

    const removeCondition = (id: string) => {
      updateDisplay({ conditions: conditions.filter((c) => c.id !== id) });
    };

    const updateCondition = (id: string, updates: Partial<DisplayCondition>) => {
      updateDisplay({
        conditions: conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    };

    const condSyncCtx = syncCtx ? { ...syncCtx, basePath: 'display' } : undefined;

    return html`
      <div class="mc-tab-content">
        ${renderSelectField(
          'Condition Mode',
          mode,
          [
            { label: 'All conditions (AND)', value: 'every' },
            { label: 'Any condition (OR)', value: 'any' },
          ],
          (v) => updateDisplay({ mode: v as 'every' | 'any' }),
          'mode',
          condSyncCtx,
        )}

        <div class="mc-conditions-list">
          ${conditions.map(
            (cond, idx) => {
              const condItemCtx = condSyncCtx
                ? { ...condSyncCtx, basePath: `display.conditions.${idx}` }
                : undefined;
              return html`
              <div class="mc-condition-item">
                ${renderSelectField(
                  'Type',
                  cond.type,
                  [
                    { label: 'State', value: 'state' },
                    { label: 'Attribute', value: 'attribute' },
                    { label: 'Time', value: 'time' },
                    { label: 'Template', value: 'template' },
                  ],
                  (v) => updateCondition(cond.id, { type: v as DisplayCondition['type'] }),
                  'type',
                  condItemCtx,
                )}
                ${cond.type === 'state' || cond.type === 'attribute'
                  ? html`
                      ${renderEntityField('Entity', cond.entity, (v) =>
                        updateCondition(cond.id, { entity: v }), hass, undefined,
                        'entity', condItemCtx,
                      )}
                      ${cond.type === 'attribute'
                        ? renderTextField('Attribute', cond.attribute, (v) =>
                            updateCondition(cond.id, { attribute: v }),
                            'attribute', condItemCtx,
                          )
                        : nothing}
                      ${renderTextField('State equals', cond.state, (v) =>
                        updateCondition(cond.id, { state: v }),
                        'state', condItemCtx,
                      )}
                      ${renderTextField('State not equals', cond.state_not, (v) =>
                        updateCondition(cond.id, { state_not: v }),
                        'state_not', condItemCtx,
                      )}
                    `
                  : nothing}
                ${cond.type === 'time'
                  ? html`
                      ${renderTextField('After (HH:MM)', cond.after, (v) =>
                        updateCondition(cond.id, { after: v }),
                        'after', condItemCtx,
                      )}
                      ${renderTextField('Before (HH:MM)', cond.before, (v) =>
                        updateCondition(cond.id, { before: v }),
                        'before', condItemCtx,
                      )}
                    `
                  : nothing}
                ${cond.type === 'template'
                  ? html`
                      ${renderTextareaField(
                        'Template',
                        cond.template,
                        (v) => updateCondition(cond.id, { template: v }),
                        { rows: 3 },
                        'template',
                        condItemCtx,
                      )}
                    `
                  : nothing}
                <button class="mc-btn-icon" @click=${() => removeCondition(cond.id)}>
                  &times;
                </button>
              </div>
            `;
            },
          )}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${addCondition}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `;
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
        const propertyName = updates._markNotSynced as string;
        const path = `design.${propertyName}`;
        const currentNotSynced = new Set(config.not_synced || []);
        currentNotSynced.add(path);
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
      .onChange=${updateDesign}
    ></mc-design-panel>`;
  }

  private _renderActionConfig(
    action: ActionConfig | undefined,
    onChange: (action: ActionConfig) => void,
    hass?: HomeAssistant,
    moduleEntity?: string,
    syncCtx?: SyncContext,
  ): TemplateResult {
    const currentAction = action || { action: 'none' as ActionType };
    const needsEntity = currentAction.action === 'more-info' || currentAction.action === 'toggle';
    const useModuleEntity = currentAction.use_module_entity !== false; // default true

    return html`
      <div class="mc-action-config">
        ${renderSelectField( '',
          currentAction.action,
          [
            { label: 'None', value: 'none' },
            { label: 'More Info', value: 'more-info' },
            { label: 'Toggle', value: 'toggle' },
            { label: 'Navigate', value: 'navigate' },
            { label: 'URL', value: 'url' },
            { label: 'Perform Action', value: 'perform-action' },
            { label: 'Assist', value: 'assist' },
          ],
          (v) => onChange({ ...currentAction, action: v as ActionType }),
          'action',
          syncCtx,
        )}
        ${needsEntity && moduleEntity
          ? renderToggleField(
              'Use module entity',
              useModuleEntity,
              (v) => onChange({
                ...currentAction,
                use_module_entity: v,
                entity: v ? undefined : currentAction.entity,
              }),
              'use_module_entity',
              syncCtx,
            )
          : nothing}
        ${needsEntity && (!moduleEntity || !useModuleEntity)
          ? renderEntityField('Entity', currentAction.entity, (v) =>
              onChange({ ...currentAction, entity: v }), hass, undefined,
              'entity', syncCtx,
            )
          : nothing}
        ${currentAction.action === 'navigate'
          ? renderTextField('Navigation Path', currentAction.navigation_path, (v) =>
              onChange({ ...currentAction, navigation_path: v }),
              'navigation_path', syncCtx,
            )
          : nothing}
        ${currentAction.action === 'url'
          ? renderTextField('URL', currentAction.url_path, (v) =>
              onChange({ ...currentAction, url_path: v }),
              'url_path', syncCtx,
            )
          : nothing}
        ${currentAction.action === 'perform-action'
          ? html`
              ${renderServiceField('Service', currentAction.service, (v) =>
                onChange({ ...currentAction, service: v }), hass,
                'service', syncCtx,
              )}
            `
          : nothing}
      </div>
    `;
  }
}
