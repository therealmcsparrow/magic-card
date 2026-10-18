import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, MarkdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';

class MarkdownModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'markdown',
    get name() {
      return t('Markdown');
    },
    description: 'Render markdown-formatted content',
    category: 'content',
    icon: 'mdi:language-markdown',
  };

  createDefault(): MarkdownModuleConfig {
    return {
      id: generateId('markdown'),
      type: 'markdown',
      content: '**Hello** _World_',
    };
  }

  /** The markdown box, one line high, until `marked` has loaded. */
  placeholder(_config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-markdown" style="min-height: 1.5em"></div>`;
  }

  hints(config: CardModule): string[] {
    return (config as MarkdownModuleConfig).content ? [] : [t('Markdown content is required')];
  }
}

ModuleRegistry.registerLazy(new MarkdownModule(), lazyChunks.markdown);
