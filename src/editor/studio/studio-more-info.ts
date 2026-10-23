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
 * Opens Home Assistant's more-info dialog inside the studio's own modal `<dialog>`.
 *
 * The studio is a native modal in the top layer; a dialog HA draws elsewhere (older frontends draw
 * outside the top layer) would sit behind it, inert. Inside the studio it can never be. Its close
 * events stop at the element: left alone they bubble through the studio up to HA's card dialog, which
 * reads them as its own close.
 *
 * Returns the mounted element, or null when HA has not defined the dialog yet; then HA's own
 * `hass-more-info` handling is asked instead (it loads the dialog and shows it).
 */
export function openMoreInfo(host: HTMLElement, hass: HomeAssistant | undefined, entityId: string): HTMLElement | null {
  closeMoreInfo(host);
  if (!customElements.get(TAG)) {
    document.querySelector('home-assistant')?.dispatchEvent(
      new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId } }),
    );
    return null;
  }
  const dialog = document.createElement(TAG) as MoreInfoDialog;
  dialog.hass = hass;
  for (const type of CLOSE_EVENTS) {
    dialog.addEventListener(type, (e) => {
      e.stopPropagation();
      if (type === 'dialog-closed') dialog.remove();
    });
  }
  host.appendChild(dialog);
  void dialog.showDialog?.({ entityId });
  return dialog;
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
