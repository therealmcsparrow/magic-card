import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the import and export screens (namespace 'transfer', tables in magic-card-transfer.js). Write
 * t('transfer.<file>.<text>'); the build replaces each key with its table index, which the second signature accepts.
 */
export const { t, tc, tx, m, locale } = i18nFor('transfer', tables) as unknown as KeyedNamespace<Keys>;
