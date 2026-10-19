import { html, LitElement, nothing, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import type { HassEntity, HomeAssistant } from '../../types';
import { resolveMediaUrl } from '../../utils/media';
import { StreamGate } from '../advanced/stream-gate';

/* Chunk-only (magic-card-modules-extra.js): defined by install() as mc-camera-live. */

/**
 * A live camera stream. In flow it is always on. As a background it is taken out of the DOM (the
 * stream stops, a still snapshot stays) while off screen, the page is hidden or the card is paused,
 * and comes back on return (layer-placement "Streaming backgrounds", card-pause rule 1).
 */
export class McCameraLive extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) stateObj?: HassEntity;
  @property({ attribute: false }) controls = true;

  private readonly _gate = new StreamGate(this, 'camera', () => this.requestUpdate());

  // the card's styles apply (no shadow root of its own); the host does not take part in layout
  protected createRenderRoot(): HTMLElement {
    this.style.display = 'contents';
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._gate.refresh();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._gate.stop();
  }

  protected updated(): void {
    this._gate.refresh();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._gate.active) {
      const picture = this.stateObj?.attributes.entity_picture;
      return typeof picture === 'string' && picture
        ? html`<img class="mc-camera-snapshot" src=${resolveMediaUrl(this.hass, picture)} alt="" />`
        : nothing;
    }
    return html`<ha-camera-stream
      class="mc-camera-stream"
      .hass=${this.hass}
      .stateObj=${this.stateObj}
      .controls=${this.controls}
      .muted=${true}
      .fitMode=${'cover'}
      allow-exoplayer
    ></ha-camera-stream>`;
  }
}
