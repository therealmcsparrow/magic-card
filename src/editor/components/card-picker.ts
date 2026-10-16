import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-system';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';
import { pickerKeydown, renderPickerHeader, renderPickerSearch, renderResizeHandle, PickerDialogController } from './picker-parts';

interface CardInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'built-in' | 'custom';
}

const BUILTIN_CARDS: CardInfo[] = [
  { type: 'alarm-panel', name: 'Alarm panel', description: 'Alarm control panel', icon: 'mdi:shield-home', category: 'built-in' },
  { type: 'area', name: 'Area', description: 'Show area devices and entities', icon: 'mdi:texture-box', category: 'built-in' },
  { type: 'button', name: 'Button', description: 'Action button for an entity', icon: 'mdi:gesture-tap-button', category: 'built-in' },
  { type: 'calendar', name: 'Calendar', description: 'Calendar display', icon: 'mdi:calendar', category: 'built-in' },
  { type: 'conditional', name: 'Conditional', description: 'Show cards based on conditions', icon: 'mdi:eye-check', category: 'built-in' },
  { type: 'entities', name: 'Entities', description: 'List of entity rows', icon: 'mdi:format-list-bulleted', category: 'built-in' },
  { type: 'entity', name: 'Entity', description: 'Single entity display', icon: 'mdi:card-text', category: 'built-in' },
  { type: 'entity-filter', name: 'Entity filter', description: 'Filtered entity list', icon: 'mdi:filter', category: 'built-in' },
  { type: 'gauge', name: 'Gauge', description: 'Gauge visualization', icon: 'mdi:gauge', category: 'built-in' },
  { type: 'glance', name: 'Glance', description: 'Quick overview of entities', icon: 'mdi:eye', category: 'built-in' },
  { type: 'grid', name: 'Grid', description: 'Grid layout of cards', icon: 'mdi:view-grid', category: 'built-in' },
  { type: 'heading', name: 'Heading', description: 'Section heading', icon: 'mdi:format-header-1', category: 'built-in' },
  { type: 'history-graph', name: 'History graph', description: 'Entity history graph', icon: 'mdi:chart-line', category: 'built-in' },
  { type: 'horizontal-stack', name: 'Horizontal stack', description: 'Stack cards horizontally', icon: 'mdi:arrow-split-vertical', category: 'built-in' },
  { type: 'humidifier', name: 'Humidifier', description: 'Humidifier control', icon: 'mdi:air-humidifier', category: 'built-in' },
  { type: 'iframe', name: 'iFrame', description: 'Embed a webpage', icon: 'mdi:web', category: 'built-in' },
  { type: 'light', name: 'Light', description: 'Light control card', icon: 'mdi:lightbulb', category: 'built-in' },
  { type: 'logbook', name: 'Logbook', description: 'Entity logbook entries', icon: 'mdi:book-open-variant', category: 'built-in' },
  { type: 'map', name: 'Map', description: 'Map with entity locations', icon: 'mdi:map', category: 'built-in' },
  { type: 'markdown', name: 'Markdown', description: 'Rendered Markdown text', icon: 'mdi:language-markdown', category: 'built-in' },
  { type: 'media-control', name: 'Media control', description: 'Media player controls', icon: 'mdi:cast', category: 'built-in' },
  { type: 'picture', name: 'Picture', description: 'Display an image', icon: 'mdi:image', category: 'built-in' },
  { type: 'picture-elements', name: 'Picture elements', description: 'Image with interactive elements', icon: 'mdi:image-edit', category: 'built-in' },
  { type: 'picture-entity', name: 'Picture entity', description: 'Entity with background image', icon: 'mdi:image-area', category: 'built-in' },
  { type: 'picture-glance', name: 'Picture glance', description: 'Image with entity icons', icon: 'mdi:image-multiple', category: 'built-in' },
  { type: 'plant-status', name: 'Plant status', description: 'Plant monitor display', icon: 'mdi:flower', category: 'built-in' },
  { type: 'sensor', name: 'Sensor', description: 'Sensor with graph', icon: 'mdi:eye', category: 'built-in' },
  { type: 'shopping-list', name: 'Shopping list', description: 'Shopping list card', icon: 'mdi:cart', category: 'built-in' },
  { type: 'statistic', name: 'Statistic', description: 'Long-term statistic', icon: 'mdi:chart-box', category: 'built-in' },
  { type: 'statistics-graph', name: 'Statistics graph', description: 'Statistics graph', icon: 'mdi:chart-bell-curve', category: 'built-in' },
  { type: 'thermostat', name: 'Thermostat', description: 'Climate control card', icon: 'mdi:thermostat', category: 'built-in' },
  { type: 'tile', name: 'Tile', description: 'Compact tile card', icon: 'mdi:square-rounded', category: 'built-in' },
  { type: 'todo-list', name: 'To-Do List', description: 'To-do list card', icon: 'mdi:checkbox-marked-outline', category: 'built-in' },
  { type: 'vertical-stack', name: 'Vertical stack', description: 'Stack cards vertically', icon: 'mdi:arrow-split-horizontal', category: 'built-in' },
  { type: 'weather-forecast', name: 'Weather forecast', description: 'Weather forecast card', icon: 'mdi:weather-partly-cloudy', category: 'built-in' },
];

