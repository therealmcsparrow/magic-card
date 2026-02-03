import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('mc-color-picker')
export class ColorPicker extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-color-swatch {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 2px solid var(--divider-color, #e5e7eb);
      cursor: pointer;
      overflow: hidden;
      flex-shrink: 0;
    }

    .mc-color-swatch input[type='color'] {
      width: 48px;
      height: 48px;
      border: none;
      padding: 0;
      cursor: pointer;
      margin: -8px;
    }

    .mc-color-text {
      flex: 1;
      padding: 6px 10px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.8125rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
    }

    .mc-color-text:focus {
      border-color: var(--primary-color, #6366f1);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

  protected render(): TemplateResult {
    const isHex = /^#[0-9a-f]{6}$/i.test(this.value);

    return html`
      <div class="mc-color-swatch" style="background: ${this.value || '#ffffff'}">
        <input
          type="color"
          .value=${isHex ? this.value : '#ffffff'}
          @input=${(e: InputEvent) => this._onChange((e.target as HTMLInputElement).value)}
        />
      </div>
      <input
        class="mc-color-text"
        type="text"
        .value=${this.value}
        placeholder=${this.label || 'Color value'}
        @input=${(e: InputEvent) => this._onChange((e.target as HTMLInputElement).value)}
      />
    `;
  }

  private _onChange(value: string): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  }
}
