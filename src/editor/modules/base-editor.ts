import { html, TemplateResult } from 'lit';
import type { ModuleTabRender } from '../../contracts/module-editor';
import type { EntitySourceInfo } from '../../contracts/entity-scope';
import type {
  ActionConfig,
  ActionsConfig,
  CardModule,
  DesignConfig,
  DisplayCondition,
  DisplayConfig,
  EditorTab,
} from '../../types';
import { generateId } from '../../utils/id-generator';
import type { SyncContext } from '../../utils/sync-path';
import { renderActionGroups } from '../components/action-editor';
import { renderConditionsList } from '../inspector/conditions-list';
import '../components/design-panel';
import { t } from '../i18n';

/*
 * Default module tab renderers (module-editor 1.0.0): what a listed tab uses when its ModuleEditor
 * has no function for it. Moved from BaseMagicModule, behaviour unchanged.
 */

/** SyncContext for a module's fields; undefined unless the card is linked to a template. */
export function buildSyncContext(config: CardModule, template?: string): SyncContext | undefined {
  if (!template) return undefined;
  return {
    templateName: template,
    notSynced: (config.not_synced || []) as string[],
    basePath: '',
  };
}

/**
 * onChange that adds the changed property path (dot notation, e.g. "actions.tap_action.action") to
 * not_synced when the card is linked to a template.
 */
export function syncedOnChange(
  config: CardModule,
  onChange: (updated: CardModule) => void,
  template?: string,
): (propertyPath: string, updated: CardModule) => void {
  return (propertyPath: string, updated: CardModule) => {
    if (template) {
      const currentNotSynced = new Set((config.not_synced || []) as string[]);
      currentNotSynced.add(propertyPath);
      updated.not_synced = Array.from(currentNotSynced);
    }
    onChange(updated);
  };
}

/** The module's entity for pickers: the effective one when the host passed a scope, else the config's. */
export function entityFor(config: CardModule, scope?: EntitySourceInfo): string | undefined {
  return scope ? scope.effective : config.entity;
}

export const renderDefaultActionsTab: ModuleTabRender = (config, hass, onChange, template, scope) => {
  const actions = config.actions as ActionsConfig | undefined;
  const syncCtx = buildSyncContext(config, template);

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
      updated.not_synced = Array.from(currentNotSynced);
    }
    onChange(updated);
  };

  const actionSyncCtx = (key: string): SyncContext | undefined => {
    if (!syncCtx) return undefined;
    return { ...syncCtx, basePath: `actions.${key}` };
  };

  // one group per gesture (icon heading), a single "Action" select, then the fields that action needs
  return renderActionGroups(actions, updateAction, hass, entityFor(config, scope), (key) => actionSyncCtx(key));
};

export const renderDefaultConditionsTab: ModuleTabRender = (config, hass, onChange, template) => {
  const display = config.display as DisplayConfig | undefined;
  const conditions = display?.conditions || [];
  const mode = display?.mode || 'every';
  const syncCtx = buildSyncContext(config, template);

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
};

export const renderDefaultDesignTab: ModuleTabRender = (config, hass, onChange, template, scope) => {
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
      updatedConfig.not_synced = Array.from(currentNotSynced);
      delete updates._markNotSynced;
    }

    if (updates._markSynced) {
      const currentNotSynced = new Set(config.not_synced || []);
      for (const name of ([] as string[]).concat(updates._markSynced as string | string[])) currentNotSynced.delete(`design.${name}`);
      updatedConfig.not_synced = Array.from(currentNotSynced);
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
    .moduleEntity=${entityFor(config, scope) || ''}
    .moduleType=${config.type || ''}
    .moduleVariant=${(config as { button_style?: string }).button_style || ''}
    .tabs=${config.type === 'tabs' ? tabsInfo(config) : undefined}
    .onChange=${updateDesign}
  ></mc-design-panel>`;
};

/** The tab labels and style of a tabs module, for the design panel's Disabled tabs list. */
function tabsInfo(config: CardModule): { labels: string[]; style?: string } {
  const c = config as unknown as { tabs?: unknown; tab_style?: unknown };
  const list = Array.isArray(c.tabs) ? c.tabs : [];
  return { labels: list.map((x) => (x && typeof x === 'object' && typeof (x as { label?: unknown }).label === 'string' ? (x as { label: string }).label : '')), style: typeof c.tab_style === 'string' ? c.tab_style : undefined };
}

/** Default renderer per tab; general has none (every ModuleEditor brings its own). */
export const DEFAULT_TAB_RENDERERS: Partial<Record<EditorTab, ModuleTabRender>> = {
  actions: renderDefaultActionsTab,
  conditions: renderDefaultConditionsTab,
  design: renderDefaultDesignTab,
};

/** Shown for an unknown module type and for a tab its editor does not list. */
export const renderNoSettings = (): TemplateResult => html`<p class="help">${t('No settings for this module.')}</p>`;
