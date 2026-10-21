import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, GaugeModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { controlReserve } from './controls.needs';

/** The gauge (its view is in the controls chunk): metadata, defaults, validation and the box shown until the view arrives. */
class GaugeModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'gauge' };

  createDefault(): GaugeModuleConfig {
    return {
      id: generateId('gauge'),
      type: 'gauge',
      min: 0,
      max: 100,
      needle: true,
      gauge_style: 'half',
      show_name: true,
    };
  }

  /** The gauge's box with the height it has by default, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as GaugeModuleConfig;
    const min = controlReserve('gauge', c);
    return html`<div class="mc-module mc-gauge" style=${min ? `min-height: ${min}px` : nothing}></div>`;
  }

  validate(config: CardModule): string[] {
    const c = config as GaugeModuleConfig;
    if (c.min !== undefined && c.max !== undefined && Number(c.min) >= Number(c.max)) return [t('Min must be less than max')];
    return [];
  }
}

ModuleRegistry.registerLazy(new GaugeModule(), lazyChunks.controls);
