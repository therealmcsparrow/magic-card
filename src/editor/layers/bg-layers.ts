import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { MAX_BACKGROUND_LAYERS, type BackgroundLayerConfig, type BgLayerType } from '../../contracts/bg-stack';
import type { RuleView } from '../../contracts/layer-editor';
import type { HomeAssistant } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { copyText } from '../components/copy-text';
import { t as te } from '../i18n';
import { m, t } from './i18n';
import { renderLayerEditor, type EditorHost } from './bg-layer-editor';
import { LAYER_TYPES, layerSummary } from './bg-layers-model';
import { LIMIT_TEXT, addLayer, moveLayerIn, removeLayer, restoreLayer, setLayerKeys, statusSentence, thumbStyle, previewSrc } from './bg-layers-ops';
import { getPreview, getStatus, onStatus, previewAvailable, setPreview, takeOpenLayer, type PanPreview } from './bg-status';
import { costFromBackdrop, type CostReason } from './cost';
import { BACKDROP_LOOKS, addBackdropLook, type BackdropLook } from './looks';
import { layerStyles } from './layer-styles';
import { layerControlCss } from './tokens';
import { cancelSliderFrames, chevron, lyrSwitch } from './controls';

// Card backdrop group: `background_layers` as rows with an inline editor, Looks, cost meter and rule view.

const TYPE_ICONS: Record<string, string> = { image: 'mdi:image-outline', gradient: 'mdi:gradient-vertical', pattern: 'mdi:dots-grid', color: 'mdi:palette-outline' };
const ADD_ITEMS: ReadonlyArray<{ value: BgLayerType; label: ReturnType<typeof m> }> = LAYER_TYPES.map((x) => ({ value: x.value, label: x.label }));
const UNDO_MS = 12000;
let uid = 0;

export class McBgLayers extends LitElement {
  @property({ attribute: false }) layers?: BackgroundLayerConfig[];
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Every change as the whole list (an empty list when the last layer goes). */
  @property({ attribute: false }) onWrite: (list: BackgroundLayerConfig[]) => void = () => undefined;
  /** Set inside a conditional design rule. */
  @property({ attribute: false }) rule?: RuleView;
  /** Rule view: the normal layers to start from, and the two buttons. */
  @property({ attribute: false }) onRule?: (act: 'start' | 'reset') => void;
  @property({ type: Boolean }) lowPower = false;
  @property({ attribute: false }) onLowPower?: () => void;
  @property({ attribute: false }) cardEntity?: string;

  @state() private _open = -1;
  @state() private _adding = false;
  @state() private _deleted?: { layer: BackgroundLayerConfig; index: number; name: string };
  @state() private _undo?: { list: BackgroundLayerConfig[]; message: string };
  @state() private _live = '';
  @state() private _blank?: number;
  @state() private _pan = new Set<number>();
  @state() private _yaml = new Set<number>();
  @state() private _copied = false;
  @state() private _tick = 0;
  private _timer = 0;
  private _paused = false;
  private _focus?: { sel: string; index?: number; tries?: number };
  private _stop?: () => void;
  private readonly _id = `bgl${++uid}`;

  connectedCallback(): void {
    super.connectedCallback();
    this._stop = onStatus(() => {
      const want = takeOpenLayer();
      if (want !== undefined && want < (this.layers?.length ?? 0)) this._open = want;
      this._tick++;
    });
    this.addEventListener('keydown', this._onKey);
    const want = takeOpenLayer();
    if (want !== undefined) this._open = want;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stop?.();
    setPreview(undefined); // the preview belongs to this editor session
    this.removeEventListener('keydown', this._onKey);
    clearTimeout(this._timer);
    cancelSliderFrames(this.renderRoot);
  }

