// Contract: Magic Card Utils shared templates, read side for cards. Version 1.0.0. Python side of record:
// magic-card-utils custom_components/magic_card_utils/templates_contract.py (same version; this file mirrors it).
// Two parts: 1. WebSocket commands (MCU websocket.py).

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
