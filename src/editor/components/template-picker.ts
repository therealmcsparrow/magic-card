import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MagicCardConfig, HomeAssistant } from '../../types';
import { deepClone } from '../../utils/deep-merge';
import { pickerStyles, templatePickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

interface TemplateEntry {
  config: Omit<MagicCardConfig, 'type'> & { type?: string };
  description?: string;
}

type TemplateStore = Record<string, TemplateEntry>;

@customElement('mc-template-picker')
export class TemplatePicker extends LitElement {
  static styles = [pickerStyles, templatePickerStyles];

  private _modalCtrl = new ModalDragResizeController(this);

  @property({ type: String }) mode: 'create' | 'link' = 'create';
  @property({ attribute: false }) config?: MagicCardConfig;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _templateName = '';
  @state() private _templateDescription = '';
  @state() private _searchQuery = '';
  @state() private _error = '';
  @state() private _confirmLoad: string | null = null;
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

  protected updated(changed: Map<string, unknown>): void {
    super.updated(changed);
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
      this._error = 'Magic Card integration not found. Please install it via HACS and add the integration.';
    }
    this._loading = false;
  }

  private async _saveTemplate(name: string, entry: TemplateEntry): Promise<boolean> {
    this._saving = true;
    try {
      if (!this.hass) {
        this._error = 'Home Assistant connection unavailable.';
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
      this._error = 'Failed to save template.';
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
      this._error = 'Failed to delete template.';
      return false;
    }
  }

  private _close(): void {
    this._modalCtrl.reset();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private async _handleCreateSave(): Promise<void> {
    const name = this._templateName.trim();
    if (!name) {
      this._error = 'Template name is required.';
      return;
    }

    if (this._templates[name] && !this._showOverwrite) {
      this._showOverwrite = true;
      return;
    }

    if (!this.config) {
      this._error = 'No config available to save.';
      return;
    }

    const cloned = deepClone(this.config) as unknown as Record<string, unknown>;
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

    const config = deepClone(entry.config) as unknown as Record<string, unknown>;
    config['type'] = 'custom:magic-card';
    config['template'] = name;

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
      this._error = 'Template name is required.';
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
        this._error = `A template named "${newName}" already exists.`;
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
    return html`
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._close(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          ${this.mode === 'create' ? this._renderCreate() : this._renderLink()}
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }

  private _renderCreate(): TemplateResult {
    return html`
      <div class="mc-picker-header"
           @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
           @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-plus-outline"></ha-icon>
          <span class="mc-picker-title">Create Template</span>
        </div>
        <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
          <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
        </button>
        <button class="mc-modal-close" @click=${this._close}>&times;</button>
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
        <textarea
          placeholder="Description (optional)"
          .value=${this._templateDescription}
          @input=${(e: InputEvent) => {
            this._templateDescription = (e.target as HTMLTextAreaElement).value;
          }}
        ></textarea>
        ${this._error ? html`<div class="mc-template-error">${this._error}</div>` : nothing}
        ${this._showOverwrite
          ? html`
              <div class="mc-template-overwrite">
                A template named "${this._templateName.trim()}" already exists. Overwrite?
              </div>
            `
          : nothing}
      </div>
      <div class="mc-picker-footer">
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
        ${this._showOverwrite
          ? html`<button class="action-btn overwrite-btn" ?disabled=${this._saving} @click=${this._handleCreateSave}>Overwrite</button>`
          : html`<button class="action-btn save-btn" ?disabled=${!this._templateName.trim() || this._saving} @click=${this._handleCreateSave}>Save</button>`}
      </div>
    `;
  }

  private _renderEditForm(): TemplateResult {
    return html`
      <div class="mc-template-edit-form">
        <input
          type="text"
          placeholder="Template name"
          .value=${this._editName}
          @input=${(e: InputEvent) => {
            this._editName = (e.target as HTMLInputElement).value;
            this._error = '';
          }}
          @click=${(e: Event) => e.stopPropagation()}
        />
        <textarea
          placeholder="Description (optional)"
          .value=${this._editDescription}
          @input=${(e: InputEvent) => {
            this._editDescription = (e.target as HTMLTextAreaElement).value;
          }}
          @click=${(e: Event) => e.stopPropagation()}
        ></textarea>
        ${this._error ? html`<div class="mc-template-error">${this._error}</div>` : nothing}
        <div class="mc-template-edit-actions">
          <button class="action-btn cancel-btn" @click=${this._cancelEdit}>Cancel</button>
          <button
            class="action-btn save-btn"
            ?disabled=${!this._editName.trim() || this._saving}
            @click=${this._saveEdit}
          >
            Save
          </button>
        </div>
      </div>
    `;
  }

  private _renderLink(): TemplateResult {
    if (this._loading) {
      return html`
        <div class="mc-picker-header"
             @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
             @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
          <div class="mc-picker-header-start">
            <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
            <span class="mc-picker-title">Load Template</span>
          </div>
          <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
            <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
          </button>
          <button class="mc-modal-close" @click=${this._close}>&times;</button>
        </div>
        <div class="mc-picker-loading">Loading templates...</div>
      `;
    }

    const names = this._getFilteredTemplates();

    return html`
      <div class="mc-picker-header"
           @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
           @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
          <span class="mc-picker-title">Load Template</span>
        </div>
        <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
          <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
        </button>
        <button class="mc-modal-close" @click=${this._close}>&times;</button>
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
      ${this._editingTemplate ? this._renderEditForm() : nothing}
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
                    ${this._templates[name]?.description
                      ? html`<div class="mc-picker-item-meta">${this._templates[name].description}</div>`
                      : nothing}
                  </div>
                  <div class="mc-picker-item-actions">
                    <button
                      class="mc-template-edit-btn"
                      title="Edit template"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._startEdit(name);
                      }}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
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
                </div>
              `,
            )
          : html`<div class="mc-picker-empty">No templates saved</div>`}
      </div>
      <div class="mc-picker-footer">
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
    `;
  }
}
