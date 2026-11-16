// Contract: Magic Card Utils settings. Version 1.1.0 (MCU_SETTINGS_CONTRACT). The install-wide switches Utils publishes to every
// page and how the card reads them. Provider: magic_card_utils_library.js, fed by `magic_card_utils/get_settings`, which reads the
// integration's options flow. Consumers: the card's font loader, the card editor's look gallery and its Copy my setup button.

export const MCU_SETTINGS_CONTRACT = '1.1.0';

/** Published on `window.magicCardUtils.settings` once the switches are known, and as the detail of the MCU_SETTINGS_EVENT. */
export interface McuSettings {
  /** The "Load Google Fonts" switch. */
  googleFonts: boolean;
  /** The "Look gallery" switch. Absent on Utils releases before the gallery; absent counts as off. */
  lookGallery?: boolean;
  /**
   * The installed Utils version, the `version` of its manifest.json. Absent on Utils releases before 1.1.0 and when the read
   * failed; consumers check it against diagnostics VERSION_RE and treat anything else as unknown.
   */
  version?: string;
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
 * Options flow, enforced by Magic Card Utils; `look_gallery` defaults to false. On: an information step names the gallery host
 * (GALLERY_ORIGIN in look-index), what it receives (IP address, standard request headers) and that fonts.googleapis.com and
 * fonts.gstatic.com are contacted only while Load Google Fonts is on, Continue / Cancel; then a confirm step (everyone, leaves Load
 * Google Fonts as it is, dashboard reload), Turn on / Cancel. Only confirm stores, only `look_gallery: true`; Cancel or close: nothing.
 */
export const MCU_OPTION_LOOK_GALLERY = 'look_gallery';
/**
 * Independent of `look_gallery` both ways: turning the gallery on or off never changes Load Google Fonts, and the form accepts
 * `look_gallery: true` with `google_fonts: false`. Utils then only advises turning Load Google Fonts on; it does not refuse. With it
 * off, the one existing font loader skips a look's Google font, so the editor and dashboards show a fallback font.
 */
export const MCU_OPTION_GOOGLE_FONTS = 'google_fonts';

/**
 * The card's gate: the gallery shows when `lookGallery` is true; it does not read `googleFonts`. Read on demand from
 * `window.magicCardUtils.settings` (never cached across editor opens), so turning the switch off takes effect at the next editor
 * open after a page reload.
 */
export type LookGalleryAllowed = () => boolean;
