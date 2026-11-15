import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { GALLERY_REPORT_URL } from '../contracts/look-index';
import type { HomeAssistant, MagicCardConfig } from '../types';
import { glyph, notice } from '../ui-kit';
import { t } from './i18n';
import { barTemplate, buildPreview, mountPreview, stageTemplate, type Preview } from './preview';
import { loadGallery, revokePreviews, type GalleryState, type GalleryTile } from './store';
import { galleryStyles, resolvedColour, selectedBorder } from './styles';
import { indexReason, reasonText, refusedTemplate, tileTemplate } from './tile';

export const GALLERY_TAG = 'mc-look-gallery';

/** The gate, read on demand: both Magic Card Utils switches on. */
export const galleryAllowed = (): boolean => {
  const s = (window as unknown as { magicCardUtils?: { settings?: { lookGallery?: boolean } } }).magicCardUtils?.settings;
  return s?.lookGallery === true;
};

const KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];

export class MagicCardLookGallery extends LitElement {
  static styles = galleryStyles;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: MagicCardConfig;
  /** Keep: the new config and the kept look's name. */
  @property({ attribute: false }) onKeep: (config: MagicCardConfig, name: string) => void = () => undefined;
  /** The gallery was left: Back, the gate turned off, or the element left the page. */
  @property({ attribute: false }) onLeave: () => void = () => undefined;

  @state() private _s: GalleryState | null = null;
  @state() private _failed = false;
  @state() private _preview: Preview | null = null;
  @state() private _stop = 0;
  private _focusFirst = false;
  private _run = 0;

  get state(): GalleryState | null {
    return this._s;
  }

  /** Ends a preview; false when none was open. */
  cancelPreview(): boolean {
    const p = this._preview;
    if (!p) return false;
    this._preview = null;
    void this.updateComplete.then(() => this._focusTile(p.tile.id));
    return true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mcu-settings', this._onSettings);
    void this._load();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('mcu-settings', this._onSettings);
    this._run++;
    this.onLeave();
  }

  private _onSettings = (): void => {
    if (!galleryAllowed()) this.onLeave();
  };

  private async _load(): Promise<void> {
    const run = ++this._run;
    if (this._s) revokePreviews(this._s);
    this._s = null;
    this._failed = false;
    this._preview = null;
    let s: GalleryState | null;
    try {
      s = await loadGallery({ allowed: galleryAllowed() });
    } catch {
      s = null;
    }
    if (run !== this._run) return;
    if (s && s.status === 'off') {
      this.onLeave();
      return;
    }
    this._failed = s === null;
    this._s = s;
    this._focusFirst = true;
  }

  private _tiles(): GalleryTile[] {
    return this._s ? this._s.tiles.filter((x) => x.state === 'ok') : [];
  }

