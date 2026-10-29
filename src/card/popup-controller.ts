import { html, nothing, TemplateResult, ReactiveController, ReactiveControllerHost } from 'lit';
import type { HomeAssistant, PopupConfig } from '../types';
import { isPopupEnabled } from '../utils/popup';
import { popupHash, urlWithHash } from '../utils/popup-hash';
import { SwipeTracker, autoCloseMs, hashMatches, navigateToPopup, popupStyle, popupStyleVars, triggerFired } from '../utils/popup-run';
import { popupCoordinator } from './popup-coordinator';
import { EditorPlace, LocationChange, PopupHandle, popupHidden } from './popup-nav';
import { t } from './i18n';

export type PopupPhase = 'closed' | 'open' | 'closing';
/** What opened the pop-up: the URL hash, a trigger without a hash, or the editor's preview button. */
type PopupSource = 'hash' | 'trigger' | 'preview';
type CloseReason = 'user' | 'location' | 'other' | 'silent';

/** Close animation length (CSS: 0.28s); none with reduced motion. */
export const POPUP_CLOSE_MS = 280;

export interface PopupControllerOptions {
  /** The card's pop-up settings (resolved config). */
  config: () => PopupConfig | undefined;
  /** Where an editor shows the card; undefined on a live dashboard. */
  editorPlace: () => EditorPlace | undefined;
}

function deepActiveElement(): HTMLElement | null {
  let el = document.activeElement as HTMLElement | null;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement as HTMLElement;
  return el;
}

function reducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The pop-up of a Magic Card (card `popup.enabled`): on a live dashboard the card takes no room
 * and shows in a native modal `<dialog>` (browser top layer: HA's transforms and overflow never clip
 * it) while `location.hash` is `#<popup.hash>`, after an open trigger or an "Open pop-up" action.
 * In an editor the card stays inline; "Preview pop-up" opens the real pop-up.
 *
 * History like HA's dialogs and Bubble Card: closing (button, backdrop, Escape, swipe down, auto
 * close, close trigger) removes the hash with history.back() when the hash came with a new history
 * entry, else with replaceState; the back button closes it. Only one Magic Card pop-up is open at a
 * time (src/card/popup-coordinator.ts).
 */
