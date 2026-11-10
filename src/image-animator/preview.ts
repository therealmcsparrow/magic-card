import type { ImageAnimChunk, ImageAnimation, ImageTrackCompiler } from '../contracts/image-animation';

// Plays one clip of the animation on the drawing being edited, as the saved image will play it.

export interface Preview {
  release(): void;
}

/** The player of the image-anim chunk and the track compiler of the anim-runtime chunk, both loaded by the image tools. */
export interface PreviewKit {
  play: ImageAnimChunk['play'];
  compile: ImageTrackCompiler;
}

const NONE: Preview = { release: () => undefined };

/**
 * Plays the clip on `svg` at once, whatever starts it in the saved image. Reduced motion shows the drawn frame, and a
 * paused card or an off-screen drawing holds the clip, because the viewer's own player does that. An unknown clip plays nothing.
 */
export function startPreview(svg: SVGSVGElement, anim: ImageAnimation, clipId: string, kit: PreviewKit): Preview {
  const clip = anim.clips.find((c) => c.id === clipId);
  if (!clip) return NONE;
  const only: ImageAnimation = { v: 1, clips: [{ ...clip, play: { on: 'always' } }] };
  const handle = kit.play(svg, only, { hass: undefined, host: svg as unknown as HTMLElement }, kit.compile);
  return { release: () => handle.release() };
}
