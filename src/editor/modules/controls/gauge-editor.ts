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
import { t } from '../../i18n';

export const gaugeEditor: ModuleEditor = {
  type: 'gauge',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as GaugeModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField(t('Entity'), c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField(t('Min'), c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField(t('Max'), c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderSelectField(
          t('Gauge style'),
          c.gauge_style,
          [
            { label: t('Half (semicircle)'), value: 'half' },
            { label: t('Full (circle)'), value: 'full' },
            { label: t('Quarter'), value: 'quarter' },
          ],
          (v) => onChange({ ...c, gauge_style: v as GaugeModuleConfig['gauge_style'] }),
          'gauge_style',
          syncCtx,
        )}
        ${renderToggleField(t('Show needle'), c.needle !== false, (v) => onChange({ ...c, needle: v }), 'needle', syncCtx)}
        ${renderToggleField(t('Show name'), c.show_name !== false, (v) => onChange({ ...c, show_name: v }), 'show_name', syncCtx)}
        ${renderToggleField(t('Show unit'), c.show_unit !== false, (v) => onChange({ ...c, show_unit: v }), 'show_unit', syncCtx)}
        ${renderNumberField(t('Decimals'), c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }),
          { min: 0, max: 6, optional: true, placeholder: t('Automatic') }, 'decimals', syncCtx)}
        ${renderColorRangesField(t('Colour ranges'), c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: t('The arc takes the colour of the highest range at or below the value.'),
        })}
      </div>
    `;
  },
};
