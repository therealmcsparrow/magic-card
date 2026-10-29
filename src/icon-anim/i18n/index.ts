import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the icon animator (namespace 'icon-animator', tables inline in magic-card-icon-animator.js). Write t('icon-animator.<file>.<text>'); the build replaces each key with its table index. */
export const { t, tx, m, locale } = i18nFor('icon-animator', tables) as unknown as KeyedNamespace<Keys>;
