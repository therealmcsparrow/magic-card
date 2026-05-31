import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, MagicCardConfig, EditorState, EditorPath, RowConfig, ColumnConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles, formEditorStyles } from '../../css/css';
import { renderUnitField, renderBoxField } from '../../utils/form-utils';
import '../components/design-panel';

import '../components/box-field';

interface LayoutOption {
  label: string;
  value: string;
}

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
  @state() private _collapsedRows = new Set<number>();
  @state() private _collapsedCols = new Set<string>();
  @state() private _dragOver: { type: string; index: number; colIndex?: number } | null = null;
  @state() private _rowSettings: { rowIndex: number; colIndex?: number; tab: 'general' | 'design' | 'conditions' | 'actions' } | null = null;

  private _unsubscribe?: () => void;
  private _dragState: DragState | null = null;
  private _ignoreModuleClickUntil = 0;

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
    const rowItem = (e.target as HTMLElement).closest('.mc-row-item');
    rowItem?.classList.add('dragging');
  }

  private _onRowDragEnd(e: DragEvent): void {
    const rowItem = (e.target as HTMLElement).closest('.mc-row-item');
    rowItem?.classList.remove('dragging');
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
    const moduleItem = (e.target as HTMLElement).closest('.mc-module-item');
    moduleItem?.classList.add('dragging');
    e.stopPropagation();
    this._ignoreModuleClickUntil = Date.now() + 250;
  }

  private _onModuleDragEnd(e: DragEvent): void {
    const moduleItem = (e.target as HTMLElement).closest('.mc-module-item');
    moduleItem?.classList.remove('dragging');
    this._dragState = null;
    this._dragOver = null;
    this._ignoreModuleClickUntil = Date.now() + 250;
  }

  private _onModuleDragOver(e: DragEvent, _rowIndex: number, colIndex: number, moduleIndex: number): void {
    if (!this._dragState || this._dragState.type !== 'module') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'move';
    this._dragOver = { type: 'slot', index: moduleIndex, colIndex };
  }

  private _onContainerDragOver(e: DragEvent, _rowIndex: number, _colIndex: number): void {
    if (!this._dragState || this._dragState.type !== 'module') return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  private _dropModuleAtIndex(e: DragEvent, toRow: number, toCol: number, toIndex: number): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this._dragState || this._dragState.type !== 'module') return;

    const { rowIndex: fromRow, colIndex: fromCol, moduleIndex: fromIndex } = this._dragState;
    let targetIndex = toIndex;
    if (fromRow === toRow && fromCol === toCol && fromIndex! < targetIndex) {
      targetIndex -= 1;
    }

    if (fromRow !== toRow || fromCol !== toCol || fromIndex !== targetIndex) {
      this.stateManager.moveModule(fromRow, fromCol!, fromIndex!, toRow, toCol, targetIndex);
    }
    this._dragState = null;
    this._dragOver = null;
    this._ignoreModuleClickUntil = Date.now() + 300;
  }

  private _onContainerDrop(e: DragEvent, toRow: number, toCol: number): void {
    const modules = this._editorState?.config.rows[toRow]?.columns[toCol]?.modules || [];
    this._dropModuleAtIndex(e, toRow, toCol, modules.length);
  }

  private _onModuleClick(ri: number, ci: number, mi: number): void {
    if (Date.now() < this._ignoreModuleClickUntil) return;
    this.stateManager.setSelectedPath({
      rowIndex: ri,
      columnIndex: ci,
      moduleIndex: mi,
    });
  }

  private _moveRowBy(rowIndex: number, delta: number): void {
    const rows = this._editorState?.config.rows ?? [];
    const toIndex = Math.min(Math.max(rowIndex + delta, 0), rows.length - 1);
    if (toIndex !== rowIndex) {
      this.stateManager.moveRow(rowIndex, toIndex);
    }
  }

  private _moveModuleVertical(ri: number, ci: number, mi: number, delta: number): void {
    const modules = this._editorState?.config.rows[ri]?.columns[ci]?.modules ?? [];
    const toIndex = Math.min(Math.max(mi + delta, 0), modules.length - 1);
    if (toIndex !== mi) {
      this.stateManager.moveModule(ri, ci, mi, ri, ci, toIndex);
    }
  }

  private _moveModuleHorizontal(ri: number, ci: number, mi: number, delta: number): void {
    const row = this._editorState?.config.rows[ri];
    if (!row) return;
    const toCol = ci + delta;
    if (toCol < 0 || toCol >= row.columns.length) return;
    const targetModules = row.columns[toCol].modules;
    const toIndex = Math.min(mi, targetModules.length);
    this.stateManager.moveModule(ri, ci, mi, ri, toCol, toIndex);
  }

  private _onRowHeaderKeyDown(e: KeyboardEvent, ri: number): void {
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      this._moveRowBy(ri, -1);
      return;
    }
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      this._moveRowBy(ri, 1);
    }
  }

  private _onModuleKeyDown(e: KeyboardEvent, ri: number, ci: number, mi: number): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.stateManager.setSelectedPath({
        rowIndex: ri,
        columnIndex: ci,
        moduleIndex: mi,
      });
      return;
    }

    if (!e.altKey) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._moveModuleVertical(ri, ci, mi, -1);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._moveModuleVertical(ri, ci, mi, 1);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._moveModuleHorizontal(ri, ci, mi, -1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._moveModuleHorizontal(ri, ci, mi, 1);
    }
  }

  private _layoutFromWeights(weights: number[]): string {
    return weights.map((w) => Math.max(1, Math.round(w))).join('-');
  }

  private _equalWeights(colCount: number): number[] {
    return Array.from({ length: Math.max(colCount, 1) }, () => 1);
  }

  private _getLayoutOptions(colCount: number): LayoutOption[] {
    const options: LayoutOption[] = [];
    const seen = new Set<string>();

    const add = (label: string, weights: number[]) => {
      if (weights.length !== colCount) return;
      const value = this._layoutFromWeights(weights);
      if (seen.has(value)) return;
      seen.add(value);
      options.push({ label, value });
    };

    add('Balanced', this._equalWeights(colCount));

    if (colCount > 1) {
      add('Left Focus', [2, ...Array.from({ length: colCount - 1 }, () => 1)]);
      add('Right Focus', [...Array.from({ length: colCount - 1 }, () => 1), 2]);
    }

    if (colCount >= 3) {
      const center = Math.floor(colCount / 2);
      const centerWeights = this._equalWeights(colCount);
      centerWeights[center] = 2;
      add('Center Focus', centerWeights);
    }

    if (colCount >= 4) {
      const splitWeights = this._equalWeights(colCount);
      splitWeights[0] = 2;
      splitWeights[colCount - 1] = 2;
      add('Dual Focus', splitWeights);
    }

    return options;
  }

  private _layoutToWeights(layout: string, colCount: number): number[] {
    if (/^\d+(?:-\d+)*$/.test(layout)) {
      return layout.split('-').map((segment) => Math.max(Number(segment) || 1, 1));
    }
    return this._equalWeights(colCount);
  }

  private _renderLayoutBar(row: RowConfig): TemplateResult {
    const colCount = row.columns.length;
    const weights = this._layoutToWeights(row.layout || this._layoutFromWeights(this._equalWeights(colCount)), colCount);
    return html`
      <span class="mc-layout-bar" aria-label="Layout: ${row.layout || 'balanced'}">
        ${weights.map((w) => html`<span class="mc-layout-bar-seg" style="flex:${w}"></span>`)}
      </span>
    `;
  }

  private _renderLayoutGrid(ri: number, row: import('../../types').RowConfig): TemplateResult {
    const colCount = row.columns.length;
    const options = this._getLayoutOptions(colCount);
    const currentLayout = row.layout || this._layoutFromWeights(this._equalWeights(colCount));
    const hasCurrent = options.some((option) => option.value === currentLayout);
    const allOptions = hasCurrent
      ? options
      : [{ label: 'Current', value: currentLayout }, ...options];

    return html`
      <div class="mc-field">
        <label>Column Layout</label>
        <div class="mc-layout-grid" role="radiogroup" aria-label="Row layout options">
          ${allOptions.map((option) => {
            const selected = option.value === currentLayout;
            const weights = this._layoutToWeights(option.value, colCount);
            return html`
              <button
                type="button"
                class="mc-layout-grid-option ${selected ? 'active' : ''}"
                role="radio"
                aria-checked=${selected ? 'true' : 'false'}
                @click=${() => this.stateManager.updateRow(ri, { layout: option.value })}
              >
                <span class="mc-layout-grid-preview" aria-hidden="true">
                  ${weights.map((weight) => html`<span style=${`flex:${weight}`}></span>`)}
                </span>
                <span class="mc-layout-grid-label">${option.label}</span>
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (!this._editorState) return html``;
    const { config, selectedPath } = this._editorState;
    const isEmpty = !config.rows || config.rows.length === 0;

    return html`
      <div class="mc-form">
        ${this._renderCardSection(config)}
        ${isEmpty
          ? this._renderEmptyState()
          : html`
              <div class="mc-kbd-hint">
                <span>Keyboard: <kbd>Alt</kbd> + <kbd>Arrow</kbd> to move rows/modules, <kbd>Enter</kbd> to edit.</span>
                <button
                  class="mc-btn mc-btn-secondary mc-btn-compact"
                  @click=${() => this.dispatchEvent(new CustomEvent('request-add-row', { bubbles: true, composed: true }))}
                >
                  <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:14px"></ha-icon>
                  Add Row
                </button>
              </div>
              <div class="mc-rows-container">
                ${config.rows.map((row, ri) => this._renderRow(row, ri, selectedPath))}
              </div>
            `}
      </div>
      ${this._rowSettings ? this._renderContainerSettingsModal() : nothing}
    `;
  }

  private _renderEmptyState(): TemplateResult {
    return html`
      <div class="mc-empty-state">
        <div class="mc-empty-state-icon">
          <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon>
        </div>
        <h3 class="mc-empty-state-title">Start building your card</h3>
        <p class="mc-empty-state-desc">
          Add a row to begin laying out columns and modules.
        </p>
        <button
          type="button"
          class="mc-btn mc-btn-primary mc-empty-state-cta"
          @click=${() => this.dispatchEvent(new CustomEvent('request-add-row', { bubbles: true, composed: true }))}
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:18px"></ha-icon>
          Add First Row
        </button>
      </div>
    `;
  }

  private _renderCardSection(config: MagicCardConfig): TemplateResult {
    return html`
      <div class="mc-card-header">
        <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px; color: var(--primary-color, #6366f1);"></ha-icon>
        <input
          class="mc-card-name-input"
          type="text"
          placeholder="Card name"
          .value=${config.name || ''}
          @input=${(e: InputEvent) =>
            this.stateManager.updateConfig({ ...config, name: (e.target as HTMLInputElement).value })}
        />
        <button
          class="mc-btn-icon"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent('open-card-settings', { bubbles: true, composed: true }),
            )}
          title="Card settings"
        >
          <ha-icon icon="mdi:cog" style="--mdc-icon-size:18px"></ha-icon>
        </button>
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
        @dragover=${(e: DragEvent) => this._onRowDragOver(e, ri)}
        @dragleave=${() => this._onRowDragLeave()}
        @drop=${(e: DragEvent) => this._onRowDrop(e, ri)}
      >
        <div
          class="mc-row-header ${this._rowSettings?.rowIndex === ri ? 'selected' : ''}"
          tabindex="0"
          @keydown=${(e: KeyboardEvent) => this._onRowHeaderKeyDown(e, ri)}
          aria-label=${`Row ${ri + 1}. Press Alt+ArrowUp or Alt+ArrowDown to reorder.`}
        >
          <span
            class="mc-drag-handle"
            title="Drag to reorder"
            draggable="true"
            @dragstart=${(e: DragEvent) => this._onRowDragStart(e, ri)}
            @dragend=${(e: DragEvent) => this._onRowDragEnd(e)}
          >
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span
            class="mc-row-header-toggle"
            @click=${() => { this._rowSettings = { rowIndex: ri, colIndex: undefined, tab: 'general' }; }}
          >
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
            <span class="mc-label">Row ${ri + 1}</span>
            <span class="mc-row-layout-bar" title="Column layout">
              ${this._renderLayoutBar(row)}
            </span>
          </span>
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
          <button
            class="mc-btn-icon mc-btn-settings"
            @click=${() => { this._rowSettings = { rowIndex: ri, colIndex: undefined, tab: 'general' }; }}
            title="Row settings"
          >
            <ha-icon icon="mdi:cog" style="--mdc-icon-size:16px"></ha-icon>
          </button>
          <span
            class="mc-row-collapse-btn"
            @click=${() => this._toggleRow(ri)}
            title="${isCollapsed ? 'Expand' : 'Collapse'}"
          >
            <span class="mc-chevron ${isCollapsed ? '' : 'open'}">&#9654;</span>
          </span>
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

    const isColCollapsed = this._collapsedCols.has(`${ri}:${ci}`);

    return html`
      <div class="mc-col-item ${isColCollapsed ? 'collapsed' : ''}">
        <div class="mc-col-header">
          <span
            class="mc-col-header-toggle"
            @click=${() => { this._rowSettings = { rowIndex: ri, colIndex: ci, tab: 'general' }; }}
          >
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
            <span class="mc-label">Col ${ci + 1}</span>
            ${col.modules.length > 0 ? html`<span class="mc-col-badge">${col.modules.length}</span>` : nothing}
          </span>
          <button
            class="mc-btn-icon mc-btn-small mc-btn-settings"
            @click=${() => { this._rowSettings = { rowIndex: ri, colIndex: ci, tab: 'general' }; }}
            title="Column settings"
          >
            <ha-icon icon="mdi:cog" style="--mdc-icon-size:12px"></ha-icon>
          </button>
          <span
            class="mc-col-collapse-btn"
            @click=${() => this._toggleCol(ri, ci)}
            title="${isColCollapsed ? 'Expand' : 'Collapse'}"
          >
            <ha-icon icon="${isColCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-down'}" style="--mdc-icon-size:12px"></ha-icon>
          </span>
          ${canDeleteColumn ? html`
            <button
              class="mc-btn-icon mc-btn-small mc-btn-delete"
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
          ${this._renderDropSlot(ri, ci, 0, col.modules.length === 0)}
          ${col.modules.map((mod, mi) => {
            const isSelected =
              selectedPath?.rowIndex === ri &&
              selectedPath?.columnIndex === ci &&
              selectedPath?.moduleIndex === mi;

            const handler = ModuleRegistry.get(mod.type);

            return html`
              <div
                class="mc-module-item ${isSelected ? 'selected' : ''}"
                tabindex="0"
                role="button"
                aria-label=${`${handler?.metadata.name || mod.type} module. Press Enter to edit. Press Alt plus Arrow keys to move.`}
                @keydown=${(e: KeyboardEvent) => this._onModuleKeyDown(e, ri, ci, mi)}
                @click=${() => this._onModuleClick(ri, ci, mi)}
              >
                <span
                  class="mc-module-drag"
                  title="Drag to reorder"
                  draggable="true"
                  @dragstart=${(e: DragEvent) => this._onModuleDragStart(e, ri, ci, mi)}
                  @dragend=${(e: DragEvent) => this._onModuleDragEnd(e)}
                >
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
              ${this._renderDropSlot(ri, ci, mi + 1)}
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

  private _renderContainerSettingsModal(): TemplateResult {
    if (!this._rowSettings) return html``;
    const { rowIndex, colIndex } = this._rowSettings;
    const row = this._editorState?.config.rows[rowIndex];
    if (!row) return html``;

    const isCol = colIndex !== undefined;
    const column = isCol ? row.columns[colIndex] : null;
    const isCollapsed = isCol
      ? this._collapsedCols.has(`${rowIndex}:${colIndex}`)
      : this._collapsedRows.has(rowIndex);

    const title = isCol ? `Column ${colIndex! + 1} Settings` : `Row ${rowIndex + 1} Settings`;
    const icon = isCol ? 'mdi:view-column' : 'mdi:view-sequential';

    const tabs: Array<{ id: 'general' | 'design' | 'conditions' | 'actions'; label: string; icon: string }> = [
      { id: 'general', label: 'General', icon: 'mdi:cog' },
      { id: 'design', label: 'Design', icon: 'mdi:palette' },
      { id: 'conditions', label: 'Conditions', icon: 'mdi:filter-outline' },
      ...(!isCol ? [{ id: 'actions' as const, label: 'Actions', icon: 'mdi:gesture-tap' }] : []),
    ];

    return html`
      <div class="mc-modal-overlay" @click=${() => { this._rowSettings = null; }}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${icon}></ha-icon>
            <span class="mc-modal-title">${title}</span>
            <button class="mc-modal-close" @click=${() => { this._rowSettings = null; }}>&times;</button>
          </div>
          <div class="mc-modal-tabs">
            ${tabs.map(t => html`
              <button
                class="mc-modal-tab ${this._rowSettings!.tab === t.id ? 'active' : ''}"
                @click=${() => { this._rowSettings = { ...this._rowSettings!, tab: t.id }; }}
              >
                <ha-icon icon=${t.icon} style="--mdc-icon-size:16px"></ha-icon>
                ${t.label}
              </button>
            `)}
          </div>
          <div class="mc-modal-body">
            ${this._rowSettings.tab === 'general' ? this._renderContainerGeneralTab(row, column, rowIndex, colIndex) : nothing}
            ${this._rowSettings.tab === 'design' ? this._renderContainerDesignTab(row, column, rowIndex, colIndex) : nothing}
            ${this._rowSettings.tab === 'conditions' ? this._renderContainerConditionsTab(row, column, rowIndex, colIndex) : nothing}
            ${!isCol && this._rowSettings!.tab === 'actions' ? this._renderContainerActionsTab(row, column, rowIndex, colIndex) : nothing}
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${() => { this._rowSettings = null; }}>Done</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderContainerGeneralTab(
    row: RowConfig,
    column: ColumnConfig | null,
    ri: number,
    ci: number | undefined,
  ): TemplateResult {
    if (column) {
      // Column general: vertical align, gap, padding
      return html`
        <div class="mc-tab-content">
          <div class="mc-field">
            <label>Vertical Align</label>
            <select
              .value=${column.vertical_align || 'start'}
              @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value as 'start' | 'center' | 'end' | 'stretch';
                this.stateManager.updateColumn(ri, ci!, { vertical_align: val });
              }}
            >
              <option value="start">Top</option>
              <option value="center">Center</option>
              <option value="end">Bottom</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
          ${renderUnitField('Gap', column.gap, (v) => this.stateManager.updateColumn(ri, ci!, { gap: v }))}
          ${renderBoxField('Padding', column.padding, (v) => this.stateManager.updateColumn(ri, ci!, { padding: v }), 'padding')}
        </div>
      `;
    }
    // Row general: layout, gap, padding
    return html`
      <div class="mc-tab-content">
        ${this._renderLayoutGrid(ri, row)}
        ${renderUnitField('Gap', row.gap, (v) => this.stateManager.updateRow(ri, { gap: v }))}
        ${renderBoxField('Padding', row.padding, (v) => this.stateManager.updateRow(ri, { padding: v }), 'padding')}
      </div>
    `;
  }

  private _renderContainerDesignTab(
    row: RowConfig,
    column: ColumnConfig | null,
    ri: number,
    ci: number | undefined,
  ): TemplateResult {
    const design = column ? (column.design || {}) : (row.design || {});
    const onChange = (updates: Record<string, unknown>) => {
      if (column) {
        this.stateManager.updateColumn(ri, ci!, { design: { ...column.design, ...updates } } as unknown as import('../../types').ColumnConfig);
      } else {
        this.stateManager.updateRow(ri, { design: { ...row.design, ...updates } } as unknown as import('../../types').RowConfig);
      }
    };
    return html`
      <mc-design-panel
        .design=${design}
        .hass=${this.hass}
        .onChange=${onChange}
      ></mc-design-panel>
    `;
  }

  private _renderContainerConditionsTab(
    row: RowConfig,
    column: ColumnConfig | null,
    ri: number,
    ci: number | undefined,
  ): TemplateResult {
    const display = column ? (column.display || {}) : (row.display || {});
    const displayConditions = display.conditions || [];
    const displayMode = display.mode || 'every';
    const config = this._editorState?.config;

    return html`
      <div class="mc-tab-content">
        <div class="mc-mode-help">When conditions are not met, this ${column ? 'column' : 'row'} is hidden.</div>
        ${displayConditions.length > 1 ? html`
          <div class="mc-field">
            <label>Condition Mode</label>
            <select
              .value=${displayMode}
              @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value as 'every' | 'any';
                const updates = column
                  ? { display: { ...column.display, mode: val } }
                  : { display: { ...row.display, mode: val } };
                if (column) {
                  this.stateManager.updateColumn(ri, ci!, updates as unknown as ColumnConfig);
                } else {
                  this.stateManager.updateRow(ri, updates as unknown as RowConfig);
                }
              }}
            >
              <option value="every">All conditions (AND)</option>
              <option value="any">Any condition (OR)</option>
            </select>
          </div>
        ` : nothing}
        <div class="mc-conditions-list">
          ${displayConditions.map((cond: import('../../types').DisplayCondition, idx: number) => this._renderDisplayConditionRow(cond, idx, (updates) => {
            const conditions = [...displayConditions];
            conditions[idx] = { ...conditions[idx], ...updates };
            const updates2 = column
              ? { display: { ...column.display, conditions } }
              : { display: { ...row.display, conditions } };
            if (column) {
              this.stateManager.updateColumn(ri, ci!, updates2 as unknown as ColumnConfig);
            } else {
              this.stateManager.updateRow(ri, updates2 as unknown as RowConfig);
            }
          }, () => {
            const conditions = displayConditions.filter((_: import('../../types').DisplayCondition, i: number) => i !== idx);
            const updates2 = column
              ? { display: { ...column.display, conditions: conditions.length ? conditions : undefined } }
              : { display: { ...row.display, conditions: conditions.length ? conditions : undefined } };
            if (column) {
              this.stateManager.updateColumn(ri, ci!, updates2 as unknown as ColumnConfig);
            } else {
              this.stateManager.updateRow(ri, updates2 as unknown as RowConfig);
            }
          }))}
        </div>
        <button class="mc-btn mc-btn-secondary" @click=${() => {
          const newCond: import('../../types').DisplayCondition = { id: `cond-${Date.now()}`, type: 'state', entity: '', state: '' };
          const conditions = [...displayConditions, newCond];
          const updates2 = column
            ? { display: { ...column.display, conditions } }
            : { display: { ...row.display, conditions } };
          if (column) {
            this.stateManager.updateColumn(ri, ci!, updates2 as unknown as ColumnConfig);
          } else {
            this.stateManager.updateRow(ri, updates2 as unknown as RowConfig);
          }
        }}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Condition
        </button>
      </div>
    `;
  }

  private _renderDisplayConditionRow(
    cond: import('../../types').DisplayCondition,
    idx: number,
    onChange: (updates: Partial<import('../../types').DisplayCondition>) => void,
    onRemove: () => void,
  ): TemplateResult {
    return html`
      <div class="mc-condition-item">
        <div class="mc-field">
          <label>Type</label>
          <select .value=${cond.type} @change=${(e: Event) => onChange({ type: (e.target as HTMLSelectElement).value as import('../../types').DisplayCondition['type'] })}>
            <option value="state">State</option>
            <option value="attribute">Attribute</option>
            <option value="time">Time</option>
            <option value="template">Template</option>
          </select>
        </div>
        ${cond.type === 'state' || cond.type === 'attribute' ? html`
          <div class="mc-field">
            <label>Entity</label>
            <input type="text" .value=${cond.entity || ''} @input=${(e: InputEvent) => onChange({ entity: (e.target as HTMLInputElement).value })} placeholder="sensor.temp" />
          </div>
          ${cond.type === 'attribute' ? html`
            <div class="mc-field">
              <label>Attribute</label>
              <input type="text" .value=${cond.attribute || ''} @input=${(e: InputEvent) => onChange({ attribute: (e.target as HTMLInputElement).value })} />
            </div>
          ` : nothing}
          <div class="mc-field">
            <label>State equals</label>
            <input type="text" .value=${cond.state || ''} @input=${(e: InputEvent) => onChange({ state: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="mc-field">
            <label>State not equals</label>
            <input type="text" .value=${cond.state_not || ''} @input=${(e: InputEvent) => onChange({ state_not: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}
        ${cond.type === 'time' ? html`
          <div class="mc-field">
            <label>After (HH:MM)</label>
            <input type="time" .value=${cond.after || ''} @input=${(e: InputEvent) => onChange({ after: (e.target as HTMLInputElement).value })} />
          </div>
          <div class="mc-field">
            <label>Before (HH:MM)</label>
            <input type="time" .value=${cond.before || ''} @input=${(e: InputEvent) => onChange({ before: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}
        ${cond.type === 'template' ? html`
          <div class="mc-field">
            <label>Template</label>
            <textarea rows="3" .value=${cond.template || ''} @input=${(e: InputEvent) => onChange({ template: (e.target as HTMLInputElement).value })}></textarea>
          </div>
        ` : nothing}
        <button class="mc-btn-icon" @click=${onRemove} title="Remove condition">
          <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderContainerActionsTab(
    row: RowConfig,
    column: ColumnConfig | null,
    ri: number,
    ci: number | undefined,
  ): TemplateResult {
    // Actions tab only available for rows, not columns
    const actions = row.actions || {};

    return html`
      <div class="mc-tab-content">
        <div class="mc-mode-help">Define tap/hold/double-tap actions for this ${column ? 'column' : 'row'}.</div>
        <div class="mc-field">
          <label>Tap Action</label>
          <select .value=${actions.tap_action?.action || 'none'} @change=${(e: Event) => {
            const action = (e.target as HTMLSelectElement).value;
            const updates = { actions: { ...row.actions, tap_action: action === 'none' ? undefined : { action } } };
            this.stateManager.updateRow(ri, updates as unknown as RowConfig);
          }}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
                <div class="mc-field">
          <label>Hold Action</label>
          <select .value=${actions.hold_action?.action || 'none'} @change=${(e: Event) => {
            const action = (e.target as HTMLSelectElement).value;
            const updates = { actions: { ...row.actions, hold_action: action === 'none' ? undefined : { action } } };
            this.stateManager.updateRow(ri, updates as unknown as RowConfig);
          }}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
        <div class="mc-field">
          <label>Double Tap Action</label>
          <select .value=${actions.double_tap_action?.action || 'none'} @change=${(e: Event) => {
            const action = (e.target as HTMLSelectElement).value;
            const updates = { actions: { ...row.actions, double_tap_action: action === 'none' ? undefined : { action } } };
            this.stateManager.updateRow(ri, updates as unknown as RowConfig);
          }}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
      </div>
    `;
  }

  private _renderDropSlot(
    ri: number,
    ci: number,
    toIndex: number,
    isEmpty = false,
  ): TemplateResult {
    const isActive = this._dragOver?.type === 'slot'
      && this._dragOver?.index === toIndex
      && this._dragOver?.colIndex === ci;

    return html`
      <div
        class="mc-drop-slot ${isActive ? 'active' : ''} ${isEmpty ? 'empty' : ''}"
        @dragover=${(e: DragEvent) => this._onModuleDragOver(e, ri, ci, toIndex)}
        @drop=${(e: DragEvent) => this._dropModuleAtIndex(e, ri, ci, toIndex)}
      ></div>
    `;
  }

  private _toggleRow(ri: number): void {
    if (this._collapsedRows.has(ri)) {
      this._collapsedRows.delete(ri);
    } else {
      this._collapsedRows.add(ri);
    }
    this.requestUpdate();
  }

  private _toggleCol(ri: number, ci: number): void {
    const key = `${ri}:${ci}`;
    if (this._collapsedCols.has(key)) {
      this._collapsedCols.delete(key);
    } else {
      this._collapsedCols.add(key);
    }
    this.requestUpdate();
  }
}
