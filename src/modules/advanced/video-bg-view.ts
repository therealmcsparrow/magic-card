import { html, TemplateResult, nothing, PropertyValues, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { CardModule, HomeAssistant, VideoBgModuleConfig } from '../../types';
import type { ModuleView } from '../../contracts/lazy-module';
import { mediaSrc } from '../../utils/media';
import { mediaSourceId, reportMediaError } from '../../services/media-resolver';
import { stableSrc } from '../../utils/stable-src';
import { StreamGate } from './stream-gate';

/* Chunk-only (magic-card-modules-extra.js): nothing runs at evaluation; mc-bg-video is defined by install(). */

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
  /** As a background: no frames off screen, page hidden or card paused (layer-placement, card-pause). */
  private readonly _gate = new StreamGate(this, 'video-bg', () => this._sync());

  // the card's styles apply (no shadow root of its own)
  protected createRenderRoot(): HTMLElement {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._gate.refresh();
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
    this._gate.stop();
    this._video?.pause();
  }

  private get _video(): HTMLVideoElement | null {
    return this.querySelector('video');
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('src')) this._failed = false;
  }

  protected updated(): void {
    this._gate.refresh();
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
    if (this.autoplay && (this._gate.background ? this._gate.active : this._visible) && !reducedMotion()) {
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

export class VideoBgView implements ModuleView {
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
}
