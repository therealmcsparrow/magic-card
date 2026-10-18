import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, VideoBgModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';

/**
 * Video background: plays behind the other modules of its column or layout (row, column, tab,
 * horizontal / vertical layout). On its own in a column it shows at its own size.
 */
class VideoBgModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'video-bg',
    name: 'Video background',
    description: 'Video playing behind the other modules of its column or layout',
    category: 'advanced',
    icon: 'mdi:video-outline',
  };

  createDefault(): VideoBgModuleConfig {
    return {
      id: generateId('video-bg'),
      type: 'video-bg',
      autoplay: true,
      loop: true,
      muted: true,
    };
  }

  /** A background: an empty box until the player exists. */
  placeholder(_config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-video-bg"></div>`;
  }
}

ModuleRegistry.registerLazy(new VideoBgModule(), lazyChunks['modules-extra']);
