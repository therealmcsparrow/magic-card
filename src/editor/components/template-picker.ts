import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MagicCardConfig } from '../../types';
import { TEMPLATES_STORAGE_KEY } from '../../utils/constants';
import { deepClone } from '../../utils/deep-merge';

type TemplateStore = Record<string, Omit<MagicCardConfig, 'type'>>;

@customElement('mc-template-picker')
export class TemplatePicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 420px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header-start {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-list {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .mc-picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.1s;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-item:last-child {
      border-bottom: none;
    }

    .mc-picker-item:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 50%;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
    }

    .mc-picker-item-content {
      flex: 1;
      min-width: 0;
    }

    .mc-picker-item-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-text-color, #212121);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mc-picker-item-meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .action-btn {
      border-radius: 6px;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.8125rem;
    }

    .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }

    /* Create mode form */
    .mc-template-form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mc-template-form input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }

    .mc-template-form input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-template-error {
      font-size: 0.8125rem;
      color: #f44336;
    }

    .mc-template-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }

    /* Delete button */
    .mc-template-delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      transition: all 0.15s;
      --mdc-icon-size: 18px;
    }

    .mc-template-delete-btn:hover {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    /* Confirm bar */
    .mc-template-confirm {
      padding: 12px 16px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mc-template-confirm-text {
      font-size: 0.8125rem;
      color: var(--primary-text-color, #212121);
    }

    .mc-template-confirm-actions {
      display: flex;
      gap: 8px;
    }

    /* Overwrite confirmation */
    .mc-template-overwrite {
      font-size: 0.8125rem;
      color: #ff9800;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-template-overwrite-actions {
      display: flex;
      gap: 8px;
    }

    .overwrite-btn {
      background-color: #ff9800;
      color: white;
    }
  `;

  @property({ type: String }) mode: 'create' | 'link' = 'create';
  @property({ attribute: false }) config?: MagicCardConfig;

  @state() private _templateName = '';
  @state() private _searchQuery = '';
  @state() private _error = '';
  @state() private _confirmLoad: string | null = null;
  @state() private _showOverwrite = false;

  private _getTemplates(): TemplateStore {
    try {
      const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as TemplateStore;
    } catch {
      return {};
    }
  }

  private _saveTemplates(templates: TemplateStore): void {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch {
      this._error = 'Failed to save to localStorage.';
    }
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _handleCreateSave(): void {
    const name = this._templateName.trim();
    if (!name) {
      this._error = 'Template name is required.';
      return;
    }

    const templates = this._getTemplates();

    if (templates[name] && !this._showOverwrite) {
      this._showOverwrite = true;
      return;
    }

    if (!this.config) {
      this._error = 'No config available to save.';
      return;
    }

    const cloned = deepClone(this.config) as unknown as Record<string, unknown>;
    delete cloned['type'];
    templates[name] = cloned as unknown as Omit<MagicCardConfig, 'type'>;
    this._saveTemplates(templates);

    if (!this._error) {
      this._close();
    }
  }

  private _handleLoadConfirm(name: string): void {
    const templates = this._getTemplates();
    const template = templates[name];
    if (!template) return;

    const config = deepClone(template) as unknown as Record<string, unknown>;
    config['type'] = 'custom:magic-card';

    this.dispatchEvent(
      new CustomEvent('template-selected', {
        detail: { config: config as unknown as MagicCardConfig },
        bubbles: true,
        composed: true,
      }),
    );
    this._close();
  }

  private _handleDelete(name: string): void {
    const templates = this._getTemplates();
    delete templates[name];
    this._saveTemplates(templates);

    if (this._confirmLoad === name) {
      this._confirmLoad = null;
    }

    this.requestUpdate();
  }

  private _getFilteredTemplates(): string[] {
    const templates = this._getTemplates();
    const names = Object.keys(templates).sort((a, b) => a.localeCompare(b));
    if (!this._searchQuery) return names;
    const q = this._searchQuery.toLowerCase();
    return names.filter((n) => n.toLowerCase().includes(q));
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-overlay" @click=${this._close}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          ${this.mode === 'create' ? this._renderCreate() : this._renderLink()}
        </div>
      </div>
    `;
  }

  private _renderCreate(): TemplateResult {
    return html`
      <div class="mc-picker-header">
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-plus-outline"></ha-icon>
          <span class="mc-picker-title">Create Template</span>
        </div>
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
      <div class="mc-template-form">
        <input
          type="text"
          placeholder="Template name"
          .value=${this._templateName}
          @input=${(e: InputEvent) => {
            this._templateName = (e.target as HTMLInputElement).value;
            this._error = '';
            this._showOverwrite = false;
          }}
        />
        ${this._error ? html`<div class="mc-template-error">${this._error}</div>` : nothing}
        ${this._showOverwrite
          ? html`
              <div class="mc-template-overwrite">
                A template named "${this._templateName.trim()}" already exists. Overwrite?
              </div>
            `
          : nothing}
      </div>
      <div class="mc-template-footer">
        ${this._showOverwrite
          ? html`<button class="action-btn overwrite-btn" @click=${this._handleCreateSave}>Overwrite</button>`
          : html`<button class="action-btn save-btn" ?disabled=${!this._templateName.trim()} @click=${this._handleCreateSave}>Save</button>`}
      </div>
    `;
  }

  private _renderLink(): TemplateResult {
    const names = this._getFilteredTemplates();

    return html`
      <div class="mc-picker-header">
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
          <span class="mc-picker-title">Load Template</span>
        </div>
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
      <div class="mc-picker-search">
        <input
          type="text"
          placeholder="Search templates..."
          .value=${this._searchQuery}
          @input=${(e: InputEvent) => {
            this._searchQuery = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      ${this._confirmLoad
        ? html`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                Load "${this._confirmLoad}"? This will replace your current config.
              </div>
              <div class="mc-template-confirm-actions">
                <button class="action-btn save-btn" @click=${() => this._handleLoadConfirm(this._confirmLoad!)}>Confirm</button>
                <button class="action-btn cancel-btn" @click=${() => { this._confirmLoad = null; }}>Cancel</button>
              </div>
            </div>
          `
        : nothing}
      <div class="mc-picker-list">
        ${names.length > 0
          ? names.map(
              (name) => html`
                <div class="mc-picker-item" @click=${() => { this._confirmLoad = name; }}>
                  <div class="mc-picker-item-icon">
                    <ha-icon icon="mdi:file-document-outline"></ha-icon>
                  </div>
                  <div class="mc-picker-item-content">
                    <div class="mc-picker-item-name">${name}</div>
                  </div>
                  <button
                    class="mc-template-delete-btn"
                    title="Delete template"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._handleDelete(name);
                    }}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>
                </div>
              `,
            )
          : html`<div class="mc-picker-empty">No templates saved</div>`}
      </div>
    `;
  }
}
