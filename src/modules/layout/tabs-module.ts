import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TabsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderSelectField } from '../../utils/form-utils';

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
    const activeIdx = c.active_tab || 0;
    const activeTab = tabs[activeIdx];

    return html`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${tabs.map(
            (tab, i) => html`
              <button class="mc-tab-button ${i === activeIdx ? 'active' : ''}">
                ${tab.icon ? html`<ha-icon icon=${tab.icon} style="--mdc-icon-size:16px"></ha-icon>` : ''}
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
            : html`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as TabsModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Tab Style', c.tab_style, [
          { label: 'Default', value: 'default' },
          { label: 'Pills', value: 'pills' },
          { label: 'Underline', value: 'underline' },
        ], (v) => onChange({ ...c, tab_style: v as TabsModuleConfig['tab_style'] }))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(c.tabs || []).map(
            (tab, i) => html`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${tab.label}
                  @input=${(e: InputEvent) => {
                    const tabs = [...(c.tabs || [])];
                    tabs[i] = { ...tabs[i], label: (e.target as HTMLInputElement).value };
                    onChange({ ...c, tabs });
                  }} />
                <button class="mc-btn-icon" @click=${() => {
                  const tabs = (c.tabs || []).filter((_, idx) => idx !== i);
                  onChange({ ...c, tabs });
                }}>&times;</button>
              </div>
            `,
          )}
          <button class="mc-btn mc-btn-secondary" @click=${() => {
            const tabs = [...(c.tabs || []), { label: `Tab ${(c.tabs || []).length + 1}`, modules: [] }];
            onChange({ ...c, tabs });
          }}>Add Tab</button>
        </div>
      </div>
    `;
  }
}

ModuleRegistry.register(new TabsModule());
