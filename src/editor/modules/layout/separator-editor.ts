import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SeparatorModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField, renderColorField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t, tc } from '../../i18n';

export const separatorEditor: ModuleEditor = {
  type: 'separator',
  tabs: ['general', 'conditions', 'design'],
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SeparatorModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField(t('Direction'), c.direction, [
          { label: t('Horizontal'), value: 'horizontal' },
          { label: t('Vertical'), value: 'vertical' },
        ], (v) => onChange({ ...c, direction: v as 'horizontal' | 'vertical' }), 'direction', syncCtx)}
        ${renderSelectField(t('Style'), c.separator_style, [
          { label: tc('line', 'Solid'), value: 'solid' },
          { label: t('Dashed'), value: 'dashed' },
          { label: t('Dotted'), value: 'dotted' },
          { label: t('None'), value: 'none' },
        ], (v) => onChange({ ...c, separator_style: v as SeparatorModuleConfig['separator_style'] }), 'separator_style', syncCtx)}
        ${renderColorField(t('Colour'), c.separator_color, (v) => onChange({ ...c, separator_color: v }), 'separator_color', syncCtx)}
        ${renderUnitField(t('Width'), c.separator_width, (v) => onChange({ ...c, separator_width: v || undefined }), 'separator_width', syncCtx, '1')}
      </div>
    `;
  },
};
