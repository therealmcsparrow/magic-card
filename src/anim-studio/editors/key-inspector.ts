import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import type { AnimationDoc, AnimationKeyframe, TargetRef } from '../model';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { PreviewTile } from '../tiles';
import './bezier-editor';
import {
  FILTER_PRESETS,
  LANE_BY_ID,
  laneLabel,
  SHADOW_PRESETS,
  colorFromPicker,
  colorToPicker,
  copyTargetKeys,
  deleteKeys,
  deleteTargetKeys,
  easingGroup,
  formatShadow,
  keyEasing,
  keyFragment,
  laneEasingOverride,
  laneHas,
  laneTimes,
  mainTarget,
  moveTargetKeys,
  parseShadow,
  setKeyClipboard,
  setKeyEasing,
  setKeyFragment,
  setLaneEasing,
  targetIcon,
  targetLabel,
  tkeyExists,
  tkeyId,
  trackKeyframes,
  usedLanes,
  validCss as validCssKind,
  withTrackKeyframes,
  type Fragment,
  type KeyLane,
  type LaneId,
  type TKey,
} from './keyframes-utils';
import { t, m, list, type MessageId } from '../i18n';

/*
 * The key inspector: the selected timeline keys' values and easing, in the studio's right column
 * (registered as the 'inspector' panel for a keys selection). One key: its position, the values of
 * its lane (or of every lane of a whole keyframe), the other properties at that time, and the
 * easing to the next key: a lane key edits its own per-lane easing (`easings[lane]`, the curve of
 * just that property), a whole keyframe the keyframe's easing. Several keys: one easing for all of
 * them, copy and delete.
 *
 * Panel contract (slots.ts): .doc .hass .library .time .disabled .selection .tile .stage; emits
 * doc-change { doc, label, transient? }, selection-change { selection } (a key moved or picked).
 * Uses <mc-unit-field> and <mc-color-picker> from the editor chunk (by tag).
 */

interface NumField {
  key: string;
  label: MessageId;
  unit: string;
  /** model -> shown number */
  get: (f: Fragment) => number | undefined;
  /** shown number -> fragment; a string is an error message. */
  set: (f: Fragment, n: number) => Fragment | string;
}

const range = (n: number, min: number, max: number, unit: string): string | undefined =>
  n < min || n > max ? t('Must be between {min} and {max} {unit}.', { min, max, unit }) : undefined;
const tf = (f: Fragment, patch: Record<string, unknown>): Fragment => ({ ...f, transform: { ...(f.transform ?? {}), ...patch } });
const pct = (v: number | undefined): number | undefined => (v === undefined ? undefined : Math.round(v * 100000) / 1000);
const round1 = (n: number): number => Math.round(n * 10) / 10;
const pctText = (at: number): string => `${round1(at)}%`;

