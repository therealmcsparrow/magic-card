import { html, nothing, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, ClockModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { clockMinHeight } from '../lazy-heights';

/** Clock (its view is in the modules-extra chunk): metadata, defaults and the box shown until the view arrives. */
class ClockModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'clock' };

  // No format_12h: a new clock follows the user's profile (12 / 24 hour).
  createDefault(): ClockModuleConfig {
    return {
      id: generateId('clock'),
      type: 'clock',
      show_seconds: false,
      show_date: true,
      date_format: 'short',
    };
  }

  /** The height of the time line and the date line, so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const min = clockMinHeight(config as ClockModuleConfig);
    return html`<div class="mc-module mc-clock" style=${min ? `min-height: ${min}` : nothing}></div>`;
  }
}

ModuleRegistry.registerLazy(new ClockModule(), lazyChunks['modules-extra']);
