import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, SpinboxModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';
import { controlReserve } from './controls.needs';

/** The spinbox (its view is in the controls chunk): metadata, defaults, validation and the box shown until the view arrives. */
class SpinboxModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'spinbox',
    name: lm('Spinbox'),
    description: lm('Numeric input with increment and decrement buttons'),
    category: 'controls',
    icon: 'mdi:numeric',
  };

  createDefault(): SpinboxModuleConfig {
    // no min / max / step: the entity's own range and step apply
    return {
      id: generateId('spinbox'),
      type: 'spinbox',
    };
  }

  /** The spinbox's box with the height it has by default, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as SpinboxModuleConfig;
    const min = controlReserve('spinbox', c);
    return html`<div class="mc-module mc-spinbox" style=${min ? `min-height: ${min}px` : nothing}></div>`;
  }

  validate(config: CardModule): string[] {
    const c = config as SpinboxModuleConfig;
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) return [t('Min must be less than max')];
    if (c.step !== undefined && !(c.step > 0)) return [t('Step must be greater than 0')];
    return [];
  }
}

ModuleRegistry.registerLazy(new SpinboxModule(), lazyChunks.controls);
