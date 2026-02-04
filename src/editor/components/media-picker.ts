import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MediaBrowseItem, MediaResolveResult } from '../../types';

interface BreadcrumbEntry {
  title: string;
  media_content_id: string;
}

@customElement('mc-media-picker')
export class MediaPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Modal overlay */
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
      width: 480px;
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
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      font-size: 0.8125rem;
      overflow-x: auto;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .mc-breadcrumb {
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      border: none;
      background: none;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 0.8125rem;
      white-space: nowrap;
    }

    .mc-breadcrumb:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    }

    .mc-breadcrumb-sep {
      color: var(--secondary-text-color, #757575);
    }

    .mc-breadcrumb-current {
      color: var(--primary-text-color, #212121);
      font-weight: 500;
      padding: 2px 4px;
      white-space: nowrap;
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
      padding: 10px 16px;
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

    .mc-picker-item.selected {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent);
    }

    .mc-picker-item-thumb {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 6px;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
      flex-shrink: 0;
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

    .mc-picker-item-badge {
      font-size: 0.6875rem;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-loading {
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
    }

    .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) mediaType: 'image' | 'video' | '' = '';

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _items: MediaBrowseItem[] = [];
  @state() private _loading = false;
  @state() private _error = '';
  @state() private _breadcrumbs: BreadcrumbEntry[] = [];
  @state() private _selectedItem: MediaBrowseItem | null = null;

  private _onInputChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _openModal(): void {
    this._showModal = true;
    this._searchQuery = '';
    this._selectedItem = null;
    this._breadcrumbs = [{ title: 'Media', media_content_id: '' }];
    this._browseMedia('');
  }

  private _closeModal(): void {
    this._showModal = false;
    this._items = [];
    this._error = '';
  }

  private async _browseMedia(mediaContentId: string): Promise<void> {
    if (!this.hass) return;
    this._loading = true;
    this._error = '';
    this._selectedItem = null;

    try {
      const msg: Record<string, unknown> = { type: 'media_source/browse_media' };
      if (mediaContentId) {
        msg.media_content_id = mediaContentId;
      }
      const result = await this.hass.callWS<MediaBrowseItem>(msg);
      this._items = result.children || [];
    } catch {
      this._error = 'No media sources available';
      this._items = [];
    }

    this._loading = false;
  }

  private _navigateToFolder(item: MediaBrowseItem): void {
    this._breadcrumbs = [
      ...this._breadcrumbs,
      { title: item.title, media_content_id: item.media_content_id },
    ];
    this._searchQuery = '';
    this._browseMedia(item.media_content_id);
  }

  private _navigateToBreadcrumb(index: number): void {
    const entry = this._breadcrumbs[index];
    this._breadcrumbs = this._breadcrumbs.slice(0, index + 1);
    this._searchQuery = '';
    this._browseMedia(entry.media_content_id);
  }

  private _selectItem(item: MediaBrowseItem): void {
    this._selectedItem = item;
  }

  private async _handleSave(): Promise<void> {
    if (!this._selectedItem || !this.hass) {
      this._closeModal();
      return;
    }

    try {
      const result = await this.hass.callWS<MediaResolveResult>({
        type: 'media_source/resolve_media',
        media_content_id: this._selectedItem.media_content_id,
      });
      this.value = result.url;
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: result.url },
        bubbles: true,
        composed: true,
      }));
    } catch {
      // Fallback: use media_content_id as value
      this.value = this._selectedItem.media_content_id;
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: this._selectedItem.media_content_id },
        bubbles: true,
        composed: true,
      }));
    }

    this._closeModal();
  }

  private _getFilteredItems(): MediaBrowseItem[] {
    let items = this._items;

    // Filter by media type if set
    if (this.mediaType) {
      items = items.filter((item) => {
        if (item.can_expand) return true; // Always show directories
        return this._matchesMediaType(item.media_class);
      });
    }

    // Filter by search query
    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(q));
    }

    return items;
  }

  private _matchesMediaType(mediaClass: string): boolean {
    const cls = mediaClass.toLowerCase();
    if (this.mediaType === 'image') {
      return cls === 'image' || cls === 'photo' || cls === 'picture';
    }
    if (this.mediaType === 'video') {
      return cls === 'video' || cls === 'movie' || cls === 'clip';
    }
    return true;
  }

  private _getItemIcon(item: MediaBrowseItem): string {
    if (item.can_expand) return 'mdi:folder';
    const cls = item.media_class.toLowerCase();
    if (cls === 'image' || cls === 'photo' || cls === 'picture') return 'mdi:image';
    if (cls === 'video' || cls === 'movie' || cls === 'clip') return 'mdi:video';
    if (cls === 'music' || cls === 'audio' || cls === 'song') return 'mdi:music';
    return 'mdi:file';
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="URL or media path"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:folder-search"></ha-icon>
          Browse
        </button>
      </div>
      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const items = this._getFilteredItems();

    return html`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header">
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:folder-search"></ha-icon>
              <span class="mc-picker-title">Select Media</span>
            </div>
            <div>
              <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedItem}>Save</button>
              <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
          </div>

          ${this._renderBreadcrumbs()}

          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Filter items..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>

          <div class="mc-picker-list">
            ${this._loading
              ? html`<div class="mc-picker-loading">Loading...</div>`
              : this._error
                ? html`<div class="mc-picker-empty">${this._error}</div>`
                : items.length > 0
                  ? items.map((item) => this._renderItem(item))
                  : html`<div class="mc-picker-empty">No items found</div>`
            }
          </div>
        </div>
      </div>
    `;
  }

  private _renderBreadcrumbs(): TemplateResult {
    if (this._breadcrumbs.length <= 1) return html``;

    return html`
      <div class="mc-picker-breadcrumbs">
        ${this._breadcrumbs.map((entry, i) => {
          const isLast = i === this._breadcrumbs.length - 1;
          if (isLast) {
            return html`<span class="mc-breadcrumb-current">${entry.title}</span>`;
          }
          return html`
            <button class="mc-breadcrumb" @click=${() => this._navigateToBreadcrumb(i)}>${entry.title}</button>
            <span class="mc-breadcrumb-sep">&rsaquo;</span>
          `;
        })}
      </div>
    `;
  }

  private _renderItem(item: MediaBrowseItem): TemplateResult {
    const isSelected = this._selectedItem?.media_content_id === item.media_content_id;
    const icon = this._getItemIcon(item);

    const handleClick = () => {
      if (item.can_expand) {
        this._navigateToFolder(item);
      } else if (item.can_play) {
        this._selectItem(item);
      }
    };

    return html`
      <div class="mc-picker-item ${isSelected ? 'selected' : ''}" @click=${handleClick}>
        ${item.thumbnail
          ? html`<img class="mc-picker-item-thumb" src=${item.thumbnail} alt="" />`
          : html`<div class="mc-picker-item-icon"><ha-icon icon=${icon}></ha-icon></div>`
        }
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name">${item.title}</div>
        </div>
        ${item.can_expand
          ? html`<ha-icon icon="mdi:chevron-right" style="color:var(--secondary-text-color);--mdc-icon-size:20px"></ha-icon>`
          : html`<span class="mc-picker-item-badge">${item.media_class}</span>`
        }
      </div>
    `;
  }
}
