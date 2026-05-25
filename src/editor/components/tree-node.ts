import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorStyles, treeEditorStyles } from '../../css/css';

export interface TreeNodeData {
  id: string;
  label: string;
  icon: string;
  type: string;
  children?: TreeNodeData[];
  badges?: Array<{ text: string; class: string }>;
  selectable?: boolean;
  draggable?: boolean;
}

@customElement('mc-tree-node')
export class TreeNode extends LitElement {
  static styles = [editorStyles, treeEditorStyles];

  @property({ attribute: false }) data?: TreeNodeData;
  @property({ type: Number }) depth = 0;
  @property({ type: Boolean }) selected = false;

  @state() private _expanded = true;

  protected render(): TemplateResult {
    if (!this.data) return html``;

    const hasChildren = this.data.children && this.data.children.length > 0;

    return html`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${this.selected ? 'selected' : ''}"
          style="padding-left: ${this.depth * 20}px"
          @click=${this._onClick}
          ?draggable=${this.data.draggable}
        >
          ${hasChildren
            ? html`<span
                class="mc-tree-toggle ${this._expanded ? 'open' : ''}"
                @click=${this._toggleExpand}
              >&#9654;</span>`
            : html`<span class="mc-tree-indent" style="width:16px"></span>`}
          ${this.data.draggable
            ? html`<span class="mc-drag-handle">
                <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
              </span>`
            : nothing}
          <span class="mc-tree-icon">
            <ha-icon icon=${this.data.icon} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${this.data.label}</span>
          <span class="mc-tree-type">${this.data.type}</span>
          ${(this.data.badges || []).map(
            (b) => html`<span class="mc-tree-badge ${b.class}">${b.text}</span>`,
          )}
        </div>
        ${this._expanded && hasChildren
          ? html`
              <div class="mc-tree-children">
                ${this.data.children!.map(
                  (child) => html`
                    <mc-tree-node
                      .data=${child}
                      .depth=${this.depth + 1}
                    ></mc-tree-node>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _toggleExpand(e: Event): void {
    e.stopPropagation();
    this._expanded = !this._expanded;
  }

  private _onClick(): void {
    if (this.data?.selectable) {
      this.dispatchEvent(
        new CustomEvent('node-selected', {
          bubbles: true,
          composed: true,
          detail: { id: this.data.id },
        }),
      );
    }
  }
}
