import { css, unsafeCSS } from 'lit';
import { ANIMATION_PRESETS, getAnimationPreset } from '../utils/animation-presets';
import { FX_STYLES, KEYFRAMES } from './animation-keyframes';
import { SCENE_FX_STYLES, SCENE_KEYFRAMES, SCENE_LAYER_STYLES } from './animation-scenes';
import { EXTRA_FX_STYLES, EXTRA_KEYFRAMES } from './animation-extra';

/** Every preset's keyframes / particle styles / layer styles, by key (see the source files). */
export const ALL_KEYFRAMES: Record<string, string> = { ...KEYFRAMES, ...SCENE_KEYFRAMES, ...EXTRA_KEYFRAMES };
export const ALL_FX_STYLES: Record<string, string> = { ...FX_STYLES, ...SCENE_FX_STYLES, ...EXTRA_FX_STYLES };
export const ALL_LAYER_STYLES: Record<string, string> = { ...SCENE_LAYER_STYLES };

/*
 * Design animations (DesignConfig.animations, resolved by resolveAnimations). On the animated
 * wrapper (module, row or column) the card sets:
 *   data-mc-anim="module icon"     which elements animate
 *   --mc-anim-m / -i / -mi         comma-separated animation lists: wrapper, icon, both (a module
 *                                  whose icon is missing animates itself with both)
 *   --mc-anim-om / -oi             transform-origin, --mca-<id>-i / -c / -s intensity, colour, strength
 *   data-mc-anim-fx                when it renders particle layers (.mc-anim-fx[data-fx] > i)
 *   data-mc-tap / --mc-anim-t      "On tap" animations of the element, played while data-mc-tapped
 *                                  (set again on every tap by src/card/tap-fx.ts)
 * "icon" animates the module's main icon (.mc-anim-icon). Ring presets render an mc-ring
 * (.mc-anim-ring) instead of a particle layer.
 */

/**
 * Replace the $i / $c tokens with the preset's custom properties (defaults as fallbacks). In
 * keyframes (`scaled`) the colour is mixed down by the entry's Strength (--mca-<id>-s, 0-1);
 * particle layers keep the full colour and fade as a whole (their opacity, see generated()).
 */
function tokens(body: string, id: string, scaled = false): string {
  const p = getAnimationPreset(id);
  const c = `var(--mca-${id}-c, var(--mc-anim-c))`;
  return body
    .replace(/\$i/g, `var(--mca-${id}-i, ${p?.defaults.intensity ?? 1})`)
    .replace(/\$c/g, scaled ? `color-mix(in srgb, ${c} calc(var(--mca-${id}-s, 1) * 100%), transparent)` : c);
}

function generated(): string {
  const keyframes = Object.entries(ALL_KEYFRAMES).map(
    ([name, body]) => `@keyframes mc-anim-${name} {${tokens(body, name.replace(/-icon$/, ''), true)}\n}`,
  );
  // Strength of a particle preset: its layer's opacity
  const strength = ANIMATION_PRESETS.filter((p) => p.particles !== undefined).map(
    (p) => `.mc-anim-fx[data-fx="${p.id}"] {\n  opacity: var(--mca-${p.id}-s, 1);\n}`,
  );
  const layers = Object.entries(ALL_LAYER_STYLES).map(
    ([id, body]) => `.mc-anim-fx[data-fx="${id}"] {${tokens(body, id)}\n}`,
  );
  const fx = Object.entries(ALL_FX_STYLES).map(([key, body]) => {
    const [id, extra = ''] = key.split('|');
    return `.mc-anim-fx[data-fx="${id}"] > i${extra} {${tokens(body, id)}\n}`;
  });
  return [...keyframes, ...strength, ...layers, ...fx].join('\n');
}

export const animationStyles = css`
  [data-mc-anim],
  [data-mc-anim-fx] {
    --mc-anim-c: var(--mc-anim-color, var(--mc-design-color, var(--primary-color, #03a9f4)));
  }

  [data-mc-anim~='module'] {
    animation: var(--mc-anim-m);
    transform-origin: var(--mc-anim-om, center);
  }

  /* Transforms need a box (ha-icon is inline). inline-block, not inline-flex: a flex container's
     baseline is synthesized from its bottom edge (ha-svg-icon has no text baseline), which drops the
     module's baseline to the icon's bottom and adds the line's descent under it (+4px stretch).
     As a flex item it blockifies to block, the same box an unanimated ha-icon gets. */
  [data-mc-anim~='icon'] .mc-anim-icon {
    display: inline-block;
    animation: var(--mc-anim-i);
    transform-origin: var(--mc-anim-oi, center);
  }

  /* a module without its icon (a button with no icon set) animates itself with both lists */
  [data-mc-anim~='icon']:not(:has(.mc-anim-icon)) {
    animation: var(--mc-anim-mi);
    transform-origin: var(--mc-anim-om, var(--mc-anim-oi, center));
  }

  /* particle layers: decorative, behind the content (front: above), clipped to the wrapper's shape */
  [data-mc-anim-fx] {
    position: relative;
    isolation: isolate;
  }
  .mc-anim-fx {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;
    container-type: size;
  }
  .mc-anim-fx[data-front] {
    z-index: auto;
  }
  .mc-anim-fx > i {
    position: absolute;
    display: block;
    left: var(--mc-anim-x, 50%);
    opacity: 0;
    will-change: translate, scale, rotate, opacity;
    animation: var(--mc-fx-anim);
    animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-phase, 0) * var(--mc-fx-dur, 1s));
  }

  /* On tap: the element plays its tap list (after its own) once per tap, from data-mc-tapped */
  [data-mc-tap][data-mc-tapped] {
    animation: var(--mc-anim-m, none), var(--mc-anim-t);
    transform-origin: var(--mc-anim-om, center);
  }
  /* tap layers stay hidden until a tap starts them (at the pointer: --mc-tap-x / -y) */
  .mc-anim-fx[data-tap]:not([data-tapped]),
  .mc-anim-ring[data-tap]:not([data-tapped]) {
    display: none;
  }

  ${unsafeCSS(generated())}

  @media (prefers-reduced-motion: reduce) {
    [data-mc-anim],
    [data-mc-anim] .mc-anim-icon,
    [data-mc-tap],
    .mc-anim-fx > i {
      animation: none !important;
    }
    .mc-anim-fx:not([data-p]),
    .mc-anim-ring {
      display: none;
    }
  }
`;
