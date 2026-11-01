// Contract: forum shot (one PNG of a dashboard's Magic Cards for a forum post). Version 1.0.0.
// Types and constants only; the module is the lazy entry magic-card-forum-shot.js.

export const FORUM_SHOT_CONTRACT_VERSION = '1.0.0';
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
}

/** Error codes of listMagicCards and renderSheet (the `code` of the Error). */
export type ForumShotErrorCode = 'no_cards' | 'config_read_failed' | 'card_not_defined' | 'remote_asset' | 'capture_failed' | 'too_large';
