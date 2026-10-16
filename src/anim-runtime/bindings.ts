import type { CompiledV2 } from '../anim-studio/compile-v2';
import type { Binding, TargetRef } from '../anim-studio/model-v2-core';
import type { HassEntity } from '../types';
import { entityNumber, isUnavailable } from './entity';
import { adoptRuntimeSheet, moduleIcon, setRules, wrapperKey } from './sheet';
import type { ApplyCtx } from './types';

/*
 * v2 runtime, value bindings: the driving entity's value (state or an attribute), normalised to
 * 0..1 over the binding's input range and clamped, is written as `--mcb-<n>` on the wrapper (a rule
 * in the runtime sheet, so the card's re-renders never drop it). The bound property reads the
 * variable through calc() (rotate, x, y, scale: one transform per target, composed after the
 * animation's own translate / rotate / scale; opacity; draw; color_mix), with a CSS transition of
 * `smoothing` seconds. speed sets the playback rate of the document's animations on the target;
 * rotate_speed spins the target (Web Animations, composite add) at output degrees per second.
 * Unavailable or non-numeric values skip the binding (the last value stays). Reduced motion: no
 * speed changes and no spinning; static bindings still apply.
 *
 * Several documents on one wrapper: document k (first-seen order) uses --mcb-<8k + n>.
 */

export const BINDINGS_PER_DOC = 8;
const MAX_RATE = 16;

const r4 = (n: number): number => Math.round(n * 1e4) / 1e4;

/** The binding's input as 0..1 (clamped), or undefined when the entity has no usable value. */
export function bindingValue(b: Binding, stateObj: HassEntity | undefined): number | undefined {
  if (!stateObj || isUnavailable(stateObj)) return undefined;
  const v = entityNumber(stateObj, b.input.attribute);
  if (v === undefined || b.input.max === b.input.min) return undefined;
  const t = (v - b.input.min) / (b.input.max - b.input.min);
  return r4(Math.min(1, Math.max(0, t)));
}

/** `--mcb-<base + i>` values of the bindings that have a value now. */
export function bindingValues(bindings: Binding[], stateObj: HassEntity | undefined, base = 0): Record<string, string> {
  const out: Record<string, string> = {};
  bindings.forEach((b, i) => {
    const t = bindingValue(b, stateObj);
    if (t !== undefined) out[`--mcb-${base + i}`] = String(t);
  });
  return out;
}

/** A numeric output at t (0..1). */
export const lerpOutput = (b: Binding, t: number): number => {
  const [a, c] = b.output as [number, number];
  return r4(a + (c - a) * t);
};

/** `calc(a<u> + (b - a)<u> * var(--mcb-n, 0))`, or the constant when both ends match. */
function lerpCss(b: Binding, n: number, unit = ''): string {
  const [a, c] = b.output as [number, number];
  if (a === c) return `${r4(a)}${unit}`;
  return `calc(${r4(a)}${unit} + ${r4(c - a)}${unit} * var(--mcb-${n}, 0))`;
}

/** The property a color_mix binding paints on a target. */
const colorProperty = (target: TargetRef): string => (target === 'background' ? 'background-color' : target.startsWith('shape:') ? 'fill' : 'color');

