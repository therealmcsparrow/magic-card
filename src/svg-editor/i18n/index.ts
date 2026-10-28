import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the SVG editor (namespace 'svg-editor', tables in magic-card-svg-editor.js). Write t('svg-editor.<file>.<text>'); the build replaces each key with its table index. */
export const { t, tc, tx, m, locale } = i18nFor(
  'svg-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;
