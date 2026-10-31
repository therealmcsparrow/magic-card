import {
  DEFAULT_GEOMETRY,
  PARTICLES_V2_CAPS,
  type BakedLoop,
  type BakeGeometry,
  type CompiledParticlesV2,
  type ParticlesApplyCtx,
  type ParticlesSpecV2,
} from '../contracts/particles-v2';
import { bake, quantizeGeometry } from './bake';
import { bakedCss, layerBase, layerName, liveCss, slotOf, stopAt } from './css';
import { clearFrame, docLooks, partSims, startLive, stopLive, writeFrame, __resetLiveForTests, type LiveFrame } from './live';
import { cutSlot, emitterPlan, parts, type DocPlan } from './emitters';
import { childCount } from './children';
import { SHAPES_CSS, SHAPES_KEY } from './shapes';

// Compiling a v2 spec for one geometry (the ParticlesCompiler the card registers) and the after-render step (apply /
// release). Bakes are cached per document with up to PARTICLES_V2_CAPS.geometryVariants geometries each. Every variant
// renders the same slots (the full pool of liveLayout), so a re-bake only swaps the layer name and rules.

interface Entry {
  compiled: CompiledParticlesV2;
  loop?: BakedLoop;
  plan: DocPlan;
  /** Reduced motion: one still frame per part. */
  still: Array<Array<LiveFrame | undefined>>;
}

const MAX_DOCS = 32;
const cache = new Map<string, Map<string, Entry>>();

/** The document as compiled for one geometry (undefined: unmeasured, the unbaked pool): both parts' rules and slots. */
function build(docId: string, spec: ParticlesSpecV2, period: number, base: string, g?: BakeGeometry, loop?: BakedLoop): Entry {
  const d = emitterPlan(spec);
  const looks = docLooks(d, period);
  const layer = (k: 0 | 1) => {
    const name = g ? layerName(k ? base + 'o' : base, g) : `${k ? base + 'o' : base}-g0`;
    const mine = parts(d, looks)[k];
    const css = loop ? bakedCss(loop, name, docId, looks, k ? loop.parts!.element : 0, k ? undefined : loop.parts?.element, k ? loop.parts!.slot : 0).css : liveCss(mine, name, docId).css;
    return { name, css, slots: mine.map(slotOf) };
  };
  const a = layer(0);
  const b = d.cut < d.plans.length ? layer(1) : undefined;
  const front = spec.layer === 'front';
  const capped = !!g && !loop && d.plans.some((p) => Math.floor(p.spec.count) > p.n || p.m < p.n * childCount(p.spec.sim.children));
  const stats = loop ? loop.stats : { elements: looks.length, stops: 0, bytes: a.css.length + (b?.css.length ?? 0), capped, warn: false };
  const cut = cutSlot(d);
  const emitterSlots = d.plans
    .map((p, k) => ({ index: p.index, part: (k < d.cut ? 0 : 1) as 0 | 1, first: p.at - (k < d.cut ? 0 : cut), parents: p.n, children: p.m }))
    .sort((x, y) => x.index - y.index);
  return { compiled: { mode: spec.sim.mode, ...a, front, ...(b ? { other: { ...b, front: !front } } : {}), emitterSlots, stats }, ...(loop ? { loop } : {}), plan: d, still: [] };
}

function entryFor(docId: string, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry): Entry {
  const g = quantizeGeometry(geometry);
  const base = layerBase(docId, spec, period);
  const name = layerName(base, g);
  let variants = cache.get(base);
  const hit = variants?.get(name);
  if (variants && hit) {
    // most recently used last
    variants.delete(name);
    variants.set(name, hit);
    cache.delete(base);
    cache.set(base, variants);
    return hit;
  }
  const entry = build(docId, spec, period, base, g, spec.sim.mode === 'live' ? undefined : bake({ spec, period, geometry: g }));
  if (!variants) {
    variants = new Map();
    cache.set(base, variants);
    while (cache.size > MAX_DOCS) cache.delete(cache.keys().next().value!);
  }
  variants.set(name, entry);
  while (variants.size > PARTICLES_V2_CAPS.geometryVariants) variants.delete(variants.keys().next().value!);
  return entry;
}

