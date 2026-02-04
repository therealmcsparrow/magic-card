import { html, TemplateResult, nothing } from 'lit';
import { until } from 'lit/directives/until.js';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CustomCardModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderCardField } from '../../utils/form-utils';
import { toYaml, fromYaml } from '../../utils/yaml-utils';

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

  // Cache editor elements keyed by module ID
  private _editorCache = new Map<string, {
    editor: HTMLElement | null;
    cardType: string;
    attempted: boolean;
  }>();

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  createDefault(): CustomCardModuleConfig {
    return {
      id: generateId('custom-card'),
      type: 'custom-card',
      name: '',
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

  private async _getOrCreateEditor(
    config: CustomCardModuleConfig,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): Promise<HTMLElement | null> {
    const cardType = config.card_type;
    if (!cardType) return null;

    const cached = this._editorCache.get(config.id);
    if (cached && cached.cardType === cardType) {
      return cached.editor;
    }

    // Attempt to get the native editor
    try {
      const helpers = await getCardHelpers();
      const fullConfig: Record<string, unknown> = {
        type: cardType,
        ...(config.card_config || {}),
      };
      const cardElement = helpers.createCardElement(fullConfig);

      // Wait for the element to be defined/upgraded
      await customElements.whenDefined(cardElement.localName);

      const constructor = cardElement.constructor as {
        getConfigElement?: () => HTMLElement | Promise<HTMLElement>;
      };
      if (typeof constructor.getConfigElement !== 'function') {
        this._editorCache.set(config.id, { editor: null, cardType, attempted: true });
        return null;
      }

      // getConfigElement is async in HA - always await
      const editor = await constructor.getConfigElement();

      // Wait for the editor element to upgrade if it has a custom tag
      if (editor.localName?.includes('-')) {
        await customElements.whenDefined(editor.localName);
      }

      // Set hass and config on the editor
      if (hass) {
        (editor as unknown as { hass: HomeAssistant }).hass = hass;
      }
      try {
        (editor as unknown as { setConfig: (c: Record<string, unknown>) => void }).setConfig(fullConfig);
      } catch {
        // Some editors handle config differently
      }

      // Listen for config-changed events
      editor.addEventListener('config-changed', ((e: CustomEvent) => {
        const newConfig = e.detail?.config as Record<string, unknown> | undefined;
        if (newConfig) {
          // Strip `type` from the config since we store it separately
          const { type: _type, ...rest } = newConfig;
          onChange({
            ...config,
            card_config: rest,
            card_config_yaml: undefined,
          } as CustomCardModuleConfig);
        }
      }) as EventListener);

      this._editorCache.set(config.id, { editor, cardType, attempted: true });
      return editor;
    } catch {
      this._editorCache.set(config.id, { editor: null, cardType, attempted: true });
      return null;
    }
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as CustomCardModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Name', c.name, (v) => onChange({ ...c, name: v }))}
        <div class="mc-field-hint" style="margin-top: -4px; margin-bottom: 8px;">
          An optional label to help you identify this card in the editor.
        </div>
        ${renderCardField('Card Type', c.card_type, (v) => {
          this._editorCache.delete(c.id);
          onChange({ ...c, card_type: v });
        })}
        ${c.card_type
          ? html`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon icon="mdi:cog" style="--mdc-icon-size: 16px;"></ha-icon>
                Card Configuration
              </div>
              <div class="mc-card-editor-body">
                ${until(
                  this._renderEditorContent(c, hass, onChange),
                  html`<div class="mc-editor-loading">Loading editor...</div>`,
                )}
              </div>
            </div>
          `
          : nothing}
      </div>
      <style>
        .mc-card-editor-section {
          border: 1px solid var(--divider-color, #e5e7eb);
          border-radius: 8px;
          overflow: hidden;
        }
        .mc-card-editor-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary-color, #6366f1);
          background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
          border-bottom: 1px solid var(--divider-color, #e5e7eb);
        }
        .mc-card-editor-body {
          padding: 16px;
        }
        .mc-yaml-fallback textarea {
          width: 100%;
          min-height: 200px;
          font-family: monospace;
          font-size: 0.8125rem;
          resize: vertical;
          border: 1px solid var(--divider-color, #e5e7eb);
          border-radius: 6px;
          padding: 12px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #1a1a2e);
          box-sizing: border-box;
        }
        .mc-yaml-fallback textarea:focus {
          outline: none;
          border-color: var(--primary-color, #6366f1);
        }
        .mc-editor-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        }
      </style>
    `;
  }

  private async _renderEditorContent(
    config: CustomCardModuleConfig,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): Promise<TemplateResult> {
    const editor = await this._getOrCreateEditor(config, hass, onChange);

    if (editor) {
      // Update hass on existing editor
      if (hass) {
        (editor as unknown as { hass: HomeAssistant }).hass = hass;
      }
      return html`${editor}`;
    }

    // Fallback: YAML textarea
    const yamlStr = config.card_config_yaml ?? (config.card_config ? toYaml(config.card_config) : '');
    const parsed = fromYaml<Record<string, unknown>>(yamlStr);
    const valid = yamlStr === '' || parsed !== null;

    return html`
      <div class="mc-yaml-fallback">
        <div style="margin-bottom: 8px; font-size: 0.8125rem; color: var(--secondary-text-color, #6b7280);">
          No visual editor available for this card type. Configure using YAML:
        </div>
        <textarea
          .value=${yamlStr}
          @input=${(e: InputEvent) => {
            const raw = (e.target as HTMLTextAreaElement).value;
            const result = fromYaml<Record<string, unknown>>(raw);
            if (result !== null) {
              onChange({ ...config, card_config: result, card_config_yaml: raw } as CustomCardModuleConfig);
            } else {
              onChange({ ...config, card_config_yaml: raw } as CustomCardModuleConfig);
            }
          }}
          rows="12"
          placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
        ></textarea>
        ${!valid
          ? html`<div style="color: var(--error-color, #ef4444); font-size: 0.8125rem; margin-top: 4px;">
              Invalid YAML - card will use last valid configuration
            </div>`
          : nothing}
        <div style="margin-top: 4px; font-size: 0.75rem; color: var(--secondary-text-color, #6b7280);">
          The <code>type</code> key is set automatically from Card Type. Do not include it here.
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
