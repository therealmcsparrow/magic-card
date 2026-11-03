import { LitElement, html, nothing, svg } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { PropertyDeclarations, PropertyValues, TemplateResult } from 'lit';
import { FORUM_SHOT_CONTRACT_VERSION } from '../contracts/forum-shot';
import type {
  ForumShotErrorCode,
  ForumShotLook,
  ForumShotMode,
  ForumShotSheet,
  MagicCardRef,
} from '../contracts/forum-shot';
import type { LocaleHassLike } from '../contracts/i18n';
import { setI18nLocale } from '../i18n/runtime';
import { t } from './i18n';
import { cardConfigOf, codeOf, iconLibraryLookSource, listMagicCards } from './pick';
import type { WsHass } from './pick';
import { dashboardName, rowKey, SORT_KEYS, sortedRows } from './card-table';
import type { Sort, SortKey } from './card-table';
import { renderSheet } from './sheet';
import { CUSTOM_CARD } from './remote';
import { forumShotStyles } from './styles';

type ModeChoice = 'both' | ForumShotMode;
type Load = 'loading' | 'ready' | 'empty' | 'error';
const ALL_LOOKS: ForumShotLook[] = ['quiet', 'living', 'glow'];
const REVOKE_DELAY_MS = 1000;

/** File name with the local time before the extension; no dashboard, view or card name. */
function timedName(base: string, now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
  return base.replace(/(\.[a-z]+)?$/, `-${stamp}$1`);
}

/** <magic-card-forum-shot>: the forum shot host. The panel sets `hass` and `narrow`; the element reads dashboards through hass.callWS only. */
export class MagicCardForumShot extends LitElement {
  static readonly contractVersion = FORUM_SHOT_CONTRACT_VERSION;

  static properties: PropertyDeclarations = {
    hass: { attribute: false },
    narrow: { type: Boolean, reflect: true },
  };

  hass?: LocaleHassLike &
    WsHass & {
      user?: { is_admin?: boolean };
      panels?: Record<string, { title?: string | null } | undefined>;
    };
  narrow = false;

  static styles = forumShotStyles;

  private _load: Load = 'loading';
  private _loadError?: ForumShotErrorCode;
  private _cards: MagicCardRef[] = [];
  private _pick = '';
  private _sort: Sort | null = null;
  private _mode: ModeChoice = 'both';
  private _looks = false;
  private _busy = false;
  private _error?: ForumShotErrorCode;
  private _sheet?: ForumShotSheet;
  private _sheetFont = false;
  private _previewUrl?: string;
  private _saved = false;
  private _started = false;
  private _timers = new Set<number>();
  private _tip: string | null = null;
  private _watching = false;
  private readonly _onPointerDown = (e: Event): void => {
    const row = this.renderRoot.querySelector('.pop')?.closest('tr');
    const path = e.composedPath();
    const tip = (n: EventTarget) => (n as Element).matches?.('.pop, button.tip');
    if (!row || !path.includes(row) || (row.className !== 'off' && !path.some(tip)))
      this._close();
  };
  private readonly _onResize = (): void => this._place();

