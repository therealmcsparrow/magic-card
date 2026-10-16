import type { AnimationConfig, CardModule } from '../../../types';
import { validateAnimationDoc } from '../../../anim-studio/model';
// v2 checking (rig, tracks) in validateAnimationDoc: this chunk validates what a pick stores
import '../../../anim-studio/model-v2';
import type { IconAnimatorHost } from './loader';
import type { AnimatedIconPick } from './animated-icon-grid';
import { ICON_LIBRARY } from '../../../icon-anim/library';
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
 * Writes a tile picked in the icon picker's Animated icons tab like Animate icon's Apply: the module
 * edit first (its own undo step), the card's `custom_animations` change folded into that step.
 */

/**
 * The icon entry of `list` pointed at My animations document `id` (nothing stored): `write` gets
 * the new list, then the module's previous quick document goes unless something still plays it.
 * Shared by a My animations tile and Animate icon's Apply of an unchanged My animations document.
 */
export function referenceMine(
  h: IconAnimatorHost,
  from: EventTarget,
  list: AnimationConfig[],
  id: string,
  write: (list: AnimationConfig[]) => void,
): void {
  const ie = iconEntry(list);
  write(withQuickEntry(list, id));
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
  const v = validateAnimationDoc(
    { ...pick.entry.build(), id, name: pick.entry.name },
    { v2: 'strict' },
  );
  if (!v.ok) return false;
  const doc = v.doc;
  write(pick.entry.icon, withQuickEntry(list, id));
  patchCard(from, (c) => upsertInlineDoc(c, doc, h.customIds(c)), true);
  return true;
}

/**
 * The grid tile the module's icon entry stands for: a library reference gives its document id, a
 * quick document gives `lib:<entry id>` when its name is a built-in entry's, else ''.
 */
export function currentIconPick(h: IconAnimatorHost, from: EventTarget, module: CardModule): string {
  const ie = iconEntry(h.readAnimations(module.design ?? {}));
  if (!ie) return '';
  if (!ie.quick) return ie.id;
  const sm = cardState(from);
  const name = sm && storedDoc(sm.getConfig(), sm.getState().templateAnimations, ie.id)?.doc.name;
  const hit = ICON_LIBRARY.find((e) => e.name === name);
  return hit ? `lib:${hit.id}` : '';
}
