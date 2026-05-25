import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  MagicCardConfig,
  HomeAssistant,
  EditorState,
  EditorMode,
  CardModule,
  DisplayConfig,
  DisplayCondition,
  ConditionalCardAppearance,
  CardAppearanceOverrides,
} from '../types';
import { deepClone } from '../utils/deep-merge';
import { SyncContext } from '../utils/sync-path';
import { mergeTemplateWithOverrides } from '../services/template-merge';
import { generateId } from '../utils/id-generator';
import {
  renderTextField,
  renderColorField,
  renderUnitField,
  renderMediaField,
  renderToggleField,
  renderSelectField,
  renderBoxField,
  renderEntityField,
  renderTextareaField,
} from '../utils/form-utils';
import { EDITOR_TAG } from '../utils/constants';
import { editorStyles, modalStyles } from '../css/css';
import { EditorStateManager } from './state/editor-state';
import { Breakpoint, ResponsiveService } from '../services/responsive-service';
import { ModuleRegistry } from '../modules/module-registry';

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
import './components/template-picker';
import './components/box-field';

@customElement(EDITOR_TAG)
export class MagicCardEditor extends LitElement {
  static styles = [editorStyles, modalStyles];

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

  @state()
  private _cardSettingsTab: 'appearance' | 'conditions' = 'appearance';

  @state()
  private _expandedAppearanceRules = new Set<string>();

  @state()
  private _showTemplatePicker: 'create' | 'link' | null = null;

  @state()
  private _linkedTemplate: string | null = null;

  @state()
  private _showLinkedPopup = false;

  @state()
  private _showSyncDialog = false;

  @state()
  private _pendingSyncAction?: () => void;

  @state()
  private _breakpoint: Breakpoint = 'md';