@customElement('mc-card-picker')
export class CardPicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ type: String }) value = '';

  private _modalCtrl = new ModalDragResizeController(this);
  private _dialogCtrl = new PickerDialogController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedCardType = '';

  private _openModal(): void {
    this._selectedCardType = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
    this._modalCtrl.reset();
    this._showModal = false;
  }

  private _handleSave(): void {
    this.value = this._selectedCardType;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this._selectedCardType },
      bubbles: true,
      composed: true,
    }));
    this._closeModal();
  }

  private _selectCard(cardType: string): void {
    this._selectedCardType = cardType;
    this._searchQuery = cardType;
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

  private _getCustomCards(): CardInfo[] {
    const customCards = (window as unknown as { customCards?: Array<{ type: string; name?: string; description?: string }> }).customCards;
    if (!Array.isArray(customCards)) return [];

    return customCards.map((card) => ({
      type: `custom:${card.type}`,
      name: card.name || card.type,
      description: card.description || 'Custom card',
      icon: 'mdi:puzzle',
      category: 'custom' as const,
    }));
  }

  private _getFilteredCards(): { builtIn: CardInfo[]; custom: CardInfo[] } {
    const q = this._searchQuery.toLowerCase();

    const filterFn = (card: CardInfo) => {
      if (!q) return true;
      return card.type.toLowerCase().includes(q) ||
        card.name.toLowerCase().includes(q) ||
        card.description.toLowerCase().includes(q);
    };

    const builtIn = BUILTIN_CARDS.filter(filterFn);
    const custom = this._getCustomCards().filter(filterFn);

    return { builtIn, custom };
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-picker-row">
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="button, custom:mushroom-light-card"
          aria-label="Card type"
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>Select</button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const { builtIn, custom } = this._getFilteredCards();
    const hasResults = builtIn.length > 0 || custom.length > 0;

    return html`
      <dialog class="mc-picker-overlay" aria-label="Select card" @click=${(e: Event) => { if (!this._modalCtrl.consumeDragFlag() && this._dialogCtrl.isBackdropClick(e)) this._closeModal(); }}>
        <div class="mc-picker-modal" @keydown=${pickerKeydown(() => this._closeModal())} @click=${(e: Event) => e.stopPropagation()}>
          ${renderPickerHeader('Select card', this._modalCtrl, () => this._closeModal())}
          <div class="mc-picker-search">
            ${renderPickerSearch('Search cards', this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label="Cards">
            ${hasResults
              ? html`
                  ${builtIn.length > 0 ? html`
                    <div class="mc-picker-category">Built-in cards</div>
                    ${builtIn.map(card => this._renderCardItem(card))}
                  ` : ''}
                  ${custom.length > 0 ? html`
                    <div class="mc-picker-category">Custom cards (HACS)</div>
                    ${custom.map(card => this._renderCardItem(card))}
                  ` : ''}
                `
              : html`<div class="mc-picker-empty">No cards found</div>`
            }
          </div>
          <div class="mc-picker-footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>Cancel</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>Save</button>
          </div>
          ${renderResizeHandle(this._modalCtrl)}
        </div>
      </dialog>
    `;
  }

  private _renderCardItem(card: CardInfo): TemplateResult {
    return html`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${this._selectedCardType === card.type ? 'true' : 'false'}
        @click=${() => this._selectCard(card.type)}
      >
        <span class="mc-picker-item-icon"><ha-icon icon=${card.icon}></ha-icon></span>
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name">${card.name}</span>
          <span class="mc-picker-item-id">${card.type}</span>
        </span>
        <span class="chip">${card.category === 'custom' ? 'Custom' : 'Built-in'}</span>
      </button>
    `;
  }
}
