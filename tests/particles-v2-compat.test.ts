import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  validateAnimationDoc,
  validateAnimationLibrary,
  useParticlesValidator,
  docNeedsParticles,
  type AnimationDoc,
  type ParticlesValidator,
} from '../src/anim-studio/model';
import { compileAnimationDoc } from '../src/anim-studio/compile';
import { ANIMATION_PRESETS } from '../src/utils/animation-presets';
import { t as labelText } from '../src/i18n/labels';
import { PARTICLES_ENGINE, type ParticlesSim } from '../src/contracts/particles-v2';

/*
 * 2026.10.03 particle documents validate and compile exactly as on tag v2026.10.03.
 *
 * The fixture is produced by the tag's own model and compiler: extract the tag's sources with
 *   mkdir -p tests/.tag-20261003 && git archive v2026.10.03 src | tar -x -C tests/.tag-20261003
 * and run this file once with PCOMPAT_WRITE=1. Later runs compare the current code to it.
 */

const FIXTURE = resolve(__dirname, 'fixtures/particles-v2-compat-20261003.json');
const TAG_SRC = resolve(__dirname, '.tag-20261003/src');

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>';

/** Raw particle docs as users saved them with 2026.10.03 (hand-written plus every fx preset as a document). */
function rawDocs(): Record<string, unknown>[] {
  const hand: Record<string, unknown>[] = [
    { id: 'p-minimal', name: 'Minimal', kind: 'particles', particles: {} },
    { id: 'p-hearts', name: 'Hearts', kind: 'particles', duration: 3, easing: 'ease-out', particles: { shape: { emoji: '💖' }, count: 7, direction: 'rise', size: [12, 22], spin: 40, layer: 'back' } },
    { id: 'p-stars', name: 'Falling stars', kind: 'particles', duration: 4, easing: 'linear', particles: { shape: { svg: STAR }, count: 10, direction: 'fall', size: [8, 16], colors: ['#ffc107', '#ff9800', '#fff176'], spin: 180 } },
    { id: 'p-burst', name: 'Burst', kind: 'particles', duration: 1.6, easing: 'ease-out', particles: { count: 16, direction: 'burst', size: [6, 10], spread: 90, colors: ['#e91e63', '#03a9f4', '#8bc34a'], gravity: 0.4 } },
    { id: 'p-orbit', name: 'Orbit', kind: 'particles', duration: 2, iterations: 3, particles: { shape: { icon: 'mdi:star' }, count: 5, direction: 'orbit', size: 14, fade: false, layer: 'front' } },
    { id: 'p-spiral', name: 'Spiral', kind: 'particles', duration: 5, direction: 'alternate', particles: { count: 30, direction: 'spiral', speed: 2.5, spread: 40, gravity: -0.6, colors: ['rgb(10, 20, 30)'] } },
    { id: 'p-drift', name: 'Drift', kind: 'particles', duration: 6, easing: 'cubic-bezier(0.2, 0, 0.4, 1)', particles: { count: '12', direction: 'drift', size: [4, 4], spin: -720, speed: 0.5 } },
    { id: 'p-max', name: 'Max', kind: 'particles', particles: { count: 60, direction: 'fall', size: [1, 200], spread: 100, gravity: 1 } },
    { id: 'p-bad-entries', name: 'Bad entries', kind: 'particles', particles: { count: 999, direction: 'sideways', colors: ['nope'] } },
  ];
  const fromPresets = ANIMATION_PRESETS.filter((p) => p.channels.includes('fx')).map((p, i) => ({
    id: `fx-${p.id}`,
    name: labelText(p.name),
    kind: 'particles',
    duration: 3 + (i % 4),
    particles: { preset: p.id, intensity: 3 + i, count: 4, direction: 'fall', layer: i % 2 ? 'front' : 'back' },
  }));
  return [...hand, ...fromPresets];
}

type Model = { validateAnimationDoc: typeof validateAnimationDoc; validateAnimationLibrary: typeof validateAnimationLibrary };
type Compiler = { compileAnimationDoc: typeof compileAnimationDoc };

