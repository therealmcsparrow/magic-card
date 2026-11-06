import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { HomeAssistant } from '../../types';
import type { AnimationDoc } from '../model';
import type { Clip } from '../model-v2-core';
import { NO_SELECTION, registerPanel, type StudioSelection } from '../slots';
import {
  CLIPS_MAX,
  TRANSITIONS,
  WHEN_KINDS,
  canAddClip,
  clipAnimationLabel,
  clipOptions,
  clipProblem,
  moveClip,
  newClip,
  whenKind,
  whenOf,
  whenValue,
  type WhenKind,
} from './states-utils';
import { whenLabel } from './states-sim';
import { t, m } from '../i18n';
import { readDirection } from '../../ui-kit/controllers/direction';

// States (studio inspector, nothing selected): the document clips as condition cards (When, Play, Transition), reordered
// by arrows (first match plays), deleted, added up to 12. `.doc` is never mutated: edits emit `doc-change`.

@customElement('mc-anim-states-panel')
export class AnimStatesPanel extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = NO_SELECTION;
  @property({ attribute: false }) tile?: string;

  @state() private _announce = '';
  private _focusAfter?: string;

  private get _clips(): Clip[] {
    return Array.isArray(this.doc?.clips) ? this.doc!.clips : [];
  }

  private _write(clips: Clip[], label: string): void {
    if (!this.doc) return;
    const doc = { ...this.doc };
    if (clips.length) doc.clips = clips;
    else delete doc.clips;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  private _patch(i: number, patch: Partial<Clip>, label: string): void {
    this._write(
      this._clips.map((c, j) => (j === i ? { ...c, ...patch } : c)),
      label,
    );
  }

  private _add(): void {
    if (!canAddClip(this._clips)) return;
    const clip = newClip(this._clips);
    this._write([...this._clips, clip], 'Add state');
    this._focusAfter = `.clip[data-i="${this._clips.length}"] select.when`;
    this._announce = t('anim-studio.states-panel.state-count-added-when', { count: this._clips.length + 1, when: whenLabel(clip.when) });
  }

  private _remove(i: number): void {
    const clips = this._clips.filter((_c, j) => j !== i);
    this._write(clips, 'Delete state');
    this._focusAfter = clips.length ? `.clip[data-i="${Math.min(i, clips.length - 1)}"] .del` : '.add';
    this._announce = t('anim-studio.states-panel.state-i-deleted', { i: i + 1 });
  }

  private _move(i: number, to: number): void {
    if (to < 0 || to >= this._clips.length) return;
    this._write(moveClip(this._clips, i, to), 'Reorder states');
    this._focusAfter = `.clip[data-i="${to}"] .${to < i ? 'up' : 'down'}`;
    this._announce = t('anim-studio.states-panel.state-moved-to-position-to', { to: to + 1 });
  }

  protected updated(): void {
    const sel = this._focusAfter;
    if (!sel) return;
    this._focusAfter = undefined;
    const el = this.renderRoot.querySelector<HTMLElement>(sel);
    (el && !(el as HTMLButtonElement).disabled ? el : this.renderRoot.querySelector<HTMLElement>('.add'))?.focus();
  }

  private _when(c: Clip, i: number): TemplateResult {
    const kind = whenKind(c.when);
    const value = whenValue(c.when);
    const id = `st-${i}`;
    const numeric = kind === 'above' || kind === 'below';
    return html`<div class="pair">
      <div class="field">
        <div class="field-head"><label for="${id}-k">${t('anim-studio.states-panel.when')}</label></div>
        <div class="select">
          <select
            class="input when"
            id="${id}-k"
            ?disabled=${this.disabled}
            @change=${(e: Event) => this._patch(i, { when: whenOf((e.target as HTMLSelectElement).value as WhenKind, value) }, 'Change state condition')}
          >
            ${WHEN_KINDS.map((k) => html`<option value=${k.id} ?selected=${k.id === kind}>${t(k.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
      ${kind === 'entity_on' || kind === 'entity_off'
        ? html`<div class="field"><div class="field-head"><span class="lbl">${t('anim-studio.states-panel.value')}</span></div><p class="help fill">${t('anim-studio.states-panel.on-means-active-for-its-domain-open-home')}</p></div>`
        : html`<div class="field">
            <div class="field-head"><label for="${id}-v">${numeric ? t('anim-studio.states-panel.number') : t('anim-studio.states-panel.state')}</label></div>
            <input
              class="input ${numeric ? '' : 'mono'}"
              id="${id}-v"
              type=${numeric ? 'number' : 'text'}
              step="any"
              inputmode=${numeric ? 'decimal' : 'text'}
              placeholder=${numeric ? '0' : t('anim-studio.states-panel.on')}
              autocomplete="off"
              spellcheck="false"
              ?disabled=${this.disabled}
              .value=${value}
              @change=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                if (numeric && (v.trim() === '' || !Number.isFinite(Number(v)))) {
                  (e.target as HTMLInputElement).value = value;
                  return;
                }
                this._patch(i, { when: whenOf(kind, v) }, 'Change state value');
              }}
            />
          </div>`}
    </div>`;
  }

  private _play(c: Clip, i: number): TemplateResult {
    const id = `st-${i}-a`;
    const groups = clipOptions(this.library, this.doc?.id);
    const known = groups.some((g) => g.items.some((x) => x.value === c.animation));
    return html`<div class="field">
      <div class="field-head"><label for=${id}>${t('anim-studio.states-panel.play')}</label></div>
      <div class="select">
        <select class="input play" id=${id} ?disabled=${this.disabled} @change=${(e: Event) => this._patch(i, { animation: (e.target as HTMLSelectElement).value }, 'Change state animation')}>
          ${known ? nothing : html`<option value=${c.animation} selected>${clipAnimationLabel(c.animation, this.library, this.doc?.id)}</option>`}
          ${groups.map(
            (g) => html`<optgroup label=${g.label}>
              ${g.items.map((x) => html`<option value=${x.value} ?selected=${x.value === c.animation}>${x.label}</option>`)}
            </optgroup>`,
          )}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`;
  }

  private _transition(c: Clip, i: number): TemplateResult {
    const value = c.transition ?? 'cut';
    const pick = (v: NonNullable<Clip['transition']>) => {
      if (v !== value) this._patch(i, { transition: v }, 'Change state transition');
    };
    const onKey = (e: KeyboardEvent) => {
      const at = TRANSITIONS.findIndex((x) => x.id === value);
      const rtl = readDirection(e.currentTarget as Element) === 'rtl';
      const map: Record<string, number> = { [rtl ? 'ArrowLeft' : 'ArrowRight']: (at + 1) % TRANSITIONS.length, [rtl ? 'ArrowRight' : 'ArrowLeft']: (at - 1 + TRANSITIONS.length) % TRANSITIONS.length, Home: 0, End: TRANSITIONS.length - 1 };
      const next = map[e.key];
      if (next === undefined) return;
      e.preventDefault();
      pick(TRANSITIONS[next].id);
      this._focusAfter = `.clip[data-i="${i}"] .seg [aria-checked="true"]`;
    };
    const hintOf = (TRANSITIONS.find((x) => x.id === value) ?? TRANSITIONS[0]).hint;
    return html`<div class="field">
      <div class="field-head"><span class="lbl" id="st-${i}-t">${t('anim-studio.states-panel.transition')}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="st-${i}-t" aria-describedby="st-${i}-th" @keydown=${onKey}>
        ${TRANSITIONS.map((x) => {
          const on = x.id === value;
          return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} ?disabled=${this.disabled} @click=${() => pick(x.id)}>
            ${t(x.label)}
          </button>`;
        })}
      </div>
      <p class="help" id="st-${i}-th">${t(hintOf)}.</p>
    </div>`;
  }

  private _clip(c: Clip, i: number, n: number): TemplateResult {
    const problem = clipProblem(c, this.library, this.doc?.id);
    return html`<li class="cond clip" data-i=${i}>
      <div class="cond-head">
        <span class="n">${t('anim-studio.states-panel.state-i', { i: i + 1 })} <span class="sub">· ${whenLabel(c.when)}</span></span>
        <button type="button" class="icon-btn sm up" aria-label=${t('anim-studio.states-panel.move-state-i-up', { i: i + 1 })} title=${t('anim-studio.states-panel.move-up')} ?disabled=${this.disabled || i === 0} @click=${() => this._move(i, i - 1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm down" aria-label=${t('anim-studio.states-panel.move-state-i-down', { i: i + 1 })} title=${t('anim-studio.states-panel.move-down')} ?disabled=${this.disabled || i === n - 1} @click=${() => this._move(i, i + 1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm danger del" aria-label=${t('anim-studio.states-panel.delete-state-i', { i: i + 1 })} title=${t('anim-studio.states-panel.delete-state')} ?disabled=${this.disabled} @click=${() => this._remove(i)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${problem ? html`<p class="help error">${problem}</p>` : nothing}
      ${this._when(c, i)} ${this._play(c, i)} ${this._transition(c, i)}
    </li>`;
  }

  protected render(): TemplateResult {
    const clips = this._clips;
    const full = !canAddClip(clips);
    return html`
      <div class="wrap">
        <p class="help lead">
          ${clips.length
            ? t('anim-studio.states-panel.the-first-state-that-matches-plays-with')
            : t('anim-studio.states-panel.play-something-else-per-entity-state-a')}
        </p>
        ${clips.length ? html`<ol class="clips">${clips.map((c, i) => this._clip(c, i, clips.length))}</ol>` : nothing}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled || full} @click=${() => this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${t('anim-studio.states-panel.add-state')}
          </button>
          ${full ? html`<span class="help">${t('anim-studio.states-panel.at-most-clips-max-states', { cLIPS_MAX: CLIPS_MAX })}</span>` : nothing}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .help.lead {
        margin: 0;
      }
      .clips {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }
      .pair {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
      }
      .help.fill {
        margin: 0;
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      .help.error {
        margin: 0;
      }
      .seg.full button {
        flex: 1;
        min-width: 0;
        padding: 0 6px;
        white-space: nowrap;
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .foot .help {
        margin: 0;
      }
    `,
  ];
}

/** Nothing selected: the States section of the inspector. */
registerPanel({ tag: 'mc-anim-states-panel', place: 'inspector', when: (_doc, sel) => sel.kind === 'none', title: m('anim-studio.states-panel.states'), order: 60 });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-states-panel': AnimStatesPanel;
  }
}
