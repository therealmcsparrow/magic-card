import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { TRIAL_STYLE_ID } from '../contracts/theme-editor';
import type { ThemeDoc, ThemeMode } from '../contracts/theme-editor';
import { kindOf } from './catalogue';
import { previewVars, validateValue } from './model';
import { createSample, pickEntities, previewCardsEvents, sampleConfig, THIRD_PARTY_SAMPLES } from './preview-cards';
import type { SampleId } from './preview-cards';
import './preview-cards';
import '../theme-safety/wall-tablet';
import type { WallTabletLabels } from '../theme-safety/wall-tablet';
import type { SwitchOption } from './mode-switch';
import { t, tx } from './i18n';
import { browserMode, scopeLabel } from './util';

// The preview stage: every resolved draft variable is set inline on the stage element.

export const PREVIEW_TAG = 'mcte-theme-preview';
/** Updates after the first are batched for this long (acceptance criterion 5: under 200 ms in all). */
export const PREVIEW_DEBOUNCE_MS = 50;

type Bag = Record<string, string>;

// ── scoped variables ──

let defaultsCache: Bag | undefined;

/** HA's default values: the custom properties on `html` / `:root` rules of the page's stylesheets. Read once. */
export function readHaDefaults(doc: Document = document, fresh = false): Bag {
  if (defaultsCache && !fresh) return defaultsCache;
  const out: Bag = {};
  for (const sheet of Array.from(doc.styleSheets ?? [])) {
    // the trial's own values are not HA's defaults
    if ((sheet.ownerNode as Element | null)?.id === TRIAL_STYLE_ID || (doc.getElementById(TRIAL_STYLE_ID) as HTMLStyleElement | null)?.sheet === sheet) continue;
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // a cross-origin sheet
    }
    for (const rule of Array.from(rules)) {
      const r = rule as CSSStyleRule;
      if (!r.selectorText || !r.style) continue;
      if (!r.selectorText.split(',').some((s) => /^(html|:root)$/.test(s.trim()))) continue;
      for (let i = 0; i < r.style.length; i++) {
        const name = r.style[i];
        if (name.startsWith('--')) out[name.slice(2)] = r.style.getPropertyValue(name).trim();
      }
    }
  }
  if (doc === document) defaultsCache = out;
  return out;
}

/** Test hook. */
export function resetHaDefaults(): void {
  defaultsCache = undefined;
}

/** The variables the page's active theme sets inline on `html` (HA applies a theme that way). */
export function pageThemeKeys(el: HTMLElement = document.documentElement): string[] {
  const keys: string[] = [];
  for (let i = 0; i < el.style.length; i++) {
    const name = el.style[i];
    if (name.startsWith('--')) keys.push(name.slice(2));
  }
  return keys;
}

const modeOptions = (): SwitchOption[] => [
  { value: 'light', label: scopeLabel('light') },
  { value: 'dark', label: scopeLabel('dark') },
];
const checkValue = (name: string, value: string): boolean => validateValue(kindOf(name) ?? 'text', value) === null;

/**
 * Keeps one element's inline custom properties equal to a draft: the draft's valid values, plus a
 * reset for every key the page theme sets and the draft does not. Writes only what changed.
 */
export class ScopedVars {
  private readonly applied = new Map<string, string>();
  private readonly lastGood = new Map<string, string>();

  constructor(private readonly root: HTMLElement) {}

  /** Returns how many draft values were invalid and kept at their last valid value (or reset). */
  apply(draft: Bag, pageKeys: string[] = pageThemeKeys(), defaults: Bag = readHaDefaults()): { skipped: number } {
    const next = new Map<string, string>();
    for (const key of pageKeys) if (!(key in draft)) next.set(key, defaults[key] || 'initial');
    for (const [key, value] of Object.entries(draft)) {
      if (!key.startsWith('rgb-') && !checkValue(key, value)) continue;
      next.set(key, value);
      this.lastGood.set(key, value);
    }
    let skipped = 0;
    for (const [key, value] of Object.entries(draft)) {
      if (next.get(key) === value) continue;
      skipped++;
      const keep = this.lastGood.get(key);
      if (keep !== undefined) next.set(key, keep);
      else if (!next.has(key)) next.set(key, defaults[key] || 'initial');
    }
    for (const key of [...this.applied.keys()]) {
      if (!next.has(key)) {
        this.root.style.removeProperty(`--${key}`);
        this.applied.delete(key);
      }
    }
    for (const [key, value] of next) {
      if (this.applied.get(key) === value) continue;
      this.root.style.setProperty(`--${key}`, value);
      this.applied.set(key, value);
    }
    return { skipped };
  }

