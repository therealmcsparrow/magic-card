import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, EditorState, RowConfig, ColumnConfig, CardModule, EditorPath } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';
import { treeEditorStyles } from './tree-editor.styles';

@customElement('mc-tree-editor')
export class TreeEditor extends LitElement {
  static styles = [editorStyles, treeEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  @state() private _expandedNodes = new Set<string>(['root']);

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

    if (!config.rows.length) {
      return html`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`;
    }

    return html`
      <div class="mc-tree">
        ${config.rows.map((row, ri) => this._renderRowNode(row, ri, selectedPath))}
      </div>
    `;
  }

  private _renderRowNode(row: RowConfig, ri: number, selectedPath: EditorPath | null): TemplateResult {
    const nodeId = `row-${ri}`;
    const expanded = this._expandedNodes.has(nodeId);

    return html`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${() => this._toggleNode(nodeId)}>
          <span class="mc-tree-toggle ${expanded ? 'open' : ''}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${ri + 1}</span>
          <span class="mc-tree-type">${row.layout || '1'}</span>
          ${row.display?.conditions?.length
            ? html`<span class="mc-tree-badge condition">C</span>`
            : nothing}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${(e: Event) => { e.stopPropagation(); this.stateManager.deleteRow(ri); }} title="Delete">&times;</button>
          </span>
        </div>
        ${expanded
          ? html`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${row.columns.map((col, ci) => this._renderColumnNode(col, ri, ci, selectedPath))}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderColumnNode(
    col: ColumnConfig,
    ri: number,
    ci: number,
    selectedPath: EditorPath | null,
  ): TemplateResult {
    const nodeId = `col-${ri}-${ci}`;
    const expanded = this._expandedNodes.has(nodeId);

    return html`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${() => this._toggleNode(nodeId)}>
          <span class="mc-tree-toggle ${expanded ? 'open' : ''}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Column ${ci + 1}</span>
          <span class="mc-tree-type">${col.modules.length} modules</span>
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${(e: Event) => {
                e.stopPropagation();
                this.dispatchEvent(
                  new CustomEvent('add-module', {
                    bubbles: true,
                    composed: true,
                    detail: { rowIndex: ri, colIndex: ci },
                  }),
                );
              }}
              title="Add module"
            >+</button>
          </span>
        </div>
        ${expanded
          ? html`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${col.modules.map((mod, mi) =>
                  this._renderModuleNode(mod, ri, ci, mi, selectedPath),
                )}
                ${col.modules.length === 0
                  ? html`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderModuleNode(
    mod: CardModule,
    ri: number,
    ci: number,
    mi: number,
    selectedPath: EditorPath | null,
  ): TemplateResult {
    const isSelected =
      selectedPath?.rowIndex === ri &&
      selectedPath?.columnIndex === ci &&
      selectedPath?.moduleIndex === mi;

    const handler = ModuleRegistry.get(mod.type);
    const hasConditions = mod.display?.conditions?.length;
    const hasActions = mod.actions?.tap_action || mod.actions?.hold_action || mod.actions?.double_tap_action;

    return html`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${isSelected ? 'selected' : ''}"
          draggable="true"
          @click=${() =>
            this.stateManager.setSelectedPath({
              rowIndex: ri,
              columnIndex: ci,
              moduleIndex: mi,
            })}
          @dragstart=${(e: DragEvent) => this._onDragStart(e, ri, ci, mi)}
          @dragover=${(e: DragEvent) => this._onDragOver(e)}
          @drop=${(e: DragEvent) => this._onDrop(e, ri, ci, mi)}
        >
          <span class="mc-drag-handle">
            <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
          </span>
          <span class="mc-tree-icon">
            <ha-icon icon=${handler?.metadata.icon || 'mdi:puzzle'} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${handler?.metadata.name || mod.type}</span>
          <span class="mc-tree-type">${mod.type}</span>
          ${hasConditions
            ? html`<span class="mc-tree-badge condition">C</span>`
            : nothing}
          ${hasActions
            ? html`<span class="mc-tree-badge action">A</span>`
            : nothing}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${(e: Event) => {
                e.stopPropagation();
                this.stateManager.deleteModule(ri, ci, mi);
              }}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `;
  }

  private _toggleNode(nodeId: string): void {
    if (this._expandedNodes.has(nodeId)) {
      this._expandedNodes.delete(nodeId);
    } else {
      this._expandedNodes.add(nodeId);
    }
    this.requestUpdate();
  }

  // Drag and drop
  private _dragData?: { ri: number; ci: number; mi: number };

  private _onDragStart(e: DragEvent, ri: number, ci: number, mi: number): void {
    this._dragData = { ri, ci, mi };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify({ ri, ci, mi }));
    }
  }

  private _onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }

  private _onDrop(e: DragEvent, toRi: number, toCi: number, toMi: number): void {
    e.preventDefault();
    if (!this._dragData) return;

    const { ri: fromRi, ci: fromCi, mi: fromMi } = this._dragData;
    if (fromRi === toRi && fromCi === toCi && fromMi === toMi) return;

    this.stateManager.moveModule(fromRi, fromCi, fromMi, toRi, toCi, toMi);
    this._dragData = undefined;
  }
}