/** Declarations of the static bindings (not speed / rotate_speed), per target. */
export function bindingDecls(bindings: Binding[], base = 0): Map<TargetRef, Array<[string, string]>> {
  const per = new Map<TargetRef, { transform: string[]; decls: Array<[string, string]>; smooth: Map<string, number> }>();
  bindings.forEach((b, i) => {
    if (b.property === 'speed' || b.property === 'rotate_speed') return;
    const n = base + i;
    let t = per.get(b.target);
    if (!t) per.set(b.target, (t = { transform: [], decls: [], smooth: new Map() }));
    let prop: string;
    switch (b.property) {
      case 'rotate':
        t.transform.push(`rotate(${lerpCss(b, n, 'deg')})`);
        prop = 'transform';
        break;
      case 'x':
        t.transform.push(`translateX(${lerpCss(b, n, 'px')})`);
        prop = 'transform';
        break;
      case 'y':
        t.transform.push(`translateY(${lerpCss(b, n, 'px')})`);
        prop = 'transform';
        break;
      case 'scale':
        t.transform.push(`scale(${lerpCss(b, n)})`);
        prop = 'transform';
        break;
      case 'opacity':
        t.decls.push(['opacity', lerpCss(b, n)]);
        prop = 'opacity';
        break;
      case 'draw':
        // the rig draws parts with pathLength=1
        t.decls.push(['stroke-dasharray', '1'], ['stroke-dashoffset', `calc(1 - ${lerpCss(b, n)})`]);
        prop = 'stroke-dashoffset';
        break;
      case 'color_mix': {
        const [from, to] = b.output as [string, string];
        prop = colorProperty(b.target);
        t.decls.push([prop, `color-mix(in srgb, ${to} calc(var(--mcb-${n}, 0) * 100%), ${from})`]);
        break;
      }
      default:
        return;
    }
    if (b.smoothing) t.smooth.set(prop, Math.max(t.smooth.get(prop) ?? 0, b.smoothing));
  });
  const out = new Map<TargetRef, Array<[string, string]>>();
  for (const [target, t] of per) {
    const decls: Array<[string, string]> = [];
    // translate, then rotate, then scale (the bound transform composes after the animation's own)
    const order = (s: string) => (s.startsWith('translate') ? 0 : s.startsWith('rotate') ? 1 : 2);
    if (t.transform.length) decls.push(['transform', [...t.transform].sort((a, b) => order(a) - order(b)).join(' ')]);
    decls.push(...t.decls);
    if (t.smooth.size) decls.push(['transition', [...t.smooth].map(([p, s]) => `${p} ${r4(s)}s ease-out`).join(', ')]);
    out.set(target, decls);
  }
  return out;
}

const isRig = (t: TargetRef): boolean => /^(part|group|shape):/.test(t);
const rigId = (t: TargetRef): string => t.slice(t.indexOf(':') + 1);

/**
 * Selector of a card-level target inside the wrapper `[data-mc-rt="k"]`: the wrapper's own part
 * only, never one of a module nested in it (a layout module's binding must not reach its children;
 * the same scoping as the card-part tracks in targets.ts).
 */
export function cardSelector(k: string, target: TargetRef, icon: boolean): string {
  const w = `[data-mc-rt="${k}"]`;
  if (target === 'element') return icon ? `${w} .mc-anim-icon:not(${w} .mc-module-wrapper .mc-anim-icon)` : w;
  return `${w} [data-mc-part="${target}"]:not(${w} .mc-module-wrapper [data-mc-part])`;
}

/** The module's icon element (the rig lives in its shadow root). */
const iconOf = moduleIcon;

/** Elements a speed / rotate_speed binding drives. */
function targetElements(wrapper: HTMLElement, target: TargetRef, icon: boolean): Element[] {
  if (target === 'element') return [icon ? (iconOf(wrapper) ?? wrapper) : wrapper];
  if (isRig(target)) return [...(iconOf(wrapper)?.shadowRoot?.querySelectorAll(`[data-p="${rigId(target)}"]`) ?? [])];
  // the wrapper's own parts, not those of a module nested in it
  return [...wrapper.querySelectorAll(`[data-mc-part="${target}"]`)].filter((el) => {
    const owner = el.parentElement?.closest('.mc-module-wrapper');
    return !owner || owner === wrapper || !wrapper.contains(owner);
  });
}

// ── per wrapper state ──

