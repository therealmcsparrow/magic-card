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
import { getPreview, getStatus, onStatus, setPreview, takeOpenLayer, type PanPreview } from './bg-status';
import { costFromBackdrop, type CostReason } from './cost';
import { BACKDROP_LOOKS, addBackdropLook, type BackdropLook } from './looks';
import { layerStyles } from './layer-styles';
import { layerControlCss } from './tokens';
import { lyrSwitch } from './controls';

/*
 * Card backdrop group (designer 03 section 4, 11 B, E, F, K): `background_layers`, first entry = front, at most
 * four. A list of two-line rows (thumbnail, title, summary, status; then Hide, Forward, Backward, Delete), an
 * inline editor per row, Looks, the cost meter and the rule view. Delete replaces the row in place with
 * "Deleted. Undo" (12 s, paused on hover or focus, Ctrl or Cmd+Z answers). Switching a type or source, applying
 * a Look: Undo only, no confirmation.
 */

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
  private _focus?: { sel: string; index?: number };
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
    this.removeEventListener('keydown', this._onKey);
    clearTimeout(this._timer);
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
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--lyr-gap);
      }
      .row {
        border: 1px solid var(--mc-ed-ctl-line);
        border-radius: var(--mc-radius);
        padding: 8px;
        display: grid;
        gap: 8px;
      }
      .row[data-open] {
        border: 2px solid var(--mc-text);
        box-shadow: inset 4px 0 0 var(--mc-accent-fill, #0277bd);
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
        border-radius: 4px;
        border: 1px solid var(--mc-ed-ctl-line);
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
      .chev {
        transition: transform 0.15s ease-out;
      }
      .rhead[aria-expanded='true'] .chev {
        transform: rotate(90deg);
      }
      .r2 {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lyr-gap);
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
        border: 1px dashed var(--mc-ed-ctl-line);
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
    this._live = t('Undone.');
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
    this._live = t('Layer added. {n} of {max}.', { n: next.length, max: MAX_BACKGROUND_LAYERS });
  }

  private _move(i: number, dir: 'forward' | 'backward'): void {
    const next = moveLayerIn(this._list, i, dir);
    if (!next) return;
    const to = dir === 'forward' ? i - 1 : i + 1;
    this._write(next);
    if (this._open === i) this._open = to;
    this._focus = { sel: `[data-act=${dir}]`, index: to };
    this._live = t('Moved to layer {n} of {count}.', { n: to + 1, count: next.length });
  }

  private _delete(i: number): void {
    const r = removeLayer(this._list, i);
    if (!r) return;
    const name = this._name(r.removed, i);
    this._deleted = { layer: r.removed, index: i, name };
    this._open = -1;
    this._write(r.list);
    this._focus = { sel: '[data-act=undo-delete]' };
    this._live = t('{name} deleted. Undo is the next button.', { name });
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
    this._live = t('{name} restored.', { name: d.name });
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
    this._offerUndo(t('Added {name}.', { name: t(look.name) }));
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
    return t('{type}, layer {n}', { type: te(s.type), n: i + 1 });
  }

  protected updated(): void {
    const f = this._focus;
    if (!f) return;
    this._focus = undefined;
    const rows = this.renderRoot.querySelectorAll<HTMLElement>('.row');
    const scope = f.index === undefined ? this.renderRoot : rows[f.index];
    scope?.querySelector<HTMLElement>(f.sel)?.focus();
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
          <span class="chev" aria-hidden="true">▸</span>
        </button>
        ${hidden ? html`<span class="chip2" data-chip="hidden">${t('Hidden')}</span>` : nothing}
        ${st.chip ? html`<span class="chip2 ${st.stale ? 'stale' : ''}" data-chip=${st.stale ? 'stale' : 'problem'}>${st.stale ? '' : '⚠ '}${st.chip}</span>` : nothing}
      </div>
      <div class="r2">
        <button type="button" class="lyr-btn" data-act="hide" aria-label=${hidden ? t('Show {name}', { name }) : t('Hide {name}', { name })} @click=${() => this._patch(i, { hidden: hidden ? undefined : true })}>${hidden ? t('Show') : t('Hide')}</button>
        <button type="button" class="lyr-btn" data-act="forward" aria-label=${t('Move {name} forward', { name })} aria-disabled=${i === 0 ? 'true' : 'false'} @click=${() => this._move(i, 'forward')}>↑ ${t('Forward')}</button>
        <button type="button" class="lyr-btn" data-act="backward" aria-label=${t('Move {name} backward', { name })} aria-disabled=${i === count - 1 ? 'true' : 'false'} @click=${() => this._move(i, 'backward')}>↓ ${t('Backward')}</button>
        <button type="button" class="lyr-btn del" data-act="delete" aria-label=${t('Delete {name}', { name })} @click=${() => this._delete(i)}>${t('Delete')}</button>
      </div>
      ${st.sentence ? html`<p class="warnrow" data-status role="status">${st.sentence}</p>` : nothing}
      <div id=${`${this._id}-${i}-ed`} ?hidden=${!open}>${open ? renderLayerEditor(host, layer, i) : nothing}</div>
    </li>`;
  }

  private _renderGone(): TemplateResult {
    const d = this._deleted!;
    return html`<li class="gone" data-gone @mouseenter=${() => this._hold(true)} @mouseleave=${() => this._hold(false)} @focusin=${() => this._hold(true)} @focusout=${() => this._hold(false)}>
      <span>${t('{name} deleted.', { name: d.name })}</span>
      <button type="button" class="lyr-btn" data-act="undo-delete" @click=${() => this._restore()}>${t('Undo')}</button>
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
    const reason = (r: CostReason): string => (r.code === 'blur' ? t('blur {px} px', { px: r.px }) : r.code === 'blend' ? t('blend') : r.code === 'panzoom' ? t('pan and zoom') : t('live camera'));
    const word = cost.level === 'heavy' ? t('heavy') : cost.level === 'medium' ? t('medium') : t('light');
    return html`<div class="costbox">
      <p class="cost" data-cost data-level=${cost.level}>${t('Cost on older tablets:')} <b>${word}</b>${cost.reasons.length ? ` (${cost.reasons.map(reason).join(', ')})` : ''}.</p>
      ${lyrSwitch(`${this._id}-lp`, t('Low-power mode'), this.lowPower, () => this.onLowPower?.(), t('Drops blur, blend and pan and zoom for this card and keeps the pictures.'))}
    </div>`;
  }

  protected render(): TemplateResult {
    const rule = this.rule;
    if (rule && !rule.own) {
      return html`<div class="bgl">
        <p class="help" data-rule="none">${t('This rule does not change the backgrounds.')}</p>
        <div class="acts"><button type="button" class="lyr-btn" data-act="rule-start" @click=${() => this.onRule?.('start')}>${t('Change backgrounds in this rule')}</button></div>
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
            <span class="chip2" data-rule="own">${t('This rule uses its own backgrounds instead of the normal ones.')}</span>
            <div class="acts">
              <button type="button" class="lyr-btn" data-act="rule-start" @click=${() => this.onRule?.('start')}>${t('Start again from the normal ones')}</button>
              <button type="button" class="lyr-btn" data-act="rule-reset" @click=${() => this.onRule?.('reset')}>${t('Use the normal backgrounds')}</button>
            </div>
          </div>`
        : html`<p class="help">${t('To put a module behind others, use Placement on that module. Layers here sit on top of the colour and image in Style.')}</p>`}
      <div class="head2"><span class="chip2" data-count>${t('{n} of {max}', { n: list.length, max: MAX_BACKGROUND_LAYERS })}</span></div>
      ${list.length || this._deleted ? html`<ol aria-label=${t('Card backdrop layers, front first')}>${rows}</ol>` : html`<p class="help" data-empty>${t('No layers yet. Add an image, gradient, pattern or colour behind the card content.')}</p>`}
      ${this._undo ? html`<p class="undo"><span>${this._undo.message}</span> <button type="button" class="lyr-btn" data-act="undo" @click=${() => this._runUndo()}>${t('Undo')}</button></p>` : nothing}
      <div class="add">
        <button type="button" class="lyr-btn" data-act="add" aria-haspopup="true" aria-expanded=${this._adding ? 'true' : 'false'} aria-disabled=${full ? 'true' : 'false'} aria-describedby=${full ? `${this._id}-limit` : nothing} @click=${() => (full ? (this._live = t(LIMIT_TEXT, { max: MAX_BACKGROUND_LAYERS })) : (this._adding = !this._adding))}>${full ? t('Add layer') : t('Add layer ({n} left)', { n: MAX_BACKGROUND_LAYERS - list.length })}</button>
        ${full ? html`<p class="warnrow" id=${`${this._id}-limit`} data-limit>${t(LIMIT_TEXT, { max: MAX_BACKGROUND_LAYERS })}</p>` : nothing}
        ${this._adding && !full
          ? html`<div class="lseg" role="group" aria-label=${t('Layer type')}>${ADD_ITEMS.map((it) => html`<button type="button" data-add=${it.value} aria-pressed="false" @click=${() => this._add(it.value)}>${te(it.label)}</button>`)}</div>`
          : nothing}
      </div>
      <div class="looks">
        <span class="lbl" id=${`${this._id}-looks`}>${t('Looks')}</span>
        <div class="tiles2" role="group" aria-labelledby=${`${this._id}-looks`}>
          ${BACKDROP_LOOKS.map((look) => {
            const fits = list.length + look.count <= MAX_BACKGROUND_LAYERS;
            return html`<button type="button" class="lyr-tile" data-look=${look.id} aria-disabled=${fits ? 'false' : 'true'} title=${fits ? '' : t('Needs {n} free layers.', { n: look.count })} @click=${() => fits && this._applyLook(look)}>
              <span class="pv" style=${`background:${look.preview}`}></span><span class="nm">${t(look.name)}</span>${fits ? nothing : html`<span class="sub">${t('Needs {n} free layers.', { n: look.count })}</span>`}
            </button>`;
          })}
        </div>
      </div>
      ${this._renderCost()}
      <p class="help">${t("Can't reach it? Pick it in the structure list.")}</p>
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
  if (s.status === 'empty') return { chip: t('No picture yet'), sentence: layer.type === 'image' ? t('Choose a picture or a device.') : undefined };
  if (s.reason === 'stale') return { chip: sentence, stale: true };
  if (s.status === 'error') return { chip: t('Problem'), sentence };
  return {};
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-bg-layers': McBgLayers;
  }
}
