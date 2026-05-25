import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { syncIndicatorStyles } from '../../css/css';

@customElement('mc-sync-indicator')
export class SyncIndicator extends LitElement {
  static styles = syncIndicatorStyles;

  @property({ type: Boolean }) synced = false;
  @property({ type: Boolean }) hasTemplate = false;
  @property({ type: String }) propertyPath = '';
  @property({ type: Boolean }) hideIfNoTemplate = false;

  private _handleClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent('sync-toggle', {
      detail: {
        synced: this.synced,
        propertyPath: this.propertyPath,
      },
      bubbles: true,
      composed: true,
    }));
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hasTemplate) {
      return this.hideIfNoTemplate ? nothing : html``;
    }

    if (this.synced) {
      return html`
        <button
          class="mc-sync-btn synced"
          type="button"
          title="Synced with template '${this.hasTemplate}'. Click to make local changes that won't sync."
          @click=${this._handleClick}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      `;
    }

    return html`
      <button
        class="mc-sync-btn not-synced"
        type="button"
        title="Not synced - has local changes. Click to re-sync from template."
        @click=${this._handleClick}
      >
        <ha-icon icon="mdi:link-variant-off"></ha-icon>
      </button>
    `;
  }
}
