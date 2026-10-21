import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, LightModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { controlReserve } from './controls.needs';

/** The light (its view is in the controls chunk): metadata, defaults, validation and the box shown until the view arrives. */
class LightModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'light', inherit: ['light'] };

  createDefault(): LightModuleConfig {
    return {
      id: generateId('light'),
      type: 'light',
      show_brightness: true,
      show_color_temp: false,
      show_color: false,
      compact: false,
    };
  }

  /** The light's box with the height it has by default, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as LightModuleConfig;
    const min = controlReserve('light', c);
    return html`<div class="mc-module mc-light ${c.compact ? 'mc-light--compact' : ''}" style=${min ? `min-height: ${min}px` : nothing}></div>`;
  }
}

ModuleRegistry.registerLazy(new LightModule(), lazyChunks.controls);
