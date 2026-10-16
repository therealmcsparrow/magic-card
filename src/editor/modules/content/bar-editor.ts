import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { BarModuleConfig } from '../../../types';
import {
  renderUnitField,
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../../utils/form-utils';
import { renderColorRangesField } from '../../components/color-ranges-field';
import { buildSyncContext } from '../base-editor';

export const barEditor: ModuleEditor = {
  type: 'bar',
  general(config, hass, onChange, template) {
    const c = config as BarModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderUnitField('Bar height', c.bar_height, (v) => onChange({ ...c, bar_height: v || undefined }), 'bar_height', syncCtx, '8')}
        ${renderColorField('Bar color', c.bar_color, (v) => onChange({ ...c, bar_color: v }), 'bar_color', syncCtx)}
        ${renderColorField('Bar background', c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }), 'bar_background', syncCtx)}
        ${renderColorRangesField('Color ranges', c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: 'The bar takes the color of the highest range at or below the value; the bar color applies below the first range.',
        })}
        ${renderToggleField('Show value', c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${c.show_value !== false
          ? renderNumberField('Decimals', c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }), { min: 0, max: 6, optional: true, placeholder: 'Automatic' }, 'decimals', syncCtx)
          : nothing}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as BarModuleConfig['direction'] }), 'direction', syncCtx)}
      </div>
    `;
  },
};
