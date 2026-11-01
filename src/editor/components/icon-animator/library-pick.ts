import type { AnimationConfig } from '../../../types';
import { validateAnimationDoc, type AnimationDoc } from '../../../anim-studio/model';
import { ICON_LIBRARY } from '../../../icon-anim/library';
import { isGlowPaint, styleDoc } from '../../../icon-anim/style';
import type { IconStyle, LibraryEntry } from '../../../contracts/icon-library';

/* Hand-edit rule for library picks: an icon entry with `library_icon` is a library pick only while its stored document is still what styleDoc gives for that entry and Style. */

/** A document as comparable text: normalised, without name, glow colours as one token, keys sorted. */
function canonical(raw: unknown): string | undefined {
  const v = validateAnimationDoc(raw, { v2: 'lenient' });
  if (!v.ok) return undefined;
  const doc: Record<string, unknown> = { ...v.doc };
  delete doc.name;
  delete doc.mirror;
  return JSON.stringify(doc, (_k, val: unknown) => {
    if (isGlowPaint(val)) return 'glow-paint';
    if (val && typeof val === 'object' && !Array.isArray(val))
      return Object.fromEntries(
        Object.keys(val)
          .sort()
          .map((k) => [k, (val as Record<string, unknown>)[k]]),
      );
    return val;
  });
}

/** The document with the entry's mirror flag copied in; an entry with no flag leaves the document as it is. */
export function withLibraryMirror(doc: AnimationDoc, entry: Pick<LibraryEntry, 'mirror'>): AnimationDoc {
  const flag = entry.mirror;
  return flag === 'mirror' || flag === 'keep' ? { ...doc, mirror: flag } : doc;
}

const seen = new Map<string, boolean>();

/**
 * The library entry and Style the icon entry's document `raw` still is; undefined when the entry
 * has no (known) `library_icon` or the document was edited by hand.
 */
export function libraryPickOf(
  entry: AnimationConfig | undefined,
  raw: Record<string, unknown> | undefined,
): { lib: LibraryEntry; style: IconStyle } | undefined {
  const lib = entry?.library_icon
    ? ICON_LIBRARY.find((e) => e.id === entry.library_icon)
    : undefined;
  if (!lib || !raw) return undefined;
  const style: IconStyle =
    entry!.icon_style === 'quiet' || entry!.icon_style === 'glow' ? entry!.icon_style : 'living';
  const key = `${lib.id}|${style}|${JSON.stringify(raw)}`;
  let same = seen.get(key);
  if (same === undefined) {
    const stored = canonical(raw);
    same = !!stored && stored === canonical(styleDoc(lib, style, { id: String(raw.id) }));
    if (seen.size > 64) seen.clear();
    seen.set(key, same);
  }
  return same ? { lib, style } : undefined;
}

/** The entry still carries library pick fields but its document is the user's own now. */
export const handEdited = (
  entry: AnimationConfig | undefined,
  raw: Record<string, unknown> | undefined,
): boolean => !!entry?.library_icon && !!raw && !libraryPickOf(entry, raw);

/** The entry without the library pick fields. */
export function withoutPickFields<T extends AnimationConfig>(entry: T): T {
  const out = { ...entry };
  delete out.library_icon;
  delete out.icon_style;
  return out;
}
