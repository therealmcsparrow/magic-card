import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../../types';

@customElement('mc-entity-picker')
export class EntityPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .mc-entity-picker {
      position: relative;
    }

    .mc-entity-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      box-sizing: border-box;
    }

    .mc-entity-input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-entity-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 200px;
      overflow-y: auto;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      margin-top: 4px;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .mc-entity-option {
      padding: 8px 12px;
      cursor: pointer;
      font-size: 0.8125rem;
      display: flex;
      flex-direction: column;
    }

    .mc-entity-option:hover {
      background: var(--divider-color, #e5e7eb);
    }

    .mc-entity-option-name {
      font-weight: 500;
    }

    .mc-entity-option-id {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #6b7280);
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) label = 'Entity';
  @property({ type: String }) domain = '';

  @state() private _showDropdown = false;
  @state() private _filter = '';

  protected render(): TemplateResult {
    const entities = this._getFilteredEntities();

    return html`
      <div class="mc-entity-picker">
        <input
          class="mc-entity-input"
          type="text"
          .value=${this.value}
          placeholder=${this.label}
          @input=${this._onInput}
          @focus=${() => { this._showDropdown = true; }}
          @blur=${() => setTimeout(() => { this._showDropdown = false; }, 200)}
        />
        ${this._showDropdown && entities.length > 0
          ? html`
              <div class="mc-entity-dropdown">
                ${entities.slice(0, 50).map(
                  (e) => html`
                    <div class="mc-entity-option" @mousedown=${() => this._onSelect(e.entity_id)}>
                      <span class="mc-entity-option-name">
                        ${e.attributes.friendly_name || e.entity_id}
                      </span>
                      <span class="mc-entity-option-id">${e.entity_id}</span>
                    </div>
                  `,
                )}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _getFilteredEntities() {
    if (!this.hass) return [];
    const filter = (this._filter || this.value || '').toLowerCase();
    return Object.values(this.hass.states)
      .filter((e) => {
        if (this.domain && !e.entity_id.startsWith(this.domain + '.')) return false;
        if (!filter) return true;
        return (
          e.entity_id.toLowerCase().includes(filter) ||
          (String(e.attributes.friendly_name || '')).toLowerCase().includes(filter)
        );
      })
      .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  }

  private _onInput(e: InputEvent): void {
    const value = (e.target as HTMLInputElement).value;
    this._filter = value;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value },
      }),
    );
  }

  private _onSelect(entityId: string): void {
    this._filter = '';
    this._showDropdown = false;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: entityId },
      }),
    );
  }
}
