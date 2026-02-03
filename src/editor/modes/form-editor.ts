import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MagicCardConfig, EditorState, EditorPath } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';
import { formEditorStyles } from './form-editor.styles';
import { renderTextField, renderSelectField, renderColorField, renderUnitField } from '../../utils/form-utils';
import Sortable from 'sortablejs';

@customElement('mc-form-editor')
export class FormEditor extends LitElement {
  static styles = [editorStyles, formEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  @state() private _expandedSections = new Set<string>(['card']);

  private _unsubscribe?: () => void;
  private _sortableInstances: Sortable[] = [];

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
    this._destroySortables();
  }

  protected updated(): void {
    this._initSortables();
  }

  private _destroySortables(): void {
    this._sortableInstances.forEach(s => s.destroy());
    this._sortableInstances = [];
  }

  private _initSortables(): void {
    this._destroySortables();

    // Sortable for rows
    const rowsContainer = this.shadowRoot?.querySelector('.mc-rows-container');
    if (rowsContainer) {
      this._sortableInstances.push(
        Sortable.create(rowsContainer as HTMLElement, {
          handle: '.mc-drag-handle',
          animation: 150,
          ghostClass: 'mc-sortable-ghost',
          onEnd: (evt) => {
            if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
              this.stateManager.moveRow(evt.oldIndex, evt.newIndex);
            }
          },
        })
      );
    }

    // Sortable for modules in each column
    this.shadowRoot?.querySelectorAll('.mc-modules-container').forEach((container) => {
      const rowIdx = parseInt(container.getAttribute('data-row') || '0');
      const colIdx = parseInt(container.getAttribute('data-col') || '0');

      this._sortableInstances.push(
        Sortable.create(container as HTMLElement, {
          group: 'modules',
          handle: '.mc-module-drag',
          animation: 150,
          ghostClass: 'mc-sortable-ghost',
          onEnd: (evt) => {
            const fromRow = parseInt(evt.from.getAttribute('data-row') || '0');
            const fromCol = parseInt(evt.from.getAttribute('data-col') || '0');
            const toRow = parseInt(evt.to.getAttribute('data-row') || '0');
            const toCol = parseInt(evt.to.getAttribute('data-col') || '0');

            if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
              this.stateManager.moveModule(
                fromRow, fromCol, evt.oldIndex,
                toRow, toCol, evt.newIndex
              );
            }
          },
        })
      );
    });
  }

  protected render(): TemplateResult {
    if (!this._editorState) return html``;
    const { config, selectedPath } = this._editorState;

    return html`
      <div class="mc-form">
        ${this._renderCardSection(config)}
        <div class="mc-rows-container">
          ${config.rows.map((row, ri) => this._renderRow(row, ri, selectedPath))}
        </div>
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
                ${renderColorField('Background', config.background, (v) =>
                  this.stateManager.updateConfig({ ...config, background: v }),
                )}
                ${renderUnitField('Border Radius', config.border_radius, (v) =>
                  this.stateManager.updateConfig({ ...config, border_radius: v }),
                )}
                ${renderUnitField('Padding', config.padding, (v) =>
                  this.stateManager.updateConfig({ ...config, padding: v }),
                )}
                ${renderTextField('Box Shadow', config.box_shadow, (v) =>
                  this.stateManager.updateConfig({ ...config, box_shadow: v }),
                )}
                ${renderUnitField('Card Height', config.card_height, (v) =>
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
      <div class="mc-row-item" data-row="${ri}">
        <div class="mc-row-header">
          <span class="mc-drag-handle" title="Drag to reorder">
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          <span class="mc-label">Row ${ri + 1}</span>
          <div class="mc-row-layout-select">
            ${renderSelectField('', row.layout, [
              { label: '1 Col', value: '1' },
              { label: '1-1', value: '1-1' },
              { label: '1-2', value: '1-2' },
              { label: '2-1', value: '2-1' },
              { label: '1-1-1', value: '1-1-1' },
            ], (v) => this.stateManager.updateRow(ri, { layout: v }))}
          </div>
          <button
            class="mc-btn-icon mc-btn-add-col"
            @click=${() => this.stateManager.addColumn(ri)}
            title="Add column"
          >
            <ha-icon icon="mdi:table-column-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          </button>
          <button
            class="mc-btn-icon mc-btn-delete"
            @click=${() => this.stateManager.deleteRow(ri)}
            title="Delete row"
          >
            <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:16px"></ha-icon>
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
    const row = this._editorState?.config.rows[ri];
    const canDeleteColumn = row && row.columns.length > 1;

    return html`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
          <span class="mc-label">Column ${ci + 1}</span>
          ${canDeleteColumn ? html`
            <button
              class="mc-btn-icon mc-btn-small"
              @click=${() => this.stateManager.deleteColumn(ri, ci)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          ` : nothing}
        </div>
        <div class="mc-modules-container" data-row="${ri}" data-col="${ci}">
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
                <span class="mc-module-drag" title="Drag to reorder">
                  <ha-icon icon="mdi:drag" style="--mdc-icon-size:14px"></ha-icon>
                </span>
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
                  class="mc-btn-icon mc-btn-small"
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this.stateManager.deleteModule(ri, ci, mi);
                  }}
                  title="Delete module"
                >
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
                </button>
              </div>
            `;
          })}
        </div>
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
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Module
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