/**
 * particles-v2 ParticlesCompiler: the layer of a v2 spec for one geometry (cached). Aspect 0: the
 * unbaked pool (`-g0`, static slot rules only, nothing moves until apply), no bake at render time.
 */
export function compileParticles(docId: string, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry): CompiledParticlesV2 {
  if (geometry.aspect > 0) return entryFor(docId, spec, period, geometry).compiled;
  return build(docId, spec, period, layerBase(docId, spec, period)).compiled;
}

/** The layer's quantised geometry from the page; undefined while it has no size (hidden, not laid out). */
function measure(layer: HTMLElement, ctx: ParticlesApplyCtx): BakeGeometry | undefined {
  const r = layer.getBoundingClientRect();
  if (!(r.width > 0 && r.height > 0)) return undefined;
  const g: BakeGeometry = { aspect: r.width / r.height };
  if (ctx.spec.sim.colliders.content !== 'none') {
    const b = ctx.content?.()?.getBoundingClientRect();
    if (b && b.width > 0 && b.height > 0) {
      g.content = { x: ((b.left - r.left) / r.width) * 100, y: ((b.top - r.top) / r.height) * 100, w: (b.width / r.width) * 100, h: (b.height / r.height) * 100 };
    }
  }
  return quantizeGeometry(g);
}

/** Reduced motion: one frame of a part from the middle of the loop (baked) or after a short run (live), held still. */
function stillFrame(e: Entry, spec: ParticlesSpecV2, period: number, g: BakeGeometry, part: 0 | 1): Array<LiveFrame | undefined> {
  if (e.still[part]) return e.still[part];
  const frames: Array<LiveFrame | undefined> = [];
  const l = e.loop;
  if (l) {
    const cut = l.parts?.element ?? l.elements.length;
    l.elements.slice(part ? cut : 0, part ? undefined : cut).forEach((el) => (frames[el.slot - (part ? l.parts!.slot : 0)] = stopAt(el.stops, 0.5)));
  } else {
    const sims = partSims(spec, period, g, part);
    const steps = Math.round(Math.min(period * 0.5, 3) / PARTICLES_V2_CAPS.dt);
    for (const sim of sims) for (let i = 0; i < steps; i++) sim.step();
    frames.push(...sims.flatMap((s) => s.frame()));
  }
  return (e.still[part] = frames);
}

const stills = new WeakSet<HTMLElement>();
let logged = false;

/** particles-v2 ParticlesModule.apply: never throws (logs once). */
export function apply(layer: HTMLElement, ctx: ParticlesApplyCtx): void {
  try {
    const { spec, period, docId } = ctx;
    if (!spec?.sim) throw new Error('the animation has no particle simulation');
    ctx.useCss(SHAPES_KEY, SHAPES_CSS);
    const measured = measure(layer, ctx);
    const g = measured ?? DEFAULT_GEOMETRY;
    const e = entryFor(docId, spec, period, g);
    const part = ctx.part ? 1 : 0;
    const c = (part ? e.compiled.other : e.compiled)!;
    // the render's unbaked pool (or another geometry's bake): this size's rules; the slots stay
    if (layer.getAttribute('data-fx') !== c.name) {
      ctx.useCss(c.name, c.css);
      layer.setAttribute('data-fx', c.name);
    }
    if (ctx.reducedMotion) {
      stopLive(layer);
      writeFrame(layer, stillFrame(e, spec, period, g, part), true);
      stills.add(layer);
      return;
    }
    if (stills.delete(layer)) clearFrame(layer);
    if (spec.sim.mode === 'live') startLive(layer, spec, period, g, c.name, part);
    else stopLive(layer);
  } catch (err) {
    if (!logged) {
      logged = true;
      console.warn('Magic Card: a particle layer could not be set up; it plays its simple version.', err);
    }
  }
}

/** particles-v2 ParticlesModule.release: the layer left the DOM or the card disconnected. */
export function release(layer: HTMLElement): void {
  stopLive(layer);
  if (stills.delete(layer)) clearFrame(layer);
}

export function __resetParticlesForTests(): void {
  cache.clear();
  logged = false;
  __resetLiveForTests();
}
