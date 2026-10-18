import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION, type UiWindowClose } from '../../contracts/ui-kit';
import { kitWindowElementCss } from '../css/elements';
import { glyph } from '../glyphs';

/*
 * <mc-ui-window> (contract ui-kit 1.0.0): one modal window for dialogs, pickers, confirmations and sheets.
 * Native <dialog> + showModal() in the shadow root: top layer (so it works inside Home Assistant's transformed
 * card dialog), a real focus trap, ::backdrop scrim. Escape closes this window only and never reaches the card
 * dialog. Content is slotted (the caller's light DOM, styled by the caller's kit CSS). No strings of its own.
 */

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class UiWindow extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = kitWindowElementCss;

  @property() heading = '';
  @property() closeLabel = '';
  @property() variant: 'dialog' | 'picker' | 'alert' | 'sheet' = 'dialog';
  /** Id of an element inside the slotted content that gets focus first; default the first focusable one. */
  @property() initialFocus?: string;
  @property({ attribute: false }) opener?: HTMLElement;
  /** Scrim click closes (default true, never for 'alert'). */
  @property({ type: Boolean }) dismissible = true;

  @state() private _open = false;
  @state() private _hasFooter = false;
  private _id = `mc-ui-win-${Math.random().toString(36).slice(2, 8)}`;

  get open(): boolean {
    return this._open;
  }

  private dlg(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog');
  }

  show(): void {
    if (this._open) return;
    this._open = true;
    void this.updateComplete.then(() => {
      const d = this.dlg();
      if (!d) return;
      if (typeof d.showModal === 'function') {
        try {
          d.showModal();
        } catch {
          d.setAttribute('open', '');
        }
      } else d.setAttribute('open', '');
      this.focusFirst();
    });
  }

  close(reason: UiWindowClose['reason'] = 'action'): void {
    if (!this._open) return;
    this._open = false;
    const d = this.dlg();
    if (d?.open && typeof d.close === 'function') d.close();
    else d?.removeAttribute('open');
    this.dispatchEvent(new CustomEvent<UiWindowClose>('mc-window-close', { detail: { reason }, bubbles: true, composed: true }));
    const back = this.opener;
    if (back?.isConnected) back.focus({ preventScroll: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._open) {
      this._open = false;
      const d = this.dlg();
      if (d?.open && typeof d.close === 'function') d.close();
    }
  }

  private focusFirst(): void {
    const byId = this.initialFocus ? this.querySelector<HTMLElement>(`#${CSS.escape(this.initialFocus)}`) : null;
    const target = byId ?? this.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? this.renderRoot.querySelector<HTMLElement>('.close'))?.focus({ preventScroll: true });
  }

  /** The browser's own Escape (cancel): this window closes, nothing above it does. */
  private _cancel = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    this.close('escape');
  };

  private _key = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    this.close('escape');
  };

  private _click = (e: MouseEvent): void => {
    // a press on the backdrop lands on the <dialog> itself: the panel inside fills it
    if (e.target === e.currentTarget && this.dismissible && this.variant !== 'alert') this.close('scrim');
  };

  private _footer = (e: Event): void => {
    this._hasFooter = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const alert = this.variant === 'alert';
    return html`<dialog
      class=${this.variant}
      role=${alert ? 'alertdialog' : 'dialog'}
      aria-labelledby="${this._id}-t"
      @cancel=${this._cancel}
      @keydown=${this._key}
      @click=${this._click}
    >
      <div class="panel" part="panel">
        <div class="header" part="header">
          <h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2>
          <slot name="header-actions"></slot>
          <button type="button" class="close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${() => this.close('close-button')}>${glyph('close', 20)}</button>
        </div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div>
      </div>
    </dialog>`;
  }
}
