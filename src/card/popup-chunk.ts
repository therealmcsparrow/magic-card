import { BUILD_VERSION } from '../utils/build-version';
import { PopupController, type PopupControllerOptions } from './popup-controller';
import { popupCoordinator } from './popup-coordinator';
import { navigateToPopup } from '../utils/popup-run';
import type { ReactiveControllerHost } from 'lit';

/** Chunk entry of dist/magic-card-popup.js: pop-up controller, coordinator and rules. */

export const BUILD: string = BUILD_VERSION;

/** The pop-up dialog and badge rules; Core adopts them with the chunk. */
export { popupStyles as styles } from '../css/popup';

/**
 * What the card and the editor call into (a plain object, so the entry never imports this file at run time). The
 * coordinator is not exported any other way: this chunk holds its only copy.
 */
export const api = {
  create: (host: ReactiveControllerHost & HTMLElement, opts: PopupControllerOptions): PopupController => new PopupController(host, opts),
  /** "Open pop-up" action: push `#id` onto the URL and let the cards look again; false for an invalid ID. */
  navigate: navigateToPopup,
  /** "Close pop-up" action: closes the open pop-up; false when none is open. */
  closeOpen: (): boolean => popupCoordinator.closeOpen(),
  /** Pop-up IDs of the Magic Cards on the page (action editor suggestions). */
  knownIds: (): string[] => popupCoordinator.knownIds(),
  /** "Preview pop-up" in the editor: opens the pop-up of the card previewed there; false when there is none. */
  preview: (canvas: boolean): boolean => popupCoordinator.preview(canvas),
} as const;

export type PopupApi = typeof api;

export function install(): void {}
