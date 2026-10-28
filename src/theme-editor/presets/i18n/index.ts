import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the theme preset picker and the preset names (namespace 'theme-presets', tables in magic-card-theme-presets.js). Write t('theme-presets.<file>.<text>'); the build replaces each key with its table index. Mark preset text with m(), render with t(). */
export const { t, tc, tx, m, locale } = i18nFor(
  'theme-presets',
  tables,
) as unknown as KeyedNamespace<Keys>;
