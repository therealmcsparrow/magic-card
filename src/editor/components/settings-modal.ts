import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant, EditorTab } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles, modalStyles, settingsModalStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

// Ensure custom form components are registered
import './color-picker';
import './unit-field';
import './entity-picker';
import './service-picker';
import './icon-picker';
import './media-picker';
import './design-panel';

// Tab configuration with icons
const TAB_CONFIG: Record<EditorTab, { label: string; icon: string }> = {
  general: { label: 'General', icon: 'mdi:cog' },
  actions: { label: 'Actions', icon: 'mdi:gesture-tap' },
  conditions: { label: 'Conditions', icon: 'mdi:filter-outline' },
  design: { label: 'Design', icon: 'mdi:palette' },
};

export type ModuleChangeCallback = (updated: CardModule) => void;

@customElement('mc-settings-modal')
export class SettingsModal extends LitElement {
  static styles = [editorStyles, modalStyles, settingsModalStyles];

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) open = false;
  @property({ type: String }) template?: string;
  @property({ attribute: false }) onChange?: ModuleChangeCallback;

  @state() private _activeTab: EditorTab = 'general';

  private _modalCtrl = new ModalDragResizeController(this);

  private _close(): void {
    this._modalCtrl.reset();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _handleFieldSyncToggle(e: CustomEvent): void {
    if (!this.module || !this.onChange || !this.template) return;
    const { propertyPath, synced } = e.detail;
    const currentNotSynced = new Set((this.module.not_synced || []) as string[]);
    if (synced) {
      // Was synced, user wants to unsync → add to not_synced
      currentNotSynced.add(propertyPath);
    } else {
      // Was not synced, user wants to resync → remove from not_synced
      currentNotSynced.delete(propertyPath);
    }
    this.onChange({
      ...this.module,
      not_synced: Array.from(currentNotSynced),
    } as CardModule);
  }

  protected render(): TemplateResult {
    if (!this.open || !this.module) return html``;

    const handler = ModuleRegistry.get(this.module.type);
    if (!handler) return html``;

    const availableTabs = handler.getAvailableTabs();
    const currentTab = availableTabs.includes(this._activeTab) ? this._activeTab : availableTabs[0];

    return html`
      <div class="mc-modal-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._close(); }}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}
             @field-sync-toggle=${this._handleFieldSyncToggle}>
          <div class="mc-modal-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <ha-icon icon=${handler.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${handler.metadata.name} Settings</span>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${availableTabs.map(tab => {
              const config = TAB_CONFIG[tab];
              return html`
                <button
                  class="mc-modal-tab ${currentTab === tab ? 'active' : ''}"
                  @click=${() => { this._activeTab = tab; }}
                >
                  <ha-icon icon=${config.icon}></ha-icon>
                  ${config.label}
                </button>
              `;
            })}
          </div>

          <div class="mc-modal-body">
            ${this._renderTabContent(currentTab, handler)}
          </div>

          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${this._close}>Done</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }

  private _renderTabContent(
    tab: EditorTab,
    handler: import('../../modules/module-types').MagicModule,
  ): TemplateResult {
    if (!this.module || !this.onChange) return html`<p>Loading...</p>`;

    const onChange = this.template
      ? this._wrapOnChangeWithSync(this.module, this.onChange)
      : this.onChange;

    switch (tab) {
      case 'general':
        return handler.renderGeneralTab(this.module, this.hass, onChange, this.template);
      case 'actions':
        return handler.renderActionsTab
          ? handler.renderActionsTab(this.module, this.hass, onChange, this.template)
          : html`<p>No actions available</p>`;
      case 'conditions':
        return handler.renderConditionsTab
          ? handler.renderConditionsTab(this.module, this.hass, onChange, this.template)
          : html`<p>No conditions available</p>`;
      case 'design':
        return handler.renderDesignTab
          ? handler.renderDesignTab(this.module, this.hass, onChange, this.template)
          : html`<p>No design options</p>`;
    }
  }

  /**
   * Wraps onChange to auto-detect changed properties and add them to not_synced.
   * Compares old module with updated module to find which top-level keys changed.
   */
  private _wrapOnChangeWithSync(
    currentModule: CardModule,
    originalOnChange: ModuleChangeCallback,
  ): ModuleChangeCallback {
    return (updated: CardModule) => {
      const notSynced = new Set((updated.not_synced || []) as string[]);
      const oldRec = currentModule as Record<string, unknown>;
      const newRec = updated as Record<string, unknown>;

      // Detect changed top-level properties (skip structural/meta keys)
      const skipKeys = new Set(['id', 'type', 'not_synced', 'design', 'actions', 'display']);
      for (const key of Object.keys(newRec)) {
        if (skipKeys.has(key)) continue;
        if (newRec[key] !== oldRec[key]) {
          notSynced.add(key);
        }
      }

      (updated as any).not_synced = Array.from(notSynced);
      originalOnChange(updated);
    };
  }
}
