import { html, nothing, TemplateResult } from 'lit';
import type { FxLayer, ResolvedAnimations } from '../utils/animation';
import type { ResolvedBorderLength } from '../utils/css-utils';
import type { ResolvedRing } from '../utils/ring';
import type { ShapeStroke } from '../utils/css-utils';
import type { ResolvedShape } from './mc-shape';
import type { HomeAssistant } from '../types';
import type { ResolvedValueBackground } from '../utils/value-background';
import type { ResolvedSeasonal } from '../utils/seasonal';
import { sceneDecorations, sceneFlashes, type BudgetGrant, type SeasonalBudget } from '../utils/seasonal-scenes';
import { decoInsets } from '../utils/seasonal-deco-insets';
import { loadSeasonal } from '../utils/lazy-chunks';
import './mc-ring';
import './mc-shape';
import './mc-value-bg';

/*
 * Decorative layers the card adds inside a module / row / column wrapper or the card itself:
 * animation particle layers, shortened border lines, the ring, the shape and the value background.
 * All aria-hidden, never in the layout.
 */

/** Shortened border lines (border_length), drawn over the wrapper's transparent border. */
export function renderBorderFx(border: ResolvedBorderLength | undefined): TemplateResult | typeof nothing {
  if (!border) return nothing;
  return html`<span class="mc-border-fx" aria-hidden="true" style=${border.overlayStyle}>${border.lines.map(
    (l) => html`<i style=${l.style}></i>`,
  )}</span>`;
}

/** A seasonal layer of these animations draws lightning (its element carries `data-mc-flash`). */
export function animFlashes(anim: ResolvedAnimations | undefined): boolean {
  return !!anim?.fx.some((l) => l.seasonal && sceneFlashes(l.seasonal.scenes));
}

/**
 * Decorative layers of the animations, one per entry: particle layers (steam, bubbles, snow, ...)
 * or, for ring presets, an mc-ring along the outline. "On tap" layers carry data-tap. A particles v2
 * layer carries data-p and its apply context (`mcSim`), and per slot its shape (data-s) or symbol. Seasonal
 * layers take their particles from the card's `budget` (scaled down when the card has too many).
 */
export function renderAnimFx(
  anim: ResolvedAnimations | undefined,
  shape?: ResolvedShape,
  seed = 'mc',
  dark = false,
  budget?: SeasonalBudget,
): TemplateResult | typeof nothing {
  if (!anim?.fx.length) return nothing;
  return html`${anim.fx.map((l) => {
    if (l.seasonal) void loadSeasonal();
    const g: BudgetGrant | undefined = l.seasonal && budget?.preset(l.seasonal.scenes, l.seasonal.intensity);
    return l.seasonal
      ? html`<mc-seasonal class="mc-anim-seasonal" data-fx=${l.preset} style=${l.style || nothing} .scenes=${l.seasonal.scenes}
            .intensity=${g?.intensity ?? l.seasonal.intensity} ?noflash=${!!g?.noflash} .seed=${`${seed}|${l.preset}`}></mc-seasonal>${l.seasonal.decorations
            ? renderSeasonalDeco(l.seasonal.scenes, shape, seed, dark)
            : nothing}`
      : l.ring
      ? html`<mc-ring class="mc-anim-ring" data-fx=${l.preset} ?data-tap=${!!l.tap} style=${l.style} .ring=${l.ring} .shape=${shape}></mc-ring>`
      : html`<span class="mc-anim-fx" data-fx=${l.preset} ?data-front=${l.front} ?data-tap=${!!l.tap} ?data-p=${!!l.sim} .mcSim=${l.sim} style=${l.style} aria-hidden="true">${l.particles.map(
          (p) => html`<i data-s=${p.shape ?? nothing} style="--mc-anim-x: ${p.x}%; --mc-anim-phase: ${p.phase}; --mc-anim-k: ${p.k}${p.style ? `; ${p.style}` : ''}">${particleSymbol(p.symbol ?? l.symbol)}</i>`,
        )}</span>`;
  })}`;
}

/** A custom particle's content: an icon, a text symbol (emoji), or nothing (a dot / SVG mask in CSS). */
function particleSymbol(symbol: FxLayer['symbol']): TemplateResult | string | typeof nothing {
  if (!symbol) return nothing;
  return 'icon' in symbol ? html`<ha-icon .icon=${symbol.icon}></ha-icon>` : symbol.text;
}

