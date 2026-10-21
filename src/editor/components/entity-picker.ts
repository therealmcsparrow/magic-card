import { LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { entityIcon } from '../../utils/entity-icon';
import { t } from '../i18n';

@customElement('mc-entity-picker')
export class EntityPicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  /** Shown while empty (e.g. the default it falls back to). */
  @property({ type: String }) placeholder = 'entity_id';
  @property({ type: String }) domain = '';
  /** Only a real entity id (or empty) is reported, on Enter or leaving the field; typing shows matching ids. */
  @property({ type: Boolean }) strict = false;
  /** Domains listed first in the window. */
  @property({ attribute: false }) preferred: readonly string[] = [];
  /** Help text tied to the field with aria-describedby. */
  @property({ type: String }) help = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _typed = '';
  @state() private _searchQuery = '';
  @state() private _selectedEntityId = '';

  /** Moves keyboard focus into the entity id field. */
  focusInput(): void {
    this.renderRoot.querySelector<HTMLInputElement>('input')?.focus();
  }

  /** Opens the picker window. */
  open(): void {
    this._openModal();
  }

  private _openModal(): void {
    this._selectedEntityId = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._showModal = false;
  }

  private _handleSave(): void {
    this.value = this._selectedEntityId;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this._selectedEntityId },
      bubbles: true,
      composed: true,
    }));
    this._closeModal();
  }

  private _selectEntity(entityId: string): void {
    this._selectedEntityId = entityId;
  }

  private _onInputChange(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    if (this.strict) {
      this._typed = value;
      return;
    }
    this.value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _getFilteredEntities(): Array<{ id: string; name: string; state: string; icon: string }> {
    if (!this.hass) return [];

    const entities = Object.entries(this.hass.states)
      .filter(([id]) => {
        if (this.domain && !id.startsWith(this.domain + '.')) return false;
        return true;
      })
      .map(([id, entity]) => ({
        id,
        name: (entity.attributes.friendly_name as string) || id,
        state: this.hass!.formatEntityState(entity),
        icon: entityIcon(this.hass, id) || this._domainIcon(id.split('.')[0]),
      }))
      .filter(e => {
        if (!this._searchQuery) return true;
        const q = this._searchQuery.toLowerCase();
        return e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
      })
      .sort((a, b) => this._rank(a.id) - this._rank(b.id) || a.name.localeCompare(b.name));

    return entities.slice(0, 100);
  }

  private _rank(id: string): number {
    return this.preferred.includes(id.split('.')[0]) ? 0 : 1;
  }

  /** strict: report the typed id when it is empty or a real entity; otherwise put the last good value back. */
  private _commit(e: Event): void {
    const input = e.target as HTMLInputElement;
    const v = input.value;
    if (v !== '' && !this.hass?.states[v]) {
      input.value = this.value;
      return;
    }
    this.value = v;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: v }, bubbles: true, composed: true }));
  }

  private _suggestions(): string[] {
    const q = this._typed.toLowerCase();
    return Object.keys(this.hass?.states ?? {})
      .filter((id) => (!this.domain || id.startsWith(this.domain + '.')) && id.includes(q))
      .sort((a, b) => this._rank(a) - this._rank(b) || a.localeCompare(b))
      .slice(0, 20);
  }

  private _getEntityInfo(): { name: string; icon: string; state: string; stateText: string } | null {
    if (!this.hass || !this.value) return null;
    const stateObj = this.hass.states[this.value];
    if (!stateObj) return null;
    const name = (stateObj.attributes.friendly_name as string) || this.value;
    const icon = entityIcon(this.hass, this.value) || this._domainIcon(this.value.split('.')[0]);
    return { name, icon, state: stateObj.state, stateText: this.hass.formatEntityState(stateObj) };
  }

  private _dotClass(state: string): string {
    if (state === 'unavailable' || state === 'unknown') return 'dot is-unavailable';
    if (state === 'off' || state === 'closed' || state === 'not_home' || state === 'idle') return 'dot is-off';
    return 'dot';
  }

  private _domainIcon(domain: string): string {
    const icons: Record<string, string> = {
      light: 'mdi:lightbulb',
      switch: 'mdi:toggle-switch',
      sensor: 'mdi:eye',
      binary_sensor: 'mdi:checkbox-marked-circle',
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
      input_text: 'mdi:form-textbox',
      person: 'mdi:account',
      weather: 'mdi:weather-partly-cloudy',
      sun: 'mdi:white-balance-sunny',
      vacuum: 'mdi:robot-vacuum',
      water_heater: 'mdi:water-boiler',
      humidifier: 'mdi:air-humidifier',
      alarm_control_panel: 'mdi:shield-home',
    };
    return icons[domain] || 'mdi:help-circle';
  }

  protected render(): TemplateResult {
    const entityInfo = this._getEntityInfo();
    const icon = entityInfo?.icon || (this.value.includes('.') ? this._domainIcon(this.value.split('.')[0]) : 'mdi:shape-outline');

    // An editable mono entity id with the entity's icon, a browse button inside the field,
    // and a status line (dot · friendly name · state) under it.
    return html`
      <div class="with-icon with-action">
        <ha-icon icon=${icon}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder=${this.placeholder}
          aria-label=${this.label || t('Entity')}
          aria-describedby=${this.help ? 'help' : nothing}
          list=${this.strict ? 'ids' : nothing}
          spellcheck="false"
          @input=${this._onInputChange}
          @change=${this.strict ? this._commit : nothing}
        />
        ${this.strict ? html`<datalist id="ids">${this._suggestions().map((id) => html`<option value=${id}></option>`)}</datalist>` : nothing}
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${t('Browse entities')}
          title=${t('Browse entities')}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>
      ${entityInfo
        ? html`
            <p class="entity-meta">
              <span class=${this._dotClass(entityInfo.state)}></span>
              <span>${entityInfo.name} · ${entityInfo.stateText}</span>
            </p>
          `
        : ''}
      ${this.help ? html`<p class="help" id="help">${this.help}</p>` : nothing}

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const entities = this._getFilteredEntities();

    return html`
      ${renderPickerWindow(t('Select entity'), () => this._closeModal(), 'l', html`
          <div class="mc-picker-search">
            ${renderPickerSearch(t('Search entities'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${t('Entities')}>
            ${entities.length > 0
              ? entities.map(entity => html`
                  <button
                    type="button"
                    role="option"
                    class="mc-picker-item"
                    aria-selected=${this._selectedEntityId === entity.id ? 'true' : 'false'}
                    @click=${() => this._selectEntity(entity.id)}
                  >
                    <span class="mc-picker-item-icon"><ha-icon icon=${entity.icon}></ha-icon></span>
                    <span class="mc-picker-item-content">
                      <span class="mc-picker-item-name">${entity.name}</span>
                      <span class="mc-picker-item-id" title=${entity.id}>${entity.id}</span>
                    </span>
                    <span class="chip">${entity.state}</span>
                  </button>
                `)
              : html`<div class="mc-picker-empty">${t('No entities found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${t('Save')}</button>
          </div>
      `)}
    `;
  }
}
