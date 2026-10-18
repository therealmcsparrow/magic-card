import { html, TemplateResult } from 'lit';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { UiWindowElement } from '../../contracts/ui-kit';
import { t } from '../i18n';

/** Shared markup for the picker modals (styled by pickerStyles + editorSystem). */

/** The focused element, following open shadow roots (the trigger usually lives in one). */
function deepActiveElement(): HTMLElement | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a instanceof HTMLElement ? a : null;
}

/**
 * Shows a picker's `<dialog class="mc-picker-overlay">` in the browser's top layer (showModal()).
 *
 * Top-layer elements are positioned against the viewport even when an ancestor has a transform or
 * clips overflow. HA's card-editor dialog part has `transform: translate(...)` + `overflow: hidden`,
 * which made the old `position: fixed; inset: 0` overlay cover the dialog surface instead of the
 * viewport (off to the right / clipped on narrow screens). A modal dialog opened later also stacks
 * above the studio's modal <dialog>, traps focus (the rest of the page is inert) and gets the
 * Escape close request. Without showModal() the overlay is shown in flow (the old behaviour).
 *
 * The host renders the overlay while open; this controller opens it once rendered, routes Escape /
 * the native cancel through `onClose`, and returns focus to the trigger when the overlay goes away.
 */
export interface PickerDialogOptions {
  /** Selector of the host's overlay <dialog> (default `dialog.mc-picker-overlay`). */
  selector?: string;
  /** Moves focus into the dialog once it is modal (default: the `.mc-picker-modal` window itself). */
  focus?: (dlg: HTMLDialogElement) => void;
}

/** `:modal` is unknown to older WebViews (matches() throws): treated as not modal. */
function isModal(dlg: HTMLDialogElement): boolean {
  try {
    return dlg.matches(':modal');
  } catch {
    return false;
  }
}

function focusPickerWindow(dlg: HTMLDialogElement): void {
  // Start on the window itself (not its first button, Maximize); pickers with a search field move
  // focus there in their own updated().
  const win = dlg.querySelector<HTMLElement>('.mc-picker-modal');
  if (win) {
    win.tabIndex = -1;
    win.focus({ preventScroll: true });
  }
}

export class PickerDialogController implements ReactiveController {
  private _dlg: HTMLDialogElement | null = null;
  private _downOnBackdrop = false;
  private _returnFocus: HTMLElement | null = null;
  private readonly _selector: string;
  private readonly _focus: (dlg: HTMLDialogElement) => void;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly onClose: () => void,
    opts: PickerDialogOptions = {},
  ) {
    this._selector = opts.selector ?? 'dialog.mc-picker-overlay';
    this._focus = opts.focus ?? focusPickerWindow;
    host.addController(this);
  }

  hostUpdated(): void {
    const dlg = this.host.shadowRoot?.querySelector<HTMLDialogElement>(this._selector) ?? null;
    if (dlg === this._dlg) return;
    if (this._dlg) this._closed();
    if (dlg) this._open(dlg);
  }

  /** Reconnected while the host still renders its dialog (e.g. a parent-controlled picker): show it again. */
  hostConnected(): void {
    this.hostUpdated();
  }

  /**
   * Removed from the document while open: the browser drops the dialog from the top layer but leaves
   * `open` set. Close it for real and close the picker too, so host state matches what is on screen.
   */
  hostDisconnected(): void {
    if (!this._dlg) return;
    this._closed();
    this.onClose();
  }

  private _open(dlg: HTMLDialogElement): void {
    this._dlg = dlg;
    this._returnFocus = deepActiveElement();
    dlg.addEventListener('cancel', this._onCancel);
    dlg.addEventListener('close', this._onNativeClose);
    dlg.addEventListener('keydown', this._onKeydown);
    dlg.addEventListener('pointerdown', this._onPointerdown);
    if (dlg.open) {
      // Already modal (nothing to do), or left open but no longer in the top layer: re-show it modal.
      if (isModal(dlg)) return;
      dlg.removeAttribute('open');
    }
    if (typeof dlg.showModal === 'function' && dlg.isConnected) {
      try {
        dlg.showModal();
        this._focus(dlg);
        return;
      } catch {
        /* fall through to the in-flow overlay */
      }
    }
    dlg.setAttribute('open', '');
  }

  private _closed(): void {
    const dlg = this._dlg!;
    this._dlg = null;
    dlg.removeEventListener('cancel', this._onCancel);
    dlg.removeEventListener('close', this._onNativeClose);
    dlg.removeEventListener('keydown', this._onKeydown);
    dlg.removeEventListener('pointerdown', this._onPointerdown);
    this._downOnBackdrop = false;
    try {
      dlg.close();
    } catch {
      /* already closed */
    }
    dlg.removeAttribute('open');
    const back = this._returnFocus;
    this._returnFocus = null;
    if (back?.isConnected) back.focus({ preventScroll: true });
  }

  /**
   * True for a click on the backdrop (the overlay itself) whose press also started there. A press that
   * starts inside the window (drag-selecting text, a slider) and ends outside clicks the common
   * ancestor, the overlay, and must not close the picker.
   */
  isBackdropClick(e: Event): boolean {
    const hit = e.target === this._dlg && this._downOnBackdrop;
    this._downOnBackdrop = false;
    return hit;
  }

  private _onPointerdown = (e: Event): void => {
    this._downOnBackdrop = e.target === this._dlg;
  };

  /** Escape close request (focus on the dialog itself, or keydown not consumed by the modal). */
  private _onCancel = (e: Event): void => {
    e.preventDefault();
    this.onClose();
  };

  /**
   * Closed by the browser itself (a `method="dialog"` form, a close request that skips cancel, a
   * close watcher): close the picker too. Our own close() runs after this listener is removed; a
   * late close event for a dialog that is open again (re-shown modal) is ignored.
   */
  private _onNativeClose = (e: Event): void => {
    if (e.target === this._dlg && !(e.target as HTMLDialogElement).open) this.onClose();
  };

  private _onKeydown = (e: KeyboardEvent): void => pickerKeydown(this.onClose)(e);
}

