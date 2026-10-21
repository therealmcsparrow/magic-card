/** Something re-measured when its observed element resizes (rings, shapes, value backgrounds, seasonal decorations). */
export interface SizeWatcher {
  measure(): void;
}

/**
 * An element's border box size, sub-pixel (offsetWidth / offsetHeight are rounded) unless a
 * transform scales it (then its layout size).
 */
export function borderBoxSize(el: HTMLElement): { w: number; h: number } {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const r = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : undefined;
  if (r && Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return { w: r.width, h: r.height };
  return { w, h };
}

/** Watchers per observed parent, for the one ResizeObserver they all share. */
const watchers = new Map<Element, Set<SizeWatcher>>();
let shared: ResizeObserver | undefined;

/** The ResizeObserver every watched parent is observed by (created on first use; none without the API). */
export function ringResizeObserver(): ResizeObserver | undefined {
  if (!shared && typeof ResizeObserver === 'function') {
    shared = new ResizeObserver((entries) => {
      for (const e of entries) watchers.get(e.target)?.forEach((r) => r.measure());
    });
  }
  return shared;
}

/** Re-measure `ring` whenever `parent` resizes (the shared ResizeObserver). */
export function watchSize(parent: Element, ring: SizeWatcher): void {
  let set = watchers.get(parent);
  if (!set) {
    set = new Set();
    watchers.set(parent, set);
    ringResizeObserver()?.observe(parent);
  }
  set.add(ring);
}

export function unwatchSize(parent: Element, ring: SizeWatcher): void {
  const set = watchers.get(parent);
  if (!set) return;
  set.delete(ring);
  if (set.size) return;
  watchers.delete(parent);
  shared?.unobserve(parent);
}
