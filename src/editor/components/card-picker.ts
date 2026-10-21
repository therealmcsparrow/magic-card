import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t, m, fold, type MessageId } from '../i18n';

interface CardInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'built-in' | 'custom';
}

/** A built-in card: its name and description are m() marks, resolved when the list is built. */
interface BuiltinCard extends Omit<CardInfo, 'name' | 'description'> {
  name: MessageId;
  description: MessageId;
}

const BUILTIN_CARDS: BuiltinCard[] = [
  { type: 'alarm-panel', name: m('Alarm panel'), description: m('Alarm control panel'), icon: 'mdi:shield-home', category: 'built-in' },
  { type: 'area', name: m('Area'), description: m('Show area devices and entities'), icon: 'mdi:texture-box', category: 'built-in' },
  { type: 'button', name: m('Button'), description: m('Action button for an entity'), icon: 'mdi:gesture-tap-button', category: 'built-in' },
  { type: 'calendar', name: m('Calendar'), description: m('Calendar display'), icon: 'mdi:calendar', category: 'built-in' },
  { type: 'conditional', name: m('Conditional'), description: m('Show cards based on conditions'), icon: 'mdi:eye-check', category: 'built-in' },
  { type: 'entities', name: m('Entities'), description: m('List of entity rows'), icon: 'mdi:format-list-bulleted', category: 'built-in' },
  { type: 'entity', name: m('Entity'), description: m('Single entity display'), icon: 'mdi:card-text', category: 'built-in' },
  { type: 'entity-filter', name: m('Entity filter'), description: m('Filtered entity list'), icon: 'mdi:filter', category: 'built-in' },
  { type: 'gauge', name: m('Gauge'), description: m('Gauge visualization'), icon: 'mdi:gauge', category: 'built-in' },
  { type: 'glance', name: m('Glance'), description: m('Quick overview of entities'), icon: 'mdi:eye', category: 'built-in' },
  { type: 'grid', name: m('Grid'), description: m('Grid layout of cards'), icon: 'mdi:view-grid', category: 'built-in' },
  { type: 'heading', name: m('Heading'), description: m('Section heading'), icon: 'mdi:format-header-1', category: 'built-in' },
  { type: 'history-graph', name: m('History graph'), description: m('Entity history graph'), icon: 'mdi:chart-line', category: 'built-in' },
  { type: 'horizontal-stack', name: m('Horizontal stack'), description: m('Stack cards horizontally'), icon: 'mdi:arrow-split-vertical', category: 'built-in' },
  { type: 'humidifier', name: m('Humidifier'), description: m('Humidifier control'), icon: 'mdi:air-humidifier', category: 'built-in' },
  { type: 'iframe', name: 'iFrame', description: m('Embed a webpage'), icon: 'mdi:web', category: 'built-in' },
  { type: 'light', name: m('Light'), description: m('Light control card'), icon: 'mdi:lightbulb', category: 'built-in' },
  { type: 'logbook', name: m('Logbook'), description: m('Entity logbook entries'), icon: 'mdi:book-open-variant', category: 'built-in' },
  { type: 'map', name: m('Map'), description: m('Map with entity locations'), icon: 'mdi:map', category: 'built-in' },
  { type: 'markdown', name: m('Markdown'), description: m('Rendered Markdown text'), icon: 'mdi:language-markdown', category: 'built-in' },
  { type: 'media-control', name: m('Media control'), description: m('Media player controls'), icon: 'mdi:cast', category: 'built-in' },
  { type: 'picture', name: m('Picture'), description: m('Display an image'), icon: 'mdi:image', category: 'built-in' },
  { type: 'picture-elements', name: m('Picture elements'), description: m('Image with interactive elements'), icon: 'mdi:image-edit', category: 'built-in' },
  { type: 'picture-entity', name: m('Picture entity'), description: m('Entity with background image'), icon: 'mdi:image-area', category: 'built-in' },
  { type: 'picture-glance', name: m('Picture glance'), description: m('Image with entity icons'), icon: 'mdi:image-multiple', category: 'built-in' },
  { type: 'plant-status', name: m('Plant status'), description: m('Plant monitor display'), icon: 'mdi:flower', category: 'built-in' },
  { type: 'sensor', name: m('Sensor'), description: m('Sensor with graph'), icon: 'mdi:eye', category: 'built-in' },
  { type: 'shopping-list', name: m('Shopping list'), description: m('Shopping list card'), icon: 'mdi:cart', category: 'built-in' },
  { type: 'statistic', name: m('Statistic'), description: m('Long-term statistic'), icon: 'mdi:chart-box', category: 'built-in' },
  { type: 'statistics-graph', name: m('Statistics graph'), description: m('Statistics graph'), icon: 'mdi:chart-bell-curve', category: 'built-in' },
  { type: 'thermostat', name: m('Thermostat'), description: m('Climate control card'), icon: 'mdi:thermostat', category: 'built-in' },
  { type: 'tile', name: m('Tile'), description: m('Compact tile card'), icon: 'mdi:square-rounded', category: 'built-in' },
  { type: 'todo-list', name: m('To-Do List'), description: m('To-do list card'), icon: 'mdi:checkbox-marked-outline', category: 'built-in' },
  { type: 'vertical-stack', name: m('Vertical stack'), description: m('Stack cards vertically'), icon: 'mdi:arrow-split-horizontal', category: 'built-in' },
  { type: 'weather-forecast', name: m('Weather forecast'), description: m('Weather forecast card'), icon: 'mdi:weather-partly-cloudy', category: 'built-in' },
];

