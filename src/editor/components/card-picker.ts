import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { pickerStyles } from '../../css/css';
import { ModalDragResizeController } from '../controllers/modal-drag-resize';

interface CardInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'built-in' | 'custom';
}

const BUILTIN_CARDS: CardInfo[] = [
  { type: 'alarm-panel', name: 'Alarm Panel', description: 'Alarm control panel', icon: 'mdi:shield-home', category: 'built-in' },
  { type: 'area', name: 'Area', description: 'Show area devices and entities', icon: 'mdi:texture-box', category: 'built-in' },
  { type: 'button', name: 'Button', description: 'Action button for an entity', icon: 'mdi:gesture-tap-button', category: 'built-in' },
  { type: 'calendar', name: 'Calendar', description: 'Calendar display', icon: 'mdi:calendar', category: 'built-in' },
  { type: 'conditional', name: 'Conditional', description: 'Show cards based on conditions', icon: 'mdi:eye-check', category: 'built-in' },
  { type: 'entities', name: 'Entities', description: 'List of entity rows', icon: 'mdi:format-list-bulleted', category: 'built-in' },
  { type: 'entity', name: 'Entity', description: 'Single entity display', icon: 'mdi:card-text', category: 'built-in' },
  { type: 'entity-filter', name: 'Entity Filter', description: 'Filtered entity list', icon: 'mdi:filter', category: 'built-in' },
  { type: 'gauge', name: 'Gauge', description: 'Gauge visualization', icon: 'mdi:gauge', category: 'built-in' },
  { type: 'glance', name: 'Glance', description: 'Quick overview of entities', icon: 'mdi:eye', category: 'built-in' },
  { type: 'grid', name: 'Grid', description: 'Grid layout of cards', icon: 'mdi:view-grid', category: 'built-in' },
  { type: 'heading', name: 'Heading', description: 'Section heading', icon: 'mdi:format-header-1', category: 'built-in' },
  { type: 'history-graph', name: 'History Graph', description: 'Entity history graph', icon: 'mdi:chart-line', category: 'built-in' },
  { type: 'horizontal-stack', name: 'Horizontal Stack', description: 'Stack cards horizontally', icon: 'mdi:arrow-split-vertical', category: 'built-in' },
  { type: 'humidifier', name: 'Humidifier', description: 'Humidifier control', icon: 'mdi:air-humidifier', category: 'built-in' },
  { type: 'iframe', name: 'iFrame', description: 'Embed a webpage', icon: 'mdi:web', category: 'built-in' },
  { type: 'light', name: 'Light', description: 'Light control card', icon: 'mdi:lightbulb', category: 'built-in' },
  { type: 'logbook', name: 'Logbook', description: 'Entity logbook entries', icon: 'mdi:book-open-variant', category: 'built-in' },
  { type: 'map', name: 'Map', description: 'Map with entity locations', icon: 'mdi:map', category: 'built-in' },
  { type: 'markdown', name: 'Markdown', description: 'Rendered Markdown text', icon: 'mdi:language-markdown', category: 'built-in' },
  { type: 'media-control', name: 'Media Control', description: 'Media player controls', icon: 'mdi:cast', category: 'built-in' },
  { type: 'picture', name: 'Picture', description: 'Display an image', icon: 'mdi:image', category: 'built-in' },
  { type: 'picture-elements', name: 'Picture Elements', description: 'Image with interactive elements', icon: 'mdi:image-edit', category: 'built-in' },
  { type: 'picture-entity', name: 'Picture Entity', description: 'Entity with background image', icon: 'mdi:image-area', category: 'built-in' },
  { type: 'picture-glance', name: 'Picture Glance', description: 'Image with entity icons', icon: 'mdi:image-multiple', category: 'built-in' },
  { type: 'plant-status', name: 'Plant Status', description: 'Plant monitor display', icon: 'mdi:flower', category: 'built-in' },
  { type: 'sensor', name: 'Sensor', description: 'Sensor with graph', icon: 'mdi:eye', category: 'built-in' },
  { type: 'shopping-list', name: 'Shopping List', description: 'Shopping list card', icon: 'mdi:cart', category: 'built-in' },
  { type: 'statistic', name: 'Statistic', description: 'Long-term statistic', icon: 'mdi:chart-box', category: 'built-in' },
  { type: 'statistics-graph', name: 'Statistics Graph', description: 'Statistics graph', icon: 'mdi:chart-bell-curve', category: 'built-in' },
  { type: 'thermostat', name: 'Thermostat', description: 'Climate control card', icon: 'mdi:thermostat', category: 'built-in' },
  { type: 'tile', name: 'Tile', description: 'Compact tile card', icon: 'mdi:square-rounded', category: 'built-in' },
  { type: 'todo-list', name: 'To-Do List', description: 'To-do list card', icon: 'mdi:checkbox-marked-outline', category: 'built-in' },
  { type: 'vertical-stack', name: 'Vertical Stack', description: 'Stack cards vertically', icon: 'mdi:arrow-split-horizontal', category: 'built-in' },
  { type: 'weather-forecast', name: 'Weather Forecast', description: 'Weather forecast card', icon: 'mdi:weather-partly-cloudy', category: 'built-in' },
];

@customElement('mc-card-picker')
export class CardPicker extends LitElement {
  static styles = [pickerStyles];

  @property({ type: String }) value = '';

  private _modalCtrl = new ModalDragResizeController(this);

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
          class="mc-picker-input"
          .value=${this.value}
          placeholder="card type (e.g. button, custom:mushroom-light-card)"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:form-select"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const { builtIn, custom } = this._getFilteredCards();
    const hasResults = builtIn.length > 0 || custom.length > 0;

    return html`
      <div class="mc-picker-overlay" @click=${() => { if (!this._modalCtrl.consumeDragFlag()) this._closeModal(); }}>
        <div class="mc-picker-modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:card-plus-outline"></ha-icon>
              <span class="mc-picker-title">Select Card</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${() => this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search cards..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => { this._searchQuery = (e.target as HTMLInputElement).value; }}
            />
          </div>
          <div class="mc-picker-list">
            ${hasResults
              ? html`
                  ${builtIn.length > 0 ? html`
                    <div class="mc-picker-category">Built-in Cards</div>
                    ${builtIn.map(card => this._renderCardItem(card))}
                  ` : ''}
                  ${custom.length > 0 ? html`
                    <div class="mc-picker-category">Custom Cards (HACS)</div>
                    ${custom.map(card => this._renderCardItem(card))}
                  ` : ''}
                `
              : html`<div class="mc-picker-empty">No cards found</div>`
            }
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${(e: PointerEvent) => this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${(e: TouchEvent) => this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `;
  }

  private _renderCardItem(card: CardInfo): TemplateResult {
    return html`
      <div class="mc-picker-item" @click=${() => this._selectCard(card.type)}>
        <div class="mc-picker-item-icon">
          <ha-icon icon=${card.icon}></ha-icon>
        </div>
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name">${card.name}</div>
          <div class="mc-picker-item-id">${card.type}</div>
        </div>
        <span class="mc-picker-item-badge">${card.category === 'custom' ? 'Custom' : 'Built-in'}</span>
      </div>
    `;
  }
}
