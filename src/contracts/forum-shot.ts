// Contract: forum shot (one PNG of a dashboard's Magic Cards for a forum post). Version 1.2.0.
// Types and constants only; the module is the lazy entry magic-card-forum-shot.js.

export const FORUM_SHOT_CONTRACT_VERSION = '1.2.0';
export const FORUM_SHOT_FILE = 'magic-card-forum-shot.js';
export const FORUM_SHOT_TAG = 'magic-card-forum-shot';
/** Width of one frame in CSS px. */
export const FORUM_SHOT_WIDTH = 420;
/** Device pixels per CSS px of the sheet. */
export const FORUM_SHOT_SCALE = 2;
/** Most pixels one sheet may hold (width times height); a larger sheet fails with `too_large`. */
export const FORUM_SHOT_MAX_PIXELS = 16_777_216;

export type ForumShotMode = 'light' | 'dark';
export type ForumShotLook = 'as-configured' | 'quiet' | 'living' | 'glow';
/** A fact the panel shows under the preview. */
export type ForumShotNotice = 'remote_placeholder';

export interface ForumShotRequest {
  config: Record<string, unknown>;
  modes: ForumShotMode[];
  looks: ForumShotLook[];
  /** The font hosts the person was shown (`MagicCardRef.fontHosts`); absent means none. A card whose fresh config needs a host outside them fails with `hosts_changed` before any request. */
  fontHosts?: string[];
}

export interface ForumShotSheet {
  /** The PNG (image/png). */
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
  frames: { mode: ForumShotMode; look: ForumShotLook }[];
  notices: ForumShotNotice[];
}

/** Why a card cannot be picked. A card with several reasons reports the first in the order listed here. */
export type ForumShotLockReason = 'custom_card' | 'limit' | 'outside_address' | 'cannot_judge';

/** One Magic Card found in a dashboard config. */
export interface MagicCardRef {
  /** url_path of the dashboard, or null for the default one. */
  dashboard: string | null;
  view: string;
  /** Index path of the card inside the dashboard config. */
  path: number[];
  label: string;
  /** Cross-origin hosts and Google font families the config names; empty when none. */
  remote: string[];
  /** Why the card cannot be picked; null when it can. */
  lock: ForumShotLockReason | null;
  /** Hosts the config names that a Download contacts for fonts; empty when it fetches none, as on a locked card. */
  fontHosts: string[];
  /** Title of the dashboard, for display. */
  dashboardTitle: string;
  /** Name of the card, or its position in the view when it has none. */
  cardName: string;
}

/** What a Download makes: `both` gives a light and a dark frame; `looks` adds the Quiet, Living and Glow rows of animated icons. */
export interface ForumShotChoice {
  mode: 'both' | ForumShotMode;
  looks: boolean;
}

/**
 * Static members of the registered element's constructor (`customElements.get(FORUM_SHOT_TAG)`).
 * A host that draws its own card list and picture preview calls these and need not mount the element;
 * the element's own table and Download use the same members, so both read and save cards one way.
 * Hosts check that both members exist before calling them; an older entry has neither.
 */
export interface ForumShotEntry {
  readonly contractVersion: string;
  /**
   * Every Magic Card in the dashboards, in dashboard order, read through `hass.callWS` only. Contacts no other host.
   * Rejects with an Error whose `code` is `no_cards` (none found) or `config_read_failed`.
   */
  listCards(hass: object): Promise<MagicCardRef[]>;
  /**
   * Reads the card's current config, makes the sheet with `ref.fontHosts` as the disclosed hosts, and saves it as a PNG
   * under `fileName` with the local time added (nothing is stored). Resolves to the sheet so the host can show it.
   * Rejects with a `ForumShotErrorCode`: `remote_asset` and `hosts_changed` mean the card changed since the list, so list again.
   * Only a person's click may start it, because it can contact the hosts in `ref.fontHosts`.
   */
  download(hass: object, ref: MagicCardRef, choice: ForumShotChoice): Promise<ForumShotSheet>;
}

/**
 * Error codes of listMagicCards, renderSheet and the `ForumShotEntry` members (the `code` of the Error).
 * `remote_asset`: the card is locked. `font_unavailable`: a font the card needs could not be prepared or embedded, and no picture is made.
 * `hosts_changed`: the card now needs a font host that was not in the request's `fontHosts`; nothing was requested.
 */
export type ForumShotErrorCode =
  | 'no_cards'
  | 'config_read_failed'
  | 'card_not_defined'
  | 'remote_asset'
  | 'capture_failed'
  | 'too_large'
  | 'font_unavailable'
  | 'hosts_changed';
