import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ImageSummary, SavedImage, SavedImageInput } from '../contracts/mcu-library-images';
import { editorSystem } from '../css/editor-stack';
import { cardStateOf } from '../editor/custom/bridge';
import { copyText } from '../editor/components/copy-text';
import type { HomeAssistant } from '../types';
import { needSvgImage } from '../utils/svg-image-loader';
import { addImageModuleBehind } from './card-module';
import { openImageEditor } from './editor-host';
import { getImage, listImages, resetImages, type Listing } from './library';
import { t } from './i18n';
import { THUMB_RE, entitiesOf, isLibraryValue, pickKeys, refId, sameShape, shapeKeys, shapeOf, type FieldContext, type Shape } from './model';

// <mc-library-image-field>: the image input of the image module and background layers; writes through one `image-change` event, detail { keys }.

const DESCRIPTION_MAX = 500;
const COUNT_FROM = 450;
const LIST_SHOWN = 8;

/**
 * What a pick leaves for the field that shows it. The form around the field can be drawn again when the image is set, which
 * replaces the field: the new one then takes focus on its Choose button and says what was set, once.
 */
let carry: { id: string; context: FieldContext; msg: string; until: number } | undefined;
const CARRY_MS = 3000;
const taken = new WeakSet<object>();

export class McLibraryImageField extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
      }
      fieldset {
        margin: 0;
        padding: 0;
        border: 0;
        min-width: 0;
      }
      legend {
        padding: 0;
        margin-bottom: 4px;
        font-weight: 600;
      }
      :host([compact]) legend {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
      .choice {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-bottom: 8px;
      }
      .choice label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 24px;
      }
      .acts {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
      .thumb {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 42px;
        overflow: hidden;
        border-radius: 4px;
        background: var(--mc-surface-2, rgba(128, 128, 128, 0.12));
      }
      .thumb img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .name {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      code {
        overflow-wrap: anywhere;
      }
      .line {
        margin: 4px 0;
        font-size: 0.9em;
        color: var(--mc-text-2, var(--secondary-text-color));
      }
      .warn {
        margin: 4px 0;
        color: var(--mc-text, var(--primary-text-color));
      }
      .result {
        margin: 4px 0;
        min-height: 0;
      }
      textarea {
        width: 100%;
        min-height: 72px;
        box-sizing: border-box;
        font: inherit;
      }
      .count {
        font-size: 0.85em;
        text-align: end;
      }
      .uses-list {
        margin: 4px 0;
        margin-inline-start: 20px;
        padding: 0;
      }
      .colours {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 8px 0 4px;
      }
      .colours > div {
        min-width: 140px;
        flex: 1;
      }
      .strip {
        display: block;
        width: 96px;
        height: 54px;
      }
      .state {
        font-weight: 600;
        min-width: 2ch;
      }
      .block {
        margin-top: 12px;
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  /** The image value as stored: a URL, a media id or a library reference. */
  @property() value = '';
  @property() context: FieldContext = 'module';
  /** A state row: thumbnail, name, Choose and Clear only. */
  @property({ type: Boolean, reflect: true }) compact = false;
  /** The module (module context): aspect_ratio, colors, description and state_summary are read from it. */
  @property({ attribute: false }) module: { aspect_ratio?: unknown; colors?: { main?: string; accent?: string }; description?: string; state_summary?: boolean } = {};
  /** The module draws its picture from an entity: the image source is hidden, the description stays. */
  @property({ type: Boolean }) hideSource = false;
  @property() label = '';
  /** A state row that opens the list: says once when to use live parts and when to use states. */
  @property({ type: Boolean }) statesHint = false;

  @state() private _list?: Listing;
  @state() private _img?: SavedImage;
  @state() private _mode?: 'library' | 'url';
  @state() private _picking = false;
  @state() private _msg = '';
  @state() private _failed = false;
  @state() private _uses = false;

  connectedCallback(): void {
    super.connectedCallback();
    void this._load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('value') && changed.get('value') !== undefined) void this._loadImage();
    if (changed.has('value') && refId(this.value)) needSvgImage(undefined);
  }

  protected firstUpdated(): void {
    void this._loadImage();
  }

  protected updated(): void {
    const c = carry;
    if (!c || !this.isConnected || Date.now() > c.until) return;
    if (c.id !== this._id || c.context !== this.context || taken.has(this)) return;
    const choose = this.shadowRoot?.querySelector<HTMLElement>('[data-act=choose]');
    if (!choose || this._picking) return;
    taken.add(this);
    this._msg = c.msg;
    choose.focus();
  }

  private async _load(): Promise<void> {
    const list = await listImages(this.hass);
    this._list = list;
    void this._loadImage();
  }

  /** The connections of the chosen image (only when it has any). */
  private async _loadImage(): Promise<void> {
    const id = refId(this.value);
    const summary = id ? this._list?.items.find((i) => i.id === id) : undefined;
    if (!id || !summary || summary.bindings < 1) {
      this._img = undefined;
      return;
    }
    const img = await getImage(this.hass, id);
    if (refId(this.value) === id) this._img = img;
  }

  private get _id(): string | undefined {
    return refId(this.value);
  }

  private get _summary(): ImageSummary | undefined {
    const id = this._id;
    return id ? this._list?.items.find((i) => i.id === id) : undefined;
  }

  private get _canWrite(): boolean {
    return (this.hass as { user?: { is_admin?: boolean } } | undefined)?.user?.is_admin === true && this._list?.state === 'ok';
  }

  private get _shape(): Shape | undefined {
    return shapeOf(this._summary?.view_box);
  }

  private _emit(keys: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent('image-change', { detail: { keys }, bubbles: true, composed: true }));
  }

  private _say(msg: string): void {
    this._msg = msg;
  }

  private _focusChoose(): void {
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLElement>('[data-act=choose]')?.focus());
  }

  private _use(id: string, view_box: string | undefined, name: string): void {
    const { keys, shapeSet } = pickKeys(this.context, this.module, id, shapeOf(view_box));
    this._emit(keys);
    this._mode = 'library';
    this._picking = false;
    const said = t('image-tools.mc-library-image-field.image-set-name', { name }) + (shapeSet ? ' ' + t('image-tools.mc-library-image-field.card-shape-set-to-shape', { shape: String(keys.aspect_ratio) }) : '');
    this._say(said);
    carry = { id, context: this.context, msg: said, until: Date.now() + CARRY_MS };
    this._focusChoose();
  }

  private _picked(id: string): void {
    const s = this._list?.items.find((i) => i.id === id);
    this._use(id, s?.view_box, s?.name ?? id);
  }

  private async _openEditor(source: { kind: 'image-blank' } | { kind: 'image'; id: string }): Promise<void> {
    this._failed = false;
    const r = await openImageEditor({ from: this, hass: this.hass, source, onSaved: (s) => this._saved(s) });
    if (r === 'failed') this._failed = true;
  }

  private _saved(s: SavedImageInput): void {
    resetImages();
    void this._load();
    this._use(s.id, s.view_box, s.name);
  }

  private async _copy(): Promise<void> {
    const ok = await copyText(this.value, this.shadowRoot!);
    this._say(ok ? t('image-tools.mc-library-image-field.reference-copied') : t('image-tools.mc-library-image-field.the-reference-could-not-be-copied-select'));
  }

  private _addModule(): void {
    if (addImageModuleBehind(this, this.value, this._shape?.label)) this._say(t('image-tools.mc-library-image-field.image-module-added-behind-the-content'));
  }

  private _colours(patch: { main?: string; accent?: string }): void {
    const next: Record<string, string> = {};
    const cur = { ...this.module.colors, ...patch };
    if (cur.main) next.main = cur.main;
    if (cur.accent) next.accent = cur.accent;
    this._emit({ colors: Object.keys(next).length ? next : undefined });
  }

  private _friendly(eid: string): string {
    return (this.hass?.states?.[eid]?.attributes?.friendly_name as string | undefined) || eid;
  }

  private _stateText(eid: string): string {
    const st = this.hass?.states?.[eid];
    if (!st) return t('image-tools.mc-library-image-field.not-found');
    const fmt = (this.hass as unknown as { formatEntityState?: (s: unknown) => string })?.formatEntityState;
    return typeof fmt === 'function' ? fmt.call(this.hass, st) : st.state;
  }

  // ── pieces ──

  private _thumb(s: ImageSummary | undefined): TemplateResult {
    return html`<span class="thumb" aria-hidden="true">${s?.thumb && THUMB_RE.test(s.thumb) ? html`<img alt="" src=${s.thumb} />` : html`<ha-icon icon="mdi:image-outline"></ha-icon>`}</span>`;
  }

  private _media(): TemplateResult {
    const lib = isLibraryValue(this.value);
    return html`<mc-media-picker .hass=${this.hass} .value=${lib ? '' : this.value} .mediaType=${'image'} @value-changed=${(e: CustomEvent) => {
      e.stopPropagation();
      this._emit({ image: String(e.detail.value) });
    }}></mc-media-picker>`;
  }

  private _chooseButton(label: string): TemplateResult {
    return html`<button type="button" class="btn btn-secondary btn-sm" data-act="choose" data-focus-key="image-field" @click=${() => (this._picking = true)}>${label}</button>`;
  }

  /** The chosen library image: thumbnail, name, shape and the buttons. */
  private _chosen(): TemplateResult {
    const lib = isLibraryValue(this.value);
    const s = this._summary;
    const listed = this._list?.state === 'ok';
    const missing = lib && listed && !s;
    const bindings = s?.bindings ?? 0;
    if (!lib) {
      return html`<div class="acts"><span class="line">${t('image-tools.mc-library-image-field.no-image-chosen')}</span>${this._chooseButton(this.compact ? t('image-tools.mc-library-image-field.library-image') : t('image-tools.mc-library-image-field.choose-an-image'))}</div>`;
    }
    return html`<div class="acts">
        ${this._thumb(s)}
        ${missing
          ? html`<span class="warn">${t('image-tools.mc-library-image-field.this-image-is-no-longer-in-the-library')}</span>`
          : html`<span class="name">${s?.name ?? ''}</span>${this._shape ? html`<span class="chip">${this._shape.label}</span>` : nothing}${this.compact && bindings > 0 ? html`<span class="chip">◆ ${t('image-tools.mc-library-image-field.live')}</span>` : nothing}`}
        ${this._chooseButton(missing ? t('image-tools.mc-library-image-field.pick-another') : t('image-tools.mc-library-image-field.choose'))}
        ${this.compact ? html`<button type="button" class="btn btn-text btn-sm" data-act="clear" @click=${() => this._emit({ image: '' })}>${t('image-tools.mc-library-image-field.clear')}</button>` : nothing}
        ${!this.compact && !missing && this._id
          ? html`<button type="button" class="btn btn-secondary btn-sm" data-act="edit" @click=${() => void this._openEditor({ kind: 'image', id: this._id! })}>${this._canWrite ? t('image-tools.mc-library-image-field.edit-image') : t('image-tools.mc-library-image-field.view-image')}</button>`
          : nothing}
        ${!this.compact && this._id ? html`<button type="button" class="btn btn-secondary btn-sm" data-act="copy" @click=${() => void this._copy()}>${t('image-tools.mc-library-image-field.copy-reference')}</button>` : nothing}
      </div>
      ${this.compact ? nothing : html`<p class="line"><code>${this.value}</code></p><p class="help">${t('image-tools.mc-library-image-field.this-is-the-address-cards-use-it-stays')}</p>`}
      ${bindings > 0 && !this.compact ? this._usesBlock() : nothing}`;
  }

  private _usesBlock(): TemplateResult {
    const list = entitiesOf(this._img?.bindings);
    const n = list.length || 0;
    if (!n) return html``;
    return html`<div class="line">
      ${t('image-tools.mc-library-image-field.n', { n })}
      <button type="button" class="btn btn-text btn-sm" data-act="uses" aria-expanded=${this._uses ? 'true' : 'false'} @click=${() => (this._uses = !this._uses)}>${this._uses ? t('image-tools.mc-library-image-field.hide-list') : t('image-tools.mc-library-image-field.show-list')}</button>
      ${this._uses
        ? html`<ul class="uses-list">${list.map((e) => html`<li>${this.hass?.states?.[e] ? this._friendly(e) : t('image-tools.mc-library-image-field.id-not-found', { id: e })}</li>`)}</ul>`
        : nothing}
    </div>`;
  }

  private _source(): TemplateResult {
    if (this.compact) return isLibraryValue(this.value) ? this._chosen() : html`${this._media()}${this._chosen()}`;
    const missingMcu = this._list?.state === 'missing';
    const mode = this._mode ?? (isLibraryValue(this.value) ? 'library' : this.value ? 'url' : missingMcu ? 'url' : 'library');
    return html`<div class="choice">
        <label><input type="radio" name="src" value="library" ?disabled=${missingMcu && !isLibraryValue(this.value)} .checked=${mode === 'library'} @change=${() => (this._mode = 'library')} />${t('image-tools.mc-library-image-field.library-image')}</label>
        <label><input type="radio" name="src" value="url" .checked=${mode === 'url'} @change=${() => (this._mode = 'url')} />${t('image-tools.mc-library-image-field.address-or-media')}</label>
      </div>
      ${missingMcu ? html`<p class="help">${t('image-tools.mc-library-image-field.images-need-magic-card-utils-it-is')}</p>` : nothing}
      ${mode === 'library'
        ? html`${this._chosen()}
            ${this._canWrite ? html`<div class="acts"><button type="button" class="btn btn-secondary btn-sm" data-act="draw" @click=${() => void this._openEditor({ kind: 'image-blank' })}>${t('image-tools.mc-library-image-field.draw-a-new-image')}</button></div>` : nothing}`
        : this._media()}
      ${this._failed ? html`<p class="warn" role="alert">${t('image-tools.mc-library-image-field.the-drawing-editor-could-not-load-try')}</p>` : nothing}`;
  }

  private _shapeBlock(): TemplateResult | typeof nothing {
    const shape = this._shape;
    const aspect = this.module.aspect_ratio;
    const set = aspect !== undefined && aspect !== null && String(aspect).trim() !== '';
    if (!shape || !set || sameShape(aspect, shape)) return nothing;
    return html`<div class="acts"><span class="line">${t('image-tools.mc-library-image-field.the-card-shape-card-differs-from-the', { card: String(aspect), drawing: shape.label })}</span>
      <button type="button" class="btn btn-secondary btn-sm" data-act="use-shape" @click=${() => this._emit(shapeKeys(shape))}>${t("image-tools.mc-library-image-field.use-the-drawing-s-shape")}</button></div>`;
  }

  private _coloursBlock(): TemplateResult {
    const c = this.module.colors ?? {};
    return html`<div class="block">
      <div class="colours" role="group" aria-label=${t('image-tools.mc-library-image-field.colours')}>
        <div><span class="line">${t('image-tools.mc-library-image-field.main-colour')}</span><mc-color-picker .value=${c.main ?? ''} .label=${t('image-tools.mc-library-image-field.main-colour')} @value-changed=${(e: CustomEvent) => { e.stopPropagation(); this._colours({ main: String(e.detail.value) }); }}></mc-color-picker></div>
        <div><span class="line">${t('image-tools.mc-library-image-field.accent-colour')}</span><mc-color-picker .value=${c.accent ?? ''} .label=${t('image-tools.mc-library-image-field.accent-colour')} @value-changed=${(e: CustomEvent) => { e.stopPropagation(); this._colours({ accent: String(e.detail.value) }); }}></mc-color-picker></div>
        <mc-svg-image class="strip" .ref=${this.value} .hass=${this.hass} .colors=${c} .fit=${'contain'}></mc-svg-image>
      </div>
      <p class="help">${t('image-tools.mc-library-image-field.main-and-accent-follow-the-colours-you')}</p>
    </div>`;
  }

  private _describeBlock(): TemplateResult {
    const d = this.module.description ?? '';
    const left = DESCRIPTION_MAX - d.length;
    const bindings = this._summary?.bindings ?? 0;
    const lib = !!this._summary;
    const summaryOn = this.module.state_summary === true;
    const entities = entitiesOf(this._img?.bindings);
    const shown = entities.slice(0, LIST_SHOWN).map((e) => (this.hass?.states?.[e] ? `${this._friendly(e)}: ${this._stateText(e)}` : `${e}: ${t('image-tools.mc-library-image-field.not-found')}`));
    return html`<div class="block">
      <label for="desc" class="name">${t('image-tools.mc-library-image-field.description-for-screen-readers')}</label>
      <textarea id="desc" maxlength=${DESCRIPTION_MAX} aria-describedby="desc-h desc-s" .value=${d} @input=${(e: Event) => this._emit({ description: (e.target as HTMLTextAreaElement).value || undefined })}></textarea>
      ${d.length >= COUNT_FROM ? html`<div class="count">${t('image-tools.mc-library-image-field.n-left', { n: left })}</div>` : nothing}
      ${d.length >= DESCRIPTION_MAX ? html`<p class="warn" role="status">${t('image-tools.mc-library-image-field.that-is-the-longest-description-500')}</p>` : nothing}
      <p class="help" id="desc-h">${t('image-tools.mc-library-image-field.optional-describe-what-the-picture-shows')}</p>
      <p class="help" id="desc-s">${d ? t('image-tools.mc-library-image-field.set-screen-readers-read-it') : t('image-tools.mc-library-image-field.not-set-screen-readers-skip-this-picture')}</p>
      ${lib && bindings > 0
        ? html`<div class="switch-row">
              <div class="txt"><label id="sum-l" for="sum">${t('image-tools.mc-library-image-field.list-connected-devices-and-their-states')}</label>
                <p class="help" id="sum-h">${t('image-tools.mc-library-image-field.adds-a-hidden-list-after-the-picture-for')}</p></div>
              <span class="state" aria-hidden="true">${summaryOn ? t('image-tools.mc-library-image-field.on') : t('image-tools.mc-library-image-field.off')}</span>
              <button type="button" class="switch" role="switch" id="sum" aria-checked=${summaryOn ? 'true' : 'false'} aria-labelledby="sum-l" aria-describedby="sum-h" @click=${() => this._emit({ state_summary: summaryOn ? undefined : true })}></button>
            </div>
            ${summaryOn
              ? html`<p class="line will-read">${t('image-tools.mc-library-image-field.will-read-now')} ${shown.join(', ')}${entities.length > LIST_SHOWN ? ` ${t('image-tools.mc-library-image-field.and-n-more', { n: entities.length - LIST_SHOWN })}` : ''}</p>
                  <p class="help">${t('image-tools.mc-library-image-field.rename-a-device-in-home-assistant-to')}</p>`
              : nothing}
            ${!d && !summaryOn ? html`<p class="line">${t('image-tools.mc-library-image-field.this-picture-shows-live-devices-add-a')}</p>` : nothing}`
        : nothing}
    </div>`;
  }

  private _backgroundBlock(): TemplateResult | typeof nothing {
    if (this.compact || !isLibraryValue(this.value)) return nothing;
    const live = (this._summary?.bindings ?? 0) > 0;
    const canAdd = !!this._id && !!cardStateOf(this);
    return html`${live ? html`<p class="help">${t('image-tools.mc-library-image-field.live-parts-of-this-picture-follow-their')}</p>` : nothing}
      <p class="help">${t('image-tools.mc-library-image-field.this-is-a-background-screen-readers-skip')}</p>
      ${canAdd
        ? html`<div class="acts"><span class="line">${t('image-tools.mc-library-image-field.need-buttons-or-a-description')}</span>
            <button type="button" class="btn btn-secondary btn-sm" data-act="add-module" @click=${() => this._addModule()}>${t('image-tools.mc-library-image-field.add-an-image-module-behind-the-content')}</button></div>`
        : nothing}`;
  }

  protected render(): TemplateResult {
    const lib = isLibraryValue(this.value);
    const module = this.context === 'module' && !this.compact;
    return html`<fieldset>
        <legend>${this.label || t('image-tools.mc-library-image-field.image')}</legend>
        <p class="result" role="status">${this._msg}</p>
        ${this.statesHint ? html`<p class="help" data-hint="states">${t('image-tools.mc-library-image-field.to-change-colours-use-live-parts-in-one')}</p>` : nothing}
        ${this.hideSource ? nothing : this._source()}
        ${this.hideSource ? nothing : this.context === 'background' ? this._backgroundBlock() : nothing}
        ${module && !this.hideSource && lib ? this._shapeBlock() : nothing}
        ${module && !this.hideSource && lib && this._summary ? this._coloursBlock() : nothing}
        ${module ? this._describeBlock() : nothing}
      </fieldset>
      ${this._picking
        ? html`<mc-image-picker .hass=${this.hass} .current=${this._id ?? ''} .background=${this.context === 'background'} .canDraw=${this._canWrite} @pick=${(e: CustomEvent) => this._picked(String(e.detail.id))} @close=${() => { this._picking = false; this._focusChoose(); }} @draw=${() => { this._picking = false; void this._openEditor({ kind: 'image-blank' }); }}></mc-image-picker>`
        : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-library-image-field': McLibraryImageField;
  }
}
