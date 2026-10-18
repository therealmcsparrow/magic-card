import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t } from '../i18n';

interface ServiceInfo {
  domain: string;
  service: string;
  name: string;
  description: string;
}

@customElement('mc-service-picker')
export class ServicePicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

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
      <div class="with-icon with-action">
        <ha-icon icon="mdi:cog-outline"></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="domain.service"
          aria-label=${this.label || t('Service')}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${t('Browse services')}
          title=${t('Browse services')}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const groupedServices = this._getFilteredServices();

    return html`
      ${renderPickerWindow(t('Select service'), () => this._closeModal(), 'm', html`
          <div class="mc-picker-search">
            ${renderPickerSearch(t('Search services'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${t('Services')}>
            ${groupedServices.length > 0
              ? groupedServices.map(group => html`
                  <div class="mc-picker-domain">${group.domain}</div>
                  ${group.services.map(service => html`
                    <button
                      type="button"
                      role="option"
                      class="mc-picker-item"
                      aria-selected=${this.value === `${service.domain}.${service.service}` ? 'true' : 'false'}
                      @click=${() => this._selectService(`${service.domain}.${service.service}`)}
                    >
                      <span class="mc-picker-item-icon"><ha-icon icon=${this._domainIcon(service.domain)}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${service.name}</span>
                        <span class="mc-picker-item-id">${service.domain}.${service.service}</span>
                        ${service.description
                          ? html`<span class="mc-picker-item-desc">${service.description}</span>`
                          : ''
                        }
                      </span>
                    </button>
                  `)}
                `)
              : html`<div class="mc-picker-empty">${t('No services found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
          </div>
      `)}
    `;
  }
}
