import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the card (namespace 'card'): write t('card.<file>.<text>'). */
export const { t, tx, m } = i18nFor('card', tables) as unknown as KeyedNamespace<Keys>;
