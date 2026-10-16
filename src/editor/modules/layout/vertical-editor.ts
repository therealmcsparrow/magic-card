import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { VerticalModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

export const verticalEditor: ModuleEditor = {
  type: 'vertical',
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as VerticalModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderUnitField('Gap', c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as VerticalModuleConfig['align'] }), 'align', syncCtx)}
      </div>
    `;
  },
};
