import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorPrimitives, editorTokens } from '../../css/editor-system';
import type { AnimationDoc, TargetRef } from '../model';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { PreviewTile } from '../tiles';
import type { IconGeometry } from '../../icons/icon-source';
import { PART_PRESETS, applyPartPresetMany, clearPartMotion, presetParams, type PartPreset, type PartPresetParam } from '../../icon-anim/part-presets';
import { emitDoc, loadGeometry, peekGeometry, piecesOf, selectedRefs, sourceIcon, targetName, trackOf } from './parts-model';
import './draw-svg-dialog';
import type { AnimSvgDialog } from './draw-svg-dialog';

/*
 * Part presets (studio icon mode, inspector slot): with icon parts, groups or shapes selected, one
 * click writes a ready motion (swing, spin, ring, draw on...) as their tracks; the preset's
 * parameters (duration share, delay, intensity, direction) re-apply it as they change (a slider
 * drag is one undo step). The result is a normal track, fine-tuned on the timeline afterwards.
 * "Animated SVG" exports the animation as a looping SVG file.
 */

const isRig = (ref: string | undefined): ref is TargetRef => !!ref && /^(part|group|shape):/.test(ref);

/** Units shown next to each parameter value. */
const fmt = (p: PartPresetParam, v: number): string => (p.id === 'intensity' ? `${v}×` : p.id === 'direction' ? (v < 0 ? 'Reverse' : 'Forward') : `${v} %`);

