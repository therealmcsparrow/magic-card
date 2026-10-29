import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { pickerStyles } from '../../css/editor-css';
import { editorSystem } from '../../css/editor-stack';
import { renderPickerSearch, renderPickerWindow, PickerWindowController } from './picker-parts';
import { t, m, fold, type MessageIndex } from '../i18n';

interface CardInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'built-in' | 'custom';
}

/** A built-in card: its name and description are m() marks, resolved when the list is built. A name that is the same in every language (iFrame) is plain text. */
interface BuiltinCard extends Omit<CardInfo, 'name' | 'description'> {
  name: MessageIndex | string;
  description: MessageIndex;
}

const BUILTIN_CARDS: BuiltinCard[] = [
  { type: 'alarm-panel', name: m('card-editor.card-picker.alarm-panel'), description: m('card-editor.card-picker.alarm-control-panel'), icon: 'mdi:shield-home', category: 'built-in' },
  { type: 'area', name: m('card-editor.card-picker.area'), description: m('card-editor.card-picker.show-area-devices-and-entities'), icon: 'mdi:texture-box', category: 'built-in' },
  { type: 'button', name: m('card-editor.card-picker.button'), description: m('card-editor.card-picker.action-button-for-an-entity'), icon: 'mdi:gesture-tap-button', category: 'built-in' },
  { type: 'calendar', name: m('card-editor.card-picker.calendar'), description: m('card-editor.card-picker.calendar-display'), icon: 'mdi:calendar', category: 'built-in' },
  { type: 'conditional', name: m('card-editor.card-picker.conditional'), description: m('card-editor.card-picker.show-cards-based-on-conditions'), icon: 'mdi:eye-check', category: 'built-in' },
  { type: 'entities', name: m('card-editor.card-picker.entities'), description: m('card-editor.card-picker.list-of-entity-rows'), icon: 'mdi:format-list-bulleted', category: 'built-in' },
  { type: 'entity', name: m('card-editor.card-picker.entity'), description: m('card-editor.card-picker.single-entity-display'), icon: 'mdi:card-text', category: 'built-in' },
  { type: 'entity-filter', name: m('card-editor.card-picker.entity-filter'), description: m('card-editor.card-picker.filtered-entity-list'), icon: 'mdi:filter', category: 'built-in' },
  { type: 'gauge', name: m('card-editor.card-picker.gauge'), description: m('card-editor.card-picker.gauge-visualization'), icon: 'mdi:gauge', category: 'built-in' },
  { type: 'glance', name: m('card-editor.card-picker.glance'), description: m('card-editor.card-picker.quick-overview-of-entities'), icon: 'mdi:eye', category: 'built-in' },
  { type: 'grid', name: m('card-editor.card-picker.grid'), description: m('card-editor.card-picker.grid-layout-of-cards'), icon: 'mdi:view-grid', category: 'built-in' },
  { type: 'heading', name: m('card-editor.card-picker.heading'), description: m('card-editor.card-picker.section-heading'), icon: 'mdi:format-header-1', category: 'built-in' },
  { type: 'history-graph', name: m('card-editor.card-picker.history-graph'), description: m('card-editor.card-picker.entity-history-graph'), icon: 'mdi:chart-line', category: 'built-in' },
  { type: 'horizontal-stack', name: m('card-editor.card-picker.horizontal-stack'), description: m('card-editor.card-picker.stack-cards-horizontally'), icon: 'mdi:arrow-split-vertical', category: 'built-in' },
  { type: 'humidifier', name: m('card-editor.card-picker.humidifier'), description: m('card-editor.card-picker.humidifier-control'), icon: 'mdi:air-humidifier', category: 'built-in' },
  { type: 'iframe', name: 'iFrame', description: m('card-editor.card-picker.embed-a-webpage'), icon: 'mdi:web', category: 'built-in' },
  { type: 'light', name: m('card-editor.card-picker.light'), description: m('card-editor.card-picker.light-control-card'), icon: 'mdi:lightbulb', category: 'built-in' },
  { type: 'logbook', name: m('card-editor.card-picker.logbook'), description: m('card-editor.card-picker.entity-logbook-entries'), icon: 'mdi:book-open-variant', category: 'built-in' },
  { type: 'map', name: m('card-editor.card-picker.map'), description: m('card-editor.card-picker.map-with-entity-locations'), icon: 'mdi:map', category: 'built-in' },
  { type: 'markdown', name: m('card-editor.card-picker.markdown'), description: m('card-editor.card-picker.rendered-markdown-text'), icon: 'mdi:language-markdown', category: 'built-in' },
  { type: 'media-control', name: m('card-editor.card-picker.media-control'), description: m('card-editor.card-picker.media-player-controls'), icon: 'mdi:cast', category: 'built-in' },
  { type: 'picture', name: m('card-editor.card-picker.picture'), description: m('card-editor.card-picker.display-an-image'), icon: 'mdi:image', category: 'built-in' },
  { type: 'picture-elements', name: m('card-editor.card-picker.picture-elements'), description: m('card-editor.card-picker.image-with-interactive-elements'), icon: 'mdi:image-edit', category: 'built-in' },
  { type: 'picture-entity', name: m('card-editor.card-picker.picture-entity'), description: m('card-editor.card-picker.entity-with-background-image'), icon: 'mdi:image-area', category: 'built-in' },
  { type: 'picture-glance', name: m('card-editor.card-picker.picture-glance'), description: m('card-editor.card-picker.image-with-entity-icons'), icon: 'mdi:image-multiple', category: 'built-in' },
  { type: 'plant-status', name: m('card-editor.card-picker.plant-status'), description: m('card-editor.card-picker.plant-monitor-display'), icon: 'mdi:flower', category: 'built-in' },
  { type: 'sensor', name: m('card-editor.card-picker.sensor'), description: m('card-editor.card-picker.sensor-with-graph'), icon: 'mdi:eye', category: 'built-in' },
  { type: 'shopping-list', name: m('card-editor.card-picker.shopping-list'), description: m('card-editor.card-picker.shopping-list-card'), icon: 'mdi:cart', category: 'built-in' },
  { type: 'statistic', name: m('card-editor.card-picker.statistic'), description: m('card-editor.card-picker.long-term-statistic'), icon: 'mdi:chart-box', category: 'built-in' },
  { type: 'statistics-graph', name: m('card-editor.card-picker.statistics-graph'), description: m('card-editor.card-picker.statistics-graph'), icon: 'mdi:chart-bell-curve', category: 'built-in' },
  { type: 'thermostat', name: m('card-editor.card-picker.thermostat'), description: m('card-editor.card-picker.climate-control-card'), icon: 'mdi:thermostat', category: 'built-in' },
  { type: 'tile', name: m('card-editor.card-picker.tile'), description: m('card-editor.card-picker.compact-tile-card'), icon: 'mdi:square-rounded', category: 'built-in' },
  { type: 'todo-list', name: m('card-editor.card-picker.to-do-list'), description: m('card-editor.card-picker.to-do-list-card'), icon: 'mdi:checkbox-marked-outline', category: 'built-in' },
  { type: 'vertical-stack', name: m('card-editor.card-picker.vertical-stack'), description: m('card-editor.card-picker.stack-cards-vertically'), icon: 'mdi:arrow-split-horizontal', category: 'built-in' },
  { type: 'weather-forecast', name: m('card-editor.card-picker.weather-forecast'), description: m('card-editor.card-picker.weather-forecast-card'), icon: 'mdi:weather-partly-cloudy', category: 'built-in' },
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
      description: card.description || t('card-editor.card-picker.custom-card'),
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

    const builtIn = BUILTIN_CARDS.map((c): CardInfo => ({ ...c, name: typeof c.name === 'string' ? c.name : t(c.name), description: t(c.description) })).filter(filterFn);
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
          aria-label=${t('card-editor.card-picker.card-type')}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${t('card-editor.card-picker.select')}</button>
      </div>

      ${this._showModal ? this._renderModal() : ''}
    `;
  }

  private _renderModal(): TemplateResult {
    const { builtIn, custom } = this._getFilteredCards();
    const hasResults = builtIn.length > 0 || custom.length > 0;

    return html`
      ${renderPickerWindow(t('card-editor.card-picker.select-card'), () => this._closeModal(), 's', html`
          <div class="mc-picker-search">
            ${renderPickerSearch(t('card-editor.card-picker.search-cards'), this._searchQuery, (v) => { this._searchQuery = v; })}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${t('card-editor.card-picker.cards')}>
            ${hasResults
              ? html`
                  ${builtIn.length > 0 ? html`
                    <div class="mc-picker-category">${t('card-editor.card-picker.built-in-cards')}</div>
                    ${builtIn.map(card => this._renderCardItem(card))}
                  ` : ''}
                  ${custom.length > 0 ? html`
                    <div class="mc-picker-category">${t('card-editor.card-picker.custom-cards-hacs')}</div>
                    ${custom.map(card => this._renderCardItem(card))}
                  ` : ''}
                `
              : html`<div class="mc-picker-empty">${t('card-editor.card-picker.no-cards-found')}</div>`
            }
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${t('card-editor.card-picker.cancel')}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${t('card-editor.card-picker.save')}</button>
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
        <span class="chip">${card.category === 'custom' ? t('card-editor.card-picker.custom') : t('card-editor.card-picker.built-in')}</span>
      </button>
    `;
  }
}
