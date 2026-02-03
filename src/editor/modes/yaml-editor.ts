import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, EditorState, MagicCardConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { ConfigSync } from '../state/config-sync';
import { editorStyles } from '../magic-card-editor.styles';
import { yamlEditorStyles } from './yaml-editor.styles';

@customElement('mc-yaml-editor')
export class YamlEditor extends LitElement {
  static styles = [editorStyles, yamlEditorStyles];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _yaml = '';
  @state() private _error = '';
  @state() private _editorState?: EditorState;

  private _configSync = new ConfigSync();
  private _unsubscribe?: () => void;
  private _suppressUpdate = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager) {
      this._unsubscribe = this.stateManager.subscribe((s) => {
        this._editorState = s;
        if (!this._suppressUpdate) {
          this._yaml = this._configSync.toYaml(s.config);
          this._error = '';
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
        <div class="mc-yaml-status">
          <span class="mc-yaml-status-dot ${this._error ? 'error' : ''}"></span>
          ${this._error ? 'Invalid YAML' : 'Valid YAML'}
        </div>

        <div class="mc-yaml-editor-wrapper">
          <textarea
            class="mc-yaml-textarea"
            .value=${this._yaml}
            @input=${this._onYamlInput}
            spellcheck="false"
          ></textarea>
        </div>

        ${this._error
          ? html`<div class="mc-yaml-error">${this._error}</div>`
          : nothing}
      </div>
    `;
  }

  private _onYamlInput(e: InputEvent): void {
    const yaml = (e.target as HTMLTextAreaElement).value;
    this._yaml = yaml;

    this._suppressUpdate = true;

    try {
      const config = this._configSync.fromYaml(yaml, this._editorState!.config);
      if (config) {
        this._error = '';
        this.stateManager.updateConfig(config);
      } else {
        this._error = 'Invalid YAML structure';
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Parse error';
    } finally {
      this._suppressUpdate = false;
    }
  }
}