  private _stateManager!: EditorStateManager;
  private _unsubscribe?: () => void;
  private _pendingConfig?: MagicCardConfig;
  private _initialTemplateFetched = false;
  private _responsive = new ResponsiveService();

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
      this._linkedTemplate = state.config.template ?? null;
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
    this._responsive.disconnect();
  }

  protected firstUpdated(): void {
    const editorRoot = this.renderRoot.querySelector('.mc-editor') as HTMLElement | null;
    if (!editorRoot) return;
    this._responsive.observe(editorRoot);
    this._breakpoint = this._responsive.getCurrentBreakpoint();
    this._responsive.onBreakpointChange((bp) => {
      this._breakpoint = bp;
    });
  }

  setConfig(config: MagicCardConfig): void {
    if (this._stateManager) {
      this._stateManager.setConfig(config);
      // Only fetch template on the first call, not on every config-changed round-trip
      if (config.template && this.hass && !this._initialTemplateFetched) {
        this._initialTemplateFetched = true;
        this._fetchAndApplyTemplate(config.template, config);
      }
    } else {
      // Store config to apply when connected
      this._pendingConfig = config;
    }
  }

  private async _fetchAndApplyTemplate(
    name: string,
    local: MagicCardConfig,
  ): Promise<void> {
    if (!this.hass) return;
    try {
      const result = await this.hass.callWS<{
        templates: Record<string, { config: Omit<MagicCardConfig, 'type'> & { type?: string }; description?: string }>;
      }>({ type: 'magic_card_utils/get_templates' });
      const entry = result.templates?.[name];
      if (entry) {
        const resolved = mergeTemplateWithOverrides(
          entry.config as MagicCardConfig,
          local,
        );
        this._stateManager.setConfig(resolved);
      }
    } catch (err) {
      console.warn('Magic Card Editor: Failed to fetch template', name, err);
    }
  }

  protected render(): TemplateResult {
    if (!this._editorState) {
      return html`
        <div class="mc-editor mc-editor-skeleton" aria-busy="true" aria-label="Loading editor">
          <div class="mc-skel mc-skel-switcher"></div>
          <div class="mc-skel mc-skel-line mc-skel-line-short"></div>
          <div class="mc-skel-toolbar">
            <div class="mc-skel mc-skel-icon-btn"></div>
            <div class="mc-skel mc-skel-icon-btn"></div>
            <div class="mc-skel-spacer"></div>
            <div class="mc-skel mc-skel-pill"></div>
          </div>
          <div class="mc-skel mc-skel-card-header"></div>
          <div class="mc-skel mc-skel-row"></div>
          <div class="mc-skel mc-skel-row"></div>
        </div>
      `;
    }

    const { editorMode } = this._editorState;

    return html`
      <div class="mc-editor mc-bp-${this._breakpoint}">
        ${this._renderModeSwitcher(editorMode)}
        ${this._renderModeHelp(editorMode)}
        ${this._renderToolbar()}
        ${this._renderSelectionContext()}
        ${this._renderEditorMode(editorMode)}
        ${this._showCardSettingsModal ? this._renderCardSettingsModal() : nothing}
        ${this._showModuleSelector ? this._renderModuleSelectorDialog() : nothing}
        ${this._showTemplatePicker ? this._renderTemplatePicker() : nothing}
        ${this._renderSettingsModal()}
      </div>
    `;
  }

  private _renderModeSwitcher(mode: EditorMode): TemplateResult {
    return html`
      <div class="mc-mode-switcher">
        <button
          class="mc-mode-btn ${mode === 'form' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('form')}
          aria-label="Switch to Form mode"
        >
          <ha-icon icon="mdi:form-select" style="--mdc-icon-size:16px"></ha-icon>
          Form
        </button>
        <button
          class="mc-mode-btn ${mode === 'yaml' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('yaml')}
          aria-label="Switch to YAML mode"
        >
          <ha-icon icon="mdi:code-braces" style="--mdc-icon-size:16px"></ha-icon>
          YAML
        </button>
        <button
          class="mc-mode-btn ${mode === 'tree' ? 'active' : ''}"
          @click=${() => this._stateManager.setEditorMode('tree')}
          aria-label="Switch to Tree mode"
        >
          <ha-icon icon="mdi:file-tree-outline" style="--mdc-icon-size:16px"></ha-icon>
          Tree
        </button>
      </div>
    `;
  }

  private _renderModeHelp(mode: EditorMode): TemplateResult {
    const text = mode === 'form'
      ? 'Form mode: visual layout editing with drag/drop and quick actions.'
      : mode === 'yaml'
        ? 'YAML mode: direct config editing with instant sync.'
        : 'Tree mode: structure-first editing for large cards.';

    return html`<div class="mc-mode-help">${text}</div>`;
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
        ${this._linkedTemplate
          ? html`
              <div class="mc-toolbar-linked-container">
                <button
                  type="button"
                  class="mc-linked-indicator"
                  title="Linked to template '${this._linkedTemplate}'"
                  aria-label="Open template link details"
                  @click=${() => { this._showLinkedPopup = !this._showLinkedPopup; }}
                >
                  <ha-icon icon="mdi:link-variant" style="--mdc-icon-size:18px"></ha-icon>
                  ${this._getTotalNotSyncedCount() > 0 ? html`
                    <span class="mc-linked-badge">${this._getTotalNotSyncedCount()}</span>
                  ` : nothing}
                </button>
                ${this._showLinkedPopup ? this._renderLinkedPopup() : nothing}
              </div>
            `
          : html`
              <button
                class="mc-toolbar-btn"
                @click=${() => { this._showTemplatePicker = 'create'; }}
                title="Create Template"
              >
                <ha-icon icon="mdi:file-document-plus-outline" style="--mdc-icon-size:18px"></ha-icon>
              </button>
              <button
                class="mc-toolbar-btn"
                @click=${() => { this._showTemplatePicker = 'link'; }}
                title="Load Template"
              >
                <ha-icon icon="mdi:file-document-multiple-outline" style="--mdc-icon-size:18px"></ha-icon>
              </button>
            `}
        <button
          class="mc-btn mc-btn-secondary"
          @click=${() => this._handleAddRow()}
          title="Add Row"
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          Add Row
        </button>
      </div>
      ${this._showSyncDialog ? this._renderSyncDialog() : nothing}
    `;
  }

  private _renderSelectionContext(): TemplateResult {
    const selected = this._editorState?.selectedPath;
    if (
      !selected ||
      selected.rowIndex === undefined ||
      selected.columnIndex === undefined ||
      selected.moduleIndex === undefined
    ) {
      return html``;
    }

    const mod = this._stateManager.getSelectedModule();
    if (!mod) return html``;

    const metadata = ModuleRegistry.get(mod.type)?.metadata;
    const moduleName = metadata?.name || mod.type;

    return html`
      <div class="mc-selected-context" aria-live="polite">
        <ha-icon icon="mdi:target" style="--mdc-icon-size:16px"></ha-icon>
        <span>
          Editing <strong>${moduleName}</strong>
          at Row ${selected.rowIndex + 1}, Column ${selected.columnIndex + 1}, Position ${selected.moduleIndex + 1}
        </span>
      </div>
    `;
  }

  /**
   * Collect all not_synced entries from the entire config tree.
   * Returns an array of { location, paths } objects.
   */
  private _collectNotSyncedEntries(): Array<{ location: string; paths: string[] }> {
    const config = this._editorState!.config;
    const entries: Array<{ location: string; paths: string[] }> = [];

    // Card-level
    if (config.not_synced?.length) {
      entries.push({ location: 'Card', paths: [...config.not_synced] });
    }

    // Rows, columns, modules
    for (let ri = 0; ri < (config.rows || []).length; ri++) {
      const row = config.rows[ri];
      if (row.not_synced?.length) {
        entries.push({ location: `Row ${ri + 1}`, paths: [...row.not_synced] });
      }
      for (let ci = 0; ci < (row.columns || []).length; ci++) {
        const col = row.columns[ci];
        if (col.not_synced?.length) {
          entries.push({ location: `Row ${ri + 1} / Col ${ci + 1}`, paths: [...col.not_synced] });
        }
        for (let mi = 0; mi < (col.modules || []).length; mi++) {
          const mod = col.modules[mi];
          if (mod.not_synced?.length) {
            const name = (mod as Record<string, unknown>).label || mod.type;
            entries.push({ location: `${name}`, paths: [...(mod.not_synced as string[])] });
          }
        }
      }
    }

    return entries;
  }

  private _getTotalNotSyncedCount(): number {
    return this._collectNotSyncedEntries().reduce((sum, e) => sum + e.paths.length, 0);
  }

  private _resyncAll(): void {
    const config = deepClone(this._editorState!.config);

    // Remove all not_synced arrays
    delete config.not_synced;
    for (const row of config.rows || []) {
      delete row.not_synced;
      for (const col of row.columns || []) {
        delete col.not_synced;
        for (const mod of col.modules || []) {
          delete (mod as Record<string, unknown>).not_synced;
        }
      }
    }

    this._stateManager.updateConfig(config);

    // Re-fetch template to restore synced values
    if (this._linkedTemplate && this.hass) {
      this._initialTemplateFetched = false;
      this._fetchAndApplyTemplate(this._linkedTemplate, config);
    }
    this._showLinkedPopup = false;
  }

  private _renderLinkedPopup(): TemplateResult {
    const notSyncedEntries = this._collectNotSyncedEntries();
    const totalCount = notSyncedEntries.reduce((sum, e) => sum + e.paths.length, 0);

    return html`
      <div class="mc-linked-popup">
        <div class="mc-linked-popup-name">
          <ha-icon icon="mdi:file-document-outline" style="--mdc-icon-size:18px"></ha-icon>
          ${this._linkedTemplate}
        </div>

        ${totalCount > 0 ? html`
          <div class="mc-linked-popup-sync-summary">
            <div class="mc-sync-summary-header">
              <ha-icon icon="mdi:link-variant-off" style="--mdc-icon-size:14px; color: var(--warning-color);"></ha-icon>
              ${totalCount} local override${totalCount > 1 ? 's' : ''}
            </div>
            <div class="mc-sync-summary-list">
              ${notSyncedEntries.map(entry => html`
                <div class="mc-sync-summary-item">
                  <span class="mc-sync-summary-location">${entry.location}</span>
                  <span class="mc-sync-summary-paths">${entry.paths.map(p => p.replace('design.', '')).join(', ')}</span>
                </div>
              `)}
            </div>
          </div>
        ` : html`
          <div class="mc-linked-popup-sync-summary">
            <div class="mc-sync-summary-header synced">
              <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size:14px; color: var(--success-color);"></ha-icon>
              Fully synced
            </div>
          </div>
        `}

        <div class="mc-linked-popup-actions">
          ${totalCount > 0 ? html`
            <button class="mc-linked-popup-btn" @click=${() => this._resyncAll()}>
              <ha-icon icon="mdi:sync" style="--mdc-icon-size:16px"></ha-icon>
              Re-sync All
            </button>
          ` : nothing}
          <button class="mc-linked-popup-btn" @click=${this._saveToTemplate}>
            <ha-icon icon="mdi:content-save-outline" style="--mdc-icon-size:16px"></ha-icon>
            Save to Template
          </button>
          <button class="mc-linked-popup-btn danger" @click=${this._unlinkTemplate}>
            <ha-icon icon="mdi:link-variant-off" style="--mdc-icon-size:16px"></ha-icon>
            Unlink
          </button>
        </div>
      </div>
    `;
  }

  private _renderSyncDialog(): TemplateResult {
    return html`
      <div class="mc-sync-dialog" @click=${() => { this._showSyncDialog = false; this._pendingSyncAction = undefined; }}>
        <div class="mc-sync-dialog-content" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-sync-dialog-title">
            <ha-icon icon="mdi:sync" style="--mdc-icon-size:20px; color: var(--primary-color)"></ha-icon>
            Update Linked Cards?
          </div>
          <div class="mc-sync-dialog-text">
            This card is linked to template "${this._linkedTemplate}". Do you want to update all linked cards with this structural change?
          </div>
          <div class="mc-sync-dialog-actions">
            <button class="mc-btn mc-btn-secondary" @click=${this._handleSyncNo}>
              No, only this card
            </button>
            <button class="mc-btn mc-btn-primary" @click=${this._handleSyncYes}>
              Yes, update all
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _handleAddRow(): void {
    if (this._linkedTemplate) {
      this._pendingSyncAction = () => this._stateManager.addRow('1');
      this._showSyncDialog = true;
    } else {
      this._stateManager.addRow('1');
    }
  }

  private _handleSyncNo = (): void => {
    this._pendingSyncAction?.();
    this._showSyncDialog = false;
    this._pendingSyncAction = undefined;
  };

  private _handleSyncYes = async (): Promise<void> => {
    this._pendingSyncAction?.();
    this._showSyncDialog = false;
    this._pendingSyncAction = undefined;
    // Save to template to propagate change
    await this._saveToTemplate();
  };

  private _renderEditorMode(mode: EditorMode): TemplateResult {
    switch (mode) {
      case 'tree':
        return html`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `;
      case 'yaml':
        return html`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;
      case 'form':
      default:
        return html`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
            @open-card-settings=${() => { this._showCardSettingsModal = true; }}
            @request-add-row=${() => this._handleAddRow()}
          ></mc-form-editor>
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
        .template=${this._editorState!.config.template}
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
    const hasTemplate = !!config.template;

    // Build sync context for card-level properties
    const syncCtx: SyncContext | undefined = hasTemplate
      ? { templateName: config.template!, notSynced: config.not_synced || [], basePath: '' }
      : undefined;

    const updateConfig = (propertyName: keyof MagicCardConfig, value: unknown) => {
      const updates: Partial<MagicCardConfig> = { [propertyName]: value } as Partial<MagicCardConfig>;
      if (hasTemplate) {
        const currentNotSynced = new Set(config.not_synced || []);
        currentNotSynced.add(propertyName as string);
        updates.not_synced = Array.from(currentNotSynced);
      }
      this._stateManager.updateConfig({ ...config, ...updates });
    };

    const tab = this._cardSettingsTab;

    return html`
      <div class="mc-modal-overlay" @click=${() => { this._showCardSettingsModal = false; }}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}
             @field-sync-toggle=${(e: CustomEvent) => {
               if (!hasTemplate) return;
               const { propertyPath, synced } = e.detail;
               const ns = new Set(config.not_synced || []);
               if (synced) ns.add(propertyPath); else ns.delete(propertyPath);
               this._stateManager.updateConfig({ ...config, not_synced: Array.from(ns) });
             }}>
          <div class="mc-modal-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span class="mc-modal-title">Card Settings</span>
            <button class="mc-modal-close" @click=${() => { this._showCardSettingsModal = false; }}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            <button
              class="mc-modal-tab ${tab === 'appearance' ? 'active' : ''}"
              @click=${() => { this._cardSettingsTab = 'appearance'; }}
            >
              <ha-icon icon="mdi:palette"></ha-icon>
              Appearance
            </button>
            <button
              class="mc-modal-tab ${tab === 'conditions' ? 'active' : ''}"
              @click=${() => { this._cardSettingsTab = 'conditions'; }}
            >
              <ha-icon icon="mdi:filter-outline"></ha-icon>
              Conditions
            </button>
          </div>

          <div class="mc-modal-body">
            ${tab === 'appearance'
              ? this._renderCardAppearanceTab(config, updateConfig, syncCtx)
              : this._renderCardConditionsTab(config, syncCtx)}
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${() => { this._showCardSettingsModal = false; }}>Done</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderCardAppearanceTab(
    config: MagicCardConfig,
    updateConfig: (propertyName: keyof MagicCardConfig, value: unknown) => void,
    syncCtx: SyncContext | undefined,
  ): TemplateResult {
    const themeNames = Object.keys(this.hass?.themes?.themes || {}).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );
    const selectedTheme = config.theme || '__default__';
    const usePageTheme = config.use_page_theme !== false;
    const themeOptions = [
      { label: 'Home Assistant Default', value: '__default__' },
      ...themeNames.map((name) => ({ label: name, value: name })),
    ];

    return html`
      <div class="mc-tab-content">
        ${renderColorField('Background Color', config.background, (v) => updateConfig('background', v), 'background', syncCtx)}
        ${renderMediaField('Background Image', config.background_image, (v) => updateConfig('background_image', v), this.hass, 'image', 'background_image', syncCtx)}
        ${renderToggleField('Use Dashboard Theme', usePageTheme, (v) => updateConfig('use_page_theme', v), 'use_page_theme', syncCtx)}
        ${!usePageTheme
          ? renderSelectField(
              'Card Theme',
              selectedTheme,
              themeOptions,
              (v) => updateConfig('theme', v === '__default__' ? undefined : v),
              'theme',
              syncCtx,
            )
          : nothing}
        ${renderUnitField('Border Radius', config.border_radius, (v) => updateConfig('border_radius', v), 'border_radius', syncCtx)}
        ${renderBoxField('Padding', config.padding, (v) => updateConfig('padding', v), 'padding', 'padding', syncCtx)}
        ${renderTextField('Box Shadow', config.box_shadow, (v) => updateConfig('box_shadow', v), 'box_shadow', syncCtx)}
        ${renderUnitField('Card Height', config.card_height, (v) => updateConfig('card_height', v), 'card_height', syncCtx)}

        ${this._renderConditionalAppearanceSection(config, themeOptions)}
      </div>
    `;
  }

  private _renderConditionalAppearanceSection(
    config: MagicCardConfig,
    themeOptions: Array<{ label: string; value: string }>,
  ): TemplateResult {
    const rules = config.conditional_appearance || [];

    const writeRules = (next: ConditionalCardAppearance[]) => {
      const updates: Partial<MagicCardConfig> = { conditional_appearance: next };
      if (config.template) {
        const ns = new Set(config.not_synced || []);
        ns.add('conditional_appearance');
        updates.not_synced = Array.from(ns);
      }
      this._stateManager.updateConfig({ ...config, ...updates });
    };

    const addRule = () => {
      const id = generateId('appr');
      const newRule: ConditionalCardAppearance = {
        id,
        name: `Rule ${rules.length + 1}`,
        conditions: [],
        mode: 'every',
        overrides: {},
      };
      this._expandedAppearanceRules.add(id);
      writeRules([...rules, newRule]);
    };

    const removeRule = (id: string) => {
      this._expandedAppearanceRules.delete(id);
      writeRules(rules.filter((r) => r.id !== id));
    };

    const updateRule = (id: string, patch: Partial<ConditionalCardAppearance>) => {
      writeRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    };

    const toggleExpanded = (id: string) => {
      if (this._expandedAppearanceRules.has(id)) {
        this._expandedAppearanceRules.delete(id);
      } else {
        this._expandedAppearanceRules.add(id);
      }
      this.requestUpdate();
    };

    return html`
      <div class="mc-cond-appearance-section">
        <div class="mc-cond-appearance-header">
          <ha-icon icon="mdi:filter-variant"></ha-icon>
          <span>Conditional Appearance</span>
        </div>
        <div class="mc-mode-help">
          Override appearance fields when conditions are met. Rules apply in order; later rules win.
        </div>

        <div class="mc-cond-appearance-list">
          ${rules.map((rule) => this._renderAppearanceRule(rule, themeOptions, toggleExpanded, updateRule, removeRule))}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${addRule}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Rule
        </button>
      </div>
    `;
  }

  private _renderAppearanceRule(
    rule: ConditionalCardAppearance,
    themeOptions: Array<{ label: string; value: string }>,
    toggleExpanded: (id: string) => void,
    updateRule: (id: string, patch: Partial<ConditionalCardAppearance>) => void,
    removeRule: (id: string) => void,
  ): TemplateResult {
    const expanded = this._expandedAppearanceRules.has(rule.id);
    const conditions = rule.conditions || [];
    const mode = rule.mode || 'every';
    const overrides = rule.overrides || {};

    const addCondition = () => {
      const newCondition: DisplayCondition = {
        id: generateId('cond'),
        type: 'state',
        entity: '',
        state: '',
      };
      updateRule(rule.id, { conditions: [...conditions, newCondition] });
    };

    const updateCondition = (cid: string, updates: Partial<DisplayCondition>) => {
      updateRule(rule.id, {
        conditions: conditions.map((c) => (c.id === cid ? { ...c, ...updates } : c)),
      });
    };

    const removeCondition = (cid: string) => {
      updateRule(rule.id, { conditions: conditions.filter((c) => c.id !== cid) });
    };

    const updateOverride = (key: keyof CardAppearanceOverrides, value: unknown) => {
      const next: CardAppearanceOverrides = { ...overrides };
      if (value === undefined || value === '' || value === null) {
        delete (next as Record<string, unknown>)[key];
      } else {
        (next as Record<string, unknown>)[key] = value;
      }
      updateRule(rule.id, { overrides: next });
    };

    const usePageTheme = overrides.use_page_theme;
    const selectedTheme = overrides.theme || '__default__';

    return html`
      <div class="mc-cond-appearance-rule ${expanded ? 'expanded' : ''}">
        <div class="mc-cond-appearance-rule-header" @click=${() => toggleExpanded(rule.id)}>
          <ha-icon icon=${expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
          <input
            class="mc-cond-appearance-rule-name"
            type="text"
            .value=${rule.name || ''}
            placeholder="Rule name"
            @click=${(e: Event) => e.stopPropagation()}
            @input=${(e: InputEvent) => updateRule(rule.id, { name: (e.target as HTMLInputElement).value })}
          />
          <span class="mc-cond-appearance-rule-count">${conditions.length} cond.</span>
          <button
            class="mc-btn-icon"
            @click=${(e: Event) => { e.stopPropagation(); removeRule(rule.id); }}
            title="Remove rule"
          >
            <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:14px"></ha-icon>
          </button>
        </div>

        ${expanded ? html`
          <div class="mc-cond-appearance-rule-body">
            <div class="mc-cond-appearance-subhead">Conditions</div>
            ${conditions.length > 1
              ? renderSelectField(
                  'Mode',
                  mode,
                  [
                    { label: 'All conditions (AND)', value: 'every' },
                    { label: 'Any condition (OR)', value: 'any' },
                  ],
                  (v) => updateRule(rule.id, { mode: v as 'every' | 'any' }),
                )
              : nothing}

            <div class="mc-conditions-list">
              ${conditions.map((cond) => html`
                <div class="mc-condition-item">
                  ${renderSelectField(
                    'Type',
                    cond.type,
                    [
                      { label: 'State', value: 'state' },
                      { label: 'Attribute', value: 'attribute' },
                      { label: 'Time', value: 'time' },
                      { label: 'Template', value: 'template' },
                    ],
                    (v) => updateCondition(cond.id, { type: v as DisplayCondition['type'] }),
                  )}
                  ${cond.type === 'state' || cond.type === 'attribute'
                    ? html`
                        ${renderEntityField('Entity', cond.entity, (v) =>
                          updateCondition(cond.id, { entity: v }), this.hass,
                        )}
                        ${cond.type === 'attribute'
                          ? renderTextField('Attribute', cond.attribute, (v) =>
                              updateCondition(cond.id, { attribute: v }),
                            )
                          : nothing}
                        ${renderTextField('State equals', cond.state, (v) =>
                          updateCondition(cond.id, { state: v }),
                        )}
                        ${renderTextField('State not equals', cond.state_not, (v) =>
                          updateCondition(cond.id, { state_not: v }),
                        )}
                      `
                    : nothing}
                  ${cond.type === 'time'
                    ? html`
                        ${renderTextField('After (HH:MM)', cond.after, (v) =>
                          updateCondition(cond.id, { after: v }),
                        )}
                        ${renderTextField('Before (HH:MM)', cond.before, (v) =>
                          updateCondition(cond.id, { before: v }),
                        )}
                      `
                    : nothing}
                  ${cond.type === 'template'
                    ? renderTextareaField(
                        'Template',
                        cond.template,
                        (v) => updateCondition(cond.id, { template: v }),
                        { rows: 3 },
                      )
                    : nothing}
                  <button class="mc-btn-icon" @click=${() => removeCondition(cond.id)} title="Remove condition">
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                  </button>
                </div>
              `)}
            </div>

            <button class="mc-btn mc-btn-secondary mc-btn-small" @click=${addCondition}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              Add Condition
            </button>

            <div class="mc-cond-appearance-subhead">Appearance Overrides</div>
            <div class="mc-mode-help">
              Only fields you set will override. Leave blank to fall through to base settings.
            </div>

            ${renderColorField('Background Color', overrides.background, (v) => updateOverride('background', v))}
            ${renderMediaField('Background Image', overrides.background_image, (v) => updateOverride('background_image', v), this.hass, 'image')}
            ${renderToggleField('Override Dashboard Theme', usePageTheme === false, (v) => updateOverride('use_page_theme', v ? false : undefined))}
            ${usePageTheme === false
              ? renderSelectField(
                  'Card Theme',
                  selectedTheme,
                  themeOptions,
                  (v) => updateOverride('theme', v === '__default__' ? undefined : v),
                )
              : nothing}
            ${renderUnitField('Border Radius', overrides.border_radius, (v) => updateOverride('border_radius', v))}
            ${renderBoxField('Padding', overrides.padding, (v) => updateOverride('padding', v), 'padding')}
            ${renderTextField('Box Shadow', overrides.box_shadow, (v) => updateOverride('box_shadow', v))}
            ${renderUnitField('Card Height', overrides.card_height, (v) => updateOverride('card_height', v))}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private _renderCardConditionsTab(
    config: MagicCardConfig,
    syncCtx: SyncContext | undefined,
  ): TemplateResult {
    const display: DisplayConfig = config.display || {};
    const conditions = display.conditions || [];
    const mode = display.mode || 'every';
    const condSyncCtx = syncCtx ? { ...syncCtx, basePath: 'display' } : undefined;

    const writeDisplay = (next: DisplayConfig) => {
      const updates: Partial<MagicCardConfig> = { display: next };
      if (syncCtx) {
        const ns = new Set(config.not_synced || []);
        ns.add('display');
        updates.not_synced = Array.from(ns);
      }
      this._stateManager.updateConfig({ ...config, ...updates });
    };

    const updateDisplay = (patch: Partial<DisplayConfig>) =>
      writeDisplay({ ...display, ...patch });

    const addCondition = () => {
      const newCondition: DisplayCondition = {
        id: generateId('cond'),
        type: 'state',
        entity: '',
        state: '',
      };
      updateDisplay({ conditions: [...conditions, newCondition] });
    };

    const removeCondition = (id: string) => {
      updateDisplay({ conditions: conditions.filter((c) => c.id !== id) });
    };

    const updateCondition = (id: string, updates: Partial<DisplayCondition>) => {
      updateDisplay({
        conditions: conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    };

    return html`
      <div class="mc-tab-content">
        <div class="mc-mode-help">
          When conditions are not met, the entire card is hidden.
        </div>

        ${conditions.length > 1
          ? renderSelectField(
              'Condition Mode',
              mode,
              [
                { label: 'All conditions (AND)', value: 'every' },
                { label: 'Any condition (OR)', value: 'any' },
              ],
              (v) => updateDisplay({ mode: v as 'every' | 'any' }),
              'mode',
              condSyncCtx,
            )
          : nothing}

        <div class="mc-conditions-list">
          ${conditions.map((cond, idx) => {
            const condItemCtx = condSyncCtx
              ? { ...condSyncCtx, basePath: `display.conditions.${idx}` }
              : undefined;
            return html`
              <div class="mc-condition-item">
                ${renderSelectField(
                  'Type',
                  cond.type,
                  [
                    { label: 'State', value: 'state' },
                    { label: 'Attribute', value: 'attribute' },
                    { label: 'Time', value: 'time' },
                    { label: 'Template', value: 'template' },
                  ],
                  (v) => updateCondition(cond.id, { type: v as DisplayCondition['type'] }),
                  'type',
                  condItemCtx,
                )}
                ${cond.type === 'state' || cond.type === 'attribute'
                  ? html`
                      ${renderEntityField('Entity', cond.entity, (v) =>
                        updateCondition(cond.id, { entity: v }), this.hass, undefined,
                        'entity', condItemCtx,
                      )}
                      ${cond.type === 'attribute'
                        ? renderTextField('Attribute', cond.attribute, (v) =>
                            updateCondition(cond.id, { attribute: v }),
                            'attribute', condItemCtx,
                          )
                        : nothing}
                      ${renderTextField('State equals', cond.state, (v) =>
                        updateCondition(cond.id, { state: v }),
                        'state', condItemCtx,
                      )}
                      ${renderTextField('State not equals', cond.state_not, (v) =>
                        updateCondition(cond.id, { state_not: v }),
                        'state_not', condItemCtx,
                      )}
                    `
                  : nothing}
                ${cond.type === 'time'
                  ? html`
                      ${renderTextField('After (HH:MM)', cond.after, (v) =>
                        updateCondition(cond.id, { after: v }),
                        'after', condItemCtx,
                      )}
                      ${renderTextField('Before (HH:MM)', cond.before, (v) =>
                        updateCondition(cond.id, { before: v }),
                        'before', condItemCtx,
                      )}
                    `
                  : nothing}
                ${cond.type === 'template'
                  ? renderTextareaField(
                      'Template',
                      cond.template,
                      (v) => updateCondition(cond.id, { template: v }),
                      { rows: 3 },
                      'template',
                      condItemCtx,
                    )
                  : nothing}
                <button class="mc-btn-icon" @click=${() => removeCondition(cond.id)} title="Remove condition">
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                </button>
              </div>
            `;
          })}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${addCondition}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
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

  private _renderTemplatePicker(): TemplateResult {
    return html`
      <mc-template-picker
        .mode=${this._showTemplatePicker!}
        .config=${this._editorState!.config}
        .hass=${this.hass}
        @close=${() => { this._showTemplatePicker = null; }}
        @template-selected=${this._onTemplateSelected}
      ></mc-template-picker>
    `;
  }

  /**
   * Strip not_synced arrays from a config before saving as template.
   * These are card-instance-specific and should not be stored in templates.
   */
  private _stripNotSynced(config: Record<string, unknown>): Record<string, unknown> {
    const result = { ...config };
    delete result['not_synced'];

    if (Array.isArray(result['rows'])) {
      result['rows'] = (result['rows'] as Record<string, unknown>[]).map(row => {
        const r = { ...row };
        delete r['not_synced'];
        if (Array.isArray(r['columns'])) {
          r['columns'] = (r['columns'] as Record<string, unknown>[]).map(col => {
            const c = { ...col };
            delete c['not_synced'];
            if (Array.isArray(c['modules'])) {
              c['modules'] = (c['modules'] as Record<string, unknown>[]).map(mod => {
                const m = { ...mod };
                delete m['not_synced'];
                return m;
              });
            }
            return c;
          });
        }
        return r;
      });
    }

    return result;
  }

  private async _saveToTemplate(): Promise<void> {
    if (!this._linkedTemplate || !this.hass) return;
    const config = this._stateManager.getConfig();
    const entry = this._stripNotSynced({ ...config } as Record<string, unknown>);
    delete entry['template'];
    try {
      await this.hass.callWS({
        type: 'magic_card_utils/save_template',
        name: this._linkedTemplate,
        template: { config: entry },
      });
    } catch (err) {
      console.warn('Magic Card Editor: Failed to save template', this._linkedTemplate, err);
    }
    this._showLinkedPopup = false;
  }

  private _unlinkTemplate(): void {
    const config = { ...this._stateManager.getConfig() };
    delete config.template;
    this._stateManager.updateConfig(config);
    this._showLinkedPopup = false;
  }

  private _onTemplateSelected = (e: CustomEvent) => {
    this._stateManager.updateConfig(e.detail.config);
    this._showTemplatePicker = null;
  };

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
