import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SeparatorModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField, renderColorField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

export const separatorEditor: ModuleEditor = {
  type: 'separator',
  tabs: ['general', 'conditions', 'design'],
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SeparatorModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Direction', c.direction, [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ], (v) => onChange({ ...c, direction: v as 'horizontal' | 'vertical' }), 'direction', syncCtx)}
        ${renderSelectField('Style', c.separator_style, [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'None', value: 'none' },
        ], (v) => onChange({ ...c, separator_style: v as SeparatorModuleConfig['separator_style'] }), 'separator_style', syncCtx)}
        ${renderColorField('Color', c.separator_color, (v) => onChange({ ...c, separator_color: v }), 'separator_color', syncCtx)}
        ${renderUnitField('Width', c.separator_width, (v) => onChange({ ...c, separator_width: v || undefined }), 'separator_width', syncCtx, '1')}
      </div>
    `;
  },
};
