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
    this._open = true;
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
    this._open = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

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
            class="toast"
            part="toast"
            popover="manual"
            style="--mc-toast-offset:${this.offset}px"
            @pointerenter=${this._pause}
            @pointerleave=${this._resume}
            @focusin=${this._pause}
            @focusout=${this._resume}
          >
            <span class="text" part="text">${this._text}</span>
            ${this._action ? html`<button type="button" class="action" part="action" @click=${this._act}>${this._action.label}</button>` : nothing}
          </div>`
        : nothing}
    </div>`;
  }
}
