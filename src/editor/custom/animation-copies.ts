import { KEEP_COPY_ANIMATION_DEFAULT_MAX_BYTES } from '../../contracts/mcu-library';
import { CUSTOM_PREFIX, customRefId, type AnimationDoc } from '../../anim-studio/model';
import { animLibrary } from '../../utils/anim-hooks';
import type { MagicCardConfig } from '../../types';
import { animationDocList } from '../../utils/custom-animations';
import type { CardState } from './bridge';

// "Keep a copy in this card" for a library animation: the document goes into `custom_animations` under its library id.

export const docBytes = (doc: unknown): number => new TextEncoder().encode(JSON.stringify(doc)).length;

/** The library document `id` and the library documents its custom steps play (itself first). */
export function libraryDocs(id: string): AnimationDoc[] {
  const out = new Map<string, AnimationDoc>();
  const queue = [id];
  while (queue.length) {
    const x = queue.shift()!;
    const doc = animLibrary().get(x);
    if (!doc || out.has(x)) continue;
    out.set(x, doc);
    for (const s of doc.steps ?? []) if (typeof s?.animation === 'string' && s.animation.startsWith(CUSTOM_PREFIX)) queue.push(customRefId(s.animation));
  }
  return [...out.values()];
}

/** The card with `docs` stored as its own copies (a list stays a list, a map a map). */
export function withDocs(c: MagicCardConfig, docs: Array<Record<string, unknown>>): MagicCardConfig {
  const raw = c.custom_animations;
  if (raw && !Array.isArray(raw)) return { ...c, custom_animations: { ...raw, ...Object.fromEntries(docs.map((d) => [String(d.id), d])) } } as MagicCardConfig;
  const ids = new Set(docs.map((d) => d.id));
  return { ...c, custom_animations: [...animationDocList(raw).filter((d) => !ids.has(d.id)), ...docs] };
}

/** Whether the card holds its own copy of `id`. */
export const hasCopy = (c: MagicCardConfig | undefined, id: string): boolean => animationDocList(c?.custom_animations).some((d) => d.id === id);

/**
 * Keep (or drop) the card's copy of library animation `id`; folded into the previous undo step when
 * `fold`. Nothing happens for an id the library does not have.
 */
export function setAnimationCopy(sm: CardState | undefined, id: string, on: boolean, fold: boolean): void {
  if (!sm || sm.attached === false) return;
  const c = sm.getConfig();
  if (on) {
    const docs = libraryDocs(id).filter((d) => !hasCopy(c, d.id));
    if (docs.length) sm.updateConfig(withDocs(c, docs as unknown as Array<Record<string, unknown>>), !fold);
  } else if (hasCopy(c, id)) {
    const raw = c.custom_animations;
    const next = Array.isArray(raw) ? raw.filter((d) => d?.id !== id) : Object.fromEntries(Object.entries(raw ?? {}).filter(([k]) => k !== id));
    const out = { ...c, custom_animations: next } as MagicCardConfig;
    if (!Object.keys(next).length) delete out.custom_animations;
    sm.updateConfig(out, !fold);
  }
}

/** A pick of library animation `id`: the copy is kept when the document is small enough. */
export function keepPicked(sm: CardState | undefined, id: string): void {
  const doc = animLibrary().get(id);
  if (doc && docBytes(doc) <= KEEP_COPY_ANIMATION_DEFAULT_MAX_BYTES) setAnimationCopy(sm, id, true, true);
}
