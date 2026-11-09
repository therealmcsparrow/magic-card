import { compileTracks } from '../anim-studio/compile-v2';
import type { ImageAnimation } from '../contracts/image-animation';
import { play } from '../image-anim/play';

// Plays one clip of the animation on the drawing being edited, as the saved image will play it.

export interface Preview {
  release(): void;
}

const NONE: Preview = { release: () => undefined };

/**
 * Plays the clip on `svg` at once, whatever starts it in the saved image. Reduced motion shows the drawn frame, and a
 * paused card or an off-screen drawing holds the clip, because the viewer's own player does that. An unknown clip plays nothing.
 */
export function startPreview(svg: SVGSVGElement, anim: ImageAnimation, clipId: string): Preview {
  const clip = anim.clips.find((c) => c.id === clipId);
  if (!clip) return NONE;
  const only: ImageAnimation = { v: 1, clips: [{ ...clip, play: { on: 'always' } }] };
  const handle = play(svg, only, { hass: undefined, host: svg as unknown as HTMLElement }, compileTracks);
  return { release: () => handle.release() };
}
