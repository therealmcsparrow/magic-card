import { LitElement, html, css, TemplateResult, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CustomCardModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderCardField, renderFieldHint } from '../../utils/form-utils';
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

/**
 * Wrapper component that embeds a HA Lovelace card element.
 * Manages the card lifecycle directly in the DOM to avoid issues
 * with Lit template diffing disrupting the embedded card's state.
 */
@customElement('mc-embedded-card')
export class EmbeddedCard extends LitElement {
  static styles = css`
    :host { display: block; }
    .mc-embedded-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
      color: var(--secondary-text-color, #6b7280);
      font-size: 0.875rem;
    }
    .mc-embedded-error {
      color: var(--error-color, #ef4444);
      padding: 8px;
      font-size: 0.875rem;
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String, attribute: 'card-type' }) cardType?: string;
  @property({ attribute: false }) cardConfig?: Record<string, unknown>;

  private _element?: HTMLElement;
  private _currentCardType?: string;
  private _configHash?: string;
  private _loading = false;

  protected updated(changedProps: PropertyValues): void {
    // Card type changed — recreate element
    if (changedProps.has('cardType') && this.cardType !== this._currentCardType) {
      this._createElement();
      return;
    }

    // Config changed — update via setConfig
    if (changedProps.has('cardConfig') && this._element) {
      const hash = JSON.stringify(this.cardConfig);
      if (hash !== this._configHash) {
        this._configHash = hash;
        try {
          (this._element as unknown as { setConfig: (c: Record<string, unknown>) => void })
            .setConfig({ type: this.cardType, ...(this.cardConfig || {}) });
        } catch {
          // Some cards handle config differently
        }
      }
    }

    // Forward hass to the embedded element
    if (this._element && this.hass) {
      (this._element as unknown as { hass: HomeAssistant }).hass = this.hass;
    }
  }

  private async _createElement(): Promise<void> {
    if (this._loading) return;

    const container = this.renderRoot.querySelector('.mc-embedded-container');
    if (!container) return;

    if (!this.cardType) {
      this._element = undefined;
      this._currentCardType = undefined;
      container.innerHTML = '';
      return;
    }

    this._loading = true;
    this._currentCardType = this.cardType;

    try {
      const helpers = await getCardHelpers();
      const fullConfig: Record<string, unknown> = {
        type: this.cardType,
        ...(this.cardConfig || {}),
      };
      const element = helpers.createCardElement(fullConfig);

      if (this.hass) {
        (element as unknown as { hass: HomeAssistant }).hass = this.hass;
      }

      this._configHash = JSON.stringify(this.cardConfig);
      this._element = element;

      // Clear and append directly to DOM
      container.innerHTML = '';
      container.appendChild(element);
    } catch (err) {
      container.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.className = 'mc-embedded-error';
      errorDiv.textContent = `Failed to load "${this.cardType}": ${String(err)}`;
      container.appendChild(errorDiv);
    } finally {
      this._loading = false;
    }
  }

  protected firstUpdated(): void {
    if (this.cardType) {
      this._createElement();
    }
  }

  protected render(): TemplateResult {
    return html`<div class="mc-embedded-container">
      ${!this._element && this.cardType
        ? html`<div class="mc-embedded-loading">Loading card...</div>`
        : nothing}
    </div>`;
  }
}

class CustomCardModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'custom-card',
    name: 'Custom Card',
    description: 'Embed any 3rd party Lovelace card',
    category: 'advanced',
    icon: 'mdi:card-plus-outline',
  };

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
        <div class="mc-module mc-custom-card mc-custom-card-placeholder">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span>No card type set</span>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-custom-card">
        <mc-embedded-card
          card-type=${c.card_type}
          .cardConfig=${c.card_config || {}}
          .hass=${hass}
        ></mc-embedded-card>
      </div>
    `;
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

      // Wait for the element to be defined/upgraded (with timeout)
      const tag = cardElement.localName;
      await Promise.race([
        customElements.whenDefined(tag),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout waiting for ${tag}`)), 5000),
        ),
      ]);

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
        await Promise.race([
          customElements.whenDefined(editor.localName),
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout waiting for ${editor.localName}`)), 5000),
          ),
        ]);
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
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as CustomCardModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Name', c.name, (v) => onChange({ ...c, name: v }), 'name', syncCtx)}
        ${renderFieldHint(
          'An optional label to help you identify this card in the editor.',
          'mc-field-hint-tight',
        )}
        ${renderCardField('Card Type', c.card_type, (v) => {
          this._editorCache.delete(c.id);
          onChange({ ...c, card_type: v });
        })}
        ${c.card_type
          ? html`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
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
        <div class="mc-yaml-fallback-note">
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
          ? html`<div class="mc-yaml-fallback-error">
              Invalid YAML - card will use last valid configuration
            </div>`
          : nothing}
        <div class="mc-yaml-fallback-help">
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
