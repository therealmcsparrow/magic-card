import type { CompiledV2 } from '../anim-studio/compile-v2';
import type { Clip, ClipWhen } from '../anim-studio/model-v2-core';
import type { HassEntity } from '../types';
import { entityNumber, isUnavailable, simplyActive } from './entity';
import { refreshSpeeds } from './bindings';
import { moduleIcon } from './sheet';
import type { ApplyCtx, HintCtx, RuntimeHints } from './types';

// v2 runtime, per-state clips: hints() picks the first clip whose condition matches the driving entity (no match plays the
// document timeline). A per-document memory keeps the clip across re-renders; a change runs the incoming clip transition
// (cut, crossfade, finish) and a newer state replaces a pending switch.

export const CROSSFADE_MS = 200;
const HALF = CROSSFADE_MS / 2;
const MEMORY_MAX = 512;

/**
 * One clip condition against an available entity. `active`: the entity is on for its domain (the
 * card passes isEntityActive's answer; without it, any state but off / idle / standby is on).
 */
export function clipMatches(when: ClipWhen, stateObj: HassEntity, active = simplyActive(stateObj)): boolean {
  if ('state' in when) return stateObj.state === when.state;
  if ('state_not' in when) return stateObj.state !== when.state_not;
  if ('entity_on' in when) return active === when.entity_on;
  const n = entityNumber(stateObj);
  if (n === undefined) return false;
  return 'above' in when ? n > when.above : n < when.below;
}

/** The first clip whose condition holds; none for a missing, unavailable or unknown entity. */
export function pickClip(clips: Clip[] | undefined, stateObj: HassEntity | undefined, active?: boolean): Clip | undefined {
  if (!clips?.length || !stateObj || isUnavailable(stateObj)) return undefined;
  return clips.find((c) => clipMatches(c.when, stateObj, active));
}

type Host = HTMLElement & { requestUpdate?: () => void };

interface Pending {
  key: string;
  clip?: Clip;
  transition: 'crossfade' | 'finish';
  timer?: ReturnType<typeof setTimeout>;
  /** Fade-outs running (crossfade), cancelled once the new clip is rendered. */
  fades: Map<HTMLElement, Animation>;
  hosts: Set<Host>;
  /** Wrappers waiting on this switch (a timer with none left is dropped). */
  wrappers: Set<HTMLElement>;
}

interface Memory {
  /** What plays: the clip's animation, or 'self'. */
  key: string;
  clip?: Clip;
  pending?: Pending;
  /** Wrappers to fade back in after a crossfade switch, with their fade-out to cancel. */
  fadeIn?: Map<HTMLElement, Animation | undefined>;
}

const memory = new Map<string, Memory>();
/** Wrappers whose card is paused or off screen: a switch applies its end state, no fades. */
const held = new WeakSet<HTMLElement>();

/** Pause or resume the wrapper's running fades; while held, new switches skip them. */
export function setPlaying(wrapper: HTMLElement, on: boolean): void {
  if (on) held.delete(wrapper);
  else held.add(wrapper);
  const fades = [fadeIns.get(wrapper), fadeIns.get(moduleIcon(wrapper) ?? wrapper)];
  for (const m of memory.values()) fades.push(m.fadeIn?.get(wrapper), m.pending?.fades.get(wrapper));
  for (const a of fades) {
    if (on) a?.play();
    else a?.pause();
  }
}
/** Memory keys per wrapper (prune / release). */
const byWrapper = new WeakMap<HTMLElement, Map<string, string>>();

/** A Web Animation whose cancel never surfaces as an unhandled rejection. */
const quiet = (a: Animation | undefined): Animation | undefined => {
  a?.finished?.catch(() => {});
  return a;
};

const memKey = (run: string | undefined, entityId: string | undefined): string => `${run ?? ''}|${entityId ?? ''}`;
const keyOf = (clip: Clip | undefined): string => clip?.animation ?? 'self';
const hintOf = (clip: Clip | undefined): RuntimeHints => (clip && clip.animation !== 'self' ? { clip } : {});

