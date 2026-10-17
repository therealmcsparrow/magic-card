import type { ParticlesModule } from '../contracts/particles-v2';
import { useParticlesCompiler } from '../anim-studio/compile';

/*
 * Particles v2 (simulator, baker, CSS writer, live engine) is a lazy chunk,
 * dist/magic-card-particles.js. Only cards that play a document with `particles.sim` load it
 * (library or inline `custom_animations`); a 2026.10.03 particles document never does. Loading it
 * registers the compiler (and the lenient `sim` check) in compile.ts, so the next render compiles
 * the simulation; until then, and when the load fails (logged once, no retry until the page
 * reloads), the document's v1 fallback plays.
 */

let pending: Promise<ParticlesModule | undefined> | undefined;
let loaded: ParticlesModule | undefined;

/** Load the particles chunk once; resolves undefined (and logs once) when it cannot be loaded. */
export function loadParticles(): Promise<ParticlesModule | undefined> {
  pending ??= import(/* webpackChunkName: "particles" */ '../particles').then(
    (m) => {
      useParticlesCompiler(m.compile, m.validateSim);
      return (loaded = m.particles);
    },
    (err: unknown) => {
      console.warn('Magic Card: magic-card-particles.js did not load', err);
      return undefined;
    },
  );
  return pending;
}

/** The particles module when it has loaded, else undefined (never starts a load). */
export const particlesIfLoaded = (): ParticlesModule | undefined => loaded;

/** Tests: forget the cached load (and the compiler). */
export function __resetParticlesLoaderForTests(): void {
  pending = undefined;
  loaded = undefined;
  useParticlesCompiler(undefined);
}
