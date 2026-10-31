import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorTokens } from '../../css/editor-system';
import { editorPrimitives } from '../../ui-kit/css/primitives';
import { fieldReset } from '../../editor/components/field-reset';
import type { AnimationDoc, TargetRef } from '../model';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { PreviewTile } from '../tiles';
import type { IconGeometry } from '../../icons/icon-source';
import { PATH_TEMPLATES, templatePath, type PathTemplateId } from './path-utils';
import {
  DEFAULT_PART_PATH,
  drawKeys,
  emitDoc,
  emitSelection,
  hasTrackPivot,
  isPartRef,
  loadGeometry,
  partIdsOf,
  peekGeometry,
  piecesOf,
  refId,
  renameTarget,
  setDrawOn,
  setPartPath,
  setEffectivePivot,
  setPivot,
  setTrackPivot,
  sourceIcon,
  trackCapMessage,
  trackCapReached,
  targetBox,
  targetExists,
  targetName,
  targetPivot,
  targetSelection,
  trackOf,
  withTrack,
  type Box,
} from './parts-model';
import { parseViewBox } from './draw-utils';
import { t, m, type MessageId } from '../i18n';

// The inspector of a selected icon part or group: name, pivot (3x3 grid on the part box; a preset pivot on the track wins
// until reset), draw-on and a motion path edited on the stage by the parts overlay.

type DrawMode = 'none' | 'on' | 'off' | 'custom';
const PIVOTS: Array<{ fx: number; fy: number; label: MessageId }> = [
  { fx: 0, fy: 0, label: m('anim-studio.part-inspector.top-left') },
  { fx: 0.5, fy: 0, label: m('anim-studio.part-inspector.top') },
  { fx: 1, fy: 0, label: m('anim-studio.part-inspector.top-right') },
  { fx: 0, fy: 0.5, label: m('anim-studio.part-inspector.left') },
  { fx: 0.5, fy: 0.5, label: m('anim-studio.part-inspector.centre') },
  { fx: 1, fy: 0.5, label: m('anim-studio.part-inspector.right') },
  { fx: 0, fy: 1, label: m('anim-studio.part-inspector.bottom-left') },
  { fx: 0.5, fy: 1, label: m('anim-studio.part-inspector.bottom') },
  { fx: 1, fy: 1, label: m('anim-studio.part-inspector.bottom-right') },
];
/** Template size for icon parts: half-width in icon units. */
const PART_PATH_SIZE = 4;
const r2 = (n: number) => Math.round(n * 100) / 100;
/** A point on a box at fractions of its width and height. */
const pivotAt = (box: Box, fx: number, fy: number): [number, number] => [r2(box[0] + box[2] * fx), r2(box[1] + box[3] * fy)];

