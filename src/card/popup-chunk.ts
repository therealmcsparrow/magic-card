import { BUILD_VERSION } from '../utils/build-version';
import { PopupController, type PopupControllerOptions } from './popup-controller';
import { popupCoordinator } from './popup-coordinator';
import type { ReactiveControllerHost } from 'lit';

/*
 * Chunk entry of dist/magic-card-popup.js (lazy-module 1.4.0 chunk `popup`): the pop-up controller (open and close, the
 * dialog, focus, history, triggers, swipe), the one coordinator of the page's pop-ups and the pop-up rules (`styles`).
 * A pop-up card on a live dashboard is out of the flow from its config alone (popup-nav.ts), so installing the chunk
 * moves nothing; the controller opens a pop-up whose #id is already in the URL when it attaches.
 */

export const BUILD: string = BUILD_VERSION;

/** The pop-up dialog and badge rules; Core adopts them with the chunk. */
export { popupStyles as styles } from '../css/popup';

/**
 * What the card and the editor call into (a plain object, so the entry never imports this file at run time). The
 * coordinator is not exported any other way: this chunk holds its only copy.
 */
export const api = {
  create: (host: ReactiveControllerHost & HTMLElement, opts: PopupControllerOptions): PopupController => new PopupController(host, opts),
  /** "Close pop-up" action: closes the open pop-up; false when none is open. */
  closeOpen: (): boolean => popupCoordinator.closeOpen(),
  /** Pop-up IDs of the Magic Cards on the page (action editor suggestions). */
  knownIds: (): string[] => popupCoordinator.knownIds(),
  /** "Preview pop-up" in the editor: opens the pop-up of the card previewed there; false when there is none. */
  preview: (canvas: boolean): boolean => popupCoordinator.preview(canvas),
} as const;

export type PopupApi = typeof api;

export function install(): void {}
