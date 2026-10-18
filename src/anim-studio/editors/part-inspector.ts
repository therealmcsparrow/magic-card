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

/*
 * The inspector of a selected icon part or group (studio slot 'inspector' when the selection's
 * target is part:<id> / group:<id>, track B2): its name, its pivot (icon units, a 3x3 grid on the
 * part's box, reset to the box centre; a preset's pivot on the part's track wins and is edited
 * instead, until "Reset to part pivot" drops it), draw-on (the part's outline is drawn, then it fills), and a
 * motion path (edited on the stage by the parts overlay). Keys are added on the timeline, which
 * animates the selected target's track.
 */

type DrawMode = 'none' | 'on' | 'off' | 'custom';
const PIVOTS: Array<{ fx: number; fy: number; label: MessageId }> = [
  { fx: 0, fy: 0, label: m('Top left') },
  { fx: 0.5, fy: 0, label: m('Top') },
  { fx: 1, fy: 0, label: m('Top right') },
  { fx: 0, fy: 0.5, label: m('Left') },
  { fx: 0.5, fy: 0.5, label: m('Centre') },
  { fx: 1, fy: 0.5, label: m('Right') },
  { fx: 0, fy: 1, label: m('Bottom left') },
  { fx: 0.5, fy: 1, label: m('Bottom') },
  { fx: 1, fy: 1, label: m('Bottom right') },
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
    const sub = group ? t('Group of {count, plural, one {# part} other {# parts}}', { count: parts.length }) : pieces > 1 ? t('Part of {pieces} shapes', { pieces }) : t('Part');
    return html`<div class="head">
        <span class="tile-icon"><ha-icon icon=${group ? 'mdi:folder-outline' : 'mdi:vector-square'}></ha-icon></span>
        <div class="titles">
          <span class="title">${targetName(d, ref)}</span>
          <span class="caption">${sub} · <span class="mono">${refId(ref)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${t('Name')}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${targetName(d, ref)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            if (v.trim() && v.trim() !== targetName(d, ref)) this._emit(renameTarget(d, ref, v), group ? t('Rename group') : t('Rename part'));
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
    const centre = () => this._emit(preset ? setEffectivePivot(d, ref, pivotAt(box!, 0.5, 0.5)) : setPivot(d, ref, undefined), preset ? t('Move pivot') : t('Reset pivot'));
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
          placeholder=${t('Centre')}
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const v = Number((e.target as HTMLInputElement).value);
            if (!Number.isFinite(v) || (e.target as HTMLInputElement).value === '') return;
            const p = pivot ?? [12, 12];
            if (axis === 0) set(v, p[1]);
            else set(p[0], v);
          }}
        />
        <span class="suffix" aria-hidden="true">${t('units')}</span>
      </div>
    </div>`;
    return html`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${t('Pivot')}</h3>
        <span class=${preset ? 'src is-preset' : 'src'} data-pivot-source=${preset ? 'track' : 'part'}>${preset ? t('Preset pivot') : group ? t('Group pivot') : t('Part pivot')}</span>
        ${preset ? nothing : fieldReset('pivot', !!own, () => this._emit(setPivot(d, ref, undefined), 'Reset pivot'))}
      </div>
      <p class="help">
        ${preset
          ? group ? t("The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.") : t("The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.")
          : group ? t('The point the group rotates and scales around, in icon units. Drag it on the stage.') : t('The point the part rotates and scales around, in icon units. Drag it on the stage.')}
      </p>
      <div class="pair">${num(0, 'X')} ${num(1, 'Y')}</div>
      ${box
        ? html`<div class="grid3" role="group" aria-label=${group ? t("Pivot on the group's box") : t("Pivot on the part's box")}>
            ${PIVOTS.map((p) => {
              const [x, y] = pivotAt(box, p.fx, p.fy);
              const on = !!pivot && Math.abs(pivot[0] - x) < 0.01 && Math.abs(pivot[1] - y) < 0.01;
              return html`<button
                type="button"
                class="cell"
                aria-label=${t('Pivot: {position}', { position: t(p.label).toLowerCase() })}
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
              ${group ? t('Reset to group pivot') : t('Reset to part pivot')}
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
    const apply = (m: 'none' | 'on' | 'off') => this._emit(setDrawOn(d, ref, m, this._drawFrom, this._drawTo), m === 'none' ? t('Remove draw-on') : m === 'on' ? t('Draw on') : t('Draw off'));
    const modes: Array<{ id: 'none' | 'on' | 'off'; label: string }> = [
      { id: 'none', label: t('Off') },
      { id: 'on', label: t('Draw on') },
      { id: 'off', label: t('Draw off') },
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
        <h3 id="pi-draw">${t('Draw')}</h3>
      </div>
      <p class="help">${t('The outline is traced, then the part fills in.')}</p>
      <div class="seg full" role="radiogroup" aria-label=${t('Draw')}>
        ${modes.map(
          (m) =>
            html`<button type="button" role="radio" aria-checked=${mode === m.id ? 'true' : 'false'} ?disabled=${this.disabled || (capped && m.id !== 'none')} @click=${() => apply(m.id)}>${m.label}</button>`,
        )}
      </div>
      ${capped ? html`<p class="help cap">${trackCapMessage()}</p>` : nothing}
      ${mode === 'custom' ? html`<p class="help">${t('This part has its own draw keys on the timeline.')}</p>` : nothing}
      ${mode !== 'none'
        ? html`<div class="pair">
            ${pct('pi-df', t('Starts at'), this._drawFrom, (v) => (this._drawFrom = v))}
            ${pct('pi-dt', t('Complete at'), this._drawTo, (v) => (this._drawTo = Math.max(v, this._drawFrom)))}
          </div>`
        : nothing}
    </section>`;
  }

  private _renderPath(ref: TargetRef): TemplateResult {
    const d = this.doc!;
    const path = trackOf(d, ref)?.path;
    const capped = !path && trackCapReached(d, ref);
    const toggle = () => this._emit(setPartPath(d, ref, path ? undefined : { d: DEFAULT_PART_PATH }), path ? t('Remove motion path') : t('Add motion path'));
    return html`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${t('Motion path')}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${t('Follow a path')}</span>
          <p class="help">${t('Moves the part along a curve, from its rest position. Drag the points on the stage.')}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${path ? 'true' : 'false'} aria-label=${t('Follow a path')} ?disabled=${this.disabled || capped} @click=${toggle}></button>
      </div>
      ${capped ? html`<p class="help cap">${trackCapMessage()}</p>` : nothing}
      ${path
        ? html`<div class="field">
              <div class="field-head"><label for="pi-tpl">${t('Shape')}</label></div>
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
                  <option value="">${t('Replace with…')}</option>
                  <option value="arc">${t('Arc')}</option>
                  ${PATH_TEMPLATES.map((tpl) => html`<option value=${tpl.id}>${t(tpl.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${t('Turn with the path')}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${path.follow_rotation ? 'true' : 'false'}
                aria-label=${t('Turn with the path')}
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
        <h3 id="pi-keys">${t('Keys')}</h3>
      </div>
      <p class="help">
        ${n
          ? t('{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and colour this part there.', { count: n })
          : t('No keys yet. Add keys on the timeline to rotate, move, scale, fade or colour this part.')}
      </p>
      ${track
        ? html`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => this._emit(withTrack(d, ref, undefined), 'Remove part animation')}>
              ${t("Remove this part's animation")}
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
  title: m('Part'),
  order: 20,
  when: (doc, sel) => doc.kind === 'keyframes' && (sel.kind === 'target' || sel.kind === 'keys') && isPartRef(sel.target),
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-part-inspector': AnimPartInspector;
  }
}
