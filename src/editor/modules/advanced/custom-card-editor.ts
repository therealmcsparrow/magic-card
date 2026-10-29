import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { CardModule, CustomCardModuleConfig, HomeAssistant } from '../../../types';
import { renderTextField, renderCardField, renderFieldHint } from '../../../utils/form-utils';
import { toYaml, fromYaml } from '../../../utils/yaml-utils';
import {
  type ConfigurableElement,
  fullConfig,
  getCardHelpers,
  stableJson,
  whenDefined,
} from '../../../utils/card-helpers';
import { buildSyncContext } from '../base-editor';
import { t, tx } from '../../i18n';

/** Shown in the empty YAML box (sample card configuration, not translated text). */
const SAMPLE_YAML = ['entity: sensor.temperature', 'name: My Sensor', 'show_state: true'].join('\n');

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
          placeholder=${SAMPLE_YAML}
        ></textarea>
        ${!valid
          ? html`<div class="mc-yaml-fallback-error">
              ${t('card-editor.custom-card-editor.invalid-yaml-card-will-use-last-valid')}
            </div>`
          : nothing}
        <div class="mc-yaml-fallback-help">
          ${tx('card-editor.custom-card-editor.the-key-key-is-set-automatically-from', { key: html`<code>type</code>` })}
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
        ${gui ? t('card-editor.custom-card-editor.show-code-editor') : t('card-editor.custom-card-editor.show-visual-editor')}
      </button>
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const c = this.config;
    if (!c?.card_type) return nothing;
    if (this._status !== 'ready') return html`<div class="mc-editor-loading">${t('card-editor.custom-card-editor.loading-editor')}</div>`;
    if (!this._editor) return this._renderYaml(c, t('card-editor.custom-card-editor.no-visual-editor-available-for-this-card'));
    if (!this._yamlMode && !this._guiError) return html`${this._renderToggle(true)}${this._editor}`;
    return html`${this._renderToggle(false)}${this._renderYaml(
      c,
      this._guiError ? t('card-editor.custom-card-editor.the-visual-editor-does-not-support-this', { error: this._guiError }) : undefined,
    )}`;
  }
}

export const customCardEditor: ModuleEditor = {
  type: 'custom-card',
  tabs: ['general', 'conditions', 'design'],
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as CustomCardModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderTextField(t('card-editor.custom-card-editor.name'), c.name, (v) => onChange({ ...c, name: v }), 'name', syncCtx)}
        ${renderFieldHint(
          t('card-editor.custom-card-editor.an-optional-label-to-help-you-identify'),
          'mc-field-hint-tight',
        )}
        ${renderCardField(t('card-editor.custom-card-editor.card-type'), c.card_type, (v) => onChange({ ...c, card_type: v }))}
        ${c.card_type
          ? html`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
                ${t('card-editor.custom-card-editor.card-configuration')}
              </div>
              <div class="mc-card-editor-body">
                <mc-custom-card-editor .config=${c} .hass=${hass} .onChange=${onChange}></mc-custom-card-editor>
              </div>
            </div>
          `
          : nothing}
      </div>
    `;
  },
};