  static styles = [
    editorSystem,
    layerControlCss,
    layerStyles,
    css`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      .bgl {
        display: grid;
        gap: 12px;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      /* a layer row is a container, so it takes the kit divider; the controls inside carry the 3:1 line */
      .row {
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg, 12px);
        background: var(--mc-surface);
        padding: 10px;
        display: grid;
        gap: 8px;
      }
      .r1 {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .rhead {
        flex: 1 1 140px;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: var(--lyr-hit);
        padding: 0 4px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .rhead .title {
        font-weight: 700;
        font-size: 0.875rem;
      }
      .rhead .sum {
        display: block;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
      }
      .thumb {
        flex: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid var(--mc-divider);
        display: grid;
        place-items: center;
        overflow: hidden;
        background-color: var(--mc-surface-2);
        --mdc-icon-size: 18px;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .r2 {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .r2 .del {
        margin-left: auto;
      }
      .editor {
        display: grid;
        gap: 14px;
        padding-top: 8px;
        border-top: 1px solid var(--mc-ed-divider);
      }
      .field {
        display: grid;
        gap: 8px;
      }
      .gone {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 8px;
        border: 1px dashed var(--mc-field-border);
        border-radius: var(--mc-radius);
      }
      .state-row {
        display: grid;
        gap: 6px;
        padding: 8px;
        border: 1px solid var(--mc-ed-divider);
        border-radius: var(--mc-radius);
      }
      .skeleton {
        background: linear-gradient(90deg, var(--mc-surface-2), var(--mc-surface), var(--mc-surface-2));
        background-size: 200% 100%;
        animation: sk 1.2s linear infinite;
      }
      @keyframes sk {
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton {
          animation: none;
        }
      }
      .stale {
        font-weight: 700;
      }
      .head2 {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    `,
  ];

  // ── list changes ──

  private get _list(): BackgroundLayerConfig[] {
    return Array.isArray(this.layers) ? this.layers.slice(0, MAX_BACKGROUND_LAYERS) : [];
  }

  private _write(list: BackgroundLayerConfig[]): void {
    this.onWrite(list);
  }

