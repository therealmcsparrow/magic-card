import type { MessageId } from '../../contracts/i18n';
import { lm } from '../../i18n/labels/mark';
import type { AnimationConfig } from '../../types';
import { onIcon } from '../../anim-studio/entries';
import { getAnimationPreset, type AnimationChannel } from '../../utils/animation-presets';

/*
 * Which earlier animation an entry overrides (the Animations list in the editor). Editor side: the card never needs it.
 * Moved verbatim from src/utils/animation.ts.
 */

type Prop = 'rotate' | 'translate' | 'scale' | 'opacity' | 'filter' | 'box-shadow';

const PROP_LABEL: Record<Prop, MessageId> = {
  rotate: lm('rotation'),
  translate: lm('position'),
  scale: lm('scale'),
  opacity: lm('opacity'),
  filter: lm('filter'),
  'box-shadow': lm('glow'),
};

/** Which earlier animation an entry overrides, and which property both animate; the editor words it (labels namespace). */
export interface ConflictNote {
  name: MessageId;
  what: MessageId;
}

/** CSS properties an entry animates on its element: a glow is box-shadow on a wrapper, filter on an icon. */
function props(channels: AnimationChannel[], onIcon: boolean): Prop[] {
  return channels.flatMap((c): Prop[] => (c === 'fx' ? [] : c === 'glow' ? [onIcon ? 'filter' : 'box-shadow'] : [c]));
}


/**
 * Per entry, a note when it overrides an earlier entry on the same element and property (the
 * later animation in a CSS animation list wins), e.g. { name: Spin, what: rotation }.
 */
export function animationConflicts(list: AnimationConfig[], opts: { allowIcon?: boolean } = {}): Array<ConflictNote | undefined> {
  const allowIcon = opts.allowIcon !== false;
  return list.map((e, i) => {
    const p = getAnimationPreset(e.preset);
    if (!p) return undefined;
    const mine = props(p.channels, onIcon(e, allowIcon));
    for (let j = i - 1; j >= 0; j--) {
      const q = getAnimationPreset(list[j].preset);
      if (!q || onIcon(list[j], allowIcon) !== onIcon(e, allowIcon)) continue;
      const shared = props(q.channels, onIcon(list[j], allowIcon)).find((x) => mine.includes(x));
      if (!shared) continue;
      const glow = p.channels.includes('glow') || q.channels.includes('glow');
      const what = shared === 'filter' && glow ? PROP_LABEL['box-shadow'] : PROP_LABEL[shared];
      return { name: q.name, what };
    }
    return undefined;
  });
}