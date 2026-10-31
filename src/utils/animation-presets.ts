import type { AnimationDirection, AnimationTrigger, RingAnimation } from '../types';
import type { SceneId } from './seasonal';
import { lm } from '../i18n/labels/mark';
import type { MessageIndex } from '../contracts/i18n';

/**
 * What a preset animates, for composition. Motion presets use the individual transform properties
 * so different ones compose; two on the same channel do not (the later wins).
 * glow is box-shadow or a drop-shadow filter; fx is its own overlay and never conflicts.
 */
export type AnimationChannel = 'rotate' | 'translate' | 'scale' | 'opacity' | 'filter' | 'glow' | 'fx';

export type AnimationGroup =
  | 'Glow & pulse'
  | 'Motion'
  | 'Playful'
  | 'Light & colour'
  | 'Rings & sweeps'
  | 'Borders'
  | 'Weather & device'
  | 'Scenes'
  | 'Backgrounds'
  | 'Seasonal'
  | 'Interaction';

export interface AnimationDefaults {
  /** CSS time per cycle. */
  duration: string;
  delay: string;
  /** Easing id from EASINGS. */
  easing: string;
  iterations: 'infinite' | number;
  direction: AnimationDirection;
  intensity: number;
}

export interface AnimationIntensity {
  /** Field label, e.g. "Rotation"; the editor appends the unit: "Rotation (deg)". */
  label: MessageIndex;
  unit: string;
  min: number;
  max: number;
  step?: number;
}

export interface AnimationPreset {
  id: string;
  name: MessageIndex;
  group: AnimationGroup;
  channels: AnimationChannel[];
  defaults: AnimationDefaults;
  intensity: AnimationIntensity;
  /**
   * fx presets: 'count' renders `intensity` particles (max 12); a number renders that many fixed
   * layers (waves, a sweep) and intensity means something else.
   */
  particles?: 'count' | number;
  /** fx overlay drawn above the content (sweeps, flashes) instead of behind it. */
  front?: boolean;
  /** Keyframes `mc-anim-<id>-icon` for an icon target (glows use filter there, not box-shadow). */
  iconKeyframes?: boolean;
  /** transform-origin for motion presets that need one (flames grow from the bottom). */
  origin?: string;
  /** A filter / motion preset that paints the animation colour (flame, neon, glitch): has Strength. */
  colour?: boolean;
  /** fx presets drawn as a ring along the element's outline (mc-ring); intensity is the stroke width. */
  ring?: RingAnimation;
  /** Play of a new entry (Tap ripple and Press start "On tap"). */
  trigger?: AnimationTrigger;
  /**
   * Seasonal presets: the scene drawn by <mc-seasonal> inside the element (intensity is its density
   * in %); `weather` follows the module's weather entity, `daynight` follows sun.sun.
   */
  seasonal?: SceneId | 'weather' | 'daynight';
}

/** Strength (0-100%) of the painted colour, for presets that paint one (see hasStrength). */
export const DEFAULT_STRENGTH = 100;

/** Whether the preset paints the animation colour (glows, particle layers, coloured filters). */
export const hasStrength = (p: AnimationPreset): boolean =>
  p.channels.includes('glow') || p.channels.includes('fx') || !!p.colour;

export const MAX_PARTICLES = 12;

