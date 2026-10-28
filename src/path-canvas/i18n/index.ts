import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the path canvas (namespace 'path-canvas', tables in magic-card-path-canvas.js). Write t('path-canvas.<file>.<text>'); the build replaces each key with its table index. */
export const { t, tx, m, locale } = i18nFor(
  'path-canvas',
  tables,
) as unknown as KeyedNamespace<Keys>;
