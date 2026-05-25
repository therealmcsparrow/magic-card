import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, MarkdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderEntityField,
  renderAttributeField,
  renderTextareaField,
  renderFieldHint,
} from '../../utils/form-utils';

// Configure marked for safe output
marked.setOptions({
  breaks: true,
  gfm: true,
});

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

  private _resolveContent(content: string, hass?: HomeAssistant, entityId?: string, attribute?: string): string {
    if (!hass || !entityId) return content;
    const entity = hass.states[entityId];
    if (!entity) return content;

    const stateVal = entity.state;
    const attrVal = attribute ? String(entity.attributes[attribute] ?? '') : '';

    return content
      .replace(/\{\{\s*state\s*\}\}/g, stateVal)
      .replace(/\{\{\s*attribute\s*\}\}/g, attrVal)
      .replace(/\{\{\s*entity\s*\}\}/g, entityId);
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as MarkdownModuleConfig;
    const raw = this._resolveContent(c.content || '', hass, c.entity, c.attribute);
    const rendered = marked.parse(raw) as string;

    return html`
      <div class="mc-module mc-markdown">${unsafeHTML(rendered)}</div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as MarkdownModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderTextareaField(
          'Content',
          c.content,
          (v) => onChange({ ...c, content: v }),
          { rows: 6, placeholder: '**Bold**, _italic_, `code`' },
          'content',
          syncCtx,
        )}
        ${renderFieldHint(
          'Supports full Markdown. Use {{ state }}, {{ attribute }}, {{ entity }} for dynamic values.',
        )}
        ${renderEntityField('Entity (for templates)', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
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
