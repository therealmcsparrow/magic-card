import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { editorPrimitives, editorTokens } from '../css/editor-system';
import { ANIMATION_GROUPS, ANIMATION_PRESETS } from '../utils/animation-presets';
import { CATALOGUE_GROUPS, type PresetPickDetail, type PresetTileSource } from '../contracts/preset-catalogue';
import { docFromPreset } from './from-preset';
import type { AnimationDoc } from './model';
import { previewConfig } from './studio-model';
import { standaloneHass } from './studio-stage';
import { tileHass } from './tiles';

/*
 * Module `preset-tiles` (contract preset-catalogue 1.1.0, tile part): the "Customise a preset"
 * dialog's grid of live mini cards. <mc-preset-grid> shows one tile per PresetTileSource, grouped
 * and filtered by `query`, and emits `preset-pick` ({ source }) on click, Enter or Space; the
 * dialog does the rest, the grid writes nothing. Each tile's <mc-preset-thumb> is a small
 * magic-card on the studio's card tile (icon, name, state, background) that plays the preset.
 *
 * Tile rules (PRESET_TILE_RULES_VERSION 1.0.0):
 * - the card exists only while the tile is on screen (IntersectionObserver); off screen nothing runs;
 * - tap presets and heavy scenes (seasonal, catalogue `heavy`) show a still card until hover or
 *   focus; a corner play badge (touch) previews one cycle;
 * - prefers-reduced-motion: every tile still, hover and focus do not play, no badge (the card
 *   itself honours reduced motion, so a badge could not play anything).
 */

export const PRESET_GRID_TAG = 'mc-preset-grid';
export const PRESET_THUMB_TAG = 'mc-preset-thumb';

type CardElement = HTMLElement & { setConfig(c: unknown): void; hass?: unknown };
type BuiltinSource = Extract<PresetTileSource, { kind: 'builtin' }>;

/** A tile's group (a built-in AnimationGroup or a catalogue group). */
export type TileGroupName = BuiltinSource['group'] | (typeof CATALOGUE_GROUPS)[number];

/** Loading / fallback icon per group (the box shows it until the card is built). */
const GROUP_ICON: Record<TileGroupName, string> = {
  'Glow & pulse': 'mdi:lightbulb-on-outline',
  Motion: 'mdi:rotate-right',
  Playful: 'mdi:emoticon-happy-outline',
  'Light & colour': 'mdi:palette-outline',
  'Rings & sweeps': 'mdi:radar',
  Borders: 'mdi:border-outside',
  'Weather & device': 'mdi:weather-partly-rainy',
  Scenes: 'mdi:image-filter-hdr',
  Backgrounds: 'mdi:gradient-horizontal',
  Seasonal: 'mdi:pine-tree',
  Interaction: 'mdi:gesture-tap',
  'Fire & heat': 'mdi:fire',
  Cleaning: 'mdi:broom',
  Christmas: 'mdi:pine-tree',
  Halloween: 'mdi:halloween',
  Valentine: 'mdi:heart-outline',
  'Home automation': 'mdi:home-automation',
};

let builtins: BuiltinSource[] | undefined;

/** One tile source per built-in preset (built once): `tap` from the trigger, `heavy` for seasonal scenes. */
export function builtinTileSources(): BuiltinSource[] {
  builtins ??= ANIMATION_PRESETS.map((p) => ({ kind: 'builtin', id: p.id, name: p.name, group: p.group, tap: p.trigger === 'tap', heavy: p.group === 'Seasonal' || !!p.seasonal }));
  return builtins;
}

