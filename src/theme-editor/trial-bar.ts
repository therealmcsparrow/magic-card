import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { glyph } from '../ui-kit/glyphs';
import { inlineSides, rtlSheet } from '../ui-kit/css/rtl';
import { DirectionController } from '../ui-kit/controllers/direction';
import { THEME_TRIAL_BAR_TAG } from '../contracts/theme-editor';
import { getTrial, openEditor, stopTrial, subscribeTrial } from './trial';
import type { TrialState } from './trial';
import { t } from './i18n';

// <mc-theme-trial-bar>: the Revert bar of "Try on dashboards", first child of body.

export const SHORT_VIEWPORT_PX = 480;
export const NARROW_VIEWPORT_PX = 640;
const EDGE_KEY = 'mc-theme-trial-edge';
const GAP = 8;

type Edge = 'top' | 'bottom';
interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * How far to scroll (positive: content moves up) to clear the bar by 8 px, or 0 when the focused
 * element is not under it. For a bar at the top edge the result is negative or 0.
 */
export function focusScrollDelta(el: Box, bar: Box, edge: Edge): number {
  const overlaps = el.bottom > bar.top && el.top < bar.bottom && el.right > bar.left && el.left < bar.right;
  if (!overlaps) return 0;
  return edge === 'bottom' ? el.bottom - (bar.top - GAP) : el.top - (bar.bottom + GAP);
}

function nearestScroller(el: Element): Element | null {
  let cur: Element | null = el;
  while (cur) {
    const parent: Element | null = cur.assignedSlot ?? cur.parentElement ?? ((cur.getRootNode() as ShadowRoot).host ?? null);
    if (!parent || parent === document.documentElement) break;
    const oy = getComputedStyle(parent).overflowY;
    if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay') && parent.scrollHeight > parent.clientHeight) return parent;
    cur = parent;
  }
  return document.scrollingElement;
}

const readEdge = (): Edge => {
  try {
    return sessionStorage.getItem(EDGE_KEY) === 'top' ? 'top' : 'bottom';
  } catch {
    return 'bottom';
  }
};

export class McThemeTrialBar extends LitElement {
  private readonly _dir = new DirectionController(this);
  @state() private _trial: TrialState | null = getTrial();
  @state() private _edge: Edge = readEdge();
  @state() private _short = false;
  @state() private _narrow = false;

  private _unsub?: () => void;
  private _savedPadding: [string, string] | null = null;

  private readonly _onFocusIn = (e: FocusEvent): void => {
    const target = e.composedPath()[0];
    const pill = this.renderRoot.querySelector('.pill');
    if (!(target instanceof Element) || !pill || e.composedPath().includes(this)) return;
    const delta = focusScrollDelta(target.getBoundingClientRect(), pill.getBoundingClientRect(), this._edge);
    if (!delta) return;
    const scroller = nearestScroller(target);
    if (scroller) scroller.scrollTop += delta;
  };

