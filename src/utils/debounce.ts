// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pending: (() => void) | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounced = function (this: any, ...args: any[]) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    pending = () => fn.apply(this, args);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      const run = pending;
      pending = null;
      run?.();
    }, delay);
  } as T & { cancel: () => void; flush: () => void };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    pending = null;
  };

  /** Run a pending call now (no-op when nothing is pending). */
  debounced.flush = () => {
    const run = pending;
    debounced.cancel();
    run?.();
  };

  return debounced;
}
