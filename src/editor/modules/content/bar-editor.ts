import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { BarModuleConfig } from '../../../types';
import {
  renderUnitField,
  renderToggleField,
    renderAttributeField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../../utils/form-utils';
import { renderColorRangesField } from '../../components/color-ranges-field';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const barEditor: ModuleEditor = {
  type: 'bar',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as BarModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.bar-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('card-editor.bar-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${renderNumberField(t('card-editor.bar-editor.min'), c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField(t('card-editor.bar-editor.max'), c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderUnitField(t('card-editor.bar-editor.bar-height'), c.bar_height, (v) => onChange({ ...c, bar_height: v || undefined }), 'bar_height', syncCtx, '8')}
        ${renderColorField(t('card-editor.bar-editor.bar-colour'), c.bar_color, (v) => onChange({ ...c, bar_color: v }), 'bar_color', syncCtx)}
        ${renderColorField(t('card-editor.bar-editor.bar-background'), c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }), 'bar_background', syncCtx)}
        ${renderColorRangesField(t('card-editor.bar-editor.colour-ranges'), c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: t('card-editor.bar-editor.the-bar-takes-the-colour-of-the-highest'),
        })}
        ${renderToggleField(t('card-editor.bar-editor.show-value'), c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${c.show_value !== false
          ? renderNumberField(t('card-editor.bar-editor.decimals'), c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }), { min: 0, max: 6, optional: true, placeholder: t('card-editor.bar-editor.automatic') }, 'decimals', syncCtx)
          : nothing}
        ${renderSelectField(
          t('card-editor.bar-editor.direction'),
          c.direction,
          [
            { label: t('card-editor.bar-editor.horizontal'), value: 'horizontal' },
            { label: t('card-editor.bar-editor.vertical'), value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as BarModuleConfig['direction'] }), 'direction', syncCtx)}
      </div>
    `;
  },
};