  clear(): void {
    for (const key of this.applied.keys()) this.root.style.removeProperty(`--${key}`);
    this.applied.clear();
    this.lastGood.clear();
  }

  has(key: string): boolean {
    return this.applied.has(key);
  }
}

// ── <mcte-theme-preview> ──

type SampleState = HTMLElement | 'loading' | 'error' | 'no-entity';

/**
 * The preview area: mode switch, stage with fake header and sidebar, real HA cards and a Magic Card.
 * Properties: `doc` (the draft ThemeDoc), `mode` ('light' | 'dark'; defaults to the browser's mode),
 * `hass`, `hideToolbar`. Event: `mcte-preview-mode` { mode } when the user flips the switch (the
 * editor moves its scope to match). `flush()` applies a pending update at once.
 */
export class McteThemePreview extends LitElement {
  @property({ attribute: false }) doc: ThemeDoc = {};
  @property({ attribute: false }) hass: unknown;
  @property() mode: ThemeMode | undefined;
  @property({ type: Boolean, attribute: 'hide-toolbar' }) hideToolbar = false;
  /** The Wall tablet preview is shown. With `hideToolbar` the host draws the toggle and sets this. */
  @property({ type: Boolean }) tablet = false;
  /** Clicks on the stage name the variable under the pointer (`mcte-preview-pick`). */
  @property({ type: Boolean }) pickable = false;

  @state() private _skipped = 0;
  @state() private _samples = new Map<SampleId, SampleState>();
  @state() private _third: SampleId[] = [];
  @state() private _hover: { x: number; y: number; w: number; h: number } | null = null;

  private _scope?: ScopedVars;
  private _timer?: ReturnType<typeof setTimeout>;
  private _applied = false;
  private _created = false;
  private readonly _onCards = (): void => {
    this._refreshThird();
    void this._buildSamples();
  };

  private get _mode(): ThemeMode {
    return this.mode ?? browserMode(this.hass);
  }

  connectedCallback(): void {
    super.connectedCallback();
    previewCardsEvents.addEventListener('change', this._onCards);
    this._refreshThird();
  }

