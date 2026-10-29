import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { BLUR_LIGHT_MAX, BLUR_MAX, type LayerAnchor, type LayerFill, type Placement, type ScrimStyle } from '../../contracts/layer-placement';
import type { CardModule, HomeAssistant } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { copyText } from '../components/copy-text';
import '../components/mc-anchor-grid';
import { anchorName } from './anchor-names';
import { m, t } from './i18n';
import { overlapWith, isSmallTarget } from './checks';
import { costFromModule, type CostReason } from './cost';
import { measureBoxes, onLayerMeasure } from './layer-measure';
import { applyModuleLook, looksFor, type ModuleLook } from './looks';
import {
  SCRIM_DEFAULT, SCRIM_PRESETS, axisKind, clampStrength, effectiveClickThrough, frontNumber, hasModuleAction, isAnchor, isAutomatic,
  layerOf, layerYaml, offsetError, offsetSide, patchLayer, patchScrim, placementOf, scrimLabel, setPlacement, type LayerEditorContext, type MoveTo, type OffsetAxis,
} from './placement-model';
import { blendTiles, cancelSliderFrames, chevron, lyrSlider, lyrSwitch } from './controls';
import { layerStyles } from './layer-styles';
import { layerControlCss } from './tokens';

/*
 * Placement and Layer groups of a module's Design tab.
 * They edit the module's top-level `placement` and `layer` keys (layer-placement 1.0.0), never `design`.
 * Every option writes plain YAML; Looks write the same keys. Order moves and the card's Low-power mode need
 * the container list and the card config, so they leave as events the inspector handles:
 *   mc-layer-move  detail { to: 'front' | 'forward' | 'backward' | 'back' }
 *   mc-layers-low-power  (no detail)
 */

const PLACEMENT_ITEMS: ReadonlyArray<{ value: Placement; label: ReturnType<typeof m>; icon: string }> = [
  { value: 'flow', label: m('layer-editor.layer-groups.normal'), icon: 'mdi:view-sequential-outline' },
  { value: 'background', label: m('layer-editor.layer-groups.behind-others'), icon: 'mdi:arrange-send-to-back' },
  { value: 'overlay', label: m('layer-editor.layer-groups.on-top'), icon: 'mdi:arrange-bring-to-front' },
];

