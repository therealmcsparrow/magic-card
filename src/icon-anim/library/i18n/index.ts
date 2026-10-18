import { i18nForLazy } from '../../../i18n/runtime';

/**
 * Namespace 'icon-library' (contract i18n 1.0.0 r3): icon and part names of the animated icon library.
 * The tables are the lazy chunk magic-card-i18n-icons.js, import()ed by the icon-library chunk and the
 * icon-animator chunk (both compile the library data; one table copy). The names move here in slice I10.
 * Whoever shows a name awaits ready() where it already awaits the library (loadIconLibrary,
 * loadIconAnimator).
 */
export const { t, tc, tx, m, ready } = i18nForLazy('icon-library', () => import(/* webpackChunkName: "i18n-icons" */ './messages.gen'));
