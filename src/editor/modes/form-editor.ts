import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MagicCardConfig, EditorState, EditorPath } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';
import { formEditorStyles } from './form-editor.styles';
import { renderTextField, renderSelectField, renderColorField, renderUnitField } from '../../utils/form-utils';

// Drag state for native HTML5 drag and drop
interface DragState {
  type: 'row' | 'module';
  rowIndex: number;
  colIndex?: number;
  moduleIndex?: number;
}

@customElement('mc-form-editor')
export class FormEditor extends LitElement {
  static styles = [editorStyles, formEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  @state() private _expandedSections = new Set<string>(['card']);
  @state() private _collapsedRows = new Set<number>();
  @state() private _dragOver: { type: string; index: number; colIndex?: number } | null = null;

  private _unsubscribe?: () => void;
  private _dragState: DragState | null = null;

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

  // Native drag and drop handlers for rows
  private _onRowDragStart(e: DragEvent, rowIndex: number): void {
    this._dragState = { type: 'row', rowIndex };
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', JSON.stringify(this._dragState));
    (e.target as HTMLElement).classList.add('dragging');
  }

  private _onRowDragEnd(e: DragEvent): void {
    (e.target as HTMLElement).classList.remove('dragging');
    this._dragState = null;
    this._dragOver = null;
  }

  private _onRowDragOver(e: DragEvent, rowIndex: number): void {
    if (!this._dragState || this._dragState.type !== 'row') return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    this._dragOver = { type: 'row', index: rowIndex };
  }

  private _onRowDragLeave(): void {
    this._dragOver = null;
  }

  private _onRowDrop(e: DragEvent, toIndex: number): void {
    e.preventDefault();
    if (!this._dragState || this._dragState.type !== 'row') return;

    const fromIndex = this._dragState.rowIndex;
    if (fromIndex !== toIndex) {
      this.stateManager.moveRow(fromIndex, toIndex);
    }
    this._dragState = null;
    this._dragOver = null;
  }

  // Native drag and drop handlers for modules
  private _onModuleDragStart(e: DragEvent, rowIndex: number, colIndex: number, moduleIndex: number): void {
    this._dragState = { type: 'module', rowIndex, colIndex, moduleIndex };
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', JSON.stringify(this._dragState));
    (e.target as HTMLElement).classList.add('dragging');
    e.stopPropagation();
  }

  private _onModuleDragEnd(e: DragEvent): void {
    (e.target as HTMLElement).classList.remove('dragging');
    this._dragState = null;
    this._dragOver = null;
  }

  private _onModuleDragOver(e: DragEvent, rowIndex: number, colIndex: number, moduleIndex: number): void {
    if (!this._dragState || this._dragState.type !== 'module') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'move';
    this._dragOver = { type: 'module', index: moduleIndex, colIndex };
  }

  private _onContainerDragOver(e: DragEvent, rowIndex: number, colIndex: number): void {
    if (!this._dragState || this._dragState.type !== 'module') return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  private _onModuleDrop(e: DragEvent, toRow: number, toCol: number, toIndex: number): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this._dragState || this._dragState.type !== 'module') return;

    const { rowIndex: fromRow, colIndex: fromCol, moduleIndex: fromIndex } = this._dragState;
    if (fromRow !== toRow || fromCol !== toCol || fromIndex !== toIndex) {
      this.stateManager.moveModule(fromRow, fromCol!, fromIndex!, toRow, toCol, toIndex);
    }
    this._dragState = null;
    this._dragOver = null;
  }

  private _onContainerDrop(e: DragEvent, toRow: number, toCol: number): void {
    e.preventDefault();
    if (!this._dragState || this._dragState.type !== 'module') return;

    const { rowIndex: fromRow, colIndex: fromCol, moduleIndex: fromIndex } = this._dragState;
    const modules = this._editorState?.config.rows[toRow]?.columns[toCol]?.modules || [];
    const toIndex = modules.length;

    this.stateManager.moveModule(fromRow, fromCol!, fromIndex!, toRow, toCol, toIndex);
    this._dragState = null;
    this._dragOver = null;
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
    const isDragOver = this._dragOver?.type === 'row' && this._dragOver?.index === ri;
    const isCollapsed = this._collapsedRows.has(ri);

    return html`
      <div
        class="mc-row-item ${isDragOver ? 'drag-over' : ''} ${isCollapsed ? 'collapsed' : ''}"
        data-row="${ri}"
        draggable="true"
        @dragstart=${(e: DragEvent) => this._onRowDragStart(e, ri)}
        @dragend=${(e: DragEvent) => this._onRowDragEnd(e)}
        @dragover=${(e: DragEvent) => this._onRowDragOver(e, ri)}
        @dragleave=${() => this._onRowDragLeave()}
        @drop=${(e: DragEvent) => this._onRowDrop(e, ri)}
      >
        <div class="mc-row-header">
          <span class="mc-drag-handle" title="Drag to reorder">
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span
            class="mc-row-header-toggle"
            @click=${() => this._toggleRow(ri)}
          >
            <span class="mc-chevron ${isCollapsed ? '' : 'open'}">&#9654;</span>
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
            <span class="mc-label">Row ${ri + 1}</span>
          </span>
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
        ${isCollapsed
          ? nothing
          : html`
            <div class="mc-row-body">
              ${row.columns.map((col, ci) => this._renderColumn(col, ri, ci, selectedPath))}
            </div>
          `}
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
        <div
          class="mc-modules-container"
          data-row="${ri}"
          data-col="${ci}"
          @dragover=${(e: DragEvent) => this._onContainerDragOver(e, ri, ci)}
          @drop=${(e: DragEvent) => this._onContainerDrop(e, ri, ci)}
        >
          ${col.modules.map((mod, mi) => {
            const isSelected =
              selectedPath?.rowIndex === ri &&
              selectedPath?.columnIndex === ci &&
              selectedPath?.moduleIndex === mi;

            const handler = ModuleRegistry.get(mod.type);
            const isDragOver = this._dragOver?.type === 'module' &&
              this._dragOver?.index === mi &&
              this._dragOver?.colIndex === ci;

            return html`
              <div
                class="mc-module-item ${isSelected ? 'selected' : ''} ${isDragOver ? 'drag-over' : ''}"
                draggable="true"
                @dragstart=${(e: DragEvent) => this._onModuleDragStart(e, ri, ci, mi)}
                @dragend=${(e: DragEvent) => this._onModuleDragEnd(e)}
                @dragover=${(e: DragEvent) => this._onModuleDragOver(e, ri, ci, mi)}
                @drop=${(e: DragEvent) => this._onModuleDrop(e, ri, ci, mi)}
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

  private _toggleRow(ri: number): void {
    if (this._collapsedRows.has(ri)) {
      this._collapsedRows.delete(ri);
    } else {
      this._collapsedRows.add(ri);
    }
    this.requestUpdate();
  }
}
