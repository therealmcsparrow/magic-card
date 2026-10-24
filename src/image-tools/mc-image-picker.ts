import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ImageSummary } from '../contracts/mcu-library-images';
import { editorSystem } from '../css/editor-stack';
import { pickerStyles } from '../css/editor-css';
import { PickerWindowController, renderPickerSearch, renderPickerWindow } from '../editor/components/picker-parts';
import type { HomeAssistant } from '../types';
import { listImages, resetImages, type Listing } from './library';
import { THUMB_RE, shapeOf } from './model';
import { t } from './i18n';

/*
 * The picker the library image field opens with its Choose button: a window over images_list with search, one tile per
 * image (thumbnail, name, shape, size) and radio keys on the tiles (arrows move, Space selects, Enter selects and uses).
 * The image in use stays first. Events: `pick` (detail { id }) and `close`.
 */

const fold = (s: string): string => s.toLowerCase();
const kib = (bytes: number): number => Math.max(1, Math.round(bytes / 1024));

export class McImagePicker extends LitElement {
  static styles = [
    editorSystem,
    pickerStyles,
    css`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
        margin: 8px 0;
      }
      .pick {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: stretch;
        min-height: 90px;
        padding: 6px;
        text-align: left;
        font: inherit;
        color: inherit;
        background: var(--mc-surface, transparent);
        border: 1px solid var(--mc-field-border, currentColor);
        border-radius: 8px;
        cursor: pointer;
      }
      .pick[aria-checked='true'] {
        outline: 3px solid var(--mc-accent-ink, var(--primary-color));
        outline-offset: -1px;
      }
      .pick:focus-visible {
        outline: 2px solid var(--mc-focus, var(--primary-color));
        outline-offset: 2px;
      }
      .thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        overflow: hidden;
        border-radius: 4px;
        background: var(--mc-surface-2, rgba(128, 128, 128, 0.12));
      }
      .thumb img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .name {
        font-weight: 600;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        font-size: 0.85em;
        color: var(--mc-text-2, var(--secondary-text-color));
      }
      .tick {
        font-weight: 700;
      }
      .note {
        margin: 4px 0;
        font-size: 0.9em;
        color: var(--mc-text-2, var(--secondary-text-color));
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  /** Id of the image in use (shown first). */
  @property() current = '';
  /** The picker is for a background layer: live connections get a chip and a note. */
  @property({ type: Boolean }) background = false;
  /** Draw a new image is offered (an administrator with Magic Card Utils). */
  @property({ type: Boolean }) canDraw = false;

  @state() private _list?: Listing;
  @state() private _query = '';
  @state() private _sel = '';
  @state() private _at = 0;
  private _focusAfter = false;

  constructor() {
    super();
    new PickerWindowController(this, () => this._close());
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._sel = this.current;
    void this._load();
  }

  private async _load(): Promise<void> {
    this._list = undefined;
    this._list = await listImages(this.hass);
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private _use(): void {
    if (!this._sel) return;
    this.dispatchEvent(new CustomEvent('pick', { detail: { id: this._sel } }));
  }

  private _items(): ImageSummary[] {
    const items = this._list?.items ?? [];
    const q = fold(this._query.trim());
    const hit = q ? items.filter((i) => fold(`${i.name} ${i.id} ${(i.keywords ?? []).join(' ')} ${shapeOf(i.view_box)?.label ?? ''}`).includes(q)) : items;
    return [...hit].sort((a, b) => Number(b.id === this.current) - Number(a.id === this.current));
  }

  /** Tiles per row, read from the grid; 1 where the layout is not known. */
  private _cols(): number {
    const grid = this.shadowRoot?.querySelector<HTMLElement>('.grid');
    const n = grid ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length : 0;
    return n > 0 ? n : 1;
  }

  private _key(e: KeyboardEvent, items: ImageSummary[]): void {
    const last = items.length - 1;
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: this._cols(), ArrowUp: -this._cols() };
    let to: number | undefined;
    if (e.key in step) to = Math.max(0, Math.min(last, this._at + step[e.key]));
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    else if (e.key === 'Enter') {
      e.preventDefault();
      this._sel = items[this._at]?.id ?? this._sel;
      this._use();
      return;
    }
    if (to === undefined) return;
    e.preventDefault();
    this._at = to;
    this._focusAfter = true;
  }

  protected updated(): void {
    if (!this._focusAfter) return;
    this._focusAfter = false;
    this.shadowRoot?.querySelectorAll<HTMLElement>('.pick')[this._at]?.focus();
  }

  private _tile(i: ImageSummary, at: number): TemplateResult {
    const shape = shapeOf(i.view_box);
    const ratio = shape?.label ?? '';
    const sel = this._sel === i.id;
    const live = this.background && i.bindings > 0;
    const spoken = [i.name, ratio.replace(':', ' to '), t('{n} KiB', { n: kib(i.bytes) }), live ? t('{n, plural, one {# live connection} other {# live connections}}', { n: i.bindings }) : ''].filter(Boolean).join(', ');
    return html`<button type="button" class="pick" role="radio" data-id=${i.id} aria-checked=${sel ? 'true' : 'false'} tabindex=${at === this._at ? '0' : '-1'} aria-label=${spoken} @click=${() => { this._sel = i.id; this._at = at; }}>
      <span class="thumb" aria-hidden="true">${i.thumb && THUMB_RE.test(i.thumb) ? html`<img alt="" src=${i.thumb} />` : html`<ha-icon icon="mdi:image-outline"></ha-icon>`}</span>
      <span class="name" aria-hidden="true">${sel ? html`<span class="tick">✓ </span>` : nothing}${i.name}</span>
      <span class="meta" aria-hidden="true">
        ${i.id === this.current ? html`<span class="chip">${t('In use')}</span>` : nothing}
        ${ratio ? html`<span class="chip">${ratio}</span>` : nothing}
        <span>${t('{n} KiB', { n: kib(i.bytes) })}</span>
        ${live ? html`<span class="chip">◆ ${t('{n, plural, one {Live: # connection} other {Live: # connections}}', { n: i.bindings })}</span>` : nothing}
      </span>
    </button>`;
  }

  private _body(): TemplateResult {
    const l = this._list;
    if (!l) return html`<p class="mc-picker-loading" role="status">${t('Loading images…')}</p>`;
    if (l.state === 'missing') return html`<p class="mc-picker-empty" role="status">${t('Images need Magic Card Utils. It is installed through HACS, like Magic Card.')}</p>`;
    if (l.state === 'error') {
      return html`<div class="mc-picker-empty" role="alert">${t('The images could not be loaded.')}
        <button type="button" class="btn btn-secondary btn-sm" data-act="retry" @click=${() => { resetImages(); void this._load(); }}>${t('Try again')}</button></div>`;
    }
    if (!l.items.length) {
      return html`<div class="mc-picker-empty" role="status">${t('No images yet.')} ${this.canDraw
        ? html`<button type="button" class="btn btn-secondary btn-sm" data-act="draw" @click=${() => this.dispatchEvent(new CustomEvent('draw'))}>${t('Draw a new image')}</button>`
        : t('Ask an administrator to add one.')}</div>`;
    }
    const items = this._items();
    if (!items.length) return html`<p class="mc-picker-empty" role="status">${t('No image matches “{query}”.', { query: this._query.trim() })}</p>`;
    return html`<div class="grid" role="radiogroup" aria-label=${t('Images')} @keydown=${(e: KeyboardEvent) => this._key(e, items)}>${items.map((i, at) => this._tile(i, at))}</div>
      ${this.background ? html`<p class="note">${t('Thumbnails show the saved colours. On the card the live parts change with their devices.')}</p>` : nothing}`;
  }

  protected render(): TemplateResult {
    return renderPickerWindow(
      t('Pick an image'),
      () => this._close(),
      'm',
      html`<div class="mc-picker-search">${renderPickerSearch(t('Search images'), this._query, (v) => { this._query = v; this._at = 0; }, {
          onKeydown: (e) => {
            if (e.key !== 'ArrowDown') return;
            e.preventDefault();
            this._focusAfter = true;
            this._at = 0;
            this.requestUpdate();
          },
        })}</div>
        ${this._body()}
        <div class="mc-picker-footer" slot="footer">
          <button type="button" class="btn btn-secondary" data-act="cancel" @click=${() => this._close()}>${t('Cancel')}</button>
          <button type="button" class="btn btn-primary" data-act="use" ?disabled=${!this._sel} @click=${() => this._use()}>${t('Use this image')}</button>
        </div>`,
    );
  }

}