const NUM_FIELDS: Partial<Record<LaneId, NumField[]>> = {
  x: [{ key: 'x', label: m('X'), unit: 'px', get: (f) => f.transform?.x, set: (f, n) => range(n, -10000, 10000, 'px') ?? tf(f, { x: n }) }],
  y: [{ key: 'y', label: m('Y'), unit: 'px', get: (f) => f.transform?.y, set: (f, n) => range(n, -10000, 10000, 'px') ?? tf(f, { y: n }) }],
  scale: [
    { key: 'scale', label: m('Scale'), unit: '%', get: (f) => pct(f.transform?.scale), set: (f, n) => range(n, 0, 10000, '%') ?? tf(f, { scale: n / 100 }) },
  ],
  scale_x: [
    {
      key: 'scale_x',
      label: m('Scale X'),
      unit: '%',
      get: (f) => pct(f.transform?.scale_x),
      set: (f, n) => range(n, -10000, 10000, '%') ?? tf(f, { scale_x: n / 100 }),
    },
  ],
  scale_y: [
    {
      key: 'scale_y',
      label: m('Scale Y'),
      unit: '%',
      get: (f) => pct(f.transform?.scale_y),
      set: (f, n) => range(n, -10000, 10000, '%') ?? tf(f, { scale_y: n / 100 }),
    },
  ],
  rotate: [
    { key: 'rotate', label: m('Angle'), unit: 'deg', get: (f) => f.transform?.rotate, set: (f, n) => range(n, -36000, 36000, 'deg') ?? tf(f, { rotate: n }) },
  ],
  skew: [
    { key: 'skew_x', label: m('Skew X'), unit: 'deg', get: (f) => f.transform?.skew_x ?? 0, set: (f, n) => range(n, -89, 89, 'deg') ?? tf(f, { skew_x: n }) },
    { key: 'skew_y', label: m('Skew Y'), unit: 'deg', get: (f) => f.transform?.skew_y ?? 0, set: (f, n) => range(n, -89, 89, 'deg') ?? tf(f, { skew_y: n }) },
  ],
  opacity: [
    {
      key: 'opacity',
      label: m('Opacity'),
      unit: '%',
      get: (f) => pct(f.opacity),
      set: (f, n) => range(n, 0, 100, '%') ?? { ...f, opacity: Math.round(n * 10) / 1000 },
    },
  ],
  blur: [{ key: 'blur', label: m('Blur'), unit: 'px', get: (f) => f.blur, set: (f, n) => range(n, 0, 200, 'px') ?? { ...f, blur: n } }],
  radius: [{ key: 'radius', label: m('Radius'), unit: 'px', get: (f) => f.radius, set: (f, n) => range(n, 0, 1000, 'px') ?? { ...f, radius: n } }],
  draw: [
    { key: 'draw', label: m('Drawn'), unit: '%', get: (f) => pct(f.draw), set: (f, n) => range(n, 0, 100, '%') ?? { ...f, draw: Math.round(n * 10) / 1000 } },
  ],
};

const AXES: Array<{ id: string; label: MessageId; axis?: [number, number, number] }> = [
  { id: 'z', label: m('Flat (Z)') },
  { id: 'y', label: m('Flip sideways (Y)'), axis: [0, 1, 0] },
  { id: 'x', label: m('Flip over (X)'), axis: [1, 0, 0] },
];

