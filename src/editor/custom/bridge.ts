import type { CardRequestDetail, CardState } from '../components/icon-animator/card-request';

// The card editor's state manager around `from` (the `mc-card-bridge` event); undefined outside the Magic Card editor.
// Written out here so the editor chunk does not import card-request.ts statically.
export function cardStateOf(from: EventTarget): CardState | undefined {
  const detail: CardRequestDetail = {};
  from.dispatchEvent(new CustomEvent('mc-card-bridge', { bubbles: true, composed: true, detail }));
  return detail.sm;
}

export type { CardState };
