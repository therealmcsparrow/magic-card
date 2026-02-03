import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, GaugeModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderNumberField,
} from '../../utils/form-utils';

class GaugeModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'gauge',
    name: 'Gauge',
    description: 'Arc gauge for displaying numeric sensor values',
    category: 'controls',
    icon: 'mdi:gauge',
  };

  createDefault(): GaugeModuleConfig {
    return {
      id: generateId('gauge'),
      type: 'gauge',
      min: 0,
      max: 100,
      needle: true,
      gauge_style: 'half',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as GaugeModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const rawValue = entity ? Number(entity.state) : Math.round((min + max) / 2);
    const value = Math.max(min, Math.min(max, rawValue));
    const pct = ((value - min) / (max - min)) * 100;

    const color = this._getSeverityColor(value, c.severity) || 'var(--primary-color, #03a9f4)';

    const isHalf = c.gauge_style === 'half' || !c.gauge_style;
    const isFull = c.gauge_style === 'full';
    const isQuarter = c.gauge_style === 'quarter';

    if (isFull) {
      const angle = (pct / 100) * 360;
      const rad = (angle - 90) * (Math.PI / 180);
      const r = 40;
      const cx = 50;
      const cy = 50;
      const endX = cx + r * Math.cos(rad);
      const endY = cy + r * Math.sin(rad);
      const largeArc = angle > 180 ? 1 : 0;

      return html`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${pct > 0
              ? html`<path
                  d="M 50 10 A 40 40 0 ${largeArc} 1 ${endX} ${endY}"
                  fill="none"
                  stroke=${color}
                  stroke-width="8"
                  stroke-linecap="round"
                />`
              : ''}
            <text x="50" y="54" text-anchor="middle" font-size="16" font-weight="600" fill="currentColor">
              ${value}
            </text>
          </svg>
        </div>
      `;
    }

    if (isQuarter) {
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

      return html`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${pct > 0
              ? html`<path
                  d="M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}"
                  fill="none"
                  stroke=${color}
                  stroke-width="8"
                  stroke-linecap="round"
                />`
              : ''}
            <text x="20" y="80" text-anchor="start" font-size="18" font-weight="600" fill="currentColor">
              ${value}
            </text>
          </svg>
        </div>
      `;
    }

    // Default: half gauge (semicircle)
    const angle = (pct / 100) * 180;
    const rad = (180 + angle) * (Math.PI / 180);
    const r = 40;
    const cx = 50;
    const cy = 55;
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    const largeArc = angle > 180 ? 1 : 0;

    return html`
      <div class="mc-module mc-gauge mc-gauge--half" style="text-align: center;">
        <svg viewBox="0 0 100 70" width="140" height="100">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="8"
            stroke-linecap="round"
          />
          ${pct > 0
            ? html`<path
                d="M 10 55 A 40 40 0 ${largeArc} 1 ${endX} ${endY}"
                fill="none"
                stroke=${color}
                stroke-width="8"
                stroke-linecap="round"
              />`
            : ''}
          ${c.needle
            ? html`
                <line
                  x1="50"
                  y1="55"
                  x2=${endX}
                  y2=${endY}
                  stroke=${color}
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="55" r="3" fill=${color} />
              `
            : ''}
          <text x="50" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">
            ${value}
          </text>
          <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${min}</text>
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${max}</text>
        </svg>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as GaugeModuleConfig;
    const severity = c.severity || [];

    const addSeverity = () => {
      const newSeverity = [...severity, { from: 0, to: 100, color: '#4caf50' }];
      onChange({ ...c, severity: newSeverity });
    };

    const removeSeverity = (index: number) => {
      const newSeverity = severity.filter((_, i) => i !== index);
      onChange({ ...c, severity: newSeverity });
    };

    const updateSeverity = (index: number, key: 'from' | 'to' | 'color', val: string | number) => {
      const newSeverity = severity.map((s, i) =>
        i === index ? { ...s, [key]: val } : s,
      );
      onChange({ ...c, severity: newSeverity });
    };

    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }))}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }))}
        ${renderSelectField(
          'Gauge Style',
          c.gauge_style,
          [
            { label: 'Half (semicircle)', value: 'half' },
            { label: 'Full (circle)', value: 'full' },
            { label: 'Quarter', value: 'quarter' },
          ],
          (v) => onChange({ ...c, gauge_style: v as GaugeModuleConfig['gauge_style'] }),
        )}
        ${renderToggleField('Show Needle', c.needle, (v) => onChange({ ...c, needle: v }))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${severity.map(
              (s, i) => html`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${renderNumberField('From', s.from, (v) => updateSeverity(i, 'from', v))}
                  ${renderNumberField('To', s.to, (v) => updateSeverity(i, 'to', v))}
                  ${renderTextField('Color', s.color, (v) => updateSeverity(i, 'color', v))}
                  <button class="mc-btn-icon" @click=${() => removeSeverity(i)}>&times;</button>
                </div>
              `,
            )}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${addSeverity}>Add Severity Range</button>
        </div>
      </div>
    `;
  }

  private _getSeverityColor(
    value: number,
    severity?: Array<{ from: number; to: number; color: string }>,
  ): string | undefined {
    if (!severity || severity.length === 0) return undefined;
    for (const s of severity) {
      if (value >= s.from && value <= s.to) {
        return s.color;
      }
    }
    return undefined;
  }
}

ModuleRegistry.register(new GaugeModule());
