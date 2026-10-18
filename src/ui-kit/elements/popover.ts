import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION, type UiPopoverClose } from '../../contracts/ui-kit';
import { kitPopoverElementCss } from '../css/elements';
import { placeAtRect, showTop } from '../place';

/*
 * <mc-ui-popover> (contract ui-kit 1.0.0): a non-modal panel anchored to a button (Shortcuts, Preview). Popover API
 * (top layer) with a fixed-position fallback. Escape and an outside press close it, focus returns to the anchor.
 * It is not a dialog: no aria-modal, no scrim. The caller sets aria-expanded / aria-controls on the anchor.
 */
export class UiPopover extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = kitPopoverElementCss;

  @property({ attribute: false }) anchor!: HTMLElement;
  @property() label = '';
  @property() align: 'start' | 'end' = 'start';

  @state() private _open = false;

  get open(): boolean {
    return this._open;
  }

  show(): void {
    if (this._open) return;
    this._open = true;
    document.addEventListener('pointerdown', this._outside, true);
    window.addEventListener('resize', this._resize);
    void this.updateComplete.then(() => {
      const p = this.panel();
      if (!p) return;
      showTop(p);
      if (this.anchor) placeAtRect(p, this.anchor.getBoundingClientRect(), this.align);
    });
  }

  close(reason: UiPopoverClose['reason'] = 'action'): void {
    if (!this._open) return;
    this._open = false;
    document.removeEventListener('pointerdown', this._outside, true);
    window.removeEventListener('resize', this._resize);
    this.dispatchEvent(new CustomEvent<UiPopoverClose>('mc-popover-close', { detail: { reason }, bubbles: true, composed: true }));
    if (reason !== 'outside' && reason !== 'tab') this.anchor?.focus?.({ preventScroll: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._outside, true);
    window.removeEventListener('resize', this._resize);
  }

  private panel(): HTMLElement | null {
    return this.renderRoot.querySelector('.panel');
  }

  private _outside = (e: Event): void => {
    const path = e.composedPath();
    if (path.includes(this) || (this.anchor && path.includes(this.anchor))) return;
    this.close('outside');
  };

  private _resize = (): void => this.close('outside');

  private _key = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close('escape');
    }
  };

  /** Focus left the panel for another element (Tab out): close without stealing focus back. */
  private _focusout = (e: FocusEvent): void => {
    const to = e.relatedTarget as Node | null;
    if (to && !this.contains(to) && !this.renderRoot.contains(to) && to !== this.anchor) this.close('tab');
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    return html`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`;
  }
}
