/* Viewport placement shared by the menu and the popover element. */

export const PLACE_EDGE = 8;
const GAP = 4;

type Box = { left: number; right: number; top: number; bottom: number };

/** Put `el` (position: fixed) under `r`, flipped above when there is no room, clamped into the viewport. */
export function placeAtRect(el: HTMLElement, r: Box, align: 'start' | 'end' = 'start'): 'top' | 'bottom' {
  const vw = window.innerWidth || document.documentElement.clientWidth || 0;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  el.style.maxHeight = '';
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const below = vh - r.bottom - GAP - PLACE_EDGE;
  const above = r.top - GAP - PLACE_EDGE;
  const up = vh > 0 && h > below && above > below;
  const room = up ? above : below;
  if (vh > 0 && h > room) el.style.maxHeight = `${Math.max(120, room)}px`;
  const height = Math.min(h, vh > 0 ? Math.max(120, room) : h);
  const top = up ? Math.max(PLACE_EDGE, r.top - GAP - height) : r.bottom + GAP;
  let left = align === 'end' ? r.right - w : r.left;
  if (vw > 0) left = Math.min(left, vw - w - PLACE_EDGE);
  left = Math.max(PLACE_EDGE, left);
  Object.assign(el.style, { top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, right: 'auto', bottom: 'auto' });
  el.dataset.placement = up ? 'top' : 'bottom';
  return up ? 'top' : 'bottom';
}

/** Put `el` at viewport point `p`, flipped and clamped; `gap` keeps it off a touch point. */
export function placeAtPoint(el: HTMLElement, p: [number, number], gap = 0): [number, number] {
  const r = el.getBoundingClientRect();
  const fit = (v0: number, size: number, max: number): number => {
    let v = v0 + gap;
    if (v + size > max - PLACE_EDGE) v = v0 - gap - size;
    return Math.max(PLACE_EDGE, Math.min(v, max - PLACE_EDGE - size));
  };
  const out: [number, number] = [fit(p[0], r.width, window.innerWidth), fit(p[1], r.height, window.innerHeight)];
  Object.assign(el.style, { left: `${out[0]}px`, top: `${out[1]}px`, right: 'auto', bottom: 'auto' });
  return out;
}

export function supportsTopLayer(): boolean {
  return typeof HTMLElement !== 'undefined' && typeof (HTMLElement.prototype as { showPopover?: unknown }).showPopover === 'function';
}

/** showPopover() when the Popover API exists and the element is not already open. */
export function showTop(el: HTMLElement): void {
  if (!supportsTopLayer()) return;
  try {
    if (!el.matches(':popover-open')) el.showPopover();
  } catch {
    /* in-flow fallback: the element is position: fixed already */
  }
}
