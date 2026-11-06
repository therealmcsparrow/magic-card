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
        ${renderUnitField(t('card-editor.horizontal-editor.gap'), c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField(t('card-editor.horizontal-editor.align'), c.align, [
          { label: t('card-editor.horizontal-editor.start'), value: 'start' },
          { label: t('card-editor.horizontal-editor.centre'), value: 'center' },
          { label: t('card-editor.horizontal-editor.end'), value: 'end' },
          { label: t('card-editor.horizontal-editor.stretch'), value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as HorizontalModuleConfig['align'] }), 'align', syncCtx)}
        ${renderSelectField(t('card-editor.horizontal-editor.justify'), c.justify, [
          { label: t('card-editor.horizontal-editor.start'), value: 'start' },
          { label: t('card-editor.horizontal-editor.centre'), value: 'center' },
          { label: t('card-editor.horizontal-editor.end'), value: 'end' },
          { label: t('card-editor.horizontal-editor.space-between'), value: 'space-between' },
          { label: t('card-editor.horizontal-editor.space-around'), value: 'space-around' },
        ], (v) => onChange({ ...c, justify: v as HorizontalModuleConfig['justify'] }), 'justify', syncCtx)}
      </div>
    `;
  },
};
