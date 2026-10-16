import { docNeedsRuntime, type AnimationDoc } from '../anim-studio/model';

/*
 * The v2 animation runtime (icon rigs, card-part targets, clips, bindings) is a lazy chunk,
 * dist/magic-card-anim-runtime.js, loaded next to magic-card.js (public path: src/index.ts). Cards
 * whose animations need none of it never load it. One import per page: the promise is cached, also
 * after a failure (offline, file missing), which is logged once and leaves the base animation
 * playing until the next page load.
 */

export type AnimRuntime = typeof import('../anim-runtime');

let pending: Promise<AnimRuntime | undefined> | undefined;
let loaded: AnimRuntime | undefined;

/** The document needs the runtime chunk (rig, tracks, clips or bindings). */
export const needsRuntime = (doc: AnimationDoc): boolean => docNeedsRuntime(doc);

/** Load the runtime chunk once; resolves undefined (and logs once) when it cannot be loaded. */
export function loadRuntime(): Promise<AnimRuntime | undefined> {
  pending ??= import(/* webpackChunkName: "anim-runtime" */ '../anim-runtime').then(
    (m) => (loaded = m),
    (err: unknown) => {
      console.warn('Magic Card: the animation runtime (magic-card-anim-runtime.js) could not be loaded; animations play without parts, clips and bindings.', err);
      return undefined;
    },
  );
  return pending;
}

/** The runtime when it has loaded, else undefined (never starts a load). */
export function runtimeIfLoaded(): AnimRuntime | undefined {
  return loaded;
}

/** Tests: forget the cached load. */
export function __resetRuntimeLoaderForTests(): void {
  pending = undefined;
  loaded = undefined;
}
