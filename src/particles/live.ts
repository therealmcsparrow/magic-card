import { DEFAULT_GEOMETRY, PARTICLES_V2_CAPS, type BakeGeometry, type ParticlesSpecV2 } from '../contracts/particles-v2';
import { watchOffscreen, unwatchOffscreen } from '../icons/offscreen';
import { deriveSeed, mulberry32, uniform, type Rng } from './rng';
import { createWorld, radiusOf, sample, shapeOf, spawnParent, stepParticle, type Emit, type Hit, type Particle, type World } from './sim';
import { childCount, spawnChildren } from './children';
import type { SlotLook } from './css';
import { emitterPlan, type DocPlan, type Plan } from './emitters';

// The live engine: the same world, spawn and step as the bake, run in real time. Particles respawn when they die,
// persistent flows never die, children come from a pool of slots after the parents. One shared requestAnimationFrame loop
// drives every live layer that is on screen while the page is visible. Reduced motion never gets here.

const DT = PARTICLES_V2_CAPS.dt;
/** Longest frame gap that is caught up, s (a long stall jumps instead of fast-forwarding). */
const MAX_FRAME = 0.1;
const STEP_ROOM = Math.ceil(MAX_FRAME / DT) + 1;

/** Slot layout of a live layer: parents first (the bake's parent looks), then the children pool. */
export interface LiveLayout {
  parents: number;
  children: number;
  looks: SlotLook[];
}

const rnd2 = (v: number): number => Math.round(v * 100) / 100;

/**
 * An emitter's slots, from the seed alone (no geometry): the parents' looks equal the bake's. `p` (emitters.ts):
 * its parents and child slots; missing: the 1.1.0 numbers for the spec alone.
 */
export function liveLayout(spec: ParticlesSpecV2, period: number, p?: Pick<Plan, 'n' | 'm'>): LiveLayout {
  const w = createWorld(spec, period, DEFAULT_GEOMETRY);
  const n = p ? p.n : Math.min(Math.max(0, Math.floor(spec.count)), PARTICLES_V2_CAPS.parents);
  const rng = mulberry32(spec.sim.seed);
  const looks: SlotLook[] = [];
  for (let i = 0; i < n; i++) {
    const q = spawnParent(w, rng, i);
    looks.push({ shape: q.shape, size: rnd2(q.size), ...(q.color !== undefined ? { color: q.color } : {}) });
  }
  const c = spec.sim.children;
  const per = childCount(c);
  const m = p ? p.m : c && n ? Math.min(n * per, PARTICLES_V2_CAPS.elements - n) : 0;
  const crng = mulberry32(deriveSeed(spec.sim.seed, 5));
  for (let j = 0; j < m; j++) {
    const shape = shapeOf(crng, c!.shapes);
    const size = uniform(crng, c!.size);
    const color = c!.colors.length ? c!.colors[j % c!.colors.length] : looks[Math.floor(j / Math.max(1, per)) % n].color;
    looks.push({ shape, size: rnd2(size), ...(color !== undefined ? { color } : {}) });
  }
  return { parents: n, children: m, looks };
}

/** Each emitter's slot block, part 0's first. */
export const layoutsOf = (d: DocPlan, period: number): LiveLayout[] => d.plans.map((p) => liveLayout(p.spec, period, p));
export const docLooks = (d: DocPlan, period: number): SlotLook[] => layoutsOf(d, period).flatMap((l) => l.looks);

export type Face = 'floor' | 'ceiling' | 'left' | 'right' | 'content';

/** Which collider a hit was on (the layer edges first; anything else is the content box). */
export function faceOf(w: World, h: Hit, r: number): Face {
  const e = 1e-6;
  if (h.ny < 0 && h.y >= w.H - r - e) return 'floor';
  if (h.ny > 0 && h.y <= r + e) return 'ceiling';
  if (h.nx > 0 && h.x <= r + e) return 'left';
  if (h.nx < 0 && h.x >= w.W - r - e) return 'right';
  return 'content';
}

/** One drawn particle: position in % of the layer, deg, 0-1. */
export interface LiveFrame {
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  scale: number;
}

interface ParentSlot {
  p?: Particle;
  next: Particle;
  /** s until `next` starts. */
  wait: number;
  /** Its children were emitted in this life. */
  fired: boolean;
}

const emitOf = (p: Particle): Emit => ({ age: p.age, x: p.x, y: p.y, vx: p.vx, vy: p.vy });

