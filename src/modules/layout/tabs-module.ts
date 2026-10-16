import { html, nothing, TemplateResult } from 'lit';
import { hasIconFx, renderIcon } from '../../icons/render-icon';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TabsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot } from '../render-module';
import { currentRenderContext } from '../../services/render-context';
import { generateId } from '../../utils/id-generator';

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
    const ctx = currentRenderContext();
    // Per card and per module (keyed by its path), so two cards or two tabs modules never share it.
    const state = ctx?.uiState?.<number>('active-tab');
    const clamp = (i: unknown) =>
      Math.min(Math.max(0, Math.trunc(Number(i)) || 0), Math.max(tabs.length - 1, 0));
    // Studio canvas: the tab that holds the selected child is shown.
    const activeIdx = clamp(ctx?.selectedChild?.()?.slot ?? state?.get() ?? c.active_tab ?? 0);
    const activeTab = tabs[activeIdx];

    const select = (i: number) => (e: Event) => {
      e.stopPropagation();
      if (!state || !ctx || i === activeIdx) return;
      state.set(i);
      ctx.requestUpdate();
    };
    // Switching a tab is not a tap on the tabs module itself (its own actions stay on the wrapper).
    const stop = (e: Event) => e.stopPropagation();
    const onKeydown = (e: KeyboardEvent) => {
      e.stopPropagation();
      const next = { ArrowRight: activeIdx + 1, ArrowLeft: activeIdx - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined || !tabs.length) return;
      e.preventDefault();
      const i = (next + tabs.length) % tabs.length;
      select(i)(e);
      const header = (e.currentTarget as HTMLElement).parentElement;
      queueMicrotask(() => header?.querySelectorAll<HTMLElement>('[role="tab"]')[i]?.focus());
    };

    return html`
      <div class="mc-module mc-tabs" data-style=${c.tab_style || 'default'}>
        <div class="mc-tabs-header" role="tablist">
          ${tabs.map(
            (tab, i) => html`
              <button type="button" role="tab" class="mc-tab-button ${i === activeIdx ? 'active' : ''}"
                aria-selected=${i === activeIdx ? 'true' : 'false'}
                tabindex=${i === activeIdx ? 0 : -1}
                @click=${select(i)} @pointerdown=${stop} @pointerup=${stop} @keydown=${onKeydown}>
                ${tab?.icon
                  ? hasIconFx(c.icon_fx)
                    ? renderIcon({ icon: tab.icon, hass, fx: c.icon_fx, svg: c.svg })
                    : html`<ha-icon icon=${tab.icon}></ha-icon>`
                  : nothing}
                ${tab?.label ?? ''}
              </button>
            `,
          )}
        </div>
        <div class="mc-tabs-content" role="tabpanel">
          ${activeTab?.modules?.length
            ? activeTab.modules.map((child, i) => renderChildModule(child, hass, i, activeIdx))
            : renderEmptySlot('Empty tab')}
        </div>
      </div>
    `;
  }
}

ModuleRegistry.register(new TabsModule());
