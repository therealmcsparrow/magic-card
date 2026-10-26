import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** Width of the classic scrollbar a scroller shows on its inline sides: offsetWidth - clientWidth, minus its inline borders. */
export function scrollbarWidth(el: HTMLElement): number {
  let borders: number;
  try {
    const cs = getComputedStyle(el);
    borders = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);
  } catch {
    borders = 0;
  }
  return Math.max(0, Math.round(el.offsetWidth - el.clientWidth - borders));
}

/**
 * Keeps the measured scrollbar width of one scroller (the one that touches a lip's edge). The host calls
 * watch() after each render with the scroller and its grid container; a ResizeObserver re-measures when the
 * bar appears or goes. Overlay scrollbars measure 0. The observer is disconnected with the host.
 */
export class ScrollbarWatch implements ReactiveController {
  width = 0;
  private observer?: ResizeObserver;
  private watched: HTMLElement[] = [];

  constructor(private readonly host: ReactiveControllerHost, private readonly onChange?: (width: number) => void) {
    host.addController(this);
  }

  hostDisconnected(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.watched = [];
  }

  watch(scroller: HTMLElement | null, ...also: Array<HTMLElement | null>): void {
    const els = [scroller, ...also].filter((e): e is HTMLElement => !!e);
    if (els.length !== this.watched.length || els.some((e, i) => e !== this.watched[i])) {
      this.observer?.disconnect();
      this.watched = els;
      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(() => this.measure(scroller));
        for (const e of els) this.observer.observe(e);
      }
    }
    this.measure(scroller);
  }

  private measure(scroller: HTMLElement | null): void {
    const w = scroller ? scrollbarWidth(scroller) : 0;
    if (w === this.width) return;
    this.width = w;
    this.onChange?.(w);
    this.host.requestUpdate();
  }
}
