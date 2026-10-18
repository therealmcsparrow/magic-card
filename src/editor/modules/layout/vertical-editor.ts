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
        ${renderUnitField(t('Gap'), c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField(t('Align'), c.align, [
          { label: t('Start'), value: 'start' },
          { label: t('Centre'), value: 'center' },
          { label: t('End'), value: 'end' },
          { label: t('Stretch'), value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as VerticalModuleConfig['align'] }), 'align', syncCtx)}
      </div>
    `;
  },
};
