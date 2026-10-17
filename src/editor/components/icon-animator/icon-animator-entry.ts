/*
 * Entry of the lazy editor chunk magic-card-icon-animator.js (loaded by ./loader.ts, which passes the
 * card bundle's modules in): defines <mc-animated-icon-grid> (the icon picker's Animated icons tab),
 * writes its picks (animated-icon-pick.ts) and lets "This icon" animations follow their module's icon
 * (follow-icon.ts). The Design tab's Animate icon panel was removed in 2026.10 (T0.2): splitting an
 * icon and animated SVG export live in the animation studio.
 */
export { defineAnimatedIconGrid, ANIMATED_ICON_GRID_TAG } from './animated-icon-grid';
export { followIcons } from './follow-icon';
export { pickAnimatedIcon, currentIconPick, currentIconStyle } from './animated-icon-pick';
export { pickCatalogue, pruneCatalogue } from './catalogue-pick';
