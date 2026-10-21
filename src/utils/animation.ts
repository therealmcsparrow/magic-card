/*
 * The plain helpers that used to live here sit in their own files: src/utils/safe-css.ts and
 * src/utils/trigger.ts. This file only re-exports them, and imports nothing else, so the 17 importers keep working.
 * The animation resolve is src/anim-studio/resolve.ts, the
 * entries and editing helpers src/anim-studio/entries.ts (the lazy `anim` chunk).
 */
export { cssTime, safeColor } from './safe-css';
export { animationTriggerActive } from './trigger';
