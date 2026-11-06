import { notifyChunks } from './lazy-chunk';

/** Asks HA for the card helpers, whose row elements define ha-relative-time, until the element exists; renders every card again when it arrives. */
export function askForRelativeTime(): void {
  if (customElements.get('ha-relative-time')) return;
  void Promise.resolve()
    .then(() => (window as unknown as { loadCardHelpers?: () => Promise<unknown> }).loadCardHelpers?.())
    .catch(() => undefined);
  void customElements.whenDefined('ha-relative-time').then(notifyChunks);
}
