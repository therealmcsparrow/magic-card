import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the library image field (namespace 'image-tools', tables in magic-card-image-tools.js). Write
 * t('image-tools.<file>.<text>'); the build replaces each key with its table index, which the second signature accepts.
 */
export const { t, tx, m, locale } = i18nFor('image-tools', tables) as unknown as KeyedNamespace<Keys>;
