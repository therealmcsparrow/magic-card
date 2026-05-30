import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, EditorState, MagicCardConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { editorStyles, yamlEditorStyles } from '../../css/css';

@customElement('mc-yaml-editor')
export class YamlEditor extends LitElement {
  static styles = [editorStyles, yamlEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;

  private _unsubscribe?: () => void;
  private _suppressUpdate = false;

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

  /** Returns config with type, name, template ordered first in the YAML object */
  private _getOrderedYamlConfig(): Record<string, unknown> {
    const config = this._editorState?.config;
    if (!config) return {};

    const { type, name, template, ...rest } = config;
    return {
      type,
      name,
      template,
      ...rest,
    } as Record<string, unknown>;
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-yaml-container">
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${this._getOrderedYamlConfig()}
            @value-changed=${this._onYamlChanged}
          ></ha-yaml-editor>
        </div>
      </div>
    `;
  }

  private _onYamlChanged(e: CustomEvent): void {
    const value = e.detail.value;
    if (!this._editorState) return;
    this._suppressUpdate = true;

    try {
      if (value && typeof value === 'object') {
        const config: MagicCardConfig = {
          ...value,
          type: this._editorState.config.type,
        } as MagicCardConfig;
        this.stateManager.updateConfig(config);
      }
    } catch {
      // Errors displayed by ha-yaml-editor
    } finally {
      this._suppressUpdate = false;
    }
  }
}