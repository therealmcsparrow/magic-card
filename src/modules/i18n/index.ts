import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the modules-extra chunk views (namespace 'modules-extra', tables in magic-card-modules-extra.js).
 * Write t('modules-extra.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m } = i18nFor('modules-extra', tables) as unknown as KeyedNamespace<Keys>;