/** Easing ids offered in the editor. Raw cubic-bezier() / steps() in YAML also work. */
export const EASINGS: Array<{ id: string; label: MessageIndex; css: string }> = [
  { id: 'linear', label: lm('labels.animation-presets.linear'), css: 'linear' },
  { id: 'ease', label: lm('labels.animation-presets.ease'), css: 'ease' },
  { id: 'ease-in', label: lm('labels.animation-presets.ease-in'), css: 'ease-in' },
  { id: 'ease-out', label: lm('labels.animation-presets.ease-out'), css: 'ease-out' },
  { id: 'ease-in-out', label: lm('labels.animation-presets.ease-in-out'), css: 'ease-in-out' },
  { id: 'spring', label: lm('labels.animation-presets.spring'), css: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { id: 'smooth', label: lm('labels.animation-presets.smooth'), css: 'cubic-bezier(0.45, 0, 0.55, 1)' },
  { id: 'snap', label: lm('labels.animation-presets.snap'), css: 'cubic-bezier(0.7, 0, 0.3, 1)' },
];

// ── intensity kinds ──
const deg = (label: MessageIndex, max = 1080): AnimationIntensity => ({ label, unit: 'deg', min: 0, max });
const pct = (label: MessageIndex, max = 100): AnimationIntensity => ({ label, unit: '%', min: 0, max });
const px = (label: MessageIndex, max = 60): AnimationIntensity => ({ label, unit: 'px', min: 0, max });
const count = (label: MessageIndex = lm('labels.animation-presets.particles'), max = MAX_PARTICLES): AnimationIntensity => ({ label, unit: '', min: 1, max });
const COUNT = count();

interface Def {
  group: AnimationGroup;
  channels: AnimationChannel[];
  duration: number;
  easing?: string;
  intensity: [AnimationIntensity, number];
  extra?: Partial<Pick<AnimationPreset, 'particles' | 'front' | 'iconKeyframes' | 'origin' | 'colour' | 'ring' | 'trigger' | 'seasonal'>> & {
    direction?: AnimationDirection;
    iterations?: number;
  };
}

function preset(id: string, name: MessageIndex, d: Def): AnimationPreset {
  const { direction = 'normal', iterations = 'infinite', ...extra } = d.extra || {};
  return {
    id,
    name,
    group: d.group,
    channels: d.channels,
    defaults: {
      duration: `${d.duration}s`,
      delay: '0s',
      easing: d.easing ?? 'ease-in-out',
      iterations,
      direction,
      intensity: d.intensity[1],
    },
    intensity: d.intensity[0],
    ...extra,
  };
}

const GLOW = { iconKeyframes: true };

/** Seasonal presets: id, name, scene. Ids are the scene names (`preset: christmas`). */
const SEASONAL_PRESETS: Array<[string, MessageIndex, NonNullable<AnimationPreset['seasonal']>]> = [
  ['winter', lm('labels.animation-presets.winter'), 'winter'],
  ['spring', lm('labels.animation-presets.spring'), 'spring'],
  ['summer', lm('labels.animation-presets.summer'), 'summer'],
  ['autumn', lm('labels.animation-presets.autumn'), 'autumn'],
  ['christmas', lm('labels.animation-presets.christmas'), 'christmas'],
  ['new_year', lm('labels.animation-presets.new-year'), 'new_year'],
  ['valentine', lm('labels.animation-presets.valentine'), 'valentine'],
  ['easter', lm('labels.animation-presets.easter'), 'easter'],
  ['halloween', lm('labels.animation-presets.halloween'), 'halloween'],
  ['weather', lm('labels.animation-presets.live-weather'), 'weather'],
  ['daynight', lm('labels.animation-presets.day-and-night'), 'daynight'],
  ['snow', lm('labels.animation-presets.snowy'), 'snow'],
  ['rain', lm('labels.animation-presets.rainy'), 'rain'],
  ['storm', lm('labels.animation-presets.thunderstorm'), 'storm'],
  ['sun', lm('labels.animation-presets.sunny'), 'sun'],
  ['clouds', lm('labels.animation-presets.cloudy'), 'clouds'],
  ['fog', lm('labels.animation-presets.foggy'), 'fog'],
  ['wind', lm('labels.animation-presets.windy'), 'wind'],
  ['night', lm('labels.animation-presets.night-sky'), 'night'],
  ['dusk', lm('labels.animation-presets.dusk-glow'), 'dusk'],
];

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ── Glow & pulse ──
  preset('breathe', lm('labels.animation-presets.breathe'), { group: 'Glow & pulse', channels: ['scale', 'opacity'], duration: 3.2, intensity: [pct(lm('labels.animation-presets.scale'), 50), 4] }),
  preset('glow-pulse', lm('labels.animation-presets.glow-pulse'), { group: 'Glow & pulse', channels: ['glow'], duration: 2, intensity: [px(lm('labels.animation-presets.glow-size')), 16], extra: GLOW }),
  preset('halo-ripple', lm('labels.animation-presets.halo-ripple'), { group: 'Glow & pulse', channels: ['glow'], duration: 1.8, easing: 'ease-out', intensity: [px(lm('labels.animation-presets.ring-size')), 14], extra: GLOW }),
  preset('aura', lm('labels.animation-presets.aura'), { group: 'Glow & pulse', channels: ['glow'], duration: 4, intensity: [px(lm('labels.animation-presets.glow-size')), 24], extra: GLOW }),
  preset('heartbeat', lm('labels.animation-presets.heartbeat'), { group: 'Glow & pulse', channels: ['scale'], duration: 1.4, intensity: [pct(lm('labels.animation-presets.scale'), 50), 12] }),

  // ── Motion ──
  preset('spin', lm('labels.animation-presets.spin'), { group: 'Motion', channels: ['rotate'], duration: 2, easing: 'linear', intensity: [deg(lm('labels.animation-presets.rotation')), 360] }),
  preset('fast-spin', lm('labels.animation-presets.fast-spin'), { group: 'Motion', channels: ['rotate'], duration: 0.6, easing: 'linear', intensity: [deg(lm('labels.animation-presets.rotation')), 360] }),
  preset('sway', lm('labels.animation-presets.sway'), { group: 'Motion', channels: ['rotate'], duration: 2.4, intensity: [deg(lm('labels.animation-presets.angle'), 90), 6] }),
  preset('wobble', lm('labels.animation-presets.wobble'), { group: 'Motion', channels: ['translate', 'rotate'], duration: 1.2, intensity: [px(lm('labels.animation-presets.distance')), 6] }),
  preset('shake-alert', lm('labels.animation-presets.shake-alert'), { group: 'Motion', channels: ['translate'], duration: 2, intensity: [px(lm('labels.animation-presets.distance')), 4] }),
  preset('rumble', lm('labels.animation-presets.rumble'), { group: 'Motion', channels: ['translate'], duration: 0.3, easing: 'linear', intensity: [px(lm('labels.animation-presets.distance'), 10), 1] }),
  preset('float', lm('labels.animation-presets.float'), { group: 'Motion', channels: ['translate'], duration: 3, intensity: [px(lm('labels.animation-presets.distance')), 6] }),

  // ── Weather & device ──
  preset('flame-flicker', lm('labels.animation-presets.flame-flicker'), { group: 'Weather & device', channels: ['scale', 'rotate', 'filter'], duration: 1.2, intensity: [pct(lm('labels.animation-presets.flicker'), 30), 5], extra: { origin: '50% 100%', colour: true } }),
  preset('steam-rise', lm('labels.animation-presets.steam-rise'), { group: 'Weather & device', channels: ['fx'], duration: 3, easing: 'ease-out', intensity: [COUNT, 4], extra: { particles: 'count' } }),
  preset('bubbles', lm('labels.animation-presets.bubbles'), { group: 'Weather & device', channels: ['fx'], duration: 3.5, easing: 'ease-in', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('snow-fall', lm('labels.animation-presets.snow-fall'), { group: 'Weather & device', channels: ['fx'], duration: 5, easing: 'linear', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('rain-fall', lm('labels.animation-presets.rain-fall'), { group: 'Weather & device', channels: ['fx'], duration: 0.9, easing: 'linear', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('liquid-wave', lm('labels.animation-presets.liquid-wave'), { group: 'Weather & device', channels: ['fx'], duration: 6, easing: 'linear', intensity: [pct(lm('labels.animation-presets.fill-level')), 40], extra: { particles: 2 } }),
  preset('storm-flash', lm('labels.animation-presets.storm-flash'), { group: 'Weather & device', channels: ['fx'], duration: 5, easing: 'linear', intensity: [pct(lm('labels.animation-presets.brightness')), 75], extra: { particles: 1, front: true } }),

  // ── Light & colour ──
  preset('shine-sweep', lm('labels.animation-presets.shine-sweep'), { group: 'Light & colour', channels: ['fx'], duration: 3, intensity: [pct(lm('labels.animation-presets.shine')), 45], extra: { particles: 1, front: true } }),

  // ── Playful (a short move, then a rest, so they read as attention cues) ──
  preset('bounce', lm('labels.animation-presets.bounce'), { group: 'Playful', channels: ['translate', 'scale'], duration: 1.6, easing: 'ease', intensity: [px(lm('labels.animation-presets.height')), 10], extra: { origin: '50% 100%' } }),
  preset('jello', lm('labels.animation-presets.jello'), { group: 'Playful', channels: ['scale'], duration: 1.8, easing: 'ease', intensity: [pct(lm('labels.animation-presets.squash'), 50), 12] }),
  preset('rubber-band', lm('labels.animation-presets.rubber-band'), { group: 'Playful', channels: ['scale'], duration: 1.6, easing: 'ease', intensity: [pct(lm('labels.animation-presets.stretch'), 50), 25] }),
  preset('tada', lm('labels.animation-presets.tada'), { group: 'Playful', channels: ['scale', 'rotate'], duration: 2, easing: 'ease', intensity: [deg(lm('labels.animation-presets.angle'), 45), 3] }),
  preset('swing', lm('labels.animation-presets.swing'), { group: 'Playful', channels: ['rotate'], duration: 2, easing: 'ease-in-out', intensity: [deg(lm('labels.animation-presets.angle'), 90), 15], extra: { origin: '50% 0' } }),
  preset('flip', lm('labels.animation-presets.flip'), { group: 'Playful', channels: ['rotate'], duration: 2.4, easing: 'smooth', intensity: [deg(lm('labels.animation-presets.rotation')), 360] }),
  preset('pop', lm('labels.animation-presets.pop'), { group: 'Playful', channels: ['scale'], duration: 1.8, easing: 'ease-out', intensity: [pct(lm('labels.animation-presets.scale'), 50), 18] }),
  preset('head-shake', lm('labels.animation-presets.head-shake'), { group: 'Playful', channels: ['translate', 'rotate'], duration: 1.6, easing: 'ease-in-out', intensity: [px(lm('labels.animation-presets.distance'), 30), 6] }),

  // ── Light & colour ──
  preset('blink', lm('labels.animation-presets.blink'), { group: 'Light & colour', channels: ['opacity'], duration: 1, easing: 'linear', intensity: [pct(lm('labels.animation-presets.dim')), 85] }),
  preset('neon-flicker', lm('labels.animation-presets.neon-flicker'), { group: 'Light & colour', channels: ['opacity', 'filter'], duration: 3, easing: 'linear', intensity: [px(lm('labels.animation-presets.glow-size'), 30), 8], extra: { colour: true } }),
  preset('rainbow-hue', lm('labels.animation-presets.rainbow-hue'), { group: 'Light & colour', channels: ['filter'], duration: 6, easing: 'linear', intensity: [deg(lm('labels.animation-presets.hue-range'), 720), 360] }),
  preset('glitch', lm('labels.animation-presets.glitch'), { group: 'Light & colour', channels: ['translate', 'filter'], duration: 2.5, easing: 'linear', intensity: [px(lm('labels.animation-presets.offset'), 20), 3], extra: { colour: true } }),
  preset('fade-pulse', lm('labels.animation-presets.fade-pulse'), { group: 'Light & colour', channels: ['opacity'], duration: 2.4, intensity: [pct(lm('labels.animation-presets.fade')), 60] }),

  // ── Rings & sweeps ──
  preset('ping', lm('labels.animation-presets.ping'), { group: 'Rings & sweeps', channels: ['fx'], duration: 2, easing: 'ease-out', intensity: [pct(lm('labels.animation-presets.ring-size'), 200), 90], extra: { particles: 1 } }),
  preset('ripple-rings', lm('labels.animation-presets.ripple-rings'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'ease-out', intensity: [count(lm('labels.animation-presets.rings'), 6), 3], extra: { particles: 'count' } }),
  preset('radar-sweep', lm('labels.animation-presets.radar-sweep'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'linear', intensity: [deg(lm('labels.animation-presets.beam-width'), 180), 70], extra: { particles: 1 } }),
  preset('conic-border-spin', lm('labels.animation-presets.conic-border-spin'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'linear', intensity: [px(lm('labels.animation-presets.border-width'), 12), 2], extra: { particles: 1 } }),
  preset('breathing-border', lm('labels.animation-presets.breathing-border'), { group: 'Rings & sweeps', channels: ['glow'], duration: 3, intensity: [px(lm('labels.animation-presets.border-width'), 12), 2], extra: GLOW }),

  // ── Scenes ──
  preset('fireflies', lm('labels.animation-presets.fireflies'), { group: 'Scenes', channels: ['fx'], duration: 6, intensity: [COUNT, 8], extra: { particles: 'count' } }),
  preset('confetti', lm('labels.animation-presets.confetti'), { group: 'Scenes', channels: ['fx'], duration: 3.5, easing: 'linear', intensity: [COUNT, 10], extra: { particles: 'count' } }),
  preset('falling-leaves', lm('labels.animation-presets.falling-leaves'), { group: 'Scenes', channels: ['fx'], duration: 7, easing: 'linear', intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('lightning', lm('labels.animation-presets.lightning'), { group: 'Scenes', channels: ['fx'], duration: 4, easing: 'linear', intensity: [pct(lm('labels.animation-presets.brightness')), 90], extra: { particles: 1, front: true } }),
  preset('ocean-waves', lm('labels.animation-presets.ocean-waves'), { group: 'Scenes', channels: ['fx'], duration: 4, easing: 'linear', intensity: [pct(lm('labels.animation-presets.wave-height')), 35], extra: { particles: 3 } }),
  preset('sun-rays', lm('labels.animation-presets.sun-rays'), { group: 'Scenes', channels: ['fx'], duration: 24, easing: 'linear', intensity: [deg(lm('labels.animation-presets.ray-width'), 30), 6], extra: { particles: 1 } }),
  preset('heat-shimmer', lm('labels.animation-presets.heat-shimmer'), { group: 'Scenes', channels: ['translate', 'filter'], duration: 1.2, easing: 'ease-in-out', intensity: [px(lm('labels.animation-presets.strength'), 10), 2] }),
  preset('wind-lines', lm('labels.animation-presets.wind-lines'), { group: 'Scenes', channels: ['fx'], duration: 2.2, intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('drip', lm('labels.animation-presets.drip'), { group: 'Scenes', channels: ['fx'], duration: 2.4, easing: 'ease-in', intensity: [COUNT, 3], extra: { particles: 'count' } }),
  preset('equalizer-bars', lm('labels.animation-presets.equalizer-bars'), { group: 'Scenes', channels: ['fx'], duration: 0.9, intensity: [count(lm('labels.animation-presets.bars')), 5], extra: { particles: 'count', direction: 'alternate' } }),
  preset('charging-stripes', lm('labels.animation-presets.charging-stripes'), { group: 'Scenes', channels: ['fx'], duration: 1, easing: 'linear', intensity: [pct(lm('labels.animation-presets.stripe-strength')), 100], extra: { particles: 1 } }),
  preset('orbit-dots', lm('labels.animation-presets.orbit-dots'), { group: 'Scenes', channels: ['fx'], duration: 2.4, easing: 'linear', intensity: [count(lm('labels.animation-presets.dots'), 8), 3], extra: { particles: 'count' } }),
  preset('typing-dots', lm('labels.animation-presets.typing-dots'), { group: 'Scenes', channels: ['fx'], duration: 1.2, intensity: [px(lm('labels.animation-presets.bounce'), 20), 4], extra: { particles: 3 } }),

  // ── Motion (batch 6) ──
  preset('pendulum', lm('labels.animation-presets.pendulum'), { group: 'Motion', channels: ['rotate'], duration: 2.4, intensity: [deg(lm('labels.animation-presets.angle'), 90), 20], extra: { origin: '50% 0', direction: 'alternate' } }),
  preset('orbit', lm('labels.animation-presets.orbit'), { group: 'Motion', channels: ['translate'], duration: 4, easing: 'linear', intensity: [px(lm('labels.animation-presets.radius'), 40), 6] }),
  preset('coin-spin', lm('labels.animation-presets.coin-spin'), { group: 'Motion', channels: ['rotate'], duration: 3, easing: 'linear', intensity: [deg(lm('labels.animation-presets.rotation')), 360] }),
  preset('rotate-3d', lm('labels.animation-presets.3d-rotate'), { group: 'Motion', channels: ['rotate'], duration: 3, intensity: [deg(lm('labels.animation-presets.tilt'), 180), 25], extra: { direction: 'alternate' } }),
  preset('squash-stretch', lm('labels.animation-presets.squash-stretch'), { group: 'Motion', channels: ['scale', 'translate'], duration: 1.4, intensity: [pct(lm('labels.animation-presets.squash'), 50), 14], extra: { origin: '50% 100%' } }),
  preset('wiggle', lm('labels.animation-presets.wiggle'), { group: 'Motion', channels: ['rotate'], duration: 2.5, intensity: [deg(lm('labels.animation-presets.angle'), 45), 8] }),
  preset('shadow-lift', lm('labels.animation-presets.shadow-lift'), { group: 'Motion', channels: ['translate', 'glow'], duration: 3, intensity: [px(lm('labels.animation-presets.lift'), 20), 4], extra: GLOW }),

  // ── Light & colour (batch 6) ──
  preset('holographic-shimmer', lm('labels.animation-presets.holographic-shimmer'), { group: 'Light & colour', channels: ['fx'], duration: 5, easing: 'linear', intensity: [pct(lm('labels.animation-presets.strength')), 35], extra: { particles: 1, front: true } }),
  preset('scanline', lm('labels.animation-presets.scanline'), { group: 'Light & colour', channels: ['fx'], duration: 3, easing: 'linear', intensity: [pct(lm('labels.animation-presets.brightness')), 50], extra: { particles: 1, front: true } }),
  preset('twinkle', lm('labels.animation-presets.twinkle'), { group: 'Light & colour', channels: ['fx'], duration: 2.4, intensity: [COUNT, 6], extra: { particles: 'count', front: true } }),
  preset('spotlight', lm('labels.animation-presets.spotlight'), { group: 'Light & colour', channels: ['fx'], duration: 7, intensity: [pct(lm('labels.animation-presets.brightness')), 45], extra: { particles: 1 } }),

  // ── Borders: rings along the exact outline (mc-ring), a neon glow ──
  preset('border-snake', lm('labels.animation-presets.border-snake'), { group: 'Borders', channels: ['fx'], duration: 3, easing: 'linear', intensity: [px(lm('labels.animation-presets.width'), 12), 3], extra: { ring: 'snake' } }),
  preset('neon-border', lm('labels.animation-presets.neon-border'), { group: 'Borders', channels: ['glow'], duration: 2.4, intensity: [px(lm('labels.animation-presets.glow-size'), 30), 10], extra: GLOW }),
  preset('power-flow', lm('labels.animation-presets.power-flow-dots'), { group: 'Borders', channels: ['fx'], duration: 4, easing: 'linear', intensity: [px(lm('labels.animation-presets.dot-size'), 12), 5], extra: { ring: 'dots' } }),
  preset('marching-ants', lm('labels.animation-presets.marching-ants'), { group: 'Borders', channels: ['fx'], duration: 20, easing: 'linear', intensity: [px(lm('labels.animation-presets.width'), 12), 2], extra: { ring: 'dashes' } }),

  // ── Backgrounds: scenes behind the content ──
  preset('aurora', lm('labels.animation-presets.aurora'), { group: 'Backgrounds', channels: ['fx'], duration: 12, intensity: [pct(lm('labels.animation-presets.glow')), 55], extra: { particles: 3 } }),
  preset('lava-lamp', lm('labels.animation-presets.lava-lamp'), { group: 'Backgrounds', channels: ['fx'], duration: 9, intensity: [COUNT, 5], extra: { particles: 'count', direction: 'alternate' } }),
  preset('plasma-gradient', lm('labels.animation-presets.plasma-gradient'), { group: 'Backgrounds', channels: ['fx'], duration: 10, easing: 'linear', intensity: [pct(lm('labels.animation-presets.strength')), 70], extra: { particles: 1 } }),
  preset('gradient-flow', lm('labels.animation-presets.gradient-flow'), { group: 'Backgrounds', channels: ['fx'], duration: 8, easing: 'linear', intensity: [pct(lm('labels.animation-presets.strength')), 60], extra: { particles: 1, direction: 'alternate' } }),
  preset('color-cycle-bg', lm('labels.animation-presets.colour-cycle-background'), { group: 'Backgrounds', channels: ['fx'], duration: 10, easing: 'linear', intensity: [pct(lm('labels.animation-presets.strength')), 35], extra: { particles: 1 } }),
  preset('starfield', lm('labels.animation-presets.starfield'), { group: 'Backgrounds', channels: ['fx'], duration: 3.5, intensity: [COUNT, 12], extra: { particles: 'count' } }),
  preset('meteor-shower', lm('labels.animation-presets.meteor-shower'), { group: 'Backgrounds', channels: ['fx'], duration: 3, easing: 'ease-in', intensity: [COUNT, 4], extra: { particles: 'count' } }),
  preset('bokeh', lm('labels.animation-presets.bokeh'), { group: 'Backgrounds', channels: ['fx'], duration: 8, intensity: [COUNT, 7], extra: { particles: 'count', direction: 'alternate' } }),
  preset('matrix-rain', lm('labels.animation-presets.matrix-rain'), { group: 'Backgrounds', channels: ['fx'], duration: 2.4, easing: 'linear', intensity: [count(lm('labels.animation-presets.streams')), 10], extra: { particles: 'count' } }),
  preset('smoke', lm('labels.animation-presets.smoke'), { group: 'Backgrounds', channels: ['fx'], duration: 6, easing: 'ease-out', intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('clouds-drift', lm('labels.animation-presets.clouds-drift'), { group: 'Backgrounds', channels: ['fx'], duration: 30, easing: 'linear', intensity: [count(lm('labels.animation-presets.clouds'), 6), 3], extra: { particles: 'count' } }),
  preset('water-ripple', lm('labels.animation-presets.water-ripple'), { group: 'Backgrounds', channels: ['fx'], duration: 4, easing: 'ease-out', intensity: [count(lm('labels.animation-presets.ripples'), 8), 3], extra: { particles: 'count' } }),
  preset('fireworks', lm('labels.animation-presets.fireworks'), { group: 'Backgrounds', channels: ['fx'], duration: 2.2, easing: 'ease-out', intensity: [count(lm('labels.animation-presets.sparks')), 10], extra: { particles: 'count' } }),

  // ── Seasonal: the card's seasonal scenes inside one element (src/card/mc-seasonal.ts) ──
  ...SEASONAL_PRESETS.map(([id, name, scene]) =>
    preset(id, name, { group: 'Seasonal', channels: ['fx'], duration: 1, easing: 'linear', intensity: [pct(lm('labels.animation-presets.density')), 50], extra: { seasonal: scene } }),
  ),

  // ── Interaction: play once per tap, from the pointer ──
  preset('tap-ripple', lm('labels.animation-presets.tap-ripple'), { group: 'Interaction', channels: ['fx'], duration: 0.6, easing: 'ease-out', intensity: [pct(lm('labels.animation-presets.brightness')), 35], extra: { particles: 1, front: true, trigger: 'tap', iterations: 1 } }),
  preset('press', lm('labels.animation-presets.press'), { group: 'Interaction', channels: ['scale'], duration: 0.3, easing: 'ease-out', intensity: [pct(lm('labels.animation-presets.depth'), 30), 6], extra: { trigger: 'tap', iterations: 1 } }),
];

export const ANIMATION_GROUPS: AnimationGroup[] = [
  'Glow & pulse',
  'Motion',
  'Playful',
  'Light & colour',
  'Rings & sweeps',
  'Borders',
  'Weather & device',
  'Scenes',
  'Backgrounds',
  'Seasonal',
  'Interaction',
].filter((g) => ANIMATION_PRESETS.some((p) => p.group === g)) as AnimationGroup[];

/** Display names of the groups (the group id is the English name; render with t(GROUP_LABELS[group])). */
export const GROUP_LABELS: Record<AnimationGroup, MessageIndex> = {
  'Glow & pulse': lm('labels.animation-presets.glow-pulse-2'),
  Motion: lm('labels.animation-presets.motion'),
  Playful: lm('labels.animation-presets.playful'),
  'Light & colour': lm('labels.animation-presets.light-colour'),
  'Rings & sweeps': lm('labels.animation-presets.rings-sweeps'),
  Borders: lm('labels.animation-presets.borders'),
  'Weather & device': lm('labels.animation-presets.weather-device'),
  Scenes: lm('labels.animation-presets.scenes'),
  Backgrounds: lm('labels.animation-presets.backgrounds'),
  Seasonal: lm('labels.animation-presets.seasonal'),
  Interaction: lm('labels.animation-presets.interaction'),
};

const BY_ID = new Map(ANIMATION_PRESETS.map((x) => [x.id, x]));
export const getAnimationPreset = (id: string | undefined): AnimationPreset | undefined =>
  id ? BY_ID.get(id) : undefined;

/** "Rotation (deg)", "Scale (%)", "Particles"; `tr` resolves a label (t of the labels namespace). */
export const intensityLabel = (p: AnimationPreset, tr: (id: MessageIndex) => string): string =>
  p.intensity.unit ? `${tr(p.intensity.label)} (${p.intensity.unit})` : tr(p.intensity.label);
