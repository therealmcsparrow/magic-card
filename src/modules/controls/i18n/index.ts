import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the controls chunk views (namespace 'controls', tables in magic-card-controls.js).
 * Write t('controls.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m } = i18nFor('controls', tables) as unknown as KeyedNamespace<Keys>;
