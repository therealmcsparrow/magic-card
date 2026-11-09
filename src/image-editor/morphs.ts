import type { ImageAnimation } from '../contracts/image-animation';

// Carries a stored animation through an edit: the morph `<animate>` copies come off their paths on open and go back on build.

/** Path id to the attributes of the `<animate>` it held. */
export type MorphCopies = ReadonlyMap<string, readonly (readonly [string, string])[]>;

/** Takes every `<animate>` off its parent path in a parsed drawing and returns them by path id. */
export function liftMorphs(xml: Document): MorphCopies {
  const out = new Map<string, [string, string][]>();
  for (const a of [...xml.getElementsByTagName('animate')]) {
    const id = a.parentElement?.getAttribute('id');
    if (id && !out.has(id)) out.set(id, [...a.attributes].map((x): [string, string] => [x.name, x.value]));
    a.remove();
  }
  return out;
}

/**
 * The built markup with each copy back on the path of its id (before the image sanitiser reads it), and the ids of
 * the `<animate>` elements written. Markup that does not parse comes back unchanged.
 */
export function putMorphs(raw: string, copies: MorphCopies): { svg: string; put: Set<string> } {
  const put = new Set<string>();
  if (!copies.size) return { svg: raw, put };
  const xml = new DOMParser().parseFromString(raw, 'image/svg+xml');
  if (xml.getElementsByTagName('parsererror').length) return { svg: raw, put };
  for (const p of [...xml.getElementsByTagName('path')]) {
    const attrs = copies.get(p.getAttribute('id') ?? '');
    if (!attrs) continue;
    const a = xml.createElementNS(p.namespaceURI, 'animate');
    for (const [k, v] of attrs) a.setAttribute(k, v);
    p.appendChild(a);
    put.add(a.getAttribute('id') ?? '');
  }
  return put.size ? { svg: new XMLSerializer().serializeToString(xml), put } : { svg: raw, put };
}

/**
 * The animation without the tracks whose `part:` target is not in `ids` and the morphs whose path is not in `ids` or
 * whose `<animate>` was not written back (`put`); undefined when there is none.
 */
export function keepAnimation(anim: ImageAnimation | undefined, ids: ReadonlySet<string>, put: ReadonlySet<string>): ImageAnimation | undefined {
  if (!anim) return undefined;
  const clips = anim.clips.map((c) => {
    const tracks = c.tracks.filter((tr) => tr.target === 'element' || ids.has(tr.target.slice(5)));
    if (!c.morphs) return { ...c, tracks };
    return { ...c, tracks, morphs: c.morphs.filter((m) => ids.has(m.target) && put.has(m.smil)) };
  });
  return { ...anim, clips };
}
