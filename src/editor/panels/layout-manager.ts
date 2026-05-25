import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { EditorStateManager } from '../state/editor-state';
import { componentControlStyles, layoutManagerStyles } from '../../css/css';

const LAYOUT_PRESETS = [
  { value: '1', label: 'Full', icon: '[ ]' },
  { value: '1-1', label: '50/50', icon: '[ | ]' },
  { value: '1-2', label: '33/66', icon: '[ | ]' },
  { value: '2-1', label: '66/33', icon: '[ | ]' },
  { value: '1-1-1', label: '33/33/33', icon: '[ | | ]' },
];

@customElement('mc-layout-manager')
export class LayoutManager extends LitElement {
  static styles = [componentControlStyles, layoutManagerStyles];

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
