import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import { NO_SELECTION, registerPanel, type StudioSelection } from '../slots';
import { DEFAULT_SIM, simAttributes, simNeeds, simNumericState, simulates, type PreviewChangeDetail } from './states-sim';
import { t, m, type MessageId } from '../i18n';

/*
 * Stage tool for documents with states or value bindings: a capsule at the foot of the preview
 * stage that sets the preview's simulated entity. State: On, Off, Unavailable, Value (the state is
 * the slider's number, for bindings and conditions that read the state) or Custom (any text). The
 * value slider runs 0-100 % across each binding's input range. Every change (and the first render,
 * and a document whose bindings changed) emits `preview-change` { state, value, attributes }
 * (bubbling, composed); the shell feeds it to the preview card (states-sim.ts withSimEntity).
 */

type StateChoice = 'on' | 'off' | 'unavailable' | 'value' | 'custom';

const CHOICES: Array<{ id: StateChoice; label: MessageId; numeric?: boolean }> = [
  { id: 'on', label: m('anim-studio.stage-sim.on') },
  { id: 'off', label: m('anim-studio.stage-sim.off') },
  { id: 'unavailable', label: m('anim-studio.stage-sim.unavailable') },
  { id: 'value', label: m('anim-studio.stage-sim.value'), numeric: true },
  { id: 'custom', label: m('anim-studio.stage-sim.custom') },
];

export { simulates };

@customElement('mc-anim-stage-sim')
export class AnimStageSim extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = NO_SELECTION;
  @property({ type: Number }) time = 0;

  @state() private _choice: StateChoice = 'on';
  @state() private _custom = 'idle';
  /** 0..1 across each binding's input range. */
  @state() private _value = DEFAULT_SIM.value;

  private _sent = '';
  /** The user picked a state: a new document does not change it. */
  private _picked = false;

  /** The detail the preview gets now. */
  get detail(): PreviewChangeDetail {
    const s = this._choice === 'value' ? simNumericState(this.doc, this._value) : this._choice === 'custom' ? this._custom.trim() || 'idle' : this._choice;
    return { state: s, value: this._value, attributes: simAttributes(this.doc, this._value) };
  }

  private _emit(): void {
    const d = this.detail;
    const key = JSON.stringify(d);
    if (key === this._sent) return;
    this._sent = key;
    this.dispatchEvent(new CustomEvent<PreviewChangeDetail>('preview-change', { bubbles: true, composed: true, detail: d }));
  }

  protected willUpdate(changed: PropertyValues): void {
    // bindings or conditions that read the state itself: start on Value, so the slider moves them
    if (changed.has('doc') && !this._picked) this._choice = simNeeds(this.doc).numericState ? 'value' : 'on';
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('doc') || changed.has('_choice') || changed.has('_custom') || changed.has('_value')) this._emit();
  }

  private _pick(c: StateChoice): void {
    this._picked = true;
    this._choice = c;
    if (c === 'custom') void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('.custom')?.focus());
  }

  private _states(numeric: boolean): TemplateResult {
    const items = CHOICES.filter((c) => !c.numeric || numeric || this._choice === c.id);
    const onKey = (e: KeyboardEvent) => {
      const i = items.findIndex((x) => x.id === this._choice);
      const map: Record<string, number> = { ArrowRight: (i + 1) % items.length, ArrowLeft: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 };
      const next = map[e.key];
      if (next === undefined) return;
      e.preventDefault();
      this._picked = true;
      this._choice = items[next].id;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.seg [aria-checked="true"]')?.focus());
    };
    return html`<div class="seg" role="radiogroup" aria-label=${t('anim-studio.stage-sim.preview-state')} @keydown=${onKey}>
      ${items.map((c) => {
        const on = c.id === this._choice;
        return html`<button type="button" role="radio" aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} ?disabled=${this.disabled} @click=${() => this._pick(c.id)}>${t(c.label)}</button>`;
      })}
    </div>`;
  }

  protected render(): TemplateResult {
    if (!simulates(this.doc)) return html``;
    const needs = simNeeds(this.doc);
    const pct = Math.round(this._value * 100);
    return html`<div class="bar" role="group" aria-label=${t('anim-studio.stage-sim.preview-entity')}>
      <span class="lbl" aria-hidden="true"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></span>
      ${this._states(needs.numericState)}
      ${this._choice === 'custom'
        ? html`<input
            class="input mono custom"
            type="text"
            aria-label=${t('anim-studio.stage-sim.custom-state')}
            placeholder=${t('anim-studio.stage-sim.state')}
            autocomplete="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            .value=${this._custom}
            @change=${(e: Event) => (this._custom = (e.target as HTMLInputElement).value)}
          />`
        : nothing}
      ${needs.value
        ? html`<label class="value">
            <span class="sr-only">${t('anim-studio.stage-sim.preview-value')}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              ?disabled=${this.disabled}
              .value=${String(pct)}
              aria-valuetext=${t('anim-studio.stage-sim.pct-of-the-input-range', { pct })}
              @input=${(e: Event) => (this._value = Number((e.target as HTMLInputElement).value) / 100)}
            />
            <output aria-hidden="true">${pct}%</output>
          </label>`
        : nothing}
    </div>`;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        display: flex;
        justify-content: center;
        pointer-events: none;
        z-index: 3;
      }
      .bar {
        pointer-events: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        max-width: 100%;
        padding: 6px 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .lbl {
        display: inline-flex;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .custom {
        width: 120px;
        min-height: 32px;
        padding: 4px 8px;
      }
      .value {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
      }
      .value input {
        width: 140px;
        min-height: 24px;
        accent-color: var(--mc-accent);
        margin: 0;
      }
      .value output {
        min-width: 4ch;
        font-size: 0.8125rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        text-align: right;
      }
      input[type='range']:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
    `,
  ];
}

/** Over the stage while the document has states or bindings. */
registerPanel({ tag: 'mc-anim-stage-sim', place: 'stage-tool', when: (doc) => simulates(doc), title: m('anim-studio.stage-sim.preview-entity'), order: 80, dock: 'bottom' });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-stage-sim': AnimStageSim;
  }
}
