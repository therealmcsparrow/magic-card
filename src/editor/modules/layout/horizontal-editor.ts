import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { HorizontalModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

export const horizontalEditor: ModuleEditor = {
  type: 'horizontal',
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as HorizontalModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderUnitField('Gap', c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as HorizontalModuleConfig['align'] }), 'align', syncCtx)}
        ${renderSelectField('Justify', c.justify, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Space between', value: 'space-between' },
          { label: 'Space around', value: 'space-around' },
        ], (v) => onChange({ ...c, justify: v as HorizontalModuleConfig['justify'] }), 'justify', syncCtx)}
      </div>
    `;
  },
};
