import {
  DEFAULT_GEOMETRY,
  PARTICLES_V2_CAPS,
  type BakedLoop,
  type BakeGeometry,
  type CompiledParticlesV2,
  type ParticlesApplyCtx,
  type ParticleSlotV2,
  type ParticlesSpecV2,
} from '../contracts/particles-v2';
import { bake, quantizeGeometry } from './bake';
import { bakedCss, layerBase, layerName, liveCss, stopAt } from './css';
import { LiveSim, clearFrame, liveLayout, startLive, stopLive, writeFrame, __resetLiveForTests, type LiveFrame } from './live';
import { childCount } from './children';
import { SHAPES_CSS, SHAPES_KEY } from './shapes';

/*
 * Compiling a v2 spec for one geometry (the ParticlesCompiler the card registers) and the after-render
 * step (apply / release). Bakes are cached per document (name base) with up to
 * PARTICLES_V2_CAPS.geometryVariants geometries each, least recently used dropped.
 */

interface Entry {
  compiled: CompiledParticlesV2;
  loop?: BakedLoop;
  still?: Array<LiveFrame | undefined>;
}

const MAX_DOCS = 32;
const cache = new Map<string, Map<string, Entry>>();

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
  const front = spec.layer === 'front';
  let entry: Entry;
  if (spec.sim.mode === 'live') {
    const layout = liveLayout(spec, period);
    const { css, slots } = liveCss(layout.looks, name, docId);
    const capped = Math.floor(spec.count) > PARTICLES_V2_CAPS.parents || layout.children < layout.parents * childCount(spec.sim.children);
    entry = { compiled: { mode: 'live', name, css, slots, front, stats: { elements: slots.length, stops: 0, bytes: css.length, capped, warn: false } } };
  } else {
    const loop = bake({ spec, period, geometry: g });
    const { css, slots } = bakedCss(loop, name, docId);
    entry = { compiled: { mode: 'baked', name, css, slots, front, stats: loop.stats }, loop };
  }
  if (!variants) {
    variants = new Map();
    cache.set(base, variants);
    while (cache.size > MAX_DOCS) cache.delete(cache.keys().next().value!);
  }
  variants.set(name, entry);
  while (variants.size > PARTICLES_V2_CAPS.geometryVariants) variants.delete(variants.keys().next().value!);
  return entry;
}

/** particles-v2 ParticlesCompiler: the layer of a v2 spec for one geometry (cached). */
export function compileParticles(docId: string, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry): CompiledParticlesV2 {
  return entryFor(docId, spec, period, geometry).compiled;
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

/**
 * After a swap to another geometry's bake, the slots that differ (children depend on which parents
 * hit what) take the new built-in shape. Parents never differ: their looks come from the seed alone.
 */
function patchSlots(layer: HTMLElement, slots: ParticleSlotV2[]): void {
  const items = layer.children;
  for (let k = 0; k < items.length && k < slots.length; k++) {
    const s = slots[k].shape;
    if (s) {
      if (items[k].getAttribute('data-s') !== s) items[k].setAttribute('data-s', s);
    } else if (items[k].hasAttribute('data-s')) items[k].removeAttribute('data-s');
  }
}

/** Reduced motion: one frame from the middle of the loop (baked) or after a short run (live), held still. */
function stillFrame(e: Entry, spec: ParticlesSpecV2, period: number, g: BakeGeometry): Array<LiveFrame | undefined> {
  if (e.still) return e.still;
  if (e.loop) e.still = e.loop.elements.map((el) => stopAt(el.stops, 0.5));
  else {
    const sim = new LiveSim(spec, period, g);
    const steps = Math.round(Math.min(period * 0.5, 3) / PARTICLES_V2_CAPS.dt);
    for (let i = 0; i < steps; i++) sim.step();
    e.still = sim.frame();
  }
  return e.still;
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
    if (measured && layer.getAttribute('data-fx') !== e.compiled.name) {
      ctx.useCss(e.compiled.name, e.compiled.css);
      layer.setAttribute('data-fx', e.compiled.name);
      patchSlots(layer, e.compiled.slots);
    }
    if (ctx.reducedMotion) {
      stopLive(layer);
      writeFrame(layer, stillFrame(e, spec, period, g), true);
      stills.add(layer);
      return;
    }
    if (stills.delete(layer)) clearFrame(layer);
    if (spec.sim.mode === 'live') startLive(layer, spec, period, g, e.compiled.name);
    else stopLive(layer);
  } catch (err) {
    if (!logged) {
      logged = true;
      console.warn('Magic Card: a particle layer could not be set up; it keeps its simple fallback.', err);
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
