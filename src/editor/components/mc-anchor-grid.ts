import { LitElement, css, html, nothing, svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { LAYER_ANCHORS, type LayerAnchor } from '../../contracts/layer-placement';
import { editorTokens } from '../../css/editor-system';
import { layerControlCss } from '../layers/tokens';
import { t } from '../layers/i18n';
import { anchorName } from '../layers/anchor-names';

export { anchorName };

/*
 * mc-anchor-grid: the 3 x 3 position picker (designer 03 section 2, 11 H). A radiogroup with one tab stop
 * (roving tabindex), 2-D arrow keys, Home / End to the first / last cell. 32 px cells with a 4 px gap, 44 px
 * with an 8 px gap on coarse pointers. The chosen cell carries a check mark, a 2 px border in the text
 * colour and a bold name below the grid, so selection never rests on a hue (WCAG 1.4.1). There is no
 * "none" cell: leaving a placement is done with the Placement control. Used by the module Placement group,
 * image position and the pan and zoom focus point.
 *
 * Events: `change` (detail { value }) when the user picks a cell.
 */

/** The cell a key moves to from `index`; stays on the grid edge. -1 for a non-grid key. */
export function gridTarget(key: string, index: number): number {
  const row = Math.floor(index / 3);
  const col = index % 3;
  switch (key) {
    case 'ArrowLeft': return row * 3 + Math.max(0, col - 1);
    case 'ArrowRight': return row * 3 + Math.min(2, col + 1);
    case 'ArrowUp': return Math.max(0, row - 1) * 3 + col;
    case 'ArrowDown': return Math.min(2, row + 1) * 3 + col;
    case 'Home': return 0;
    case 'End': return 8;
    default: return -1;
  }
}

export class McAnchorGrid extends LitElement {
  /** Chosen anchor; undefined: none chosen yet (the first cell is the tab stop). */
  @property({ attribute: false }) value?: LayerAnchor;
  /** Accessible name of the group. */
  @property() label = '';
  /** Print the chosen name under the grid. */
  @property({ type: Boolean, attribute: 'show-name' }) showName = true;

  static styles = [
    editorTokens,
    layerControlCss,
    css`
      :host {
        display: inline-block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, var(--lyr-hit));
        gap: var(--lyr-gap);
        width: max-content;
      }
      .cell {
        position: relative;
        display: grid;
        place-items: center;
        width: var(--lyr-hit);
        height: var(--lyr-hit);
        padding: 0;
        cursor: pointer;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--mc-ed-ctl-line);
      }
      .cell[aria-checked='true'] {
        border: 2px solid var(--mc-text, var(--primary-text-color, #212121));
        background: var(--mc-accent-tint, rgba(3, 169, 244, 0.12));
      }
      .cell[aria-checked='true'] .dot {
        display: none;
      }
      .check {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: var(--mc-text, var(--primary-text-color, #212121));
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .name {
        margin-top: 6px;
        font-size: 0.8125rem;
        font-weight: 700;
        min-height: 1.2em;
      }
      @media (forced-colors: active) {
        .cell[aria-checked='true'] {
          background: Highlight;
        }
        .cell[aria-checked='true'] .check {
          stroke: HighlightText;
        }
      }
    `,
  ];

  private _focusCell(i: number): void {
    const cells = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.cell'));
    cells.forEach((c, n) => c.setAttribute('tabindex', n === i ? '0' : '-1'));
    cells[i]?.focus();
  }

  private _pick(a: LayerAnchor): void {
    this.value = a;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: a }, bubbles: true, composed: true }));
  }

  private _onKey = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.composedPath().find((n) => n instanceof HTMLElement && n.classList.contains('cell')) as HTMLElement | undefined;
    const index = target ? Number(target.dataset.i) : -1;
    if (index < 0) return;
    const to = gridTarget(e.key, index);
    if (to < 0) return;
    e.preventDefault();
    e.stopPropagation();
    this._focusCell(to);
    if (to !== index) this._pick(LAYER_ANCHORS[to]);
  };

  protected render(): TemplateResult {
    const current = this.value ? LAYER_ANCHORS.indexOf(this.value) : -1;
    const stop = current >= 0 ? current : 0;
    return html`<div class="grid" role="radiogroup" aria-label=${this.label || t('Position')} @keydown=${this._onKey}>
        ${LAYER_ANCHORS.map((a, i) => {
          const on = i === current;
          return html`<button
            type="button"
            class="cell lyr-btn"
            role="radio"
            data-i=${i}
            data-anchor=${a}
            aria-checked=${on ? 'true' : 'false'}
            aria-label=${anchorName(a)}
            title=${anchorName(a)}
            tabindex=${i === stop ? '0' : '-1'}
            @click=${() => this._pick(a)}
          >${on ? svg`<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg>` : html`<span class="dot" aria-hidden="true"></span>`}</button>`;
        })}
      </div>
      ${this.showName ? html`<div class="name" aria-live="polite">${this.value ? anchorName(this.value) : nothing}</div>` : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anchor-grid': McAnchorGrid;
  }
}
