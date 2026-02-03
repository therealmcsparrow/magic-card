import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';

interface ServiceInfo {
  domain: string;
  service: string;
  name: string;
  description: string;
}

@customElement('mc-service-picker')
export class ServicePicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
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
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
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
      width: 480px;
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
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #03a9f4);
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
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-list {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .mc-picker-domain {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
    }

    .mc-picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.1s;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-item:last-child {
      border-bottom: none;
    }

    .mc-picker-item:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 50%;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
    }

    .mc-picker-item-content {
      flex: 1;
      min-width: 0;
    }

    .mc-picker-item-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-item-id {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-item-desc {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      margin-top: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Service';

  @state() private _showModal = false;
  @state() private _searchQuery = '';

  private _openModal(): void {
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _selectService(serviceId: string): void {
    this.value = serviceId;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: serviceId },
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

  private _getServices(): ServiceInfo[] {
    if (!this.hass?.services) return [];

    const services: ServiceInfo[] = [];

    for (const [domain, domainServices] of Object.entries(this.hass.services)) {
      for (const [service, serviceData] of Object.entries(domainServices as Record<string, { name?: string; description?: string }>)) {
        services.push({
          domain,
          service,
          name: serviceData.name || service,
          description: serviceData.description || '',
        });
      }
    }

    return services;
  }

  private _getFilteredServices(): { domain: string; services: ServiceInfo[] }[] {
    const allServices = this._getServices();
    const q = this._searchQuery.toLowerCase();

    const filtered = q
      ? allServices.filter(s =>
          s.domain.includes(q) ||
          s.service.includes(q) ||
          s.name.toLowerCase().includes(q)
        )
      : allServices;

    const grouped = new Map<string, ServiceInfo[]>();
    for (const service of filtered) {
      if (!grouped.has(service.domain)) {
        grouped.set(service.domain, []);
      }
      grouped.get(service.domain)!.push(service);
    }

    const result = Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 20)
      .map(([domain, services]) => ({
        domain,
        services: services.sort((a, b) => a.service.localeCompare(b.service)),
      }));

    return result;
  }

  private _domainIcon(domain: string): string {
    const icons: Record<string, string> = {
      light: 'mdi:lightbulb',
      switch: 'mdi:toggle-switch',
      climate: 'mdi:thermostat',
      cover: 'mdi:window-shutter',
      fan: 'mdi:fan',
      media_player: 'mdi:cast',
      camera: 'mdi:video',
      lock: 'mdi:lock',
      automation: 'mdi:robot',
      script: 'mdi:script-text',
      scene: 'mdi:palette',
      input_boolean: 'mdi:toggle-switch-outline',
      input_number: 'mdi:ray-vertex',
      input_select: 'mdi:format-list-bulleted',
      notify: 'mdi:bell',
      tts: 'mdi:speaker-message',
      homeassistant: 'mdi:home-assistant',
      persistent_notification: 'mdi:bell-ring',
      logbook: 'mdi:book-open',
      recorder: 'mdi:database',
      system_log: 'mdi:file-document',
      frontend: 'mdi:view-dashboard',
      group: 'mdi:group',
      vacuum: 'mdi:robot-vacuum',
      counter: 'mdi:counter',
      timer: 'mdi:timer',
    };
    return icons[domain] || 'mdi:cog';
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="domain.service"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:cog-play"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const groupedServices = this._getFilteredServices();

    return html`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:cog-play"></ha-icon>
            <span class="mc-picker-title">Select Service</span>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search services..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>
          <div class="mc-picker-list">
            ${groupedServices.length > 0
              ? groupedServices.map(group => html`
                  <div class="mc-picker-domain">${group.domain}</div>
                  ${group.services.map(service => html`
                    <div
                      class="mc-picker-item"
                      @click=${() => this._selectService(`${service.domain}.${service.service}`)}
                    >
                      <div class="mc-picker-item-icon">
                        <ha-icon icon=${this._domainIcon(service.domain)}></ha-icon>
                      </div>
                      <div class="mc-picker-item-content">
                        <div class="mc-picker-item-name">${service.name}</div>
                        <div class="mc-picker-item-id">${service.domain}.${service.service}</div>
                        ${service.description
                          ? html`<div class="mc-picker-item-desc">${service.description}</div>`
                          : ''
                        }
                      </div>
                    </div>
                  `)}
                `)
              : html`<div class="mc-picker-empty">No services found</div>`
            }
          </div>
        </div>
      </div>
    `;
  }
}