@customElement('mc-anim-key-inspector')
export class AnimKeyInspector extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) selection?: StudioSelection;
  @property({ attribute: false }) tile?: PreviewTile;
  @property({ attribute: false }) stage?: StageInfo;
  /** The colour shown for the animation colour (entity colour) in colour fields. */
  @property({ type: String }) entityColor = 'var(--primary-color, #03a9f4)';

  @state() private _errors: Record<string, string> = {};
  /** A curve drag in progress: its doc, shown until the host feeds the change back. */
  @state() private _draft?: AnimationDoc;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc')) this._draft = undefined;
    if (changed.has('selection')) this._errors = {};
  }

  private get _view(): AnimationDoc | undefined {
    return this._draft ?? this.doc;
  }

  /** The selected keys that exist. */
  private get _keys(): TKey[] {
    const view = this._view;
    if (!view || this.selection?.kind !== 'keys') return [];
    return (this.selection.keys ?? []).map((k) => ({ target: k.target, lane: k.lane as KeyLane, at: k.at })).filter((k) => tkeyExists(view, k));
  }

  // ── emitting ──

  private _emit(doc: AnimationDoc, label: string, transient = false): void {
    if (this.disabled) return;
    if (transient) this._draft = doc;
    else this._draft = undefined;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
  }

  private _select(keys: TKey[]): void {
    const main = this._view ? mainTarget(this._view) : 'element';
    const selection: StudioSelection = keys.length
      ? {
          kind: 'keys',
          target: keys[keys.length - 1].target,
          targets: [...new Set(keys.map((k) => k.target))],
          keys: keys.map((k) => ({ target: k.target, lane: k.lane, at: k.at, id: tkeyId(k, main) })),
        }
      : { kind: 'none' };
    this.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
  }

  /** The doc with the target's keyframes edited by `fn`. */
  private _editTrack(target: TargetRef, fn: (kfs: AnimationKeyframe[]) => AnimationKeyframe[]): AnimationDoc {
    const view = this.doc!;
    return withTrackKeyframes(view, target, fn(trackKeyframes(view, target)));
  }

  private _setFragment(target: TargetRef, lane: LaneId, at: number, frag: Fragment, label: string): void {
    if (!this.doc) return;
    this._emit(
      this._editTrack(target, (kfs) => setKeyFragment(kfs, lane, at, frag)),
      label,
    );
  }

  /** The easing a key edits: a lane key its own override, a whole keyframe the keyframe's easing. */
  private _ownEasing(k: TKey): string | undefined {
    const kfs = trackKeyframes(this._view!, k.target);
    return k.lane === '*' ? keyEasing(kfs, k.at) : laneEasingOverride(kfs, k.lane, k.at);
  }

  private _setEasing(keys: TKey[], value: string | undefined, transient: boolean): void {
    if (!this.doc) return;
    let doc = this.doc;
    for (const k of keys) {
      const kfs = trackKeyframes(doc, k.target);
      doc = withTrackKeyframes(doc, k.target, k.lane === '*' ? setKeyEasing(kfs, k.at, value) : setLaneEasing(kfs, k.lane, k.at, value));
    }
    this._emit(doc, 'Change easing', transient);
  }

  private _delete(keys: TKey[]): void {
    if (!this.doc || !keys.length) return;
    this._emit(deleteTargetKeys(this.doc, keys), `Delete ${keys.length === 1 ? 'keyframe' : 'keyframes'}`);
    this._select([]);
  }

  private _copy(keys: TKey[]): void {
    const c = this.doc ? copyTargetKeys(this.doc, keys) : undefined;
    if (c) setKeyClipboard(c);
  }

  private _moveTo(k: TKey, at: number): void {
    if (!this.doc) return;
    const res = moveTargetKeys(this.doc, [k], at - k.at);
    this._emit(res.doc, 'Move keyframe');
    this._select(res.selection);
  }

  // ── render ──

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      :host([disabled]) .insp {
        opacity: 0.6;
        pointer-events: none;
      }
      .insp {
        display: grid;
        gap: 16px;
        align-content: start;
        min-width: 0;
        padding: 16px 0;
      }
      .insp-head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .tile {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        flex: none;
        border-radius: var(--mc-radius);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 20px;
      }
      .insp-title {
        flex: 1;
        min-width: 0;
      }
      .insp-title b {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .insp-title span {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fields {
        display: grid;
        gap: 12px;
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
        gap: 12px;
      }
      .quad {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .sub {
        display: grid;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid var(--mc-divider);
      }
      .sub-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 28px;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .sub-head ha-icon {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
      }
      .sub-head .grow {
        flex: 1;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chip[aria-pressed='true'] {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
      .at-field {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
      }
      .at-field .secs {
        font-family: var(--mc-mono);
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .ease-of {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 8px;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .danger-text:hover {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      .foot-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: space-between;
      }
    `,
  ];

  /** The last content shown (kept while a drag moves the keys ahead of the selection: no flicker). */
  private _last?: TemplateResult;

  protected render(): TemplateResult {
    const keys = this._keys;
    if (!this._view || !keys.length) {
      // the selection still names keys the (moving) document has not got: keep the last content
      const pending = this.selection?.kind === 'keys' && !!this.selection.keys?.length;
      return pending && this._last ? this._last : html``;
    }
    this._last = html`<section class="insp" aria-label=${t('Keyframe inspector')}>${keys.length > 1 ? this._renderMany(keys) : this._renderOne(keys[0])}</section>`;
    return this._last;
  }

  private _easingEditor(keys: TKey[], inherited: string, disabled: boolean, value: string | undefined): TemplateResult {
    return html`<mc-anim-bezier-editor
      .value=${value}
      .inherited=${inherited}
      ?disabled=${this.disabled || disabled}
      @easing-change=${(e: CustomEvent) => this._setEasing(keys, e.detail.value, !!e.detail.transient)}
    ></mc-anim-bezier-editor>`;
  }

  private _renderMany(keys: TKey[]): TemplateResult {
    const view = this._view!;
    const times = [...new Set(keys.map((k) => k.at))].sort((a, b) => a - b);
    const targets = [...new Set(keys.map((k) => k.target))];
    const easings = new Set(keys.map((k) => this._ownEasing(k) ?? ''));
    const shared = easings.size === 1 ? [...easings][0] || undefined : undefined;
    const lanes = new Set(keys.map((k) => k.lane));
    const where = targets.length > 1 ? t('{count} targets', { count: targets.length }) : targetLabel(view, targets[0]);
    return html`
      <div class="insp-head">
        <span class="tile"><ha-icon icon="mdi:selection-multiple"></ha-icon></span>
        <div class="insp-title">
          <b>${t('{count} keyframes', { count: keys.length })}</b>
          <span>${t('{where} · {from} to {to}', { where, from: pctText(times[0]), to: pctText(times[times.length - 1]) })}</span>
        </div>
      </div>
      <p class="note">${t('Drag any of them on the timeline, or use the arrow keys, to move them together.')}</p>
      <div class="foot-actions">
        <button type="button" class="btn btn-text btn-sm" data-act="copy" @click=${() => this._copy(keys)}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t('Copy')}
        </button>
        <button type="button" class="btn btn-text btn-sm danger-text" data-act="delete" @click=${() => this._delete(keys)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t('Delete {count} keyframes', { count: keys.length })}
        </button>
      </div>
      <div class="sub">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${t('Easing to the next keyframe')}</span></div>
        ${easings.size > 1 ? html`<p class="note">${t('The selected keyframes use different easings; a choice here sets all of them.')}</p>` : nothing}
        ${lanes.size > 1 || !lanes.has('*') ? html`<p class="note">${t("Property keys get their own easing; whole keyframes set the keyframe's easing.")}</p>` : nothing}
        ${this._easingEditor(keys, view.easing, false, shared)}
      </div>
    `;
  }

  private _renderOne(k: TKey): TemplateResult {
    const view = this._view!;
    const kfs = trackKeyframes(view, k.target);
    const lanes: LaneId[] = k.lane === '*' ? usedLanes(kfs.filter((f) => f.at === k.at)) : [k.lane];
    const def = k.lane === '*' ? undefined : LANE_BY_ID[k.lane];
    const others = k.lane === '*' ? [] : usedLanes(kfs.filter((f) => f.at === k.at)).filter((l) => l !== k.lane);
    const last = laneTimes(kfs, k.lane).every((t) => t <= k.at);
    const secs = ((view.duration * k.at) / 100).toFixed(2);
    const many = (view.tracks?.length ?? 0) > 0;
    const where = many || k.target !== mainTarget(view) ? targetLabel(view, k.target) : '';
    return html`
      <div class="insp-head">
        <span class="tile"><ha-icon icon=${def?.icon ?? targetIcon(k.target)}></ha-icon></span>
        <div class="insp-title">
          <b>${def ? t(def.label) : t('Keyframe')}</b>
          <span>${where ? t('{target} · at {at} · {secs} s', { target: where, at: pctText(k.at), secs }) : t('At {at} · {secs} s', { at: pctText(k.at), secs })}</span>
        </div>
        <button
          type="button"
          class="icon-btn sm danger"
          data-act="delete"
          aria-label=${t('Delete keyframe')}
          title=${t('Delete keyframe')}
          @click=${() => this._delete([k])}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-at">${t('Position')}</label></div>
        <div class="at-field">
          <mc-unit-field
            inputId="kf-at"
            .label=${t('Position')}
            .value=${`${k.at}%`}
            .units=${['%']}
            noCustom
            ?disabled=${this.disabled}
            @value-changed=${(e: CustomEvent) => this._onAt(e, k)}
          ></mc-unit-field>
          <span class="secs">${secs} s</span>
        </div>
        ${this._errors.at ? html`<p class="help error">${this._errors.at}</p>` : nothing}
      </div>
      ${lanes.length ? lanes.map((l) => this._renderLaneFields(k.target, l, k.at, k.lane === '*')) : html`<p class="note">${t('This keyframe sets no property. Add one with Add property.')}</p>`}
      ${
        others.length
          ? html`<div class="field">
              <div class="field-head"><span class="lbl">${t('Also at {at}', { at: pctText(k.at) })}</span></div>
              <div class="chips">
                ${others.map(
                  (l) =>
                    html`<button type="button" class="chip" data-lane=${l} @click=${() => this._select([{ target: k.target, lane: l, at: k.at }])}>
                      <ha-icon icon=${LANE_BY_ID[l].icon}></ha-icon>${laneLabel(l)}
                    </button>`,
                )}
                <button type="button" class="chip" data-lane="*" @click=${() => this._select([{ target: k.target, lane: '*', at: k.at }])}>
                  <ha-icon icon="mdi:key-variant"></ha-icon>${t('Whole keyframe')}
                </button>
              </div>
            </div>`
          : nothing
      }
      ${this._renderEasing(k, kfs, last)}
    `;
  }

  private _renderEasing(k: TKey, kfs: AnimationKeyframe[], last: boolean): TemplateResult {
    const view = this._view!;
    const shared = keyEasing(kfs, k.at);
    if (k.lane === '*') {
      return html`<div class="sub" data-easing="keyframe">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${t('Easing to the next keyframe')}</span></div>
        ${last ? html`<p class="note">${t('This is the last keyframe: no segment follows it, so its easing has no effect.')}</p>` : nothing}
        ${this._easingEditor([k], view.easing, last, shared)}
      </div>`;
    }
    const lane = k.lane;
    const group = easingGroup(lane).filter((l) => l !== lane);
    const groupText = group.length ? list(group.map((l) => laneLabel(l))) : '';
    return html`<div class="sub" data-easing="lane">
      <div class="sub-head">
        <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${t('{label} easing to the next key', { label: laneLabel(lane) })}</span>
      </div>
      ${
        last
          ? html`<p class="note">${t("This is the lane's last key: no segment follows it, so its easing has no effect.")}</p>`
          : html`<p class="note">
              ${shared ? t("Only this property. Default follows the keyframe's easing.") : t("Only this property. Default follows the keyframe's easing (the animation easing).")}${groupText ? ` ${t('{names} share this curve.', { names: groupText })}` : ''}
            </p>`
      }
      ${this._easingEditor([k], shared ?? view.easing, last, laneEasingOverride(kfs, lane, k.at))}
      ${
        laneHas(kfs.find((f) => f.at === k.at) ?? { at: 0 }, lane)
          ? html`<div class="ease-of">
              <button type="button" class="btn btn-text btn-sm" data-act="whole" @click=${() => this._select([{ target: k.target, lane: '*', at: k.at }])}>
                <ha-icon icon="mdi:key-variant"></ha-icon>${t("Edit the keyframe's easing")}
              </button>
            </div>`
          : nothing
      }
    </div>`;
  }

  private _onAt(e: CustomEvent, k: TKey): void {
    e.stopPropagation();
    const n = parseFloat(String(e.detail.value));
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      this._errors = { ...this._errors, at: t('Must be between 0 and 100%.') };
      (e.target as { revert?: () => void }).revert?.();
      return;
    }
    this._errors = { ...this._errors, at: '' };
    if (n !== k.at) this._moveTo(k, Math.round(n * 100) / 100);
  }

  private _renderLaneFields(target: TargetRef, lane: LaneId, at: number, withHead: boolean): TemplateResult {
    const def = LANE_BY_ID[lane];
    const frag = keyFragment(trackKeyframes(this._view!, target), lane, at);
    const body = this._laneBody(target, lane, at, frag, withHead);
    if (!withHead) return html`<div class="fields" data-lane=${lane}>${body}</div>`;
    return html`<div class="sub" data-lane=${lane}>
      <div class="sub-head">
        <ha-icon icon=${def.icon}></ha-icon><span class="grow">${t(def.label)}</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${t('Remove {name} from this keyframe', { name: t(def.label).toLowerCase() })}
          title=${t('Remove from this keyframe')}
          @click=${() =>
            this._emit(
              this._editTrack(target, (kfs) => deleteKeys(kfs, [{ lane, at }])),
              `Remove ${lane}`,
            )}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${body}
    </div>`;
  }

  private _laneBody(target: TargetRef, lane: LaneId, at: number, frag: Fragment, headed = false): TemplateResult {
    const nums = NUM_FIELDS[lane];
    if (nums) {
      return html`
        <div class="pair">${nums.map((f) => this._numField(target, lane, at, frag, f, headed && nums.length === 1))}</div>
        ${lane === 'rotate' ? this._axisField(target, at, frag) : nothing}
      `;
    }
    if (lane === 'color' || lane === 'background' || lane === 'stroke') return this._colorField(target, lane, at, frag);
    if (lane === 'shadow') return this._shadowField(target, at, frag);
    return this._filterField(target, at, frag);
  }

  private _numField(target: TargetRef, lane: LaneId, at: number, frag: Fragment, f: NumField, bare = false): TemplateResult {
    const v = f.get(frag);
    const id = `kf-${lane}-${f.key}`;
    const err = this._errors[id];
    return html`<div class="field">
      ${bare ? nothing : html`<div class="field-head"><label for=${id}>${t(f.label)}</label></div>`}
      <mc-unit-field
        .inputId=${id}
        .label=${t(f.label)}
        .value=${v === undefined ? '' : `${v}${f.unit}`}
        .units=${[f.unit]}
        noCustom
        ?disabled=${this.disabled}
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          const field = e.target as { revert?: () => void };
          const n = parseFloat(String(e.detail.value));
          if (!Number.isFinite(n)) {
            field.revert?.();
            return;
          }
          const out = f.set(keyFragment(trackKeyframes(this._view!, target), lane, at), n);
          if (typeof out === 'string') {
            this._errors = { ...this._errors, [id]: out };
            field.revert?.();
            return;
          }
          this._errors = { ...this._errors, [id]: '' };
          this._setFragment(target, lane, at, out, `Change ${lane}`);
        }}
      ></mc-unit-field>
      ${err ? html`<p class="help error">${err}</p>` : nothing}
    </div>`;
  }

  private _axisField(target: TargetRef, at: number, frag: Fragment): TemplateResult {
    const axis = frag.transform?.axis;
    const cur = !axis ? 'z' : (AXES.find((a) => a.axis && a.axis.every((n, i) => n === axis[i]))?.id ?? 'custom');
    return html`<div class="field">
      <div class="field-head"><label for="kf-axis">${t('Turn')}</label></div>
      <div class="select">
        <select
          class="input"
          id="kf-axis"
          ?disabled=${this.disabled}
          @change=${(e: Event) => {
            const a = AXES.find((x) => x.id === (e.target as HTMLSelectElement).value);
            if (!a) return;
            const tr = { ...(keyFragment(trackKeyframes(this._view!, target), 'rotate', at).transform ?? {}) };
            if (a.axis) tr.axis = [...a.axis];
            else delete tr.axis;
            this._setFragment(target, 'rotate', at, { transform: tr }, 'Change turn axis');
          }}
        >
          ${AXES.map((a) => html`<option value=${a.id} ?selected=${cur === a.id}>${t(a.label)}</option>`)}
          ${cur === 'custom' ? html`<option value="custom" selected>${t('Custom axis ({axis})', { axis: axis!.join(', ') })}</option>` : nothing}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`;
  }

  private _colorField(target: TargetRef, lane: 'color' | 'background' | 'stroke', at: number, frag: Fragment): TemplateResult {
    const id = `kf-${lane}`;
    const current = frag[lane];
    const label = lane === 'color' ? t('Text and icon colour') : lane === 'stroke' ? t('Stroke colour') : t('Background');
    const kind = lane === 'background' ? 'background' : 'color';
    return html`<div class="field">
      <div class="field-head"><span class="lbl">${label}</span></div>
      <mc-color-picker
        .value=${colorToPicker(current)}
        .label=${label}
        allowEntity
        .entityColor=${this.entityColor}
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          let v = colorFromPicker(String(e.detail.value ?? ''));
          if (!v) {
            if (!colorToPicker(current).startsWith('entity')) return;
            v = 'var(--primary-color)';
          }
          if (!validCssKind(v, kind)) {
            this._errors = { ...this._errors, [id]: kind === 'color' ? t('Not a valid colour.') : t('Use a colour or a gradient.') };
            return;
          }
          this._errors = { ...this._errors, [id]: '' };
          if (v !== current) this._setFragment(target, lane, at, { [lane]: v }, `Change ${label.toLowerCase()}`);
        }}
      ></mc-color-picker>
      ${
        this._errors[id]
          ? html`<p class="help error">${this._errors[id]}</p>`
          : html`<p class="help">${t("The entity colour button uses the animation colour (the card entry's colour, else the entity's).")}</p>`
      }
    </div>`;
  }

  private _shadowField(target: TargetRef, at: number, frag: Fragment): TemplateResult {
    const v = frag.shadow ?? '';
    const parts = parseShadow(v);
    const err = this._errors['kf-shadow'];
    const write = (s: string) => {
      if (!validCssKind(s, 'shadow')) {
        this._errors = { ...this._errors, 'kf-shadow': t('Not an allowed shadow: x y blur spread colour.') };
        return;
      }
      this._errors = { ...this._errors, 'kf-shadow': '' };
      if (s !== v) this._setFragment(target, 'shadow', at, { shadow: s }, 'Change shadow');
    };
    const part = (key: 'x' | 'y' | 'blur' | 'spread', label: string) =>
      html`<div class="field">
        <div class="field-head"><label for=${`kf-sh-${key}`}>${label}</label></div>
        <mc-unit-field
          .inputId=${`kf-sh-${key}`}
          .label=${t('Shadow {name}', { name: label.toLowerCase() })}
          .value=${`${parts![key]}px`}
          .units=${['px']}
          noCustom
          compact
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            const n = parseFloat(String(e.detail.value));
            if (!Number.isFinite(n) || (key === 'blur' && n < 0)) return (e.target as { revert?: () => void }).revert?.();
            write(formatShadow({ ...parts!, [key]: n }));
          }}
        ></mc-unit-field>
      </div>`;
    return html`
      <div class="chips" role="group" aria-label=${t('Shadow presets')}>
        ${SHADOW_PRESETS.map((p) => html`<button type="button" class="chip" aria-pressed=${v === p.value ? 'true' : 'false'} @click=${() => write(p.value)}>${t(p.label)}</button>`)}
      </div>
      ${
        parts
          ? html`<div class="quad">${part('x', 'X')} ${part('y', 'Y')} ${part('blur', t('Blur'))} ${part('spread', t('Spread'))}</div>
              <div class="field">
                <div class="field-head"><span class="lbl">${t('Shadow colour')}</span></div>
                <mc-color-picker
                  .value=${colorToPicker(parts.color)}
                  .label=${t('Shadow colour')}
                  allowEntity
                  .entityColor=${this.entityColor}
                  @value-changed=${(e: CustomEvent) => {
                    e.stopPropagation();
                    const c = colorFromPicker(String(e.detail.value ?? '')) || 'rgba(0, 0, 0, 0.3)';
                    write(formatShadow({ ...parts, color: c }));
                  }}
                ></mc-color-picker>
              </div>`
          : html`<div class="field">
              <div class="field-head"><label for="kf-shadow">${t('Shadow')}</label></div>
              <input
                class="input mono"
                id="kf-shadow"
                type="text"
                spellcheck="false"
                .value=${v}
                @change=${(e: Event) => write((e.target as HTMLInputElement).value.trim())}
              />
            </div>`
      }
      ${err ? html`<p class="help error">${err}</p>` : nothing}
    `;
  }

  private _filterField(target: TargetRef, at: number, frag: Fragment): TemplateResult {
    const v = frag.filter ?? '';
    const err = this._errors['kf-filter'];
    const write = (s: string) => {
      if (!validCssKind(s, 'filter')) {
        this._errors = { ...this._errors, 'kf-filter': t('Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.') };
        return;
      }
      this._errors = { ...this._errors, 'kf-filter': '' };
      if (s !== v) this._setFragment(target, 'filter', at, { filter: s }, 'Change filter');
    };
    return html`
      <div class="chips" role="group" aria-label=${t('Filter presets')}>
        ${FILTER_PRESETS.map((p) => html`<button type="button" class="chip" aria-pressed=${v === p.value ? 'true' : 'false'} @click=${() => write(p.value)}>${t(p.label)}</button>`)}
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-filter">${t('Filter')}</label></div>
        <input
          class="input mono"
          id="kf-filter"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-invalid=${err ? 'true' : 'false'}
          .value=${v}
          @change=${(e: Event) => write((e.target as HTMLInputElement).value.trim())}
        />
        ${err ? html`<p class="help error">${err}</p>` : html`<p class="help">${t('Blur has its own lane and is added to this list.')}</p>`}
      </div>
    `;
  }
}

/** The key inspector shows in the studio's right column while timeline keys are selected. */
registerPanel({
  tag: 'mc-anim-key-inspector',
  place: 'inspector',
  when: (doc, sel) => doc.kind === 'keyframes' && sel.kind === 'keys' && !!sel.keys?.length,
  title: m('Keyframe'),
  order: 0,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-key-inspector': AnimKeyInspector;
  }
}
