import { parseImage, serializeImage } from './sanitize';

// The SVG sinks for library-image markup: sanitised nodes, a download file and a raster thumbnail; each sanitises its input first.

const SVG_TYPE = 'image/svg+xml';
/** Main and Accent as a picture can have them: it has no page styles, so theme variables become these colours. */
const PICTURE_MAIN = '#555555';
const PICTURE_ACCENT = '#03a9f4';
const VAR_RE = /^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+?)\s*)?\)$/;

/** Sanitised nodes for an editor canvas; undefined when nothing is drawable. */
export function fragment(markup: string): DocumentFragment | undefined {
  const r = parseImage(markup);
  if ('error' in r) return undefined;
  const f = document.createDocumentFragment();
  f.appendChild(r.root);
  return f;
}

/** Sanitised markup as an image/svg+xml Blob for a download; undefined when nothing is drawable. */
export function fileBlob(markup: string): Blob | undefined {
  const r = parseImage(markup);
  return 'error' in r ? undefined : new Blob([serializeImage(r.root)], { type: SVG_TYPE });
}

function resolveVars(el: Element): void {
  for (const name of ['fill', 'stroke', 'stop-color']) {
    const v = el.getAttribute(name);
    if (!v?.startsWith('var(')) continue;
    const m = VAR_RE.exec(v);
    const fallback = m?.[1] === '--mc-image-main' ? PICTURE_MAIN : m?.[1] === '--mc-image-accent' ? PICTURE_ACCENT : m?.[2] || PICTURE_MAIN;
    el.setAttribute(name, fallback);
  }
  for (const c of Array.from(el.children)) resolveVars(c);
}

const decodedBytes = (dataUrl: string): number => dataUrl.length;

/** A raster thumbnail (data:image/webp, else png) of sanitised markup, longest side `side`, at most `maxBytes`. */
export async function thumbnail(markup: string, side: number, maxBytes: number): Promise<string | undefined> {
  const first = parseImage(markup);
  if ('error' in first) return undefined;
  resolveVars(first.root);
  // the colours were swapped in the cleaned tree, so what is drawn is cleaned once more, last
  const r = parseImage(serializeImage(first.root));
  if ('error' in r) return undefined;
  const url = URL.createObjectURL(new Blob([serializeImage(r.root)], { type: SVG_TYPE }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const [, , w, h] = r.viewBox.split(' ').map(Number);
    for (const scale of [1, 0.7, 0.5]) {
      const k = (side * scale) / Math.max(w, h);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w * k));
      canvas.height = Math.max(1, Math.round(h * k));
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      for (const [type, qualities] of [['image/webp', [0.8, 0.55, 0.3]], ['image/png', [undefined]]] as const) {
        for (const q of qualities) {
          const data = canvas.toDataURL(type, q);
          if (data.startsWith(`data:${type}`) && decodedBytes(data) <= maxBytes) return data;
        }
      }
    }
    return undefined;
  } catch {
    return undefined;
  } finally {
    URL.revokeObjectURL(url);
  }
}
