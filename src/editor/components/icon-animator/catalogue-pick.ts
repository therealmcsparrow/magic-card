import type { AnimationConfig } from '../../../types';
import { validateAnimationDoc, type AnimationDoc } from '../../../anim-studio/model';
// v2 checking (rig, tracks) in validateAnimationDoc: a pick stores only what passes strictly
import '../../../anim-studio/model-v2';
import { CATALOGUE_DOC_PREFIX, catalogueDocId, type CataloguePreset } from '../../../contracts/preset-catalogue';
import type { IconAnimatorHost } from './loader';
import { cardState, patchCard, type CardState } from './card-request';
import { inlineDocs, removeInlineDoc, storedDoc, upsertInlineDoc } from './quick-model';

/*
 * Catalogue presets picked in the Animations dropdown: the document is stored inline in `custom_animations` as `cat-<entry id>`, one copy per entry per card.
 * Copies nothing plays any more are pruned.
 */

/**
 * `list` (the animation list with the entry already on `custom:cat-<entry.id>`) goes to `write`
 * (its own undo step, template sync marks by the list's owner), then the document is stored, folded
 * into that step. False outside the card editor or when the document is not valid: nothing written.
 */
export function pickCatalogue(
  h: IconAnimatorHost,
  from: EventTarget,
  entry: CataloguePreset,
  list: AnimationConfig[],
  write: (list: AnimationConfig[]) => void,
): boolean {
  const sm = cardState(from);
  const config = sm?.getConfig();
  if (!sm || !config) return false;
  const id = catalogueDocId(entry.id);
  let doc: AnimationDoc | undefined;
  if (!storedDoc(config, sm.getState().templateAnimations, id)) {
    const v = validateAnimationDoc({ ...entry.build(), id }, { v2: 'strict' });
    if (!v.ok) return false;
    doc = v.doc;
  }
  write(list);
  const d = doc;
  if (d) patchCard(from, (c) => upsertInlineDoc(c, d, h.customIds(c)), true);
  return true;
}

/**
 * After an edit that played or stops playing a `custom:cat-*` document: inline `cat-*` copies no
 * entry references any more go (with any orphaned quick document), folded into that edit's step.
 */
export function pruneCatalogue(h: IconAnimatorHost, sm: CardState): void {
  if (sm.attached === false) return;
  const c = sm.getConfig();
  const refs = h.customIds(c);
  const orphan = inlineDocs(c)
    .map((d) => String(d.id))
    .find((id) => id.startsWith(CATALOGUE_DOC_PREFIX) && !refs.includes(id));
  if (orphan) sm.updateConfig(removeInlineDoc(c, orphan, refs), false);
}
