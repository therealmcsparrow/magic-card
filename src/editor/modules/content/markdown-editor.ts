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
          t('card-editor.markdown-editor.content'),
          c.content,
          (v) => onChange({ ...c, content: v }),
          { rows: 6, placeholder: t('card-editor.markdown-editor.bold-italic-code') },
          'content',
          syncCtx,
        )}
        ${renderFieldHint(
          t('card-editor.markdown-editor.markdown-with-home-assistant-templates-e', {
            example: "{{ states('sensor.temperature') }}",
            entity: '{{ states(entity) }}',
          }),
        )}
        ${renderEntitySourceField(t('card-editor.markdown-editor.entity-for-templates'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('card-editor.markdown-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
      </div>
    `;
  },
};