  /** Remember the list for Undo (type or source switch, a Look). */
  private _offerUndo(message: string): void {
    this._undo = { list: this._list, message };
    clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      this._undo = undefined;
    }, UNDO_MS);
    this._live = message;
  }

  private _runUndo(): void {
    const u = this._undo;
    if (!u) return;
    this._undo = undefined;
    this._write(u.list);
    this._live = t('layer-editor.bg-layers.undone');
  }

  private _add(type: BgLayerType): void {
    const next = addLayer(this._list, type);
    this._adding = false;
    if (!next) {
      this._live = t(LIMIT_TEXT, { max: MAX_BACKGROUND_LAYERS });
      return;
    }
    this._write(next);
    this._open = 0;
    this._focus = { sel: '.rhead', index: 0 };
    this._live = t('layer-editor.bg-layers.layer-added-n-of-max', { n: next.length, max: MAX_BACKGROUND_LAYERS });
  }

  private _move(i: number, dir: 'forward' | 'backward'): void {
    const next = moveLayerIn(this._list, i, dir);
    if (!next) return;
    const to = dir === 'forward' ? i - 1 : i + 1;
    this._write(next);
    if (this._open === i) this._open = to;
    this._focus = { sel: `[data-act=${dir}]`, index: to };
    this._live = t('layer-editor.bg-layers.moved-to-layer-n-of-count', { n: to + 1, count: next.length });
  }

  private _delete(i: number): void {
    const r = removeLayer(this._list, i);
    if (!r) return;
    const name = this._name(r.removed, i);
    this._deleted = { layer: r.removed, index: i, name };
    this._open = -1;
    this._write(r.list);
    this._focus = { sel: '[data-act=undo-delete]' };
    this._live = t('layer-editor.bg-layers.name-deleted-undo-is-the-next-button', { name });
    this._armDelete();
  }

  private _armDelete(): void {
    clearTimeout(this._timer);
    if (this._paused) return;
    this._timer = window.setTimeout(() => {
      this._deleted = undefined;
    }, UNDO_MS);
  }

  private _restore(): void {
    const d = this._deleted;
    if (!d) return;
    this._deleted = undefined;
    clearTimeout(this._timer);
    this._write(restoreLayer(this._list, d.layer, d.index));
    this._focus = { sel: '.rhead', index: Math.min(d.index, MAX_BACKGROUND_LAYERS - 1) };
    this._live = t('layer-editor.bg-layers.name-restored', { name: d.name });
  }

  private _patch(i: number, p: Partial<BackgroundLayerConfig>): void {
    const list = this._list;
    if (!list[i]) return;
    this._write(list.map((l, j) => (j === i ? setLayerKeys(l, p) : l)));
  }

  private _swap(i: number, next: BackgroundLayerConfig, message: string): void {
    const list = this._list;
    if (!list[i]) return;
    this._offerUndo(message);
    this._write(list.map((l, j) => (j === i ? next : l)));
  }

  private _applyLook(look: BackdropLook): void {
    const next = addBackdropLook(this._list, look, this.hass);
    if (!next) return;
    this._offerUndo(t('layer-editor.bg-layers.added-name', { name: t(look.name) }));
    this._write(next);
    this._open = 0;
  }

  private _onKey = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && (this._deleted || this._undo)) {
      e.preventDefault();
      e.stopPropagation();
      if (this._deleted) this._restore();
      else this._runUndo();
    }
  };

  // ── view helpers ──

  private _name(layer: BackgroundLayerConfig, i: number): string {
    const s = layerSummary(layer);
    return t('layer-editor.bg-layers.type-layer-n', { type: te(s.type), n: i + 1 });
  }

  protected updated(): void {
    // no layer has pan and zoom any more (turned off, removed): nothing left to preview
    if (getPreview() && !this._list.some((l) => l.pan_zoom)) setPreview(undefined);
    const f = this._focus;
    if (!f) return;
    const rows = this.renderRoot.querySelectorAll<HTMLElement>('.row');
    const scope = f.index === undefined ? this.renderRoot : rows[f.index];
    const target = scope?.querySelector<HTMLElement>(f.sel);
    // the first layer: this render may come before the host hands the new list back, so the row is not there yet; try the next render
    if (!target && (f.tries = (f.tries ?? 0) + 1) < 6) return;
    this._focus = undefined;
    target?.focus();
  }

  private _host(): EditorHost {
    return {
      hass: this.hass,
      cardEntity: this.cardEntity,
      idOf: (i, p) => `${this._id}-${i}-${p}`,
      patch: (i, p) => this._patch(i, p),
      swap: (i, n, msg) => this._swap(i, n, msg),
      preview: getPreview(),
      setPreview: (p?: PanPreview) => setPreview(p),
      canPreview: previewAvailable(),
      blankRow: this._blank,
      addBlankRow: (i) => (this._blank = i),
      clearBlankRow: () => (this._blank = undefined),
      panOpen: (i) => this._pan.has(i),
      togglePan: (i) => this._flip('_pan', i),
      yamlOpen: (i) => this._yaml.has(i),
      toggleYaml: (i) => this._flip('_yaml', i),
      copyYaml: async (text) => {
        this._copied = await copyText(text, this.renderRoot);
      },
      copied: this._copied,
    };
  }

  private _flip(key: '_pan' | '_yaml', i: number): void {
    const next = new Set(this[key]);
    if (!next.delete(i)) next.add(i);
    else if (key === '_pan') setPreview(undefined); // collapsing the section ends the preview
    this[key] = next;
  }

  private _renderRow(layer: BackgroundLayerConfig, i: number, count: number, host: EditorHost): TemplateResult {
    const open = this._open === i;
    const s = layerSummary(layer);
    const name = this._name(layer, i);
    const hidden = layer.hidden === true;
    const st = rowStatus(i, layer);
    const src = layer.type === 'image' ? previewSrc(this.hass, layer.image) : undefined;
    const style = thumbStyle(layer);
    return html`<li class="row" data-i=${i} ?data-open=${open}>
      <div class="r1">
        <button type="button" class="rhead" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`${this._id}-${i}-ed`} aria-label=${name} @click=${() => (this._open = open ? -1 : i)}>
          <span class="thumb ${st.loading ? 'skeleton' : ''}" style=${style} aria-hidden="true">${src ? html`<img src=${src} alt="" loading="lazy" referrerpolicy="no-referrer" />` : style ? nothing : html`<ha-icon icon=${TYPE_ICONS[layer.type] ?? 'mdi:layers-outline'}></ha-icon>`}</span>
          <span><span class="title">${te(s.type)}</span><span class="sum">${s.detail ?? ''}</span></span>
          ${chevron()}
        </button>
        ${hidden ? html`<span class="chip" data-chip="hidden">${t('layer-editor.bg-layers.hidden')}</span>` : nothing}
        ${st.chip ? html`<span class="chip ${st.stale ? 'stale' : 'is-warn'}" data-chip=${st.stale ? 'stale' : 'problem'}>${st.stale ? '' : '⚠ '}${st.chip}</span>` : nothing}
      </div>
      <div class="r2">
        <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="hide" aria-label=${hidden ? t('layer-editor.bg-layers.show-name', { name }) : t('layer-editor.bg-layers.hide-name', { name })} @click=${() => this._patch(i, { hidden: hidden ? undefined : true })}>${hidden ? t('layer-editor.bg-layers.show') : t('layer-editor.bg-layers.hide')}</button>
        <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="forward" aria-label=${t('layer-editor.bg-layers.move-name-forward', { name })} aria-disabled=${i === 0 ? 'true' : 'false'} @click=${() => this._move(i, 'forward')}>↑ ${t('layer-editor.bg-layers.forward')}</button>
        <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="backward" aria-label=${t('layer-editor.bg-layers.move-name-backward', { name })} aria-disabled=${i === count - 1 ? 'true' : 'false'} @click=${() => this._move(i, 'backward')}>↓ ${t('layer-editor.bg-layers.backward')}</button>
        <button type="button" class="lyr-btn btn btn-secondary btn-sm del" data-act="delete" aria-label=${t('layer-editor.bg-layers.delete-name', { name })} @click=${() => this._delete(i)}>${t('layer-editor.bg-layers.delete')}</button>
      </div>
      ${st.sentence ? html`<p class="warnrow" data-status role="status">${st.sentence}</p>` : nothing}
      <div id=${`${this._id}-${i}-ed`} ?hidden=${!open}>${open ? renderLayerEditor(host, layer, i) : nothing}</div>
    </li>`;
  }

  private _renderGone(): TemplateResult {
    const d = this._deleted!;
    return html`<li class="gone" data-gone @mouseenter=${() => this._hold(true)} @mouseleave=${() => this._hold(false)} @focusin=${() => this._hold(true)} @focusout=${() => this._hold(false)}>
      <span>${t('layer-editor.bg-layers.name-deleted', { name: d.name })}</span>
      <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="undo-delete" @click=${() => this._restore()}>${t('layer-editor.bg-layers.undo')}</button>
    </li>`;
  }

  /** The 12 s Undo window waits while the pointer or focus is on it. */
  private _hold(on: boolean): void {
    this._paused = on;
    if (on) clearTimeout(this._timer);
    else if (this._deleted) this._armDelete();
  }

  private _renderCost(): TemplateResult | typeof nothing {
    const list = this._list;
    if (!list.length) return nothing;
    const cost = costFromBackdrop(list, this.lowPower);
    const reason = (r: CostReason): string => (r.code === 'blur' ? t('layer-editor.bg-layers.blur-px-px', { px: r.px }) : r.code === 'blend' ? t('layer-editor.bg-layers.blend') : r.code === 'panzoom' ? t('layer-editor.bg-layers.pan-and-zoom') : t('layer-editor.bg-layers.live-camera'));
    const word = cost.level === 'heavy' ? t('layer-editor.bg-layers.heavy') : cost.level === 'medium' ? t('layer-editor.bg-layers.medium') : t('layer-editor.bg-layers.light');
    return html`<div class="costbox">
      <p class="cost" data-cost data-level=${cost.level}>${t('layer-editor.bg-layers.cost-on-older-tablets')} <b>${word}</b>${cost.reasons.length ? ` (${cost.reasons.map(reason).join(', ')})` : ''}.</p>
      ${lyrSwitch(`${this._id}-lp`, t('layer-editor.bg-layers.low-power-mode'), this.lowPower, () => this.onLowPower?.(), t('layer-editor.bg-layers.drops-blur-blend-and-pan-and-zoom-for'))}
    </div>`;
  }

  protected render(): TemplateResult {
    const rule = this.rule;
    if (rule && !rule.own) {
      return html`<div class="bgl">
        <p class="help" data-rule="none">${t('layer-editor.bg-layers.this-rule-does-not-change-the')}</p>
        <div class="acts"><button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="rule-start" @click=${() => this.onRule?.('start')}>${t('layer-editor.bg-layers.change-backgrounds-in-this-rule')}</button></div>
      </div>`;
    }
    const list = this._list;
    const host = this._host();
    const full = list.length >= MAX_BACKGROUND_LAYERS;
    const rows: TemplateResult[] = list.map((l, i) => this._renderRow(l, i, list.length, host));
    if (this._deleted) rows.splice(Math.min(this._deleted.index, rows.length), 0, this._renderGone());
    return html`<div class="bgl">
      ${rule
        ? html`<div class="field">
            <span class="chip is-accent" data-rule="own">${t('layer-editor.bg-layers.this-rule-uses-its-own-backgrounds')}</span>
            <div class="acts">
              <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="rule-start" @click=${() => this.onRule?.('start')}>${t('layer-editor.bg-layers.start-again-from-the-normal-ones')}</button>
              <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="rule-reset" @click=${() => this.onRule?.('reset')}>${t('layer-editor.bg-layers.use-the-normal-backgrounds')}</button>
            </div>
          </div>`
        : html`<p class="help">${t('layer-editor.bg-layers.to-put-a-module-behind-others-use')}</p>`}
      <div class="head2"><span class="chip is-count" data-count>${t('layer-editor.bg-layers.n-of-max', { n: list.length, max: MAX_BACKGROUND_LAYERS })}</span></div>
      ${list.length || this._deleted ? html`<ol aria-label=${t('layer-editor.bg-layers.card-backdrop-layers-front-first')}>${rows}</ol>` : html`<p class="help" data-empty>${t('layer-editor.bg-layers.no-layers-yet-add-an-image-gradient')}</p>`}
      ${this._undo ? html`<p class="undo"><span>${this._undo.message}</span> <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="undo" @click=${() => this._runUndo()}>${t('layer-editor.bg-layers.undo')}</button></p>` : nothing}
      <div class="add">
        <button type="button" class="lyr-btn btn btn-secondary btn-sm" data-act="add" aria-haspopup="true" aria-expanded=${this._adding ? 'true' : 'false'} aria-disabled=${full ? 'true' : 'false'} aria-describedby=${full ? `${this._id}-limit` : nothing} @click=${() => (full ? (this._live = t(LIMIT_TEXT, { max: MAX_BACKGROUND_LAYERS })) : (this._adding = !this._adding))}>${full ? t('layer-editor.bg-layers.add-layer') : t('layer-editor.bg-layers.add-layer-n-left', { n: MAX_BACKGROUND_LAYERS - list.length })}</button>
        ${full ? html`<p class="warnrow" id=${`${this._id}-limit`} data-limit>${t(LIMIT_TEXT, { max: MAX_BACKGROUND_LAYERS })}</p>` : nothing}
        ${this._adding && !full
          ? html`<div class="lseg" role="group" aria-label=${t('layer-editor.bg-layers.layer-type')}>${ADD_ITEMS.map((it) => html`<button type="button" data-add=${it.value} aria-pressed="false" @click=${() => this._add(it.value)}>${te(it.label)}</button>`)}</div>`
          : nothing}
      </div>
      <div class="looks">
        <span class="lbl" id=${`${this._id}-looks`}>${t('layer-editor.bg-layers.looks')}</span>
        <div class="tiles2" role="group" aria-labelledby=${`${this._id}-looks`}>
          ${BACKDROP_LOOKS.map((look) => {
            const fits = list.length + look.count <= MAX_BACKGROUND_LAYERS;
            return html`<button type="button" class="lyr-tile" data-look=${look.id} aria-disabled=${fits ? 'false' : 'true'} title=${fits ? '' : t('layer-editor.bg-layers.needs-n-free-layers', { n: look.count })} @click=${() => fits && this._applyLook(look)}>
              <span class="pv" style=${`background:${look.preview}`}></span><span class="nm">${t(look.name)}</span>${fits ? nothing : html`<span class="sub">${t('layer-editor.bg-layers.needs-n-free-layers', { n: look.count })}</span>`}
            </button>`;
          })}
        </div>
      </div>
      ${this._renderCost()}
      <p class="help">${t("layer-editor.bg-layers.can-t-reach-it-pick-it-in-the-structure")}</p>
      <p class="sr-only" role="status" aria-live="polite" data-live>${this._live}</p>
    </div>`;
  }
}

/** What a row shows for the preview's report on its layer (only meaningful in the Default view). */
function rowStatus(i: number, layer: BackgroundLayerConfig): { chip?: string; sentence?: string; stale?: boolean; loading?: boolean } {
  const s = getStatus(i);
  if (!s || layer.hidden) return {};
  if (s.status === 'loading') return { loading: true };
  const sentence = statusSentence(s, layer);
  if (s.status === 'empty') return { chip: t('layer-editor.bg-layers.no-picture-yet'), sentence: layer.type === 'image' ? t('layer-editor.bg-layers.choose-a-picture-or-a-device') : undefined };
  if (s.reason === 'stale') return { chip: sentence, stale: true };
  if (s.status === 'error') return { chip: t('layer-editor.bg-layers.problem'), sentence };
  return {};
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-bg-layers': McBgLayers;
  }
}
