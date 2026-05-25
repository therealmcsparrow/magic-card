import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, GraphsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderNumberField, renderToggleField, renderEntityField, renderAttributeField, renderTextField, renderColorField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

interface CachedHistory {
  points: number[];
  timestamp: number;
  entityId: string;
  hours: number;
}

/** Cache history data to avoid refetching on every render. Key: moduleId */
const _historyCache = new Map<string, CachedHistory>();
/** Track in-flight fetches to avoid duplicate requests. Key: moduleId */
const _pendingFetches = new Set<string>();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class GraphsModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'graphs',
    name: 'Graph',
    description: 'Display entity history as a line graph',
    category: 'content',
    icon: 'mdi:chart-line',
  };

  createDefault(): GraphsModuleConfig {
    return {
      id: generateId('graphs'),
      type: 'graphs',
      hours_to_show: 24,
      points_per_hour: 2,
      line_width: 2,
      fill: true,
      show_points: false,
      show_labels: true,
    };
  }

  private _fetchHistory(
    hass: HomeAssistant,
    moduleId: string,
    entityId: string,
    hours: number,
    attribute?: string,
  ): void {
    if (_pendingFetches.has(moduleId)) return;
    _pendingFetches.add(moduleId);

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hours * 3600000);

    hass
      .callWS<Record<string, Array<{ s: string; a: Record<string, unknown>; lu: number }>>>({
        type: 'history/history_during_period',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        significant_changes_only: true,
      })
      .then((result) => {
        const states = result[entityId] || [];
        const points = states
          .map((s) => {
            const val = attribute ? Number(s.a?.[attribute]) : Number(s.s);
            return isNaN(val) ? null : val;
          })
          .filter((v): v is number => v !== null);

        _historyCache.set(moduleId, {
          points,
          timestamp: Date.now(),
          entityId,
          hours,
        });
      })
      .catch((err) => {
        console.warn('magic-card: failed to fetch history for', entityId, err);
      })
      .finally(() => {
        _pendingFetches.delete(moduleId);
      });
  }

  private _buildPath(points: number[], width: number, height: number): string {
    if (points.length === 0) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const padding = 4;
    const graphH = height - padding * 2;

    return points
      .map((v, i) => {
        const x = points.length === 1 ? width / 2 : (i / (points.length - 1)) * width;
        const y = padding + graphH - ((v - min) / range) * graphH;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as GraphsModuleConfig;
    const color = c.line_color || 'var(--mc-primary)';
    const fillColor = c.fill_color || 'var(--mc-primary)';
    const hours = c.hours_to_show || 24;
    const svgW = 200;
    const svgH = 60;

    // Try to get cached history data
    let points: number[] | null = null;
    if (c.entity && hass) {
      const cached = _historyCache.get(c.id);
      const isStale =
        !cached ||
        cached.entityId !== c.entity ||
        cached.hours !== hours ||
        Date.now() - cached.timestamp > CACHE_TTL_MS;

      if (isStale) {
        this._fetchHistory(hass, c.id, c.entity, hours, c.attribute);
      }
      if (cached && cached.entityId === c.entity) {
        points = cached.points;
      }
    }

    // Render real data or placeholder
    const hasData = points !== null && points.length > 1;
    const dataPoints = hasData ? points : null;
    const linePath = dataPoints ? this._buildPath(dataPoints, svgW, svgH) : 'M0,50 Q30,30 60,35 T120,20 T200,30';
    const fillPath = dataPoints
      ? `${this._buildPath(dataPoints, svgW, svgH)} L${svgW},${svgH} L0,${svgH} Z`
      : 'M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z';

    // Build point circles from real data
    const pointCircles = dataPoints && c.show_points
      ? dataPoints.map((v, i) => {
          const min = Math.min(...dataPoints);
          const max = Math.max(...dataPoints);
          const range = max - min || 1;
          const x = dataPoints.length === 1 ? svgW / 2 : (i / (dataPoints.length - 1)) * svgW;
          const y = 4 + (svgH - 8) - ((v - min) / range) * (svgH - 8);
          return { x, y };
        })
      : [];

    return html`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="none" style="height: 60px">
          ${c.fill
            ? html`<path d="${fillPath}" fill="${fillColor}" opacity="0.15" />`
            : ''}
          <path d="${linePath}"
            fill="none" stroke="${color}" stroke-width="${c.line_width || 2}" />
          ${c.show_points && !hasData
            ? html`
                <circle cx="0" cy="50" r="3" fill="${color}" />
                <circle cx="60" cy="35" r="3" fill="${color}" />
                <circle cx="120" cy="20" r="3" fill="${color}" />
                <circle cx="200" cy="30" r="3" fill="${color}" />
              `
            : ''}
          ${pointCircles.map(
            (p) => html`<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}" />`
          )}
        </svg>
        ${c.show_labels
          ? html`<div class="mc-graphs-label">
              ${c.entity || 'No entity'} &mdash; ${hours}h
              ${!c.entity ? '' : !hasData ? html` <span style="opacity:0.5">(loading...)</span>` : ''}
            </div>`
          : ''}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as GraphsModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField('Hours to Show', c.hours_to_show, (v) => onChange({ ...c, hours_to_show: v }), { min: 1, max: 168 }, 'hours_to_show', syncCtx)}
        ${renderNumberField('Points per Hour', c.points_per_hour, (v) => onChange({ ...c, points_per_hour: v }), { min: 1, max: 60 }, 'points_per_hour', syncCtx)}
        ${renderColorField('Line Color', c.line_color, (v) => onChange({ ...c, line_color: v }), 'line_color', syncCtx)}
        ${renderNumberField('Line Width', c.line_width, (v) => onChange({ ...c, line_width: v }), { min: 1, max: 10 }, 'line_width', syncCtx)}
        ${renderToggleField('Fill', c.fill, (v) => onChange({ ...c, fill: v }), 'fill', syncCtx)}
        ${renderColorField('Fill Color', c.fill_color, (v) => onChange({ ...c, fill_color: v }), 'fill_color', syncCtx)}
        ${renderToggleField('Show Points', c.show_points, (v) => onChange({ ...c, show_points: v }), 'show_points', syncCtx)}
        ${renderToggleField('Show Labels', c.show_labels, (v) => onChange({ ...c, show_labels: v }), 'show_labels', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new GraphsModule());
