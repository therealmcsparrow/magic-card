import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TabsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderSelectField } from '../../utils/form-utils';
import { getModuleTypeOptions, renderChildModuleEditor } from '../../utils/layout-editor';

/** Track which tab is active in preview (keyed by module id) */
const _activeTabMap = new Map<string, number>();

/** Track which tab is being edited in the editor (keyed by module id) */
const _editorTabMap = new Map<string, number>();

/** Track which child module is expanded for editing (keyed by "moduleId:tabIdx:childIdx") */
const _expandedChildMap = new Map<string, boolean>();

class TabsModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'tabs',
    name: 'Tabs',
    description: 'Tabbed container for groups of modules',
    category: 'layout',
    icon: 'mdi:tab',
  };

  createDefault(): TabsModuleConfig {
    return {
      id: generateId('tabs'),
      type: 'tabs',
      tabs: [
        { label: 'Tab 1', modules: [] },
        { label: 'Tab 2', modules: [] },
      ],
      active_tab: 0,
      tab_style: 'default',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as TabsModuleConfig;
    const tabs = c.tabs || [];
    const activeIdx = _activeTabMap.get(c.id) ?? c.active_tab ?? 0;
    const activeTab = tabs[activeIdx];

    const onTabClick = (i: number) => (e: Event) => {
      e.stopPropagation();
      _activeTabMap.set(c.id, i);
      (e.target as HTMLElement).dispatchEvent(
        new CustomEvent('mc-request-update', { bubbles: true, composed: true }),
      );
    };

    return html`
      <div class="mc-module mc-tabs" data-style=${c.tab_style || 'default'}>
        <div class="mc-tabs-header">
          ${tabs.map(
            (tab, i) => html`
              <button class="mc-tab-button ${i === activeIdx ? 'active' : ''}"
                @click=${onTabClick(i)}>
                ${tab.icon ? html`<ha-icon icon=${tab.icon}></ha-icon>` : ''}
                ${tab.label}
              </button>
            `,
          )}
        </div>
        <div class="mc-tabs-content">
          ${activeTab?.modules?.length
            ? activeTab.modules.map((child) => {
                const mod = ModuleRegistry.get(child.type);
                return mod ? mod.renderPreview(child, hass) : html`<span class="mc-error">?</span>`;
              })
            : html`<span class="mc-placeholder-text">Empty tab</span>`}
        </div>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as TabsModuleConfig;
    const tabs = c.tabs || [];
    const editorActiveIdx = _editorTabMap.get(c.id) ?? 0;
    const clampedIdx = Math.min(editorActiveIdx, Math.max(tabs.length - 1, 0));
    const activeTabData = tabs[clampedIdx];
    const moduleTypes = getModuleTypeOptions();

    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Tab Style', c.tab_style, [
          { label: 'Default', value: 'default' },
          { label: 'Pills', value: 'pills' },
          { label: 'Underline', value: 'underline' },
        ], (v) => onChange({ ...c, tab_style: v as TabsModuleConfig['tab_style'] }), 'tab_style', syncCtx)}

        <!-- Tab label list -->
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${tabs.map(
            (tab, i) => html`
              <div class="mc-field mc-inline-field-row">
                <input type="text" .value=${tab.label}
                  @input=${(e: InputEvent) => {
                    const newTabs = [...tabs];
                    newTabs[i] = { ...newTabs[i], label: (e.target as HTMLInputElement).value };
                    onChange({ ...c, tabs: newTabs });
                  }} />
                <button class="mc-btn-icon" @click=${() => {
                  const newTabs = tabs.filter((_, idx) => idx !== i);
                  if (clampedIdx >= newTabs.length && newTabs.length > 0) {
                    _editorTabMap.set(c.id, newTabs.length - 1);
                  }
                  onChange({ ...c, tabs: newTabs });
                }}>&times;</button>
              </div>
            `,
          )}
          <button class="mc-btn mc-btn-secondary" @click=${() => {
            const newTabs = [...tabs, { label: `Tab ${tabs.length + 1}`, modules: [] }];
            onChange({ ...c, tabs: newTabs });
          }}>Add Tab</button>
        </div>

        <!-- Per-tab child module management -->
        ${tabs.length > 0
          ? html`
            <div class="mc-section">
              <div class="mc-section-header">Tab Content</div>
              <div class="mc-tabs-header mc-editor-tab-switcher">
                ${tabs.map(
                  (tab, i) => html`
                    <button
                      class="mc-tab-button ${i === clampedIdx ? 'active' : ''}"
                      @click=${() => { _editorTabMap.set(c.id, i); onChange({ ...c }); }}
                    >${tab.label}</button>
                  `,
                )}
              </div>
              ${activeTabData
                ? this._renderChildModuleList(c, clampedIdx, hass, onChange, moduleTypes, template)
                : nothing}
            </div>
          `
          : nothing}
      </div>
    `;
  }

  private _renderChildModuleList(
    c: TabsModuleConfig,
    tabIdx: number,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    moduleTypes: Array<{ label: string; value: string }>,
    template?: string,
  ): TemplateResult {
    const tab = c.tabs![tabIdx];
    const children = tab.modules || [];

    const updateChildren = (newModules: CardModule[]) => {
      const newTabs = [...(c.tabs || [])];
      newTabs[tabIdx] = { ...newTabs[tabIdx], modules: newModules };
      onChange({ ...c, tabs: newTabs });
    };

    const removeChild = (childIdx: number) => {
      updateChildren(children.filter((_, i) => i !== childIdx));
    };

    const updateChild = (childIdx: number, updated: CardModule) => {
      const newModules = [...children];
      newModules[childIdx] = updated;
      updateChildren(newModules);
    };

    const addChild = (type: string) => {
      const newMod = ModuleRegistry.createDefault(type as any);
      if (newMod) {
        updateChildren([...children, newMod]);
      }
    };

    return html`
      ${renderChildModuleEditor({
        ownerId: c.id,
        scopeId: `tab-${tabIdx}`,
        children,
        hass,
        template,
        expandedState: _expandedChildMap,
        moduleTypes,
        onRefresh: () => onChange({ ...c }),
        onRemoveChild: removeChild,
        onUpdateChild: updateChild,
        onAddChild: addChild,
      })}
    `;
  }
}

ModuleRegistry.register(new TabsModule());
