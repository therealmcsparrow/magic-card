import { VERSION } from '../version';

/** Current contract for the magic-card-utils panel (bump on a breaking change). */
export const API_VERSION = 1;

/** Publish `window.MagicCard`, merging into an existing object so other keys survive. */
export function publishContract(win: Window = window): void {
  win.MagicCard = { ...win.MagicCard, version: VERSION, apiVersion: API_VERSION };
}
