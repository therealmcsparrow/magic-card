import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, MarkdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField } from '../../utils/form-utils';

class MarkdownModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'markdown',
    name: 'Markdown',
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

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as MarkdownModuleConfig;
    const raw = c.content || '';

    // Basic inline markdown rendering for preview.
    // TODO: Replace with a proper marked / markdown-it library for full support.
    const rendered = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    return html`
      <div class="mc-module mc-markdown" .innerHTML=${rendered}></div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as MarkdownModuleConfig;
    return html`
      <div class="mc-tab-content">
        <div class="mc-field">
          <label class="mc-field-label">Content</label>
          <textarea
            .value=${c.content || ''}
            @input=${(e: InputEvent) =>
              onChange({ ...c, content: (e.target as HTMLTextAreaElement).value })}
            rows="6"
            placeholder="**Bold**, _italic_, \`code\`"
          ></textarea>
        </div>
        <div class="mc-field-hint">
          Supports Markdown: **bold**, _italic_, \`code\`, and more.
        </div>
        ${renderTextField('Entity (for templates)', c.entity, (v) =>
          onChange({ ...c, entity: v }),
        )}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as MarkdownModuleConfig;
    if (!c.content) {
      errors.push('Markdown content is required');
    }
    return errors;
  }
}

ModuleRegistry.register(new MarkdownModule());