/** A stable key per tile: the preset id, `cat:<entry id>` for catalogue presets (data-preset). */
export const tileKey = (s: PresetTileSource): string => (s.kind === 'builtin' ? s.id : `cat:${s.entry.id}`);
export const tileName = (s: PresetTileSource): string => (s.kind === 'builtin' ? s.name : s.entry.name);
export const tileGroup = (s: PresetTileSource): TileGroupName => (s.kind === 'builtin' ? s.group : s.entry.group);
/** Tap presets: the "Tap" badge; they loop on hover in the tile. */
export const tileTap = (s: PresetTileSource): boolean => s.kind === 'builtin' && s.tap;
/** Still until hover or focus (P1-3). */
export const tileStill = (s: PresetTileSource): boolean => (s.kind === 'builtin' ? s.tap || s.heavy : !!s.entry.heavy);

/** Groups in display order: the built-in groups, then the catalogue's own ('Light & colour' is shared). */
const GROUP_ORDER: TileGroupName[] = [...ANIMATION_GROUPS, ...CATALOGUE_GROUPS.filter((g) => !(ANIMATION_GROUPS as string[]).includes(g))];

export interface TileGroup {
  group: TileGroupName;
  tiles: PresetTileSource[];
}

/**
 * The sources grouped for display, filtered by `query`: every word must appear in the name, id,
 * group name or (catalogue) tags. Groups without a match are left out.
 */
export function groupTiles(sources: PresetTileSource[], query: string): TileGroup[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hit = (s: PresetTileSource): boolean => {
    if (!words.length) return true;
    const hay = (s.kind === 'builtin' ? `${s.name} ${s.id} ${s.group}` : `${s.entry.name} ${s.entry.id} ${s.entry.group} ${s.entry.tags.join(' ')}`).toLowerCase();
    return words.every((w) => hay.includes(w));
  };
  const by = new Map<TileGroupName, PresetTileSource[]>();
  for (const s of sources) {
    if (!hit(s)) continue;
    const g = tileGroup(s);
    const list = by.get(g);
    if (list) list.push(s);
    else by.set(g, [s]);
  }
  return GROUP_ORDER.filter((g) => by.has(g)).map((group) => ({ group, tiles: by.get(group)! }));
}

const builtinDocs = new Map<string, AnimationDoc | undefined>();
const catalogueDocs = new WeakMap<object, AnimationDoc | undefined>();

/**
 * The document a tile plays (memoised): built-ins through docFromPreset, catalogue entries through
 * build(). A tap preset loops in the tile (no trigger, infinite). Undefined when it cannot be built.
 */
export function tileDoc(s: PresetTileSource): AnimationDoc | undefined {
  if (s.kind === 'catalogue') {
    if (catalogueDocs.has(s.entry)) return catalogueDocs.get(s.entry);
    let doc: AnimationDoc | undefined;
    try {
      doc = s.entry.build();
    } catch {
      doc = undefined;
    }
    catalogueDocs.set(s.entry, doc);
    return doc;
  }
  if (builtinDocs.has(s.id)) return builtinDocs.get(s.id);
  let doc = docFromPreset(s.id);
  if (doc && s.tap) doc = { ...doc, iterations: 'infinite' };
  builtinDocs.set(s.id, doc);
  return doc;
}

/** How long the play badge previews a still tile: one cycle, at least 2.5 s and at most 8 s. */
export function previewMs(doc: AnimationDoc | undefined): number {
  const secs = typeof doc?.duration === 'number' ? doc.duration : 2;
  return Math.min(8000, Math.max(2500, Math.round(secs * 1000)));
}

const reducedQuery = (): MediaQueryList | undefined => (typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : undefined);

/** A config id from a tile key (`cat:candle-glow` -> `pt-cat-candle-glow`). */
const previewId = (key: string): string => `pt-${key.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`.slice(0, 64);

/**
 * A tile's mini card: built while on screen, playing when `play`, else the still card. Without
 * magic-card on the page, or when the card cannot be built, the group's icon on the canvas.
 */
export class PresetThumb extends LitElement {
  @property({ attribute: false }) source?: PresetTileSource;
  @property({ type: Boolean }) play = false;
  @property({ attribute: false }) hass?: Record<string, unknown>;
  @property({ attribute: false }) lookup: (id: string) => AnimationDoc | undefined = () => undefined;

