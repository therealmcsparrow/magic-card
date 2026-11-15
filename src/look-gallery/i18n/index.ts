import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the looks gallery (namespace 'look-gallery', tables in magic-card-look-gallery.js). Write t('look-gallery.<file>.<text>'); the build replaces each key with its table index. */
export const { t } = i18nFor('look-gallery', tables) as unknown as KeyedNamespace<Keys>;
