import type { BgStackFx } from '../../contracts/bg-stack';

// Where <mc-bg-stack> finds its motion and refresh part. The 'layers' chunk calls provideBgFx once; stacks already
// connected pick it up, later ones read it on connect. The only copy of this state.

/** Connected stacks (each has fxOn). */
export const liveStacks = new Set<{ fxOn(): void }>();

let fx: BgStackFx | undefined;

export const currentFx = (): BgStackFx | undefined => fx;

export function provideBgFx(next: BgStackFx | undefined): void {
  fx = next;
  if (next) liveStacks.forEach((s) => s.fxOn());
}
