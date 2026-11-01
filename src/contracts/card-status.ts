// Contract: card status faces (connection lost, reconnected, not updated since). Version 1.0.0.
// The faces live in the quiet on-demand chunk dist/magic-card-status.js; magic-card.js imports this file as types only.
// A quiet chunk that fails or comes from another build shows nothing, and the card renders as without it.

import type { TemplateResult } from 'lit';
import type { HomeAssistant } from '../types';
import type { LazyChunkModule } from './lazy-module';

export const CARD_STATUS_CONTRACT = '1.0.0';

/** A drop shorter than this shows nothing; the lost face shows at lostAt + CONNECTION_GRACE_MS. */
export const CONNECTION_GRACE_MS = 15_000;

/** How long "Reconnected" stays before the live card returns. */
export const RECONNECTED_HOLD_MS = 3_000;

/** Longest delay one setTimeout accepts; a later deadline is reached in steps no longer than this. */
export const MAX_TIMER_MS = 2_147_483_647;

/** Face kinds in precedence order: the first one that applies is shown. */
export const STATUS_FACE_KINDS = ['lost', 'back', 'stale'] as const;
export type StatusFaceKind = (typeof STATUS_FACE_KINDS)[number];

/** since is epoch ms: the moment of the drop (lost) or the entity's last_updated (stale; Home Assistant never pushes last_reported to cards). */
export type StatusFace =
  | { kind: 'lost'; since: number }
  | { kind: 'back' }
  | { kind: 'stale'; entity: string; since: number };

/** The card element as the controller sees it. */
export interface StatusHost {
  requestUpdate(): void;
  /** Date.now() when hass.connected turned false, written by the card on every drop; the controller clears it
   * when the reconnected hold ends, or when it meets the connection back with no lost face shown for that drop. */
  lostAt?: number;
}

/** One per card, made by the chunk's api and driven by the card. */
export interface StatusController {
  /** Collects every `entity` + `quiet_time` pair written on the same node (card root and any module); skips unreadable ones. */
  config(config: unknown): void;
  /** The only hass source; keeps next. "Reconnected" shows only after a shown lost face, so a chunk that
   * installs with the connection already back shows nothing for that drop. Missing `connected` counts as connected. */
  hassChanged(prev?: HomeAssistant, next?: HomeAssistant): void;
  /** The face to show now in STATUS_FACE_KINDS order (oldest time among stale entities), or undefined. */
  face(): StatusFace | undefined;
  /** Overlay box with role="status" aria-live="polite" and no layout effect: empty until a face shows. */
  render(): TemplateResult;
  /** Set by the card while it renders inside the editor preview: no lost or back face there; stale faces still show. */
  preview: boolean;
  /** Card attached again: re-arms the timers from the last hass and lostAt; shows the lost face only while still
   * disconnected and never shows "Reconnected" again. */
  connected(): void;
  /** Card detached: clears every timer and the shown face; lostAt stays on the host. */
  disconnected(): void;
}

/** What dist/magic-card-status.js exports. */
export interface CardStatusModule extends LazyChunkModule {
  readonly api: { create(host: StatusHost): StatusController };
}