function cancelPending(m: Memory): void {
  const p = m.pending;
  if (!p) return;
  if (p.timer !== undefined) clearTimeout(p.timer);
  for (const a of p.fades.values()) a.cancel();
  m.pending = undefined;
}

/** Resolve time: the clip the card renders for this document now. */
export function hints(v2: CompiledV2, ctx: HintCtx): RuntimeHints {
  if (!v2.clips?.length) return {};
  const clip = pickClip(v2.clips, ctx.stateObj, ctx.active);
  const key = keyOf(clip);
  const id = memKey(ctx.run, ctx.stateObj?.entity_id);
  const m = memory.get(id);
  if (!m) {
    // first render: no transition (an edited document gets a new run key: drop the oldest)
    if (memory.size >= MEMORY_MAX) memory.delete(memory.keys().next().value!);
    memory.set(id, { key, clip });
    return hintOf(clip);
  }
  if (m.pending) {
    if (m.pending.key === key) return hintOf(m.clip);
    cancelPending(m);
  }
  if (key === m.key) {
    m.clip = clip ?? m.clip;
    return hintOf(m.clip);
  }
  const transition = clip?.transition ?? m.clip?.transition ?? 'cut';
  if (transition === 'cut' || !ctx.run) {
    m.key = key;
    m.clip = clip;
    return hintOf(clip);
  }
  // keep the current clip on screen until apply() has run the transition
  m.pending = { key, clip, transition, fades: new Map(), hosts: new Set(), wrappers: new Set() };
  return hintOf(m.clip);
}

/** The element a document plays on (its icon for icon entries). */
const elementOf = (wrapper: HTMLElement, icon: boolean | undefined): HTMLElement => (icon ? moduleIcon(wrapper) : null) ?? wrapper;

/** Which animation names belong to what the document shows now (its own: the run key and its lanes / tracks). */
function nameTest(run: string, m: Memory): (name: string) => boolean {
  if (m.key === 'self') return (n) => n === run || n.startsWith(`${run}-`);
  // what the card renders for the clip: a preset's mc-anim-<id>, a document's mcc-<id>-<hash>
  const prefix = m.key.startsWith('custom:') ? `mcc-${m.key.slice(7)}-` : `mc-anim-${m.key}`;
  return (n) => n.startsWith(prefix);
}

/**
 * The animations under a wrapper: the wrapper and its subtree (card parts) plus the icon's shadow
 * root (rig parts render there as [data-p] elements).
 */
function animationsUnder(wrapper: HTMLElement): Animation[] {
  const out = [...(wrapper.getAnimations?.({ subtree: true }) ?? [])];
  const icon = moduleIcon(wrapper);
  const root = icon?.shadowRoot as (ShadowRoot & { getAnimations?: () => Animation[] }) | null | undefined;
  for (const a of root?.getAnimations?.() ?? []) if (!out.includes(a)) out.push(a);
  return out;
}

/** ms left in the running cycle of the matching animations (0 when unknown). */
export function remainingMs(anims: Animation[], matches: (name: string) => boolean): number {
  let ms = 0;
  for (const a of anims) {
    const name = (a as Animation & { animationName?: string }).animationName;
    if (!name || !matches(name)) continue;
    const t = a.effect?.getComputedTiming();
    const dur = Number(t?.duration);
    const local = Number(t?.localTime);
    if (!t || !Number.isFinite(dur) || dur <= 0 || !Number.isFinite(local) || t.progress === null) continue;
    const into = Math.max(0, local - Number(t.delay ?? 0)) % dur;
    ms = Math.max(ms, (dur - into) / (Math.abs(a.playbackRate) || 1));
  }
  return Math.round(ms);
}

/** Running fade-ins per element (a fade-out starts from where they are). */
const fadeIns = new WeakMap<HTMLElement, Animation>();

function switchNow(m: Memory, p: Pending): void {
  if (m.pending !== p) return;
  m.pending = undefined;
  m.key = p.key;
  m.clip = p.clip;
  if (p.transition === 'crossfade') m.fadeIn = new Map([...p.fades.keys()].map((w) => [w, p.fades.get(w)]));
  for (const h of p.hosts) if (h.isConnected) h.requestUpdate?.();
}

