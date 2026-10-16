import { LitElement, html, css } from 'lit';
import type { MagicCardConfig } from '../../../types';
import type { CardState } from './card-request';
import { editorSystem } from '../../../css/editor-system';
import { readAnimations } from '../../../utils/animation';
import { entityIcon } from '../../../utils/entity-icon';
import { animationLibrary } from '../../../services/animation-library';
import { resolveIconGeometry, setIconGeometry } from '../../../icons/icon-source';
import {
  animationStudioUrl,
  customAnimationIds,
  inAnimationStudioPanel,
  onAnimationStudioLink,
} from '../../../utils/custom-animations';

/*
 * The quick icon animator (Design tab, "Animate icon") lives in a lazy editor chunk,
 * dist/magic-card-icon-animator.js, loaded next to magic-card.js on first use (public path:
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
  entityIcon,
  library: animationLibrary,
  resolveIcon: resolveIconGeometry,
  setIcon: setIconGeometry,
  studioUrl: animationStudioUrl,
  inStudio: inAnimationStudioPanel,
  studioLink: onAnimationStudioLink,
  customIds: customAnimationIds,
};
export type IconAnimatorHost = typeof host;

/** Modules whose main icon can play an icon animation (renderIcon `part: 'icon'`, the rig hook). */
export const QUICK_ANIMATOR_MODULES = ['icon', 'button', 'info', 'light'];

/**
 * After an edit of a card with inline animations (editor-state updateConfig): "This icon"
 * animations follow their module's new icon, in the chunk (follow-icon.ts).
 */
export const followIcons = (sm: CardState, prev: MagicCardConfig, next: MagicCardConfig): void =>
  void import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then((m) => m.followIcons(host, sm, prev, next))
    .catch(() => {});

let pending: Promise<boolean> | undefined;

/** Load the chunk once and define <mc-icon-animator>; false when it cannot load (retried next time). */
export function loadIconAnimator(): Promise<boolean> {
  // a chunk that loads but cannot define the element (an older card with a newer cached chunk)
  // counts as a failure too: the panel goes back to its button and says so
  pending ??= import(/* webpackChunkName: "icon-animator" */ './icon-animator-entry')
    .then((m) => {
      m.defineIconAnimator(host);
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
