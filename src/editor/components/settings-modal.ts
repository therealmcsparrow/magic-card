import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant, EditorTab } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { editorStyles } from '../magic-card-editor.styles';

// Ensure custom form components are registered
import './color-picker';
import './unit-field';
import './entity-picker';
import './service-picker';
import './icon-picker';

// Tab configuration with icons
const TAB_CONFIG: Record<EditorTab, { label: string; icon: string }> = {
  general: { label: 'General', icon: 'mdi:cog' },
  actions: { label: 'Actions', icon: 'mdi:gesture-tap' },
  logic: { label: 'Conditions', icon: 'mdi:filter-outline' },
  design: { label: 'Design', icon: 'mdi:palette' },
};

export type ModuleChangeCallback = (updated: CardModule) => void;

@customElement('mc-settings-modal')
export class SettingsModal extends LitElement {
  static styles = [
    editorStyles,
    css`
    :host {
      display: block;
    }

    .mc-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }

    .mc-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 480px;
      max-width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    }

    .mc-modal-header ha-icon {
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 24px;
    }

    .mc-modal-title {
      flex: 1;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      border-radius: 6px;
      font-size: 1.5rem;
      line-height: 1;
    }

    .mc-modal-close:hover {
      background: var(--divider-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-modal-tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
      background: var(--card-background-color, #fff);
    }

    .mc-modal-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 8px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--secondary-text-color, #6b7280);
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
    }

    .mc-modal-tab:hover {
      color: var(--primary-text-color, #1a1a2e);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
    }

    .mc-modal-tab.active {
      color: var(--primary-color, #6366f1);
      border-bottom-color: var(--primary-color, #6366f1);
    }

    .mc-modal-tab ha-icon {
      --mdc-icon-size: 18px;
    }

    .mc-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .mc-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--divider-color, #e5e7eb);
    }

    .mc-btn {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
    }

    .mc-btn-primary {
      background: var(--primary-color, #6366f1);
      color: white;
    }

    .mc-btn-primary:hover {
      filter: brightness(1.1);
    }
  `];

  @property({ attribute: false }) module?: CardModule;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) open = false;
  @property({ attribute: false }) onChange?: ModuleChangeCallback;

  @state() private _activeTab: EditorTab = 'general';

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    if (!this.open || !this.module) return html``;

    const handler = ModuleRegistry.get(this.module.type);
    if (!handler) return html``;

    const availableTabs = handler.getAvailableTabs();
    const currentTab = availableTabs.includes(this._activeTab) ? this._activeTab : availableTabs[0];

    return html`
      <div class="mc-modal-overlay" @click=${this._close}>
        <div class="mc-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${handler.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${handler.metadata.name} Settings</span>
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
        </div>
      </div>
    `;
  }

  private _renderTabContent(
    tab: EditorTab,
    handler: import('../../modules/module-types').MagicModule,
  ): TemplateResult {
    if (!this.module || !this.onChange) return html`<p>Loading...</p>`;

    const onChange = this.onChange;

    switch (tab) {
      case 'general':
        return handler.renderGeneralTab(this.module, this.hass, onChange);
      case 'actions':
        return handler.renderActionsTab
          ? handler.renderActionsTab(this.module, this.hass, onChange)
          : html`<p>No actions available</p>`;
      case 'logic':
        return handler.renderLogicTab
          ? handler.renderLogicTab(this.module, this.hass, onChange)
          : html`<p>No conditions available</p>`;
      case 'design':
        return handler.renderDesignTab
          ? handler.renderDesignTab(this.module, this.hass, onChange)
          : html`<p>No design options</p>`;
    }
  }
}
