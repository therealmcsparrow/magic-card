import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Curated set of commonly used MDI icons for Home Assistant dashboards
const POPULAR_ICONS: string[] = [
  // Home & Rooms
  'mdi:home', 'mdi:home-outline', 'mdi:home-assistant', 'mdi:floor-plan',
  'mdi:sofa', 'mdi:bed', 'mdi:desk', 'mdi:toilet', 'mdi:shower',
  'mdi:garage', 'mdi:door', 'mdi:door-open', 'mdi:gate',
  // Lighting
  'mdi:lightbulb', 'mdi:lightbulb-outline', 'mdi:lightbulb-group',
  'mdi:ceiling-light', 'mdi:floor-lamp', 'mdi:desk-lamp', 'mdi:lamp',
  'mdi:wall-sconce', 'mdi:led-strip', 'mdi:led-strip-variant',
  'mdi:lamps', 'mdi:light-recessed', 'mdi:track-light',
  // Switches & Power
  'mdi:power', 'mdi:power-plug', 'mdi:power-plug-outline',
  'mdi:toggle-switch', 'mdi:toggle-switch-off',
  'mdi:light-switch', 'mdi:electric-switch',
  'mdi:power-socket', 'mdi:outlet',
  // Climate
  'mdi:thermostat', 'mdi:thermometer', 'mdi:thermometer-lines',
  'mdi:snowflake', 'mdi:fire', 'mdi:air-conditioner',
  'mdi:radiator', 'mdi:heating-coil', 'mdi:heat-wave',
  'mdi:fan', 'mdi:fan-off', 'mdi:air-humidifier',
  'mdi:water-percent', 'mdi:coolant-temperature',
  // Security
  'mdi:lock', 'mdi:lock-open', 'mdi:lock-outline',
  'mdi:shield-home', 'mdi:shield-home-outline',
  'mdi:shield-lock', 'mdi:shield-check',
  'mdi:alarm-light', 'mdi:bell', 'mdi:bell-ring',
  'mdi:cctv', 'mdi:video', 'mdi:camera', 'mdi:webcam',
  'mdi:motion-sensor', 'mdi:smoke-detector',
  // Media
  'mdi:play', 'mdi:pause', 'mdi:stop', 'mdi:skip-next', 'mdi:skip-previous',
  'mdi:volume-high', 'mdi:volume-medium', 'mdi:volume-low', 'mdi:volume-off',
  'mdi:speaker', 'mdi:speaker-wireless', 'mdi:cast',
  'mdi:television', 'mdi:monitor', 'mdi:projector',
  'mdi:music', 'mdi:music-note', 'mdi:playlist-music',
  // Weather & Nature
  'mdi:weather-sunny', 'mdi:weather-partly-cloudy', 'mdi:weather-cloudy',
  'mdi:weather-rainy', 'mdi:weather-snowy', 'mdi:weather-windy',
  'mdi:weather-night', 'mdi:moon-waning-crescent',
  'mdi:white-balance-sunny', 'mdi:brightness-5',
  'mdi:water', 'mdi:water-outline', 'mdi:leaf', 'mdi:flower', 'mdi:tree',
  // Appliances
  'mdi:washing-machine', 'mdi:tumble-dryer', 'mdi:dishwasher',
  'mdi:fridge', 'mdi:stove', 'mdi:microwave', 'mdi:coffee-maker',
  'mdi:robot-vacuum', 'mdi:vacuum',
  // Transport
  'mdi:car', 'mdi:car-electric', 'mdi:ev-station', 'mdi:bicycle', 'mdi:walk',
  'mdi:garage-variant', 'mdi:car-connected',
  // Energy & Battery
  'mdi:battery', 'mdi:battery-charging', 'mdi:battery-50',
  'mdi:solar-power', 'mdi:solar-panel', 'mdi:flash', 'mdi:lightning-bolt',
  'mdi:meter-electric', 'mdi:transmission-tower',
  // Sensors & Data
  'mdi:eye', 'mdi:eye-outline', 'mdi:gauge', 'mdi:speedometer',
  'mdi:signal', 'mdi:wifi', 'mdi:bluetooth', 'mdi:access-point',
  'mdi:chart-line', 'mdi:chart-bar', 'mdi:pulse',
  'mdi:clock-outline', 'mdi:calendar', 'mdi:timer-outline',
  // People & Presence
  'mdi:account', 'mdi:account-outline', 'mdi:account-group',
  'mdi:human-greeting', 'mdi:run', 'mdi:sleep',
  'mdi:map-marker', 'mdi:crosshairs-gps', 'mdi:cellphone',
  // Actions & Controls
  'mdi:cog', 'mdi:cog-outline', 'mdi:wrench', 'mdi:tools',
  'mdi:refresh', 'mdi:reload', 'mdi:sync', 'mdi:restart',
  'mdi:plus', 'mdi:minus', 'mdi:close', 'mdi:check',
  'mdi:arrow-up', 'mdi:arrow-down', 'mdi:arrow-left', 'mdi:arrow-right',
  'mdi:chevron-up', 'mdi:chevron-down', 'mdi:chevron-left', 'mdi:chevron-right',
  // Window & Covers
  'mdi:window-closed', 'mdi:window-open', 'mdi:window-shutter',
  'mdi:window-shutter-open', 'mdi:blinds', 'mdi:curtains',
  'mdi:roller-shade', 'mdi:roller-shade-closed',
  // Misc
  'mdi:information', 'mdi:information-outline',
  'mdi:alert', 'mdi:alert-outline', 'mdi:help-circle', 'mdi:help-circle-outline',
  'mdi:star', 'mdi:star-outline', 'mdi:heart', 'mdi:heart-outline',
  'mdi:emoticon', 'mdi:emoticon-outline', 'mdi:puzzle', 'mdi:puzzle-outline',
  'mdi:script-text', 'mdi:robot', 'mdi:palette', 'mdi:format-paint',
  'mdi:package-variant', 'mdi:tag', 'mdi:label', 'mdi:link',
];

