import type { ParticlesModule } from '../contracts/particles-v2';
import { markSimFailed, useParticlesCompiler } from './anim-hooks';
import type { LazyChunkControl } from './lazy-chunk';

/*
 * Loader of the particles v2 chunk (dist/magic-card-particles.js) through lazyChunk(), for cards
 * that play a document with `particles.sim`. Loading registers the compiler in compile.ts; until
 * then, or on failure, the document's v1 fallback plays. The chunk comes from a slot the table fills.
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
