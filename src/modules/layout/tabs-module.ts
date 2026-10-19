import { html, nothing, TemplateResult } from 'lit';
import { hasIconFx, renderIcon } from '../../icons/render-icon';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TabsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { layoutChildren, renderEmptySlot } from '../render-module';
import { currentRenderContext } from '../../services/render-context';
import { generateId } from '../../utils/id-generator';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

class TabsModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'tabs',
    name: lm('Tabs'),
    description: lm('Tabbed container for groups of modules'),
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
    const ctx = currentRenderContext();
    const tabs = c.tabs || [];
    // the tabs shown, by their index in `tabs`: a hidden tab is left out on the dashboard (the studio
    // shows it dimmed); active_tab and the stored tab keep counting every tab, like the editor
    const shown = tabs.flatMap((t, i) => (ctx?.editMode || !t?.hidden ? [i] : []));
    // Per card and per module (keyed by its path), so two cards or two tabs modules never share it.
    const state = ctx?.uiState?.<number>('active-tab');
    // Studio canvas: the tab that holds the selected child is shown. A hidden or missing tab: the first shown.
    const want = Math.trunc(Number(ctx?.selectedChild?.()?.slot ?? state?.get() ?? c.active_tab ?? 0));
    const activeIdx = shown.includes(want) ? want : shown[0] ?? 0;
    // every tab hidden: no content either
    const activeTab = shown.length ? tabs[activeIdx] : undefined;

    const laid = activeTab?.modules?.length ? layoutChildren(activeTab.modules, hass, activeIdx) : undefined;

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
      const n = shown.length;
      const at = shown.indexOf(activeIdx);
      const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: n - 1 }[e.key];
      if (next === undefined || !n) return;
      e.preventDefault();
      const p = (next + n) % n;
      select(shown[p])(e);
      const header = (e.currentTarget as HTMLElement).parentElement;
      queueMicrotask(() => header?.querySelectorAll<HTMLElement>('[role="tab"]')[p]?.focus());
    };

    return html`
      <div class="mc-module mc-tabs" data-style=${c.tab_style || 'default'}>
        <div class="mc-tabs-header" role="tablist">
          ${shown.map((i) => {
            const tab = tabs[i];
            return html`
              <button type="button" role="tab" class="mc-tab-button ${i === activeIdx ? 'active' : ''}" data-mc-hidden=${tab?.hidden ? '' : nothing}
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
            `;
          })}
        </div>
        <div class="mc-tabs-content" role="tabpanel" data-mc-layers=${laid?.layered ? '' : nothing}>
          ${laid ? laid.content : renderEmptySlot(t('Empty tab'))}
        </div>
      </div>
    `;
  }
}

ModuleRegistry.register(new TabsModule());
