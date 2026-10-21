/*
 * Contract: Magic Card Utils shared templates, read side for cards. Version 1.0.0.
 * Python side of record: magic-card-utils custom_components/magic_card_utils/templates_contract.py
 * (same version; this file mirrors it).
 *
 * Two parts:
 * 1. WebSocket commands (MCU websocket.py).
 *    Admin only, unchanged (editor template picker, studio canvas, MCU panel):
 *      magic_card_utils/get_templates       {}  -> { templates: { [name]: StoredTemplate & { linked_cards } } }
 *      magic_card_utils/subscribe_templates {}  -> events { templates } (full state at once, then on change)
 *      magic_card_utils/save_template       { name, template, card_type?, old_name? } -> { success: true }
 *      magic_card_utils/delete_template     { name } -> { success: true }
 *    Any authenticated user (1.0.0):
 *      magic_card_utils/template_get        { name } -> { template: TemplateContent | null }
 *      magic_card_utils/subscribe_template  { name } -> events TemplateEvent (subscribeMessage); the first
 *                                            event comes at once with the current state ('saved', or
 *                                            'deleted' when the name doesn't exist), then one per change.
 *    TemplateContent carries config, card_type?, last_updated? only: never linked_cards or anything
 *    from the dashboard scan. Rename sends 'deleted' for the old name and 'saved' for the new one.
 *    Errors: invalid_format, not_loaded, unauthorized (admin commands), unknown_command (MCU before 1.0.0).
 *
 * 2. The card's template source (Magic Card Module `template-source`, src/services/template-source.ts,
 *    in magic-card.js). The card element (Core) talks to it only through TemplateSource below.
 *    - One page-wide instance. Per HA connection and template name: one subscribe_template, shared by
 *      every card that watches that name (reference counted; the last unwatch unsubscribes).
 *    - Subscribes with resubscribe:false: the library doesn't re-send after a reconnect. On the
 *      connection's 'ready' event this module forgets each old subscription (the old socket's ids are
 *      invalid, so no unsubscribe is sent) and any subscribe still in flight, and subscribes again, so
 *      it sees a failed re-subscribe (for example MCU not loaded yet) and retries; the first event of
 *      the new subscription carries the current state again.
 *    - unknown_command on subscribe_template: legacy mode for that connection. One get_templates for
 *      the whole page (one shared promise), every name read from it; no live updates (as before).
 *      Legacy mode ends on the next 'ready' or when a slow re-probe of subscribe_template succeeds
 *      (after 5 s, doubling to at most 30 s; stops on success or the last unwatch), so a still-loading
 *      MCU settles without a reload. An old MCU costs one unknown_command per probe step.
 *      unauthorized from that call (non-admin on an old MCU) -> status 'unavailable' for every name.
 *    - Any other failure (not_loaded, dropped socket): status 'unavailable'; retried once on the
 *      connection's next 'ready' event and after TEMPLATE_RETRY_MS while it stays up.
 *    - Never calls register_card_instance / unregister_card_instance and never subscribes to the
 *      bus event magic_card_utils_template_updated (they don't exist).
 *    - At most one console.warn per page per failure kind; 'missing' is not warned (the notice says it).
 *
 * Card behaviour: status 'loading' renders the card's local config, as today.
 * 'ready' renders mergeTemplateWithOverrides(config, localConfig). 'missing' and 'unavailable'
 * render the local config plus one notice line (TEMPLATE_NOTICE), in the card namespace of i18n,
 * British ids, inside an element with role="status" so screen readers announce it once. Nothing throws.
 */

/** Same as MCU_TEMPLATES_CONTRACT_VERSION. */
export const MCU_TEMPLATES_CONTRACT_VERSION = '1.0.0';

export const TEMPLATE_CMD = {
  /** Admin only; legacy fallback for an MCU before 1.0.0. */
  getTemplates: 'magic_card_utils/get_templates',
  templateGet: 'magic_card_utils/template_get',
  subscribeTemplate: 'magic_card_utils/subscribe_template',
} as const;

export const TEMPLATE_NAME_MAX_CHARS = 255;
/** Retry after a failure that may pass (not unknown_command, not unauthorized). */
export const TEMPLATE_RETRY_MS = 15_000;
/** Re-probe of subscribe_template after unknown_command: 5 s, doubling, at most 30 s; stops on success or the last unwatch. */
export const TEMPLATE_PROBE_MIN_MS = 5_000;
export const TEMPLATE_PROBE_MAX_MS = 30_000;

export interface TemplateContent {
  config: Record<string, unknown>;
  card_type?: string;
  last_updated?: string;
}

export type TemplateEvent =
  | { action: 'saved'; name: string; template: TemplateContent }
  | { action: 'deleted'; name: string };

export type TemplateStatus = 'loading' | 'ready' | 'missing' | 'unavailable';

export interface TemplateState {
  status: TemplateStatus;
  /** Present only when status is 'ready'. */
  config?: Record<string, unknown>;
}

/** Narrow hass shape the source needs (the same members AnimationLibrary uses). */
export interface TemplateHass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  connection?: {
    subscribeMessage<T>(callback: (msg: T) => void, msg: Record<string, unknown>, options?: { resubscribe?: boolean }): Promise<() => void>;
    addEventListener?(event: string, cb: () => void): void;
    removeEventListener?(event: string, cb: () => void): void;
  };
}

export interface TemplateSource {
  /**
   * Start (or join) watching `name`. `onChange` runs with the current state at once when one is
   * known, then on every change. Returns the unwatch; calling it twice is harmless.
   */
  watch(hass: TemplateHass, name: string, onChange: (state: TemplateState) => void): () => void;
  /** Tests: drop every subscription, cache and listener. */
  reset(): void;
}

/** Notice ids (British text is the id). {name} is the template name. */
export const TEMPLATE_NOTICE = {
  missing: 'Template "{name}" wasn\'t found. Showing this card\'s own settings.',
  unavailable: 'Template "{name}" couldn\'t be loaded. Showing this card\'s own settings.',
} as const;