/** The live simulation of one layer, no DOM: step() advances one fixed dt, frame() reads every slot. */
export class LiveSim {
  readonly world: World;
  readonly layout: LiveLayout;
  /** Colliders hit so far. */
  readonly faces = new Set<Face>();
  private readonly rng: Rng;
  private readonly crng: Rng;
  private readonly slots: ParentSlot[] = [];
  private readonly kids: Array<Particle | undefined>;

  constructor(spec: ParticlesSpecV2, period: number, geometry: BakeGeometry, layout: LiveLayout = liveLayout(spec, period)) {
    this.world = createWorld(spec, period, geometry);
    this.layout = layout;
    this.rng = mulberry32(spec.sim.seed);
    this.crng = mulberry32(deriveSeed(spec.sim.seed, 2));
    for (let i = 0; i < layout.parents; i++) {
      const next = this.spawn(i);
      this.slots.push({ next, wait: next.birth, fired: false });
    }
    this.kids = new Array<Particle | undefined>(layout.children).fill(undefined);
  }

  /** A fresh parent for slot i, with the slot's size (its look does not change). */
  private spawn(i: number): Particle {
    const p = spawnParent(this.world, this.rng, i);
    p.size = this.layout.looks[i].size;
    p.radius = radiusOf(p.size);
    if (p.persistent) p.life = Infinity;
    return p;
  }

  private emit(s: ParentSlot, p: Particle, e: Emit): void {
    s.fired = true;
    const c = this.world.sim.children;
    if (!c) return;
    const free: number[] = [];
    for (let k = 0; k < this.kids.length && free.length < childCount(c); k++) if (!this.kids[k]) free.push(k);
    spawnChildren(this.world, c, p, e, this.crng, free.length).forEach((ch, j) => {
      ch.size = this.layout.looks[this.layout.parents + free[j]].size;
      ch.radius = radiusOf(ch.size);
      this.kids[free[j]] = ch;
    });
  }

  step(): void {
    const w = this.world;
    const c = w.sim.children;
    this.slots.forEach((s, i) => {
      if (!s.p) {
        s.wait -= DT;
        if (s.wait > 1e-9) return;
        s.p = s.next;
        s.fired = false;
      }
      const p = s.p;
      const h = stepParticle(w, p, DT);
      if (h) {
        this.faces.add(faceOf(w, h, p.radius));
        if (c?.trigger === 'collision' && !s.fired) this.emit(s, p, { ...h, vx: p.vx, vy: p.vy });
      }
      if (c?.trigger === 'time' && !s.fired && p.age >= (c.at ?? 0) - 1e-9) this.emit(s, p, emitOf(p));
      if (p.age >= p.life - 1e-9) {
        if (c?.trigger === 'death' && !s.fired) this.emit(s, p, emitOf(p));
        s.p = undefined;
        s.next = this.spawn(i);
        s.wait = s.next.birth;
      }
    });
    this.kids.forEach((ch, k) => {
      if (!ch) return;
      const h = stepParticle(w, ch, DT);
      if (h) this.faces.add(faceOf(w, h, ch.radius));
      if (ch.age >= ch.life - 1e-9) this.kids[k] = undefined;
    });
  }

  /** Every slot as drawn now (parents, then the children pool); undefined: the slot is empty. */
  frame(): Array<LiveFrame | undefined> {
    const w = this.world;
    const at = (p: Particle | undefined): LiveFrame | undefined => {
      if (!p) return undefined;
      const s = sample(w, p);
      return { x: (s.x / w.W) * 100, y: (s.y / w.H) * 100, rotate: s.rotate, opacity: s.opacity, scale: s.scale };
    };
    return [...this.slots.map((s) => at(s.p)), ...this.kids.map(at)];
  }
}

// ── on the page ──

const PROPS = ['translate', 'rotate', 'scale', 'opacity', 'animation'];
const r = (v: number, d: number): number => {
  const f = 10 ** d;
  return Math.round(v * f) / f || 0;
};

/** Writes one frame into the layer's slots (<i> by position). `still`: and stops their CSS animation. */
export function writeFrame(layer: HTMLElement, frames: Array<LiveFrame | undefined>, still = false): void {
  const items = layer.children;
  for (let k = 0; k < items.length; k++) {
    const st = (items[k] as HTMLElement).style;
    if (still) st.setProperty('animation', 'none');
    const f = frames[k];
    if (!f || f.opacity <= 0) {
      if (st.getPropertyValue('opacity') !== '0') st.setProperty('opacity', '0');
      continue;
    }
    st.setProperty('translate', `${r(f.x, 2)}cqw ${r(f.y, 2)}cqh`);
    st.setProperty('rotate', `${r(f.rotate, 1)}deg`);
    st.setProperty('opacity', String(r(f.opacity, 3)));
    if (f.scale !== 1) st.setProperty('scale', String(r(f.scale, 3)));
    else st.removeProperty('scale');
  }
}