const SCRIM_STYLE_ITEMS: ReadonlyArray<{ value: ScrimStyle; label: ReturnType<typeof m>; swatch: string }> = [
  { value: 'dim', label: m('layer-editor.layer-groups.even'), swatch: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6))' },
  { value: 'bottom', label: m('layer-editor.layer-groups.from-bottom'), swatch: 'linear-gradient(to top, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'top', label: m('layer-editor.layer-groups.from-top'), swatch: 'linear-gradient(to bottom, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'left', label: m('layer-editor.layer-groups.from-left'), swatch: 'linear-gradient(to right, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'right', label: m('layer-editor.layer-groups.from-right'), swatch: 'linear-gradient(to left, rgba(0,0,0,.7) 35%, transparent)' },
];

const SCRIM_COLOURS: ReadonlyArray<{ id: 'black' | 'white' | 'card' | 'custom'; label: ReturnType<typeof m> }> = [
  { id: 'black', label: m('layer-editor.layer-groups.black') },
  { id: 'white', label: m('layer-editor.layer-groups.white') },
  { id: 'card', label: m('layer-editor.layer-groups.card-colour') },
  { id: 'custom', label: m('layer-editor.layer-groups.custom') },
];

const SCRIM_PRESET_LABELS = { light: m('layer-editor.layer-groups.light'), medium: m('layer-editor.layer-groups.medium'), strong: m('layer-editor.layer-groups.strong'), 'very-strong': m('layer-editor.layer-groups.very-strong') } as const;

const FILLS: ReadonlyArray<{ value: LayerFill; label: ReturnType<typeof m> }> = [
  { value: 'container', label: m('layer-editor.layer-groups.its-container') },
  { value: 'row', label: m('layer-editor.layer-groups.its-row') },
  { value: 'card', label: m('layer-editor.layer-groups.the-whole-card') },
];

let uid = 0;
/** The offset placeholder: a CSS value, not text. */
const ZERO_PX = '0px';

/** The scrim colour as one of the four choices. */
function scrimColourId(c: string | undefined): 'black' | 'white' | 'card' | 'custom' {
  if (c === undefined || c === 'black' || c === '#000' || c === '#000000') return 'black';
  if (c === 'white' || c === '#fff' || c === '#ffffff') return 'white';
  if (c === 'card') return 'card';
  return 'custom';
}

export class McLayerGroups extends LitElement {
  @property({ attribute: false }) config!: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange: (m: CardModule) => void = () => undefined;
  @property({ attribute: false }) ctx?: LayerEditorContext;

  @state() private _effects = false;
  @state() private _yaml = false;
  @state() private _undo?: { prev: CardModule; name: string };
  @state() private _draft: Partial<Record<OffsetAxis, string>> = {};
  @state() private _copied = false;
  private _undoTimer = 0;
  private _stopMeasure?: () => void;
  private readonly _id = `lg${++uid}`;

  connectedCallback(): void {
    super.connectedCallback();
    this._stopMeasure = onLayerMeasure(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopMeasure?.();
    clearTimeout(this._undoTimer);
    cancelSliderFrames(this.renderRoot);
  }

  static styles = [
    editorSystem,
    layerControlCss,
    layerStyles,
  ];

  // ── helpers ──

  private get mod(): CardModule {
    return this.config;
  }

  private _commit(next: CardModule): void {
    this.onChange(next);
  }

  private _nm(): string {
    return this.ctx?.name || t('layer-editor.layer-groups.this-module');
  }

  private _switch(id: string, label: string, checked: boolean, on: (v: boolean) => void, help?: string): TemplateResult {
    return lyrSwitch(id, label, checked, on, help);
  }

  private _slider(id: string, label: string, value: number, min: number, max: number, unit: string, on: (v: number) => void): TemplateResult {
    return lyrSlider(id, label, value, min, max, unit, on);
  }

  // ── Placement ──

  private _setPlacement(p: Placement): void {
    this._commit(setPlacement(this.mod, p));
  }

  private _placementHelp(p: Placement): string {
    if (p === 'background') return t("layer-editor.layer-groups.fills-the-whole-container-behind-the");
    if (p === 'overlay') return t('layer-editor.layer-groups.floats-over-the-container-at-a-fixed');
    return t('layer-editor.layer-groups.takes-its-normal-place-in-the-column');
  }

  private _offsetField(axis: OffsetAxis, anchor: LayerAnchor): TemplateResult {
    const layer = layerOf(this.mod);
    const side = offsetSide(anchor, axis);
    const key = axis === 'x' ? 'offset_x' : 'offset_y';
    const value = this._draft[axis] ?? (axis === 'x' ? layer.offset_x : layer.offset_y) ?? '';
    const err = offsetError(value, anchor, axis);
    const id = `${this._id}-off-${axis}`;
    const label = side === 'left' ? t('layer-editor.layer-groups.from-the-left') : side === 'right' ? t('layer-editor.layer-groups.from-the-right') : side === 'top' ? t('layer-editor.layer-groups.from-the-top') : side === 'bottom' ? t('layer-editor.layer-groups.from-the-bottom') : t('layer-editor.layer-groups.from-the-centre');
    const commit = (raw: string): void => {
      let v = raw.trim();
      if (/^-?\d{1,4}(\.\d{1,2})?$/.test(v)) v = `${v}px`;
      if (offsetError(v, anchor, axis)) return;
      this._draft = { ...this._draft, [axis]: undefined };
      this._commit(patchLayer(this.mod, { [key]: v || undefined }));
    };
    return html`<div class="f">
      <label for=${id}>${label}</label>
      <input
        class="lyr-input input"
        id=${id}
        type="text"
        inputmode="decimal"
        autocomplete="off"
        placeholder=${ZERO_PX}
        aria-invalid=${err ? 'true' : 'false'}
        aria-describedby=${err ? `${id}-e` : nothing}
        .value=${value}
        @input=${(e: Event) => {
          this._draft = { ...this._draft, [axis]: (e.target as HTMLInputElement).value };
        }}
        @change=${(e: Event) => commit((e.target as HTMLInputElement).value)}
      />
      ${err
        ? html`<p class="err" id=${`${id}-e`} role="alert">${err === 'negative' ? t('layer-editor.layer-groups.enter-0-or-more-the-module-stays-inside') : t('layer-editor.layer-groups.enter-a-distance-in-px-or')}</p>`
        : nothing}
    </div>`;
  }

  private _renderLooks(): TemplateResult {
    const apply = (look: ModuleLook): void => {
      const prev = this.mod;
      this._commit(applyModuleLook(this.mod, look));
      this._showUndo(prev, t(look.name));
    };
    return html`<div class="looks">
      <span class="lbl" id=${`${this._id}-looks`}>${t('layer-editor.layer-groups.looks')}</span>
      <div class="tiles2" role="group" aria-labelledby=${`${this._id}-looks`}>
        ${looksFor(this.mod).map(
          (look) => html`<button type="button" class="lyr-tile" data-look=${look.id} @click=${() => apply(look)}>
            <span class="pv" style=${`background:${look.preview}`}></span><span class="nm">${t(look.name)}</span>
          </button>`,
        )}
      </div>
      ${this._undo
        ? html`<p class="undo" role="status"><span>${t('layer-editor.layer-groups.applied-name', { name: this._undo.name })}</span>
            <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="undo-look" @click=${() => this._runUndo()}>${t('layer-editor.layer-groups.undo')}</button></p>`
        : html`<p class="undo" role="status"></p>`}
    </div>`;
  }

  private _showUndo(prev: CardModule, name: string): void {
    this._undo = { prev, name };
    clearTimeout(this._undoTimer);
    this._undoTimer = window.setTimeout(() => {
      this._undo = undefined;
    }, 12000);
  }

  private _runUndo(): void {
    const u = this._undo;
    if (!u) return;
    this._undo = undefined;
    clearTimeout(this._undoTimer);
    this._commit(u.prev);
  }

  private _renderPlacement(): TemplateResult {
    const mod = this.mod;
    const p = placementOf(mod);
    const auto = isAutomatic(mod);
    const layer = layerOf(mod);
    const anchor: LayerAnchor = isAnchor(layer.anchor) ? layer.anchor : 'top-left';
    const ctx = this.ctx;
    const camera = mod.type === 'camera' && p === 'background';
    return html`<section class="group" aria-labelledby=${`${this._id}-ph`}>
      <div class="group-head"><h3 id=${`${this._id}-ph`}>${t('layer-editor.layer-groups.placement')}</h3>${auto ? html`<span class="chip is-count">${t('layer-editor.layer-groups.automatic')}</span>` : nothing}</div>
      <div class="lseg" role="group" aria-label=${t('layer-editor.layer-groups.placement')}>
        ${PLACEMENT_ITEMS.map((it) => {
          const on = !auto && p === it.value;
          return html`<button type="button" data-v=${it.value} aria-pressed=${on ? 'true' : 'false'} @click=${() => this._setPlacement(it.value)}>
            ${on ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(it.label)}
          </button>`;
        })}
      </div>
      ${auto
        ? html`<p class="help">${t('layer-editor.layer-groups.this-video-background-sits-behind-its')}</p>`
        : html`<p class="help">${this._placementHelp(p)}</p>`}
      ${p === 'background' ? html`<p class="help">${t("layer-editor.layer-groups.can-t-reach-it-pick-it-in-the-structure")}</p>` : nothing}
      ${camera
        ? html`<p class="help" data-hint="camera">${t('layer-editor.layer-groups.a-live-camera-behind-other-modules-keeps')}</p>`
        : nothing}
      ${p === 'background' && ctx && ctx.siblings === 0
        ? html`<p class="help" data-hint="fallback">${t('layer-editor.layer-groups.nothing-else-is-in-this-container-so')}</p>`
        : nothing}
      ${p === 'background' && ctx?.canHoist
        ? html`<div>
            <label for=${`${this._id}-fill`}>${t('layer-editor.layer-groups.fills')}</label>
            <select class="lyr-input input" id=${`${this._id}-fill`} @change=${(e: Event) => this._commit(patchLayer(mod, { fill: this._fillValue((e.target as HTMLSelectElement).value) }))}>
              ${FILLS.map((f) => html`<option value=${f.value} ?selected=${(layer.fill ?? 'container') === f.value}>${t(f.label)}</option>`)}
            </select>
          </div>`
        : nothing}
      ${p === 'overlay'
        ? html`<div class="row2">
              <div class="f">
                <span class="lbl" id=${`${this._id}-pos`}>${t('layer-editor.layer-groups.position')}</span>
                <mc-anchor-grid .value=${anchor} .label=${t('layer-editor.layer-groups.position')} @change=${(e: CustomEvent) => this._commit(patchLayer(mod, { anchor: e.detail.value as LayerAnchor }))}></mc-anchor-grid>
              </div>
              <div class="f fields">
                ${this._offsetField('x', anchor)}
                ${this._offsetField('y', anchor)}
              </div>
            </div>
            <p class="help">${axisKind(anchor, 'x') === 'edge' || axisKind(anchor, 'y') === 'edge'
              ? t('layer-editor.layer-groups.distance-from-the-anchor-position-enter', { anchor: anchorName(anchor).toLowerCase() })
              : t('layer-editor.layer-groups.distance-from-the-centre-negative-values')}</p>
            <p class="help">${t('layer-editor.layer-groups.keyboard-order-top-positions-come-first')}</p>`
        : nothing}
      ${this._renderLooks()}
    </section>`;
  }

  private _fillValue(v: string): LayerFill | undefined {
    return v === 'row' || v === 'card' ? v : undefined;
  }

  // ── Layer ──

  private _move(to: MoveTo): void {
    this.dispatchEvent(new CustomEvent('mc-layer-move', { detail: { to }, bubbles: true, composed: true }));
  }

  private _renderOrder(): TemplateResult | typeof nothing {
    const rank = this.ctx?.rank;
    if (!rank) return nothing;
    const n = frontNumber(rank);
    const first = n === 1;
    const last = n === rank.count;
    const name = this._nm();
    const buttons: ReadonlyArray<{ to: MoveTo; icon: string; text: string; aria: string; off: boolean }> = [
      { to: 'front', icon: '⤒', text: t('layer-editor.layer-groups.to-front'), aria: t('layer-editor.layer-groups.move-name-to-the-front', { name }), off: first },
      { to: 'forward', icon: '↑', text: t('layer-editor.layer-groups.forward'), aria: t('layer-editor.layer-groups.move-name-forward', { name }), off: first },
      { to: 'backward', icon: '↓', text: t('layer-editor.layer-groups.backward'), aria: t('layer-editor.layer-groups.move-name-backward', { name }), off: last },
      { to: 'back', icon: '⤓', text: t('layer-editor.layer-groups.to-back'), aria: t('layer-editor.layer-groups.move-name-to-the-back', { name }), off: last },
    ];
    const shown = Math.min(rank.count, 8);
    return html`<div class="order-wrap">
      <p class="readout" id=${`${this._id}-ord`} aria-live="polite">${t('layer-editor.layer-groups.n', { n, count: rank.count })}</p>
      <div class="stack" aria-hidden="true">
        <span>${t('layer-editor.layer-groups.front')}</span>
        ${Array.from({ length: shown }, (_, i) => html`<span class=${i === Math.min(n, shown) - 1 ? 'bar me' : 'bar'}>${i === Math.min(n, shown) - 1 ? '✓' : ''}</span>`)}
        <span>${t('layer-editor.layer-groups.back')}</span>
      </div>
      <div class="order" role="group" aria-label=${t('layer-editor.layer-groups.order')} aria-describedby=${`${this._id}-ord`}>
        ${buttons.map(
          (b) => html`<button
            type="button"
            class="lyr-btn btn btn-secondary btn-sm"
            data-move=${b.to}
            aria-label=${b.aria}
            aria-disabled=${b.off ? 'true' : 'false'}
            @click=${() => {
              if (!b.off) this._move(b.to);
            }}
          ><span aria-hidden="true">${b.icon}</span>${b.text}</button>`,
        )}
      </div>
    </div>`;
  }

  private _renderClickThrough(): TemplateResult {
    const mod = this.mod;
    const p = placementOf(mod);
    const on = effectiveClickThrough(mod);
    const action = hasModuleAction(mod);
    const help = on
      ? p === 'background'
        ? t("layer-editor.layer-groups.clicks-reach-the-modules-in-front-this")
        : t('layer-editor.layer-groups.clicks-go-to-whatever-is-under-this')
      : action
        ? t("layer-editor.layer-groups.this-module-keeps-its-own-action")
        : t('layer-editor.layer-groups.this-layer-has-no-action-so-it-only');
    return html`${this._switch(`${this._id}-ct`, t('layer-editor.layer-groups.clicks-and-taps-go-through'), on, (v) => {
        const def = p === 'overlay' ? !action : true;
        this._commit(patchLayer(mod, { click_through: v === def ? undefined : v }));
      }, help)}
      ${on && action ? html`<p class="warnrow" data-warn="action">${t('layer-editor.layer-groups.tapping-name-will-do-nothing-while-this', { name: this._nm() })}</p>` : nothing}`;
  }

  private _effectsCount(): number {
    const l = layerOf(this.mod);
    return [l.blur ? 1 : 0, l.blend && l.blend !== 'normal' ? 1 : 0, l.scrim ? 1 : 0].reduce((a, b) => a + b, 0);
  }

  private _renderEffects(): TemplateResult {
    const mod = this.mod;
    const l = layerOf(mod);
    const open = this._effects;
    const count = this._effectsCount();
    const blur = Math.max(0, Math.min(BLUR_MAX, l.blur ?? 0));
    return html`<div>
      <button type="button" class="disc" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${this._id}-fx`} @click=${() => (this._effects = !open)}>
        <span>${t('layer-editor.layer-groups.effects-and-darkening')}</span>
        ${count ? html`<span class="chip is-count">${t('layer-editor.layer-groups.n-set', { n: count })}</span>` : nothing}
        ${chevron()}
      </button>
      <div class="effects" id=${`${this._id}-fx`} ?hidden=${!open}>
        ${this._slider(`${this._id}-blur`, t('layer-editor.layer-groups.blur'), blur, 0, BLUR_MAX, 'px', (v) => this._commit(patchLayer(mod, { blur: v || undefined })))}
        ${blur > BLUR_LIGHT_MAX ? html`<p class="warnrow" data-warn="blur">${t('layer-editor.layer-groups.strong-blur-can-make-older-tablets-slow')}</p>` : nothing}
        ${blendTiles(`${this._id}-bl`, l.blend, (v) => this._commit(patchLayer(mod, { blend: v })))}
        ${this._renderScrim()}
      </div>
    </div>`;
  }

  private _renderScrim(): TemplateResult {
    const mod = this.mod;
    const s = layerOf(mod).scrim;
    const on = !!s;
    const strength = clampStrength(s?.strength ?? SCRIM_DEFAULT.strength);
    const style = s?.style ?? SCRIM_DEFAULT.style;
    const colour = scrimColourId(s?.color);
    return html`<div class="scrim">
      ${this._switch(`${this._id}-sc`, t('layer-editor.layer-groups.darken-behind-text'), on, (v) => this._commit(patchScrim(mod, v ? 'on' : 'off')), t('layer-editor.layer-groups.adds-a-dark-fade-over-this-picture-so'))}
      ${on
        ? html`<div class="effects">
            <div>
              <span class="lbl" id=${`${this._id}-ss`}>${t('layer-editor.layer-groups.style')}</span>
              <div class="tiles2" role="group" aria-labelledby=${`${this._id}-ss`}>
                ${SCRIM_STYLE_ITEMS.map(
                  (it) => html`<button type="button" class="lyr-tile" data-scrim-style=${it.value} aria-pressed=${style === it.value ? 'true' : 'false'} @click=${() => this._commit(patchScrim(mod, { style: it.value }))}>
                    <span class="pv" style=${`background:${it.swatch}, linear-gradient(#e8e8e8,#bdbdbd)`}></span><span class="nm">${style === it.value ? '✓ ' : ''}${t(it.label)}</span>
                  </button>`,
                )}
              </div>
            </div>
            <div>
              <span class="lbl" id=${`${this._id}-sk`}>${t('layer-editor.layer-groups.colour')}</span>
              <div class="lseg" role="group" aria-labelledby=${`${this._id}-sk`}>
                ${SCRIM_COLOURS.map(
                  (c) => html`<button type="button" data-scrim-colour=${c.id} aria-pressed=${colour === c.id ? 'true' : 'false'} @click=${() => this._setScrimColour(c.id)}>${colour === c.id ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(c.label)}</button>`,
                )}
              </div>
              ${colour === 'custom'
                ? html`<label for=${`${this._id}-cc`}>${t('layer-editor.layer-groups.custom-colour')}</label>
                    <input class="lyr-input input" id=${`${this._id}-cc`} type="text" .value=${s?.color ?? ''} placeholder="#003366" @change=${(e: Event) => this._commit(patchScrim(mod, { color: (e.target as HTMLInputElement).value.trim() || undefined }))} />
                    <p class="help">${t('layer-editor.layer-groups.check-the-text-yourself')}</p>`
                : nothing}
            </div>
            <div>
              <span class="lbl" id=${`${this._id}-st`}>${t('layer-editor.layer-groups.strength')}</span>
              <div class="lseg" role="group" aria-labelledby=${`${this._id}-st`}>
                ${SCRIM_PRESETS.map(
                  (p) => html`<button type="button" data-strength=${p.strength} aria-pressed=${strength === p.strength ? 'true' : 'false'} @click=${() => this._commit(patchScrim(mod, { strength: p.strength }))}>${strength === p.strength ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(SCRIM_PRESET_LABELS[p.id])} ${p.strength}%</button>`,
                )}
              </div>
              ${this._slider(`${this._id}-sv`, t('layer-editor.layer-groups.strength'), strength, 0, 90, '%', (v) => this._commit(patchScrim(mod, { strength: v })))}
              <p class="help" data-scrim-note>${scrimLabel(strength) === 'readable' ? t('layer-editor.layer-groups.text-is-readable') : scrimLabel(strength) === 'large' ? t('layer-editor.layer-groups.large-text-only-3-1') : t('layer-editor.layer-groups.tint-only-not-for-text')}</p>
              <p class="help">${t('layer-editor.layer-groups.with-a-black-darkening-of-60-or-more')}</p>
            </div>
          </div>`
        : nothing}
    </div>`;
  }

  private _setScrimColour(id: 'black' | 'white' | 'card' | 'custom'): void {
    const mod = this.mod;
    if (id === 'custom') {
      this._commit(patchScrim(mod, { color: '#003366' }));
      return;
    }
    this._commit(patchScrim(mod, { color: id === 'black' ? undefined : id === 'white' ? '#ffffff' : 'card' }));
  }

  private _renderCost(): TemplateResult {
    const cost = costFromModule(this.mod, this.ctx?.rank?.count ?? 1);
    const reason = (r: CostReason): string =>
      r.code === 'blur' ? t('layer-editor.layer-groups.blur-px-px', { px: r.px }) : r.code === 'blend' ? t('layer-editor.layer-groups.blend') : r.code === 'panzoom' ? t('layer-editor.layer-groups.pan-and-zoom') : t('layer-editor.layer-groups.live-camera');
    const word = cost.level === 'heavy' ? t('layer-editor.layer-groups.heavy') : cost.level === 'medium' ? t('layer-editor.layer-groups.medium-2') : t('layer-editor.layer-groups.light-2');
    return html`<div class="costbox">
      <p class="cost" data-level=${cost.level} data-cost>${t('layer-editor.layer-groups.cost-on-older-tablets')} <b>${word}</b>${cost.reasons.length ? ` (${cost.reasons.map(reason).join(', ')})` : ''}.</p>
      ${cost.level !== 'light'
        ? html`<div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="low-power" @click=${() => this.dispatchEvent(new CustomEvent('mc-layers-low-power', { bubbles: true, composed: true }))}>${t('layer-editor.layer-groups.turn-on-low-power-mode')}</button></div>
            <p class="help">${t('layer-editor.layer-groups.low-power-mode-drops-blur-blend-and-pan')}</p>`
        : nothing}
    </div>`;
  }

  private _renderChecks(): TemplateResult | typeof nothing {
    const mod = this.mod;
    const ctx = this.ctx;
    if (placementOf(mod) !== 'overlay' || !ctx) return nothing;
    const boxes = measureBoxes([ctx.path, ...ctx.others.map((o) => o.path)]);
    const own = boxes[ctx.path];
    if (!own) return nothing;
    const covered = effectiveClickThrough(mod)
      ? []
      : overlapWith(own, ctx.others.flatMap((o) => (boxes[o.path] ? [{ name: o.name, box: boxes[o.path]! }] : [])));
    const small = hasModuleAction(mod) && !effectiveClickThrough(mod) && isSmallTarget(own);
    return html`${covered.map(
      (c) => html`<div class="check" data-check="overlap">
        <p class="warnrow">${t('layer-editor.layer-groups.covers-name-at-this-width-taps-on-the', { name: `“${c.name}”` })}</p>
        <div class="acts">
          <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="pass" @click=${() => this._commit(patchLayer(mod, { click_through: true }))}>${t('layer-editor.layer-groups.let-clicks-and-taps-go-through')}</button>
          <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="reposition" @click=${() => this.renderRoot.querySelector<HTMLElement>('mc-anchor-grid')?.shadowRoot?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()}>${t('layer-editor.layer-groups.change-position')}</button>
        </div>
      </div>`,
    )}
    ${small ? html`<p class="warnrow" data-check="small">${t('layer-editor.layer-groups.smaller-than-a-fingertip-44-px-add')}</p>` : nothing}`;
  }

  private _renderLayer(): TemplateResult {
    const mod = this.mod;
    const layer = layerOf(mod);
    const bg = placementOf(mod) === 'background';
    return html`<section class="group" aria-labelledby=${`${this._id}-lh`}>
      <div class="group-head"><h3 id=${`${this._id}-lh`}>${t('layer-editor.layer-groups.layer')}</h3></div>
      ${this._renderOrder()}
      ${this._slider(`${this._id}-op`, t('layer-editor.layer-groups.opacity'), Math.max(0, Math.min(100, layer.opacity ?? 100)), 0, 100, '%', (v) => this._commit(patchLayer(mod, { opacity: v === 100 ? undefined : v })))}
      ${this._renderClickThrough()}
      ${bg && !layer.scrim
        ? html`<div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="darken" @click=${() => this._commit(patchScrim(mod, 'on'))}>${t('layer-editor.layer-groups.text-hard-to-read-darken-behind-text')}</button></div>`
        : nothing}
      ${this._renderEffects()}
      ${this._renderCost()}
      ${this._renderChecks()}
    </section>`;
  }

  // ── Show YAML ──

  private _renderYaml(): TemplateResult | typeof nothing {
    const text = layerYaml(this.mod);
    if (!text) return nothing;
    return html`<div>
      <button type="button" class="disc" aria-expanded=${this._yaml ? 'true' : 'false'} aria-controls=${`${this._id}-y`} @click=${() => (this._yaml = !this._yaml)}>
        <span>${t('layer-editor.layer-groups.show-yaml')}</span>${chevron()}
      </button>
      <div id=${`${this._id}-y`} ?hidden=${!this._yaml}>
        <pre class="yaml" data-yaml>${text}</pre>
        <div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="copy-yaml" @click=${async () => {
          this._copied = await copyText(text, this.renderRoot);
        }}>${this._copied ? t('layer-editor.layer-groups.copied') : t('layer-editor.layer-groups.copy-yaml')}</button></div>
      </div>
    </div>`;
  }

  protected render(): TemplateResult {
    if (!this.config) return html``;
    return html`<div class="groups">
      ${this._renderPlacement()}
      ${placementOf(this.mod) !== 'flow' ? this._renderLayer() : nothing}
      ${this._renderYaml()}
    </div>`;
  }
}

/**
 * Hosts the groups in front of the module's design panel. The design panel reports its view
 * (`mc-design-view`, detail { view }); the groups belong to Default only, so they are hidden in the Hover
 * view and inside a conditional design rule (module-editor 1.3.0).
 */
export class McLayerDesign extends LitElement {
  @property({ attribute: false }) config!: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange: (m: CardModule) => void = () => undefined;
  @property({ attribute: false }) ctx?: LayerEditorContext;
  @state() private _view = 'default';

  static styles = [css`:host{display:block;min-width:0}[hidden]{display:none}`];

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mc-design-view', this._onView);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mc-design-view', this._onView);
  }

  private _onView = (e: Event): void => {
    const v = (e as CustomEvent<{ view?: string }>).detail?.view;
    this._view = typeof v === 'string' ? v : 'default';
  };

  protected render(): TemplateResult {
    return html`<mc-layer-groups ?hidden=${this._view !== 'default'} .config=${this.config} .hass=${this.hass} .onChange=${this.onChange} .ctx=${this.ctx}></mc-layer-groups>
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-layer-groups': McLayerGroups;
    'mc-layer-design': McLayerDesign;
  }
}