  private _radios(): HTMLElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLElement>('[role=radiogroup] [role=radio]'));
  }

  private _focusTile(id: string): void {
    const i = this._tiles().findIndex((x) => x.id === id);
    if (i < 0) return;
    this._stop = i;
    void this.updateComplete.then(() => this._radios()[i]?.focus());
  }

  private _pick(tile: GalleryTile): void {
    const p = buildPreview(this.config, tile);
    if (!p) return;
    this._stop = Math.max(0, this._tiles().indexOf(tile));
    this._preview = p;
  }

  private _keep(): void {
    const p = this._preview;
    if (p) this.onKeep(p.config, p.tile.name);
  }

  private _key(e: KeyboardEvent): void {
    const radios = this._radios();
    const i = radios.indexOf(e.composedPath().find((n) => radios.includes(n as HTMLElement)) as HTMLElement);
    if (i < 0) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tile = this._tiles()[i];
      if (tile) this._pick(tile);
      return;
    }
    if (!KEYS.includes(e.key)) return;
    e.preventDefault();
    const rtl = getComputedStyle(this).direction === 'rtl';
    const next = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || e.key === 'ArrowDown';
    const prev = e.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || e.key === 'ArrowUp';
    const n = radios.length;
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : next ? (i + 1) % n : prev ? (i - 1 + n) % n : i;
    this._stop = to;
    radios[to]?.focus();
  }

  protected updated(changed: PropertyValues): void {
    const head = this.renderRoot.querySelector<HTMLElement>('.head');
    if (head && changed.has('_s') && this._s) {
      const ink = selectedBorder(resolvedColour(head, '--mc-accent-ink'), resolvedColour(head, '--mc-surface'), resolvedColour(head, '--mc-accent-tint'));
      if (ink === 'text') this.setAttribute('data-ink', 'text');
      else this.removeAttribute('data-ink');
    }
    if (this._preview) mountPreview(this.renderRoot, this._preview, this.hass);
    if (this._focusFirst && (this._s || this._failed)) {
      this._focusFirst = false;
      (this._radios()[0] ?? this.renderRoot.querySelector<HTMLElement>('[role=alert] button'))?.focus();
    }
    const bar = this.renderRoot.querySelector<HTMLElement>('.bar');
    if (bar) this.style.setProperty('--bar-h', `${bar.offsetHeight}px`);
    else this.style.removeProperty('--bar-h');
  }

  private _report(label: string): TemplateResult {
    return html`<a class="report" href=${GALLERY_REPORT_URL} target="_blank" rel="noopener noreferrer" aria-label=${t('look-gallery.window.report-open')}>${label}</a>`;
  }

  private _retry(): TemplateResult {
    return html`<button type="button" class="btn btn-secondary" @click=${() => void this._load()}>${t('look-gallery.window.retry')}</button>`;
  }

  private _notices(s: GalleryState): TemplateResult | typeof nothing {
    const items: TemplateResult[] = [];
    if (s.savedCopy) {
      const code = s.error ? indexReason(s.error) : null;
      items.push(
        code && code !== 'N-FETCH'
          ? notice({ tone: 'warn', text: t('look-gallery.window.notice-refused', { reason: reasonText(code), code }) })
          : notice({ tone: 'info', text: t('look-gallery.window.notice-saved') }),
      );
    }
    if (s.old) items.push(notice({ tone: 'warn', text: t('look-gallery.window.notice-old') }));
    return items.length ? html`<div class="notices">${items}</div>` : nothing;
  }

  private _problem(title: string, body: string, code: string | null, report: boolean): TemplateResult {
    return html`<div class="notices">
      <div role="alert">
        <h3>${title}</h3>
        <p>${body}</p>
        ${code ? html`<p class="code">${t('look-gallery.window.error-code', { code })}</p>` : nothing}
        <div class="buttons">${this._retry()}${report ? this._report(t('look-gallery.window.report')) : nothing}</div>
      </div>
    </div>`;
  }

  private _body(): TemplateResult {
    const s = this._s;
    if (this._failed) return this._problem(t('look-gallery.window.error-title'), reasonText('N-FETCH'), null, false);
    if (!s) {
      return html`<div class="grid" aria-busy="true">${[0, 1, 2, 3, 4, 5].map(() => html`<div class="skeleton"></div>`)}</div>`;
    }
    if (s.status === 'empty') {
      if (!s.error) return html`<div class="notices"><h3>${t('look-gallery.window.zero-title')}</h3></div>`;
      const code = indexReason(s.error);
      return code === 'N-FETCH'
        ? this._problem(t('look-gallery.window.offline-title'), t('look-gallery.window.offline-body'), null, false)
        : this._problem(t('look-gallery.window.error-title'), reasonText(code), code, true);
    }
    const tiles = this._tiles();
    const refused = s.tiles.filter((x) => x.state === 'refused');
    return html`${this._notices(s)}
      ${tiles.length || refused.length
        ? nothing
        : html`<div class="notices"><h3>${t('look-gallery.window.zero-title')}</h3></div>`}
      ${this._preview ? stageTemplate(this._preview) : nothing}
      <div class="grid" role="radiogroup" aria-label=${t('look-gallery.window.grid-label')} @keydown=${(e: KeyboardEvent) => this._key(e)}>
        ${tiles.map((x, i) =>
          tileTemplate(x, {
            selected: this._preview?.tile === x,
            tabindex: i === this._stop ? 0 : -1,
            onPick: () => this._pick(x),
          }),
        )}
      </div>
      ${refusedTemplate(refused)}
      ${this._preview
        ? barTemplate(this._preview, {
            onDetails: () => (this._preview = { ...this._preview!, open: !this._preview!.open }),
            onPlay: () => (this._preview = { ...this._preview!, paused: !this._preview!.paused }),
            onCancel: () => void this.cancelPreview(),
            onKeep: () => this._keep(),
          })
        : nothing}`;
  }

  protected render(): TemplateResult {
    return html`<div class="head">
        <button type="button" class="btn btn-secondary" ?hidden=${!!this._preview} @click=${() => this.onLeave()}>${glyph('back', 18)}${t('look-gallery.window.back')}</button>
      </div>
      <p class="intro">${t('look-gallery.window.intro')}</p>
      <div class="live" role="status">${this._s || this._failed ? nothing : t('look-gallery.window.loading')}</div>
      ${this._body()}`;
  }
}

if (!customElements.get(GALLERY_TAG)) customElements.define(GALLERY_TAG, MagicCardLookGallery);
