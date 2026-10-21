import { LitElement, css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { RetryableLazyChunk } from '../contracts/lazy-module';
import { onChunkChange } from '../utils/lazy-chunk';
import { t } from './i18n';

/*
 * The failure notice of a lazy chunk (lazy-module 1.4.0 "Failure, retry and timeout", designer 03 round 2). It is
 * always in flow (never absolute, no fixed height, nothing clipped), so no text, control or focus ring can sit under
 * it; the failure state may shift the layout (proj.M14 exception) and the shift reverses on recovery. One anatomy:
 * icon, message that names the part and says the rest works, a real <button> of at least 44 px. The element exists
 * only after a failure; its role="status" container is created empty and filled a frame later, so screen readers
 * announce it, and it outlives the notice for the "loaded" message. Colours: text and focus ring --mc-text on
 * --mc-bg (never --mc-primary on text). The button border is --mc-text too, not --mc-primary: HA's default light primary
 * (#03a9f4) is 2.63:1 on white, under the 3:1 a control border needs (designer 03: then the border falls back to --mc-text).
 */

/** At most 8 part names; the fallback names no part. Written out so the i18n extractor sees every id. */
const part = (name: string): string => {
  const anim = t('The animation');
  const slider = t('The slider');
  return (
    {
      anim,
      'anim-runtime': anim,
      particles: anim,
      'shape-custom': t('The custom shape'),
      seasonal: t('The seasonal effect'),
      layers: t('The background'),
      'flow-look': t('The flow style'),
      'slider-look': slider,
      slider,
      markdown: t('The text block'),
      'svg-icon': t('The icon'),
    }[name as 'slider'] ?? t('Part of this card')
  );
};

const reload = (): void => location.reload();

export class McChunkNotice extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .n {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      box-sizing: border-box;
      width: 100%;
      padding: 8px;
      background: #fff;
      background: var(--mc-bg, #fff);
      color: #212121;
      color: var(--mc-text, #212121);
      border: 1px solid var(--mc-border, currentColor);
      border-radius: var(--mc-radius, 8px);
    }
    ha-icon {
      --mdc-icon-size: 18px;
      color: var(--error-color, #db4437);
    }
    .m {
      flex: 1 1 12em;
    }
    button {
      min-height: 44px;
      padding: var(--mc-button-padding, 10px 16px);
      border: 1px solid var(--mc-text, currentColor);
      border-radius: var(--mc-button-radius, 8px);
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    button:focus {
      outline: 2px solid var(--mc-text, #212121);
      outline-offset: 2px;
    }
    button:focus-visible {
      outline: 2px solid var(--mc-text, #212121);
      outline-offset: 2px;
    }
    .v {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `;

  @property({ attribute: false })
  chunk?: RetryableLazyChunk;

  @state() private _busy = false;
  @state() private _again = false;
  @state() private _done = '';
  @state() private _shown = false;
  private _off?: () => void;
  private _refocus = false;
  private _doneTimer?: ReturnType<typeof setTimeout>;

  connectedCallback(): void {
    super.connectedCallback();
    this._off = onChunkChange(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._off?.();
    clearTimeout(this._doneTimer);
  }

  protected willUpdate(): void {
    const c = this.chunk;
    if (this._shown && c && !c.failed()) {
      // recovered: the notice goes, the status container stays and says so once; focus is never left on a removed node
      this._refocus = !!this.shadowRoot?.activeElement;
      this._shown = this._busy = this._again = false;
      this._done = t('{part} loaded.', { part: part(c.name) });
      this._doneTimer = setTimeout(() => (this._done = ''), 1500);
    }
  }

  protected updated(): void {
    if (this.chunk?.failed() && !this._shown) requestAnimationFrame(() => (this._shown = !!this.chunk?.failed()));
    if (this._refocus) {
      this._refocus = false;
      this.tabIndex = -1;
      this.focus();
      this.addEventListener('blur', () => this.removeAttribute('tabindex'), { once: true });
    }
  }

  private async _try(): Promise<void> {
    if (this._busy) return;
    this._busy = true;
    const ok = await this.chunk!.retry();
    this._busy = false;
    this._again = !ok;
  }

  protected render() {
    const c = this.chunk;
    const mismatch = c?.failure() === 'mismatch';
    const body =
      this._shown && c?.failed()
        ? html`<div class="n">
            <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
            <span class="m" id="m"
              >${mismatch
                ? t('Magic Card was updated. Reload the page to see this part. The rest of this card works.')
                : this._again
                  ? t('Still not loading. Try again in a moment, or reload the page.')
                  : t('{part} did not load. The rest of this card works.', { part: part(c.name) })}</span
            >
            <button type="button" aria-describedby="m" aria-disabled=${this._busy ? 'true' : nothing} @click=${mismatch ? reload : this._try}>
              ${mismatch ? t('Reload page') : this._busy ? t('Trying again...') : t('Try again')}
            </button>
            ${this._again && !mismatch ? html`<button type="button" aria-describedby="m" @click=${reload}>${t('Reload page')}</button>` : nothing}
          </div>`
        : this._done
          ? html`<span class="v">${this._done}</span>`
          : nothing;
    return html`<div role="status" aria-live="polite" aria-busy=${this._busy ? 'true' : 'false'}>${body}</div>`;
  }
}

if (!customElements.get('mc-chunk-notice')) customElements.define('mc-chunk-notice', McChunkNotice);