  connectedCallback(): void {
    super.connectedCallback();
    this._started = false;
    this._sort = null;
    this._forget();
    this.requestUpdate();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const id of this._timers) clearTimeout(id);
    this._timers.clear();
    this._forget();
    this._dropPreview();
  }

  protected updated(): void {
    if (this._tip !== null) this._place();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass')) {
      setI18nLocale(this.hass);
      if (!this._started && typeof this.hass?.callWS === 'function') {
        this._started = true;
        void this._read();
      }
    }
  }

  private async _read(): Promise<void> {
    this._forget();
    this._load = 'loading';
    this._loadError = undefined;
    this.requestUpdate();
    try {
      this._cards = await listMagicCards(this.hass ?? {});
      this._load = 'ready';
      if (!this._cards.some((c) => rowKey(c) === this._pick && c.lock === null)) this._pick = '';
    } catch (e) {
      const code = codeOf(e);
      this._load = code === 'no_cards' ? 'empty' : 'error';
      this._loadError = code;
    }
    this.requestUpdate();
  }

  private _dropPreview(): void {
    if (this._previewUrl) URL.revokeObjectURL(this._previewUrl);
    this._previewUrl = undefined;
  }

  /** Saves the PNG through a blob: URL made here and revoked shortly after; nothing is stored. */
  private _save(sheet: ForumShotSheet): void {
    const url = URL.createObjectURL(sheet.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = timedName(sheet.fileName);
    a.click();
    const id = window.setTimeout(() => {
      this._timers.delete(id);
      URL.revokeObjectURL(url);
    }, REVOKE_DELAY_MS);
    this._timers.add(id);
  }

  private async _download(): Promise<void> {
    const ref = this._picked();
    if (!ref || this._busy) return;
    this._busy = true;
    this._error = undefined;
    this._saved = false;
    this._dropPreview();
    this._sheet = undefined;
    this.requestUpdate();
    try {
      const config = await cardConfigOf(this.hass ?? {}, ref);
      const modes: ForumShotMode[] = this._mode === 'both' ? ['light', 'dark'] : [this._mode];
      const looks: ForumShotLook[] = this._looks ? ALL_LOOKS : ['as-configured'];
      const sheet = await renderSheet(
        this.hass ?? {},
        { config, modes, looks, fontHosts: ref.fontHosts },
        { lookSource: iconLibraryLookSource },
      );
      this._dropPreview();
      this._previewUrl = URL.createObjectURL(sheet.blob);
      this._sheet = sheet;
      this._sheetFont = ref.fontHosts.length > 0;
      this._save(sheet);
      this._saved = true;
    } catch (e) {
      const code = codeOf(e);
      if (code === 'hosts_changed') await this._read();
      this._error = code;
    }
    this._busy = false;
    this.requestUpdate();
  }

  private _errorText(code: ForumShotErrorCode): string {
    switch (code) {
      case 'remote_asset':
        return this._picked()?.remote.includes(CUSTOM_CARD)
          ? t('forum-shot.element.custom-card')
          : t('forum-shot.element.remote-asset');
      case 'card_not_defined':
        return t('forum-shot.element.error-card-not-defined');
      case 'too_large':
        return t('forum-shot.element.error-too-large');
      case 'font_unavailable':
        return t('forum-shot.element.error-font-unavailable');
      case 'hosts_changed':
        return t('forum-shot.element.error-hosts-changed');
      case 'config_read_failed':
        return t('forum-shot.element.config-read-failed');
      default:
        return t('forum-shot.element.error-capture-failed');
    }
  }

  private _picked(): MagicCardRef | undefined {
    return this._cards.find((c) => rowKey(c) === this._pick);
  }

  private _locale(): string {
    return this.hass?.locale?.language ?? this.hass?.language ?? 'en';
  }

  private _defaultName(): string {
    const title = this.hass?.panels?.lovelace?.title;
    return typeof title === 'string' && title.trim()
      ? title.trim()
      : t('forum-shot.card-table.default-dashboard');
  }

  private _select(key: string): void {
    this._pick = key;
    this._error = undefined;
    this.requestUpdate();
  }

  private _sortBy(key: SortKey): void {
    const same = this._sort?.key === key;
    this._sort = { key, dir: same && this._sort?.dir === 'ascending' ? 'descending' : 'ascending' };
    this.requestUpdate();
  }

  private _columnLabel(key: SortKey): string {
    switch (key) {
      case 'dashboard':
        return t('forum-shot.card-table.column-dashboard');
      case 'view':
        return t('forum-shot.card-table.column-view');
      case 'card':
        return t('forum-shot.card-table.column-card');
      default:
        return t('forum-shot.card-table.column-status');
    }
  }

  private _reason(lock: NonNullable<MagicCardRef['lock']>): string {
    switch (lock) {
      case 'custom_card':
        return t('forum-shot.card-table.reason-custom-card');
      case 'limit':
        return t('forum-shot.card-table.reason-limit');
      case 'outside_address':
        return t('forum-shot.card-table.reason-outside-address');
      default:
        return t('forum-shot.card-table.reason-cannot-judge');
    }
  }

  /** Forgets the open status details and stops listening for the outside. */
  private _forget(): void {
    this._tip = null;
    if (!this._watching) return;
    this._watching = false;
    document.removeEventListener('pointerdown', this._onPointerDown, true);
    window.removeEventListener('resize', this._onResize);
  }

  private _toggle(key: string): void {
    if (this._tip === key) {
      this._close();
      return;
    }
    this._tip = key;
    if (!this._watching) {
      this._watching = true;
      document.addEventListener('pointerdown', this._onPointerDown, true);
      window.addEventListener('resize', this._onResize);
    }
    this.requestUpdate();
    void this.updateComplete.then(() => {
      if (this._tip === key)
        this.renderRoot.querySelector<HTMLElement>('.pop button')?.focus({ preventScroll: true });
    });
  }

  /** Closes the status details; focus goes back to the button when it was inside them or on the button. */
  private _close(): void {
    if (this._tip === null) return;
    const root = this.renderRoot as ShadowRoot;
    const button = root.querySelector<HTMLElement>('button.tip[aria-expanded="true"]');
    const at = root.activeElement;
    const mine = !!at && (at === button || !!root.querySelector('.pop')?.contains(at));
    this._forget();
    if (mine) button?.focus({ preventScroll: true });
    this.requestUpdate();
  }

  /** Puts the details under the button, centred and kept inside the section, or above it when there is no room below. */
  private _place(): void {
    const pop = this.renderRoot.querySelector<HTMLElement>('.pop');
    const button = this.renderRoot.querySelector<HTMLElement>('button.tip[aria-expanded="true"]');
    const box = this.renderRoot.querySelector('section');
    if (!pop || !button || !box) return;
    const b = button.getBoundingClientRect();
    const s = box.getBoundingClientRect();
    const p = pop.getBoundingClientRect();
    const left = Math.max(
      0,
      Math.min(b.left - s.left + (b.width - p.width) / 2, s.width - p.width),
    );
    const above = b.top - 4 - p.height;
    const flip = b.bottom + 4 + p.height > window.innerHeight - 8 && above >= Math.max(s.top, 8);
    pop.style.left = `${left}px`;
    pop.style.top = `${(flip ? above : b.bottom + 4) - s.top}px`;
  }

  private _status(c: MagicCardRef, i: number, key: string): TemplateResult {
    const locked = c.lock !== null;
    const open = this._tip === key;
    const label = locked
      ? t('forum-shot.card-table.status-button-locked')
      : t('forum-shot.card-table.status-button-available');
    const reason = c.lock === null ? '' : this._reason(c.lock);
    const icon = locked
      ? svg`<path d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z" />`
      : svg`<path d="M5 12.5l4.5 4.5L19 7.5" />`;
    return html`<button
        type="button"
        class="tip"
        aria-label=${label}
        title=${label}
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls=${open ? `card-pop-${i}` : nothing}
        @click=${() => this._toggle(key)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>
      </button>
      ${locked ? html`<span id="card-note-${i}" hidden>${reason}</span>` : nothing}
      ${
        open
          ? html`<div
              class="pop"
              id="card-pop-${i}"
              role="dialog"
              aria-labelledby="card-pop-${i}-h"
              @focusout=${(e: FocusEvent) => {
                const to = e.relatedTarget as Element | null;
                if (to && !to.matches('.pop *, .scroll, button.tip') && this._tip === key)
                  this._close();
              }}
            >
              <p class="pop-h" id="card-pop-${i}-h">
                ${locked ? t('forum-shot.card-table.status-locked') : t('forum-shot.card-table.status-available')}
              </p>
              <p>${locked ? reason : t('forum-shot.card-table.status-detail-available')}</p>
              ${c.fontHosts.length ? html`<p class="fonts">${t('forum-shot.card-table.fonts-from', { hosts: c.fontHosts.join(', ') })}</p>` : nothing}
              <button type="button" class="close" @click=${() => this._close()}>
                ${t('forum-shot.card-table.status-close')}
              </button>
            </div>`
          : nothing
      }`;
  }

  private _renderCards(): TemplateResult {
    const fallback = this._defaultName();
    const rows = sortedRows(this._cards, this._sort, this._locale(), fallback);
    return html`<div
      class="scroll"
      role="region"
      tabindex="0"
      aria-label=${t('forum-shot.element.cards-legend')}
      @scroll=${() => this._close()}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Escape' && this._tip !== null) this._close();
      }}
    >
      <table role="table">
        <thead role="rowgroup">
          <tr role="row">
            ${SORT_KEYS.map((k) => {
              const sort = this._sort?.key === k ? this._sort.dir : 'none';
              return html`<th role="columnheader" scope="col" aria-sort=${sort}>
                <button type="button" class="sort" @click=${() => this._sortBy(k)}>
                  ${this._columnLabel(k)}
                </button>
              </th>`;
            })}
          </tr>
        </thead>
        <tbody role="rowgroup">
          ${repeat(
            rows,
            (c) => rowKey(c),
            (c) => {
              const i = this._cards.indexOf(c);
              const off = c.lock !== null;
              const key = rowKey(c);
              return html`<tr
                role="row"
                class=${off ? 'off' : this._pick === key ? 'picked' : ''}
                @click=${(e: Event) => {
                  const hit = e.target as Element;
                  if (off) {
                    if (!hit.closest('button, .pop')) this._toggle(key);
                  } else if (!hit.closest('input, label, button, .pop')) this._select(key);
                }}
              >
                <td role="cell">${dashboardName(c, fallback)}</td>
                <td role="cell">${c.view}</td>
                <td role="cell">
                  <span class="choice">
                    <input
                      type="radio"
                      name="card"
                      id="card-${i}"
                      .checked=${this._pick === key}
                      ?disabled=${off}
                      aria-describedby=${off ? `card-note-${i}` : nothing}
                      @change=${() => this._select(key)}
                    />
                    <label for="card-${i}">${c.cardName}</label>
                  </span>
                </td>
                <td role="cell" class="state">${this._status(c, i, key)}</td>
              </tr>`;
            },
          )}
        </tbody>
      </table>
    </div>`;
  }

  private _modeOption(value: ModeChoice, label: string): TemplateResult {
    return html`<div class="choice">
      <input
        type="radio"
        name="mode"
        id="mode-${value}"
        .value=${value}
        .checked=${this._mode === value}
        @change=${() => {
          this._mode = value;
          this.requestUpdate();
        }}
      />
      <label for="mode-${value}">${label}</label>
    </div>`;
  }

  private _renderBody(): TemplateResult {
    if (this._load === 'loading')
      return html`<p role="status" class="loading">${t('forum-shot.element.loading')}</p>`;
    if (this._load === 'empty')
      return html`<p role="status" class="empty">${t('forum-shot.element.no-cards')}</p>`;
    if (this._load === 'error') {
      return html`<p role="alert" class="error">
          ${this._errorText(this._loadError ?? 'config_read_failed')}
        </p>
        <button type="button" class="retry" @click=${() => void this._read()}>
          ${t('forum-shot.element.retry')}
        </button>`;
    }
    const blocked = !this._picked();
    const fontHosts = this._picked()?.fontHosts ?? [];
    return html`
      ${this.hass?.user?.is_admin === false ? html`<p class="admin-note">${t('forum-shot.element.admin-only')}</p>` : nothing}
      ${this._renderCards()}
      <fieldset>
        <legend>${t('forum-shot.element.modes-legend')}</legend>
        ${this._modeOption('both', t('forum-shot.element.mode-both'))}
        ${this._modeOption('light', t('forum-shot.element.mode-light'))}
        ${this._modeOption('dark', t('forum-shot.element.mode-dark'))}
      </fieldset>
      <div class="choice">
        <input
          type="checkbox"
          class="looks"
          id="looks"
          .checked=${this._looks}
          @change=${(e: Event) => {
            this._looks = (e.target as HTMLInputElement).checked;
            this.requestUpdate();
          }}
        />
        <label for="looks">${t('forum-shot.element.looks')}</label>
      </div>
      <p class="privacy">${t('forum-shot.element.privacy-hint')}</p>
      ${
        fontHosts.length
          ? html`<p class="font-contact">
                ${t('forum-shot.element.font-host-contact', { hosts: fontHosts.join(', ') })}
              </p>
              <p>${t('forum-shot.element.local-only-font')}</p>`
          : html`<p>${t('forum-shot.element.local-only')}</p>`
      }
      <button
        type="button"
        class="download"
        aria-disabled=${blocked ? 'true' : 'false'}
        aria-busy=${this._busy ? 'true' : 'false'}
        aria-describedby=${blocked ? 'pick-hint' : nothing}
        @click=${() => {
          if (!blocked && !this._busy) void this._download();
        }}
      >
        ${t('forum-shot.element.download')}
      </button>
      ${blocked ? html`<span class="hint" id="pick-hint">${t('forum-shot.element.pick-first')}</span>` : nothing}
      ${this._busy ? html`<p role="status" class="busy">${t('forum-shot.element.making')}</p>` : nothing}
      ${this._error ? html`<p role="alert" class="error">${this._errorText(this._error)}</p>` : nothing}
      ${this._saved && !this._busy ? html`<p role="status" class="done">${t('forum-shot.element.saved')}</p>` : nothing}
      ${
        this._previewUrl && this._sheet
          ? html`<img
                class="preview"
                src=${this._previewUrl}
                width=${this._sheet.width / 2}
                height=${this._sheet.height / 2}
                alt=${t('forum-shot.element.preview-alt')}
              />
              ${this._sheet.notices.includes('remote_placeholder') ? html`<p class="notices">${this._sheetFont ? t('forum-shot.element.notice-remote-placeholder-font') : t('forum-shot.element.notice-remote-placeholder')}</p>` : nothing}`
          : nothing
      }
    `;
  }

  protected render(): TemplateResult {
    return html`<section role="region" aria-label=${t('forum-shot.element.forum-shot')}>
      <h2>${t('forum-shot.element.forum-shot')}</h2>
      <p>${t('forum-shot.element.intro')}</p>
      ${this._renderBody()}
    </section>`;
  }
}
