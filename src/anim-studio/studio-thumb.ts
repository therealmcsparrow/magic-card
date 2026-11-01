import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { editorTokens } from '../css/editor-system';
import type { AnimationDoc } from './model';
import { KIND_ICON, previewConfig } from './studio-model';
import { standaloneHass } from './studio-stage';

type CardElement = HTMLElement & { setConfig(c: unknown): void; hass?: unknown };

/**
 * A library row's live thumbnail: a small magic-card playing the document on an icon tile. The card
 * exists only while the row is on screen; without magic-card on the page, the kind's icon.
 */
export class AnimationThumb extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) lookup: (id: string) => AnimationDoc | undefined = () => undefined;
  @property({ attribute: false }) hass?: Record<string, unknown>;

  @state() private _visible = typeof IntersectionObserver === 'undefined';

  private _card?: CardElement;
  private _io?: IntersectionObserver;

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver((entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on !== this._visible) this._visible = on;
      });
      this._io.observe(this);
    }
    if (!customElements.get('magic-card')) void customElements.whenDefined('magic-card').then(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._io?.disconnect();
    this._io = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!this._visible || !this.doc || !customElements.get('magic-card')) {
      this._card = undefined;
      return;
    }
    const fresh = !this._card;
    if (fresh) this._card = document.createElement('magic-card') as CardElement;
    if (fresh || changed.has('doc') || changed.has('lookup')) {
      try {
        this._card!.setConfig(previewConfig(this.doc, this.lookup, { tile: 'icon', thumb: true, as: this.doc.id }));
      } catch {
        this._card = undefined;
        return;
      }
    }
    if (fresh || changed.has('hass')) this._card!.hass = this.hass ?? standaloneHass(false);
  }

  protected render(): TemplateResult {
    const icon = this.doc ? KIND_ICON[this.doc.kind] : 'mdi:animation-outline';
    return html`<div class="box" aria-hidden="true">
      ${this._card ? html`<div class="scale">${this._card}</div>` : html`<ha-icon icon=${icon}></ha-icon>`}
    </div>`;
  }

  static styles = [
    editorTokens,
    css`
      :host {
        display: block;
        width: 88px;
        height: 56px;
        flex: none;
      }
      .box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--mc-text-2);
        --mdc-icon-size: 22px;
      }
      .scale {
        position: absolute;
        left: 50%; /* physical */
        top: 50%;
        width: 176px;
        transform: translate(-50%, -50%) scale(0.5);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `,
  ];
}
