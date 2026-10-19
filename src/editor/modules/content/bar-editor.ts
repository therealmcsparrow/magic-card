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
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${renderNumberField(t('Min'), c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField(t('Max'), c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderUnitField(t('Bar height'), c.bar_height, (v) => onChange({ ...c, bar_height: v || undefined }), 'bar_height', syncCtx, '8')}
        ${renderColorField(t('Bar colour'), c.bar_color, (v) => onChange({ ...c, bar_color: v }), 'bar_color', syncCtx)}
        ${renderColorField(t('Bar background'), c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }), 'bar_background', syncCtx)}
        ${renderColorRangesField(t('Colour ranges'), c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: t('The bar takes the colour of the highest range at or below the value; the bar colour applies below the first range.'),
        })}
        ${renderToggleField(t('Show value'), c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${c.show_value !== false
          ? renderNumberField(t('Decimals'), c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }), { min: 0, max: 6, optional: true, placeholder: t('Automatic') }, 'decimals', syncCtx)
          : nothing}
        ${renderSelectField(
          t('Direction'),
          c.direction,
          [
            { label: t('Horizontal'), value: 'horizontal' },
            { label: t('Vertical'), value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as BarModuleConfig['direction'] }), 'direction', syncCtx)}
      </div>
    `;
  },
};
