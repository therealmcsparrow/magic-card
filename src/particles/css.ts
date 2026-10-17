import type { BakedElement, BakedLoop, BakedStop, BakeGeometry, ParticleSlotV2, ParticlesSpecV2, WeightedShape } from '../contracts/particles-v2';
import { docVar, hashString, svgMaskUrl } from '../anim-studio/compile';
import { sanitizeSvg } from '../icons/svg-sanitize';
import { stopDecl } from './bake';

/*
 * Baked loops as layer CSS for the card (particles-v2 bakedCss). The layer keeps the card's markup
 * (`.mc-anim-fx[data-fx=<name>] > i`, one <i> per slot) and timing (`--mc-fx-anim`: duration,
 * iterations, delay). Each slot gets its own keyframes by position (`:nth-child`), linear timing (the
 * stops are already the motion), its size and colour. Positions are % of the layer as cqw / cqh
 * (the layer is a size container), with the slot centred on them.
 */

/** What a slot looks like: the same for a baked element and a live slot. */
export interface SlotLook {
  shape: WeightedShape['shape'];
  /** px. */
  size: number;
  color?: string;
}

const r2 = (n: number): number => Math.round(n * 100) / 100 || 0;

/** `mcc-<id>-<hash>`: changes with the spec and the period, so an edit restarts the layer. */
export const layerBase = (docId: string, spec: ParticlesSpecV2, period: number): string => `mcc-${docId}-${hashString(JSON.stringify([spec, period]))}`;

/** The quantised geometry as a name part: aspect in quarter steps, then the content box (`g8`, `g8c25_50_50_30`). */
export function geometryKey(g: BakeGeometry): string {
  const c = g.content;
  return `${Math.round(g.aspect * 4)}${c ? `c${c.x}_${c.y}_${c.w}_${c.h}` : ''}`;
}

/** The data-fx / keyframes prefix of one geometry variant: `mcc-<id>-<hash>-g<geometryKey>`. */
export const layerName = (base: string, g: BakeGeometry): string => `${base}-g${geometryKey(g)}`;

/** The slot of a look: built-in shapes by attribute (SHAPES_CSS), icons and emoji as content, own SVGs by mask (layer CSS). */
export function slotOf(look: SlotLook): ParticleSlotV2 {
  const s = look.shape;
  const slot: ParticleSlotV2 = { x: 0, phase: 0, k: 0, style: '' };
  if ('builtin' in s) slot.shape = s.builtin;
  else if ('icon' in s) slot.symbol = { icon: s.icon };
  else if ('emoji' in s) slot.symbol = { text: s.emoji };
  return slot;
}

/** Linear value of the stops at loop time t (0-1), as CSS plays them. */
export function stopAt(stops: BakedStop[], t: number): BakedStop {
  if (!stops.length) return { t, x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 };
  const j = stops.findIndex((s) => s.t >= t);
  if (j <= 0) return { ...stops[j === 0 ? 0 : stops.length - 1], t };
  const a = stops[j - 1];
  const b = stops[j];
  const u = b.t > a.t ? (t - a.t) / (b.t - a.t) : 0;
  const m = (k: 'x' | 'y' | 'rotate' | 'scale' | 'opacity') => a[k] + (b[k] - a[k]) * u;
  return { t, x: m('x'), y: m('y'), rotate: m('rotate'), scale: m('scale'), opacity: m('opacity') };
}

/**
 * Rules of a layer: the layer and slot base, per slot its size, colour and (baked) keyframes name,
 * own SVG shapes as masks. `keyframes(k)` gives slot k's @keyframes body; none: a live layer (the
 * engine writes the motion, so the slots run no animation).
 */
export function layerCss(name: string, docId: string, looks: SlotLook[], keyframes?: (k: number) => string): string {
  const L = `.mc-anim-fx[data-fx="${name}"]`;
  const kf = `mcp${hashString(name)}-`;
  const out = [
    `${L}{opacity:var(${docVar(docId, 's')},1)}`,
    `${L}>i{left:0;top:0;width:var(--mcc-sz);height:var(--mcc-sz);margin:calc(var(--mcc-sz)/-2) 0 0 calc(var(--mcc-sz)/-2);` +
      `color:var(--mcc-pc,var(${docVar(docId, 'c')},var(--mc-anim-c)));display:flex;align-items:center;justify-content:center;` +
      `font-size:var(--mcc-sz);line-height:1;font-style:normal;--mdc-icon-size:var(--mcc-sz);${keyframes ? 'animation-timing-function:linear' : 'animation:none'}}`,
  ];
  const masks = new Map<string, number[]>();
  looks.forEach((l, k) => {
    if ('svg' in l.shape) masks.set(l.shape.svg, [...(masks.get(l.shape.svg) ?? []), k]);
    const anim = keyframes ? `animation-name:${kf}${k};` : '';
    out.push(`${L}>i:nth-child(${k + 1}){${anim}--mcc-sz:${r2(l.size)}px${l.color ? `;--mcc-pc:${l.color}` : ''}}`);
    if (keyframes) out.push(`@keyframes ${kf}${k}{${keyframes(k)}}`);
  });
  // own SVG shapes: always through the sanitiser (never raw markup in a rule); unusable: a dot
  masks.forEach((slots, svg) => {
    const markup = sanitizeSvg(svg).markup;
    const look = markup ? `-webkit-mask:${svgMaskUrl(markup)} center/contain no-repeat;mask:${svgMaskUrl(markup)} center/contain no-repeat` : 'border-radius:50%';
    out.push(`${L}>i:is(${slots.map((k) => `:nth-child(${k + 1})`).join(',')}){background:currentColor;${look}}`);
  });
  return out.join('\n');
}

const lookOf = (e: BakedElement): SlotLook => ({ shape: e.shape, size: e.size, ...(e.color !== undefined ? { color: e.color } : {}) });

/**
 * A baked loop as layer CSS and its slots (particles-v2 ParticlesModule.bakedCss). Stops as
 * bake.stopDecl writes them (stats.bytes counts these). `pool` (the card: liveLayout's looks): the
 * slots are the whole pool and element k takes pool look k, as in the live engine, so the slots never
 * change between geometries (a bake with fewer children leaves the rest of the pool unanimated, at
 * the base opacity 0).
 */
export function bakedCss(loop: BakedLoop, name: string, docId: string, pool?: SlotLook[]): { css: string; slots: ParticleSlotV2[] } {
  const looks = loop.elements.map((e, k) => pool?.[k] ?? lookOf(e));
  const css = layerCss(name, docId, looks, (k) => loop.elements[k].stops.map(stopDecl).join(''));
  return { css, slots: (pool ?? looks).map(slotOf) };
}

/** The live layer's static rules (shapes, sizes, colours) and its slots. */
export function liveCss(looks: SlotLook[], name: string, docId: string): { css: string; slots: ParticleSlotV2[] } {
  return { css: layerCss(name, docId, looks), slots: looks.map(slotOf) };
}