/** Everything a card or the studio derives from the raw docs (strict and lenient, normal and reduced). */
function snapshot(model: Model, compiler: Compiler): unknown {
  const raws = rawDocs();
  const out: Record<string, unknown> = {};
  for (const raw of raws) {
    const strict = model.validateAnimationDoc(raw);
    const lenient = model.validateAnimationDoc(raw, { v2: 'lenient' });
    const doc = strict.ok ? strict.doc : undefined;
    out[raw.id as string] = {
      strict,
      lenient,
      css: doc ? compiler.compileAnimationDoc(doc) : undefined,
      reduced: doc ? compiler.compileAnimationDoc(doc, { reducedMotion: true }) : undefined,
    };
  }
  out.library = model.validateAnimationLibrary(raws, { v2: 'lenient' });
  return JSON.parse(JSON.stringify(out, (_k, v) => (v instanceof Map ? [...v.entries()] : v)));
}

const SIM: ParticlesSim = {
  engine: PARTICLES_ENGINE,
  mode: 'baked',
  seed: 12345,
  flow: 'fountain',
  shapes: [{ shape: { builtin: 'star' }, weight: 3 }, { shape: { emoji: '🔥' }, weight: 1 }],
  ranges: { speed: [10, 20], spin: [0, 90], delay: [0, 1], lifetime: [1, 2], opacity: [0.5, 1] },
  physics: { gravity: { angle: 0, strength: 30 }, drag: 0.2, turbulence: { strength: 5, scale: 20 }, bounce: 0.5 },
  colliders: { floor: true, ceiling: false, left: false, right: false, content: 'none' },
};

const v2Doc = (sim: unknown = SIM): Record<string, unknown> => ({
  id: 'p-v2',
  name: 'Fountain',
  kind: 'particles',
  duration: 3,
  particles: { count: 20, direction: 'rise', shape: { emoji: '🔥' }, sim },
});

describe('particles v2 compatibility with 2026.10.03', () => {
  it.runIf(process.env.PCOMPAT_WRITE === '1')('writes the fixture from the tag sources', async () => {
    expect(existsSync(TAG_SRC), 'extract the tag sources first (see header)').toBe(true);
    const tagModel = (await import(/* @vite-ignore */ `${TAG_SRC}/anim-studio/model.ts`)) as Model;
    const tagCompiler = (await import(/* @vite-ignore */ `${TAG_SRC}/anim-studio/compile.ts`)) as Compiler;
    mkdirSync(resolve(__dirname, 'fixtures'), { recursive: true });
    writeFileSync(FIXTURE, JSON.stringify(snapshot(tagModel, tagCompiler), null, 1));
  });

  it('validates and compiles every 2026.10.03 particle doc as the tag did', () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    expect(Object.keys(fixture).length).toBeGreaterThan(30);
    expect(snapshot({ validateAnimationDoc, validateAnimationLibrary }, { compileAnimationDoc })).toEqual(fixture);
  });

  it('gives the same result with a particles validator registered (v1 docs never reach it)', () => {
    const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    let calls = 0;
    useParticlesValidator(() => {
      calls++;
      return { errors: [] };
    });
    try {
      expect(snapshot({ validateAnimationDoc, validateAnimationLibrary }, { compileAnimationDoc })).toEqual(fixture);
      expect(calls).toBe(0);
    } finally {
      useParticlesValidator(undefined);
    }
  });

  it('no 2026.10.03 doc needs the particles chunk', () => {
    for (const raw of rawDocs()) {
      const r = validateAnimationDoc(raw, { v2: 'lenient' });
      if (r.ok) expect(docNeedsParticles(r.doc)).toBe(false);
    }
  });
});

