import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { pickerStyles, iconPickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-system';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';
import { pickerKeydown, renderPickerHeader, renderPickerSearch, renderResizeHandle, PickerDialogController } from './picker-parts';
import { applyAnimatedIconPick, currentIconPick, currentIconStyle, loadIconAnimator } from './icon-animator/loader';
import { IconListItem, iconDisplayName, isIconId, loadIconList, searchIcons } from '../../utils/icon-list';

/** Most rows the list renders at once (MDI alone has 7000+ icons): refine the search for the rest. */
export const ICON_LIST_CAP = 150;

/**
 * Icon field + picker, laid out like mc-entity-picker: an editable mono id with the icon's preview
 * and a browse button, the readable name under it; the picker is a searchable list (name, keywords,
 * full id) of HA's MDI icons and the installed icon packs. A typed full id (`phu:my-icon`) is used as is.
 * Fires `value-changed` with the icon string ('' when cleared).
 */
@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = [editorSystem, pickerStyles, iconPickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Icon';
  /** Set on the icon field of icon, info and button modules: adds the Animated icons tab. */
  @property({ attribute: false }) animated?: { module: CardModule; onModule: (m: CardModule) => void };

  private _modalCtrl = new ModalDragResizeController(this);
  private _dialogCtrl = new PickerDialogController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedIcon = '';
  @state() private _icons: IconListItem[] | null = null;
  /** Keyboard-highlighted row (index into the rendered rows). */
  @state() private _active = -1;
  @state() private _tab: 'icons' | 'animated' = 'icons';
  /** The chunk behind the Animated icons tab: loading, loaded or failed. */
  @state() private _chunk: 'loading' | 'ok' | 'failed' = 'loading';

  private async _setTab(tab: 'icons' | 'animated', focus = false): Promise<void> {
    this._tab = tab;
    if (focus) void this.updateComplete.then(() => (this.shadowRoot?.querySelector('[role=tab][aria-selected=true]') as HTMLElement | null)?.focus());
    if (tab === 'animated' && this._chunk !== 'ok') {
      this._chunk = 'loading';
      this._chunk = (await loadIconAnimator()) ? 'ok' : 'failed';
    }
  }

  private _onTabKeydown(e: KeyboardEvent): void {
    const to = { ArrowRight: 'animated', ArrowLeft: 'icons', Home: 'icons', End: 'animated' }[e.key];
    if (!to) return;
    e.preventDefault();
    void this._setTab(to as 'icons' | 'animated', true);
  }

  private _onAnimatedPick(e: CustomEvent): void {
    const a = this.animated;
    if (!a) return;
    e.stopPropagation();
    void applyAnimatedIconPick(this, a.module, a.onModule, e.detail);
    // a new Style for the module's library icon: the picker stays open
    if (!(e.detail as { restyle?: boolean }).restyle) this._closeModal();
  }

  private _renderTabs(): TemplateResult {
    return html`
      <div class="seg" role="tablist" aria-label="Icon source">
        ${(['icons', 'animated'] as const).map((t) => html`
          <button type="button" role="tab" aria-selected=${this._tab === t ? 'true' : 'false'}
            tabindex=${this._tab === t ? '0' : '-1'} @click=${() => this._setTab(t)} @keydown=${this._onTabKeydown}
          >${t === 'icons' ? 'Icons' : 'Animated icons'}</button>
        `)}
      </div>
    `;
  }

  private _renderAnimated(): TemplateResult {
    const a = this.animated!;
    if (this._chunk === 'loading') return html`<div class="mc-picker-loading">Loading…</div>`;
    if (this._chunk === 'failed') {
      return html`<div class="mc-picker-empty">The animated icons could not be loaded. Try again.
        <button type="button" class="btn btn-secondary" @click=${() => this._setTab('animated')}>Retry</button></div>`;
    }
    const m = a.module as CardModule & { entity?: string };
    return html`<mc-animated-icon-grid .hass=${this.hass} .icon=${this.value} .entity=${m.entity ?? ''}
      .current=${currentIconPick(this, a.module)} .iconStyle=${currentIconStyle(a.module)} @animated-icon-pick=${this._onAnimatedPick}></mc-animated-icon-grid>`;
  }

  private _openModal(): void {
    this._tab = 'icons';
    this._selectedIcon = this.value;
    this._searchQuery = '';
    this._active = -1;
    this._showModal = true;
    void this._loadIcons();
  }

  private async _loadIcons(): Promise<void> {
    const icons = await loadIconList(this.hass?.hassUrl?.bind(this.hass));
    if (this._showModal) this._icons = icons;
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
    this._showModal = false;
  }

  private _commit(value: string): void {
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleSave(): void {
    this._commit(this._selectedIcon.trim());
    this._closeModal();
  }

  private _handleClear(): void {
    this._commit('');
    this._closeModal();
  }

  private _onInputChange(e: InputEvent): void {
    this._commit((e.target as HTMLInputElement).value);
  }

  private _onFieldKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown' && !e.altKey) {
      e.preventDefault();
      this._openModal();
    }
  }

  /** The rows shown for the current query: a typed full id that is not in the list leads, as "use as typed". */
  private _rows(): { rows: IconListItem[]; total: number; custom: boolean } {
    const all = this._icons ?? [];
    const { items, total } = searchIcons(all, this._searchQuery, ICON_LIST_CAP);
    const typed = this._searchQuery.trim();
    if (isIconId(typed) && !items.some((i) => i.id.toLowerCase() === typed.toLowerCase())) {
      const prefix = typed.slice(0, typed.indexOf(':'));
      return { rows: [{ id: typed, name: iconDisplayName(typed), prefix, search: '' }, ...items], total: total + 1, custom: true };
    }
    return { rows: items, total, custom: false };
  }

  private _onSearch(v: string): void {
    this._searchQuery = v;
    this._active = v.trim() ? 0 : -1;
  }

  private _onSearchKeydown(e: KeyboardEvent): void {
    const { rows } = this._rows();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!rows.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      this._active = this._active < 0
        ? (step > 0 ? 0 : rows.length - 1)
        : Math.min(rows.length - 1, Math.max(0, this._active + step));
      this._selectedIcon = rows[this._active].id;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = this._active >= 0 ? rows[this._active] : undefined;
      if (row) this._selectedIcon = row.id;
      else if (isIconId(this._searchQuery)) this._selectedIcon = this._searchQuery.trim();
      this._handleSave();
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_showModal') && this._showModal) {
      (this.shadowRoot?.querySelector('.mc-picker-search input') as HTMLInputElement | null)?.focus();
    }
    if (changed.has('_active') && this._active >= 0) {
      const row = this.shadowRoot?.getElementById(`mc-icon-opt-${this._active}`);
      row?.scrollIntoView?.({ block: 'nearest' });
    }
  }

  protected render(): TemplateResult {
    const value = this.value?.trim() ?? '';
    // Same field as the entity picker: icon preview, editable mono id, browse button; the name under it.
    return html`
      <div class="with-icon with-action">
        <ha-icon .icon=${value || 'mdi:emoticon-outline'}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="mdi:icon"
          aria-label=${this.label}
          spellcheck="false"
          @input=${this._onInputChange}
          @keydown=${this._onFieldKeydown}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label="Browse icons"
          title="Browse icons"
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>
      ${value
        ? html`<p class="entity-meta icon-meta"><span>${iconDisplayName(value)}</span></p>`
        : ''}

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const { rows, total } = this._rows();
    const activeId = this._active >= 0 && this._active < rows.length ? `mc-icon-opt-${this._active}` : undefined;
    const selected = this._selectedIcon.trim().toLowerCase();
    const grid = !!this.animated && this._tab === 'animated';

    return html`
      <dialog class="mc-picker-overlay" aria-label="Select icon" @click=${(e: Event) => { if (!this._modalCtrl.consumeDragFlag() && this._dialogCtrl.isBackdropClick(e)) this._closeModal(); }}>
        <div class="mc-picker-modal" @keydown=${pickerKeydown(() => this._closeModal())} @click=${(e: Event) => e.stopPropagation()}>
          ${renderPickerHeader('Select icon', this._modalCtrl, () => this._closeModal())}
          ${this.animated ? this._renderTabs() : ''}
          ${grid ? html`<div class="mc-picker-list" role="tabpanel">${this._renderAnimated()}</div>` : html`
          <div class="mc-picker-search">
            ${renderPickerSearch('Search icons', this._searchQuery, (v) => this._onSearch(v), {
              onKeydown: (e) => this._onSearchKeydown(e),
              listId: 'mc-icon-list',
              activeId,
            })}
          </div>
          <div class="mc-picker-list" id="mc-icon-list" role="listbox" aria-label="Icons">
            ${this._icons === null
              ? html`<div class="mc-picker-loading">Loading icons…</div>`
              : rows.length > 0
                ? rows.map((icon, i) => html`
                    <button
                      type="button"
                      role="option"
                      id="mc-icon-opt-${i}"
                      tabindex="-1"
                      class="mc-picker-item ${i === this._active ? 'is-active' : ''}"
                      aria-selected=${selected === icon.id.toLowerCase() ? 'true' : 'false'}
                      @click=${() => { this._selectedIcon = icon.id; this._active = i; }}
                      @dblclick=${() => { this._selectedIcon = icon.id; this._handleSave(); }}
                    >
                      <span class="mc-picker-item-icon"><ha-icon .icon=${icon.id}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${icon.name}</span>
                        <span class="mc-picker-item-id">${icon.id}</span>
                      </span>
                      ${icon.prefix !== 'mdi' ? html`<span class="chip">${icon.prefix}</span>` : ''}
                    </button>
                  `)
                : html`<div class="mc-picker-empty">No icons found. Type a full id, such as mdi:fan.</div>`}
            ${total > rows.length
              ? html`<div class="mc-picker-more">Showing ${rows.length} of ${total}. Refine the search to see more.</div>`
              : ''}
          </div>`}
          <div class="mc-picker-footer">
            ${grid ? '' : html`<button type="button" class="btn btn-text clear" @click=${this._handleClear}>Clear</button>`}
            <span class="spacer"></span>
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>Cancel</button>
            ${grid ? '' : html`<button type="button" class="btn btn-primary" @click=${this._handleSave}>Save</button>`}
          </div>
          ${renderResizeHandle(this._modalCtrl)}
        </div>
      </dialog>
    `;
  }
}
