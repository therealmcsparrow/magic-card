import type { ParticlesCompiler, ParticlesModule } from '../contracts/particles-v2';
import type { V2Compiler } from '../anim-studio/compile';
import type { ParticlesValidator, validateAnimationDoc, validateAnimationLibrary } from '../anim-studio/model';

/*
 * The hook points of the animation compiler (ADR 0043: "Core keeps the seam, not the compiler"). The compiler and the
 * document model live in the lazy `anim` chunk, and the chunks that plug into them (the v2 runtime registers its
 * compileV2, the particles chunk its compiler and sim validator, the model its document validators) are separate
 * files that each carry their own copy of that code. The slots therefore sit here, in the entry, where every copy
 * finds the same ones. Plain code with no runtime imports. The setters keep their old names and are re-exported from
 * compile.ts and model.ts, so no caller changed.
 */

export interface AnimationValidators {
  doc: typeof validateAnimationDoc;
  library: typeof validateAnimationLibrary;
}

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
  /** The document validators, registered when model.ts loads: the animation library service (Core) uses them. */
  validators?: AnimationValidators;
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

/** model.ts registers its validators when it loads, for the animation library service. */
export function useAnimationValidators(v: AnimationValidators): void {
  animHooks.validators = v;
}
