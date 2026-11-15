// Contract: Magic Card Utils settings. Version 1.0.0 (MCU_SETTINGS_CONTRACT). The install-wide switches Magic Card Utils
// publishes to every page, and how the card reads them. Provider: magic_card_utils_library.js in Magic Card Utils, fed by the
// `magic_card_utils/get_settings` websocket command, fed in turn by the integration's options flow. Consumers: the card's font
// loader and the card editor's look gallery.

export const MCU_SETTINGS_CONTRACT = '1.0.0';

/** Published on `window.magicCardUtils.settings` once the switches are known, and as the detail of the MCU_SETTINGS_EVENT. */
export interface McuSettings {
  /** The "Load Google Fonts" switch. */
  googleFonts: boolean;
  /** The "Look gallery" switch. Absent on Utils releases before the gallery; absent counts as off. */
  lookGallery?: boolean;
}

/** Window event fired once after the provider has read the switches (also when the read failed, with every switch off). */
export const MCU_SETTINGS_EVENT = 'mcu-settings';

/** Websocket command and its result keys (snake case on the wire). Readable by every signed-in user. */
export const MCU_GET_SETTINGS = 'magic_card_utils/get_settings';
export interface McuGetSettingsResult {
  google_fonts: boolean;
  look_gallery: boolean;
  theme_fonts: Record<string, { name: string; weights: number[] }[]>;
}

/**
 * Options flow rules, enforced by Magic Card Utils:
 * - `look_gallery` defaults to false.
 * - Turning it on opens two steps: an information step that names the gallery host (GALLERY_ORIGIN in look-index) and
 *   fonts.googleapis.com and fonts.gstatic.com and says what each receives (IP address and standard request headers), with
 *   Continue / Cancel; then a confirm step that says the switch applies to everyone, that Load Google Fonts is turned on with it,
 *   and that dashboards need a reload, with Turn on / Cancel. Only the confirm step stores anything: `look_gallery: true` and
 *   `google_fonts: true`. Cancel or close on either step stores nothing, so the switch stays off.
 * - The form refuses `look_gallery: true` with `google_fonts: false` (error key `gallery_needs_fonts`), so one switch never
 *   silently turns on the other's traffic. Turning the gallery off leaves Load Google Fonts as it is.
 * - Consequence for the card: whenever the gallery shows, `googleFonts` is true, so a previewed or kept look's Google font loads in
 *   the editor and on every dashboard through the one existing font loader (AC15). The gallery reads `googleFonts` only through the
 *   gate; it has no "fonts off" state to show.
 */
export const MCU_OPTION_LOOK_GALLERY = 'look_gallery';
export const MCU_OPTION_GOOGLE_FONTS = 'google_fonts';

/**
 * The card's gate: the gallery shows only when both switches are on. Read on demand from `window.magicCardUtils.settings`
 * (never cached across editor opens), so turning the switch off takes effect at the next editor open after a page reload.
 */
export type LookGalleryAllowed = () => boolean;
