import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the share-kit chunk (namespace 'share-kit', tables in magic-card-share-kit.js).
 * Write t('share-kit.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m, locale } = i18nFor('share-kit', tables) as unknown as KeyedNamespace<Keys>;
