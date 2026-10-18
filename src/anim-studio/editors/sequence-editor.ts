import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import { MenuPopover } from '../../editor/components/menu-popover';
import type { HomeAssistant } from '../../types';
import type { LayerView, LayerViewChangeDetail } from '../../contracts/studio-layers';
import { dropStepKey, remapStepKeys } from '../layer-view';
import { lockBanner, lockBannerStyles } from './lock-banner';
import { ANIMATION_CAPS, type AnimationDoc, type SequenceStep } from '../model';
import {
  activeStep,
  canAddStep,
  formatSeconds,
  moveItem,
  sequenceTimeline,
  stepInfo,
  stepPickerGroups,
  stepSummary,
  type AnimationLibraryMap,
  type Timeline,
} from './sequence-utils';

// mc-unit-field comes from the editor chunk (loaded through window.MagicCard.loadEditor); the studio bundle must not define it.

/** Where the step picker writes: a new step, or the animation of step `index`. */
type PickTarget = { mode: 'add' } | { mode: 'step'; index: number };

interface DragState {
  from: number;
  to: number;
  /** px the dragged row has moved */
  dy: number;
  startY: number;
  pointerId: number;
  /** vertical centre of every row, and the dragged row's height + gap, at the start */
  mids: number[];
  shift: number;
  /** the steps when the drag began (the host may feed transient docs back meanwhile) */
  steps: SequenceStep[];
  /** a transient doc-change went out (cancel must undo it) */
  moved: boolean;
}

/** Seconds from an mc-unit-field value ('0.2s', '' = removed). */
function secondsOf(v: unknown): number | undefined {
  const s = String(v ?? '').trim();
  if (!s) return undefined;
  const n = parseFloat(s);
  if (!Number.isFinite(n)) return undefined;
  return /ms$/i.test(s) ? n / 1000 : n;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));
const round3 = (n: number): number => Math.round(n * 1000) / 1000;

/**
 * Sequence document editor (studio inspector): the steps in play order, each a collapsible row
 * (animation, delay, duration override, plays), reordered by dragging the handle or Alt+Up /
 * Alt+Down; a schedule bar drawing one cycle with the playhead at `.time`; Loop and the
 * children stagger. Steps that cannot play (missing document, particles, an effect preset) are
 * flagged on their row and drawn as a gap marker, as the player skips them.
 *
 * Contract: .superpowers/sdd/anim-studio/editor-contract.md. `.doc` is never mutated; every edit
 * emits `doc-change` { doc, label } (a drag: transient ones while moving, one final on release).
 */
