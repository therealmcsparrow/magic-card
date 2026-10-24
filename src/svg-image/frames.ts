/*
 * Page-wide scheduling for the heavy steps of drawing a library image: the first sanitise of an item and the first clone of
 * its template into a stage. One such step runs per animation frame, after that frame has painted, so many cards that show
 * one drawing never make one long task. Nothing runs while the queue is empty.
 */

type Job = { run?: () => void; draws?: boolean };

const queue: Job[] = [];
let scheduled = false;
/** A heavy step ran in this task and nothing has used its remaining turn yet. */
let fresh = false;

const nextFrame = (cb: () => void): void => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => setTimeout(cb, 0));
  else setTimeout(cb, 16);
};

function step(): void {
  scheduled = false;
  for (let job = queue.shift(); job; job = queue.shift()) {
    const run = job.run;
    if (!run) continue;
    job.run = undefined;
    try {
      run();
    } catch (e) {
      console.warn('Magic Card: drawing an image failed', e);
    } finally {
      // what the step resolved (promise callbacks) runs before this timer, so it can draw in the same task
      if (!job.draws) {
        fresh = true;
        setTimeout(() => (fresh = false), 0);
      }
      if (queue.length && !scheduled) {
        scheduled = true;
        nextFrame(step);
      }
    }
    return;
  }
}

/** Runs `fn` in its own frame, behind the steps queued before it. Returns a cancel function. */
export function heavyStep(fn: () => void, draws = false): () => void {
  const job: Job = { run: fn, draws };
  queue.push(job);
  if (!scheduled) {
    scheduled = true;
    nextFrame(step);
  }
  return () => {
    job.run = undefined;
  };
}

/**
 * Like heavyStep for the first draw of a drawing into a stage. Directly after a heavy step that made its data (same task)
 * the first one runs at once, so a cold drawing appears without waiting for two more frames; any other waits its turn.
 */
export function drawStep(fn: () => void): () => void {
  if (!fresh) return heavyStep(fn, true);
  fresh = false;
  fn();
  return () => undefined;
}

/** Runs `fn` when the page is idle (a timer where requestIdleCallback is missing). */
export function whenIdle(fn: () => void): void {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout: 2000 });
  else setTimeout(fn, 200);
}

export function __resetFramesForTests(): void {
  queue.length = 0;
  scheduled = false;
  fresh = false;
}
