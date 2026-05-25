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
  renderAttributeField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

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
        <div class="mc-module mc-bar mc-bar-vertical">
          ${c.show_value
            ? html`<span class="mc-bar-value">${entity ? hass!.formatEntityState(entity) : '—'}</span>`
            : nothing}
          <div
            class="mc-bar-track"
            style="width: ${barHeight}; height: 100%; background: ${barBg};"
          >
            <div
              class="mc-bar-fill"
              style="height: ${percentage}%; background: ${barColor};"
            ></div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-bar mc-bar-horizontal">
        <div
          class="mc-bar-track"
          style="height: ${barHeight}; background: ${barBg};"
        >
          <div
            class="mc-bar-fill"
            style="width: ${percentage}%; background: ${barColor};"
          ></div>
        </div>
        ${c.show_value
          ? html`<span class="mc-bar-value">${entity ? hass!.formatEntityState(entity) : '—'}</span>`
          : nothing}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as BarModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderTextField('Bar Height', c.bar_height, (v) => onChange({ ...c, bar_height: v }), 'bar_height', syncCtx)}
        ${renderColorField('Bar Color', c.bar_color, (v) => onChange({ ...c, bar_color: v }), 'bar_color', syncCtx)}
        ${renderColorField('Bar Background', c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }), 'bar_background', syncCtx)}
        ${renderToggleField('Show Value', c.show_value, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as BarModuleConfig['direction'] }), 'direction', syncCtx)}
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