@customElement('mc-anim-sequence-editor')
export class AnimSequenceEditor extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The library by id: step names, durations and the picker's "My animations". */
  @property({ attribute: false }) library?: AnimationLibraryMap;
  /** Current scrub position, 0-1 of one cycle. */
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Preview-only hide / solo / lock of the steps (`step:<n>` keys); they follow a step through a move, a drag or a delete. */
  @property({ attribute: false }) layerView?: LayerView;

  /** The expanded step row (-1: none). */
  @state() private _open = -1;
  @state() private _drag?: DragState;
  @state() private _query = '';
  @state() private _announce = '';

  private _pick: PickTarget | null = null;
  private _focusAfter?: { index: number; part: 'handle' | 'toggle' };
  private _focusSearch = false;

  private _menu = new MenuPopover(this, {
    menu: () => this.renderRoot.querySelector<HTMLElement>('.pick-menu'),
    onClose: () => {
      this._pick = null;
      this._query = '';
    },
  });

  private get _steps(): SequenceStep[] {
    return this.doc?.steps ?? [];
  }

  // ── writing ──

  private _emit(doc: AnimationDoc, label: string, transient = false): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
  }

  /** The view with the step keys moved the way the steps were (nothing is sent when no key changes). */
  private _remap(by: (v: LayerView) => LayerView): void {
    const v = this.layerView;
    const next = v && by(v);
    if (next && next !== v) this.dispatchEvent(new CustomEvent<LayerViewChangeDetail>('layer-view-change', { detail: { view: next }, bubbles: true, composed: true }));
  }

  private _writeSteps(steps: SequenceStep[], label: string, transient = false): void {
    if (!this.doc) return;
    this._emit({ ...this.doc, steps }, label, transient);
  }

  private _patchStep(index: number, patch: Partial<SequenceStep>, label: string): void {
    const steps = this._steps.map((s, i) => {
      if (i !== index) return s;
      const next = { ...s, ...patch };
      if (patch.duration === undefined && 'duration' in patch) delete next.duration;
      return next;
    });
    this._writeSteps(steps, label);
  }

  private _addStep(animation: string): void {
    if (!canAddStep(this._steps)) return;
    const steps = [...this._steps, { animation, delay: 0, repeat: 1 }];
    this._open = steps.length - 1;
    this._focusAfter = { index: steps.length - 1, part: 'toggle' };
    this._writeSteps(steps, 'Add step');
    this._announce = `Step ${steps.length} added: ${stepInfo(animation, this.library, this.doc?.id).name}.`;
  }

  /** A locked step cannot be moved, deleted or edited; says so in the live region. */
  private _locked(i: number, say = false): boolean {
    const on = !!this.layerView?.locked.includes(`step:${i}`);
    if (on && say) this._announce = `Step ${i + 1} is locked. Unlock it in Layers.`;
    return on;
  }

  private _deleteStep(index: number): void {
    if (this._steps.length <= 1 || this._locked(index, true)) return;
    const steps = this._steps.filter((_s, i) => i !== index);
    if (this._open === index) this._open = -1;
    else if (this._open > index) this._open--;
    this._focusAfter = steps.length ? { index: Math.min(index, steps.length - 1), part: 'toggle' } : undefined;
    this._writeSteps(steps, 'Delete step');
    this._remap((v) => dropStepKey(v, index));
    this._announce = `Step ${index + 1} deleted.`;
  }

  /** Move step `from` to `to` (keyboard or a finished drag): one edit. */
  private _move(from: number, to: number, focus: 'handle' | 'toggle' = 'handle'): void {
    const n = this._steps.length;
    if (from === to || to < 0 || to >= n || this._locked(from, true)) return;
    this._open = this._followMove(this._open, from, to);
    this._focusAfter = { index: to, part: focus };
    this._writeSteps(moveItem(this._steps, from, to), 'Move step');
    this._remap((v) => remapStepKeys(v, from, to));
    this._announce = `Step moved to position ${to + 1} of ${n}.`;
  }

  /** Where row `i` ends up when the row at `from` moves to `to`. */
  private _followMove(i: number, from: number, to: number): number {
    if (i < 0) return i;
    if (i === from) return to;
    if (from < i && i <= to) return i - 1;
    if (to <= i && i < from) return i + 1;
    return i;
  }

  // ── drag to reorder ──

  private _onHandleDown(e: PointerEvent, index: number): void {
    if (this.disabled || e.button !== 0 || this._steps.length < 2 || this._locked(index, true)) return;
    const rows = [...this.renderRoot.querySelectorAll<HTMLElement>('.step')];
    if (!rows[index]) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const rects = rows.map((r) => r.getBoundingClientRect());
    const next = rects[index + 1] ?? rects[index - 1];
    const gap = next ? Math.abs((index + 1 < rects.length ? next.top - rects[index].bottom : rects[index].top - next.bottom)) : 0;
    this._drag = {
      from: index,
      to: index,
      dy: 0,
      startY: e.clientY,
      pointerId: e.pointerId,
      mids: rects.map((r) => r.top + r.height / 2),
      shift: rects[index].height + gap,
      steps: this._steps,
      moved: false,
    };
    window.addEventListener('keydown', this._onDragKey, true);
  }

  private _onDragKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || !this._drag) return;
    e.preventDefault();
    e.stopPropagation();
    this._cancelDrag();
  };

  private _endDrag(): DragState | undefined {
    const d = this._drag;
    this._drag = undefined;
    window.removeEventListener('keydown', this._onDragKey, true);
    return d;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._endDrag();
  }

  private _onHandleMove(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    const dy = e.clientY - d.startY;
    // the drop slot follows the pointer (an open row is tall: its own centre would overshoot)
    const y = e.clientY;
    let to = d.from;
    for (let i = d.from + 1; i < d.mids.length; i++) if (y > d.mids[i]) to = i;
    for (let i = d.from - 1; i >= 0; i--) if (y < d.mids[i]) to = i;
    const changed = to !== d.to;
    this._drag = { ...d, dy, to, moved: d.moved || changed };
    if (changed && this.doc) this._emit({ ...this.doc, steps: moveItem(d.steps, d.from, to) }, 'Move step', true);
  }

  private _onHandleUp(e: PointerEvent): void {
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    this._endDrag();
    if (d.to !== d.from) {
      this._open = this._followMove(this._open, d.from, d.to);
      this._focusAfter = { index: d.to, part: 'handle' };
      if (this.doc) this._emit({ ...this.doc, steps: moveItem(d.steps, d.from, d.to) }, 'Move step');
      this._remap((v) => remapStepKeys(v, d.from, d.to));
      this._announce = `Step moved to position ${d.to + 1} of ${d.steps.length}.`;
    }
  }

  /** Escape / pointercancel: put the order back (a final event when transient ones went out). */
  private _cancelDrag(): void {
    const d = this._endDrag();
    if (!d) return;
    if (d.moved && this.doc) this._emit({ ...this.doc, steps: d.steps }, 'Move step');
  }

  private _onStepKey(e: KeyboardEvent, index: number): void {
    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') || this.disabled) return;
    e.preventDefault();
    const handle = (e.target as HTMLElement).classList?.contains('handle');
    this._move(index, index + (e.key === 'ArrowUp' ? -1 : 1), handle ? 'handle' : 'toggle');
  }

  /** translateY of row `i` while dragging: the dragged row follows the pointer, the rows it passed make room. */
  private _dragOffset(i: number): number {
    const d = this._drag;
    if (!d) return 0;
    if (i === d.from) return d.dy;
    if (d.from < d.to && i > d.from && i <= d.to) return -d.shift;
    if (d.to < d.from && i >= d.to && i < d.from) return d.shift;
    return 0;
  }

  // ── step picker ──

  private _openPicker(e: Event, target: PickTarget): void {
    if (this.disabled) return;
    const trigger = e.currentTarget as HTMLElement;
    const same = this._menu.trigger === trigger;
    this._pick = same ? null : target;
    this._query = '';
    this._focusSearch = !same;
    this._menu.open(trigger);
  }

  private _choose(value: string): void {
    const target = this._pick;
    this._menu.close(true);
    if (!target) return;
    if (target.mode === 'add') this._addStep(value);
    else if (this._steps[target.index]?.animation !== value) this._patchStep(target.index, { animation: value }, 'Change step animation');
  }

  private _onMenuKey(e: KeyboardEvent): void {
    // Home / End move the caret in the search field
    if ((e.key === 'Home' || e.key === 'End') && (e.target as HTMLElement).tagName === 'INPUT') return;
    this._menu.onKeydown(e);
  }

  private _renderMenu(): TemplateResult {
    const target = this._pick;
    const current = target?.mode === 'step' ? this._steps[target.index]?.animation : undefined;
    const groups = stepPickerGroups(this.library, this.doc?.id, this._query);
    return html`
      <div class="menu pick-menu" role="menu" aria-label=${target?.mode === 'add' ? 'Add step' : 'Step animation'} @keydown=${(e: KeyboardEvent) => this._onMenuKey(e)}>
        <div class="pick-search" role="none">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input"
            type="search"
            placeholder="Search animations"
            aria-label="Search animations"
            autocomplete="off"
            .value=${this._query}
            @input=${(e: InputEvent) => {
              this._query = (e.target as HTMLInputElement).value;
              void this.updateComplete.then(() => this._menu.position());
            }}
          />
        </div>
        ${groups.length
          ? groups.map(
              (g) => html`
                <div class="pick-group" role="group" aria-label=${g.label}>
                  <div class="pick-head" aria-hidden="true">${g.label}</div>
                  ${g.items.map(
                    (it) => html`<button
                      type="button"
                      role="menuitem"
                      class="pick-item ${it.value === current ? 'is-current' : ''}"
                      data-value=${it.value}
                      @click=${() => this._choose(it.value)}
                    >
                      <ha-icon icon=${it.icon}></ha-icon>
                      <span class="pick-name">${it.name}${it.kind ? html`<span class="pick-kind"> · ${it.kind}</span>` : nothing}</span>
                      ${it.duration !== undefined ? html`<span class="pick-dur">${formatSeconds(it.duration)}</span>` : nothing}
                      ${it.value === current ? html`<ha-icon class="pick-check" icon="mdi:check"></ha-icon>` : nothing}
                    </button>`,
                  )}
                </div>
              `,
            )
          : html`<p class="menu-note">No animation matches “${this._query}”.</p>`}
      </div>
    `;
  }

  // ── rendering ──

  private _field(label: string, control: TemplateResult, forId?: string): TemplateResult {
    return html`<div class="field">
      <div class="field-head">${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}</div>
      ${control}
    </div>`;
  }

  private _renderSchedule(tl: Timeline): TemplateResult {
    const total = tl.total;
    const live = activeStep(tl, this.time);
    const pct = (s: number) => (total ? (s / total) * 100 : 0);
    const n = this._steps.length;
    const skipped = tl.entries.filter((e) => e.status !== 'ok').length;
    const loop = this.doc?.loop !== false;
    // while dragging the bar shows the new order: the open row is wherever it lands
    const open = this._drag ? this._followMove(this._open, this._drag.from, this._drag.to) : this._open;
    // skipped steps at the same spot sit side by side
    const marks = new Map<number, number>();
    const summary = total
      ? `${n} ${n === 1 ? 'step' : 'steps'}, ${formatSeconds(total)} per cycle${loop ? ', loops' : ', plays once'}${skipped ? `, ${skipped} skipped` : ''}.`
      : 'Nothing plays yet.';
    return html`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${tl.entries.map((e) => {
            if (e.status !== 'ok') {
              const k = marks.get(e.start) ?? 0;
              marks.set(e.start, k + 1);
              return html`<span class="mark" style="left:calc(${pct(e.start)}% + ${k * 8}px)" title="Step ${e.index + 1} is skipped" @click=${() => this._reveal(e.index)}></span>`;
            }
            const cls = ['blk', e.index === open ? 'is-open' : '', e.index === live ? 'is-live' : ''].join(' ');
            const w = pct(e.end - e.start);
            return html`<span
              class=${cls}
              style="left:${pct(e.start)}%;width:${w}%;--plays:${e.repeat}"
              title="Step ${e.index + 1}: ${formatSeconds(e.start)} to ${formatSeconds(e.end)}"
              @click=${() => this._reveal(e.index)}
              >${w >= 6 ? e.index + 1 : ''}</span
            >`;
          })}
          ${total ? html`<span class="playhead" style="left:${clamp(this.time, 0, 1) * 100}%"></span>` : nothing}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${loop ? html`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>Loops</span>` : nothing}
          <span>${formatSeconds(total)}</span>
        </div>
        <p class="sr-only">${summary}</p>
      </div>
    `;
  }

  /** Open step `i` and bring its row into view (a click on the schedule bar). */
  private _reveal(i: number): void {
    this._open = i;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`.step[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest' }));
  }

  private _renderStep(step: SequenceStep, i: number, n: number): TemplateResult {
    const info = stepInfo(step.animation, this.library, this.doc?.id);
    const open = this._open === i;
    const bad = info.status !== 'ok';
    const id = (k: string) => `seq-${i}-${k}`;
    const summary = bad ? (info.status === 'missing' ? 'Not found' : 'Cannot play') : stepSummary(step, info);
    const dragging = this._drag?.from === i;
    const off = this._dragOffset(i);
    const placeholder = info.defaultDuration !== undefined ? String(round3(info.defaultDuration)) : '';
    const lock = this._locked(i);
    return html`
      <li
        class="step ${open ? 'is-open' : ''} ${bad ? 'is-bad' : ''} ${dragging ? 'is-dragging' : ''}"
        data-i=${i}
        style=${off ? `transform: translateY(${off}px)` : ''}
        @keydown=${(e: KeyboardEvent) => this._onStepKey(e, i)}
      >
        <div class="row">
          <button
            type="button"
            class="icon-btn sm handle"
            aria-label="Move step ${i + 1}"
            aria-describedby="seq-move-hint"
            title="Drag to reorder (Alt+Up / Alt+Down)"
            ?disabled=${this.disabled || lock || n < 2}
            @pointerdown=${(e: PointerEvent) => this._onHandleDown(e, i)}
            @pointermove=${(e: PointerEvent) => this._onHandleMove(e)}
            @pointerup=${(e: PointerEvent) => this._onHandleUp(e)}
            @pointercancel=${() => this._cancelDrag()}
            @lostpointercapture=${(e: PointerEvent) => this._onHandleUp(e)}
          >
            <ha-icon icon="mdi:drag-vertical"></ha-icon>
          </button>
          <button
            type="button"
            class="toggle"
            aria-expanded=${open ? 'true' : 'false'}
            aria-controls=${id('body')}
            @click=${() => (this._open = open ? -1 : i)}
          >
            <span class="num">${i + 1}</span>
            <span class="txt">
              <span class="nm">${info.name}</span>
              <span class="sum ${bad ? 'error' : ''}">${bad ? html`<ha-icon icon="mdi:alert-circle-outline"></ha-icon>` : nothing}${summary}</span>
            </span>
            <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label="Delete step ${i + 1}"
            title=${n <= 1 ? 'A sequence needs at least one step' : 'Delete step'}
            ?disabled=${this.disabled || lock || n <= 1}
            @click=${() => this._deleteStep(i)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${open
          ? html`<div class="body" id=${id('body')}>
              ${lock ? lockBanner(this.doc!, this.layerView!, [`step:${i}`]) : nothing}
              ${bad ? html`<p class="help error problem" role="note">${info.problem}</p>` : nothing}
              ${this._field(
                'Animation',
                html`<button
                  type="button"
                  class="input pick-btn"
                  id=${id('anim')}
                  aria-haspopup="menu"
                  aria-expanded=${this._menu.isOpen && this._pick?.mode === 'step' && this._pick.index === i ? 'true' : 'false'}
                  ?disabled=${this.disabled || lock}
                  @click=${(e: Event) => this._openPicker(e, { mode: 'step', index: i })}
                >
                  <span class="pick-val">${info.name}${info.kind && info.kind !== 'Preset' ? html`<span class="pick-kind"> · ${info.kind}</span>` : nothing}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,
                id('anim'),
              )}
              <div class="fields">
                ${this._field(
                  'Delay',
                  html`<mc-unit-field
                    .value=${step.delay ? `${round3(step.delay)}s` : ''}
                    .label=${'Delay'}
                    .units=${['s']}
                    .noCustom=${true}
                    .placeholder=${'0'}
                    ?disabled=${this.disabled || lock}
                    @value-changed=${(e: CustomEvent) => {
                      e.stopPropagation();
                      this._patchStep(i, { delay: clamp(round3(secondsOf(e.detail.value) ?? 0), 0, 600) }, 'Change step delay');
                    }}
                  ></mc-unit-field>`,
                )}
                ${this._field(
                  'Duration',
                  html`<mc-unit-field
                    .value=${step.duration !== undefined ? `${round3(step.duration)}s` : ''}
                    .label=${'Duration'}
                    .units=${['s']}
                    .noCustom=${true}
                    .placeholder=${placeholder}
                    ?disabled=${this.disabled || lock}
                    @value-changed=${(e: CustomEvent) => {
                      e.stopPropagation();
                      const s = secondsOf(e.detail.value);
                      this._patchStep(i, { duration: s === undefined || s <= 0 ? undefined : clamp(round3(s), 0.05, 600) }, 'Change step duration');
                    }}
                  ></mc-unit-field>`,
                )}
                ${this._field(
                  'Plays',
                  html`<input
                    class="input"
                    id=${id('plays')}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    .value=${String(step.repeat)}
                    ?disabled=${this.disabled || lock}
                    @change=${(e: Event) => {
                      const el = e.target as HTMLInputElement;
                      const v = Math.round(Number(el.value));
                      if (!el.value.trim() || !Number.isFinite(v)) {
                        el.value = String(step.repeat);
                        return;
                      }
                      const next = clamp(v, 1, 100);
                      el.value = String(next);
                      if (next !== step.repeat) this._patchStep(i, { repeat: next }, 'Change step plays');
                    }}
                  />`,
                  id('plays'),
                )}
              </div>
              <p class="help">Delay counts from the end of the previous step. Empty duration uses the animation's own${placeholder ? ` (${placeholder} s)` : ''}.</p>
            </div>`
          : nothing}
      </li>
    `;
  }

  protected render(): TemplateResult {
    const doc = this.doc;
    if (!doc) return html``;
    const steps = this._drag ? this._drag.steps : this._steps;
    const tl = sequenceTimeline(this._drag ? moveItem(this._drag.steps, this._drag.from, this._drag.to) : steps, this.library, doc.id);
    const loop = doc.loop !== false;
    const stagger = doc.stagger ?? { children: false, delay: 0.15 };
    const full = !canAddStep(steps);
    return html`
      <div class="wrap">
        <section class="group" aria-label="Schedule">${this._renderSchedule(tl)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">Play order</h3>
            <span class="chip is-count" title="At most ${ANIMATION_CAPS.steps} steps">${steps.length} / ${ANIMATION_CAPS.steps}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">Drag, or press Alt+Up or Alt+Down, to move the step.</p>
          ${steps.length
            ? html`<ol class="steps ${this._drag ? 'is-sorting' : ''}">${steps.map((s, i) => this._renderStep(s, i, steps.length))}</ol>`
            : html`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>No steps yet</strong>
                <p>Add the animations to play one after another.</p>
              </div>`}
          <div class="foot">
            <button
              type="button"
              class="btn btn-text btn-sm add"
              aria-haspopup="menu"
              aria-expanded=${this._menu.isOpen && this._pick?.mode === 'add' ? 'true' : 'false'}
              ?disabled=${this.disabled || full}
              @click=${(e: Event) => this._openPicker(e, { mode: 'add' })}
            >
              <ha-icon icon="mdi:plus"></ha-icon>Add step
            </button>
            ${full ? html`<span class="help">A sequence has at most ${ANIMATION_CAPS.steps} steps.</span>` : nothing}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">Playback</h3></div>
          <div class="switch-row">
            <div class="txt">
              Loop
              <p class="help">Start again after the last step.</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${loop ? 'true' : 'false'}
              aria-label="Loop"
              ?disabled=${this.disabled}
              @click=${() => this._emit({ ...doc, loop: !loop }, loop ? 'Loop off' : 'Loop on')}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              Stagger children
              <p class="help">Play on a row's columns or a column's modules one after another.</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${stagger.children ? 'true' : 'false'}
              aria-label="Stagger children"
              ?disabled=${this.disabled}
              @click=${() => this._emit({ ...doc, stagger: { ...stagger, children: !stagger.children } }, stagger.children ? 'Stagger off' : 'Stagger on')}
            ></button>
          </div>
          ${stagger.children
            ? this._field(
                'Delay between children',
                html`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${round3(stagger.delay)}s`}
                  .label=${'Delay between children'}
                  .units=${['s']}
                  .noCustom=${true}
                  .placeholder=${'0'}
                  ?disabled=${this.disabled}
                  @value-changed=${(e: CustomEvent) => {
                    e.stopPropagation();
                    this._emit({ ...doc, stagger: { ...stagger, delay: clamp(round3(secondsOf(e.detail.value) ?? 0), 0, 10) } }, 'Change stagger delay');
                  }}
                ></mc-unit-field>`,
              )
            : nothing}
        </section>
        <div class="sr-only" aria-live="polite">${this._announce}</div>
        ${this._menu.isOpen ? this._renderMenu() : nothing}
      </div>
    `;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc') && this._open >= this._steps.length) this._open = -1;
  }

  protected updated(): void {
    if (this._focusSearch && this._menu.isOpen) {
      this._focusSearch = false;
      this.renderRoot.querySelector<HTMLInputElement>('.pick-search input')?.focus({ preventScroll: true });
    }
    const f = this._focusAfter;
    if (f) {
      this._focusAfter = undefined;
      this.renderRoot.querySelector<HTMLElement>(`.step[data-i="${f.index}"] .${f.part}`)?.focus();
    }
  }

  static styles = [
    editorSystem,
    lockBannerStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      :host([disabled]) .steps,
      :host([disabled]) .sched {
        opacity: 0.6;
      }
      .wrap {
        display: grid;
        gap: 0;
      }
      .group + .group {
        margin-top: 20px;
      }
      .group-head .chip {
        flex: none;
      }

      /* ── schedule bar ── */
      .sched {
        display: grid;
        gap: 6px;
      }
      .bar {
        position: relative;
        height: 32px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
      }
      .blk {
        position: absolute;
        top: 4px;
        bottom: 4px;
        min-width: 3px;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text);
        cursor: pointer;
        background-color: color-mix(in srgb, var(--mc-text) 16%, var(--mc-surface));
        /* one segment per play, split by a 2px gap in the track colour */
        background-image: linear-gradient(to right, transparent calc(100% - 2px), var(--mc-surface-2) 0);
        background-size: calc(100% / var(--plays, 1)) 100%;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc-text) 22%, transparent);
        transition: background-color 0.15s ease-out;
      }
      .blk:hover {
        background-color: color-mix(in srgb, var(--mc-text) 26%, var(--mc-surface));
      }
      .blk.is-live {
        background-color: color-mix(in srgb, var(--mc-text) 30%, var(--mc-surface));
      }
      .blk.is-open {
        background-color: var(--mc-accent-fill);
        color: var(--mc-on-accent);
        box-shadow: none;
      }
      .mark {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 6px;
        margin-left: -3px;
        border-radius: 3px;
        cursor: pointer;
        background: repeating-linear-gradient(45deg, var(--mc-error-ink) 0 2px, transparent 2px 4px);
        box-shadow: inset 0 0 0 1px var(--mc-error-ink);
      }
      .playhead {
        position: absolute;
        top: -5px;
        bottom: -5px;
        width: 2px;
        margin-left: -1px;
        background: var(--mc-accent);
        border-radius: 1px;
        pointer-events: none;
      }
      .playhead::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--mc-accent);
      }
      .ruler {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .ruler .loop {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }

      /* ── steps ── */
      .steps {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      .step {
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        min-width: 0;
      }
      .steps.is-sorting .step {
        transition: transform 0.15s ease-out;
      }
      .steps.is-sorting .step.is-dragging {
        transition: none;
        position: relative;
        z-index: 2;
        box-shadow: var(--mc-shadow-float);
      }
      .step.is-bad {
        border-color: color-mix(in srgb, var(--mc-error-ink) 55%, transparent);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 4px;
        min-height: 48px;
      }
      .handle {
        cursor: grab;
        touch-action: none;
      }
      .is-dragging .handle {
        cursor: grabbing;
      }
      .toggle {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 40px;
        padding: 4px 6px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        text-align: left;
      }
      .toggle:hover {
        background: var(--mc-surface-2);
      }
      .toggle:focus-visible {
        outline-offset: -2px;
      }
      .num {
        flex: none;
        display: inline-grid;
        place-items: center;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        border-radius: 9999px;
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .step.is-open .num {
        background: var(--mc-accent-fill);
        border-color: transparent;
        color: var(--mc-on-accent);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: grid;
      }
      .nm {
        font-size: 0.875rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sum {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }
      .sum.error {
        color: var(--mc-error-ink);
      }
      .chev {
        flex: none;
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .toggle[aria-expanded='true'] .chev {
        transform: rotate(180deg);
      }
      .body {
        display: grid;
        gap: 16px;
        padding: 4px 12px 16px;
      }
      .problem {
        padding: 8px 10px;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 128px), 1fr));
        gap: 16px 12px;
      }
      .pick-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: left;
        cursor: pointer;
      }
      .pick-btn .pick-val {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pick-btn > ha-icon {
        flex: none;
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
      }
      .pick-kind {
        color: var(--mc-text-2);
        font-weight: 400;
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 12px;
      }

      /* ── picker menu ── */
      .pick-menu {
        font-size: 0.875rem;
        width: min(320px, calc(100vw - 16px));
        max-height: 420px;
        overflow: auto;
        padding-top: 0;
        align-content: start;
      }
      .pick-search {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--mc-surface);
        padding: 6px 0 4px;
        display: flex;
        align-items: center;
      }
      .pick-search > ha-icon {
        position: absolute;
        left: 10px;
        --mdc-icon-size: 18px;
        color: var(--mc-text-2);
        pointer-events: none;
      }
      .pick-search .input {
        padding-left: 36px;
      }
      .pick-group {
        display: grid;
      }
      .pick-head {
        padding: 10px 12px 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .menu .pick-item {
        gap: 10px;
      }
      .pick-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pick-dur {
        flex: none;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .menu .pick-item.is-current {
        color: var(--mc-accent-ink);
        font-weight: 500;
      }
      .menu .pick-item .pick-check {
        color: var(--mc-accent-ink);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-sequence-editor': AnimSequenceEditor;
  }
}
