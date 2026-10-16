import { nothing } from 'lit';
import { directive, ElementPart, PartInfo, PartType } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

/**
 * One IntersectionObserver for every element with a looping animation (icon effects, animated
 * weather icons): off-screen elements get the `offscreen` attribute, which their styles use to pause
 * the animations. Clipping by a scrolling ancestor counts too (a forecast item scrolled out of its
 * row). An attribute, not a class: module templates own the class.
 */
let io: IntersectionObserver | undefined;
/** Elements told about every report (on screen or not), not only an attribute change. */
const listeners = new WeakMap<Element, (onScreen: boolean) => void>();
export function offscreenObserver(): IntersectionObserver | undefined {
  if (!io && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        e.target.toggleAttribute('offscreen', !e.isIntersecting);
        listeners.get(e.target)?.(e.isIntersecting);
      }
    });
  }
  return io;
}

/**
 * Watch `el` with the shared observer and call `cb` on each report (the first one included, which
 * the `offscreen` attribute does not show for an element that starts on screen). False without an
 * IntersectionObserver (nothing will report).
 */
export function watchOffscreen(el: Element, cb: (onScreen: boolean) => void): boolean {
  const obs = offscreenObserver();
  if (!obs) return false;
  listeners.set(el, cb);
  obs.observe(el);
  return true;
}

export function unwatchOffscreen(el: Element): void {
  listeners.delete(el);
  io?.unobserve(el);
  el.removeAttribute('offscreen');
}

export function __resetOffscreenObserverForTests(): void {
  io?.disconnect();
  io = undefined;
}

/** `<svg ${pauseOffscreen()}>`: watched by the shared observer while it is in the DOM. */
class PauseOffscreen extends AsyncDirective {
  private _el?: Element;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('pauseOffscreen() is an element directive');
  }

  render(): typeof nothing {
    return nothing;
  }

  update(part: ElementPart): typeof nothing {
    if (part.element !== this._el) {
      this._unwatch();
      this._el = part.element;
      if (this.isConnected) offscreenObserver()?.observe(this._el);
    }
    return nothing;
  }

  private _unwatch(): void {
    if (!this._el) return;
    io?.unobserve(this._el);
    this._el.removeAttribute('offscreen');
  }

  protected disconnected(): void {
    this._unwatch();
  }

  protected reconnected(): void {
    if (this._el) offscreenObserver()?.observe(this._el);
  }
}

export const pauseOffscreen = directive(PauseOffscreen);
