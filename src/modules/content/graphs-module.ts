import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, GraphsModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderNumberField, renderToggleField, renderEntityField, renderTextField, renderColorField } from '../../utils/form-utils';

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

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as GraphsModuleConfig;
    const color = c.line_color || 'var(--mc-primary)';
    const fillColor = c.fill_color || 'var(--mc-primary)';

    return html`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${c.fill
            ? html`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${fillColor}" opacity="0.15" />`
            : ''}
          <path d="M0,50 Q30,30 60,35 T120,20 T200,30"
            fill="none" stroke="${color}" stroke-width="${c.line_width || 2}" />
          ${c.show_points
            ? html`
                <circle cx="0" cy="50" r="3" fill="${color}" />
                <circle cx="60" cy="35" r="3" fill="${color}" />
                <circle cx="120" cy="20" r="3" fill="${color}" />
                <circle cx="200" cy="30" r="3" fill="${color}" />
              `
            : ''}
        </svg>
        ${c.show_labels
          ? html`<div style="font-size:0.75rem; color:var(--mc-text-secondary); margin-top:4px">
              ${c.entity || 'No entity'} &mdash; ${c.hours_to_show || 24}h
            </div>`
          : ''}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as GraphsModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }))}
        ${renderNumberField('Hours to Show', c.hours_to_show, (v) => onChange({ ...c, hours_to_show: v }), { min: 1, max: 168 })}
        ${renderNumberField('Points per Hour', c.points_per_hour, (v) => onChange({ ...c, points_per_hour: v }), { min: 1, max: 60 })}
        ${renderColorField('Line Color', c.line_color, (v) => onChange({ ...c, line_color: v }))}
        ${renderNumberField('Line Width', c.line_width, (v) => onChange({ ...c, line_width: v }), { min: 1, max: 10 })}
        ${renderToggleField('Fill', c.fill, (v) => onChange({ ...c, fill: v }))}
        ${renderColorField('Fill Color', c.fill_color, (v) => onChange({ ...c, fill_color: v }))}
        ${renderToggleField('Show Points', c.show_points, (v) => onChange({ ...c, show_points: v }))}
        ${renderToggleField('Show Labels', c.show_labels, (v) => onChange({ ...c, show_labels: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new GraphsModule());
