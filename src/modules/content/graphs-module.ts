import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, GraphsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { lazyChunks } from '../../utils/lazy-chunks';

export { clearHistoryCache, downsample, historyRequest, parseHistory } from '../../services/history-cache';
export type { HistorySample } from '../../services/history-cache';

class GraphsModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'graphs',
    name: 'Graph',
    description: 'Display entity history as a line graph',
    category: 'content',
    icon: 'mdi:chart-line',
  };

  createDefault(): GraphsModuleConfig {
    return {
      id: generateId('graphs'),
      type: 'graphs',
      hours_to_show: 24,
      points_per_hour: 2,
      line_width: 2,
      fill: true,
      show_points: false,
      show_labels: true,
    };
  }

  /** Re-check every minute so the history is refetched soon after the cache expires (entity unchanged or not). */
  getDependencies(config: CardModule): ModuleDependencies {
    return config.entity ? { refreshInterval: 60_000 } : {};
  }

  /** The graph box (60 px) and, with labels, one label line, so the layout does not move. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as GraphsModuleConfig;
    return html`<div class="mc-module mc-graphs"><div style="height: 60px"></div>${c.show_labels !== false
      ? html`<div class="mc-graphs-label"><span class="mc-graphs-name">&nbsp;</span></div>`
      : nothing}</div>`;
  }
}

ModuleRegistry.registerLazy(new GraphsModule(), lazyChunks['modules-extra']);
