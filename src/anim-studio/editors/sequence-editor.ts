import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { UiPopoverElement } from '../../contracts/ui-kit';
import '../kit';
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
import { t } from '../i18n';

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

  /** What the step picker (the kit popover) is open for; null while it is closed. */
  @state() private _pick: PickTarget | null = null;
  private _focusAfter?: { index: number; part: 'handle' | 'toggle' };
  private _trigger: HTMLElement | null = null;
  private _focusSearch = false;

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
    this._announce = t('anim-studio.sequence-editor.step-count-added-name', { count: steps.length, name: stepInfo(animation, this.library, this.doc?.id).name });
  }

  /** A locked step cannot be moved, deleted or edited; says so in the live region. */
  private _locked(i: number, say = false): boolean {
    const on = !!this.layerView?.locked.includes(`step:${i}`);
    if (on && say) this._announce = t('anim-studio.sequence-editor.step-i-is-locked-unlock-it-in-layers', { i: i + 1 });
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
    this._announce = t('anim-studio.sequence-editor.step-index-deleted', { index: index + 1 });
  }

  /** Move step `from` to `to` (keyboard or a finished drag): one edit. */
  private _move(from: number, to: number, focus: 'handle' | 'toggle' = 'handle'): void {
    const n = this._steps.length;
    if (from === to || to < 0 || to >= n || this._locked(from, true)) return;
    this._open = this._followMove(this._open, from, to);
    this._focusAfter = { index: to, part: focus };
    this._writeSteps(moveItem(this._steps, from, to), 'Move step');
    this._remap((v) => remapStepKeys(v, from, to));
    this._announce = t('anim-studio.sequence-editor.step-moved-to-position-to-of-n', { to: to + 1, n });
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
      this._announce = t('anim-studio.sequence-editor.step-moved-to-position-to-of-count', { to: d.to + 1, count: d.steps.length });
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

  private _popover(): UiPopoverElement | null {
    return this.renderRoot.querySelector<UiPopoverElement>('mc-ui-popover.pick-pop');
  }

  private _openPicker(e: Event, target: PickTarget): void {
    if (this.disabled) return;
    const trigger = e.currentTarget as HTMLElement;
    if (this._pick && this._trigger === trigger) {
      this._popover()?.close('action');
      return;
    }
    this._trigger = trigger;
    this._pick = target;
    this._query = '';
    this._focusSearch = true;
  }

  private _choose(value: string): void {
    const target = this._pick;
    this._popover()?.close('action');
    this._pick = null;
    if (!target) return;
    if (target.mode === 'add') this._addStep(value);
    else if (this._steps[target.index]?.animation !== value) this._patchStep(target.index, { animation: value }, 'Change step animation');
  }

  /** Arrows between the search field and the animations; Home and End inside the list (in the field they move the caret). */
  private _onPickKey(e: KeyboardEvent): void {
    const inField = (e.target as HTMLElement).tagName === 'INPUT';
    if (inField && (e.key === 'Home' || e.key === 'End')) return;
    const items = [...this.renderRoot.querySelectorAll<HTMLElement>('.pick-pop [role="menuitem"]')];
    const field = this.renderRoot.querySelector<HTMLElement>('.pick-pop .pick-search input');
    const at = items.indexOf(e.target as HTMLElement);
    const go = (el: HTMLElement | null | undefined): void => {
      if (!el) return;
      e.preventDefault();
      el.focus();
    };
    if (e.key === 'ArrowDown') go(inField ? items[0] : items[Math.min(items.length - 1, at + 1)]);
    else if (e.key === 'ArrowUp') go(at <= 0 ? field : items[at - 1]);
    else if (e.key === 'Home') go(items[0]);
    else if (e.key === 'End') go(items[items.length - 1]);
  }

  private _renderPicker(): TemplateResult {
    const target = this._pick;
    const current = target?.mode === 'step' ? this._steps[target.index]?.animation : undefined;
    const groups = stepPickerGroups(this.library, this.doc?.id, this._query);
    const name = target?.mode === 'add' ? t('anim-studio.sequence-editor.add-step') : t('anim-studio.sequence-editor.step-animation');
    return html`
      <mc-ui-popover
        class="pick-pop"
        label=${name}
        .anchor=${this._trigger}
        @mc-popover-close=${(e: Event) => {
          e.stopPropagation();
          this._pick = null;
          this._query = '';
        }}
      >
        <div class="pick" @keydown=${(e: KeyboardEvent) => this._onPickKey(e)}>
          <div class="pick-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${t('anim-studio.sequence-editor.search-animations')}
              aria-label=${t('anim-studio.sequence-editor.search-animations')}
              autocomplete="off"
              .value=${this._query}
              @input=${(e: InputEvent) => (this._query = (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pick-list" role="menu" aria-label=${name}>
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
              : html`<p class="menu-note">${t('anim-studio.sequence-editor.no-animation-matches-query', { query: this._query })}</p>`}
          </div>
        </div>
      </mc-ui-popover>
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
      ? t('anim-studio.sequence-editor.steps-total-per-cycle-loop-skipped', {
          steps: t('anim-studio.sequence-editor.count', { count: n }),
          total: formatSeconds(total),
          loop: loop ? t('anim-studio.sequence-editor.loops') : t('anim-studio.sequence-editor.plays-once'),
          skipped: skipped ? t('anim-studio.sequence-editor.count-skipped', { count: skipped }) : '',
        })
      : t('anim-studio.sequence-editor.nothing-plays-yet');
    return html`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${tl.entries.map((e) => {
            if (e.status !== 'ok') {
              const k = marks.get(e.start) ?? 0;
              marks.set(e.start, k + 1);
              return html`<span class="mark" style="left:calc(${pct(e.start)}% + ${k * 8}px)" title=${t('anim-studio.sequence-editor.step-index-is-skipped', { index: e.index + 1 })} @click=${() => this._reveal(e.index)}></span>`;
            }
            const cls = ['blk', e.index === open ? 'is-open' : '', e.index === live ? 'is-live' : ''].join(' ');
            const w = pct(e.end - e.start);
            return html`<span
              class=${cls}
              style="left:${pct(e.start)}%;width:${w}%;--plays:${e.repeat}"
              title=${t('anim-studio.sequence-editor.step-index-from-to-to', { index: e.index + 1, from: formatSeconds(e.start), to: formatSeconds(e.end) })}
              @click=${() => this._reveal(e.index)}
              >${w >= 6 ? e.index + 1 : ''}</span
            >`;
          })}
          ${total ? html`<span class="playhead" style="left:${clamp(this.time, 0, 1) * 100}%"></span>` : nothing}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${loop ? html`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>${t('anim-studio.sequence-editor.loops-2')}</span>` : nothing}
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
    const summary = bad ? (info.status === 'missing' ? t('anim-studio.sequence-editor.not-found') : t('anim-studio.sequence-editor.cannot-play')) : stepSummary(step, info);
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
            aria-label=${t('anim-studio.sequence-editor.move-step-i', { i: i + 1 })}
            aria-describedby="seq-move-hint"
            title=${t('anim-studio.sequence-editor.drag-to-reorder-alt-up-alt-down')}
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
            aria-label=${t('anim-studio.sequence-editor.delete-step-i', { i: i + 1 })}
            title=${n <= 1 ? t('anim-studio.sequence-editor.a-sequence-needs-at-least-one-step') : t('anim-studio.sequence-editor.delete-step')}
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
                t('anim-studio.sequence-editor.animation'),
                html`<button
                  type="button"
                  class="input pick-btn"
                  id=${id('anim')}
                  aria-haspopup="menu"
                  aria-expanded=${this._pick?.mode === 'step' && this._pick.index === i ? 'true' : 'false'}
                  ?disabled=${this.disabled || lock}
                  @click=${(e: Event) => this._openPicker(e, { mode: 'step', index: i })}
                >
                  <span class="pick-val">${info.name}${info.kind && info.kind !== t('anim-studio.sequence-editor.preset') ? html`<span class="pick-kind"> · ${info.kind}</span>` : nothing}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,
                id('anim'),
              )}
              <div class="fields">
                ${this._field(
                  t('anim-studio.sequence-editor.delay'),
                  html`<mc-unit-field
                    .value=${step.delay ? `${round3(step.delay)}s` : ''}
                    .label=${t('anim-studio.sequence-editor.delay')}
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
                  t('anim-studio.sequence-editor.duration'),
                  html`<mc-unit-field
                    .value=${step.duration !== undefined ? `${round3(step.duration)}s` : ''}
                    .label=${t('anim-studio.sequence-editor.duration')}
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
                  t('anim-studio.sequence-editor.plays'),
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
              <p class="help">${placeholder ? t("anim-studio.sequence-editor.delay-counts-from-the-end-of-the", { seconds: placeholder }) : t("anim-studio.sequence-editor.delay-counts-from-the-end-of-the-2")}</p>
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
        <section class="group" aria-label=${t('anim-studio.sequence-editor.schedule')}>${this._renderSchedule(tl)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">${t('anim-studio.sequence-editor.play-order')}</h3>
            <span class="chip is-count" title=${t('anim-studio.sequence-editor.at-most-steps-steps', { steps: ANIMATION_CAPS.steps })}>${steps.length} / ${ANIMATION_CAPS.steps}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">${t('anim-studio.sequence-editor.drag-or-press-alt-up-or-alt-down-to-move')}</p>
          ${steps.length
            ? html`<ol class="steps ${this._drag ? 'is-sorting' : ''}">${steps.map((s, i) => this._renderStep(s, i, steps.length))}</ol>`
            : html`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>${t('anim-studio.sequence-editor.no-steps-yet')}</strong>
                <p>${t('anim-studio.sequence-editor.add-the-animations-to-play-one-after')}</p>
              </div>`}
          <div class="foot">
            <button
              type="button"
              class="btn btn-text btn-sm add"
              aria-haspopup="menu"
              aria-expanded=${this._pick?.mode === 'add' ? 'true' : 'false'}
              ?disabled=${this.disabled || full}
              @click=${(e: Event) => this._openPicker(e, { mode: 'add' })}
            >
              <ha-icon icon="mdi:plus"></ha-icon>${t('anim-studio.sequence-editor.add-step')}
            </button>
            ${full ? html`<span class="help">${t('anim-studio.sequence-editor.a-sequence-has-at-most-steps-steps', { steps: ANIMATION_CAPS.steps })}</span>` : nothing}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">${t('anim-studio.sequence-editor.playback')}</h3></div>
          <div class="switch-row">
            <div class="txt">
              ${t('anim-studio.sequence-editor.loop')}
              <p class="help">${t('anim-studio.sequence-editor.start-again-after-the-last-step')}</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${loop ? 'true' : 'false'}
              aria-label=${t('anim-studio.sequence-editor.loop')}
              ?disabled=${this.disabled}
              @click=${() => this._emit({ ...doc, loop: !loop }, loop ? t('anim-studio.sequence-editor.loop-off') : t('anim-studio.sequence-editor.loop-on'))}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              ${t('anim-studio.sequence-editor.stagger-children')}
              <p class="help">${t("anim-studio.sequence-editor.play-on-a-row-s-columns-or-a-column-s")}</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${stagger.children ? 'true' : 'false'}
              aria-label=${t('anim-studio.sequence-editor.stagger-children')}
              ?disabled=${this.disabled}
              @click=${() => this._emit({ ...doc, stagger: { ...stagger, children: !stagger.children } }, stagger.children ? t('anim-studio.sequence-editor.stagger-off') : t('anim-studio.sequence-editor.stagger-on'))}
            ></button>
          </div>
          ${stagger.children
            ? this._field(
                t('anim-studio.sequence-editor.delay-between-children'),
                html`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${round3(stagger.delay)}s`}
                  .label=${t('anim-studio.sequence-editor.delay-between-children')}
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
        ${this._pick ? this._renderPicker() : nothing}
      </div>
    `;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc') && this._open >= this._steps.length) this._open = -1;
  }

  protected updated(): void {
    const pop = this._pick ? this._popover() : null;
    if (pop && !pop.open) {
      pop.anchor = this._trigger!;
      pop.show();
    }
    if (this._focusSearch && pop) {
      this._focusSearch = false;
      void (pop as unknown as { updateComplete: Promise<unknown> }).updateComplete.then(() =>
        this.renderRoot.querySelector<HTMLInputElement>('.pick-pop .pick-search input')?.focus({ preventScroll: true }),
      );
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

      /* ── step picker (the kit popover) ── */
      .pick {
        display: grid;
        width: min(320px, calc(100vw - 40px));
        font-size: 0.875rem;
      }
      .pick-search {
        position: relative;
        display: flex;
        align-items: center;
        padding-bottom: 6px;
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
      .pick-list {
        display: grid;
        align-content: start;
        max-height: min(340px, 50vh);
        overflow: auto;
        overscroll-behavior: contain;
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
      .pick-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: var(--mc-hit, 40px);
        padding: 0 12px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .pick-item:hover,
      .pick-item:focus-visible {
        background: var(--mc-surface-2);
      }
      .pick-item:focus-visible {
        outline: 2px solid var(--mc-focus, var(--mc-accent));
        outline-offset: -2px;
      }
      .menu-note {
        margin: 0;
        padding: 8px 12px;
        color: var(--mc-text-2);
        font-size: 0.8125rem;
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
      .pick-item.is-current {
        color: var(--mc-accent-ink);
        font-weight: 500;
      }
      .pick-item .pick-check {
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
