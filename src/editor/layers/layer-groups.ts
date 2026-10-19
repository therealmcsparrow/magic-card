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
import { MODULE_LOOKS, applyModuleLook, type ModuleLook } from './looks';
import {
  SCRIM_DEFAULT, SCRIM_PRESETS, axisKind, clampStrength, effectiveClickThrough, frontNumber, hasModuleAction, isAnchor, isAutomatic,
  layerOf, layerYaml, offsetError, offsetSide, patchLayer, patchScrim, placementOf, scrimLabel, setPlacement, type LayerEditorContext, type MoveTo, type OffsetAxis,
} from './placement-model';
import { blendTiles, lyrSlider, lyrSwitch } from './controls';
import { layerStyles } from './layer-styles';
import { layerControlCss } from './tokens';

/*
 * Placement and Layer groups of a module's Design tab (designer 03 sections 2-3, round-1 delta 11).
 * They edit the module's top-level `placement` and `layer` keys (layer-placement 1.0.0 r2), never `design`.
 * Every option writes plain YAML; Looks write the same keys. Order moves and the card's Low-power mode need
 * the container list and the card config, so they leave as events the inspector handles:
 *   mc-layer-move  detail { to: 'front' | 'forward' | 'backward' | 'back' }
 *   mc-layers-low-power  (no detail)
 */

const PLACEMENT_ITEMS: ReadonlyArray<{ value: Placement; label: ReturnType<typeof m>; icon: string }> = [
  { value: 'flow', label: m('Normal'), icon: 'mdi:view-sequential-outline' },
  { value: 'background', label: m('Behind others'), icon: 'mdi:arrange-send-to-back' },
  { value: 'overlay', label: m('On top'), icon: 'mdi:arrange-bring-to-front' },
];

const SCRIM_STYLE_ITEMS: ReadonlyArray<{ value: ScrimStyle; label: ReturnType<typeof m>; swatch: string }> = [
  { value: 'dim', label: m('Even'), swatch: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6))' },
  { value: 'bottom', label: m('From bottom'), swatch: 'linear-gradient(to top, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'top', label: m('From top'), swatch: 'linear-gradient(to bottom, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'left', label: m('From left'), swatch: 'linear-gradient(to right, rgba(0,0,0,.7) 35%, transparent)' },
  { value: 'right', label: m('From right'), swatch: 'linear-gradient(to left, rgba(0,0,0,.7) 35%, transparent)' },
];

const SCRIM_COLOURS: ReadonlyArray<{ id: 'black' | 'white' | 'card' | 'custom'; label: ReturnType<typeof m> }> = [
  { id: 'black', label: m('Black') },
  { id: 'white', label: m('White') },
  { id: 'card', label: m('Card colour') },
  { id: 'custom', label: m('Custom') },
];

const SCRIM_PRESET_LABELS = { light: m('Light'), medium: m('Medium'), strong: m('Strong'), 'very-strong': m('Very strong') } as const;