  @state() private _visible = typeof IntersectionObserver === 'undefined';

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
    this._card = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    const doc = this.source ? tileDoc(this.source) : undefined;
    if (!this._visible || !doc || !this.source || !customElements.get('magic-card')) {
      this._card = undefined;
      return;
    }
    const fresh = !this._card;
    if (fresh) this._card = document.createElement('magic-card') as CardElement;
    if (fresh || changed.has('source') || changed.has('play') || changed.has('lookup')) {
      try {
        const cfg = previewConfig(doc, this.lookup, { tile: 'card', thumb: true, as: previewId(tileKey(this.source)), still: !this.play });
        const icon = this.source.kind === 'catalogue' ? this.source.entry.icon : undefined;
        if (icon) withIcon(cfg, icon);
        this._card!.setConfig(cfg);
      } catch {
        this._card = undefined;
        return;
      }
    }
    if (fresh || changed.has('hass')) this._card!.hass = tileHass('card', this.hass ?? standaloneHass(false));
  }

  protected render(): TemplateResult {
    const icon = this.source ? GROUP_ICON[tileGroup(this.source)] ?? 'mdi:animation-outline' : 'mdi:animation-outline';
    return html`<div class="box">${this._card ? html`<div class="scale">${this._card}</div>` : html`<ha-icon icon=${icon}></ha-icon>`}</div>`;
  }

  static styles = [
    editorTokens,
    css`
      :host {
        display: block;
        width: 100%;
        height: 88px;
      }
      .box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--mc-text-2);
        --mdc-icon-size: 24px;
      }
      /* a fixed 200px card scaled to 120px: the type never reflows per tile; 8px of canvas around it for glows and borders */
      .scale {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200px;
        transform: translate(-50%, -50%) scale(0.6);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `,
  ];
}

/** Put the catalogue entry's suggested icon on the preview card's module(s). */
function withIcon(cfg: Record<string, unknown>, icon: string): void {
  const rows = (cfg.rows ?? []) as Array<{ columns?: Array<{ modules?: Array<Record<string, unknown>> }> }>;
  for (const r of rows) for (const c of r.columns ?? []) for (const m of c.modules ?? []) if ('icon' in m) m.icon = icon;
}

export class PresetGrid extends LitElement {
  @property({ attribute: false }) sources: PresetTileSource[] = [];
  @property() query = '';
  @property({ attribute: false }) hass?: Record<string, unknown>;
  @property({ attribute: false }) lookup: (id: string) => AnimationDoc | undefined = () => undefined;
  /** One line under the groups (e.g. the catalogue failed to load); empty: none. */
  @property() notice = '';

  /** Tiles under the pointer or focused. */
  @state() private _active = new Set<string>();
  /** Still tiles playing one cycle from their badge. */
  @state() private _previewing = new Set<string>();
  @state() private _reduced = false;

  private _timers = new Map<string, ReturnType<typeof setTimeout>>();
  private _mq?: MediaQueryList;
  private _onMq = (): void => {
    this._reduced = !!this._mq?.matches;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._mq = reducedQuery();
    this._reduced = !!this._mq?.matches;
    this._mq?.addEventListener?.('change', this._onMq);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mq?.removeEventListener?.('change', this._onMq);
    this._mq = undefined;
    for (const t of this._timers.values()) clearTimeout(t);
    this._timers.clear();
  }

  private _set(which: '_active' | '_previewing', key: string, on: boolean): void {
    const cur = this[which];
    if (cur.has(key) === on) return;
    const next = new Set(cur);
    if (on) next.add(key);
    else next.delete(key);
    this[which] = next;
  }

  private _preview(s: PresetTileSource, key: string): void {
    clearTimeout(this._timers.get(key));
    this._set('_previewing', key, true);
    this._timers.set(
      key,
      setTimeout(() => {
        this._timers.delete(key);
        this._set('_previewing', key, false);
      }, previewMs(tileDoc(s))),
    );
  }

