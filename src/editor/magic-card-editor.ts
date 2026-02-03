import { LitElement, html, TemplateResult, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  MagicCardConfig,
  HomeAssistant,
  EditorState,
  EditorMode,
  EditorTab,
  CardModule,
} from '../types';
import { EDITOR_TAG } from '../utils/constants';
import { editorStyles } from './magic-card-editor.styles';
import { EditorStateManager } from './state/editor-state';
import { ModuleRegistry } from '../modules/module-registry';

// Import editor modes
import './modes/form-editor';
import './modes/yaml-editor';
import './modes/tree-editor';

// Import editor tabs
import './tabs/general-tab';
import './tabs/actions-tab';
import './tabs/logic-tab';
import './tabs/design-tab';

// Import panels
import './panels/module-selector';

// Import components
import './components/color-picker';

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

    const { editorMode, selectedPath } = this._editorState;
    const selectedModule = this._stateManager.getSelectedModule();

    return html`
      <div class="mc-editor">
        ${this._renderModeSwitcher(editorMode)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(editorMode)}
        ${selectedModule ? this._renderSettingsPanel(selectedModule) : nothing}
        ${this._showModuleSelector ? this._renderModuleSelectorDialog() : nothing}
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
          + Row
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

  private _renderSettingsPanel(module: CardModule): TemplateResult {
    const handler = ModuleRegistry.get(module.type);
    if (!handler) return html``;

    const availableTabs = handler.getAvailableTabs();
    const { activeTab, selectedPath } = this._editorState!;
    const currentTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0];

    const onModuleChange = (updated: CardModule) => {
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
      <div class="mc-settings-panel">
        <div class="mc-settings-header">
          <ha-icon icon=${handler.metadata.icon} style="--mdc-icon-size:18px"></ha-icon>
          ${handler.metadata.name}
          <span class="mc-toolbar-spacer"></span>
          <button class="mc-btn-icon" @click=${() => this._stateManager.setSelectedPath(null)}>
            &times;
          </button>
        </div>

        <div class="mc-settings-tabs">
          ${availableTabs.map(
            (tab) => html`
              <button
                class="mc-settings-tab ${currentTab === tab ? 'active' : ''}"
                @click=${() => this._stateManager.setActiveTab(tab)}
              >
                ${tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            `,
          )}
        </div>

        <div class="mc-settings-content">
          ${this._renderTabContent(currentTab, module, handler, onModuleChange)}
        </div>
      </div>
    `;
  }

  private _renderTabContent(
    tab: EditorTab,
    module: CardModule,
    handler: import('../modules/module-types').MagicModule,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    switch (tab) {
      case 'general':
        return handler.renderGeneralTab(module, this.hass, onChange);
      case 'actions':
        return handler.renderActionsTab
          ? handler.renderActionsTab(module, this.hass, onChange)
          : html`<p>No actions available</p>`;
      case 'logic':
        return handler.renderLogicTab
          ? handler.renderLogicTab(module, this.hass, onChange)
          : html`<p>No logic available</p>`;
      case 'design':
        return handler.renderDesignTab
          ? handler.renderDesignTab(module, this.hass, onChange)
          : html`<p>No design options</p>`;
    }
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
