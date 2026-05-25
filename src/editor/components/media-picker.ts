import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MediaBrowseItem, MediaResolveResult } from '../../types';
import { pickerStyles, mediaPickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

interface BreadcrumbEntry {
  title: string;
  media_content_id: string;
}

@customElement('mc-media-picker')
export class MediaPicker extends LitElement {
  static styles = [pickerStyles, mediaPickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) mediaType: 'image' | 'video' | '' = '';

  private _modalCtrl = new ModalDragResizeController(this);

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
    this._modalCtrl.reset();
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
      const value = `url('${result.url}')`;
      this.value = value;
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value },
        bubbles: true,
        composed: true,
      }));
    } catch {
      // Fallback: use media_content_id as value
      const value = `url('${this._selectedItem.media_content_id}')`;
      this.value = value;
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value },
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
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:folder-search"></ha-icon>
              <span class="mc-picker-title">Select Media</span>
            </div>
            <div class="mc-picker-header-end">
              <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
                <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
              </button>
              <button class="mc-picker-close" @click=${this._closeModal} aria-label="Close">&times;</button>
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
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedItem}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
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
