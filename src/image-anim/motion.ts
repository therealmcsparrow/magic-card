import { PAUSE_WANT_ATTRIBUTE } from '../contracts/card-pause.needs';

// What the viewer allows: live reduced motion, whether the pointer can hover, and the card's pause button.

const REDUCE = '(prefers-reduced-motion: reduce)';
const HOVER = '(hover: hover)';

const query = (q: string): MediaQueryList | undefined => (typeof matchMedia === 'function' ? matchMedia(q) : undefined);

/** True where a pointer can hover; touch screens never start a hover clip. */
export const canHover = (): boolean => query(HOVER)?.matches === true;

export interface MotionWatch {
  /** The viewer asks for less motion right now. */
  reduced(): boolean;
  /** Removes the media listener. */
  stop(): void;
}

/** Reads prefers-reduced-motion live: `onChange` runs with the new value each time the setting flips. */
export function watchMotion(onChange: (reduced: boolean) => void): MotionWatch {
  const mql = query(REDUCE);
  const listener = (): void => onChange(mql?.matches === true);
  if (mql?.addEventListener) mql.addEventListener('change', listener);
  else mql?.addListener?.(listener);
  return {
    reduced: () => mql?.matches === true,
    stop() {
      if (mql?.removeEventListener) mql.removeEventListener('change', listener);
      else mql?.removeListener?.(listener);
    },
  };
}

const wanting = new WeakMap<Element, number>();

/**
 * Asks the card for its pause button (card-pause 2.1.0) while this module has motion: the attribute is set on the card
 * and stays until the last asker lets go. Returns the release, which does nothing the second time.
 */
export function askForPause(card: Element): () => void {
  const host = card as Element & { requestUpdate?: () => void };
  wanting.set(card, (wanting.get(card) ?? 0) + 1);
  if (!card.hasAttribute(PAUSE_WANT_ATTRIBUTE)) {
    card.setAttribute(PAUSE_WANT_ATTRIBUTE, '');
    host.requestUpdate?.();
  }
  let open = true;
  return () => {
    if (!open) return;
    open = false;
    const left = (wanting.get(card) ?? 1) - 1;
    if (left > 0) {
      wanting.set(card, left);
      return;
    }
    wanting.delete(card);
    card.removeAttribute(PAUSE_WANT_ATTRIBUTE);
    host.requestUpdate?.();
  };
}
