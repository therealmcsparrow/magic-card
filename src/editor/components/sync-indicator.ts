import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';

@customElement('mc-sync-indicator')
export class SyncIndicator extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        flex: none;
      }
    `,
  ];

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
          class="sync"
          type="button"
          title="Synced with the template. Click to keep a local value that won't sync."
          @click=${this._handleClick}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon><span class="sr-only">Synced with template</span>
        </button>
      `;
    }

    return html`
      <button
        class="sync is-over"
        type="button"
        title="Overridden locally. Click to re-sync from the template."
        @click=${this._handleClick}
      >
        <ha-icon icon="mdi:link-variant-off"></ha-icon>
        Overridden
      </button>
    `;
  }
}
