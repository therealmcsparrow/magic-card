import type { ImageMorph } from '../contracts/image-animation';

// The SMIL copy of a morph: an `<animate begin="indefinite">` that stays inert until it is begun here.

interface Beginnable extends Element {
  beginElement?: () => void;
  beginElementAt?: (offset: number) => void;
  endElement?: () => void;
}

/**
 * Begins the animate of each morph once, after `delay` s. Returns the stop: it cancels a pending begin and ends
 * the copies that were begun.
 */
export function startSmil(svg: SVGSVGElement, morphs: readonly ImageMorph[], delay = 0): () => void {
  const wanted = new Set(morphs.map((m) => m.smil));
  const found = Array.from(svg.querySelectorAll('animate')).filter((a) => wanted.has(a.id)) as Beginnable[];
  const begun: Beginnable[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  const begin = (el: Beginnable): void => {
    if (begun.includes(el)) return;
    begun.push(el);
    el.beginElement?.();
  };
  if (delay > 0 && found.every((a) => typeof a.beginElementAt === 'function')) {
    for (const a of found) {
      begun.push(a);
      a.beginElementAt?.(delay);
    }
  } else if (delay > 0) {
    timer = setTimeout(() => found.forEach(begin), delay * 1000);
  } else {
    found.forEach(begin);
  }
  return () => {
    clearTimeout(timer);
    for (const a of begun.splice(0)) a.endElement?.();
  };
}
