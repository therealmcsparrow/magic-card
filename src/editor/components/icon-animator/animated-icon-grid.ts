import type { PropertyValues, TemplateResult } from 'lit';
import type { AnimationDoc } from '../../../anim-studio/model';
import { ICON_LIBRARY, LIBRARY_DOMAINS, libraryFor, searchLibrary, type LibraryEntry } from '../../../icon-anim/library';
import type { IconAnimatorHost } from './loader';
import { DEFAULT_ICON_STYLE, ICON_STYLES, type IconStyle } from '../../../contracts/icon-library';
import { styleDoc } from '../../../icon-anim/style';

/*
 * The animated icon grid (lazy chunk magic-card-icon-animator.js): live moving tiles for the user's
 * own icon animations (My animations) and the built-in icon library, with search and a domain
 * filter. Used by the icon picker's "Animated icons" tab; it only
 * emits `animated-icon-pick`, the caller writes the choice. The Style control (Quiet / Living / Glow)
 * sits on the Icon library: its tiles preview in that Style and a pick stores it; changing it while
 * the module plays a library icon restyles that icon at once (`restyle`: the picker stays open).
 * My animations tiles have no Style.
 */

export const ANIMATED_ICON_GRID_TAG = 'mc-animated-icon-grid';
const THUMB_TAG = 'mc-animated-icon-thumb';

/** What a tile stands for: a built-in library entry, or one of the user's own documents. */
export type AnimatedIconPick = { kind: 'library'; entry: LibraryEntry; style?: IconStyle; restyle?: boolean } | { kind: 'mine'; doc: AnimationDoc };

const STYLE_LABELS: Record<IconStyle, string> = { quiet: 'Quiet', living: 'Living', glow: 'Glow' };
const STYLE_HELP: Record<IconStyle, string> = {
  quiet: 'Quiet: one part moves a little, slower. For calm dashboards.',
  living: 'Living: the full animation, as drawn.',
  glow: "Glow: the full animation with a soft halo in the animation's colour, else the theme's.",
};
const isStyle = (v: unknown): v is IconStyle => (ICON_STYLES as readonly unknown[]).includes(v);

/** The library documents that are icon animations (they carry a rig). */
export const mineIconDocs = (list: AnimationDoc[]): AnimationDoc[] => list.filter((d) => !!d.rig);

const domainName = (d: string): string => d.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

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
      hass: { attribute: false },
      _visible: { state: true },
    };
    static styles = [
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

    /** The library entry or document to play: a stable object, so a re-render keeps the built card. */
    source?: LibraryEntry | AnimationDoc;
    icon = '';
    /** The Style a library entry previews in. */
    iconStyle: IconStyle = DEFAULT_ICON_STYLE;
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
      if (changed.has('source') || changed.has('icon') || changed.has('iconStyle')) this._card = undefined;
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
                  modules: [{ id: 'm', type: 'icon', icon: this.icon, size: '40px', design: { text_align: 'center', animations: [{ id: 'a', preset: `custom:${doc.id}` }] } }],
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

    protected render(): TemplateResult {
      const card = this._visible ? this._card : undefined;
      return html`<div class="box" aria-hidden="true">${card ?? html`<ha-icon icon=${this.icon}></ha-icon>`}</div>`;
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
        .entry[aria-pressed='true'] {
          border-color: var(--mc-accent, var(--primary-color, #03a9f4));
          background: var(--mc-accent-tint, color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent));
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
          align-items: center;
          gap: 8px;
        }
        .style .lbl {
          font-size: 0.8125rem;
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
      const terms = this._query.toLowerCase().split(/\s+/).filter(Boolean);
      return mineIconDocs(h.library.list()).filter((d) => {
        const hay = `${d.name} ${d.rig?.icon ?? ''}`.toLowerCase();
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

    private _styleControl(): TemplateResult {
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
        <span class="lbl" id="aig-style">Style</span>
        <div class="seg" role="radiogroup" aria-labelledby="aig-style" aria-describedby="aig-style-help" @keydown=${onKey}>
          ${ICON_STYLES.map((s) => {
            const on = s === this._style;
            return html`<button type="button" role="radio" data-val=${s} aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} @click=${() => this._setStyle(s)}>
              ${STYLE_LABELS[s]}
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
    ): TemplateResult {
      return html`<li>
        <button type="button" class="entry" data-id=${id} title="${name} (${icon})" aria-pressed=${id === this.current ? 'true' : 'false'} @click=${() => this._emit(pick)}>
          <mc-animated-icon-thumb .source=${source} .icon=${icon} .iconStyle=${style} .hass=${this.hass}></mc-animated-icon-thumb>
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
          intro = html`<p class="help">No library animation matches ${this.icon}${this._entityDomain ? ` or ${this._entityDomain}` : ''}; showing all of them.</p>`;
        else if (matches.length < ICON_LIBRARY.length)
          toggle = html`<div>
            <button type="button" class="btn btn-text btn-sm" @click=${() => (this._all = !this._all)}>
              ${this._all ? 'Show matches only' : `Show all (${ICON_LIBRARY.length})`}
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
              placeholder="Search icons"
              aria-label="Search animated icons"
              .value=${this._query}
              @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)}
            />
          </div>
          <select class="input domain" aria-label="Domain" .value=${this._domain} @change=${(e: Event) => (this._domain = (e.target as HTMLSelectElement).value)}>
            <option value="">All domains</option>
            ${[...LIBRARY_DOMAINS].sort((a, b) => domainName(a).localeCompare(domainName(b))).map((d) => html`<option value=${d} ?selected=${d === this._domain}>${domainName(d)}</option>`)}
          </select>
        </div>
        ${mine.length
          ? html`<section aria-labelledby="aig-mine">
              <h3 id="aig-mine">My animations</h3>
              <ul class="grid" role="list">
                ${mine.map((d) => this._tile(d.id, d.name, d.rig?.icon ?? this.icon, 'My animation', d, { kind: 'mine', doc: d }))}
              </ul>
            </section>`
          : nothing}
        ${builtIns.length
          ? html`<section aria-labelledby="aig-lib">
              <div class="lib-head">
                <h3 id="aig-lib">Icon library</h3>
                ${this._styleControl()}
              </div>
              <p class="help" id="aig-style-help">${STYLE_HELP[this._style]}</p>
              ${intro}
              <ul class="grid" role="list">
                ${builtIns.map((e) => this._tile(`lib:${e.id}`, e.name, e.icon, domainName(e.domain), e, { kind: 'library', entry: e, style: this._style }, this._style))}
              </ul>
              ${toggle}
            </section>`
          : mine.length
            ? nothing
            : html`<p class="help no-results">No icon animations match "${this._query}".</p>`}
      `;
    }
  }
  customElements.define(ANIMATED_ICON_GRID_TAG, AnimatedIconGrid);
}
