// Copy feedback state machine: idle, copied, blocked, with tickets for the latest click and one reset path.
// Version 1.0.0 of the clipboard-port Contract (src/contracts/clipboard-port.ts).

import {
  TOUCH_RESET_MS,
  type CopyFeedback,
  type CopyFeedbackState,
  type CopyFeedbackTimers,
  type CopyOutcome,
  type CopyResetCause,
} from '../../contracts/clipboard-port';

/** Builds one feedback machine; all state lives in the instance. */
export function createCopyFeedback(timers: CopyFeedbackTimers): CopyFeedback {
  let state: CopyFeedbackState = 'idle';
  let latest = 0;
  let disposed = false;
  let timer: { handle: unknown } | null = null;
  let subscribers: Array<(s: CopyFeedbackState) => void> = [];

  const cancelTimer = (): void => {
    if (!timer) return;
    const t = timer;
    timer = null;
    timers.clearTimeout(t.handle);
  };

  const set = (next: CopyFeedbackState): void => {
    if (next === state) return;
    state = next;
    for (const cb of [...subscribers]) cb(state);
  };

  const reset = (_cause: CopyResetCause): void => {
    if (disposed || state !== 'copied') return;
    cancelTimer();
    set('idle');
  };

  return {
    get state(): CopyFeedbackState {
      return state;
    },
    click(): number {
      if (!disposed) reset('next-click');
      return ++latest;
    },
    settle(ticket: number, outcome: CopyOutcome, coarse: boolean): void {
      if (disposed || ticket !== latest) return;
      cancelTimer();
      if (outcome === 'blocked') {
        set('blocked');
        return;
      }
      set('copied');
      if (coarse) {
        const t: { handle: unknown } = { handle: null };
        t.handle = timers.setTimeout(() => {
          if (timer === t) reset('touch-timeout');
        }, TOUCH_RESET_MS);
        timer = t;
      }
    },
    reset,
    subscribe(cb: (s: CopyFeedbackState) => void): () => void {
      subscribers.push(cb);
      return () => {
        subscribers = subscribers.filter((s) => s !== cb);
      };
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      cancelTimer();
      subscribers = [];
    },
  };
}
