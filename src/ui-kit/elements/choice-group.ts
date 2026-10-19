import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { UI_KIT_CONTRACT_REVISION, type UiChoice } from '../../contracts/ui-kit';
import { rovingTarget } from '../controllers/roving-focus';
import { kitChoiceGroupElementCss } from '../css/elements';

/*
 * Shared body of <mc-ui-tile-group> and <mc-ui-chip-group> (contract ui-kit 1.1.0 r5, flow-slider-styles Marco round 1).
 * MANUAL activation: every choice is a button with aria-pressed inside a role=group, one tab stop (roving tabindex);
 * the arrow keys, Home and End move focus only; Space, Enter or a click fire 'mc-pick'. The host owns `value`, so
 * moving focus never writes anything. `preview` is static SVG markup from a chunk constant (never config text), drawn
 * aria-hidden; the label stays the accessible name. The description line follows the focused choice, else the picked one.
 * Holds no strings.
 */
let uid = 0;

export abstract class UiChoiceGroup extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = [kitChoiceGroupElementCss];

  /** Accessible name of the group. */
  @property() label = '';
  @property({ attribute: false }) items: UiChoice[] = [];
  @property() value?: string;

  @state() private _tab = -1;
  @state() private _focused = '';

  protected abstract readonly gridClass: 'tile-grid' | 'chip-grid';
  private readonly _id = `mc-choice-${++uid}`;

  private get _stop(): number {
    const n = this.items.length;
    if (this._tab >= 0 && this._tab < n) return this._tab;
    const picked = this.items.findIndex((i) => i.value === this.value);
    return picked >= 0 ? picked : 0;
  }

  private _keydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const buttons = Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('button.opt'));
    const cur = buttons.indexOf(e.composedPath()[0] as HTMLButtonElement);
    const to = rovingTarget(e.key, cur, buttons.map(() => ({})), 'both');
    if (to < 0) return;
    e.preventDefault();
    e.stopPropagation();
    this._tab = to;
    buttons[to]?.focus();
  };

  private _pick(value: string): void {
    this.dispatchEvent(new CustomEvent('mc-pick', { detail: { value }, bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    const stop = this._stop;
    const lead = this.items.find((i) => i.value === this._focused) ?? this.items.find((i) => i.value === this.value);
    const descId = `${this._id}-desc`;
    return html`<div class="group" part="group" role="group" aria-label=${this.label}>
      <div class=${this.gridClass} @keydown=${this._keydown}>
        ${this.items.map(
          (it, i) => html`<button
            type="button"
            class="opt"
            part="option"
            data-value=${it.value}
            tabindex=${i === stop ? '0' : '-1'}
            aria-pressed=${it.value === this.value ? 'true' : 'false'}
            aria-describedby=${it.description && lead === it ? descId : nothing}
            @focus=${() => {
              this._focused = it.value;
              this._tab = i;
            }}
            @blur=${() => {
              if (this._focused === it.value) this._focused = '';
            }}
            @click=${() => this._pick(it.value)}
          >
            ${it.preview ? html`<span class="pv" aria-hidden="true">${unsafeHTML(it.preview)}</span>` : nothing}
            <span class="nm">${it.label}</span>
          </button>`,
        )}
      </div>
      ${lead?.description ? html`<p class="desc" id=${descId} part="description">${lead.description}</p>` : nothing}
    </div>`;
  }
}
