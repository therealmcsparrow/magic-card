import type { ParticleColliders, BakeGeometry } from '../contracts/particles-v2';

/** The content collider box in world units. */
export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** What a particle hits during a step; position is the contact point (the particle's centre at the face). */
export interface Hit {
  /** s since the particle's birth. */
  age: number;
  x: number;
  y: number;
  /** Unit normal of the face, pointing back into free space. */
  nx: number;
  ny: number;
  /** Incoming speed along the normal, world units per s. */
  speed: number;
}

export interface ColliderSet {
  floor: boolean;
  ceiling: boolean;
  left: boolean;
  right: boolean;
  content?: Box;
}

/** Colliders in world units; the content box only when the sim asks for it and the geometry measured one. */
export function buildColliders(c: ParticleColliders, geometry: BakeGeometry, W: number, H: number): ColliderSet {
  const g = geometry.content;
  const content = c.content !== 'none' && g && g.w > 0 && g.h > 0 ? { x0: (g.x / 100) * W, y0: (g.y / 100) * H, x1: ((g.x + g.w) / 100) * W, y1: ((g.y + g.h) / 100) * H } : undefined;
  return { floor: c.floor, ceiling: c.ceiling, left: c.left, right: c.right, ...(content ? { content } : {}) };
}

export const hasColliders = (c: ColliderSet): boolean => c.floor || c.ceiling || c.left || c.right || !!c.content;

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Pushes the body out of every collider it overlaps and reflects the velocity part that moves into
 * the face: normal part times -bounce, tangential part times sqrt(bounce) (bounce 0 stops on impact).
 * A rebound slower than `rest` comes to rest. Only impacts at `rest` speed or faster count as hits,
 * so a particle lying on the floor does not report a hit every step.
 */
export function collide(b: Body, r: number, W: number, H: number, c: ColliderSet, bounce: number, rest: number, age: number): Hit | undefined {
  let hit: Hit | undefined;
  const face = (nx: number, ny: number, px: number, py: number) => {
    b.x = px;
    b.y = py;
    const vn = b.vx * nx + b.vy * ny;
    if (vn >= 0) return;
    const tx = b.vx - vn * nx;
    const ty = b.vy - vn * ny;
    const kt = Math.sqrt(Math.max(0, bounce));
    let out = -vn * bounce;
    if (out < rest) out = 0;
    b.vx = tx * kt + out * nx;
    b.vy = ty * kt + out * ny;
    if (-vn >= rest && !hit) hit = { age, x: px, y: py, nx, ny, speed: -vn };
  };
  if (c.floor && b.y > H - r) face(0, -1, b.x, H - r);
  if (c.ceiling && b.y < r) face(0, 1, b.x, r);
  if (c.left && b.x < r) face(1, 0, r, b.y);
  if (c.right && b.x > W - r) face(-1, 0, W - r, b.y);
  const k = c.content;
  if (k && b.x > k.x0 - r && b.x < k.x1 + r && b.y > k.y0 - r && b.y < k.y1 + r) {
    const dl = b.x - (k.x0 - r);
    const dr = k.x1 + r - b.x;
    const dt = b.y - (k.y0 - r);
    const db = k.y1 + r - b.y;
    const m = Math.min(dl, dr, dt, db);
    if (m === dt) face(0, -1, b.x, k.y0 - r);
    else if (m === db) face(0, 1, b.x, k.y1 + r);
    else if (m === dl) face(-1, 0, k.x0 - r, b.y);
    else face(1, 0, k.x1 + r, b.y);
  }
  return hit;
}
