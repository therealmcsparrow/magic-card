// The three looks: a copy of the card config whose library icons are re-derived in Quiet, Living or Glow through icon_style.
import { ICON_STYLES } from '../contracts/icon-library';
import type { IconStyle } from '../contracts/icon-library';
import type { ForumShotLook } from '../contracts/forum-shot';

/** Derives a library icon's document in a style; undefined when the library does not know the icon. */
export interface LookSource {
  styleDoc(libraryId: string, style: IconStyle, docId: string): Record<string, unknown> | undefined;
}

type Obj = Record<string, unknown>;
const CUSTOM = 'custom:';
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

function copy<T>(v: T): T {
  if (Array.isArray(v)) return v.map(copy) as T;
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])) as T;
  return v;
}

/** Every animation entry that records a library pick and plays an inline document. */
function picks(node: unknown, out: Obj[] = []): Obj[] {
  if (Array.isArray(node)) node.forEach((n) => picks(n, out));
  else if (isObj(node)) {
    if (typeof node.library_icon === 'string' && typeof node.preset === 'string' && node.preset.startsWith(CUSTOM)) out.push(node);
    Object.values(node).forEach((n) => picks(n, out));
  }
  return out;
}

function putDoc(root: Obj, doc: Obj): void {
  const id = String(doc.id);
  const inline = root.custom_animations;
  if (isObj(inline)) root.custom_animations = { ...inline, [id]: doc };
  else {
    const list = Array.isArray(inline) ? inline : [];
    const at = list.findIndex((d) => isObj(d) && d.id === id);
    root.custom_animations = at < 0 ? [...list, doc] : list.map((d, i) => (i === at ? doc : d));
  }
}

/**
 * A copy of `config` shown in `look`. As configured returns the copy unchanged. Otherwise each library pick gets its document derived
 * in that style (and `icon_style`, absent for Living); icons that are not library picks, or that `source` does not know, stay as they are.
 * The given config is never changed.
 */
export function withLook(config: Obj, look: ForumShotLook, source?: LookSource): Obj {
  const out = copy(config);
  if (look === 'as-configured' || !source || !(ICON_STYLES as readonly string[]).includes(look)) return out;
  for (const entry of picks(out)) {
    const docId = String(entry.preset).slice(CUSTOM.length).trim();
    const doc = source.styleDoc(String(entry.library_icon), look, docId);
    if (!doc) continue;
    putDoc(out, { ...doc, id: docId });
    if (look === 'living') delete entry.icon_style;
    else entry.icon_style = look;
  }
  return out;
}
