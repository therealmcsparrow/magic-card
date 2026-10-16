import type { ParticleFlow } from '../contracts/particles-v2';
import type { Rng } from './rng';
import type { Vec } from './physics';
import { noise3 } from './physics';

/** What a flow needs to know about the layer and the sim (world units, see sim.ts). */
export interface FlowCtx {
  W: number;
  H: number;
  /** spec.spread, 0-100. */
  spread: number;
  /** Mean of ranges.speed and of the (clamped) lifetime: flows scale their shapes to them. */
  vMean: number;
  lifeMean: number;
  noiseSeed: number;
}

/** The moving state a flow reads and steers. */
export interface FlowBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  /** Drawn speed, world units per s. */
  speed: number;
  /** +1 / -1: turning direction (orbit, vortex, spiral) or zigzag side. */
  dir: number;
  /** Rest line or centre a flow returns to (wave, zigzag). */
  baseX: number;
  baseY: number;
}

export interface FlowDef {
  /** Lives the whole loop and blends back to its start over the last 15 % (orbit, wander; ADR 0004). */
  persistent: boolean;
  /** Rotation follows the direction of travel (rain streaks). */
  align?: boolean;
  /** Places the body and sets its velocity. Draws a fixed number of values from rng (engine 1). */
  spawn(b: FlowBody, rng: Rng, c: FlowCtx, r: number): void;
  /** Built-in pull down, world units per s^2 (fountain, explode), added to the physics gravity. */
  fall?(c: FlowCtx): number;
  /** Extra acceleration of the flow at this moment, added to `out`. */
  accel?(b: FlowBody, c: FlowCtx, out: Vec): void;
}

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
/** Steering gain of the guided flows, 1/s. */
const STEER = 3;
const WAVE_AMP = 8;
const ZIGZAG_AMP = 6;
/** Pull back to the spawn point, 1/s (wander). */
const WANDER_PULL = 0.8;

const band = (rng: Rng, size: number, spread: number) => size / 2 + (rng() - 0.5) * size * (Math.max(0, spread) / 100);
const ringRadius = (c: FlowCtx) => Math.max(5, c.spread / 2);
const centre = (b: FlowBody, c: FlowCtx) => {
  b.x = c.W / 2;
  b.y = c.H / 2;
};
const steer = (b: FlowBody, tx: number, ty: number, out: Vec) => {
  out.x += (tx - b.vx) * STEER;
  out.y += (ty - b.vy) * STEER;
};
/** Unit vectors from the layer centre: radial (out) and tangential (dir). */
const polar = (b: FlowBody, c: FlowCtx) => {
  const dx = b.x - c.W / 2;
  const dy = b.y - c.H / 2;
  const r = Math.hypot(dx, dy) || 1e-6;
  const ux = dx / r;
  const uy = dy / r;
  return { r, ux, uy, tx: -uy * b.dir, ty: ux * b.dir };
};
/** Angle 0 = up, clockwise; velocity of `speed` that way. */
const launch = (b: FlowBody, angleDeg: number) => {
  const a = angleDeg * DEG;
  b.vx = Math.sin(a) * b.speed;
  b.vy = -Math.cos(a) * b.speed;
};
/** Half-period of the zigzag, s: two zigs per mean life. */
const zigHalf = (c: FlowCtx) => Math.max(0.1, c.lifeMean / 4);

const fall: FlowDef = {
  persistent: false,
  spawn(b, rng, c, r) {
    b.x = band(rng, c.W, c.spread);
    b.y = -r;
    b.vx = 0;
    b.vy = b.speed;
  },
};

