import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SpinboxModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import {
  renderTextField,
  renderEntityField,
  renderNumberField,
  renderAttributeField,
} from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

class SpinboxModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'spinbox',
    name: 'Spinbox',
    description: 'Numeric input with increment and decrement buttons',
    category: 'controls',
    icon: 'mdi:numeric',
  };

  createDefault(): SpinboxModuleConfig {
    return {
      id: generateId('spinbox'),
      type: 'spinbox',
      min: 0,
      max: 100,
      step: 1,
    };
  }

  private _callEntityService(
    hass: HomeAssistant,
    entityId: string,
    value: number,
    attribute?: string,
  ): void {
    const domain = entityId.split('.')[0];

    switch (domain) {
      case 'input_number':
      case 'number':
        hass.callService(domain, 'set_value', { entity_id: entityId, value });
        break;
      case 'light':
        if (!attribute || attribute === 'brightness') {
          hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: Math.round(value) });
        } else if (attribute === 'color_temp') {
          hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: Math.round(value) });
        }
        break;
      case 'fan':
        hass.callService('fan', 'set_percentage', { entity_id: entityId, percentage: Math.round(value) });
        break;
      case 'climate':
        hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: value });
        break;
      default:
        hass.callService(domain, 'set_value', { entity_id: entityId, value });
        break;
    }
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SpinboxModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const min = c.min ?? 0;
    const max = c.max ?? 100;
    const step = c.step ?? 1;
    const currentValue = entity
      ? c.attribute
        ? Number(entity.attributes[c.attribute] ?? min)
        : Number(entity.state)
      : Math.round((min + max) / 2);

    const handleDecrement = (e: Event) => {
      e.stopPropagation();
      if (!c.entity || !hass) return;
      const newValue = Math.max(min, currentValue - step);
      this._callEntityService(hass, c.entity, newValue, c.attribute);
    };

    const handleIncrement = (e: Event) => {
      e.stopPropagation();
      if (!c.entity || !hass) return;
      const newValue = Math.min(max, currentValue + step);
      this._callEntityService(hass, c.entity, newValue, c.attribute);
    };

    return html`
      <div class="mc-module mc-spinbox">
        <button class="mc-spinbox-btn mc-spinbox-decrement" @click=${handleDecrement}>
          &minus;
        </button>
        <span class="mc-spinbox-value">
          ${currentValue}
        </span>
        <button class="mc-spinbox-btn mc-spinbox-increment" @click=${handleIncrement}>
          +
        </button>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as SpinboxModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: v }), undefined, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: v }), undefined, 'max', syncCtx)}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: v }), { min: 0.01, step: 0.01 }, 'step', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new SpinboxModule());