@customElement('mc-anim-part-inspector')
export class AnimPartInspector extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ attribute: false }) tile: PreviewTile = 'icon';
  @property({ attribute: false }) stage?: StageInfo;

  @state() private _geom?: IconGeometry;
  @state() private _drawFrom = 0;
  @state() private _drawTo = 60;
  private _ref?: string;

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has('doc') || changed.has('tile')) && this.doc) {
      const ref = sourceIcon(this.doc, this.tile);
      if (ref !== this._ref) {
        this._ref = ref;
        this._geom = peekGeometry(ref);
        if (!this._geom)
          void loadGeometry(ref).then((g) => {
            if (this._ref === ref && g) this._geom = g;
          });
      }
    }
    const t = this._target;
    if ((changed.has('selection') || changed.has('doc')) && t && this.doc) {
      const keys = drawKeys(this.doc, t);
      if (keys.length >= 2) {
        // the draw runs from the last key still at the start value to the first key at the end value
        let i = 0;
        while (i + 1 < keys.length && keys[i + 1][1] === keys[0][1]) i++;
        let j = keys.length - 1;
        while (j - 1 > i && keys[j - 1][1] === keys[keys.length - 1][1]) j--;
        this._drawFrom = keys[i][0];
        this._drawTo = keys[j][0];
      }
    }
  }

  private get _target(): TargetRef | undefined {
    const t = this.selection?.target;
    return isPartRef(t) && this.doc && targetExists(this.doc, t) ? t : undefined;
  }

  private _drawMode(ref: TargetRef): DrawMode {
    const keys = drawKeys(this.doc!, ref);
    if (!keys.length) return 'none';
    const first = keys[0][1];
    const last = keys[keys.length - 1][1];
    const monotone = keys.every((k, i) => i === 0 || (first < last ? k[1] >= keys[i - 1][1] : k[1] <= keys[i - 1][1]));
    if (monotone && first === 0 && last === 1) return 'on';
    if (monotone && first === 1 && last === 0) return 'off';
    return 'custom';
  }

  private _emit(doc: AnimationDoc, label: string): void {
    emitDoc(this, doc, label);
  }

  // ── sections ──

  private _renderName(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const group = ref.startsWith('group:');
    const parts = partIdsOf(d, [ref]);
    const pieces = group ? 0 : (d.rig?.parts.find((p) => p.id === refId(ref))?.from?.length ?? 0);
    const sub = group ? t('anim-studio.part-inspector.group-of-count', { count: parts.length }) : pieces > 1 ? t('anim-studio.part-inspector.part-of-pieces-shapes', { pieces }) : t('anim-studio.part-inspector.part');
    return html`<div class="head">
        <span class="tile-icon"><ha-icon icon=${group ? 'mdi:folder-outline' : 'mdi:vector-square'}></ha-icon></span>
        <div class="titles">
          <span class="title">${targetName(d, ref)}</span>
          <span class="caption">${sub} · <span class="mono">${refId(ref)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${t('anim-studio.part-inspector.name')}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${targetName(d, ref)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            if (v.trim() && v.trim() !== targetName(d, ref)) this._emit(renameTarget(d, ref, v), group ? t('anim-studio.part-inspector.rename-group') : t('anim-studio.part-inspector.rename-part'));
          }}
        />
      </div>
      ${group
        ? html`<div class="chips">
            ${parts.map(
              (id) => html`<button type="button" class="chip" @click=${() => emitSelection(this, targetSelection([`part:${id}`]))}>${targetName(d, `part:${id}`)}</button>`,
            )}
          </div>`
        : nothing}`;
  }

  private _renderPivot(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const pieces = this._geom ? piecesOf(this._geom) : [];
    const box = targetBox(d, ref, pieces);
    const group = ref.startsWith('group:');
    const own = group ? d.rig?.groups?.find((g) => g.id === refId(ref))?.origin : d.rig?.parts.find((p) => p.id === refId(ref))?.origin;
    // a preset's pivot (the track's origin) wins over the part's own: the fields edit that while it is there
    const preset = hasTrackPivot(d, ref);
    const pivot = targetPivot(d, ref, pieces, parseViewBox(this._geom?.viewBox)) ?? own;
    const set = (x: number, y: number) => this._emit(setEffectivePivot(d, ref, [x, y]), 'Move pivot');
    const centre = () => this._emit(preset ? setEffectivePivot(d, ref, pivotAt(box!, 0.5, 0.5)) : setPivot(d, ref, undefined), preset ? t('anim-studio.part-inspector.move-pivot') : t('anim-studio.part-inspector.reset-pivot'));
    const num = (axis: 0 | 1, label: string) => html`<div class="field">
      <div class="field-head"><label for="pi-p${axis}">${label}</label></div>
      <div class="unit">
        <input
          id="pi-p${axis}"
          class="input"
          type="number"
          step="0.25"
          inputmode="decimal"
          .value=${pivot ? String(r2(pivot[axis])) : ''}
          placeholder=${t('anim-studio.part-inspector.centre')}
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const v = Number((e.target as HTMLInputElement).value);
            if (!Number.isFinite(v) || (e.target as HTMLInputElement).value === '') return;
            const p = pivot ?? [12, 12];
            if (axis === 0) set(v, p[1]);
            else set(p[0], v);
          }}
        />
        <span class="suffix" aria-hidden="true">${t('anim-studio.part-inspector.units')}</span>
      </div>
    </div>`;
    return html`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${t('anim-studio.part-inspector.pivot')}</h3>
        <span class=${preset ? 'src is-preset' : 'src'} data-pivot-source=${preset ? 'track' : 'part'}>${preset ? t('anim-studio.part-inspector.preset-pivot') : group ? t('anim-studio.part-inspector.group-pivot') : t('anim-studio.part-inspector.part-pivot')}</span>
        ${preset ? nothing : fieldReset('pivot', !!own, () => this._emit(setPivot(d, ref, undefined), 'Reset pivot'))}
      </div>
      <p class="help">
        ${preset
          ? group ? t("anim-studio.part-inspector.the-point-the-preset-turns-this-group") : t("anim-studio.part-inspector.the-point-the-preset-turns-this-part")
          : group ? t('anim-studio.part-inspector.the-point-the-group-rotates-and-scales') : t('anim-studio.part-inspector.the-point-the-part-rotates-and-scales')}
      </p>
      <div class="pair">${num(0, 'X')} ${num(1, 'Y')}</div>
      ${box
        ? html`<div class="grid3" role="group" aria-label=${group ? t("anim-studio.part-inspector.pivot-on-the-group-s-box") : t("anim-studio.part-inspector.pivot-on-the-part-s-box")}>
            ${PIVOTS.map((p) => {
              const [x, y] = pivotAt(box, p.fx, p.fy);
              const on = !!pivot && Math.abs(pivot[0] - x) < 0.01 && Math.abs(pivot[1] - y) < 0.01;
              return html`<button
                type="button"
                class="cell"
                aria-label=${t('anim-studio.part-inspector.pivot-position', { position: t(p.label).toLowerCase() })}
                title=${t(p.label)}
                aria-pressed=${on ? 'true' : 'false'}
                ?disabled=${this.disabled}
                @click=${() => (p.fx === 0.5 && p.fy === 0.5 ? centre() : set(x, y))}
              >
                <i></i>
              </button>`;
            })}
          </div>`
        : nothing}
      ${preset
        ? html`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => this._emit(setTrackPivot(d, ref, undefined), 'Reset to part pivot')}>
              ${group ? t('anim-studio.part-inspector.reset-to-group-pivot') : t('anim-studio.part-inspector.reset-to-part-pivot')}
            </button>
          </div>`
        : nothing}
    </section>`;
  }

  private _renderDraw(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const mode = this._drawMode(ref);
    // a new track would pass the cap: drawing on is blocked (turning it off stays possible)
    const capped = trackCapReached(d, ref);
    const apply = (m: 'none' | 'on' | 'off') => this._emit(setDrawOn(d, ref, m, this._drawFrom, this._drawTo), m === 'none' ? t('anim-studio.part-inspector.remove-draw-on') : m === 'on' ? t('anim-studio.part-inspector.draw-on') : t('anim-studio.part-inspector.draw-off'));
    const modes: Array<{ id: 'none' | 'on' | 'off'; label: string }> = [
      { id: 'none', label: t('anim-studio.part-inspector.off') },
      { id: 'on', label: t('anim-studio.part-inspector.draw-on') },
      { id: 'off', label: t('anim-studio.part-inspector.draw-off') },
    ];
    const pct = (id: string, label: string, value: number, set: (v: number) => void) => html`<div class="field">
      <div class="field-head"><label for=${id}>${label}</label></div>
      <div class="unit">
        <input
          id=${id}
          class="input"
          type="number"
          min="0"
          max="100"
          step="1"
          inputmode="decimal"
          .value=${String(value)}
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const v = Math.max(0, Math.min(100, Number((e.target as HTMLInputElement).value)));
            if (!Number.isFinite(v)) return;
            set(v);
            if (mode === 'on' || mode === 'off') this._emit(setDrawOn(this.doc!, ref, mode, this._drawFrom, this._drawTo), 'Draw timing');
          }}
        />
        <span class="suffix" aria-hidden="true">%</span>
      </div>
    </div>`;
    return html`<section class="group" aria-labelledby="pi-draw">
      <div class="group-head">
        <ha-icon icon="mdi:draw"></ha-icon>
        <h3 id="pi-draw">${t('anim-studio.part-inspector.draw')}</h3>
      </div>
      <p class="help">${t('anim-studio.part-inspector.the-outline-is-traced-then-the-part')}</p>
      <div class="seg full" role="radiogroup" aria-label=${t('anim-studio.part-inspector.draw')}>
        ${modes.map(
          (m) =>
            html`<button type="button" role="radio" aria-checked=${mode === m.id ? 'true' : 'false'} ?disabled=${this.disabled || (capped && m.id !== 'none')} @click=${() => apply(m.id)}>${m.label}</button>`,
        )}
      </div>
      ${capped ? html`<p class="help cap">${trackCapMessage()}</p>` : nothing}
      ${mode === 'custom' ? html`<p class="help">${t('anim-studio.part-inspector.this-part-has-its-own-draw-keys-on-the')}</p>` : nothing}
      ${mode !== 'none'
        ? html`<div class="pair">
            ${pct('pi-df', t('anim-studio.part-inspector.starts-at'), this._drawFrom, (v) => (this._drawFrom = v))}
            ${pct('pi-dt', t('anim-studio.part-inspector.complete-at'), this._drawTo, (v) => (this._drawTo = Math.max(v, this._drawFrom)))}
          </div>`
        : nothing}
    </section>`;
  }

  private _renderPath(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const path = trackOf(d, ref)?.path;
    const capped = !path && trackCapReached(d, ref);
    const toggle = () => this._emit(setPartPath(d, ref, path ? undefined : { d: DEFAULT_PART_PATH }), path ? t('anim-studio.part-inspector.remove-motion-path') : t('anim-studio.part-inspector.add-motion-path'));
    return html`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${t('anim-studio.part-inspector.motion-path')}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${t('anim-studio.part-inspector.follow-a-path')}</span>
          <p class="help">${t('anim-studio.part-inspector.moves-the-part-along-a-curve-from-its')}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${path ? 'true' : 'false'} aria-label=${t('anim-studio.part-inspector.follow-a-path')} ?disabled=${this.disabled || capped} @click=${toggle}></button>
      </div>
      ${capped ? html`<p class="help cap">${trackCapMessage()}</p>` : nothing}
      ${path
        ? html`<div class="field">
              <div class="field-head"><label for="pi-tpl">${t('anim-studio.part-inspector.shape')}</label></div>
              <div class="select">
                <select
                  id="pi-tpl"
                  class="input"
                  ?disabled=${this.disabled}
                  @change=${(e: Event) => {
                    const id = (e.target as HTMLSelectElement).value;
                    if (!id) return;
                    const next = id === 'arc' ? DEFAULT_PART_PATH : templatePath(id as PathTemplateId, [0, 0], PART_PATH_SIZE);
                    this._emit(setPartPath(d, ref, { ...path, d: next }), 'Path shape');
                    (e.target as HTMLSelectElement).value = '';
                  }}
                >
                  <option value="">${t('anim-studio.part-inspector.replace-with')}</option>
                  <option value="arc">${t('anim-studio.part-inspector.arc')}</option>
                  ${PATH_TEMPLATES.map((tpl) => html`<option value=${tpl.id}>${t(tpl.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${t('anim-studio.part-inspector.turn-with-the-path')}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${path.follow_rotation ? 'true' : 'false'}
                aria-label=${t('anim-studio.part-inspector.turn-with-the-path')}
                ?disabled=${this.disabled}
                @click=${() => this._emit(setPartPath(d, ref, { ...path, follow_rotation: !path.follow_rotation }), 'Path rotation')}
              ></button>
            </div>`
        : nothing}
    </section>`;
  }

  private _renderKeys(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const track = trackOf(d, ref);
    const n = track?.keyframes.length ?? 0;
    return html`<section class="group" aria-labelledby="pi-keys">
      <div class="group-head">
        <ha-icon icon="mdi:timeline-outline"></ha-icon>
        <h3 id="pi-keys">${t('anim-studio.part-inspector.keys')}</h3>
      </div>
      <p class="help">
        ${n
          ? t('anim-studio.part-inspector.count-on-the-timeline-rotate-move-scale', { count: n })
          : t('anim-studio.part-inspector.no-keys-yet-add-keys-on-the-timeline-to')}
      </p>
      ${track
        ? html`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => this._emit(withTrack(d, ref, undefined), 'Remove part animation')}>
              ${t("anim-studio.part-inspector.remove-this-part-s-animation")}
            </button>
          </div>`
        : nothing}
    </section>`;
  }

  protected render(): TemplateResult {
    const ref = this._target;
    if (!this.doc || !ref) return html``;
    return html`<div class="insp">
      ${this._renderName(ref)} ${this._renderPivot(ref)} ${this._renderDraw(ref)} ${this._renderPath(ref)} ${this._renderKeys(ref)}
    </div>`;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    css`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      .insp {
        display: grid;
        gap: 16px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .tile-icon {
        width: 40px;
        height: 40px;
        flex: none;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius-md, 8px);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 22px;
      }
      .titles {
        display: grid;
        min-width: 0;
      }
      .title {
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .caption {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
        gap: 12px;
      }
      .unit {
        position: relative;
        display: flex;
      }
      .unit .input {
        flex: 1;
        min-width: 0;
        padding-right: 52px;
      }
      .suffix {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--mc-text-2);
        font-size: 0.8125rem;
        pointer-events: none;
      }
      .grid3 {
        display: grid;
        grid-template-columns: repeat(3, 32px);
        gap: 4px;
      }
      .cell {
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius-sm, 6px);
        background: var(--mc-surface);
        padding: 0;
        cursor: pointer;
      }
      .cell i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mc-text-2);
      }
      .cell[aria-pressed='true'] {
        border-color: var(--mc-accent);
        background: var(--mc-accent-tint);
      }
      .cell[aria-pressed='true'] i {
        background: var(--mc-accent-ink);
      }
      .cell:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .help {
        margin: 0;
      }
      /* which pivot the fields edit (a chip look; not .chip, the member chips use that) */
      .src {
        display: inline-flex;
        align-items: center;
        min-height: 20px;
        padding: 0 8px;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1;
        color: var(--mc-text-2);
        white-space: nowrap;
      }
      .src.is-preset {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
    `,
  ];
}

registerPanel({
  tag: 'mc-anim-part-inspector',
  place: 'inspector',
  title: m('anim-studio.part-inspector.part'),
  order: 20,
  when: (doc, sel) => doc.kind === 'keyframes' && (sel.kind === 'target' || sel.kind === 'keys') && isPartRef(sel.target),
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-part-inspector': AnimPartInspector;
  }
}