export const FLOWS: Record<ParticleFlow, FlowDef> = {
  fall,
  rise: {
    persistent: false,
    spawn(b, rng, c, r) {
      b.x = band(rng, c.W, c.spread);
      b.y = c.H + r;
      b.vx = 0;
      b.vy = -b.speed;
    },
  },
  drift: {
    persistent: false,
    spawn(b, rng, c, r) {
      b.x = -r;
      b.y = band(rng, c.H, c.spread);
      b.vx = b.speed;
      b.vy = 0;
    },
  },
  burst: {
    persistent: false,
    spawn(b, rng, c) {
      centre(b, c);
      launch(b, rng() * 360);
    },
  },
  orbit: {
    persistent: true,
    spawn(b, rng, c) {
      const a = rng() * TAU;
      const R = ringRadius(c);
      b.x = c.W / 2 + Math.cos(a) * R;
      b.y = c.H / 2 + Math.sin(a) * R;
      const p = polar(b, c);
      b.vx = p.tx * b.speed;
      b.vy = p.ty * b.speed;
    },
    accel(b, c, out) {
      const p = polar(b, c);
      const pull = (ringRadius(c) - p.r) * 2;
      steer(b, p.tx * b.speed + p.ux * pull, p.ty * b.speed + p.uy * pull, out);
    },
  },
  spiral: {
    persistent: false,
    spawn(b, rng, c) {
      const a = rng() * TAU;
      b.x = c.W / 2 + Math.cos(a);
      b.y = c.H / 2 + Math.sin(a);
      const p = polar(b, c);
      b.vx = (p.ux * 0.6 + p.tx) * b.speed;
      b.vy = (p.uy * 0.6 + p.ty) * b.speed;
    },
    accel(b, c, out) {
      const p = polar(b, c);
      steer(b, (p.ux * 0.6 + p.tx) * b.speed, (p.uy * 0.6 + p.ty) * b.speed, out);
    },
  },
  fountain: {
    persistent: false,
    spawn(b, rng, c, r) {
      b.x = c.W / 2 + (rng() - 0.5) * c.W * (Math.max(0, c.spread) / 100) * 0.25;
      b.y = c.H + r;
      launch(b, (rng() - 0.5) * 40);
    },
    // apex at about mid-life
    fall: (c) => (2 * c.vMean) / Math.max(0.1, c.lifeMean),
  },
  explode: {
    persistent: false,
    spawn(b, rng, c) {
      centre(b, c);
      launch(b, (rng() - 0.5) * 150);
    },
    fall: (c) => (1.5 * c.vMean) / Math.max(0.1, c.lifeMean),
  },
  wave: {
    persistent: false,
    spawn(b, rng, c, r) {
      const phase = rng() * TAU;
      const w = TAU * 2 / Math.max(0.2, c.lifeMean);
      b.baseY = band(rng, c.H, c.spread);
      b.x = -r;
      b.y = b.baseY + WAVE_AMP * Math.sin(phase);
      b.vx = b.speed;
      b.vy = WAVE_AMP * w * Math.cos(phase);
    },
    accel(b, c, out) {
      const w = TAU * 2 / Math.max(0.2, c.lifeMean);
      out.y += -w * w * (b.y - b.baseY);
    },
  },
  vortex: {
    persistent: false,
    spawn(b, rng, c) {
      const a = rng() * TAU;
      const R = Math.max(10, c.spread / 2);
      b.x = c.W / 2 + Math.cos(a) * R;
      b.y = c.H / 2 + Math.sin(a) * R;
      const p = polar(b, c);
      b.vx = p.tx * b.speed;
      b.vy = p.ty * b.speed;
    },
    accel(b, c, out) {
      const p = polar(b, c);
      const inward = p.r > 2 ? 0.4 : 0;
      steer(b, (p.tx - p.ux * inward) * b.speed, (p.ty - p.uy * inward) * b.speed, out);
    },
  },
  zigzag: {
    persistent: false,
    spawn(b, rng, c, r) {
      fall.spawn(b, rng, c, r);
      const h = zigHalf(c);
      b.baseX = b.x;
      b.vx = -b.dir * (4 * ZIGZAG_AMP) / h;
    },
    accel(b, c, out) {
      const h = zigHalf(c);
      const side = Math.floor(b.age / h) % 2 === 0 ? 1 : -1;
      out.x += side * b.dir * (8 * ZIGZAG_AMP) / (h * h);
    },
  },
  rain: {
    persistent: false,
    align: true,
    spawn(b, rng, c, r) {
      b.x = rng() * c.W * (0.2 + Math.max(0, c.spread) / 100) - c.W * 0.1;
      b.y = -r;
      b.vx = 0;
      b.vy = b.speed;
    },
  },
  wander: {
    persistent: true,
    spawn(b, rng, c) {
      b.x = band(rng, c.W, c.spread);
      b.y = band(rng, c.H, c.spread);
      b.baseX = b.x;
      b.baseY = b.y;
      launch(b, rng() * 360);
    },
    accel(b, c, out) {
      const a = noise3(c.noiseSeed ^ 0x2545f491, b.x / 20, b.y / 20, b.age * 0.4) * TAU;
      // a soft tether to the spawn point keeps fireflies in their area
      steer(b, Math.cos(a) * b.speed + (b.baseX - b.x) * WANDER_PULL, Math.sin(a) * b.speed + (b.baseY - b.y) * WANDER_PULL, out);
    },
  },
};
