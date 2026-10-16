import type { HomeAssistant } from '../types';
import { currentRenderContext } from '../services/render-context';
import { cachedMediaUrl, mediaSourceId, unwrapCssUrl } from '../services/media-resolver';

export const DEFAULT_ASPECT_RATIO = '16 / 9';

const NUM = '(\\d+(?:\\.\\d+)?|\\.\\d+)';
const PAIR = new RegExp(`^${NUM}\\s*[:/x×]\\s*${NUM}$`, 'i');
const SINGLE = new RegExp(`^${NUM}$`);
const PERCENT = new RegExp(`^${NUM}\\s*%$`);

/**
 * A CSS `aspect-ratio` from what users write in YAML or the editor: a number (`1.5`, `1`),
 * `16:9`, `16/9`, `16x9`, or a percentage of the width like HA's picture cards (`56.25%`).
 * Anything else (empty, zero, text) gives `fallback`.
 */
export function cssAspectRatio(value: unknown, fallback = DEFAULT_ASPECT_RATIO): string {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? String(value) : fallback;
  if (typeof value !== 'string') return fallback;
  const v = value.trim();
  let m = PAIR.exec(v);
  if (m) {
    const w = Number(m[1]);
    const h = Number(m[2]);
    return w > 0 && h > 0 ? `${w} / ${h}` : fallback;
  }
  m = SINGLE.exec(v);
  if (m) return Number(m[1]) > 0 ? String(Number(m[1])) : fallback;
  m = PERCENT.exec(v);
  if (m) return Number(m[1]) > 0 ? `100 / ${Number(m[1])}` : fallback;
  return fallback;
}

/**
 * An image URL usable in the card: Home Assistant's relative URLs (`/api/camera_proxy/...`,
 * `/api/image_proxy/...`, `/local/...`) go through hass.hassUrl when present (a dashboard served
 * from another origin, e.g. the companion app or an external URL).
 */
export function resolveMediaUrl(hass: HomeAssistant | undefined, url: string): string {
  if (!url) return url;
  const hassUrl = (hass as { hassUrl?: (path?: string) => string } | undefined)?.hassUrl;
  if (url.startsWith('/') && !url.startsWith('//') && typeof hassUrl === 'function') {
    try {
      return hassUrl.call(hass, url);
    } catch {
      return url;
    }
  }
  return url;
}

/**
 * The URL of a browsed media item (`media-source://` id, or an old signed URL mapped back to its id)
 * as resolved by the card being rendered; outside a card render the cached URL. Empty while it
 * resolves: a media-source id never ends up in a src.
 */
function resolvedMedia(id: string): string {
  return currentRenderContext()?.media?.(id) ?? cachedMediaUrl(id) ?? '';
}

/**
 * A media field value as an element `src`: browsed media (`media-source://` id) is resolved, an
 * old CSS `url('...')` wrapper is unwrapped, relative HA URLs go through resolveMediaUrl.
 */
export function mediaSrc(hass: HomeAssistant | undefined, value: unknown): string {
  const id = mediaSourceId(value);
  if (id) return resolveMediaUrl(hass, resolvedMedia(id));
  return resolveMediaUrl(hass, typeof value === 'string' ? unwrapCssUrl(value) : '');
}

/**
 * A background image value (card background_image, design background_image) as CSS: browsed media
 * becomes `url("<resolved>")` (empty while it resolves), a typed path or URL (`/local/...`,
 * `http(s)://...`, `data:...`) is wrapped in `url("...")`; anything else (a url(), a gradient) is kept.
 */
export function mediaCssImage(hass: HomeAssistant | undefined, value: string): string {
  const id = mediaSourceId(value);
  if (!id) {
    const v = typeof value === 'string' ? value.trim() : '';
    return /^(\/|https?:|data:)/i.test(v) ? cssUrl(resolveMediaUrl(hass, v)) : value;
  }
  const url = resolvedMedia(id);
  return url ? cssUrl(resolveMediaUrl(hass, url)) : '';
}

/** `url("...")` with the characters that would end the string escaped. */
function cssUrl(url: string): string {
  return `url("${url.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

/** `url` with a cache-busting query parameter that changes every `intervalMs`. */
export function withRefreshParam(url: string, intervalMs: number, now = Date.now()): string {
  if (!url || !(intervalMs > 0)) return url;
  const slot = Math.floor(now / intervalMs);
  return `${url}${url.includes('?') ? '&' : '?'}mc_t=${slot}`;
}