describe('particles.sim passthrough and validator hook', () => {
  afterEach(() => useParticlesValidator(undefined));

  it('keeps sim as stored when no validator is registered (card bundle)', () => {
    const odd = { ...SIM, flow: 'not-a-flow', extra: [1, 2] };
    for (const v2 of ['strict', 'lenient'] as const) {
      const r = validateAnimationDoc(v2Doc(odd), { v2 });
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.doc.particles?.sim).toEqual(odd);
        expect(docNeedsParticles(r.doc)).toBe(true);
      }
    }
  });

  it('keeps the v1 fields of a v2 doc as the playable fallback', () => {
    const r = validateAnimationDoc(v2Doc());
    const v1 = validateAnimationDoc({ ...v2Doc(), particles: { count: 20, direction: 'rise', shape: { emoji: '🔥' } } });
    expect(r.ok && v1.ok).toBe(true);
    if (r.ok && v1.ok) {
      const { sim, ...rest } = r.doc.particles!;
      expect(sim).toEqual(SIM);
      expect(rest).toEqual(v1.doc.particles);
      const a = compileAnimationDoc(r.doc);
      const b = compileAnimationDoc(v1.doc);
      expect(a.layer).toEqual(b.layer);
      expect(a.css.replaceAll(a.name, 'N')).toBe(b.css.replaceAll(b.name, 'N'));
    }
  });

  it('treats a null sim as absent and drops a non-object sim', () => {
    const r = validateAnimationDoc(v2Doc(null));
    expect(r.ok).toBe(true);
    expect(r.ok && 'sim' in r.doc.particles!).toBe(false);
    const strict = validateAnimationDoc(v2Doc('fountain'));
    expect(strict.ok).toBe(false);
    expect(strict.errors).toEqual([{ path: 'particles.sim', message: 'Must be an object.' }]);
    const lenient = validateAnimationDoc(v2Doc(['x']), { v2: 'lenient' });
    expect(lenient.ok && 'sim' in lenient.doc.particles!).toBe(false);
  });

  it('strict: validator errors fail the doc with their particles.sim.* paths', () => {
    const seen: Array<[unknown, string]> = [];
    const fn: ParticlesValidator = (raw, mode) => {
      seen.push([raw, mode]);
      return { errors: [{ path: 'particles.sim.seed', message: 'Must be a whole number.' }] };
    };
    useParticlesValidator(fn);
    const r = validateAnimationDoc(v2Doc());
    expect(seen).toEqual([[SIM, 'strict']]);
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual([{ path: 'particles.sim.seed', message: 'Must be a whole number.' }]);
  });

  it('strict: a valid sim is the validator output', () => {
    const cleaned = { ...SIM, seed: 7 };
    useParticlesValidator(() => ({ sim: cleaned, errors: [] }));
    const r = validateAnimationDoc(v2Doc());
    expect(r.ok && r.doc.particles?.sim).toEqual(cleaned);
  });

  it('lenient: errors are dropped, the cleaned sim kept, an unusable sim removed (v1 fallback plays)', () => {
    const modes: string[] = [];
    useParticlesValidator((_raw, mode) => {
      modes.push(mode);
      return { sim: { ...SIM, children: undefined }, errors: [{ path: 'particles.sim.children', message: 'x' }] };
    });
    const r = validateAnimationDoc(v2Doc(), { v2: 'lenient' });
    expect(modes).toEqual(['lenient']);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.doc.particles?.sim).toEqual({ ...SIM, children: undefined });

    useParticlesValidator(() => ({ errors: [{ path: 'particles.sim', message: 'x' }] }));
    const gone = validateAnimationDoc(v2Doc(), { v2: 'lenient' });
    expect(gone.ok).toBe(true);
    if (gone.ok) {
      expect('sim' in gone.doc.particles!).toBe(false);
      expect(docNeedsParticles(gone.doc)).toBe(false);
      expect(gone.doc.particles?.direction).toBe('rise');
    }
  });

  it('library (card) validation keeps v2 docs next to v1 docs', () => {
    const { docs, errors } = validateAnimationLibrary([v2Doc(), rawDocs()[1]], { v2: 'lenient' });
    expect(errors).toEqual([]);
    expect(docs.get('p-v2')?.particles?.sim).toEqual(SIM);
    expect(docs.get('p-hearts')?.particles && 'sim' in docs.get('p-hearts')!.particles!).toBe(false);
  });

  it('docNeedsParticles: only particles docs with sim and no built-in preset', () => {
    const r = validateAnimationDoc(v2Doc());
    expect(r.ok && docNeedsParticles(r.doc)).toBe(true);
    const preset = validateAnimationDoc({ ...v2Doc(), particles: { preset: 'confetti', sim: SIM } });
    expect(preset.ok && docNeedsParticles(preset.doc)).toBe(false);
    const fake = { id: 'k', kind: 'keyframes', particles: { sim: SIM } } as unknown as AnimationDoc;
    expect(docNeedsParticles(fake)).toBe(false);
  });
});
