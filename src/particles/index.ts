import { PARTICLES_CONTRACT_VERSION, type ParticlesCompiler, type ParticlesModule } from '../contracts/particles-v2';
import { useParticlesValidator } from '../utils/anim-hooks';
import { bake } from './bake';
import { bakedCss } from './css';
import { bakedSvg } from './svg';
import { validateSim } from './validate';
import { apply, compileParticles, release } from './apply';
export { BUILD_VERSION as BUILD } from '../utils/build-version';

/** LazyChunkModule (lazy-module 1.4.0): the compiler is registered by src/utils/particles-loader.ts, which owns the entry's side. */
export const install = (): void => {};

/*
 * The particles module (particles-v2 1.0.0): the lazy chunk dist/magic-card-particles.js (loaded by
 * src/utils/particles-loader.ts), also imported directly by the studio bundle. Loading it turns on
 * `particles.sim` checking in the importing bundle's validateAnimationDoc (lenient on the card, strict
 * in the studio). The compile hook is `compile`; the card registers it (useParticlesCompiler).
 */

useParticlesValidator(validateSim);

export const particles: ParticlesModule = { version: PARTICLES_CONTRACT_VERSION, validateSim, bake, bakedCss, bakedSvg, apply, release };

export const compile: ParticlesCompiler = compileParticles;

export { PARTICLES_CONTRACT_VERSION, validateSim, bake, bakedCss, bakedSvg, apply, release };
