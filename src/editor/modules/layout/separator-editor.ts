import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SeparatorModuleConfig } from '../../../types';
import { renderUnitField, renderSelectField, renderColorField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const separatorEditor: ModuleEditor = {
  type: 'separator',
  tabs: ['general', 'conditions', 'design'],
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SeparatorModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField(t('card-editor.separator-editor.direction'), c.direction, [
          { label: t('card-editor.separator-editor.horizontal'), value: 'horizontal' },
          { label: t('card-editor.separator-editor.vertical'), value: 'vertical' },
        ], (v) => onChange({ ...c, direction: v as 'horizontal' | 'vertical' }), 'direction', syncCtx)}
        ${renderSelectField(t('card-editor.separator-editor.style'), c.separator_style, [
          { label: t('card-editor.separator-editor.solid'), value: 'solid' },
          { label: t('card-editor.separator-editor.dashed'), value: 'dashed' },
          { label: t('card-editor.separator-editor.dotted'), value: 'dotted' },
          { label: t('card-editor.separator-editor.none'), value: 'none' },
        ], (v) => onChange({ ...c, separator_style: v as SeparatorModuleConfig['separator_style'] }), 'separator_style', syncCtx)}
        ${renderColorField(t('card-editor.separator-editor.colour'), c.separator_color, (v) => onChange({ ...c, separator_color: v }), 'separator_color', syncCtx)}
        ${renderUnitField(t('card-editor.separator-editor.width'), c.separator_width, (v) => onChange({ ...c, separator_width: v || undefined }), 'separator_width', syncCtx, '1')}
      </div>
    `;
  },
};
