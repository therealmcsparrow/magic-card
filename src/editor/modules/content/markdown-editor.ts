import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { MarkdownModuleConfig } from '../../../types';
import {
    renderAttributeField,
  renderTextareaField,
  renderFieldHint,
} from '../../../utils/form-utils';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const markdownEditor: ModuleEditor = {
  type: 'markdown',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as MarkdownModuleConfig;
    const eid = entityFor(c, scope);
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
        ${renderEntitySourceField(t('Entity (for templates)'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
      </div>
    `;
  },
};
