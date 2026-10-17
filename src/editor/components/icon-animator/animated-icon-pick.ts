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
 * Writes a tile picked in the icon picker's Animated icons tab: the module
 * edit first (its own undo step), the card's `custom_animations` change folded into that step.
 * A library tile stores the entry's document in the picked Style (icon-anim/style.ts) and records
 * `library_icon` / `icon_style` on the icon entry (contract icon-library LibraryPickFields).
 */

/** The icon entry without the library pick fields (a My animations pick, a hand-made document). */
const withoutPickFields = (list: AnimationConfig[], index: number): AnimationConfig[] =>
  list.map((a, i) => {
    if (i !== index) return a;
    const rest = { ...a };
    delete rest.library_icon;
    delete rest.icon_style;
    return rest;
  });

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
 * Built-in tile: the library document is stored inline under a `quick-icon-*` id (the module's own
 * when no other module plays it) and the module gets the tile's icon. My animations tile: the entry
 * points at the library document, nothing is stored, and the module's previous quick document goes;
 * the module's icon changes only when the document names one. On a template-linked card the
 * module's animation list is marked not_synced (the General tab's sync wrapper skips `design`).
 * False outside the card editor (nothing written) or when the document is not valid.
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
    return true;
  }

  const tpl = sm.getState().templateAnimations;
  const lib = h.library.status === 'ready' ? h.library.list().map((d) => d.id) : [];
  const id =
    ie?.quick && !ie.id.startsWith(MINE_PREFIX) && referenceCount(config, ie.id) <= 1
      ? ie.id
      : newQuickId([...cardIds(config, h.customIds(config), tpl), ...lib]);
  const style = pick.style ?? DEFAULT_ICON_STYLE;
  const v = validateAnimationDoc({ ...styleDoc(pick.entry, style, id), name: pick.entry.name }, { v2: 'strict' });
  if (!v.ok) return false;
  const doc = v.doc;
  write(pick.entry.icon, withPickFields(withQuickEntry(list, id), pick.entry.id, style));
  patchCard(from, (c) => upsertInlineDoc(c, doc, h.customIds(c)), true);
  return true;
}

/**
 * The grid tile the module's icon entry stands for: a library reference gives its document id, a
 * quick document gives `lib:<entry id>` from its `library_icon`, else (2026.10.03 configs) when its
 * name is a built-in entry's; '' otherwise.
 */
export function currentIconPick(h: IconAnimatorHost, from: EventTarget, module: CardModule): string {
  const ie = iconEntry(h.readAnimations(module.design ?? {}));
  if (!ie) return '';
  if (!ie.quick) return ie.id;
  const lib = ie.entry.library_icon;
  if (lib && ICON_LIBRARY.some((e) => e.id === lib)) return `lib:${lib}`;
  const sm = cardState(from);
  const name = sm && storedDoc(sm.getConfig(), sm.getState().templateAnimations, ie.id)?.doc.name;
  const hit = ICON_LIBRARY.find((e) => e.name === name);
  return hit ? `lib:${hit.id}` : '';
}

/**
 * The Style of the module's library icon (its entry's `icon_style`; absent: Living, which is also
 * what a 2026.10.03 pick or any other icon animation reads as).
 */
export function currentIconStyle(h: IconAnimatorHost, module: CardModule): IconStyle {
  const ie = iconEntry(h.readAnimations(module.design ?? {}));
  const s = ie?.quick ? ie.entry.icon_style : undefined;
  return s === 'quiet' || s === 'glow' ? s : DEFAULT_ICON_STYLE;
}