@customElement('mc-anim-part-presets')
export class AnimPartPresets extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ attribute: false }) tile: PreviewTile = 'icon';
  @property({ attribute: false }) stage?: StageInfo;

  /** The preset last applied per selection (session only) and its parameters. */
  @state() private _applied = new Map<string, { preset: string; params: Record<string, number> }>();
  @state() private _geom?: IconGeometry;
  @state() private _status = '';
  private _ref?: string;
  /** The document before a slider drag (re-applied from it on every move). */
  private _dragBase?: AnimationDoc;

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has('doc') || changed.has('tile')) && this.doc) {
      const ref = sourceIcon(this.doc, this.tile);
      if (ref !== this._ref) {
        this._ref = ref;
        this._geom = peekGeometry(ref);
        if (!this._geom)
          void loadGeometry(ref).then((g) => {
            if (this._ref === ref) this._geom = g;
          });
      }
    }
  }

  private get _targets(): TargetRef[] {
    const refs = selectedRefs(this.selection).filter(isRig);
    const primary = this.selection.target;
    if (isRig(primary) && !refs.includes(primary)) refs.unshift(primary);
    // shapes are rig targets too
    for (const t of this.selection.targets ?? []) if (isRig(t) && !refs.includes(t)) refs.push(t);
    return refs;
  }

  private get _key(): string {
    return this._targets.join(',');
  }

  private _apply(preset: PartPreset, params: Record<string, number>, transient = false): void {
    const base = transient ? (this._dragBase ??= this.doc) : (this._dragBase ?? this.doc);
    if (!base) return;
    const pieces = this._geom ? piecesOf(this._geom) : undefined;
    const next = applyPartPresetMany(base, this._targets, preset.id, params, { pieces });
    if (!transient) this._dragBase = undefined;
    if (next === base) {
      if (!transient) this._status = 'This animation already has 24 animated targets: remove one to add a preset.';
      return;
    }
    const map = new Map(this._applied);
    map.set(this._key, { preset: preset.id, params });
    this._applied = map;
    const names = this._targets.map((t) => targetName(base, t));
    this._status = transient ? '' : `${preset.name} on ${names.length > 2 ? `${names.length} parts` : names.join(' and ')}`;
    emitDoc(this, next, `Preset: ${preset.name}`, transient);
  }

  private _pickPreset(select: HTMLSelectElement, applied?: { preset: string; params: Record<string, number> }): void {
    const preset = PART_PRESETS.find((p) => p.id === select.value);
    if (!preset) return;
    this._apply(preset, applied?.preset === preset.id ? applied.params : {});
    // the cap was hit: show the previous value again
    if (this._applied.get(this._key)?.preset !== preset.id) select.value = applied?.preset ?? '';
  }

  private _clear(): void {
    if (!this.doc) return;
    const next = this._targets.reduce((d, t) => clearPartMotion(d, t), this.doc);
    const map = new Map(this._applied);
    map.delete(this._key);
    this._applied = map;
    this._status = 'Motion removed';
    emitDoc(this, next, 'Remove motion');
  }

  private _openSvg(): void {
    this.renderRoot.querySelector<AnimSvgDialog>('mc-anim-svg-dialog')?.openExport(true);
  }

  private _renderParams(preset: PartPreset, params: Record<string, number>): TemplateResult {
    const full = presetParams(preset.id, params);
    return html`<div class="params" role="group" aria-label="${preset.name} settings">
      ${preset.params.map((p) => {
        const v = full[p.id];
        if (p.id === 'direction') {
          return html`<div class="field">
            <div class="field-head"><span class="lbl" id="pp-dir">Direction</span></div>
            <div class="seg full" role="radiogroup" aria-labelledby="pp-dir">
              ${[1, -1].map(
                (d) => html`<button
                  type="button"
                  role="radio"
                  data-dir=${d}
                  aria-checked=${v === d ? 'true' : 'false'}
                  tabindex=${v === d ? 0 : -1}
                  ?disabled=${this.disabled}
                  @click=${() => this._apply(preset, { ...full, direction: d })}
                >
                  <ha-icon icon=${d > 0 ? 'mdi:rotate-right' : 'mdi:rotate-left'}></ha-icon>${d > 0 ? 'Forward' : 'Reverse'}
                </button>`,
              )}
            </div>
          </div>`;
        }
        const id = `pp-${p.id}`;
        return html`<div class="field">
          <div class="field-head"><label for=${id}>${p.label}</label><span class="val">${fmt(p, v)}</span></div>
          <input
            id=${id}
            class="range"
            type="range"
            data-param=${p.id}
            min=${p.min}
            max=${p.max}
            step=${p.step}
            .value=${String(v)}
            aria-valuetext=${fmt(p, v)}
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._apply(preset, { ...full, [p.id]: Number((e.target as HTMLInputElement).value) }, true)}
            @change=${(e: Event) => this._apply(preset, { ...full, [p.id]: Number((e.target as HTMLInputElement).value) })}
          />
        </div>`;
      })}
    </div>`;
  }

  protected updated(): void {
    const sel = this.renderRoot.querySelector<HTMLSelectElement>('select#pp-preset');
    const want = this._applied.get(this._key)?.preset ?? '';
    if (sel && sel.value !== want) sel.value = want;
  }

  protected render(): TemplateResult {
    const d = this.doc;
    const targets = this._targets;
    if (!d || !targets.length) return html``;
    const applied = this._applied.get(this._key);
    const active = applied ? PART_PRESETS.find((p) => p.id === applied.preset) : undefined;
    const animated = targets.some((t) => (trackOf(d, t)?.keyframes.length ?? 0) > 0);
    const pieces = this._geom ? piecesOf(this._geom) : [];
    return html`
      <p class="help">${targets.length > 1 ? `${targets.length} targets selected: a preset plays on each (Wave: one after another).` : 'One click animates the selection; fine-tune the keys on the timeline.'}</p>
      <div class="field">
        <div class="field-head"><label for="pp-preset">Preset</label></div>
        <div class="select">
          <select
            class="input"
            id="pp-preset"
            aria-describedby=${active?.help ? 'pp-preset-help' : nothing}
            ?disabled=${this.disabled}
            @change=${(e: Event) => this._pickPreset(e.target as HTMLSelectElement, applied)}
          >
            <option value="" ?selected=${!active} ?disabled=${!!active} ?hidden=${!!active}>Choose a preset</option>
            ${PART_PRESETS.map((p) => html`<option value=${p.id} data-preset=${p.id} ?selected=${active?.id === p.id}>${p.name}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        ${active?.help ? html`<p class="help" id="pp-preset-help">${active.help}</p>` : nothing}
      </div>
      ${active ? this._renderParams(active, applied!.params) : nothing}
      <div class="actions">
        ${animated ? html`<button type="button" class="btn btn-text btn-sm clear" ?disabled=${this.disabled} @click=${() => this._clear()}>Remove motion</button>` : nothing}
        <span class="grow"></span>
        <button type="button" class="btn btn-secondary btn-sm export" @click=${() => this._openSvg()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>Animated SVG
        </button>
      </div>
      <p class="status" role="status" aria-live="polite">${this._status}</p>
      <mc-anim-svg-dialog .doc=${d} .pieces=${pieces} .viewBox=${this._geom?.viewBox ?? '0 0 24 24'}></mc-anim-svg-dialog>
    `;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    css`
      :host {
        display: grid;
        gap: 12px;
      }
      .help {
        margin: 0;
      }
      .field {
        display: grid;
        gap: 6px;
      }
      .params {
        display: grid;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--mc-radius, 8px);
        background: var(--mc-surface-2, var(--secondary-background-color, #f2f3f5));
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        font-variant-numeric: tabular-nums;
      }
      input.range {
        width: 100%;
        min-height: 24px;
        margin: 0;
        accent-color: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }
      .grow {
        flex: 1;
      }
      .status {
        margin: 0;
        min-height: 1em;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
    `,
  ];
}

registerPanel({
  tag: 'mc-anim-part-presets',
  place: 'inspector',
  title: 'Part presets',
  order: 15,
  when: (doc, sel) => doc.kind === 'keyframes' && (sel.kind === 'target' || sel.kind === 'keys') && isRig(sel.target),
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-part-presets': AnimPartPresets;
  }
}
