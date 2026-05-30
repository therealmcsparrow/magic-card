import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, EditorState, MagicCardConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { editorStyles, yamlEditorStyles } from '../../css/css';

@customElement('mc-yaml-editor')
export class YamlEditor extends LitElement {
  static styles = [editorStyles, yamlEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  @state() private _showRawYaml = false;
  @state() private _expandedSections = new Set(['card', 'template']);

  private _unsubscribe?: () => void;
  private _suppressUpdate = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager) {
      this._unsubscribe = this.stateManager.subscribe((s) => {
        this._editorState = s;
      });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
  }

  private _toggleSection(id: string): void {
    const next = new Set(this._expandedSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._expandedSections = next;
  }

  private _renderSectionHeader(
    id: string,
    icon: string,
    title: string,
    badge?: string | number,
  ): TemplateResult {
    const isOpen = this._expandedSections.has(id);
    return html`
      <button
        class="mc-yaml-section-header"
        @click=${() => this._toggleSection(id)}
        aria-expanded=${isOpen ? 'true' : 'false'}
      >
        <ha-icon icon=${icon} style="--mdc-icon-size:18px"></ha-icon>
        <span class="mc-yaml-section-title">${title}</span>
        ${badge !== undefined && badge !== '' ? html`
          <span class="mc-yaml-section-badge">${badge}</span>
        ` : nothing}
        <ha-icon class="mc-yaml-section-chevron" icon=${isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} style="--mdc-icon-size:18px"></ha-icon>
      </button>
    `;
  }

  private _renderCardHeader(): TemplateResult {
    const config = this._editorState?.config;
    if (!config) return html``;

    return html`
      <div class="mc-yaml-card-header">
        <div class="mc-yaml-card-icon">
          <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:28px"></ha-icon>
        </div>
        <div class="mc-yaml-card-info">
          <div class="mc-yaml-card-type-badge">
            <ha-icon icon="mdi:puzzle" style="--mdc-icon-size:12px"></ha-icon>
            <span>${config.type || 'custom:magic-card'}</span>
          </div>
          <input
            class="mc-yaml-card-name"
            type="text"
            placeholder="Card name (e.g., Living Room Dashboard)"
            .value=${config.name || ''}
            @input=${(e: InputEvent) => {
              this.stateManager.updateConfig({ ...config, name: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
      </div>
    `;
  }

  private _renderCardSection(): TemplateResult {
    const config = this._editorState?.config;
    if (!config) return html``;

    const isOpen = this._expandedSections.has('card');
    return html`
      <div class="mc-yaml-section">
        ${this._renderSectionHeader('card', 'mdi:card-outline', 'Card Settings', '')}
        ${isOpen ? html`
          <div class="mc-yaml-section-body">
            <div class="mc-yaml-field-row">
              <div class="mc-yaml-field">
                <label class="mc-yaml-label">Card Name</label>
                <input
                  class="mc-yaml-input"
                  type="text"
                  placeholder="My Magic Card"
                  .value=${config.name || ''}
                  @input=${(e: InputEvent) => {
                    this.stateManager.updateConfig({ ...config, name: (e.target as HTMLInputElement).value });
                  }}
                />
              </div>
              <div class="mc-yaml-field">
                <label class="mc-yaml-label">Border Radius</label>
                <input
                  class="mc-yaml-input mc-yaml-input-sm"
                  type="text"
                  placeholder="12px"
                  .value=${config.border_radius || ''}
                  @input=${(e: InputEvent) => {
                    this.stateManager.updateConfig({ ...config, border_radius: (e.target as HTMLInputElement).value || undefined });
                  }}
                />
              </div>
            </div>
            <div class="mc-yaml-field-row">
              <div class="mc-yaml-field">
                <label class="mc-yaml-label">Card Height</label>
                <input
                  class="mc-yaml-input mc-yaml-input-sm"
                  type="text"
                  placeholder="auto"
                  .value=${config.card_height || ''}
                  @input=${(e: InputEvent) => {
                    this.stateManager.updateConfig({ ...config, card_height: (e.target as HTMLInputElement).value || undefined });
                  }}
                />
              </div>
              <div class="mc-yaml-field">
                <label class="mc-yaml-label">Background</label>
                <div class="mc-yaml-color-input">
                  <div
                    class="mc-yaml-color-preview"
                    style="background: ${config.background || 'transparent'}"
                  ></div>
                  <input
                    class="mc-yaml-input"
                    type="text"
                    placeholder="transparent or #hex"
                    .value=${config.background || ''}
                    @input=${(e: InputEvent) => {
                      this.stateManager.updateConfig({ ...config, background: (e.target as HTMLInputElement).value || undefined });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderTemplateSection(): TemplateResult {
    const config = this._editorState?.config;
    if (!config) return html``;

    const isOpen = this._expandedSections.has('template');
    const hasTemplate = !!config.template;

    return html`
      <div class="mc-yaml-section">
        ${this._renderSectionHeader('template', 'mdi:file-document-outline', 'Template', hasTemplate ? config.template : '')}
        ${isOpen ? html`
          <div class="mc-yaml-section-body">
            ${hasTemplate ? html`
              <div class="mc-yaml-template-linked">
                <ha-icon icon="mdi:link-variant" style="--mdc-icon-size:16px"></ha-icon>
                <span class="mc-yaml-template-name">${config.template}</span>
                <button
                  class="mc-yaml-btn mc-yaml-btn-sm mc-yaml-btn-danger"
                  @click=${() => {
                    const { template, ...rest } = config;
                    this.stateManager.updateConfig({ ...rest } as MagicCardConfig);
                  }}
                >
                  Unlink
                </button>
              </div>
            ` : html`
              <div class="mc-yaml-template-empty">
                <p class="mc-yaml-hint">Link a template to reuse this card's structure across multiple cards</p>
                <button class="mc-yaml-btn mc-yaml-btn-secondary">
                  <ha-icon icon="mdi:file-document-plus-outline" style="--mdc-icon-size:16px"></ha-icon>
                  Load Template
                </button>
              </div>
            `}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderRowsSection(): TemplateResult {
    const config = this._editorState?.config;
    if (!config) return html``;

    const isOpen = this._expandedSections.has('rows');
    const rowCount = config.rows?.length || 0;

    return html`
      <div class="mc-yaml-section">
        ${this._renderSectionHeader('rows', 'mdi:view-sequential', 'Rows', rowCount)}
        ${isOpen ? html`
          <div class="mc-yaml-section-body">
            <div class="mc-yaml-rows-summary">
              <div class="mc-yaml-rows-stat">
                <span class="mc-yaml-rows-stat-num">${rowCount}</span>
                <span class="mc-yaml-rows-stat-label">Row${rowCount !== 1 ? 's' : ''}</span>
              </div>
              ${config.rows?.map((row, ri) => html`
                <div class="mc-yaml-row-preview">
                  <span class="mc-yaml-row-num">Row ${ri + 1}</span>
                  <span class="mc-yaml-row-layout">${row.layout || '1'}</span>
                  <span class="mc-yaml-row-cols">${row.columns.length} col${row.columns.length !== 1 ? 's' : ''}</span>
                </div>
              `)}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderRawYamlSection(): TemplateResult {
    const config = this._editorState?.config;
    if (!config) return html``;

    const isOpen = this._expandedSections.has('yaml');
    return html`
      <div class="mc-yaml-section mc-yaml-section-raw">
        ${this._renderSectionHeader('yaml', 'mdi:code-braces', 'Raw YAML', '')}
        ${isOpen ? html`
          <div class="mc-yaml-section-body mc-yaml-editor-wrapper">
            <ha-yaml-editor
              .hass=${this.hass}
              .defaultValue=${config}
              @value-changed=${this._onYamlChanged}
            ></ha-yaml-editor>
          </div>
        ` : nothing}
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this._editorState) return html``;

    return html`
      <div class="mc-yaml-editor">
        <div class="mc-yaml-editor-header">
          <h3 class="mc-yaml-editor-title">
            <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:20px"></ha-icon>
            Card Configuration
          </h3>
        </div>

        ${this._renderCardHeader()}
        ${this._renderCardSection()}
        ${this._renderTemplateSection()}
        ${this._renderRowsSection()}
        ${this._renderRawYamlSection()}
      </div>
    `;
  }

  private _onYamlChanged(e: CustomEvent): void {
    const value = e.detail.value;
    if (!this._editorState) return;
    this._suppressUpdate = true;

    try {
      if (value && typeof value === 'object') {
        const config: MagicCardConfig = {
          ...value,
          type: this._editorState.config.type,
        } as MagicCardConfig;
        this.stateManager.updateConfig(config);
      }
    } catch {
      // Errors displayed by ha-yaml-editor
    } finally {
      this._suppressUpdate = false;
    }
  }
}