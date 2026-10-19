import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import { layerControlCss } from './tokens';
import { t } from '../i18n';

/*
 * "Layers here" sheet (designer 11 H): every layer at one point of the canvas, front first, modules and card
 * backdrop layers alike. One tap (44 px target) selects. Opened by press and hold (touch) or the float bar's
 * Layers here button; Alt-click is the mouse shortcut. Not the only route: the structure list stays.
 * Events: `pick` (detail { key }), `close`.
 */

export interface SheetItem {
  /** data-mc-path of a module, or `backdrop:<index>` for a card backdrop layer. */
  key: string;
  name: string;
  /** "Behind others", "On top", "Card backdrop, layer 2" ... */
  detail: string;
  current?: boolean;
}

@customElement('mc-layers-sheet')
export class McLayersSheet extends LitElement {
  @property({ attribute: false }) items: SheetItem[] = [];
  /** Viewport point the sheet opens at. */
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;

  static styles = [
    editorSystem,
    layerControlCss,
    css`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        display: block;
      }
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
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
        border: 1px solid var(--mc-ed-ctl-line);
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
        text-align: left;
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
      <div class="sheet" role="dialog" aria-label=${t('Layers here')} style=${`left:${left}px;top:${top}px`} @keydown=${this._onKey}>
        <h2>${t('Layers here')}</h2>
        <p>${t('Front first. Tap one to select it.')}</p>
        <ul>
          ${this.items.map(
            (it, i) => html`<li><button
              type="button"
              class="item lyr-btn"
              data-key=${it.key}
              aria-current=${it.current ? 'true' : 'false'}
              @click=${() => this.dispatchEvent(new CustomEvent('pick', { detail: { key: it.key }, bubbles: true, composed: true }))}
            ><span><span class="nm">${it.current ? '✓ ' : ''}${it.name}</span><span class="sub">${it.detail}, ${t('{n, select, 1 {1st} 2 {2nd} 3 {3rd} other {{n}th}} from the front here', { n: i + 1 })}</span></span></button></li>`,
          )}
        </ul>
        ${this.items.length ? nothing : html`<p>${t('Nothing here.')}</p>`}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-layers-sheet': McLayersSheet;
  }
}
