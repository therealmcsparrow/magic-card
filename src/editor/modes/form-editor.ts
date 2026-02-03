import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MagicCardConfig, EditorState, EditorPath } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';
import { formEditorStyles } from './form-editor.styles';
import { renderTextField, renderSelectField } from '../../utils/form-utils';

@customElement('mc-form-editor')
export class FormEditor extends LitElement {
  static styles = [editorStyles, formEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  @state() private _expandedSections = new Set<string>(['card']);

  private _unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager) {
      this._unsubscribe = this.stateManager.subscribe((s) => {
        this._editorState = s;
      });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
  }

  protected render(): TemplateResult {
    if (!this._editorState) return html``;
    const { config, selectedPath } = this._editorState;

    return html`
      <div class="mc-form">
        ${this._renderCardSection(config)}
        ${config.rows.map((row, ri) => this._renderRow(row, ri, selectedPath))}
      </div>
    `;
  }

  private _renderCardSection(config: MagicCardConfig): TemplateResult {
    const expanded = this._expandedSections.has('card');
    return html`
      <div class="mc-card-section">
        <div
          class="mc-card-section-header"
          @click=${() => this._toggleSection('card')}
        >
          <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px"></ha-icon>
          Card Settings
          <span class="mc-chevron ${expanded ? 'open' : ''}">&#9654;</span>
        </div>
        ${expanded
          ? html`
              <div class="mc-card-section-body">
                ${renderTextField('Background', config.background, (v) =>
                  this.stateManager.updateConfig({ ...config, background: v }),
                )}
                ${renderTextField('Border Radius', config.border_radius, (v) =>
                  this.stateManager.updateConfig({ ...config, border_radius: v }),
                )}
                ${renderTextField('Padding', config.padding, (v) =>
                  this.stateManager.updateConfig({ ...config, padding: v }),
                )}
                ${renderTextField('Box Shadow', config.box_shadow, (v) =>
                  this.stateManager.updateConfig({ ...config, box_shadow: v }),
                )}
                ${renderTextField('Card Height', config.card_height, (v) =>
                  this.stateManager.updateConfig({ ...config, card_height: v }),
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderRow(
    row: import('../../types').RowConfig,
    ri: number,
    selectedPath: EditorPath | null,
  ): TemplateResult {
    return html`
      <div class="mc-row-item">
        <div class="mc-row-header">
          <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          <span class="mc-label">Row ${ri + 1}</span>
          ${renderSelectField('', row.layout, [
            { label: '1 Col', value: '1' },
            { label: '1-1', value: '1-1' },
            { label: '1-2', value: '1-2' },
            { label: '2-1', value: '2-1' },
            { label: '1-1-1', value: '1-1-1' },
          ], (v) => this.stateManager.updateRow(ri, { layout: v }))}
          <button
            class="mc-btn-icon"
            @click=${() => this.stateManager.deleteRow(ri)}
            title="Delete row"
          >
            &times;
          </button>
        </div>
        <div class="mc-row-body">
          ${row.columns.map((col, ci) => this._renderColumn(col, ri, ci, selectedPath))}
        </div>
      </div>
    `;
  }

  private _renderColumn(
    col: import('../../types').ColumnConfig,
    ri: number,
    ci: number,
    selectedPath: EditorPath | null,
  ): TemplateResult {
    return html`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <span class="mc-label">Column ${ci + 1}</span>
        </div>
        ${col.modules.map((mod, mi) => {
          const isSelected =
            selectedPath?.rowIndex === ri &&
            selectedPath?.columnIndex === ci &&
            selectedPath?.moduleIndex === mi;

          const handler = ModuleRegistry.get(mod.type);

          return html`
            <div
              class="mc-module-item ${isSelected ? 'selected' : ''}"
              @click=${() =>
                this.stateManager.setSelectedPath({
                  rowIndex: ri,
                  columnIndex: ci,
                  moduleIndex: mi,
                })}
            >
              <span class="mc-module-item-icon">
                <ha-icon
                  icon=${handler?.metadata.icon || 'mdi:puzzle'}
                  style="--mdc-icon-size:16px"
                ></ha-icon>
              </span>
              <span class="mc-module-item-name">
                ${handler?.metadata.name || mod.type}
              </span>
              <span class="mc-module-item-type">${mod.type}</span>
              <button
                class="mc-btn-icon"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.stateManager.deleteModule(ri, ci, mi);
                }}
              >
                &times;
              </button>
            </div>
          `;
        })}
        <button
          class="mc-add-module-btn"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent('add-module', {
                bubbles: true,
                composed: true,
                detail: { rowIndex: ri, colIndex: ci },
              }),
            )}
        >
          + Add Module
        </button>
      </div>
    `;
  }

  private _toggleSection(id: string): void {
    if (this._expandedSections.has(id)) {
      this._expandedSections.delete(id);
    } else {
      this._expandedSections.add(id);
    }
    this.requestUpdate();
  }
}
