import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, BarModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../utils/form-utils';

class BarModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'bar',
    name: 'Bar',
    description: 'Display a progress bar based on entity state',
    category: 'content',
    icon: 'mdi:chart-bar',
  };

  createDefault(): BarModuleConfig {
    return {
      id: generateId('bar'),
      type: 'bar',
      min: 0,
      max: 100,
      bar_height: '8px',
      bar_color: 'var(--primary-color, #03a9f4)',
      bar_background: 'var(--divider-color, #e0e0e0)',
      show_value: true,
      direction: 'horizontal',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as BarModuleConfig;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const stateValue = entity ? parseFloat(entity.state) : min;
    const clamped = Math.min(Math.max(stateValue, min), max);
    const percentage = max !== min ? ((clamped - min) / (max - min)) * 100 : 0;

    // Determine bar color from severity or fallback
    let barColor = c.bar_color || 'var(--primary-color, #03a9f4)';
    if (c.severity && c.severity.length > 0) {
      for (const level of c.severity) {
        if (clamped >= level.from && clamped <= level.to) {
          barColor = level.color;
          break;
        }
      }
    }

    const barBg = c.bar_background || 'var(--divider-color, #e0e0e0)';
    const barHeight = c.bar_height || '8px';
    const isVertical = c.direction === 'vertical';

    if (isVertical) {
      return html`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${c.show_value
            ? html`<span class="mc-bar-value">${entity ? hass!.formatEntityState(entity) : '—'}</span>`
            : nothing}
          <div
            style="width: ${barHeight}; height: 100%; min-height: 40px; background: ${barBg}; border-radius: 4px; position: relative; overflow: hidden;"
          >
            <div
              style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${percentage}%; background: ${barColor}; border-radius: 4px; transition: height 0.3s ease;"
            ></div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-bar mc-bar-horizontal" style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <div
          style="flex: 1; height: ${barHeight}; background: ${barBg}; border-radius: 4px; overflow: hidden;"
        >
          <div
            style="height: 100%; width: ${percentage}%; background: ${barColor}; border-radius: 4px; transition: width 0.3s ease;"
          ></div>
        </div>
        ${c.show_value
          ? html`<span class="mc-bar-value" style="white-space: nowrap;">${entity ? hass!.formatEntityState(entity) : '—'}</span>`
          : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as BarModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }))}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }))}
        ${renderTextField('Bar Height', c.bar_height, (v) => onChange({ ...c, bar_height: v }))}
        ${renderColorField('Bar Color', c.bar_color, (v) => onChange({ ...c, bar_color: v }))}
        ${renderColorField('Bar Background', c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }),
        )}
        ${renderToggleField('Show Value', c.show_value, (v) => onChange({ ...c, show_value: v }))}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as BarModuleConfig['direction'] }),
        )}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as BarModuleConfig;
    if (!c.entity) {
      errors.push('Entity is required for bar module');
    }
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) {
      errors.push('Min must be less than max');
    }
    return errors;
  }
}

ModuleRegistry.register(new BarModule());
