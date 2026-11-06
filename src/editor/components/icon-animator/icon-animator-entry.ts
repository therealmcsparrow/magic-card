/* Entry of the lazy icon-animator chunk: the animated icon grid, its picks and the follow-icon edits. */
export { defineAnimatedIconGrid, ANIMATED_ICON_GRID_TAG } from './animated-icon-grid';
export { followIcons, iconAnimationFacts } from './follow-icon';
export { pickAnimatedIcon, currentIconPick, currentIconStyle } from './animated-icon-pick';
export { pickCatalogue, pruneCatalogue } from './catalogue-pick';
// icon and part names (namespace 'icon-library', chunk magic-card-i18n-icons.js): loadIconAnimator awaits them
export { ready as iconNamesReady } from '../../../icon-anim/library/i18n';
