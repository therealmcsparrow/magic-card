import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { VerticalModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const verticalEditor: ModuleEditor = {
  type: 'vertical',
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as VerticalModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderUnitField(t('card-editor.vertical-editor.gap'), c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField(t('card-editor.vertical-editor.align'), c.align, [
          { label: t('card-editor.vertical-editor.start'), value: 'start' },
          { label: t('card-editor.vertical-editor.centre'), value: 'center' },
          { label: t('card-editor.vertical-editor.end'), value: 'end' },
          { label: t('card-editor.vertical-editor.stretch'), value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as VerticalModuleConfig['align'] }), 'align', syncCtx)}
      </div>
    `;
  },
};
