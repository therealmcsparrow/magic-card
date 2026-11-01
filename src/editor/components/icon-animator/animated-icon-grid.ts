import type { PropertyValues, TemplateResult } from 'lit';
import type { AnimationDoc } from '../../../anim-studio/model';
import { ICON_LIBRARY, LIBRARY_DOMAINS, libraryFor, searchLibrary, isNewInRelease, type LibraryEntry } from '../../../icon-anim/library';
import type { IconAnimatorHost } from './loader';
import { DEFAULT_ICON_STYLE, ICON_STYLES, type IconStyle } from '../../../contracts/icon-library';
import { styleDoc } from '../../../icon-anim/style';
import { fold } from '../../../i18n/fold';
import { t, m } from '../../../icon-anim/i18n';
import type { MessageIndex } from '../../../contracts/i18n';

// The animated icon grid (lazy icon-animator chunk): live tiles for My animations and the icon library.
// Only emits `animated-icon-pick`.

export const ANIMATED_ICON_GRID_TAG = 'mc-animated-icon-grid';
const THUMB_TAG = 'mc-animated-icon-thumb';

/** What a tile stands for: a built-in library entry, or one of the user's own documents. */
export type AnimatedIconPick = { kind: 'library'; entry: LibraryEntry; style?: IconStyle; restyle?: boolean } | { kind: 'mine'; doc: AnimationDoc };

const STYLE_LABELS: Record<IconStyle, MessageIndex> = { quiet: m('icon-animator.animated-icon-grid.quiet'), living: m('icon-animator.animated-icon-grid.living'), glow: m('icon-animator.animated-icon-grid.glow') };
const STYLE_HELP: Record<IconStyle, MessageIndex> = {
  quiet: m('icon-animator.animated-icon-grid.quiet-one-part-moves-a-little-slower-for'),
  living: m('icon-animator.animated-icon-grid.living-the-full-animation-as-drawn'),
  glow: m("icon-animator.animated-icon-grid.glow-the-full-animation-with-its-lit"),
};
const isStyle = (v: unknown): v is IconStyle => (ICON_STYLES as readonly unknown[]).includes(v);

/** The library documents that are icon animations (they carry a rig). */
export const mineIconDocs = (list: AnimationDoc[]): AnimationDoc[] => list.filter((d) => !!d.rig);

/** A domain's name: Home Assistant's own (hass.localize, the word HA shows), else the id in words. */
const domainName = (d: string, hass?: unknown): string =>
  (hass as { localize?: (key: string) => string } | undefined)?.localize?.(`component.${d}.title`) || d.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

interface CardElement extends HTMLElement {
  setConfig(c: unknown): void;
  hass?: unknown;
}

