import { html, nothing, svg, TemplateResult } from 'lit';
import { CardModule, HomeAssistant, GraphsModuleConfig, HassEntity } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { currentRenderContext } from '../../services/render-context';
import { entityDisplayName, entityNumber, formatEntityValue } from '../../utils/entity-value';
import { downsample, getHistory, type HistorySample } from '../../services/history-cache';
import { t } from '../i18n';
import { t as cardT } from '../../card/i18n';

/* Chunk-only (magic-card-modules-extra.js): no effects at evaluation. */

const SVG_W = 200;
const SVG_H = 60;
const PAD = 4;

export class GraphsView implements ModuleView {
  /** The samples to draw (fetched history + the current value), or why there are none. */
  private _series(c: GraphsModuleConfig, hass: HomeAssistant | undefined, hours: number):
    | { status: 'ok'; points: HistorySample[]; start: number; end: number }
    | { status: 'none' | 'loading' | 'error' | 'empty' } {
    if (!c.entity) return { status: 'none' };
    if (!hass) return { status: 'loading' };
    const attribute = c.attribute || undefined;
    // The card rendering this graph paints again once the history arrives.
    const cached = getHistory(hass, c.entity, hours, attribute, currentRenderContext()?.requestUpdate);
    if (!cached) return { status: 'loading' };
    // a failed refetch keeps the samples fetched before: those are still drawn
    if (cached.error && !cached.samples.length) return { status: 'error' };

    const end = Date.now();
    const start = end - hours * 3600_000;
    const samples = cached.samples.map((s) => ({ t: Math.max(s.t, start), v: s.v })).filter((s) => s.t <= end);
    const current = entityNumber(hass.states[c.entity], attribute);
    if (current !== undefined) samples.push({ t: end, v: current });
    const pph = Number(c.points_per_hour);
    const points = pph > 0 ? downsample(samples, start, end, pph) : samples;
    // A single bucket / sample still spans the window: the value did not change.
    if (points.length === 1 && samples.length > 1) points.push({ t: end, v: points[0].v });
    return points.length > 1 ? { status: 'ok', points, start, end } : { status: 'empty' };
  }

  private _coords(points: HistorySample[], start: number, end: number): Array<{ x: number; y: number }> {
    // A loop, not Math.min(...values): spreading a long raw history overflows the call stack.
    let min = Infinity;
    let max = -Infinity;
    for (const p of points) {
      if (p.v < min) min = p.v;
      if (p.v > max) max = p.v;
    }
    const range = max - min;
    const span = end - start || 1;
    const graphH = SVG_H - PAD * 2;
    return points.map((p) => ({
      x: ((p.t - start) / span) * SVG_W,
      y: range ? PAD + graphH - ((p.v - min) / range) * graphH : SVG_H / 2,
    }));
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as GraphsModuleConfig;
    const color = c.line_color || 'var(--mc-primary)';
    const fillColor = c.fill_color || 'var(--mc-primary)';
    const hours = Number(c.hours_to_show) > 0 ? Number(c.hours_to_show) : 24;
    const series = this._series(c, hass, hours);
    const entity: HassEntity | undefined = c.entity ? hass?.states[c.entity] : undefined;

    let body: TemplateResult;
    if (series.status === 'ok') {
      const pts = this._coords(series.points, series.start, series.end);
      const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      const first = pts[0];
      const last = pts[pts.length - 1];
      const area = `${line} L${last.x.toFixed(1)},${SVG_H} L${first.x.toFixed(1)},${SVG_H} Z`;
      body = html`<svg viewBox="0 0 ${SVG_W} ${SVG_H}" preserveAspectRatio="none" style="height: 60px" role="img"
        aria-label=${t('{name}: last {hours, plural, one {# hour} other {# hours}}', { name: entity ? entityDisplayName(hass, entity) : (c.entity ?? ''), hours })}>
        ${c.fill !== false ? svg`<path class="mc-graphs-fill" d=${area} fill=${fillColor} opacity="0.15" />` : nothing}
        <path class="mc-graphs-line" d=${line} fill="none" stroke=${color} stroke-width=${c.line_width || 2}
          vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        ${c.show_points ? pts.map((p) => svg`<circle cx=${p.x} cy=${p.y} r="3" fill=${color} />`) : nothing}
      </svg>`;
    } else {
      const text = {
        none: cardT('No entity'),
        loading: t('Loading history…'),
        error: t('History unavailable'),
        empty: t('No numeric history'),
      }[series.status];
      body = html`<div class="mc-graphs-empty" data-status=${series.status} style="height: 60px">${text}</div>`;
    }

    let value = '';
    if (entity) value = formatEntityValue(hass, entity, c.attribute || undefined).text;
    return html`
      <div class="mc-module mc-graphs">
        ${body}
        ${c.show_labels !== false
          ? html`<div class="mc-graphs-label">
              <span class="mc-graphs-name">${entity ? entityDisplayName(hass, entity) : c.entity || cardT('No entity')}${c.attribute ? ` · ${(entity && hass?.formatEntityAttributeName?.(entity, c.attribute)) || c.attribute}` : ''}</span>
              <span class="mc-graphs-meta">${value ? `${value} · ` : ''}${hours}h</span>
            </div>`
          : nothing}
      </div>
    `;
  }
}
