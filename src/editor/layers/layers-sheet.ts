import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import type { SheetItem } from '../../contracts/layer-editor';
import { editorSystem } from '../../css/editor-stack';
import { layerControlCss } from './tokens';
import { t } from './i18n';

// "Layers here" sheet: every layer at one point of the canvas, front first; one tap selects.
// Events: `pick` (detail { key }), `close`.

export class McLayersSheet extends LitElement {
  @property({ attribute: false }) items: SheetItem[] = [];
  /** Viewport point the sheet opens at. */
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  /**
   * Opened by press and hold, finger still down: the click that ends the press lands on the sheet (on the
   * backdrop, or on the first row under the finger) and must not close it or pick. Ignored until the finger
   * has lifted and a moment has passed.
   */
  @property({ type: Boolean }) holdOpen = false;
  private _guard = false;
  private _guardTimer = 0;

  private readonly _lifted = (): void => {
    clearTimeout(this._guardTimer);
    this._guardTimer = window.setTimeout(() => (this._guard = false), 350);
  };

  private _unguard(): void {
    for (const type of ['pointerup', 'pointercancel', 'touchend', 'touchcancel']) window.removeEventListener(type, this._lifted, true);
  }

  protected firstUpdated(): void {
    if (!this.holdOpen) return;
    this._guard = true;
    for (const type of ['pointerup', 'pointercancel', 'touchend', 'touchcancel']) window.addEventListener(type, this._lifted, { capture: true, once: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._guardTimer);
    this._unguard();
  }

  static styles = [
    editorSystem,
    layerControlCss,
    css`
      :host {
        position: fixed;
        top: 0;
        left: 0; /* physical */
        width: 100%;
        height: 100%;
        z-index: 20;
        display: block;
      }
      .backdrop {
        position: absolute;
        top: 0;
        left: 0; /* physical */
        width: 100%;
        height: 100%;
      }
      .sheet {
        position: absolute;
        width: min(320px, calc(100% - 16px));
        max-height: calc(100% - 16px);
        overflow: auto;
        padding: 8px;
        border-radius: 12px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        box-shadow: var(--mc-shadow-float);
        box-sizing: border-box;
      }
      h2 {
        margin: 0 0 4px;
        font-size: 0.875rem;
        font-weight: 600;
      }
      p {
        margin: 0 0 8px;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--lyr-gap);
      }
      .item {
        width: 100%;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 10px;
        white-space: normal;
        text-align: start;
        cursor: pointer;
      }
      .item[aria-current='true'] {
        border: 2px solid var(--mc-text);
        font-weight: 700;
      }
      .item .nm {
        display: block;
      }
      .item .sub {
        display: block;
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--mc-text-2);
      }
    `,
  ];

  protected updated(): void {
    const first = this.renderRoot.querySelector<HTMLElement>('.item[aria-current="true"]') ?? this.renderRoot.querySelector<HTMLElement>('.item');
    if (first && !this.renderRoot.contains(this.shadowRoot?.activeElement ?? null)) first.focus({ preventScroll: true });
  }

  private _close(): void {
    if (this._guard) return;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this._close();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const els = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.item'));
      const at = els.indexOf(this.shadowRoot?.activeElement as HTMLElement);
      const next = els[(at + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    }
  };

  protected render(): TemplateResult {
    const left = Math.max(8, Math.min(this.x, (globalThis.innerWidth || 1024) - 328));
    const top = Math.max(8, Math.min(this.y, (globalThis.innerHeight || 768) - 120));
    return html`<div class="backdrop" @click=${this._close} aria-hidden="true"></div>
      <div class="sheet" role="dialog" aria-label=${t('layer-editor.layers-sheet.layers-here')} style=${`left:${left}px;top:${top}px`} @keydown=${this._onKey}>
        <h2>${t('layer-editor.layers-sheet.layers-here')}</h2>
        <p>${t('layer-editor.layers-sheet.front-first-tap-one-to-select-it')}</p>
        <ul>
          ${this.items.map(
            (it, i) => html`<li><button
              type="button"
              class="item lyr-btn btn btn-secondary btn-sm"
              data-key=${it.key}
              aria-current=${it.current ? 'true' : 'false'}
              @click=${() => {
                if (!this._guard) this.dispatchEvent(new CustomEvent('pick', { detail: { key: it.key }, bubbles: true, composed: true }));
              }}
            ><span><span class="nm">${it.current ? '✓ ' : ''}${it.name}</span><span class="sub">${it.detail}, ${t('layer-editor.layers-sheet.n-from-the-front-here', { n: i + 1 })}</span></span></button></li>`,
          )}
        </ul>
        ${this.items.length ? nothing : html`<p>${t('layer-editor.layers-sheet.nothing-here')}</p>`}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-layers-sheet': McLayersSheet;
  }
}
