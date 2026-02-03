import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-icon-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      flex-shrink: 0;
      color: var(--primary-color, #6366f1);
    }

    .mc-icon-input {
      flex: 1;
      padding: 6px 10px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.8125rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
    }

    .mc-icon-input:focus {
      border-color: var(--primary-color, #6366f1);
    }
  `;

  @property({ type: String }) value = '';

  protected render(): TemplateResult {
    return html`
      <div class="mc-icon-preview">
        ${this.value
          ? html`<ha-icon icon=${this.value} style="--mdc-icon-size:20px"></ha-icon>`
          : html`<ha-icon icon="mdi:help" style="--mdc-icon-size:20px;opacity:0.3"></ha-icon>`}
      </div>
      <input
        class="mc-icon-input"
        type="text"
        .value=${this.value}
        placeholder="mdi:icon-name"
        @input=${(e: InputEvent) => {
          this.dispatchEvent(
            new CustomEvent('value-changed', {
              bubbles: true,
              composed: true,
              detail: { value: (e.target as HTMLInputElement).value },
            }),
          );
        }}
      />
    `;
  }
}
