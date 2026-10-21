import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, ImageModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { cssAspectRatio } from '../../utils/aspect-ratio';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

/** Static or entity image (its view is in the modules-extra chunk): metadata, defaults, hints and the box shown until the view arrives. */
class ImageModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'image',
    name: lm('Image'),
    description: lm('Display a static image or entity picture'),
    category: 'content',
    icon: 'mdi:image-outline',
  };

  createDefault(): ImageModuleConfig {
    return {
      id: generateId('image'),
      type: 'image',
      image: '',
      entity_picture: false,
      aspect_ratio: '16:9',
      fit: 'cover',
    };
  }

  /** The image's box at its aspect ratio (the view uses the same call), so the layout does not move when the view arrives. */
  placeholder(config: CardModule): TemplateResult {
    const c = config as ImageModuleConfig;
    return html`<div class="mc-module mc-image" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)};"></div>`;
  }

  hints(config: CardModule): string[] {
    // No image yet is not an error: the preview shows the image-off placeholder.
    const c = config as ImageModuleConfig;
    if (c.entity_picture && !c.entity) return [t('Entity is required when using entity picture')];
    return [];
  }
}

ModuleRegistry.registerLazy(new ImageModule(), lazyChunks['modules-extra']);