  private readonly _onResize = (): void => {
    this._short = window.innerHeight < SHORT_VIEWPORT_PX;
    this._narrow = window.innerWidth < NARROW_VIEWPORT_PX;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('popover', 'manual');
    try {
      (this as unknown as { showPopover?: () => void }).showPopover?.();
    } catch {
      /* already open, or not supported */
    }
    this._trial = getTrial();
    this._unsub = subscribeTrial((s) => {
      this._trial = s;
    });
    document.addEventListener('focusin', this._onFocusIn, true);
    window.addEventListener('resize', this._onResize);
    this._onResize();
    this.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback(): void {
    this._unsub?.();
    document.removeEventListener('focusin', this._onFocusIn, true);
    window.removeEventListener('resize', this._onResize);
    this.removeEventListener('keydown', this._onKey);
    this._restorePadding();
    super.disconnectedCallback();
  }

  private readonly _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      stopTrial('revert');
    }
  };

  protected updated(): void {
    const pill = this.renderRoot.querySelector<HTMLElement>('.pill');
    if (!pill) return;
    const root = document.documentElement.style;
    this._savedPadding ??= [root.getPropertyValue('scroll-padding-top'), root.getPropertyValue('scroll-padding-bottom')];
    const h = `${Math.ceil(pill.getBoundingClientRect().height + GAP)}px`;
    root.setProperty('scroll-padding-top', this._edge === 'top' ? h : (this._savedPadding[0] || ''));
    root.setProperty('scroll-padding-bottom', this._edge === 'bottom' ? h : (this._savedPadding[1] || ''));
  }

  private _restorePadding(): void {
    if (!this._savedPadding) return;
    const root = document.documentElement.style;
    for (const [prop, old] of [
      ['scroll-padding-top', this._savedPadding[0]],
      ['scroll-padding-bottom', this._savedPadding[1]],
    ] as const) {
      if (old) root.setProperty(prop, old);
      else root.removeProperty(prop);
    }
    this._savedPadding = null;
  }

  private _flip(): void {
    this._edge = this._edge === 'bottom' ? 'top' : 'bottom';
    try {
      sessionStorage.setItem(EDGE_KEY, this._edge);
    } catch {
      /* private mode */
    }
  }

  protected render(): TemplateResult | typeof nothing {
    const tr = this._trial;
    if (!tr) return nothing;
    const text = this._narrow ? t('theme-editor.trial-bar.trying-name', { name: tr.name }) : t('theme-editor.trial-bar.trying-name-on-this-tab-mode', { name: tr.name, mode: tr.mode });
    if (this._short) {
      return html`<div class="pill round ${this._edge}" role="region" aria-label=${t('theme-editor.trial-bar.theme-trial')}>
        <span class="sr" role="status">${text}</span>
        <button type="button" class="round-btn" aria-label=${t('theme-editor.trial-bar.revert-theme-trial')} title=${t('theme-editor.trial-bar.revert-theme-trial')} @click=${() => stopTrial('revert')}>${glyph('undo')} ${t('theme-editor.trial-bar.revert')}</button>
      </div>`;
    }
    return html`<div class="pill ${this._edge}" role="region" aria-label=${t('theme-editor.trial-bar.theme-trial')}>
      ${glyph('palette')}
      <span class="msg" role="status">${text}${tr.skipped ? html` <span class="skip">(${t('theme-editor.trial-bar.n-not-valid-left-out', { n: tr.skipped })})</span>` : nothing}</span>
      <span class="actions">
        <button type="button" class="revert" @click=${() => stopTrial('revert')}>${t('theme-editor.trial-bar.revert')}</button>
        <button type="button" class="plain" @click=${() => openEditor()}>${this._narrow ? t('theme-editor.trial-bar.editor') : t('theme-editor.trial-bar.open-editor')}</button>
        <button
          type="button"
          class="plain icon"
          aria-label=${this._edge === 'bottom' ? t('theme-editor.trial-bar.move-to-top') : t('theme-editor.trial-bar.move-to-bottom')}
          title=${this._edge === 'bottom' ? t('theme-editor.trial-bar.move-to-top') : t('theme-editor.trial-bar.move-to-bottom')}
          @click=${() => this._flip()}
        >
          ${this._edge === 'bottom' ? '▲' : '▼'}
        </button>
      </span>
    </div>`;
  }

  static styles = css`
    ${rtlSheet}
    svg.gl {
      display: block;
      flex: none;
    }
    :host,
    :host([popover]) {
      position: fixed;
      inset: auto;
      ${inlineSides('inset', '0', '0')}
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      overflow: visible;
      display: block;
      pointer-events: none;
      z-index: 2147483000;
    }
    .pill {
      pointer-events: auto;
      box-sizing: border-box;
      position: fixed;
      left: 50%; /* physical */
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: min(720px, calc(100vw - 32px));
      max-height: 25vh;
      overflow: auto;
      padding: 8px 12px;
      border-radius: 28px;
      background: #1b1f24;
      color: #ffffff;
      font: 0.9375rem/1.3 system-ui, sans-serif;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
    }
    .pill.bottom {
      bottom: max(16px, env(safe-area-inset-bottom));
    }
    .pill.top {
      top: max(16px, env(safe-area-inset-top));
    }
    .pill.round {
      padding: 0;
      border-radius: 22px;
      height: 44px;
      ${inlineSides('inset', 'auto', '16px')}
      transform: none;
    }
    .msg {
      flex: 1 1 auto;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .skip {
      color: #ffd54f;
    }
    .actions {
      display: flex;
      flex: none;
      gap: 8px;
    }
    button {
      min-height: 44px;
      min-width: 44px;
      padding: 0 14px;
      border-radius: 22px;
      border: 1px solid #ffffff;
      background: #1b1f24;
      color: #ffffff;
      font: inherit;
      cursor: pointer;
    }
    button.revert {
      font-weight: 600;
    }
    button.plain {
      border-color: transparent;
      text-decoration: underline;
    }
    button.icon {
      padding: 0;
      text-decoration: none;
    }
    .round-btn {
      height: 44px;
      padding: 0 14px;
      border-radius: 22px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }
    button:focus-visible {
      outline: 3px solid #ffd54f;
      outline-offset: 2px;
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    @media (max-width: 639px) {
      .pill {
        gap: 8px;
        padding: 8px;
      }
    }
  `;
}

if (!customElements.get(THEME_TRIAL_BAR_TAG)) customElements.define(THEME_TRIAL_BAR_TAG, McThemeTrialBar);

declare global {
  interface HTMLElementTagNameMap {
    'mc-theme-trial-bar': McThemeTrialBar;
  }
}
