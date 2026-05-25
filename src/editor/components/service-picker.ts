import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles, servicePickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

interface ServiceInfo {
  domain: string;
  service: string;
  name: string;
  description: string;
}

@customElement('mc-service-picker')
export class ServicePicker extends LitElement {
  static styles = [pickerStyles, servicePickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Service';

  private _modalCtrl = new ModalDragResizeController(this);

  @state() private _showModal = false;
  @state() private _searchQuery = '';

  private _openModal(): void {
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
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
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <ha-icon icon="mdi:cog-play"></ha-icon>
            <span class="mc-picker-title">Select Service</span>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
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
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }
}