export class PopupController implements ReactiveController, PopupHandle {
  phase: PopupPhase = 'closed';
  private _source: PopupSource = 'hash';
  /** The hash came with its own history entry: closing goes back. */
  private _pushed = false;
  /** history.back() sent: hash matches are ignored until its popstate. */
  private _awaitPop = false;
  private _awaitPopTimer?: number;
  private _closeTimer?: number;
  private _autoTimer?: number;
  private _initialChecked = false;
  private _returnFocus: HTMLElement | null = null;
  private readonly _swipe = new SwipeTracker();

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly opts: PopupControllerOptions,
  ) {
    host.addController(this);
  }

  // ── state ──

  isPopup(): boolean {
    return isPopupEnabled(this.opts.config());
  }

  popupId(): string | undefined {
    return this.isPopup() ? popupHash(this.opts.config()) : undefined;
  }

  editorPlace(): EditorPlace | undefined {
    return this.opts.editorPlace();
  }

  /** Pop-up mode on a live dashboard: the card itself is not in the flow. */
  get hidden(): boolean {
    return popupHidden(this.opts.config(), this.editorPlace());
  }

  get isOpen(): boolean {
    return this.phase !== 'closed';
  }

  /** Reacts to the URL and triggers (live dashboard only). */
  private _listening(): boolean {
    return this.host.isConnected && this.hidden;
  }

  // ── lifecycle ──

  hostConnected(): void {
    popupCoordinator.register(this);
    this._initialChecked = false;
  }

  hostDisconnected(): void {
    popupCoordinator.unregister(this);
    this._finish(false);
    window.clearTimeout(this._awaitPopTimer);
    this._awaitPop = false;
  }

  hostUpdated(): void {
    if (!this._listening()) {
      this._initialChecked = false;
      // left pop-up mode or moved into an editor: a hash / trigger pop-up closes (a preview stays)
      if (this.phase === 'open' && this._source !== 'preview') this._close('silent');
    } else if (!this._initialChecked) {
      this._initialChecked = true;
      // the page opened with #id (a reload, a link): no history entry of ours to go back to
      if (hashMatches(window.location.hash, this.popupId())) this._open('hash', false);
    }
    this._syncDialog();
  }

  private get _dialog(): HTMLDialogElement | null {
    return this.host.shadowRoot?.querySelector<HTMLDialogElement>('dialog.mc-popup') ?? null;
  }

  private _syncDialog(): void {
    const dlg = this._dialog;
    if (!dlg) return;
    if (this.phase !== 'closed' && !dlg.open) {
      try {
        dlg.showModal();
      } catch {
        dlg.setAttribute('open', '');
      }
      this._focusInside(dlg);
    } else if (this.phase === 'closed' && dlg.open) {
      dlg.close();
    }
  }

  private _focusInside(dlg: HTMLDialogElement): void {
    const target = dlg.querySelector<HTMLElement>('.mc-popup-close') ?? dlg.querySelector<HTMLElement>('.mc-popup-surface');
    target?.focus({ preventScroll: true });
  }

  // ── opening and closing ──

  locationChanged(change: LocationChange): void {
    if (!this._listening()) return;
    if (change === 'pop') {
      this._awaitPop = false;
      window.clearTimeout(this._awaitPopTimer);
    } else if (this._awaitPop) {
      return;
    }
    const match = hashMatches(window.location.hash, this.popupId());
    if (match && this.phase !== 'open') this._open('hash', change !== 'replace');
    else if (!match && this.phase === 'open' && this._source === 'hash') this._close('location');
  }

  /** Open / close triggers on a state change (live dashboard only). */
  hassChanged(oldHass: HomeAssistant | undefined, hass: HomeAssistant | undefined): void {
    if (!this._listening() || !oldHass || !hass) return;
    const popup = this.opts.config();
    if (this.phase !== 'open' && triggerFired(popup?.open_on, oldHass.states, hass.states)) {
      // with an ID through the URL like any other opening (back closes it); without one directly
      if (!navigateToPopup(this.popupId())) this._open('trigger', false);
    } else if (this.phase === 'open' && triggerFired(popup?.close_on, oldHass.states, hass.states)) {
      this._close('user');
    }
  }

  openPreview(): void {
    this._open('preview', false);
  }

  closeForOther(): void {
    this._close('other');
  }

  closeByAction(): void {
    this._close('user');
  }

  /** Close button, backdrop, Escape, swipe. */
  close(): void {
    this._close('user');
  }

  private _open(source: PopupSource, pushed: boolean): void {
    window.clearTimeout(this._closeTimer);
    this._closeTimer = undefined;
    this._source = source;
    this._pushed = pushed;
    if (this.phase === 'open') return;
    const reopening = this.phase === 'closing';
    popupCoordinator.willOpen(this);
    if (!reopening) this._returnFocus = deepActiveElement();
    this.phase = 'open';
    this._restartAutoClose();
    this.host.requestUpdate();
  }

  private _close(reason: CloseReason): void {
    if (this.phase !== 'open') return;
    window.clearTimeout(this._autoTimer);
    if (this._source === 'hash' && reason !== 'location' && reason !== 'silent') this._leaveHash(reason === 'other');
    this.phase = 'closing';
    this.host.requestUpdate();
    const ms = reason === 'silent' || reducedMotion() ? 0 : POPUP_CLOSE_MS;
    this._closeTimer = window.setTimeout(() => this._finish(true), ms);
  }

  /** Remove `#id` from the URL: back to the entry before it when it had its own, else replace. */
  private _leaveHash(replaceOnly: boolean): void {
    if (!hashMatches(window.location.hash, this.popupId())) return;
    if (this._pushed && !replaceOnly) {
      this._awaitPop = true;
      window.clearTimeout(this._awaitPopTimer);
      this._awaitPopTimer = window.setTimeout(() => {
        this._awaitPop = false;
      }, 1000);
      history.back();
      return;
    }
    history.replaceState(history.state, '', urlWithHash(window.location.href));
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: true } }));
  }

  private _finish(restoreFocus: boolean): void {
    window.clearTimeout(this._closeTimer);
    window.clearTimeout(this._autoTimer);
    this._closeTimer = undefined;
    this._swipe.cancel();
    if (this.phase === 'closed') return;
    this.phase = 'closed';
    popupCoordinator.didClose(this);
    const dlg = this._dialog;
    if (dlg?.open) dlg.close();
    this.host.requestUpdate();
    const back = this._returnFocus;
    this._returnFocus = null;
    if (restoreFocus && back?.isConnected) back.focus({ preventScroll: true });
  }

  private _restartAutoClose(): void {
    window.clearTimeout(this._autoTimer);
    const ms = autoCloseMs(this.opts.config()?.auto_close);
    if (ms && this.phase === 'open') this._autoTimer = window.setTimeout(() => this._close('user'), ms);
  }

  // ── dialog events ──

  private _onKeydown = (e: KeyboardEvent): void => {
    this._restartAutoClose();
    if (e.key !== 'Escape') return;
    // ours only: never reaches HA's dialogs (the card editor) or keyboard shortcuts
    e.preventDefault();
    e.stopPropagation();
    this._close('user');
  };

  /** Native cancel (Android back gesture, a second Escape): close like the button. */
  private _onCancel = (e: Event): void => {
    e.preventDefault();
    this._close('user');
  };

  /** Closed by the browser without us: settle the state. */
  private _onNativeClose = (): void => {
    if (this.phase === 'open') this._close('user');
  };

  private _onActivity = (): void => this._restartAutoClose();

  private _onBackdrop = (e: Event): void => {
    e.stopPropagation();
    this._close('user');
  };

  private _onCloseClick = (e: Event): void => {
    e.stopPropagation();
    this._close('user');
  };

  // ── swipe down on the sheet handle ──

  private _surface(): HTMLElement | null {
    return this._dialog?.querySelector<HTMLElement>('.mc-popup-surface') ?? null;
  }

  private _onHandleDown = (e: PointerEvent): void => {
    if (!e.isPrimary || e.button > 0 || this.phase !== 'open') return;
    if ((e.target as HTMLElement | null)?.closest?.('.mc-popup-close')) return;
    this._swipe.start(e.clientY, e.timeStamp);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    this._surface()?.setAttribute('data-dragging', '');
  };

  private _onHandleMove = (e: PointerEvent): void => {
    if (!this._swipe.active) return;
    const offset = this._swipe.move(e.clientY);
    this._surface()?.style.setProperty('--mc-popup-drag', `${offset}px`);
  };

  private _onHandleUp = (e: PointerEvent): void => {
    if (!this._swipe.active) return;
    const surface = this._surface();
    const close = this._swipe.end(e.clientY, e.timeStamp, surface?.getBoundingClientRect().height ?? 0);
    surface?.removeAttribute('data-dragging');
    if (close) this._close('user');
    else surface?.style.removeProperty('--mc-popup-drag');
  };

  private _onHandleCancel = (): void => {
    if (!this._swipe.active) return;
    this._swipe.cancel();
    const surface = this._surface();
    surface?.removeAttribute('data-dragging');
    surface?.style.removeProperty('--mc-popup-drag');
  };

  // ── rendering ──

  /**
   * The header of the surface: drag handle (sheet), title and close button. Sheet: the whole
   * header is the swipe area.
   */
  renderHead(titleId: string): TemplateResult {
    const popup = this.opts.config();
    const sheet = popupStyle(popup) === 'sheet';
    const title = popup?.title?.trim();
    const showClose = popup?.show_close !== false;
    if (!sheet && !title && !showClose) return html``;
    return html`
      <div
        class="mc-popup-head"
        @pointerdown=${sheet ? this._onHandleDown : nothing}
        @pointermove=${sheet ? this._onHandleMove : nothing}
        @pointerup=${sheet ? this._onHandleUp : nothing}
        @pointercancel=${sheet ? this._onHandleCancel : nothing}
      >
        ${sheet ? html`<div class="mc-popup-handle" aria-hidden="true"></div>` : nothing}
        ${title ? html`<h2 class="mc-popup-title" id=${titleId}>${title}</h2>` : html`<span class="mc-popup-title"></span>`}
        ${showClose
          ? html`<button type="button" class="mc-popup-close" aria-label=${t('card.popup-controller.close')} title=${t('card.popup-controller.close')} @click=${this._onCloseClick}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  /** The `<dialog>` (always rendered in pop-up mode; `surface` only while open). */
  renderDialog(surface: TemplateResult | typeof nothing, label: string, titleId: string, cardRadius?: string): TemplateResult {
    const popup = this.opts.config();
    const titled = !!popup?.title?.trim();
    return html`
      <dialog
        class="mc-popup"
        data-mc-popup=""
        data-style=${popupStyle(popup)}
        data-phase=${this.phase}
        aria-modal="true"
        aria-labelledby=${titled ? titleId : nothing}
        aria-label=${titled ? nothing : label}
        style=${popupStyleVars(popup, cardRadius)}
        @keydown=${this._onKeydown}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @pointerdown=${this._onActivity}
        @wheel=${this._onActivity}
        @touchstart=${this._onActivity}
      >
        ${this.phase === 'closed'
          ? nothing
          : html`<div class="mc-popup-backdrop" @click=${this._onBackdrop}></div>
              <div class="mc-popup-frame">${surface}</div>`}
      </dialog>
    `;
  }
}
