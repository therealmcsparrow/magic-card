import { noChange } from 'lit';
import { Directive, directive, PartType, type AttributePart, type PartInfo } from 'lit/directive.js';
import { sameSignedMedia } from '../services/media-resolver';

/** The element shows its current source fine (an image that loaded, a video with data). */
function loaded(el: Element): boolean {
  if (el instanceof HTMLImageElement) return el.complete && el.naturalWidth > 0;
  if (el instanceof HTMLMediaElement) return el.readyState > 0 && !el.error;
  return false;
}

/**
 * `src=${stableSrc(url)}` for browsed media: when only the signature of the URL changed (the media
 * resolver re-resolves before it expires) and the element already shows the file, the old URL is
 * kept, so an image is not downloaded again and a video does not restart. A new element, another
 * file or a failed load takes the new URL.
 */
class StableSrcDirective extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ATTRIBUTE) throw new Error('stableSrc is an attribute directive');
  }

  render(src: string): string {
    return src;
  }

  update(part: AttributePart, [src]: [string]): unknown {
    const current = part.element.getAttribute(part.name);
    if (current && src && current !== src && sameSignedMedia(current, src) && loaded(part.element)) return noChange;
    return src;
  }
}

export const stableSrc = directive(StableSrcDirective);