@customElement('mc-card-picker')
export class CardPicker extends LitElement {
  static styles = [editorSystem, pickerStyles];

  @property({ type: String }) value = '';

  private _windowCtrl = new PickerWindowController(this, () => this._closeModal());

  @state() private _showModal = false;
  @state() private _searchQuery = '';
  @state() private _selectedCardType = '';

  private _openModal(): void {
    this._selectedCardType = this.value;
    this._showModal = true;
    this._searchQuery = '';
  }

  private _closeModal(): void {
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
      description: card.description || t('Custom card'),
      icon: 'mdi:puzzle',
      category: 'custom' as const,
    }));
  }

  private _getFilteredCards(): { builtIn: CardInfo[]; custom: CardInfo[] } {
    const q = fold(this._searchQuery);

    const filterFn = (card: CardInfo) => {
      if (!q) return true;
      return card.type.toLowerCase().includes(q) ||
        fold(card.name).includes(q) ||
        fold(card.description).includes(q);
    };

    const builtIn = BUILTIN_CARDS.map((c): CardInfo => ({ ...c, name: t(c.name), description: t(c.description) })).filter(filterFn);
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
          aria-label=${t('Card type')}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${t('Select')}</button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const { builtIn, custom } = this._getFilteredCards();
    const hasResults = builtIn.length > 0 || custom.length > 0;

    return html`
      ${renderPickerWindow(t('Select card'), () => this._closeModal(), 's', html`
          <div class="mc-picker-search">
            ${renderPickerSearch(t('Search cards'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${t('Cards')}>
            ${hasResults
              ? html`
                  ${builtIn.length > 0 ? html`
                    <div class="mc-picker-category">${t('Built-in cards')}</div>
                    ${builtIn.map(card => this._renderCardItem(card))}
                  ` : ''}
                  ${custom.length > 0 ? html`
                    <div class="mc-picker-category">${t('Custom cards (HACS)')}</div>
                    ${custom.map(card => this._renderCardItem(card))}
                  ` : ''}
                `
              : html`<div class="mc-picker-empty">${t('No cards found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('Cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${t('Save')}</button>
          </div>
      `)}
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
          <span class="mc-picker-item-id" title=${card.type}>${card.type}</span>
        </span>
        <span class="chip">${card.category === 'custom' ? t('Custom') : t('Built-in')}</span>
      </button>
    `;
  }
}
