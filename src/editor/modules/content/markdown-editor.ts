import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { MarkdownModuleConfig } from '../../../types';
import {
  renderEntityField,
  renderAttributeField,
  renderTextareaField,
  renderFieldHint,
} from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

export const markdownEditor: ModuleEditor = {
  type: 'markdown',
  general(config, hass, onChange, template) {
    const c = config as MarkdownModuleConfig;
    const syncCtx = buildSyncContext(config, template);
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
          "Markdown with Home Assistant templates, e.g. {{ states('sensor.temperature') }}. With an entity set, {{ states(entity) }} shows its state.",
        )}
        ${renderEntityField('Entity (for templates)', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
      </div>
    `;
  },
};