/**
 * keydown handler for a `.mc-picker-modal`: Escape closes the picker (same path as its close button)
 * and is consumed, so it never reaches the studio dialog or Home Assistant's own Escape handling.
 */
export function pickerKeydown(onClose: () => void): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };
}

export interface PickerSearchOptions {
  /** keydown on the search input (list navigation). */
  onKeydown?: (e: KeyboardEvent) => void;
  /** id of the listbox the input drives, and of its active option (combobox semantics). */
  listId?: string;
  activeId?: string;
}

export function renderPickerSearch(
  placeholder: string,
  value: string,
  onInput: (value: string) => void,
  opts: PickerSearchOptions = {},
): TemplateResult {
  return html`
    <div class="with-icon">
      <ha-icon icon="mdi:magnify"></ha-icon>
      <input
        id="mc-picker-search"
        class="input"
        type="text"
        placeholder=${placeholder}
        aria-label=${placeholder}
        role=${ifDefined(opts.listId ? 'combobox' : undefined)}
        aria-expanded=${ifDefined(opts.listId ? 'true' : undefined)}
        aria-controls=${ifDefined(opts.listId)}
        aria-activedescendant=${ifDefined(opts.activeId)}
        spellcheck="false"
        .value=${value}
        @input=${(e: InputEvent) => onInput((e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => opts.onKeydown?.(e)}
      />
    </div>
  `;
}

/** Phone width: the kit window is a bottom sheet there (CEO D8) and has no grips. */
const compact = (): boolean => typeof matchMedia === 'function' && matchMedia('(max-width: 599px)').matches;

/**
 * One picker window: the kit's <mc-ui-window> (movable, resizable, maximisable) around the picker's search row, list and
 * a footer (`<div class="mc-picker-footer" slot="footer">`). PickerWindowController shows it once rendered.
 * Sizes: s 420, m 480, l 640.
 */
export function renderPickerWindow(title: string, onClose: () => void, size: 's' | 'm' | 'l', content: TemplateResult): TemplateResult {
  return html`<mc-ui-window
    heading=${title}
    closeLabel=${t('Close')}
    variant=${compact() ? 'sheet' : 'picker'}
    size=${size}
    initialFocus="mc-picker-search"
    movable
    resizable
    maximizable
    moveLabel=${t('Move window')}
    resizeLabel=${t('Resize window')}
    maximizeLabel=${t('Maximise')}
    restoreLabel=${t('Restore size')}
    @mc-window-close=${onClose}
    >${content}</mc-ui-window>`;
}

/**
 * Shows the picker's <mc-ui-window> once the host has rendered it (the kit window is a native modal <dialog> in the top
 * layer, a real focus trap), and returns focus to the control that opened it. A host removed from the document while the
 * window is open closes it and the picker (`onClose`); the same host, back in the document and still rendering the window,
 * shows it again (a parent-controlled picker).
 */
export class PickerWindowController implements ReactiveController {
  private _shown = false;
  private _back: HTMLElement | null = null;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    private readonly onClose: () => void,
  ) {
    host.addController(this);
  }

  private win(): UiWindowElement | null {
    return this.host.shadowRoot?.querySelector<UiWindowElement>('mc-ui-window') ?? null;
  }

  hostUpdated(): void {
    const w = this.win();
    if (!w) {
      // gone from the template (Save, or a close we did not see): the trigger gets its focus back
      const back = this._back;
      this._shown = false;
      this._back = null;
      if (back?.isConnected) back.focus({ preventScroll: true });
      return;
    }
    if (!w.open) {
      if (!this._shown) {
        this._back = deepActiveElement();
        w.opener = this._back ?? undefined;
      }
      this._shown = true;
      w.show();
    }
  }

  hostConnected(): void {
    this.hostUpdated();
  }

  hostDisconnected(): void {
    if (!this._shown) return;
    this._shown = false;
    this.win()?.close('action');
    this.onClose();
  }
}