const FILLS: ReadonlyArray<{ value: LayerFill; label: ReturnType<typeof m> }> = [
  { value: 'container', label: m('Its container') },
  { value: 'row', label: m('Its row') },
  { value: 'card', label: m('The whole card') },
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
    return this.ctx?.name || t('this module');
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
    if (p === 'background') return t("Fills the whole container behind the other modules and takes no space. To put a picture behind the whole card, use Card backdrop on the card's Design tab.");
    if (p === 'overlay') return t('Floats over the container at a fixed spot and takes no space.');
    return t('Takes its normal place in the column.');
  }

  private _offsetField(axis: OffsetAxis, anchor: LayerAnchor): TemplateResult {
    const layer = layerOf(this.mod);
    const side = offsetSide(anchor, axis);
    const key = axis === 'x' ? 'offset_x' : 'offset_y';
    const value = this._draft[axis] ?? (axis === 'x' ? layer.offset_x : layer.offset_y) ?? '';
    const err = offsetError(value, anchor, axis);
    const id = `${this._id}-off-${axis}`;
    const label = side === 'left' ? t('From the left') : side === 'right' ? t('From the right') : side === 'top' ? t('From the top') : side === 'bottom' ? t('From the bottom') : t('From the centre');
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
        class="lyr-input"
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
        ? html`<p class="err" id=${`${id}-e`} role="alert">${err === 'negative' ? t('Enter 0 or more: the module stays inside the card.') : t('Enter a distance in px or %.')}</p>`
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
      <span class="lbl" id=${`${this._id}-looks`}>${t('Looks')}</span>
      <div class="tiles2" role="group" aria-labelledby=${`${this._id}-looks`}>
        ${MODULE_LOOKS.map(
          (look) => html`<button type="button" class="lyr-tile" data-look=${look.id} @click=${() => apply(look)}>
            <span class="pv" style=${`background:${look.preview}`}></span><span class="nm">${t(look.name)}</span>
          </button>`,
        )}
      </div>
      ${this._undo
        ? html`<p class="undo" role="status"><span>${t('Applied {name}.', { name: this._undo.name })}</span>
            <button type="button" class="lyr-btn" data-act="undo-look" @click=${() => this._runUndo()}>${t('Undo')}</button></p>`
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
      <div class="group-head"><h3 id=${`${this._id}-ph`}>${t('Placement')}</h3>${auto ? html`<span class="chip2">${t('Automatic')}</span>` : nothing}</div>
      <div class="lseg" role="group" aria-label=${t('Placement')}>
        ${PLACEMENT_ITEMS.map((it) => {
          const on = !auto && p === it.value;
          return html`<button type="button" data-v=${it.value} aria-pressed=${on ? 'true' : 'false'} @click=${() => this._setPlacement(it.value)}>
            ${on ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(it.label)}
          </button>`;
        })}
      </div>
      ${auto
        ? html`<p class="help">${t('This video background sits behind its siblings on its own, as before. Choose an option to set it.')}</p>`
        : html`<p class="help">${this._placementHelp(p)}</p>`}
      ${p === 'background' ? html`<p class="help">${t("Can't reach it? Pick it in the structure list.")}</p>` : nothing}
      ${camera
        ? html`<p class="help" data-hint="camera">${t('A live camera behind other modules keeps video running all day, which is heavy for a wall tablet. For a quiet backdrop, use a still picture in Card backdrop.')}</p>`
        : nothing}
      ${p === 'background' && ctx && ctx.siblings === 0
        ? html`<p class="help" data-hint="fallback">${t('Nothing else is in this container, so this module shows in the normal place until you add one.')}</p>`
        : nothing}
      ${p === 'background' && ctx?.canHoist
        ? html`<div>
            <label for=${`${this._id}-fill`}>${t('Fills')}</label>
            <select class="lyr-input" id=${`${this._id}-fill`} @change=${(e: Event) => this._commit(patchLayer(mod, { fill: this._fillValue((e.target as HTMLSelectElement).value) }))}>
              ${FILLS.map((f) => html`<option value=${f.value} ?selected=${(layer.fill ?? 'container') === f.value}>${t(f.label)}</option>`)}
            </select>
          </div>`
        : nothing}
      ${p === 'overlay'
        ? html`<div class="row2">
              <div class="f">
                <span class="lbl" id=${`${this._id}-pos`}>${t('Position')}</span>
                <mc-anchor-grid .value=${anchor} .label=${t('Position')} @change=${(e: CustomEvent) => this._commit(patchLayer(mod, { anchor: e.detail.value as LayerAnchor }))}></mc-anchor-grid>
              </div>
              <div class="f fields">
                ${this._offsetField('x', anchor)}
                ${this._offsetField('y', anchor)}
              </div>
            </div>
            <p class="help">${axisKind(anchor, 'x') === 'edge' || axisKind(anchor, 'y') === 'edge'
              ? t('Distance from the {anchor} position. Enter 0 or more: the module stays inside the card.', { anchor: anchorName(anchor).toLowerCase() })
              : t('Distance from the centre. Negative values move it left or up.')}</p>
            <p class="help">${t('Keyboard order: top positions come first, bottom positions after the normal modules. For touch, aim for 44 px or more.')}</p>`
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
      { to: 'front', icon: '⤒', text: t('To front'), aria: t('Move {name} to the front', { name }), off: first },
      { to: 'forward', icon: '↑', text: t('Forward'), aria: t('Move {name} forward', { name }), off: first },
      { to: 'backward', icon: '↓', text: t('Backward'), aria: t('Move {name} backward', { name }), off: last },
      { to: 'back', icon: '⤓', text: t('To back'), aria: t('Move {name} to the back', { name }), off: last },
    ];
    const shown = Math.min(rank.count, 8);
    return html`<div class="order-wrap">
      <p class="readout" id=${`${this._id}-ord`} aria-live="polite">${t('{n, select, 1 {1st from the front, of {count}} 2 {2nd from the front, of {count}} 3 {3rd from the front, of {count}} other {{n}th from the front, of {count}}}', { n, count: rank.count })}</p>
      <div class="stack" aria-hidden="true">
        <span>${t('Front')}</span>
        ${Array.from({ length: shown }, (_, i) => html`<span class=${i === Math.min(n, shown) - 1 ? 'bar me' : 'bar'}>${i === Math.min(n, shown) - 1 ? '✓' : ''}</span>`)}
        <span>${t('Back')}</span>
      </div>
      <div class="order" role="group" aria-label=${t('Order')} aria-describedby=${`${this._id}-ord`}>
        ${buttons.map(
          (b) => html`<button
            type="button"
            class="lyr-btn"
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
        ? t("Clicks reach the modules in front. This module's own action is off while this is on.")
        : t('Clicks go to whatever is under this module.')
      : action
        ? t("This module keeps its own action.")
        : t('This layer has no action, so it only blocks taps.');
    return html`${this._switch(`${this._id}-ct`, t('Clicks and taps go through'), on, (v) => {
        const def = p === 'overlay' ? !action : true;
        this._commit(patchLayer(mod, { click_through: v === def ? undefined : v }));
      }, help)}
      ${on && action ? html`<p class="warnrow" data-warn="action">${t('Tapping {name} will do nothing while this is on.', { name: this._nm() })}</p>` : nothing}`;
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
      <button type="button" class="lyr-btn disc" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${this._id}-fx`} @click=${() => (this._effects = !open)}>
        <span class="arrow" aria-hidden="true">▸</span><span>${t('Effects and darkening')}</span>
        ${count ? html`<span class="chip2">${t('{n} set', { n: count })}</span>` : nothing}
      </button>
      <div class="effects" id=${`${this._id}-fx`} ?hidden=${!open}>
        ${this._slider(`${this._id}-blur`, t('Blur'), blur, 0, BLUR_MAX, 'px', (v) => this._commit(patchLayer(mod, { blur: v || undefined })))}
        ${blur > BLUR_LIGHT_MAX ? html`<p class="warnrow" data-warn="blur">${t('Strong blur can make older tablets slow.')}</p>` : nothing}
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
      ${this._switch(`${this._id}-sc`, t('Darken behind text'), on, (v) => this._commit(patchScrim(mod, v ? 'on' : 'off')), t('Adds a dark fade over this picture so text stays readable. Also called a scrim.'))}
      ${on
        ? html`<div class="effects">
            <div>
              <span class="lbl" id=${`${this._id}-ss`}>${t('Style')}</span>
              <div class="tiles2" role="group" aria-labelledby=${`${this._id}-ss`}>
                ${SCRIM_STYLE_ITEMS.map(
                  (it) => html`<button type="button" class="lyr-tile" data-scrim-style=${it.value} aria-pressed=${style === it.value ? 'true' : 'false'} @click=${() => this._commit(patchScrim(mod, { style: it.value }))}>
                    <span class="pv" style=${`background:${it.swatch}, linear-gradient(#e8e8e8,#bdbdbd)`}></span><span class="nm">${style === it.value ? '✓ ' : ''}${t(it.label)}</span>
                  </button>`,
                )}
              </div>
            </div>
            <div>
              <span class="lbl" id=${`${this._id}-sk`}>${t('Colour')}</span>
              <div class="lseg" role="group" aria-labelledby=${`${this._id}-sk`}>
                ${SCRIM_COLOURS.map(
                  (c) => html`<button type="button" data-scrim-colour=${c.id} aria-pressed=${colour === c.id ? 'true' : 'false'} @click=${() => this._setScrimColour(c.id)}>${colour === c.id ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(c.label)}</button>`,
                )}
              </div>
              ${colour === 'custom'
                ? html`<label for=${`${this._id}-cc`}>${t('Custom colour')}</label>
                    <input class="lyr-input" id=${`${this._id}-cc`} type="text" .value=${s?.color ?? ''} placeholder="#003366" @change=${(e: Event) => this._commit(patchScrim(mod, { color: (e.target as HTMLInputElement).value.trim() || undefined }))} />
                    <p class="help">${t('Check the text yourself.')}</p>`
                : nothing}
            </div>
            <div>
              <span class="lbl" id=${`${this._id}-st`}>${t('Strength')}</span>
              <div class="lseg" role="group" aria-labelledby=${`${this._id}-st`}>
                ${SCRIM_PRESETS.map(
                  (p) => html`<button type="button" data-strength=${p.strength} aria-pressed=${strength === p.strength ? 'true' : 'false'} @click=${() => this._commit(patchScrim(mod, { strength: p.strength }))}>${strength === p.strength ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${t(SCRIM_PRESET_LABELS[p.id])} ${p.strength}%</button>`,
                )}
              </div>
              ${this._slider(`${this._id}-sv`, t('Strength'), strength, 0, 90, '%', (v) => this._commit(patchScrim(mod, { strength: v })))}
              <p class="help" data-scrim-note>${scrimLabel(strength) === 'readable' ? t('Text is readable.') : scrimLabel(strength) === 'large' ? t('Large text only (3:1).') : t('Tint only. Not for text.')}</p>
              <p class="help">${t('With a black darkening of 60 % or more, white text stays readable on any picture. This holds for the fully dark part. With a fade, text must sit in the strongest third from that edge.')}</p>
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
      r.code === 'blur' ? t('blur {px} px', { px: r.px }) : r.code === 'blend' ? t('blend') : r.code === 'panzoom' ? t('pan and zoom') : t('live camera');
    const word = cost.level === 'heavy' ? t('heavy') : cost.level === 'medium' ? t('medium') : t('light');
    return html`<div class="costbox">
      <p class="cost" data-level=${cost.level} data-cost>${t('Cost on older tablets:')} <b>${word}</b>${cost.reasons.length ? ` (${cost.reasons.map(reason).join(', ')})` : ''}.</p>
      ${cost.level !== 'light'
        ? html`<div class="acts"><button type="button" class="lyr-btn" data-act="low-power" @click=${() => this.dispatchEvent(new CustomEvent('mc-layers-low-power', { bubbles: true, composed: true }))}>${t('Turn on Low-power mode')}</button></div>
            <p class="help">${t('Low-power mode drops blur, blend and pan and zoom for this card and keeps the pictures.')}</p>`
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
        <p class="warnrow">${t('Covers {name} at this width. Taps on the overlap go to this module.', { name: `“${c.name}”` })}</p>
        <div class="acts">
          <button type="button" class="lyr-btn" data-act="pass" @click=${() => this._commit(patchLayer(mod, { click_through: true }))}>${t('Let clicks and taps go through')}</button>
          <button type="button" class="lyr-btn" data-act="reposition" @click=${() => this.renderRoot.querySelector<HTMLElement>('mc-anchor-grid')?.shadowRoot?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()}>${t('Change position')}</button>
        </div>
      </div>`,
    )}
    ${small ? html`<p class="warnrow" data-check="small">${t('Smaller than a fingertip (44 px). Add padding in Design.')}</p>` : nothing}`;
  }

  private _renderLayer(): TemplateResult {
    const mod = this.mod;
    const layer = layerOf(mod);
    const bg = placementOf(mod) === 'background';
    return html`<section class="group" aria-labelledby=${`${this._id}-lh`}>
      <div class="group-head"><h3 id=${`${this._id}-lh`}>${t('Layer')}</h3></div>
      ${this._renderOrder()}
      ${this._slider(`${this._id}-op`, t('Opacity'), Math.max(0, Math.min(100, layer.opacity ?? 100)), 0, 100, '%', (v) => this._commit(patchLayer(mod, { opacity: v === 100 ? undefined : v })))}
      ${this._renderClickThrough()}
      ${bg && !layer.scrim
        ? html`<div class="acts"><button type="button" class="lyr-btn" data-act="darken" @click=${() => this._commit(patchScrim(mod, 'on'))}>${t('Text hard to read? Darken behind text')}</button></div>`
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
      <button type="button" class="lyr-btn disc" aria-expanded=${this._yaml ? 'true' : 'false'} aria-controls=${`${this._id}-y`} @click=${() => (this._yaml = !this._yaml)}>
        <span class="arrow" aria-hidden="true">▸</span><span>${t('Show YAML')}</span>
      </button>
      <div id=${`${this._id}-y`} ?hidden=${!this._yaml}>
        <pre class="yaml" data-yaml>${text}</pre>
        <div class="acts"><button type="button" class="lyr-btn" data-act="copy-yaml" @click=${async () => {
          this._copied = await copyText(text, this.renderRoot);
        }}>${this._copied ? t('Copied') : t('Copy YAML')}</button></div>
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
