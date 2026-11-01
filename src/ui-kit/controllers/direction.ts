import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { DIR_CHANGE_EVENT, type KitDirection } from '../../contracts/ui-kit';

type DirectionHost = ReactiveControllerHost & HTMLElement;

/** The direction an element sits in: the nearest `dir` attribute up the tree (through shadow roots), else the computed direction. */
export function readDirection(el: Element | null): KitDirection {
  let node: Element | null = el;
  while (node) {
    const d = node.getAttribute('dir')?.toLowerCase();
    if (d === 'rtl' || d === 'ltr') return d;
    const parent: Element | null = node.parentElement;
    node = parent ?? ((node.getRootNode() as ShadowRoot).host ?? null);
  }
  try {
    return getComputedStyle(document.documentElement).direction === 'rtl' ? 'rtl' : 'ltr';
  } catch {
    return 'ltr';
  }
}

/**
 * Reflects the direction the host sits in as `dir="rtl"` on the host, so the rtl sheet can select on it. Under ltr the
 * attribute it set is removed again. A `dir` the host author set is left alone. It re-reads when DIR_CHANGE_EVENT
 * arrives on window and when `dir` changes on document.documentElement; both listeners go with the host.
 */
export class DirectionController implements ReactiveController {
  direction: KitDirection = 'ltr';
  private reflected = false;
  private observer?: MutationObserver;

  constructor(private readonly host: DirectionHost) {
    host.addController(this);
  }

  hostConnected(): void {
    window.addEventListener(DIR_CHANGE_EVENT, this.sync);
    if (typeof MutationObserver === 'function') {
      this.observer = new MutationObserver(this.sync);
      this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    }
    this.sync();
  }

  hostDisconnected(): void {
    window.removeEventListener(DIR_CHANGE_EVENT, this.sync);
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.reflected) {
      this.host.removeAttribute('dir');
      this.reflected = false;
    }
  }

  readonly sync = (): void => {
    const host = this.host;
    if (!this.reflected && host.hasAttribute('dir')) {
      this.set(readDirection(host));
      return;
    }
    if (this.reflected) host.removeAttribute('dir');
    const next = readDirection(host);
    this.reflected = false;
    if (next === 'rtl') {
      host.setAttribute('dir', 'rtl');
      this.reflected = true;
    }
    this.set(next);
  };

  private set(next: KitDirection): void {
    if (next === this.direction) return;
    this.direction = next;
    this.host.requestUpdate();
  }
}
