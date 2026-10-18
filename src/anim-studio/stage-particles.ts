import type { StageParticles } from '../contracts/studio-layers';
import type { ParticlesSpecV2 } from '../contracts/particles-v2';
import { compile, validateSim } from '../particles';
import type { AnimationDoc } from './model';
import { emitterIds } from './layer-view';

/*
 * What the stage sheet needs to hide emitters (studio-layers.ts StageParticles): the layer name base,
 * each emitter's slot range and its row id. The ranges do not depend on geometry, so the particles
 * compiler runs once per document change at { aspect: 0 } (no bake), never per frame.
 */

const cache = new WeakMap<object, StageParticles | undefined>();

/** The stage particles of a particles v2 document; undefined for any other document or an unusable sim. */
export function stageParticlesOf(doc: AnimationDoc): StageParticles | undefined {
  const p = doc.kind === 'particles' ? doc.particles : undefined;
  if (!p?.sim) return undefined;
  if (cache.has(p)) return cache.get(p);
  let out: StageParticles | undefined;
  try {
    const sim = validateSim(p.sim, 'lenient').sim;
    if (sim) {
      const spec: ParticlesSpecV2 = { ...p, sim };
      const c = compile(doc.id, spec, doc.duration / p.speed, { aspect: 0 });
      // ids of the validated sim (lenient validation may have renamed a bad id)
      const ids = emitterIds({ ...doc, particles: { ...p, sim } });
      if (c.emitterSlots) out = { base: c.name.replace(/-g\w+$/, ''), emitterSlots: c.emitterSlots, ids };
    }
  } catch {
    out = undefined;
  }
  cache.set(p, out);
  return out;
}
