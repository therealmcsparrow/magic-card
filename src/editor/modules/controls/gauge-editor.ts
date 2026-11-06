import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { GaugeModuleConfig } from '../../../types';
import {
  renderToggleField,
    renderAttributeField,
  renderSelectField,
  renderNumberField,
} from '../../../utils/form-utils';
import { renderColorRangesField } from '../../components/color-ranges-field';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const gaugeEditor: ModuleEditor = {
  type: 'gauge',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as GaugeModuleConfig;
    const eid = entityFor(c, scope);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.gauge-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('card-editor.gauge-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${renderNumberField(t('card-editor.gauge-editor.min'), c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField(t('card-editor.gauge-editor.max'), c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderSelectField(
          t('card-editor.gauge-editor.gauge-style'),
          c.gauge_style,
          [
            { label: t('card-editor.gauge-editor.half-semicircle'), value: 'half' },
            { label: t('card-editor.gauge-editor.full-circle'), value: 'full' },
            { label: t('card-editor.gauge-editor.quarter'), value: 'quarter' },
          ],
          (v) => onChange({ ...c, gauge_style: v as GaugeModuleConfig['gauge_style'] }),
          'gauge_style',
          syncCtx,
        )}
        ${renderToggleField(t('card-editor.gauge-editor.show-needle'), c.needle !== false, (v) => onChange({ ...c, needle: v }), 'needle', syncCtx)}
        ${renderToggleField(t('card-editor.gauge-editor.show-name'), c.show_name !== false, (v) => onChange({ ...c, show_name: v }), 'show_name', syncCtx)}
        ${renderToggleField(t('card-editor.gauge-editor.show-unit'), c.show_unit !== false, (v) => onChange({ ...c, show_unit: v }), 'show_unit', syncCtx)}
        ${renderNumberField(t('card-editor.gauge-editor.decimals'), c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }),
          { min: 0, max: 6, optional: true, placeholder: t('card-editor.gauge-editor.automatic') }, 'decimals', syncCtx)}
        ${renderColorRangesField(t('card-editor.gauge-editor.colour-ranges'), c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: t('card-editor.gauge-editor.the-arc-takes-the-colour-of-the-highest'),
        })}
      </div>
    `;
  },
};
