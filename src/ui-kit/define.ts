import { UI_KIT_CONTRACT_REVISION, UI_MENU_TAG, UI_POPOVER_TAG, UI_WINDOW_TAG } from '../contracts/ui-kit';
import { UiMenu } from './elements/menu';
import { UiPopover } from './elements/popover';
import { UiWindow } from './elements/window';

/*
 * Guarded define (contract ui-kit 1.0.0, "Define once"). The editor chunk, the studio entry and the theme editor
 * entry each carry a copy of the kit; whichever runs first defines a tag and the rest keep it. A tag that exists
 * with a lower revision is kept as it is (an element cannot be redefined): within major 1 every change is additive.
 * Call from install-style code, never at module top level of a lazy chunk (lazy-module 1.0.0).
 */
const ELEMENTS: Array<[string, CustomElementConstructor & { uiKitRevision?: number }]> = [
  [UI_MENU_TAG, UiMenu],
  [UI_WINDOW_TAG, UiWindow],
  [UI_POPOVER_TAG, UiPopover],
];

export function defineUiKit(): void {
  for (const [tag, cls] of ELEMENTS) {
    const have = customElements.get(tag) as (CustomElementConstructor & { uiKitRevision?: number }) | undefined;
    if (!have) customElements.define(tag, cls);
    else if ((have.uiKitRevision ?? 0) < UI_KIT_CONTRACT_REVISION) {
      // eslint-disable-next-line no-console
      console.debug(`[magic-card] ${tag} is defined by an older ui-kit (revision ${have.uiKitRevision ?? 0}); keeping it`);
    }
  }
}
