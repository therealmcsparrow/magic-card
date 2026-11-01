import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the status faces (namespace 'card-status', tables in magic-card-status.js). Write t('card-status.<file>.<text>'); the build replaces each key with its table index. */
export const { t } = i18nFor('card-status', tables) as unknown as KeyedNamespace<Keys>;
