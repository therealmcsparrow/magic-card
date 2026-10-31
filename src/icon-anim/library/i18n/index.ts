import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nForLazy } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';

// Namespace 'icon-library': icon and part names of the animated icon library, in the lazy chunk magic-card-i18n-icons.js.
// Await ready() where the library is awaited. Write t('icon-library.<file>.<text>').
export const { t, tx, m, ready } = i18nForLazy('icon-library', () => import(/* webpackChunkName: "i18n-icons" */ './messages.gen')) as unknown as KeyedNamespace<Keys> &
  Pick<ReturnType<typeof i18nForLazy>, 'ready'>;
