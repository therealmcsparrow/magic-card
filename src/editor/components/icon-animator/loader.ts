import { LitElement, html, css } from 'lit';
import type { AnimatedIconPick } from './animated-icon-grid';
import type { AnimationConfig, CardModule, MagicCardConfig } from '../../../types';
import type { CataloguePreset } from '../../../contracts/preset-catalogue';
import type { CardState } from './card-request';
import { editorSystem } from '../../../css/editor-stack';
import { readAnimations } from '../../../anim-studio/entries';
import { animLibrary } from '../../../utils/anim-hooks';
import { svgIconApi } from '../../../utils/svg-icon-loader';
import { customAnimationIds } from '../../../utils/custom-animations';

// Loads the lazy icon-animator chunk on first use; dashboards never load it.
// The chunk gets the card bundle's modules from `host` instead of importing them.
type IconApi = NonNullable<ReturnType<typeof svgIconApi>>;

export const host = {
  LitElement,
  html,
  css,
  editorSystem,
  readAnimations,
  /** Read at use: the `anim` chunk registers the library when it loads. */
  get library() {
    return animLibrary();
  },
  resolveIcon: (...a: Parameters<IconApi['resolveIconGeometry']>) => svgIconApi()!.resolveIconGeometry(...a),
  setIcon: (...a: Parameters<IconApi['setIconGeometry']>) => svgIconApi()!.setIconGeometry(...a),
  customIds: customAnimationIds,
};
export type IconAnimatorHost = typeof host;

/**
 * After an edit of a card with icon animation entries (editor-state updateConfig): "This icon"
 * animations follow their module's new icon, library ones go, in the chunk (follow-icon.ts); inline
 * catalogue copies nothing plays any more go (catalogue-pick.ts).
 */
export const followIcons = (sm: CardState, prev: MagicCardConfig, next: MagicCardConfig): void =>
  void import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then((m) => {
      m.followIcons(host, sm, prev, next);
      m.pruneCatalogue(host, sm);
    })
    .catch(() => {});

let pending: Promise<boolean> | undefined;
let chunk: typeof import('./icon-animator-entry') | undefined;

/** Load the chunk once and define <mc-animated-icon-grid>; false when it cannot load (retried next time). */
export function loadIconAnimator(): Promise<boolean> {
  // a chunk that loads but cannot define the element (an older card with a newer cached chunk)
  // counts as a failure too
  pending ??= import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then(async (m) => {
      if (!(await m.iconNamesReady())) throw new Error('icon names');
      chunk = m;
      m.defineAnimatedIconGrid(host);
      return true;
    })
    .catch((err: unknown) => {
      pending = undefined;
      console.warn('Magic Card:', err);
      return false;
    });
  return pending;
}

/** A tile of the icon picker's Animated icons tab: write it (animated-icon-pick.ts). */
export const applyAnimatedIconPick = (
  from: EventTarget,
  module: CardModule,
  onModule: (m: CardModule) => void,
  pick: AnimatedIconPick,
): Promise<boolean> =>
  import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then((m) => m.pickAnimatedIcon(host, from, module, onModule, pick))
    .catch((err: unknown) => {
      console.warn('Magic Card:', err);
      return false;
    });

/** The grid tile on the module now (after loadIconAnimator resolved; '' before). */
export const currentIconPick = (from: EventTarget, module: CardModule): string =>
  chunk?.currentIconPick(host, from, module) ?? '';

/** The Style of the module's library icon (after loadIconAnimator resolved; Living before). */
export const currentIconStyle = (from: EventTarget, module: CardModule): string => chunk?.currentIconStyle(host, from, module) ?? 'living';

/**
 * A catalogue preset picked in the Animations dropdown (preset-catalogue 1.1.0): `list` goes to
 * `write`, the document is stored inline (catalogue-pick.ts). False when nothing was written.
 */
export const applyCataloguePick = (
  from: EventTarget,
  entry: CataloguePreset,
  list: AnimationConfig[],
  write: (list: AnimationConfig[]) => void,
): Promise<boolean> =>
  import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then((m) => m.pickCatalogue(host, from, entry, list, write))
    .catch((err: unknown) => {
      console.warn('Magic Card:', err);
      return false;
    });
