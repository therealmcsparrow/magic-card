/**
 * The studio canvas shows the state a tabs module's design panel is editing (Hover, Active tab,
 * Disabled tab) on one of its tabs: the panel announces its view here, the canvas applies it to the
 * preview card. The card itself is not changed: a tab gets a studio-only attribute that is removed
 * again with the state.
 */
export type TabPreviewState = 'hover' | 'active' | 'disabled';

let view = 'default';
const listeners = new Set<(view: string) => void>();

/** The state an "Editing design for" value stands for, or null for Default and a rule's own design. */
export function stateOfView(v: string): TabPreviewState | null {
  if (v === '__hover__') return 'hover';
  if (v === '__tab_active__' || v.endsWith('::tab_active')) return 'active';
  if (v === '__tab_disabled__' || v.endsWith('::tab_disabled')) return 'disabled';
  return null;
}

export const getStatePreview = (): string => view;

export function setStatePreview(next: string): void {
  if (next === view) return;
  view = next;
  for (const fn of [...listeners]) fn(next);
}

export function onStatePreview(fn: (view: string) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const MARK = 'data-mc-force';

/**
 * Applies `state` to the tabs module inside `root` (its canvas wrapper): Hover and Disabled are marked on the first
 * tab that is not active or disabled. Earlier marks
 * go first. Returns the state that is showing, for the chip.
 */
export function applyTabState(root: ParentNode, state: TabPreviewState | null): TabPreviewState | null {
  const buttons = [...(root.querySelector('.mc-tabs > .mc-tabs-header')?.querySelectorAll<HTMLElement>(':scope > .mc-tab-button') ?? [])];
  for (const b of buttons) {
    b.removeAttribute(MARK);
  }
  if (!state) return null;
  const free = buttons.find((b) => !b.classList.contains('active') && b.getAttribute('aria-disabled') !== 'true');
  // a tab that is disabled already shows the state itself
  const shown = state === 'disabled' && buttons.some((b) => b.getAttribute('aria-disabled') === 'true' && !b.classList.contains('active'));
  if (state !== 'active' && !shown) free?.setAttribute(MARK, state);
  return state;
}
