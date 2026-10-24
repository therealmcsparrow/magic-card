import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, TabsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { tabsMinHeight } from '../lazy-heights';

/** Tabbed container (its view is in the modules-extra chunk): metadata, defaults and the box shown until the view arrives. */
class TabsModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'tabs', tabBar: true };

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

  /** The tab bar's height, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-tabs" style="min-height: ${tabsMinHeight(config as TabsModuleConfig)}px"></div>`;
  }
}

ModuleRegistry.registerLazy(new TabsModule(), lazyChunks['modules-extra']);
