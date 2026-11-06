import type { HomeAssistant } from '../../types';

/** HA's more-info dialog element (frontend `ha-more-info-dialog`): `showDialog` opens it for an entity. */
type MoreInfoDialog = HTMLElement & {
  hass?: HomeAssistant;
  showDialog?: (params: { entityId: string }) => unknown;
};

const TAG = 'ha-more-info-dialog';

/** The dialog events that would otherwise leave the studio and close HA's card dialog with it. */
const CLOSE_EVENTS = ['closed', 'dialog-closed'];

/**
 * Opens HA's more-info dialog inside the studio's modal <dialog> so it cannot sit behind it; its close events stop at the element.
 * Returns the element, or null when HA has not defined the dialog (then `hass-more-info` is asked).
 */
export function openMoreInfo(host: HTMLElement, hass: HomeAssistant | undefined, entityId: string): HTMLElement | null {
  closeMoreInfo(host);
  if (!customElements.get(TAG)) {
    document.querySelector('home-assistant')?.dispatchEvent(
      new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId } }),
    );
    return null;
  }
  const opener = deepActiveElement();
  const dialog = document.createElement(TAG) as MoreInfoDialog;
  dialog.hass = hass;
  for (const type of CLOSE_EVENTS) {
    dialog.addEventListener(type, (e) => {
      e.stopPropagation();
      if (type !== 'dialog-closed') return;
      dialog.remove();
      // the control that asked for the dialog gets focus back
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }
  host.appendChild(dialog);
  void dialog.showDialog?.({ entityId });
  focusFirstControl(dialog);
  return dialog;
}

/** The focused element, through open shadow roots. */
function deepActiveElement(): HTMLElement | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el instanceof HTMLElement ? el : null;
}

const FOCUSABLE = 'button, a[href], input, select, textarea, ha-icon-button, [tabindex]:not([tabindex="-1"])';

function firstControl(root: ParentNode): HTMLElement | null {
  const hit = root.querySelector<HTMLElement>(FOCUSABLE);
  if (hit) return hit;
  for (const el of root.querySelectorAll('*')) {
    const found = el.shadowRoot && firstControl(el.shadowRoot);
    if (found) return found;
  }
  return null;
}

/**
 * Moves focus into the dialog once it has drawn (its first control is the close button), so keyboard and
 * screen reader users land in it. The dialog renders over a few frames, so this waits for it, up to 1 s.
 */
function focusFirstControl(dialog: HTMLElement, tries = 20): void {
  const target = dialog.shadowRoot && firstControl(dialog.shadowRoot);
  if (target) {
    target.focus({ preventScroll: true });
    return;
  }
  if (tries > 0 && dialog.isConnected) setTimeout(() => focusFirstControl(dialog, tries - 1), 50);
}

/** Removes a more-info dialog the studio mounted (leaving Preview, closing the studio). */
export function closeMoreInfo(host: HTMLElement): void {
  host.querySelector(TAG)?.remove();
}

/** Keeps a mounted more-info dialog on the newest hass (states move while it is open). */
export function feedMoreInfo(host: HTMLElement, hass: HomeAssistant | undefined): void {
  const dialog = host.querySelector<MoreInfoDialog>(TAG);
  if (dialog) dialog.hass = hass;
}
