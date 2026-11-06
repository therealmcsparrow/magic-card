import { UI_KIT_CONTRACT_REVISION } from '../contracts/ui-kit';

// The guarded define (contract ui-kit 1.0.0, "Define once") without any element class; a screen hands over just the parts it uses.
export type KitElementClass = CustomElementConstructor & { uiKitRevision?: number };

export function defineKitElements(list: Array<[string, KitElementClass]>): void {
  for (const [tag, cls] of list) {
    const have = customElements.get(tag) as KitElementClass | undefined;
    if (!have) customElements.define(tag, cls);
    else if ((have.uiKitRevision ?? 0) < UI_KIT_CONTRACT_REVISION) {
      // eslint-disable-next-line no-console
      console.debug(`[magic-card] ${tag} is defined by an older ui-kit (revision ${have.uiKitRevision ?? 0}); keeping it`);
    }
  }
}
