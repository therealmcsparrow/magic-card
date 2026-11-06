/* RovingFocus: arrow keys, Home and End over a group with one tab stop. */

import { readDirection } from './direction';

export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

const KEYS: Record<RovingOrientation, string[]> = {
  horizontal: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
  vertical: ['ArrowUp', 'ArrowDown', 'Home', 'End'],
  both: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'],
};

/** The index the key moves to, or -1 when the key is not a roving key. Disabled items are skipped; `rtl` swaps ArrowLeft and ArrowRight. */
export function rovingTarget(
  key: string,
  current: number,
  items: readonly { disabled?: boolean }[],
  orientation: RovingOrientation = 'horizontal',
  wrap = true,
  rtl = false,
): number {
  if (!KEYS[orientation].includes(key) || !items.length) return -1;
  const n = items.length;
  const ok = (i: number): boolean => i >= 0 && i < n && !items[i].disabled;
  const step = (from: number, dir: 1 | -1): number => {
    for (let k = 1; k <= n; k++) {
      let i = from + dir * k;
      if (wrap) i = (i + n * 2) % n;
      else if (i < 0 || i >= n) return from;
      if (ok(i)) return i;
    }
    return from;
  };
  if (key === 'Home') return ok(0) ? 0 : step(0, 1);
  if (key === 'End') return ok(n - 1) ? n - 1 : step(n - 1, -1);
  const back = key === 'ArrowUp' || key === (rtl ? 'ArrowRight' : 'ArrowLeft');
  return step(current < 0 ? (back ? 0 : -1) : current, back ? -1 : 1);
}

export interface RovingFocusOptions {
  /** Selector of the items inside the group element. */
  items: string;
  orientation?: RovingOrientation;
  wrap?: boolean;
  /** Called after focus moved; a seg that selects on arrows picks here. */
  onMove?: (el: HTMLElement, index: number) => void;
}

export class RovingFocus {
  constructor(private readonly opts: RovingFocusOptions) {}

  /** Use as `@keydown=${roving.onKeydown}` on the group element. */
  onKeydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const group = e.currentTarget as HTMLElement;
    const els = Array.from(group.querySelectorAll<HTMLElement>(this.opts.items));
    const cur = els.indexOf(e.composedPath().find((n) => els.includes(n as HTMLElement)) as HTMLElement);
    const to = rovingTarget(e.key, cur, els.map((el) => ({ disabled: el.hasAttribute('disabled') })), this.opts.orientation, this.opts.wrap, readDirection(group) === 'rtl');
    if (to < 0) return;
    e.preventDefault();
    e.stopPropagation();
    this.focus(els, to);
    this.opts.onMove?.(els[to], to);
  };

  /** One tab stop: the item at `index` gets tabindex 0, the rest -1. */
  focus(els: HTMLElement[], index: number): void {
    els.forEach((el, i) => el.setAttribute('tabindex', i === index ? '0' : '-1'));
    els[index]?.focus();
  }
}
