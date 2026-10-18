import { ANIMATION_KINDS } from '../anim-studio/model';
import { THEME_VAR_RE } from '../contracts/theme-catalogue';
import type { TransferKind, TransferSource } from '../contracts/preset-transfer';
import { slug, uniqueId } from './ids';
import { isObj } from './types';
import type { Raw } from './types';

/** What detection found: the kind and the raw (not yet validated) items in envelope shape. */
export interface Detected {
  kind: TransferKind;
  source: TransferSource;
  items: unknown[];
}

/** C5 (3): the first element is <svg, after an optional XML prolog, doctype and comments. */
export function looksLikeSvg(text: string, fileName?: string): boolean {
  if (fileName && /\.svg$/i.test(fileName)) return true;
  let i = 0;
  const n = text.length;
  for (;;) {
    while (i < n && /\s/.test(text[i])) i++;
    const rest = text.slice(i, i + 9);
    if (rest.startsWith('<?')) {
      const end = text.indexOf('?>', i);
      if (end < 0) return false;
      i = end + 2;
    } else if (rest.startsWith('<!--')) {
      const end = text.indexOf('-->', i);
      if (end < 0) return false;
      i = end + 3;
    } else if (/^<!doctype/i.test(rest)) {
      const end = text.indexOf('>', i);
      if (end < 0) return false;
      i = end + 1;
    } else return /^<svg[\s>/]/i.test(text.slice(i, i + 6));
  }
}

export function svgItem(text: string, fileName?: string): Detected {
  const base = (fileName ?? '').replace(/^.*[\\/]/, '');
  const stem = base.replace(/\.svg$/i, '');
  return {
    kind: 'icon',
    source: 'svg',
    items: [{ id: slug(stem, 'icon'), name: (base || 'icon').slice(0, 80), data: { svg: text } }],
  };
}

const isDocLike = (v: unknown): v is Raw => isObj(v) && ((typeof v.kind === 'string' && (ANIMATION_KINDS as string[]).includes(v.kind)) || Array.isArray(v.keyframes));

/** One animation document -> envelope item (id and name from the doc, or the map key). */
function docItem(doc: Raw, key?: string): unknown {
  const { id, name, ...data } = doc;
  const i = typeof id === 'string' ? id : key;
  return { id: i, name: typeof name === 'string' ? name : i, data };
}

function docList(v: unknown): unknown[] | undefined {
  if (Array.isArray(v)) return v.length && v.every(isDocLike) ? v.map((d) => docItem(d as Raw)) : undefined;
  if (isObj(v)) {
    const entries = Object.entries(v);
    return entries.length && entries.every(([, d]) => isDocLike(d)) ? entries.map(([k, d]) => docItem(d as Raw, (d as Raw).id === undefined ? k : undefined)) : undefined;
  }
  return undefined;
}

const isThemeMap = (v: Raw): boolean => {
  const entries = Object.entries(v);
  return (
    entries.length > 0 &&
    entries.every(([, t]) => isObj(t) && Object.keys(t).length > 0 && Object.keys(t).every((k) => k === 'modes' || THEME_VAR_RE.test(k)))
  );
};

/** C5 (2) and (4) on a parsed value that has no envelope marker. */
export function detectOther(value: unknown): Detected | undefined {
  if (Array.isArray(value) || isObj(value)) {
    const o = isObj(value) ? value : undefined;
    // card config with custom_animations
    if (o && 'custom_animations' in o) {
      const items = docList(o.custom_animations);
      if (items) return { kind: 'animation', source: 'studio-list', items };
    }
    if (o && isDocLike(o)) return { kind: 'animation', source: 'studio-list', items: [docItem(o)] };
    const items = docList(value);
    if (items) return { kind: 'animation', source: 'studio-list', items };
    if (o && isThemeMap(o)) {
      const used = new Set<string>();
      return {
        kind: 'theme',
        source: 'ha-theme',
        items: Object.entries(o).map(([name, doc]) => {
          const id = uniqueId(slug(name, 'theme'), (x) => used.has(x));
          used.add(id);
          return { id, name: name.slice(0, 80), data: doc };
        }),
      };
    }
  }
  return undefined;
}
