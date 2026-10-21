import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, DropdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { lm } from '../../i18n/labels/mark';
import { controlReserve } from './controls.needs';

/** The dropdown (its view is in the controls chunk): metadata, defaults, validation and the box shown until the view arrives. */
class DropdownModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'dropdown',
    name: lm('Dropdown'),
    description: lm('Select dropdown for choosing from a list of options'),
    category: 'controls',
    icon: 'mdi:form-dropdown',
    inherit: ['input_select', 'select', 'input_text', 'text', 'climate', 'fan', 'light', 'media_player', 'water_heater', 'humidifier'],
  };

  createDefault(): DropdownModuleConfig {
    // no options: the entity's own options are offered
    return {
      id: generateId('dropdown'),
      type: 'dropdown',
    };
  }

  /** The dropdown's box with the height it has by default, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as DropdownModuleConfig;
    const min = controlReserve('dropdown', c);
    return html`<div class="mc-module mc-dropdown" style=${min ? `min-height: ${min}px` : nothing}></div>`;
  }
}

ModuleRegistry.registerLazy(new DropdownModule(), lazyChunks.controls);
