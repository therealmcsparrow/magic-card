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

  @state() private _configObj?: Record<string, unknown>;
  @state() private _editorState?: EditorState;

  private _unsubscribe?: () => void;
  private _suppressUpdate = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager) {
      this._unsubscribe = this.stateManager.subscribe((s) => {
        this._editorState = s;
        if (!this._suppressUpdate) {
          // Strip 'type' — it's managed by HA, not the user
          const { type, ...rest } = s.config;
          this._configObj = rest as Record<string, unknown>;
        }
      });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-yaml-container">
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${this._configObj}
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
    } catch (err) {
      // Errors will be displayed by the ha-yaml-editor component itself.
    } finally {
      this._suppressUpdate = false;
    }
  }
}
