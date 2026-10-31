import { nothing } from 'lit';
import { directive, ElementPart, PartInfo, PartType } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

/**
 * One IntersectionObserver for every element with a looping animation: off-screen elements get the `offscreen` attribute,
 * which their styles use to pause the animations. An attribute, not a class: module templates own the class.
 */
let io: IntersectionObserver | undefined;
/** Elements told about every report (on screen or not), not only an attribute change. */
const listeners = new WeakMap<Element, (onScreen: boolean) => void>();
/** Observed elements (watchOffscreen and pauseOffscreen), for re-reporting when a card pauses. */
const tracked = new Set<Element>();
/** The last real intersection per element, restored when its card resumes. */
const real = new WeakMap<Element, boolean>();
/** Elements that keep updating while their card is paused (clocks, countdowns). */
const fixed = new WeakSet<Element>();
/** Watched elements that are not a sign of motion on their own (the card backdrop decides itself). */
const uncounted = new WeakSet<Element>();
/** <magic-card> hosts whose viewer pressed "Pause motion" (card-pause contract). */
const paused = new WeakSet<Element>();

/** Is `el` inside a paused card (parent and shadow-host walk)? */
function inPausedCard(el: Element, only?: Element): boolean {
  for (let n: Node | null = el; n; n = n.parentNode instanceof ShadowRoot ? n.parentNode.host : n.parentNode) {
    if (only ? n === only : paused.has(n as Element)) return true;
  }
  return false;
}

function report(el: Element, onScreen: boolean): void {
  const shown = onScreen && (fixed.has(el) || !inPausedCard(el));
  el.toggleAttribute('offscreen', !shown);
  listeners.get(el)?.(shown);
}

export function offscreenObserver(): IntersectionObserver | undefined {
  if (!io && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        real.set(e.target, e.isIntersecting);
        report(e.target, e.isIntersecting);
      }
    });
    // whoever observes through the shared observer is tracked, so a card pause reaches it too
    const [add, drop] = [io.observe.bind(io), io.unobserve.bind(io)];
    io.observe = (el) => {
      tracked.add(el);
      add(el);
    };
    io.unobserve = (el) => {
      tracked.delete(el);
      real.delete(el);
      drop(el);
    };
  }
  return io;
}

function observe(el: Element, pausable = true, counted = true): boolean {
  const obs = offscreenObserver();
  if (!obs) return false;
  if (pausable) fixed.delete(el);
  else fixed.add(el);
  if (counted) uncounted.delete(el);
  else uncounted.add(el);
  obs.observe(el);
  return true;
}

function unobserve(el: Element): void {
  io?.unobserve(el);
  el.removeAttribute('offscreen');
}

/**
 * Watch `el` with the shared observer and call `cb` on each report (the first one included, which
 * the `offscreen` attribute does not show for an element that starts on screen). False without an
 * IntersectionObserver (nothing will report). Inside a paused card the element counts as off screen
 * unless `pausable` is false (content that updates but does not move).
 */
export function watchOffscreen(el: Element, cb: (onScreen: boolean) => void, opts?: { pausable?: boolean; counted?: boolean }): boolean {
  listeners.set(el, cb);
  return observe(el, opts?.pausable !== false, opts?.counted !== false);
}

export function unwatchOffscreen(el: Element): void {
  listeners.delete(el);
  unobserve(el);
}

/** Mark a <magic-card> host paused / playing and re-report the observed elements inside it. */
export function setCardPaused(host: Element, on: boolean): void {
  if (paused.has(host) === on) return;
  if (on) paused.add(host);
  else paused.delete(host);
  for (const el of tracked) {
    if (fixed.has(el) || !inPausedCard(el, host)) continue;
    // resumed before the first report: the observer reports soon
    if (on) report(el, false);
    else if (real.has(el)) report(el, real.get(el)!);
  }
}

export const isCardPaused = (host: Element): boolean => paused.has(host);

/** Pausable observed elements inside `host` (the card has motion). */
export function motionCount(host: Element): number {
  let n = 0;
  for (const el of tracked) if (!fixed.has(el) && !uncounted.has(el) && inPausedCard(el, host)) n++;
  return n;
}

export function __resetOffscreenObserverForTests(): void {
  io?.disconnect();
  io = undefined;
  tracked.clear();
}

/** Watched inside a paused card: off screen from the commit on, not from the observer's first report a frame or two later. */
function holdPaused(el: Element): void {
  queueMicrotask(() => inPausedCard(el) && report(el, false));
}

/** `<svg ${pauseOffscreen()}>`: watched by the shared observer while it is in the DOM. */
class PauseOffscreen extends AsyncDirective {
  private _el?: Element;
  private _counted = true;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('pauseOffscreen() is an element directive');
  }

  /** `counted: false` pauses with the card but is no sign of motion on its own (a still track). */
  render(_opts?: { counted?: boolean }): typeof nothing {
    return nothing;
  }

  update(part: ElementPart, [opts]: [{ counted?: boolean }?]): typeof nothing {
    const counted = opts?.counted !== false;
    if (part.element !== this._el) {
      this._unwatch();
      this._el = part.element;
      this._counted = counted;
      if (this.isConnected && observe(this._el, true, counted)) holdPaused(this._el);
    } else if (counted !== this._counted) {
      this._counted = counted;
      if (this.isConnected) observe(this._el, true, counted);
    }
    return nothing;
  }

  private _unwatch(): void {
    if (this._el) unobserve(this._el);
  }

  protected disconnected(): void {
    this._unwatch();
  }

  protected reconnected(): void {
    if (this._el) observe(this._el, true, this._counted);
  }
}

export const pauseOffscreen = directive(PauseOffscreen);
