import { LitElement, html, nothing, svg } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { PropertyDeclarations, PropertyValues, TemplateResult } from 'lit';
import { FORUM_SHOT_CONTRACT_VERSION } from '../contracts/forum-shot';
import type { ForumShotErrorCode, ForumShotLook, ForumShotMode, ForumShotSheet, MagicCardRef } from '../contracts/forum-shot';
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

  hass?: LocaleHassLike & WsHass & { user?: { is_admin?: boolean }; panels?: Record<string, { title?: string | null } | undefined> };
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
  private _previewUrl?: string;
  private _saved = false;
  private _started = false;
  private _timers = new Set<number>();

  connectedCallback(): void {
    super.connectedCallback();
    this._started = false;
    this._sort = null;
    this.requestUpdate();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const id of this._timers) clearTimeout(id);
    this._timers.clear();
    this._dropPreview();
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
    this.requestUpdate();
    try {
      const config = await cardConfigOf(this.hass ?? {}, ref);
      const modes: ForumShotMode[] = this._mode === 'both' ? ['light', 'dark'] : [this._mode];
      const looks: ForumShotLook[] = this._looks ? ALL_LOOKS : ['as-configured'];
      const sheet = await renderSheet(this.hass ?? {}, { config, modes, looks }, { lookSource: iconLibraryLookSource });
      this._dropPreview();
      this._previewUrl = URL.createObjectURL(sheet.blob);
      this._sheet = sheet;
      this._save(sheet);
      this._saved = true;
    } catch (e) {
      this._error = codeOf(e);
    }
    this._busy = false;
    this.requestUpdate();
  }

  private _errorText(code: ForumShotErrorCode): string {
    switch (code) {
      case 'remote_asset':
        return this._picked()?.remote.includes(CUSTOM_CARD) ? t('forum-shot.element.custom-card') : t('forum-shot.element.remote-asset');
      case 'card_not_defined':
        return t('forum-shot.element.error-card-not-defined');
      case 'too_large':
        return t('forum-shot.element.error-too-large');
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
    return typeof title === 'string' && title.trim() ? title.trim() : t('forum-shot.card-table.default-dashboard');
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

  private _status(c: MagicCardRef, i: number): TemplateResult {
    if (c.lock === null) {
      return html`<span class="status ok"
          ><svg viewBox="0 0 24 24" aria-hidden="true">${svg`<path d="M5 12.5l4.5 4.5L19 7.5" />`}</svg>${t('forum-shot.card-table.status-available')}</span
        >${c.fontHosts.length ? html`<span class="hint">${t('forum-shot.card-table.fonts-from', { hosts: c.fontHosts.join(', ') })}</span>` : nothing}`;
    }
    return html`<span class="status locked"
        ><svg viewBox="0 0 24 24" aria-hidden="true">${svg`<path d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z" />`}</svg>${t('forum-shot.card-table.status-locked')}</span
      ><span class="hint" id="card-note-${i}">${this._reason(c.lock)}</span>`;
  }

  private _renderCards(): TemplateResult {
    const fallback = this._defaultName();
    const rows = sortedRows(this._cards, this._sort, this._locale(), fallback);
    return html`<table role="table" aria-label=${t('forum-shot.element.cards-legend')}>
      <thead role="rowgroup">
        <tr role="row">
          ${SORT_KEYS.map((k) => {
            const sort = this._sort?.key === k ? this._sort.dir : 'none';
            return html`<th role="columnheader" scope="col" aria-sort=${sort}>
              <button type="button" class="sort" @click=${() => this._sortBy(k)}>${this._columnLabel(k)}</button>
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
                if (!off && !(e.target as Element).closest('input, label, button')) this._select(key);
              }}
            >
              <td role="cell" data-label=${t('forum-shot.card-table.column-dashboard')}>${dashboardName(c, fallback)}</td>
              <td role="cell" data-label=${t('forum-shot.card-table.column-view')}>${c.view}</td>
              <td role="cell" data-label=${t('forum-shot.card-table.column-card')}>
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
              <td role="cell" data-label=${t('forum-shot.card-table.column-status')}>${this._status(c, i)}</td>
            </tr>`;
          },
        )}
      </tbody>
    </table>`;
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
    if (this._load === 'loading') return html`<p role="status" class="loading">${t('forum-shot.element.loading')}</p>`;
    if (this._load === 'empty') return html`<p role="status" class="empty">${t('forum-shot.element.no-cards')}</p>`;
    if (this._load === 'error') {
      return html`<p role="alert" class="error">${this._errorText(this._loadError ?? 'config_read_failed')}</p>
        <button type="button" class="retry" @click=${() => void this._read()}>${t('forum-shot.element.retry')}</button>`;
    }
    const blocked = !this._picked();
    return html`
      ${this.hass?.user?.is_admin === false ? html`<p class="admin-note">${t('forum-shot.element.admin-only')}</p>` : nothing}
      ${this._renderCards()}
      <fieldset>
        <legend>${t('forum-shot.element.modes-legend')}</legend>
        ${this._modeOption('both', t('forum-shot.element.mode-both'))} ${this._modeOption('light', t('forum-shot.element.mode-light'))}
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
      <p>${t('forum-shot.element.local-only')}</p>
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
      ${this._previewUrl && this._sheet
        ? html`<img class="preview" src=${this._previewUrl} width=${this._sheet.width / 2} height=${this._sheet.height / 2} alt=${t('forum-shot.element.preview-alt')} />
            ${this._sheet.notices.includes('remote_placeholder') ? html`<p class="notices">${t('forum-shot.element.notice-remote-placeholder')}</p>` : nothing}`
        : nothing}
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
