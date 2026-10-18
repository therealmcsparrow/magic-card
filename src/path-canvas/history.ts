import type { History } from '../contracts/path-canvas';

/*
 * Undo / redo for the editors that host the path canvas (the canvas itself only emits commits). Steps
 * are whole states, so a drag is one step. A push with the same `merge` key as the previous one within
 * MERGE_MS replaces it (typing in a field is one step). The oldest steps fall off past `limit`.
 */

const MERGE_MS = 1000;

export function createHistory<T>(initial: T, limit = 100): History<T> {
  let stack: Array<{ state: T; label: string }> = [{ state: initial, label: '' }];
  let at = 0;
  let lastMerge: string | undefined;
  let lastAt = 0;
  const max = Math.max(1, Math.floor(limit));

  return {
    get canUndo() {
      return at > 0;
    },
    get canRedo() {
      return at < stack.length - 1;
    },
    push(state, label, merge) {
      const now = Date.now();
      const merging = merge !== undefined && merge === lastMerge && now - lastAt <= MERGE_MS && at > 0 && at === stack.length - 1;
      stack = stack.slice(0, at + 1);
      if (merging) stack[at] = { state, label };
      else {
        stack.push({ state, label });
        at++;
      }
      if (stack.length > max + 1) {
        const drop = stack.length - (max + 1);
        stack = stack.slice(drop);
        at -= drop;
      }
      lastMerge = merge;
      lastAt = now;
    },
    undo() {
      if (at <= 0) return undefined;
      lastMerge = undefined;
      at--;
      return stack[at].state;
    },
    redo() {
      if (at >= stack.length - 1) return undefined;
      lastMerge = undefined;
      at++;
      return stack[at].state;
    },
    clear(state) {
      stack = [{ state, label: '' }];
      at = 0;
      lastMerge = undefined;
    },
  };
}
