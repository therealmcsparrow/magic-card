import type { PopupConfig } from '../types';
import { isPopupEnabled } from '../utils/popup';

/** How the URL changed: a new history entry, a replaced one, or back / forward. */
export type LocationChange = 'push' | 'replace' | 'pop';

export type EditorPlace = 'canvas' | 'card-editor' | 'dashboard-edit';

/** One Magic Card that can show a pop-up (src/card/popup-controller.ts). */
export interface PopupHandle {
  /** The card is set to show as a pop-up. */
  isPopup(): boolean;
  /** Its valid pop-up ID while it is a pop-up, else undefined. */
  popupId(): string | undefined;
  /**
   * Where an editor shows it: the studio canvas, HA's card editor preview, a dashboard in edit
   * mode; undefined on a live dashboard.
   */
  editorPlace(): EditorPlace | undefined;
  /** Close because another pop-up opens. */
  closeForOther(): void;
  /** Close (a "Close pop-up" action). */
  closeByAction(): void;
  /** Open the real pop-up from the editor ("Preview pop-up"). */
  openPreview(): void;
  locationChanged(change: LocationChange): void;
}

/**
 * Pop-up mode on a live dashboard: the card itself is not in the flow. It follows the config and the place alone, so it
 * holds before the pop-up code has loaded as well as after.
 */
export const popupHidden = (popup: PopupConfig | undefined, place: EditorPlace | undefined): boolean => isPopupEnabled(popup) && !place;

const OUT_OF_FLOW: Record<string, string> = {
  position: 'absolute',
  width: '0',
  height: '0',
  margin: '0',
  padding: '0',
  'min-height': '0',
  overflow: 'visible',
};

const held = new WeakMap<HTMLElement, Array<{ el: HTMLElement; saved: Record<string, string> }>>();

/**
 * A live pop-up card takes no room: the card, HA's hui-card around it and the sections grid
 * cell (div.card) are taken out of the flow with zero size. Not display: none, which would hide
 * the top-layer dialog inside them too (HA hides a hidden card's cell that way). `want` false gives back
 * the styles the elements had.
 */
export function holdOutOfFlow(host: HTMLElement, want: boolean): void {
  const placeholders = held.get(host);
  if (!want) {
    for (const { el, saved } of placeholders ?? []) {
      for (const [prop, value] of Object.entries(saved)) {
        if (value) el.style.setProperty(prop, value);
        else el.style.removeProperty(prop);
      }
    }
    held.delete(host);
    return;
  }
  if (placeholders?.length) return;
  const els: HTMLElement[] = [host];
  const card = host.parentElement;
  if (card?.localName === 'hui-card') {
    els.push(card);
    const cell = card.parentElement;
    if (cell?.localName === 'div' && cell.classList.contains('card')) els.push(cell);
  }
  held.set(
    host,
    els.map((el) => {
      const saved: Record<string, string> = {};
      for (const [prop, value] of Object.entries(OUT_OF_FLOW)) {
        saved[prop] = el.style.getPropertyValue(prop);
        el.style.setProperty(prop, value);
      }
      return { el, saved };
    }),
  );
}
