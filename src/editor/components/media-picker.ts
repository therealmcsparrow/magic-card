import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MediaBrowseItem } from '../../types';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t } from '../i18n';

interface BreadcrumbEntry {
  title: string;
  media_content_id: string;
}

@customElement('mc-media-picker')
export class MediaPicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) mediaType: 'image' | 'video' | '' = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

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
    this._breadcrumbs = [{ title: t('card-editor.media-picker.media'), media_content_id: '' }];
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
      this._error = t('card-editor.media-picker.no-media-sources-available');
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

  /**
   * Stores the item's media-source id: the card resolves it while rendering (a resolved URL carries
   * a signature that expires, so it cannot be stored).
   */
  private _handleSave(): void {
    const item = this._selectedItem;
    if (item) {
      const value = item.media_content_id;
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
      <div class="with-icon with-action">
        <ha-icon icon=${this.mediaType === 'video' ? 'mdi:video-outline' : 'mdi:image-outline'}></ha-icon>
        <input
          type="text"
          class="input"
          .value=${this.value}
          placeholder="/local/images/background.jpg"
          aria-label=${t('card-editor.media-picker.media-url-or-path')}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${t('card-editor.media-picker.browse-media')}
          title=${t('card-editor.media-picker.browse-media')}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
        </button>
      </div>
      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const items = this._getFilteredItems();

    return html`
      ${renderPickerWindow(t('card-editor.media-picker.select-media'), () => this._closeModal(), 'm', html`

          ${this._renderBreadcrumbs()}

          <div class="mc-picker-search">
            ${renderPickerSearch(t('card-editor.media-picker.filter-items'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>

          <div class="mc-picker-list" role="listbox" aria-label=${t('card-editor.media-picker.media')}>
            ${this._loading
              ? html`<div class="mc-picker-loading">${t('card-editor.media-picker.loading')}</div>`
              : this._error
                ? html`<div class="mc-picker-empty">${this._error}</div>`
                : items.length > 0
                  ? items.map((item) => this._renderItem(item))
                  : html`<div class="mc-picker-empty">${t('card-editor.media-picker.no-items-found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('card-editor.media-picker.cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedItem}>${t('card-editor.media-picker.save')}</button>
          </div>
      `)}
    `;
  }

  private _renderBreadcrumbs(): TemplateResult {
    if (this._breadcrumbs.length <= 1) return html``;

    return html`
      <nav class="mc-picker-breadcrumbs" aria-label=${t('card-editor.media-picker.media-folders')}>
        ${this._breadcrumbs.map((entry, i) => {
          const isLast = i === this._breadcrumbs.length - 1;
          if (isLast) {
            return html`<span class="mc-breadcrumb-current" aria-current="page">${entry.title}</span>`;
          }
          return html`
            <button type="button" class="btn btn-text btn-sm" @click=${() => this._navigateToBreadcrumb(i)}>${entry.title}</button>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          `;
        })}
      </nav>
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
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${isSelected ? 'true' : 'false'}
        @click=${handleClick}
      >
        ${item.thumbnail
          ? html`<img class="mc-picker-item-thumb" src=${item.thumbnail} alt="" />`
          : html`<span class="mc-picker-item-icon"><ha-icon icon=${icon}></ha-icon></span>`
        }
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name">${item.title}</span>
        </span>
        ${item.can_expand
          ? html`<ha-icon class="mc-picker-item-chev" icon="mdi:chevron-right"></ha-icon>`
          : html`<span class="chip">${item.media_class}</span>`
        }
      </button>
    `;
  }
}
