import { LitElement, html, css, TemplateResult, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant, CustomCardModuleConfig } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { currentRenderContext } from '../../services/render-context';
import { getCardHelpers, whenDefined, fullConfig, type ConfigurableElement } from '../../utils/card-helpers';
import { customCardEmpty } from './custom-card-module';

/* Chunk-only (magic-card-modules-extra.js): nothing here runs at evaluation; the element is defined by install(). */

/**
 * A Lovelace card element the way HA creates one: through its card helpers (built-in cards, custom
 * cards, HA's own error card for a bad config). Without them (older frontends, the dev harness) a
 * `custom:` card is created directly.
 */
async function createCardElement(config: Record<string, unknown>): Promise<HTMLElement> {
  const helpers = getCardHelpers();
  if (helpers) return (await helpers).createCardElement(config);
  const type = String(config.type ?? '');
  if (!type.startsWith('custom:')) throw new Error('Home Assistant card helpers are not available');
  const tag = type.slice('custom:'.length);
  await whenDefined(tag);
  const el = document.createElement(tag) as ConfigurableElement;
  el.setConfig?.(config);
  return el;
}

/** An error card for a card that could not be created: HA's own when it is loaded. */
function errorCard(message: string, config: Record<string, unknown>): HTMLElement {
  if (customElements.get('hui-error-card')) {
    const el = document.createElement('hui-error-card') as ConfigurableElement;
    try {
      el.setConfig?.({ type: 'error', error: message, origConfig: config });
      return el;
    } catch {
      // fall through to our own
    }
  }
  const div = document.createElement('div');
  div.className = 'mc-embedded-error';
  div.setAttribute('role', 'alert');
  div.textContent = message;
  return div;
}

/** HA's error card or ours: shown instead of a card that could not be created. */
const isErrorCard = (el: Element): boolean => el.localName === 'hui-error-card' || el.classList.contains('mc-embedded-error');

/**
 * Wrapper component that embeds a HA Lovelace card element.
 * Manages the card lifecycle directly in the DOM to avoid issues
 * with Lit template diffing disrupting the embedded card's state.
 */
export class EmbeddedCard extends LitElement {
  static styles = css`
    :host { display: block; }
    .mc-embedded-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
      color: var(--secondary-text-color, #6b7280);
      font-size: 0.875rem;
    }
    .mc-embedded-error {
      color: var(--error-color, #ef4444);
      padding: 8px;
      font-size: 0.875rem;
    }
  `;

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String, attribute: 'card-type' }) cardType?: string;
  @property({ attribute: false }) cardConfig?: Record<string, unknown>;
  /** Like hui-card: the card is shown as a preview / in edit mode (handed to the embedded card). */
  @property({ attribute: false }) preview = false;
  @property({ attribute: false }) editMode = false;

  @state() private _element?: HTMLElement;
  /** Card type of the element shown (or being created). */
  private _currentCardType?: string;
  /** JSON of the config the element last received. */
  private _configHash?: string;
  /** Identity of the latest creation: an older one that finishes late is dropped. */
  private _generation = 0;

  protected updated(changedProps: PropertyValues): void {
    // Card type changed: create a new element (like HA's hui-card).
    if (changedProps.has('cardType') && this.cardType !== this._currentCardType) {
      this._createElement();
      return;
    }

    // Same type, new config: setConfig on the element; a config it refuses rebuilds it (HA's error card).
    if (changedProps.has('cardConfig') && this._element && this.cardType) {
      const config = fullConfig(this.cardType, this.cardConfig);
      const hash = JSON.stringify(config);
      if (hash !== this._configHash) {
        this._configHash = hash;
        const el = this._element as ConfigurableElement;
        // An error card takes any config (HA's has a setConfig too): the card itself is created again.
        if (typeof el.setConfig === 'function' && !isErrorCard(el)) {
          try {
            el.setConfig(config);
          } catch {
            this._createElement();
            return;
          }
        } else {
          this._createElement();
          return;
        }
      }
    }

    // Forward hass, preview and edit mode to the embedded element
    if (this._element && this.hass) {
      (this._element as ConfigurableElement).hass = this.hass;
    }
    if (this._element && (changedProps.has('preview') || changedProps.has('editMode'))) this._applyModes(this._element);
  }

  private _applyModes(element: HTMLElement): void {
    const el = element as ConfigurableElement;
    el.preview = this.preview;
    el.editMode = this.editMode;
  }

  private async _createElement(): Promise<void> {
    const generation = ++this._generation;
    const container = this.renderRoot.querySelector('.mc-embedded-container');
    if (!container) return;

    this._currentCardType = this.cardType;
    if (!this.cardType) {
      this._element = undefined;
      this._configHash = undefined;
      container.replaceChildren();
      return;
    }

    let element: HTMLElement;
    let config = fullConfig(this.cardType, this.cardConfig);
    try {
      element = await createCardElement(config);
    } catch (err) {
      element = errorCard(`Failed to load "${this.cardType}": ${err instanceof Error ? err.message : String(err)}`, config);
    }
    // A newer type / config was asked for while this one loaded.
    if (generation !== this._generation) return;
    // The config changed while loading (same type): hand the element the latest one.
    const latest = fullConfig(this.cardType ?? '', this.cardConfig);
    if (JSON.stringify(latest) !== JSON.stringify(config)) {
      // An error for an older config: the latest one may well work.
      if (isErrorCard(element)) {
        this._createElement();
        return;
      }
      config = latest;
      try {
        (element as ConfigurableElement).setConfig?.(config);
      } catch {
        // HA's card helpers handle a bad config on the next rebuild
      }
    }

    if (this.hass) (element as ConfigurableElement).hass = this.hass;
    this._applyModes(element);
    this._configHash = JSON.stringify(config);
    // HA cards ask to be recreated (e.g. a custom card defined after its first render); handle it
    // here so the request never reaches HA's own card wrappers (they would rebuild the magic card).
    element.addEventListener('ll-rebuild', (e: Event) => {
      e.stopPropagation();
      if (this._element !== element) return;
      this._createElement();
    });
    container.replaceChildren(element);
    this._element = element;
  }

  protected firstUpdated(): void {
    if (this.cardType) this._createElement();
  }

  // The container is filled by hand (_createElement), so it holds no Lit parts of its own.
  protected render(): TemplateResult {
    return html`${!this._element && this.cardType
      ? html`<div class="mc-embedded-loading">Loading card...</div>`
      : nothing}<div class="mc-embedded-container"></div>`;
  }
}

export class CustomCardView implements ModuleView {
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CustomCardModuleConfig;
    const ctx = currentRenderContext();

    if (!c.card_type) return customCardEmpty();

    return html`
      <div class="mc-module mc-custom-card">
        <mc-embedded-card
          card-type=${c.card_type}
          .cardConfig=${c.card_config || {}}
          .hass=${hass}
          .preview=${!!ctx?.preview}
          .editMode=${!!ctx?.editMode}
        ></mc-embedded-card>
      </div>
    `;
  }
}
