import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant } from '../../types';
import { pickerStyles, iconPickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { applyAnimatedIconPick, currentIconPick, currentIconStyle, loadIconAnimator } from './icon-animator/loader';
import { IconListItem, iconDisplayName, isIconId, loadIconList, searchIcons } from '../../utils/icon-list';
import { KEEP_COPY_DEFAULT_MAX_BYTES, type IconSummary } from '../../contracts/mcu-library';
import { cardStateOf as cardState } from '../custom/bridge';
import { getIcon, listIcons, type Listing } from '../custom/library';
import { openLibrary } from '../custom/library-sheet';
import { applyIconPatch, openIconEditor, withKeptIcon } from '../custom/icon-host';
import type { SyncContext } from '../../utils/sync-path';
import { hasTemplate } from '../../utils/sync-path';
import { t } from '../i18n';

/** Most rows the list renders at once (MDI alone has 7000+ icons): refine the search for the rest. */
export const ICON_LIST_CAP = 150;
/** Saved icons shown first in the All view, before the full My icons list (design 05). */
export const MINE_GROUP_CAP = 6;

/**
 * Icon field + picker, laid out like mc-entity-picker: an editable mono id with the icon's preview
 * and a browse button, the readable name under it; the picker is a searchable list (name, keywords,
 * full id) of HA's MDI icons and the installed icon packs. A typed full id (`phu:my-icon`) is used as is.
 * Fires `value-changed` with the icon string ('' when cleared).
 */
@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = [
    editorSystem,
    pickerStyles,
    iconPickerStyles,
    css`
      .mc-picker-stack > .seg {
        flex-shrink: 0;
        width: auto;
        margin: 8px 16px 0;
      }
      .mc-picker-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mc-picker-keep {
        flex-shrink: 0;
        padding: 0 16px;
        border-top: 1px solid var(--mc-divider);
      }
      .mc-picker-keep > summary {
        min-height: var(--mc-hit, 40px);
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .mc-picker-keep[open] {
        display: grid;
        gap: 4px;
        padding-bottom: 8px;
      }
      @media (pointer: coarse) {
        .browse {
          min-width: 44px;
          min-height: 44px;
        }
      }
      .mc-picker-keep-actions {
        display: flex;
        gap: 8px;
      }
      .mc-picker-footer .help {
        flex: 1 1 100%;
        margin: 0;
      }
      /* short screens (200 % zoom, a phone on its side): the quiet install tip makes way for the list */
      @media (max-height: 560px) {
        .mc-picker-footer .help:not(.error) {
          display: none;
        }
        .mc-picker-stack {
          min-height: 0;
        }
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  /** Set on the icon field of icon, info and button modules: adds the Animated icons tab. */
  @property({ attribute: false }) animated?: { module: CardModule; onModule: (m: CardModule) => void };
  /** Template link of the module's icon field: the icon editor marks icon and svg as this card's own. */
  @property({ attribute: false }) syncCtx?: SyncContext;

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedIcon = '';
  @state() private _icons: IconListItem[] | null = null;
  /** Keyboard-highlighted row (index into the rendered rows). */
  @state() private _active = -1;
  @state() private _tab: 'icons' | 'animated' = 'icons';
  /** The chunk behind the Animated icons tab: loading, loaded or failed. */
  @state() private _chunk: 'loading' | 'ok' | 'failed' = 'loading';
  /** Saved icons (Magic Card Utils): the source chip and the first group. */
  @state() private _lib?: Listing<IconSummary>;
  @state() private _src: 'all' | 'mine' = 'all';
  /** The picked saved icon: its markup, size and whether the card keeps a copy (default by size). */
  @state() private _keep?: { id: string; svg: string; bytes: number; on: boolean };
  @state() private _editorFailed = false;
  private _keepFor = '';

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
      <div class="seg" role="tablist" aria-label=${t('Icon source')}>
        ${(['icons', 'animated'] as const).map((tb) => html`
          <button type="button" role="tab" aria-selected=${this._tab === tb ? 'true' : 'false'}
            tabindex=${this._tab === tb ? '0' : '-1'} @click=${() => this._setTab(tb)} @keydown=${this._onTabKeydown}
          >${tb === 'icons' ? t('Icons') : t('Animated icons')}</button>
        `)}
      </div>
    `;
  }

  private _renderAnimated(): TemplateResult {
    const a = this.animated!;
    if (this._chunk === 'loading') return html`<div class="mc-picker-loading">${t('Loading…')}</div>`;
    if (this._chunk === 'failed') {
      return html`<div class="mc-picker-empty">${t('The animated icons could not be loaded. Try again.')}
        <button type="button" class="btn btn-secondary" @click=${() => this._setTab('animated')}>${t('Retry')}</button></div>`;
    }
    const m = a.module as CardModule & { entity?: string };
    return html`<mc-animated-icon-grid .hass=${this.hass} .icon=${this.value} .entity=${m.entity ?? ''}
      .current=${currentIconPick(this, a.module)} .iconStyle=${currentIconStyle(this, a.module)} @animated-icon-pick=${this._onAnimatedPick}></mc-animated-icon-grid>`;
  }

  private _openModal(): void {
    this._tab = 'icons';
    this._selectedIcon = this.value;
    this._searchQuery = '';
    this._active = -1;
    this._src = 'all';
    this._keep = undefined;
    this._editorFailed = false;
    this._showModal = true;
    void this._loadIcons();
    void listIcons(this.hass).then((l) => (this._lib = l));
  }

  private async _loadIcons(): Promise<void> {
    const icons = await loadIconList(this.hass?.hassUrl?.bind(this.hass));
    if (this._showModal) this._icons = icons;
  }

  private _closeModal(): void {
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
    const value = this._selectedIcon.trim();
    const keep = this._keep && value === `mcu:${this._keep.id}` ? this._keep : undefined;
    this._commit(value);
    // "Keep a copy in this card": written after the icon, in the same undo step
    const sm = keep ? cardState(this) : undefined;
    if (keep && sm && sm.attached !== false) sm.updateConfig(withKeptIcon(sm.getConfig(), keep.id, keep.on ? keep.svg : undefined), false);
    this._closeModal();
  }

  /** A saved icon becomes a drawing of this module (icon: svg), or opens the editor on a copy. */
  private async _fromSaved(mode: 'copy' | 'customise'): Promise<void> {
    const a = this.animated;
    const keep = this._keep;
    if (!a || !keep) return;
    const apply = (patch: { icon?: string; svg?: string }) => a.onModule(applyIconPatch(a.module as Record<string, unknown>, patch, this.syncCtx) as CardModule);
    if (mode === 'copy') {
      apply({ icon: 'svg', svg: keep.svg });
      this._closeModal();
      return;
    }
    const r = await this._openEditor({ kind: 'svg', svg: keep.svg });
    if (r === 'opened') this._closeModal();
  }

  private async _openEditor(source: Parameters<typeof openIconEditor>[0]['source']): Promise<'opened' | 'failed' | undefined> {
    const a = this.animated;
    if (!a) return undefined;
    this._editorFailed = false;
    const r = await openIconEditor({
      from: this,
      hass: this.hass,
      module: a.module as Record<string, unknown>,
      linked: !!this.syncCtx && hasTemplate(this.syncCtx),
      source,
      apply: (patch) => a.onModule(applyIconPatch(a.module as Record<string, unknown>, patch, this.syncCtx) as CardModule),
    });
    this._editorFailed = r === 'failed';
    return r;
  }

  private async _draw(): Promise<void> {
    if ((await this._openEditor({ kind: 'blank' })) === 'opened') this._closeModal();
  }

  /** The saved icons as list rows (id mcu:<id>). */
  private _mine(): IconListItem[] {
    const items = this._lib?.state === 'ok' ? this._lib.items : [];
    return items.map((i) => ({ id: `mcu:${i.id}`, name: i.name, prefix: 'mcu', search: [i.name, ...(i.keywords ?? [])].join(' ').toLowerCase() }));
  }

  private _noMcu?: { from: IconListItem[] | null; lib: unknown; list: IconListItem[] };

  /** The icon list without the `mcu:` set while the library answered (the My icons group shows those). */
  private _allIcons(): IconListItem[] {
    const from = this._icons;
    if (!from) return [];
    if (this._lib?.state !== 'ok') return from;
    if (this._noMcu?.from !== from || this._noMcu.lib !== this._lib) this._noMcu = { from, lib: this._lib, list: from.filter((i) => i.prefix !== 'mcu') };
    return this._noMcu.list;
  }

  private _syncKeep(): void {
    const id = this._selectedIcon.startsWith('mcu:') ? this._selectedIcon.slice(4) : '';
    if (id === this._keepFor) return;
    this._keepFor = id;
    this._keep = undefined;
    if (!id) return;
    void getIcon(this.hass, id).then((item) => {
      if (!item || this._keepFor !== id) return;
      const bytes = new TextEncoder().encode(item.svg).length;
      const had = !!cardState(this)?.getConfig().custom_icons?.[id];
      this._keep = { id, svg: item.svg, bytes, on: had || bytes <= KEEP_COPY_DEFAULT_MAX_BYTES };
    });
  }

  private _handleClear(): void {
    this._commit('');
    this._closeModal();
  }

  private _onInputChange(e: InputEvent): void {
    this._commit((e.target as HTMLInputElement).value);
  }

  /** Field focus before the press: a tap on a field that already has focus is for typing, any other tap opens the picker. */
  private _fieldWasFocused = false;

  private _onFieldPointerDown(e: PointerEvent): void {
    this._fieldWasFocused = this.shadowRoot?.activeElement === e.currentTarget;
  }

  private _onFieldClick(): void {
    if (!this._fieldWasFocused && !this._showModal) this._openModal();
  }

  private _onFieldKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown' && !e.altKey) {
      e.preventDefault();
      this._openModal();
    }
  }

  /** The rows shown for the current query: a typed full id that is not in the list leads, as "use as typed". */
  private _rows(): { rows: IconListItem[]; total: number; custom: boolean; mine: number } {
    const mine = this._mine();
    if (this._src === 'mine') {
      const r = searchIcons(mine, this._searchQuery, ICON_LIST_CAP);
      return { rows: r.items, total: r.total, custom: false, mine: r.items.length };
    }
    // Home Assistant lists the saved icons as an icon set too (the provider registers them): they are in the group above
    const all = this._allIcons();
    const { items, total } = searchIcons(all, this._searchQuery, ICON_LIST_CAP);
    const head = searchIcons(mine, this._searchQuery, MINE_GROUP_CAP).items;
    const typed = this._searchQuery.trim();
    if (isIconId(typed) && !items.some((i) => i.id.toLowerCase() === typed.toLowerCase()) && !head.some((i) => i.id.toLowerCase() === typed.toLowerCase())) {
      const prefix = typed.slice(0, typed.indexOf(':'));
      return { rows: [...head, { id: typed, name: iconDisplayName(typed), prefix, search: '' }, ...items], total: total + 1, custom: true, mine: head.length };
    }
    return { rows: [...head, ...items], total, custom: false, mine: head.length };
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

  protected willUpdate(): void {
    if (this._showModal) this._syncKeep();
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
          aria-label=${this.label || t('Icon')}
          spellcheck="false"
          @input=${this._onInputChange}
          @keydown=${this._onFieldKeydown}
          @pointerdown=${this._onFieldPointerDown}
          @click=${this._onFieldClick}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${t('Browse icons')}
          title=${t('Browse icons')}
          data-focus-key="icon-entry"
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

  /** The Use step of a saved icon: keep a copy in this card (default on up to 2 KB), copy or customise. */
  private _renderKeep(): TemplateResult | string {
    const k = this._keep;
    if (!k || this._selectedIcon.trim() !== `mcu:${k.id}`) return '';
    const kb = k.bytes < 1024 ? t('{n} B', { n: k.bytes }) : t('{size} KB', { size: (k.bytes / 1024).toFixed(1) });
    return html`<details class="mc-picker-keep">
      <summary>${t('Advanced')}</summary>
      <div class="switch-row">
        <div class="txt">
          <div class="field-head"><label for="mc-keep-copy">${t('Keep a copy in this card (adds {size})', { size: kb })}</label></div>
          <p class="help" id="mc-keep-help">${t('Without a copy, the card shows the default icon if Magic Card Utils or this icon is removed.')}</p>
        </div>
        <button type="button" class="switch" id="mc-keep-copy" role="switch" aria-checked=${k.on ? 'true' : 'false'} aria-describedby="mc-keep-help"
          @click=${() => (this._keep = { ...k, on: !k.on })}></button>
      </div>
      ${this.animated
        ? html`<div class="mc-picker-keep-actions">
            <button type="button" class="btn btn-text btn-sm" @click=${() => void this._fromSaved('copy')}>${t('Use as copy')}</button>
            <button type="button" class="btn btn-text btn-sm" @click=${() => void this._fromSaved('customise')}>${t('Customise a copy')}</button>
          </div>`
        : ''}
    </details>`;
  }

  private _renderModal(): TemplateResult {
    const { rows, total, mine } = this._rows();
    const lib = this._lib;
    const activeId = this._active >= 0 && this._active < rows.length ? `mc-icon-opt-${this._active}` : undefined;
    const selected = this._selectedIcon.trim().toLowerCase();
    const grid = !!this.animated && this._tab === 'animated';

    return html`
      ${renderPickerWindow(t('Select icon'), () => this._closeModal(), 'm', html`
          <div class="mc-picker-stack">
          ${this.animated ? this._renderTabs() : ''}
          ${grid ? html`<div class="mc-picker-list" role="tabpanel">${this._renderAnimated()}</div>` : html`
          ${lib?.state === 'ok'
            ? html`<div class="seg full" role="radiogroup" aria-label=${t('Icons from')}>
                ${(['all', 'mine'] as const).map((v) => html`<button type="button" role="radio" aria-checked=${this._src === v ? 'true' : 'false'} @click=${() => { this._src = v; this._active = -1; }}>${v === 'all' ? t('All') : t('My icons ({n})', { n: lib.items.length })}</button>`)}
              </div>`
            : ''}
          <div class="mc-picker-search">
            ${renderPickerSearch(t('Search icons'), this._searchQuery, (v) => this._onSearch(v), {
              onKeydown: (e) => this._onSearchKeydown(e),
              listId: 'mc-icon-list',
              activeId,
            })}
          </div>
          <p class="sr-only" role="status">${this._icons === null ? '' : total > 0 ? t('{n, plural, one {# icon found} other {# icons found}}', { n: total }) : t('No icons found')}</p>
          <div class="mc-picker-list" id="mc-icon-list" role="listbox" aria-label=${t('Icons')}>
            ${this._icons === null
              ? html`<div class="mc-picker-loading">${t('Loading icons…')}</div>`
              : rows.length > 0
                ? rows.map((icon, i) => html`
                    ${i === 0 && mine > 0 && this._src === 'all' ? html`<div class="mc-picker-category mc-picker-group">${t('My icons')} <button type="button" class="btn btn-text btn-sm" @click=${() => { this._src = 'mine'; }}>${t('Show all')}</button></div>` : ''}
                    ${i === mine && mine > 0 && this._src === 'all' ? html`<div class="mc-picker-category mc-picker-group">${t('Material Design icons')}</div>` : ''}
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
                : this._src === 'mine' && !this._searchQuery.trim()
                  ? html`<div class="mc-picker-empty">${t('No saved icons yet. Draw an icon, then choose Save to library in the editor.')}${this.animated ? html` <button type="button" class="btn btn-secondary" @click=${() => void this._draw()}>${t('Draw an icon')}</button>` : ''}</div>`
                  : html`<div class="mc-picker-empty">${t('No icons found. Type a full id, such as mdi:fan.')}${this.animated && this._src === 'mine' ? html` <button type="button" class="btn btn-secondary" @click=${() => { this._searchQuery = ''; }}>${t('Clear search')}</button> <button type="button" class="btn btn-secondary" @click=${() => void this._draw()}>${t('Draw an icon')}</button>` : ''}</div>`}
            ${total > rows.length
              ? html`<div class="mc-picker-more">${t('Showing {shown} of {total}. Refine the search to see more.', { shown: rows.length, total })}</div>`
              : ''}
          </div>`}
          ${grid ? '' : this._renderKeep()}
          </div>
          <div class="mc-picker-footer" slot="footer">
            ${grid ? '' : html`<button type="button" class="btn btn-text clear" @click=${this._handleClear}>${t('Clear')}</button>`}
            ${!grid && this.animated ? html`<button type="button" class="btn btn-text" data-focus-key="icon-entry" @click=${() => void this._draw()}>${t('Draw an icon')}</button>` : ''}
            ${this.animated ? html`<button type="button" class="btn btn-text" @click=${(e: Event) => void openLibrary(e.currentTarget as HTMLElement, this.hass, 'icon')}>${t('Library')}</button>` : ''}
            ${!grid && lib && lib.state === 'missing' ? html`<span class="help">${t('Keep your own icons: install the free Magic Card Utils add-on.')}</span>` : ''}
            ${this._editorFailed ? html`<span class="help error" role="alert">${t('The icon editor could not load. Try again.')}</span>` : ''}
            <span class="spacer"></span>
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
            ${grid ? '' : html`<button type="button" class="btn btn-primary" @click=${this._handleSave}>${t('Save')}</button>`}
          </div>
      `)}
    `;
  }
}
