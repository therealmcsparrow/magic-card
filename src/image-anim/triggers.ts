import type { ClipWhen } from '../anim-studio/model-v2-core';
import type { HomeAssistant } from '../types';
import { entityNumber, isUnavailable, simplyActive } from '../anim-runtime/entity';
import type { ClipPlay } from '../contracts/image-animation';

// Where hover and tap clips listen, how a state clip reads its entity, and which card a drawing sits in.

const TAP_MOVE_PX = 10;
const TAP_HOLD_MS = 500;

type Layer = HTMLElement & { layer?: unknown };

/** The element outside `el`'s shadow root, or undefined at the top of the document. */
const outer = (el: Element): HTMLElement | undefined => {
  const root = el.getRootNode();
  return root instanceof ShadowRoot ? (root.host as HTMLElement) : undefined;
};

/** The nearest `<magic-card>` above `host`, through shadow roots. */
export function cardOf(host: Element): HTMLElement | undefined {
  for (let n: Element | null | undefined = host; n; n = n.parentElement ?? outer(n)) if (n.localName === 'magic-card') return n as HTMLElement;
  return undefined;
}

/** A layer listens on the card or module that holds the stack; an image listens on the module wrapper around it. */
export function triggerHost(host: Layer): HTMLElement {
  if (host.layer) {
    const stack = outer(host);
    return (stack && outer(stack)) || stack || host;
  }
  return host.parentElement ?? host;
}

/** Does the clip's condition hold for the entity? No entity, a missing hass or an unavailable state never match. */
export function stateMatches(play: Extract<ClipPlay, { on: 'state' }>, hass: HomeAssistant | undefined): boolean {
  const s = hass?.states?.[play.entity];
  if (!s || isUnavailable(s)) return false;
  const when: ClipWhen = play.when;
  if ('state' in when) return s.state === when.state;
  if ('state_not' in when) return s.state !== when.state_not;
  if ('entity_on' in when) return simplyActive(s) === when.entity_on;
  const n = entityNumber(s, play.attribute);
  if (n === undefined) return false;
  return 'above' in when ? n > when.above : n < when.below;
}

export interface TriggerHandlers {
  hover(on: boolean): void;
  /** `done` is true when the press ended as a tap (released in place), false when it was cancelled. */
  tap(on: boolean, done?: boolean): void;
}

/**
 * Passive pointer listeners on `target`: hover while the pointer is over it, tap from pointerdown until release. A
 * press that moves over 10 px or lasts over 500 ms is not a tap. Nothing is cancelled or stopped, so the card's own
 * actions run as before. Returns the removal.
 */
export function bindTriggers(target: HTMLElement, on: TriggerHandlers, wants: { hover: boolean; tap: boolean }): () => void {
  const opts = { passive: true } as const;
  const off: Array<() => void> = [];
  const listen = (type: string, fn: (e: PointerEvent) => void): void => {
    target.addEventListener(type, fn as EventListener, opts);
    off.push(() => target.removeEventListener(type, fn as EventListener));
  };
  if (wants.hover) {
    listen('pointerenter', (e) => e.pointerType !== 'touch' && on.hover(true));
    listen('pointerleave', () => on.hover(false));
  }
  if (wants.tap) {
    let down: { x: number; y: number } | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const end = (done: boolean): void => {
      clearTimeout(timer);
      if (!down) return;
      down = undefined;
      on.tap(false, done);
    };
    listen('pointerdown', (e) => {
      end(false);
      down = { x: e.clientX, y: e.clientY };
      timer = setTimeout(() => end(false), TAP_HOLD_MS);
      on.tap(true);
    });
    listen('pointermove', (e) => down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_MOVE_PX && end(false));
    listen('pointerup', () => end(true));
    listen('pointercancel', () => end(false));
    off.push(() => clearTimeout(timer));
  }
  return () => off.splice(0).forEach((f) => f());
}
