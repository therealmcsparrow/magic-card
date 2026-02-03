import { html, TemplateResult, nothing } from 'lit';
import { until } from 'lit/directives/until.js';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CustomCardModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField } from '../../utils/form-utils';
import { toYaml, fromYaml, isValidYaml } from '../../utils/yaml-utils';

// Cache card helpers singleton
let _cardHelpers: unknown | null = null;
let _cardHelpersPromise: Promise<unknown> | null = null;

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): HTMLElement;
}

async function getCardHelpers(): Promise<CardHelpers> {
  if (_cardHelpers) return _cardHelpers as CardHelpers;
  if (!_cardHelpersPromise) {
    _cardHelpersPromise = (window as unknown as { loadCardHelpers: () => Promise<unknown> }).loadCardHelpers();
  }
  _cardHelpers = await _cardHelpersPromise;
  return _cardHelpers as CardHelpers;
}

function configHash(cardType: string | undefined, cardConfig: Record<string, unknown> | undefined): string {
  return JSON.stringify({ t: cardType, c: cardConfig });
}

class CustomCardModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'custom-card',
    name: 'Custom Card',
    description: 'Embed any 3rd party Lovelace card',
    category: 'advanced',
    icon: 'mdi:card-plus-outline',
  };

  // Cache created card elements keyed by module ID
  private _elementCache = new Map<string, {
    element: HTMLElement;
    cardType: string;
    hash: string;
  }>();

  getAvailableTabs(): EditorTab[] {
    return ['general', 'logic', 'design'];
  }

  createDefault(): CustomCardModuleConfig {
    return {
      id: generateId('custom-card'),
      type: 'custom-card',
      card_type: '',
      card_config: {},
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CustomCardModuleConfig;

    if (!c.card_type) {
      return html`
        <div class="mc-module mc-custom-card" style="
          display: flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 80px; background: var(--divider-color, #e0e0e0);
          border-radius: 8px; color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        ">
          <ha-icon icon="mdi:card-plus-outline" style="--mdc-icon-size: 28px;"></ha-icon>
          <span>No card type set</span>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-custom-card">
        ${until(this._getOrCreateElement(c, hass), html`
          <div style="
            display: flex; align-items: center; justify-content: center;
            min-height: 60px; color: var(--secondary-text-color, #757575);
          ">Loading card...</div>
        `)}
      </div>
    `;
  }

  private async _getOrCreateElement(
    config: CustomCardModuleConfig,
    hass?: HomeAssistant,
  ): Promise<TemplateResult> {
    const cached = this._elementCache.get(config.id);
    const hash = configHash(config.card_type, config.card_config);

    let element: HTMLElement;

    if (cached && cached.cardType === config.card_type) {
      element = cached.element;

      // Config changed - update via setConfig
      if (cached.hash !== hash) {
        try {
          const fullConfig = { type: config.card_type, ...(config.card_config || {}) };
          (element as unknown as { setConfig: (c: Record<string, unknown>) => void }).setConfig(fullConfig);
          cached.hash = hash;
        } catch (err) {
          return html`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
            Error updating card config: ${String(err)}
          </div>`;
        }
      }
    } else {
      // Create new element
      try {
        const helpers = await getCardHelpers();
        const fullConfig: Record<string, unknown> = {
          type: config.card_type,
          ...(config.card_config || {}),
        };
        element = helpers.createCardElement(fullConfig);
        this._elementCache.set(config.id, {
          element,
          cardType: config.card_type!,
          hash,
        });
      } catch (err) {
        return html`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
          Failed to load card "${config.card_type}": ${String(err)}
        </div>`;
      }
    }

    // Forward hass
    if (hass) {
      (element as unknown as { hass: HomeAssistant }).hass = hass;
    }

    return html`${element}`;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as CustomCardModuleConfig;
    const yamlStr = c.card_config_yaml ?? (c.card_config ? toYaml(c.card_config) : '');
    const parsed = fromYaml<Record<string, unknown>>(yamlStr);
    const valid = yamlStr === '' || parsed !== null;

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Card Type', c.card_type, (v) => onChange({ ...c, card_type: v }))}
        <div class="mc-field-hint" style="margin-top: -4px; margin-bottom: 8px;">
          Built-in: entities, button, gauge, markdown, etc.<br>
          Custom: custom:mushroom-light-card, custom:mini-graph-card, etc.
        </div>
        <div class="mc-field">
          <label class="mc-field-label">Card Configuration (YAML)</label>
          <textarea
            .value=${yamlStr}
            @input=${(e: InputEvent) => {
              const raw = (e.target as HTMLTextAreaElement).value;
              const result = fromYaml<Record<string, unknown>>(raw);
              if (result !== null) {
                onChange({ ...c, card_config: result, card_config_yaml: raw });
              } else {
                onChange({ ...c, card_config_yaml: raw });
              }
            }}
            rows="10"
            placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
            style="font-family: monospace; font-size: 0.8125rem; resize: vertical;"
          ></textarea>
        </div>
        ${!valid
          ? html`<div class="mc-field-hint" style="color: var(--error-color, #ef4444); margin-top: -4px;">
              Invalid YAML - card will use last valid configuration
            </div>`
          : nothing}
        <div class="mc-field-hint" style="margin-top: 4px;">
          The <code>type</code> key is set automatically from Card Type above. Do not include it here.
        </div>
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as CustomCardModuleConfig;
    if (!c.card_type) {
      errors.push('Card type is required');
    }
    return errors;
  }
}

ModuleRegistry.register(new CustomCardModule());
