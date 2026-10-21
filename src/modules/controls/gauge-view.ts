import { html, nothing, svg, TemplateResult } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HomeAssistant, GaugeModuleConfig } from '../../types';
import { entityDisplayName, entityNumber, formatEntityValue } from '../../utils/entity-value';
import { rangeColor } from '../../utils/color-ranges';
import { t } from '../../card/i18n';

export class GaugeView implements ModuleView {
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as GaugeModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = Number.isFinite(Number(c.min)) ? Number(c.min) : 0;
    const max = Number.isFinite(Number(c.max)) ? Number(c.max) : 100;
    const attribute = c.attribute || undefined;

    // No entity yet: a preview at the midpoint. An entity without a number (unavailable, "on", a
    // missing attribute): an empty arc with the entity's state as text.
    let num: number | undefined;
    let valueText: string;
    let unit = '';
    if (!c.entity) {
      num = Math.round((min + max) / 2);
      valueText = String(num);
    } else if (!entity) {
      num = undefined;
      valueText = '—';
    } else {
      num = entityNumber(entity, attribute);
      if (num === undefined && attribute && entity.attributes[attribute] === undefined) {
        valueText = hass!.formatEntityState?.(entity, 'unavailable') || t('Unavailable');
      } else {
        const v = formatEntityValue(hass, entity, attribute, { decimals: c.decimals });
        valueText = num === undefined ? v.text : v.value;
        unit = num === undefined || c.show_unit === false ? '' : v.unit;
      }
    }
    const unavailable = num === undefined;
    const value = unavailable ? min : Math.max(min, Math.min(max, num!));
    const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
    // Ranges see the clamped value, so a value past max (or below min) keeps the edge range's colour.
    const color = rangeColor(unavailable ? undefined : value, c.severity) || 'var(--primary-color, #03a9f4)';
    const name = c.show_name === false ? '' : entity ? entityDisplayName(hass, entity) : c.entity || '';
    const label = `${name ? `${name}: ` : ''}${valueText}${unit ? ` ${unit}` : ''}`;
    const text = (x: number, y: number, size: number, anchor = 'middle') => svg`
      <text class="mc-gauge-text" data-mc-part="state" x=${x} y=${y} text-anchor=${anchor} font-size=${unavailable ? Math.min(size, 10) : size} font-weight="600" fill="currentColor">
        ${valueText}${unit ? svg`<tspan class="mc-gauge-unit" font-size=${Math.round(size * 0.55)} font-weight="400" dx="1">${unit}</tspan>` : nothing}
      </text>`;
    const needle = (cx: number, cy: number, x: number, y: number) =>
      c.needle !== false && !unavailable
        ? svg`<line x1=${cx} y1=${cy} x2=${x} y2=${y} stroke=${color} stroke-width="2" stroke-linecap="round" />
            <circle cx=${cx} cy=${cy} r="3" fill=${color} />`
        : nothing;
    const wrap = (style: string, body: TemplateResult) => html`
      <div
        class="mc-module mc-gauge mc-gauge--${style}${unavailable && c.entity ? ' mc-gauge--unavailable' : ''}"
        style="text-align: center;"
        role="meter"
        aria-valuemin=${min}
        aria-valuemax=${max}
        aria-valuenow=${unavailable ? nothing : value}
        aria-valuetext=${label}
      >
        ${body}
        ${name ? html`<div class="mc-gauge-name" data-mc-part="name">${name}</div>` : nothing}
      </div>
    `;

    if (c.gauge_style === 'full') {
      const angle = Math.min((pct / 100) * 360, 359.99);
      const rad = (angle - 90) * (Math.PI / 180);
      const endX = 50 + 40 * Math.cos(rad);
      const endY = 50 + 40 * Math.sin(rad);
      const largeArc = angle > 180 ? 1 : 0;
      return wrap('full', html`
        <svg data-mc-flow-end viewBox="0 0 100 100" width="120" height="120">
          <circle data-mc-part="background" cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${pct > 0
            ? svg`<path d="M 50 10 A 40 40 0 ${largeArc} 1 ${endX} ${endY}" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" />`
            : nothing}
          ${needle(50, 50, 50 + 30 * Math.cos(rad), 50 + 30 * Math.sin(rad))}
          ${text(50, c.needle !== false && !unavailable ? 74 : 54, 16)}
        </svg>
      `);
    }

    if (c.gauge_style === 'quarter') {
      const angle = (pct / 100) * 90;
      const startRad = -90 * (Math.PI / 180);
      const endRad = (-90 + angle) * (Math.PI / 180);
      const r = 44;
      const cx = 10;
      const cy = 90;
      const startX = cx + r * Math.cos(startRad);
      const startY = cy + r * Math.sin(startRad);
      const endX = cx + r * Math.cos(endRad);
      const endY = cy + r * Math.sin(endRad);
      return wrap('quarter', html`
        <svg data-mc-flow-end viewBox="0 0 100 100" width="120" height="120">
          <path data-mc-part="background" d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${pct > 0
            ? svg`<path d="M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" />`
            : nothing}
          ${needle(cx, cy, cx + 34 * Math.cos(endRad), cy + 34 * Math.sin(endRad))}
          ${text(c.needle !== false && !unavailable ? 60 : 20, c.needle !== false && !unavailable ? 40 : 80, 18, 'start')}
        </svg>
      `);
    }

    // Default: half gauge (semicircle). With a needle the value sits under the pivot, between min and max.
    const withNeedle = c.needle !== false && !unavailable;
    const angle = (pct / 100) * 180;
    const rad = (180 + angle) * (Math.PI / 180);
    const endX = 50 + 40 * Math.cos(rad);
    const endY = 55 + 40 * Math.sin(rad);
    return wrap('half', html`
      <svg data-mc-flow-end viewBox="0 0 100 ${withNeedle ? 76 : 70}" width="140" height=${withNeedle ? 109 : 100}>
        <path data-mc-part="background" d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" stroke-linecap="round" />
        ${pct > 0
          ? svg`<path d="M 10 55 A 40 40 0 0 1 ${endX} ${endY}" fill="none" stroke=${color} stroke-width="8" stroke-linecap="round" />`
          : nothing}
        ${needle(50, 55, endX, endY)}
        ${text(50, withNeedle ? 75 : 50, 14)}
        <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${min}</text>
        <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${max}</text>
      </svg>
    `);
  }

}
