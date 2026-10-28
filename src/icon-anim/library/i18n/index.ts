import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nForLazy } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';

/**
 * Namespace 'icon-library': icon and part names of the animated icon library.
 * The tables are the lazy chunk magic-card-i18n-icons.js, import()ed by the icon-library chunk and the
 * icon-animator chunk (both compile the library data; one table copy).
 * Whoever shows a name awaits ready() where it already awaits the library (loadIconLibrary,
 * loadIconAnimator). Write t('icon-library.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tc, tx, m, ready } = i18nForLazy('icon-library', () => import(/* webpackChunkName: "i18n-icons" */ './messages.gen')) as unknown as KeyedNamespace<Keys> &
  Pick<ReturnType<typeof i18nForLazy>, 'ready'>;
