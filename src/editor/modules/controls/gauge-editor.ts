import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { GaugeModuleConfig } from '../../../types';
import {
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderSelectField,
  renderNumberField,
} from '../../../utils/form-utils';
import { renderColorRangesField } from '../../components/color-ranges-field';
import { buildSyncContext } from '../base-editor';

export const gaugeEditor: ModuleEditor = {
  type: 'gauge',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as GaugeModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderSelectField(
          'Gauge style',
          c.gauge_style,
          [
            { label: 'Half (semicircle)', value: 'half' },
            { label: 'Full (circle)', value: 'full' },
            { label: 'Quarter', value: 'quarter' },
          ],
          (v) => onChange({ ...c, gauge_style: v as GaugeModuleConfig['gauge_style'] }),
          'gauge_style',
          syncCtx,
        )}
        ${renderToggleField('Show needle', c.needle !== false, (v) => onChange({ ...c, needle: v }), 'needle', syncCtx)}
        ${renderToggleField('Show name', c.show_name !== false, (v) => onChange({ ...c, show_name: v }), 'show_name', syncCtx)}
        ${renderToggleField('Show unit', c.show_unit !== false, (v) => onChange({ ...c, show_unit: v }), 'show_unit', syncCtx)}
        ${renderNumberField('Decimals', c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }),
          { min: 0, max: 6, optional: true, placeholder: 'Automatic' }, 'decimals', syncCtx)}
        ${renderColorRangesField('Color ranges', c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: 'The arc takes the color of the highest range at or below the value.',
        })}
      </div>
    `;
  },
};
