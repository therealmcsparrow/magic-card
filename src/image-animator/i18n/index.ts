import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the image animator (namespace 'image-animator', tables in magic-card-image-animator.js). Write t('image-animator.<file>.<text>'); the build replaces each key with its table index. */
export const { t, tx, m, locale } = i18nFor(
  'image-animator',
  tables,
) as unknown as KeyedNamespace<Keys>;
