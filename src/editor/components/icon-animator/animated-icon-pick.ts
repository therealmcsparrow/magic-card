import type { AnimationConfig, CardModule } from '../../../types';
import { validateAnimationDoc } from '../../../anim-studio/model';
// v2 checking (rig, tracks) in validateAnimationDoc: this chunk validates what a pick stores
import '../../../anim-studio/model-v2';
import type { IconAnimatorHost } from './loader';
import type { AnimatedIconPick } from './animated-icon-grid';
import { ICON_LIBRARY } from '../../../icon-anim/library';
import { styleDoc } from '../../../icon-anim/style';
import { DEFAULT_ICON_STYLE, type IconStyle } from '../../../contracts/icon-library';
import { cardState, patchCard } from './card-request';
import { handEdited, libraryPickOf, withLibraryMirror, withoutPickFields as plainEntry } from './library-pick';
import {
  cardIds,
  iconEntry,
  MINE_PREFIX,
  newQuickId,
  referenceCount,
  storedDoc,
  removeInlineDoc,
  upsertInlineDoc,
  withQuickEntry,
} from './quick-model';

/*
 * Writes a tile picked in the Animated icons tab: the module edit and the card `custom_animations` change in one undo step.
 * A library tile stores the document in the picked Style and sets `library_icon` / `icon_style`; a hand-edited document is not a library pick.
 */

/**
 * mcu-library KEEP_COPY_ANIMATION_DEFAULT_MAX_BYTES. Not imported: the editor chunk imports that contract and a module
 * both chunks share stops being scope-hoisted (icon-animator-0034-q).
 */
const KEEP_COPY_MAX_BYTES = 8 * 1024;

/** The icon entry without the library pick fields (a My animations pick, a hand-made document). */
const withoutPickFields = (list: AnimationConfig[], index: number): AnimationConfig[] =>
  list.map((a, i) => (i === index ? plainEntry(a) : a));

/** The icon entry recording which library entry and Style its document came from (Living: no field). */
function withPickFields(list: AnimationConfig[], entryId: string, style: IconStyle): AnimationConfig[] {
  const ie = iconEntry(list);
  if (!ie) return list;
  return list.map((a, i) => {
    if (i !== ie.index) return a;
    const next: AnimationConfig = { ...a, library_icon: entryId };
    delete next.icon_style;
    if (style !== 'living') next.icon_style = style;
    return next;
  });
}

/**
 * The icon entry of `list` pointed at My animations document `id` (nothing stored): `write` gets
 * the new list, then the module's previous quick document goes unless something still plays it.
 * Used by a My animations tile.
 */
export function referenceMine(
  h: IconAnimatorHost,
  from: EventTarget,
  list: AnimationConfig[],
  id: string,
  write: (list: AnimationConfig[]) => void,
): void {
  const ie = iconEntry(list);
  const next = withQuickEntry(list, id);
  const at = iconEntry(next)?.index;
  write(at === undefined ? next : withoutPickFields(next, at));
  if (ie?.quick) patchCard(from, (c) => removeInlineDoc(c, ie.id, h.customIds(c)), true);
}

/**
 * Applies a tile pick: a built-in tile stores the document inline under a `quick-icon-*` id; a My animations tile points at the library document.
 * False outside the card editor or for an invalid document.
 */
export function pickAnimatedIcon(
  h: IconAnimatorHost,
  from: EventTarget,
  module: CardModule,
  onModule: (m: CardModule) => void,
  pick: AnimatedIconPick,
): boolean {
  const sm = cardState(from);
  const config = sm?.getConfig();
  if (!sm || !config) return false;
  const design = module.design ?? {};
  const list = h.readAnimations(design);
  const ie = iconEntry(list);
  const marks = (module.not_synced ?? []) as string[];
  const write = (icon: string | undefined, animations: AnimationConfig[]): void => {
    const next: CardModule = { ...module, design: { ...design, animations } };
    if (icon) next.icon = icon;
    if (config.template && !marks.includes('design.animations'))
      next.not_synced = [...marks, 'design.animations'];
    onModule(next);
  };

  if (pick.kind === 'mine') {
    referenceMine(h, from, list, pick.doc.id, (l) => write(pick.doc.rig?.icon, l));
    // keep a copy (small documents by default, mcu-library): folded into the pick's undo step
    if (new TextEncoder().encode(JSON.stringify(pick.doc)).length <= KEEP_COPY_MAX_BYTES) patchCard(from, (c) => upsertInlineDoc(c, pick.doc, h.customIds(c)), true);
    return true;
  }

  const tpl = sm.getState().templateAnimations;
  // a Style change never overwrites a document the user edited by hand
  if (pick.restyle && ie?.quick && handEdited(ie.entry, storedDoc(config, tpl, ie.id)?.doc)) return false;
  const lib = h.library.status === 'ready' ? h.library.list().map((d) => d.id) : [];
  const id =
    ie?.quick && !ie.id.startsWith(MINE_PREFIX) && referenceCount(config, ie.id) <= 1
      ? ie.id
      : newQuickId([...cardIds(config, h.customIds(config), tpl), ...lib]);
  const style = pick.style ?? DEFAULT_ICON_STYLE;
  const v = validateAnimationDoc({ ...withLibraryMirror(styleDoc(pick.entry, style, { id, color: ie?.entry.color }), pick.entry), name: pick.entry.name }, { v2: 'strict' });
  if (!v.ok) return false;
  const doc = v.doc;
  write(pick.entry.icon, withPickFields(withQuickEntry(list, id), pick.entry.id, style));
  patchCard(from, (c) => upsertInlineDoc(c, doc, h.customIds(c)), true);
  return true;
}

/** The module's quick icon entry and the document it plays (undefined outside the card editor). */
function quickPlayed(h: IconAnimatorHost, from: EventTarget, module: CardModule) {
  const ie = iconEntry(h.readAnimations(module.design ?? {}));
  const sm = cardState(from);
  if (!ie?.quick || !sm) return undefined;
  return { ie, raw: storedDoc(sm.getConfig(), sm.getState().templateAnimations, ie.id)?.doc };
}

/**
 * The grid tile the module's icon entry stands for: a library reference gives its document id, a
 * quick document gives `lib:<entry id>` while it is still that entry's derived document
 * (`library_icon`), else, for 2026.10.03 configs without the field, when its name is a built-in
 * entry's; '' otherwise (also for a document edited by hand).
 */
export function currentIconPick(h: IconAnimatorHost, from: EventTarget, module: CardModule): string {
  const ie = iconEntry(h.readAnimations(module.design ?? {}));
  if (!ie) return '';
  if (!ie.quick) return ie.id;
  const q = quickPlayed(h, from, module);
  if (!q) return '';
  if (q.ie.entry.library_icon && ICON_LIBRARY.some((e) => e.id === q.ie.entry.library_icon)) {
    const pick = libraryPickOf(q.ie.entry, q.raw);
    return pick ? `lib:${pick.lib.id}` : '';
  }
  const hit = ICON_LIBRARY.find((e) => e.name === q.raw?.name);
  return hit ? `lib:${hit.id}` : '';
}

/**
 * The Style of the module's library icon (its entry's `icon_style` while the document is still the
 * derived one; Living otherwise, which is also what a 2026.10.03 pick reads as).
 */
export function currentIconStyle(h: IconAnimatorHost, from: EventTarget, module: CardModule): IconStyle {
  const q = quickPlayed(h, from, module);
  return (q && libraryPickOf(q.ie.entry, q.raw)?.style) ?? DEFAULT_ICON_STYLE;
}
