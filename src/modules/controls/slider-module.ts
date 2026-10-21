import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, SliderModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';
import { controlReserve } from './controls.needs';

/** The slider (its view is in the controls chunk): metadata, defaults, validation and the box shown until the view arrives. */
class SliderModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'slider',
    name: lm('Slider'),
    description: lm('Range slider for controlling numeric values'),
    category: 'controls',
    icon: 'mdi:tune-vertical',
  };

  createDefault(): SliderModuleConfig {
    return {
      id: generateId('slider'),
      type: 'slider',
      show_value: true,
      direction: 'horizontal',
    };
  }

  /** The slider's box with the height it has by default, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as SliderModuleConfig;
    const min = controlReserve('slider', c);
    return html`<div class="mc-module mc-slider mc-slider-container ${c.direction === 'vertical' ? 'mc-slider-container--vertical' : 'mc-slider-container--horizontal'}" style=${min ? `min-height: ${min}px` : nothing}></div>`;
  }

  validate(config: CardModule): string[] {
    const c = config as SliderModuleConfig;
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) return [t('Min must be less than max')];
    if (c.step !== undefined && !(c.step > 0)) return [t('Step must be greater than 0')];
    return [];
  }
}

ModuleRegistry.registerLazy(new SliderModule(), lazyChunks.controls);
