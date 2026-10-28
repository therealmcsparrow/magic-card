import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, BarModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { entityNumber, formatEntityValue } from '../../utils/entity-value';
import { rangeColor } from '../../utils/color-ranges';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

class BarModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'bar',
    name: lm('labels.bar-module.bar'),
    description: lm('labels.bar-module.display-a-progress-bar-based-on-entity'),
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
      valueText = hass!.formatEntityState?.(entity, 'unavailable') || t('card.bar-module.unavailable');
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


  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as BarModuleConfig;
    // No entity yet is not an error: the bar shows its minimum until one is picked.
    if (c.min !== undefined && c.max !== undefined && c.min >= c.max) {
      errors.push(t('card.bar-module.min-must-be-less-than-max'));
    }
    return errors;
  }
}

ModuleRegistry.register(new BarModule());
