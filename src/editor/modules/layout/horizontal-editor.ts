import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { HorizontalModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const horizontalEditor: ModuleEditor = {
  type: 'horizontal',
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as HorizontalModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderUnitField(t('Gap'), c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField(t('Align'), c.align, [
          { label: t('Start'), value: 'start' },
          { label: t('Centre'), value: 'center' },
          { label: t('End'), value: 'end' },
          { label: t('Stretch'), value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as HorizontalModuleConfig['align'] }), 'align', syncCtx)}
        ${renderSelectField(t('Justify'), c.justify, [
          { label: t('Start'), value: 'start' },
          { label: t('Centre'), value: 'center' },
          { label: t('End'), value: 'end' },
          { label: t('Space between'), value: 'space-between' },
          { label: t('Space around'), value: 'space-around' },
        ], (v) => onChange({ ...c, justify: v as HorizontalModuleConfig['justify'] }), 'justify', syncCtx)}
      </div>
    `;
  },
};
