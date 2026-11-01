import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { editorTokens } from '../../css/editor-system';
import { editorPrimitives } from '../../ui-kit/css/primitives';
import { resolveIconGeometry } from '../../icons/icon-source';
import { iconDisplayName } from '../../utils/icon-list';
import type { AnimationDoc } from '../model';
import { ICON_RE } from '../model';
import { editorDefined } from '../editor-slots';
import { iconAnimationDoc } from '../../icon-anim/icon-doc';
import type { LibraryEntry } from '../../icon-anim/library';
import { iconLibraryIfLoaded, loadIconLibrary, type IconLibrary } from '../icon-library-loader';
import { standaloneHass } from '../studio-stage';
import { t, m, type MessageId } from '../i18n';

type CardElement = HTMLElement & { setConfig(c: unknown): void; hass?: unknown };

/**
 * A library entry's live thumbnail: a small transparent magic-card whose icon module plays the
 * entry (the icon big enough to see its parts move). The card exists only while on screen; without
 * magic-card on the page, the entry's plain icon.
 */
@customElement('mc-anim-icon-thumb')
export class AnimIconThumb extends LitElement {
  /** The entry: its document is built the first time the thumbnail is on screen. */
  @property({ attribute: false }) entry?: LibraryEntry;
  @property({ attribute: false }) hass?: unknown;
  @state() private _visible = typeof IntersectionObserver === 'undefined';
  /** Kept once built: scrolling back shows it again without a new card; off screen it is detached (no animation runs). */
  private _card?: CardElement;
  private _io?: IntersectionObserver;

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver((entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on !== this._visible) this._visible = on;
      });
      this._io.observe(this);
    }
    if (!customElements.get('magic-card')) void customElements.whenDefined('magic-card').then(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._io?.disconnect();
    this._io = undefined;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('entry')) this._card = undefined;
    if (this._card) {
      if (changed.has('hass') && this.hass) this._card.hass = this.hass;
      return;
    }
    const e = this.entry;
    if (!this._visible || !e || !customElements.get('magic-card')) return;
    const doc = e.build();
    const card = document.createElement('magic-card') as CardElement;
    try {
      card.setConfig({
        type: 'custom:magic-card',
        custom_animations: [doc],
        rows: [
          {
            id: 'r',
            columns: [
              {
                id: 'c',
                vertical_align: 'center',
                modules: [{ id: 'm', type: 'icon', icon: e.icon, size: '40px', design: { text_align: 'center', animations: [{ id: 'a', preset: `custom:${doc.id}` }] } }],
              },
            ],
          },
        ],
      });
    } catch {
      return;
    }
    card.hass = this.hass ?? standaloneHass(false);
    this._card = card;
  }

  protected render(): TemplateResult {
    // off screen: the built card stays in memory but out of the page, so it does not animate
    const card = this._visible ? this._card : undefined;
    return html`<div class="box" aria-hidden="true">${card ?? html`<ha-icon icon=${this.entry?.icon ?? ''}></ha-icon>`}</div>`;
  }

  static styles = [
    editorTokens,
    css`
      :host {
        display: block;
        width: 100%;
        height: 64px;
      }
      .box {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: var(--mc-radius, 8px);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--state-icon-color, #44739e);
        --mdc-icon-size: 40px;
      }
      magic-card {
        display: block;
        width: 100%;
        pointer-events: none;
        --ha-card-background: transparent;
        --card-background-color: transparent;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }
    `,
  ];
}

// The start of an icon animation: pick an icon (split into parts at once) or start from the animated icon library. Emits
// `icon-start { doc, from: 'icon' | 'library' }` (bubbling, composed); the studio opens a new animation.

/** Readable HA domain names for the filter. */
const DOMAIN_LABEL: Record<string, MessageId> = {
  alarm_control_panel: m('anim-studio.icon-start.alarm-panel'),
  binary_sensor: m('anim-studio.icon-start.binary-sensor'),
  button: m('anim-studio.icon-start.button'),
  calendar: m('anim-studio.icon-start.calendar'),
  camera: m('anim-studio.icon-start.camera'),
  climate: m('anim-studio.icon-start.climate'),
  cover: m('anim-studio.icon-start.cover'),
  device_tracker: m('anim-studio.icon-start.device-tracker'),
  event: m('anim-studio.icon-start.event'),
  fan: m('anim-studio.icon-start.fan'),
  humidifier: m('anim-studio.icon-start.humidifier'),
  lawn_mower: m('anim-studio.icon-start.lawn-mower'),
  light: m('anim-studio.icon-start.light'),
  lock: m('anim-studio.icon-start.lock'),
  media_player: m('anim-studio.icon-start.media-player'),
  person: m('anim-studio.icon-start.person'),
  plant: m('anim-studio.icon-start.plant'),
  sensor: m('anim-studio.icon-start.sensor'),
  siren: m('anim-studio.icon-start.siren'),
  sun: m('anim-studio.icon-start.sun'),
  switch: m('anim-studio.icon-start.switch'),
  timer: m('anim-studio.icon-start.timer'),
  vacuum: m('anim-studio.icon-start.vacuum'),
  valve: m('anim-studio.icon-start.valve'),
  weather: m('anim-studio.icon-start.weather'),
  zone: m('anim-studio.icon-start.zone'),
};
/** A domain's name: Home Assistant's own (hass.localize, the word HA shows), else ours. */
export const domainLabel = (d: string, hass?: unknown): string =>
  (hass as { localize?: (key: string) => string } | undefined)?.localize?.(`component.${d}.title`) || (DOMAIN_LABEL[d] !== undefined ? t(DOMAIN_LABEL[d]) : null) || d.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

