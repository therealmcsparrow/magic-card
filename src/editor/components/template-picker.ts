import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MagicCardConfig, HomeAssistant } from '../../types';
import { deepClone } from '../../utils/deep-merge';
import { cardInstanceKeys } from '../../services/template-merge';
import { stripForTemplate } from '../state/template-sync';
import { pickerStyles, templatePickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { entityKey } from '../../utils/entity-scope';
import { templateDomains, templateFollows } from '../entity-source';
import './entity-picker';
import { t } from '../i18n';

interface TemplateEntry {
  config: Omit<MagicCardConfig, 'type'> & { type?: string };
  description?: string;
}

type TemplateStore = Record<string, TemplateEntry>;

@customElement('mc-template-picker')
export class TemplatePicker extends LitElement {
  static styles = [
    editorSystem,
    pickerStyles,
    templatePickerStyles,
    css`
      .mc-template-device {
        display: grid;
        gap: 6px;
      }
      .mc-template-device > p {
        margin: 0;
      }
    `,
  ];

  private _windowCtrl = new PickerWindowController(this, () => this._close());

  @property({ type: String }) mode: 'create' | 'link' = 'create';
  @property({ attribute: false }) config?: MagicCardConfig;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _templateName = '';
  @state() private _templateDescription = '';
  @state() private _searchQuery = '';
  @state() private _error = '';
  @state() private _confirmLoad: string | null = null;
  /** The answer to "Which device is this card for?" in the load confirm; empty = not answered. */
  @state() private _device = '';
  @state() private _showOverwrite = false;
  @state() private _templates: TemplateStore = {};
  @state() private _loading = true;
  @state() private _saving = false;
  @state() private _editingTemplate: string | null = null;
  @state() private _editName = '';
  @state() private _editDescription = '';

  connectedCallback(): void {
    super.connectedCallback();
    this._loadTemplates();
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    // each template asks its own question: an answer never carries over
    if (changed.has('_confirmLoad')) this._device = '';
  }

  /** The confirm opens above the list: when it asks for a device, the focus goes to that field. */
  private _focusQuestion(): void {
    const picker = this.shadowRoot?.querySelector<HTMLElement & { focusInput?: () => void; updateComplete: Promise<unknown> }>('.mc-template-device mc-entity-picker');
    void picker?.updateComplete.then(() => picker.focusInput?.());
  }

  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has('_confirmLoad') && this._confirmLoad) this._focusQuestion();
    // Retry loading if hass becomes available after initial connectedCallback
    if (changed.has('hass') && this.hass && Object.keys(this._templates).length === 0 && !this._loading) {
      this._loadTemplates();
    }
  }

  private async _loadTemplates(): Promise<void> {
    this._loading = true;
    try {
      if (this.hass) {
        const result = await this.hass.callWS<{ templates: TemplateStore }>({
          type: 'magic_card_utils/get_templates',
        });
        this._templates = result.templates || {};
      }
    } catch {
      this._templates = {};
      this._error = t('card-editor.template-picker.magic-card-integration-not-found-please');
    }
    this._loading = false;
  }

  private async _saveTemplate(name: string, entry: TemplateEntry): Promise<boolean> {
    this._saving = true;
    try {
      if (!this.hass) {
        this._error = t('card-editor.template-picker.home-assistant-connection-unavailable');
        this._saving = false;
        return false;
      }
      await this.hass.callWS({
        type: 'magic_card_utils/save_template',
        name,
        template: entry,
      });
      this._templates = { ...this._templates, [name]: entry };
      this._saving = false;
      return true;
    } catch {
      this._error = t('card-editor.template-picker.failed-to-save-template');
      this._saving = false;
      return false;
    }
  }

  private async _deleteTemplate(name: string): Promise<boolean> {
    try {
      if (!this.hass) return false;
      await this.hass.callWS({
        type: 'magic_card_utils/delete_template',
        name,
      });
      const updated = { ...this._templates };
      delete updated[name];
      this._templates = updated;
      return true;
    } catch {
      this._error = t('card-editor.template-picker.failed-to-delete-template');
      return false;
    }
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('mc-picker-close', { bubbles: true, composed: true }));
  }

  private async _handleCreateSave(): Promise<void> {
    const name = this._templateName.trim();
    if (!name) {
      this._error = t('card-editor.template-picker.template-name-is-required');
      return;
    }

    if (this._templates[name] && !this._showOverwrite) {
      this._showOverwrite = true;
      return;
    }

    if (!this.config) {
      this._error = t('card-editor.template-picker.no-config-available-to-save');
      return;
    }

    // the card's content only: no template link, overrides or HA's per-card grid_options / visibility
    const cloned = stripForTemplate(this.config);
    const entry: TemplateEntry = {
      config: cloned as unknown as TemplateEntry['config'],
    };
    const desc = this._templateDescription.trim();
    if (desc) {
      entry.description = desc;
    }
    const ok = await this._saveTemplate(name, entry);

    if (ok) {
      // Link this card to the newly created template
      const linkedConfig = deepClone(this.config) as unknown as Record<string, unknown>;
      linkedConfig['template'] = name;

      this.dispatchEvent(
        new CustomEvent('template-selected', {
          detail: { config: linkedConfig as unknown as MagicCardConfig },
          bubbles: true,
          composed: true,
        }),
      );
      this._close();
    }
  }

  private _handleLoadConfirm(name: string): void {
    const entry = this._templates[name];
    if (!entry) return;

    // the template's content, plus what HA keeps for this card (grid_options, visibility, ...)
    const fromTemplate = deepClone(entry.config) as unknown as Record<string, unknown>;
    delete fromTemplate['entity']; // the card keeps its own entity (in cardInstanceKeys), never the template's
    const config = { ...fromTemplate, ...(this.config ? cardInstanceKeys(this.config) : {}) };
    config['type'] = 'custom:magic-card';
    config['template'] = name;
    if (this._device) config['entity'] = this._device;

    this.dispatchEvent(
      new CustomEvent('template-selected', {
        detail: { config: config as unknown as MagicCardConfig },
        bubbles: true,
        composed: true,
      }),
    );
    this._close();
  }

  private async _handleDelete(name: string): Promise<void> {
    await this._deleteTemplate(name);

    if (this._confirmLoad === name) {
      this._confirmLoad = null;
    }
    if (this._editingTemplate === name) {
      this._editingTemplate = null;
    }
  }

  private _startEdit(name: string): void {
    const entry = this._templates[name];
    this._editingTemplate = name;
    this._editName = name;
    this._editDescription = entry?.description || '';
    this._confirmLoad = null;
  }

  private _cancelEdit(): void {
    this._editingTemplate = null;
    this._editName = '';
    this._editDescription = '';
  }

  private async _saveEdit(): Promise<void> {
    if (!this._editingTemplate || !this.hass) return;
    const oldName = this._editingTemplate;
    const newName = this._editName.trim();
    if (!newName) {
      this._error = t('card-editor.template-picker.template-name-is-required');
      return;
    }

    const entry = this._templates[oldName];
    if (!entry) return;

    const updatedEntry: TemplateEntry = {
      ...entry,
      description: this._editDescription.trim() || undefined,
    };

    // If name changed, delete old and save new
    if (newName !== oldName) {
      // Check if new name already exists
      if (this._templates[newName]) {
        this._error = t('card-editor.template-picker.a-template-named-name-already-exists', { name: newName });
        return;
      }
      await this._deleteTemplate(oldName);
    }

    const ok = await this._saveTemplate(newName, updatedEntry);
    if (ok) {
      this._editingTemplate = null;
      this._editName = '';
      this._editDescription = '';
      this._error = '';
    }
  }

  private _getFilteredTemplates(): string[] {
    const names = Object.keys(this._templates).sort((a, b) => a.localeCompare(b));
    if (!this._searchQuery) return names;
    const q = this._searchQuery.toLowerCase();
    return names.filter((n) => n.toLowerCase().includes(q));
  }

  protected render(): TemplateResult {
    const title = this.mode === 'create' ? t('card-editor.template-picker.create-template') : t('card-editor.template-picker.load-template');
    return html`
      ${renderPickerWindow(title, () => this._close(), 's', html`${this.mode === 'create' ? this._renderCreate() : this._renderLink()}`)}
    `;
  }

  private _renderCreate(): TemplateResult {
    return html`
      <div class="mc-template-form">
        <div class="field">
          <div class="field-head"><label for="tpl-name">${t('card-editor.template-picker.template-name')}</label></div>
          <input
            id="tpl-name"
            class="input"
            type="text"
            .value=${this._templateName}
            @input=${(e: InputEvent) => {
              this._templateName = (e.target as HTMLInputElement).value;
              this._error = '';
              this._showOverwrite = false;
            }}
          />
        </div>
        <div class="field">
          <div class="field-head"><label for="tpl-desc">${t('card-editor.template-picker.description-optional')}</label></div>
          <textarea
            id="tpl-desc"
            class="input"
            .value=${this._templateDescription}
            @input=${(e: InputEvent) => {
              this._templateDescription = (e.target as HTMLTextAreaElement).value;
            }}
          ></textarea>
        </div>
        ${this._error ? html`<div class="mc-template-error" role="alert">${this._error}</div>` : nothing}
        ${this._showOverwrite
          ? html`
              <div class="mc-template-overwrite">
                ${t('card-editor.template-picker.a-template-named-name-already-exists-2', { name: this._templateName.trim() })}
              </div>
            `
          : nothing}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${t('card-editor.template-picker.cancel')}</button>
        ${this._showOverwrite
          ? html`<button type="button" class="btn btn-primary" ?disabled=${this._saving} @click=${this._handleCreateSave}>${t('card-editor.template-picker.overwrite')}</button>`
          : html`<button type="button" class="btn btn-primary" ?disabled=${!this._templateName.trim() || this._saving} @click=${this._handleCreateSave}>${t('card-editor.template-picker.save')}</button>`}
      </div>
    `;
  }

  private _renderEditForm(): TemplateResult {
    return html`
      <div class="mc-template-edit-form">
        <div class="field">
          <div class="field-head"><label for="tpl-edit-name">${t('card-editor.template-picker.template-name')}</label></div>
          <input
            id="tpl-edit-name"
            class="input"
            type="text"
            .value=${this._editName}
            @input=${(e: InputEvent) => {
              this._editName = (e.target as HTMLInputElement).value;
              this._error = '';
            }}
            @click=${(e: Event) => e.stopPropagation()}
          />
        </div>
        <div class="field">
          <div class="field-head"><label for="tpl-edit-desc">${t('card-editor.template-picker.description-optional')}</label></div>
          <textarea
            id="tpl-edit-desc"
            class="input"
            .value=${this._editDescription}
            @input=${(e: InputEvent) => {
              this._editDescription = (e.target as HTMLTextAreaElement).value;
            }}
            @click=${(e: Event) => e.stopPropagation()}
          ></textarea>
        </div>
        ${this._error ? html`<div class="mc-template-error" role="alert">${this._error}</div>` : nothing}
        <div class="mc-template-edit-actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._cancelEdit}>${t('card-editor.template-picker.cancel')}</button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            ?disabled=${!this._editName.trim() || this._saving}
            @click=${this._saveEdit}
          >
            ${t('card-editor.template-picker.save')}
          </button>
        </div>
      </div>
    `;
  }

  /** Whether to ask which device the card is for: the card has none and the template has a module that would follow it. */
  private _asksDevice(name: string): boolean {
    const rows = this._templates[name]?.config.rows;
    if (!this.config || typeof entityKey(this.config.entity) === 'string' || !Array.isArray(rows)) return false;
    return templateFollows(rows.flatMap((r) => (r.columns ?? []).flatMap((c) => c.modules ?? [])));
  }

  private _domainsOf(name: string): string[] {
    const rows = this._templates[name]?.config.rows;
    return Array.isArray(rows) ? templateDomains(rows.flatMap((r) => (r.columns ?? []).flatMap((c) => c.modules ?? []))) : [];
  }

  private _renderLink(): TemplateResult {
    if (this._loading) {
      return html`<div class="mc-picker-loading">${t('card-editor.template-picker.loading-templates')}</div>`;
    }

    const names = this._getFilteredTemplates();

    return html`
      <div class="mc-picker-search">
        ${renderPickerSearch(t('card-editor.template-picker.search-templates'), this._searchQuery, (v) => { this._searchQuery = v; })}
      </div>
      ${this._confirmLoad
        ? html`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                ${t('card-editor.template-picker.load-name-this-will-replace-your-current', { name: this._confirmLoad })}
              </div>
              ${this._asksDevice(this._confirmLoad)
                ? html`<div class="mc-template-device">
                    <p class="mc-template-confirm-text">${t('card-editor.template-picker.which-device-is-this-card-for')}</p>
                    <mc-entity-picker
                      .hass=${this.hass}
                      .value=${this._device}
                      .label=${t('card-editor.template-picker.which-device-is-this-card-for')}
                      .placeholder=${t('card-editor.template-picker.pick-a-device')}
                      .strict=${true}
                      .preferred=${this._domainsOf(this._confirmLoad)}
                      @value-changed=${(e: CustomEvent<{ value: string }>) => { this._device = e.detail.value; }}
                    ></mc-entity-picker>
                    <p class="help">${t('card-editor.template-picker.tiles-that-follow-the-card-will-show-it')}</p>
                  </div>`
                : nothing}
              <div class="mc-template-confirm-actions">
                <button type="button" class="btn btn-secondary btn-sm" @click=${() => { this._confirmLoad = null; }}>${t('card-editor.template-picker.cancel')}</button>
                <button type="button" class="btn btn-primary btn-sm" @click=${() => this._handleLoadConfirm(this._confirmLoad!)}>${t('card-editor.template-picker.load')}</button>
              </div>
            </div>
          `
        : nothing}
      ${this._editingTemplate ? this._renderEditForm() : nothing}
      <div class="mc-picker-list">
        ${names.length > 0
          ? names.map(
              (name) => html`
                <div
                  class="mc-picker-item ${this._confirmLoad === name ? 'selected' : ''}"
                  role="button"
                  tabindex="0"
                  @click=${() => { this._confirmLoad = name; }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      this._confirmLoad = name;
                    }
                  }}
                >
                  <span class="mc-picker-item-icon"><ha-icon icon="mdi:file-document-outline"></ha-icon></span>
                  <span class="mc-picker-item-content">
                    <span class="mc-picker-item-name">${name}</span>
                    ${this._templates[name]?.description
                      ? html`<span class="mc-picker-item-meta">${this._templates[name].description}</span>`
                      : nothing}
                  </span>
                  <span class="mc-picker-item-actions">
                    <button
                      type="button"
                      class="icon-btn sm"
                      title=${t('card-editor.template-picker.edit-template')}
                      aria-label=${t('card-editor.template-picker.edit-template-name', { name })}
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._startEdit(name);
                      }}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                      type="button"
                      class="icon-btn sm danger"
                      title=${t('card-editor.template-picker.delete-template')}
                      aria-label=${t('card-editor.template-picker.delete-template-name', { name })}
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._handleDelete(name);
                      }}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                  </span>
                </div>
              `,
            )
          : html`<div class="mc-picker-empty">${t('card-editor.template-picker.no-templates-saved')}</div>`}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${t('card-editor.template-picker.cancel')}</button>
      </div>
    `;
  }
}
