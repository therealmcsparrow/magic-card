import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the image import, export and library actions (namespace 'image-transfer', tables in magic-card-image-transfer.js).
 * Write t('image-transfer.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m, locale } = i18nFor('image-transfer', tables) as unknown as KeyedNamespace<Keys>;