/** Removes what writeFrame put on the slots. */
export function clearFrame(layer: HTMLElement): void {
  for (const el of layer.children) for (const p of PROPS) (el as HTMLElement).style.removeProperty(p);
}

interface Entry {
  el: HTMLElement;
  sims: LiveSim[];
  key: string;
  on: boolean;
  acc: number;
}

const entries = new Map<HTMLElement, Entry>();
let raf = 0;
let last = 0;
let listening = false;

const pageVisible = (): boolean => typeof document === 'undefined' || document.visibilityState !== 'hidden';
const anyOn = (): boolean => {
  for (const e of entries.values()) if (e.on) return true;
  return false;
};

function halt(): void {
  if (raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
}

function schedule(): void {
  if (raf || !pageVisible() || !anyOn() || typeof requestAnimationFrame !== 'function') return;
  raf = requestAnimationFrame(frame);
}

function frame(ts: number): void {
  raf = 0;
  const dt = last ? Math.min(MAX_FRAME, Math.max(0, (ts - last) / 1000)) : DT;
  last = ts;
  for (const e of [...entries.values()]) {
    if (!e.el.isConnected) {
      stopLive(e.el);
      continue;
    }
    if (!e.on) continue;
    e.acc += dt;
    for (let n = 0; e.acc >= DT - 1e-9 && n < STEP_ROOM; n++) {
      for (const s of e.sims) s.step();
      e.acc -= DT;
    }
    writeFrame(e.el, e.sims.flatMap((s) => s.frame()));
  }
  if (anyOn() && pageVisible()) raf = requestAnimationFrame(frame);
  else last = 0;
}

function onVisibility(): void {
  if (pageVisible()) schedule();
  else halt();
}

/** The simulations of one part: one per emitter, over that emitter's block of the part's pool. */
export function partSims(spec: ParticlesSpecV2, period: number, geometry: BakeGeometry, part: 0 | 1): LiveSim[] {
  const d = emitterPlan(spec);
  const ls = layoutsOf(d, period);
  return d.plans.flatMap((p, i) => (i >= d.cut === !!part ? [new LiveSim(p.spec, period, geometry, ls[i])] : []));
}

/**
 * Runs `layer` (the document's `part`) live, one simulation per emitter of the part. Idempotent: the same
 * `key` (layer name: spec, period, geometry, part) keeps the running simulations; another key starts over.
 */
export function startLive(layer: HTMLElement, spec: ParticlesSpecV2, period: number, geometry: BakeGeometry, key: string, part: 0 | 1 = 0): void {
  if (entries.get(layer)?.key === key) return;
  stopLive(layer);
  if (!listening && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
    listening = true;
  }
  const sims = partSims(spec, period, geometry, part);
  const e: Entry = { el: layer, sims, key, on: false, acc: 0 };
  entries.set(layer, e);
  const watched = watchOffscreen(layer, (on) => {
    if (entries.get(layer) !== e) return;
    e.on = on;
    if (on) schedule();
    else if (!anyOn()) halt();
  });
  // no IntersectionObserver: nothing will report, so it counts as on screen
  if (!watched) {
    e.on = true;
    schedule();
  }
}

/** Stops and forgets `layer` (no-op when it is not live). */
export function stopLive(layer: HTMLElement): void {
  if (!entries.delete(layer)) return;
  unwatchOffscreen(layer);
  clearFrame(layer);
  if (!anyOn()) halt();
}

export const isLive = (layer: HTMLElement): boolean => entries.has(layer);

/** Tests and diagnostics: live layers, how many are stepping, whether a frame is requested. */
export function liveState(): { layers: number; active: number; scheduled: boolean } {
  let active = 0;
  for (const e of entries.values()) if (e.on) active++;
  return { layers: entries.size, active, scheduled: raf !== 0 };
}

export function __resetLiveForTests(): void {
  for (const el of [...entries.keys()]) stopLive(el);
  halt();
  if (listening && typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility);
  listening = false;
}
