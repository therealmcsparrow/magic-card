import { LitElement, html, css, TemplateResult, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CustomCardModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderCardField, renderFieldHint } from '../../utils/form-utils';
import { toYaml, fromYaml } from '../../utils/yaml-utils';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { currentRenderContext } from '../../services/render-context';

export interface CardHelpers {
  createCardElement(config: Record<string, unknown>): HTMLElement;
}

type ConfigurableElement = HTMLElement & {
  hass?: HomeAssistant;
  preview?: boolean;
  editMode?: boolean;
  setConfig?: (c: Record<string, unknown>) => void;
};

const WAIT_MS = 5000;

let _cardHelpersPromise: Promise<CardHelpers> | null = null;

/** HA's card helpers (window.loadCardHelpers), loaded once; undefined outside Home Assistant. */
export function getCardHelpers(): Promise<CardHelpers> | undefined {
  const load = (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers;
  if (typeof load !== 'function') return undefined;
  if (!_cardHelpersPromise) {
    _cardHelpersPromise = Promise.resolve(load()).catch((err: unknown) => {
      _cardHelpersPromise = null; // try again next time
      throw err;
    });
  }
  return _cardHelpersPromise;
}

function whenDefined(tag: string): Promise<unknown> {
  if (customElements.get(tag)) return Promise.resolve();
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    customElements.whenDefined(tag),
    new Promise<void>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timeout waiting for ${tag}`)), WAIT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

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

/** JSON with object keys sorted: the same config in another key order gives the same string. */
export function stableJson(value: unknown): string {
  const sort = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sort((v as Record<string, unknown>)[k])]));
    }
    return v;
  };
  return JSON.stringify(sort(value)) ?? '';
}

const fullConfig = (cardType: string, cardConfig: Record<string, unknown> | undefined) => ({ ...(cardConfig || {}), type: cardType });

/**
 * Wrapper component that embeds a HA Lovelace card element.
 * Manages the card lifecycle directly in the DOM to avoid issues
 * with Lit template diffing disrupting the embedded card's state.
 */
@customElement('mc-embedded-card')
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

type Localize = (key: string) => string;
type FormSchema = { name?: string } & Record<string, unknown>;

/** What a card's static getConfigForm() returns (HA's LovelaceConfigForm). */
interface CardConfigForm {
  schema: FormSchema[];
  assertConfig?: (config: Record<string, unknown>) => void;
  computeLabel?: (schema: FormSchema, localize?: Localize) => string | undefined;
  computeHelper?: (schema: FormSchema, localize?: Localize) => string | undefined;
}

/** A Lovelace card class: its visual editor is one of these statics (like HA's hui-card-element-editor). */
interface CardClass {
  getConfigElement?: () => HTMLElement | Promise<HTMLElement>;
  getConfigForm?: () => CardConfigForm | Promise<CardConfigForm>;
}

/**
 * The class of a card type, the way HA finds it: `hui-<type>-card` for a built-in card (most of
 * them are lazy: their class only exists once HA's card helpers created one, which loads it), the
 * element of a `custom:` card. The element HA creates for a config is not used: for a config the
 * card refuses (an incomplete one) that is HA's error card, which has no editor.
 */
async function cardClass(cardType: string, config: Record<string, unknown>): Promise<CardClass | undefined> {
  if (cardType.startsWith('custom:')) {
    const tag = cardType.slice('custom:'.length);
    await whenDefined(tag);
    return customElements.get(tag) as CardClass | undefined;
  }
  const tag = `hui-${cardType}-card`;
  if (!customElements.get(tag)) {
    const helpers = getCardHelpers();
    if (!helpers) return undefined;
    // Creating one makes HA load a lazy card's code.
    const card = (await helpers).createCardElement(config);
    // An unknown type gives HA's error card straight away: there is no class to wait for.
    if (!customElements.get(tag) && card.localName !== tag) return undefined;
    await whenDefined(tag);
  }
  return customElements.get(tag) as CardClass | undefined;
}

/**
 * Editor for a card with a getConfigForm() schema when HA's own hui-form-editor is not loaded:
 * the same ha-form with the card's labels and helpers, assertConfig on every config, and its
 * value-changed turned into config-changed.
 */
@customElement('mc-card-form-editor')
export class CardFormEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) schema: FormSchema[] = [];
  @state() private _config?: Record<string, unknown>;
  computeLabel?: CardConfigForm['computeLabel'];
  computeHelper?: CardConfigForm['computeHelper'];
  assertConfig?: CardConfigForm['assertConfig'];

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  /** Throws for a config the form cannot show (HA then shows the YAML editor). */
  setConfig(config: Record<string, unknown>): void {
    this.assertConfig?.(config);
    this._config = config;
  }

  private get _localize(): Localize | undefined {
    return (this.hass as unknown as { localize?: Localize } | undefined)?.localize;
  }

  private _label = (schema: FormSchema): string =>
    this.computeLabel?.(schema, this._localize) ||
    (schema.name ? this._localize?.(`ui.panel.lovelace.editor.card.generic.${schema.name}`) : '') ||
    schema.name ||
    '';

  private _helper = (schema: FormSchema): string | undefined => this.computeHelper?.(schema, this._localize);

  private _changed(e: CustomEvent): void {
    e.stopPropagation();
    const config = e.detail?.value as Record<string, unknown> | undefined;
    if (!config) return;
    // The host does not hand an echo of our own edit back: keep the form on it.
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { bubbles: true, composed: true, detail: { config } }));
  }

  protected render(): TemplateResult {
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

/** HA's form editor for a getConfigForm() card (its own when loaded, else ours around ha-form). */
async function formEditor(form: CardConfigForm): Promise<ConfigurableElement | undefined> {
  if (!Array.isArray(form?.schema)) return undefined;
  const tag = customElements.get('hui-form-editor') ? 'hui-form-editor' : 'mc-card-form-editor';
  if (tag === 'mc-card-form-editor' && !customElements.get('ha-form')) {
    try {
      await whenDefined('ha-form');
    } catch {
      return undefined;
    }
  }
  const editor = document.createElement(tag) as ConfigurableElement & CardConfigForm;
  editor.schema = form.schema;
  if (form.computeLabel) editor.computeLabel = form.computeLabel;
  if (form.computeHelper) editor.computeHelper = form.computeHelper;
  if (form.assertConfig) editor.assertConfig = form.assertConfig;
  return editor;
}

/**
 * The embedded card's own editor, one per place it is shown (pane and studio inspectors, inline
 * layout editors), so two hosts never fight over one element. Like HA's card editor it comes from
 * the card's class: getConfigElement() (the card's editor element) or getConfigForm() (a form);
 * a code editor toggle switches to YAML, and a card without either (or a config the visual editor
 * cannot show) gets YAML. The editor's `config-changed` is stopped here and written into the module
 * through the `onChange` of the latest render, so it can never write back an outdated module config.
 */
@customElement('mc-custom-card-editor')
export class CustomCardEditor extends LitElement {
  @property({ attribute: false }) config?: CustomCardModuleConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange?: (updated: CardModule) => void;

  @state() private _status: 'idle' | 'loading' | 'ready' = 'idle';
  /** The user asked for the code editor. */
  @state() private _yamlMode = false;
  /** Why the visual editor cannot show the current config (its setConfig threw). */
  @state() private _guiError?: string;
  private _editor?: ConfigurableElement;
  /** Card type the editor (or YAML fallback) was made for. */
  private _editorType?: string;
  /** JSON of the config the editor last received or emitted. */
  private _synced = '';
  /**
   * Configs the editor emitted that may still come back through the host (each one re-renders the
   * module, possibly after the editor has emitted newer ones). Such an echo is not handed back to
   * the editor: it would reset it to an older config and lose the latest edits.
   */
  private _emitted: string[] = [];
  private _generation = 0;

  // Light DOM: the inspector's styles apply, and the editor sits in the inspector's tree like before.
  protected createRenderRoot(): HTMLElement {
    return this;
  }

  protected willUpdate(): void {
    const cardType = this.config?.card_type || undefined;
    if (cardType !== this._editorType) this._load(cardType);
  }

  protected updated(): void {
    const editor = this._editor;
    const c = this.config;
    if (!editor || this._status !== 'ready' || !c?.card_type) return;
    if (this.hass) editor.hass = this.hass;
    // Like HA's hui-element-editor: hand the editor the current config (undo, YAML, template sync).
    // Key order does not matter: a host may store the config with its keys reordered.
    const full = stableJson(fullConfig(c.card_type, c.card_config));
    const echo = this._emitted.indexOf(full);
    if (echo !== -1) {
      // Our own edit coming back (maybe an older one): drop it and everything emitted before it.
      this._emitted.splice(0, echo + 1);
      return;
    }
    if (full !== this._synced) {
      this._emitted = [];
      this._synced = full;
      let error: string | undefined;
      try {
        editor.setConfig?.(JSON.parse(JSON.stringify(fullConfig(c.card_type, c.card_config))));
      } catch (err) {
        // Like HA: a config the visual editor cannot show is edited as YAML.
        error = err instanceof Error ? err.message : String(err);
      }
      if (error !== this._guiError) this._guiError = error;
    }
  }

  private async _load(cardType: string | undefined): Promise<void> {
    const generation = ++this._generation;
    this._editorType = cardType;
    this._editor = undefined;
    this._synced = '';
    this._emitted = [];
    this._guiError = undefined;
    if (!cardType) {
      this._status = 'idle';
      return;
    }
    this._status = 'loading';
    let editor: ConfigurableElement | undefined;
    try {
      editor = await this._createEditor(cardType);
    } catch {
      editor = undefined;
    }
    if (generation !== this._generation) return;
    if (editor) {
      // The embedded editor's config-changed carries the EMBEDDED card's config. It bubbles and is
      // composed: left alone it reaches HA's card dialog, which takes it as the whole card's new
      // config (the magic card is replaced by the embedded card and our editor is torn down).
      editor.addEventListener('config-changed', ((e: CustomEvent) => {
        e.stopPropagation();
        // A detached or replaced editor (another module selected, card type changed) writes nothing.
        if (editor !== this._editor || !this.isConnected) return;
        const newConfig = e.detail?.config as Record<string, unknown> | undefined;
        const current = this.config;
        if (!current || !newConfig || typeof newConfig !== 'object' || Array.isArray(newConfig)) return;
        // `type` is stored separately (card_type)
        const { type: _type, ...rest } = newConfig;
        this._synced = stableJson(fullConfig(cardType, rest));
        this._emitted.push(this._synced);
        this.onChange?.({ ...current, card_config: rest, card_config_yaml: undefined } as CustomCardModuleConfig);
      }) as EventListener);
    }
    this._editor = editor;
    this._status = 'ready';
  }

  /** The card's visual editor from its class, or undefined when it has none. */
  private async _createEditor(cardType: string): Promise<ConfigurableElement | undefined> {
    const ctor = await cardClass(cardType, fullConfig(cardType, this.config?.card_config));
    let editor: ConfigurableElement | undefined;
    // Like HA's hui-element-editor: the card's editor element first, its form when it has none.
    if (typeof ctor?.getConfigElement === 'function') {
      editor = ((await ctor.getConfigElement()) as ConfigurableElement | undefined) ?? undefined;
      if (editor?.localName?.includes('-')) await whenDefined(editor.localName);
    }
    if (!editor && typeof ctor?.getConfigForm === 'function') {
      editor = await formEditor(await ctor.getConfigForm());
    }
    if (editor && this.hass) editor.hass = this.hass;
    return editor ?? undefined;
  }

  private _renderYaml(c: CustomCardModuleConfig, note: string | undefined): TemplateResult {
    const yamlStr = c.card_config_yaml ?? (c.card_config ? toYaml(c.card_config) : '');
    const parsed = fromYaml<Record<string, unknown>>(yamlStr);
    const valid = yamlStr === '' || parsed !== null;
    return html`
      <div class="mc-yaml-fallback">
        ${note ? html`<div class="mc-yaml-fallback-note">${note}</div>` : nothing}
        <textarea
          .value=${yamlStr}
          @input=${(e: InputEvent) => {
            const raw = (e.target as HTMLTextAreaElement).value;
            const current = this.config ?? c;
            const result = fromYaml<Record<string, unknown>>(raw);
            if (result !== null && typeof result === 'object' && !Array.isArray(result)) {
              this.onChange?.({ ...current, card_config: result, card_config_yaml: raw } as CustomCardModuleConfig);
            } else {
              this.onChange?.({ ...current, card_config_yaml: raw } as CustomCardModuleConfig);
            }
          }}
          rows="12"
          placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
        ></textarea>
        ${!valid
          ? html`<div class="mc-yaml-fallback-error">
              Invalid YAML - card will use last valid configuration
            </div>`
          : nothing}
        <div class="mc-yaml-fallback-help">
          The <code>type</code> key is set automatically from Card Type. Do not include it here.
        </div>
      </div>
    `;
  }

  private _renderToggle(gui: boolean): TemplateResult {
    return html`<div class="mc-card-editor-toolbar">
      <button
        type="button"
        class="mc-btn mc-btn-secondary mc-btn-compact mc-card-editor-toggle"
        ?disabled=${!gui && !!this._guiError}
        @click=${() => {
          this._yamlMode = gui;
        }}
      >
        ${gui ? 'Show code editor' : 'Show visual editor'}
      </button>
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c?.card_type) return nothing;
    if (this._status !== 'ready') return html`<div class="mc-editor-loading">Loading editor...</div>`;
    if (!this._editor) return this._renderYaml(c, 'No visual editor available for this card type. Configure using YAML:');
    if (!this._yamlMode && !this._guiError) return html`${this._renderToggle(true)}${this._editor}`;
    return html`${this._renderToggle(false)}${this._renderYaml(
      c,
      this._guiError ? `The visual editor does not support this configuration: ${this._guiError}` : undefined,
    )}`;
  }
}

class CustomCardModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'custom-card',
    name: 'Custom card',
    description: 'Embed any 3rd party Lovelace card',
    category: 'advanced',
    icon: 'mdi:card-plus-outline',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  createDefault(): CustomCardModuleConfig {
    return {
      id: generateId('custom-card'),
      type: 'custom-card',
      name: '',
      card_type: '',
      card_config: {},
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CustomCardModuleConfig;
    const ctx = currentRenderContext();

    if (!c.card_type) {
      return html`
        <div class="mc-module mc-custom-card mc-custom-card-placeholder">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span>No card type set</span>
        </div>
      `;
    }

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

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as CustomCardModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Name', c.name, (v) => onChange({ ...c, name: v }), 'name', syncCtx)}
        ${renderFieldHint(
          'An optional label to help you identify this card in the editor.',
          'mc-field-hint-tight',
        )}
        ${renderCardField('Card type', c.card_type, (v) => onChange({ ...c, card_type: v }))}
        ${c.card_type
          ? html`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
                Card configuration
              </div>
              <div class="mc-card-editor-body">
                <mc-custom-card-editor .config=${c} .hass=${hass} .onChange=${onChange}></mc-custom-card-editor>
              </div>
            </div>
          `
          : nothing}
      </div>
    `;
  }

  /** The embedded card tracks its own entities: it gets every hass update. */
  getDependencies(): ModuleDependencies {
    return { forwardHass: true };
  }

  // No card type yet is not an error: the preview shows a "No card type set" placeholder.
  validate(config: CardModule): string[] {
    const c = config as CustomCardModuleConfig;
    if (c.card_config !== undefined && (typeof c.card_config !== 'object' || c.card_config === null || Array.isArray(c.card_config))) {
      return ['Card config must be a mapping'];
    }
    return [];
  }
}

ModuleRegistry.register(new CustomCardModule());
