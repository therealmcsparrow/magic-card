import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, MarkdownModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderModuleError } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { sanitizeHtml, escapeHtml } from '../../utils/sanitize-html';
import { currentRenderContext } from '../../services/render-context';
import { hasJinja, templateResultToString } from '../../services/template-controller';

marked.setOptions({
  breaks: true,
  gfm: true,
});

const HTML_CACHE_MAX = 50;
/** Sanitized HTML per markdown source: re-renders (clock ticks, unrelated entities) reuse it. */
const htmlCache = new Map<string, string>();

function markdownToHtml(source: string): string {
  let out = htmlCache.get(source);
  if (out !== undefined) {
    htmlCache.delete(source); // most recently used last
  } else {
    out = sanitizeHtml(marked.parse(source, { async: false }) as string);
    if (htmlCache.size >= HTML_CACHE_MAX) htmlCache.delete(htmlCache.keys().next().value as string);
  }
  htmlCache.set(source, out);
  return out;
}

/** The placeholders of the old string-replacement templating. */
const LEGACY_TOKEN = /\{\{\s*(state|attribute|entity)\s*\}\}/g;

/** Legacy placeholders filled in locally; values are text, never markup. */
function resolveLegacy(content: string, hass?: HomeAssistant, entityId?: string, attribute?: string): string {
  if (!hass || !entityId) return content;
  const entity = hass.states[entityId];
  if (!entity) return content;
  const values: Record<string, string> = {
    state: entity.state,
    attribute: attribute ? String(entity.attributes[attribute] ?? '') : '',
    entity: entityId,
  };
  return content.replace(LEGACY_TOKEN, (_m, name: string) => escapeHtml(values[name]));
}

/**
 * Jinja for render_template: the module entity / attribute are passed as variables (`entity`,
 * `attribute_name`), and the legacy placeholders become the equivalent expressions.
 */
function toJinja(content: string, entityId?: string, attribute?: string): { template: string; variables?: Record<string, unknown> } {
  if (!entityId) return { template: content };
  const template = content
    .replace(/\{\{\s*state\s*\}\}/g, '{{ states(entity) }}')
    .replace(/\{\{\s*attribute\s*\}\}/g, attribute ? '{{ state_attr(entity, attribute_name) }}' : '');
  return { template, variables: attribute ? { entity: entityId, attribute_name: attribute } : { entity: entityId } };
}

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

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as MarkdownModuleConfig;
    const source = this._source(c, hass);
    if (typeof source !== 'string') return source;
    const rendered = markdownToHtml(source);
    return html`<div class="mc-module mc-markdown">${unsafeHTML(rendered)}</div>`;
  }

  /**
   * Markdown source to render. Jinja (anything beyond the legacy {{ state }} / {{ attribute }} /
   * {{ entity }} placeholders) is rendered by Home Assistant through a render_template
   * subscription; the legacy placeholders alone are filled in locally, HTML-escaped.
   */
  private _source(c: MarkdownModuleConfig, hass?: HomeAssistant): string | TemplateResult {
    const content = c.content === undefined || c.content === null ? '' : String(c.content);
    const legacyOnly = !hasJinja(content.replace(LEGACY_TOKEN, ''));
    const ctx = currentRenderContext();
    if (legacyOnly || !ctx) return resolveLegacy(content, hass, c.entity, c.attribute);

    const { template, variables } = toJinja(content, c.entity, c.attribute);
    const result = ctx.template(template, variables);
    switch (result.status) {
      case 'ok':
        return templateResultToString(result.result);
      case 'pending':
        return '';
      case 'error':
        return renderModuleError([`Template error: ${result.error}`]);
      default:
        return resolveLegacy(content, hass, c.entity, c.attribute);
    }
  }


  hints(config: CardModule): string[] {
    return (config as MarkdownModuleConfig).content ? [] : ['Markdown content is required'];
  }
}

ModuleRegistry.register(new MarkdownModule());
