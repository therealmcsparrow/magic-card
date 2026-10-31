import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nForLazy } from '../runtime';
import type { Keys } from './keys.gen';

/**
 * Namespace 'labels' (i18n 1.0.0): editor-only labels, shipped as the lazy chunk magic-card-i18n-labels.js.
 * Never import this from a file magic-card.js carries; write t('labels.<file>.<text>').
 */
export const { t, tx, m, locale, ready } = i18nForLazy('labels', () => import(/* webpackChunkName: "i18n-labels" */ './messages.gen')) as unknown as KeyedNamespace<Keys> &
  Pick<ReturnType<typeof i18nForLazy>, 'ready'>;
