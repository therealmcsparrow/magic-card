import { LitElement, html, nothing } from 'lit';
import type { PropertyDeclarations, PropertyValues, TemplateResult } from 'lit';
import { FORUM_SHOT_CONTRACT_VERSION } from '../contracts/forum-shot';
import type { ForumShotErrorCode, ForumShotLook, ForumShotMode, ForumShotSheet, MagicCardRef } from '../contracts/forum-shot';
import type { LocaleHassLike } from '../contracts/i18n';
import { setI18nLocale } from '../i18n/runtime';
import { t } from './i18n';
import { cardConfigOf, codeOf, iconLibraryLookSource, listMagicCards } from './pick';
import type { WsHass } from './pick';
import { renderSheet } from './sheet';
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

  hass?: LocaleHassLike & WsHass & { user?: { is_admin?: boolean } };
  narrow = false;

  static styles = forumShotStyles;

  private _load: Load = 'loading';
  private _loadError?: ForumShotErrorCode;
  private _cards: MagicCardRef[] = [];
  private _pick = -1;
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
      if (this._pick >= this._cards.length || this._cards[this._pick]?.remote.length) this._pick = -1;
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
    const ref = this._cards[this._pick];
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
        return t('forum-shot.element.remote-asset');
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

  private _renderCards(): TemplateResult {
    return html`<fieldset>
      <legend>${t('forum-shot.element.cards-legend')}</legend>
      ${this._cards.map((c, i) => {
        const off = c.remote.length > 0;
        return html`<div class="choice ${off ? 'off' : ''}">
          <input
            type="radio"
            name="card"
            id="card-${i}"
            .checked=${this._pick === i}
            ?disabled=${off}
            aria-describedby=${off ? `card-note-${i}` : nothing}
            @change=${() => {
              this._pick = i;
              this._error = undefined;
              this.requestUpdate();
            }}
          />
          <label for="card-${i}"
            >${c.label}${off ? html`<span class="hint" id="card-note-${i}">${t('forum-shot.element.remote-asset')}</span>` : nothing}</label
          >
        </div>`;
      })}
    </fieldset>`;
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
    const blocked = this._pick < 0;
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
