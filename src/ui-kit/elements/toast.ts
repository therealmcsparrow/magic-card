import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION, type UiToastAction } from '../../contracts/ui-kit';
import { kitToast } from '../css/toast';
import { showTop } from '../place';

/*
 * <mc-ui-toast> (contract ui-kit 1.0.0 r2): a transient confirmation of an action that needs no decision. One per screen
 * root; show() replaces the current message. The live region (role=status) exists from the start, so a message that
 * appears in it is announced; the visible chip is a manual popover (top layer), so it sits above an open <mc-ui-window>.
 * It never takes focus, pauses while hovered or focused within, and holds no strings of its own.
 * Revision 5 (ui-kit 1.1.0): it also pauses while a press is held inside it (until the pointer is released anywhere),
 * Escape closes it, and `dismissLabel` adds a close button; with that label both buttons are 44 px (the look editors'
 * 20 s Undo toast, flow-slider-styles Marco round 1).
 */
const DEFAULT_MS = 6000;

export class UiToast extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = [
    css`
      :host {
        display: contents;
        font-family: var(--mc-font, inherit);
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      .toast .dismiss {
        flex: none;
        display: inline-grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin: -10px -10px -10px -4px;
        padding: 0;
        border: 0;
        border-radius: var(--mc-radius, 8px);
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
      @media (hover: hover) {
        .toast .dismiss:hover {
          background: rgba(128, 128, 128, 0.25);
        }
      }
      .toast .dismiss:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -4px;
      }
      .toast .dismiss svg {
        width: 20px;
        height: 20px;
      }
      .toast.big .action {
        min-height: 44px;
        min-width: 44px;
      }
      .live {
        position: absolute;
        width: 0;
        height: 0;
        overflow: visible;
      }
    `,
    kitToast,
  ];

  /** px above the bottom edge; raise it when a save bar sits there. */
  @property({ type: Number }) offset = 16;
  /** Accessible name of the close button; without it there is no button (Escape still closes). */
  @property() dismissLabel?: string;

  @state() private _open = false;
  @state() private _text = '';
  @state() private _action?: { id: string; label: string };
  private _ms = DEFAULT_MS;
  private _timer?: ReturnType<typeof setTimeout>;
  private _hold = 0;

  get open(): boolean {
    return this._open;
  }

  show(o: { text: string; action?: { id: string; label: string }; duration?: number }): void {
    this._text = o.text;
    this._action = o.action;
    this._ms = o.duration ?? DEFAULT_MS;
    this._hold = 0;
    this._pressing = false;
    this._open = true;
    this._listen(true);
    this._arm();
    void this.updateComplete.then(() => {
      const t = this.renderRoot.querySelector<HTMLElement>('.toast');
      if (t) showTop(t);
    });
  }

  close(): void {
    clearTimeout(this._timer);
    this._timer = undefined;
    this._hold = 0;
    this._pressing = false;
    this._listen(false);
    this._open = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._timer);
    this._listen(false);
  }

  private _pressing = false;
  private _listening = false;

  private _listen(on: boolean): void {
    if (on === this._listening) return;
    this._listening = on;
    const m = on ? 'addEventListener' : 'removeEventListener';
    document[m]('keydown', this._key as EventListener, true);
    window[m]('pointerup', this._release);
    window[m]('pointercancel', this._release);
  }

  /** Escape closes the toast; it only stops the event when focus is inside the toast, so an open window still sees it. */
  private _key = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || !this._open) return;
    if (e.composedPath().includes(this)) e.stopPropagation();
    this.close();
  };

  private _press = (): void => {
    if (this._pressing) return;
    this._pressing = true;
    this._pause();
  };

  private _release = (): void => {
    if (!this._pressing) return;
    this._pressing = false;
    this._resume();
  };

  private _arm(): void {
    clearTimeout(this._timer);
    if (this._hold > 0) return;
    this._timer = setTimeout(() => this.close(), this._ms);
  }

  private _pause = (): void => {
    this._hold++;
    clearTimeout(this._timer);
  };

  private _resume = (): void => {
    this._hold = Math.max(0, this._hold - 1);
    this._arm();
  };

  private _act = (): void => {
    const a = this._action;
    if (!a) return;
    this.dispatchEvent(new CustomEvent<UiToastAction>('mc-toast-action', { detail: { id: a.id }, bubbles: true, composed: true }));
    this.close();
  };

  protected render(): TemplateResult {
    return html`<div class="live" role="status">
      ${this._open
        ? html`<div
            class="toast ${this.dismissLabel ? 'big' : ''}"
            part="toast"
            popover="manual"
            style="--mc-toast-offset:${this.offset}px"
            @pointerdown=${this._press}
            @pointerenter=${this._pause}
            @pointerleave=${this._resume}
            @focusin=${this._pause}
            @focusout=${this._resume}
          >
            <span class="text" part="text">${this._text}</span>
            ${this._action ? html`<button type="button" class="action" part="action" @click=${this._act}>${this._action.label}</button>` : nothing}
            ${this.dismissLabel
              ? html`<button type="button" class="dismiss" part="dismiss" aria-label=${this.dismissLabel} @click=${() => this.close()}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                </button>`
              : nothing}
          </div>`
        : nothing}
    </div>`;
  }
}
