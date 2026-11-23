// Contract: clipboard port. Version 1.0.0 (CLIPBOARD_PORT_CONTRACT). How the card editor writes text to the clipboard and how
// the Copy my setup button shows the result. Provider: src/editor/setup-copy/clipboard.ts and copy-state.ts.

export const CLIPBOARD_PORT_CONTRACT = '1.0.0';

export type CopyOutcome = 'copied' | 'blocked';

export interface ClipboardPort {
  /**
   * Called in the click handler's own task, with nothing awaited before it, so the user activation still holds (Safari).
   * Resolves blocked when navigator.clipboard.writeText is missing, window.isSecureContext is false, or the write rejects;
   * never rejects or throws. It never moves focus and never touches the selection or the DOM (no execCommand copy).
   */
  writeText(text: string): Promise<CopyOutcome>;
}

/** idle: the button label. copied: the Copied label. blocked: the fallback textarea and its reason line show. */
export type CopyFeedbackState = 'idle' | 'copied' | 'blocked';

/** What ends the Copied state. Each goes through the one reset, which also cancels the touch timer. */
export const COPY_RESET_CAUSES = ['blur', 'escape', 'next-click', 'outside-pointerdown', 'touch-timeout'] as const;
export type CopyResetCause = (typeof COPY_RESET_CAUSES)[number];

/** How long Copied stays on a coarse pointer, where blur may never come. A fine pointer has no timer. */
export const TOUCH_RESET_MS = 10_000;

export interface CopyFeedbackTimers {
  setTimeout(cb: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

export interface CopyFeedback {
  readonly state: CopyFeedbackState;
  /**
   * A click starts here, before the block is built. In copied it first resets (next-click). Returns a ticket for settle; a
   * newer click makes every older ticket stale.
   */
  click(): number;
  /**
   * The port's outcome for a ticket; a stale ticket does nothing. copied: state copied and, when coarse, one TOUCH_RESET_MS
   * timer. blocked: state blocked and every subscriber is told, also on a repeat; the fallback stays until a later click copies.
   */
  settle(ticket: number, outcome: CopyOutcome, coarse: boolean): void;
  /**
   * Acts only in copied: clears the timer and returns to idle without an announcement. In idle and blocked it does nothing, so
   * blur or Escape never hides the fallback. The element handles Escape (and stops its propagation) only while copied.
   */
  reset(cause: CopyResetCause): void;
  /** Called on every state change and on every blocked settle. Returns the unsubscribe. */
  subscribe(cb: (state: CopyFeedbackState) => void): () => void;
  /** The element left the page: clears the timer and the subscribers. */
  dispose(): void;
}

export type CreateCopyFeedback = (timers: CopyFeedbackTimers) => CopyFeedback;