/** After the render: run pending transitions and fade back in after a crossfade. */
export function apply(wrapper: HTMLElement, v2: CompiledV2, ctx: ApplyCtx): void {
  if (!v2.clips?.length || !ctx.run) return;
  const id = memKey(ctx.run, ctx.stateObj?.entity_id);
  let mine = byWrapper.get(wrapper);
  if (!mine) byWrapper.set(wrapper, (mine = new Map()));
  mine.set(ctx.run, id);
  const m = memory.get(id);
  if (!m) return;
  const el = elementOf(wrapper, ctx.icon);
  if (m.fadeIn?.has(wrapper)) {
    const out = m.fadeIn.get(wrapper);
    m.fadeIn.delete(wrapper);
    out?.cancel();
    if (!ctx.reducedMotion && !held.has(wrapper) && typeof el.animate === 'function') {
      const fin = quiet(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: HALF, easing: 'ease-out' }))!;
      fadeIns.set(el, fin);
    }
    refreshSpeeds(wrapper);
  }
  const p = m.pending;
  if (!p) return;
  const host = ctx.shadowRoot?.host as Host | undefined;
  if (host) p.hosts.add(host);
  p.wrappers.add(wrapper);
  if (p.transition === 'crossfade') {
    if (!p.fades.has(wrapper) && !ctx.reducedMotion && !held.has(wrapper) && typeof el.animate === 'function') {
      // a quick flip back: start from the opacity a running fade-in has reached
      const from: string | number = fadeIns.get(el)?.playState === 'running' ? getComputedStyle(el).opacity || 1 : 1;
      fadeIns.get(el)?.cancel();
      fadeIns.delete(el);
      p.fades.set(wrapper, quiet(el.animate([{ opacity: from }, { opacity: 0 }], { duration: HALF, fill: 'forwards', easing: 'ease-in' }))!);
    }
    p.timer ??= setTimeout(() => switchNow(m, p), ctx.reducedMotion || held.has(wrapper) ? 0 : HALF);
    return;
  }
  if (p.timer === undefined) {
    const ms = ctx.reducedMotion || held.has(wrapper) ? 0 : remainingMs(animationsUnder(wrapper), nameTest(ctx.run, m));
    p.timer = setTimeout(() => switchNow(m, p), ms);
  }
}

/** The clip a document is showing for an entity: its animation, or 'self' (tests, studio). */
export function currentClip(run: string, entityId?: string): string | undefined {
  return memory.get(memKey(run, entityId))?.key;
}

/** After a render: forget the wrapper's documents not kept (their pending switch and fades). */
export function prune(wrapper: HTMLElement, keep: string[]): void {
  const mine = byWrapper.get(wrapper);
  if (!mine) return;
  for (const [run, id] of [...mine]) {
    if (keep.includes(run)) continue;
    mine.delete(run);
    forget(wrapper, id);
  }
}

function forget(wrapper: HTMLElement, id: string): void {
  const m = memory.get(id);
  if (!m) return;
  m.fadeIn?.get(wrapper)?.cancel();
  m.fadeIn?.delete(wrapper);
  const p = m.pending;
  if (!p) return;
  p.fades.get(wrapper)?.cancel();
  p.fades.delete(wrapper);
  p.wrappers.delete(wrapper);
  if (p.wrappers.size || p.timer === undefined) return;
  // nobody left to show the switch: drop the timer (the next apply arms a new one)
  clearTimeout(p.timer);
  p.timer = undefined;
  p.hosts.clear();
}

/** The wrapper left the page: cancel its fades (the per-entity memory stays for other wrappers). */
export function release(wrapper: HTMLElement): void {
  const mine = byWrapper.get(wrapper);
  if (!mine) return;
  byWrapper.delete(wrapper);
  held.delete(wrapper);
  for (const id of mine.values()) forget(wrapper, id);
}

/** Tests: forget every clip decision. */
export function __resetClipsForTests(): void {
  for (const m of memory.values()) cancelPending(m);
  memory.clear();
}
