import type { CardRequestDetail, CardState } from '../components/icon-animator/card-request';

/*
 * The card editor's state manager around `from` (the `mc-card-bridge` event the editor answers,
 * magic-card-editor.ts); undefined outside the Magic Card editor. The same handshake as card-request.ts,
 * written out here because the editor chunk must not import that module statically: the icon animator
 * chunk imports it, and a module shared with a lazy chunk cannot be scope-hoisted (icon-animator-0034-q).
 */
export function cardStateOf(from: EventTarget): CardState | undefined {
  const detail: CardRequestDetail = {};
  from.dispatchEvent(new CustomEvent('mc-card-bridge', { bubbles: true, composed: true, detail }));
  return detail.sm;
}

export type { CardState };
