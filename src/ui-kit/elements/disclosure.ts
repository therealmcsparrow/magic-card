import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION } from '../../contracts/ui-kit';
import { kitDisclosureElementCss } from '../css/elements';

/*
 * <mc-ui-disclosure> (contract ui-kit 1.1.0 r5): a collapsible section. The heading wraps one button
 * (aria-expanded, aria-controls); the summary is inside the button, so it is part of the accessible name. `open` is
 * settable (an inspector that owns the state sets it again after 'mc-toggle'); the body stays in the DOM, hidden.
 * Holds no strings: heading and summary come from the caller.
 */
let uid = 0;

export class UiDisclosure extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = [kitDisclosureElementCss];

  @property() heading = '';
  @property() summary?: string;
  @property({ type: Boolean, reflect: true }) open = false;
  /** Heading level, 2 to 6. */
  @property({ type: Number }) level = 3;

  private readonly _id = `mc-disc-${++uid}`;

  private _toggle = (): void => {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('mc-toggle', { detail: { open: this.open }, bubbles: true, composed: true }));
  };

  protected render(): TemplateResult {
    const level = Math.min(6, Math.max(2, Math.round(this.level) || 3));
    return html`<div class="head" role="heading" aria-level=${level}>
        <button type="button" class="btn" part="button" id=${this._id} aria-expanded=${this.open ? 'true' : 'false'} aria-controls="${this._id}-body" @click=${this._toggle}>
          <span class="title">${this.heading}</span>
          ${this.summary ? html`<span class="sum">${this.summary}</span>` : nothing}
          <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" /></svg>
        </button>
      </div>
      <div class="body" part="body" id="${this._id}-body" role="region" aria-labelledby=${this._id} ?hidden=${!this.open}><slot></slot></div>`;
  }
}
