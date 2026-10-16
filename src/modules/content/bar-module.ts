import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, BarModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderUnitField,
  renderToggleField,
  renderEntityField,
  renderAttributeField,
  renderSelectField,
  renderNumberField,
  renderColorField,
} from '../../utils/form-utils';
import { entityNumber, formatEntityValue } from '../../utils/entity-value';
import { rangeColor, renderColorRangesField } from '../../utils/color-ranges';

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
    const min = Number.isFinite(Number(c.min)) ? Number(c.min) : 0;
    const max = Number.isFinite(Number(c.max)) ? Number(c.max) : 100;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const attribute = c.attribute || undefined;
    const num = entity ? entityNumber(entity, attribute) : undefined;
    // An entity without a number (unavailable, unknown, "on", missing attribute): empty, muted bar
    // with the entity's own state as the value.
    const unavailable = !!c.entity && num === undefined;
    const clamped = num === undefined ? min : Math.min(Math.max(num, min), max);
    const percentage = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

    // Ranges see the clamped value, so a value past max (or below min) keeps the edge range's colour.
    const barColor = rangeColor(num === undefined ? undefined : clamped, c.severity) || c.bar_color || 'var(--primary-color, #03a9f4)';
    const barBg = c.bar_background || 'var(--divider-color, #e0e0e0)';
    const barHeight = c.bar_height || '8px';
    const isVertical = c.direction === 'vertical';

    let valueText = '—';
    if (entity && unavailable && attribute && entity.attributes[attribute] === undefined) {
      valueText = hass!.formatEntityState?.(entity, 'unavailable') || 'Unavailable';
    } else if (entity) {
      valueText = formatEntityValue(hass, entity, attribute, { decimals: c.decimals }).text;
    }
    const value = c.show_value !== false
      ? html`<span class="mc-bar-value" data-mc-part="state">${valueText}</span>`
      : nothing;
    const cls = `mc-module mc-bar ${isVertical ? 'mc-bar-vertical' : 'mc-bar-horizontal'}${unavailable ? ' mc-bar--unavailable' : ''}`;
    const fill = isVertical ? `height: ${percentage}%` : `width: ${percentage}%`;
    const track = isVertical ? `width: ${barHeight}; height: 100%` : `height: ${barHeight}`;

    return html`
      <div
        class=${cls}
        role="meter"
        aria-valuemin=${min}
        aria-valuemax=${max}
        aria-valuenow=${num === undefined ? nothing : clamped}
        aria-valuetext=${valueText}
      >
        ${isVertical ? value : nothing}
        <div class="mc-bar-track" data-mc-part="background" style="${track}; background: ${barBg};">
          <div class="mc-bar-fill" style="${fill}; background: ${barColor};"></div>
        </div>
        ${isVertical ? nothing : value}
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
        ${renderUnitField('Bar height', c.bar_height, (v) => onChange({ ...c, bar_height: v || undefined }), 'bar_height', syncCtx, '8')}
        ${renderColorField('Bar color', c.bar_color, (v) => onChange({ ...c, bar_color: v }), 'bar_color', syncCtx)}
        ${renderColorField('Bar background', c.bar_background, (v) =>
          onChange({ ...c, bar_background: v }), 'bar_background', syncCtx)}
        ${renderColorRangesField('Color ranges', c.severity, (v) => onChange({ ...c, severity: v }), {
          min: c.min ?? 0, max: c.max ?? 100, propertyName: 'severity', syncCtx,
          help: 'The bar takes the color of the highest range at or below the value; the bar color applies below the first range.',
        })}
        ${renderToggleField('Show value', c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${c.show_value !== false
          ? renderNumberField('Decimals', c.decimals, (v) => onChange({ ...c, decimals: Number.isFinite(v) ? v : undefined }), { min: 0, max: 6, optional: true, placeholder: 'Automatic' }, 'decimals', syncCtx)
          : nothing}
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
    // No entity yet is not an error: the bar shows its minimum until one is picked.
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) {
      errors.push('Min must be less than max');
    }
    return errors;
  }
}

ModuleRegistry.register(new BarModule());
