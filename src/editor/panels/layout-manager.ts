import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EditorStateManager } from '../state/editor-state';

const LAYOUT_PRESETS = [
  { value: '1', label: 'Full', icon: '[ ]' },
  { value: '1-1', label: '50/50', icon: '[ | ]' },
  { value: '1-2', label: '33/66', icon: '[ | ]' },
  { value: '2-1', label: '66/33', icon: '[ | ]' },
  { value: '1-1-1', label: '33/33/33', icon: '[ | | ]' },
];

@customElement('mc-layout-manager')
export class LayoutManager extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-layout-presets {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
      padding: 8px 0;
    }

    .mc-layout-preset {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 0.75rem;
    }

    .mc-layout-preset:hover {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-layout-preset.active {
      border-color: var(--primary-color, #6366f1);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    }

    .mc-layout-preview {
      display: flex;
      gap: 2px;
      height: 20px;
      width: 100%;
    }

    .mc-layout-col {
      background: var(--primary-color, #6366f1);
      opacity: 0.3;
      border-radius: 2px;
      flex: 1;
    }
  `;

  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ type: Number }) rowIndex = 0;
  @property({ type: String }) currentLayout = '1';

  protected render(): TemplateResult {
    return html`
      <div class="mc-layout-presets">
        ${LAYOUT_PRESETS.map(
          (preset) => html`
            <div
              class="mc-layout-preset ${this.currentLayout === preset.value ? 'active' : ''}"
              @click=${() => this._selectLayout(preset.value)}
            >
              <div class="mc-layout-preview">
                ${preset.value.split('-').map(
                  (fr) => html`<div class="mc-layout-col" style="flex:${fr}"></div>`,
                )}
              </div>
              <span>${preset.label}</span>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _selectLayout(layout: string): void {
    this.stateManager?.updateRow(this.rowIndex, { layout });
  }
}
