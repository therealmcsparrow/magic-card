// Contract: look gallery. Version 1.0.0 (LOOK_GALLERY_CONTRACT). The seam between the card editor and the lazy look-gallery
// chunk (magic-card-look-gallery.js). The editor holds only the gate and a loader; everything that fetches, verifies, caches,
// previews and applies lives in the chunk. Nothing in magic-card.js imports the chunk or this seam.

import type { HomeAssistant, MagicCardConfig } from '../types';

export const LOOK_GALLERY_CONTRACT = '1.0.0';
export const LOOK_GALLERY_CHUNK = 'look-gallery';
export const LOOK_GALLERY_CHUNK_FILE = 'magic-card-look-gallery.js';

export interface LookGalleryOpenOptions {
  hass: HomeAssistant;
  /** The editor's current config. The chunk never mutates it; previews and Keep work on copies. */
  config: MagicCardConfig;
  /**
   * Called once on Keep with the new config (applyLook output) and the kept look's display name. The editor fires its normal
   * config-changed with the config, then shows the applied banner (LOOK_GALLERY_BANNER_ID).
   */
  onKeep: (config: MagicCardConfig, kept: { name: string }) => void;
  /** Called on Cancel, Escape or close. The editor does nothing else: no config-changed was fired, so the prior config stands. */
  onClose: () => void;
}

/**
 * The chunk's export. Opens the gallery as a full-screen ui-kit window (mc-ui-window appended to `host`) over the editor and
 * returns a closer. The preview is a separate magic-card element inside the window, built from applyLook(config, parsed look).config,
 * and is inert three ways: the `inert` attribute on the element, `pointer-events: none` on its wrapper, and `hass` passed through
 * inertHass (src/utils/inert-hass.ts). Pointer events alone are not enough: the modules are focusable, so Tab and Enter would still
 * run actions. The wrapper has `role="img"` and the look name as `aria-label`. Escape is handled on the gallery root with
 * preventDefault and stopPropagation, so HA's editor dialog stays open. The chunk fetches nothing until `open` is called, and `open`
 * is only called when LookGalleryAllowed() is true.
 */
export interface LookGalleryModule {
  openLookGallery(host: HTMLElement, options: LookGalleryOpenOptions): () => void;
}

/** Editor entry point: shown in the card editor only when LookGalleryAllowed() is true; label and tooltip come from i18n. */
export const LOOK_GALLERY_BUTTON_ID = 'mc-look-gallery-open';

/**
 * Off hint: one line of static text in the card editor's card-level help area, shown when `window.magicCardUtils.settings` exists
 * and LookGalleryAllowed() is false. It tells the user to turn the gallery on in Magic Card Utils. No link, no request, no chunk
 * import. Absent when Utils is absent (no settings object) and gone once the gate is true. Text from the `card-editor` namespace.
 */
export const LOOK_GALLERY_HINT_ID = 'mc-look-gallery-hint';

/**
 * Applied banner, editor side: shown directly under the entry button after onKeep, a polite live region, next in tab order after
 * the button (where focus returns). Undo fires config-changed with the config passed to `open`, then removes the banner; Dismiss
 * removes it. It also goes on the next config-changed from any other source and when the editor closes. No timer. Text from the
 * `card-editor` namespace.
 */
export const LOOK_GALLERY_BANNER_ID = 'mc-look-gallery-applied';
