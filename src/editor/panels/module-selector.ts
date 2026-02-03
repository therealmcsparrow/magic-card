import { LitElement, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ModuleRegistry } from '../../modules/module-registry';
import { MODULE_CATEGORIES } from '../../utils/constants';
import { MagicModuleMetadata } from '../../modules/module-types';
import { ModuleCategory } from '../../types';
import { moduleSelectorStyles } from './module-selector.styles';

@customElement('mc-module-selector')
export class ModuleSelector extends LitElement {
  static styles = moduleSelectorStyles;

  @state() private _searchQuery = '';

  protected render(): TemplateResult {
    const modules = this._searchQuery
      ? ModuleRegistry.search(this._searchQuery)
      : ModuleRegistry.getAll();

    const grouped = new Map<ModuleCategory, MagicModuleMetadata[]>();
    for (const cat of MODULE_CATEGORIES) {
      const items = modules
        .filter((m) => m.metadata.category === cat)
        .map((m) => m.metadata);
      if (items.length > 0) {
        grouped.set(cat, items);
      }
    }

    return html`
      <div class="mc-selector-overlay" @click=${this._onOverlayClick}>
        <div class="mc-selector-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-selector-header">
            <h3>Add Module</h3>
            <button class="mc-btn-icon" @click=${this._onClose}>&times;</button>
          </div>
          <div style="padding: 8px 16px">
            <input
              class="mc-selector-search"
              type="text"
              placeholder="Search modules..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => {
                this._searchQuery = (e.target as HTMLInputElement).value;
              }}
              autofocus
            />
          </div>
          <div class="mc-selector-body">
            ${Array.from(grouped.entries()).map(
              ([category, items]) => html`
                <div class="mc-selector-category">${category}</div>
                ${items.map(
                  (meta) => html`
                    <div
                      class="mc-selector-item"
                      @click=${() => this._onSelect(meta)}
                    >
                      <div class="mc-selector-item-icon">
                        <ha-icon icon=${meta.icon} style="--mdc-icon-size:20px"></ha-icon>
                      </div>
                      <div class="mc-selector-item-info">
                        <div class="mc-selector-item-name">${meta.name}</div>
                        <div class="mc-selector-item-desc">${meta.description}</div>
                      </div>
                    </div>
                  `,
                )}
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private _onSelect(meta: MagicModuleMetadata): void {
    this.dispatchEvent(
      new CustomEvent('module-selected', {
        bubbles: true,
        composed: true,
        detail: { type: meta.type },
      }),
    );
  }

  private _onClose(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _onOverlayClick(): void {
    this._onClose();
  }
}