  disconnectedCallback(): void {
    previewCardsEvents.removeEventListener('change', this._onCards);
    clearTimeout(this._timer);
    this._timer = undefined;
    this._scope?.clear();
    this._scope = undefined;
    this._applied = false;
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('hass')) {
      for (const el of this._samples.values()) if (el instanceof HTMLElement) (el as HTMLElement & { hass?: unknown }).hass = this.hass;
      if (this.hass && !this._created) void this._buildSamples();
    }
    if (changed.has('doc') || changed.has('mode') || changed.has('hass') || !this._applied) {
      if (!this._applied) this.flush();
      else if (changed.has('doc') || changed.has('mode')) this._schedule();
    }
  }

  private _schedule(): void {
    if (this._timer !== undefined) return;
    this._timer = setTimeout(() => {
      this._timer = undefined;
      this.flush();
    }, PREVIEW_DEBOUNCE_MS);
  }

  /** Applies the current doc and mode to the stage now. */
  flush(): void {
    clearTimeout(this._timer);
    this._timer = undefined;
    const stage = this.renderRoot.querySelector<HTMLElement>('.stage');
    if (!stage) return;
    this._scope ??= new ScopedVars(stage);
    const { skipped } = this._scope.apply(previewVars(this.doc, this._mode));
    this._applied = true;
    if (skipped !== this._skipped) this._skipped = skipped;
  }

  private _refreshThird(): void {
    const ids = THIRD_PARTY_SAMPLES.filter((s) => customElements.get(s.tag)).map((s) => s.id);
    if (ids.join() !== this._third.join()) this._third = ids;
  }

  private async _buildSamples(): Promise<void> {
    if (!this.hass) return;
    this._created = true;
    const picks = pickEntities(this.hass as Parameters<typeof pickEntities>[0]);
    const wanted: SampleId[] = ['tile-on', 'tile-off', 'entities', 'magic-card', ...this._third];
    for (const id of wanted) {
      const existing = this._samples.get(id);
      if (existing instanceof HTMLElement || existing === 'loading') continue;
      const config = sampleConfig(id, picks);
      if (!config) {
        this._set(id, 'no-entity');
        continue;
      }
      this._set(id, 'loading');
      try {
        this._set(id, await createSample(config, this.hass));
      } catch {
        this._set(id, 'error');
      }
    }
  }

  private _set(id: SampleId, value: SampleState): void {
    const next = new Map(this._samples);
    next.set(id, value);
    this._samples = next;
  }

  private _pick(mode: ThemeMode): void {
    this.mode = mode;
    this.dispatchEvent(new CustomEvent('mcte-preview-mode', { detail: { mode }, bubbles: true, composed: true }));
  }

  /** The smallest marked part of the stage under a point: its `data-var` (a variable, or `group:<id>`) and its element. */
  private _hit(x: number, y: number): { name: string; el: HTMLElement } | null {
    let best: { name: string; el: HTMLElement; area: number } | null = null;
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>('.stage[data-var], .stage [data-var]')) {
      const r = el.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const area = r.width * r.height;
      if (!best || area < best.area) best = { name: el.dataset.var ?? '', el, area };
    }
    return best;
  }

  private _onStageMove(e: PointerEvent): void {
    if (!this.pickable || e.pointerType === 'touch') return;
    const hit = this._hit(e.clientX, e.clientY);
    if (!hit) {
      if (this._hover) this._hover = null;
      return;
    }
    const stage = e.currentTarget as HTMLElement;
    const r = hit.el.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    const next = { x: r.left - s.left + stage.scrollLeft - stage.clientLeft, y: r.top - s.top + stage.scrollTop - stage.clientTop, w: r.width, h: r.height };
    const h = this._hover;
    if (!h || h.x !== next.x || h.y !== next.y || h.w !== next.w || h.h !== next.h) this._hover = next;
  }

  private _onStageClick(e: MouseEvent): void {
    if (!this.pickable) return;
    const hit = this._hit(e.clientX, e.clientY);
    if (hit?.name) this.dispatchEvent(new CustomEvent('mcte-preview-pick', { detail: { name: hit.name }, bubbles: true, composed: true }));
  }

  private _sample(id: SampleId, name: string, pick?: string): TemplateResult {
    const s = this._samples.get(id) ?? 'loading';
    const v = pick ?? nothing;
    if (s instanceof HTMLElement) return html`<div class="sample" data-var=${v}>${s}</div>`;
    if (s === 'error') return html`<div class="placeholder" data-var=${v}><p class="error">${t('theme-editor.preview.preview-of-name-could-not-load', { name })}</p></div>`;
    if (s === 'no-entity') return html`<div class="placeholder" data-var=${v}><p class="help">${t('theme-editor.preview.add-a-light-or-a-switch-to-home', { name })}</p></div>`;
    return html`<div class="placeholder" aria-busy="true" data-var=${v}></div>`;
  }

  protected render(): TemplateResult {
    const mode = this._mode;
    const hasModes = !!this.doc.modes && Object.keys(this.doc.modes).length > 0;
    const empty = Object.keys(previewVars(this.doc, mode)).length === 0;
    const count = 5 + this._third.length;
    return html`
      ${this.hideToolbar
        ? nothing
        : html`<div class="toolbar">
            ${hasModes
              ? html`<mcte-mode-switch
                  label=${t('theme-editor.preview.preview-mode')}
                  .value=${mode}
                  .options=${modeOptions()}
                  @mcte-change=${(e: CustomEvent<{ value: ThemeMode }>) => (e.stopPropagation(), this._pick(e.detail.value))}
                ></mcte-mode-switch>`
              : html`<span class="help">${t('theme-editor.preview.this-theme-has-no-light-or-dark-modes')}</span>`}
            <span class="chip" aria-live="polite">${t('theme-editor.preview.previewing-mode', { mode })}</span>
            <button type="button" class="tablet-toggle" data-wall-tablet-toggle aria-pressed=${this.tablet ? 'true' : 'false'} @click=${() => (this.tablet = !this.tablet)}>${t('theme-editor.preview.wall-tablet')}</button>
          </div>`}
      ${this.tablet ? html`<mc-wall-tablet .vars=${this._tabletVars(mode)} .labels=${this._tabletLabels(mode)}></mc-wall-tablet>` : nothing}
      ${empty ? html`<p class="help">${t("theme-editor.preview.nothing-set-yet-the-preview-shows-home")}</p>` : nothing}
      <section
        class="stage ${this.pickable ? 'pickable' : ''} ${this._hover ? 'on-part' : ''}"
        aria-label=${t('theme-editor.preview.theme-preview-mode', { mode })}
        tabindex="0"
        data-var="primary-background-color"
        @pointermove=${this._onStageMove}
        @pointerleave=${() => (this._hover = null)}
        @click=${this._onStageClick}
      >
        ${this._hover ? html`<div class="pick" aria-hidden="true" style="left:${this._hover.x}px;top:${this._hover.y}px;width:${this._hover.w}px;height:${this._hover.h}px"></div>` : nothing}
        <p class="sr">${mode === 'dark' ? t('theme-editor.preview.preview-of-count-sample-cards-dark', { count }) : t('theme-editor.preview.preview-of-count-sample-cards-light', { count })}</p>
        ${this._skipped > 0
          ? html`<p class="strip" role="status">${t('theme-editor.preview.showing-the-last-valid-value-for-c', { c: this._skipped })}</p>`
          : nothing}
        <div class="content" inert aria-hidden="true">
          <div class="fake-header" data-var="app-header-background-color"><span class="burger">☰</span><span>${t('theme-editor.preview.overview')}</span></div>
          <div class="body">
            <nav class="fake-side" data-var="sidebar-background-color"><span class="on" data-var="sidebar-selected-text-color">${t('theme-editor.preview.overview')}</span><span>${t('theme-editor.preview.map')}</span><span>${t('theme-editor.preview.settings')}</span></nav>
            <div class="samples">
              <div class="pair">${this._sample('tile-on', t('theme-editor.preview.tile-card'), 'card-background-color')}${this._sample('tile-off', t('theme-editor.preview.tile-card'), 'card-background-color')}</div>
              ${this._sample('entities', t('theme-editor.preview.entities-card'), 'card-background-color')}
              <ha-card class="plain" data-var="card-background-color">
                <div class="card-header" data-var="ha-card-header-color">${t('theme-editor.preview.controls')}</div>
                <div class="card-content controls">
                  <button class="b-primary" tabindex="-1" data-var="primary-color">${t('theme-editor.preview.primary')}</button>
                  <button class="b-secondary" tabindex="-1" data-var="primary-color">${t('theme-editor.preview.secondary')}</button>
                  <button class="b-text" tabindex="-1" data-var="primary-color">${t('theme-editor.preview.text')}</button>
                  <span class="switch" aria-hidden="true" data-var="primary-color"></span>
                  <span class="accent-chip" data-var="accent-color"><i class="dot" aria-hidden="true"></i>${t('theme-editor.preview.accent')}</span>
                  <span class="field" data-var="secondary-background-color">${t('theme-editor.preview.text-field')}</span>
                  <span class="slider" aria-hidden="true" data-var="disabled-color"><i data-var="primary-color"></i></span>
                </div>
              </ha-card>
              ${this._alerts()}
              <ha-card class="plain" data-var="card-background-color">
                <div class="card-content">
                  <h3 data-var="primary-text-color">${t('theme-editor.preview.heading')}</h3>
                  <p data-var="primary-text-color">${t('theme-editor.preview.body-text-in-the-primary-text-colour')}</p>
                  <p class="sec" data-var="secondary-text-color">${tx('theme-editor.preview.secondary-text-and-link', { link: html`<span class="link" data-var="primary-color">${t('theme-editor.preview.a-link')}</span>` })}</p>
                </div>
              </ha-card>
              ${this._sample('magic-card', 'Magic Card', 'group:magic-card')}
              ${this._third.map((id) => this._thirdSample(id))}
            </div>
          </div>
          <p class="help foot">
            ${t('theme-editor.preview.the-preview-is-drawn-with-real-home')}
          </p>
        </div>
      </section>
    `;
  }

  private _tabletVars(mode: ThemeMode): Record<string, string> {
    return Object.fromEntries(Object.entries(previewVars(this.doc, mode)).map(([k, v]) => [`--${k}`, v]));
  }

  private _tabletLabels(mode: ThemeMode): WallTabletLabels {
    return {
      frame: t('theme-editor.preview.wall-tablet-label', { mode: scopeLabel(mode) }),
      caption: t('theme-editor.preview.wall-tablet-caption'),
      title: t('theme-editor.preview.wall-tablet-card-title'),
      text: t('theme-editor.preview.wall-tablet-card-text'),
      value: t('theme-editor.preview.wall-tablet-card-value'),
      button: t('theme-editor.preview.wall-tablet-card-button'),
    };
  }

  private _alerts(): TemplateResult {
    const types: Array<[string, string]> = [
      ['info', t('theme-editor.preview.info-message')],
      ['success', t('theme-editor.preview.success-message')],
      ['warning', t('theme-editor.preview.warning-message')],
      ['error', t('theme-editor.preview.error-message')],
    ];
    const real = !!customElements.get('ha-alert');
    return html`<div class="alerts">
      ${types.map(([type, text]) => (real ? html`<ha-alert alert-type=${type} data-var=${`${type}-color`}>${text}</ha-alert>` : html`<div class="alert a-${type}" data-var=${`${type}-color`}>${text}</div>`))}
    </div>`;
  }

  private _thirdSample(id: SampleId): TemplateResult {
    const meta = THIRD_PARTY_SAMPLES.find((s) => s.id === id);
    return html`<div class="cond" data-var=${`group:${id}`}><p class="help">${meta?.name}</p>${this._sample(id, meta?.name ?? id)}</div>`;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .tablet-toggle {
      min-height: 32px;
      margin: 8px 0;
      padding: 4px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .tablet-toggle[aria-pressed='true'] {
      border-color: var(--primary-color);
      box-shadow: inset 0 0 0 1px var(--primary-color);
      font-weight: 600;
    }
    .tablet-toggle[aria-pressed='true']::before {
      content: '\\2713\\00a0';
    }
    .tablet-toggle:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      margin-bottom: 8px;
    }
    .chip {
      font-size: 0.8125rem;
      color: var(--secondary-text-color);
    }
    .help {
      margin: 0 0 8px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      margin: 0;
    }
    .stage {
      position: relative;
      overflow: auto;
      max-height: 100%;
      padding: 12px;
      border: 1px solid var(--divider-color, #c9ced6);
      border-radius: 8px;
      background: var(--lovelace-background, var(--primary-background-color, #fafafa));
      color: var(--primary-text-color, #212121);
      font-family: var(--primary-font-family, Roboto, sans-serif);
    }
    .stage.pickable.on-part {
      cursor: pointer;
    }
    .pick {
      position: absolute;
      z-index: 2;
      box-sizing: border-box;
      border: 2px solid var(--mc-accent, #0276ab);
      border-radius: 4px;
      pointer-events: none;
    }
    .stage:focus-visible {
      outline: 3px solid var(--mc-focus, #0276ab);
      outline-offset: 2px;
    }
    .strip {
      margin: 0 0 8px;
      padding: 6px 10px;
      border-radius: 6px;
      background: #fff4d6;
      color: #4a3500;
      font-size: 0.8125rem;
    }
    .content {
      max-width: 640px;
      margin: 0 auto;
    }
    .fake-header {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 56px;
      padding: 0 16px;
      margin-bottom: 12px;
      background: var(--app-header-background-color, var(--primary-color, #03a9f4));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      border-radius: 6px;
      font-size: 1.25rem;
    }
    .body {
      display: flex;
      gap: 12px;
    }
    .fake-side {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 120px;
      flex: none;
      padding: 8px;
      border-radius: 6px;
      background: var(--sidebar-background-color, var(--card-background-color, #fff));
      color: var(--sidebar-text-color, var(--primary-text-color, #212121));
      font-size: 0.875rem;
    }
    .fake-side .on {
      background: var(--sidebar-selected-background-color, rgba(3, 169, 244, 0.12));
      color: var(--sidebar-selected-text-color, var(--primary-color, #03a9f4));
      border-radius: 4px;
    }
    .fake-side span {
      padding: 6px 8px;
    }
    @media (max-width: 520px) {
      .fake-side {
        display: none;
      }
    }
    .samples {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .placeholder {
      min-height: 96px;
      padding: 8px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, currentColor 8%, transparent);
    }
    .error {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--error-color, #b3261e);
    }
    ha-card.plain,
    .sample ha-card {
      display: block;
    }
    ha-card.plain {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      box-shadow: var(--ha-card-box-shadow, none);
      color: var(--primary-text-color);
      overflow: hidden;
    }
    .card-header {
      padding: 12px 16px 0;
      font-size: 1.25rem;
    }
    .card-content {
      padding: 16px;
    }
    .card-content h3 {
      margin: 0 0 4px;
    }
    .card-content p {
      margin: 0 0 4px;
    }
    .sec {
      color: var(--secondary-text-color);
    }
    .link {
      color: var(--primary-color);
      text-decoration: underline;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .controls button {
      min-height: 36px;
      padding: 0 16px;
      border-radius: 18px;
      font: inherit;
    }
    .b-primary {
      border: 0;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .b-secondary {
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
    }
    .b-text {
      border: 0;
      background: transparent;
      color: var(--primary-color);
    }
    .switch {
      width: 36px;
      height: 14px;
      border-radius: 7px;
      background: var(--switch-checked-track-color, var(--primary-color));
      opacity: 0.8;
    }
    .accent-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 10px;
      border: 1px solid var(--accent-color);
      border-radius: 999px;
      color: var(--accent-color);
      font-size: 0.85em;
    }
    .accent-chip .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-color);
    }
    .field {
      padding: 6px 10px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid var(--secondary-text-color);
      background: var(--input-fill-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color);
    }
    .slider {
      position: relative;
      width: 96px;
      height: 4px;
      border-radius: 2px;
      background: var(--disabled-color, #bdbdbd);
    }
    .slider i {
      position: absolute;
      inset: 0 40% 0 0;
      border-radius: 2px;
      background: var(--primary-color);
    }
    .alerts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .alert {
      padding: 10px 12px;
      border-radius: 4px;
      border-left: 4px solid currentColor; /* physical */
      background: var(--card-background-color, #fff);
    }
    .a-info {
      color: var(--info-color, #039be5);
    }
    .a-success {
      color: var(--success-color, #43a047);
    }
    .a-warning {
      color: var(--warning-color, #ff9800);
    }
    .a-error {
      color: var(--error-color, #db4437);
    }
    .cond {
      border: 1px dashed var(--divider-color, #c9ced6);
      border-radius: 8px;
      padding: 8px;
    }
    .foot {
      margin-top: 16px;
    }
  `;
}

if (!customElements.get(PREVIEW_TAG)) customElements.define(PREVIEW_TAG, McteThemePreview);

declare global {
  interface HTMLElementTagNameMap {
    'mcte-theme-preview': McteThemePreview;
  }
}
