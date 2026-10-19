/*
 * Live updates (slider-look 1.0.0 rule 3, `live: true`): while a drag runs, the value goes to the
 * entity at most once per LIVE_MS (leading call at once, then the newest value each 250 ms). The drag
 * ending is renderTrack's onCommit, which always sends the final value; end() drops whatever is
 * still queued so nothing follows it. The only timer is the throttle, started by input and cleared by
 * end() / stop() (release, cancel, disconnect).
 */

/** Gap between two live calls (ms): at most 4 a second. */
export const LIVE_MS = 250;

export interface Live {
  /** A drag move with the snapped value. */
  input(value: number): void;
  /** The drag ended: clear the timer and the queued value. */
  end(): void;
  /** The slider is gone: same as end(). */
  stop(): void;
}

export function createLive(send: (value: number) => void, ms = LIVE_MS): Live {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let queued: number | undefined;
  let last: number | undefined;

  const go = (v: number) => {
    last = v;
    send(v);
    timer = setTimeout(() => {
      timer = undefined;
      const q = queued;
      queued = undefined;
      if (q !== undefined && q !== last) go(q);
    }, ms);
  };
  const end = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    queued = undefined;
    last = undefined;
  };
  return {
    input(v) {
      if (timer) queued = v;
      else if (v !== last) go(v);
    },
    end,
    stop: end,
  };
}