@customElement('mc-anim-icon-start')
export class AnimIconStart extends LitElement {
  @property({ attribute: false }) hass?: unknown;
  /** Live thumbnails' lookup (unused by icon documents; kept for mcas-thumb). */
  @property({ attribute: false }) lookup: (id: string) => AnimationDoc | undefined = () => undefined;

  @state() private _icon = 'mdi:bell-ring';
  @state() private _query = '';
  @state() private _domain = '';
  @state() private _busy = false;
  @state() private _error = '';
  @state() private _lib: IconLibrary | undefined = iconLibraryIfLoaded();
  @state() private _libFailed = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._lib) void this._loadLibrary();
    if (!editorDefined('mc-icon-picker') && typeof customElements !== 'undefined') void customElements.whenDefined('mc-icon-picker').then(() => this.requestUpdate());
  }

  private async _loadLibrary(): Promise<void> {
    this._libFailed = false;
    try {
      this._lib = await loadIconLibrary();
    } catch {
      this._libFailed = true;
    }
  }

  private _emit(doc: AnimationDoc, from: 'icon' | 'library'): void {
    this.dispatchEvent(new CustomEvent('icon-start', { detail: { doc, from }, bubbles: true, composed: true }));
  }

  /** Split the picked icon into parts and start from it. */
  async start(): Promise<void> {
    const icon = this._icon.trim();
    if (!ICON_RE.test(icon)) {
      this._error = t('anim-studio.icon-start.pick-an-icon-or-type-an-id-like-mdi-bell');
      return;
    }
    this._busy = true;
    this._error = '';
    try {
      // the bundled MDI shape when the library chunk is there, else HA's
      const lib = this._lib ?? (await loadIconLibrary().catch(() => undefined));
      const g = lib?.mdiGeometry(icon) ?? (await resolveIconGeometry(icon));
      if (!g) {
        this._error = t('anim-studio.icon-start.this-icon-could-not-be-loaded-check-the');
        return;
      }
      const name = t('anim-studio.icon-start.name-animation', { name: iconDisplayName(icon) });
      // the geometry goes into the document (rig.svg): the parts stay the pieces split here, whatever
      // icon version a dashboard resolves
      const doc = iconAnimationDoc(icon, g, icon.slice(icon.indexOf(':') + 1), name, { embed: true });
      if (!doc.rig?.parts.length) {
        this._error = t('anim-studio.icon-start.this-icon-has-no-shapes-to-animate');
        return;
      }
      this._emit(doc, 'icon');
    } finally {
      this._busy = false;
    }
  }

  /** The window's first focus: the icon field (the window cannot look into this shadow root). */
  focusStart(): void {
    const field = this.renderRoot.querySelector<HTMLElement>('mc-icon-picker, .icon-input');
    (field?.shadowRoot?.querySelector<HTMLElement>('input') ?? field)?.focus({ preventScroll: true });
  }

  private _renderPick(): TemplateResult {
    const picker = editorDefined('mc-icon-picker');
    return html`<section class="pick" aria-labelledby="is-pick">
      <h3 id="is-pick">${t('anim-studio.icon-start.start-from-an-icon')}</h3>
      <p class="help">${t('anim-studio.icon-start.the-icon-is-split-into-its-parts-select')}</p>
      <div class="pick-row">
        <div class="field grow">
          ${picker
            ? html`<mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${t('anim-studio.icon-start.icon')}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._icon = String(e.detail?.value ?? '').trim();
                  this._error = '';
                }}
              ></mc-icon-picker>`
            : html`<input
                class="input mono icon-input"
                aria-label=${t('anim-studio.icon-start.icon')}
                spellcheck="false"
                .value=${live(this._icon)}
                @input=${(e: Event) => {
                  this._icon = (e.target as HTMLInputElement).value;
                  this._error = '';
                }}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && void this.start()}
              />`}
        </div>
        <button type="button" class="btn btn-primary btn-sm start" ?disabled=${this._busy} @click=${() => void this.start()}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy ? t('anim-studio.icon-start.splitting') : t('anim-studio.icon-start.split-and-start')}
        </button>
      </div>
      ${this._error ? html`<p class="help error" role="alert">${this._error}</p>` : nothing}
    </section>`;
  }

  private _renderLibrary(): TemplateResult {
    const lib = this._lib;
    const head = html`<div class="lib-head">
      <h3 id="is-lib">${t('anim-studio.icon-start.or-start-from-the-icon-library')}</h3>
      ${lib ? html`<span class="chip is-count">${lib.ICON_LIBRARY.length}</span>` : nothing}
    </div>`;
    if (!lib)
      return html`<section class="lib" aria-labelledby="is-lib">
        ${head}
        ${this._libFailed
          ? html`<p class="help error lib-error" role="alert">${t('anim-studio.icon-start.the-icon-library-could-not-be-loaded')}</p>
              <div><button type="button" class="btn btn-secondary btn-sm lib-retry" @click=${() => void this._loadLibrary()}><ha-icon icon="mdi:refresh"></ha-icon>${t('anim-studio.icon-start.try-again')}</button></div>`
          : html`<p class="help lib-loading" role="status">${t('anim-studio.icon-start.loading-icon-library')}</p>`}
      </section>`;
    const shown = lib.searchLibrary(this._query, this._domain || undefined);
    return html`<section class="lib" aria-labelledby="is-lib">
      ${head}
      <div class="filters">
        <div class="with-icon grow">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input lib-search"
            type="search"
            placeholder=${t('anim-studio.icon-start.search-icons')}
            aria-label=${t('anim-studio.icon-start.search-the-icon-library')}
            .value=${live(this._query)}
            @input=${(e: InputEvent) => (this._query = (e.target as HTMLInputElement).value)}
          />
        </div>
        <select class="input domain" aria-label=${t('anim-studio.icon-start.domain')} .value=${live(this._domain)} @change=${(e: Event) => (this._domain = (e.target as HTMLSelectElement).value)}>
          <option value="">${t('anim-studio.icon-start.all-domains')}</option>
          ${[...lib.LIBRARY_DOMAINS].sort((a, b) => domainLabel(a, this.hass).localeCompare(domainLabel(b, this.hass))).map((d) => html`<option value=${d} ?selected=${d === this._domain}>${domainLabel(d, this.hass)}</option>`)}
        </select>
      </div>
      ${shown.length
        ? html`<ul class="grid" role="list">
            ${shown.map(
              (e) => html`<li>
                <button type="button" class="entry" data-id=${e.id} title="${e.name} (${e.icon})" @click=${() => this._emit(e.build(), 'library')}>
                  <mc-anim-icon-thumb .entry=${e} .hass=${this.hass}></mc-anim-icon-thumb>
                  ${lib.isNewInRelease(e.id) ? html`<span class="new-mark" aria-hidden="true"></span><span class="sr-only">${t('anim-studio.icon-start.new-in-this-release')}</span>` : nothing}
                  <span class="nm">${e.name}</span>
                  <span class="dm">${domainLabel(e.domain, this.hass)}</span>
                </button>
              </li>`,
            )}
          </ul>`
        : html`<p class="help no-results">${t('anim-studio.icon-start.no-icon-animations-match-query', { query: this._query })}</p>`}
    </section>`;
  }

  protected render(): TemplateResult {
    return html`${this._renderPick()} ${this._renderLibrary()}`;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    css`
      :host {
        display: grid;
        gap: 20px;
        min-height: 0;
      }
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }
      section {
        display: grid;
        gap: 10px;
        min-height: 0;
      }
      .help {
        margin: 0;
      }
      .pick-row,
      .filters,
      .lib-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .pick-row .field {
        margin: 0;
      }
      select.domain {
        width: auto;
        min-width: 150px;
      }
      .grid {
        list-style: none;
        margin: 0;
        padding: 2px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));
        gap: 8px;
        max-height: min(46vh, 420px);
        overflow: auto;
      }
      .grid > li {
        display: flex;
      }
      .entry {
        position: relative;
        width: 100%;
        align-content: start;
        display: grid;
        justify-items: center;
        gap: 4px;
        padding: 8px 6px;
        border-radius: var(--mc-radius, 8px);
        border: 1px solid var(--mc-divider, var(--divider-color, rgba(0, 0, 0, 0.12)));
        background: var(--mc-surface, var(--card-background-color, #fff));
        color: var(--mc-text, var(--primary-text-color, #212121));
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .entry:hover {
        border-color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, transparent);
      }
      .entry:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
      }
      .new-mark {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        background: var(--mc-accent-ink, #01579b);
        box-shadow: 0 0 0 1.5px var(--mc-surface, var(--card-background-color, #fff));
        transform: rotate(45deg);
      }
      @media (forced-colors: active) {
        .new-mark {
          background: CanvasText;
        }
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
      .pick-row {
        align-items: flex-start;
      }
      .pick-row .start {
        min-height: 40px;
      }
      .nm {
        font-size: 0.8125rem;
        line-height: 1.25;
      }
      .dm {
        font-size: 0.6875rem;
        color: var(--mc-text-2, var(--secondary-text-color, #5f6368));
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-icon-start': AnimIconStart;
    'mc-anim-icon-thumb': AnimIconThumb;
  }
}
