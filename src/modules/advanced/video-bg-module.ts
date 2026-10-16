import { html, TemplateResult, nothing, PropertyValues, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VideoBgModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderMediaField, renderSegField, renderFieldHint } from '../../utils/form-utils';
import { mediaSrc } from '../../utils/media';
import { mediaSourceId, reportMediaError } from '../../services/media-resolver';
import { stableSrc } from '../../utils/stable-src';

const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The background video element. Muted / playsInline / loop are set as properties before play()
 * (the `muted` attribute alone does not allow autoplay once Lit has created the element), it plays
 * only while visible (IntersectionObserver) and the poster stays when playback is not possible
 * (autoplay blocked, load error, reduced motion).
 */
export class McBgVideo extends LitElement {
  @property({ attribute: false }) src = '';
  @property({ attribute: false }) poster = '';
  @property({ attribute: false }) autoplay = true;
  @property({ attribute: false }) loop = true;
  @property({ attribute: false }) muted = true;
  @property({ attribute: false }) fit: 'cover' | 'contain' = 'cover';
  /** Media-source ids of src / poster (browsed media): resolved again when they fail to load. */
  @property({ attribute: false }) srcId?: string;
  @property({ attribute: false }) posterId?: string;
  @state() private _failed = false;
  private _visible = false;
  private _observer?: IntersectionObserver;

  // the card's styles apply (no shadow root of its own)
  protected createRenderRoot(): HTMLElement {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof IntersectionObserver === 'undefined') {
      this._visible = true;
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      this._visible = entries.some((e) => e.isIntersecting);
      this._sync();
    });
    this._observer.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = undefined;
    this._video?.pause();
  }

  private get _video(): HTMLVideoElement | null {
    return this.querySelector('video');
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('src')) this._failed = false;
  }

  protected updated(): void {
    this._sync();
  }

  /** Properties before play (autoplay policies look at `muted`), then play / pause for visibility. */
  private _sync(): void {
    const v = this._video;
    if (!v) return;
    v.muted = this.muted;
    v.defaultMuted = this.muted;
    v.playsInline = true;
    v.loop = this.loop;
    if (this.autoplay && this._visible && !reducedMotion()) {
      if (v.paused) v.play()?.catch(() => undefined); // blocked (sound on): the poster stays
    } else if (!v.paused) {
      v.pause();
    }
  }

  protected render(): TemplateResult {
    if (this._failed || !this.src) {
      return this.poster
        ? html`<img class="mc-video-bg-media" src=${stableSrc(this.poster)} alt="" style="object-fit: ${this.fit}"
            @error=${() => this.posterId && reportMediaError(this.posterId)} />`
        : html``;
    }
    return html`<video
      class="mc-video-bg-media"
      src=${stableSrc(this.src)}
      poster=${this.poster ? stableSrc(this.poster) : nothing}
      preload="metadata"
      playsinline
      disablepictureinpicture
      aria-hidden="true"
      tabindex="-1"
      style="object-fit: ${this.fit}"
      @error=${() => {
        this._failed = true;
        if (this.srcId) reportMediaError(this.srcId);
      }}
      @loadeddata=${() => this._sync()}
    ></video>`;
  }
}

if (!customElements.get('mc-bg-video')) customElements.define('mc-bg-video', McBgVideo);

/**
 * Video background: plays behind the other modules of its column or layout (row, column, tab,
 * horizontal / vertical layout). On its own in a column it shows at its own size.
 */
class VideoBgModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'video-bg',
    name: 'Video background',
    description: 'Video playing behind the other modules of its column or layout',
    category: 'advanced',
    icon: 'mdi:video-outline',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  createDefault(): VideoBgModuleConfig {
    return {
      id: generateId('video-bg'),
      type: 'video-bg',
      autoplay: true,
      loop: true,
      muted: true,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as VideoBgModuleConfig;
    const src = mediaSrc(hass, c.url);
    const poster = mediaSrc(hass, c.poster);

    if (!src && !poster) {
      return html`
        <div class="mc-module mc-video-bg mc-video-bg-placeholder">
          <ha-icon icon="mdi:video-off-outline"></ha-icon>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-video-bg mc-video-bg--media" aria-hidden="true">
        <mc-bg-video
          .src=${src}
          .poster=${poster}
          .autoplay=${c.autoplay !== false}
          .loop=${c.loop !== false}
          .muted=${c.muted !== false}
          .fit=${c.fit === 'contain' ? 'contain' : 'cover'}
          .srcId=${mediaSourceId(c.url)}
          .posterId=${mediaSourceId(c.poster)}
        ></mc-bg-video>
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
    const c = config as VideoBgModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderFieldHint('Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.')}
        ${renderMediaField('Video URL', c.url, (v) => onChange({ ...c, url: v }), hass, 'video', 'url', syncCtx)}
        ${renderMediaField('Poster image URL', c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image', 'poster', syncCtx)}
        ${renderFieldHint('Shown until the video plays, and instead of it when it cannot play.')}
        ${renderSegField('Fit', c.fit ?? 'cover', [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
        ], (v) => onChange({ ...c, fit: v as VideoBgModuleConfig['fit'] }), 'fit', syncCtx)}
        ${renderToggleField('Autoplay', c.autoplay !== false, (v) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx,
          'Plays while the card is visible (not with reduced motion).')}
        ${renderToggleField('Loop', c.loop !== false, (v) => onChange({ ...c, loop: v }), 'loop', syncCtx)}
        ${renderToggleField('Muted', c.muted !== false, (v) => onChange({ ...c, muted: v }), 'muted', syncCtx,
          'Browsers only autoplay muted videos.')}
      </div>
    `;
  }
}

ModuleRegistry.register(new VideoBgModule());