interface DocBindings {
  base: number;
  bindings: Binding[];
  /** The bindings' content (JSON), to spot an edited document. */
  sig: string;
  icon: boolean;
  /** Last value per binding index (kept while the entity has none). */
  values: Map<number, number>;
  reducedMotion: boolean;
  /** The entity is unavailable now: spins stop (rate 0), other values keep their last one. */
  unavailable: boolean;
}
interface Spin {
  el: Element;
  anim: Animation;
}
interface WrapBindings {
  docs: Map<string, DocBindings>;
  root?: ShadowRoot;
  spins: Map<string, Spin>;
}
const memory = new WeakMap<HTMLElement, WrapBindings>();
const ramps = new WeakMap<Animation, number>();

/** Ease an animation's playback rate to `to` over `seconds` (immediately without smoothing or rAF). */
function setRate(anim: Animation, to: number, seconds: number | undefined): void {
  const prev = ramps.get(anim);
  if (prev !== undefined && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(prev);
  ramps.delete(anim);
  const from = anim.playbackRate;
  if (from === to) return;
  const set = (r: number) => {
    if (typeof anim.updatePlaybackRate === 'function' && anim.playState === 'running') anim.updatePlaybackRate(r);
    else anim.playbackRate = r;
  };
  if (!seconds || typeof requestAnimationFrame !== 'function') {
    set(to);
    return;
  }
  const start = performance.now();
  const step = () => {
    const k = Math.min(1, (performance.now() - start) / (seconds * 1000));
    set(r4(from + (to - from) * k));
    if (k < 1) ramps.set(anim, requestAnimationFrame(step));
    else ramps.delete(anim);
  };
  ramps.set(anim, requestAnimationFrame(step));
}

/** The document's animations on an element (CSS animations whose name is the run key or one of its lanes). */
const ownAnimations = (el: Element, run: string): Animation[] =>
  (el.getAnimations?.() ?? []).filter((a) => {
    const name = (a as Animation & { animationName?: string }).animationName;
    return typeof name === 'string' && (name === run || name.startsWith(`${run}-`));
  });

/** Apply the speed and rotate_speed bindings (after the render's style is current). */
function applyMotion(wrapper: HTMLElement): void {
  const w = memory.get(wrapper);
  if (!w || !wrapper.isConnected) return;
  const live = new Set<string>();
  for (const [run, d] of w.docs) {
    d.bindings.forEach((b, i) => {
      if (b.property !== 'speed' && b.property !== 'rotate_speed') return;
      const stopped = d.unavailable && b.property === 'rotate_speed';
      const t = stopped ? 0 : d.values.get(i);
      if (t === undefined || d.reducedMotion) return;
      const els = targetElements(wrapper, b.target, d.icon);
      if (b.property === 'speed') {
        const rate = Math.min(MAX_RATE, Math.max(0, lerpOutput(b, t)));
        for (const el of els) for (const a of ownAnimations(el, run)) setRate(a, rate, b.smoothing);
        return;
      }
      // rotate_speed: degrees per second
      const rate = stopped ? 0 : Math.max(-MAX_RATE, Math.min(MAX_RATE, lerpOutput(b, t) / 360));
      els.forEach((el, j) => {
        const key = `${run}|${i}|${j}`;
        live.add(key);
        let s = w.spins.get(key);
        if (s && (s.el !== el || !el.isConnected)) {
          s.anim.cancel();
          s = undefined;
        }
        if (!s) {
          if (typeof (el as HTMLElement).animate !== 'function') return;
          const anim = (el as HTMLElement).animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 1000, iterations: Infinity, composite: 'add' });
          anim.finished?.catch(() => {});
          anim.playbackRate = 0;
          w.spins.set(key, (s = { el, anim }));
        }
        setRate(s.anim, rate, b.smoothing);
      });
    });
  }
  for (const [key, s] of w.spins) {
    if (live.has(key)) continue;
    s.anim.cancel();
    w.spins.delete(key);
  }
}

/** Re-apply playback rates (the clips module calls this after it switched what plays). */
export function refreshSpeeds(wrapper: HTMLElement): void {
  if (memory.has(wrapper)) applyMotion(wrapper);
}

