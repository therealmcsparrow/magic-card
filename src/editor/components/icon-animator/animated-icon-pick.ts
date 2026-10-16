import type { CardModule } from '../../../types';
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
 * Built-in tile: the library document is stored inline under a `quick-icon-*` id (the module's own
 * when no other module plays it) and the module gets the tile's icon. My animations tile: the entry
 * points at the library document, nothing is stored, and the module's previous quick document goes.
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
  const prev = ie?.quick ? ie.id : undefined;
  const write = (icon: string, id: string): void =>
    onModule({ ...module, icon, design: { ...design, animations: withQuickEntry(list, id) } });

  if (pick.kind === 'mine') {
    write(pick.doc.rig?.icon ?? String(module.icon ?? ''), pick.doc.id);
    if (prev) patchCard(from, (c) => removeInlineDoc(c, prev, h.customIds(c)), true);
    return true;
  }

  const tpl = sm.getState().templateAnimations;
  const lib = h.library.status === 'ready' ? h.library.list().map((d) => d.id) : [];
  const id =
    ie?.quick && referenceCount(config, ie.id) <= 1
      ? ie.id
      : newQuickId([...cardIds(config, h.customIds(config), tpl), ...lib]);
  const v = validateAnimationDoc(
    { ...pick.entry.build(), id, name: pick.entry.name },
    { v2: 'strict' },
  );
  if (!v.ok) return false;
  const doc = v.doc;
  write(pick.entry.icon, id);
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
