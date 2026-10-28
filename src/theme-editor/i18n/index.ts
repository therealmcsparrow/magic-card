import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the theme editor (namespace 'theme-editor', tables in magic-card-theme-editor.js). Write t('theme-editor.<file>.<text>'); the build replaces each key with its table index. Mark catalogue data with m(). */
export const { t, tx, m, locale } = i18nFor(
  'theme-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;