@customElement('mc-icon-picker')
export class IconPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 22px;
    }

    .mc-picker-preview.empty {
      color: var(--secondary-text-color, #757575);
      opacity: 0.3;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #6366f1);
      border-radius: 6px;
      background: var(--primary-color, #6366f1);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Modal */
    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 460px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-picker-close:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-grid {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
      padding: 12px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 4px;
    }

    .mc-picker-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.1s;
      border: 2px solid transparent;
    }

    .mc-picker-icon-item:hover {
      background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
      border-color: color-mix(in srgb, var(--primary-color, #6366f1) 30%, transparent);
    }

    .mc-picker-icon-item.selected {
      background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-icon-item ha-icon {
      --mdc-icon-size: 26px;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-icon-item.selected ha-icon {
      color: var(--primary-color, #6366f1);
    }

    .mc-picker-icon-label {
      font-size: 0.5625rem;
      color: var(--secondary-text-color, #757575);
      text-align: center;
      word-break: break-all;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
      grid-column: 1 / -1;
    }

    .mc-picker-hint {
      padding: 8px 16px 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
  `;

  @property({ type: String }) value = '';

  @state() private _showModal = false;
  @state() private _searchQuery = '';

  private _openModal(): void {
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _selectIcon(icon: string): void {
    this.value = icon;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: icon },
      bubbles: true,
      composed: true,
    }));
    this._closeModal();
  }

  private _onInputChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _getFilteredIcons(): string[] {
    if (!this._searchQuery) return POPULAR_ICONS;
    const q = this._searchQuery.toLowerCase().replace(/^mdi:/, '');
    return POPULAR_ICONS.filter(icon => {
      const name = icon.replace('mdi:', '');
      return name.includes(q);
    });
  }

  /** Strip the mdi: prefix for display */
  private _iconLabel(icon: string): string {
    return icon.replace('mdi:', '');
  }

  protected render(): TemplateResult {
    const hasValue = !!this.value;

    return html`
      <div class="mc-picker-row">
        <div class="mc-picker-preview ${hasValue ? '' : 'empty'}">
          <ha-icon icon=${this.value || 'mdi:help'}></ha-icon>
        </div>
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="mdi:icon-name"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:emoticon-outline"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal ? this._renderModal() : nothing}
    `;
  }

  private _renderModal(): TemplateResult {
    const icons = this._getFilteredIcons();

    return html`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:emoticon-outline"></ha-icon>
            <span class="mc-picker-title">Select Icon</span>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search icons..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>
          <div class="mc-picker-grid">
            ${icons.length > 0
              ? icons.map(icon => html`
                  <div
                    class="mc-picker-icon-item ${this.value === icon ? 'selected' : ''}"
                    @click=${() => this._selectIcon(icon)}
                    title=${icon}
                  >
                    <ha-icon icon=${icon}></ha-icon>
                    <span class="mc-picker-icon-label">${this._iconLabel(icon)}</span>
                  </div>
                `)
              : html`<div class="mc-picker-empty">No icons match your search</div>`
            }
          </div>
          <div class="mc-picker-hint">
            You can also type any MDI icon name directly in the input field, e.g. <code>mdi:heart</code>
          </div>
        </div>
      </div>
    `;
  }
}
