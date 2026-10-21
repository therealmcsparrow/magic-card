import type { AnimationLibrary } from '../anim-studio/animation-library';
import type { ParticlesCompiler, ParticlesModule } from '../contracts/particles-v2';
import type { V2Compiler } from '../anim-studio/compile';
import type { ParticlesValidator } from '../anim-studio/model';

/*
 * The hook points of the animation compiler ("Core keeps the seam, not the compiler"). The compiler and the
 * document model live in the lazy `anim` chunk, and the chunks that plug into them (the v2 runtime registers its
 * compileV2, the particles chunk its compiler and sim validator, animation-library.ts the page's library) are separate
 * files that each carry their own copy of that code. The slots therefore sit here, in the entry, where every copy
 * finds the same ones. Plain code with no runtime imports. The compiler and particles setters are re-exported from
 * compile.ts and model.ts.
 */

export const animHooks: {
  /** particles v2 compiler (the particles chunk, via src/utils/particles-loader.ts) and its lenient `sim` check. */
  particles?: ParticlesCompiler;
  checkSim?: ParticlesModule['validateSim'];
  /** Bumped by useParticlesCompiler: compile.ts forgets what it compiled before. */
  epoch: number;
  /** Documents whose simulation could not be set up: they compile their v1 fallback until the page reloads. */
  failedSims: Set<string>;
  /** compileV2 (src/anim-studio/compile-v2.ts registers it when that file loads). */
  v2?: V2Compiler;
  /** `particles.sim` checking in validateAnimationDoc (the particles chunk and the studio). */
  simValidator?: ParticlesValidator;
  /** The page's animation library, registered when animation-library.ts loads (the `anim` chunk): the editor, the transfer view and the icon animator read it. */
  library?: AnimationLibrary;
} = { epoch: 0, failedSims: new Set() };

/**
 * Turn on particles v2 (particles-v2 ParticlesCompiler; the card's particles loader and the studio call this).
 * `check` re-checks `sim` lenient (documents validated before the chunk arrived keep it as stored); without it
 * nothing compiles. Until then a v2 document compiles its v1 fallback and flags `needsParticles`.
 */
export function useParticlesCompiler(fn: ParticlesCompiler | undefined, check?: ParticlesModule['validateSim']): void {
  animHooks.particles = fn;
  animHooks.checkSim = check;
  animHooks.epoch++;
}

/**
 * The particles chunk could not set up a layer of document `id` (the card saw apply fail): until the page reloads the
 * document compiles its v1 fallback (FALLBACK_DIRECTION, first own shape), as when the chunk cannot load. A compiler
 * that throws does the same. The card calls particlesFailed in src/utils/particles-loader.ts, which forwards here.
 */
export const markSimFailed = (id: string): void => void animHooks.failedSims.add(id);

/**
 * Turn on `CompiledAnimation.v2` (compile-v2.ts calls this when it loads: the studio bundle and the card's lazy
 * runtime chunk). Until then, documents compile to their base animation only.
 */
export function useV2Compiler(fn: V2Compiler | undefined): void {
  animHooks.v2 = fn;
}

/** Turn on `particles.sim` checking in validateAnimationDoc (the particles chunk and the studio call this). */
export function useParticlesValidator(fn: ParticlesValidator | undefined): void {
  animHooks.simValidator = fn;
}

/** animation-library.ts registers the page's library when it loads. */
export function useAnimationLibrary(lib: AnimationLibrary): void {
  animHooks.library = lib;
}

/** The page's animation library. The editor loads the `anim` chunk before it renders, which registers it. */
export function animLibrary(): AnimationLibrary {
  const lib = animHooks.library;
  if (!lib) throw new Error('the animation library has not loaded');
  return lib;
}
