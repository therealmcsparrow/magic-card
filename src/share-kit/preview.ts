import type { TransferDataByKind, TransferKind } from '../contracts/preset-transfer';

// Preview copies of a sanitised item that make no request: every address that is not a data:image URL is swapped for a
// neutral pattern or removed, so showing the preview never contacts another host.

/** Stands in for any picture that is not embedded. */
export const NEUTRAL_PATTERN = 'repeating-linear-gradient(45deg, rgba(128, 128, 128, 0.35) 0 6px, rgba(128, 128, 128, 0.15) 6px 12px)';
const DATA_IMAGE_RE = /^data:image\/(?:png|jpeg|gif|webp|svg\+xml)[;,]/i;
const URL_CALL_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)/gi;
const IMAGE_KEYS: ReadonlySet<string> = new Set(['image', 'src', 'url', 'img', 'picture', 'entity_picture', 'background_image', 'image_url', 'icon_url']);
const MAX_DEPTH = 100;

const embedded = (url: string): boolean => DATA_IMAGE_RE.test(url.trim());

/** A CSS value with every non-embedded url() and every image-set() replaced. */
function safeCss(s: string): string {
  if (/image-set\(|-webkit-image-set\(|\bsrc\(/i.test(s)) return NEUTRAL_PATTERN;
  return s.replace(URL_CALL_RE, (all, a?: string, b?: string, c?: string) => (embedded(a ?? b ?? c ?? '') ? all : NEUTRAL_PATTERN));
}

function walk(v: unknown, key: string, depth: number): unknown {
  if (depth > MAX_DEPTH) throw new Error('share-kit: item is nested too deeply to preview');
  if (typeof v === 'string') return IMAGE_KEYS.has(key) && !embedded(v) ? '' : safeCss(v);
  if (Array.isArray(v)) return v.map((e) => walk(e, key, depth + 1));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, e]) => [k, walk(e, k, depth + 1)]));
  return v;
}

/** A copy of `data` for previewing: images that are not embedded become a neutral pattern or an empty source. */
export function previewSafe<K extends TransferKind>(_kind: K, data: TransferDataByKind[K]): TransferDataByKind[K] {
  return walk(data, '', 0) as TransferDataByKind[K];
}
