import { t } from '../../i18n/labels';
import { LitElement, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ModuleRegistry } from '../../modules/module-registry';
import { MODULE_CATEGORIES } from '../../utils/constants';
import { MagicModuleMetadata } from '../../modules/module-types';
import { ModuleCategory } from '../../types';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-system';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from '../components/picker-parts';

type CategoryFilter = 'all' | ModuleCategory;

const CATEGORY_LABELS: Record<string, string> = {
  content: 'Content',
  controls: 'Controls',
  layout: 'Layout',
  advanced: 'Advanced',
};

@customElement('mc-module-selector')
export class ModuleSelector extends LitElement {
  static styles = [editorSystem, pickerStyles];

  private _windowCtrl = new PickerWindowController(this, () => this._onClose());

  @state() private _searchQuery = '';
  @state() private _category: CategoryFilter = 'all';

  protected render(): TemplateResult {
    const modules = this._searchQuery
      ? ModuleRegistry.search(this._searchQuery, t)
      : ModuleRegistry.getAll();

    const grouped = new Map<ModuleCategory, MagicModuleMetadata[]>();
    for (const cat of MODULE_CATEGORIES) {
      if (this._category !== 'all' && this._category !== cat) continue;
      const items = modules
        .filter((m) => m.metadata.category === cat)
        .map((m) => m.metadata);
      if (items.length > 0) {
        grouped.set(cat, items);
      }
    }

    const filters: CategoryFilter[] = ['all', ...MODULE_CATEGORIES];

    return html`
      ${renderPickerWindow('Add module', () => this._onClose(), 'm', html`
          <div class="mc-picker-search">
            ${renderPickerSearch('Search modules', this._searchQuery, (v) => { this._searchQuery = v; })}
            <div class="seg full" role="radiogroup" aria-label="Module category">
              ${filters.map(
                (f) => html`
                  <button
                    type="button"
                    role="radio"
                    aria-checked=${this._category === f ? 'true' : 'false'}
                    @click=${() => { this._category = f; }}
                  >
                    ${f === 'all' ? 'All' : CATEGORY_LABELS[f] ?? f}
                  </button>
                `,
              )}
            </div>
          </div>
          <div class="mc-picker-list">
            ${grouped.size === 0 ? html`
              <div class="mc-picker-empty">
                ${this._searchQuery ? `No modules match "${this._searchQuery}".` : 'No modules in this category.'}
              </div>
            ` : Array.from(grouped.entries()).map(
              ([category, items]) => html`
                ${this._category === 'all'
                  ? html`<div class="mc-picker-category">${CATEGORY_LABELS[category] ?? category}</div>`
                  : ''}
                ${items.map(
                  (meta) => html`
                    <button
                      type="button"
                      class="mc-picker-item"
                      @click=${() => this._onSelect(meta)}
                      aria-label=${`Add ${t(meta.name)} module`}
                    >
                      <span class="mc-picker-item-icon"><ha-icon icon=${meta.icon}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${t(meta.name)}</span>
                        <span class="mc-picker-item-desc">${t(meta.description)}</span>
                      </span>
                    </button>
                  `,
                )}
              `,
            )}
          </div>
      `)}
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
    this.dispatchEvent(new CustomEvent('mc-picker-close', { bubbles: true, composed: true }));
  }

}
