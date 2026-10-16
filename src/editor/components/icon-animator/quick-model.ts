import type { AnimationConfig, MagicCardConfig } from '../../../types';
import {
  CUSTOM_PREFIX,
  customRefId,
  isCustomRef,
  type AnimationDoc,
} from '../../../anim-studio/model';

/*
 * The quick icon animator's config edits (pure). Apply stores the document inline in the card's
 * `custom_animations` (the card editor cannot write the Magic Card Utils library) and points one
 * design animation entry of the module at it: `{ preset: 'custom:<id>', target: 'icon' }`.
 * Its documents use ids starting with `quick-`, which is how the animator finds its own entry again.
 * Imports nothing from magic-card.js but anim-studio/model (see loader.ts): the ids a card references
 * (customAnimationIds) come in as arguments.
 */

export const QUICK_PREFIX = 'quick-';

/**
 * An edited copy of a My animations document (Animate icon's Apply after a change): a library
 * animation, never a split of the module's own icon, so it does not follow the icon (it goes).
 */
export const MINE_PREFIX = `${QUICK_PREFIX}mine-`;

/**
 * The card's key the animator writes. On a template-linked card the card's documents merge with the
 * template's by id (template-merge.ts): Apply adds this card's own version, the rest stays synced.
 */
export const INLINE_KEY = 'custom_animations';

export const isQuickRef = (preset: unknown): boolean =>
  isCustomRef(preset) && customRefId(preset).startsWith(QUICK_PREFIX);

/** The module's quick animation entry (the first `custom:quick-*` entry) and its document id. */
export function quickEntry(
  list: AnimationConfig[],
): { index: number; entry: AnimationConfig; id: string } | undefined {
  const index = list.findIndex((a) => isQuickRef(a.preset));
  return index < 0 ? undefined : { index, entry: list[index], id: customRefId(list[index].preset) };
}

/** The animation entries the icon picker's animated icons tab writes (`anim-icon-N`). */
export const ICON_ENTRY_RE = /^anim-icon-\d+$/;

/**
 * The module's icon animation entry: the first `custom:quick-*` entry (a document stored in the
 * card, `quick: true`), else the first picker entry (`anim-icon-N`) pointing at a library document.
 * Hand-added `custom:` entries with other ids are not the picker's and stay untouched.
 */
export function iconEntry(
  list: AnimationConfig[],
): { index: number; entry: AnimationConfig; id: string; quick: boolean } | undefined {
  const q = quickEntry(list);
  if (q) return { ...q, quick: true };
  const index = list.findIndex((a) => ICON_ENTRY_RE.test(String(a.id)) && isCustomRef(a.preset));
  return index < 0
    ? undefined
    : { index, entry: list[index], id: customRefId(list[index].preset), quick: false };
}

/** The card's inline documents as a list (YAML may hold a list or an id-keyed map). */
export function inlineDocs(
  config: { custom_animations?: unknown } | undefined,
): Array<Record<string, unknown>> {
  const raw = config?.custom_animations;
  if (Array.isArray(raw))
    return raw.filter((d): d is Record<string, unknown> => !!d && typeof d === 'object');
  if (raw && typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>)
      .filter(([, d]) => !!d && typeof d === 'object')
      .map(([id, d]) => ({ id, ...(d as Record<string, unknown>) }));
  }
  return [];
}

/** The inline document with this id (raw, as stored). */
export const inlineDoc = (
  config: MagicCardConfig | undefined,
  id: string,
): Record<string, unknown> | undefined => inlineDocs(config).find((d) => d.id === id);

/**
 * A new quick document id, unique against `taken` (inline ids, library ids, references); `kind`
 * 'mine' gives a MINE_PREFIX id.
 */
export function newQuickId(
  taken: Iterable<string>,
  rand: () => number = Math.random,
  kind: 'icon' | 'mine' = 'icon',
): string {
  const used = new Set(taken);
  for (let n = 0; ; n++) {
    const id = `${QUICK_PREFIX}${kind}-${
      n < 32
        ? Math.floor(rand() * 36 ** 6)
            .toString(36)
            .padStart(6, '0')
        : n
    }`;
    if (!used.has(id)) return id;
  }
}

/**
 * The document the card plays for `id`: its own, else (linked card) the template's `tpl` one unless
 * hidden or the whole list is local. `template`: it comes from the template.
 */
