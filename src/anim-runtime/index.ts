// the v2 checker and compiler: from now on compileAnimationDoc attaches CompiledAnimation.v2
import '../anim-studio/compile-v2';
import type { CompiledV2 } from '../anim-studio/compile-v2';
import type { ApplyCtx, HintCtx, RuntimeHints } from './types';
import * as rig from './rig';
import * as targets from './targets';
import * as bindings from './bindings';
import * as clips from './clips';

/*
 * The v2 animation runtime: a lazy chunk (dist/magic-card-anim-runtime.js) the card loads through
 * src/utils/anim-runtime-loader.ts only when a resolved animation document has a rig, tracks, clips
 * or bindings. Loading it registers the v2 checker and compiler (compile-v2.ts), so the card's next
 * render resolves CompiledAnimation.v2. The studio bundle imports it directly.
 *
 * The card calls apply(wrapper, v2, ctx) after every render for each module wrapper with v2 data
 * (one call per document, ctx.run its run key), and release(wrapper) when the wrapper is gone or
 * the card disconnects. Each feature owns its module (rig, targets, clips, bindings) behind the
 * same apply / release pair; a failing module is logged once and never breaks the render or the
 * other modules.
 */

export type { ApplyCtx, HintCtx, RuntimeHints } from './types';

const MODULES: Array<{ name: string; apply: typeof rig.apply; prune: typeof rig.prune; release: typeof rig.release }> = [
  { name: 'rig', apply: rig.apply, prune: rig.prune, release: rig.release },
  { name: 'targets', apply: targets.apply, prune: targets.prune, release: targets.release },
  { name: 'bindings', apply: bindings.apply, prune: bindings.prune, release: bindings.release },
  { name: 'clips', apply: clips.apply, prune: clips.prune, release: clips.release },
];

const logged = new Set<string>();
const guard = (name: string, fn: () => void): void => {
  try {
    fn();
  } catch (err) {
    if (logged.has(name)) return;
    logged.add(name);
    console.warn(`Magic Card: animation runtime (${name}) failed; the base animation keeps playing.`, err);
  }
};

/** Wrappers with applied v2 data (for release). */
const applied = new WeakSet<HTMLElement>();

/** Apply a document's v2 data to a module wrapper; idempotent per render. */
export function apply(wrapper: HTMLElement, v2: CompiledV2, ctx: ApplyCtx): void {
  applied.add(wrapper);
  for (const m of MODULES) guard(m.name, () => m.apply(wrapper, v2, ctx));
}

/**
 * Resolve-time decisions for one document (called by resolveAnimations while the card renders, when
 * the runtime is loaded): the clip that plays (clips.ts) and the icon rig (rig.ts). The card's render
 * owns the wrapper style and the icon element, so whatever changes them is decided here, not in apply.
 */
export function resolveHints(v2: CompiledV2, ctx: HintCtx): RuntimeHints {
  const out: RuntimeHints = {};
  guard('clips', () => Object.assign(out, clips.hints(v2, ctx)));
  // a clip other than the document's own timeline replaces it: the rig stays drawn, at rest
  guard('rig', () => Object.assign(out, rig.hints(v2, out.clip ? { ...ctx, still: true } : ctx)));
  return out;
}

/** After all documents of a render were applied to a wrapper (`runKeys` [] when it has none left). */
export function commit(wrapper: HTMLElement, runKeys: string[]): void {
  if (!applied.has(wrapper)) return;
  for (const m of MODULES) guard(m.name, () => m.prune(wrapper, runKeys));
}

/** The wrapper left the page (the card disconnected or re-rendered without it). */
export function release(wrapper: HTMLElement): void {
  if (!applied.has(wrapper)) return;
  applied.delete(wrapper);
  for (const m of MODULES) guard(m.name, () => m.release(wrapper));
}
