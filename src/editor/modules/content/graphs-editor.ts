import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { GraphsModuleConfig } from '../../../types';
import { renderNumberField, renderToggleField, renderAttributeField, renderColorField, renderFieldHint } from '../../../utils/form-utils';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

export const graphsEditor: ModuleEditor = {
  type: 'graphs',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as GraphsModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.graphs-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('card-editor.graphs-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${renderNumberField(t('card-editor.graphs-editor.hours-to-show'), c.hours_to_show, (v) => onChange({ ...c, hours_to_show: v }), { min: 1, max: 168 }, 'hours_to_show', syncCtx)}
        ${c.attribute && Number(c.hours_to_show) > 48
          ? renderFieldHint(t('card-editor.graphs-editor.an-attribute-graph-loads-every-recorded'))
          : nothing}
        ${renderNumberField(t('card-editor.graphs-editor.points-per-hour'), c.points_per_hour, (v) => onChange({ ...c, points_per_hour: Number.isFinite(v) && v > 0 ? v : undefined }),
          { min: 0.1, max: 60, step: 0.1, optional: true, placeholder: t('card-editor.graphs-editor.every-change') }, 'points_per_hour', syncCtx)}
        ${renderFieldHint(t('card-editor.graphs-editor.values-are-averaged-per-period-2-every'))}
        ${renderColorField(t('card-editor.graphs-editor.line-colour'), c.line_color, (v) => onChange({ ...c, line_color: v }), 'line_color', syncCtx)}
        ${renderNumberField(t('card-editor.graphs-editor.line-width'), c.line_width, (v) => onChange({ ...c, line_width: v }), { min: 1, max: 10 }, 'line_width', syncCtx)}
        ${renderToggleField(t('card-editor.graphs-editor.fill'), c.fill !== false, (v) => onChange({ ...c, fill: v }), 'fill', syncCtx)}
        ${c.fill !== false ? renderColorField(t('card-editor.graphs-editor.fill-colour'), c.fill_color, (v) => onChange({ ...c, fill_color: v }), 'fill_color', syncCtx) : nothing}
        ${renderToggleField(t('card-editor.graphs-editor.show-points'), c.show_points, (v) => onChange({ ...c, show_points: v }), 'show_points', syncCtx)}
        ${renderToggleField(t('card-editor.graphs-editor.show-labels'), c.show_labels !== false, (v) => onChange({ ...c, show_labels: v }), 'show_labels', syncCtx,
          t('card-editor.graphs-editor.name-current-value-and-time-span-under'))}
      </div>
    `;
  },
};