export function storedDoc(
  config: MagicCardConfig | undefined,
  tpl: unknown,
  id: string,
): { doc: Record<string, unknown>; template: boolean } | undefined {
  const own = inlineDoc(config, id);
  if (own) return { doc: own, template: false };
  if (!config?.template || config.not_synced?.includes(INLINE_KEY) || config.hidden_animations?.includes(id))
    return undefined;
  const doc = inlineDocs({ custom_animations: tpl }).find((d) => d.id === id);
  return doc ? { doc, template: true } : undefined;
}

/**
 * Every id the card already uses: its inline documents, the template's (`tpl`) and its `custom:`
 * references (`refs`).
 */
export const cardIds = (config: MagicCardConfig | undefined, refs: string[], tpl?: unknown): string[] => [
  ...inlineDocs(config).map((d) => String(d.id)),
  ...inlineDocs({ custom_animations: tpl }).map((d) => String(d.id)),
  ...refs,
];

/**
 * The animation list with the icon entry (quick or picker library reference) pointing at `id`: it keeps its
 * other fields (play condition, colour...), else a new entry on the icon is appended.
 */
export function withQuickEntry(list: AnimationConfig[], id: string): AnimationConfig[] {
  const preset = CUSTOM_PREFIX + id;
  const q = iconEntry(list);
  if (q) return list.map((a, i) => (i === q.index ? { ...a, preset, target: 'icon' } : a));
  const taken = new Set(list.map((a) => a.id));
  let n = 1;
  while (taken.has(`anim-icon-${n}`)) n++;
  return [...list, { id: `anim-icon-${n}`, preset, target: 'icon', trigger: 'always' }];
}

/** The animation list without the icon entry (quick or picker library reference). */
export function withoutQuickEntry(list: AnimationConfig[]): AnimationConfig[] {
  const q = iconEntry(list);
  return q ? list.filter((_a, i) => i !== q.index) : list;
}

type Inline = MagicCardConfig['custom_animations'];

/**
 * The inline documents without the animator's own (`quick-*`) ones nothing references any more
 * (`refs`: the card's custom ids), except `keep`; `also`: one more unreferenced id to drop.
 */
function pruned(raw: Inline, refs: string[], keep?: string, also?: string): Inline | undefined {
  const used = new Set(refs);
  const drop = (id: unknown) =>
    typeof id === 'string' &&
    id !== keep &&
    !used.has(id) &&
    (id.startsWith(QUICK_PREFIX) || id === also);
  if (Array.isArray(raw)) {
    const list = raw.filter((d) => !drop(d?.id));
    return list.length ? list : undefined;
  }
  if (raw && typeof raw === 'object') {
    const map = Object.fromEntries(Object.entries(raw).filter(([id]) => !drop(id)));
    return Object.keys(map).length ? map : undefined;
  }
  return undefined;
}

const withInline = (config: MagicCardConfig, next: Inline | undefined): MagicCardConfig => {
  const out = { ...config, custom_animations: next };
  if (!next) delete out.custom_animations;
  return out;
};

/**
 * The card with `doc` stored inline (replacing a document with its id; a map stays a map), and
 * without orphaned quick documents (`refs`: the card's custom ids after the module edit).
 */
export function upsertInlineDoc(
  config: MagicCardConfig,
  doc: AnimationDoc,
  refs: string[],
): MagicCardConfig {
  const raw = config.custom_animations;
  const stored = { ...doc } as unknown as Record<string, unknown>;
  let next: Inline;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    next = { ...raw, [doc.id]: stored };
  } else {
    const list = Array.isArray(raw) ? raw : [];
    const at = list.findIndex((d) => d?.id === doc.id);
    next = at < 0 ? [...list, stored] : list.map((d, i) => (i === at ? stored : d));
  }
  return withInline(config, pruned(next, refs, doc.id));
}

/**
 * The card without the inline document `id` unless the card still references it (`refs`: its
 * custom ids), and without any other orphaned quick document.
 */
export function removeInlineDoc(
  config: MagicCardConfig,
  id: string,
  refs: string[],
): MagicCardConfig {
  const raw = config.custom_animations;
  if (!raw || typeof raw !== 'object') return config;
  const next = pruned(raw, refs, undefined, id);
  if (JSON.stringify(next) === JSON.stringify(raw)) return config;
  return withInline(config, next);
}

/** How many design entries of the card (any module, row, column or the card) play custom:<id>. */
export function referenceCount(config: MagicCardConfig | undefined, id: string): number {
  if (!config) return 0;
  const { custom_animations: _inline, ...rest } = config;
  void _inline;
  const needle = JSON.stringify(CUSTOM_PREFIX + id);
  return JSON.stringify(rest).split(`"preset":${needle}`).length - 1;
}
