const MAX_URL = 8192;
const MAX_DATA_URL = 2_000_000;

/**
 * An image URL the card may load, parsed the way the browser parses it: http(s) or same-origin
 * relative, plus raster data: URLs. Returns the serialised URL, or undefined.
 */
export function safeImageUrl(v: unknown, base: string): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s || s.length > (/^data:/i.test(s) ? MAX_DATA_URL : MAX_URL)) return undefined;
  // protocol-relative and breakouts: a typed path starts with one slash, nothing here needs braces or quotes
  if (/^[\\/]{2}/.test(s) || /[{}<>\\"`]/.test(s) || /\burl\s*\(/i.test(s)) return undefined;
  let u: URL;
  try {
    u = new URL(s, base);
  } catch {
    return undefined;
  }
  if (u.username || u.password) return undefined;
  if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  if (u.protocol === 'data:' && /^data:image\/(png|jpe?g|gif|webp|avif|bmp)[;,]/i.test(u.href)) return u.href;
  return undefined;
}