/** Define <mc-animated-icon-grid> with the card bundle's modules from `h` (loader.ts `host`). */
export function defineAnimatedIconGrid(h: IconAnimatorHost): void {
  if (customElements.get(ANIMATED_ICON_GRID_TAG)) return;
  const { html, css } = h;
  const nothing = '';

  /**
   * A tile's live thumbnail: a small transparent magic-card whose icon module plays the document,
   * built the first time it is on screen and detached off screen (no animation runs there).
   * Without magic-card on the page, the plain icon.
   */
  class Thumb extends h.LitElement {
    static properties = {
      source: { attribute: false },
      icon: { attribute: false },
      iconStyle: { attribute: false },
      size: { type: Number },
      hass: { attribute: false },
      _visible: { state: true },
    };
    static styles = [
      css`
        :host {
          display: block;
          width: 100%;
          height: var(--mc-thumb-size, 64px);
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
          /* Glow reads light or dark from the card background; the tile card is transparent on this */
          --mc-glow-bg: var(--mc-canvas, var(--card-background-color, #fff));
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

    /** The library entry or document to play: a stable object, so a re-render keeps the built card. */
    source?: LibraryEntry | AnimationDoc;
    icon = '';
    /** The Style a library entry previews in. */
    iconStyle: IconStyle = DEFAULT_ICON_STYLE;
    /** The box height in px; the icon is 5/8 of it. */
    size = 64;
    hass?: unknown;
    private _visible = typeof IntersectionObserver === 'undefined';
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

    protected willUpdate(changed: PropertyValues): void {
      if (changed.has('size')) this.style.setProperty('--mc-thumb-size', `${this.size}px`);
      if (changed.has('source') || changed.has('icon') || changed.has('iconStyle') || changed.has('size')) this._card = undefined;
      if (this._card) {
        if (changed.has('hass') && this.hass) this._card.hass = this.hass;
        return;
      }
      if (!this._visible || !this.source || !customElements.get('magic-card')) return;
      const doc = 'build' in this.source ? styleDoc(this.source, this.iconStyle) : this.source;
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
                  modules: [{ id: 'm', type: 'icon', icon: this.icon, size: `${this._iconPx}px`, design: { text_align: 'center', animations: [{ id: 'a', preset: `custom:${doc.id}` }] } }],
                },
              ],
            },
          ],
        });
      } catch {
        return;
      }
      if (this.hass) card.hass = this.hass;
      this._card = card;
    }

    private get _iconPx(): number {
      return Math.round(this.size * 0.625);
    }

    protected render(): TemplateResult {
      const card = this._visible ? this._card : undefined;
      return html`<div class="box" aria-hidden="true" style="--mdc-icon-size: ${this._iconPx}px">${card ?? html`<ha-icon icon=${this.icon}></ha-icon>`}</div>`;
    }
  }
  customElements.define(THUMB_TAG, Thumb);

  class AnimatedIconGrid extends h.LitElement {
    static properties = {
      hass: { attribute: false },
      icon: {},
      entity: {},
      current: {},
      iconStyle: {},
      _style: { state: true },
      _query: { state: true },
      _domain: { state: true },
      _all: { state: true },
    };

    static styles = [
      h.editorSystem,
      css`
        :host {
          display: grid;
          gap: 12px;
          min-width: 0;
        }
        section {
          display: grid;
          gap: 8px;
        }
        h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .help {
          margin: 0;
        }
        .filters {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .grow {
          flex: 1;
          min-width: 0;
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
          outline: 2px solid var(--mc-accent-ink, #01579b);
          outline-offset: 2px;
        }
        .entry[aria-pressed='true'] {
          border-color: var(--mc-accent, var(--primary-color, #03a9f4));
          background: var(--mc-accent-tint, color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent));
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
        .nm {
          font-size: 0.8125rem;
          line-height: 1.25;
        }
        .dm {
          font-size: 0.6875rem;
          color: var(--mc-text-2, var(--secondary-text-color, #5f6368));
        }
        .lib-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .style {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .style .lbl {
          font-size: 0.8125rem;
        }
        .swatches {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sw {
          position: relative;
          display: grid;
          justify-items: center;
          gap: 4px;
          width: 88px;
          min-height: 24px;
          padding: 5px;
          border: 1px solid var(--mc-text-2, var(--secondary-text-color, #727272));
          border-radius: var(--mc-radius, 8px);
          background: transparent;
          color: var(--mc-text, var(--primary-text-color, #212121));
          font: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
        }
        .sw[aria-checked='true'] {
          padding: 4px;
          border: 2px solid var(--mc-accent-ink, #01579b);
          font-weight: 700;
        }
        .sw:focus-visible {
          outline: 2px solid var(--mc-accent-ink, #01579b);
          outline-offset: 2px;
        }
        .sw mc-animated-icon-thumb {
          width: 72px;
        }
        .sw ha-icon {
          position: absolute;
          top: 6px;
          right: 6px;
          --mdc-icon-size: 16px;
          color: var(--mc-accent-ink, #01579b);
          background: var(--mc-canvas, var(--card-background-color, #fff));
          border-radius: 50%;
        }
      `,
    ];

    hass?: unknown;
    /** The module's icon: matches-first, and the icon a My animations tile plays when it names none. */
    icon = '';
    entity = '';
    /** The tile that is on the module now: a My animations document id, or `lib:<entry id>`. */
    current = '';
    /** The Style of the module's library icon (the control's start value). */
    iconStyle = '';
    private _style: IconStyle = DEFAULT_ICON_STYLE;
    private _query = '';
    private _domain = '';
    private _all = false;
    private _unsub?: () => void;

    connectedCallback(): void {
      super.connectedCallback();
      this._unsub = h.library.subscribe(() => this.requestUpdate());
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this._unsub?.();
      this._unsub = undefined;
    }

    protected willUpdate(changed: PropertyValues): void {
      if (changed.has('iconStyle')) this._style = isStyle(this.iconStyle) ? this.iconStyle : DEFAULT_ICON_STYLE;
      if (changed.has('hass') && this.hass) h.library.ensure(this.hass as Parameters<typeof h.library.ensure>[0]);
    }

    private get _entityDomain(): string {
      return this.entity.includes('.') ? this.entity.slice(0, this.entity.indexOf('.')) : '';
    }

    private _matches(): LibraryEntry[] {
      const out = new Map<string, LibraryEntry>();
      for (const q of [this.icon, this._entityDomain])
        for (const e of q ? libraryFor(q) : []) out.set(e.id, e);
      return [...out.values()];
    }

    /** My animations: icon documents, filtered by the search (name and icon). None under a domain filter. */
    private _mine(): AnimationDoc[] {
      if (h.library.status !== 'ready' || this._domain) return [];
      const terms = fold(this._query).split(/\s+/).filter(Boolean);
      return mineIconDocs(h.library.list()).filter((d) => {
        const hay = fold(`${d.name} ${d.rig?.icon ?? ''}`);
        return terms.every((w) => hay.includes(w));
      });
    }

    private _emit(pick: AnimatedIconPick): void {
      this.dispatchEvent(new CustomEvent('animated-icon-pick', { detail: pick, bubbles: true, composed: true }));
    }

    /** A new Style: the tiles preview it; the module's library icon (if any) is rebuilt in it. */
    private _setStyle(style: IconStyle): void {
      if (style === this._style) return;
      this._style = style;
      const cur = this.current.startsWith('lib:') ? ICON_LIBRARY.find((e) => `lib:${e.id}` === this.current) : undefined;
      if (cur) this._emit({ kind: 'library', entry: cur, style, restyle: true });
    }

    /** The entry the swatches play: the module's own, else the first match, else the first in the library. */
    private _sample(): LibraryEntry {
      return ICON_LIBRARY.find((e) => `lib:${e.id}` === this.current) ?? this._matches()[0] ?? ICON_LIBRARY[0];
    }

    private _styleControl(): TemplateResult {
      const sample = this._sample();
      const onKey = (e: KeyboardEvent) => {
        const i = ICON_STYLES.indexOf(this._style);
        const n = ICON_STYLES.length;
        const to = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
        if (to === undefined) return;
        e.preventDefault();
        const next = ICON_STYLES[(to + n) % n];
        const group = e.currentTarget as HTMLElement;
        this._setStyle(next);
        void this.updateComplete.then(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
      };
      return html`<div class="style">
        <span class="lbl" id="aig-style">${t('icon-animator.animated-icon-grid.style')}</span>
        <div class="swatches" role="radiogroup" aria-labelledby="aig-style" aria-describedby="aig-style-help" @keydown=${onKey}>
          ${ICON_STYLES.map((s) => {
            const on = s === this._style;
            return html`<button type="button" class="sw" role="radio" data-val=${s} aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} @click=${() => this._setStyle(s)}>
              <mc-animated-icon-thumb .source=${sample} .icon=${sample.icon} .iconStyle=${s} .size=${40} .hass=${this.hass}></mc-animated-icon-thumb>
              ${on ? html`<ha-icon icon="mdi:check" aria-hidden="true"></ha-icon>` : nothing}
              <span>${t(STYLE_LABELS[s])}</span>
            </button>`;
          })}
        </div>
      </div>`;
    }

    private _tile(
      id: string,
      name: string,
      icon: string,
      label: string,
      source: LibraryEntry | AnimationDoc,
      pick: AnimatedIconPick,
      style: IconStyle = DEFAULT_ICON_STYLE,
      isNew = false,
    ): TemplateResult {
      return html`<li>
        <button type="button" class="entry" data-id=${id} title="${name} (${icon})" aria-pressed=${id === this.current ? 'true' : 'false'} @click=${() => this._emit(pick)}>
          <mc-animated-icon-thumb .source=${source} .icon=${icon} .iconStyle=${style} .hass=${this.hass}></mc-animated-icon-thumb>
          ${isNew ? html`<span class="new-mark" aria-hidden="true"></span><span class="sr-only">${t('icon-animator.animated-icon-grid.new-in-this-release')}</span>` : nothing}
          <span class="nm">${name}</span>
          <span class="dm">${label}</span>
        </button>
      </li>`;
    }

    protected render(): TemplateResult {
      const filtering = !!this._query.trim() || !!this._domain;
      const mine = this._mine();
      let builtIns: LibraryEntry[];
      let intro: TemplateResult | string = nothing;
      let toggle: TemplateResult | string = nothing;
      if (filtering) builtIns = searchLibrary(this._query, this._domain || undefined);
      else {
        const matches = this._matches();
        builtIns = this._all || !matches.length ? ICON_LIBRARY : matches;
        if (!matches.length)
          intro = html`<p class="help">${this._entityDomain ? t('icon-animator.animated-icon-grid.no-library-animation-matches-icon-or', { icon: this.icon, domain: this._entityDomain }) : t('icon-animator.animated-icon-grid.no-library-animation-matches-icon', { icon: this.icon })}</p>`;
        else if (matches.length < ICON_LIBRARY.length)
          toggle = html`<div>
            <button type="button" class="btn btn-text btn-sm" @click=${() => (this._all = !this._all)}>
              ${this._all ? t('icon-animator.animated-icon-grid.show-matches-only') : t('icon-animator.animated-icon-grid.show-all-count', { count: ICON_LIBRARY.length })}
            </button>
          </div>`;
      }
      return html`
        <div class="filters">
          <div class="with-icon grow">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${t('icon-animator.animated-icon-grid.search-icons')}
              aria-label=${t('icon-animator.animated-icon-grid.search-animated-icons')}
              .value=${this._query}
              @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)}
            />
          </div>
          <select class="input domain" aria-label=${t('icon-animator.animated-icon-grid.domain')} .value=${this._domain} @change=${(e: Event) => (this._domain = (e.target as HTMLSelectElement).value)}>
            <option value="">${t('icon-animator.animated-icon-grid.all-domains')}</option>
            ${[...LIBRARY_DOMAINS].sort((a, b) => domainName(a, this.hass).localeCompare(domainName(b, this.hass))).map((d) => html`<option value=${d} ?selected=${d === this._domain}>${domainName(d, this.hass)}</option>`)}
          </select>
        </div>
        ${mine.length
          ? html`<section aria-labelledby="aig-mine">
              <h3 id="aig-mine">${t('icon-animator.animated-icon-grid.my-animations')}</h3>
              <ul class="grid" role="list">
                ${mine.map((d) => this._tile(d.id, d.name, d.rig?.icon ?? this.icon, t('icon-animator.animated-icon-grid.my-animation'), d, { kind: 'mine', doc: d }))}
              </ul>
            </section>`
          : nothing}
        ${builtIns.length
          ? html`<section aria-labelledby="aig-lib">
              <div class="lib-head">
                <h3 id="aig-lib">${t('icon-animator.animated-icon-grid.icon-library')}</h3>
                ${this._styleControl()}
              </div>
              <p class="help" id="aig-style-help">${t(STYLE_HELP[this._style])}</p>
              ${intro}
              <ul class="grid" role="list">
                ${builtIns.map((e) => this._tile(`lib:${e.id}`, e.name, e.icon, domainName(e.domain, this.hass), e, { kind: 'library', entry: e, style: this._style }, this._style, isNewInRelease(e.id)))}
              </ul>
              ${toggle}
            </section>`
          : mine.length
            ? nothing
            : html`<p class="help no-results">${t('icon-animator.animated-icon-grid.no-icon-animations-match-query', { query: this._query })}</p>`}
      `;
    }
  }
  customElements.define(ANIMATED_ICON_GRID_TAG, AnimatedIconGrid);
}