function writeRules(wrapper: HTMLElement, w: WrapBindings): void {
  const k = wrapperKey(wrapper);
  const vars: string[] = [];
  const rules: string[] = [];
  const rig: string[] = [];
  for (const d of w.docs.values()) {
    for (const [i, v] of d.values) vars.push(`--mcb-${d.base + i}: ${v};`);
    for (const [target, decls] of bindingDecls(d.bindings, d.base)) {
      const body = decls.map(([p, v]) => `${p}: ${v};`).join(' ');
      if (isRig(target)) rig.push(`:host([data-mc-rt-icon="${k}"]) [data-p="${rigId(target)}"] { ${body} }`);
      else {
        const inline = target === 'icon' || (target === 'element' && d.icon) ? ' display: inline-block;' : '';
        rules.push(`${cardSelector(k, target, d.icon)} {${inline} ${body} }`);
      }
    }
  }
  const css = [vars.length ? `[data-mc-rt="${k}"] { ${vars.join(' ')} }` : '', ...rules, ...rig].filter(Boolean).join('\n');
  setRules(`b:${k}`, css, w.root);
  if (rig.length) {
    // rig targets live in the icon's shadow root: the same sheet, matched through the icon host
    const icon = iconOf(wrapper);
    if (icon) {
      if (icon.getAttribute('data-mc-rt-icon') !== k) icon.setAttribute('data-mc-rt-icon', k);
      adoptRuntimeSheet(icon.shadowRoot);
    }
  }
}

/** Apply this document's bindings to the wrapper; idempotent per render. */
export function apply(wrapper: HTMLElement, v2: CompiledV2, ctx: ApplyCtx): void {
  const run = ctx.run;
  let w = memory.get(wrapper);
  const list = v2.bindings ?? [];
  if (!run || !list.length) {
    if (run && w?.docs.delete(run)) {
      writeRules(wrapper, w);
      applyMotion(wrapper);
    }
    return;
  }
  if (!w) memory.set(wrapper, (w = { docs: new Map(), spins: new Map() }));
  w.root = ctx.shadowRoot;
  // each render hands new objects: compare the bindings by content
  const sig = JSON.stringify(list);
  let d = w.docs.get(run);
  if (!d || d.sig !== sig) {
    // the lowest free slot block (a pruned document's block is reused)
    let base = d?.base;
    if (base === undefined) {
      const used = new Set([...w.docs.values()].map((x) => x.base));
      base = 0;
      while (used.has(base)) base += BINDINGS_PER_DOC;
    }
    d = { base, bindings: list, sig, icon: !!ctx.icon, values: d?.bindings.length === list.length ? d.values : new Map(), reducedMotion: ctx.reducedMotion, unavailable: false };
    w.docs.set(run, d);
  }
  d.icon = !!ctx.icon;
  d.reducedMotion = ctx.reducedMotion;
  d.unavailable = isUnavailable(ctx.stateObj);
  list.forEach((b, i) => {
    const t = bindingValue(b, ctx.stateObj);
    if (t !== undefined) d.values.set(i, t);
  });
  writeRules(wrapper, w);
  // after this render's other runtime modules (clips may switch what plays): style is current then
  queueMicrotask(() => applyMotion(wrapper));
}

/** After a render: forget documents no longer on the wrapper (their vars, rules and spins). */
export function prune(wrapper: HTMLElement, keep: string[]): void {
  const w = memory.get(wrapper);
  if (!w) return;
  let changed = false;
  for (const run of [...w.docs.keys()]) {
    if (keep.includes(run)) continue;
    w.docs.delete(run);
    changed = true;
  }
  if (!w.docs.size) {
    release(wrapper);
    return;
  }
  if (changed) {
    writeRules(wrapper, w);
    applyMotion(wrapper);
  }
}

/** The wrapper left the page: drop its rules and stop its spins. */
export function release(wrapper: HTMLElement): void {
  const w = memory.get(wrapper);
  if (!w) return;
  memory.delete(wrapper);
  for (const s of w.spins.values()) s.anim.cancel();
  setRules(`b:${wrapperKey(wrapper)}`, '');
}
