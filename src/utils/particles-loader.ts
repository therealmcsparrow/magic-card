import type { ParticlesModule } from '../contracts/particles-v2';
import { markSimFailed, useParticlesCompiler } from '../anim-studio/compile';
import type { LazyChunkControl } from './lazy-chunk';

/*
 * Particles v2 (simulator, baker, CSS writer, live engine) is a lazy chunk,
 * dist/magic-card-particles.js. Only cards that play a document with `particles.sim` load it
 * (library or inline `custom_animations`); a 2026.10.03 particles document never does. It loads through
 * lazyChunk() (lazy-module 1.4.0). Loading it registers the compiler (and the lenient `sim` check) in
 * compile.ts, so the next render compiles the simulation; until then, and when the load fails (retried,
 * with the failure notice), the document's v1 fallback plays. The chunk comes from a slot the chunk table
 * (src/utils/lazy-chunks.ts) fills, like in anim-runtime-loader.ts.
 */

type Chunk = LazyChunkControl<typeof import('../particles')>;
let chunk: Chunk | undefined;
let pending: Promise<ParticlesModule | undefined> | undefined;

// runs in the install step, also for a load that succeeds on a background retry
const register = (): void => void chunk?.whenReady(() => useParticlesCompiler(chunk!.module()!.compile, chunk!.module()!.validateSim));

/** Called by src/utils/lazy-chunks.ts. */
export const provideParticlesChunk = (c: Chunk): void => {
  chunk = c;
  register();
};

/** Load the particles chunk once; resolves undefined when it cannot be loaded (the chunk retries on its own). */
export function loadParticles(): Promise<ParticlesModule | undefined> {
  if (!chunk) return Promise.resolve(undefined);
  return (pending ??= chunk.load().then((ok) => {
    if (!ok) pending = undefined;
    return ok ? chunk!.module()!.particles : undefined;
  }));
}

/** The particles module when it has loaded, else undefined (never starts a load). */
export const particlesIfLoaded = (): ParticlesModule | undefined => chunk?.module()?.particles;

/**
 * The particles chunk could not set up a layer of document `id` (the card saw apply fail): until the page
 * reloads the document compiles its v1 fallback, as when the chunk cannot load.
 */
export const particlesFailed = (id: string): void => markSimFailed(id);

/** Tests: forget the cached load (and the compiler). */
export function __resetParticlesLoaderForTests(): void {
  chunk?.__reset();
  pending = undefined;
  useParticlesCompiler(undefined);
  register();
}
