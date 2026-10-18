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
import { t } from '../../i18n';

export const markdownEditor: ModuleEditor = {
  type: 'markdown',
  general(config, hass, onChange, template) {
    const c = config as MarkdownModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderTextareaField(
          t('Content'),
          c.content,
          (v) => onChange({ ...c, content: v }),
          { rows: 6, placeholder: t('**Bold**, _italic_, `code`') },
          'content',
          syncCtx,
        )}
        ${renderFieldHint(
          t('Markdown with Home Assistant templates, e.g. {example}. With an entity set, {entity} shows its state.', {
            example: "{{ states('sensor.temperature') }}",
            entity: '{{ states(entity) }}',
          }),
        )}
        ${renderEntityField(t('Entity (for templates)'), c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
      </div>
    `;
  },
};
