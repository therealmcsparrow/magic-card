/** A floor-safe paint: colour plus a separate opacity (never color-mix). */
export interface Paint {
  paint: string;
  opacity: number;
}

const MIX = /^color-mix\(in srgb, (.+) (\d+(?:\.\d+)?)%, transparent\)$/;

/** `color-mix(in srgb, X N%, transparent)` (what resolveFlow writes for `entity N%` and idle) -> X at N / 100. */
export function unmix(c: string): Paint {
  const m = MIX.exec(c.trim());
  return m ? { paint: m[1], opacity: Math.min(1, Number(m[2]) / 100) } : { paint: c, opacity: 1 };
}