  private _pick(source: PresetTileSource): void {
    this.dispatchEvent(new CustomEvent<PresetPickDetail>('preset-pick', { detail: { source }, bubbles: true, composed: true }));
  }

  private _tile(s: PresetTileSource): TemplateResult {
    const key = tileKey(s);
    const name = tileName(s);
    const still = tileStill(s);
    const tap = tileTap(s);
    const play = !this._reduced && (!still || this._active.has(key) || this._previewing.has(key));
    return html`<li class="pt-cell">
      <button
        type="button"
        class="pt"
        data-preset=${key}
        title=${name}
        aria-description=${tap ? 'Plays on tap' : nothing}
        @click=${() => this._pick(s)}
        @pointerenter=${() => this._set('_active', key, true)}
        @pointerleave=${() => this._set('_active', key, false)}
        @focus=${() => this._set('_active', key, true)}
        @blur=${() => this._set('_active', key, false)}
      >
        <mc-preset-thumb aria-hidden="true" .source=${s} .play=${play} .hass=${this.hass} .lookup=${this.lookup}></mc-preset-thumb>
        <span class="nm">${name}</span>
        ${tap ? html`<span class="chip is-count" aria-hidden="true">Tap</span>` : nothing}
      </button>
      ${still && !this._reduced
        ? html`<button type="button" class="pt-play" tabindex="-1" aria-hidden="true" title="Preview" @click=${() => this._preview(s, key)}>
            <ha-icon icon="mdi:play"></ha-icon>
          </button>`
        : nothing}
    </li>`;
  }

  protected render(): TemplateResult {
    const groups = groupTiles(this.sources, this.query.trim());
    return html`
      ${groups.length
        ? groups.map(
            (g) => html`<section class="pg" role="group" aria-label=${g.group}>
              <h3>${g.group} <span class="chip is-count">${g.tiles.length}</span></h3>
              <ul class="grid" role="list">
                ${g.tiles.map((s) => this._tile(s))}
              </ul>
            </section>`,
          )
        : html`<div class="no-results">
            <p>No presets match "${this.query}".</p>
            <button type="button" class="btn btn-text btn-sm no-results-clear" @click=${() => this.dispatchEvent(new CustomEvent('preset-clear-search', { bubbles: true, composed: true }))}>
              Clear search
            </button>
          </div>`}
      <p class="notice" role="status" ?hidden=${!this.notice}>${this.notice}</p>
    `;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    css`
      :host {
        display: block;
        max-height: min(64vh, 640px);
        overflow: auto;
        /* sticky group headings never cover the focused tile (WCAG 2.4.11) */
        scroll-padding-top: 32px;
        padding-right: 4px;
      }
      .pg + .pg {
        margin-top: 12px;
      }
      h3 {
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 4px 0 6px;
        background: var(--mc-surface);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .grid {
        list-style: none;
        margin: 0;
        padding: 2px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
        gap: 10px;
      }
      .pt-cell {
        position: relative;
        display: flex;
      }
      .pt {
        width: 100%;
        display: grid;
        align-content: start;
        justify-items: center;
        gap: 6px;
        padding: 8px;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text);
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .pt:hover {
        border-color: color-mix(in srgb, var(--mc-accent) 60%, transparent);
      }
      .pt:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .nm {
        font-size: 0.8125rem;
        line-height: 1.25;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .pt-play {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text);
        cursor: pointer;
        --mdc-icon-size: 16px;
      }
      .pt-play:hover {
        border-color: var(--mc-field-border);
      }
      .no-results {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 32px 12px;
        text-align: center;
      }
      .no-results p,
      .notice {
        margin: 0;
        color: var(--mc-text-2);
      }
      .notice {
        margin-top: 12px;
        font-size: 0.8125rem;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-preset-grid': PresetGrid;
    'mc-preset-thumb': PresetThumb;
  }
}
