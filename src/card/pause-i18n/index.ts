import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the pause chunk (namespace 'card-pause', tables in magic-card-pause.js).
 * Write t('card-pause.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m } = i18nFor('card-pause', tables) as unknown as KeyedNamespace<Keys>;
