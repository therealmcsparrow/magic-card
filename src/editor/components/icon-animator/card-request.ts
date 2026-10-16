import type { CardModule, MagicCardConfig } from '../../../types';

/*
 * The Design tab edits one module; the icon picker's Animated icons tab and the follow-icon edits
 * (lazy chunk) also read the selected module and write the card's `custom_animations`. Its composed `mc-card-bridge` event reaches the
 * card editor (magic-card-editor.ts), whose listener hands over its state manager synchronously.
 * The editor side is that one listener: nothing else of this lives in magic-card.js.
 */

export const CARD_REQUEST_EVENT = 'mc-card-bridge';

/** What the animator uses of the editor's state manager (editor-state.ts). */
export interface CardState {
  getConfig(): MagicCardConfig;
  updateConfig(config: MagicCardConfig, recordUndo?: boolean): void;
  getSelectedModule(): CardModule | null;
  getState(): { selectedPath?: unknown; templateAnimations?: Array<Record<string, unknown>> };
  /** False while the card editor is detached (HA's dialog closed or on another tab). */
  attached?: boolean;
}

export interface CardRequestDetail {
  /** Set by the card editor. */
  sm?: CardState;
}

/** The card editor's state around `from`; undefined outside the Magic Card editor. */
export function cardState(from: EventTarget): CardState | undefined {
  const detail: CardRequestDetail = {};
  from.dispatchEvent(
    new CustomEvent(CARD_REQUEST_EVENT, { bubbles: true, composed: true, detail }),
  );
  return detail.sm;
}

/**
 * A card-level change. `fold`: into the previous undo step (it follows the module edit of the same
 * action, which recorded the step). Returns false outside the card editor.
 */
export function patchCard(
  from: EventTarget,
  patch: (config: MagicCardConfig) => MagicCardConfig,
  fold: boolean,
): boolean {
  const sm = cardState(from);
  if (!sm) return false;
  sm.updateConfig(patch(sm.getConfig()), !fold);
  return true;
}
