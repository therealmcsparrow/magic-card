import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import type { LazyStubMetadata } from '../module-types';
import { CardModule, MarkdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { markdownMinHeightEm } from '../lazy-heights';

class MarkdownModule extends BaseLazyStub {
  readonly metadata: LazyStubMetadata = { type: 'markdown' };

  createDefault(): MarkdownModuleConfig {
    return {
      id: generateId('markdown'),
      type: 'markdown',
      content: '**Hello** _World_',
    };
  }

  /** The markdown box, as high as the text will be (estimated from its lines), until `marked` has loaded. */
  placeholder(config: CardModule): TemplateResult {
    return html`<div class="mc-module mc-markdown" style="min-height: ${markdownMinHeightEm((config as MarkdownModuleConfig).content)}em"></div>`;
  }

  hints(config: CardModule): string[] {
    return (config as MarkdownModuleConfig).content ? [] : [t('Markdown content is required')];
  }
}

ModuleRegistry.registerLazy(new MarkdownModule(), lazyChunks.markdown);
