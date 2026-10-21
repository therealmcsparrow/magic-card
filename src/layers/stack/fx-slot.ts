import type { BgStackFx } from '../../contracts/bg-stack';

/*
 * Where <mc-bg-stack> finds its motion and refresh part. The 'layers' chunk calls provideBgFx once;
 * stacks that are already connected pick it up, later ones read it on connect. This is the only
 * copy of this state: the chunk imports this module from magic-card.js.
 */

/** Connected stacks (each has fxOn). */
export const liveStacks = new Set<{ fxOn(): void }>();

let fx: BgStackFx | undefined;

export const currentFx = (): BgStackFx | undefined => fx;

export function provideBgFx(next: BgStackFx | undefined): void {
  fx = next;
  if (next) liveStacks.forEach((s) => s.fxOn());
}
