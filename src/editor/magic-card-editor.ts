import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  MagicCardConfig,
  HomeAssistant,
  EditorState,
  EditorMode,
  CardModule,
} from '../types';
import {
  renderTextField,
  renderColorField,
  renderUnitField,
} from '../utils/form-utils';
import { EDITOR_TAG } from '../utils/constants';
import { editorStyles } from './magic-card-editor.styles';
import { EditorStateManager } from './state/editor-state';

// Import editor modes
import './modes/form-editor';
import './modes/yaml-editor';
import './modes/tree-editor';

// Import panels
import './panels/module-selector';

// Import components
import './components/color-picker';
import './components/unit-field';
import './components/entity-picker';
import './components/service-picker';
import './components/icon-picker';
import './components/settings-modal';
import './components/card-picker';
import './components/media-picker';

@customElement(EDITOR_TAG)
export class MagicCardEditor extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false })
  hass?: HomeAssistant;

  @property({ attribute: false })
  lovelace?: unknown;

  @state()
  private _editorState?: EditorState;

  @state()
  private _showModuleSelector = false;

  @state()
  private _moduleSelectorTarget?: { rowIndex: number; colIndex: number };

  @state()
  private _showSettingsModal = false;

  @state()
  private _showCardSettingsModal = false;

  private _stateManager!: EditorStateManager;
  private _unsubscribe?: () => void;
  private _pendingConfig?: MagicCardConfig;

  connectedCallback(): void {
    super.connectedCallback();
    this._stateManager = new EditorStateManager((config) => {
      this.dispatchEvent(
        new CustomEvent('config-changed', {
          bubbles: true,
          composed: true,
          detail: { config },
        }),
      );
    });

    this._unsubscribe = this._stateManager.subscribe((state) => {
      this._editorState = state;
      // Auto-open modal when module is selected
      if (state.selectedPath?.moduleIndex !== undefined) {
        this._showSettingsModal = true;
      }
    });

    // Apply config that was set before connectedCallback
    if (this._pendingConfig) {
      this._stateManager.setConfig(this._pendingConfig);
      this._pendingConfig = undefined;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._stateManager?.destroy();
  }

  setConfig(config: MagicCardConfig): void {
    if (this._stateManager) {
      this._stateManager.setConfig(config);
    } else {
      // Store config to apply when connected
      this._pendingConfig = config;
    }
  }

  protected render(): TemplateResult {
    if (!this._editorState) {
      return html`<div class="mc-editor">Loading...</div>`;
    }

    const { editorMode } = this._editorState;

    return html`
      <div class="mc-editor">
        ${this._renderModeSwitcher(editorMode)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(editorMode)}
        ${this._showModuleSelector ? this._renderModuleSelectorDialog() : nothing}
        ${this._renderSettingsModal()}
        ${this._showCardSettingsModal ? this._renderCardSettingsModal() : nothing}
      </div>
    `;
  }

  private _renderModeSwitcher(mode: EditorMode): TemplateResult {
    return html`
      <div class="mc-mode-switcher">
        <button
          class="mc-mode-btn ${mode === 'form' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('form')}
        >
          <ha-icon icon="mdi:form-select" style="--mdc-icon-size:16px"></ha-icon>
          Form
        </button>
        <button
          class="mc-mode-btn ${mode === 'yaml' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('yaml')}
        >
          <ha-icon icon="mdi:code-braces" style="--mdc-icon-size:16px"></ha-icon>
          YAML
        </button>
        <button
          class="mc-mode-btn ${mode === 'tree' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('tree')}
        >
          <ha-icon icon="mdi:file-tree" style="--mdc-icon-size:16px"></ha-icon>
          Tree
        </button>
      </div>
    `;
  }

  private _renderToolbar(): TemplateResult {
    return html`
      <div class="mc-editor-toolbar">
        <button
          class="mc-toolbar-btn"
          ?disabled=${!this._stateManager.canUndo()}
          @click=${() => this._stateManager.undo()}
          title="Undo"
        >
          <ha-icon icon="mdi:undo" style="--mdc-icon-size:18px"></ha-icon>
        </button>
        <button
          class="mc-toolbar-btn"
          ?disabled=${!this._stateManager.canRedo()}
          @click=${() => this._stateManager.redo()}
          title="Redo"
        >
          <ha-icon icon="mdi:redo" style="--mdc-icon-size:18px"></ha-icon>
        </button>
        <span class="mc-toolbar-spacer"></span>
        <button
          class="mc-btn mc-btn-secondary"
          @click=${() => this._stateManager.addRow('1')}
          title="Add Row"
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          Add Row
        </button>
      </div>
    `;
  }

  private _renderEditorMode(mode: EditorMode): TemplateResult {
    switch (mode) {
      case 'form':
        return html`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
            @open-card-settings=${() => { this._showCardSettingsModal = true; }}
          ></mc-form-editor>
        `;
      case 'yaml':
        return html`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;
      case 'tree':
        return html`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `;
    }
  }

  private _renderSettingsModal(): TemplateResult {
    const selectedModule = this._stateManager?.getSelectedModule();
    if (!selectedModule || !this._showSettingsModal) return html``;

    const { selectedPath } = this._editorState!;

    const handleChange = (updated: CardModule) => {
      if (selectedPath?.rowIndex !== undefined &&
          selectedPath?.columnIndex !== undefined &&
          selectedPath?.moduleIndex !== undefined) {
        this._stateManager.updateModule(
          selectedPath.rowIndex,
          selectedPath.columnIndex,
          selectedPath.moduleIndex,
          updated,
        );
      }
    };

    return html`
      <mc-settings-modal
        .module=${selectedModule}
        .hass=${this.hass}
        .open=${true}
        .onChange=${handleChange}
        @close=${() => {
          this._showSettingsModal = false;
          this._stateManager.setSelectedPath(null);
        }}
      ></mc-settings-modal>
    `;
  }

  private _renderCardSettingsModal(): TemplateResult {
    const config = this._editorState!.config;
    const updateConfig = (updates: Partial<MagicCardConfig>) => {
      this._stateManager.updateConfig({ ...config, ...updates });
    };

    return html`
      <div class="mc-modal-overlay" @click=${() => { this._showCardSettingsModal = false; }}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span class="mc-modal-title">Card Settings</span>
            <button class="mc-modal-close" @click=${() => { this._showCardSettingsModal = false; }}>&times;</button>
          </div>
          <div class="mc-modal-body">
            <div class="mc-tab-content">
              ${renderColorField('Background', config.background, (v) => updateConfig({ background: v }))}
              ${renderUnitField('Border Radius', config.border_radius, (v) => updateConfig({ border_radius: v }))}
              ${renderUnitField('Padding', config.padding, (v) => updateConfig({ padding: v }))}
              ${renderTextField('Box Shadow', config.box_shadow, (v) => updateConfig({ box_shadow: v }))}
              ${renderUnitField('Card Height', config.card_height, (v) => updateConfig({ card_height: v }))}
            </div>
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${() => { this._showCardSettingsModal = false; }}>Done</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderModuleSelectorDialog(): TemplateResult {
    return html`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${() => { this._showModuleSelector = false; }}
      ></mc-module-selector>
    `;
  }

  private _onAddModule = (e: CustomEvent) => {
    this._moduleSelectorTarget = e.detail;
    this._showModuleSelector = true;
  };

  private _onModuleSelected = (e: CustomEvent) => {
    if (this._moduleSelectorTarget) {
      this._stateManager.addModule(
        this._moduleSelectorTarget.rowIndex,
        this._moduleSelectorTarget.colIndex,
        e.detail.type,
      );
    }
    this._showModuleSelector = false;
    this._moduleSelectorTarget = undefined;
  };
}