/** The shape-following ring (src/card/mc-ring.ts); its parent carries `data-mc-ring`. */
export function renderRing(ring: ResolvedRing | undefined, shape?: ResolvedShape): TemplateResult | typeof nothing {
  return ring ? html`<mc-ring .ring=${ring} .shape=${shape}></mc-ring>` : nothing;
}

/** The outline shape layer (src/card/mc-shape.ts): clip, content inset and border stroke; its parent carries `data-mc-shape`. */
export function renderShape(shape: ResolvedShape | undefined, stroke?: ShapeStroke, edge?: readonly number[]): TemplateResult | typeof nothing {
  return shape ? html`<mc-shape .shape=${shape} .stroke=${stroke} .edge=${edge}></mc-shape>` : nothing;
}

/**
 * A shaped element with a shadow: wrapped in a drop-shadow box (the clip-path would cut a box-shadow
 * off). `card`: the shaped card, always wrapped (the theme's card shadow can arrive later).
 */
export function withShapeShadow(el: TemplateResult, shadow: string | undefined, card = false): TemplateResult {
  if (card) return html`<div class="mc-shape-shadow mc-card-shadow" style=${shadow ? `filter: ${shadow}` : nothing}>${el}</div>`;
  return shadow ? html`<div class="mc-shape-shadow" style="filter: ${shadow}">${el}</div>` : el;
}

/**
 * The value background layer (src/card/mc-value-bg.ts): a tank fill or a history sparkline behind
 * the content; its parent carries `data-mc-value-bg`. Nothing without one (no element, no cost).
 */
export function renderValueBg(value: ResolvedValueBackground | undefined, hass: HomeAssistant | undefined): TemplateResult | typeof nothing {
  return value ? html`<mc-value-bg .value=${value} .hass=${hass}></mc-value-bg>` : nothing;
}

/** Border decorations of `scenes` along the parent's outline; nothing when the scenes have none. */
function renderSeasonalDeco(scenes: ResolvedSeasonal['scenes'], shape: ResolvedShape | undefined, seed: string, dark: boolean): TemplateResult | typeof nothing {
  return sceneDecorations(scenes).length
    ? html`<mc-seasonal-deco class="mc-seasonal-deco" .scenes=${scenes} .shape=${shape} .seed=${seed} ?dark=${dark}></mc-seasonal-deco>`
    : nothing;
}

/**
 * The card's seasonal scene (config `seasonal`) inside its content: `back` is the particle layer
 * behind the content plus the border decorations, `front` the layer over the content (dimmed,
 * never taking clicks). Nothing without a scene.
 */
export function renderSeasonal(
  seasonal: ResolvedSeasonal | undefined,
  part: 'back' | 'front',
  opts: { shape?: ResolvedShape; seed: string; dark: boolean; grant?: BudgetGrant },
): TemplateResult | typeof nothing {
  if (!seasonal) return nothing;
  void loadSeasonal();
  const layer =
    seasonal.layer === part
      ? html`<mc-seasonal class="mc-card-seasonal" .scenes=${seasonal.scenes} .intensity=${opts.grant?.intensity ?? seasonal.intensity}
          .layer=${seasonal.layer} ?noflash=${!!opts.grant?.noflash} .seed=${opts.seed}></mc-seasonal>`
      : nothing;
  if (part === 'front') return layer;
  return html`${layer}${seasonal.decorations ? renderSeasonalDeco(seasonal.scenes, opts.shape, opts.seed, opts.dark) : nothing}`;
}

/**
 * Padding (px per side) an element keeps so its seasonal decorations never cover the content: the
 * largest of its seasonal presets' and (the card) its own scene's. Undefined without decorations.
 */
export function seasonalInsets(anim: ResolvedAnimations | undefined, seasonal?: ResolvedSeasonal): number[] | undefined {
  const scenes = [
    ...(anim?.fx.flatMap((l) => (l.seasonal?.decorations ? l.seasonal.scenes : [])) ?? []),
    ...(seasonal?.decorations ? seasonal.scenes : []),
  ];
  return scenes.length ? decoInsets(sceneDecorations(scenes)) : undefined;
}
