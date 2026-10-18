import type { AnimationDirection, AnimationTrigger, RingAnimation } from '../types';
import type { SceneId } from './seasonal';
import { lm } from '../i18n/labels/mark';
import type { MessageId } from '../contracts/i18n';

/**
 * What a preset animates, for composition. Motion presets use the individual transform properties
 * (rotate / translate / scale), so different ones compose on one element; two animations of the
 * same channel on the same element do not, the later one wins.
 * - glow: box-shadow on a module / row / column, a drop-shadow filter on an icon
 * - fx: its own particle overlay (or ring along the outline) inside the wrapper, never conflicts
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
  label: MessageId;
  unit: string;
  min: number;
  max: number;
  step?: number;
}

export interface AnimationPreset {
  id: string;
  name: MessageId;
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
export const EASINGS: Array<{ id: string; label: MessageId; css: string }> = [
  { id: 'linear', label: lm('Linear'), css: 'linear' },
  { id: 'ease', label: lm('Ease'), css: 'ease' },
  { id: 'ease-in', label: lm('Ease in'), css: 'ease-in' },
  { id: 'ease-out', label: lm('Ease out'), css: 'ease-out' },
  { id: 'ease-in-out', label: lm('Ease in-out'), css: 'ease-in-out' },
  { id: 'spring', label: lm('Spring'), css: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { id: 'smooth', label: lm('Smooth'), css: 'cubic-bezier(0.45, 0, 0.55, 1)' },
  { id: 'snap', label: lm('Snap'), css: 'cubic-bezier(0.7, 0, 0.3, 1)' },
];

// ── intensity kinds ──
const deg = (label: MessageId, max = 1080): AnimationIntensity => ({ label, unit: 'deg', min: 0, max });
const pct = (label: MessageId, max = 100): AnimationIntensity => ({ label, unit: '%', min: 0, max });
const px = (label: MessageId, max = 60): AnimationIntensity => ({ label, unit: 'px', min: 0, max });
const count = (label: MessageId = lm('Particles'), max = MAX_PARTICLES): AnimationIntensity => ({ label, unit: '', min: 1, max });
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

function preset(id: string, name: MessageId, d: Def): AnimationPreset {
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
const SEASONAL_PRESETS: Array<[string, MessageId, NonNullable<AnimationPreset['seasonal']>]> = [
  ['winter', lm('Winter'), 'winter'],
  ['spring', lm('Spring'), 'spring'],
  ['summer', lm('Summer'), 'summer'],
  ['autumn', lm('Autumn'), 'autumn'],
  ['christmas', lm('Christmas'), 'christmas'],
  ['new_year', lm('New Year'), 'new_year'],
  ['valentine', lm('Valentine'), 'valentine'],
  ['easter', lm('Easter'), 'easter'],
  ['halloween', lm('Halloween'), 'halloween'],
  ['weather', lm('Live weather'), 'weather'],
  ['daynight', lm('Day and night'), 'daynight'],
  ['snow', lm('Snowy'), 'snow'],
  ['rain', lm('Rainy'), 'rain'],
  ['storm', lm('Thunderstorm'), 'storm'],
  ['sun', lm('Sunny'), 'sun'],
  ['clouds', lm('Cloudy'), 'clouds'],
  ['fog', lm('Foggy'), 'fog'],
  ['wind', lm('Windy'), 'wind'],
  ['night', lm('Night sky'), 'night'],
  ['dusk', lm('Dusk glow'), 'dusk'],
];

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ── Glow & pulse ──
  preset('breathe', lm('Breathe'), { group: 'Glow & pulse', channels: ['scale', 'opacity'], duration: 3.2, intensity: [pct(lm('Scale'), 50), 4] }),
  preset('glow-pulse', lm('Glow pulse'), { group: 'Glow & pulse', channels: ['glow'], duration: 2, intensity: [px(lm('Glow size')), 16], extra: GLOW }),
  preset('halo-ripple', lm('Halo ripple'), { group: 'Glow & pulse', channels: ['glow'], duration: 1.8, easing: 'ease-out', intensity: [px(lm('Ring size')), 14], extra: GLOW }),
  preset('aura', lm('Aura'), { group: 'Glow & pulse', channels: ['glow'], duration: 4, intensity: [px(lm('Glow size')), 24], extra: GLOW }),
  preset('heartbeat', lm('Heartbeat'), { group: 'Glow & pulse', channels: ['scale'], duration: 1.4, intensity: [pct(lm('Scale'), 50), 12] }),

  // ── Motion ──
  preset('spin', lm('Spin'), { group: 'Motion', channels: ['rotate'], duration: 2, easing: 'linear', intensity: [deg(lm('Rotation')), 360] }),
  preset('fast-spin', lm('Fast spin'), { group: 'Motion', channels: ['rotate'], duration: 0.6, easing: 'linear', intensity: [deg(lm('Rotation')), 360] }),
  preset('sway', lm('Sway'), { group: 'Motion', channels: ['rotate'], duration: 2.4, intensity: [deg(lm('Angle'), 90), 6] }),
  preset('wobble', lm('Wobble'), { group: 'Motion', channels: ['translate', 'rotate'], duration: 1.2, intensity: [px(lm('Distance')), 6] }),
  preset('shake-alert', lm('Shake alert'), { group: 'Motion', channels: ['translate'], duration: 2, intensity: [px(lm('Distance')), 4] }),
  preset('rumble', lm('Rumble'), { group: 'Motion', channels: ['translate'], duration: 0.3, easing: 'linear', intensity: [px(lm('Distance'), 10), 1] }),
  preset('float', lm('Float'), { group: 'Motion', channels: ['translate'], duration: 3, intensity: [px(lm('Distance')), 6] }),

  // ── Weather & device ──
  preset('flame-flicker', lm('Flame flicker'), { group: 'Weather & device', channels: ['scale', 'rotate', 'filter'], duration: 1.2, intensity: [pct(lm('Flicker'), 30), 5], extra: { origin: '50% 100%', colour: true } }),
  preset('steam-rise', lm('Steam rise'), { group: 'Weather & device', channels: ['fx'], duration: 3, easing: 'ease-out', intensity: [COUNT, 4], extra: { particles: 'count' } }),
  preset('bubbles', lm('Bubbles'), { group: 'Weather & device', channels: ['fx'], duration: 3.5, easing: 'ease-in', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('snow-fall', lm('Snow fall'), { group: 'Weather & device', channels: ['fx'], duration: 5, easing: 'linear', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('rain-fall', lm('Rain fall'), { group: 'Weather & device', channels: ['fx'], duration: 0.9, easing: 'linear', intensity: [COUNT, 6], extra: { particles: 'count' } }),
  preset('liquid-wave', lm('Liquid wave'), { group: 'Weather & device', channels: ['fx'], duration: 6, easing: 'linear', intensity: [pct(lm('Fill level')), 40], extra: { particles: 2 } }),
  preset('storm-flash', lm('Storm flash'), { group: 'Weather & device', channels: ['fx'], duration: 5, easing: 'linear', intensity: [pct(lm('Brightness')), 75], extra: { particles: 1, front: true } }),

  // ── Light & colour ──
  preset('shine-sweep', lm('Shine sweep'), { group: 'Light & colour', channels: ['fx'], duration: 3, intensity: [pct(lm('Shine')), 45], extra: { particles: 1, front: true } }),

  // ── Playful (a short move, then a rest, so they read as attention cues) ──
  preset('bounce', lm('Bounce'), { group: 'Playful', channels: ['translate', 'scale'], duration: 1.6, easing: 'ease', intensity: [px(lm('Height')), 10], extra: { origin: '50% 100%' } }),
  preset('jello', lm('Jello'), { group: 'Playful', channels: ['scale'], duration: 1.8, easing: 'ease', intensity: [pct(lm('Squash'), 50), 12] }),
  preset('rubber-band', lm('Rubber band'), { group: 'Playful', channels: ['scale'], duration: 1.6, easing: 'ease', intensity: [pct(lm('Stretch'), 50), 25] }),
  preset('tada', lm('Tada'), { group: 'Playful', channels: ['scale', 'rotate'], duration: 2, easing: 'ease', intensity: [deg(lm('Angle'), 45), 3] }),
  preset('swing', lm('Swing'), { group: 'Playful', channels: ['rotate'], duration: 2, easing: 'ease-in-out', intensity: [deg(lm('Angle'), 90), 15], extra: { origin: '50% 0' } }),
  preset('flip', lm('Flip'), { group: 'Playful', channels: ['rotate'], duration: 2.4, easing: 'smooth', intensity: [deg(lm('Rotation')), 360] }),
  preset('pop', lm('Pop'), { group: 'Playful', channels: ['scale'], duration: 1.8, easing: 'ease-out', intensity: [pct(lm('Scale'), 50), 18] }),
  preset('head-shake', lm('Head shake'), { group: 'Playful', channels: ['translate', 'rotate'], duration: 1.6, easing: 'ease-in-out', intensity: [px(lm('Distance'), 30), 6] }),

  // ── Light & colour ──
  preset('blink', lm('Blink'), { group: 'Light & colour', channels: ['opacity'], duration: 1, easing: 'linear', intensity: [pct(lm('Dim')), 85] }),
  preset('neon-flicker', lm('Neon flicker'), { group: 'Light & colour', channels: ['opacity', 'filter'], duration: 3, easing: 'linear', intensity: [px(lm('Glow size'), 30), 8], extra: { colour: true } }),
  preset('rainbow-hue', lm('Rainbow hue'), { group: 'Light & colour', channels: ['filter'], duration: 6, easing: 'linear', intensity: [deg(lm('Hue range'), 720), 360] }),
  preset('glitch', lm('Glitch'), { group: 'Light & colour', channels: ['translate', 'filter'], duration: 2.5, easing: 'linear', intensity: [px(lm('Offset'), 20), 3], extra: { colour: true } }),
  preset('fade-pulse', lm('Fade pulse'), { group: 'Light & colour', channels: ['opacity'], duration: 2.4, intensity: [pct(lm('Fade')), 60] }),

  // ── Rings & sweeps ──
  preset('ping', lm('Ping'), { group: 'Rings & sweeps', channels: ['fx'], duration: 2, easing: 'ease-out', intensity: [pct(lm('Ring size'), 200), 90], extra: { particles: 1 } }),
  preset('ripple-rings', lm('Ripple rings'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'ease-out', intensity: [count(lm('Rings'), 6), 3], extra: { particles: 'count' } }),
  preset('radar-sweep', lm('Radar sweep'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'linear', intensity: [deg(lm('Beam width'), 180), 70], extra: { particles: 1 } }),
  preset('conic-border-spin', lm('Conic border spin'), { group: 'Rings & sweeps', channels: ['fx'], duration: 3, easing: 'linear', intensity: [px(lm('Border width'), 12), 2], extra: { particles: 1 } }),
  preset('breathing-border', lm('Breathing border'), { group: 'Rings & sweeps', channels: ['glow'], duration: 3, intensity: [px(lm('Border width'), 12), 2], extra: GLOW }),

  // ── Scenes ──
  preset('fireflies', lm('Fireflies'), { group: 'Scenes', channels: ['fx'], duration: 6, intensity: [COUNT, 8], extra: { particles: 'count' } }),
  preset('confetti', lm('Confetti'), { group: 'Scenes', channels: ['fx'], duration: 3.5, easing: 'linear', intensity: [COUNT, 10], extra: { particles: 'count' } }),
  preset('falling-leaves', lm('Falling leaves'), { group: 'Scenes', channels: ['fx'], duration: 7, easing: 'linear', intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('lightning', lm('Lightning'), { group: 'Scenes', channels: ['fx'], duration: 4, easing: 'linear', intensity: [pct(lm('Brightness')), 90], extra: { particles: 1, front: true } }),
  preset('ocean-waves', lm('Ocean waves'), { group: 'Scenes', channels: ['fx'], duration: 4, easing: 'linear', intensity: [pct(lm('Wave height')), 35], extra: { particles: 3 } }),
  preset('sun-rays', lm('Sun rays'), { group: 'Scenes', channels: ['fx'], duration: 24, easing: 'linear', intensity: [deg(lm('Ray width'), 30), 6], extra: { particles: 1 } }),
  preset('heat-shimmer', lm('Heat shimmer'), { group: 'Scenes', channels: ['translate', 'filter'], duration: 1.2, easing: 'ease-in-out', intensity: [px(lm('Strength'), 10), 2] }),
  preset('wind-lines', lm('Wind lines'), { group: 'Scenes', channels: ['fx'], duration: 2.2, intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('drip', lm('Drip'), { group: 'Scenes', channels: ['fx'], duration: 2.4, easing: 'ease-in', intensity: [COUNT, 3], extra: { particles: 'count' } }),
  preset('equalizer-bars', lm('Equalizer bars'), { group: 'Scenes', channels: ['fx'], duration: 0.9, intensity: [count(lm('Bars')), 5], extra: { particles: 'count', direction: 'alternate' } }),
  preset('charging-stripes', lm('Charging stripes'), { group: 'Scenes', channels: ['fx'], duration: 1, easing: 'linear', intensity: [pct(lm('Stripe strength')), 100], extra: { particles: 1 } }),
  preset('orbit-dots', lm('Orbit dots'), { group: 'Scenes', channels: ['fx'], duration: 2.4, easing: 'linear', intensity: [count(lm('Dots'), 8), 3], extra: { particles: 'count' } }),
  preset('typing-dots', lm('Typing dots'), { group: 'Scenes', channels: ['fx'], duration: 1.2, intensity: [px(lm('Bounce'), 20), 4], extra: { particles: 3 } }),

  // ── Motion (batch 6) ──
  preset('pendulum', lm('Pendulum'), { group: 'Motion', channels: ['rotate'], duration: 2.4, intensity: [deg(lm('Angle'), 90), 20], extra: { origin: '50% 0', direction: 'alternate' } }),
  preset('orbit', lm('Orbit'), { group: 'Motion', channels: ['translate'], duration: 4, easing: 'linear', intensity: [px(lm('Radius'), 40), 6] }),
  preset('coin-spin', lm('Coin spin'), { group: 'Motion', channels: ['rotate'], duration: 3, easing: 'linear', intensity: [deg(lm('Rotation')), 360] }),
  preset('rotate-3d', lm('3D rotate'), { group: 'Motion', channels: ['rotate'], duration: 3, intensity: [deg(lm('Tilt'), 180), 25], extra: { direction: 'alternate' } }),
  preset('squash-stretch', lm('Squash & stretch'), { group: 'Motion', channels: ['scale', 'translate'], duration: 1.4, intensity: [pct(lm('Squash'), 50), 14], extra: { origin: '50% 100%' } }),
  preset('wiggle', lm('Wiggle'), { group: 'Motion', channels: ['rotate'], duration: 2.5, intensity: [deg(lm('Angle'), 45), 8] }),
  preset('shadow-lift', lm('Shadow lift'), { group: 'Motion', channels: ['translate', 'glow'], duration: 3, intensity: [px(lm('Lift'), 20), 4], extra: GLOW }),

  // ── Light & colour (batch 6) ──
  preset('holographic-shimmer', lm('Holographic shimmer'), { group: 'Light & colour', channels: ['fx'], duration: 5, easing: 'linear', intensity: [pct(lm('Strength')), 35], extra: { particles: 1, front: true } }),
  preset('scanline', lm('Scanline'), { group: 'Light & colour', channels: ['fx'], duration: 3, easing: 'linear', intensity: [pct(lm('Brightness')), 50], extra: { particles: 1, front: true } }),
  preset('twinkle', lm('Twinkle'), { group: 'Light & colour', channels: ['fx'], duration: 2.4, intensity: [COUNT, 6], extra: { particles: 'count', front: true } }),
  preset('spotlight', lm('Spotlight'), { group: 'Light & colour', channels: ['fx'], duration: 7, intensity: [pct(lm('Brightness')), 45], extra: { particles: 1 } }),

  // ── Borders: rings along the exact outline (mc-ring), a neon glow ──
  preset('border-snake', lm('Border snake'), { group: 'Borders', channels: ['fx'], duration: 3, easing: 'linear', intensity: [px(lm('Width'), 12), 3], extra: { ring: 'snake' } }),
  preset('neon-border', lm('Neon border'), { group: 'Borders', channels: ['glow'], duration: 2.4, intensity: [px(lm('Glow size'), 30), 10], extra: GLOW }),
  preset('power-flow', lm('Power flow dots'), { group: 'Borders', channels: ['fx'], duration: 4, easing: 'linear', intensity: [px(lm('Dot size'), 12), 5], extra: { ring: 'dots' } }),
  preset('marching-ants', lm('Marching ants'), { group: 'Borders', channels: ['fx'], duration: 20, easing: 'linear', intensity: [px(lm('Width'), 12), 2], extra: { ring: 'dashes' } }),

  // ── Backgrounds: scenes behind the content ──
  preset('aurora', lm('Aurora'), { group: 'Backgrounds', channels: ['fx'], duration: 12, intensity: [pct(lm('Glow')), 55], extra: { particles: 3 } }),
  preset('lava-lamp', lm('Lava lamp'), { group: 'Backgrounds', channels: ['fx'], duration: 9, intensity: [COUNT, 5], extra: { particles: 'count', direction: 'alternate' } }),
  preset('plasma-gradient', lm('Plasma gradient'), { group: 'Backgrounds', channels: ['fx'], duration: 10, easing: 'linear', intensity: [pct(lm('Strength')), 70], extra: { particles: 1 } }),
  preset('gradient-flow', lm('Gradient flow'), { group: 'Backgrounds', channels: ['fx'], duration: 8, easing: 'linear', intensity: [pct(lm('Strength')), 60], extra: { particles: 1, direction: 'alternate' } }),
  preset('color-cycle-bg', lm('Colour cycle background'), { group: 'Backgrounds', channels: ['fx'], duration: 10, easing: 'linear', intensity: [pct(lm('Strength')), 35], extra: { particles: 1 } }),
  preset('starfield', lm('Starfield'), { group: 'Backgrounds', channels: ['fx'], duration: 3.5, intensity: [COUNT, 12], extra: { particles: 'count' } }),
  preset('meteor-shower', lm('Meteor shower'), { group: 'Backgrounds', channels: ['fx'], duration: 3, easing: 'ease-in', intensity: [COUNT, 4], extra: { particles: 'count' } }),
  preset('bokeh', lm('Bokeh'), { group: 'Backgrounds', channels: ['fx'], duration: 8, intensity: [COUNT, 7], extra: { particles: 'count', direction: 'alternate' } }),
  preset('matrix-rain', lm('Matrix rain'), { group: 'Backgrounds', channels: ['fx'], duration: 2.4, easing: 'linear', intensity: [count(lm('Streams')), 10], extra: { particles: 'count' } }),
  preset('smoke', lm('Smoke'), { group: 'Backgrounds', channels: ['fx'], duration: 6, easing: 'ease-out', intensity: [COUNT, 5], extra: { particles: 'count' } }),
  preset('clouds-drift', lm('Clouds drift'), { group: 'Backgrounds', channels: ['fx'], duration: 30, easing: 'linear', intensity: [count(lm('Clouds'), 6), 3], extra: { particles: 'count' } }),
  preset('water-ripple', lm('Water ripple'), { group: 'Backgrounds', channels: ['fx'], duration: 4, easing: 'ease-out', intensity: [count(lm('Ripples'), 8), 3], extra: { particles: 'count' } }),
  preset('fireworks', lm('Fireworks'), { group: 'Backgrounds', channels: ['fx'], duration: 2.2, easing: 'ease-out', intensity: [count(lm('Sparks')), 10], extra: { particles: 'count' } }),

  // ── Seasonal: the card's seasonal scenes inside one element (src/card/mc-seasonal.ts) ──
  ...SEASONAL_PRESETS.map(([id, name, scene]) =>
    preset(id, name, { group: 'Seasonal', channels: ['fx'], duration: 1, easing: 'linear', intensity: [pct(lm('Density')), 50], extra: { seasonal: scene } }),
  ),

  // ── Interaction: play once per tap, from the pointer ──
  preset('tap-ripple', lm('Tap ripple'), { group: 'Interaction', channels: ['fx'], duration: 0.6, easing: 'ease-out', intensity: [pct(lm('Brightness')), 35], extra: { particles: 1, front: true, trigger: 'tap', iterations: 1 } }),
  preset('press', lm('Press'), { group: 'Interaction', channels: ['scale'], duration: 0.3, easing: 'ease-out', intensity: [pct(lm('Depth'), 30), 6], extra: { trigger: 'tap', iterations: 1 } }),
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
export const GROUP_LABELS: Record<AnimationGroup, MessageId> = {
  'Glow & pulse': lm('Glow & pulse'),
  Motion: lm('Motion'),
  Playful: lm('Playful'),
  'Light & colour': lm('Light & colour'),
  'Rings & sweeps': lm('Rings & sweeps'),
  Borders: lm('Borders'),
  'Weather & device': lm('Weather & device'),
  Scenes: lm('Scenes'),
  Backgrounds: lm('Backgrounds'),
  Seasonal: lm('Seasonal'),
  Interaction: lm('Interaction'),
};

const BY_ID = new Map(ANIMATION_PRESETS.map((x) => [x.id, x]));
export const getAnimationPreset = (id: string | undefined): AnimationPreset | undefined =>
  id ? BY_ID.get(id) : undefined;

/** "Rotation (deg)", "Scale (%)", "Particles"; `tr` resolves a label (t of the labels namespace). */
export const intensityLabel = (p: AnimationPreset, tr: (id: MessageId) => string): string =>
  p.intensity.unit ? `${tr(p.intensity.label)} (${p.intensity.unit})` : tr(p.intensity.label);
