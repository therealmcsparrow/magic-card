import { LitElement, html, css } from 'lit';
import type { AnimatedIconPick } from './animated-icon-grid';
import type { AnimationConfig, CardModule, MagicCardConfig } from '../../../types';
import type { CataloguePreset } from '../../../contracts/preset-catalogue';
import type { CardState } from './card-request';
import { editorSystem } from '../../../css/editor-system';
import { readAnimations } from '../../../utils/animation';
import { animationLibrary } from '../../../services/animation-library';
import { resolveIconGeometry, setIconGeometry } from '../../../icons/icon-source';
import { customAnimationIds } from '../../../utils/custom-animations';

/*
 * The icon picker's Animated icons tab (its grid, its picks) and the follow-icon edits live in a lazy
 * editor chunk, dist/magic-card-icon-animator.js, loaded next to magic-card.js on first use (public path:
 * src/index.ts). Dashboards never load it. Part of magic-card.js: keep it tiny.
 *
 * The chunk gets the card bundle's modules it needs from `host` instead of importing them: a module
 * of magic-card.js that a chunk imports can no longer be scope-hoisted into the bundle, which costs
 * the bundle kilobytes. So the chunk imports only its own modules and those magic-card.js already
 * shares with the runtime chunk (anim-studio/model, compile, icons/path-math, svg-sanitize,
 * utils/animation-presets); everything else comes in here (short keys: their names are bytes in
 * magic-card.js).
 */
export const host = {
  LitElement,
  html,
  css,
  editorSystem,
  readAnimations,
  library: animationLibrary,
  resolveIcon: resolveIconGeometry,
  setIcon: setIconGeometry,
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
