/*
 * The lazy chunk dist/magic-card-icon-library.js of the studio bundle: the animated icon library
 * and the bundled MDI path table. Only icon-library-loader.ts imports it (with import()).
 */
export { ICON_LIBRARY, LIBRARY_DOMAINS, searchLibrary } from '../icon-anim/library';
export { BUILD_VERSION as BUILD } from '../utils/build-version';
export { mdiGeometry } from '../icon-anim/mdi-paths';
// the icon and part names (namespace 'icon-library', chunk magic-card-i18n-icons.js): loadIconLibrary awaits them
export { ready as iconNamesReady } from '../icon-anim/library/i18n';
