import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { GraphsModuleConfig } from '../../../types';
import { renderNumberField, renderToggleField, renderEntityField, renderAttributeField, renderColorField, renderFieldHint } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const graphsEditor: ModuleEditor = {
  type: 'graphs',
  general(config, hass, onChange, template) {
    const c = config as GraphsModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField(t('Entity'), c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField(t('Hours to show'), c.hours_to_show, (v) => onChange({ ...c, hours_to_show: v }), { min: 1, max: 168 }, 'hours_to_show', syncCtx)}
        ${c.attribute && Number(c.hours_to_show) > 48
          ? renderFieldHint(t('An attribute graph loads every recorded state with all its attributes; long periods can load slowly.'))
          : nothing}
        ${renderNumberField(t('Points per hour'), c.points_per_hour, (v) => onChange({ ...c, points_per_hour: Number.isFinite(v) && v > 0 ? v : undefined }),
          { min: 0.1, max: 60, step: 0.1, optional: true, placeholder: t('Every change') }, 'points_per_hour', syncCtx)}
        ${renderFieldHint(t('Values are averaged per period (2 = every 30 minutes). Empty draws every recorded change.'))}
        ${renderColorField(t('Line colour'), c.line_color, (v) => onChange({ ...c, line_color: v }), 'line_color', syncCtx)}
        ${renderNumberField(t('Line width'), c.line_width, (v) => onChange({ ...c, line_width: v }), { min: 1, max: 10 }, 'line_width', syncCtx)}
        ${renderToggleField(t('Fill'), c.fill !== false, (v) => onChange({ ...c, fill: v }), 'fill', syncCtx)}
        ${c.fill !== false ? renderColorField(t('Fill colour'), c.fill_color, (v) => onChange({ ...c, fill_color: v }), 'fill_color', syncCtx) : nothing}
        ${renderToggleField(t('Show points'), c.show_points, (v) => onChange({ ...c, show_points: v }), 'show_points', syncCtx)}
        ${renderToggleField(t('Show labels'), c.show_labels !== false, (v) => onChange({ ...c, show_labels: v }), 'show_labels', syncCtx,
          t('Name, current value and time span under the graph.'))}
      </div>
    `;
  },
};
